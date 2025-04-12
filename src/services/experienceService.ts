
import { Experience } from '../types/experience';
import { experiencesData as initialData } from '../data/experiencesData';
import dataConfig from '../config/dataConfig';
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

// Carica i dati dal file JSON
const loadJsonData = async (): Promise<Experience[]> => {
  try {
    const response = await fetch(dataConfig.jsonFilePath);
    if (!response.ok) {
      console.error('Errore nel caricamento del file JSON:', response.status);
      // Fallback ai dati iniziali
      return ensureNumericValues([...initialData]);
    }
    
    const data = await response.json();
    return ensureNumericValues(data);
  } catch (error) {
    console.error('Errore nel parsing del file JSON:', error);
    // Fallback ai dati iniziali
    return ensureNumericValues([...initialData]);
  }
};

// Get experiences from Supabase or JSON file
export const getExperiences = async (): Promise<Experience[]> => {
  if (dataConfig.mode === 'supabase') {
    try {
      await initializeSchema();
      const supabaseExperiences = await fetchSupabaseExperiences();
      
      if (supabaseExperiences.length > 0) {
        // Update cache
        experiencesCache = ensureNumericValues(supabaseExperiences);
        return experiencesCache;
      } else {
        // If Supabase has no data, try to load from JSON file
        const jsonData = await loadJsonData();
        
        // Initialize Supabase with JSON data
        await importSupabaseExperiences(jsonData);
        
        experiencesCache = jsonData;
        return jsonData;
      }
    } catch (error) {
      console.error('Error fetching from Supabase, falling back to JSON file:', error);
      const jsonData = await loadJsonData();
      experiencesCache = jsonData;
      return jsonData;
    }
  }
  
  // If using JSON mode
  const jsonData = await loadJsonData();
  experiencesCache = jsonData;
  return jsonData;
};

// For backward compatibility, provide a sync version that returns cached data
// or fetches new data if cache is empty
export const getExperiencesSync = (): Experience[] => {
  if (experiencesCache.length > 0) {
    return experiencesCache;
  }
  
  // Trigger async loading and return empty array for now
  // This should be used only when absolutely necessary
  getExperiences().then(() => {
    // Notify components about the update when data is ready
    window.dispatchEvent(new Event('experiencesUpdated'));
  });
  
  return [];
};

// Save experiences
export const saveExperiences = async (experiences: Experience[]): Promise<boolean> => {
  try {
    // Ensure numeric values
    const validatedExperiences = ensureNumericValues(experiences);
    
    // Update in-memory cache
    experiencesCache = [...validatedExperiences];
    
    // Save to the appropriate data store
    if (dataConfig.mode === 'supabase') {
      // Initialize schema first
      await initializeSchema();
      
      // For Supabase, we need to handle each experience individually
      // This is a simplistic approach - in a real app, you might want to batch these operations
      for (const experience of validatedExperiences) {
        await updateExperienceById(experience);
      }
    } 
    // Non usiamo localStorage come richiesto
    
    // Notify components about the update
    window.dispatchEvent(new Event('experiencesUpdated'));
    console.log('Updated experiences:', experiencesCache);
    
    return true;
  } catch (error) {
    console.error('Error saving experiences:', error);
    return false;
  }
};

// Add a new experience
export const addExperience = async (experience: Experience): Promise<boolean> => {
  try {
    // Update local cache
    const experiences = [...experiencesCache];
    experiences.push(experience);
    experiencesCache = experiences;
    
    // Save to Supabase if configured
    if (dataConfig.mode === 'supabase') {
      await initializeSchema();
      await insertExperience(experience);
    }
    
    // Notify components
    window.dispatchEvent(new Event('experiencesUpdated'));
    console.log('Added new experience:', experience);
    
    return true;
  } catch (error) {
    console.error('Error adding experience:', error);
    return false;
  }
};

