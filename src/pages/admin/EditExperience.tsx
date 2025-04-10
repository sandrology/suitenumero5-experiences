
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import ExperienceForm from '../../components/admin/ExperienceForm';
import { Experience } from '../../types/experience';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from "@/hooks/use-toast";
import { getExperienceById, updateExperience, DEFAULT_IMAGE } from '../../services/experienceService';

const EditExperience = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const foundExperience = getExperienceById(id);
      
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
    }
    setLoading(false);
  }, [id, navigate, toast, t]);

  const handleUpdateExperience = (experienceData: Partial<Experience>) => {
    if (!experience || !id) return;
    
    const updatedExperience: Experience = {
      ...experience,
      ...experienceData,
      id: id, // Assicuriamo che l'ID rimanga lo stesso
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container-custom py-12 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4">{t('loading')}</p>
          </div>
        </main>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container-custom py-12 flex justify-center items-center">
          <div className="text-center">
            <p className="text-xl text-red-500">{t('experienceNotFound')}</p>
            <button 
              className="mt-4 btn-primary"
              onClick={() => navigate('/admin')}
            >
              {t('backToAdmin')}
            </button>
          </div>
        </main>
      </div>
    );
  }

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
