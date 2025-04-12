import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';    // Importing App component
import './index.css';       // (optional) if you have any CSS

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />   {/* Rendering the App component */}
  </React.StrictMode>
);
