import { ActiveBuff } from '../../types/game.types';
import './BuffsDisplay.css';

// Mapping des types de buffs vers emojis
const BUFF_ICONS: { [key: string]: string } = {
  strength: '💪',
  dexterity: '🎯',
  constitution: '❤️',
  intelligence: '📚',
  wisdom: '🌟',
  charisma: '👑',
  ac: '🛡️',
  speed: '💨',
  attack: '⚔️',
  damage: '🗡️',
  defense: '🛡️',
  magic: '✨',
  heal: '💚',
  poison: '☠️',
  fire: '🔥',
  cold: '❄️',
  lightning: '⚡',
  psychic: '🧠'
};

interface BuffsDisplayProps {
  buffs?: ActiveBuff[];
  isMonster?: boolean;
}

export function BuffsDisplay({ buffs, isMonster = false }: BuffsDisplayProps) {
  if (!buffs || buffs.length === 0) return null;
  
  const activeBuffs = buffs.filter(b => b.turnsRemaining > 0);
  if (activeBuffs.length === 0) return null;
  
  return (
    <div className={`active-buffs ${isMonster ? 'monster-buffs' : ''}`}>
      {activeBuffs.map((buff, i) => (
        <span 
          key={i} 
          className="buff-icon" 
          title={`${buff.name}: ${buff.turnsRemaining} tour(s) restant(s)`}
        >
          {BUFF_ICONS[buff.type] || '✦'}
        </span>
      ))}
    </div>
  );
}

