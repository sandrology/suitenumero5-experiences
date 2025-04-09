
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash, Eye, EyeOff, Plus } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import { mockExperiences, Experience } from '../../data/mockExperiences';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<Experience[]>(mockExperiences);

  const toggleExperienceStatus = (id: string) => {
    setExperiences(prevExperiences =>
      prevExperiences.map(exp =>
        exp.id === id ? { ...exp, enabled: !exp.enabled } : exp
      )
    );

    toast({
      title: "Status Updated",
      description: "Experience status has been updated successfully."
    });
  };

  const deleteExperience = (id: string) => {
    // In a real app, this would be an API call
    setExperiences(prevExperiences => 
      prevExperiences.filter(exp => exp.id !== id)
    );

    toast({
      title: "Experience Deleted",
      description: "Experience has been deleted successfully."
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {experiences.map((experience) => (
                  <tr key={experience.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <img 
                          src={experience.images[0]} 
                          alt={experience.translations[language].title} 
                          className="h-10 w-10 rounded-md object-cover mr-3"
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
                        {experience.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right space-x-2">
                      <button
                        onClick={() => toggleExperienceStatus(experience.id)}
                        className="p-1.5 rounded-md text-gray-600 hover:bg-gray-100"
                        title={experience.enabled ? 'Disable' : 'Enable'}
                      >
                        {experience.enabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <Link
                        to={`/admin/edit/${experience.id}`}
                        className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => deleteExperience(experience.id)}
                        className="p-1.5 rounded-md text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
