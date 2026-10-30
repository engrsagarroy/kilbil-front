// src/components/VideoCard.jsx - Professional Video Card Component
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, MoreVertical, Clock, Share2, ListPlus } from 'lucide-react';
import { formatDistanceToNow } from '../utils/helpers';
import { API_URL } from '../config';

const VideoCard = ({ video }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    id,
    title,
    thumbnail_url,
    username,
    full_name,
    views,
    created_at,
    duration,
  } = video;

  const formatViews = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count;
  };

  const getTimeAgo = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  return (
    <div className="group cursor-pointer">
      <Link to={`/watch/${id}`} className="block">
        {/* Thumbnail */}
        <div className="relative overflow-hidden rounded-2xl mb-3 bg-gray-200 dark:bg-gray-800">
          {/* Skeleton Loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800"></div>
          )}
          
          <img
            src={API_URL+ thumbnail_url || 'https://placehold.co/600x400'}
            alt={title}
            className={`w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = 'https://placehold.co/600x400';
              setImageLoaded(true);
            }}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-900 hover:bg-white transition-colors">
                <Play className="w-4 h-4" />
                Play Now
              </button>
              <button className="p-2 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                <ListPlus className="w-4 h-4 text-gray-900" />
              </button>
            </div>
          </div>

          {/* Duration Badge */}
          {duration && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/90 backdrop-blur-sm text-white text-xs font-semibold rounded-lg">
              {duration}
            </div>
          )}

          {/* Live Badge (if applicable) */}
          {video.is_live && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-red-600 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-bold">LIVE</span>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="flex gap-3">
          {/* Channel Avatar */}
          <div className="relative flex-shrink-0 mt-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm ring-2 ring-white dark:ring-gray-900 group-hover:scale-110 transition-transform">
              {username ? username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 blur-lg opacity-0 group-hover:opacity-50 transition-opacity"></div>
          </div>

          {/* Video Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors mb-1">
              {full_name || username}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium">{formatViews(views)} views</span>
              <span>•</span>
              <span>{getTimeAgo(created_at)}</span>
            </div>
          </div>

          {/* More Options */}
          <div className="relative flex-shrink-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowMenu(!showMenu);
              }}
              className="p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-600 dark:hover:bg-gray-800 rounded-full transition-all"
            >
              <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowMenu(false);
                  }}
                ></div>
                <div className="absolute right-0 top-10 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Save to Watch Later</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200">
                    <ListPlus className="w-4 h-4" />
                    <span className="text-sm">Add to Playlist</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;