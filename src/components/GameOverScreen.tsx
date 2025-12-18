import { gameStore } from '../store/gameStore';
import './GameOverScreen.css';

interface GameOverScreenProps {
  isVictory: boolean;
}

export function GameOverScreen({ isVictory }: GameOverScreenProps) {
  const handleReturnToMenu = () => {
    gameStore.resetGame();
  };

  return (
    <div className={`gameover-screen ${isVictory ? 'victory' : 'defeat'}`}>
      <div className="gameover-content">
        <div className="gameover-icon">
          {isVictory ? '🏆' : '💀'}
        </div>
        
        <h1 className="gameover-title">
          {isVictory ? 'VICTOIRE !' : 'DÉFAITE...'}
        </h1>
        
        <p className="gameover-message">
          {isVictory 
            ? 'Vous avez vaincu le boss et conquis le donjon ! Votre légende restera gravée dans les mémoires.'
            : 'Votre équipe a succombé aux ténèbres du donjon. Mais tout héros peut se relever...'}
        </p>

        <div className="gameover-decoration">
          <span className="deco-line"></span>
          <span className="deco-symbol">{isVictory ? '⚜️' : '✧'}</span>
          <span className="deco-line"></span>
        </div>

        <button className="menu-button" onClick={handleReturnToMenu}>
          <span className="button-icon">🏠</span>
          Retour au Menu
        </button>
      </div>
    </div>
  );
}




