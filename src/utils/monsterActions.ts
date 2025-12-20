/**
 * ============================================
 * ACTIONS DES MONSTRES - Logique IA centralisée
 * ============================================
 * 
 * Ce fichier centralise toute la logique des actions des monstres :
 * - Choix des cibles
 * - Sélection des compétences
 * - Gestion des recharges
 * - Actions légendaires
 */

import { gameStore } from '../store/gameStore';
import { Character, Monster, MonsterSkill, LegendaryAction } from '../types/game.types';
import { 
  makeAttackRoll, 
  rollDamage, 
  makeSavingThrow,
  AttackRollResult,
  DamageRollResult
} from './dndMechanics';
import { 
  calculateDamage, 
  trackDamageDealt, 
  trackDamageTaken, 
  applyThorns,
  getMonsterTarget,
  checkEvasion
} from './combatActions';

// ============================================
// TYPES
// ============================================

export interface MonsterAction {
  type: 'attack' | 'skill' | 'legendary' | 'ultimate';
  skill?: MonsterSkill;
  legendaryAction?: LegendaryAction;
  targets: Character[];
  logs: string[];
}

export interface MonsterAttackResult {
  hit: boolean;
  damage: number;
  isCritical: boolean;
  isCriticalMiss: boolean;
  evaded: boolean;
  thornsReflected: number;
  targetKilled: boolean;
  logs: string[];
}

// ============================================
// GESTION DES RECHARGES (Type "Souffle de Dragon")
// ============================================

/**
 * Teste si une compétence avec recharge est disponible
 */
export function testRecharge(skill: MonsterSkill): boolean {
  if (!skill.recharge) return true;
  
  // Si déjà rechargée, disponible
  if (skill.isRecharged) return true;
  
  // Lancer un d6 et vérifier si >= min
  const roll = Math.floor(Math.random() * 6) + 1;
  return roll >= skill.recharge.min;
}

/**
 * Marque une compétence comme utilisée (en attente de recharge)
 */
export function markSkillUsed(monster: Monster, skillId: string): void {
  if (monster.skills) {
    const skill = monster.skills.find(s => s.id === skillId);
    if (skill && skill.recharge) {
      skill.isRecharged = false;
    }
  }
}

/**
 * Tente de recharger toutes les compétences d'un monstre
 */
export function attemptRechargeAll(monster: Monster): string[] {
  const recharged: string[] = [];
  
  if (monster.skills) {
    monster.skills.forEach(skill => {
      if (skill.recharge && !skill.isRecharged) {
        if (testRecharge(skill)) {
          skill.isRecharged = true;
          recharged.push(skill.name);
        }
      }
    });
  }
  
  return recharged;
}

// ============================================
// SÉLECTION D'ACTION
// ============================================

/**
 * Choisit une compétence appropriée pour un monstre
 */
export function selectMonsterSkill(monster: Monster, aliveTeam: Character[]): MonsterSkill | null {
  if (!monster.skills || monster.skills.length === 0) return null;
  
  // Filtrer les compétences disponibles (non en recharge)
  const availableSkills = monster.skills.filter(skill => {
    if (skill.recharge && !skill.isRecharged) return false;
    return true;
  });
  
  if (availableSkills.length === 0) return null;
  
  // Logique de sélection basique - peut être améliorée
  // Préférer les compétences de zone si plusieurs cibles
  if (aliveTeam.length >= 3) {
    const aoeSkill = availableSkills.find(s => s.areaOfEffect);
    if (aoeSkill) return aoeSkill;
  }
  
  // Sinon, choix aléatoire pondéré par les dégâts
  const totalWeight = availableSkills.reduce((sum, s) => sum + s.damage, 0);
  let random = Math.random() * totalWeight;
  
  for (const skill of availableSkills) {
    random -= skill.damage;
    if (random <= 0) return skill;
  }
  
  return availableSkills[0];
}

/**
 * Vérifie si le monstre peut utiliser son ultime
 */
export function canUseUltimate(monster: Monster, currentTurn: number): boolean {
  if (!monster.isBoss) return false;
  if (!monster.ultimateSkill) return false;
  if (monster.ultimateUsed) return false;
  
  const trigger = monster.ultimateTurnTrigger || 5;
  return currentTurn >= trigger;
}

