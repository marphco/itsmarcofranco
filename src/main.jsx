import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initGA } from './lib/ga.js'

if (import.meta.env.PROD) {
  initGA(); // in dev non traccia
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);