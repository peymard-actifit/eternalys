import { Character, Monster, ActiveBuff } from '../../types/game.types';
import './StatsTooltip.css';

interface StatModification {
  stat: string;
  base: number;
  current: number;
  modified: boolean;
}

interface StatsTooltipProps {
  entity: Character | Monster;
}

// Récupère les stats de base et actuelles
function getStatsModifications(entity: Character | Monster): StatModification[] {
  const isCharacter = 'class' in entity;
  
  if (isCharacter) {
    const char = entity as Character;
    const baseStats = char.baseStats || {
      strength: char.strength,
      dexterity: char.dexterity,
      constitution: char.constitution,
      intelligence: char.intelligence,
      wisdom: char.wisdom,
      charisma: char.charisma
    };
    
    return [
      { stat: `💪 FOR`, base: baseStats.strength || char.strength, current: char.strength, modified: char.strength !== (baseStats.strength || char.strength) },
      { stat: `🎯 DEX`, base: baseStats.dexterity || char.dexterity, current: char.dexterity, modified: char.dexterity !== (baseStats.dexterity || char.dexterity) },
      { stat: `❤️ CON`, base: baseStats.constitution || char.constitution, current: char.constitution, modified: char.constitution !== (baseStats.constitution || char.constitution) },
      { stat: `📚 INT`, base: baseStats.intelligence || char.intelligence, current: char.intelligence, modified: char.intelligence !== (baseStats.intelligence || char.intelligence) },
      { stat: `🌟 SAG`, base: baseStats.wisdom || char.wisdom, current: char.wisdom, modified: char.wisdom !== (baseStats.wisdom || char.wisdom) },
      { stat: `👑 CHA`, base: baseStats.charisma || char.charisma, current: char.charisma, modified: char.charisma !== (baseStats.charisma || char.charisma) }
    ];
  } else {
    const monster = entity as Monster;
    return [
      { stat: `💪 FOR`, base: monster.strength || 10, current: monster.strength || 10, modified: false },
      { stat: `🎯 DEX`, base: monster.dexterity || 10, current: monster.dexterity || 10, modified: false },
      { stat: `❤️ CON`, base: monster.constitution || 10, current: monster.constitution || 10, modified: false },
      { stat: `📚 INT`, base: monster.intelligence || 10, current: monster.intelligence || 10, modified: false },
      { stat: `🌟 SAG`, base: monster.wisdom || 10, current: monster.wisdom || 10, modified: false },
      { stat: `👑 CHA`, base: monster.charisma || 10, current: monster.charisma || 10, modified: false }
    ];
  }
}

export function StatsTooltip({ entity }: StatsTooltipProps) {
  const modifications = getStatsModifications(entity);
  const activeBuffs = entity.buffs?.filter((b: ActiveBuff) => b.turnsRemaining > 0) || [];
  
  return (
    <div className="stats-tooltip">
      <div className="tooltip-header">📊 Statistiques détaillées</div>
      {modifications.map((m, i) => (
        <div key={i} className={`stat-row ${m.modified ? 'modified' : ''}`}>
          <span className="stat-name">{m.stat}</span>
          <span className="stat-values">
            <span className="base-value">{m.base}</span>
            {m.modified && (
              <>
                <span className="arrow">→</span>
                <span className="current-value">{m.current}</span>
              </>
            )}
          </span>
        </div>
      ))}
      {activeBuffs.length > 0 && (
        <div className="active-effects">
          <div className="effects-header">Effets actifs:</div>
          {activeBuffs.map((buff: ActiveBuff, i: number) => (
            <span key={i} className="effect-badge" title={`${buff.value} pendant ${buff.turnsRemaining} tours`}>
              {buff.name} ({buff.turnsRemaining}t)
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

