import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <Router>
      <GoogleOAuthProvider clientId='512203607278-f1kmdb1k950tkfu6pm06taau94g8tap3.apps.googleusercontent.com'>
        <App />
      </GoogleOAuthProvider>
    </Router>

  </React.StrictMode>
);

