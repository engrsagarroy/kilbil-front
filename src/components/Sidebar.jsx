// src/components/Sidebar.jsx - Professional Sidebar Component
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Library, History, Clock, ThumbsUp, PlaySquare, Flame, Music, Gamepad2, Trophy, Lightbulb, Newspaper, Tv, ChefHat } from 'lucide-react';
import { useSelector } from 'react-redux';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const isActive = (path) => location.pathname === path;

  const mainMenuItems = [
    { icon: Home, label: 'Home', path: '/', gradient: 'from-red-500 to-pink-500' },
    { icon: TrendingUp, label: 'Trending', path: '/trending', gradient: 'from-orange-500 to-red-500' },
    { icon: Library, label: 'Library', path: '/library', gradient: 'from-purple-500 to-pink-500' },
  ];

  const libraryItems = [
    { icon: History, label: 'History', path: '/history' },
    { icon: Clock, label: 'Watch Later', path: '/watch-later' },
    { icon: ThumbsUp, label: 'Liked Videos', path: '/liked' },
    { icon: PlaySquare, label: 'Playlists', path: '/playlists' },
  ];

  const exploreItems = [
    { icon: Flame, label: 'Trending', path: '/trending', color: 'text-orange-500' },
    { icon: Music, label: 'Music', path: '/category/music', color: 'text-pink-500' },
    { icon: Gamepad2, label: 'Gaming', path: '/category/gaming', color: 'text-purple-500' },
    { icon: Trophy, label: 'Sports', path: '/category/sports', color: 'text-blue-500' },
    { icon: Lightbulb, label: 'Education', path: '/category/education', color: 'text-yellow-500' },
    { icon: Newspaper, label: 'News', path: '/category/news', color: 'text-red-500' },
    { icon: Tv, label: 'Entertainment', path: '/category/entertainment', color: 'text-indigo-500' },
    { icon: ChefHat, label: 'Cooking', path: '/category/cooking', color: 'text-green-500' },
  ];

  const subscriptions = [
    { name: 'Code Master', avatar: 'from-purple-400 to-pink-500', subscribers: '1.2M' },
    { name: 'React Pro', avatar: 'from-blue-400 to-cyan-500', subscribers: '856K' },
    { name: 'Database Guru', avatar: 'from-green-400 to-emerald-500', subscribers: '524K' },
    { name: 'CSS Wizard', avatar: 'from-yellow-400 to-orange-500', subscribers: '2.1M' },
    { name: 'Backend Dev', avatar: 'from-red-400 to-rose-500', subscribers: '743K' },
  ];

  if (!isOpen) return null;

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto z-40 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent transition-colors duration-200">
      <nav className="py-3">
        {/* Main Menu */}
        <div className="mb-2 px-3">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r ' + item.gradient + ' text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'animate-pulse' : ''}`} />
                <span className="font-medium">{item.label}</span>
                {active && (
                  <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-xl blur-xl opacity-20"></div>
                )}
              </Link>
            );
          })}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 my-3"></div>

        {/* Library Section */}
        {isAuthenticated && (
          <>
            <div className="px-3 mb-2">
              <h3 className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Your Library
              </h3>
              {libraryItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-4 px-4 py-2.5 rounded-xl transition-colors ${
                      active
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 my-3"></div>

            {/* Subscriptions */}
            <div className="px-3 mb-2">
              <h3 className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Subscriptions
              </h3>
              <div className="space-y-1">
                {subscriptions.map((sub) => (
                  <button
                    key={sub.name}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className={`relative w-7 h-7 rounded-full bg-gradient-to-br ${sub.avatar} flex-shrink-0 ring-2 ring-white dark:ring-gray-900`}>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{sub.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{sub.subscribers}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 my-3"></div>
          </>
        )}

        {/* Explore */}
        <div className="px-3 mb-2">
          <h3 className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Explore
          </h3>
          <div className="space-y-1">
            {exploreItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-4 px-4 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                >
                  <Icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white font-medium transition-colors">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 my-3"></div>

        {/* Footer */}
        <div className="px-7 py-4 text-xs text-gray-500 dark:text-gray-400 space-y-3">
          <div className="flex flex-wrap gap-2">
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">About</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Press</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Copyright</a>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Contact</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Creators</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Advertise</a>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Terms</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Policy</a>
          </div>
          <p className="text-gray-400 dark:text-gray-500 font-medium pt-2">© 2025 VidStream</p>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;