
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ExperienceDetail from '../components/experiences/ExperienceDetail';
import { mockExperiences } from '../data/mockExperiences';
import { useToast } from "@/hooks/use-toast";

const ExperiencePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const experience = mockExperiences.find(exp => exp.id === id);
  
  // If the experience doesn't exist or is disabled, show an error
  React.useEffect(() => {
    if (!experience) {
      toast({
        title: "Experience Not Found",
        description: "The experience you're looking for doesn't exist.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    if (!experience.enabled) {
      toast({
        title: "Experience Not Available",
        description: "This experience is currently not available.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
  }, [experience, navigate, toast]);

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
