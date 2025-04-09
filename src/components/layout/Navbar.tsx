
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'it' : 'en');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="https://suitenumero5.s3.us-east-1.amazonaws.com/img/logoorizontale.png" 
              alt="Logo" 
              className="h-12" 
            />
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-800 hover:text-primary transition-colors">
              {t('home')}
            </Link>
            <Link to="/experiences" className="text-gray-800 hover:text-primary transition-colors">
              {t('experiences')}
            </Link>
            <Link to="/about" className="text-gray-800 hover:text-primary transition-colors">
              {t('about')}
            </Link>
            <Link to="/contact" className="text-gray-800 hover:text-primary transition-colors">
              {t('contact')}
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 text-gray-600 hover:text-primary"
            >
              <Globe className="h-5 w-5" />
              <span>{language.toUpperCase()}</span>
            </button>
            <Link to="/admin" className="btn-primary">
              {t('admin')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleLanguage} className="mr-4">
              <Globe className="h-6 w-6 text-gray-600" />
            </button>
            <button onClick={toggleMenu} className="focus:outline-none">
              {isOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-3 animate-fade-in">
            <Link 
              to="/" 
              className="block py-2 text-gray-800 hover:text-primary"
              onClick={toggleMenu}
            >
              {t('home')}
            </Link>
            <Link 
              to="/experiences" 
              className="block py-2 text-gray-800 hover:text-primary"
              onClick={toggleMenu}
            >
              {t('experiences')}
            </Link>
            <Link 
              to="/about" 
              className="block py-2 text-gray-800 hover:text-primary"
              onClick={toggleMenu}
            >
              {t('about')}
            </Link>
            <Link 
              to="/contact" 
              className="block py-2 text-gray-800 hover:text-primary"
              onClick={toggleMenu}
            >
              {t('contact')}
            </Link>
            <Link 
              to="/admin" 
              className="block py-2 text-gray-800 hover:text-primary"
              onClick={toggleMenu}
            >
              {t('admin')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
