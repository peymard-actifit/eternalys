import { Character, Monster } from '../../types/game.types';
import './TurnOrderDisplay.css';

type CombatEntity = Character | Monster;

interface TurnOrderDisplayProps {
  turnOrder: CombatEntity[];
  currentTurnIndex: number;
}

export function TurnOrderDisplay({ turnOrder, currentTurnIndex }: TurnOrderDisplayProps) {
  const currentEntity = turnOrder[currentTurnIndex];
  const currentName = currentEntity ? ('name' in currentEntity ? currentEntity.name : 'Inconnu') : '';
  const isPlayerTurn = currentEntity && 'class' in currentEntity;
  
  return (
    <div className="turn-order">
      <h4>⚔️ Initiative</h4>
      
      {/* Indicateur du tour actuel */}
      <div className={`current-turn-indicator ${isPlayerTurn ? 'player' : 'enemy'}`}>
        <span className="current-turn-label">Tour de</span>
        <span className="current-turn-name">
          {'portrait' in currentEntity && currentEntity.portrait} {currentName}
        </span>
      </div>
      
      <div className="turn-list">
        {turnOrder.map((entity, i) => {
          const isDead = entity.hp <= 0;
          const initTotal = entity.initiativeTotal ?? 0;
          const initRoll = entity.initiativeRoll ?? 0;
          const initBonus = entity.initiativeBonus ?? 0;
          const isPlayer = 'class' in entity;
          
          return (
            <div 
              key={i} 
              className={`turn-item ${i === currentTurnIndex ? 'current' : ''} ${isDead ? 'dead' : ''} ${isPlayer ? 'player' : 'enemy'}`}
              title={`${entity.name}: 🎲 ${initRoll} + ${initBonus} = ${initTotal}`}
            >
              <span className="turn-portrait">{'portrait' in entity && entity.portrait}</span>
              <span className="turn-init">{initTotal}</span>
              {i === currentTurnIndex && <span className="turn-arrow">▶</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

