
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ExperienceDetail from '../components/experiences/ExperienceDetail';
import { Experience } from '../data/mockExperiences';
import { useToast } from "@/hooks/use-toast";
import { getExperiences } from '../services/experienceService';

const ExperiencePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [experience, setExperience] = useState<Experience | null>(null);
  
  useEffect(() => {
    const experiences = getExperiences();
    const foundExperience = experiences.find(exp => exp.id === id);
    
    if (!foundExperience) {
      toast({
        title: "Experience Not Found",
        description: "The experience you're looking for doesn't exist.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    if (!foundExperience.enabled) {
      toast({
        title: "Experience Not Available",
        description: "This experience is currently not available.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    setExperience(foundExperience);
  }, [id, navigate, toast]);

  if (!experience) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container-custom py-12">
        <ExperienceDetail experience={experience} />
      </main>
      
      <Footer />
    </div>
  );
};

export default ExperiencePage;
