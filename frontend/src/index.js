import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Optional: Basic global styles
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './authContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* Wrap App with AuthProvider */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);