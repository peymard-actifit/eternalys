import { useEffect, useCallback } from 'react';
import { gameStore } from '../store/gameStore';
import { saveGameToHistory } from '../lib/gameHistory';
import './PauseMenu.css';

export function PauseMenu() {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      gameStore.setState({ showPauseMenu: false });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleResume = () => {
    gameStore.setState({ showPauseMenu: false });
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

        <div className="pause-footer">
          <span className="game-title">Ethernalys</span>
        </div>
      </div>
    </div>
  );
}

