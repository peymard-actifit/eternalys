// ============================================
// MÉCANIQUES D&D 5e - Jets de dés et calculs
// ============================================

import { Character, Monster, Skill } from '../types/game.types';

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
  chosenRoll?: number; // Le dé sélectionné (pour avantage/désavantage)
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

// Lancer un seul dé
export function rollDie(dieType: DieType): number {
  return Math.floor(Math.random() * DIE_MAX[dieType]) + 1;
}

// Lancer plusieurs dés
export function rollDice(
  dieType: DieType, 
  count: number, 
  modifier: number = 0,
  advantage: boolean = false,
  disadvantage: boolean = false
): DiceRollResult {
  const rolls: number[] = [];
  let allRolls: number[] = []; // Stocke tous les jets (pour avantage/désavantage)
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
      allRolls = [roll1]; // Pas de second dé si annulation
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
  // Pour critique: vérifie le dé CHOISI (pas tous les dés)
  const isNatural20 = dieType === 'd20' && rolls[0] === 20;
  const isNatural1 = dieType === 'd20' && rolls[0] === 1;
  
  return {
    rolls: allRolls, // Retourne TOUS les jets pour affichage
    total,
    modifier,
    dieType,
    isNatural20,
    isNatural1,
    hasAdvantage: advantage,
    hasDisadvantage: disadvantage,
    chosenRoll // Le dé sélectionné (pour avantage/désavantage)
  };
}

// Calculer le modificateur de caractéristique D&D
export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

// Calculer le bonus de maîtrise basé sur le niveau
export function getProficiencyBonus(level: number): number {
  return Math.floor((level - 1) / 4) + 2;
}

// Calculer le bonus d'attaque total
export function getAttackBonus(attacker: Character | Monster, isSpell: boolean = false): number {
  let bonus = 0;
  
  if ('class' in attacker) {
    // Personnage joueur
    const proficiency = getProficiencyBonus(attacker.level);
    
    if (isSpell) {
      // Attaque de sort - utilise INT/WIS/CHA selon la classe
      const spellMod = attacker.abilities 
        ? Math.max(
            getAbilityModifier(attacker.abilities.intelligence),
            getAbilityModifier(attacker.abilities.wisdom),
            getAbilityModifier(attacker.abilities.charisma)
          )
        : Math.floor((attacker.magicAttack || 0) / 3);
      bonus = proficiency + spellMod;
    } else {
      // Attaque physique - utilise FOR ou DEX
      const strMod = attacker.abilities ? getAbilityModifier(attacker.abilities.strength) : Math.floor(attacker.attack / 3);
      const dexMod = attacker.abilities ? getAbilityModifier(attacker.abilities.dexterity) : Math.floor(attacker.speed / 10);
      bonus = proficiency + Math.max(strMod, dexMod);
    }
  } else {
    // Monstre - bonus basé sur CR et stats
    bonus = Math.floor(attacker.attack / 2);
  }
  
  return bonus;
}

