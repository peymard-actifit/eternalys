import { useState } from 'react';
import { gameStore } from '../store/gameStore';
import { VERSION } from '../version';
import { GameHistoryModal } from './GameHistoryModal';
import './MenuPage.css';

export function MenuPage() {
  const [showHistory, setShowHistory] = useState(false);

  const handleStart = () => {
    gameStore.startGame();
  };

  return (
    <div className="menu-page">
      <div className="menu-content">
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
    </div>
  );
}
