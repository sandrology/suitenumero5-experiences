
import { Experience } from '../types/experience';
import { mockExperiences } from '../data/mockExperiences';

// Default image for experiences
export const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=500";

// Storage key for the application state
export const STORAGE_KEY = 'experiences_data';

// In-memory storage to simulate file storage
let experiencesData: Experience[] = [];

// Initialize the in-memory storage with mock data if it's empty
const initializeInMemoryStorage = () => {
  if (experiencesData.length === 0) {
    try {
      // Try to get data from localStorage first (for backwards compatibility)
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        experiencesData = JSON.parse(saved);
      } else {
        // If no localStorage data, use mock data
        experiencesData = [...mockExperiences];
      }
    } catch (error) {
      console.error('Error initializing data:', error);
      experiencesData = [...mockExperiences];
    }
  }
  return experiencesData;
};

// Get experiences from the in-memory storage
export const getExperiences = (): Experience[] => {
  return initializeInMemoryStorage();
};

// Save experiences to in-memory storage and notify components
export const saveExperiences = (experiences: Experience[]): void => {
  try {
    // Update in-memory storage
    experiencesData = [...experiences];
    
    // For backwards compatibility, also save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(experiencesData));
    
    // Dispatch an event to notify components about the update
    window.dispatchEvent(new Event('experiencesUpdated'));
    
    console.log('Saved experiences to data file:', experiencesData);
  } catch (error) {
    console.error('Error saving experiences:', error);
  }
};

// Initialize experiences from mock data if needed
export const initializeExperiences = (mockData: Experience[]): Experience[] => {
  if (experiencesData.length === 0) {
    experiencesData = [...mockData];
    saveExperiences(experiencesData);
  }
  return experiencesData;
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
