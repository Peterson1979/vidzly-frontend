
import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback, useRef } from 'react';
import { CUSTOM_LOGO_STORAGE_KEY, DEFAULT_LOGO_SVG_STRING } from '../constants';

interface LogoContextType {
  customLogoUrl: string | null; // This will be a data URL (base64)
  defaultLogoSvgString: string; // The raw SVG string for the default logo (used for inline display, e.g., Navbar)
  setCustomLogo: (dataUrl: string | null) => void;
}

const LogoContext = createContext<LogoContextType | undefined>(undefined);

export const LogoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customLogoUrl, setCustomLogoUrlState] = useState<string | null>(() => {
    try {
      return localStorage.getItem(CUSTOM_LOGO_STORAGE_KEY);
    } catch (error) {
      console.error("Error reading custom logo from localStorage", error);
      return null;
    }
  });

  const initialFaviconHref = useRef<string | null>(null);

  // Effect to capture the initial favicon link from the DOM
  useEffect(() => {
    const link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (link && !initialFaviconHref.current) {
      initialFaviconHref.current = link.href;
    }
  }, []); // Runs once on mount

  // Effect to update the browser tab's favicon
  useEffect(() => {
    const link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (link) {
      if (customLogoUrl) {
        link.href = customLogoUrl;
      } else if (initialFaviconHref.current) {
        // Revert to the initially captured favicon from the HTML
        link.href = initialFaviconHref.current;
      }
      // If customLogoUrl is null and initialFaviconHref.current is also null (unlikely but possible),
      // the favicon remains unchanged by this effect.
    }
  }, [customLogoUrl]); // Dependency is customLogoUrl

  const setCustomLogo = useCallback((dataUrl: string | null) => {
    try {
      if (dataUrl) {
        localStorage.setItem(CUSTOM_LOGO_STORAGE_KEY, dataUrl);
      } else {
        localStorage.removeItem(CUSTOM_LOGO_STORAGE_KEY);
      }
      setCustomLogoUrlState(dataUrl);
    } catch (error) {
      console.error("Error saving custom logo to localStorage", error);
    }
  }, []);
  
  const contextValue = useMemo(() => ({
    customLogoUrl,
    defaultLogoSvgString: DEFAULT_LOGO_SVG_STRING, // For Navbar/inline display
    setCustomLogo,
  }), [customLogoUrl, setCustomLogo]);

  return (
    <LogoContext.Provider value={contextValue}>
      {children}
    </LogoContext.Provider>
  );
};

export const useLogo = (): LogoContextType => {
  const context = useContext(LogoContext);
  if (!context) {
    throw new Error('useLogo must be used within a LogoProvider');
  }
  return context;
};
