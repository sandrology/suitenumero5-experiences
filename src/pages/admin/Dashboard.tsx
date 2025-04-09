
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash, Eye, EyeOff, Plus } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import { mockExperiences, Experience } from '../../data/mockExperiences';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from "@/hooks/use-toast";
import { 
  initializeExperiences, 
  getExperiences, 
  deleteExperience, 
  toggleExperienceStatus 
} from '../../services/experienceService';

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<Experience[]>([]);

  // Carica le esperienze al mount
  useEffect(() => {
    // Inizializza con i dati mock se il localStorage è vuoto
    const loadedExperiences = initializeExperiences(mockExperiences);
    setExperiences(loadedExperiences);
    
    // Aggiungi un event listener per aggiornare le esperienze quando cambiano in altre schede
    const handleStorageChange = () => {
      setExperiences(getExperiences());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleToggleExperienceStatus = (id: string) => {
    toggleExperienceStatus(id);
    
    // Aggiorna lo stato locale
    setExperiences(prevExperiences =>
      prevExperiences.map(exp =>
        exp.id === id ? { ...exp, enabled: !exp.enabled } : exp
      )
    );

    toast({
      title: t('statusUpdated'),
      description: t('statusUpdatedDesc')
    });
  };

  const handleDeleteExperience = (id: string) => {
    deleteExperience(id);
    
    // Aggiorna lo stato locale
    setExperiences(prevExperiences => 
      prevExperiences.filter(exp => exp.id !== id)
    );

    toast({
      title: t('experienceDeleted'),
      description: t('experienceDeletedDesc')
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container-custom py-12">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="heading-lg">{t('manageExperiences')}</h1>
            <Link to="/admin/create" className="btn-primary inline-flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              {t('createExperience')}
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t('title')}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t('location')}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t('price')}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">{t('status')}</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {experiences.length > 0 ? (
                  experiences.map((experience) => (
                    <tr key={experience.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <img 
                            src={experience.images && experience.images.length > 0 ? experience.images[0] : DEFAULT_IMAGE} 
                            alt={experience.translations[language].title} 
                            className="h-10 w-10 rounded-md object-cover mr-3"
                            onError={(e) => {
                              e.currentTarget.src = DEFAULT_IMAGE;
                            }}
                          />
                          <span className="font-medium">{experience.translations[language].title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">{experience.location}</td>
                      <td className="px-4 py-4 text-gray-600">${experience.price}</td>
                      <td className="px-4 py-4">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            experience.enabled 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {experience.enabled ? t('active') : t('inactive')}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleToggleExperienceStatus(experience.id)}
                            className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100"
                            title={experience.enabled ? t('disable') : t('enable')}
                          >
                            {experience.enabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <Link
                            to={`/admin/edit/${experience.id}`}
                            className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50"
                            title={t('edit')}
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteExperience(experience.id)}
                            className="p-1.5 rounded-md text-red-600 hover:bg-red-50"
                            title={t('delete')}
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      {t('noExperiences')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
