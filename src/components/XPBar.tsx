// =============================================================================
// BARRE D'XP - ETERNALYS
// =============================================================================

import { Character } from '../types/game.types';
import { getXPForNextLevel } from '../store/progressionStore';
import './XPBar.css';

interface XPBarProps {
  character: Character;
  showDetails?: boolean;
  compact?: boolean;
}

export function XPBar({ character, showDetails = false, compact = false }: XPBarProps) {
  const currentXP = character.xp || 0;
  const xpNeeded = getXPForNextLevel(character.level);
  const percentage = xpNeeded > 0 ? Math.min(100, (currentXP / xpNeeded) * 100) : 0;
  
  return (
    <div className={`xp-bar-container ${compact ? 'compact' : ''}`}>
      <div className="xp-bar-wrapper">
        <div className="xp-bar-track">
          <div 
            className="xp-bar-fill"
            style={{ width: `${percentage}%` }}
          />
          <div className="xp-bar-glow" style={{ width: `${percentage}%` }} />
        </div>
        {!compact && (
          <div className="xp-bar-label">
            <span className="xp-current">{currentXP.toLocaleString()}</span>
            <span className="xp-separator">/</span>
            <span className="xp-needed">{xpNeeded.toLocaleString()}</span>
            <span className="xp-text">XP</span>
          </div>
        )}
      </div>
      {showDetails && (
        <div className="xp-details">
          <span className="level-info">Niveau {character.level}</span>
          <span className="total-xp">Total: {(character.totalXP || 0).toLocaleString()} XP</span>
        </div>
      )}
    </div>
  );
}

export default XPBar;



