
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ExperienceDetail from '../components/experiences/ExperienceDetail';
import { Experience, Review } from '../types/experience';
import { getExperienceById, formatContent } from '../services/experienceService';
import ReviewsList from '../components/experiences/ReviewsList';
import { addReview, getReviews } from '../services/reviewService';
import { useToast } from '@/hooks/use-toast';

const ExperiencePage = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  useEffect(() => {
    if (id) {
      // Carica l'esperienza
      const foundExperience = getExperienceById(id);
      
      if (foundExperience) {
        setExperience(foundExperience);
        
        // Carica le recensioni
        const experienceReviews = [...foundExperience.reviews, ...getReviews(id)];
        setReviews(experienceReviews);
      }
      
      setLoading(false);
    }
  }, [id]);
  
  const handleReviewAdded = (newReview: Review) => {
    if (id) {
      // Aggiungi la recensione
      const success = addReview(id, newReview);
      
      if (success) {
        // Aggiorna lo stato locale
        setReviews(prevReviews => [...prevReviews, newReview]);
        
        // Aggiorna anche l'esperienza locale se necessario
        if (experience) {
          setExperience({
            ...experience,
            reviews: [...experience.reviews, newReview]
          });
        }
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add the review',
          variant: 'destructive',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="heading-lg text-gray-800 mb-4">Experience not found</h2>
            <p className="text-gray-600">The experience you're looking for does not exist or has been removed.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentLanguageData = experience.translations[language];
  const formattedContent = formatContent(currentLanguageData.content);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-12">
        <ExperienceDetail 
          experience={experience}
          formattedContent={formattedContent}
        />
        
        <div className="container-custom">
          <ReviewsList 
            reviews={reviews} 
            experienceId={id || ''}
            onReviewAdded={handleReviewAdded}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ExperiencePage;
