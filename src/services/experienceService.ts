
import { Experience } from '../data/mockExperiences';

// Chiave per salvare le esperienze nel localStorage
const STORAGE_KEY = 'experiences_data';

// Recupera le esperienze dal localStorage o usa i mock come fallback
export const getExperiences = (): Experience[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading experiences from localStorage:', error);
    return [];
  }
};

// Salva le esperienze nel localStorage
export const saveExperiences = (experiences: Experience[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(experiences));
  } catch (error) {
    console.error('Error saving experiences to localStorage:', error);
  }
};

// Inizializza il localStorage con i dati di esempio se vuoto
export const initializeExperiences = (mockData: Experience[]): Experience[] => {
  const currentData = getExperiences();
  if (currentData.length === 0) {
    saveExperiences(mockData);
    return mockData;
  }
  return currentData;
};

// Aggiungi una nuova esperienza
export const addExperience = (experience: Experience): void => {
  const experiences = getExperiences();
  experiences.push(experience);
  saveExperiences(experiences);
};

// Aggiorna un'esperienza esistente
export const updateExperience = (experience: Experience): void => {
  const experiences = getExperiences();
  const index = experiences.findIndex(exp => exp.id === experience.id);
  if (index !== -1) {
    experiences[index] = experience;
    saveExperiences(experiences);
  }
};

// Elimina un'esperienza
export const deleteExperience = (id: string): void => {
  const experiences = getExperiences();
  const filteredExperiences = experiences.filter(exp => exp.id !== id);
  saveExperiences(filteredExperiences);
};

// Cambia lo stato di un'esperienza (abilitata/disabilitata)
export const toggleExperienceStatus = (id: string): void => {
  const experiences = getExperiences();
  const index = experiences.findIndex(exp => exp.id === id);
  if (index !== -1) {
    experiences[index].enabled = !experiences[index].enabled;
    saveExperiences(experiences);
  }
};

// Immagine di default per le esperienze
export const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=500";
