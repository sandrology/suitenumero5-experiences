
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-white">
     <div className="container-custom py-20 md:py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <img 
              src="https://suitenumero5.s3.us-east-1.amazonaws.com/img/scrittaorizzontalebianca.png" 
              alt="Logo" 
              className="h-12 mb-4 brightness-200"
            />
           
      
          </div>

          
 
          {/* Quick Links */}

 {/*          <div>
            <h5 className="font-semibold text-lg mb-4">Quick Links</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/experiences" className="text-gray-300 hover:text-white transition-colors">
                  {t('experiences')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  {t('contact')}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-300 hover:text-white transition-colors">
                  {t('admin')}
                </Link>
              </li>
            </ul>
          </div>
*/}

         
          {/* Top Destinations */}
{/*            <div>
            <h5 className="font-semibold text-lg mb-4">Top Destinations</h5>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Venice</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Florence</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Rome</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Milan</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Amalfi Coast</a>
              </li>
            </ul>
          </div>
*/}
          {/* Contact */}
          <div>
            <h5 className="font-semibold text-lg mb-4">Contact Us</h5>
            <ul className="space-y-4">
              
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-secondary" />
                <span className="text-gray-300">+39 348 3103720</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-secondary" />
                <span className="text-gray-300">info@suitenumero5.it</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Experience Travel. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-8 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
