
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { UserSettings, NotificationSettings } from '../types'; 
import { LOCAL_STORAGE_KEYS } from '../constants'; 

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultNotificationSettings: NotificationSettings = {
  enabled: true,
  trending: true,
  recommendations: true,
  appUpdates: true,
};


export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_SETTINGS);
    if (storedSettings) {
      try {
        const parsedSettings: UserSettings = JSON.parse(storedSettings);
        return parsedSettings.theme || 'light';
      } catch (e) {
        console.error("Failed to parse user settings from localStorage", e);
      }
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_SETTINGS);
    let currentSettings: UserSettings;
    try {
      currentSettings = storedSettings ? JSON.parse(storedSettings) : { theme: 'light', notifications: defaultNotificationSettings };
      if (!currentSettings.notifications) { // Ensure notifications structure exists
        currentSettings.notifications = defaultNotificationSettings;
      }
    } catch (e) {
      console.error("Failed to parse user settings, resetting to defaults.", e);
      currentSettings = { theme: 'light', notifications: defaultNotificationSettings };
    }
    
    const newSettings: UserSettings = { ...currentSettings, theme };
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_SETTINGS, JSON.stringify(newSettings));

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const contextValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};