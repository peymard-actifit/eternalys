// =============================================================================
// SYSTÈME DE PROGRESSION - ETERNALYS
// =============================================================================
// Gère l'XP, les level ups et les talents
// =============================================================================

import { Character, CharacterTalent } from '../types/game.types';

// =============================================================================
// FONCTIONS D&D LOCALES
// =============================================================================

const getAbilityModifier = (score: number): number => Math.floor((score - 10) / 2);
const getProficiencyBonus = (level: number): number => Math.floor((level - 1) / 4) + 2;

const HIT_DICE: Record<string, number> = {
  'Mage': 6, 'Nécromancien': 6, 'Élémentaliste': 6, 'Ensorceleur': 6,
  'Occultiste': 8, 'Prêtresse': 8, 'Druide': 8, 'Oracle': 8, 'Clerc de Vie': 8,
  'Barde': 8, 'Scalde': 8, 'Roublard': 8, 'Ninja': 8, 'Voleur': 8, 'Assassin': 8,
  'Moine': 8, 'Pugiliste': 8, 'Guerrier': 10, 'Chevalier': 10, 'Paladin': 10,
  'Archère': 10, 'Rôdeur': 10, 'Arbalétrier': 10, 'Seigneur de guerre': 10,
  'Berserker': 12, 'Gardien': 12,
};

const calculateMaxHP = (className: string, level: number, conScore: number): number => {
  const hitDie = HIT_DICE[className] || 8;
  const conMod = getAbilityModifier(conScore);
  const level1HP = hitDie + conMod;
  const averageHitDie = Math.ceil(hitDie / 2) + 1;
  const additionalHP = (level - 1) * (averageHitDie + conMod);
  return Math.max(1, level1HP + additionalHP);
};

function getXPFromCR(cr: number): number {
  const baseXP: Record<number, number> = {
    0: 10, 1: 200, 2: 450, 3: 700, 4: 1100, 5: 1800,
    6: 2300, 7: 2900, 8: 3900, 9: 5000, 10: 5900,
    11: 7200, 12: 8400, 13: 10000, 14: 11500, 15: 13000,
    16: 15000, 17: 18000, 18: 20000, 19: 22000, 20: 25000,
    21: 33000, 22: 41000, 23: 50000, 24: 62000, 25: 75000,
    26: 90000, 27: 105000, 28: 120000, 29: 135000, 30: 155000,
  };
  if (cr <= 30 && baseXP[cr] !== undefined) return baseXP[cr];
  if (cr > 30) return Math.floor(155000 * Math.pow(1.12, cr - 30));
  return 10;
}

const TALENT_LEVELS = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100];
const isTalentLevel = (level: number): boolean => TALENT_LEVELS.includes(level);

// =============================================================================
// GESTION DE L'XP
// =============================================================================

/**
 * Calcule l'XP gagné après un combat
 */
export function calculateCombatXP(
  enemyCR: number,
  teamSize: number,
  wasVictory: boolean
): number {
  if (!wasVictory) return 0;
  
  const baseXP = getXPFromCR(enemyCR);
  
  // L'XP est divisé entre les membres de l'équipe
  const xpPerMember = Math.floor(baseXP / teamSize);
  
  return xpPerMember;
}

/**
 * Ajoute de l'XP à un personnage et gère le level up
 */
export function addXP(character: Character, xpGained: number): {
  character: Character;
  leveledUp: boolean;
  newLevel: number;
} {
  const newTotalXP = character.totalXP + xpGained;
  let newXP = character.xp + xpGained;
  let currentLevel = character.level;
  let leveledUp = false;
  
  // Vérifier les level ups successifs
  while (currentLevel < 100) {
    const xpForNext = getXPForNextLevel(currentLevel);
    if (newXP >= xpForNext) {
      newXP -= xpForNext;
      currentLevel++;
      leveledUp = true;
    } else {
      break;
    }
  }
  
  if (leveledUp) {
    // Appliquer le level up
    const updatedCharacter = applyLevelUp(character, currentLevel);
    return {
      character: {
        ...updatedCharacter,
        xp: newXP,
        totalXP: newTotalXP,
      },
      leveledUp: true,
      newLevel: currentLevel,
    };
  }
  
  return {
    character: {
      ...character,
      xp: newXP,
      totalXP: newTotalXP,
    },
    leveledUp: false,
    newLevel: character.level,
  };
}

/**
 * Retourne l'XP nécessaire pour passer au niveau suivant
 */
