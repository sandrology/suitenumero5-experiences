import { Experience } from '../types/experience';
import { experiencesData as initialData } from '../data/experiencesData';
import { 
  supabase,
  fetchExperiences as fetchSupabaseExperiences,
  insertExperience,
  updateExperienceById,
  deleteExperienceById,
  importExperiences as importSupabaseExperiences,
  initializeSchema
} from './supabaseService';

// Default image for experiences
export const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=500";

// Configuration to determine which data store to use
export const CONFIG = {
  // Set to 'supabase' to use Supabase, 'local' for localStorage
  dataStore: 'supabase'
};

// In-memory storage to cache experiences
let experiencesCache: Experience[] = [];

// Utility function to ensure numeric values
const ensureNumericValues = (experiences: any[]): Experience[] => {
  return experiences.map(exp => ({
    ...exp,
    price: typeof exp.price === 'string' ? parseFloat(exp.price) || 0 : Number(exp.price),
    maxPeople: typeof exp.maxPeople === 'string' ? parseInt(exp.maxPeople) || 0 : Number(exp.maxPeople),
    rating: typeof exp.rating === 'string' ? parseFloat(exp.rating) || 0 : Number(exp.rating),
    reviews: Array.isArray(exp.reviews) ? exp.reviews : []
  })) as Experience[];
};

// Initialize the in-memory storage with initial data from localStorage
const initializeInMemoryStorage = (): Experience[] => {
  if (experiencesCache.length === 0) {
    try {
      // Check if there are data in localStorage
      const storedData = localStorage.getItem('experiences');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        experiencesCache = ensureNumericValues(parsedData);
      } else {
        experiencesCache = ensureNumericValues([...initialData]);
        // Save to localStorage immediately
        localStorage.setItem('experiences', JSON.stringify(experiencesCache));
      }
    } catch (error) {
      console.error('Error initializing data:', error);
      experiencesCache = [];
    }
  }
  return experiencesCache;
};

// Get experiences from Supabase or localStorage
export const getExperiences = async (): Promise<Experience[]> => {
  if (CONFIG.dataStore === 'supabase') {
    try {
      const supabaseExperiences = await fetchSupabaseExperiences();
      if (supabaseExperiences.length > 0) {
        // Update cache
        experiencesCache = ensureNumericValues(supabaseExperiences);
        return experiencesCache;
      } else {
        // If Supabase has no data, try to load from localStorage or initial data
        return initializeInMemoryStorage();
      }
    } catch (error) {
      console.error('Error fetching from Supabase, falling back to local storage:', error);
      return initializeInMemoryStorage();
    }
  }
  
  // If not using Supabase, use localStorage
  return initializeInMemoryStorage();
};

// For backward compatibility, provide a sync version that returns cached data
// or fetches new data if cache is empty
export const getExperiencesSync = (): Experience[] => {
  if (experiencesCache.length > 0) {
    return experiencesCache;
  }
  
  // Initialize from localStorage if cache is empty
  return initializeInMemoryStorage();
};

// Save experiences to Supabase or localStorage
export const saveExperiences = async (experiences: Experience[]): Promise<void> => {
  try {
    // Ensure numeric values
    const validatedExperiences = ensureNumericValues(experiences);
    
    // Update in-memory cache
    experiencesCache = [...validatedExperiences];
    
    // Save to the appropriate data store
    if (CONFIG.dataStore === 'supabase') {
      // For Supabase, we need to handle each experience individually
      // This is a simplistic approach - in a real app, you might want to batch these operations
      for (const experience of validatedExperiences) {
        await updateExperienceById(experience);
      }
    } else {
      // Save to localStorage
      localStorage.setItem('experiences', JSON.stringify(experiencesCache));
    }
    
    // Dispatch an event to notify components about the update
    window.dispatchEvent(new Event('experiencesUpdated'));
    
    console.log('Updated experiences:', experiencesCache);
  } catch (error) {
    console.error('Error saving experiences:', error);
  }
};

// Add a new experience
export const addExperience = async (experience: Experience): Promise<void> => {
  try {
    if (CONFIG.dataStore === 'supabase') {
      await insertExperience(experience);
    }
    
    // Update local cache
    const experiences = getExperiencesSync();
    experiences.push(experience);
    
    if (CONFIG.dataStore === 'local') {
      localStorage.setItem('experiences', JSON.stringify(experiences));
    }
    
    experiencesCache = experiences;
    
    // Notify components
    window.dispatchEvent(new Event('experiencesUpdated'));
    console.log('Added new experience:', experience);
  } catch (error) {
    console.error('Error adding experience:', error);
  }
};

