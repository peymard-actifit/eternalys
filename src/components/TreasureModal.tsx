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
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [appliedEffects, setAppliedEffects] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealing(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Permettre de donner des objets à tous les personnages, y compris les vaincus
  const allTeam = team;

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleConfirm = () => {
    if (selectedCharacter) {
      // Appliquer l'effet du trésor
      const effects = applyTreasureEffect(treasure, selectedCharacter);
      setAppliedEffects(effects);
      setShowConfirmation(true);
    }
  };

  const handleFinish = () => {
    if (selectedCharacter) {
      onClose(selectedCharacter, appliedEffects);
    }
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

        {!showConfirmation ? (
          <>
            <div className="treasure-selection">
              <h4>🎯 Choisissez le bénéficiaire :</h4>
              <div className="character-choices">
                {allTeam.map(character => (
                  <button
                    key={character.id}
                    className={`character-choice ${selectedCharacter?.id === character.id ? 'selected' : ''} ${character.hp <= 0 ? 'defeated' : ''}`}
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
                      <div className="choice-stats-grid">
                        <span title="Classe d'Armure">🛡️ CA {character.armorClass || 10}</span>
                        <span title="Niveau">📈 Niv. {character.level || 1}</span>
                        <span title="Maîtrise">🎯 +{character.proficiencyBonus || 2}</span>
                      </div>
                    </div>
                    {selectedCharacter?.id === character.id && (
                      <span className="choice-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button 
              className="treasure-btn"
              onClick={handleConfirm}
              disabled={!selectedCharacter}
            >
              {selectedCharacter 
                ? `🎁 Donner à ${selectedCharacter.name}` 
                : '👆 Sélectionnez un personnage'}
            </button>
          </>
        ) : (
          <>
            <div className="treasure-assignment">
              <div className="assigned-to">
                <span className="label">Attribué à :</span>
                <div className="character-badge">
                  <span className="char-portrait">{selectedCharacter?.portrait}</span>
                  <div className="char-info">
                    <span className="char-name">{selectedCharacter?.name}</span>
                    <span className="char-class">{selectedCharacter?.class}</span>
                  </div>
                </div>
              </div>

              {appliedEffects.length > 0 && (
                <div className="applied-effects">
                  <span className="effects-label">Bonus appliqués :</span>
                  <div className="effects-list">
                    {appliedEffects.map((effect, i) => (
                      <span key={i} className="effect-tag">
                        ✓ {effect}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="treasure-btn" onClick={handleFinish}>
              🎒 Continuer l'aventure
            </button>
          </>
        )}
      </div>
    </div>
  );
}
