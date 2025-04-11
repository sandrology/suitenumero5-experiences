
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash, Eye, EyeOff, Plus, Download, Upload } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import { Experience } from '../../types/experience';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from "@/hooks/use-toast";
import { 
  getExperiences,
  getExperiencesSync,
  deleteExperience, 
  toggleExperienceStatus,
  exportExperiencesAsJson,
  importExperiencesFromJson,
  DEFAULT_IMAGE,
  initializeSupabaseData
} from '../../services/experienceService';

const AdminDashboard = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJson, setImportJson] = useState('');
  
  // Function to load experiences
  const loadExperiences = async () => {
    setLoading(true);
    try {
      // Initialize Supabase data if needed
      await initializeSupabaseData();
      
      // Then load experiences
      const loadedExperiences = await getExperiences();
      setExperiences(loadedExperiences);
    } catch (error) {
      console.error('Error loading experiences:', error);
      // Fallback to sync method if async fails
      const fallbackExperiences = getExperiencesSync();
      setExperiences(fallbackExperiences);
      
      toast({
        title: 'Warning',
        description: 'Unable to load from database, using local data instead.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
    
    // Add custom event listener to update experiences when they change
    const handleExperiencesUpdated = () => {
      loadExperiences();
    };
    
    window.addEventListener('experiencesUpdated', handleExperiencesUpdated);
    
    return () => {
      window.removeEventListener('experiencesUpdated', handleExperiencesUpdated);
    };
  }, []);

  const handleToggleExperienceStatus = async (id: string) => {
    try {
      await toggleExperienceStatus(id);
      
      // Update local state directly for immediate UI update
      setExperiences(prevExperiences =>
        prevExperiences.map(exp =>
          exp.id === id ? { ...exp, enabled: !exp.enabled } : exp
        )
      );

      toast({
        title: t('statusUpdated'),
        description: t('statusUpdatedDesc')
      });
    } catch (error) {
      console.error('Error toggling status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update experience status',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      await deleteExperience(id);
      
      // Update local state directly
      setExperiences(prevExperiences => 
        prevExperiences.filter(exp => exp.id !== id)
      );

      toast({
        title: t('experienceDeleted'),
        description: t('experienceDeletedDesc')
      });
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the experience',
        variant: 'destructive'
      });
    }
  };

  const handleExportJson = async () => {
    try {
      const jsonData = await exportExperiencesAsJson();
      
      // For TS file export - includes the export statement
      const formattedData = `export const experiencesData = ${jsonData};`;
      
      const blob = new Blob([formattedData], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'experiencesData.ts';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: t('exportSuccess'),
        description: 'Experiences data exported successfully. Add this to your project under src/data/experiencesData.ts'
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Error',
        description: 'Failed to export experiences data',
        variant: 'destructive'
      });
    }
  };

  const handleExportJsonRaw = async () => {
    try {
      const jsonData = await exportExperiencesAsJson();
      
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'experiences.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Export Successful',
        description: 'Experiences data exported successfully as JSON'
      });
    } catch (error) {
      console.error('Error exporting JSON:', error);
      toast({
        title: 'Error',
        description: 'Failed to export experiences data',
        variant: 'destructive'
      });
    }
  };
  
  const handleImportModal = () => {
    setIsImportModalOpen(true);
  };
  
  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
    setImportJson('');
  };
  
  const handleImportJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImportJson(e.target.value);
  };
  
  const handleImportJsonSubmit = async () => {
    if (!importJson.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter valid JSON data',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const success = await importExperiencesFromJson(importJson);
      
      if (success) {
        handleCloseImportModal();
        loadExperiences();
        
        toast({
          title: 'Import Successful',
          description: 'Experiences data imported successfully'
        });
      } else {
        toast({
          title: 'Import Failed',
          description: 'Failed to import experiences data',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error importing JSON:', error);
      toast({
        title: 'Error',
        description: 'Invalid JSON format or data structure',
        variant: 'destructive'
      });
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonContent = event.target?.result as string;
        setImportJson(jsonContent);
      } catch (error) {
        console.error('Error reading file:', error);
        toast({
          title: 'Error',
          description: 'Failed to read the file',
          variant: 'destructive'
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container-custom py-12">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="heading-lg">{t('manageExperiences')}</h1>
            <div className="flex space-x-3">
              <button
                onClick={handleExportJsonRaw}
                className="btn-secondary inline-flex items-center"
                title="Export as raw JSON"
              >
                <Download className="mr-2 h-4 w-4" />
                Export JSON
              </button>
              <button
                onClick={handleExportJson}
                className="btn-secondary inline-flex items-center"
                title="Export as TypeScript"
              >
                <Download className="mr-2 h-4 w-4" />
                Export TS
              </button>
              <button
                onClick={handleImportModal}
                className="btn-secondary inline-flex items-center"
                title="Import JSON data"
              >
                <Upload className="mr-2 h-4 w-4" />
                Import
              </button>
              <Link to="/admin/create" className="btn-primary inline-flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                {t('createExperience')}
              </Link>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
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
          )}
        </div>
      </main>
      
      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="heading-md mb-4">Import Experiences</h2>
            
            <div className="mb-4">
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="mb-4"
              />
              
              <label className="block text-sm font-medium text-gray-700 mb-1">
                JSON Data
              </label>
              <textarea
                value={importJson}
                onChange={handleImportJsonChange}
                rows={10}
                className="w-full p-2 border rounded-md focus:ring-primary focus:border-primary"
                placeholder="Paste your JSON data here..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseImportModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleImportJsonSubmit}
                className="btn-primary"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
