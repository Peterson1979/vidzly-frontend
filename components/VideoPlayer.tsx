import React from 'react';
import { Video, VideoPlatform } from '../types';

interface VideoPlayerProps {
  video: Video;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error(`Error loading video in VideoPlayer: ${video.videoUrl}`, e);
    // Here you could set a state to show a user-friendly error message
    // on the player itself if desired.
  };

  return (
    <div className="aspect-video w-full bg-black rounded-lg overflow-hidden shadow-xl">
      {video.platform === VideoPlatform.YOUTUBE || video.platform === VideoPlatform.VIMEO ? (
        <iframe
          src={video.videoUrl}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      ) : video.platform === VideoPlatform.LOCAL ? (
        <video
          src={video.videoUrl}
          controls
          className="w-full h-full bg-black"
          poster={video.thumbnailUrl}
          preload="metadata"
          aria-label={video.title}
          onError={handleVideoError}
        >
          Your browser does not support the video tag. Video source: {video.videoUrl}
        </video>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white p-4">
          <p className="text-center">
            Unsupported video platform: {video.platform}. <br/>
            Video URL: {video.videoUrl}
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;