// ============================================
// ACTIONS LÉGENDAIRES
// ============================================

/**
 * Réinitialise les actions légendaires d'un monstre
 */
export function resetLegendaryActions(monster: Monster): void {
  if (monster.legendaryActionsPerTurn) {
    monster.legendaryActionsRemaining = monster.legendaryActionsPerTurn;
  }
}

/**
 * Vérifie si le monstre peut utiliser une action légendaire
 */
export function canUseLegendaryAction(monster: Monster): boolean {
  return !!(monster.legendaryActionsRemaining && monster.legendaryActionsRemaining > 0);
}

/**
 * Sélectionne une action légendaire à utiliser
 */
export function selectLegendaryAction(monster: Monster): LegendaryAction | null {
  if (!monster.legendaryActions || !monster.legendaryActionsRemaining) return null;
  
  // Filtrer les actions dont le coût est abordable
  const affordable = monster.legendaryActions.filter(a => 
    a.cost <= (monster.legendaryActionsRemaining || 0)
  );
  
  if (affordable.length === 0) return null;
  
  // Choix aléatoire
  return affordable[Math.floor(Math.random() * affordable.length)];
}

/**
 * Utilise une action légendaire
 */
export function useLegendaryAction(monster: Monster, action: LegendaryAction): boolean {
  if (!monster.legendaryActionsRemaining || monster.legendaryActionsRemaining < action.cost) {
    return false;
  }
  
  monster.legendaryActionsRemaining -= action.cost;
  return true;
}

// ============================================
// EXÉCUTION D'ATTAQUE
// ============================================

/**
 * Effectue une attaque de monstre contre un personnage
 */
export function performMonsterAttack(
  monster: Monster,
  target: Character,
  skill?: MonsterSkill
): MonsterAttackResult {
  const logs: string[] = [];
  // Dégâts basés sur le CR du monstre si pas de skill
  const baseDamage = skill?.damage || Math.max(4, Math.floor((monster.challengeRating || 1) * 3));
  const attackDamage = baseDamage;
  const damageType = skill?.damageType || 'physical';
  const isSpellAttack = skill?.isSpellAttack || false;
  
  // Jet d'attaque
  const attackResult = makeAttackRoll(monster, target, isSpellAttack);
  
  logs.push(`🎲 ${monster.name} lance ${attackResult.attackRoll.rolls[0]} + ${attackResult.totalAttackBonus} = ${attackResult.attackRoll.total} vs CA ${attackResult.targetAC}`);
  
  // Échec critique
  if (attackResult.isCriticalMiss) {
    logs.push(`💨 Échec critique ! ${monster.name} rate complètement !`);
    return {
      hit: false,
      damage: 0,
      isCritical: false,
      isCriticalMiss: true,
      evaded: false,
      thornsReflected: 0,
      targetKilled: false,
      logs
    };
  }
  
  // Raté normal
  if (!attackResult.hit) {
    logs.push(`💨 ${monster.name} rate ${target.name} !`);
    return {
      hit: false,
      damage: 0,
      isCritical: false,
      isCriticalMiss: false,
      evaded: false,
      thornsReflected: 0,
      targetKilled: false,
      logs
    };
  }
  
  // Esquive passive
  if (checkEvasion(target) && !attackResult.isCriticalHit) {
    logs.push(`💨 ${target.name} esquive l'attaque de ${monster.name} !`);
    return {
      hit: true,
      damage: 0,
      isCritical: false,
      isCriticalMiss: false,
      evaded: true,
      thornsReflected: 0,
      targetKilled: false,
      logs
    };
  }
  
  // Calcul des dégâts
  let damage = calculateDamage(attackDamage, monster, target, damageType, false);
  
  if (attackResult.isCriticalHit) {
    damage = Math.floor(damage * 2);
    logs.push(`💥 COUP CRITIQUE !`);
  }
  
  // Appliquer les dégâts
  const newHp = Math.max(0, target.hp - damage);
  const targetKilled = newHp === 0;
  
  logs.push(`${skill ? `✨ ${skill.name}` : '⚔️ Attaque'}: ${monster.name} inflige ${damage} dégâts à ${target.name} !`);
  
  // Mettre à jour le personnage
  const currentTeam = gameStore.getState().team;
  const updatedTeam = currentTeam.map(c => 
    c.id === target.id ? { ...c, hp: newHp } : c
  );
  gameStore.setState({ team: updatedTeam });
  
  // Tracker les dégâts
  trackDamageTaken(target.id, damage);
  
  // Appliquer les épines
  const updatedTarget = updatedTeam.find(c => c.id === target.id)!;
  const thornsResult = applyThorns(updatedTarget, damage, monster);
  logs.push(...thornsResult.logs);
  
  if (targetKilled) {
    logs.push(`💀 ${target.name} est tombé !`);
  }
  
  return {
    hit: true,
    damage,
    isCritical: attackResult.isCriticalHit,
    isCriticalMiss: false,
    evaded: false,
    thornsReflected: thornsResult.reflected,
    targetKilled,
    logs
  };
}