// Update an existing experience
export const updateExperience = async (experience: Experience): Promise<boolean> => {
  try {
    const experiences = [...experiencesCache];
    const index = experiences.findIndex(exp => exp.id === experience.id);
    
    if (index !== -1) {
      experiences[index] = experience;
      
      // Update in Supabase if configured
      if (dataConfig.mode === 'supabase') {
        await initializeSchema();
        await updateExperienceById(experience);
      }
      
      // Update local cache
      experiencesCache = experiences;
      
      // Notify components
      window.dispatchEvent(new Event('experiencesUpdated'));
      console.log('Updated experience:', experience);
      
      return true;
    } else {
      console.error(`Experience with ID ${experience.id} not found.`);
      return false;
    }
  } catch (error) {
    console.error('Error updating experience:', error);
    return false;
  }
};

// Delete an experience
export const deleteExperience = async (id: string): Promise<boolean> => {
  try {
    const experiences = [...experiencesCache];
    const filteredExperiences = experiences.filter(exp => exp.id !== id);
    
    if (filteredExperiences.length < experiences.length) {
      // Delete from Supabase if configured
      if (dataConfig.mode === 'supabase') {
        await initializeSchema();
        await deleteExperienceById(id);
      }
      
      // Update local cache
      experiencesCache = filteredExperiences;
      
      // Notify components
      window.dispatchEvent(new Event('experiencesUpdated'));
      console.log('Deleted experience with ID:', id);
      
      return true;
    } else {
      console.error(`Experience with ID ${id} not found.`);
      return false;
    }
  } catch (error) {
    console.error('Error deleting experience:', error);
    return false;
  }
};

// Toggle an experience's status (enabled/disabled)
export const toggleExperienceStatus = async (id: string): Promise<boolean> => {
  try {
    const experiences = [...experiencesCache];
    const index = experiences.findIndex(exp => exp.id === id);
    
    if (index !== -1) {
      const updatedExperience = {
        ...experiences[index],
        enabled: !experiences[index].enabled
      };
      
      experiences[index] = updatedExperience;
      
      // Update in Supabase if configured
      if (dataConfig.mode === 'supabase') {
        await initializeSchema();
        await updateExperienceById(updatedExperience);
      }
      
      // Update local cache
      experiencesCache = experiences;
      
      // Notify components
      window.dispatchEvent(new Event('experiencesUpdated'));
      console.log('Toggled experience status:', id, updatedExperience.enabled);
      
      return true;
    } else {
      console.error(`Experience with ID ${id} not found.`);
      return false;
    }
  } catch (error) {
    console.error('Error toggling experience status:', error);
    return false;
  }
};

// Get an experience by ID
export const getExperienceById = async (id: string): Promise<Experience | undefined> => {
  try {
    // Try to get from cache first
    let cachedExperience = experiencesCache.find(exp => exp.id === id);
    
    if (cachedExperience) {
      return cachedExperience;
    }
    
    // If not in cache, try to fetch all experiences (will update cache)
    await getExperiences();
    
    // Now try again from the updated cache
    return experiencesCache.find(exp => exp.id === id);
  } catch (error) {
    console.error(`Error fetching experience with ID ${id}:`, error);
    return undefined;
  }
};

// Synchronous version for backward compatibility
export const getExperienceByIdSync = (id: string): Experience | undefined => {
  return experiencesCache.find(exp => exp.id === id);
};

// Export experiences as JSON string
export const exportExperiencesAsJson = async (): Promise<string> => {
  let experiences: Experience[];
  
  if (experiencesCache.length === 0) {
    experiences = await getExperiences();
  } else {
    experiences = [...experiencesCache];
  }
  
  return JSON.stringify(experiences, null, 2);
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

// Initialize Supabase data if needed
export const initializeSupabaseData = async (): Promise<void> => {
  if (dataConfig.mode === 'supabase') {
    try {
      // Initialize the schema first
      await initializeSchema();
      
      // Check if Supabase has data
      const supabaseExperiences = await fetchSupabaseExperiences();
      
      // If Supabase is empty, load from JSON file
      if (supabaseExperiences.length === 0) {
        const jsonData = await loadJsonData();
        
        if (jsonData.length > 0) {
          console.log('Initializing Supabase with JSON data...');
          await importSupabaseExperiences(jsonData);
        }
      }
    } catch (error) {
      console.error('Error initializing Supabase data:', error);
    }
  }
};