// Update an existing experience
export const updateExperience = async (experience: Experience): Promise<void> => {
  try {
    const experiences = getExperiencesSync();
    const index = experiences.findIndex(exp => exp.id === experience.id);
    
    if (index !== -1) {
      experiences[index] = experience;
      
      // Update in Supabase if configured
      if (CONFIG.dataStore === 'supabase') {
        await updateExperienceById(experience);
      }
      
      // Update local cache and localStorage
      experiencesCache = experiences;
      
      if (CONFIG.dataStore === 'local') {
        localStorage.setItem('experiences', JSON.stringify(experiences));
      }
      
      // Notify components
      window.dispatchEvent(new Event('experiencesUpdated'));
      console.log('Updated experience:', experience);
    } else {
      console.error(`Experience with ID ${experience.id} not found.`);
    }
  } catch (error) {
    console.error('Error updating experience:', error);
  }
};

// Delete an experience
export const deleteExperience = async (id: string): Promise<void> => {
  try {
    const experiences = getExperiencesSync();
    const filteredExperiences = experiences.filter(exp => exp.id !== id);
    
    if (filteredExperiences.length < experiences.length) {
      // Delete from Supabase if configured
      if (CONFIG.dataStore === 'supabase') {
        await deleteExperienceById(id);
      }
      
      // Update local cache and localStorage
      experiencesCache = filteredExperiences;
      
      if (CONFIG.dataStore === 'local') {
        localStorage.setItem('experiences', JSON.stringify(filteredExperiences));
      }
      
      // Notify components
      window.dispatchEvent(new Event('experiencesUpdated'));
      console.log('Deleted experience with ID:', id);
    } else {
      console.error(`Experience with ID ${id} not found.`);
    }
  } catch (error) {
    console.error('Error deleting experience:', error);
  }
};

// Toggle an experience's status (enabled/disabled)
export const toggleExperienceStatus = async (id: string): Promise<void> => {
  try {
    const experiences = getExperiencesSync();
    const index = experiences.findIndex(exp => exp.id === id);
    
    if (index !== -1) {
      const updatedExperience = {
        ...experiences[index],
        enabled: !experiences[index].enabled
      };
      
      experiences[index] = updatedExperience;
      
      // Update in Supabase if configured
      if (CONFIG.dataStore === 'supabase') {
        await updateExperienceById(updatedExperience);
      }
      
      // Update local cache and localStorage
      experiencesCache = experiences;
      
      if (CONFIG.dataStore === 'local') {
        localStorage.setItem('experiences', JSON.stringify(experiences));
      }
      
      // Notify components
      window.dispatchEvent(new Event('experiencesUpdated'));
      console.log('Toggled experience status:', id, updatedExperience.enabled);
    } else {
      console.error(`Experience with ID ${id} not found.`);
    }
  } catch (error) {
    console.error('Error toggling experience status:', error);
  }
};

// Get an experience by ID
export const getExperienceById = async (id: string): Promise<Experience | undefined> => {
  try {
    if (CONFIG.dataStore === 'supabase') {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !data) {
        console.error(`Error fetching experience with ID ${id}:`, error);
        // Try local cache as fallback
        const cachedExperiences = getExperiencesSync();
        return cachedExperiences.find(exp => exp.id === id);
      }
      
      return data;
    }
    
    // If not using Supabase, use local cache
    const experiences = getExperiencesSync();
    return experiences.find(exp => exp.id === id);
  } catch (error) {
    console.error(`Error fetching experience with ID ${id}:`, error);
    return undefined;
  }
};

// Synchronous version for backward compatibility
export const getExperienceByIdSync = (id: string): Experience | undefined => {
  const experiences = getExperiencesSync();
  return experiences.find(exp => exp.id === id);
};

// Export experiences as JSON string
export const exportExperiencesAsJson = async (): Promise<string> => {
  let experiences: Experience[];
  
  if (CONFIG.dataStore === 'supabase') {
    experiences = await getExperiences();
  } else {
    experiences = getExperiencesSync();
  }
  
  return JSON.stringify(experiences, null, 2);
};