export function getXPForNextLevel(currentLevel: number): number {
  // Seuils XP simplifiés pour les 100 niveaux
  if (currentLevel >= 100) return Infinity;
  
  // Niveaux 1-20: progression D&D standard
  const baseThresholds: Record<number, number> = {
    1: 300, 2: 600, 3: 1800, 4: 3800, 5: 7500,
    6: 9000, 7: 11000, 8: 14000, 9: 16000, 10: 21000,
    11: 15000, 12: 20000, 13: 20000, 14: 25000, 15: 30000,
    16: 30000, 17: 40000, 18: 40000, 19: 50000, 20: 50000,
  };
  
  if (currentLevel <= 20 && baseThresholds[currentLevel]) {
    return baseThresholds[currentLevel];
  }
  
  // Niveaux 21-100: progression étendue
  return Math.floor(50000 * (1 + (currentLevel - 20) * 0.1));
}

/**
 * Applique un level up à un personnage
 */
export function applyLevelUp(character: Character, newLevel: number): Character {
  const oldLevel = character.level;
  const levelDiff = newLevel - oldLevel;
  
  // Nouveau bonus de maîtrise
  const newProfBonus = getProficiencyBonus(newLevel);
  
  // Nouveaux PV max
  const newMaxHp = calculateMaxHP(character.class, newLevel, character.abilities.constitution);
  const hpGain = newMaxHp - character.maxHp;
  
  // Vérifier si un choix de talent est disponible
  const hasTalentChoice = checkForTalentChoice(oldLevel, newLevel);
  
  return {
    ...character,
    level: newLevel,
    proficiencyBonus: newProfBonus,
    maxHp: newMaxHp,
    hp: Math.min(character.hp + hpGain, newMaxHp), // Gagne les PV du level up
    pendingTalentChoice: hasTalentChoice,
  };
}

/**
 * Vérifie si un niveau de talent a été atteint
 */
function checkForTalentChoice(oldLevel: number, newLevel: number): boolean {
  for (let level = oldLevel + 1; level <= newLevel; level++) {
    if (isTalentLevel(level)) {
      return true;
    }
  }
  return false;
}

// =============================================================================
// GESTION DES TALENTS
// =============================================================================

/**
 * Talents disponibles par classe (Option C - niveaux clés)
 */
export const CLASS_TALENTS: Record<string, CharacterTalent[]> = {
  'Guerrier': [
    {
      id: 'fighter_champion',
      name: 'Voie du Champion',
      description: 'Critiques améliorés (19-20), puis 18-20 au niveau 15.',
      icon: '⚔️',
      tier: 1,
      branch: 'Champion',
      effects: [{ type: 'passive', passiveType: 'critical', value: 5 }]
    },
    {
      id: 'fighter_battlemaster',
      name: 'Voie du Maître de Bataille',
      description: 'Accès aux manœuvres tactiques.',
      icon: '🎯',
      tier: 1,
      branch: 'Maître de Bataille',
      effects: [{ type: 'ability_bonus', ability: 'strength', value: 1 }]
    },
    {
      id: 'fighter_defense',
      name: 'Style Défensif',
      description: '+1 à la CA lorsque vous portez une armure.',
      icon: '🛡️',
      tier: 1,
      branch: 'Défense',
      effects: [{ type: 'passive', passiveType: 'evasion', value: 5 }]
    },
  ],
  'Berserker': [
    {
      id: 'berserker_frenzy',
      name: 'Frénésie',
      description: 'Attaque bonus en rage mais épuisement après.',
      icon: '😤',
      tier: 1,
      branch: 'Frénésie',
      effects: [{ type: 'damage_bonus', value: 2 }]
    },
    {
      id: 'berserker_totem',
      name: 'Guerrier Totem',
      description: 'Résistances et capacités de votre totem.',
      icon: '🐻',
      tier: 1,
      branch: 'Totem',
      effects: [{ type: 'resistance', damageType: 'bludgeoning' }]
    },
  ],
  'Mage': [
    {
      id: 'mage_evocation',
      name: 'École d\'Évocation',
      description: 'Sorts de dégâts améliorés.',
      icon: '🔥',
      tier: 1,
      branch: 'Évocation',
      effects: [{ type: 'damage_bonus', value: 2 }]
    },
    {
      id: 'mage_abjuration',
      name: 'École d\'Abjuration',
      description: 'Bouclier arcanique protecteur.',
      icon: '🛡️',
      tier: 1,
      branch: 'Abjuration',
      effects: [{ type: 'hp_bonus', value: 5 }]
    },
  ],
  'Prêtresse': [
    {
      id: 'cleric_life',
      name: 'Domaine de la Vie',
      description: 'Soins améliorés.',
      icon: '💚',
      tier: 1,
      branch: 'Vie',
      effects: [{ type: 'passive', passiveType: 'regeneration', value: 2 }]
    },
    {
      id: 'cleric_light',
      name: 'Domaine de la Lumière',
      description: 'Sorts de lumière et de feu.',
      icon: '☀️',
      tier: 1,
      branch: 'Lumière',
      effects: [{ type: 'damage_bonus', value: 2, damageType: 'radiant' }]
    },
  ],
  'Roublard': [
    {
      id: 'rogue_assassin',
      name: 'Assassin',
      description: 'Dégâts doublés sur cibles surprises.',
      icon: '🗡️',
      tier: 1,
      branch: 'Assassin',
      effects: [{ type: 'passive', passiveType: 'critical', value: 10 }]
    },
    {
      id: 'rogue_thief',
      name: 'Voleur',
      description: 'Actions bonus améliorées.',
      icon: '💰',
      tier: 1,
      branch: 'Voleur',
      effects: [{ type: 'passive', passiveType: 'evasion', value: 10 }]
    },
  ],
  // Talents par défaut pour les classes sans spécialisation définie
  'default': [
    {
      id: 'generic_strength',
      name: 'Force Accrue',
      description: '+2 en Force.',
      icon: '💪',
      tier: 1,
      branch: 'Amélioration',
      effects: [{ type: 'ability_bonus', ability: 'strength', value: 2 }]
    },
    {
      id: 'generic_dexterity',
      name: 'Agilité Accrue',
      description: '+2 en Dextérité.',
      icon: '🏃',
      tier: 1,
      branch: 'Amélioration',
      effects: [{ type: 'ability_bonus', ability: 'dexterity', value: 2 }]
    },
    {
      id: 'generic_constitution',
      name: 'Endurance Accrue',
      description: '+2 en Constitution.',
      icon: '❤️',
      tier: 1,
      branch: 'Amélioration',
      effects: [{ type: 'ability_bonus', ability: 'constitution', value: 2 }]
    },
    {
      id: 'generic_intelligence',
      name: 'Intelligence Accrue',
      description: '+2 en Intelligence.',
      icon: '🧠',
      tier: 1,
      branch: 'Amélioration',
      effects: [{ type: 'ability_bonus', ability: 'intelligence', value: 2 }]
    },
    {
      id: 'generic_wisdom',
      name: 'Sagesse Accrue',
      description: '+2 en Sagesse.',
      icon: '🦉',
      tier: 1,
      branch: 'Amélioration',
      effects: [{ type: 'ability_bonus', ability: 'wisdom', value: 2 }]
    },
    {
      id: 'generic_charisma',
      name: 'Charisme Accru',
      description: '+2 en Charisme.',
      icon: '✨',
      tier: 1,
      branch: 'Amélioration',
      effects: [{ type: 'ability_bonus', ability: 'charisma', value: 2 }]
    },
  ],
};

