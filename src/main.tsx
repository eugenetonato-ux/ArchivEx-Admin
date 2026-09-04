import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Enregistrer le Service Worker pour le support hors-ligne (PWA)
if ('serviceWorker' in navigator) {
  registerSW({
    onNeedRefresh() {
      console.log('Nouveau contenu disponible, veuillez rafraîchir la page.');
    },
    onOfflineReady() {
      console.log('L\'application est prête pour la navigation hors-ligne !');
    },
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
