import { useEffect, useState } from 'react';
import { gameStore } from '../store/gameStore';
import { GameState, Character, Monster } from '../types/game.types';
import './CombatPage.css';

export function CombatPage() {
  const [state, setState] = useState<GameState>(gameStore.getState());
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    return gameStore.subscribe(() => setState(gameStore.getState()));
  }, []);

  const { team, currentEnemy, turnOrder, currentTurnIndex, combatLog } = state;
  
  if (!currentEnemy) return null;

  const currentTurn = turnOrder[currentTurnIndex];
  const isPlayerTurn = currentTurn && 'class' in currentTurn;
  const isEnemyTurn = currentTurn && 'isBoss' in currentTurn;

  // IA de l'ennemi
  useEffect(() => {
    if (isEnemyTurn && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        // L'ennemi attaque un membre aléatoire de l'équipe vivante
        const aliveTeam = team.filter(c => c.hp > 0);
        if (aliveTeam.length > 0) {
          const target = aliveTeam[Math.floor(Math.random() * aliveTeam.length)];
          gameStore.performAttack(currentEnemy, target, currentEnemy.attack);
        }
        setIsAnimating(false);
      }, 1500);
    }
  }, [currentTurnIndex, isEnemyTurn]);

  const handleAttack = () => {
    if (!isPlayerTurn || isAnimating) return;
    
    setIsAnimating(true);
    const attacker = currentTurn as Character;
    gameStore.performAttack(attacker, currentEnemy, attacker.attack);
    setIsAnimating(false);
  };

  const handleSkill = (skillIndex: number) => {
    if (!isPlayerTurn || isAnimating) return;
    
    const attacker = currentTurn as Character;
    const skill = attacker.skills[skillIndex];
    
    setIsAnimating(true);
    
    if (skill.type === 'heal') {
      // Soigner un allié (le plus faible)
      const target = team.reduce((min, c) => c.hp < min.hp && c.hp > 0 ? c : min, team[0]);
      target.hp = Math.min(target.maxHp, target.hp + Math.abs(skill.damage));
      const log = [...state.combatLog, `${attacker.name} utilise ${skill.name} sur ${target.name} ! (+${Math.abs(skill.damage)} PV)`];
      const nextIndex = (currentTurnIndex + 1) % turnOrder.length;
      gameStore.setState({ currentTurnIndex: nextIndex, combatLog: log, team: [...team] });
    } else {
      gameStore.performAttack(attacker, currentEnemy, skill.damage);
    }
    
    setIsAnimating(false);
  };

  return (
    <div className="combat-page">
      <div className="combat-header">
        <h2>⚔️ COMBAT ⚔️</h2>
        {currentEnemy.isBoss && <span className="boss-label">👑 BOSS</span>}
      </div>

      <div className="combat-arena">
        {/* Ennemi */}
        <div className={`enemy-section ${isEnemyTurn ? 'active-turn' : ''}`}>
          <div className="enemy-portrait">{currentEnemy.portrait}</div>
          <h3 className="enemy-name">{currentEnemy.name}</h3>
          <div className="enemy-hp-bar">
            <div 
              className="hp-fill enemy" 
              style={{ width: `${(currentEnemy.hp / currentEnemy.maxHp) * 100}%` }}
            ></div>
            <span className="hp-text">{currentEnemy.hp}/{currentEnemy.maxHp}</span>
          </div>
          <div className="enemy-stats">
            <span>⚔️ {currentEnemy.attack}</span>
            <span>🛡️ {currentEnemy.defense}</span>
            <span>💨 {currentEnemy.speed}</span>
          </div>
        </div>

        <div className="versus">VS</div>

        {/* Équipe */}
        <div className="team-section">
          {team.map(character => {
            const isCurrent = currentTurn && 'id' in currentTurn && currentTurn.id === character.id;
            const isDead = character.hp <= 0;
            
            return (
              <div 
                key={character.id} 
                className={`team-fighter ${isCurrent ? 'active-turn' : ''} ${isDead ? 'dead' : ''}`}
              >
                <span className="fighter-portrait">{character.portrait}</span>
                <span className="fighter-name">{character.name}</span>
                <div className="fighter-hp-bar">
                  <div 
                    className="hp-fill" 
                    style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
                  ></div>
                  <span className="hp-text">{character.hp}/{character.maxHp}</span>
                </div>
                {isCurrent && <span className="turn-indicator">⚡ Tour actuel</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      {isPlayerTurn && !isAnimating && (currentTurn as Character).hp > 0 && (
        <div className="combat-actions">
          <h4>Actions de {(currentTurn as Character).name}</h4>
          <div className="action-buttons">
            <button className="action-btn attack" onClick={handleAttack}>
              ⚔️ Attaque
              <span className="damage-preview">({(currentTurn as Character).attack} dégâts)</span>
            </button>
            {(currentTurn as Character).skills.map((skill, i) => (
              <button 
                key={skill.id} 
                className={`action-btn skill ${skill.type}`}
                onClick={() => handleSkill(i)}
              >
                {skill.type === 'heal' ? '💚' : '✨'} {skill.name}
                <span className="damage-preview">
                  ({skill.type === 'heal' ? '+' : ''}{Math.abs(skill.damage)} {skill.type === 'heal' ? 'soin' : 'dégâts'})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isAnimating && (
        <div className="combat-waiting">
          <p>{isEnemyTurn ? `${currentEnemy.name} prépare son attaque...` : 'Exécution...'}</p>
        </div>
      )}

      {/* Log de combat */}
      <div className="combat-log">
        <h4>Journal de combat</h4>
        <div className="log-entries">
          {combatLog.slice(-5).map((entry, i) => (
            <p key={i} className="log-entry">{entry}</p>
          ))}
        </div>
      </div>

      {/* Ordre des tours */}
      <div className="turn-order">
        <h4>Ordre d'initiative</h4>
        <div className="turn-list">
          {turnOrder.map((entity, i) => {
            const isDead = entity.hp <= 0;
            return (
              <div 
                key={i} 
                className={`turn-item ${i === currentTurnIndex ? 'current' : ''} ${isDead ? 'dead' : ''}`}
              >
                {'portrait' in entity && entity.portrait}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

