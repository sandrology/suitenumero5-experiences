
import { createClient } from '@supabase/supabase-js';
import { Experience } from '../types/experience';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
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
    
    return data || [];
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
    // Using upsert to replace if exists or insert if not
    const { error } = await supabase
      .from('experiences')
      .upsert(experiences, { onConflict: 'id' });
    
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
