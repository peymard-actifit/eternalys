import { useState, useEffect } from 'react';
import { gameStore } from '../store/gameStore';
import { authStore } from '../store/authStore';
import { authService } from '../services/authService';
import { VERSION } from '../version';
import { GameHistoryModal } from './GameHistoryModal';
import { AuthModal } from './AuthModal';
import { SaveModal } from './SaveModal';
import { AdminPanel } from './AdminPanel';
import './MenuPage.css';

export function MenuPage() {
  const [showHistory, setShowHistory] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showSave, setShowSave] = useState<'save' | 'load' | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [authState, setAuthState] = useState(authStore.getState());

  useEffect(() => {
    // S'assurer que le compte admin existe
    authService.ensureAdminExists();
    
    // S'abonner aux changements d'auth
    return authStore.subscribe(() => setAuthState(authStore.getState()));
  }, []);

  const handleStart = () => {
    gameStore.startGame();
  };

  const handleLogout = () => {
    authStore.logout();
  };

  const handleLoadGame = (gameState: object) => {
    // Charger l'état du jeu sauvegardé
    gameStore.setState(gameState as any);
  };

  const { currentUser, isAuthenticated } = authState;

  return (
    <div className="menu-page">
      <div className="menu-content">
        {/* Barre utilisateur */}
        <div className="user-bar">
          {isAuthenticated && currentUser ? (
            <div className="user-info">
              <span className="user-name">
                {currentUser.is_admin ? '👑 ' : '👤 '}
                {currentUser.username}
              </span>
              <div className="user-actions">
                {currentUser.is_admin && (
                  <button className="user-btn admin" onClick={() => setShowAdmin(true)}>
                    ⚙️ Admin
                  </button>
                )}
                <button className="user-btn logout" onClick={handleLogout}>
                  🚪 Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <button className="login-btn" onClick={() => setShowAuth(true)}>
              🔑 Connexion / Inscription
            </button>
          )}
        </div>

        <div className="title-section">
          <h1 className="game-title">Ethernalys</h1>
          <p className="game-subtitle">Donjon des Ombres Éternelles</p>
        </div>

        <div className="menu-decoration">
          <span className="rune">⚔️</span>
          <span className="line"></span>
          <span className="rune">🏰</span>
          <span className="line"></span>
          <span className="rune">🐉</span>
        </div>

        <p className="game-description">
          Formez votre équipe de héros et explorez les profondeurs 
          d'un donjon mystérieux. Affrontez des monstres, découvrez 
          des trésors et préparez-vous à affronter le boss final !
        </p>

        <div className="menu-buttons">
          <button className="start-button" onClick={handleStart}>
            <span className="button-icon">⚡</span>
            NOUVELLE PARTIE
          </button>

          {isAuthenticated && (
            <>
              <button className="save-button" onClick={() => setShowSave('load')}>
                <span className="button-icon">📂</span>
                CHARGER UNE PARTIE
              </button>
            </>
          )}

          <button className="history-button" onClick={() => setShowHistory(true)}>
            <span className="button-icon">📜</span>
            HISTORIQUE
          </button>
        </div>

        <div className="menu-info">
          <p>🎮 Ethernalys - Jeu de rôle</p>
        </div>
      </div>

      <footer className="menu-footer">
        <p>Créé par Antoine Eymard</p>
        <p className="version-tag">v{VERSION}</p>
      </footer>

      {showHistory && <GameHistoryModal onClose={() => setShowHistory(false)} />}
      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)} 
          onSuccess={() => setShowAuth(false)} 
        />
      )}
      {showSave && (
        <SaveModal 
          mode={showSave} 
          onClose={() => setShowSave(null)}
          onLoad={handleLoadGame}
        />
      )}
      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
}

