/**
 * ============================================
 * ACTIONS DE COMBAT - VERSION D&D PURE
 * ============================================
 * Logique de combat basée à 100% sur D&D 5e
 */

import { gameStore } from '../store/gameStore';
import { Character, Monster, Skill, ActiveBuff, DamageType } from '../types/game.types';
import { 
  makeAttackRoll, 
  rollDamage,
  getAbilityModifier,
  getArmorClass,
  DamageRollResult
} from './dndMechanics';
import {
  getCharacterFromState,
  updateCharacterInState,
  isSkillOnCooldown,
  getAvailableSkills as getAvailableSkillsFromUtils
} from './combatUtils';

// ============================================
// TYPES
// ============================================

export interface CombatLog {
  message: string;
  type: 'info' | 'damage' | 'heal' | 'critical' | 'miss' | 'buff';
}

export interface DamageResult {
  damage: number;
  isCritical: boolean;
  damageType: string;
  absorbed: number;
}

export interface AttackResult {
  hit: boolean;
  isCritical: boolean;
  isCriticalMiss: boolean;
  damage: number;
  logs: string[];
}

// ============================================
// FONCTIONS DE TRACKING (Stats de combat)
// ============================================

export function trackDamageDealt(attackerId: string, damage: number): void {
  const currentTeam = gameStore.getState().team;
  const updatedTeam = currentTeam.map(c => {
    if (c.id === attackerId) {
      const stats = c.stats || { totalDamageDealt: 0, totalDamageTaken: 0, totalHealingDone: 0, monstersKilled: [] };
      return {
        ...c,
        stats: { ...stats, totalDamageDealt: stats.totalDamageDealt + damage }
      };
    }
    return c;
  });
  gameStore.setState({ team: updatedTeam });
}

export function trackDamageTaken(targetId: string, damage: number): void {
  const currentTeam = gameStore.getState().team;
  const updatedTeam = currentTeam.map(c => {
    if (c.id === targetId) {
      const stats = c.stats || { totalDamageDealt: 0, totalDamageTaken: 0, totalHealingDone: 0, monstersKilled: [] };
      return {
        ...c,
        stats: { ...stats, totalDamageTaken: stats.totalDamageTaken + damage }
      };
    }
    return c;
  });
  gameStore.setState({ team: updatedTeam });
}

export function trackHealing(healerId: string, healing: number): void {
  const currentTeam = gameStore.getState().team;
  const updatedTeam = currentTeam.map(c => {
    if (c.id === healerId) {
      const stats = c.stats || { totalDamageDealt: 0, totalDamageTaken: 0, totalHealingDone: 0, monstersKilled: [] };
      return {
        ...c,
        stats: { ...stats, totalHealingDone: stats.totalHealingDone + healing }
      };
    }
    return c;
  });
  gameStore.setState({ team: updatedTeam });
}

export function trackMonsterKill(killerId: string, monsterName: string): void {
  const currentTeam = gameStore.getState().team;
  const updatedTeam = currentTeam.map(c => {
    if (c.id === killerId) {
      const stats = c.stats || { totalDamageDealt: 0, totalDamageTaken: 0, totalHealingDone: 0, monstersKilled: [] };
      return {
        ...c,
        stats: { ...stats, monstersKilled: [...(stats.monstersKilled || []), monsterName] }
      };
    }
    return c;
  });
  gameStore.setState({ team: updatedTeam });
}

// ============================================
// CALCUL DE DÉGÂTS D&D
// ============================================

/**
 * Calcule les dégâts finaux D&D
 * - Pas de bonus d'attaque/défense numériques
 * - Utilise les résistances/immunités/vulnérabilités
 */
export function calculateDamage(
  baseDamage: number,
  attacker: Character | Monster,
  defender: Character | Monster,
  damageType: string = 'physical',
  isCritical: boolean = false
): number {
  let damage = baseDamage;
  
  // Double en cas de critique
  if (isCritical) {
    damage = Math.floor(damage * 2);
  }
  
  // Résistances (demi-dégâts)
  if (defender.resistances?.includes(damageType as DamageType)) {
    damage = Math.floor(damage * 0.5);
  }
  
  // Immunités (0 dégâts)
  if (defender.immunities?.includes(damageType as DamageType)) {
    damage = 0;
  }
  
  // Vulnérabilités (double dégâts)
  if (defender.vulnerabilities?.includes(damageType as DamageType)) {
    damage = Math.floor(damage * 2);
  }
  
  return Math.max(0, damage);
}

/**
 * Vérifie une esquive passive
 */
export function checkEvasion(target: Character): boolean {
  if (target.passiveEffects?.evasion) {
    const roll = Math.random() * 100;
    return roll < target.passiveEffects.evasion;
  }
  return false;
}

/**
 * Vérifie un coup critique passif
 */
