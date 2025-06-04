
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useSettings } from '../hooks/useSettings';
import { SunIcon, MoonIcon, ROUTES, CogIcon, CheckCircleIcon, BellIcon, SparklesIcon, InformationCircleIcon } from '../constants';

interface SettingItemProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  to?: string;
  onClick?: () => void;
  isButton?: boolean;
  icon?: React.ReactNode;
  indented?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = 
  ({ title, description, action, to, onClick, isButton, icon, indented = false }) => {
  const content = (
      <div className={`flex justify-between items-center py-4 ${indented ? 'ml-8' : ''}`}>
          <div className="flex items-center">
            {icon && <span className="mr-3 text-muted-foreground dark:text-gray-400">{icon}</span>}
            <div>
                <h3 className="text-lg font-medium text-foreground dark:text-gray-100">{title}</h3>
                {description && <p className="text-sm text-muted-foreground dark:text-gray-400">{description}</p>}
            </div>
          </div>
          {action}
      </div>
  );
  
  const commonClasses = "block hover:bg-muted dark:hover:bg-gray-700 px-4 rounded-lg transition-colors";

  if (to) {
      return <Link to={to} className={commonClasses}>{content}</Link>;
  }
  if (onClick || isButton) { // If it's a button, it should be clickable
      return <button onClick={onClick} className={`w-full text-left ${commonClasses}`}>{content}</button>;
  }
  return <div className={`px-4 ${isButton ? 'cursor-pointer' : ''}`}>{content}</div>; // Ensure non-interactive items aren't buttons
};


interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, checked, onChange, label }) => {
  return (
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        id={id} 
        className="sr-only peer" 
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={label || id}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-light dark:peer-focus:ring-primary-dark rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary"></div>
    </label>
  );
};


const SettingsScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { settings, updateNotificationSettings } = useSettings();
  const { notifications } = settings;

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    updateNotificationSettings({ [key]: value });
  };
  
  const handleMainNotificationToggle = (enabled: boolean) => {
    // When main toggle is turned off, all sub-toggles are effectively off (though their state is preserved).
    // When turned on, sub-toggles resume their preserved states.
    updateNotificationSettings({ enabled });
  };


  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-8">
        <CogIcon className="w-10 h-10 text-primary mr-3" />
        <h1 className="text-3xl font-bold text-foreground dark:text-gray-100">Settings</h1>
      </div>
      
      {/* App Settings Section */}
      <h2 className="text-xl font-semibold text-foreground dark:text-gray-100 mb-3 mt-6 px-1">App Settings</h2>
      <div className="bg-card rounded-lg shadow-md dark:bg-gray-800 divide-y divide-muted dark:divide-gray-700 mb-8">
        <SettingItem
          title="Theme"
          description={`Current theme: ${theme === 'light' ? 'Light' : 'Dark'}`}
          action={
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <MoonIcon className="w-6 h-6 text-primary" /> : <SunIcon className="w-6 h-6 text-yellow-400" />}
            </button>
          }
        />
         <SettingItem
          title="Subscription"
          description="Manage your subscription and unlock premium features."
          to={ROUTES.SUBSCRIPTION}
          action={<CheckCircleIcon className="w-6 h-6 text-muted-foreground dark:text-gray-400"/>}
        />
      </div>

      {/* Notification Preferences Section */}
      <h2 className="text-xl font-semibold text-foreground dark:text-gray-100 mb-3 mt-6 px-1">Notification Preferences</h2>
      <div className="bg-card rounded-lg shadow-md dark:bg-gray-800 divide-y divide-muted dark:divide-gray-700">
        <SettingItem
            title="Enable Notifications"
            icon={<BellIcon className="w-5 h-5" />}
            action={
                <ToggleSwitch 
                    id="notifications-main-toggle"
                    checked={notifications.enabled}
                    onChange={handleMainNotificationToggle}
                    label="Enable all notifications"
                />
            }
        />
        {notifications.enabled && (
          <>
            <SettingItem
                title="Trending Now Alerts"
                description="Get notified about viral videos as they trend."
                icon={<SparklesIcon className="w-5 h-5" />}
                indented
                action={
                    <ToggleSwitch
                        id="notifications-trending-toggle"
                        checked={notifications.trending}
                        onChange={(checked) => handleNotificationChange('trending', checked)}
                        label="Trending now alerts"
                    />
                }
            />
            <SettingItem
                title="Highlights & Recommendations"
                description="Receive personalized suggestions and curated highlights."
                icon={<CheckCircleIcon className="w-5 h-5 text-green-500" />} // Re-using icon, consider a more 'recommendation' specific one
                indented
                action={
                    <ToggleSwitch
                        id="notifications-recommendations-toggle"
                        checked={notifications.recommendations}
                        onChange={(checked) => handleNotificationChange('recommendations', checked)}
                        label="Highlights and recommendations"
                    />
                }
            />
            <SettingItem
                title="App Updates & Features"
                description="Stay informed about new features and app improvements."
                icon={<InformationCircleIcon className="w-5 h-5" />}
                indented
                action={
                    <ToggleSwitch
                        id="notifications-appUpdates-toggle"
                        checked={notifications.appUpdates}
                        onChange={(checked) => handleNotificationChange('appUpdates', checked)}
                        label="App updates and features"
                    />
                }
            />
          </>
        )}
      </div>

    </div>
  );
};

export default SettingsScreen;