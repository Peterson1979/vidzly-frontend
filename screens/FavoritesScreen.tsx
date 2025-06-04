
import React from 'react';
import VideoCard from '../components/VideoCard';
import { useFavorites } from '../hooks/useFavorites';
import { Link } from 'react-router-dom';
import { ROUTES, HeartIcon } from '../constants';

const FavoritesScreen: React.FC = () => {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <HeartIcon className="w-24 h-24 text-muted-foreground mx-auto mb-6 dark:text-gray-600" />
        <h1 className="text-2xl font-bold text-foreground mb-4 dark:text-gray-100">No Favorites Yet</h1>
        <p className="text-muted-foreground mb-6 dark:text-gray-400">
          Start adding videos you love to see them here!
        </p>
        <Link
          to={ROUTES.HOME}
          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors font-semibold"
        >
          Discover Videos
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-foreground mb-8 dark:text-gray-100">My Favorites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.slice().sort((a,b) => b.favoritedDate - a.favoritedDate).map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesScreen;