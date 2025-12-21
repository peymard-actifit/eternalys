import { useState } from 'react';
import { authService } from '../services/authService';
import { authStore } from '../store/authStore';
import './AuthModal.css';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

type AuthMode = 'login' | 'register';

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
          onSuccess();
        }
      } else {
        const { user, error: registerError } = await authService.register(username, password);
        if (registerError) {
          setError(registerError);
        } else if (user) {
          authStore.login(user);
          onSuccess();
        }
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <div className="auth-header">
          <h2>{mode === 'login' ? '🔑 Connexion' : '📝 Inscription'}</h2>
          <p className="auth-subtitle">
            {mode === 'login' 
              ? 'Connectez-vous pour accéder à vos sauvegardes'
              : 'Créez un compte pour sauvegarder votre progression'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">👤 Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Entrez votre nom d'utilisateur"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">🔒 Mot de passe</label>
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
              <label htmlFor="confirmPassword">🔒 Confirmer le mot de passe</label>
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
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={isLoading}>
            {isLoading ? (
              <>⏳ Chargement...</>
            ) : mode === 'login' ? (
              <>🚀 Se connecter</>
            ) : (
              <>✨ Créer un compte</>
            )}
          </button>
        </form>

        <div className="auth-toggle">
          {mode === 'login' ? (
            <p>
              Pas encore de compte ?{' '}
              <button type="button" onClick={toggleMode} disabled={isLoading}>
                Inscrivez-vous
              </button>
            </p>
          ) : (
            <p>
              Déjà un compte ?{' '}
              <button type="button" onClick={toggleMode} disabled={isLoading}>
                Connectez-vous
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}



