
import { Experience } from '../data/mockExperiences';

// Storage key for saving experiences in localStorage
export const STORAGE_KEY = 'experiences_data';

// Default image for experiences
export const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=500";

// Retrieve experiences from localStorage
export const getExperiences = (): Experience[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  } catch (error) {
    console.error('Error loading experiences from localStorage:', error);
    return [];
  }
};

// Save experiences to localStorage and dispatch an event to update other tabs/components
export const saveExperiences = (experiences: Experience[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(experiences));
    
    // Dispatch both a storage event for other tabs and a custom event for the same tab
    window.dispatchEvent(new Event('experiencesUpdated'));
    
    // Log the current state after saving
    console.log('Saved experiences to localStorage:', experiences);
  } catch (error) {
    console.error('Error saving experiences to localStorage:', error);
  }
};

// Initialize localStorage with sample data if empty
export const initializeExperiences = (mockData: Experience[]): Experience[] => {
  const currentData = getExperiences();
  
  // If there's no data in localStorage, initialize with mock data
  if (currentData.length === 0) {
    saveExperiences(mockData);
    return mockData;
  }
  
  return currentData;
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
