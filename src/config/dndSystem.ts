// =============================================================================
// SYSTÈME D&D 5e ÉTENDU - ETERNALYS
// =============================================================================
// Système basé à 100% sur les caractéristiques D&D
// Niveaux personnages: 1-100
// CR monstres: 1-100
// Niveaux donjon: 50
// =============================================================================

import { AbilityScores, DamageType } from '../types/game.types';

// =============================================================================
// CALCULS DE BASE D&D
// =============================================================================

/**
 * Calcule le modificateur D&D pour une caractéristique
 * Formula: (score - 10) / 2, arrondi vers le bas
 */
export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Formate le modificateur pour l'affichage (+X ou -X)
 */
export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

/**
 * Calcule le bonus de maîtrise selon le niveau (1-100)
 * Niveaux 1-4: +2
 * Niveaux 5-8: +3
 * Niveaux 9-12: +4
 * Niveaux 13-16: +5
 * Niveaux 17-20: +6
 * Niveaux 21-40: +7 à +10
 * Niveaux 41-60: +11 à +14
 * Niveaux 61-80: +15 à +18
 * Niveaux 81-100: +19 à +22
 */
export function getProficiencyBonus(level: number): number {
  if (level <= 4) return 2;
  if (level <= 8) return 3;
  if (level <= 12) return 4;
  if (level <= 16) return 5;
  if (level <= 20) return 6;
  // Niveaux épiques (21-100)
  if (level <= 30) return 7;
  if (level <= 40) return 8;
  if (level <= 50) return 9;
  if (level <= 60) return 10;
  if (level <= 70) return 11;
  if (level <= 80) return 12;
  if (level <= 90) return 14;
  return 16 + Math.floor((level - 90) / 5); // 16-18 pour 91-100
}

// =============================================================================
// JETS D'ATTAQUE ET DE DÉGÂTS
// =============================================================================

/**
 * Caractéristique utilisée pour l'attaque selon le type
 */
export type AttackType = 'melee' | 'ranged' | 'spell';

/**
 * Caractéristique de lancement de sorts par classe
 */
export const SPELLCASTING_ABILITY: Record<string, keyof AbilityScores> = {
  'Mage': 'intelligence',
  'Nécromancien': 'intelligence',
  'Élémentaliste': 'intelligence',
  'Ensorceleur': 'charisma',
  'Occultiste': 'charisma',
  'Barde': 'charisma',
  'Scalde': 'charisma',
  'Paladin': 'charisma',
  'Chevalier': 'charisma',
  'Prêtresse': 'wisdom',
  'Druide': 'wisdom',
  'Oracle': 'wisdom',
  'Clerc de Vie': 'wisdom',
  'Rôdeur': 'wisdom',
};

/**
 * Détermine la caractéristique d'attaque pour une classe
 */
export function getAttackAbility(
  className: string, 
  attackType: AttackType,
  isFinesse: boolean = false
): keyof AbilityScores {
  if (attackType === 'spell') {
    return SPELLCASTING_ABILITY[className] || 'intelligence';
  }
  
  if (attackType === 'ranged') {
    return 'dexterity';
  }
  
  // Mêlée
  if (isFinesse) {
    return 'dexterity'; // Le joueur peut choisir, on prend DEX par défaut pour finesse
  }
  
  return 'strength';
}

/**
 * Calcule le bonus d'attaque total
 * Formule: mod(caractéristique) + bonus de maîtrise
 */
export function getAttackBonus(
  abilities: AbilityScores,
  proficiencyBonus: number,
  attackAbility: keyof AbilityScores
): number {
  return getAbilityModifier(abilities[attackAbility]) + proficiencyBonus;
}

/**
 * Calcule la classe d'armure
 * Formule de base: 10 + mod(DEX) + bonus d'armure
 */
export function calculateArmorClass(
  abilities: AbilityScores,
  baseAC: number = 10,
  maxDexBonus: number | null = null, // null = pas de limite
  shieldBonus: number = 0,
  otherBonuses: number = 0
): number {
  let dexMod = getAbilityModifier(abilities.dexterity);
  
  if (maxDexBonus !== null) {
    dexMod = Math.min(dexMod, maxDexBonus);
  }
  
  return baseAC + dexMod + shieldBonus + otherBonuses;
}

