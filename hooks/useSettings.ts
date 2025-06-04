
import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { UserSettings, NotificationSettings } from '../types'; 
import { LOCAL_STORAGE_KEYS } from '../constants'; 
import { useTheme as useThemeContext } from './useTheme'; 

const initialNotificationSettings: NotificationSettings = {
  enabled: true,
  trending: true,
  recommendations: true,
  appUpdates: true,
};

const initialSettings: UserSettings = {
  theme: 'light', 
  notifications: initialNotificationSettings,
};

export const useSettings = () => {
  const [settingsFromStorage, setSettingsInStorage] = useLocalStorage<UserSettings>(
    LOCAL_STORAGE_KEYS.USER_SETTINGS,
    initialSettings
  );
  const { theme } = useThemeContext(); 


  // Combine theme from context with notification settings from storage (or initial if not set)
  const actualSettings: UserSettings = { 
    theme, 
    notifications: settingsFromStorage.notifications || initialNotificationSettings,
  };
  
  // Update storage if the theme from context differs or if notification settings are missing/different
  if (settingsFromStorage.theme !== theme || 
      JSON.stringify(settingsFromStorage.notifications) !== JSON.stringify(actualSettings.notifications)) {
      setSettingsInStorage(actualSettings);
  }
  
  const updateNotificationSettings = useCallback((newNotificationSettings: Partial<NotificationSettings>) => {
    setSettingsInStorage(prevSettings => ({
      ...prevSettings,
      notifications: {
        ...prevSettings.notifications,
        ...newNotificationSettings,
      }
    }));
  }, [setSettingsInStorage]);


  return { 
    settings: actualSettings,
    updateNotificationSettings,
  };
};