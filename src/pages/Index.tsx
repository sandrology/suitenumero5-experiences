import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ExperienceCard from '../components/experiences/ExperienceCard';
import { Experience } from '../types/experience';
import { useLanguage } from '../context/LanguageContext';
import { getExperiences } from '../services/experienceService';

const Index = () => {
  const { t } = useLanguage();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to load experiences from in-memory storage
  const loadExperiences = () => {
    const loadedExperiences = getExperiences();
    setExperiences(loadedExperiences);
    setLoading(false);
    console.log('Home loaded experiences:', loadedExperiences);
  };

  useEffect(() => {
    // Load experiences initially
    loadExperiences();
    
    // Add event listeners for custom event
    const handleExperiencesUpdated = () => {
      console.log('Experiences updated event detected in Home');
      loadExperiences();
    };
    
    // Listen for custom events
    window.addEventListener('experiencesUpdated', handleExperiencesUpdated);
    
    return () => {
      window.removeEventListener('experiencesUpdated', handleExperiencesUpdated);
    };
  }, []);

  // Filter enabled experiences for the home page
  const featuredExperiences = experiences.filter(exp => exp.enabled).slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-primary relative">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container-custom py-20 md:py-32 relative z-10 text-center">
          <h1 className="heading-xl text-white mb-6">
            {t('discover')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8">
            {t('discoverSubtitle')}
          </p>
          <Link to="/#featured" className="btn-accent inline-flex items-center px-6 py-3 text-lg">
            <span>{t('experiences')}</span>
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Featured Experiences */}
      <div id="featured" className="container-custom py-16 md:py-24">
        <div className="flex justify-between items-center mb-8">
          <h2 className="heading-lg">{t('featuredExperiences')}</h2>
          <div className="text-sm text-gray-500">
            {loading ? (
              <span>{t('loading')}</span>
            ) : (
              <span>{featuredExperiences.length} {t('experiencesAvailable')}</span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredExperiences.length > 0 ? (
              featuredExperiences.map(experience => (
                <ExperienceCard key={experience.id} experience={experience} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">{t('noExperiences')}</p>
                <Link to="/admin" className="btn-primary mt-4 inline-block">
                  {t('goToAdmin')}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16 md:py-24">
        <div className="container-custom">
          <h2 className="heading-lg text-center mb-12">{t('whyChooseUs')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="rounded-full bg-primary/10 p-4 inline-flex items-center justify-center mb-4 w-16 h-16">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{t('uniqueExperiences')}</h3>
              <p className="text-gray-600">
                {t('uniqueExperiencesDesc')}
              </p>
            </div>
            
            <div className="p-6">
              <div className="rounded-full bg-primary/10 p-4 inline-flex items-center justify-center mb-4 w-16 h-16">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{t('localGuides')}</h3>
              <p className="text-gray-600">
                {t('localGuidesDesc')}
              </p>
            </div>
            
            <div className="p-6">
              <div className="rounded-full bg-primary/10 p-4 inline-flex items-center justify-center mb-4 w-16 h-16">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                  <path d="M12.75 3.04c.251.015.461.184.537.414L14.5 8.5l5.01.88c.222.04.383.23.398.452a.48.48 0 0 1-.137.405l-3.96 3.86.94 5.46a.486.486 0 0 1-.716.51L11.5 17.72l-4.538 2.39a.489.489 0 0 1-.716-.51l.937-5.46-3.96-3.86a.48.48 0 0 1-.138-.405.487.487 0 0 1 .398-.452l5.01-.88 1.213-5.046a.489.489 0 0 1 .924-.036l.717 2.23" />
                  <path d="M17.5 9.5 21 13l-3.5 3.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{t('excellenceGuaranteed')}</h3>
              <p className="text-gray-600">
                {t('excellenceGuaranteedDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
