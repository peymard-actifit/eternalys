// =============================================================================
// MODAL DE LEVEL UP - ETERNALYS
// =============================================================================

import { useState } from 'react';
import { Character, CharacterTalent } from '../types/game.types';
import { getAvailableTalents, applyTalent } from '../store/progressionStore';
import './LevelUpModal.css';

// Fonctions D&D locales
const getAbilityModifier = (score: number): number => Math.floor((score - 10) / 2);
const formatModifier = (mod: number): string => mod >= 0 ? `+${mod}` : `${mod}`;

interface LevelUpModalProps {
  character: Character;
  onSelectTalent: (character: Character, talent: CharacterTalent) => void;
  onSkip?: () => void;
}

export function LevelUpModal({ character, onSelectTalent, onSkip }: LevelUpModalProps) {
  const [selectedTalent, setSelectedTalent] = useState<CharacterTalent | null>(null);
  
  const availableTalents = getAvailableTalents(
    character.class,
    character.level,
    character.talents
  );
  
  const handleConfirm = () => {
    if (selectedTalent) {
      const updatedCharacter = applyTalent(character, selectedTalent);
      onSelectTalent(updatedCharacter, selectedTalent);
    }
  };
  
  return (
    <div className="level-up-overlay">
      <div className="level-up-modal">
        {/* En-tête */}
        <div className="level-up-header">
          <div className="level-up-fanfare">🎉</div>
          <h2>Niveau Supérieur !</h2>
          <div className="level-badge">
            <span className="old-level">{character.level - 1}</span>
            <span className="arrow">→</span>
            <span className="new-level">{character.level}</span>
          </div>
        </div>
        
        {/* Infos personnage */}
        <div className="character-level-info">
          <span className="char-portrait">{character.portrait}</span>
          <div className="char-details">
            <h3>{character.name}</h3>
            <span className="char-class">{character.class} Niveau {character.level}</span>
          </div>
        </div>
        
        {/* Améliorations automatiques */}
        <div className="auto-improvements">
          <h4>📈 Améliorations automatiques</h4>
          <div className="improvement-list">
            <div className="improvement-item">
              <span className="improvement-icon">❤️</span>
              <span className="improvement-label">PV Max</span>
              <span className="improvement-value">+{Math.max(1, Math.floor((character.maxHp) / character.level))}</span>
            </div>
            <div className="improvement-item">
              <span className="improvement-icon">🎯</span>
              <span className="improvement-label">Bonus de maîtrise</span>
              <span className="improvement-value">{formatModifier(character.proficiencyBonus)}</span>
            </div>
          </div>
        </div>
        
        {/* Sélection de talent (si niveau clé) */}
        {availableTalents.length > 0 && (
          <div className="talent-selection">
            <h4>✨ Choisissez une spécialisation</h4>
            <div className="talents-grid">
              {availableTalents.map(talent => (
                <div 
                  key={talent.id}
                  className={`talent-card ${selectedTalent?.id === talent.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTalent(talent)}
                >
                  <div className="talent-icon">{talent.icon}</div>
                  <div className="talent-info">
                    <h5>{talent.name}</h5>
                    <span className="talent-branch">{talent.branch}</span>
                    <p className="talent-description">{talent.description}</p>
                  </div>
                  <div className="talent-effects">
                    {talent.effects.map((effect, idx) => (
                      <span key={idx} className="talent-effect">
                        {effect.type === 'ability_bonus' && `+${effect.value} ${effect.ability}`}
                        {effect.type === 'hp_bonus' && `+${effect.value} PV`}
                        {effect.type === 'damage_bonus' && `+${effect.value} dégâts`}
                        {effect.type === 'resistance' && `Résistance ${effect.damageType}`}
                        {effect.type === 'passive' && `${effect.passiveType} +${effect.value}%`}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Stats actuelles */}
        <div className="current-stats">
          <h4>📊 Caractéristiques</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-name">FOR</span>
              <span className="stat-value">{character.abilities.strength}</span>
              <span className="stat-mod">{formatModifier(getAbilityModifier(character.abilities.strength))}</span>
            </div>
            <div className="stat-item">
              <span className="stat-name">DEX</span>
              <span className="stat-value">{character.abilities.dexterity}</span>
              <span className="stat-mod">{formatModifier(getAbilityModifier(character.abilities.dexterity))}</span>
            </div>
            <div className="stat-item">
              <span className="stat-name">CON</span>
              <span className="stat-value">{character.abilities.constitution}</span>
              <span className="stat-mod">{formatModifier(getAbilityModifier(character.abilities.constitution))}</span>
            </div>
            <div className="stat-item">
              <span className="stat-name">INT</span>
              <span className="stat-value">{character.abilities.intelligence}</span>
              <span className="stat-mod">{formatModifier(getAbilityModifier(character.abilities.intelligence))}</span>
            </div>
            <div className="stat-item">
              <span className="stat-name">SAG</span>
              <span className="stat-value">{character.abilities.wisdom}</span>
              <span className="stat-mod">{formatModifier(getAbilityModifier(character.abilities.wisdom))}</span>
            </div>
            <div className="stat-item">
              <span className="stat-name">CHA</span>
              <span className="stat-value">{character.abilities.charisma}</span>
              <span className="stat-mod">{formatModifier(getAbilityModifier(character.abilities.charisma))}</span>
            </div>
          </div>
        </div>
        
        {/* Boutons */}
        <div className="level-up-actions">
          {selectedTalent ? (
            <button className="confirm-btn" onClick={handleConfirm}>
              ✅ Confirmer le choix
            </button>
          ) : availableTalents.length > 0 ? (
            <button className="confirm-btn disabled" disabled>
              Choisissez une spécialisation
            </button>
          ) : (
            <button className="confirm-btn" onClick={onSkip}>
              ✅ Continuer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LevelUpModal;

