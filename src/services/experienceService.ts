
import { Experience } from '../types/experience';
import { experiencesData as initialData } from '../data/experiencesData';

// Default image for experiences
export const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=500";

// Configurazione per determinare il data store da utilizzare
export const CONFIG = {
  // Impostato su 'local' per ora, in futuro potrà essere 'supabase'
  dataStore: 'local'
};

// In-memory storage to simulate file storage
let experiencesData: Experience[] = [];

// Utility function to ensure numeric values
const ensureNumericValues = (experiences: any[]): Experience[] => {
  return experiences.map(exp => ({
    ...exp,
    price: typeof exp.price === 'string' ? parseFloat(exp.price) || 0 : exp.price,
    maxPeople: typeof exp.maxPeople === 'string' ? parseInt(exp.maxPeople) || 0 : exp.maxPeople,
    rating: typeof exp.rating === 'string' ? parseFloat(exp.rating) || 0 : exp.rating,
  }));
};

// Initialize the in-memory storage with initial data
const initializeInMemoryStorage = () => {
  if (experiencesData.length === 0) {
    try {
      // Prima verifichiamo se ci sono dati nel localStorage
      const storedData = localStorage.getItem('experiences');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        experiencesData = ensureNumericValues(parsedData);
      } else {
        experiencesData = ensureNumericValues([...initialData]);
        // Salva subito nel localStorage
        localStorage.setItem('experiences', JSON.stringify(experiencesData));
      }
    } catch (error) {
      console.error('Error initializing data:', error);
      experiencesData = [];
    }
  }
  return experiencesData;
};

// Get experiences from the in-memory storage or Supabase
export const getExperiences = (): Experience[] => {
  // Per ora usiamo solo il local storage
  if (CONFIG.dataStore === 'local') {
    return initializeInMemoryStorage();
  }
  // In futuro questo potrebbe essere una chiamata a Supabase
  return initializeInMemoryStorage();
};

// Save experiences to storage and notify components
export const saveExperiences = (experiences: Experience[]): void => {
  try {
    // Ensure numeric values
    const validatedExperiences = ensureNumericValues(experiences);
    
    // Update in-memory storage
    experiencesData = [...validatedExperiences];
    
    // Salva nel localStorage
    localStorage.setItem('experiences', JSON.stringify(experiencesData));
    
    // Dispatch an event to notify components about the update
    window.dispatchEvent(new Event('experiencesUpdated'));
    
    console.log('Updated experiences in memory:', experiencesData);
  } catch (error) {
    console.error('Error saving experiences:', error);
  }
};

// Add a new experience
export const addExperience = (experience: Experience): void => {
  const experiences = getExperiences();
  experiences.push(experience);
  saveExperiences(experiences);
  console.log('Added new experience:', experience);
};

// Update an existing experience
export const updateExperience = (experience: Experience): void => {
  const experiences = getExperiences();
  const index = experiences.findIndex(exp => exp.id === experience.id);
  if (index !== -1) {
    experiences[index] = experience;
    saveExperiences(experiences);
    console.log('Updated experience:', experience);
  } else {
    console.error(`Experience with ID ${experience.id} not found.`);
  }
};

// Delete an experience
export const deleteExperience = (id: string): void => {
  const experiences = getExperiences();
  const filteredExperiences = experiences.filter(exp => exp.id !== id);
  if (filteredExperiences.length < experiences.length) {
    saveExperiences(filteredExperiences);
    console.log('Deleted experience with ID:', id);
  } else {
    console.error(`Experience with ID ${id} not found.`);
  }
};

// Toggle an experience's status (enabled/disabled)
export const toggleExperienceStatus = (id: string): void => {
  const experiences = getExperiences();
  const index = experiences.findIndex(exp => exp.id === id);
  if (index !== -1) {
    experiences[index].enabled = !experiences[index].enabled;
    saveExperiences(experiences);
    console.log('Toggled experience status:', id, experiences[index].enabled);
  } else {
    console.error(`Experience with ID ${id} not found.`);
  }
};

// Get an experience by ID
export const getExperienceById = (id: string): Experience | undefined => {
  const experiences = getExperiences();
  return experiences.find(exp => exp.id === id);
};

// Export experiences as JSON string
export const exportExperiencesAsJson = (): string => {
  return JSON.stringify(experiencesData, null, 2);
};

// Prepara un contenuto per la visualizzazione, gestendo gli elenchi puntati
export const formatContent = (content: string): string => {
  if (!content) return '';
  
  // Salviamo gli a capo originali
  const lines = content.split('\n');
  let formattedContent = '';
  let inList = false;
  
  // Processiamo il contenuto riga per riga
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Controlla se la riga è un elemento di lista
    if (line.startsWith('* ') || line.startsWith('- ')) {
      // Se non siamo già in una lista, apriamo un tag <ul>
      if (!inList) {
        formattedContent += '<ul>';
        inList = true;
      }
      
      // Rimuovi il marker e aggiungi il tag <li>
      line = line.replace(/^[*-]\s/, '');
      formattedContent += `<li>${line}</li>`;
    } else {
      // Se non è un elemento di lista ma eravamo in una lista, chiudiamo la lista
      if (inList) {
        formattedContent += '</ul>';
        inList = false;
      }
      
      // Aggiungi la riga normale con break
      if (line) {
        formattedContent += line + '<br>';
      } else {
        formattedContent += '<br>';
      }
    }
  }
  
  // Se siamo ancora in una lista alla fine, chiudiamola
  if (inList) {
    formattedContent += '</ul>';
  }
  
  return formattedContent;
};
