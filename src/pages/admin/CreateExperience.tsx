
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../../components/layout/Navbar';
import ExperienceForm from '../../components/admin/ExperienceForm';
import { Experience } from '../../data/mockExperiences';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from "@/hooks/use-toast";
import { addExperience, DEFAULT_IMAGE } from '../../services/experienceService';

const CreateExperience = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateExperience = (experienceData: Partial<Experience>) => {
    // Crea una nuova esperienza con un ID univoco
    const newExperience: Experience = {
      id: uuidv4(),
      enabled: experienceData.enabled ?? true,
      images: experienceData.images?.length ? experienceData.images : [DEFAULT_IMAGE],
      translations: experienceData.translations!,
      price: experienceData.price ?? 0,
      duration: experienceData.duration ?? '',
      location: experienceData.location ?? '',
      rating: experienceData.rating ?? 5.0,
      maxPeople: experienceData.maxPeople ?? 10,
    };
    
    // Salva nel localStorage
    addExperience(newExperience);
    
    toast({
      title: t('experienceCreated'),
      description: t('experienceCreatedDesc'),
    });
    
    // Redirect to admin dashboard
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container-custom py-12">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="heading-lg mb-6">{t('createExperience')}</h1>
          <ExperienceForm onSubmit={handleCreateExperience} />
        </div>
      </main>
    </div>
  );
};

export default CreateExperience;
