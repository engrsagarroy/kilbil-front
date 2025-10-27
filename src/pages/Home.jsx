// src/pages/Home.jsx - Professional Home Page
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideos } from '../redux/slices/videoSlice';
import VideoCard from '../components/VideoCard';
import { Sparkles } from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const { videos, loading, error } = useSelector((state) => state.video);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All', icon: '🎯' },
    { id: 'gaming', label: 'Gaming', icon: '🎮' },
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'education', label: 'Education', icon: '📚' },
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { id: 'news', label: 'News', icon: '📰' },
    { id: 'live', label: 'Live', icon: '🔴' },
    { id: 'fashion', label: 'Fashion', icon: '👗' },
    { id: 'cooking', label: 'Cooking', icon: '🍳' },
    // { id: 'travel', label: 'Travel', icon: '✈️' },
  ];

  useEffect(() => {
    dispatch(fetchVideos({ 
      category: selectedCategory === 'all' ? '' : selectedCategory,
      limit: 20 
    }));
  }, [dispatch, selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-800 border-t-blue-600"></div>
            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-blue-600 animate-pulse" />
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading awesome content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-2xl shadow-lg">
            <p className="font-semibold text-lg mb-1">Oops! Something went wrong</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      {/* Category Filter */}
      <div className="sticky top-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-30 transition-colors duration-200">
        <div className="flex gap-3 px-6 py-4 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`group flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.label}</span>
              {selectedCategory === category.id && (
                <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-20"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="px-6 py-8">
        {videos.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-6">
              <Sparkles className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">No videos found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or check back later for new content
            </p>
          </div>
        ) : (
          <>
            {/* Hero Video Section */}
            {videos.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                    <Sparkles className="w-5 h-5 text-white" />
                    <span className="text-white font-bold text-sm">Featured</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Trending Now</h2>
                </div>
                
                <div className="relative group cursor-pointer overflow-hidden rounded-3xl shadow-2xl">
                  <img
                    src={videos[0].thumbnail_url}
                    alt={videos[0].title}
                    className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 rounded-full mb-4">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-white text-xs font-semibold">LIVE</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3 line-clamp-2">{videos[0].title}</h3>
                    <div className="flex items-center gap-4 text-white/90">
                      <span className="font-medium">{videos[0].username}</span>
                      <span>•</span>
                      <span>{videos[0].views} views</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Video Grid */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {selectedCategory === 'all' ? 'Recommended' : `${categories.find(c => c.id === selectedCategory)?.label} Videos`}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                {videos.map((video) => (
                  <VideoCard key={video.video_id} video={video} />
                ))}
              </div>
            </div>

            {/* Load More Button */}
            {videos.length >= 20 && (
              <div className="text-center mt-12">
                <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all">
                  Load More Videos
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;