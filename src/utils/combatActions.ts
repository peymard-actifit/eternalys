/**
 * ============================================
 * ACTIONS DE COMBAT - Logique centralisée
 * ============================================
 * 
 * Ce fichier centralise toute la logique de combat pour :
 * - Calculs de dégâts
 * - Vol de vie et épines
 * - Tracking des stats
 * - Gestion des buffs et cooldowns
 * 
 * Pour l'accès au state, utiliser les fonctions de combatUtils.ts
 * Pour les mécaniques D&D (jets de dés), utiliser dndMechanics.ts
 */

import { gameStore } from '../store/gameStore';
import { Character, Monster, Skill, ActiveBuff, DamageType } from '../types/game.types';
import { 
  makeAttackRoll, 
  rollDamage
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

/**
 * Enregistre les dégâts infligés par un personnage
 */
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

/**
 * Enregistre les dégâts subis par un personnage
 */
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

/**
 * Enregistre les soins effectués par un personnage
 */
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

/**
 * Enregistre un monstre tué par un personnage
 */
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
// FONCTIONS DE CALCUL DE DÉGÂTS
// ============================================

/**
 * Calcule les dégâts finaux après application des résistances
 */
export function calculateDamage(
  baseDamage: number,
  attacker: Character | Monster,
  defender: Character | Monster,
  damageType: string = 'physical',
  isCritical: boolean = false
): number {
  const isPhysical = ['physical', 'bludgeoning', 'piercing', 'slashing'].includes(damageType);
  
  // Bonus de stat offensive
  const attackStat = isPhysical 
    ? attacker.attack 
    : ('magicAttack' in attacker ? attacker.magicAttack || 0 : 0);
  const statBonus = Math.floor(attackStat * 0.3);
  
  // Défense
  const defenseStat = isPhysical 
    ? defender.defense 
    : ('magicDefense' in defender ? defender.magicDefense : defender.defense);
  
  let damage = Math.max(1, baseDamage + statBonus - defenseStat);
  
  // Critique
  if (isCritical) {
    damage = Math.floor(damage * 2);
  }
  
  // Résistances
  if (defender.resistances?.includes(damageType as DamageType)) {
    damage = Math.floor(damage * 0.5);
  }
  
  // Immunités
  if (defender.immunities?.includes(damageType as DamageType)) {
    damage = 0;
  }
  
  // Vulnérabilités
  if (defender.vulnerabilities?.includes(damageType as DamageType)) {
    damage = Math.floor(damage * 2);
  }
  
  return Math.max(0, damage);
}

/**
 * Vérifie si un personnage réussit une esquive passive
 */
export function checkEvasion(target: Character): boolean {
  if (target.passiveEffects?.evasion) {
    const roll = Math.random() * 100;
    return roll < target.passiveEffects.evasion;
  }
  return false;
}

/**
 * Vérifie un coup critique passif (hors jet d'attaque)
 */
export function checkCritical(attacker: Character): { isCritical: boolean; multiplier: number } {
  let critChance = 5; // 5% de base
  
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
// FONCTIONS DE VOL DE VIE ET ÉPINES
// ============================================

/**
 * Calcule et applique le vol de vie
 */
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

/**
 * Calcule le lifesteal total (skill + passif)
 */
export function getTotalLifesteal(character: Character, skill?: Skill): number {
  let total = skill?.lifesteal || 0;
  
  if (character.passiveEffects?.lifesteal) {
    total += character.passiveEffects.lifesteal;
  }
  
  return total;
}

/**
 * Applique le renvoi de dégâts (épines)
 */
export function applyThorns(
  target: Character,
  damage: number,
  enemy: Monster
): { reflected: number; logs: string[] } {
  const logs: string[] = [];
  let totalReflected = 0;
  
  // 1. Renvoi via buff temporaire
  const reflectBuff = target.buffs?.find(b => b.type === 'damage_reflect');
  if (reflectBuff && damage > 0) {
    const reflected = Math.max(1, Math.floor(damage * reflectBuff.value / 100));
    enemy.hp = Math.max(0, enemy.hp - reflected);
    totalReflected += reflected;
    logs.push(`🔄 ${target.name} renvoie ${reflected} dégâts à ${enemy.name} (buff) !`);
    trackDamageDealt(target.id, reflected);
  }
  
  // 2. Épines passives
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
// FONCTIONS DE CIBLAGE
// ============================================

/**
 * Choisit la cible du monstre (prend en compte la provocation)
 */
export function getMonsterTarget(aliveTeam: Character[]): Character {
  // Vérifier si un personnage a le buff Provocation
  const tauntingChars = aliveTeam.filter(c => 
    c.buffs?.some(b => b.type === 'damage_reflect' && b.isApplied)
  );
  
  if (tauntingChars.length > 0) {
    return tauntingChars[Math.floor(Math.random() * tauntingChars.length)];
  }
  
  // Cible aléatoire
  return aliveTeam[Math.floor(Math.random() * aliveTeam.length)];
}

// ============================================
// FONCTIONS DE BUFFS / COOLDOWNS
// ============================================

/**
 * Applique un cooldown à une compétence
 */
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

/**
 * Décrémente les cooldowns d'un personnage
 */
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

/**
 * Décrémente les buffs d'un personnage et retire les expirés
 */
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
  
  // Recalculer les stats si des buffs ont expiré
  if (expired.length > 0) {
    const char = updatedTeam.find(c => c.id === characterId);
    if (char) {
      gameStore.recalculateStats(char);
    }
  }
  
  return { expired, logs };
}

/**
 * Ajoute un buff à un personnage
 */
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
  
  // Recalculer les stats
  const char = updatedTeam.find(c => c.id === characterId);
  if (char) {
    gameStore.recalculateStats(char);
  }
}

// ============================================
// FONCTIONS DE RÉGÉNÉRATION
// ============================================

/**
 * Applique la régénération passive d'un personnage
 */
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
// FONCTIONS D'ATTAQUE
// ============================================

/**
 * Effectue une attaque de base d'un joueur
 */
export function performPlayerAttack(
  attacker: Character,
  target: Monster,
  hasAdvantage: boolean = false,
  hasDisadvantage: boolean = false
): AttackResult {
  const logs: string[] = [];
  
  // Jet d'attaque
  const attackResult = makeAttackRoll(attacker, target, false, hasAdvantage, hasDisadvantage);
  
  // Log du jet
  const chosenRoll = attackResult.attackRoll.chosenRoll || attackResult.attackRoll.rolls[0];
  const advantageText = hasAdvantage 
    ? `🎲🎲 (Avantage: ${attackResult.attackRoll.rolls.join('/')} → ${chosenRoll})`
    : hasDisadvantage 
      ? `🎲🎲 (Désavantage: ${attackResult.attackRoll.rolls.join('/')} → ${chosenRoll})`
      : '🎲';
  
  logs.push(`${advantageText} Jet d'attaque: ${chosenRoll} + ${attackResult.totalAttackBonus} = ${attackResult.attackRoll.total} vs CA ${attackResult.targetAC}`);
  
  // Raté
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
  
  // Calcul des dégâts
  const damageResult = rollDamage(attacker.attack, 'physical', attackResult.isCriticalHit, 0);
  let damage = calculateDamage(damageResult.totalDamage, attacker, target, 'physical', false);
  
  if (attackResult.isCriticalHit) {
    damage = Math.floor(damage * 2);
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
// RE-EXPORTS pour compatibilité
// ============================================

// Re-export depuis combatUtils pour éviter de casser les imports existants
export { isSkillOnCooldown } from './combatUtils';
export { getAvailableSkillsFromUtils as getAvailableSkills };
export { getCharacterFromState, updateCharacterInState } from './combatUtils';

