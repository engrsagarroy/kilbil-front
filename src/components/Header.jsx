// src/components/Header.jsx - Professional Header Component with Theme Toggle
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Search, Upload, Bell, User, LogOut, Moon, Sun, Settings, History, Clock } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import { toggleTheme } from '../redux/slices/themeSlice';
import Logo from './logo';

const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    navigate('/');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());

    console.log("mode",mode);
  };

  const notifications = [
    { id: 1, text: 'New video from Code Master', time: '2 hours ago', unread: true },
    { id: 2, text: 'Someone liked your comment', time: '5 hours ago', unread: true },
    { id: 3, text: 'React Pro uploaded a new video', time: '1 day ago', unread: false },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50 transition-colors duration-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-600 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
          <Link to="/" className="flex items-center gap-2 group">

            <Logo />
            <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Premium</div>

          </Link>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-2xl mx-4 sm:mx-8">
          <form onSubmit={handleSearch} className="relative">
            <div className={`flex items-center transition-all duration-200 ${searchFocused
              ? 'ring-2 ring-blue-500 dark:ring-blue-400'
              : 'ring-1 ring-gray-300 dark:ring-gray-700'
              } rounded-full overflow-hidden`}>
              <input
                type="text"
                placeholder="Search videos, channels..."
                className="flex-1 px-6 py-2.5 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-gray-600 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border-l border-gray-300 dark:border-gray-700"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            className="p-2.5 hover:bg-gray-600 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Toggle theme"
          >
            {mode === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {isAuthenticated ? (
            <>
              {/* Upload Button */}
              <Link
                to="/upload"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-full hover:from-red-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl font-medium"
                title="Upload Video"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden md:inline">Upload</span>
              </Link>

              {/* Mobile Upload */}
              <Link
                to="/upload"
                className="sm:hidden p-2.5 hover:bg-gray-600 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <Upload className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 hover:bg-gray-600 dark:hover:bg-gray-800 rounded-full transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  {notifications.some(n => n.unread) && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white dark:ring-gray-900"></span>
                  )}
                </button>

                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotifications(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notif) => (
                          <button
                            key={notif.id}
                            className={`w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left ${notif.unread ? 'bg-blue-50 dark:bg-gray-700/50' : ''
                              }`}
                          >
                            <p className="text-sm text-gray-900 dark:text-gray-100">{notif.text}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.time}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold hover:shadow-lg transition-all ring-2 ring-white dark:ring-gray-900"
                  aria-label="User menu"
                >
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{user?.full_name || user?.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to={`/channel/${user?.user_id}`}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4" />
                          <span className="text-sm font-medium">Your Channel</span>
                        </Link>
                        <Link
                          to="/history"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <History className="w-4 h-4" />
                          <span className="text-sm font-medium">Watch History</span>
                        </Link>
                        <Link
                          to="/watch-later"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">Watch Later</span>
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-sm font-medium">Settings</span>
                        </Link>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;