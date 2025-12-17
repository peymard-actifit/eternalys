import { useEffect, useState } from 'react';
import { gameStore } from '../store/gameStore';
import { GameState } from '../types/game.types';
import './EventModal.css';

export function EventModal() {
  const [state, setState] = useState<GameState>(gameStore.getState());
  
  useEffect(() => {
    return gameStore.subscribe(() => setState(gameStore.getState()));
  }, []);

  const { currentEvent } = state;
  
  if (!currentEvent) return null;

  const handleContinue = () => {
    gameStore.applyEvent(currentEvent);
  };

  const isPositive = currentEvent.type === 'positive';

  return (
    <div className="event-overlay">
      <div className={`event-modal ${isPositive ? 'positive' : 'negative'}`}>
        <div className="event-icon">
          {isPositive ? '✨' : '⚠️'}
        </div>
        
        <h2 className="event-title">{currentEvent.name}</h2>
        
        <div className="event-type">
          {isPositive ? '🍀 Événement Positif' : '💀 Événement Négatif'}
        </div>
        
        <p className="event-description">{currentEvent.description}</p>
        
        <div className="event-effect">
          <span className="effect-label">Effet :</span>
          <span className={`effect-value ${isPositive ? 'positive' : 'negative'}`}>
            {currentEvent.effect.type === 'heal' && `+${currentEvent.effect.value} PV`}
            {currentEvent.effect.type === 'damage' && `-${currentEvent.effect.value} PV`}
            {currentEvent.effect.type === 'buff_attack' && `+${currentEvent.effect.value} ⚔️ Attaque`}
            {currentEvent.effect.type === 'buff_magic_attack' && `+${currentEvent.effect.value} ✨ Attaque Magique`}
            {currentEvent.effect.type === 'buff_defense' && `+${currentEvent.effect.value} 🛡️ Défense`}
            {currentEvent.effect.type === 'debuff_attack' && `-${currentEvent.effect.value} ⚔️ Attaque`}
            {currentEvent.effect.type === 'debuff_magic_attack' && `-${currentEvent.effect.value} ✨ Attaque Magique`}
            {currentEvent.effect.type === 'debuff_defense' && `-${currentEvent.effect.value} 🛡️ Défense`}
          </span>
          <span className="effect-target">
            ({currentEvent.effect.target === 'all' ? 'Toute l\'équipe' :
              currentEvent.effect.target === 'random' ? 'Un membre aléatoire' :
              currentEvent.effect.target === 'weakest' ? 'Le plus faible' : 'Le plus fort'})
          </span>
        </div>
        
        <button className="continue-button" onClick={handleContinue}>
          Continuer l'exploration
        </button>
      </div>
    </div>
  );
}

