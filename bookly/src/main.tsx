import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import App from './App'; // ✅ Correct
import 'bootstrap/dist/css/bootstrap.min.css'; // ✅ Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
