
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import ExperienceForm from '../../components/admin/ExperienceForm';
import { Experience } from '../../data/mockExperiences';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from "@/hooks/use-toast";
import { getExperiences, updateExperience, DEFAULT_IMAGE } from '../../services/experienceService';

const EditExperience = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [experience, setExperience] = useState<Experience | null>(null);
  
  useEffect(() => {
    const experiences = getExperiences();
    const foundExperience = experiences.find(exp => exp.id === id);
    
    if (!foundExperience) {
      toast({
        title: t('experienceNotFound'),
        description: t('experienceNotFoundDesc'),
        variant: "destructive"
      });
      navigate('/admin');
    } else {
      setExperience(foundExperience);
    }
  }, [id, navigate, toast, t]);

  const handleUpdateExperience = (experienceData: Partial<Experience>) => {
    if (!experience) return;
    
    const updatedExperience: Experience = {
      ...experience,
      ...experienceData,
      images: experienceData.images?.length ? experienceData.images : [DEFAULT_IMAGE],
    };
    
    // Aggiorna nel localStorage
    updateExperience(updatedExperience);
    
    toast({
      title: t('experienceUpdated'),
      description: t('experienceUpdatedDesc'),
    });
    
    // Redirect to admin dashboard
    navigate('/admin');
  };

  if (!experience) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container-custom py-12">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="heading-lg mb-6">{t('editExperience')}</h1>
          <ExperienceForm 
            experience={experience} 
            onSubmit={handleUpdateExperience} 
          />
        </div>
      </main>
    </div>
  );
};

export default EditExperience;
