// src/pages/Channel.jsx - Channel Page
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bell, Share2 } from 'lucide-react';
import VideoCard from '../components/VideoCard';

const Channel = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('videos');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Mock channel data
  const channelData = {
    id: id,
    name: 'Code Master',
    username: '@codemaster',
    subscribers: '1.2M',
    videoCount: 245,
    description: 'Welcome to Code Master! We create high-quality programming tutorials, coding challenges, and tech reviews. Join our community of developers and level up your coding skills!',
    banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=300&fit=crop',
    avatar: 'from-purple-400 to-pink-400',
  };

  // Mock videos
  const mockVideos = [
    {
      video_id: 1,
      title: 'Building a Full Stack App with React and Node.js',
      thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
      views: 1200000,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      duration: '15:30',
      username: 'codemaster',
    },
    {
      video_id: 2,
      title: 'Advanced React Patterns and Best Practices',
      thumbnail_url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop',
      views: 856000,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      duration: '22:15',
      username: 'codemaster',
    },
  ];

  const tabs = [
    { id: 'videos', label: 'Videos' },
    { id: 'shorts', label: 'Shorts' },
    { id: 'playlists', label: 'Playlists' },
    { id: 'about', label: 'About' },
  ];

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    // Here you would dispatch an action to subscribe/unsubscribe
  };

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-r from-purple-400 to-pink-400">
        <img
          src={channelData.banner}
          alt="Channel banner"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* Channel Info */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-12 sm:-mt-16 relative z-10">
          {/* Avatar */}
          <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br ${channelData.avatar} border-4 border-white flex items-center justify-center text-white text-5xl font-bold shadow-lg`}>
            {channelData.name.charAt(0)}
          </div>

          {/* Channel Details */}
          <div className="flex-1 pb-4">
            <h1 className="text-3xl font-bold mb-1">{channelData.name}</h1>
            <div className="flex flex-wrap items-center gap-2 text-gray-600 text-sm mb-3">
              <span>{channelData.username}</span>
              <span>•</span>
              <span>{channelData.subscribers} subscribers</span>
              <span>•</span>
              <span>{channelData.videoCount} videos</span>
            </div>
            <p className="text-gray-700 max-w-3xl line-clamp-2">
              {channelData.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pb-4">
            <button
              onClick={handleSubscribe}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                isSubscribed
                  ? 'bg-gray-200  dark:bg-gray-600 text-gray-700 hover:bg-gray-300'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {isSubscribed ? (
                <>
                  <Bell className="w-5 h-5 inline mr-2" />
                  Subscribed
                </>
              ) : (
                'Subscribe'
              )}
            </button>
            <button className="p-2 rounded-full bg-gray-200  dark:bg-gray-600 hover:bg-gray-300 transition">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mt-6">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 font-semibold transition ${
                  activeTab === tab.id
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === 'videos' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Uploads</h2>
              {mockVideos.length === 0 ? (
                <div className="text-center py-12 text-gray-600">
                  <p>No videos uploaded yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {mockVideos.map((video) => (
                    <VideoCard key={video.video_id} video={video} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'shorts' && (
            <div className="text-center py-12 text-gray-600">
              <p>No shorts available</p>
            </div>
          )}

          {activeTab === 'playlists' && (
            <div className="text-center py-12 text-gray-600">
              <p>No playlists created yet</p>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="max-w-4xl">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {channelData.description}
                  </p>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 text-sm">Joined</p>
                      <p className="font-semibold">Jan 15, 2020</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Total views</p>
                      <p className="font-semibold">45.2M</p>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Links</h3>
                  <div className="space-y-2">
                    <a href="#" className="block text-blue-600 hover:underline">
                      Website
                    </a>
                    <a href="#" className="block text-blue-600 hover:underline">
                      Twitter
                    </a>
                    <a href="#" className="block text-blue-600 hover:underline">
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Channel;