export function checkCritical(attacker: Character): { isCritical: boolean; multiplier: number } {
  let critChance = 5;
  
  if (attacker.passiveEffects?.critical) {
    critChance += attacker.passiveEffects.critical;
  }
  
  const roll = Math.random() * 100;
  return {
    isCritical: roll < critChance,
    multiplier: roll < critChance ? 2 : 1
  };
}

// ============================================
// VOL DE VIE ET ÉPINES
// ============================================

export function applyLifesteal(
  attackerId: string,
  damage: number,
  lifestealPercent: number
): { stolen: number; newHp: number } {
  if (lifestealPercent <= 0 || damage <= 0) return { stolen: 0, newHp: 0 };
  
  const attacker = getCharacterFromState(attackerId);
  if (!attacker) return { stolen: 0, newHp: 0 };
  
  const stolen = Math.floor(damage * lifestealPercent / 100);
  if (stolen > 0) {
    const newHp = Math.min(attacker.maxHp, attacker.hp + stolen);
    updateCharacterInState(attackerId, { hp: newHp });
    return { stolen, newHp };
  }
  
  return { stolen: 0, newHp: attacker.hp };
}

export function getTotalLifesteal(character: Character, skill?: Skill): number {
  let total = skill?.lifesteal || 0;
  
  if (character.passiveEffects?.lifesteal) {
    total += character.passiveEffects.lifesteal;
  }
  
  return total;
}

export function applyThorns(
  target: Character,
  damage: number,
  enemy: Monster
): { reflected: number; logs: string[] } {
  const logs: string[] = [];
  let totalReflected = 0;
  
  const reflectBuff = target.buffs?.find(b => b.type === 'damage_reflect');
  if (reflectBuff && damage > 0) {
    const reflected = Math.max(1, Math.floor(damage * reflectBuff.value / 100));
    enemy.hp = Math.max(0, enemy.hp - reflected);
    totalReflected += reflected;
    logs.push(`🔄 ${target.name} renvoie ${reflected} dégâts à ${enemy.name} (buff) !`);
    trackDamageDealt(target.id, reflected);
  }
  
  if (target.passiveEffects?.thorns && target.passiveEffects.thorns > 0 && damage > 0) {
    const thorns = Math.max(1, Math.floor(damage * target.passiveEffects.thorns / 100));
    enemy.hp = Math.max(0, enemy.hp - thorns);
    totalReflected += thorns;
    logs.push(`🌿 ${target.name} inflige ${thorns} dégâts d'épines à ${enemy.name} !`);
    trackDamageDealt(target.id, thorns);
  }
  
  return { reflected: totalReflected, logs };
}

// ============================================
// CIBLAGE
// ============================================

export function getMonsterTarget(aliveTeam: Character[]): Character {
  const tauntingChars = aliveTeam.filter(c => 
    c.buffs?.some(b => b.type === 'damage_reflect' && b.isApplied)
  );
  
  if (tauntingChars.length > 0) {
    return tauntingChars[Math.floor(Math.random() * tauntingChars.length)];
  }
  
  return aliveTeam[Math.floor(Math.random() * aliveTeam.length)];
}

// ============================================
// BUFFS / COOLDOWNS
// ============================================

export function applySkillCooldown(characterId: string, skillId: string, cooldownValue: number): void {
  const currentTeam = gameStore.getState().team;
  const updatedTeam = currentTeam.map(c => {
    if (c.id === characterId) {
      return {
        ...c,
        skills: c.skills?.map(s => 
          s.id === skillId ? { ...s, currentCooldown: cooldownValue } : s
        ) || []
      };
    }
    return c;
  });
  gameStore.setState({ team: updatedTeam });
}

export function decrementCooldowns(characterId: string): string[] {
  const readySkills: string[] = [];
  const currentTeam = gameStore.getState().team;
  
  const updatedTeam = currentTeam.map(c => {
    if (c.id === characterId && c.skills) {
      const updatedSkills = c.skills.map(skill => {
        if (skill.currentCooldown && skill.currentCooldown > 0) {
          const newCooldown = skill.currentCooldown - 1;
          if (newCooldown === 0) {
            readySkills.push(skill.name);
          }
          return { ...skill, currentCooldown: newCooldown };
        }
        return skill;
      });
      return { ...c, skills: updatedSkills };
    }
    return c;
  });
  
  gameStore.setState({ team: updatedTeam });
  return readySkills;
}

