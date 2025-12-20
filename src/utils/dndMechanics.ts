// ============================================
// MÉCANIQUES D&D 5e - Jets de dés et calculs
// ============================================
// VERSION REFONTE COMPLÈTE - Système D&D pur
// ============================================

import { Character, Monster, Skill, MonsterSkill, AbilityScores } from '../types/game.types';

// Types de dés
export type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

// Résultat d'un jet de dé
export interface DiceRollResult {
  rolls: number[];
  total: number;
  modifier: number;
  dieType: DieType;
  isNatural20?: boolean;
  isNatural1?: boolean;
  hasAdvantage?: boolean;
  hasDisadvantage?: boolean;
  chosenRoll?: number;
}

// Résultat d'un jet d'attaque
export interface AttackRollResult {
  attackRoll: DiceRollResult;
  hit: boolean;
  isCriticalHit: boolean;
  isCriticalMiss: boolean;
  targetAC: number;
  totalAttackBonus: number;
}

// Résultat d'un jet de dégâts
export interface DamageRollResult {
  damageRoll: DiceRollResult;
  totalDamage: number;
  damageType: string;
  isCritical: boolean;
}

// Résultat d'un jet de sauvegarde
export interface SavingThrowResult {
  roll: DiceRollResult;
  success: boolean;
  dc: number;
  ability: keyof AbilityScores;
  totalBonus: number;
}

// Maximum pour chaque type de dé
const DIE_MAX: Record<DieType, number> = {
  'd4': 4,
  'd6': 6,
  'd8': 8,
  'd10': 10,
  'd12': 12,
  'd20': 20,
  'd100': 100
};

// =============================================================================
// LANCER DE DÉS
// =============================================================================

/**
 * Lancer un seul dé
 */
export function rollDie(dieType: DieType): number {
  return Math.floor(Math.random() * DIE_MAX[dieType]) + 1;
}

/**
 * Lancer plusieurs dés avec avantage/désavantage
 */
export function rollDice(
  dieType: DieType, 
  count: number, 
  modifier: number = 0,
  advantage: boolean = false,
  disadvantage: boolean = false
): DiceRollResult {
  const rolls: number[] = [];
  let allRolls: number[] = [];
  let chosenRoll: number | undefined;
  
  // Pour les jets d20 avec avantage/désavantage
  if (dieType === 'd20' && (advantage || disadvantage) && count === 1) {
    const roll1 = rollDie('d20');
    const roll2 = rollDie('d20');
    allRolls = [roll1, roll2];
    
    if (advantage && !disadvantage) {
      chosenRoll = Math.max(roll1, roll2);
      rolls.push(chosenRoll);
    } else if (disadvantage && !advantage) {
      chosenRoll = Math.min(roll1, roll2);
      rolls.push(chosenRoll);
    } else {
      // Les deux s'annulent
      rolls.push(roll1);
      allRolls = [roll1];
    }
  } else {
    for (let i = 0; i < count; i++) {
      const r = rollDie(dieType);
      rolls.push(r);
      allRolls.push(r);
    }
  }
  
  const sum = rolls.reduce((a, b) => a + b, 0);
  const total = sum + modifier;
  const isNatural20 = dieType === 'd20' && rolls[0] === 20;
  const isNatural1 = dieType === 'd20' && rolls[0] === 1;
  
  return {
    rolls: allRolls,
    total,
    modifier,
    dieType,
    isNatural20,
    isNatural1,
    hasAdvantage: advantage,
    hasDisadvantage: disadvantage,
    chosenRoll
  };
}

// =============================================================================
// CALCULS D&D
// =============================================================================

/**
 * Calcule le modificateur de caractéristique D&D
 */
export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Calcule le bonus de maîtrise basé sur le niveau (1-100)
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
  return 16 + Math.floor((level - 90) / 5);
}

/**
 * Caractéristique de lancement de sorts par classe
 */
