import { YouTubeVideo } from '../types';
import { MOCK_API_DELAY } from '../constants';

export const allMockVideos: YouTubeVideo[] = [ // Added export
  {
    id: 'dQw4w9WgXcQ',
    title: 'Ultimate Compilation of Cute Cats',
    description: 'A heartwarming collection of the funniest and most adorable cat moments. Guaranteed to make you smile!',
    thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    channelTitle: 'Cool Cat Vids',
    viewCount: '1.2M views',
    publishDate: '2 days ago',
  },
  {
    id: '3JZ_D3ELwOQ',
    title: 'Learn React in 1 Hour (2024 Edition)',
    description: 'A comprehensive tutorial for beginners to get started with React.js. Covers hooks, state, props, and more!',
    thumbnailUrl: 'https://i.ytimg.com/vi/3JZ_D3ELwOQ/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    channelTitle: 'DevSimplified',
    viewCount: '500K views',
    publishDate: '1 week ago',
  },
  {
    id: 'ysz5S6PUM-U',
    title: 'Amazing Space Discoveries Last Month',
    description: 'Explore the latest breakthroughs in astronomy and space exploration. What new wonders has the universe revealed?',
    thumbnailUrl: 'https://i.ytimg.com/vi/ysz5S6PUM-U/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U', 
    channelTitle: 'Cosmic Explorer',
    viewCount: '750K views',
    publishDate: '3 days ago',
  },
  {
    id: 'GaL9g5ERRtE',
    title: 'Top 10 Hidden Gems in Europe for Budget Travelers',
    description: 'Discover breathtaking destinations in Europe that won\'t break the bank. Your next adventure awaits!',
    thumbnailUrl: 'https://i.ytimg.com/vi/GaL9g5ERRtE/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=GaL9g5ERRtE',
    channelTitle: 'Budget Wanderer',
    viewCount: '300K views',
    publishDate: '5 days ago',
  },
  {
    id: 'kqtD5dpn9C8',
    title: 'Mastering Python: Advanced Techniques',
    description: 'Take your Python skills to the next level with these advanced tips and tricks. For experienced developers.',
    thumbnailUrl: 'https://i.ytimg.com/vi/kqtD5dpn9C8/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
    channelTitle: 'CodeMaster',
    viewCount: '420K views',
    publishDate: '1 month ago',
  },
  {
    id: 'Lpjcm1F8tY8',
    title: 'Epic Fail Compilation: Try Not To Laugh!',
    description: 'A hilarious collection of fails from around the web. Get ready for some serious laughter!',
    thumbnailUrl: 'https://i.ytimg.com/vi/Lpjcm1F8tY8/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=Lpjcm1F8tY8',
    channelTitle: 'Fail Central',
    viewCount: '2.5M views',
    publishDate: '4 hours ago',
  },
   {
    id: '5q87K1W4XjM',
    title: 'Future of AI: Predictions for 2030',
    description: 'Experts discuss the future trajectory of Artificial Intelligence and its potential impact on society by 2030.',
    thumbnailUrl: 'https://i.ytimg.com/vi/5q87K1W4XjM/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=5q87K1W4XjM',
    channelTitle: 'TechForward',
    viewCount: '900K views',
    publishDate: '6 days ago',
  },
  {
    id: 'G8_QfXk4iR8',
    title: 'DIY Home Renovation on a Budget',
    description: 'Transform your living space without spending a fortune. Creative ideas and practical tips for home improvement.',
    thumbnailUrl: 'https://i.ytimg.com/vi/G8_QfXk4iR8/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=G8_QfXk4iR8',
    channelTitle: 'HomeCrafts',
    viewCount: '210K views',
    publishDate: '2 weeks ago',
  }
];

const ITEMS_PER_PAGE = 6;

export const mockFetchVideos = (
  searchTerm: string, 
  page: number, 
  count: number = ITEMS_PER_PAGE
): Promise<YouTubeVideo[]> => {
  console.log(`Fetching videos for term: "${searchTerm}", page: ${page}, count: ${count}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      let results = allMockVideos;
      if (searchTerm) {
        results = allMockVideos.filter(video => 
          video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      const startIndex = (page - 1) * count; // Use count for pagination logic
      const endIndex = startIndex + count;
      const paginatedResults = results.slice(startIndex, endIndex);
      
      resolve(paginatedResults);
    }, MOCK_API_DELAY);
  });
};