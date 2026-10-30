// src/main.jsx - React Entry Point with Theme Initialization
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';

// Theme initialization
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    // Check system preference
    // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    //   document.documentElement.classList.add('dark');
    //   localStorage.setItem('theme', 'dark');
    // }
  }
};

// Initialize theme before rendering
initializeTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);