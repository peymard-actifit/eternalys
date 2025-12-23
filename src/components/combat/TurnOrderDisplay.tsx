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
  
  // Récupérer les infos d'initiative de l'entité courante
  const currentInitTotal = currentEntity?.initiativeTotal ?? 0;
  const currentInitRoll = currentEntity?.initiativeRoll ?? 0;
  const currentInitBonus = currentEntity?.initiativeBonus ?? 0;
  
  return (
    <div className="turn-order">
      <h4>⚔️ Initiative</h4>
      
      {/* Indicateur du tour actuel */}
      <div className={`current-turn-indicator ${isPlayerTurn ? 'player' : 'enemy'}`}>
        <span className="current-turn-label">Tour de</span>
        <span className="current-turn-name">
          {'portrait' in currentEntity && currentEntity.portrait} {currentName}
        </span>
        <span className="current-turn-init">
          🎲 {currentInitRoll} {currentInitBonus >= 0 ? '+' : ''}{currentInitBonus} = <strong>{currentInitTotal}</strong>
        </span>
      </div>
      
      <div className="turn-list">
        {turnOrder.map((entity, i) => {
          const isDead = entity.hp <= 0;
          const initTotal = entity.initiativeTotal ?? 0;
          const initRoll = entity.initiativeRoll ?? 0;
          const initBonus = entity.initiativeBonus ?? 0;
          const isPlayer = 'class' in entity;
          
          // Formatage du bonus d'initiative
          const bonusText = initBonus >= 0 ? `+${initBonus}` : `${initBonus}`;
          
          return (
            <div 
              key={i} 
              className={`turn-item ${i === currentTurnIndex ? 'current' : ''} ${isDead ? 'dead' : ''} ${isPlayer ? 'player' : 'enemy'}`}
              title={`${entity.name}: 🎲 ${initRoll} ${bonusText} = ${initTotal}`}
            >
              <span className="turn-portrait">{'portrait' in entity && entity.portrait}</span>
              <span className="turn-init-detail">
                <span className="init-roll">{initRoll}</span>
                <span className="init-bonus">{bonusText}</span>
              </span>
              <span className="turn-init-total">{initTotal}</span>
              {i === currentTurnIndex && <span className="turn-arrow">▶</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

