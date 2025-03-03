
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure the DOM is fully loaded before rendering
const root = document.getElementById('root');

if (!root) {
  console.error('Root element not found');
} else {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