export function decrementBuffs(characterId: string): { expired: string[]; logs: string[] } {
  const expired: string[] = [];
  const logs: string[] = [];
  const currentTeam = gameStore.getState().team;
  
  const updatedTeam = currentTeam.map(c => {
    if (c.id !== characterId) return c;
    
    const newBuffs = (c.buffs || []).filter(buff => {
      if (buff.turnsRemaining > 0) {
        const newTurns = buff.turnsRemaining - 1;
        if (newTurns <= 0) {
          expired.push(buff.name);
          logs.push(`⏰ ${buff.name} expire sur ${c.name}`);
          return false;
        }
        buff.turnsRemaining = newTurns;
      }
      return true;
    });
    
    return { ...c, buffs: newBuffs };
  });
  
  gameStore.setState({ team: updatedTeam });
  
  return { expired, logs };
}

export function addBuff(characterId: string, buff: ActiveBuff): void {
  const currentTeam = gameStore.getState().team;
  const updatedTeam = currentTeam.map(c => {
    if (c.id === characterId) {
      const existingBuffIndex = (c.buffs || []).findIndex(b => b.id === buff.id);
      let newBuffs: ActiveBuff[];
      
      if (existingBuffIndex >= 0) {
        newBuffs = [...(c.buffs || [])];
        newBuffs[existingBuffIndex] = buff;
      } else {
        newBuffs = [...(c.buffs || []), buff];
      }
      
      return { ...c, buffs: newBuffs };
    }
    return c;
  });
  
  gameStore.setState({ team: updatedTeam });
}

// ============================================
// RÉGÉNÉRATION
// ============================================

export function applyRegeneration(characterId: string): { healed: number; log: string | null } {
  const char = getCharacterFromState(characterId);
  if (!char) return { healed: 0, log: null };
  
  if (char.passiveEffects?.regeneration && char.passiveEffects.regeneration > 0) {
    const regenAmount = char.passiveEffects.regeneration;
    const healAmount = Math.min(regenAmount, char.maxHp - char.hp);
    
    if (healAmount > 0) {
      const newHp = Math.min(char.maxHp, char.hp + regenAmount);
      
      const currentTeam = gameStore.getState().team;
      const updatedTeam = currentTeam.map(c => {
        if (c.id === characterId) {
          const stats = c.stats || { totalDamageDealt: 0, totalDamageTaken: 0, totalHealingDone: 0, monstersKilled: [] };
          return {
            ...c,
            hp: newHp,
            stats: { ...stats, totalHealingDone: stats.totalHealingDone + healAmount }
          };
        }
        return c;
      });
      
      gameStore.setState({ team: updatedTeam });
      
      return {
        healed: healAmount,
        log: `💚 ${char.name} régénère ${healAmount} PV (passif)`
      };
    }
  }
  
  return { healed: 0, log: null };
}

// ============================================
// ATTAQUE DE BASE D&D
// ============================================

export function performPlayerAttack(
  attacker: Character,
  target: Monster,
  hasAdvantage: boolean = false,
  hasDisadvantage: boolean = false
): AttackResult {
  const logs: string[] = [];
  
  // Jet d'attaque D&D
  const attackResult = makeAttackRoll(attacker, target, false, hasAdvantage, hasDisadvantage);
  
  const chosenRoll = attackResult.attackRoll.chosenRoll || attackResult.attackRoll.rolls[0];
  const advantageText = hasAdvantage 
    ? `🎲🎲 (Avantage: ${attackResult.attackRoll.rolls.join('/')} → ${chosenRoll})`
    : hasDisadvantage 
      ? `🎲🎲 (Désavantage: ${attackResult.attackRoll.rolls.join('/')} → ${chosenRoll})`
      : '🎲';
  
  logs.push(`${advantageText} Jet d'attaque: ${chosenRoll} + ${attackResult.totalAttackBonus} = ${attackResult.attackRoll.total} vs CA ${attackResult.targetAC}`);
  
  if (!attackResult.hit) {
    logs.push(`❌ ${attacker.name} rate son attaque contre ${target.name} !`);
    return {
      hit: false,
      isCritical: false,
      isCriticalMiss: attackResult.isCriticalMiss,
      damage: 0,
      logs
    };
  }
  
  // Jet de dégâts D&D
  const damageResult = rollDamage(attacker, null, attackResult.isCriticalHit, false);
  const damage = calculateDamage(damageResult.totalDamage, attacker, target, 'physical', false);
  
  if (attackResult.isCriticalHit) {
    logs.push(`💥 COUP CRITIQUE ! ${attacker.name} frappe avec puissance !`);
  }
  
  logs.push(`⚔️ ${attacker.name} inflige ${damage} dégâts à ${target.name} !`);
  
  return {
    hit: true,
    isCritical: attackResult.isCriticalHit,
    isCriticalMiss: false,
    damage,
    logs
  };
}

// ============================================
// RE-EXPORTS
// ============================================

export { isSkillOnCooldown } from './combatUtils';
export { getAvailableSkillsFromUtils as getAvailableSkills };
export { getCharacterFromState, updateCharacterInState } from './combatUtils';
