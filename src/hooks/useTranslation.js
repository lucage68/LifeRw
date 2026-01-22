// src/hooks/useTranslation.js
import { useState, useEffect } from "react";
import translations from "../translations";

export const useTranslation = () => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedSettings = localStorage.getItem("liferw-settings");
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setLanguage(parsedSettings.language);
    }

    const handleLanguageChange = (event) => {
      setLanguage(event.detail.language);
    };

    window.addEventListener("languageChanged", handleLanguageChange);
    return () => window.removeEventListener("languageChanged", handleLanguageChange);
  }, []);

  // Return the translation object directly as 't'
  const t = translations[language];
  
  return { t, language };
};