/**
 * Effectue une compétence avec jet de sauvegarde
 */
export function performSavingThrowSkill(
  monster: Monster,
  skill: MonsterSkill,
  targets: Character[]
): { damage: number; logs: string[]; saved: boolean }[] {
  const results: { damage: number; logs: string[]; saved: boolean }[] = [];
  
  if (!skill.savingThrow) return results;
  
  for (const target of targets) {
    const logs: string[] = [];
    
    // Jet de sauvegarde
    const saveResult = makeSavingThrow(
      target,
      skill.savingThrow.ability,
      skill.savingThrow.dc
    );
    
    logs.push(`🎲 ${target.name} : ${saveResult.roll.rolls[0]} + ${saveResult.totalBonus} = ${saveResult.roll.total} vs DD ${saveResult.dc}`);
    
    // Calcul des dégâts
    let damage = calculateDamage(skill.damage, monster, target, skill.damageType || 'magical', false);
    
    if (saveResult.success) {
      damage = Math.floor(damage / 2); // Demi-dégâts sur sauvegarde réussie
      logs.push(`✓ ${target.name} résiste partiellement ! (${damage} dégâts)`);
    } else {
      logs.push(`✗ ${target.name} subit l'effet complet ! (${damage} dégâts)`);
    }
    
    // Appliquer les dégâts
    if (damage > 0) {
      const newHp = Math.max(0, target.hp - damage);
      const currentTeam = gameStore.getState().team;
      const updatedTeam = currentTeam.map(c => 
        c.id === target.id ? { ...c, hp: newHp } : c
      );
      gameStore.setState({ team: updatedTeam });
      trackDamageTaken(target.id, damage);
      
      if (newHp === 0) {
        logs.push(`💀 ${target.name} est tombé !`);
      }
    }
    
    results.push({ damage, logs, saved: saveResult.success });
  }
  
  return results;
}

/**
 * Décide de l'action du monstre pour son tour
 */
export function decideMonsterAction(monster: Monster, aliveTeam: Character[], currentTurn: number): MonsterAction {
  const logs: string[] = [];
  
  // Vérifier l'ultime
  if (canUseUltimate(monster, currentTurn)) {
    return {
      type: 'ultimate',
      skill: monster.ultimateSkill,
      targets: aliveTeam, // L'ultime cible généralement tout le monde
      logs: [`🔥 ${monster.name} prépare son attaque ultime : ${monster.ultimateSkill!.name} !`]
    };
  }
  
  // Tenter de recharger les compétences
  const recharged = attemptRechargeAll(monster);
  if (recharged.length > 0) {
    logs.push(`🔄 ${monster.name} recharge : ${recharged.join(', ')}`);
  }
  
  // Sélectionner une compétence ou attaque de base
  const skill = selectMonsterSkill(monster, aliveTeam);
  
  if (skill) {
    // Déterminer les cibles
    let targets: Character[];
    if (skill.areaOfEffect) {
      targets = aliveTeam;
    } else if (skill.attackCount && skill.attackCount > 1) {
      // Multi-attaque : plusieurs cibles possibles
      targets = aliveTeam.slice(0, skill.attackCount);
    } else {
      targets = [getMonsterTarget(aliveTeam)];
    }
    
    return {
      type: 'skill',
      skill,
      targets,
      logs
    };
  }
  
  // Attaque de base
  return {
    type: 'attack',
    targets: [getMonsterTarget(aliveTeam)],
    logs
  };
}

