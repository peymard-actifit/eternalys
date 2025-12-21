/**
 * ============================================
 * CONFIGURATION DU JEU - Constantes centralisées
 * ============================================
 * 
 * Ce fichier centralise toutes les constantes du jeu pour :
 * - Faciliter les ajustements d'équilibrage
 * - Éviter les valeurs magiques dans le code
 * - Permettre une configuration future (difficulté, etc.)
 */

// ============================================
// COMBAT
// ============================================

export const COMBAT_CONFIG = {
  // Modificateurs de dégâts
  STAT_DAMAGE_MULTIPLIER: 0.3,  // 30% de la stat offensive ajoutée aux dégâts
  CRITICAL_MULTIPLIER: 2,        // Dégâts x2 sur critique
  BASE_CRITICAL_CHANCE: 5,       // 5% de chance de critique de base
  
  // Résistances
  RESISTANCE_MULTIPLIER: 0.5,    // 50% de réduction pour résistance
  IMMUNITY_MULTIPLIER: 0,        // 0% pour immunité
  VULNERABILITY_MULTIPLIER: 2,   // 200% pour vulnérabilité
  
  // Types de dégâts physiques
  PHYSICAL_DAMAGE_TYPES: ['physical', 'bludgeoning', 'piercing', 'slashing'],
  
  // Délais d'animation (ms)
  ANIMATION_DELAY: 500,
  TURN_TRANSITION_DELAY: 1000,
  DICE_ROLL_DURATION: 1500,
  ATTACK_RESULT_DISPLAY: 2000,
} as const;

// ============================================
// DONJON
// ============================================

export const DUNGEON_CONFIG = {
  // Taille de la carte
  MAP_WIDTH: 20,
  MAP_HEIGHT: 20,
  START_X: 10,
  START_Y: 10,
  
  // Probabilités de rencontres (%)
  COMBAT_CHANCE: 50,
  EVENT_CHANCE: 30,
  TREASURE_CHANCE: 20,
  
  // Nombre de monstres selon la progression
  EARLY_GAME_MAX_ENCOUNTER: 3,
  MID_GAME_MAX_ENCOUNTER: 6,
  
  // Monstres multiples
  EARLY_ONE_MONSTER: 0.9,
  EARLY_TWO_MONSTERS: 0.1,
  MID_ONE_MONSTER: 0.6,
  MID_TWO_MONSTERS: 0.3,
  MID_THREE_MONSTERS: 0.1,
  LATE_ONE_MONSTER: 0.4,
  LATE_TWO_MONSTERS: 0.4,
  LATE_THREE_MONSTERS: 0.2,
} as const;

// ============================================
// NIVEAUX DE DONJON
// ============================================

export const LEVEL_CONFIG = {
  // Nombre de salles par niveau
  LEVEL_1_ROOMS: 10,
  LEVEL_2_ROOMS: 12,
  LEVEL_3_ROOMS: 14,
  LEVEL_4_PLUS_ROOMS: 16,
  
  // Scaling des monstres par niveau (%)
  getMonsterScaling: (level: number): number => {
    if (level <= 1) return 0;
    if (level === 2) return 25;
    if (level === 3) return 50;
    return 50 + (level - 3) * 25;
  },
  
  // Scaling des boss par niveau (%)
  getBossScaling: (level: number): number => {
    if (level <= 1) return 0;
    if (level === 2) return 35;
    if (level === 3) return 70;
    return 70 + (level - 3) * 30;
  },
  
  // Scaling par combat gagné (%)
  COMBAT_BOSS_SCALING: 5,
} as const;

// ============================================
// PERSONNAGES D&D
// ============================================

export const CHARACTER_CONFIG = {
  // Bonus de caractéristiques aux stats
  STRENGTH_ATTACK_MULTIPLIER: 2,
  INTELLIGENCE_MAGIC_MULTIPLIER: 2,
  CONSTITUTION_HP_MULTIPLIER: 5,
  CONSTITUTION_DEFENSE_MULTIPLIER: 1.5,
  WISDOM_MAGIC_DEFENSE_MULTIPLIER: 2,
  
  // Niveaux de maîtrise (pour référence D&D)
  getProficiencyBonus: (level: number): number => {
    return Math.floor((level - 1) / 4) + 2;
  },
} as const;

// ============================================
// EFFETS PASSIFS
// ============================================

export const PASSIVE_EFFECTS = {
  // Effets disponibles
  LIFESTEAL: 'lifesteal',
  CRITICAL: 'critical',
  THORNS: 'thorns',
  REGENERATION: 'regeneration',
  EVASION: 'evasion',
  DAMAGE_REDUCTION: 'damageReduction',
} as const;

// ============================================
// TYPES DE BUFFS
// ============================================

export const BUFF_TYPES = {
  // Stats D&D - Caractéristiques
  STRENGTH: 'strength',
  DEXTERITY: 'dexterity',
  CONSTITUTION: 'constitution',
  INTELLIGENCE: 'intelligence',
  WISDOM: 'wisdom',
  CHARISMA: 'charisma',
  // Stats dérivées
  ARMOR_CLASS: 'armorClass',
  SPEED: 'speed',
  // Effets spéciaux
  DAMAGE_REFLECT: 'damage_reflect',
  REGEN: 'regen',
  POISON: 'poison',
} as const;

// ============================================
// RARETÉS D'OBJETS
// ============================================

export const RARITY_CONFIG = {
  COMMON: { name: 'common', color: '#9d9d9d', label: 'Commun' },
  UNCOMMON: { name: 'uncommon', color: '#1eff00', label: 'Peu commun' },
  RARE: { name: 'rare', color: '#0070dd', label: 'Rare' },
  EPIC: { name: 'epic', color: '#a335ee', label: 'Épique' },
  LEGENDARY: { name: 'legendary', color: '#ff8000', label: 'Légendaire' },
} as const;

export function getRarityColor(rarity: string): string {
  const config = Object.values(RARITY_CONFIG).find(r => r.name === rarity);
  return config?.color || RARITY_CONFIG.COMMON.color;
}

// ============================================
// UI & AFFICHAGE
// ============================================

export const UI_CONFIG = {
  // Breakpoints responsive
  MOBILE_MAX: 480,
  TABLET_MAX: 768,
  LAPTOP_MAX: 1024,
  
  // Z-Index
  Z_OVERLAY: 1000,
  Z_MODAL: 2000,
  Z_DICE_ROLLER: 1500,
  Z_TOOLTIP: 100,
  
  // Durées d'animation (ms)
  FADE_DURATION: 200,
  SLIDE_DURATION: 300,
  MODAL_APPEAR: 250,
} as const;

// ============================================
// EXPORT PAR DÉFAUT
// ============================================

export const GAME_CONFIG = {
  combat: COMBAT_CONFIG,
  dungeon: DUNGEON_CONFIG,
  level: LEVEL_CONFIG,
  character: CHARACTER_CONFIG,
  passiveEffects: PASSIVE_EFFECTS,
  buffTypes: BUFF_TYPES,
  rarity: RARITY_CONFIG,
  ui: UI_CONFIG,
} as const;

export default GAME_CONFIG;


