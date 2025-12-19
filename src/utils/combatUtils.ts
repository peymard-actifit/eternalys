/**
 * Combat Utilities - Fonctions d'accès au state
 * 
 * Ce fichier contient uniquement les fonctions d'accès au state global.
 * Pour les actions de combat (dégâts, lifesteal, buffs), utiliser combatActions.ts
 * Pour les mécaniques D&D (jets de dés, sauvegardes), utiliser dndMechanics.ts
 */

import { gameStore } from '../store/gameStore';
import { Character, Monster, Skill, ActiveBuff } from '../types/game.types';

// ============================================
// ACCÈS AU STATE - Personnages
// ============================================

/**
 * Récupère un personnage depuis le state global par son ID.
 * TOUJOURS utiliser cette fonction pour obtenir un personnage à jour.
 */
export function getCharacterFromState(characterId: string): Character | undefined {
  return gameStore.getState().team.find(c => c.id === characterId);
}

/**
 * Récupère tous les personnages vivants
 */
export function getAliveCharacters(): Character[] {
  return gameStore.getState().team.filter(c => c.hp > 0);
}

/**
 * Met à jour un personnage dans le state global.
 * Préserve automatiquement tous les autres personnages et leurs propriétés.
 */
export function updateCharacterInState(
  characterId: string, 
  updates: Partial<Character>
): Character | undefined {
  const currentTeam = gameStore.getState().team;
  const updatedTeam = currentTeam.map(c => {
    if (c.id === characterId) {
      return { ...c, ...updates };
    }
    return c;
  });
  gameStore.setState({ team: updatedTeam });
  return updatedTeam.find(c => c.id === characterId);
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

// ============================================
// ACCÈS AU STATE - Monstres
// ============================================

/**
 * Récupère un monstre depuis le state global par son ID.
 */
export function getMonsterFromState(monsterId: string): Monster | undefined {
  return gameStore.getState().currentEnemies.find(e => e.id === monsterId);
}

/**
 * Récupère tous les monstres vivants
 */
export function getAliveMonsters(): Monster[] {
  return gameStore.getState().currentEnemies.filter(e => e.hp > 0);
}

/**
 * Met à jour un monstre dans le state global.
 */
export function updateMonsterInState(
  monsterId: string,
  updates: Partial<Monster>
): Monster | undefined {
  const currentEnemies = gameStore.getState().currentEnemies;
  const updatedEnemies = currentEnemies.map(e => {
    if (e.id === monsterId) {
      return { ...e, ...updates };
    }
    return e;
  });
  gameStore.setState({ 
    currentEnemies: updatedEnemies,
    currentEnemy: updatedEnemies[0] 
  });
  return updatedEnemies.find(e => e.id === monsterId);
}

// ============================================
// UTILITAIRES DE COOLDOWN
// ============================================

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

// ============================================
// UTILITAIRES DE BUFFS
// ============================================

/**
 * Ajoute un buff à un personnage.
 */
export function addBuffToCharacter(characterId: string, buff: ActiveBuff): void {
  const character = getCharacterFromState(characterId);
  if (!character) return;
  
  const existingBuffIndex = (character.buffs || []).findIndex(b => b.id === buff.id);
  let newBuffs: ActiveBuff[];
  
  if (existingBuffIndex >= 0) {
    newBuffs = [...(character.buffs || [])];
    newBuffs[existingBuffIndex] = buff;
  } else {
    newBuffs = [...(character.buffs || []), buff];
  }
  
  const updatedChar = updateCharacterInState(characterId, { buffs: newBuffs });
  
  // Recalculer les stats
  if (updatedChar) {
    const recalculated = gameStore.recalculateStats(updatedChar);
    updateCharacterInState(characterId, {
      attack: recalculated.attack,
      magicAttack: recalculated.magicAttack,
      defense: recalculated.defense,
      magicDefense: recalculated.magicDefense,
      speed: recalculated.speed
    });
  }
}

// ============================================
// VÉRIFICATIONS DE PASSIFS
// ============================================

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