/**
 * Calcule le DD des jets de sauvegarde contre les sorts
 * Formule: 8 + mod(caractéristique de lancement) + bonus de maîtrise
 */
export function getSpellSaveDC(
  abilities: AbilityScores,
  proficiencyBonus: number,
  spellcastingAbility: keyof AbilityScores
): number {
  return 8 + getAbilityModifier(abilities[spellcastingAbility]) + proficiencyBonus;
}

// =============================================================================
// SYSTÈME DE NIVEAU ET XP
// =============================================================================

/**
 * XP requis pour atteindre chaque niveau (1-100)
 * Basé sur D&D 5e avec extension pour niveaux épiques
 */
export const XP_THRESHOLDS: number[] = [
  0,        // Niveau 1
  300,      // Niveau 2
  900,      // Niveau 3
  2700,     // Niveau 4
  6500,     // Niveau 5
  14000,    // Niveau 6
  23000,    // Niveau 7
  34000,    // Niveau 8
  48000,    // Niveau 9
  64000,    // Niveau 10
  85000,    // Niveau 11
  100000,   // Niveau 12
  120000,   // Niveau 13
  140000,   // Niveau 14
  165000,   // Niveau 15
  195000,   // Niveau 16
  225000,   // Niveau 17
  265000,   // Niveau 18
  305000,   // Niveau 19
  355000,   // Niveau 20
];

// Générer les seuils pour les niveaux 21-100
for (let level = 21; level <= 100; level++) {
  // Progression exponentielle douce après niveau 20
  const baseXP = XP_THRESHOLDS[19]; // XP niveau 20
  const levelBeyond20 = level - 20;
  const multiplier = 1 + (levelBeyond20 * 0.15); // +15% par niveau
  XP_THRESHOLDS.push(Math.floor(baseXP * multiplier * levelBeyond20));
}

/**
 * Retourne l'XP nécessaire pour le niveau suivant
 */
export function getXPForNextLevel(currentLevel: number): number {
  if (currentLevel >= 100) return Infinity;
  return XP_THRESHOLDS[currentLevel] - (XP_THRESHOLDS[currentLevel - 1] || 0);
}

/**
 * Calcule le niveau à partir de l'XP total
 */
export function getLevelFromXP(totalXP: number): number {
  for (let level = 99; level >= 0; level--) {
    if (totalXP >= XP_THRESHOLDS[level]) {
      return level + 1;
    }
  }
  return 1;
}

/**
 * XP gagné en battant un monstre selon son CR
 */
export function getXPFromCR(cr: number): number {
  // Table de base D&D 5e, étendue pour CR 1-100
  const baseXP: Record<number, number> = {
    0: 10, 0.125: 25, 0.25: 50, 0.5: 100,
    1: 200, 2: 450, 3: 700, 4: 1100, 5: 1800,
    6: 2300, 7: 2900, 8: 3900, 9: 5000, 10: 5900,
    11: 7200, 12: 8400, 13: 10000, 14: 11500, 15: 13000,
    16: 15000, 17: 18000, 18: 20000, 19: 22000, 20: 25000,
    21: 33000, 22: 41000, 23: 50000, 24: 62000, 25: 75000,
    26: 90000, 27: 105000, 28: 120000, 29: 135000, 30: 155000,
  };
  
  if (cr <= 30 && baseXP[cr] !== undefined) {
    return baseXP[cr];
  }
  
  // Pour CR 31-100, progression exponentielle
  if (cr > 30) {
    return Math.floor(155000 * Math.pow(1.12, cr - 30));
  }
  
  return 10;
}

// =============================================================================
// SYSTÈME DE PV
// =============================================================================

/**
 * Dé de vie par classe
 */
