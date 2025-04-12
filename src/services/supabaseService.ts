
import { createClient } from '@supabase/supabase-js';
import { Experience } from '../types/experience';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-placeholder-supabase-url.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-placeholder-supabase-key';

// Console warning for missing credentials
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase credentials. Using placeholder values. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Experiences table operations
export const fetchExperiences = async (): Promise<Experience[]> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*');
    
    if (error) {
      console.error('Error fetching experiences:', error);
      return [];
    }
    
    // Make sure numeric fields are converted properly
    const typedData = data?.map(item => ({
      ...item,
      price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
      maxPeople: typeof item.maxPeople === 'string' ? parseInt(item.maxPeople) : item.maxPeople,
      rating: typeof item.rating === 'string' ? parseFloat(item.rating) : item.rating,
    })) as Experience[];
    
    return typedData || [];
  } catch (error) {
    console.error('Unexpected error fetching experiences:', error);
    return [];
  }
};

export const insertExperience = async (experience: Experience): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('experiences')
      .insert([experience]);
    
    if (error) {
      console.error('Error inserting experience:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error inserting experience:', error);
    return false;
  }
};

export const updateExperienceById = async (experience: Experience): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('experiences')
      .update(experience)
      .eq('id', experience.id);
    
    if (error) {
      console.error('Error updating experience:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error updating experience:', error);
    return false;
  }
};

export const deleteExperienceById = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting experience:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error deleting experience:', error);
    return false;
  }
};

// Import multiple experiences at once
export const importExperiences = async (experiences: Experience[]): Promise<boolean> => {
  try {
    // Ensure data types are correct before inserting
    const validatedExperiences = experiences.map(exp => ({
      ...exp,
      price: typeof exp.price === 'string' ? parseFloat(exp.price) : exp.price,
      maxPeople: typeof exp.maxPeople === 'string' ? parseInt(exp.maxPeople) : exp.maxPeople,
      rating: typeof exp.rating === 'string' ? parseFloat(exp.rating) : exp.rating,
    }));
    
    // Using upsert to replace if exists or insert if not
    const { error } = await supabase
      .from('experiences')
      .upsert(validatedExperiences as any[], { onConflict: 'id' });
    
    if (error) {
      console.error('Error importing experiences:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error importing experiences:', error);
    return false;
  }
};
