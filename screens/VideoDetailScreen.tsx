
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Video, VideoPlatform } from '../types';
import { 
    HeartIcon, HeartFilledIcon, ShareIcon, LinkIcon, SendIcon, ArrowLeftIcon, 
    SOCIAL_SHARE_PLATFORMS, ROUTES, VIDZLY_APP_URL, SparklesIcon 
} from '../constants'; 
import VideoPlayer from '../components/VideoPlayer';
import Modal from '../components/Modal';
import { useFavorites } from '../hooks/useFavorites';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateTagsForVideo } from '../services/geminiService';

const VideoDetailScreen: React.FC = () => {
  const { id: videoIdFromParams } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation(); 
  
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [tags, setTags] = useState<string[] | null>(null);
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  useEffect(() => {
    if (navigator.share) {
      setCanNativeShare(true);
    }
  }, []);

  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const currentIsFavorite = video ? isFavorite(video.id) : false;

  useEffect(() => {
    const videoFromState = location.state?.video as Video | undefined;
    if (videoIdFromParams && videoFromState && videoFromState.id === videoIdFromParams) {
        setVideo(videoFromState);
        setIsLoading(false);
    } else if (videoIdFromParams) {
        console.warn(`VideoDetailScreen: Video with id "${videoIdFromParams}" not found in location state. Detail view will show 'not found'. Implement fetchVideoDetailsById for direct navigation.`);
        setVideo(null);
        setIsLoading(false);
    } else {
        setVideo(null);
        setIsLoading(false);
    }
  }, [videoIdFromParams, location.state]);

  useEffect(() => {
    if (video && !tags && !isLoadingTags) {
      const fetchTags = async () => {
        setIsLoadingTags(true);
        try {
          const generatedTags = await generateTagsForVideo(video.title, video.description);
          setTags(generatedTags);
        } catch (error) {
          console.error("Failed to generate video tags:", error);
          setTags(null); // Explicitly set to null on error
        } finally {
          setIsLoadingTags(false);
        }
      };
      fetchTags();
    }
  }, [video, tags, isLoadingTags]);

  const handleFavoriteToggle = () => {
    if (!video) return;
    if (currentIsFavorite) {
      removeFavorite(video.id);
    } else {
      addFavorite(video);
    }
  };

  const openShareModal = () => {
    setIsShareModalOpen(true);
  };

  const handleNativeShare = async () => {
    if (!video || !video.youtubeVideoId) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: `${video.title} -- Shared via Vidzly ${VIDZLY_APP_URL}`,
          url: `https://www.youtube.com/watch?v=${video.youtubeVideoId}`,
        });
      } catch (error) {
        console.error('Error using native share:', error);
      }
    }
  };

  const handleSocialPlatformShare = (platformUrlPattern: string) => {
    if (!video || !video.youtubeVideoId) return;
    const shareableUrl = `https://www.youtube.com/watch?v=${video.youtubeVideoId}`;
    const title = video.title;
    const imageUrl = video.thumbnailUrl;

    const shareUrl = platformUrlPattern
      .replace('{URL}', encodeURIComponent(shareableUrl))
      .replace('{TITLE}', encodeURIComponent(title))
      .replace('{IMAGE_URL}', encodeURIComponent(imageUrl))
      .replace('{APP_URL}', encodeURIComponent(VIDZLY_APP_URL));
      
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    setIsShareModalOpen(false);
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading video details..." />;
  }

  if (!video) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Video not found</h1>
        <p className="text-muted-foreground dark:text-gray-400 mb-6">The video details could not be loaded. It might have been removed or the link is incorrect.</p>
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="mt-4 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors font-semibold"
        > Go to Home </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="container mx-auto px-0 sm:px-4 py-0 sm:py-6">
        <div className="relative mb-0 sm:mb-4">
            <button
                onClick={() => navigate(-1)} 
                className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 p-2 bg-black bg-opacity-60 text-white rounded-full hover:bg-opacity-75 transition-colors shadow-lg"
                aria-label="Go back"
            > <ArrowLeftIcon className="w-6 h-6" /> </button>
            <VideoPlayer video={video} />
        </div>

        <div className="px-4 sm:px-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 dark:text-gray-100">{video.title}</h1>
            <div className="flex flex-wrap items-center space-x-2 sm:space-x-4 text-sm text-muted-foreground mb-4 dark:text-gray-400">
            {video.uploader && <span>Channel: {video.uploader}</span>}
            {video.views && <span>&bull; {video.views}</span>}
            {video.uploadDate && <span>&bull; {video.uploadDate}</span>}
            </div>

            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={handleFavoriteToggle}
                    className="flex items-center space-x-2 px-4 py-2 bg-muted hover:bg-gray-300 text-foreground rounded-full transition-colors text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                > {currentIsFavorite ? <HeartFilledIcon className="w-5 h-5 text-red-500" /> : <HeartIcon className="w-5 h-5" />}
                    <span>{currentIsFavorite ? 'Favorited' : 'Favorite'}</span>
                </button>
                {canNativeShare && (
                    <button
                        onClick={handleNativeShare}
                        className="flex items-center space-x-2 px-4 py-2 bg-muted hover:bg-gray-300 text-foreground rounded-full transition-colors text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                        title="Send (Native Share)"
                    > <SendIcon className="w-5 h-5" /> <span>Send</span> </button>
                )}
                <button
                    onClick={openShareModal}
                    className="flex items-center space-x-2 px-4 py-2 bg-muted hover:bg-gray-300 text-foreground rounded-full transition-colors text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                > <ShareIcon className="w-5 h-5" /> <span>Share</span> </button>
                {video.platform === VideoPlatform.YOUTUBE && video.youtubeVideoId && (
                    <a
                        href={`https://www.youtube.com/watch?v=${video.youtubeVideoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-muted hover:bg-gray-300 text-foreground rounded-full transition-colors text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                        title="View on YouTube"
                    > <LinkIcon className="w-5 h-5" /> <span>View on YouTube</span> </a>
                )}
            </div>

            {video.description && (
              <div className="mb-6 prose dark:prose-invert max-w-none">
                  <h2 className="text-xl font-semibold text-foreground mb-2 dark:text-gray-100">Description</h2>
                  <p className="text-foreground whitespace-pre-line dark:text-gray-300">{video.description}</p>
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <SparklesIcon className="w-5 h-5 text-primary mr-2" />
                <h2 className="text-lg font-semibold text-foreground dark:text-gray-100">AI-Generated Tags:</h2>
              </div>
              {isLoadingTags && <LoadingSpinner size="sm" text="Generating tags..." />}
              {!isLoadingTags && tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-primary-light/20 text-primary-dark dark:bg-primary-dark/30 dark:text-primary-light text-xs font-medium rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {!isLoadingTags && (!tags || tags.length === 0) && (
                <p className="text-sm text-muted-foreground dark:text-gray-400">Could not generate tags for this video.</p>
              )}
            </div>
        </div>
      </div>

      <Modal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} title="Share Video">
        <div className="grid grid-cols-2 gap-4">
          {SOCIAL_SHARE_PLATFORMS.map(platform => (
            <button
              key={platform.name}
              onClick={() => handleSocialPlatformShare(platform.urlPattern)}
              className="flex flex-col items-center p-4 bg-muted hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
            > {platform.icon} <span className="mt-2 text-sm text-foreground dark:text-gray-200">{platform.name}</span> </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default VideoDetailScreen;