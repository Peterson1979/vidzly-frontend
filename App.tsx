
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import VideoDetailScreen from './screens/VideoDetailScreen';
// CategoryFeedScreen removed
import FavoritesScreen from './screens/FavoritesScreen';
import SettingsScreen from './screens/SettingsScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import NavBar from './components/NavBar';
import BottomNav from './components/BottomNav';
import { useTheme } from './hooks/useTheme';
import { ROUTES, AD_BANNER_HEIGHT_PX, BOTTOM_NAV_HEIGHT_PX } from './constants';

const App: React.FC = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const isVideoDetailScreen = location.pathname.startsWith(ROUTES.VIDEO_DETAIL_BASE);

  const showNavBar = !isVideoDetailScreen;
  const showBottomNav = !isVideoDetailScreen;
  
  // For now, assume ads are shown for non-premium users.
  // In a real app, this would be tied to a subscription status.
  const showAdBanner = !isVideoDetailScreen; 

  const navBarHeightClass = showNavBar ? 'pt-16' : ''; // pt-16 is 4rem for NavBar

  let mainPaddingBottomStyle: React.CSSProperties = {};
  let adBannerBottomOffsetStyle: React.CSSProperties = {};

  if (showAdBanner) {
    mainPaddingBottomStyle.paddingBottom = `${AD_BANNER_HEIGHT_PX}px`;
    adBannerBottomOffsetStyle.bottom = '0px';
    if (showBottomNav) {
      mainPaddingBottomStyle.paddingBottom = `${AD_BANNER_HEIGHT_PX + BOTTOM_NAV_HEIGHT_PX}px`;
      adBannerBottomOffsetStyle.bottom = `${BOTTOM_NAV_HEIGHT_PX}px`;
    }
  } else if (showBottomNav) {
    mainPaddingBottomStyle.paddingBottom = `${BOTTOM_NAV_HEIGHT_PX}px`;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {showNavBar && <NavBar />}
      <main 
        className={`flex-grow ${navBarHeightClass}`}
        style={mainPaddingBottomStyle}
      >
        <Routes>
          <Route path={ROUTES.HOME} element={<HomeScreen />} />
          <Route path={ROUTES.VIDEO_DETAIL} element={<VideoDetailScreen />} />
          <Route path={ROUTES.FAVORITES} element={<FavoritesScreen />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsScreen />} />
          <Route path={ROUTES.SUBSCRIPTION} element={<SubscriptionScreen />} />
        </Routes>
      </main>
      
      {showAdBanner && (
        <div 
          style={{ height: `${AD_BANNER_HEIGHT_PX}px`, ...adBannerBottomOffsetStyle }}
          className="fixed left-0 right-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-foreground dark:text-background z-30 border-t border-muted dark:border-gray-600"
          role="complementary"
          aria-label="Advertisement Space" // Changed aria-label to be more generic
        >
          {/* Text "Advertisement Placeholder" removed */}
        </div>
      )}
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default App;