import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ROUTES } from '../constants';

const CategoryFeedScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-4 bg-background text-foreground">
      <button
        onClick={() => navigate(ROUTES.HOME)}
        className="absolute top-4 left-4 z-50 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
        aria-label="Go back to Home"
        title="Go to Home"
      >
        <ArrowLeftIcon className="w-6 h-6" />
      </button>
      <h1 className="text-2xl font-bold text-red-500 mb-4">Feature Not Available</h1>
      <p className="text-muted-foreground dark:text-gray-400 mb-6">
        The category-specific video feed is no longer available.
      </p>
      <button
        onClick={() => navigate(ROUTES.HOME)}
        className="mt-4 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors font-semibold"
      >
        Go to Home
      </button>
    </div>
  );
};

export default CategoryFeedScreen;
