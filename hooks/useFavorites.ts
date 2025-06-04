
import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { Video, FavoriteVideo } from '../types';
import { LOCAL_STORAGE_KEYS } from '../constants';

export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage<FavoriteVideo[]>(LOCAL_STORAGE_KEYS.FAVORITE_VIDEOS, []);

  const addFavorite = useCallback((video: Video) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.find(fav => fav.id === video.id)) {
        return prevFavorites; // Already favorited
      }
      return [...prevFavorites, { ...video, favoritedDate: Date.now() }];
    });
  }, [setFavorites]);

  const removeFavorite = useCallback((videoId: string) => {
    setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== videoId));
  }, [setFavorites]);

  const isFavorite = useCallback((videoId: string) => {
    return favorites.some(fav => fav.id === videoId);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite };
};