export const HIT_DICE: Record<string, number> = {
  // d6
  'Mage': 6,
  'Nécromancien': 6,
  'Élémentaliste': 6,
  'Ensorceleur': 6,
  
  // d8
  'Occultiste': 8,
  'Prêtresse': 8,
  'Druide': 8,
  'Oracle': 8,
  'Clerc de Vie': 8,
  'Barde': 8,
  'Scalde': 8,
  'Roublard': 8,
  'Ninja': 8,
  'Voleur': 8,
  'Assassin': 8,
  'Moine': 8,
  'Pugiliste': 8,
  
  // d10
  'Guerrier': 10,
  'Chevalier': 10,
  'Paladin': 10,
  'Archère': 10,
  'Rôdeur': 10,
  'Arbalétrier': 10,
  'Seigneur de guerre': 10,
  
  // d12
  'Berserker': 12,
  'Gardien': 12,
};

/**
 * Calcule les PV max pour un niveau donné
 * Formule: Dé de vie max au niveau 1 + (niveau-1) * (moyenne du dé + 1) + mod(CON) * niveau
 */
export function calculateMaxHP(
  className: string,
  level: number,
  constitutionScore: number
): number {
  const hitDie = HIT_DICE[className] || 8;
  const conMod = getAbilityModifier(constitutionScore);
  
  // Niveau 1: dé max + CON
  const level1HP = hitDie + conMod;
  
  // Niveaux suivants: moyenne du dé arrondie au supérieur + CON par niveau
  const averageHitDie = Math.ceil(hitDie / 2) + 1;
  const additionalHP = (level - 1) * (averageHitDie + conMod);
  
  return Math.max(1, level1HP + additionalHP);
}

// =============================================================================
// SYSTÈME DE CR ET DIFFICULTÉ DE DONJON
// =============================================================================

/**
 * Paliers de dangerosité CR
 */
export const CR_DANGER_LEVELS = {
  LOCAL: { min: 1, max: 5, name: 'Locale', icon: '🏠', description: 'Ferme, forêt' },
  COMMUNITY: { min: 6, max: 15, name: 'Communauté', icon: '🏘️', description: 'Village, petite ville' },
  REGIONAL: { min: 16, max: 30, name: 'Régionale', icon: '🏰', description: 'Royaume' },
  CONTINENTAL: { min: 31, max: 50, name: 'Continentale', icon: '🌍', description: 'Continent' },
  GLOBAL: { min: 51, max: 70, name: 'Mondiale', icon: '🌐', description: 'Calamité mondiale' },
  PLANAR: { min: 71, max: 85, name: 'Planaire', icon: '✨', description: 'Multivers' },
  COSMIC: { min: 86, max: 95, name: 'Cosmique', icon: '🌌', description: 'Entités cosmiques' },
  DIVINE: { min: 96, max: 100, name: 'Divine', icon: '⚡', description: 'Dieux véritables' },
};

/**
 * Configuration des niveaux de donjon (50 niveaux)
 */
export interface DungeonLevelConfig {
  level: number;
  name: string;
  minCR: number;
  maxCR: number;
  bossCR: number;
  roomsBeforeBoss: number;
  description: string;
}

export const DUNGEON_LEVELS: DungeonLevelConfig[] = [];

