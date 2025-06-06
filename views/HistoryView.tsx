
import React, { useState, useEffect, useMemo } from 'react';
import { useViewHistory } from '../contexts/ViewHistoryContext';
import { YouTubeVideo } from '../types';
import { VideoCard } from '../components/VideoCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { allMockVideos as globalAllMockVideos } from '../services/youtubeService';
import { HistoryIcon, TrashIcon } from '../components/Icons';
import { AdBanner } from '../components/AdBanner';
import { useSubscription } from '../contexts/SubscriptionContext';

export const HistoryView: React.FC = () => {
  const { historyItems, clearHistory } = useViewHistory();
  const { isSubscribed } = useSubscription();
  const [detailedHistoryVideos, setDetailedHistoryVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchHistoryVideoDetails = async () => {
      if (historyItems.length === 0) {
        setDetailedHistoryVideos([]);
        return;
      }
      setIsLoading(true);
      
      const historyVideoIds = historyItems.map(item => item.videoId);
      const detailed = globalAllMockVideos.filter(video => 
        historyVideoIds.includes(video.id)
      );
      
      const sortedDetailed = historyItems.map(historyItem => 
        detailed.find(video => video.id === historyItem.videoId)
      ).filter(video => video !== undefined) as YouTubeVideo[];

      setDetailedHistoryVideos(sortedDetailed);
      setIsLoading(false);
    };

    fetchHistoryVideoDetails();
  }, [historyItems]);

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your watch history? This action cannot be undone.")) {
      clearHistory();
    }
  };

  if (isLoading && historyItems.length > 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-[calc(100vh-10rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-center my-6 px-2 sm:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-light dark:text-text-dark text-center sm:text-left mb-3 sm:mb-0">
          Watch History
        </h2>
        {historyItems.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition-colors"
            aria-label="Clear watch history"
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            Clear History
          </button>
        )}
      </div>

      {historyItems.length === 0 ? (
        <div className="text-center py-12 px-4 text-text-light dark:text-text-dark">
          <HistoryIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-xl sm:text-2xl font-semibold mb-2">Your Watch History is Empty</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Videos you watch will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {detailedHistoryVideos.map((video, index) => (
            <React.Fragment key={`${video.id}-history`}>
              <VideoCard video={video} />
              {index > 0 && (index + 1) % 4 === 0 && !isSubscribed && (
                <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
                   <AdBanner />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
