
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import ExperienceForm from '../../components/admin/ExperienceForm';
import { Experience } from '../../data/mockExperiences';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from "@/hooks/use-toast";

const CreateExperience = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateExperience = (experienceData: Partial<Experience>) => {
    // In a real app, this would be an API call
    console.log('Creating experience with data:', experienceData);
    
    toast({
      title: "Experience Created",
      description: "The experience has been created successfully."
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
