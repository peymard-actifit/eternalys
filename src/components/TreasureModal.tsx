import { useEffect, useState } from 'react';
import { Character } from '../types/game.types';
import { Treasure, getRarityColor, getRarityLabel, applyTreasureEffect } from '../data/treasures';
import './TreasureModal.css';

interface TreasureModalProps {
  treasure: Treasure;
  team: Character[];
  onClose: (selectedCharacter: Character, effects: string[]) => void;
}

export function TreasureModal({ treasure, team, onClose }: TreasureModalProps) {
  const [isRevealing, setIsRevealing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealing(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Permettre de donner des objets à tous les personnages, y compris les vaincus
  const allTeam = team;

  // Sélectionner un personnage ET appliquer l'effet directement (pas de double validation)
  const handleSelectCharacter = (character: Character) => {
    // Appliquer l'effet du trésor
    const effects = applyTreasureEffect(treasure, character);
    // Fermer le modal immédiatement
    onClose(character, effects);
  };

  return (
    <div className="treasure-modal-overlay">
      <div className={`treasure-modal ${treasure.rarity}`}>
        <div className="treasure-header">
          <h2>✨ Trésor Découvert ! ✨</h2>
        </div>

        <div className={`treasure-reveal ${isRevealing ? 'revealing' : 'revealed'}`}>
          <div 
            className="treasure-icon-container"
            style={{ '--rarity-color': getRarityColor(treasure.rarity) } as React.CSSProperties}
          >
            <span className="treasure-icon">{treasure.icon}</span>
            <div className="treasure-glow"></div>
          </div>

          <div className="treasure-info">
            <h3 
              className="treasure-name"
              style={{ color: getRarityColor(treasure.rarity) }}
            >
              {treasure.name}
            </h3>
            <span 
              className="treasure-rarity"
              style={{ 
                backgroundColor: getRarityColor(treasure.rarity),
                color: treasure.rarity === 'legendary' ? '#1a1a1a' : 'white'
              }}
            >
              {getRarityLabel(treasure.rarity)}
            </span>
            <p className="treasure-description">{treasure.description}</p>
          </div>
        </div>

        <div className="treasure-selection">
          <h4>🎯 Cliquez pour attribuer :</h4>
          <div className="character-choices">
            {allTeam.map(character => (
              <button
                key={character.id}
                className={`character-choice ${character.hp <= 0 ? 'defeated' : ''}`}
                onClick={() => handleSelectCharacter(character)}
              >
                <span className="choice-portrait">{character.portrait}</span>
                {character.hp <= 0 && <span className="defeated-overlay">💀</span>}
                <div className="choice-info">
                  <span className="choice-name">{character.name}</span>
                  <span className="choice-class">{character.class}</span>
                  <div className="choice-hp">
                    <span className={character.hp <= 0 ? 'hp-dead' : ''}>
                      {character.hp <= 0 ? '💀 Vaincu' : `❤️ ${character.hp}/${character.maxHp}`}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