/**
 * Retourne les talents disponibles pour une classe à un niveau donné
 */
export function getAvailableTalents(
  className: string,
  level: number,
  existingTalents: CharacterTalent[] = []
): CharacterTalent[] {
  const classTalents = CLASS_TALENTS[className] || CLASS_TALENTS['default'];
  const existingIds = existingTalents.map(t => t.id);
  
  // Calculer le tier basé sur le niveau
  const tier = Math.floor(level / 5);
  
  // Filtrer les talents disponibles
  return classTalents.filter(talent => 
    !existingIds.includes(talent.id) && talent.tier <= tier
  );
}

/**
 * Applique un talent à un personnage
 */
export function applyTalent(character: Character, talent: CharacterTalent): Character {
  const talents = [...(character.talents || []), talent];
  
  // Appliquer les effets du talent
  let updatedCharacter = { ...character, talents, pendingTalentChoice: false };
  
  for (const effect of talent.effects) {
    switch (effect.type) {
      case 'ability_bonus':
        if (effect.ability && effect.value) {
          updatedCharacter.abilities = {
            ...updatedCharacter.abilities,
            [effect.ability]: updatedCharacter.abilities[effect.ability] + effect.value
          };
          // Recalculer les PV si constitution augmente
          if (effect.ability === 'constitution') {
            updatedCharacter.maxHp = calculateMaxHP(
              character.class, 
              character.level, 
              updatedCharacter.abilities.constitution
            );
            updatedCharacter.hp = Math.min(updatedCharacter.hp, updatedCharacter.maxHp);
          }
        }
        break;
        
      case 'hp_bonus':
        if (effect.value) {
          updatedCharacter.maxHp += effect.value;
          updatedCharacter.hp += effect.value;
        }
        break;
        
      case 'resistance':
        if (effect.damageType) {
          updatedCharacter.resistances = [
            ...(updatedCharacter.resistances || []),
            effect.damageType
          ];
        }
        break;
        
      case 'passive':
        if (effect.passiveType && effect.value) {
          updatedCharacter.passiveEffects = {
            ...updatedCharacter.passiveEffects,
            [effect.passiveType]: (updatedCharacter.passiveEffects?.[effect.passiveType] || 0) + effect.value
          };
        }
        break;
    }
  }
  
  return updatedCharacter;
}

// =============================================================================
// EXPORT
// =============================================================================

export const PROGRESSION = {
  calculateCombatXP,
  addXP,
  getXPForNextLevel,
  applyLevelUp,
  getAvailableTalents,
  applyTalent,
  CLASS_TALENTS,
};

export default PROGRESSION;

