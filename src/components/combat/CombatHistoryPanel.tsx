import { CombatHistoryEntry } from '../../types/game.types';
import './CombatHistoryPanel.css';

interface CombatHistoryPanelProps {
  combatHistory: CombatHistoryEntry[];
  isExpanded: boolean;
  isMobileOpen: boolean;
  onToggleExpand: () => void;
  onCloseMobile: () => void;
}

// Icône de type de dégâts selon D&D
function getDamageIcon(type: string | undefined): string {
  switch (type) {
    case 'fire': return '🔥';
    case 'cold': return '❄️';
    case 'lightning': return '⚡';
    case 'poison': return '☠️';
    case 'necrotic': return '💀';
    case 'radiant': 
    case 'holy': return '✨';
    case 'force': return '💫';
    case 'magical': return '🔮';
    case 'slashing': return '🗡️';
    case 'piercing': return '🏹';
    case 'bludgeoning': return '🔨';
    default: return '⚔️';
  }
}

export function CombatHistoryPanel({
  combatHistory,
  isExpanded,
  isMobileOpen,
  onToggleExpand,
  onCloseMobile
}: CombatHistoryPanelProps) {
  const displayEntries = [...combatHistory].reverse().slice(0, isExpanded ? 100 : 8);
  
  return (
    <div className={`combat-history-panel ${isExpanded ? 'expanded' : 'compact'} ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Bouton fermer mobile */}
      <button 
        className="close-history-btn"
        onClick={onCloseMobile}
      >
        ✕
      </button>
      <div className="history-header" onClick={onToggleExpand}>
        <h4>📜 Historique ({combatHistory.length})</h4>
        <button className="history-toggle-btn">
          {isExpanded ? '▼ Réduire' : '▲ Agrandir'}
        </button>
      </div>
      <div className="combat-history-list">
        {combatHistory.length === 0 ? (
          <p className="history-empty">⏳ En attente de la première action...</p>
        ) : (
          displayEntries.map(entry => (
            <div 
              key={entry.id} 
              className={`combat-history-entry ${entry.isPlayerAction ? 'player' : 'enemy'}`}
            >
              <div className="history-actor">
                <span className="history-portrait">{entry.actorPortrait}</span>
                <span className="history-turn">Tour {entry.turn}</span>
              </div>
              <div className="history-details">
                <span className="history-action">
                  {entry.isPlayerAction ? '🎯' : '👹'} {entry.action}
                </span>
                {entry.target && (
                  <span className="history-target">
                    ➜ <strong>{entry.target}</strong>
                  </span>
                )}
                {entry.damage !== undefined && entry.damage > 0 && (
                  <span className={`history-damage ${entry.damageType || 'physical'}`}>
                    {getDamageIcon(entry.damageType)} -{entry.damage} dégâts
                  </span>
                )}
                {entry.heal !== undefined && entry.heal > 0 && (
                  <span className="history-heal">💚 +{entry.heal} PV restaurés</span>
                )}
                {entry.effect && (
                  <span className="history-effect">✦ {entry.effect}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

