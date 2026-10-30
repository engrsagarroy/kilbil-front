// src/components/ThemeTest.jsx - Simple Theme Test Component
//import React from 'react';

const ThemeTest = () => {
  const testManualToggle = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      console.log('✅ Removed dark class - Light mode');
    } else {
      html.classList.add('dark');
      console.log('✅ Added dark class - Dark mode');
    }
    console.log('Current classes:', html.className);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-400 rounded-lg shadow-xl">
      <div className="space-y-3">
        <h3 className="font-bold text-gray-900 dark:text-gray-100">
          🧪 Theme Test Panel
        </h3>
        
        <div className="space-y-2 text-sm">
          <p className="text-gray-700 dark:text-gray-300">
            If you can read this, Tailwind is working!
          </p>
          
          <div className="p-2 bg-gray-600 dark:bg-gray-700 rounded">
            <p className="text-gray-900 dark:text-gray-100">
              This box changes color in dark mode
            </p>
          </div>
        </div>

        <button
          onClick={testManualToggle}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Manual Toggle (Check Console)
        </button>

        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <p>✅ If colors change = Tailwind works</p>
          <p>✅ Check console for logs</p>
          <p>✅ F12 to open DevTools</p>
        </div>
      </div>
    </div>
  );
};

export default ThemeTest;