// src/App.jsx - Main React Component (Fixed Theme)
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

// Import components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import VideoPlayer from './pages/VideoPlayer';
import SearchResults from './pages/SearchResults';
import Channel from './pages/Channel';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';

import LuluUpload from './pages/LuluUpload';
//import ThemeTest from './components/ThemeTest'; // Theme test component

import LuluVideoPlayer from './pages/LuluVideoPlayer';

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Theme Test Panel - Remove this after testing */}
      {/* <ThemeTest /> */}

      <div className="flex pt-16">
        <Sidebar isOpen={sidebarOpen} />

        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:id" element={<VideoPlayer />} />

            <Route path="/luluwatch/:fileCode" element={<LuluVideoPlayer />} />

            <Route path="/search" element={<SearchResults />} />
            <Route path="/channel/:id" element={<Channel />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/lupload" element={<LuluUpload />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
};

export default App;