// Import experiences from JSON string
export const importExperiencesFromJson = async (jsonString: string): Promise<boolean> => {
  try {
    const parsedData = JSON.parse(jsonString);
    
    if (!Array.isArray(parsedData)) {
      throw new Error('Invalid format: expected an array of experiences');
    }
    
    // Validate and normalize each experience - ensure we explicitly cast as Experience[] after conversion
    const experiences: Experience[] = parsedData.map(exp => {
      if (!exp.id || !exp.translations || !exp.translations.en || !exp.translations.it) {
        throw new Error('Invalid experience format: missing required fields');
      }
      
      // Ensure numeric values are properly converted
      return {
        ...exp,
        price: typeof exp.price === 'string' ? parseFloat(exp.price) || 0 : Number(exp.price),
        maxPeople: typeof exp.maxPeople === 'string' ? parseInt(exp.maxPeople) || 0 : Number(exp.maxPeople),
        rating: typeof exp.rating === 'string' ? parseFloat(exp.rating) || 0 : Number(exp.rating),
        reviews: Array.isArray(exp.reviews) ? exp.reviews : []
      };
    }) as Experience[];
    
    // Import to Supabase if configured
    if (CONFIG.dataStore === 'supabase') {
      const success = await importSupabaseExperiences(experiences);
      if (!success) {
        return false;
      }
    }
    
    // Update local cache
    experiencesCache = experiences;
    
    // Update localStorage if using local storage
    if (CONFIG.dataStore === 'local') {
      localStorage.setItem('experiences', JSON.stringify(experiences));
    }
    
    // Notify components
    window.dispatchEvent(new Event('experiencesUpdated'));
    
    return true;
  } catch (error) {
    console.error('Error importing experiences:', error);
    return false;
  }
};

// Prepare content for display, handling bullet points
export const formatContent = (content: string): string => {
  if (!content) return '';
  
  // Handle HTML content directly if it contains HTML tags
  if (content.includes('<ul>') || content.includes('<ol>')) {
    return content;
  }
  
  // Altrimenti processiamo il testo normale riga per riga
  const lines = content.split('\n');
  let formattedContent = '';
  let inList = false;
  
  // Process content line by line
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Check if the line is a list item
    if (line.startsWith('* ') || line.startsWith('- ')) {
      // If not already in a list, open a <ul> tag
      if (!inList) {
        formattedContent += '<ul>';
        inList = true;
      }
      
      // Remove the marker and add the <li> tag
      line = line.replace(/^[*-]\s/, '');
      formattedContent += `<li>${line}</li>`;
    } else if (line.match(/^\d+\.\s/) || line.match(/^\d+\)\s/)) {
      // If it's a numbered list
      // If not already in a list, open an <ol> tag
      if (!inList) {
        formattedContent += '<ol>';
        inList = true;
      }
      
      // Remove the marker and add the <li> tag
      line = line.replace(/^\d+[\.\)]\s/, '');
      formattedContent += `<li>${line}</li>`;
    } else {
      // If not a list item but were in a list, close the list
      if (inList) {
        formattedContent += inList ? '</ul>' : '</ol>';
        inList = false;
      }
      
      // Add the normal line with break
      if (line) {
        formattedContent += line + '<br>';
      } else {
        formattedContent += '<br>';
      }
    }
  }
  
  // If we're still in a list at the end, close it
  if (inList) {
    formattedContent += '</ul>';
  }
  
  return formattedContent;
};

// Initialize data from Supabase if not already populated
export const initializeSupabaseData = async (): Promise<void> => {
  if (CONFIG.dataStore === 'supabase') {
    try {
      // Initialize the schema first
      await initializeSchema();
      
      // Check if Supabase has data
      const supabaseExperiences = await fetchSupabaseExperiences();
      
      // If Supabase is empty but we have local data, push it to Supabase
      if (supabaseExperiences.length === 0) {
        const localExperiences = initializeInMemoryStorage();
        
        if (localExperiences.length > 0) {
          console.log('Initializing Supabase with local data...');
          // Make sure we're passing an array that strictly conforms to Experience[]
          await importSupabaseExperiences(localExperiences);
        } else {
          // If no local data either, use initial data
          console.log('Initializing Supabase with default data...');
          // Make sure we're passing an array that strictly conforms to Experience[]
          const typedInitialData = ensureNumericValues(initialData);
          await importSupabaseExperiences(typedInitialData);
        }
      }
    } catch (error) {
      console.error('Error initializing Supabase data:', error);
    }
  }
};
