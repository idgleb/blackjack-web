import { useState, useEffect } from 'react';
import { detectLanguage, setLanguage, t, getAvailableLanguages } from '../utils/translations';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState(detectLanguage());
  const [isLoading, setIsLoading] = useState(false);
  
  // Detectar idioma al cargar el componente
  useEffect(() => {
    const detectedLang = detectLanguage();
    setCurrentLanguage(detectedLang);
  }, []);
  
  const changeLanguage = (languageCode) => {
    if (setLanguage(languageCode)) {
      setIsLoading(true);
      setCurrentLanguage(languageCode);
      
      // Pequeño delay para mostrar el cambio antes de recargar
      setTimeout(() => {
        window.location.reload();
      }, 300);
      
      return true;
    }
    return false;
  };
  
  const translate = (key) => t(key, currentLanguage);
  
  const availableLanguages = getAvailableLanguages();
  
  return {
    currentLanguage,
    changeLanguage,
    t: translate,
    availableLanguages,
    isLoading,
    languageInfo: availableLanguages.find(lang => lang.code === currentLanguage)
  };
};
