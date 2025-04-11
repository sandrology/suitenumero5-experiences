
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

// Initialize the in-memory storage with initial data
const initializeInMemoryStorage = () => {
  if (experiencesData.length === 0) {
    try {
      // Prima verifichiamo se ci sono dati nel localStorage
      const storedData = localStorage.getItem('experiences');
      if (storedData) {
        experiencesData = JSON.parse(storedData);
      } else {
        experiencesData = [...initialData];
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
    // Update in-memory storage
    experiencesData = [...experiences];
    
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
  
  // Mantieni gli a capo e converti le liste puntate con * in HTML
  let formattedContent = content
    .replace(/\n\* /g, '\n<li>')
    .replace(/\n\*/g, '\n<li>')
    .replace(/\n- /g, '\n<li>')
    .replace(/\n-/g, '\n<li>');
    
  // Se ci sono <li> aggiungi i tag <ul> e </ul>
  if (formattedContent.includes('<li>')) {
    formattedContent = formattedContent.replace(/(<li>.*?)(\n\n|\n(?!\s*<li>)|$)/gs, '<ul>$1</ul>$2');
    formattedContent = formattedContent.replace(/<li>(.*?)(?=<li>|<\/ul>)/g, '<li>$1</li>');
  }
  
  // Converti i \n rimanenti in <br>
  formattedContent = formattedContent.replace(/\n/g, '<br>');
  
  return formattedContent;
};
