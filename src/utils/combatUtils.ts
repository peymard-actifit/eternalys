/**
 * Combat Utilities
 * 
 * Ce fichier centralise les fonctions utilitaires pour le combat.
 * Utiliser ces fonctions garantit la cohérence du state et évite les bugs
 * de synchronisation entre le state local et global.
 */

import { gameStore } from '../store/gameStore';
import { Character, Monster, Skill, ActiveBuff } from '../types/game.types';

/**
 * Récupère un personnage depuis le state global par son ID.
 * TOUJOURS utiliser cette fonction pour obtenir un personnage à jour.
 */
export function getCharacterFromState(characterId: string): Character | undefined {
  return gameStore.getState().team.find(c => c.id === characterId);
}

/**
 * Récupère un monstre depuis le state global par son ID.
 */
export function getMonsterFromState(monsterId: string): Monster | undefined {
  return gameStore.getState().currentEnemies.find(e => e.id === monsterId);
}

/**
 * Met à jour un personnage dans le state global.
 * Préserve automatiquement tous les autres personnages et leurs propriétés.
 */
export function updateCharacterInState(
  characterId: string, 
  updates: Partial<Character>
): Character {
  const currentTeam = gameStore.getState().team;
  const updatedTeam = currentTeam.map(c => {
    if (c.id === characterId) {
      return { ...c, ...updates };
    }
    return c;
  });
  gameStore.setState({ team: updatedTeam });
  return updatedTeam.find(c => c.id === characterId)!;
}

/**
 * Met à jour les skills d'un personnage (préserve les autres propriétés).
 */
export function updateCharacterSkills(
  characterId: string,
  skillUpdater: (skills: Skill[]) => Skill[]
): void {
  const currentTeam = gameStore.getState().team;
  const updatedTeam = currentTeam.map(c => {
    if (c.id === characterId) {
      return {
        ...c,
        skills: skillUpdater(c.skills || [])
      };
    }
    return c;
  });
  gameStore.setState({ team: updatedTeam });
}

/**
 * Applique un cooldown à une compétence.
 */
export function applySkillCooldown(characterId: string, skillId: string, cooldownValue: number): void {
  updateCharacterSkills(characterId, skills =>
    skills.map(s => s.id === skillId ? { ...s, currentCooldown: cooldownValue } : s)
  );
}

/**
 * Décrémente les cooldowns de toutes les compétences d'un personnage.
 * Retourne les noms des compétences qui sont redevenues disponibles.
 */
export function decrementCharacterCooldowns(characterId: string): string[] {
  const readySkills: string[] = [];
  const character = getCharacterFromState(characterId);
  
  if (!character?.skills) return readySkills;
  
  updateCharacterSkills(characterId, skills =>
    skills.map(skill => {
      if (skill.currentCooldown && skill.currentCooldown > 0) {
        const newCooldown = skill.currentCooldown - 1;
        if (newCooldown === 0) {
          readySkills.push(skill.name);
        }
        return { ...skill, currentCooldown: newCooldown };
      }
      return skill;
    })
  );
  
  return readySkills;
}

/**
 * Ajoute un buff à un personnage.
 */
export function addBuffToCharacter(characterId: string, buff: ActiveBuff): void {
  const character = getCharacterFromState(characterId);
  if (!character) return;
  
  const newBuffs = [...(character.buffs || []), buff];
  const updatedChar = updateCharacterInState(characterId, { buffs: newBuffs });
  
  // Recalculer les stats
  const recalculated = gameStore.recalculateStats(updatedChar);
  updateCharacterInState(characterId, {
    attack: recalculated.attack,
    magicAttack: recalculated.magicAttack,
    defense: recalculated.defense,
    magicDefense: recalculated.magicDefense,
    speed: recalculated.speed
  });
}

/**
 * Applique les dégâts de vol de vie.
 */
export function applyLifesteal(
  attackerId: string,
  damage: number,
  lifestealPercent: number
): number {
  if (lifestealPercent <= 0 || damage <= 0) return 0;
  
  const attacker = getCharacterFromState(attackerId);
  if (!attacker) return 0;
  
  const stolen = Math.floor(damage * lifestealPercent / 100);
  if (stolen > 0) {
    const newHp = Math.min(attacker.maxHp, attacker.hp + stolen);
    updateCharacterInState(attackerId, { hp: newHp });
  }
  
  return stolen;
}

/**
 * Calcule le lifesteal total d'un personnage (skill + passif).
 */
export function getTotalLifesteal(character: Character, skill?: Skill): number {
  let total = skill?.lifesteal || 0;
  
  if (character.passiveEffects?.lifesteal) {
    total += character.passiveEffects.lifesteal;
  }
  
  return total;
}

/**
 * Vérifie si un personnage a des effets passifs actifs.
 */
export function hasPassiveEffect(character: Character, effect: keyof NonNullable<Character['passiveEffects']>): boolean {
  return !!(character.passiveEffects?.[effect] && character.passiveEffects[effect]! > 0);
}

/**
 * Obtient la valeur d'un effet passif.
 */
export function getPassiveEffectValue(character: Character, effect: keyof NonNullable<Character['passiveEffects']>): number {
  return character.passiveEffects?.[effect] || 0;
}

/**
 * Vérifie si une compétence est en cooldown.
 */
export function isSkillOnCooldown(skill: Skill): boolean {
  return !!(skill.currentCooldown && skill.currentCooldown > 0);
}

/**
 * Filtre les compétences disponibles (pas en cooldown).
 */
export function getAvailableSkills(character: Character): Skill[] {
  return (character.skills || []).filter(s => !isSkillOnCooldown(s));
}

/**
 * Calcule les dégâts avec tous les modificateurs.
 */
export function calculateFinalDamage(
  baseDamage: number,
  attacker: Character | Monster,
  defender: Character | Monster,
  damageType: string = 'physical',
  isCritical: boolean = false
): number {
  // Calcul de base
  const isPhysical = ['physical', 'bludgeoning', 'piercing', 'slashing'].includes(damageType);
  const attackStat = isPhysical 
    ? attacker.attack 
    : ('magicAttack' in attacker ? attacker.magicAttack || 0 : 0);
  const defenseStat = isPhysical 
    ? defender.defense 
    : ('magicDefense' in defender ? defender.magicDefense : defender.defense);
  
  // Bonus de 30% de la stat offensive
  const statBonus = Math.floor(attackStat * 0.3);
  let damage = Math.max(1, baseDamage + statBonus - defenseStat);
  
  // Critical hit
  if (isCritical) {
    damage = Math.floor(damage * 2);
  }
  
  return damage;
}

/**
 * Vérifie un coup critique.
 */
export function checkCriticalHit(character: Character): { isCritical: boolean; multiplier: number } {
  let critChance = 5; // 5% de base
  
  if (character.passiveEffects?.critical) {
    critChance += character.passiveEffects.critical;
  }
  
  const roll = Math.random() * 100;
  return {
    isCritical: roll < critChance,
    multiplier: roll < critChance ? 2 : 1
  };
}

/**
 * Vérifie si une cible esquive.
 */
export function checkEvasion(target: Character): boolean {
  if (target.passiveEffects?.evasion) {
    const roll = Math.random() * 100;
    return roll < target.passiveEffects.evasion;
  }
  return false;
}

