import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Gestionnaire d'erreurs global
window.onerror = function(message, source, lineno, colno, error) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif; color: #ff4444; background: #1a1a1a; min-height: 100vh;">
        <h1>❌ Erreur de chargement</h1>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Source:</strong> ${source}</p>
        <p><strong>Ligne:</strong> ${lineno}:${colno}</p>
        <pre style="background: #333; padding: 10px; overflow: auto;">${error?.stack || 'Pas de stack trace'}</pre>
        <button onclick="location.reload()" style="padding: 10px 20px; cursor: pointer;">Recharger</button>
      </div>
    `;
  }
  return true;
};

// Gestionnaire de promesses non gérées
window.onunhandledrejection = function(event) {
  console.error('Unhandled Promise rejection:', event.reason);
};

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Element #root non trouvé dans le DOM');
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} catch (error) {
  console.error('Erreur lors du montage de React:', error);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif; color: #ff4444; background: #1a1a1a; min-height: 100vh;">
        <h1>❌ Erreur de démarrage</h1>
        <p>${error instanceof Error ? error.message : String(error)}</p>
        <pre style="background: #333; padding: 10px; overflow: auto;">${error instanceof Error ? error.stack : ''}</pre>
        <button onclick="location.reload()" style="padding: 10px 20px; cursor: pointer;">Recharger</button>
      </div>
    `;
  }
}