// Générer les 50 niveaux de donjon
for (let i = 1; i <= 50; i++) {
  let config: DungeonLevelConfig;
  
  if (i <= 5) {
    // Niveaux 1-5: Apprentissage (CR 1-5)
    config = {
      level: i,
      name: `Profondeur ${i}`,
      minCR: i,
      maxCR: i + 1,
      bossCR: i + 2,
      roomsBeforeBoss: 3 + i,
      description: 'Cavernes peu profondes'
    };
  } else if (i <= 10) {
    // Niveaux 6-10: Aventurier (CR 6-15)
    config = {
      level: i,
      name: `Profondeur ${i}`,
      minCR: i + 2,
      maxCR: i + 5,
      bossCR: i + 7,
      roomsBeforeBoss: 5 + Math.floor(i / 2),
      description: 'Galeries souterraines'
    };
  } else if (i <= 20) {
    // Niveaux 11-20: Héros (CR 16-30)
    config = {
      level: i,
      name: `Abîme ${i - 10}`,
      minCR: 10 + i,
      maxCR: 15 + i,
      bossCR: 20 + i,
      roomsBeforeBoss: 6 + Math.floor(i / 3),
      description: 'Gouffres maudits'
    };
  } else if (i <= 30) {
    // Niveaux 21-30: Légende (CR 31-50)
    config = {
      level: i,
      name: `Enfers ${i - 20}`,
      minCR: 25 + i,
      maxCR: 35 + i,
      bossCR: 40 + i,
      roomsBeforeBoss: 7 + Math.floor(i / 4),
      description: 'Royaumes démoniaques'
    };
  } else if (i <= 40) {
    // Niveaux 31-40: Mythe (CR 51-70)
    config = {
      level: i,
      name: `Chaos ${i - 30}`,
      minCR: 40 + i,
      maxCR: 55 + i,
      bossCR: 60 + i,
      roomsBeforeBoss: 8 + Math.floor(i / 5),
      description: 'Limbes du chaos'
    };
  } else {
    // Niveaux 41-50: Divin (CR 71-100)
    config = {
      level: i,
      name: `Éternité ${i - 40}`,
      minCR: 60 + i,
      maxCR: 75 + i,
      bossCR: Math.min(100, 80 + i),
      roomsBeforeBoss: 10,
      description: 'Royaumes divins'
    };
  }
  
  DUNGEON_LEVELS.push(config);
}

/**
 * Retourne la configuration du niveau de donjon
 */
export function getDungeonLevelConfig(dungeonLevel: number): DungeonLevelConfig {
  return DUNGEON_LEVELS[Math.min(dungeonLevel - 1, DUNGEON_LEVELS.length - 1)];
}

// =============================================================================
// JETS DE SAUVEGARDE
// =============================================================================

/**
 * Effectue un jet de sauvegarde
 */
export function makeSavingThrow(
  abilities: AbilityScores,
  ability: keyof AbilityScores,
  dc: number,
  proficiencyBonus: number,
  isProficient: boolean,
  hasAdvantage: boolean = false,
  hasDisadvantage: boolean = false
): { success: boolean; roll: number; total: number } {
  // Simuler le jet de dé
  let roll1 = Math.floor(Math.random() * 20) + 1;
  let roll2 = Math.floor(Math.random() * 20) + 1;
  
  let roll: number;
  if (hasAdvantage && !hasDisadvantage) {
    roll = Math.max(roll1, roll2);
  } else if (hasDisadvantage && !hasAdvantage) {
    roll = Math.min(roll1, roll2);
  } else {
    roll = roll1;
  }
  
  const modifier = getAbilityModifier(abilities[ability]);
  const profBonus = isProficient ? proficiencyBonus : 0;
  const total = roll + modifier + profBonus;
  
  return {
    success: total >= dc,
    roll,
    total
  };
}

// =============================================================================
// SIMULATION DE DÉS
// =============================================================================

/**
 * Parse une notation de dé (ex: "2d8+3")
 */
export function parseDiceNotation(notation: string): { count: number; sides: number; bonus: number } {
  const match = notation.match(/(\d+)?d(\d+)([+-]\d+)?/i);
  if (!match) {
    return { count: 1, sides: 6, bonus: 0 };
  }
  
  return {
    count: parseInt(match[1]) || 1,
    sides: parseInt(match[2]),
    bonus: parseInt(match[3]) || 0
  };
}

/**
 * Lance des dés selon une notation
 */
export function rollDice(notation: string): { total: number; rolls: number[]; bonus: number } {
  const { count, sides, bonus } = parseDiceNotation(notation);
  
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }
  
  return {
    total: rolls.reduce((sum, r) => sum + r, 0) + bonus,
    rolls,
    bonus
  };
}

/**
 * Calcule les dégâts moyens d'une notation de dé
 */
export function averageDamage(notation: string): number {
  const { count, sides, bonus } = parseDiceNotation(notation);
  return count * (sides + 1) / 2 + bonus;
}

// =============================================================================
// SYSTÈME D'ARBRES DE TALENTS (Option C)
// =============================================================================