// Effectuer un jet d'attaque
export function makeAttackRoll(
  attacker: Character | Monster,
  target: Character | Monster,
  isSpell: boolean = false,
  hasAdvantage: boolean = false,
  hasDisadvantage: boolean = false
): AttackRollResult {
  const attackBonus = getAttackBonus(attacker, isSpell);
  const targetAC = 'armorClass' in target && target.armorClass 
    ? target.armorClass 
    : 10 + Math.floor(target.defense / 2);
  
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

// Parser une chaîne de dégâts D&D (ex: "2d6", "1d8+3", "3d6")
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

// Calculer les dés de dégâts basés sur la valeur de dégâts
export function getDamageDice(damage: number): { dieType: DieType; count: number } {
  // Approximation: on convertit les dégâts fixes en jets de dés
  // Moyenne d4=2.5, d6=3.5, d8=4.5, d10=5.5, d12=6.5
  
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
  
  // Pour les très gros dégâts
  const d10Count = Math.ceil(damage / 5.5);
  return { dieType: 'd10', count: Math.min(d10Count, 10) };
}

// Effectuer un jet de dégâts
export function rollDamage(
  baseDamage: number,
  damageType: string,
  isCritical: boolean = false,
  bonusModifier: number = 0
): DamageRollResult {
  const { dieType, count } = getDamageDice(baseDamage);
  
  // En cas de critique, on double les dés (pas le modificateur)
  const actualCount = isCritical ? count * 2 : count;
  
  const damageRoll = rollDice(dieType, actualCount, bonusModifier);
  
  return {
    damageRoll,
    totalDamage: Math.max(1, damageRoll.total),
    damageType,
    isCritical
  };
}

// Appliquer les PV temporaires
export function applyTemporaryHp(character: Character, amount: number): Character {
  // Les PV temporaires ne s'accumulent pas - on garde le maximum
  const currentTempHp = character.temporaryHp || 0;
  return {
    ...character,
    temporaryHp: Math.max(currentTempHp, amount)
  };
}

// Appliquer des dégâts en tenant compte des PV temporaires
export function applyDamageWithTempHp(
  character: Character, 
  damage: number
): { character: Character; damageToHp: number; damageToTempHp: number } {
  let damageToTempHp = 0;
  let damageToHp = damage;
  let newTempHp = character.temporaryHp || 0;
  let newHp = character.hp;
  
  // Les PV temporaires absorbent les dégâts en premier
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

// Calculer si une compétence a l'avantage
export function hasAdvantageOnAttack(attacker: Character, target: Character | Monster): boolean {
  // Vérifier les buffs d'avantage
  if (attacker.buffs?.some(b => b.type === 'advantage')) {
    return true;
  }
  
  // Cible à terre, invisible qui attaque, etc.
  if ('conditions' in target && target.conditions?.includes('prone')) {
    return true;
  }
  
  return false;
}

// Calculer si une compétence a le désavantage
export function hasDisadvantageOnAttack(attacker: Character, target: Character | Monster): boolean {
  // Vérifier les debuffs de désavantage
  if (attacker.buffs?.some(b => b.type === 'disadvantage' && b.value < 0)) {
    return true;
  }
  
  return false;
}

// ============================================
// JETS DE SAUVEGARDE D&D 5e
// ============================================

export interface SavingThrowResult {
  roll: DiceRollResult;
  success: boolean;
  dc: number;
  ability: keyof AbilityScores;
  totalBonus: number;
}

// Calculer le bonus de jet de sauvegarde
export function getSavingThrowBonus(
  entity: Character | Monster, 
  ability: keyof AbilityScores
): number {
  const abilityScore = entity.abilities[ability];
  const modifier = getAbilityModifier(abilityScore);
  
  // Les personnages ont des maîtrises de jets de sauvegarde
  if ('savingThrowProficiencies' in entity && entity.savingThrowProficiencies) {
    if (entity.savingThrowProficiencies.includes(ability)) {
      const proficiency = entity.proficiencyBonus || getProficiencyBonus(entity.level || 1);
      return modifier + proficiency;
    }
  }
  
  // Les monstres utilisent leur CR pour le bonus
  if ('challengeRating' in entity) {
    // Certains monstres ont des sauvegardes fortes dans certaines stats
    // Pour simplifier, on utilise juste le modificateur
    return modifier;
  }
  
  return modifier;
}

// Effectuer un jet de sauvegarde
export function makeSavingThrow(
  target: Character | Monster,
  ability: keyof AbilityScores,
  dc: number,
  hasAdvantage: boolean = false,
  hasDisadvantage: boolean = false
): SavingThrowResult {
  const bonus = getSavingThrowBonus(target, ability);
  const roll = rollDice('d20', 1, bonus, hasAdvantage, hasDisadvantage);
  
  // 20 naturel = réussite automatique, 1 naturel = échec automatique
  const success = roll.isNatural20 || (!roll.isNatural1 && roll.total >= dc);
  
  return {
    roll,
    success,
    dc,
    ability,
    totalBonus: bonus
  };
}

// Labels pour les caractéristiques
export const ABILITY_LABELS: Record<keyof AbilityScores, string> = {
  strength: 'Force',
  dexterity: 'Dextérité',
  constitution: 'Constitution',
  intelligence: 'Intelligence',
  wisdom: 'Sagesse',
  charisma: 'Charisme'
};