const SPELLCASTING_ABILITY: Record<string, keyof AbilityScores> = {
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
 * Calcule le bonus d'attaque total
 * SYSTÈME D&D PUR: utilise UNIQUEMENT les caractéristiques D&D
 */
export function getAttackBonus(attacker: Character | Monster, isSpell: boolean = false): number {
  // Vérifier que les abilities existent
  if (!attacker.abilities) {
    console.warn('Entité sans abilities, utilisation de valeurs par défaut');
    return 2;
  }
  
  const abilities = attacker.abilities;
  
  if ('class' in attacker) {
    // === PERSONNAGE JOUEUR ===
    const proficiency = attacker.proficiencyBonus || getProficiencyBonus(attacker.level || 1);
    
    if (isSpell) {
      // Attaque de sort - utilise la caractéristique de lancement de sort
      const spellAbility = SPELLCASTING_ABILITY[attacker.class] || 'intelligence';
      const spellMod = getAbilityModifier(abilities[spellAbility]);
      return proficiency + spellMod;
    } else {
      // Attaque physique - utilise FOR ou DEX (le meilleur)
      const strMod = getAbilityModifier(abilities.strength);
      const dexMod = getAbilityModifier(abilities.dexterity);
      return proficiency + Math.max(strMod, dexMod);
    }
  } else {
    // === MONSTRE ===
    // Bonus d'attaque basé sur le CR
    const cr = attacker.challengeRating || 1;
    const profBonus = Math.floor(cr / 4) + 2;
    
    if (isSpell) {
      // Utilise la meilleure caractéristique mentale
      const intMod = getAbilityModifier(abilities.intelligence);
      const wisMod = getAbilityModifier(abilities.wisdom);
      const chaMod = getAbilityModifier(abilities.charisma);
      return profBonus + Math.max(intMod, wisMod, chaMod);
    } else {
      // Utilise FOR ou DEX
      const strMod = getAbilityModifier(abilities.strength);
      const dexMod = getAbilityModifier(abilities.dexterity);
      return profBonus + Math.max(strMod, dexMod);
    }
  }
}

/**
 * Obtient la CA d'une entité (système D&D pur)
 */
export function getArmorClass(entity: Character | Monster): number {
  // Si armorClass est défini, l'utiliser
  if (entity.armorClass && entity.armorClass > 0) {
    return entity.armorClass;
  }
  
  // Sinon, calculer: 10 + mod(DEX)
  if (entity.abilities) {
    return 10 + getAbilityModifier(entity.abilities.dexterity);
  }
  
  // Fallback absolu
  return 10;
}

/**
 * Effectue un jet d'attaque D&D pur
 */
export function makeAttackRoll(
  attacker: Character | Monster,
  target: Character | Monster,
  isSpell: boolean = false,
  hasAdvantage: boolean = false,
  hasDisadvantage: boolean = false
): AttackRollResult {
  const attackBonus = getAttackBonus(attacker, isSpell);
  const targetAC = getArmorClass(target);
  
  const attackRoll = rollDice('d20', 1, attackBonus, hasAdvantage, hasDisadvantage);
  
  const isCriticalHit = attackRoll.isNatural20 || false;
  const isCriticalMiss = attackRoll.isNatural1 || false;
  
  // Un 20 naturel touche toujours, un 1 naturel rate toujours
  const hit = isCriticalHit || (!isCriticalMiss && attackRoll.total >= targetAC);
  
  return {
    attackRoll,
    hit,
    isCriticalHit,
    isCriticalMiss,
    targetAC,
    totalAttackBonus: attackBonus
  };
}

// =============================================================================
// SYSTÈME DE DÉGÂTS
// =============================================================================

/**
 * Parse une chaîne de dégâts D&D (ex: "2d6", "1d8+3", "3d6")
 */
export function parseDamageString(damageStr: string): { dieType: DieType; count: number; modifier: number } | null {
  const match = damageStr.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
  if (!match) return null;
  
  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const modifier = match[3] ? parseInt(match[3]) : 0;
  
  let dieType: DieType = 'd6';
  if (sides === 4) dieType = 'd4';
  else if (sides === 6) dieType = 'd6';
  else if (sides === 8) dieType = 'd8';
  else if (sides === 10) dieType = 'd10';
  else if (sides === 12) dieType = 'd12';
  else if (sides === 20) dieType = 'd20';
  
  return { dieType, count, modifier };
}

/**
 * Calcule les dés de dégâts selon une valeur de base
 */
export function getDamageDice(damage: number): { dieType: DieType; count: number } {
  if (damage <= 3) return { dieType: 'd4', count: 1 };
  if (damage <= 5) return { dieType: 'd6', count: 1 };
  if (damage <= 7) return { dieType: 'd8', count: 1 };
  if (damage <= 10) return { dieType: 'd10', count: 1 };
  if (damage <= 14) return { dieType: 'd6', count: 2 };
  if (damage <= 18) return { dieType: 'd6', count: 3 };
  if (damage <= 22) return { dieType: 'd8', count: 3 };
  if (damage <= 28) return { dieType: 'd6', count: 4 };
  if (damage <= 35) return { dieType: 'd8', count: 4 };
  if (damage <= 45) return { dieType: 'd10', count: 4 };
  
  const d10Count = Math.ceil(damage / 5.5);
  return { dieType: 'd10', count: Math.min(d10Count, 12) };
}

/**
 * Calcule le bonus de dégâts selon la caractéristique
 */
export function getDamageModifier(attacker: Character | Monster, isSpell: boolean = false): number {
  if (!attacker.abilities) return 0;
  
  if ('class' in attacker && isSpell) {
    // Sorts: bonus selon la classe
    const spellAbility = SPELLCASTING_ABILITY[attacker.class] || 'intelligence';
    return getAbilityModifier(attacker.abilities[spellAbility]);
  }
  
  // Attaque physique: FOR ou DEX
  const strMod = getAbilityModifier(attacker.abilities.strength);
  const dexMod = getAbilityModifier(attacker.abilities.dexterity);
  return Math.max(strMod, dexMod);
}

/**
 * Effectue un jet de dégâts D&D
 */
export function rollDamage(
  attacker: Character | Monster,
  skill: Skill | MonsterSkill | null,
  isCritical: boolean = false,
  isSpell: boolean = false
): DamageRollResult {
  let dieType: DieType = 'd6';
  let count = 1;
  let baseModifier = 0;
  let damageType = 'physical';
  
  // Si la compétence a des dés de dégâts définis
  if (skill?.damageDice) {
    const parsed = parseDamageString(skill.damageDice);
    if (parsed) {
      dieType = parsed.dieType;
      count = parsed.count;
      baseModifier = parsed.modifier;
    }
  } else if (skill?.damage && skill.damage > 0) {
    // Sinon, calculer depuis la valeur de dégâts
    const dice = getDamageDice(skill.damage);
    dieType = dice.dieType;
    count = dice.count;
  } else {
    // Attaque de base: 1d8 pour mêlée, 1d6 pour distance
    dieType = isSpell ? 'd8' : 'd8';
    count = 1;
  }
  
  // Ajouter le modificateur de caractéristique
  const abilityMod = getDamageModifier(attacker, isSpell);
  const totalModifier = baseModifier + abilityMod;
  
  // Type de dégâts
  damageType = skill?.damageType || (isSpell ? 'magical' : 'physical');
  
  // En cas de critique, doubler les dés
  const actualCount = isCritical ? count * 2 : count;
  
  const damageRoll = rollDice(dieType, actualCount, totalModifier);
  
  return {
    damageRoll,
    totalDamage: Math.max(1, damageRoll.total),
    damageType,
    isCritical
  };
}

/**
 * Effectue un jet de dégâts simplifié (pour compatibilité)
 */
export function rollDamageSimple(
  baseDamage: number,
  damageType: string,
  isCritical: boolean = false,
  bonusModifier: number = 0
): DamageRollResult {
  const { dieType, count } = getDamageDice(baseDamage);
  const actualCount = isCritical ? count * 2 : count;
  const damageRoll = rollDice(dieType, actualCount, bonusModifier);
  
  return {
    damageRoll,
    totalDamage: Math.max(1, damageRoll.total),
    damageType,
    isCritical
  };
}

// =============================================================================
// PV TEMPORAIRES
// =============================================================================

/**
 * Applique les PV temporaires
 */
export function applyTemporaryHp(character: Character, amount: number): Character {
  const currentTempHp = character.temporaryHp || 0;
  return {
    ...character,
    temporaryHp: Math.max(currentTempHp, amount)
  };
}

/**
 * Applique des dégâts en tenant compte des PV temporaires
 */
export function applyDamageWithTempHp(
  character: Character, 
  damage: number
): { character: Character; damageToHp: number; damageToTempHp: number } {
  let damageToTempHp = 0;
  let damageToHp = damage;
  let newTempHp = character.temporaryHp || 0;
  let newHp = character.hp;
  
  if (newTempHp > 0) {
    damageToTempHp = Math.min(newTempHp, damage);
    newTempHp -= damageToTempHp;
    damageToHp = damage - damageToTempHp;
  }
  
  newHp = Math.max(0, newHp - damageToHp);
  
  return {
    character: {
      ...character,
      hp: newHp,
      temporaryHp: newTempHp
    },
    damageToHp,
    damageToTempHp
  };
}

// =============================================================================
// AVANTAGE / DÉSAVANTAGE
// =============================================================================

/**
 * Vérifie si l'attaquant a l'avantage
 */
export function hasAdvantageOnAttack(attacker: Character, target: Character | Monster): boolean {
  if (attacker.buffs?.some(b => b.type === 'advantage')) {
    return true;
  }
  
  if ('conditions' in target && target.conditions?.includes('prone')) {
    return true;
  }
  
  return false;
}

/**
 * Vérifie si l'attaquant a le désavantage
 */
export function hasDisadvantageOnAttack(attacker: Character, target: Character | Monster): boolean {
  if (attacker.buffs?.some(b => b.type === 'disadvantage' && b.value < 0)) {
    return true;
  }
  
  return false;
}

// =============================================================================
// JETS DE SAUVEGARDE
// =============================================================================

/**
 * Calcule le bonus de jet de sauvegarde
 */
export function getSavingThrowBonus(
  entity: Character | Monster, 
  ability: keyof AbilityScores
): number {
  if (!entity.abilities) return 0;
  
  const abilityScore = entity.abilities[ability];
  const modifier = getAbilityModifier(abilityScore);
  
  if ('savingThrowProficiencies' in entity && entity.savingThrowProficiencies) {
    if (entity.savingThrowProficiencies.includes(ability)) {
      const proficiency = entity.proficiencyBonus || getProficiencyBonus(entity.level || 1);
      return modifier + proficiency;
    }
  }
  
  if ('challengeRating' in entity) {
    return modifier;
  }
  
  return modifier;
}

/**
 * Effectue un jet de sauvegarde
 */
export function makeSavingThrow(
  target: Character | Monster,
  ability: keyof AbilityScores,
  dc: number,
  hasAdvantage: boolean = false,
  hasDisadvantage: boolean = false
): SavingThrowResult {
  const bonus = getSavingThrowBonus(target, ability);
  const roll = rollDice('d20', 1, bonus, hasAdvantage, hasDisadvantage);
  
  const success = roll.isNatural20 || (!roll.isNatural1 && roll.total >= dc);
  
  return {
    roll,
    success,
    dc,
    ability,
    totalBonus: bonus
  };
}

/**
 * Calcule le DD des jets de sauvegarde
 */
export function getSpellSaveDC(caster: Character): number {
  if (!caster.abilities) return 10;
  
  const proficiency = caster.proficiencyBonus || getProficiencyBonus(caster.level || 1);
  const spellAbility = SPELLCASTING_ABILITY[caster.class] || 'intelligence';
  const abilityMod = getAbilityModifier(caster.abilities[spellAbility]);
  
  return 8 + proficiency + abilityMod;
}

// =============================================================================
// LABELS ET CONSTANTES
// =============================================================================

export const ABILITY_LABELS: Record<keyof AbilityScores, string> = {
  strength: 'Force',
  dexterity: 'Dextérité',
  constitution: 'Constitution',
  intelligence: 'Intelligence',
  wisdom: 'Sagesse',
  charisma: 'Charisme'
};

export const DAMAGE_TYPE_LABELS: Record<string, string> = {
  physical: 'Physique',
  slashing: 'Tranchant',
  piercing: 'Perforant',
  bludgeoning: 'Contondant',
  fire: 'Feu',
  cold: 'Froid',
  lightning: 'Foudre',
  acid: 'Acide',
  poison: 'Poison',
  necrotic: 'Nécrotique',
  radiant: 'Radiant',
  force: 'Force',
  psychic: 'Psychique',
  thunder: 'Tonnerre',
  magical: 'Magique',
  holy: 'Sacré'
};
