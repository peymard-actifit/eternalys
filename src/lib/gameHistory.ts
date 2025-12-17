import { GameHistory, Character } from '../types/game.types';
import { VERSION } from '../version';

const STORAGE_KEY = 'ethernalys_game_history';

export function saveGameToHistory(
  result: 'victory' | 'defeat' | 'abandoned',
  team: Character[],
  roomsExplored: number,
  bossDefeated?: string,
  startTime?: number,
  dungeonLevel?: number
): void {
  const history = getGameHistory();
  
  const newEntry: GameHistory = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    version: VERSION,
    result,
    roomsExplored,
    dungeonLevel: dungeonLevel || 1,
    team: team.map(c => ({
      name: c.name,
      class: c.class,
      portrait: c.portrait,
      finalHp: Math.max(0, c.hp),
      maxHp: c.maxHp,
      // Statistiques du personnage
      attack: c.attack,
      magicAttack: c.magicAttack || 0,
      defense: c.defense,
      magicDefense: c.magicDefense,
      speed: c.speed,
      // Performance en combat
      damageDealt: c.stats?.totalDamageDealt || 0,
      damageTaken: c.stats?.totalDamageTaken || 0,
      healingDone: c.stats?.totalHealingDone || 0,
      monstersKilled: c.stats?.monstersKilled?.length || 0,
      // Monstre le plus puissant vaincu
      strongestMonsterKilled: c.stats?.strongestMonsterKilled ? {
        name: c.stats.strongestMonsterKilled.name,
        portrait: c.stats.strongestMonsterKilled.portrait,
        attack: c.stats.strongestMonsterKilled.attack,
        defense: c.stats.strongestMonsterKilled.defense,
        isBoss: c.stats.strongestMonsterKilled.isBoss
      } : undefined,
      // Inventaire
      inventory: (c.inventory || []).map(item => ({
        name: item.name,
        icon: item.icon,
        rarity: item.rarity
      }))
    })),
    bossDefeated,
    duration: startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
  };
  
  history.unshift(newEntry);
  
  // Garder seulement les 50 dernières parties
  if (history.length > 50) {
    history.pop();
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getGameHistory(): GameHistory[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading game history:', e);
  }
  return [];
}

export function clearGameHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}


