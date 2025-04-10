
import { Experience } from '../types/experience';
import { experiencesData as initialData } from '../data/experiencesData';

// Default image for experiences
export const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=500";

// In-memory storage to simulate file storage
let experiencesData: Experience[] = [];

// Initialize the in-memory storage with initial data
const initializeInMemoryStorage = () => {
  if (experiencesData.length === 0) {
    try {
      experiencesData = [...initialData];
    } catch (error) {
      console.error('Error initializing data:', error);
      experiencesData = [];
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
