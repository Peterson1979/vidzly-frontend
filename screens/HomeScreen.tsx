
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { ListBulletIcon, Squares2X2Icon, XMarkIcon, ROUTES, LOCAL_STORAGE_KEYS, FEED_VIDEO_FETCH_LIMIT, DEFAULT_YOUTUBE_REGION_CODE, HOME_SCREEN_PAGINATION_LIMIT } from '../constants'; // PRIORITY_CATEGORY_ORDER, HOME_SCREEN_CATEGORY_VIDEO_LIMIT, DEFAULT_CATEGORIES removed
import { Video } from '../types'; // Category import removed
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchTrendingVideos } from '../services/youtubeService'; 
import useLocalStorage from '../hooks/useLocalStorage';

type ViewMode = 'grid' | 'list';

// VideoSection interface removed

const HomeScreen: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
  const [allContentExhausted, setAllContentExhausted] = useState(false);
  
  const [showPremiumBanner, setShowPremiumBanner] = useLocalStorage<boolean>(
    LOCAL_STORAGE_KEYS.PREMIUM_BANNER_DISMISSED, true
  );
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);

  // homeCategories and related logic removed

  const loadInitialTrendingVideos = useCallback(async () => {
    setIsLoadingInitial(true);
    setGlobalError(null);
    setVideos([]);
    setNextPageToken(undefined);
    setAllContentExhausted(false);

    try {
      const fetchedData = await fetchTrendingVideos(undefined, HOME_SCREEN_PAGINATION_LIMIT, DEFAULT_YOUTUBE_REGION_CODE);
      setVideos(fetchedData.videos);
      setNextPageToken(fetchedData.nextPageToken);
      if (!fetchedData.nextPageToken && fetchedData.videos.length > 0) {
        setAllContentExhausted(true);
      }
    } catch (err) {
      console.error("Global error fetching initial trending videos:", err);
      setGlobalError(err instanceof Error ? err.message : 'Failed to load content. Please try again.');
    } finally {
      setIsLoadingInitial(false);
    }
  }, []);

  useEffect(() => {
    loadInitialTrendingVideos();
  }, [loadInitialTrendingVideos]);

  const loadMoreTrendingVideos = useCallback(async () => {
    if (isLoadingMore || allContentExhausted || !nextPageToken) {
      return;
    }
    
    setIsLoadingMore(true);
    setGlobalError(null); 

    try {
      const fetchedData = await fetchTrendingVideos(nextPageToken, FEED_VIDEO_FETCH_LIMIT, DEFAULT_YOUTUBE_REGION_CODE);
      
      setVideos(prevVideos => {
        const newVideos = fetchedData.videos.filter(nv => !prevVideos.some(pv => pv.id === nv.id));
        return [...prevVideos, ...newVideos];
      });
      setNextPageToken(fetchedData.nextPageToken);
      if (!fetchedData.nextPageToken) {
        setAllContentExhausted(true);
      }
    } catch (err) {
      console.error(`Error fetching more trending videos:`, err);
      setGlobalError(err instanceof Error ? err.message : 'Failed to load more videos.');
      // Keep existing videos, user can try again later or might resolve on its own
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextPageToken, isLoadingMore, allContentExhausted]);

  useEffect(() => {
    const currentObserver = observerRef.current;
    if (currentObserver) currentObserver.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && !allContentExhausted && nextPageToken && !globalError) {
          loadMoreTrendingVideos();
        }
      },
      { threshold: 0.8 }
    );
    
    if (loadMoreTriggerRef.current && observerRef.current) {
      observerRef.current.observe(loadMoreTriggerRef.current);
    }

    return () => {
      if (currentObserver) currentObserver.disconnect();
    };
  }, [videos, isLoadingMore, allContentExhausted, nextPageToken, globalError, loadMoreTrendingVideos]);


  const dismissPremiumBanner = () => {
    setShowPremiumBanner(false);
  };

  if (isLoadingInitial && videos.length === 0) {
    return <LoadingSpinner text="Curating the freshest trending videos for you..." />;
  }

  if (globalError && videos.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <p className="text-red-500 text-lg">{globalError}</p>
        <button 
            onClick={loadInitialTrendingVideos}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
            Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {showPremiumBanner && (
        <div className="mb-6 p-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg shadow-lg flex items-center justify-between">
          <p className="font-semibold">
            Enjoy Vidzly without ads –{' '}
            <Link to={ROUTES.SUBSCRIPTION} className="underline hover:opacity-80 transition-opacity">
              Go Premium!
            </Link>
          </p>
          <button 
            onClick={dismissPremiumBanner} 
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Dismiss premium banner"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground dark:text-gray-100">
          Trending Videos
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-muted text-foreground hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
            aria-label="List view" title="List view"
          > <ListBulletIcon className="w-5 h-5" /> </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-muted text-foreground hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
            aria-label="Grid view" title="Grid view"
          > <Squares2X2Icon className="w-5 h-5" /> </button>
        </div>
      </div>
      
      {videos.length === 0 && !isLoadingInitial && !globalError && (
        <p className="text-muted-foreground text-center py-10">No trending videos found right now. Please try again later.</p>
      )}

      {videos.length > 0 && (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'
              : 'flex flex-col space-y-6'
          }
        >
          {videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
      
      <div 
        ref={loadMoreTriggerRef} 
        className="h-10 flex justify-center items-center mt-8"
      >
        {isLoadingMore && <LoadingSpinner size="sm" text="Loading more videos..." />}
        {allContentExhausted && videos.length > 0 && !isLoadingMore && (
          <p className="text-muted-foreground dark:text-gray-400">That's all for now!</p>
        )}
        {globalError && !isLoadingMore && videos.length > 0 && (
             <p className="text-red-500">Could not load more. {globalError}</p>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;