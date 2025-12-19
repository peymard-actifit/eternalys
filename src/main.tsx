import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Fonction pour afficher les erreurs
function showError(title: string, message: string, stack?: string) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #ff6b6b; background: linear-gradient(135deg, #1a1a2e, #16213e); min-height: 100vh; box-sizing: border-box;">
        <h1 style="margin-bottom: 1rem; font-size: 1.5rem;">❌ ${title}</h1>
        <p style="margin: 0.5rem 0; word-break: break-word;"><strong>Message:</strong> ${message}</p>
        ${stack ? `<pre style="background: rgba(0,0,0,0.3); padding: 15px; overflow: auto; font-size: 0.75rem; border-radius: 8px; margin: 1rem 0; white-space: pre-wrap; word-break: break-all;">${stack}</pre>` : ''}
        <div style="display: flex; gap: 10px; margin-top: 1.5rem; flex-wrap: wrap;">
          <button onclick="location.reload()" style="padding: 12px 24px; cursor: pointer; background: #9b59b6; border: none; color: white; border-radius: 8px; font-size: 1rem;">🔄 Recharger</button>
          <button onclick="localStorage.clear(); sessionStorage.clear(); location.reload()" style="padding: 12px 24px; cursor: pointer; background: #e74c3c; border: none; color: white; border-radius: 8px; font-size: 1rem;">🗑️ Effacer le cache</button>
        </div>
        <p style="margin-top: 2rem; opacity: 0.6; font-size: 0.8rem;">Si l'erreur persiste, essayez "Effacer le cache"</p>
      </div>
    `;
  }
}

// Gestionnaire d'erreurs global
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', { message, source, lineno, colno, error });
  showError(
    'Erreur de chargement',
    String(message),
    error?.stack || `Source: ${source}\nLigne: ${lineno}:${colno}`
  );
  return true;
};

// Gestionnaire de promesses non gérées
window.onunhandledrejection = function(event) {
  console.error('Unhandled Promise rejection:', event.reason);
  // Ne pas afficher d'erreur pour les rejections de promesse mineures
  // car elles peuvent être des erreurs réseau normales
};

// Démarrage de l'application avec gestion robuste des erreurs
const startApp = async () => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      throw new Error('Element #root non trouvé dans le DOM');
    }

    // Attendre que le DOM soit prêt
    if (document.readyState !== 'complete') {
      await new Promise<void>(resolve => {
        window.addEventListener('load', () => resolve());
      });
    }

    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  } catch (error) {
    console.error('Erreur lors du montage de React:', error);
    showError(
      'Erreur de démarrage',
      error instanceof Error ? error.message : String(error),
      error instanceof Error ? error.stack : undefined
    );
  }
};

startApp();




