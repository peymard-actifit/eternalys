import { useState, useEffect } from 'react';
import { authStore } from '../store/authStore';
import { authService } from '../services/authService';
import { canUseSupabase } from '../lib/supabase';
import { VERSION } from '../version';
import './WelcomePage.css';

interface WelcomePageProps {
  onEnterGame: () => void;
}

type AuthMode = 'welcome' | 'login' | 'register';

export function WelcomePage({ onEnterGame }: WelcomePageProps) {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authState, setAuthState] = useState(authStore.getState());

  const isOnline = canUseSupabase();

  useEffect(() => {
    return authStore.subscribe(() => setAuthState(authStore.getState()));
  }, []);

  // Si déjà connecté, entrer directement
  useEffect(() => {
    if (authState.isAuthenticated && authState.currentUser) {
      onEnterGame();
    }
  }, [authState.isAuthenticated, authState.currentUser, onEnterGame]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (username.length < 3) {
      setError('Le nom d\'utilisateur doit contenir au moins 3 caractères');
      return;
    }

    if (password.length < 4) {
      setError('Le mot de passe doit contenir au moins 4 caractères');
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        const { user, error: loginError } = await authService.login(username, password);
        if (loginError) {
          setError(loginError);
        } else if (user) {
          authStore.login(user);
          onEnterGame();
        }
      } else if (mode === 'register') {
        const { user, error: registerError } = await authService.register(username, password);
        if (registerError) {
          setError(registerError);
        } else if (user) {
          authStore.login(user);
          onEnterGame();
        }
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOfflineMode = () => {
    // Entrer en mode hors-ligne sans compte
    onEnterGame();
  };

  const renderWelcome = () => (
    <div className="welcome-content">
      <div className="welcome-logo">
        <span className="logo-icon">🏰</span>
      </div>
      
      <h1 className="welcome-title">Ethernalys</h1>
      <p className="welcome-subtitle">Donjon des Ombres Éternelles</p>
      
      <div className="welcome-decoration">
        <span className="rune">⚔️</span>
        <span className="line"></span>
        <span className="rune">🐉</span>
        <span className="line"></span>
        <span className="rune">💎</span>
      </div>

      <p className="welcome-description">
        Formez votre équipe de héros et explorez les profondeurs 
        d'un donjon mystérieux rempli de monstres et de trésors !
      </p>

      <div className="welcome-buttons">
        {isOnline ? (
          <>
            <button 
              className="welcome-btn primary"
              onClick={() => setMode('login')}
            >
              <span className="btn-icon">🔑</span>
              Se connecter
            </button>
            
            <button 
              className="welcome-btn secondary"
              onClick={() => setMode('register')}
            >
              <span className="btn-icon">📝</span>
              Créer un compte
            </button>
            
            <div className="separator">
              <span className="separator-line"></span>
              <span className="separator-text">ou</span>
              <span className="separator-line"></span>
            </div>
            
            <button 
              className="welcome-btn offline"
              onClick={handleOfflineMode}
            >
              <span className="btn-icon">🎮</span>
              Jouer hors-ligne
              <span className="btn-hint">(sans sauvegarde cloud)</span>
            </button>
          </>
        ) : (
          <>
            <div className="offline-notice">
              <span className="notice-icon">⚠️</span>
              <p>Base de données non configurée</p>
              <p className="notice-hint">Les fonctionnalités en ligne ne sont pas disponibles</p>
            </div>
            
            <button 
              className="welcome-btn primary large"
              onClick={handleOfflineMode}
            >
              <span className="btn-icon">🎮</span>
              Jouer hors-ligne
            </button>
          </>
        )}
      </div>

      <footer className="welcome-footer">
        <p>Créé par Antoine Eymard</p>
        <p className="version">v{VERSION}</p>
      </footer>
    </div>
  );

  const renderAuthForm = () => (
    <div className="auth-content">
      <button className="back-btn" onClick={() => { setMode('welcome'); setError(''); }}>
        ← Retour
      </button>
      
      <div className="auth-header">
        <span className="auth-icon">{mode === 'login' ? '🔑' : '📝'}</span>
        <h2>{mode === 'login' ? 'Connexion' : 'Inscription'}</h2>
        <p className="auth-subtitle">
          {mode === 'login' 
            ? 'Connectez-vous pour accéder à vos sauvegardes'
            : 'Créez un compte pour sauvegarder votre progression'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">
            <span className="label-icon">👤</span>
            Nom d'utilisateur
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Entrez votre nom d'utilisateur"
            disabled={isLoading}
            autoComplete="username"
            autoFocus
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">
            <span className="label-icon">🔒</span>
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
            disabled={isLoading}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </div>

        {mode === 'register' && (
          <div className="form-group">
            <label htmlFor="confirmPassword">
              <span className="label-icon">🔒</span>
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirmez votre mot de passe"
              disabled={isLoading}
              autoComplete="new-password"
            />
          </div>
        )}

        {error && (
          <div className="auth-error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="loading-spinner">⏳</span>
              Chargement...
            </>
          ) : mode === 'login' ? (
            <>
              <span className="btn-icon">🚀</span>
              Se connecter
            </>
          ) : (
            <>
              <span className="btn-icon">✨</span>
              Créer mon compte
            </>
          )}
        </button>
      </form>

      <div className="auth-toggle">
        {mode === 'login' ? (
          <p>
            Pas encore de compte ?{' '}
            <button 
              type="button" 
              onClick={() => { setMode('register'); setError(''); }}
              disabled={isLoading}
            >
              Inscrivez-vous
            </button>
          </p>
        ) : (
          <p>
            Déjà un compte ?{' '}
            <button 
              type="button" 
              onClick={() => { setMode('login'); setError(''); }}
              disabled={isLoading}
            >
              Connectez-vous
            </button>
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="welcome-page">
      <div className="welcome-background">
        <div className="bg-pattern"></div>
        <div className="bg-glow"></div>
      </div>
      
      <div className="welcome-container">
        {mode === 'welcome' ? renderWelcome() : renderAuthForm()}
      </div>
    </div>
  );
}

