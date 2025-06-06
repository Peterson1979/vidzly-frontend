
import React, { useState, useEffect, useCallback } from 'react';
import { YouTubeVideo } from '../types';
import { mockFetchVideos } from '../services/youtubeService';
import { VideoCard } from './VideoCard';
import { LoadingSpinner } from './LoadingSpinner';
import { XIcon, SearchIcon, HistoryIcon } from './Icons'; // Added HistoryIcon
import { SEARCH_DEBOUNCE_DELAY, RECENT_SEARCHES_STORAGE_KEY, MAX_RECENT_SEARCHES } from '../constants';
import { useSubscription } from '../contexts/SubscriptionContext';
import { AdBanner } from './AdBanner';

interface SearchOverlayProps {
  currentSearchTerm: string;
  onSearch: (term: string) => void; // Callback to update App's searchTerm
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ currentSearchTerm, onSearch, onClose }) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState(currentSearchTerm);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(currentSearchTerm);
  const [results, setResults] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { isSubscribed } = useSubscription();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const storedSearches = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      }
    } catch (e) {
      console.error("Failed to load recent searches:", e);
    }
  }, []);

  // Save recent searches to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(recentSearches));
    } catch (e) {
      console.error("Failed to save recent searches:", e);
    }
  }, [recentSearches]);

  const addSearchToRecents = (term: string) => {
    if (!term.trim()) return;
    setRecentSearches(prev => {
      const cleanedTerm = term.trim().toLowerCase();
      const filtered = prev.filter(s => s.toLowerCase() !== cleanedTerm);
      const newRecents = [term.trim(), ...filtered].slice(0, MAX_RECENT_SEARCHES);
      return newRecents;
    });
  };
  
  const removeSearchFromRecents = (termToRemove: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering search if parent is clickable
    setRecentSearches(prev => prev.filter(term => term !== termToRemove));
  };

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(internalSearchTerm);
      setPage(1); // Reset page for new search term
      setResults([]); // Clear old results
      setHasMore(true);
    }, SEARCH_DEBOUNCE_DELAY);
    return () => clearTimeout(handler);
  }, [internalSearchTerm]);

  const fetchSearchResults = useCallback(async (term: string, currentPage: number) => {
    if (!term.trim()) {
      setResults([]);
      setIsLoading(false);
      setHasMore(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const newVideos = await mockFetchVideos(term, currentPage, 8); // Fetch more for search overlay
      setResults(prev => currentPage === 1 ? newVideos : [...prev, ...newVideos]);
      setHasMore(newVideos.length > 0);
      if (currentPage === 1) { // Only add to recents on a new search, not on "load more"
        addSearchToRecents(term);
      }
      onSearch(term); // Update App's searchTerm
    } catch (err) {
      setError('Failed to fetch search results.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [onSearch]); // addSearchToRecents dependency removed to avoid re-triggering due to its own state update cycle

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      fetchSearchResults(debouncedSearchTerm, page);
    } else {
      setResults([]); // Clear results if search term is empty
      setHasMore(false);
    }
  }, [debouncedSearchTerm, page, fetchSearchResults]);
  
  const handleLoadMore = () => {
      if (!isLoading && hasMore) {
          setPage(prevPage => prevPage + 1);
      }
  }

  const handleRecentSearchClick = (term: string) => {
    setInternalSearchTerm(term);
  };

  return (
    <div className="fixed inset-0 bg-primary-light dark:bg-primary-dark z-80 flex flex-col p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-text-light dark:text-text-dark">Search Videos</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          aria-label="Close search"
        >
          <XIcon className="h-7 w-7" />
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); fetchSearchResults(internalSearchTerm, 1); }} className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="search"
            value={internalSearchTerm}
            onChange={(e) => setInternalSearchTerm(e.target.value)}
            placeholder="Enter keywords to search..."
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-text-light dark:text-text-dark placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange text-lg"
            autoFocus
          />
        </div>
      </form>

      {/* Recent Searches Display */}
      {recentSearches.length > 0 && !internalSearchTerm.trim() && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Recent Searches</h3>
          <ul className="flex flex-wrap gap-2">
            {recentSearches.map(term => (
              <li key={term}>
                <button
                  onClick={() => handleRecentSearchClick(term)}
                  className="flex items-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-text-light dark:text-text-dark text-sm px-3 py-1.5 rounded-full transition-colors"
                  aria-label={`Search for ${term}`}
                >
                  <HistoryIcon className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                  {term}
                  <button 
                    onClick={(e) => removeSearchFromRecents(term, e)}
                    className="ml-2 p-0.5 rounded-full hover:bg-gray-300 dark:hover:bg-gray-500"
                    aria-label={`Remove ${term} from recent searches`}
                  >
                    <XIcon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                  </button>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}


      <div className="flex-grow overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {isLoading && page === 1 && (
          <div className="flex justify-center py-10"><LoadingSpinner /></div>
        )}
        {error && <p className="text-center text-red-500 dark:text-red-400 my-4">{error}</p>}
        
        {!isLoading && results.length === 0 && debouncedSearchTerm.trim() && !error && (
          <p className="text-center text-gray-600 dark:text-gray-300 py-10 text-lg">
            No results found for "{debouncedSearchTerm}".
          </p>
        )}
         {!debouncedSearchTerm.trim() && results.length === 0 && recentSearches.length === 0 && (
           <p className="text-center text-gray-600 dark:text-gray-300 py-10 text-lg">
            Start typing to search for videos.
          </p>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {results.map((video, index) => (
              <React.Fragment key={video.id}>
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

        {isLoading && page > 1 && (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        )}

        {!isLoading && hasMore && results.length > 0 && (
          <div className="text-center py-6">
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 bg-brand-orange text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-colors"
            >
              Load More Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
