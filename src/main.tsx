
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add this for debugging
console.log("Main.tsx is executing");

// Ensure the DOM is fully loaded before rendering
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM is loaded, rendering app");
  const root = document.getElementById('root');

  if (!root) {
    console.error('Root element not found');
  } else {
    console.log("Found root element, rendering React app");
    createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
});
