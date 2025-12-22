import { Monster } from '../../types/game.types';

interface CombatHeaderProps {
  combatTurn: number;
  enemies: Monster[];
  aliveEnemiesCount: number;
}

export function CombatHeader({ 
  combatTurn, 
  enemies, 
  aliveEnemiesCount 
}: CombatHeaderProps) {
  const hasBoss = enemies.some(e => e.isBoss);
  const isMultiEnemy = enemies.length > 1;

  return (
    <div className="combat-header">
      <h2>⚔️ COMBAT ⚔️</h2>
      <span className="turn-counter">Tour {combatTurn}</span>
      {hasBoss && <span className="boss-label">👑 BOSS</span>}
      {isMultiEnemy && (
        <span className="multi-enemy-label">⚔️ {aliveEnemiesCount}/{enemies.length}</span>
      )}
    </div>
  );
}
