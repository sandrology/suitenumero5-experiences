
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import ExperienceForm from '../../components/admin/ExperienceForm';
import { mockExperiences, Experience } from '../../data/mockExperiences';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from "@/hooks/use-toast";

const EditExperience = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const experience = mockExperiences.find(exp => exp.id === id);
  
  // If the experience doesn't exist, redirect to admin dashboard
  React.useEffect(() => {
    if (!experience) {
      toast({
        title: "Experience Not Found",
        description: "The experience you're trying to edit doesn't exist.",
        variant: "destructive"
      });
      navigate('/admin');
    }
  }, [experience, navigate, toast]);

  const handleUpdateExperience = (experienceData: Partial<Experience>) => {
    // In a real app, this would be an API call
    console.log('Updating experience with data:', experienceData);
    
    toast({
      title: "Experience Updated",
      description: "The experience has been updated successfully."
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
