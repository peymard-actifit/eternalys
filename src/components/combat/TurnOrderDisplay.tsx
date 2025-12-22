import { Character, Monster } from '../../types/game.types';
import './TurnOrderDisplay.css';

type CombatEntity = Character | Monster;

interface TurnOrderDisplayProps {
  turnOrder: CombatEntity[];
  currentTurnIndex: number;
}

export function TurnOrderDisplay({ turnOrder, currentTurnIndex }: TurnOrderDisplayProps) {
  return (
    <div className="turn-order">
      <h4>Initiative</h4>
      <div className="turn-list">
        {turnOrder.map((entity, i) => {
          const isDead = entity.hp <= 0;
          return (
            <div 
              key={i} 
              className={`turn-item ${i === currentTurnIndex ? 'current' : ''} ${isDead ? 'dead' : ''}`}
              title={'name' in entity ? entity.name : ''}
            >
              {'portrait' in entity && entity.portrait}
            </div>
          );
        })}
      </div>
    </div>
  );
}

