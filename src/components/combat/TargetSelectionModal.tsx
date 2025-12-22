import { Character, Skill } from '../../types/game.types';
import './TargetSelectionModal.css';

interface TargetSelectionModalProps {
  pendingSkill: Skill | null;
  targets: Character[];
  onSelectTarget: (character: Character) => void;
  onCancel: () => void;
  getHpBarColor: (hp: number, maxHp: number) => string;
}

export function TargetSelectionModal({ 
  pendingSkill, 
  targets, 
  onSelectTarget, 
  onCancel,
  getHpBarColor 
}: TargetSelectionModalProps) {
  const aliveTargets = targets.filter(c => c.hp > 0);
  
  return (
    <div className="target-selection-overlay">
      <div className="target-selection-modal">
        <h3>🎯 Choisir la cible de {pendingSkill?.name}</h3>
        <p className="skill-desc">{pendingSkill?.description}</p>
        <div className="target-list">
          {aliveTargets.map(character => (
            <button
              key={character.id}
              className="target-btn"
              onClick={() => onSelectTarget(character)}
            >
              <span className="target-portrait">{character.portrait}</span>
              <div className="target-info">
                <span className="target-name">{character.name}</span>
                <span className="target-class">{character.class}</span>
                <div className="target-hp">
                  <div 
                    className="hp-fill" 
                    style={{ 
                      width: `${(character.hp / character.maxHp) * 100}%`,
                      background: getHpBarColor(character.hp, character.maxHp)
                    }}
                  ></div>
                  <span className="hp-text">{character.hp}/{character.maxHp}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <button className="cancel-btn" onClick={onCancel}>
          ❌ Annuler
        </button>
      </div>
    </div>
  );
}

