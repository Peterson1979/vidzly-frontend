
import React from 'react';
import { Link } from 'react-router-dom';
import { Video, VideoPlatform } from '../types';
import { HeartIcon, HeartFilledIcon, ROUTES } from '../constants';
import { useFavorites } from '../hooks/useFavorites'; 

interface VideoCardProps {
  video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favorites.some(fav => fav.id === video.id);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(video.id);
    } else {
      addFavorite(video);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl dark:bg-gray-800 flex flex-col">
      <Link 
        to={`${ROUTES.VIDEO_DETAIL_BASE}${video.id}`} 
        state={{ video: video }} 
        className="block flex flex-col flex-grow"
      >
        <div className="relative">
          <img 
            src={video.thumbnailUrl} 
            alt={video.title} 
            className="w-full h-48 object-cover"
            loading="lazy"
            onError={(e) => {
                const target = e.currentTarget;
                target.src = 'https://via.placeholder.com/480x360.png?text=Image+Not+Available';
                target.alt = `Error loading thumbnail for ${video.title}`;
                target.title = `Could not load thumbnail for: ${video.title}`;
                target.onerror = null; 
            }}
          />
          {video.duration && (
            <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {video.duration}
            </span>
          )}
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-2 right-2 p-1.5 sm:p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-red-500 hover:bg-opacity-75 transition-colors"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? <HeartFilledIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" /> : <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 truncate dark:text-gray-100" title={video.title}>
            {video.title}
          </h3>
          {video.uploader && ( // uploader is now YouTube channelTitle
            <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate dark:text-gray-400" title={video.uploader}>
              {video.uploader}
            </p>
          )}
          {/* Removed Reddit specific categoryId display */}
          {(video.views || video.uploadDate) && (
             <p className="text-xs text-muted-foreground dark:text-gray-500 mt-auto pt-1">
              {video.views}{video.views && video.uploadDate ? ' • ' : ''}{video.uploadDate}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;