export interface TalentNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: number; // 1-5 (niveau 5, 10, 15, 20...)
  branch: string; // Nom de la branche de spécialisation
  effects: TalentEffect[];
  prerequisites?: string[]; // IDs des talents requis
}

export interface TalentEffect {
  type: 'ability_bonus' | 'skill_unlock' | 'passive' | 'resistance' | 'hp_bonus' | 'damage_bonus';
  ability?: keyof AbilityScores;
  value?: number;
  damageType?: DamageType;
  skillId?: string;
  passiveType?: 'critical' | 'lifesteal' | 'thorns' | 'regeneration' | 'evasion';
}

/**
 * Niveaux clés pour les choix de talents
 */
export const TALENT_LEVELS = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100];

/**
 * Vérifie si un niveau est un niveau de choix de talent
 */
export function isTalentLevel(level: number): boolean {
  return TALENT_LEVELS.includes(level);
}

// =============================================================================
// CONVERSION CR D&D -> CR ETERNALYS
// =============================================================================

/**
 * Convertit un CR D&D (1-30) vers l'échelle Eternalys (1-100)
 */
export function convertDnDCRToEternalys(dndCR: number): number {
  if (dndCR <= 5) {
    // CR 1-5 D&D -> CR 1-5 Eternalys (1:1)
    return dndCR;
  } else if (dndCR <= 10) {
    // CR 6-10 D&D -> CR 6-15 Eternalys
    return 5 + (dndCR - 5) * 2;
  } else if (dndCR <= 15) {
    // CR 11-15 D&D -> CR 16-30 Eternalys
    return 15 + (dndCR - 10) * 3;
  } else if (dndCR <= 20) {
    // CR 16-20 D&D -> CR 31-50 Eternalys
    return 30 + (dndCR - 15) * 4;
  } else if (dndCR <= 25) {
    // CR 21-25 D&D -> CR 51-70 Eternalys
    return 50 + (dndCR - 20) * 4;
  } else if (dndCR <= 30) {
    // CR 26-30 D&D -> CR 71-90 Eternalys
    return 70 + (dndCR - 25) * 4;
  }
  
  return Math.min(100, dndCR * 3);
}

/**
 * Calcule les stats d'un monstre selon son CR Eternalys
 */
export function getMonsterStatsForCR(cr: number): {
  hp: number;
  ac: number;
  attackBonus: number;
  damagePerRound: number;
  saveDC: number;
} {
  // Tables basées sur le DMG, étendues pour CR 1-100
  if (cr <= 0) cr = 1;
  
  // Formules basées sur les progressions D&D
  const hp = Math.floor(15 + (cr * cr * 0.5) + (cr * 10));
  const ac = Math.floor(10 + Math.min(cr / 3, 12) + Math.floor(cr / 25));
  const attackBonus = Math.floor(3 + (cr * 0.5));
  const damagePerRound = Math.floor(4 + (cr * cr * 0.1) + (cr * 2));
  const saveDC = Math.floor(10 + Math.min(cr / 2, 15) + Math.floor(cr / 20));
  
  return { hp, ac, attackBonus, damagePerRound, saveDC };
}

// =============================================================================
// EXPORT DU SYSTÈME
// =============================================================================

export const DND_SYSTEM = {
  getAbilityModifier,
  formatModifier,
  getProficiencyBonus,
  getAttackBonus,
  calculateArmorClass,
  getSpellSaveDC,
  getXPFromCR,
  getLevelFromXP,
  getXPForNextLevel,
  calculateMaxHP,
  makeSavingThrow,
  rollDice,
  parseDiceNotation,
  averageDamage,
  getDungeonLevelConfig,
  convertDnDCRToEternalys,
  getMonsterStatsForCR,
  isTalentLevel,
  
  // Constantes
  XP_THRESHOLDS,
  HIT_DICE,
  DUNGEON_LEVELS,
  CR_DANGER_LEVELS,
  TALENT_LEVELS,
  SPELLCASTING_ABILITY,
};

export default DND_SYSTEM;


