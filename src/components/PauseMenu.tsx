import { useEffect, useCallback, useState } from 'react';
import { gameStore } from '../store/gameStore';
import { authStore } from '../store/authStore';
import { saveGameToHistory } from '../lib/gameHistory';
import { SaveModal } from './SaveModal';
import './PauseMenu.css';

export function PauseMenu() {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const authState = authStore.getState();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && !showSaveModal) {
      e.preventDefault();
      gameStore.setState({ showPauseMenu: false });
    }
  }, [showSaveModal]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleResume = () => {
    gameStore.setState({ showPauseMenu: false });
  };

  const handleSave = () => {
    setShowSaveModal(true);
  };

  const handleRestart = () => {
    if (confirm('Êtes-vous sûr de vouloir recommencer ? Votre progression sera perdue.')) {
      const state = gameStore.getState();
      if (state.team.length > 0 && state.encounterCount > 0) {
        saveGameToHistory('abandoned', state.team, state.encounterCount, undefined, undefined, state.dungeonLevel);
      }
      gameStore.resetGame();
      gameStore.setState({ phase: 'character_select', showPauseMenu: false });
    }
  };

  const handleQuit = () => {
    if (confirm('Êtes-vous sûr de vouloir abandonner ? Cela comptera comme une défaite.')) {
      const state = gameStore.getState();
      if (state.team.length > 0) {
        saveGameToHistory('abandoned', state.team, state.encounterCount, undefined, undefined, state.dungeonLevel);
      }
      gameStore.setState({ phase: 'summary', showPauseMenu: false });
    }
  };

  const handleMainMenu = () => {
    if (confirm('Retourner au menu principal ? Votre progression sera perdue.')) {
      const state = gameStore.getState();
      if (state.team.length > 0 && state.encounterCount > 0) {
        saveGameToHistory('abandoned', state.team, state.encounterCount, undefined, undefined, state.dungeonLevel);
      }
      gameStore.resetGame();
      gameStore.setState({ showPauseMenu: false });
    }
  };

  return (
    <div className="pause-overlay">
      <div className="pause-menu">
        <div className="pause-header">
          <h2>⏸️ Pause</h2>
          <p className="pause-hint">Échap pour reprendre</p>
        </div>

        <div className="pause-buttons">
          <button className="pause-btn resume" onClick={handleResume}>
            ▶️ Reprendre
          </button>
          
          {authState.isAuthenticated && (
            <button className="pause-btn save" onClick={handleSave}>
              💾 Sauvegarder
            </button>
          )}
          
          <button className="pause-btn restart" onClick={handleRestart}>
            🔄 Recommencer la partie
          </button>
          
          <button className="pause-btn quit" onClick={handleQuit}>
            🏳️ Abandonner (défaite)
          </button>
          
          <button className="pause-btn menu" onClick={handleMainMenu}>
            🏠 Menu principal
          </button>
        </div>

        {!authState.isAuthenticated && (
          <div className="pause-save-hint">
            💡 Connectez-vous pour sauvegarder votre progression
          </div>
        )}

        <div className="pause-footer">
          <span className="game-title">Ethernalys</span>
        </div>
      </div>

      {showSaveModal && (
        <SaveModal 
          mode="save" 
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
}

