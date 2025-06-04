
import React, { useRef, useEffect, useState } from 'react';
import { Video, VideoPlatform } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { 
    HeartIcon, HeartFilledIcon, ShareIcon, LinkIcon, SendIcon, 
    SOCIAL_SHARE_PLATFORMS, VIDZLY_APP_URL, VolumeUpIcon, VolumeOffIcon 
} from '../constants'; 
import Modal from './Modal';
import { getYouTubeEmbedUrl } from '../utils/formatters';


interface FeedVideoItemProps {
  video: Video;
  isVisible: boolean; 
}

const FeedVideoItem: React.FC<FeedVideoItemProps> = ({ video, isVisible }) => {
  const videoRef = useRef<HTMLVideoElement>(null); // Only used for LOCAL platform now
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const currentIsFavorite = isFavorite(video.id);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // For LOCAL platform videos

  useEffect(() => {
    if (navigator.share) {
      setCanNativeShare(true);
    }
  }, []);

 useEffect(() => {
    const player = videoRef.current;
    if (video.platform !== VideoPlatform.LOCAL) { // Only apply to Local HTML5 videos
        return; 
    }
    if (!player) return;

    if (isVisible) {
      player.muted = isMuted;
      const playPromise = player.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn(`Autoplay for video ${video.id} was prevented: ${error.message}.`);
        });
      }
    } else {
      if (!player.paused) {
        player.pause();
      }
    }
  }, [isVisible, video.id, video.platform, isMuted]);
  
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIsFavorite) {
      removeFavorite(video.id);
    } else {
      addFavorite(video);
    }
  };

  const openShareModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareModalOpen(true);
  };
  
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // For YouTube, the link is to the video itself on YouTube
    if (video.platform === VideoPlatform.YOUTUBE && video.youtubeVideoId) {
        window.open(`https://www.youtube.com/watch?v=${video.youtubeVideoId}`, '_blank', 'noopener,noreferrer');
    } else {
        alert('Original video link is not available in this format.');
    }
  };

  const handleNativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = video.platform === VideoPlatform.YOUTUBE && video.youtubeVideoId 
        ? `https://www.youtube.com/watch?v=${video.youtubeVideoId}` 
        : window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: `${video.title} -- Shared via Vidzly ${VIDZLY_APP_URL}`,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error using native share:', error);
      }
    }
  };

  const handleSocialPlatformShare = (platformUrlPattern: string) => {
    const shareableUrl = video.platform === VideoPlatform.YOUTUBE && video.youtubeVideoId 
        ? `https://www.youtube.com/watch?v=${video.youtubeVideoId}` 
        : window.location.href;
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
  
  const handleVideoClick = () => {
    // Clicks on YouTube/Vimeo iframes are handled by the iframe content itself.
    if (video.platform === VideoPlatform.LOCAL) {
      const player = videoRef.current;
      if (player) {
        if (player.paused) {
          player.muted = isMuted;
          player.play().catch(error => console.warn("Play on click prevented:", error));
        } else {
          player.pause();
        }
      }
    }
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error(`Error loading video: ${video.videoUrl}`, e);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (video.platform === VideoPlatform.LOCAL) {
      const player = videoRef.current;
      if (player) {
        const newMutedState = !isMuted;
        player.muted = newMutedState;
        setIsMuted(newMutedState);
      }
    }
    // For YouTube/Vimeo, mute is handled by their player controls or API if we integrate deeper
  };

  // Construct the correct YouTube embed URL with autoplay and mute based on visibility
  let currentVideoUrl = video.videoUrl;
  if (video.platform === VideoPlatform.YOUTUBE && video.youtubeVideoId) {
    const params = new URLSearchParams();
    params.append('autoplay', isVisible ? '1' : '0');
    params.append('mute', '1'); // Always start muted for autoplay to work
    params.append('enablejsapi', '1');
    params.append('playsinline', '1');
    currentVideoUrl = `${getYouTubeEmbedUrl(video.youtubeVideoId)}?${params.toString()}`;
  } else if (video.platform === VideoPlatform.VIMEO) {
     const params = new URLSearchParams();
    params.append('autoplay', isVisible ? '1' : '0');
    params.append('muted', '1');
    params.append('playsinline', '1');
    params.append('autopause', '0'); // Prevent Vimeo from auto-pausing when another video plays
    currentVideoUrl = `${video.videoUrl}?${params.toString()}`; // Assuming video.videoUrl is already the player.vimeo.com URL
  }


  return (
    <div 
        className="relative w-full h-full bg-black flex items-center justify-center snap-start overflow-hidden"
        onClick={handleVideoClick}
    >
      {video.platform === VideoPlatform.YOUTUBE || video.platform === VideoPlatform.VIMEO ? (
        <iframe
          key={video.id + (isVisible ? '_visible' : '_hidden')} // Force re-render of iframe if visibility changes to apply autoplay
          src={currentVideoUrl}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full object-contain"
        ></iframe>
      ) : ( // For LOCAL platform
        <video
          ref={videoRef}
          src={video.videoUrl}
          loop 
          playsInline
          className="w-full h-full object-contain"
          poster={video.thumbnailUrl}
          preload="auto"
          aria-label={video.title}
          onError={handleVideoError}
          // muted attribute is controlled via JS
        >
          Your browser does not support the video tag.
        </video>
      )}

      <div className="absolute bottom-20 left-4 p-2 text-white bg-black bg-opacity-30 rounded-lg max-w-[calc(100%-6rem)]">
        <h3 className="font-semibold text-sm sm:text-base truncate" title={video.title}>{video.title}</h3>
        {video.uploader && (
            <p className="text-xs sm:text-sm text-gray-300 truncate" title={`Channel: ${video.uploader}`}>
              {video.uploader}
            </p>
        )}
        {video.views && <p className="text-xs sm:text-sm text-gray-400 truncate">{video.views}</p>}
      </div>

      <div className="absolute bottom-20 right-2 sm:right-4 flex flex-col space-y-3 sm:space-y-4">
        {/* Mute toggle only for Local videos now, YouTube/Vimeo use their own controls */}
        {video.platform === VideoPlatform.LOCAL && (
            <button
                onClick={toggleMute}
                className="p-2 sm:p-3 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
                title={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? <VolumeOffIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : <VolumeUpIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
        )}
        <button
          onClick={handleFavoriteToggle}
          className="p-2 sm:p-3 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors"
          aria-label={currentIsFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {currentIsFavorite ? <HeartFilledIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" /> : <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
        </button>
        {canNativeShare && (
          <button
            onClick={handleNativeShare}
            className="p-2 sm:p-3 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors"
            aria-label="Send video (native share)" title="Send video"
          > <SendIcon className="w-5 h-5 sm:w-6 sm:h-6" /> </button>
        )}
        <button
          onClick={openShareModal}
          className="p-2 sm:p-3 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors"
          aria-label="Share video via specific platform" title="Share video"
        > <ShareIcon className="w-5 h-5 sm:w-6 sm:h-6" /> </button>
        {/* Link to original YouTube video */}
        {(video.platform === VideoPlatform.YOUTUBE && video.youtubeVideoId) && (
            <button
            onClick={handleLinkClick}
            className="p-2 sm:p-3 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-colors"
            aria-label="View on YouTube" title="View on YouTube"
            > <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6" /> </button>
         )}
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

export default FeedVideoItem;