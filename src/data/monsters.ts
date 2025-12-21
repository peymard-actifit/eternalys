// ============================================
// BESTIAIRE D&D 5e - ETHERNALYS
// Monstres organisés par Challenge Rating (CR)
// ============================================

import { Monster, CreatureType, AbilityScores, LegendaryAction, MonsterSkill } from '../types/game.types';
import { getLazyConvertedMonsters, getLazyConvertedBosses, convertMonsterToEternalysScale } from '../utils/monsterScaling';

// Helper pour créer les caractéristiques
const createAbilities = (str: number, dex: number, con: number, int: number, wis: number, cha: number): AbilityScores => ({
  strength: str, dexterity: dex, constitution: con, intelligence: int, wisdom: wis, charisma: cha
});

// ============================================
// CR 0 - 1/8 : CRÉATURES MINEURES
// ============================================

const RAT: Monster = {
  id: 'rat',
  name: 'Rat',
  hp: 1, maxHp: 1,
  armorClass: 10,
  abilities: createAbilities(2, 11, 9, 2, 10, 4),
  speed: 20,
  challengeRating: 0, xpReward: 10,
  creatureType: 'beast', size: 'tiny',
  portrait: '🐀',
  isBoss: false,
  description: 'Un petit rongeur commun.'
};

const BAT: Monster = {
  id: 'bat',
  name: 'Chauve-souris',
  hp: 1, maxHp: 1,
  armorClass: 12,
  abilities: createAbilities(2, 15, 8, 2, 12, 4),
  speed: 30,
  challengeRating: 0, xpReward: 10,
  creatureType: 'beast', size: 'tiny',
  portrait: '🦇',
  isBoss: false,
  description: 'Petit mammifère volant nocturne utilisant l\'écholocation pour naviguer dans l\'obscurité.'
};

const GIANT_RAT: Monster = {
  id: 'giant_rat',
  name: 'Rat géant',
  hp: 7, maxHp: 7,
  armorClass: 12,
  abilities: createAbilities(7, 15, 11, 2, 10, 4),
  speed: 30,
  challengeRating: 0.125, xpReward: 25,
  creatureType: 'beast', size: 'small',
  portrait: '🐀',
  isBoss: false,
  skills: [{
    id: 'bite', name: 'Morsure', damage: 4,
    damageType: 'piercing', type: 'attack',
    description: 'Morsure infectée'
  }]
};

const KOBOLD: Monster = {
  id: 'kobold',
  name: 'Kobold',
  hp: 5, maxHp: 5,
  armorClass: 12,
  abilities: createAbilities(7, 15, 9, 8, 7, 8),
  speed: 30,
  challengeRating: 0.125, xpReward: 25,
  creatureType: 'humanoid', size: 'small',
  portrait: '🦎',
  isBoss: false,
  description: 'Petit humanoïde reptilien rusé.'
};

// ============================================
// CR 1/4 : CRÉATURES FAIBLES
// ============================================

const SKELETON: Monster = {
  id: 'skeleton',
  name: 'Squelette',
  hp: 13, maxHp: 13,
  armorClass: 13,
  abilities: createAbilities(10, 14, 15, 6, 8, 5),
  speed: 30,
  challengeRating: 0.25, xpReward: 50,
  creatureType: 'undead', size: 'medium',
  portrait: '💀',
  isBoss: false,
  vulnerabilities: ['bludgeoning'],
  immunities: ['poison'],
  conditionImmunities: ['poisoned'],
  skills: [{
    id: 'shortsword', name: 'Épée courte', damage: 5,
    damageType: 'slashing', type: 'attack',
    description: 'Attaque tranchante'
  }]
};

const ZOMBIE: Monster = {
  id: 'zombie',
  name: 'Zombie',
  hp: 22, maxHp: 22,
  armorClass: 8,
  abilities: createAbilities(13, 6, 16, 3, 6, 5),
  speed: 20,
  challengeRating: 0.25, xpReward: 50,
  creatureType: 'undead', size: 'medium',
  portrait: '🧟',
  isBoss: false,
  immunities: ['poison'],
  conditionImmunities: ['poisoned'],
  description: 'Mort-vivant lent mais résistant.',
  skills: [{
    id: 'slam', name: 'Coup', damage: 4,
    damageType: 'bludgeoning', type: 'attack',
    description: 'Coup puissant'
  }]
};

const GOBLIN: Monster = {
  id: 'goblin',
  name: 'Gobelin',
  hp: 7, maxHp: 7,
  armorClass: 15,
  abilities: createAbilities(8, 14, 10, 10, 8, 8),
  speed: 30,
  challengeRating: 0.25, xpReward: 50,
  creatureType: 'humanoid', size: 'small',
  portrait: '👺',
  isBoss: false,
  skills: [{
    id: 'scimitar', name: 'Cimeterre', damage: 5,
    damageType: 'slashing', type: 'attack',
    description: 'Attaque rapide'
  }]
};

const WOLF: Monster = {
  id: 'wolf',
  name: 'Loup',
  hp: 11, maxHp: 11,
  armorClass: 13,
  abilities: createAbilities(12, 15, 12, 3, 12, 6),
  speed: 40,
  challengeRating: 0.25, xpReward: 50,
  creatureType: 'beast', size: 'medium',
  portrait: '🐺',
  isBoss: false,
  skills: [{
    id: 'bite', name: 'Morsure', damage: 7,
    damageType: 'piercing', type: 'attack',
    description: 'Peut faire tomber la cible'
  }]
};

// ============================================
// CR 1/2 : CRÉATURES COMMUNES
// ============================================

const ORC: Monster = {
  id: 'orc',
  name: 'Orc',
  hp: 15, maxHp: 15,
  armorClass: 13,
  abilities: createAbilities(16, 12, 16, 7, 11, 10),
  speed: 30,
  challengeRating: 0.5, xpReward: 100,
  creatureType: 'humanoid', size: 'medium',
  portrait: '👹',
  isBoss: false,
  skills: [{
    id: 'greataxe', name: 'Hache à deux mains', damage: 9,
    damageType: 'slashing', type: 'attack',
    description: 'Coup dévastateur'
  }]
};

const HOBGOBLIN: Monster = {
  id: 'hobgoblin',
  name: 'Hobgobelin',
  hp: 11, maxHp: 11,
  armorClass: 18,
  abilities: createAbilities(13, 12, 12, 10, 10, 9),
  speed: 30,
  challengeRating: 0.5, xpReward: 100,
  creatureType: 'humanoid', size: 'medium',
  portrait: '⚔️',
  isBoss: false,
  description: 'Gobelin guerrier discipliné.'
};

const SHADOW: Monster = {
  id: 'shadow',
  name: 'Ombre',
  hp: 16, maxHp: 16,
  armorClass: 12,
  abilities: createAbilities(6, 14, 13, 6, 10, 8),
  speed: 40,
  challengeRating: 0.5, xpReward: 100,
  creatureType: 'undead', size: 'medium',
  portrait: '👤',
  isBoss: false,
  vulnerabilities: ['radiant'],
  resistances: ['acid', 'cold', 'fire', 'lightning', 'thunder'],
  immunities: ['necrotic', 'poison'],
  skills: [{
    id: 'strength_drain', name: 'Drain de force', damage: 9,
    damageType: 'necrotic', type: 'special',
    description: 'Réduit la Force de la cible',
    effect: { type: 'debuff_target', stat: 'attack', value: 2, turns: 3 }
  }]
};

// ============================================
// CR 1 : MENACES MODÉRÉES
// ============================================

const BUGBEAR: Monster = {
  id: 'bugbear',
  name: 'Gobelours',
  hp: 27, maxHp: 27,
  armorClass: 16,
  abilities: createAbilities(15, 14, 13, 8, 11, 9),
  speed: 30,
  challengeRating: 1, xpReward: 200,
  creatureType: 'humanoid', size: 'medium',
  portrait: '🐻',
  isBoss: false,
  skills: [{
    id: 'morningstar', name: 'Morgenstern', damage: 11,
    damageType: 'piercing', type: 'attack',
    description: 'Attaque brutale'
  }]
};

const GHOUL: Monster = {
  id: 'ghoul',
  name: 'Goule',
  hp: 22, maxHp: 22,
  armorClass: 12,
  abilities: createAbilities(13, 15, 10, 7, 10, 6),
  speed: 30,
  challengeRating: 1, xpReward: 200,
  creatureType: 'undead', size: 'medium',
  portrait: '👻',
  isBoss: false,
  immunities: ['poison'],
  conditionImmunities: ['poisoned', 'charmed'],
  skills: [
    {
      id: 'bite', name: 'Morsure', damage: 9,
      damageType: 'piercing', type: 'attack',
      description: 'Morsure paralysante'
    },
    {
      id: 'claws', name: 'Griffes', damage: 7,
      damageType: 'slashing', type: 'special',
      description: 'Peut paralyser la cible',
      effect: { type: 'debuff_target', condition: 'paralyzed' }
    }
  ]
};

const DIRE_WOLF: Monster = {
  id: 'dire_wolf',
  name: 'Loup sanguinaire',
  hp: 37, maxHp: 37,
  armorClass: 14,
  abilities: createAbilities(17, 15, 15, 3, 12, 7),
  speed: 50,
  challengeRating: 1, xpReward: 200,
  creatureType: 'beast', size: 'large',
  portrait: '🐺',
  isBoss: false,
  skills: [{
    id: 'bite', name: 'Morsure', damage: 11,
    damageType: 'piercing', type: 'attack',
    description: 'Morsure puissante'
  }]
};

const SPECTER: Monster = {
  id: 'specter',
  name: 'Spectre',
  hp: 22, maxHp: 22,
  armorClass: 12,
  abilities: createAbilities(1, 14, 11, 10, 10, 11),
  speed: 50,
  challengeRating: 1, xpReward: 200,
  creatureType: 'undead', size: 'medium',
  portrait: '👻',
  isBoss: false,
  resistances: ['acid', 'cold', 'fire', 'lightning', 'thunder'],
  immunities: ['necrotic', 'poison'],
  conditionImmunities: ['charmed', 'paralyzed', 'poisoned', 'unconscious'],
  skills: [{
    id: 'life_drain', name: 'Drain de vie', damage: 10,
    damageType: 'necrotic', type: 'special',
    description: 'Réduit les PV max de la cible',
    effect: { type: 'lifesteal', value: 50 }
  }]
};

const BROWN_BEAR: Monster = {
  id: 'brown_bear',
  name: 'Ours brun',
  hp: 34, maxHp: 34,
  armorClass: 11,
  abilities: createAbilities(19, 10, 16, 2, 13, 7),
  speed: 40,
  challengeRating: 1, xpReward: 200,
  creatureType: 'beast', size: 'large',
  portrait: '🐻',
  isBoss: false,
  skills: [
    { id: 'bite', name: 'Morsure', damage: 8, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claws', name: 'Griffes', damage: 11, damageType: 'slashing', type: 'attack', description: 'Griffes' }
  ]
};

// ============================================
// CR 2 : DANGERS SÉRIEUX
// ============================================

const OGRE: Monster = {
  id: 'ogre',
  name: 'Ogre',
  hp: 59, maxHp: 59,
  armorClass: 11,
  abilities: createAbilities(19, 8, 16, 5, 7, 7),
  speed: 40,
  challengeRating: 2, xpReward: 450,
  creatureType: 'giant', size: 'large',
  portrait: '👹',
  isBoss: false,
  skills: [{
    id: 'greatclub', name: 'Gourdin', damage: 13,
    damageType: 'bludgeoning', type: 'attack',
    description: 'Coup de massue dévastateur'
  }]
};

const GHAST: Monster = {
  id: 'ghast',
  name: 'Blême',
  hp: 36, maxHp: 36,
  armorClass: 13,
  abilities: createAbilities(16, 17, 10, 11, 10, 8),
  speed: 30,
  challengeRating: 2, xpReward: 450,
  creatureType: 'undead', size: 'medium',
  portrait: '💀',
  isBoss: false,
  immunities: ['poison'],
  conditionImmunities: ['poisoned', 'charmed'],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 12, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claws', name: 'Griffes paralysantes', damage: 10, damageType: 'slashing', type: 'special', description: 'Peut paralyser' }
  ]
};

const GARGOYLE: Monster = {
  id: 'gargoyle',
  name: 'Gargouille',
  hp: 52, maxHp: 52,
  armorClass: 15,
  abilities: createAbilities(15, 11, 16, 6, 11, 7),
  speed: 60,
  challengeRating: 2, xpReward: 450,
  creatureType: 'elemental', size: 'medium',
  portrait: '🗿',
  isBoss: false,
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  immunities: ['poison'],
  conditionImmunities: ['poisoned', 'petrified'],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 5, damageType: 'piercing', type: 'attack', description: 'Morsure de pierre' },
    { id: 'claws', name: 'Griffes', damage: 5, damageType: 'slashing', type: 'attack', description: 'Griffes acérées' }
  ]
};

const MIMIC: Monster = {
  id: 'mimic',
  name: 'Mimique',
  hp: 58, maxHp: 58,
  armorClass: 12,
  abilities: createAbilities(17, 12, 15, 5, 13, 8),
  speed: 15,
  challengeRating: 2, xpReward: 450,
  creatureType: 'monstrosity', size: 'medium',
  portrait: '📦',
  isBoss: false,
  immunities: ['acid'],
  conditionImmunities: ['prone'],
  description: 'Créature déguisée en coffre ou meuble.',
  skills: [
    {
      id: 'bite', name: 'Morsure', damage: 7,
      damageType: 'piercing', type: 'attack',
      description: 'Morsure acide'
    },
    {
      id: 'pseudopod', name: 'Pseudopode', damage: 7,
      damageType: 'bludgeoning', type: 'special',
      description: 'Agrippe la cible',
      effect: { type: 'grapple' }
    }
  ]
};

const WEREWOLF: Monster = {
  id: 'werewolf',
  name: 'Loup-garou',
  hp: 58, maxHp: 58,
  armorClass: 12,
  abilities: createAbilities(15, 13, 14, 10, 11, 10),
  speed: 40,
  challengeRating: 3, xpReward: 700,
  creatureType: 'humanoid', size: 'medium',
  portrait: '🐺',
  isBoss: false,
  immunities: ['bludgeoning', 'piercing', 'slashing'],
  description: 'Lycanthrope maudit.',
  skills: [
    {
      id: 'bite', name: 'Morsure', damage: 6,
      damageType: 'piercing', type: 'special',
      description: 'Peut transmettre la lycanthropie'
    },
    {
      id: 'claws', name: 'Griffes', damage: 7,
      damageType: 'slashing', type: 'attack',
      description: 'Attaque bestiale'
    }
  ]
};

// ============================================
// CR 3-4 : MENACES IMPORTANTES
// ============================================

const HELL_HOUND: Monster = {
  id: 'hell_hound',
  name: 'Molosse infernal',
  hp: 45, maxHp: 45,
  armorClass: 15,
  abilities: createAbilities(17, 12, 14, 6, 13, 6),
  speed: 50,
  challengeRating: 3, xpReward: 700,
  creatureType: 'fiend', size: 'medium',
  portrait: '🔥',
  isBoss: false,
  immunities: ['fire'],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 7, damageType: 'piercing', type: 'attack', description: 'Morsure + feu' },
    {
      id: 'fire_breath', name: 'Souffle de feu', damage: 21,
      damageType: 'fire', type: 'special',
      description: 'Cône de flammes (15 pieds)',
      recharge: { min: 5, max: 6 },
      areaOfEffect: true
    }
  ]
};

const MINOTAUR: Monster = {
  id: 'minotaur',
  name: 'Minotaure',
  hp: 76, maxHp: 76,
  armorClass: 14,
  abilities: createAbilities(18, 11, 16, 6, 16, 9),
  speed: 40,
  challengeRating: 3, xpReward: 700,
  creatureType: 'monstrosity', size: 'large',
  portrait: '🐂',
  isBoss: false,
  skills: [
    { id: 'greataxe', name: 'Grande hache', damage: 17, damageType: 'slashing', type: 'attack', description: 'Coup puissant' },
    {
      id: 'gore', name: 'Encornage', damage: 13,
      damageType: 'piercing', type: 'special',
      description: 'Charge et empale'
    }
  ]
};

const OWLBEAR: Monster = {
  id: 'owlbear',
  name: 'Ours-hibou',
  hp: 59, maxHp: 59,
  armorClass: 13,
  abilities: createAbilities(20, 12, 17, 3, 12, 7),
  speed: 40,
  challengeRating: 3, xpReward: 700,
  creatureType: 'monstrosity', size: 'large',
  portrait: '🦉',
  isBoss: false,
  skills: [
    { id: 'beak', name: 'Bec', damage: 10, damageType: 'piercing', type: 'attack', description: 'Coup de bec' },
    { id: 'claws', name: 'Griffes', damage: 14, damageType: 'slashing', type: 'attack', description: 'Griffes lacérantes' }
  ]
};

const WIGHT: Monster = {
  id: 'wight',
  name: 'Nécrophage',
  hp: 45, maxHp: 45,
  armorClass: 14,
  abilities: createAbilities(15, 14, 16, 10, 13, 15),
  speed: 30,
  challengeRating: 3, xpReward: 700,
  creatureType: 'undead', size: 'medium',
  portrait: '⚰️',
  isBoss: false,
  resistances: ['necrotic'],
  immunities: ['poison'],
  conditionImmunities: ['poisoned'],
  skills: [
    {
      id: 'life_drain', name: 'Drain de vie', damage: 6,
      damageType: 'necrotic', type: 'special',
      description: 'Drain vital',
      effect: { type: 'lifesteal', value: 100 }
    },
    { id: 'longsword', name: 'Épée longue', damage: 11, damageType: 'slashing', type: 'attack', description: 'Attaque maudite' }
  ]
};

const BANSHEE: Monster = {
  id: 'banshee',
  name: 'Banshee',
  hp: 58, maxHp: 58,
  armorClass: 12,
  abilities: createAbilities(1, 14, 10, 12, 11, 17),
  speed: 40,
  challengeRating: 4, xpReward: 1100,
  creatureType: 'undead', size: 'medium',
  portrait: '👻',
  isBoss: false,
  resistances: ['acid', 'fire', 'lightning', 'thunder'],
  immunities: ['cold', 'necrotic', 'poison'],
  conditionImmunities: ['charmed', 'frightened', 'grappled', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained'],
  skills: [
    {
      id: 'wail', name: 'Hurlement', damage: 0,
      damageType: 'psychic', type: 'special',
      description: 'Hurlement mortel - jet de sauvegarde ou 0 PV',
      savingThrow: { ability: 'constitution', dc: 13 },
      areaOfEffect: true
    },
    {
      id: 'corrupting_touch', name: 'Toucher corrupteur', damage: 12,
      damageType: 'necrotic', type: 'attack',
      description: 'Attaque nécrotique'
    }
  ]
};

const FLAMESKULL: Monster = {
  id: 'flameskull',
  name: 'Crâne de feu',
  hp: 40, maxHp: 40,
  armorClass: 13,
  abilities: createAbilities(1, 17, 14, 16, 10, 11),
  speed: 40,
  challengeRating: 4, xpReward: 1100,
  creatureType: 'undead', size: 'tiny',
  portrait: '💀🔥',
  isBoss: false,
  resistances: ['lightning', 'necrotic', 'piercing'],
  immunities: ['cold', 'fire', 'poison'],
  conditionImmunities: ['charmed', 'frightened', 'paralyzed', 'poisoned', 'prone'],
  skills: [
    {
      id: 'fire_ray', name: 'Rayon de feu', damage: 10,
      damageType: 'fire', type: 'attack',
      description: 'Rayon de flammes'
    },
    {
      id: 'fireball', name: 'Boule de feu', damage: 28,
      damageType: 'fire', type: 'special',
      description: 'Explosion de feu (20 pieds)',
      areaOfEffect: true,
      savingThrow: { ability: 'dexterity', dc: 13 }
    }
  ]
};

// ============================================
// CR 5-6 : DANGERS MAJEURS
// ============================================

const TROLL: Monster = {
  id: 'troll',
  name: 'Troll',
  hp: 84, maxHp: 84,
  armorClass: 15,
  abilities: createAbilities(18, 13, 20, 7, 9, 7),
  speed: 30,
  challengeRating: 5, xpReward: 1800,
  creatureType: 'giant', size: 'large',
  portrait: '🧌',
  isBoss: false,
  vulnerabilities: ['acid', 'fire'],
  description: 'Régénère 10 PV par tour sauf feu/acide.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 7, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claws', name: 'Griffes', damage: 11, damageType: 'slashing', type: 'attack', description: 'Deux attaques de griffes' },
    {
      id: 'regeneration', name: 'Régénération', damage: 0,
      damageType: 'physical', type: 'buff',
      description: 'Récupère 10 PV',
      effect: { type: 'heal', value: 10 }
    }
  ]
};

const WRAITH: Monster = {
  id: 'wraith',
  name: 'Âme en peine',
  hp: 67, maxHp: 67,
  armorClass: 13,
  abilities: createAbilities(6, 16, 16, 12, 14, 15),
  speed: 60,
  challengeRating: 5, xpReward: 1800,
  creatureType: 'undead', size: 'medium',
  portrait: '👻',
  isBoss: false,
  resistances: ['acid', 'cold', 'fire', 'lightning', 'thunder'],
  immunities: ['necrotic', 'poison'],
  conditionImmunities: ['charmed', 'grappled', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained'],
  skills: [{
    id: 'life_drain', name: 'Drain de vie', damage: 21,
    damageType: 'necrotic', type: 'special',
    description: 'Drain vital majeur',
    effect: { type: 'lifesteal', value: 100 }
  }]
};

const SALAMANDER: Monster = {
  id: 'salamander',
  name: 'Salamandre',
  hp: 90, maxHp: 90,
  armorClass: 15,
  abilities: createAbilities(18, 14, 15, 11, 10, 12),
  speed: 30,
  challengeRating: 5, xpReward: 1800,
  creatureType: 'elemental', size: 'large',
  portrait: '🔥',
  isBoss: false,
  vulnerabilities: ['cold'],
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  immunities: ['fire'],
  skills: [
    {
      id: 'spear', name: 'Lance', damage: 11,
      damageType: 'piercing', type: 'attack',
      description: 'Lance brûlante + 7 dégâts de feu'
    },
    {
      id: 'tail', name: 'Queue', damage: 11,
      damageType: 'bludgeoning', type: 'attack',
      description: 'Coup de queue + 7 dégâts de feu + agrippé'
    }
  ]
};

const YOUNG_WHITE_DRAGON: Monster = {
  id: 'young_white_dragon',
  name: 'Jeune dragon blanc',
  hp: 133, maxHp: 133,
  armorClass: 17,
  abilities: createAbilities(18, 10, 18, 6, 11, 12),
  speed: 80,
  challengeRating: 6, xpReward: 2300,
  creatureType: 'dragon', size: 'large',
  portrait: '🐉',
  isBoss: false,
  immunities: ['cold'],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 15, damageType: 'piercing', type: 'attack', description: 'Morsure gelée' },
    { id: 'claws', name: 'Griffes', damage: 11, damageType: 'slashing', type: 'attack', description: 'Griffes' },
    {
      id: 'cold_breath', name: 'Souffle de givre', damage: 45,
      damageType: 'cold', type: 'special',
      description: 'Cône de froid (30 pieds)',
      recharge: { min: 5, max: 6 },
      areaOfEffect: true,
      savingThrow: { ability: 'constitution', dc: 15 }
    }
  ]
};

const MEDUSA: Monster = {
  id: 'medusa',
  name: 'Méduse',
  hp: 127, maxHp: 127,
  armorClass: 15,
  abilities: createAbilities(10, 15, 16, 12, 13, 15),
  speed: 30,
  challengeRating: 6, xpReward: 2300,
  creatureType: 'monstrosity', size: 'medium',
  portrait: '🐍',
  isBoss: false,
  skills: [
    {
      id: 'petrifying_gaze', name: 'Regard pétrifiant', damage: 0,
      damageType: 'force', type: 'special',
      description: 'Peut pétrifier la cible',
      savingThrow: { ability: 'constitution', dc: 14 }
    },
    {
      id: 'snake_hair', name: 'Cheveux serpentins', damage: 4,
      damageType: 'piercing', type: 'special',
      description: 'Morsure venimeuse + poison',
      effect: { type: 'poison', value: 14 }
    },
    { id: 'shortsword', name: 'Épée courte', damage: 5, damageType: 'slashing', type: 'attack', description: 'Attaque rapide' }
  ]
};

// ============================================
// CR 7-10 : MENACES EXTRÊMES
// ============================================

const MIND_FLAYER: Monster = {
  id: 'mind_flayer',
  name: 'Flagelleur mental',
  hp: 71, maxHp: 71,
  armorClass: 15,
  abilities: createAbilities(11, 12, 12, 19, 17, 17),
  speed: 30,
  challengeRating: 7, xpReward: 2900,
  creatureType: 'aberration', size: 'medium',
  portrait: '🦑',
  isBoss: false,
  resistances: ['psychic'],
  description: 'Aussi appelé Illithide, cette horreur souterraine se nourrit de cerveaux. Sa tête ressemble à un poulpe, dotée de quatre tentacules qu\'il utilise pour extraire le cerveau de ses victimes. Les flagelleurs mentaux possèdent de formidables pouvoirs psioniques et vivent dans de vastes cités souterraines où ils réduisent d\'autres races en esclavage.',
  skills: [
    {
      id: 'mind_blast', name: 'Décharge mentale', damage: 22,
      damageType: 'psychic', type: 'special',
      description: 'Cône psychique (60 pieds) - étourdit',
      recharge: { min: 5, max: 6 },
      areaOfEffect: true,
      savingThrow: { ability: 'intelligence', dc: 15 },
      effect: { type: 'debuff_target', condition: 'stunned' }
    },
    {
      id: 'tentacles', name: 'Tentacules', damage: 15,
      damageType: 'psychic', type: 'attack',
      description: 'Agrippé et cerveau extrait si à 0 PV'
    }
  ]
};

const GIANT: Monster = {
  id: 'hill_giant',
  name: 'Géant des collines',
  hp: 105, maxHp: 105,
  armorClass: 13,
  abilities: createAbilities(21, 8, 19, 5, 9, 6),
  speed: 40,
  challengeRating: 5, xpReward: 1800,
  creatureType: 'giant', size: 'huge',
  portrait: '🧔',
  isBoss: false,
  skills: [{
    id: 'greatclub', name: 'Gourdin', damage: 18,
    damageType: 'bludgeoning', type: 'attack',
    description: 'Coup de massue géant'
  }]
};

const STONE_GIANT: Monster = {
  id: 'stone_giant',
  name: 'Géant de pierre',
  hp: 126, maxHp: 126,
  armorClass: 17,
  abilities: createAbilities(23, 15, 20, 10, 12, 9),
  speed: 40,
  challengeRating: 7, xpReward: 2900,
  creatureType: 'giant', size: 'huge',
  portrait: '🗿',
  isBoss: false,
  skills: [{
    id: 'greatclub', name: 'Massue de pierre', damage: 19,
    damageType: 'bludgeoning', type: 'attack',
    description: 'Coup dévastateur'
  }]
};

const FROST_GIANT: Monster = {
  id: 'frost_giant',
  name: 'Géant du givre',
  hp: 138, maxHp: 138,
  armorClass: 15,
  abilities: createAbilities(23, 9, 21, 9, 10, 12),
  speed: 40,
  challengeRating: 8, xpReward: 3900,
  creatureType: 'giant', size: 'huge',
  portrait: '❄️',
  isBoss: false,
  immunities: ['cold'],
  skills: [{
    id: 'greataxe', name: 'Grande hache', damage: 25,
    damageType: 'slashing', type: 'attack',
    description: 'Coup glacial'
  }]
};

const FIRE_GIANT: Monster = {
  id: 'fire_giant',
  name: 'Géant du feu',
  hp: 162, maxHp: 162,
  armorClass: 18,
  abilities: createAbilities(25, 9, 23, 10, 14, 13),
  speed: 30,
  challengeRating: 9, xpReward: 5000,
  creatureType: 'giant', size: 'huge',
  portrait: '🔥',
  isBoss: false,
  immunities: ['fire'],
  skills: [{
    id: 'greatsword', name: 'Épée à deux mains', damage: 28,
    damageType: 'slashing', type: 'attack',
    description: 'Coup enflammé'
  }]
};

const CLOUD_GIANT: Monster = {
  id: 'cloud_giant',
  name: 'Géant des nuages',
  hp: 200, maxHp: 200,
  armorClass: 14,
  abilities: createAbilities(27, 10, 22, 12, 16, 16),
  speed: 40,
  challengeRating: 9, xpReward: 5000,
  creatureType: 'giant', size: 'huge',
  portrait: '☁️',
  isBoss: false,
  skills: [{
    id: 'morningstar', name: 'Morgenstern', damage: 21,
    damageType: 'piercing', type: 'attack',
    description: 'Coup tonnant'
  }]
};

const YOUNG_RED_DRAGON: Monster = {
  id: 'young_red_dragon',
  name: 'Jeune dragon rouge',
  hp: 178, maxHp: 178,
  armorClass: 18,
  abilities: createAbilities(23, 10, 21, 14, 11, 19),
  speed: 80,
  challengeRating: 10, xpReward: 5900,
  creatureType: 'dragon', size: 'large',
  portrait: '🐲',
  isBoss: false,
  immunities: ['fire'],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 17, damageType: 'piercing', type: 'attack', description: 'Morsure + feu' },
    { id: 'claws', name: 'Griffes', damage: 13, damageType: 'slashing', type: 'attack', description: 'Griffes' },
    {
      id: 'fire_breath', name: 'Souffle de feu', damage: 56,
      damageType: 'fire', type: 'special',
      description: 'Cône de flammes (30 pieds)',
      recharge: { min: 5, max: 6 },
      areaOfEffect: true,
      savingThrow: { ability: 'dexterity', dc: 17 }
    }
  ]
};

const ABOLETH: Monster = {
  id: 'aboleth',
  name: 'Aboleth',
  hp: 135, maxHp: 135,
  armorClass: 17,
  abilities: createAbilities(21, 9, 15, 18, 15, 18),
  speed: 40,
  challengeRating: 10, xpReward: 5900,
  creatureType: 'aberration', size: 'large',
  portrait: '🐙',
  isBoss: false,
  isLegendary: true,
  legendaryActionsPerTurn: 3,
  skills: [
    {
      id: 'tentacle', name: 'Tentacule', damage: 12,
      damageType: 'bludgeoning', type: 'special',
      description: 'Maladie qui transforme en créature aquatique'
    },
    {
      id: 'enslave', name: 'Asservissement', damage: 0,
      damageType: 'psychic', type: 'special',
      description: 'Charme une cible',
      savingThrow: { ability: 'wisdom', dc: 14 }
    }
  ],
  legendaryActions: [
    { id: 'detect', name: 'Détection', cost: 1, description: 'Test de Sagesse (Perception)' },
    { id: 'tail_swipe', name: 'Coup de queue', cost: 2, damage: 15, damageType: 'bludgeoning', description: 'Attaque de queue' },
    { id: 'psychic_drain', name: 'Drain psychique', cost: 2, damage: 10, damageType: 'psychic', description: 'Drain psychique + soins' }
  ]
};

// ============================================
// CR 5-8 : BOSS TIER 1 (Niveau 1 du donjon)
// Stats équilibrées pour une équipe de niveau 5
// HP: 120-180, Attack: 14-18, Def: 6-10
// ============================================

const BEHOLDER: Monster = {
  id: 'beholder',
  name: 'Tyrannœil',
  hp: 150, maxHp: 150,
  armorClass: 16,
  abilities: createAbilities(10, 14, 16, 17, 15, 17),
  speed: 20,
  challengeRating: 8, xpReward: 4000,
  creatureType: 'aberration', size: 'large',
  portrait: '👁️',
  isBoss: true,
  isLegendary: true,
  legendaryActionsPerTurn: 2,
  conditionImmunities: ['prone'],
  description: 'Sphère flottante de chair avec une grande gueule pleine de dents et un œil central géant, surmonté de dix tentacules oculaires. Chaque œil projette un rayon magique différent : désintégration, pétrification, charme, mort... Le tyrannœil est paranoïaque, cruel et se considère comme la forme de vie parfaite. Son œil central génère un cône antimagie.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 14, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    {
      id: 'eye_rays', name: 'Rayons oculaires', damage: 28,
      damageType: 'force', type: 'special',
      description: 'Tire des rayons magiques'
    }
  ],
  legendaryActions: [
    { id: 'eye_ray', name: 'Rayon oculaire', cost: 1, damage: 16, damageType: 'force', description: 'Un rayon oculaire' }
  ],
  ultimateSkill: {
    id: 'disintegration_ray', name: 'Rayon de désintégration', damage: 35,
    damageType: 'force', type: 'special',
    description: 'Rayon mortel',
    savingThrow: { ability: 'dexterity', dc: 14 }
  },
  ultimateTurnTrigger: 4,
  minions: ['specter', 'shadow']
};

// ============================================
// CR 9-13 : BOSS TIER 2 (Niveau 2 du donjon)
// Stats plus élevées pour le niveau 2
// HP: 180-250, Attack: 18-22, Def: 8-12
// ============================================

const ADULT_RED_DRAGON: Monster = {
  id: 'adult_red_dragon',
  name: 'Dragon rouge adulte',
  hp: 220, maxHp: 220,
  armorClass: 18,
  abilities: createAbilities(24, 10, 22, 16, 13, 20),
  speed: 60,
  challengeRating: 12, xpReward: 8000,
  creatureType: 'dragon', size: 'huge',
  portrait: '🐲',
  isBoss: true,
  isLegendary: true,
  legendaryActionsPerTurn: 2,
  immunities: ['fire'],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 18, damageType: 'piercing', type: 'attack', description: 'Morsure + feu' },
    { id: 'claws', name: 'Griffes', damage: 14, damageType: 'slashing', type: 'attack', description: 'Griffes acérées' },
    {
      id: 'fire_breath', name: 'Souffle de feu', damage: 45,
      damageType: 'fire', type: 'special',
      description: 'Cône de flammes',
      recharge: { min: 5, max: 6 },
      areaOfEffect: true,
      savingThrow: { ability: 'dexterity', dc: 18 }
    }
  ],
  legendaryActions: [
    { id: 'tail_attack', name: 'Coup de queue', cost: 1, damage: 15, damageType: 'bludgeoning', description: 'Coup de queue' },
    { id: 'wing_attack', name: 'Attaque d\'aile', cost: 2, damage: 14, damageType: 'bludgeoning', description: 'Frappe avec ses ailes' }
  ],
  ultimateSkill: {
    id: 'inferno', name: 'Inferno', damage: 38,
    damageType: 'fire', type: 'special',
    description: 'Embrase toute la zone',
    effect: { type: 'debuff_target', stat: 'defense', value: 5, turns: 2 }
  },
  ultimateTurnTrigger: 4,
  minions: ['hell_hound', 'fire_elemental']
};

const VAMPIRE: Monster = {
  id: 'vampire',
  name: 'Vampire',
  hp: 140, maxHp: 140,
  armorClass: 15,
  abilities: createAbilities(18, 18, 16, 16, 14, 18),
  speed: 35,
  challengeRating: 8, xpReward: 4000,
  creatureType: 'undead', size: 'medium',
  portrait: '🧛',
  isBoss: true,
  isLegendary: true,
  legendaryActionsPerTurn: 2,
  resistances: ['necrotic'],
  immunities: ['poison'],
  description: 'Mort-vivant noble et séducteur, le vampire est un prédateur immortel qui se nourrit du sang des vivants. Doté d\'une intelligence redoutable et de pouvoirs surnaturels, il peut charmer ses victimes, se transformer en chauve-souris ou en brume, et régénérer ses blessures tant qu\'il a accès au sang frais.',
  skills: [
    {
      id: 'bite', name: 'Morsure', damage: 12,
      damageType: 'piercing', type: 'special',
      description: 'Morsure vampirique',
      effect: { type: 'lifesteal', value: 75 }
    },
    {
      id: 'claws', name: 'Griffes', damage: 14,
      damageType: 'slashing', type: 'attack',
      description: 'Griffes acérées'
    }
  ],
  legendaryActions: [
    { id: 'unarmed_strike', name: 'Frappe', cost: 1, damage: 10, damageType: 'bludgeoning', description: 'Attaque rapide' },
    { id: 'bite', name: 'Morsure', cost: 2, damage: 12, damageType: 'piercing', description: 'Morsure vampirique', effect: { type: 'lifesteal', value: 75 } }
  ],
  ultimateSkill: {
    id: 'blood_moon', name: 'Lune de sang', damage: 28,
    damageType: 'necrotic', type: 'special',
    description: 'Drain de sang massif',
    effect: { type: 'lifesteal', value: 60 }
  },
  ultimateTurnTrigger: 4,
  minions: ['ghoul', 'ghast']
};

const DEATH_KNIGHT: Monster = {
  id: 'death_knight',
  name: 'Chevalier de la mort',
  hp: 180, maxHp: 180,
  armorClass: 18,
  abilities: createAbilities(20, 11, 18, 12, 14, 16),
  speed: 30,
  challengeRating: 10, xpReward: 6000,
  creatureType: 'undead', size: 'medium',
  portrait: '⚔️',
  isBoss: true,
  immunities: ['necrotic', 'poison'],
  conditionImmunities: ['frightened', 'poisoned'],
  description: 'Ancien paladin déchu, maudit pour l\'éternité à servir les forces des ténèbres. Le chevalier de la mort conserve sa maîtrise martiale et ses pouvoirs magiques, désormais corrompus par une énergie nécromantique. Sa simple présence inspire la terreur et son épée maudite consume l\'âme de ses victimes.',
  skills: [
    {
      id: 'longsword', name: 'Épée maudite', damage: 18,
      damageType: 'slashing', type: 'attack',
      description: 'Attaque tranchante maudite'
    },
    {
      id: 'hellfire_orb', name: 'Orbe infernal', damage: 28,
      damageType: 'fire', type: 'special',
      description: 'Explosion de feu infernal',
      areaOfEffect: true,
      savingThrow: { ability: 'dexterity', dc: 16 }
    }
  ],
  ultimateSkill: {
    id: 'destructive_wave', name: 'Vague destructrice', damage: 32,
    damageType: 'necrotic', type: 'special',
    description: 'Vague d\'énergie nécrotique',
    effect: { type: 'debuff_target', stat: 'attack', value: 4, turns: 2 }
  },
  ultimateTurnTrigger: 4,
  minions: ['skeleton', 'wight']
};

// ============================================
// CR 14-20 : BOSS TIER 3 (Niveau 3+ du donjon)
// Stats très élevées pour les niveaux avancés
// HP: 280-400, Attack: 22-28, Def: 10-14
// ============================================

const ANCIENT_RED_DRAGON: Monster = {
  id: 'ancient_red_dragon',
  name: 'Dragon rouge vénérable',
  hp: 350, maxHp: 350,
  armorClass: 20,
  abilities: createAbilities(28, 10, 26, 18, 15, 22),
  speed: 70,
  challengeRating: 18, xpReward: 20000,
  creatureType: 'dragon', size: 'gargantuan',
  portrait: '🐉',
  isBoss: true,
  isLegendary: true,
  legendaryActionsPerTurn: 3,
  immunities: ['fire'],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 22, damageType: 'piercing', type: 'attack', description: 'Morsure dévastatrice' },
    { id: 'claws', name: 'Griffes', damage: 18, damageType: 'slashing', type: 'attack', description: 'Griffes' },
    {
      id: 'fire_breath', name: 'Souffle de feu', damage: 55,
      damageType: 'fire', type: 'special',
      description: 'Cône de flammes apocalyptique',
      recharge: { min: 5, max: 6 },
      areaOfEffect: true,
      savingThrow: { ability: 'dexterity', dc: 20 }
    }
  ],
  legendaryActions: [
    { id: 'tail_attack', name: 'Coup de queue', cost: 1, damage: 18, damageType: 'bludgeoning', description: 'Coup de queue' },
    { id: 'wing_attack', name: 'Attaque d\'aile', cost: 2, damage: 16, damageType: 'bludgeoning', description: 'Frappe + envol' }
  ],
  ultimateSkill: {
    id: 'apocalypse_breath', name: 'Souffle apocalyptique', damage: 45,
    damageType: 'fire', type: 'special',
    description: 'Incendie tout sur son passage',
    effect: { type: 'debuff_target', stat: 'defense', value: 6, turns: 2 }
  },
  ultimateTurnTrigger: 3,
  minions: ['fire_elemental', 'hell_hound']
};

const LICH: Monster = {
  id: 'lich',
  name: 'Liche',
  hp: 180, maxHp: 180,
  armorClass: 17,
  abilities: createAbilities(11, 16, 16, 20, 14, 16),
  speed: 30,
  challengeRating: 14, xpReward: 12000,
  creatureType: 'undead', size: 'medium',
  portrait: '💀',
  isBoss: true,
  isLegendary: true,
  legendaryActionsPerTurn: 2,
  resistances: ['cold', 'lightning', 'necrotic'],
  immunities: ['poison'],
  conditionImmunities: ['charmed', 'frightened', 'paralyzed', 'poisoned'],
  description: 'Un mage ayant choisi l\'immortalité en liant son âme à un phylactère. La liche est un cadavre ambulant dont les orbites brillent de points lumineux. C\'est l\'un des lanceurs de sorts les plus puissants, capable de sorts dévastateurs et de nécromancie. Tant que son phylactère existe, la liche se régénère après sa destruction.',
  skills: [
    {
      id: 'paralyzing_touch', name: 'Toucher paralysant', damage: 14,
      damageType: 'cold', type: 'special',
      description: 'Dégâts de froid',
      savingThrow: { ability: 'constitution', dc: 16 }
    },
    {
      id: 'finger_of_death', name: 'Doigt de mort', damage: 38,
      damageType: 'necrotic', type: 'special',
      description: 'Rayon nécrotique mortel'
    }
  ],
  legendaryActions: [
    { id: 'cantrip', name: 'Sort mineur', cost: 1, damage: 14, damageType: 'necrotic', description: 'Sort nécrotique' },
    { id: 'disrupt_life', name: 'Perturbation vitale', cost: 2, damage: 18, damageType: 'necrotic', description: 'Drain de vie' }
  ],
  ultimateSkill: {
    id: 'army_of_dead', name: 'Armée des morts', damage: 32,
    damageType: 'necrotic', type: 'special',
    description: 'Énergie nécrotique massive',
    effect: { type: 'debuff_target', stat: 'magicDefense', value: 5, turns: 2 }
  },
  ultimateTurnTrigger: 4,
  minions: ['skeleton', 'zombie', 'wight']
};

const BALOR: Monster = {
  id: 'balor',
  name: 'Balor',
  hp: 280, maxHp: 280,
  armorClass: 18,
  abilities: createAbilities(24, 14, 22, 18, 16, 20),
  speed: 40,
  challengeRating: 16, xpReward: 15000,
  creatureType: 'fiend', size: 'huge',
  portrait: '😈',
  isBoss: true,
  resistances: ['cold', 'lightning'],
  immunities: ['fire', 'poison'],
  conditionImmunities: ['poisoned'],
  skills: [
    {
      id: 'longsword', name: 'Épée de foudre', damage: 20,
      damageType: 'slashing', type: 'attack',
      description: 'Épée démoniaque'
    },
    {
      id: 'whip', name: 'Fouet de feu', damage: 16,
      damageType: 'fire', type: 'special',
      description: 'Fouet enflammé'
    }
  ],
  ultimateSkill: {
    id: 'death_throes', name: 'Agonie mortelle', damage: 42,
    damageType: 'fire', type: 'special',
    description: 'Explosion de feu démoniaque',
    areaOfEffect: true
  },
  ultimateTurnTrigger: 4,
  minions: ['hell_hound', 'succubus']
};

const PIT_FIEND: Monster = {
  id: 'pit_fiend',
  name: 'Diantrefosse',
  hp: 300, maxHp: 300,
  armorClass: 18,
  abilities: createAbilities(24, 14, 22, 20, 16, 22),
  speed: 35,
  challengeRating: 17, xpReward: 18000,
  creatureType: 'fiend', size: 'large',
  portrait: '👿',
  isBoss: true,
  resistances: ['cold'],
  immunities: ['fire', 'poison'],
  conditionImmunities: ['poisoned'],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 18, damageType: 'piercing', type: 'attack', description: 'Morsure infernale' },
    { id: 'claws', name: 'Griffes', damage: 16, damageType: 'slashing', type: 'attack', description: 'Griffes' },
    {
      id: 'fireball', name: 'Boule de feu', damage: 32,
      damageType: 'fire', type: 'special',
      description: 'Explosion de feu infernal',
      areaOfEffect: true
    }
  ],
  ultimateSkill: {
    id: 'infernal_judgment', name: 'Jugement infernal', damage: 40,
    damageType: 'fire', type: 'special',
    description: 'Flammes infernales',
    effect: { type: 'debuff_target', stat: 'magicDefense', value: 6, turns: 2 }
  },
  ultimateTurnTrigger: 4,
  minions: ['hell_hound', 'succubus']
};

const SOLAR: Monster = {
  id: 'solar',
  name: 'Solar',
  hp: 260, maxHp: 260,
  armorClass: 19,
  abilities: createAbilities(24, 20, 24, 22, 22, 26),
  speed: 60,
  challengeRating: 16, xpReward: 15000,
  creatureType: 'celestial', size: 'large',
  portrait: '👼',
  isBoss: true,
  isLegendary: true,
  legendaryActionsPerTurn: 2,
  resistances: ['radiant'],
  immunities: ['necrotic', 'poison'],
  conditionImmunities: ['charmed', 'frightened', 'poisoned'],
  skills: [
    {
      id: 'greatsword', name: 'Épée céleste', damage: 20,
      damageType: 'radiant', type: 'attack',
      description: 'Épée sacrée'
    },
    {
      id: 'slaying_longbow', name: 'Arc tueur', damage: 18,
      damageType: 'radiant', type: 'special',
      description: 'Flèche de lumière'
    },
    {
      id: 'healing_touch', name: 'Toucher guérisseur', damage: 0,
      damageType: 'radiant', type: 'buff',
      description: 'Soigne 30 PV',
      effect: { type: 'heal', value: 30 }
    }
  ],
  legendaryActions: [
    { id: 'searing_burst', name: 'Explosion radieuse', cost: 1, damage: 14, damageType: 'radiant', description: 'Explosion de lumière' },
    { id: 'blinding_gaze', name: 'Regard aveuglant', cost: 2, description: 'Éblouit les ennemis', effect: { type: 'debuff_target', stat: 'attack', value: 5, turns: 2 } }
  ],
  ultimateSkill: {
    id: 'divine_word', name: 'Parole divine', damage: 38,
    damageType: 'radiant', type: 'special',
    description: 'Jugement divin',
    effect: { type: 'debuff_target', stat: 'magicDefense', value: 5, turns: 2 }
  },
  ultimateTurnTrigger: 4,
  minions: ['couatl', 'unicorn']
};

// ============================================
// CR 20+ : BOSS LÉGENDAIRE (Niveau 4+ du donjon)
// Stats de boss ultime pour les runs très avancés
// HP: 400+, Attack: 26+, Def: 12+
// ============================================

const TARRASQUE: Monster = {
  id: 'tarrasque',
  name: 'Tarasque',
  hp: 450, maxHp: 450,
  armorClass: 22,
  abilities: createAbilities(28, 11, 28, 3, 11, 11),
  speed: 40,
  challengeRating: 20, xpReward: 50000,
  creatureType: 'monstrosity', size: 'gargantuan',
  portrait: '🦎',
  isBoss: true,
  isLegendary: true,
  legendaryActionsPerTurn: 3,
  immunities: ['fire', 'poison'],
  conditionImmunities: ['charmed', 'frightened', 'paralyzed', 'poisoned'],
  description: 'La créature la plus dévastatrice connue.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 28, damageType: 'piercing', type: 'attack', description: 'Morsure titanesque' },
    { id: 'claws', name: 'Griffes', damage: 24, damageType: 'slashing', type: 'attack', description: 'Griffes géantes' },
    { id: 'tail', name: 'Queue', damage: 22, damageType: 'bludgeoning', type: 'attack', description: 'Coup de queue' }
  ],
  legendaryActions: [
    { id: 'attack', name: 'Attaque', cost: 1, damage: 22, damageType: 'slashing', description: 'Attaque de griffe' },
    { id: 'chomp', name: 'Dévoration', cost: 2, damage: 28, damageType: 'piercing', description: 'Attaque de morsure' }
  ],
  ultimateSkill: {
    id: 'rampage', name: 'Déchaînement', damage: 48,
    damageType: 'slashing', type: 'special',
    description: 'Attaque frénétique tous les ennemis',
    effect: { type: 'debuff_target', stat: 'defense', value: 6, turns: 2 }
  },
  ultimateTurnTrigger: 3
};

// ============================================
// NOUVEAUX MONSTRES D&D - CR VARIÉS
// ============================================

// CR 1/8
const STIRGE: Monster = {
  id: 'stirge',
  name: 'Strige',
  hp: 2, maxHp: 2,
  armorClass: 14,
  abilities: createAbilities(4, 16, 11, 2, 8, 6),
  speed: 40,
  challengeRating: 0.125, xpReward: 25,
  creatureType: 'beast', size: 'tiny',
  portrait: '🦟',
  isBoss: false,
  description: 'Créature volante suceuse de sang.',
  skills: [{
    id: 'blood_drain', name: 'Drain sanguin', damage: 5,
    damageType: 'piercing', type: 'special',
    description: 'S\'attache et draine le sang',
    effect: { type: 'lifesteal', value: 100 }
  }]
};

// CR 1/4
const FLYING_SWORD: Monster = {
  id: 'flying_sword',
  name: 'Épée volante',
  hp: 17, maxHp: 17,
  armorClass: 17,
  abilities: createAbilities(12, 15, 11, 1, 5, 1),
  speed: 50,
  challengeRating: 0.25, xpReward: 50,
  creatureType: 'construct', size: 'small',
  portrait: '⚔️',
  isBoss: false,
  immunities: ['poison', 'psychic'],
  conditionImmunities: ['blinded', 'charmed', 'deafened', 'frightened', 'paralyzed', 'petrified', 'poisoned'],
  skills: [{
    id: 'longsword', name: 'Épée', damage: 5,
    damageType: 'slashing', type: 'attack',
    description: 'Attaque tranchante'
  }]
};

const PSEUDODRAGON: Monster = {
  id: 'pseudodragon',
  name: 'Pseudodragon',
  hp: 7, maxHp: 7,
  armorClass: 13,
  abilities: createAbilities(6, 15, 13, 10, 12, 10),
  speed: 15,
  challengeRating: 0.25, xpReward: 50,
  creatureType: 'dragon', size: 'tiny',
  portrait: '🐉',
  isBoss: false,
  description: 'Petit dragon intelligent et loyal.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 4, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'sting', name: 'Dard', damage: 4, damageType: 'piercing', type: 'special', description: 'Peut endormir', effect: { type: 'debuff_attack', value: 5 } }
  ]
};

const SPRITE: Monster = {
  id: 'sprite',
  name: 'Esprit follet',
  hp: 2, maxHp: 2,
  armorClass: 15,
  abilities: createAbilities(3, 18, 10, 14, 13, 11),
  speed: 40,
  challengeRating: 0.25, xpReward: 50,
  creatureType: 'fey', size: 'tiny',
  portrait: '🧚',
  isBoss: false,
  description: 'Petit féérique espiègle.',
  skills: [{
    id: 'shortbow', name: 'Arc court', damage: 3,
    damageType: 'piercing', type: 'special',
    description: 'Flèche empoisonnée',
    effect: { type: 'poison', value: 3 }
  }]
};

// CR 1/2
const COCKATRICE: Monster = {
  id: 'cockatrice',
  name: 'Cocatrix',
  hp: 27, maxHp: 27,
  armorClass: 11,
  abilities: createAbilities(6, 12, 12, 2, 13, 5),
  speed: 20,
  challengeRating: 0.5, xpReward: 100,
  creatureType: 'monstrosity', size: 'small',
  portrait: '🐓',
  isBoss: false,
  description: 'Peut pétrifier par morsure.',
  skills: [{
    id: 'bite', name: 'Morsure', damage: 6,
    damageType: 'piercing', type: 'special',
    description: 'Peut pétrifier la cible',
    effect: { type: 'debuff_speed', value: 10 }
  }]
};

const DARKMANTLE: Monster = {
  id: 'darkmantle',
  name: 'Manteau obscur',
  hp: 22, maxHp: 22,
  armorClass: 11,
  abilities: createAbilities(16, 12, 13, 2, 10, 5),
  speed: 10,
  challengeRating: 0.5, xpReward: 100,
  creatureType: 'monstrosity', size: 'small',
  portrait: '🦑',
  isBoss: false,
  description: 'Créature des cavernes qui s\'accroche.',
  skills: [
    { id: 'crush', name: 'Écrasement', damage: 8, damageType: 'bludgeoning', type: 'attack', description: 'Étreinte' },
    { id: 'darkness_aura', name: 'Aura de ténèbres', damage: 0, damageType: 'necrotic', type: 'special', description: 'Crée des ténèbres', effect: { type: 'debuff_attack', value: 5 } }
  ]
};

const RUST_MONSTER: Monster = {
  id: 'rust_monster',
  name: 'Monstre rouilleur',
  hp: 27, maxHp: 27,
  armorClass: 14,
  abilities: createAbilities(13, 12, 13, 2, 13, 6),
  speed: 40,
  challengeRating: 0.5, xpReward: 100,
  creatureType: 'monstrosity', size: 'medium',
  portrait: '🪲',
  isBoss: false,
  description: 'Corrode le métal par contact.',
  skills: [{
    id: 'antennae', name: 'Antennes', damage: 5,
    damageType: 'acid', type: 'special',
    description: 'Réduit l\'armure',
    effect: { type: 'debuff_defense', value: 3 }
  }]
};

// CR 1
const ANIMATED_ARMOR: Monster = {
  id: 'animated_armor',
  name: 'Armure animée',
  hp: 33, maxHp: 33,
  armorClass: 18,
  abilities: createAbilities(14, 11, 13, 1, 3, 1),
  speed: 25,
  challengeRating: 1, xpReward: 200,
  creatureType: 'construct', size: 'medium',
  portrait: '🛡️',
  isBoss: false,
  immunities: ['poison', 'psychic'],
  conditionImmunities: ['blinded', 'charmed', 'paralyzed', 'petrified', 'poisoned'],
  skills: [{
    id: 'slam', name: 'Coup', damage: 10,
    damageType: 'bludgeoning', type: 'attack',
    description: 'Frappe métallique'
  }]
};

const DEATH_DOG: Monster = {
  id: 'death_dog',
  name: 'Chien de la mort',
  hp: 39, maxHp: 39,
  armorClass: 12,
  abilities: createAbilities(15, 14, 14, 3, 13, 6),
  speed: 40,
  challengeRating: 1, xpReward: 200,
  creatureType: 'monstrosity', size: 'medium',
  portrait: '🐕',
  isBoss: false,
  description: 'Chien à deux têtes porteur de maladies.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 9, damageType: 'piercing', type: 'attack', description: 'Double morsure' },
    { id: 'disease', name: 'Maladie', damage: 0, damageType: 'necrotic', type: 'special', description: 'Infecte la cible', effect: { type: 'poison', value: 5 } }
  ]
};

const DRYAD: Monster = {
  id: 'dryad',
  name: 'Dryade',
  hp: 22, maxHp: 22,
  armorClass: 11,
  abilities: createAbilities(10, 12, 11, 14, 15, 18),
  speed: 30,
  challengeRating: 1, xpReward: 200,
  creatureType: 'fey', size: 'medium',
  portrait: '🌳',
  isBoss: false,
  description: 'Esprit protecteur de la forêt.',
  skills: [
    { id: 'club', name: 'Bâton', damage: 6, damageType: 'bludgeoning', type: 'attack', description: 'Attaque de bois' },
    { id: 'charm', name: 'Charme', damage: 0, damageType: 'psychic', type: 'special', description: 'Enchante l\'ennemi', effect: { type: 'debuff_attack', value: 8 } }
  ]
};

const HARPY: Monster = {
  id: 'harpy',
  name: 'Harpie',
  hp: 38, maxHp: 38,
  armorClass: 11,
  abilities: createAbilities(12, 13, 12, 7, 10, 13),
  speed: 40,
  challengeRating: 1, xpReward: 200,
  creatureType: 'monstrosity', size: 'medium',
  portrait: '🦅',
  isBoss: false,
  description: 'Créature ailée au chant envoûtant.',
  skills: [
    { id: 'claws', name: 'Griffes', damage: 8, damageType: 'slashing', type: 'attack', description: 'Attaque aérienne' },
    { id: 'luring_song', name: 'Chant séducteur', damage: 0, damageType: 'psychic', type: 'special', description: 'Attire les ennemis', effect: { type: 'debuff_speed', value: 8 } }
  ]
};

const HIPPOGRIFF: Monster = {
  id: 'hippogriff',
  name: 'Hippogriffe',
  hp: 19, maxHp: 19,
  armorClass: 11,
  abilities: createAbilities(17, 13, 13, 2, 12, 8),
  speed: 60,
  challengeRating: 1, xpReward: 200,
  creatureType: 'monstrosity', size: 'large',
  portrait: '🦅',
  isBoss: false,
  skills: [
    { id: 'beak', name: 'Bec', damage: 8, damageType: 'piercing', type: 'attack', description: 'Coup de bec' },
    { id: 'claws', name: 'Griffes', damage: 10, damageType: 'slashing', type: 'attack', description: 'Griffes acérées' }
  ]
};

// CR 2
const ANKHEG: Monster = {
  id: 'ankheg',
  name: 'Ankheg',
  hp: 39, maxHp: 39,
  armorClass: 14,
  abilities: createAbilities(17, 11, 13, 1, 13, 6),
  speed: 30,
  challengeRating: 2, xpReward: 450,
  creatureType: 'monstrosity', size: 'large',
  portrait: '🦗',
  isBoss: false,
  description: 'Insecte géant souterrain.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 12, damageType: 'slashing', type: 'attack', description: 'Mâchoires puissantes' },
    { id: 'acid_spray', name: 'Jet d\'acide', damage: 15, damageType: 'acid', type: 'special', description: 'Ligne d\'acide (30 pieds)', recharge: { min: 6 } }
  ]
};

const CENTAUR: Monster = {
  id: 'centaur',
  name: 'Centaure',
  hp: 45, maxHp: 45,
  armorClass: 12,
  abilities: createAbilities(18, 14, 14, 9, 13, 11),
  speed: 50,
  challengeRating: 2, xpReward: 450,
  creatureType: 'monstrosity', size: 'large',
  portrait: '🐎',
  isBoss: false,
  description: 'Mi-homme, mi-cheval, guerrier noble.',
  skills: [
    { id: 'pike', name: 'Pique', damage: 11, damageType: 'piercing', type: 'attack', description: 'Attaque de lance' },
    { id: 'hooves', name: 'Sabots', damage: 14, damageType: 'bludgeoning', type: 'attack', description: 'Charge + piétinement' },
    { id: 'longbow', name: 'Arc long', damage: 9, damageType: 'piercing', type: 'attack', description: 'Tir précis' }
  ]
};

const ETTERCAP: Monster = {
  id: 'ettercap',
  name: 'Ettercap',
  hp: 44, maxHp: 44,
  armorClass: 13,
  abilities: createAbilities(14, 15, 13, 7, 12, 8),
  speed: 30,
  challengeRating: 2, xpReward: 450,
  creatureType: 'monstrosity', size: 'medium',
  portrait: '🕷️',
  isBoss: false,
  description: 'Maître des araignées.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 7, damageType: 'piercing', type: 'special', description: 'Morsure venimeuse', effect: { type: 'poison', value: 6 } },
    { id: 'claws', name: 'Griffes', damage: 14, damageType: 'slashing', type: 'attack', description: 'Attaque double' },
    { id: 'web', name: 'Toile', damage: 0, damageType: 'physical', type: 'special', description: 'Immobilise', effect: { type: 'debuff_speed', value: 15 } }
  ]
};

const GELATINOUS_CUBE: Monster = {
  id: 'gelatinous_cube',
  name: 'Cube gélatineux',
  hp: 84, maxHp: 84,
  armorClass: 6,
  abilities: createAbilities(14, 3, 20, 1, 6, 1),
  speed: 15,
  challengeRating: 2, xpReward: 450,
  creatureType: 'ooze', size: 'large',
  portrait: '🟩',
  isBoss: false,
  immunities: ['acid', 'cold', 'lightning'],
  conditionImmunities: ['blinded', 'charmed', 'deafened', 'exhaustion', 'frightened', 'prone'],
  description: 'Masse gélatineuse transparente.',
  skills: [{
    id: 'pseudopod', name: 'Pseudopode', damage: 10,
    damageType: 'acid', type: 'special',
    description: 'Attaque acide + paralysie',
    effect: { type: 'debuff_speed', value: 20 }
  }]
};

const GRIFFON: Monster = {
  id: 'griffon',
  name: 'Griffon',
  hp: 59, maxHp: 59,
  armorClass: 12,
  abilities: createAbilities(18, 15, 16, 2, 13, 8),
  speed: 80,
  challengeRating: 2, xpReward: 450,
  creatureType: 'monstrosity', size: 'large',
  portrait: '🦅',
  isBoss: false,
  description: 'Créature majestueuse mi-aigle mi-lion.',
  skills: [
    { id: 'beak', name: 'Bec', damage: 10, damageType: 'piercing', type: 'attack', description: 'Coup de bec' },
    { id: 'claws', name: 'Griffes', damage: 13, damageType: 'slashing', type: 'attack', description: 'Attaque multiple' }
  ]
};

const NOTHIC: Monster = {
  id: 'nothic',
  name: 'Nothic',
  hp: 45, maxHp: 45,
  armorClass: 15,
  abilities: createAbilities(14, 16, 16, 13, 10, 8),
  speed: 30,
  challengeRating: 2, xpReward: 450,
  creatureType: 'aberration', size: 'medium',
  portrait: '👁️',
  isBoss: false,
  description: 'Ancien mage maudit à l\'œil unique.',
  skills: [
    { id: 'claws', name: 'Griffes', damage: 12, damageType: 'slashing', type: 'attack', description: 'Attaque double' },
    { id: 'rotting_gaze', name: 'Regard pourrissant', damage: 10, damageType: 'necrotic', type: 'special', description: 'Drain magique' }
  ]
};

// CR 3
const BASILISK: Monster = {
  id: 'basilisk',
  name: 'Basilic',
  hp: 52, maxHp: 52,
  armorClass: 15,
  abilities: createAbilities(16, 8, 15, 2, 8, 7),
  speed: 20,
  challengeRating: 3, xpReward: 700,
  creatureType: 'monstrosity', size: 'medium',
  portrait: '🦎',
  isBoss: false,
  description: 'Son regard pétrifie.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 13, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'petrifying_gaze', name: 'Regard pétrifiant', damage: 0, damageType: 'force', type: 'special', description: 'Peut pétrifier', effect: { type: 'debuff_speed', value: 25 } }
  ]
};

const DOPPELGANGER: Monster = {
  id: 'doppelganger',
  name: 'Doppelganger',
  hp: 52, maxHp: 52,
  armorClass: 14,
  abilities: createAbilities(11, 18, 14, 11, 12, 14),
  speed: 30,
  challengeRating: 3, xpReward: 700,
  creatureType: 'monstrosity', size: 'medium',
  portrait: '👤',
  isBoss: false,
  conditionImmunities: ['charmed'],
  description: 'Changeforme maléfique.',
  skills: [
    { id: 'slam', name: 'Coup', damage: 11, damageType: 'bludgeoning', type: 'attack', description: 'Frappe' },
    { id: 'read_thoughts', name: 'Lire pensées', damage: 0, damageType: 'psychic', type: 'special', description: 'Lit l\'esprit', effect: { type: 'debuff_defense', value: 5 } }
  ]
};

const GREEN_HAG: Monster = {
  id: 'green_hag',
  name: 'Guenaude verte',
  hp: 82, maxHp: 82,
  armorClass: 17,
  abilities: createAbilities(18, 12, 16, 13, 14, 14),
  speed: 30,
  challengeRating: 3, xpReward: 700,
  creatureType: 'fey', size: 'medium',
  portrait: '🧙‍♀️',
  isBoss: false,
  description: 'Sorcière des marais maléfique.',
  skills: [
    { id: 'claws', name: 'Griffes', damage: 15, damageType: 'slashing', type: 'attack', description: 'Griffes empoisonnées' },
    { id: 'illusory_appearance', name: 'Illusion', damage: 0, damageType: 'psychic', type: 'special', description: 'Crée des illusions', effect: { type: 'debuff_attack', value: 8 } }
  ]
};

const MANTICORE: Monster = {
  id: 'manticore',
  name: 'Manticore',
  hp: 68, maxHp: 68,
  armorClass: 14,
  abilities: createAbilities(17, 16, 17, 7, 12, 8),
  speed: 50,
  challengeRating: 3, xpReward: 700,
  creatureType: 'monstrosity', size: 'large',
  portrait: '🦁',
  isBoss: false,
  description: 'Lion ailé à queue de scorpion.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 10, damageType: 'piercing', type: 'attack', description: 'Morsure de lion' },
    { id: 'claws', name: 'Griffes', damage: 14, damageType: 'slashing', type: 'attack', description: 'Attaque double' },
    { id: 'tail_spike', name: 'Piques', damage: 11, damageType: 'piercing', type: 'attack', description: 'Lancer de piques' }
  ]
};

const PHASE_SPIDER: Monster = {
  id: 'phase_spider',
  name: 'Araignée de phase',
  hp: 32, maxHp: 32,
  armorClass: 13,
  abilities: createAbilities(15, 15, 12, 6, 10, 6),
  speed: 30,
  challengeRating: 3, xpReward: 700,
  creatureType: 'monstrosity', size: 'large',
  portrait: '🕷️',
  isBoss: false,
  description: 'Peut se téléporter entre les plans.',
  skills: [{
    id: 'bite', name: 'Morsure', damage: 9,
    damageType: 'piercing', type: 'special',
    description: 'Morsure venimeuse mortelle',
    effect: { type: 'poison', value: 18 }
  }]
};

const YETI: Monster = {
  id: 'yeti',
  name: 'Yéti',
  hp: 51, maxHp: 51,
  armorClass: 12,
  abilities: createAbilities(18, 13, 16, 8, 12, 7),
  speed: 40,
  challengeRating: 3, xpReward: 700,
  creatureType: 'monstrosity', size: 'large',
  portrait: '🦍',
  isBoss: false,
  immunities: ['cold'],
  description: 'Créature des neiges terrifiante.',
  skills: [
    { id: 'claws', name: 'Griffes', damage: 14, damageType: 'slashing', type: 'attack', description: 'Griffes gelées' },
    { id: 'chilling_gaze', name: 'Regard glacial', damage: 0, damageType: 'cold', type: 'special', description: 'Paralyse de froid', effect: { type: 'debuff_speed', value: 15 } }
  ]
};

// CR 4
const CHUUL: Monster = {
  id: 'chuul',
  name: 'Chuul',
  hp: 93, maxHp: 93,
  armorClass: 16,
  abilities: createAbilities(19, 10, 16, 5, 11, 5),
  speed: 30,
  challengeRating: 4, xpReward: 1100,
  creatureType: 'aberration', size: 'large',
  portrait: '🦞',
  isBoss: false,
  immunities: ['poison'],
  conditionImmunities: ['poisoned'],
  description: 'Crustacé aberrant serviteur des aboleths.',
  skills: [
    { id: 'pincer', name: 'Pince', damage: 15, damageType: 'bludgeoning', type: 'attack', description: 'Pince broyeuse' },
    { id: 'tentacles', name: 'Tentacules', damage: 0, damageType: 'physical', type: 'special', description: 'Paralysie', effect: { type: 'poison', value: 10 } }
  ]
};

const COUATL: Monster = {
  id: 'couatl',
  name: 'Couatl',
  hp: 97, maxHp: 97,
  armorClass: 19,
  abilities: createAbilities(16, 20, 17, 18, 20, 18),
  speed: 90,
  challengeRating: 4, xpReward: 1100,
  creatureType: 'celestial', size: 'medium',
  portrait: '🐍',
  isBoss: false,
  immunities: ['psychic', 'radiant'],
  description: 'Serpent ailé céleste bienveillant.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 10, damageType: 'piercing', type: 'attack', description: 'Morsure sacrée' },
    { id: 'constrict', name: 'Constriction', damage: 17, damageType: 'bludgeoning', type: 'attack', description: 'Étreinte' },
    { id: 'heal', name: 'Guérison', damage: 0, damageType: 'radiant', type: 'buff', description: 'Se soigne', effect: { type: 'heal', value: 20 } }
  ]
};

const GHOST: Monster = {
  id: 'ghost',
  name: 'Fantôme',
  hp: 45, maxHp: 45,
  armorClass: 11,
  abilities: createAbilities(7, 13, 10, 10, 12, 17),
  speed: 40,
  challengeRating: 4, xpReward: 1100,
  creatureType: 'undead', size: 'medium',
  portrait: '👻',
  isBoss: false,
  resistances: ['acid', 'fire', 'lightning', 'thunder'],
  immunities: ['cold', 'necrotic', 'poison'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'grappled', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained'],
  description: 'Esprit tourmenté lié au monde des vivants.',
  skills: [
    { id: 'withering_touch', name: 'Toucher flétrissant', damage: 17, damageType: 'necrotic', type: 'attack', description: 'Vieillit la cible' },
    { id: 'horrifying_visage', name: 'Apparition horrifiante', damage: 0, damageType: 'psychic', type: 'special', description: 'Effraye', effect: { type: 'debuff_attack', value: 10 } },
    { id: 'possession', name: 'Possession', damage: 0, damageType: 'psychic', type: 'special', description: 'Peut posséder', effect: { type: 'debuff_defense', value: 15 } }
  ]
};

const SUCCUBUS: Monster = {
  id: 'succubus',
  name: 'Succube',
  hp: 66, maxHp: 66,
  armorClass: 15,
  abilities: createAbilities(8, 17, 13, 15, 12, 20),
  speed: 60,
  challengeRating: 4, xpReward: 1100,
  creatureType: 'fiend', size: 'medium',
  portrait: '😈',
  isBoss: false,
  resistances: ['cold', 'fire', 'lightning', 'poison'],
  description: 'Démone séductrice drainant la force vitale.',
  skills: [
    { id: 'claws', name: 'Griffes', damage: 10, damageType: 'slashing', type: 'attack', description: 'Griffes acérées' },
    { id: 'draining_kiss', name: 'Baiser drainant', damage: 32, damageType: 'psychic', type: 'special', description: 'Draine l\'énergie vitale', effect: { type: 'lifesteal', value: 50 } },
    { id: 'charm', name: 'Charme', damage: 0, damageType: 'psychic', type: 'special', description: 'Charme magique', effect: { type: 'debuff_attack', value: 12 } }
  ]
};

// CR 5
const AIR_ELEMENTAL: Monster = {
  id: 'air_elemental',
  name: 'Élémentaire d\'air',
  hp: 90, maxHp: 90,
  armorClass: 15,
  abilities: createAbilities(14, 20, 14, 6, 10, 6),
  speed: 90,
  challengeRating: 5, xpReward: 1800,
  creatureType: 'elemental', size: 'large',
  portrait: '🌪️',
  isBoss: false,
  resistances: ['lightning', 'thunder'],
  immunities: ['poison'],
  conditionImmunities: ['exhaustion', 'grappled', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained', 'unconscious'],
  description: 'Tourbillon de vent vivant.',
  skills: [
    { id: 'slam', name: 'Coup', damage: 14, damageType: 'bludgeoning', type: 'attack', description: 'Frappe aérienne' },
    { id: 'whirlwind', name: 'Tourbillon', damage: 15, damageType: 'bludgeoning', type: 'special', description: 'Projette les ennemis', recharge: { min: 4 } }
  ]
};

const EARTH_ELEMENTAL: Monster = {
  id: 'earth_elemental',
  name: 'Élémentaire de terre',
  hp: 126, maxHp: 126,
  armorClass: 17,
  abilities: createAbilities(20, 8, 20, 5, 10, 5),
  speed: 30,
  challengeRating: 5, xpReward: 1800,
  creatureType: 'elemental', size: 'large',
  portrait: '🪨',
  isBoss: false,
  vulnerabilities: ['thunder'],
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  immunities: ['poison'],
  conditionImmunities: ['exhaustion', 'paralyzed', 'petrified', 'poisoned', 'unconscious'],
  description: 'Masse rocheuse animée.',
  skills: [
    { id: 'slam', name: 'Coup', damage: 17, damageType: 'bludgeoning', type: 'attack', description: 'Frappe de roche' }
  ]
};

const FIRE_ELEMENTAL: Monster = {
  id: 'fire_elemental',
  name: 'Élémentaire de feu',
  hp: 102, maxHp: 102,
  armorClass: 13,
  abilities: createAbilities(10, 17, 16, 6, 10, 7),
  speed: 50,
  challengeRating: 5, xpReward: 1800,
  creatureType: 'elemental', size: 'large',
  portrait: '🔥',
  isBoss: false,
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  immunities: ['fire', 'poison'],
  conditionImmunities: ['exhaustion', 'grappled', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained', 'unconscious'],
  description: 'Colonne de flammes vivantes.',
  skills: [
    { id: 'touch', name: 'Toucher', damage: 15, damageType: 'fire', type: 'attack', description: 'Toucher brûlant' },
    { id: 'fire_form', name: 'Forme de feu', damage: 5, damageType: 'fire', type: 'special', description: 'Brûle au contact' }
  ]
};

const WATER_ELEMENTAL: Monster = {
  id: 'water_elemental',
  name: 'Élémentaire d\'eau',
  hp: 114, maxHp: 114,
  armorClass: 14,
  abilities: createAbilities(18, 14, 18, 5, 10, 8),
  speed: 90,
  challengeRating: 5, xpReward: 1800,
  creatureType: 'elemental', size: 'large',
  portrait: '💧',
  isBoss: false,
  resistances: ['acid'],
  immunities: ['poison'],
  conditionImmunities: ['exhaustion', 'grappled', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained', 'unconscious'],
  description: 'Vague déferlante consciente.',
  skills: [
    { id: 'slam', name: 'Coup', damage: 16, damageType: 'bludgeoning', type: 'attack', description: 'Frappe d\'eau' },
    { id: 'whelm', name: 'Submersion', damage: 13, damageType: 'bludgeoning', type: 'special', description: 'Engloutit', recharge: { min: 4 } }
  ]
};

const SHAMBLING_MOUND: Monster = {
  id: 'shambling_mound',
  name: 'Tertre errant',
  hp: 136, maxHp: 136,
  armorClass: 15,
  abilities: createAbilities(18, 8, 16, 5, 10, 5),
  speed: 20,
  challengeRating: 5, xpReward: 1800,
  creatureType: 'plant', size: 'large',
  portrait: '🌿',
  isBoss: false,
  resistances: ['cold', 'fire'],
  immunities: ['lightning'],
  conditionImmunities: ['blinded', 'deafened', 'exhaustion'],
  description: 'Masse végétale animée par la foudre.',
  skills: [
    { id: 'slam', name: 'Coup', damage: 15, damageType: 'bludgeoning', type: 'attack', description: 'Frappe végétale' },
    { id: 'engulf', name: 'Engloutissement', damage: 13, damageType: 'bludgeoning', type: 'special', description: 'Étouffe la cible', effect: { type: 'debuff_speed', value: 20 } }
  ]
};

const UNICORN: Monster = {
  id: 'unicorn',
  name: 'Licorne',
  hp: 67, maxHp: 67,
  armorClass: 12,
  abilities: createAbilities(18, 14, 15, 11, 17, 16),
  speed: 50,
  challengeRating: 5, xpReward: 1800,
  creatureType: 'celestial', size: 'large',
  portrait: '🦄',
  isBoss: false,
  immunities: ['poison'],
  conditionImmunities: ['charmed', 'paralyzed', 'poisoned'],
  description: 'Créature céleste pure et protectrice.',
  skills: [
    { id: 'hooves', name: 'Sabots', damage: 11, damageType: 'bludgeoning', type: 'attack', description: 'Frappe puissante' },
    { id: 'horn', name: 'Corne', damage: 12, damageType: 'piercing', type: 'attack', description: 'Charge de corne' },
    { id: 'healing_touch', name: 'Toucher guérisseur', damage: 0, damageType: 'radiant', type: 'buff', description: 'Guérit un allié', effect: { type: 'heal', value: 18 } }
  ]
};

// CR 6
const CHIMERA: Monster = {
  id: 'chimera',
  name: 'Chimère',
  hp: 114, maxHp: 114,
  armorClass: 14,
  abilities: createAbilities(19, 11, 19, 3, 14, 10),
  speed: 60,
  challengeRating: 6, xpReward: 2300,
  creatureType: 'monstrosity', size: 'large',
  portrait: '🦁',
  isBoss: false,
  description: 'Triple bête: lion, chèvre, dragon.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 13, damageType: 'piercing', type: 'attack', description: 'Tête de lion' },
    { id: 'horns', name: 'Cornes', damage: 12, damageType: 'bludgeoning', type: 'attack', description: 'Tête de chèvre' },
    { id: 'claws', name: 'Griffes', damage: 13, damageType: 'slashing', type: 'attack', description: 'Griffes de lion' },
    { id: 'fire_breath', name: 'Souffle de feu', damage: 31, damageType: 'fire', type: 'special', description: 'Cône de feu (15 pieds)', recharge: { min: 5 } }
  ]
};

const DRIDER: Monster = {
  id: 'drider',
  name: 'Drider',
  hp: 123, maxHp: 123,
  armorClass: 19,
  abilities: createAbilities(16, 16, 18, 13, 14, 12),
  speed: 30,
  challengeRating: 6, xpReward: 2300,
  creatureType: 'monstrosity', size: 'large',
  portrait: '🕷️',
  isBoss: false,
  description: 'Drow maudit mi-elfe mi-araignée.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 7, damageType: 'piercing', type: 'special', description: 'Morsure venimeuse', effect: { type: 'poison', value: 9 } },
    { id: 'longsword', name: 'Épée longue', damage: 14, damageType: 'slashing', type: 'attack', description: 'Lame elfique' },
    { id: 'web', name: 'Toile', damage: 0, damageType: 'physical', type: 'special', description: 'Immobilise', effect: { type: 'debuff_speed', value: 20 } }
  ]
};

const INVISIBLE_STALKER: Monster = {
  id: 'invisible_stalker',
  name: 'Traqueur invisible',
  hp: 104, maxHp: 104,
  armorClass: 14,
  abilities: createAbilities(16, 19, 14, 10, 15, 11),
  speed: 50,
  challengeRating: 6, xpReward: 2300,
  creatureType: 'elemental', size: 'medium',
  portrait: '👤',
  isBoss: false,
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  immunities: ['poison'],
  conditionImmunities: ['exhaustion', 'grappled', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained', 'unconscious'],
  description: 'Élémentaire d\'air invisible et implacable.',
  skills: [
    { id: 'slam', name: 'Coup', damage: 15, damageType: 'bludgeoning', type: 'attack', description: 'Frappe invisible' }
  ]
};

// ============================================
// PERSONNAGES HOSTILES NOMMÉS (Archdevils, Demon Lords, etc.)
// ============================================

// ARCHDEVILS - Les Seigneurs des Neuf Enfers
const ZARIEL: Monster = {
  id: 'zariel',
  name: 'Zariel',
  hp: 580, maxHp: 580,
  armorClass: 21,
  abilities: createAbilities(27, 24, 28, 26, 27, 30),
  speed: 50,
  challengeRating: 26, xpReward: 90000,
  creatureType: 'fiend', size: 'large',
  portrait: '👿',
  isBoss: true,
  isHostileNpc: true,
  resistances: ['cold'],
  immunities: ['fire', 'poison'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'poisoned'],
  description: 'Zariel, Archidiablesse d\'Avernus, première couche des Neuf Enfers. Ancienne ange déchue, elle mène les légions infernales dans la Guerre du Sang.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'attack', name: 'Attaque', cost: 1, damage: 35, damageType: 'slashing', description: 'Frappe avec son épée' },
    { id: 'teleport', name: 'Téléportation', cost: 1, damage: 0, damageType: 'force', description: 'Se téléporte jusqu\'à 120 pieds' },
    { id: 'fireball', name: 'Boule de feu infernale', cost: 2, damage: 45, damageType: 'fire', description: 'Boule de feu touchant tous les ennemis' }
  ],
  skills: [
    { id: 'longsword', name: 'Épée longue de Zariel', damage: 40, damageType: 'slashing', type: 'attack', description: 'Triple attaque à l\'épée', attackCount: 3 },
    { id: 'javelin', name: 'Javelot de feu', damage: 35, damageType: 'fire', type: 'attack', description: 'Javelot enflammé' }
  ],
  ultimateSkill: {
    id: 'horrid_touch', name: 'Toucher Horrifique', damage: 60, damageType: 'necrotic', type: 'special',
    description: 'Zariel canalise l\'énergie des Enfers pour infliger des dégâts nécrotiques dévastateurs'
  }
};

const ASMODEUS: Monster = {
  id: 'asmodeus',
  name: 'Asmodeus',
  hp: 750, maxHp: 750,
  armorClass: 22,
  abilities: createAbilities(30, 21, 30, 30, 28, 30),
  speed: 40,
  challengeRating: 30, xpReward: 155000,
  creatureType: 'fiend', size: 'large',
  portrait: '😈',
  isBoss: true,
  isHostileNpc: true,
  resistances: ['cold'],
  immunities: ['fire', 'poison', 'bludgeoning', 'piercing', 'slashing'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'poisoned'],
  description: 'Asmodeus, Seigneur Suprême des Neuf Enfers, le plus puissant des archidiables. Il règne depuis Nessus, la neuvième couche.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'ruby_rod', name: 'Sceptre de Rubis', cost: 2, damage: 55, damageType: 'force', description: 'Frappe avec son sceptre légendaire' },
    { id: 'hellfire', name: 'Feu infernal', cost: 3, damage: 70, damageType: 'fire', description: 'Déchaîne les flammes de Nessus' }
  ],
  skills: [
    { id: 'ruby_rod_strike', name: 'Sceptre de Rubis', damage: 55, damageType: 'force', type: 'attack', description: 'Frappe dévastatrice' },
    { id: 'dominate', name: 'Domination', damage: 0, damageType: 'psychic', type: 'debuff', description: 'Tente de dominer l\'esprit' }
  ],
  ultimateSkill: {
    id: 'avatar_destruction', name: 'Avatar de Destruction', damage: 100, damageType: 'fire', type: 'special',
    description: 'Asmodeus révèle sa vraie forme divine, infligeant des dégâts catastrophiques'
  }
};

const MEPHISTOPHELES: Monster = {
  id: 'mephistopheles',
  name: 'Méphistophélès',
  hp: 520, maxHp: 520,
  armorClass: 20,
  abilities: createAbilities(24, 22, 26, 30, 26, 28),
  speed: 50,
  challengeRating: 25, xpReward: 75000,
  creatureType: 'fiend', size: 'large',
  portrait: '🔥',
  isBoss: true,
  isHostileNpc: true,
  immunities: ['fire', 'cold', 'poison'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'poisoned'],
  description: 'Méphistophélès, Archidiable de Cania, huitième couche des Enfers. Maître du feu infernal et des pactes.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'hellfire_bolt', name: 'Trait de feu infernal', cost: 1, damage: 40, damageType: 'fire', description: 'Rayon de flammes' },
    { id: 'cone_cold', name: 'Cône de froid', cost: 2, damage: 50, damageType: 'cold', description: 'Souffle glacial de Cania' }
  ],
  skills: [
    { id: 'trident', name: 'Trident de Cania', damage: 38, damageType: 'piercing', type: 'attack', description: 'Attaque au trident', attackCount: 2 },
    { id: 'hellfire', name: 'Feu infernal', damage: 45, damageType: 'fire', type: 'attack', description: 'Flammes des Enfers' }
  ],
  ultimateSkill: {
    id: 'cania_winter', name: 'Hiver de Cania', damage: 70, damageType: 'cold', type: 'special',
    description: 'Invoque le froid mortel de la huitième couche'
  }
};

const DISPATER: Monster = {
  id: 'dispater',
  name: 'Dispater',
  hp: 480, maxHp: 480,
  armorClass: 21,
  abilities: createAbilities(26, 20, 26, 28, 26, 26),
  speed: 30,
  challengeRating: 24, xpReward: 62000,
  creatureType: 'fiend', size: 'large',
  portrait: '🏛️',
  isBoss: true,
  isHostileNpc: true,
  immunities: ['fire', 'poison'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'poisoned'],
  description: 'Dispater, Archidiable de Dis, deuxième couche des Enfers. Le Père de la Tromperie, rusé et paranoïaque.',
  skills: [
    { id: 'iron_staff', name: 'Bâton de fer', damage: 40, damageType: 'bludgeoning', type: 'attack', description: 'Frappe avec son bâton enchanté' }
  ],
  ultimateSkill: {
    id: 'iron_prison', name: 'Prison de Fer', damage: 55, damageType: 'bludgeoning', type: 'special',
    description: 'Emprisonne les ennemis dans des chaînes de fer infernal'
  }
};

const MAMMON: Monster = {
  id: 'mammon',
  name: 'Mammon',
  hp: 460, maxHp: 460,
  armorClass: 19,
  abilities: createAbilities(24, 18, 26, 26, 24, 28),
  speed: 30,
  challengeRating: 23, xpReward: 50000,
  creatureType: 'fiend', size: 'large',
  portrait: '💰',
  isBoss: true,
  isHostileNpc: true,
  immunities: ['fire', 'poison'],
  description: 'Mammon, Archidiable de Minauros, troisième couche. Seigneur de l\'avarice et de la cupidité.',
  skills: [
    { id: 'golden_claws', name: 'Griffes dorées', damage: 35, damageType: 'slashing', type: 'attack', description: 'Griffes recouvertes d\'or maudit' }
  ]
};

const BELIAL: Monster = {
  id: 'belial',
  name: 'Bélial',
  hp: 450, maxHp: 450,
  armorClass: 20,
  abilities: createAbilities(26, 22, 24, 24, 22, 28),
  speed: 40,
  challengeRating: 23, xpReward: 50000,
  creatureType: 'fiend', size: 'large',
  portrait: '🗡️',
  isBoss: true,
  isHostileNpc: true,
  immunities: ['fire', 'poison'],
  description: 'Bélial, Archidiable de Phlegethos, quatrième couche. Maître de la séduction et du feu.',
  skills: [
    { id: 'ranseur', name: 'Ranseur enflammé', damage: 40, damageType: 'piercing', type: 'attack', description: 'Arme d\'hast enflammée' }
  ]
};

const LEVISTUS: Monster = {
  id: 'levistus',
  name: 'Lévistus',
  hp: 420, maxHp: 420,
  armorClass: 20,
  abilities: createAbilities(22, 20, 26, 26, 24, 26),
  speed: 0,
  challengeRating: 22, xpReward: 41000,
  creatureType: 'fiend', size: 'large',
  portrait: '🧊',
  isBoss: true,
  isHostileNpc: true,
  immunities: ['cold', 'poison'],
  description: 'Lévistus, Archidiable de Stygia, cinquième couche. Prisonnier éternel dans un bloc de glace par Asmodeus.',
  skills: [
    { id: 'ice_rapier', name: 'Rapière de glace', damage: 38, damageType: 'cold', type: 'attack', description: 'Lame de glace éternelle' }
  ]
};

const GLASYA: Monster = {
  id: 'glasya',
  name: 'Glasya',
  hp: 400, maxHp: 400,
  armorClass: 21,
  abilities: createAbilities(22, 26, 22, 24, 22, 28),
  speed: 50,
  challengeRating: 22, xpReward: 41000,
  creatureType: 'fiend', size: 'medium',
  portrait: '👸',
  isBoss: true,
  isHostileNpc: true,
  immunities: ['fire', 'poison'],
  description: 'Glasya, Archidiablesse de Malbolge, sixième couche. Fille d\'Asmodeus, Princesse des Enfers.',
  skills: [
    { id: 'scourge', name: 'Fléau de Malbolge', damage: 36, damageType: 'slashing', type: 'attack', description: 'Fouet démoniaque' }
  ]
};

const BAALZEBUL: Monster = {
  id: 'baalzebul',
  name: 'Baalzébul',
  hp: 440, maxHp: 440,
  armorClass: 19,
  abilities: createAbilities(24, 20, 26, 28, 24, 26),
  speed: 40,
  challengeRating: 23, xpReward: 50000,
  creatureType: 'fiend', size: 'large',
  portrait: '🪰',
  isBoss: true,
  isHostileNpc: true,
  immunities: ['fire', 'poison'],
  description: 'Baalzébul, Archidiable de Maladomini, septième couche. Le Seigneur des Mouches, autrefois bel ange.',
  skills: [
    { id: 'insect_plague', name: 'Fléau d\'insectes', damage: 42, damageType: 'piercing', type: 'attack', description: 'Nuée d\'insectes démoniaques', areaOfEffect: true }
  ]
};

// DEMON LORDS - Seigneurs Démons de l'Abysse
const DEMOGORGON: Monster = {
  id: 'demogorgon',
  name: 'Demogorgon',
  hp: 496, maxHp: 496,
  armorClass: 22,
  abilities: createAbilities(29, 14, 26, 20, 17, 25),
  speed: 50,
  challengeRating: 26, xpReward: 90000,
  creatureType: 'fiend', size: 'huge',
  portrait: '🐙',
  isBoss: true,
  isHostileNpc: true,
  immunities: ['poison'],
  resistances: ['cold', 'fire', 'lightning'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'poisoned'],
  description: 'Demogorgon, Prince des Démons, le Maître à Deux Têtes. L\'un des seigneurs démons les plus puissants de l\'Abysse.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'tail', name: 'Queue', cost: 1, damage: 30, damageType: 'bludgeoning', description: 'Frappe de queue' },
    { id: 'maddening_gaze', name: 'Regard fou', cost: 2, damage: 0, damageType: 'psychic', description: 'Regard rendant fou' }
  ],
  skills: [
    { id: 'tentacle', name: 'Tentacules', damage: 35, damageType: 'bludgeoning', type: 'attack', description: 'Double attaque tentaculaire', attackCount: 2 },
    { id: 'gaze', name: 'Regard hypnotique', damage: 25, damageType: 'psychic', type: 'attack', description: 'Regard de folie' }
  ],
  ultimateSkill: {
    id: 'primal_scream', name: 'Hurlement Primordial', damage: 80, damageType: 'psychic', type: 'special',
    description: 'Les deux têtes hurlent à l\'unisson, infligeant une folie dévastatrice'
  }
};

const ORCUS: Monster = {
  id: 'orcus',
  name: 'Orcus',
  hp: 405, maxHp: 405,
  armorClass: 17,
  abilities: createAbilities(27, 14, 25, 20, 20, 25),
  speed: 40,
  challengeRating: 26, xpReward: 90000,
  creatureType: 'fiend', size: 'huge',
  portrait: '💀',
  isBoss: true,
  isHostileNpc: true,
  immunities: ['necrotic', 'poison'],
  resistances: ['cold', 'fire', 'lightning'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'poisoned'],
  description: 'Orcus, Prince des Morts-Vivants, Seigneur Démon de Thanatos. Il porte la Baguette d\'Orcus, artefact de mort.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'tail', name: 'Queue', cost: 1, damage: 28, damageType: 'bludgeoning', description: 'Frappe de queue' },
    { id: 'wand', name: 'Baguette d\'Orcus', cost: 2, damage: 45, damageType: 'necrotic', description: 'Pouvoir nécrotique' }
  ],
  skills: [
    { id: 'wand_strike', name: 'Baguette d\'Orcus', damage: 45, damageType: 'necrotic', type: 'attack', description: 'Frappe avec l\'artefact légendaire' },
    { id: 'tail_attack', name: 'Queue', damage: 28, damageType: 'bludgeoning', type: 'attack', description: 'Frappe caudale' }
  ],
  ultimateSkill: {
    id: 'undead_army', name: 'Armée des Morts', damage: 60, damageType: 'necrotic', type: 'special',
    description: 'Orcus invoque la puissance de la mort elle-même'
  }
};

const GRAZZT: Monster = {
  id: 'grazzt',
  name: 'Graz\'zt',
  hp: 378, maxHp: 378,
  armorClass: 20,
  abilities: createAbilities(22, 15, 24, 23, 21, 26),
  speed: 40,
  challengeRating: 24, xpReward: 62000,
  creatureType: 'fiend', size: 'large',
  portrait: '🖤',
  isBoss: true,
  isHostileNpc: true,
  immunities: ['poison'],
  resistances: ['cold', 'fire', 'lightning'],
  description: 'Graz\'zt, le Prince Sombre, Seigneur Démon de l\'indulgence. Le plus séduisant et rusé des princes démons.',
  skills: [
    { id: 'wave_of_sorrow', name: 'Vague de Chagrin', damage: 40, damageType: 'slashing', type: 'attack', description: 'Épée légendaire' },
    { id: 'charm', name: 'Charme', damage: 0, damageType: 'psychic', type: 'debuff', description: 'Tentative de charme' }
  ]
};

const YEENOGHU: Monster = {
  id: 'yeenoghu',
  name: 'Yeenoghu',
  hp: 348, maxHp: 348,
  armorClass: 20,
  abilities: createAbilities(29, 16, 23, 15, 24, 15),
  speed: 50,
  challengeRating: 24, xpReward: 62000,
  creatureType: 'fiend', size: 'huge',
  portrait: '🐺',
  isBoss: true,
  isHostileNpc: true,
  immunities: ['poison'],
  resistances: ['cold', 'fire', 'lightning'],
  description: 'Yeenoghu, le Seigneur des Gnolls, Prince de la Sauvagerie. Il erre dans l\'Abysse avec sa horde de démons.',
  skills: [
    { id: 'flail', name: 'Fléau de Butchery', damage: 42, damageType: 'bludgeoning', type: 'attack', description: 'Triple attaque au fléau', attackCount: 3 }
  ]
};

const JUIBLEX: Monster = {
  id: 'juiblex',
  name: 'Juiblex',
  hp: 350, maxHp: 350,
  armorClass: 18,
  abilities: createAbilities(24, 10, 23, 20, 20, 16),
  speed: 30,
  challengeRating: 23, xpReward: 50000,
  creatureType: 'fiend', size: 'huge',
  portrait: '🧪',
  isBoss: true,
  isHostileNpc: true,
  immunities: ['acid', 'poison'],
  resistances: ['cold', 'fire', 'lightning'],
  description: 'Juiblex, le Seigneur Sans Visage, Prince des Vases. Une masse de corruption et de décomposition.',
  skills: [
    { id: 'acid_splash', name: 'Éclaboussure acide', damage: 40, damageType: 'acid', type: 'attack', description: 'Projection d\'acide', areaOfEffect: true }
  ]
};

const ZUGGTMOY: Monster = {
  id: 'zuggtmoy',
  name: 'Zuggtmoy',
  hp: 304, maxHp: 304,
  armorClass: 18,
  abilities: createAbilities(22, 15, 22, 20, 19, 24),
  speed: 30,
  challengeRating: 23, xpReward: 50000,
  creatureType: 'fiend', size: 'large',
  portrait: '🍄',
  isBoss: true,
  isHostileNpc: true,
  immunities: ['poison'],
  resistances: ['cold', 'fire', 'lightning'],
  description: 'Zuggtmoy, la Reine des Champignons, Dame de la Décomposition. Elle règne sur Shedaklah dans l\'Abysse.',
  skills: [
    { id: 'spore_burst', name: 'Explosion de spores', damage: 35, damageType: 'poison', type: 'attack', description: 'Nuage de spores toxiques', areaOfEffect: true }
  ]
};

const BAPHOMET: Monster = {
  id: 'baphomet',
  name: 'Baphomet',
  hp: 319, maxHp: 319,
  armorClass: 22,
  abilities: createAbilities(30, 14, 26, 18, 24, 16),
  speed: 40,
  challengeRating: 23, xpReward: 50000,
  creatureType: 'fiend', size: 'huge',
  portrait: '🐂',
  isBoss: true,
  isHostileNpc: true,
  immunities: ['poison'],
  resistances: ['cold', 'fire', 'lightning'],
  description: 'Baphomet, le Prince des Bêtes, Seigneur du Labyrinthe Sans Fin. Le patron des minotaures.',
  skills: [
    { id: 'heartcleaver', name: 'Fendeur de Cœurs', damage: 45, damageType: 'slashing', type: 'attack', description: 'Grande hache démoniaque' },
    { id: 'charge', name: 'Charge', damage: 35, damageType: 'bludgeoning', type: 'attack', description: 'Charge brutale avec cornes' }
  ]
};

const FRAZURBLUU: Monster = {
  id: 'frazurbluu',
  name: 'Fraz-Urb\'luu',
  hp: 337, maxHp: 337,
  armorClass: 18,
  abilities: createAbilities(29, 12, 25, 26, 24, 26),
  speed: 40,
  challengeRating: 23, xpReward: 50000,
  creatureType: 'fiend', size: 'large',
  portrait: '🎭',
  isBoss: true,
  isHostileNpc: true,
  immunities: ['poison'],
  resistances: ['cold', 'fire', 'lightning'],
  description: 'Fraz-Urb\'luu, le Prince de la Tromperie. Maître des illusions et de la manipulation.',
  skills: [
    { id: 'phantasmal_killer', name: 'Assassin fantomatique', damage: 40, damageType: 'psychic', type: 'attack', description: 'Illusion mortelle' }
  ]
};

// AUTRES PERSONNAGES HOSTILES ICONIQUES
const STRAHD_VON_ZAROVICH: Monster = {
  id: 'strahd',
  name: 'Strahd von Zarovich',
  hp: 144, maxHp: 144,
  armorClass: 16,
  abilities: createAbilities(18, 18, 18, 20, 15, 18),
  speed: 30,
  challengeRating: 15, xpReward: 13000,
  creatureType: 'undead', size: 'medium',
  portrait: '🧛',
  isBoss: true,
  isHostileNpc: true,
  resistances: ['necrotic'],
  immunities: ['poison'],
  conditionImmunities: ['charmed', 'exhaustion', 'poisoned'],
  description: 'Strahd von Zarovich, le Comte Vampire de Barovie. Seigneur des ténèbres, prisonnier éternel de Ravenloft.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'move', name: 'Déplacement', cost: 1, damage: 0, damageType: 'bludgeoning', description: 'Se déplace sans provoquer' },
    { id: 'unarmed', name: 'Attaque à mains nues', cost: 1, damage: 12, damageType: 'bludgeoning', description: 'Frappe vampirique' },
    { id: 'bite', name: 'Morsure', cost: 2, damage: 18, damageType: 'necrotic', description: 'Morsure vampirique drainante' }
  ],
  skills: [
    { id: 'unarmed', name: 'Frappe vampirique', damage: 14, damageType: 'bludgeoning', type: 'attack', description: 'Attaque à mains nues', attackCount: 2 },
    { id: 'bite', name: 'Morsure', damage: 18, damageType: 'necrotic', type: 'attack', description: 'Morsure drainant la vie' },
    { id: 'charm', name: 'Charme vampirique', damage: 0, damageType: 'psychic', type: 'debuff', description: 'Charme une cible' }
  ],
  ultimateSkill: {
    id: 'children_of_night', name: 'Enfants de la Nuit', damage: 40, damageType: 'necrotic', type: 'special',
    description: 'Strahd invoque les créatures de la nuit à son service'
  }
};

const ACERERAK: Monster = {
  id: 'acererak',
  name: 'Acérérak',
  hp: 285, maxHp: 285,
  armorClass: 21,
  abilities: createAbilities(13, 16, 20, 27, 21, 20),
  speed: 30,
  challengeRating: 23, xpReward: 50000,
  creatureType: 'undead', size: 'medium',
  portrait: '💀',
  isBoss: true,
  isHostileNpc: true,
  immunities: ['necrotic', 'poison', 'bludgeoning', 'piercing', 'slashing'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'paralyzed', 'poisoned'],
  description: 'Acérérak, l\'Archliche, créateur de la Tombe des Horreurs. L\'un des lanceurs de sorts les plus puissants.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'ray', name: 'Rayon', cost: 1, damage: 25, damageType: 'necrotic', description: 'Rayon d\'énergie' },
    { id: 'disrupt', name: 'Perturbation', cost: 2, damage: 35, damageType: 'necrotic', description: 'Explosion nécrotique' }
  ],
  skills: [
    { id: 'staff', name: 'Bâton de l\'Archimage', damage: 15, damageType: 'bludgeoning', type: 'attack', description: 'Frappe au bâton' },
    { id: 'ray_of_sickness', name: 'Rayon de maladie', damage: 25, damageType: 'necrotic', type: 'attack', description: 'Rayon nécrotique' },
    { id: 'finger_of_death', name: 'Doigt de mort', damage: 45, damageType: 'necrotic', type: 'attack', description: 'Sort dévastateur', savingThrow: { ability: 'constitution', dc: 20 } }
  ],
  ultimateSkill: {
    id: 'sphere_annihilation', name: 'Sphère d\'Annihilation', damage: 100, damageType: 'force', type: 'special',
    description: 'Acérérak invoque une sphère qui annihile tout ce qu\'elle touche'
  }
};

const VECNA: Monster = {
  id: 'vecna',
  name: 'Vecna',
  hp: 350, maxHp: 350,
  armorClass: 22,
  abilities: createAbilities(14, 16, 22, 30, 24, 22),
  speed: 30,
  challengeRating: 26, xpReward: 90000,
  creatureType: 'undead', size: 'medium',
  portrait: '👁️',
  isBoss: true,
  isHostileNpc: true,
  immunities: ['necrotic', 'poison'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'paralyzed', 'poisoned'],
  description: 'Vecna, le Chuchoteur, Dieu de la Magie Sombre et des Secrets. La liche qui devint dieu.',
  skills: [
    { id: 'dagger', name: 'Dague de Vecna', damage: 20, damageType: 'piercing', type: 'attack', description: 'Dague maudite' },
    { id: 'deadly_ray', name: 'Rayon mortel', damage: 50, damageType: 'necrotic', type: 'attack', description: 'Rayon d\'énergie nécrotique' }
  ],
  ultimateSkill: {
    id: 'rotten_fate', name: 'Destin Pourri', damage: 90, damageType: 'necrotic', type: 'special',
    description: 'Vecna altère le destin de ses ennemis, les condamnant à la mort'
  }
};

const TIAMAT: Monster = {
  id: 'tiamat',
  name: 'Tiamat',
  hp: 615, maxHp: 615,
  armorClass: 25,
  abilities: createAbilities(30, 10, 30, 26, 26, 28),
  speed: 60,
  challengeRating: 30, xpReward: 155000,
  creatureType: 'dragon', size: 'gargantuan',
  portrait: '🐲',
  isBoss: true,
  isHostileNpc: true,
  immunities: ['acid', 'cold', 'fire', 'lightning', 'poison'],
  conditionImmunities: ['charmed', 'frightened', 'poisoned', 'stunned'],
  description: 'Tiamat, la Reine des Dragons Chromatiques, déesse à cinq têtes. La plus puissante des dragons.',
  legendaryActionsPerTurn: 5,
  legendaryActions: [
    { id: 'bite', name: 'Morsure', cost: 1, damage: 40, damageType: 'piercing', description: 'Morsure d\'une tête' },
    { id: 'breath_fire', name: 'Souffle de feu', cost: 2, damage: 50, damageType: 'fire', description: 'Tête rouge' },
    { id: 'breath_cold', name: 'Souffle de froid', cost: 2, damage: 50, damageType: 'cold', description: 'Tête blanche' },
    { id: 'breath_acid', name: 'Souffle acide', cost: 2, damage: 50, damageType: 'acid', description: 'Tête noire' },
    { id: 'breath_lightning', name: 'Souffle de foudre', cost: 2, damage: 50, damageType: 'lightning', description: 'Tête bleue' },
    { id: 'breath_poison', name: 'Souffle de poison', cost: 2, damage: 50, damageType: 'poison', description: 'Tête verte' }
  ],
  skills: [
    { id: 'multiattack', name: 'Attaques multiples', damage: 35, damageType: 'slashing', type: 'attack', description: 'Griffes et morsures', attackCount: 5 },
    { id: 'frightful_presence', name: 'Présence terrifiante', damage: 0, damageType: 'psychic', type: 'debuff', description: 'Terreur divine' }
  ],
  ultimateSkill: {
    id: 'five_headed_fury', name: 'Furie des Cinq Têtes', damage: 120, damageType: 'fire', type: 'special',
    description: 'Les cinq têtes attaquent simultanément avec leurs souffles'
  }
};

const BAHAMUT: Monster = {
  id: 'bahamut',
  name: 'Bahamut (Ennemi)',
  hp: 585, maxHp: 585,
  armorClass: 25,
  abilities: createAbilities(30, 10, 30, 26, 28, 30),
  speed: 60,
  challengeRating: 30, xpReward: 155000,
  creatureType: 'dragon', size: 'gargantuan',
  portrait: '⚪',
  isBoss: true,
  isHostileNpc: true,
  immunities: ['cold', 'radiant'],
  conditionImmunities: ['charmed', 'frightened', 'poisoned', 'stunned'],
  description: 'Bahamut, le Dragon de Platine, dieu des dragons métalliques. Sous forme hostile pour ceux qui défient la justice.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'bite', name: 'Morsure', cost: 1, damage: 42, damageType: 'piercing', description: 'Morsure divine' },
    { id: 'divine_word', name: 'Mot divin', cost: 3, damage: 60, damageType: 'radiant', description: 'Parole divine' }
  ],
  skills: [
    { id: 'breath_weapon', name: 'Souffle de froid', damage: 60, damageType: 'cold', type: 'attack', description: 'Souffle glacial', areaOfEffect: true },
    { id: 'divine_radiance', name: 'Radiance divine', damage: 50, damageType: 'radiant', type: 'attack', description: 'Lumière purificatrice' }
  ],
  ultimateSkill: {
    id: 'platinum_judgment', name: 'Jugement de Platine', damage: 100, damageType: 'radiant', type: 'special',
    description: 'Bahamut juge tous ses ennemis avec la lumière divine'
  }
};

// ============================================
// DRAGONS SUPPLÉMENTAIRES (Tous les types et âges)
// ============================================

// DRAGONS CHROMATIQUES JEUNES
const YOUNG_BLACK_DRAGON: Monster = {
  id: 'young_black_dragon',
  name: 'Jeune Dragon Noir',
  hp: 127, maxHp: 127,
  armorClass: 18,
  abilities: createAbilities(19, 14, 17, 12, 11, 15),
  speed: 40,
  challengeRating: 7, xpReward: 2900,
  creatureType: 'dragon', size: 'large',
  portrait: '🐉',
  isBoss: false,
  immunities: ['acid'],
  description: 'Dragon noir sadique vivant dans les marécages. Son souffle d\'acide dissout tout.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 18, damageType: 'piercing', type: 'attack', description: 'Morsure acide' },
    { id: 'acid_breath', name: 'Souffle acide', damage: 45, damageType: 'acid', type: 'attack', description: 'Ligne d\'acide 30 pieds', recharge: { min: 5 }, savingThrow: { ability: 'dexterity', dc: 14 } }
  ]
};

const YOUNG_BLUE_DRAGON: Monster = {
  id: 'young_blue_dragon',
  name: 'Jeune Dragon Bleu',
  hp: 152, maxHp: 152,
  armorClass: 18,
  abilities: createAbilities(21, 10, 19, 14, 13, 17),
  speed: 40,
  challengeRating: 9, xpReward: 5000,
  creatureType: 'dragon', size: 'large',
  portrait: '🐉',
  isBoss: false,
  immunities: ['lightning'],
  description: 'Dragon bleu territorial du désert. Son souffle de foudre est dévastateur.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 20, damageType: 'piercing', type: 'attack', description: 'Morsure électrique' },
    { id: 'lightning_breath', name: 'Souffle de foudre', damage: 55, damageType: 'lightning', type: 'attack', description: 'Ligne de foudre 60 pieds', recharge: { min: 5 }, savingThrow: { ability: 'dexterity', dc: 16 } }
  ]
};

const YOUNG_GREEN_DRAGON: Monster = {
  id: 'young_green_dragon',
  name: 'Jeune Dragon Vert',
  hp: 136, maxHp: 136,
  armorClass: 18,
  abilities: createAbilities(19, 12, 17, 16, 13, 15),
  speed: 40,
  challengeRating: 8, xpReward: 3900,
  creatureType: 'dragon', size: 'large',
  portrait: '🐉',
  isBoss: false,
  immunities: ['poison'],
  description: 'Dragon vert manipulateur des forêts. Son souffle empoisonné est mortel.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 18, damageType: 'piercing', type: 'attack', description: 'Morsure venimeuse' },
    { id: 'poison_breath', name: 'Souffle empoisonné', damage: 42, damageType: 'poison', type: 'attack', description: 'Cône de poison 30 pieds', recharge: { min: 5 }, savingThrow: { ability: 'constitution', dc: 14 } }
  ]
};

// DRAGONS CHROMATIQUES ADULTES
const ADULT_BLACK_DRAGON: Monster = {
  id: 'adult_black_dragon',
  name: 'Dragon Noir Adulte',
  hp: 195, maxHp: 195,
  armorClass: 19,
  abilities: createAbilities(23, 14, 21, 14, 13, 17),
  speed: 40,
  challengeRating: 14, xpReward: 11500,
  creatureType: 'dragon', size: 'huge',
  portrait: '🐉',
  isBoss: true,
  immunities: ['acid'],
  description: 'Dragon noir adulte, maître des marécages. Cruel et vindicatif.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'detect', name: 'Détection', cost: 1, damage: 0, damageType: 'piercing', description: 'Perception de sagesse' },
    { id: 'tail', name: 'Queue', cost: 1, damage: 18, damageType: 'bludgeoning', description: 'Frappe de queue' },
    { id: 'wing', name: 'Ailes', cost: 2, damage: 16, damageType: 'bludgeoning', description: 'Battement d\'ailes' }
  ],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 25, damageType: 'piercing', type: 'attack', description: 'Morsure acide' },
    { id: 'acid_breath', name: 'Souffle acide', damage: 54, damageType: 'acid', type: 'attack', description: 'Ligne d\'acide 60 pieds', recharge: { min: 5 }, savingThrow: { ability: 'dexterity', dc: 18 } }
  ],
  ultimateSkill: {
    id: 'acid_torrent', name: 'Torrent d\'Acide', damage: 70, damageType: 'acid', type: 'special',
    description: 'Le dragon déverse un déluge d\'acide corrosif'
  }
};

const ADULT_BLUE_DRAGON: Monster = {
  id: 'adult_blue_dragon',
  name: 'Dragon Bleu Adulte',
  hp: 225, maxHp: 225,
  armorClass: 19,
  abilities: createAbilities(25, 10, 23, 16, 15, 19),
  speed: 40,
  challengeRating: 16, xpReward: 15000,
  creatureType: 'dragon', size: 'huge',
  portrait: '🐉',
  isBoss: true,
  immunities: ['lightning'],
  description: 'Dragon bleu adulte du désert. Fier et territorial.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'detect', name: 'Détection', cost: 1, damage: 0, damageType: 'piercing', description: 'Perception de sagesse' },
    { id: 'tail', name: 'Queue', cost: 1, damage: 20, damageType: 'bludgeoning', description: 'Frappe de queue' },
    { id: 'wing', name: 'Ailes', cost: 2, damage: 18, damageType: 'bludgeoning', description: 'Battement d\'ailes' }
  ],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 28, damageType: 'piercing', type: 'attack', description: 'Morsure électrique' },
    { id: 'lightning_breath', name: 'Souffle de foudre', damage: 66, damageType: 'lightning', type: 'attack', description: 'Ligne de foudre 90 pieds', recharge: { min: 5 }, savingThrow: { ability: 'dexterity', dc: 19 } }
  ],
  ultimateSkill: {
    id: 'storm_fury', name: 'Furie de la Tempête', damage: 80, damageType: 'lightning', type: 'special',
    description: 'Le dragon déchaîne la puissance d\'un orage'
  }
};

const ADULT_GREEN_DRAGON: Monster = {
  id: 'adult_green_dragon',
  name: 'Dragon Vert Adulte',
  hp: 207, maxHp: 207,
  armorClass: 19,
  abilities: createAbilities(23, 12, 21, 18, 15, 17),
  speed: 40,
  challengeRating: 15, xpReward: 13000,
  creatureType: 'dragon', size: 'huge',
  portrait: '🐉',
  isBoss: true,
  immunities: ['poison'],
  description: 'Dragon vert adulte, maître manipulateur des forêts anciennes.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'detect', name: 'Détection', cost: 1, damage: 0, damageType: 'piercing', description: 'Perception de sagesse' },
    { id: 'tail', name: 'Queue', cost: 1, damage: 18, damageType: 'bludgeoning', description: 'Frappe de queue' },
    { id: 'wing', name: 'Ailes', cost: 2, damage: 16, damageType: 'bludgeoning', description: 'Battement d\'ailes' }
  ],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 26, damageType: 'piercing', type: 'attack', description: 'Morsure venimeuse' },
    { id: 'poison_breath', name: 'Souffle empoisonné', damage: 56, damageType: 'poison', type: 'attack', description: 'Cône de poison 60 pieds', recharge: { min: 5 }, savingThrow: { ability: 'constitution', dc: 18 } }
  ],
  ultimateSkill: {
    id: 'toxic_cloud', name: 'Nuage Toxique', damage: 70, damageType: 'poison', type: 'special',
    description: 'Le dragon libère un nuage de poison persistant'
  }
};

const ADULT_WHITE_DRAGON: Monster = {
  id: 'adult_white_dragon',
  name: 'Dragon Blanc Adulte',
  hp: 200, maxHp: 200,
  armorClass: 18,
  abilities: createAbilities(22, 10, 22, 8, 12, 12),
  speed: 40,
  challengeRating: 13, xpReward: 10000,
  creatureType: 'dragon', size: 'huge',
  portrait: '🐉',
  isBoss: true,
  immunities: ['cold'],
  description: 'Dragon blanc adulte des terres glacées. Bestial et territorial.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'detect', name: 'Détection', cost: 1, damage: 0, damageType: 'piercing', description: 'Perception de sagesse' },
    { id: 'tail', name: 'Queue', cost: 1, damage: 16, damageType: 'bludgeoning', description: 'Frappe de queue' },
    { id: 'wing', name: 'Ailes', cost: 2, damage: 14, damageType: 'bludgeoning', description: 'Battement d\'ailes' }
  ],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 24, damageType: 'piercing', type: 'attack', description: 'Morsure glacée' },
    { id: 'cold_breath', name: 'Souffle de froid', damage: 54, damageType: 'cold', type: 'attack', description: 'Cône de froid 60 pieds', recharge: { min: 5 }, savingThrow: { ability: 'constitution', dc: 19 } }
  ],
  ultimateSkill: {
    id: 'glacial_storm', name: 'Tempête Glaciaire', damage: 65, damageType: 'cold', type: 'special',
    description: 'Le dragon déchaîne une tempête de glace'
  }
};

// DRAGONS CHROMATIQUES ANCIENS (ajoutés aux existants)
const ANCIENT_BLACK_DRAGON: Monster = {
  id: 'ancient_black_dragon',
  name: 'Dragon Noir Ancien',
  hp: 367, maxHp: 367,
  armorClass: 22,
  abilities: createAbilities(27, 14, 25, 16, 15, 19),
  speed: 40,
  challengeRating: 21, xpReward: 33000,
  creatureType: 'dragon', size: 'gargantuan',
  portrait: '🐉',
  isBoss: true,
  immunities: ['acid'],
  description: 'Dragon noir ancien, seigneur des marécages. Millénaires de cruauté concentrée.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'detect', name: 'Détection', cost: 1, damage: 0, damageType: 'piercing', description: 'Perception de sagesse' },
    { id: 'tail', name: 'Queue', cost: 1, damage: 22, damageType: 'bludgeoning', description: 'Frappe de queue' },
    { id: 'wing', name: 'Ailes', cost: 2, damage: 20, damageType: 'bludgeoning', description: 'Battement d\'ailes' }
  ],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 34, damageType: 'piercing', type: 'attack', description: 'Morsure acide' },
    { id: 'acid_breath', name: 'Souffle acide', damage: 67, damageType: 'acid', type: 'attack', description: 'Ligne d\'acide 90 pieds', recharge: { min: 5 }, savingThrow: { ability: 'dexterity', dc: 22 } }
  ],
  ultimateSkill: {
    id: 'acid_apocalypse', name: 'Apocalypse Acide', damage: 90, damageType: 'acid', type: 'special',
    description: 'L\'acide consume tout sur son passage'
  }
};

const ANCIENT_BLUE_DRAGON: Monster = {
  id: 'ancient_blue_dragon',
  name: 'Dragon Bleu Ancien',
  hp: 481, maxHp: 481,
  armorClass: 22,
  abilities: createAbilities(29, 10, 27, 18, 17, 21),
  speed: 40,
  challengeRating: 23, xpReward: 50000,
  creatureType: 'dragon', size: 'gargantuan',
  portrait: '🐉',
  isBoss: true,
  immunities: ['lightning'],
  description: 'Dragon bleu ancien, empereur du désert. La foudre incarnée.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'detect', name: 'Détection', cost: 1, damage: 0, damageType: 'piercing', description: 'Perception de sagesse' },
    { id: 'tail', name: 'Queue', cost: 1, damage: 24, damageType: 'bludgeoning', description: 'Frappe de queue' },
    { id: 'wing', name: 'Ailes', cost: 2, damage: 22, damageType: 'bludgeoning', description: 'Battement d\'ailes' }
  ],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 38, damageType: 'piercing', type: 'attack', description: 'Morsure électrique' },
    { id: 'lightning_breath', name: 'Souffle de foudre', damage: 88, damageType: 'lightning', type: 'attack', description: 'Ligne de foudre 120 pieds', recharge: { min: 5 }, savingThrow: { ability: 'dexterity', dc: 23 } }
  ],
  ultimateSkill: {
    id: 'thunderstorm', name: 'Tempête de Tonnerre', damage: 100, damageType: 'lightning', type: 'special',
    description: 'La fureur d\'un orage primordial'
  }
};

const ANCIENT_GREEN_DRAGON: Monster = {
  id: 'ancient_green_dragon',
  name: 'Dragon Vert Ancien',
  hp: 385, maxHp: 385,
  armorClass: 21,
  abilities: createAbilities(27, 12, 25, 20, 17, 19),
  speed: 40,
  challengeRating: 22, xpReward: 41000,
  creatureType: 'dragon', size: 'gargantuan',
  portrait: '🐉',
  isBoss: true,
  immunities: ['poison'],
  description: 'Dragon vert ancien, maître des forêts primordiales. Manipulateur suprême.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'detect', name: 'Détection', cost: 1, damage: 0, damageType: 'piercing', description: 'Perception de sagesse' },
    { id: 'tail', name: 'Queue', cost: 1, damage: 22, damageType: 'bludgeoning', description: 'Frappe de queue' },
    { id: 'wing', name: 'Ailes', cost: 2, damage: 20, damageType: 'bludgeoning', description: 'Battement d\'ailes' }
  ],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 35, damageType: 'piercing', type: 'attack', description: 'Morsure venimeuse' },
    { id: 'poison_breath', name: 'Souffle empoisonné', damage: 77, damageType: 'poison', type: 'attack', description: 'Cône de poison 90 pieds', recharge: { min: 5 }, savingThrow: { ability: 'constitution', dc: 22 } }
  ],
  ultimateSkill: {
    id: 'venomous_doom', name: 'Doom Venimeux', damage: 95, damageType: 'poison', type: 'special',
    description: 'Un poison si puissant qu\'il corrompt l\'âme'
  }
};

const ANCIENT_WHITE_DRAGON: Monster = {
  id: 'ancient_white_dragon',
  name: 'Dragon Blanc Ancien',
  hp: 333, maxHp: 333,
  armorClass: 20,
  abilities: createAbilities(26, 10, 26, 10, 13, 14),
  speed: 40,
  challengeRating: 20, xpReward: 25000,
  creatureType: 'dragon', size: 'gargantuan',
  portrait: '🐉',
  isBoss: true,
  immunities: ['cold'],
  description: 'Dragon blanc ancien, roi des glaciers. Prédateur ultime des terres gelées.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'detect', name: 'Détection', cost: 1, damage: 0, damageType: 'piercing', description: 'Perception de sagesse' },
    { id: 'tail', name: 'Queue', cost: 1, damage: 20, damageType: 'bludgeoning', description: 'Frappe de queue' },
    { id: 'wing', name: 'Ailes', cost: 2, damage: 18, damageType: 'bludgeoning', description: 'Battement d\'ailes' }
  ],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 32, damageType: 'piercing', type: 'attack', description: 'Morsure glacée' },
    { id: 'cold_breath', name: 'Souffle de froid', damage: 72, damageType: 'cold', type: 'attack', description: 'Cône de froid 90 pieds', recharge: { min: 5 }, savingThrow: { ability: 'constitution', dc: 22 } }
  ],
  ultimateSkill: {
    id: 'ice_age', name: 'Ère Glaciaire', damage: 85, damageType: 'cold', type: 'special',
    description: 'Le froid absolu qui gèle le temps lui-même'
  }
};

// DRAGONS MÉTALLIQUES (Gold, Silver, Bronze, Copper, Brass)
const YOUNG_GOLD_DRAGON: Monster = {
  id: 'young_gold_dragon',
  name: 'Jeune Dragon d\'Or',
  hp: 178, maxHp: 178,
  armorClass: 18,
  abilities: createAbilities(23, 14, 21, 16, 13, 20),
  speed: 40,
  challengeRating: 10, xpReward: 5900,
  creatureType: 'dragon', size: 'large',
  portrait: '✨',
  isBoss: false,
  immunities: ['fire'],
  description: 'Dragon d\'or majestueux. Noble et juste, il protège les innocents.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 22, damageType: 'piercing', type: 'attack', description: 'Morsure divine' },
    { id: 'fire_breath', name: 'Souffle de feu', damage: 55, damageType: 'fire', type: 'attack', description: 'Cône de feu 30 pieds', recharge: { min: 5 }, savingThrow: { ability: 'dexterity', dc: 17 } },
    { id: 'weakening_breath', name: 'Souffle affaiblissant', damage: 0, damageType: 'force', type: 'debuff', description: 'Affaiblit les ennemis', recharge: { min: 5 }, savingThrow: { ability: 'strength', dc: 17 } }
  ]
};

const ADULT_GOLD_DRAGON: Monster = {
  id: 'adult_gold_dragon',
  name: 'Dragon d\'Or Adulte',
  hp: 256, maxHp: 256,
  armorClass: 19,
  abilities: createAbilities(27, 14, 25, 16, 15, 24),
  speed: 40,
  challengeRating: 17, xpReward: 18000,
  creatureType: 'dragon', size: 'huge',
  portrait: '✨',
  isBoss: true,
  immunities: ['fire'],
  description: 'Dragon d\'or adulte, champion de la lumière et protecteur des royaumes.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'detect', name: 'Détection', cost: 1, damage: 0, damageType: 'piercing', description: 'Perception de sagesse' },
    { id: 'tail', name: 'Queue', cost: 1, damage: 20, damageType: 'bludgeoning', description: 'Frappe de queue' },
    { id: 'wing', name: 'Ailes', cost: 2, damage: 18, damageType: 'bludgeoning', description: 'Battement d\'ailes' }
  ],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 30, damageType: 'piercing', type: 'attack', description: 'Morsure divine' },
    { id: 'fire_breath', name: 'Souffle de feu', damage: 66, damageType: 'fire', type: 'attack', description: 'Cône de feu 60 pieds', recharge: { min: 5 }, savingThrow: { ability: 'dexterity', dc: 21 } }
  ],
  ultimateSkill: {
    id: 'divine_fire', name: 'Feu Divin', damage: 80, damageType: 'fire', type: 'special',
    description: 'Flammes purificatrices de justice divine'
  }
};

const ANCIENT_GOLD_DRAGON: Monster = {
  id: 'ancient_gold_dragon',
  name: 'Dragon d\'Or Ancien',
  hp: 546, maxHp: 546,
  armorClass: 22,
  abilities: createAbilities(30, 14, 29, 18, 17, 28),
  speed: 40,
  challengeRating: 24, xpReward: 62000,
  creatureType: 'dragon', size: 'gargantuan',
  portrait: '✨',
  isBoss: true,
  immunities: ['fire'],
  description: 'Dragon d\'or ancien, avatar de la justice. Le plus noble des dragons.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'detect', name: 'Détection', cost: 1, damage: 0, damageType: 'piercing', description: 'Perception de sagesse' },
    { id: 'tail', name: 'Queue', cost: 1, damage: 24, damageType: 'bludgeoning', description: 'Frappe de queue' },
    { id: 'wing', name: 'Ailes', cost: 2, damage: 22, damageType: 'bludgeoning', description: 'Battement d\'ailes' }
  ],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 40, damageType: 'piercing', type: 'attack', description: 'Morsure divine' },
    { id: 'fire_breath', name: 'Souffle de feu', damage: 91, damageType: 'fire', type: 'attack', description: 'Cône de feu 90 pieds', recharge: { min: 5 }, savingThrow: { ability: 'dexterity', dc: 24 } }
  ],
  ultimateSkill: {
    id: 'solar_judgment', name: 'Jugement Solaire', damage: 110, damageType: 'fire', type: 'special',
    description: 'La lumière du soleil incarnée pour juger les impies'
  }
};

const YOUNG_SILVER_DRAGON: Monster = {
  id: 'young_silver_dragon',
  name: 'Jeune Dragon d\'Argent',
  hp: 168, maxHp: 168,
  armorClass: 18,
  abilities: createAbilities(23, 10, 21, 14, 11, 19),
  speed: 40,
  challengeRating: 9, xpReward: 5000,
  creatureType: 'dragon', size: 'large',
  portrait: '🌙',
  isBoss: false,
  immunities: ['cold'],
  description: 'Dragon d\'argent amical et protecteur. Aime la compagnie des humanoïdes.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 20, damageType: 'piercing', type: 'attack', description: 'Morsure glacée' },
    { id: 'cold_breath', name: 'Souffle de froid', damage: 54, damageType: 'cold', type: 'attack', description: 'Cône de froid 30 pieds', recharge: { min: 5 }, savingThrow: { ability: 'constitution', dc: 17 } }
  ]
};

const ADULT_SILVER_DRAGON: Monster = {
  id: 'adult_silver_dragon',
  name: 'Dragon d\'Argent Adulte',
  hp: 243, maxHp: 243,
  armorClass: 19,
  abilities: createAbilities(27, 10, 25, 16, 13, 21),
  speed: 40,
  challengeRating: 16, xpReward: 15000,
  creatureType: 'dragon', size: 'huge',
  portrait: '🌙',
  isBoss: true,
  immunities: ['cold'],
  description: 'Dragon d\'argent adulte, gardien des cieux et ami des mortels vertueux.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'detect', name: 'Détection', cost: 1, damage: 0, damageType: 'piercing', description: 'Perception de sagesse' },
    { id: 'tail', name: 'Queue', cost: 1, damage: 20, damageType: 'bludgeoning', description: 'Frappe de queue' },
    { id: 'wing', name: 'Ailes', cost: 2, damage: 18, damageType: 'bludgeoning', description: 'Battement d\'ailes' }
  ],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 28, damageType: 'piercing', type: 'attack', description: 'Morsure glacée' },
    { id: 'cold_breath', name: 'Souffle de froid', damage: 67, damageType: 'cold', type: 'attack', description: 'Cône de froid 60 pieds', recharge: { min: 5 }, savingThrow: { ability: 'constitution', dc: 20 } }
  ],
  ultimateSkill: {
    id: 'winter_blessing', name: 'Bénédiction de l\'Hiver', damage: 75, damageType: 'cold', type: 'special',
    description: 'Le froid purificateur qui gèle le mal'
  }
};

const ANCIENT_SILVER_DRAGON: Monster = {
  id: 'ancient_silver_dragon',
  name: 'Dragon d\'Argent Ancien',
  hp: 487, maxHp: 487,
  armorClass: 22,
  abilities: createAbilities(30, 10, 29, 18, 15, 23),
  speed: 40,
  challengeRating: 23, xpReward: 50000,
  creatureType: 'dragon', size: 'gargantuan',
  portrait: '🌙',
  isBoss: true,
  immunities: ['cold'],
  description: 'Dragon d\'argent ancien, sage gardien des royaumes mortels depuis des millénaires.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'detect', name: 'Détection', cost: 1, damage: 0, damageType: 'piercing', description: 'Perception de sagesse' },
    { id: 'tail', name: 'Queue', cost: 1, damage: 24, damageType: 'bludgeoning', description: 'Frappe de queue' },
    { id: 'wing', name: 'Ailes', cost: 2, damage: 22, damageType: 'bludgeoning', description: 'Battement d\'ailes' }
  ],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 38, damageType: 'piercing', type: 'attack', description: 'Morsure glacée' },
    { id: 'cold_breath', name: 'Souffle de froid', damage: 90, damageType: 'cold', type: 'attack', description: 'Cône de froid 90 pieds', recharge: { min: 5 }, savingThrow: { ability: 'constitution', dc: 24 } }
  ],
  ultimateSkill: {
    id: 'eternal_frost', name: 'Givre Éternel', damage: 100, damageType: 'cold', type: 'special',
    description: 'Un froid si profond qu\'il transcende le temps'
  }
};

// ============================================
// MORTS-VIVANTS LÉGENDAIRES ET PUISSANTS
// ============================================

const DEMILICH: Monster = {
  id: 'demilich',
  name: 'Démiliche',
  hp: 80, maxHp: 80,
  armorClass: 20,
  abilities: createAbilities(1, 20, 10, 20, 17, 20),
  speed: 0,
  challengeRating: 18, xpReward: 20000,
  creatureType: 'undead', size: 'tiny',
  portrait: '💀',
  isBoss: true,
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  immunities: ['necrotic', 'poison', 'psychic'],
  conditionImmunities: ['charmed', 'deafened', 'exhaustion', 'frightened', 'paralyzed', 'petrified', 'poisoned', 'prone', 'stunned'],
  description: 'Une liche dont le corps s\'est désintégré, ne laissant qu\'un crâne flottant d\'une puissance magique immense.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'flight', name: 'Vol', cost: 1, damage: 0, damageType: 'force', description: 'Se déplace' },
    { id: 'dust_cloud', name: 'Nuage de poussière', cost: 2, damage: 25, damageType: 'necrotic', description: 'Nuage nécrotique' }
  ],
  skills: [
    { id: 'life_drain', name: 'Drain de vie', damage: 28, damageType: 'necrotic', type: 'attack', description: 'Aspire l\'essence vitale' },
    { id: 'howl', name: 'Hurlement', damage: 35, damageType: 'psychic', type: 'attack', description: 'Hurlement psychique dévastateur', areaOfEffect: true }
  ],
  ultimateSkill: {
    id: 'soul_trap', name: 'Piège à Âmes', damage: 50, damageType: 'necrotic', type: 'special',
    description: 'La démiliche tente de capturer l\'âme de sa victime'
  }
};

const NIGHTWALKER: Monster = {
  id: 'nightwalker',
  name: 'Marcheur de Nuit',
  hp: 297, maxHp: 297,
  armorClass: 14,
  abilities: createAbilities(22, 19, 24, 6, 9, 8),
  speed: 40,
  challengeRating: 20, xpReward: 25000,
  creatureType: 'undead', size: 'huge',
  portrait: '🌑',
  isBoss: true,
  resistances: ['acid', 'cold', 'fire', 'lightning', 'thunder'],
  immunities: ['necrotic', 'poison'],
  conditionImmunities: ['exhaustion', 'frightened', 'grappled', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained'],
  description: 'Une entité de pur néant des Royaumes des Ombres. Sa présence tue la lumière et la vie.',
  skills: [
    { id: 'enervating_focus', name: 'Focus énervant', damage: 35, damageType: 'necrotic', type: 'attack', description: 'Drain de vie dévastateur' },
    { id: 'finger_of_doom', name: 'Doigt du destin', damage: 45, damageType: 'necrotic', type: 'attack', description: 'Condamne une cible à mort' }
  ],
  ultimateSkill: {
    id: 'annihilating_aura', name: 'Aura Annihilatrice', damage: 60, damageType: 'necrotic', type: 'special',
    description: 'L\'aura du Marcheur de Nuit détruit tout ce qui l\'entoure'
  }
};

const BODAK: Monster = {
  id: 'bodak',
  name: 'Bodak',
  hp: 58, maxHp: 58,
  armorClass: 15,
  abilities: createAbilities(15, 16, 15, 7, 12, 12),
  speed: 30,
  challengeRating: 6, xpReward: 2300,
  creatureType: 'undead', size: 'medium',
  portrait: '👁️',
  isBoss: false,
  resistances: ['cold', 'fire', 'necrotic'],
  immunities: ['lightning', 'poison'],
  conditionImmunities: ['charmed', 'frightened', 'poisoned'],
  description: 'Humanoïde corrompu par une rencontre avec un pouvoir maléfique absolu. Son regard tue.',
  skills: [
    { id: 'fist', name: 'Poing', damage: 12, damageType: 'bludgeoning', type: 'attack', description: 'Frappe mortelle' },
    { id: 'death_gaze', name: 'Regard de mort', damage: 22, damageType: 'necrotic', type: 'attack', description: 'Regard qui tue', savingThrow: { ability: 'constitution', dc: 13 } }
  ]
};

const SKULL_LORD: Monster = {
  id: 'skull_lord',
  name: 'Seigneur des Crânes',
  hp: 105, maxHp: 105,
  armorClass: 18,
  abilities: createAbilities(14, 16, 17, 16, 15, 21),
  speed: 30,
  challengeRating: 15, xpReward: 13000,
  creatureType: 'undead', size: 'medium',
  portrait: '💀',
  isBoss: true,
  resistances: ['cold'],
  immunities: ['necrotic', 'poison'],
  conditionImmunities: ['charmed', 'deafened', 'exhaustion', 'frightened', 'poisoned', 'stunned', 'unconscious'],
  description: 'Un mort-vivant à trois crânes, ancien serviteur de Vecna. Chaque crâne possède une personnalité distincte.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'bone_staff', name: 'Bâton d\'os', cost: 1, damage: 16, damageType: 'bludgeoning', description: 'Frappe au bâton' },
    { id: 'spell', name: 'Sort', cost: 2, damage: 22, damageType: 'necrotic', description: 'Lance un sort' }
  ],
  skills: [
    { id: 'bone_staff', name: 'Bâton d\'os', damage: 16, damageType: 'bludgeoning', type: 'attack', description: 'Bâton enchanté', attackCount: 2 },
    { id: 'finger_of_death', name: 'Doigt de mort', damage: 36, damageType: 'necrotic', type: 'attack', description: 'Rayon nécrotique' }
  ],
  ultimateSkill: {
    id: 'masters_call', name: 'Appel du Maître', damage: 45, damageType: 'necrotic', type: 'special',
    description: 'Canalise le pouvoir de Vecna'
  }
};

const BONECLAW: Monster = {
  id: 'boneclaw',
  name: 'Griffe d\'Os',
  hp: 127, maxHp: 127,
  armorClass: 16,
  abilities: createAbilities(19, 16, 15, 13, 15, 9),
  speed: 40,
  challengeRating: 12, xpReward: 8400,
  creatureType: 'undead', size: 'large',
  portrait: '🦴',
  isBoss: false,
  resistances: ['cold', 'necrotic'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'paralyzed', 'poisoned'],
  description: 'Une liche échouée dont la transformation a mal tourné. Liée à un maître vivant.',
  skills: [
    { id: 'piercing_claw', name: 'Griffe perforante', damage: 25, damageType: 'piercing', type: 'attack', description: 'Griffes extensibles', attackCount: 2 },
    { id: 'shadow_jump', name: 'Saut d\'ombre', damage: 0, damageType: 'necrotic', type: 'special', description: 'Se téléporte via les ombres' }
  ]
};

// ============================================
// ABERRATIONS PUISSANTES
// ============================================

const ELDER_BRAIN: Monster = {
  id: 'elder_brain',
  name: 'Cerveau Ancestral',
  hp: 210, maxHp: 210,
  armorClass: 10,
  abilities: createAbilities(15, 10, 20, 21, 19, 24),
  speed: 5,
  challengeRating: 14, xpReward: 11500,
  creatureType: 'aberration', size: 'large',
  portrait: '🧠',
  isBoss: true,
  immunities: ['psychic'],
  conditionImmunities: ['charmed', 'frightened', 'prone'],
  description: 'Le cerveau collectif d\'une colonie de flagelleurs mentaux. Intelligence extraterrestre pure.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'tentacle', name: 'Tentacule', cost: 1, damage: 18, damageType: 'bludgeoning', description: 'Frappe tentaculaire' },
    { id: 'break_concentration', name: 'Brise concentration', cost: 2, damage: 0, damageType: 'psychic', description: 'Perturbe mentalement' },
    { id: 'psychic_pulse', name: 'Pulse psychique', cost: 3, damage: 35, damageType: 'psychic', description: 'Onde psychique' }
  ],
  skills: [
    { id: 'tentacle', name: 'Tentacule', damage: 18, damageType: 'bludgeoning', type: 'attack', description: 'Frappe gluante' },
    { id: 'mind_blast', name: 'Souffle mental', damage: 32, damageType: 'psychic', type: 'attack', description: 'Cône psychique 60 pieds', areaOfEffect: true, savingThrow: { ability: 'intelligence', dc: 18 } }
  ],
  ultimateSkill: {
    id: 'psychic_link', name: 'Lien Psychique', damage: 50, damageType: 'psychic', type: 'special',
    description: 'Écrase l\'esprit de ses ennemis avec l\'intelligence collective'
  }
};

const NEOTHELID: Monster = {
  id: 'neothelid',
  name: 'Néothélide',
  hp: 325, maxHp: 325,
  armorClass: 16,
  abilities: createAbilities(27, 7, 21, 3, 16, 12),
  speed: 30,
  challengeRating: 13, xpReward: 10000,
  creatureType: 'aberration', size: 'gargantuan',
  portrait: '🪱',
  isBoss: true,
  immunities: ['psychic'],
  description: 'Un ver géant issu d\'un tadpole de flagelleur mental qui a grandi sans hôte. Bestial et vorace.',
  skills: [
    { id: 'tentacles', name: 'Tentacules', damage: 28, damageType: 'bludgeoning', type: 'attack', description: 'Tentacules écrasants' },
    { id: 'acid_breath', name: 'Souffle acide', damage: 42, damageType: 'acid', type: 'attack', description: 'Cône d\'acide 60 pieds', areaOfEffect: true, recharge: { min: 5 }, savingThrow: { ability: 'dexterity', dc: 16 } }
  ],
  ultimateSkill: {
    id: 'psychic_scream', name: 'Hurlement Psychique', damage: 55, damageType: 'psychic', type: 'special',
    description: 'Hurlement psychique primitif et dévastateur'
  }
};

const STAR_SPAWN_EMISSARY: Monster = {
  id: 'star_spawn_emissary',
  name: 'Émissaire des Étoiles',
  hp: 290, maxHp: 290,
  armorClass: 19,
  abilities: createAbilities(27, 18, 25, 25, 20, 23),
  speed: 40,
  challengeRating: 21, xpReward: 33000,
  creatureType: 'aberration', size: 'large',
  portrait: '⭐',
  isBoss: true,
  resistances: ['acid', 'cold', 'fire', 'necrotic', 'psychic'],
  immunities: ['bludgeoning', 'piercing', 'slashing'],
  conditionImmunities: ['charmed', 'frightened'],
  description: 'Émissaire des Anciens, venu des étoiles pour annoncer la fin de toute chose.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'attack', name: 'Attaque', cost: 1, damage: 28, damageType: 'slashing', description: 'Frappe griffue' },
    { id: 'teleport', name: 'Téléportation', cost: 2, damage: 0, damageType: 'force', description: 'Se téléporte' }
  ],
  skills: [
    { id: 'lashing_claw', name: 'Griffe cinglante', damage: 28, damageType: 'slashing', type: 'attack', description: 'Griffes stellaires', attackCount: 2 },
    { id: 'psychic_orb', name: 'Orbe psychique', damage: 35, damageType: 'psychic', type: 'attack', description: 'Orbe d\'énergie cosmique' }
  ],
  ultimateSkill: {
    id: 'cosmic_form', name: 'Forme Cosmique', damage: 70, damageType: 'force', type: 'special',
    description: 'Révèle sa vraie forme cosmique, anéantissant les esprits'
  }
};

const KRAKEN: Monster = {
  id: 'kraken',
  name: 'Kraken',
  hp: 472, maxHp: 472,
  armorClass: 18,
  abilities: createAbilities(30, 11, 25, 22, 18, 20),
  speed: 20,
  challengeRating: 23, xpReward: 50000,
  creatureType: 'monstrosity', size: 'gargantuan',
  portrait: '🐙',
  isBoss: true,
  immunities: ['lightning'],
  resistances: ['cold'],
  conditionImmunities: ['frightened', 'paralyzed'],
  description: 'Titan des profondeurs océaniques. Capable de détruire des flottes entières.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'tentacle_attack', name: 'Tentacule', cost: 1, damage: 25, damageType: 'bludgeoning', description: 'Frappe tentaculaire' },
    { id: 'ink_cloud', name: 'Nuage d\'encre', cost: 2, damage: 0, damageType: 'poison', description: 'Obscurcit la zone' },
    { id: 'fling', name: 'Projection', cost: 3, damage: 35, damageType: 'bludgeoning', description: 'Projette une créature' }
  ],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 32, damageType: 'piercing', type: 'attack', description: 'Morsure titanesque' },
    { id: 'tentacle', name: 'Tentacule', damage: 25, damageType: 'bludgeoning', type: 'attack', description: 'Frappe de tentacule' },
    { id: 'lightning_storm', name: 'Tempête de foudre', damage: 45, damageType: 'lightning', type: 'attack', description: 'Foudre des profondeurs', areaOfEffect: true, recharge: { min: 5 } }
  ],
  ultimateSkill: {
    id: 'maelstrom', name: 'Maelström', damage: 80, damageType: 'bludgeoning', type: 'special',
    description: 'Crée un tourbillon dévastateur qui engloutit tout'
  }
};

// ============================================
// CÉLESTES ET ENTITÉS DIVINES
// ============================================

const EMPYREAN: Monster = {
  id: 'empyrean',
  name: 'Empyréen',
  hp: 313, maxHp: 313,
  armorClass: 22,
  abilities: createAbilities(30, 21, 30, 21, 22, 27),
  speed: 50,
  challengeRating: 23, xpReward: 50000,
  creatureType: 'celestial', size: 'huge',
  portrait: '👼',
  isBoss: true,
  immunities: ['bludgeoning', 'piercing', 'slashing'],
  description: 'Enfant d\'un dieu, titan céleste d\'une beauté et puissance inégalées.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'attack', name: 'Attaque', cost: 1, damage: 30, damageType: 'bludgeoning', description: 'Frappe divine' },
    { id: 'spell', name: 'Sort', cost: 2, damage: 35, damageType: 'radiant', description: 'Magie divine' },
    { id: 'trembling_strike', name: 'Frappe tremblante', cost: 3, damage: 45, damageType: 'thunder', description: 'Impact sismique' }
  ],
  skills: [
    { id: 'maul', name: 'Maul', damage: 35, damageType: 'bludgeoning', type: 'attack', description: 'Arme divine titanesque', attackCount: 2 },
    { id: 'bolt', name: 'Trait de foudre', damage: 40, damageType: 'lightning', type: 'attack', description: 'Foudre céleste' }
  ],
  ultimateSkill: {
    id: 'divine_wrath', name: 'Courroux Divin', damage: 90, damageType: 'radiant', type: 'special',
    description: 'La colère d\'un enfant de dieu'
  }
};

const PLANETAR: Monster = {
  id: 'planetar',
  name: 'Planétar',
  hp: 200, maxHp: 200,
  armorClass: 19,
  abilities: createAbilities(24, 20, 24, 19, 22, 25),
  speed: 40,
  challengeRating: 16, xpReward: 15000,
  creatureType: 'celestial', size: 'large',
  portrait: '😇',
  isBoss: true,
  resistances: ['radiant'],
  immunities: ['necrotic', 'poison'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'poisoned'],
  description: 'Ange guerrier, commandant des armées célestes. Juste et impitoyable.',
  skills: [
    { id: 'greatsword', name: 'Épée à deux mains', damage: 28, damageType: 'slashing', type: 'attack', description: 'Épée divine', attackCount: 2 },
    { id: 'healing_touch', name: 'Toucher guérisseur', damage: -30, damageType: 'radiant', type: 'buff', description: 'Guérit un allié' }
  ],
  ultimateSkill: {
    id: 'angelic_strike', name: 'Frappe Angélique', damage: 55, damageType: 'radiant', type: 'special',
    description: 'Frappe avec toute la puissance des cieux'
  }
};

const DEV: Monster = {
  id: 'deva',
  name: 'Deva',
  hp: 136, maxHp: 136,
  armorClass: 17,
  abilities: createAbilities(18, 18, 18, 17, 20, 20),
  speed: 30,
  challengeRating: 10, xpReward: 5900,
  creatureType: 'celestial', size: 'medium',
  portrait: '✨',
  isBoss: false,
  resistances: ['radiant'],
  immunities: ['necrotic', 'poison'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'poisoned'],
  description: 'Ange messager, souvent envoyé sur le plan matériel pour guider les mortels.',
  skills: [
    { id: 'mace', name: 'Masse', damage: 18, damageType: 'bludgeoning', type: 'attack', description: 'Masse céleste', attackCount: 2 },
    { id: 'healing_touch', name: 'Toucher guérisseur', damage: -25, damageType: 'radiant', type: 'buff', description: 'Guérit un allié' }
  ]
};

// ============================================
// GÉANTS SUPPLÉMENTAIRES
// ============================================

const STORM_GIANT: Monster = {
  id: 'storm_giant',
  name: 'Géant des Tempêtes',
  hp: 230, maxHp: 230,
  armorClass: 16,
  abilities: createAbilities(29, 14, 20, 16, 18, 18),
  speed: 50,
  challengeRating: 13, xpReward: 10000,
  creatureType: 'giant', size: 'huge',
  portrait: '⛈️',
  isBoss: true,
  resistances: ['cold'],
  immunities: ['lightning', 'thunder'],
  description: 'Le plus noble et puissant des géants. Maître des tempêtes et des océans.',
  skills: [
    { id: 'greatsword', name: 'Épée à deux mains', damage: 35, damageType: 'slashing', type: 'attack', description: 'Épée titanesque', attackCount: 2 },
    { id: 'rock', name: 'Rocher', damage: 30, damageType: 'bludgeoning', type: 'attack', description: 'Lance un rocher' },
    { id: 'lightning_strike', name: 'Frappe de foudre', damage: 40, damageType: 'lightning', type: 'attack', description: 'Canalise la foudre' }
  ],
  ultimateSkill: {
    id: 'tempest_fury', name: 'Furie Tempétueuse', damage: 60, damageType: 'lightning', type: 'special',
    description: 'Déchaîne toute la puissance de la tempête'
  }
};

const HILL_GIANT: Monster = {
  id: 'hill_giant',
  name: 'Géant des Collines',
  hp: 105, maxHp: 105,
  armorClass: 13,
  abilities: createAbilities(21, 8, 19, 5, 9, 6),
  speed: 40,
  challengeRating: 5, xpReward: 1800,
  creatureType: 'giant', size: 'huge',
  portrait: '🏔️',
  isBoss: false,
  description: 'Le plus stupide et gourmand des géants. Brutal et affamé.',
  skills: [
    { id: 'greatclub', name: 'Gourdin géant', damage: 22, damageType: 'bludgeoning', type: 'attack', description: 'Frappe brutale', attackCount: 2 },
    { id: 'rock', name: 'Rocher', damage: 18, damageType: 'bludgeoning', type: 'attack', description: 'Lance un rocher' }
  ]
};

// ============================================
// HUMANOÏDES HOSTILES
// ============================================

const DROW_MATRON: Monster = {
  id: 'drow_matron',
  name: 'Matriarche Drow',
  hp: 180, maxHp: 180,
  armorClass: 18,
  abilities: createAbilities(14, 18, 16, 18, 20, 20),
  speed: 30,
  challengeRating: 15, xpReward: 13000,
  creatureType: 'humanoid', size: 'medium',
  portrait: '🕷️',
  isBoss: true,
  isHostileNpc: true,
  resistances: ['poison'],
  immunities: [],
  description: 'Haute prêtresse de Lolth, dirigeant une maison noble drow. Impitoyable et rusée.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'summon_demon', name: 'Invocation démoniaque', cost: 2, damage: 25, damageType: 'necrotic', description: 'Invoque un démon' },
    { id: 'divine_spell', name: 'Sort divin', cost: 1, damage: 18, damageType: 'necrotic', description: 'Sort de Lolth' }
  ],
  skills: [
    { id: 'rod', name: 'Bâton de serpents', damage: 18, damageType: 'piercing', type: 'attack', description: 'Bâton vivant', attackCount: 2 },
    { id: 'flame_strike', name: 'Colonne de feu', damage: 28, damageType: 'fire', type: 'attack', description: 'Flammes divines' },
    { id: 'insect_plague', name: 'Fléau d\'insectes', damage: 22, damageType: 'piercing', type: 'attack', description: 'Nuée d\'araignées', areaOfEffect: true }
  ],
  ultimateSkill: {
    id: 'lolth_blessing', name: 'Bénédiction de Lolth', damage: 50, damageType: 'necrotic', type: 'special',
    description: 'Canalise le pouvoir de la Reine Araignée'
  }
};

const GITHYANKI_SUPREME_COMMANDER: Monster = {
  id: 'githyanki_supreme_commander',
  name: 'Commandant Suprême Githyanki',
  hp: 187, maxHp: 187,
  armorClass: 18,
  abilities: createAbilities(19, 17, 18, 16, 16, 18),
  speed: 30,
  challengeRating: 14, xpReward: 11500,
  creatureType: 'humanoid', size: 'medium',
  portrait: '⚔️',
  isBoss: true,
  isHostileNpc: true,
  description: 'Chef de guerre githyanki, servant la reine-liche Vlaakith. Maître de l\'épée argentée.',
  skills: [
    { id: 'silver_sword', name: 'Épée d\'argent', damage: 28, damageType: 'slashing', type: 'attack', description: 'Épée capable de couper les liens astraux', attackCount: 3 },
    { id: 'misty_step', name: 'Pas brumeux', damage: 0, damageType: 'force', type: 'special', description: 'Téléportation courte' }
  ],
  ultimateSkill: {
    id: 'astral_strike', name: 'Frappe Astrale', damage: 55, damageType: 'psychic', type: 'special',
    description: 'Attaque transcendant les plans'
  }
};

const ARCHMAGE: Monster = {
  id: 'archmage',
  name: 'Archimage',
  hp: 99, maxHp: 99,
  armorClass: 12,
  abilities: createAbilities(10, 14, 12, 20, 15, 16),
  speed: 30,
  challengeRating: 12, xpReward: 8400,
  creatureType: 'humanoid', size: 'medium',
  portrait: '🧙',
  isBoss: true,
  isHostileNpc: true,
  resistances: [],
  immunities: [],
  description: 'Maître des arcanes, capable de lancer les sorts les plus dévastateurs.',
  skills: [
    { id: 'dagger', name: 'Dague', damage: 8, damageType: 'piercing', type: 'attack', description: 'Dague enchantée' },
    { id: 'fire_bolt', name: 'Trait de feu', damage: 18, damageType: 'fire', type: 'attack', description: 'Rayon de feu' },
    { id: 'cone_of_cold', name: 'Cône de froid', damage: 36, damageType: 'cold', type: 'attack', description: 'Vague de froid', areaOfEffect: true, savingThrow: { ability: 'constitution', dc: 17 } },
    { id: 'lightning_bolt', name: 'Éclair', damage: 32, damageType: 'lightning', type: 'attack', description: 'Ligne de foudre', savingThrow: { ability: 'dexterity', dc: 17 } }
  ],
  ultimateSkill: {
    id: 'time_stop', name: 'Arrêt du Temps', damage: 60, damageType: 'force', type: 'special',
    description: 'Arrête le temps pour frapper sans riposte'
  }
};

// ============================================
// MONSTRUOSITÉS ICONIQUES
// ============================================

const HYDRA: Monster = {
  id: 'hydra',
  name: 'Hydre',
  hp: 172, maxHp: 172,
  armorClass: 15,
  abilities: createAbilities(20, 12, 20, 2, 10, 7),
  speed: 30,
  challengeRating: 8, xpReward: 3900,
  creatureType: 'monstrosity', size: 'huge',
  portrait: '🐲',
  isBoss: false,
  description: 'Bête à multiples têtes qui repoussent quand on les coupe. Terreur des marais.',
  skills: [
    { id: 'bite', name: 'Morsures', damage: 18, damageType: 'piercing', type: 'attack', description: '5 morsures (une par tête)', attackCount: 5 }
  ]
};

const PURPLE_WORM: Monster = {
  id: 'purple_worm',
  name: 'Ver Pourpre',
  hp: 247, maxHp: 247,
  armorClass: 18,
  abilities: createAbilities(28, 7, 22, 1, 8, 4),
  speed: 50,
  challengeRating: 15, xpReward: 13000,
  creatureType: 'monstrosity', size: 'gargantuan',
  portrait: '🪱',
  isBoss: true,
  description: 'Ver géant des profondeurs. Capable d\'avaler des créatures entières.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 35, damageType: 'piercing', type: 'attack', description: 'Morsure dévorante' },
    { id: 'tail_stinger', name: 'Dard de queue', damage: 28, damageType: 'piercing', type: 'attack', description: 'Dard venimeux', effect: { type: 'poison', value: 15, turns: 3 } }
  ],
  ultimateSkill: {
    id: 'swallow', name: 'Engloutir', damage: 50, damageType: 'acid', type: 'special',
    description: 'Tente d\'avaler sa proie'
  }
};

const ROC: Monster = {
  id: 'roc',
  name: 'Roc',
  hp: 248, maxHp: 248,
  armorClass: 15,
  abilities: createAbilities(28, 10, 20, 3, 10, 9),
  speed: 20,
  challengeRating: 11, xpReward: 7200,
  creatureType: 'monstrosity', size: 'gargantuan',
  portrait: '🦅',
  isBoss: true,
  description: 'Oiseau légendaire géant. Capable d\'emporter des éléphants dans ses serres.',
  skills: [
    { id: 'beak', name: 'Bec', damage: 32, damageType: 'piercing', type: 'attack', description: 'Bec titanesque' },
    { id: 'talons', name: 'Serres', damage: 28, damageType: 'slashing', type: 'attack', description: 'Serres agrippantes' }
  ],
  ultimateSkill: {
    id: 'dive_attack', name: 'Attaque en Piqué', damage: 55, damageType: 'bludgeoning', type: 'special',
    description: 'Plonge du ciel à grande vitesse'
  }
};

const BEHIR: Monster = {
  id: 'behir',
  name: 'Béhir',
  hp: 168, maxHp: 168,
  armorClass: 17,
  abilities: createAbilities(23, 16, 18, 7, 14, 12),
  speed: 50,
  challengeRating: 11, xpReward: 7200,
  creatureType: 'monstrosity', size: 'huge',
  portrait: '⚡',
  isBoss: false,
  immunities: ['lightning'],
  description: 'Serpent géant à plusieurs pattes. Ennemi ancestral des dragons.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 28, damageType: 'piercing', type: 'attack', description: 'Morsure avec constriction' },
    { id: 'lightning_breath', name: 'Souffle de foudre', damage: 42, damageType: 'lightning', type: 'attack', description: 'Ligne de foudre 20 pieds', recharge: { min: 5 }, savingThrow: { ability: 'dexterity', dc: 16 } }
  ]
};

const BULETTE: Monster = {
  id: 'bulette',
  name: 'Bulette',
  hp: 94, maxHp: 94,
  armorClass: 17,
  abilities: createAbilities(19, 11, 21, 2, 10, 5),
  speed: 40,
  challengeRating: 5, xpReward: 1800,
  creatureType: 'monstrosity', size: 'large',
  portrait: '🦈',
  isBoss: false,
  description: 'Requin terrestre. Surgit du sol pour dévorer ses proies.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 22, damageType: 'piercing', type: 'attack', description: 'Morsure puissante' },
    { id: 'deadly_leap', name: 'Bond mortel', damage: 25, damageType: 'bludgeoning', type: 'attack', description: 'Saute sur sa proie', areaOfEffect: true }
  ]
};

const GORGON: Monster = {
  id: 'gorgon',
  name: 'Gorgone',
  hp: 114, maxHp: 114,
  armorClass: 19,
  abilities: createAbilities(20, 11, 18, 2, 12, 7),
  speed: 40,
  challengeRating: 5, xpReward: 1800,
  creatureType: 'monstrosity', size: 'large',
  portrait: '🐂',
  isBoss: false,
  conditionImmunities: ['petrified'],
  description: 'Taureau de fer au souffle pétrifiant. Pas à confondre avec la Méduse.',
  skills: [
    { id: 'gore', name: 'Encornage', damage: 20, damageType: 'piercing', type: 'attack', description: 'Charge aux cornes' },
    { id: 'petrifying_breath', name: 'Souffle pétrifiant', damage: 0, damageType: 'poison', type: 'debuff', description: 'Pétrifie les victimes', areaOfEffect: true, recharge: { min: 5 }, savingThrow: { ability: 'constitution', dc: 13 } }
  ]
};

// ============================================
// CRÉATURES ÉLÉMENTAIRES PUISSANTES
// ============================================

const PHOENIX: Monster = {
  id: 'phoenix',
  name: 'Phénix',
  hp: 175, maxHp: 175,
  armorClass: 18,
  abilities: createAbilities(19, 26, 21, 2, 21, 18),
  speed: 120,
  challengeRating: 16, xpReward: 15000,
  creatureType: 'elemental', size: 'gargantuan',
  portrait: '🔥',
  isBoss: true,
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  immunities: ['fire', 'poison'],
  conditionImmunities: ['exhaustion', 'grappled', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained', 'stunned'],
  description: 'Oiseau de feu immortel. Renaît de ses cendres après chaque mort.',
  skills: [
    { id: 'beak', name: 'Bec', damage: 28, damageType: 'fire', type: 'attack', description: 'Bec enflammé' },
    { id: 'fiery_talons', name: 'Serres ardentes', damage: 25, damageType: 'fire', type: 'attack', description: 'Serres de flammes' }
  ],
  ultimateSkill: {
    id: 'inferno_rebirth', name: 'Renaissance Infernale', damage: 65, damageType: 'fire', type: 'special',
    description: 'Explose en flammes et renaît de ses cendres'
  }
};

const ZARATAN: Monster = {
  id: 'zaratan',
  name: 'Zaratan',
  hp: 307, maxHp: 307,
  armorClass: 21,
  abilities: createAbilities(30, 10, 30, 2, 21, 18),
  speed: 40,
  challengeRating: 22, xpReward: 41000,
  creatureType: 'elemental', size: 'gargantuan',
  portrait: '🐢',
  isBoss: true,
  resistances: ['cold', 'fire', 'lightning'],
  immunities: ['poison'],
  conditionImmunities: ['exhaustion', 'paralyzed', 'petrified', 'poisoned', 'stunned'],
  description: 'Tortue titanesque élémentaire. Une île vivante qui erre à travers les plans.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'stomp', name: 'Piétinement', cost: 1, damage: 28, damageType: 'bludgeoning', description: 'Écrase tout' },
    { id: 'quake', name: 'Séisme', cost: 2, damage: 35, damageType: 'bludgeoning', description: 'Fait trembler le sol' }
  ],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 38, damageType: 'piercing', type: 'attack', description: 'Morsure titanesque' },
    { id: 'stomp', name: 'Piétinement', damage: 28, damageType: 'bludgeoning', type: 'attack', description: 'Écrase les ennemis' }
  ],
  ultimateSkill: {
    id: 'earth_splitting', name: 'Fracture Terrestre', damage: 75, damageType: 'bludgeoning', type: 'special',
    description: 'Fait se fissurer la terre elle-même'
  }
};

const ELDER_TEMPEST: Monster = {
  id: 'elder_tempest',
  name: 'Tempête Ancestrale',
  hp: 264, maxHp: 264,
  armorClass: 19,
  abilities: createAbilities(23, 28, 23, 2, 21, 18),
  speed: 120,
  challengeRating: 23, xpReward: 50000,
  creatureType: 'elemental', size: 'gargantuan',
  portrait: '🌪️',
  isBoss: true,
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  immunities: ['lightning', 'poison', 'thunder'],
  conditionImmunities: ['exhaustion', 'grappled', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained', 'stunned'],
  description: 'Manifestation vivante d\'une tempête primordiale. Destruction incarnée.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'lightning', name: 'Éclair', cost: 1, damage: 30, damageType: 'lightning', description: 'Frappe de foudre' },
    { id: 'screaming_wind', name: 'Vent hurlant', cost: 2, damage: 25, damageType: 'thunder', description: 'Bourrasque dévastatrice' }
  ],
  skills: [
    { id: 'thunderous_slam', name: 'Frappe tonitruante', damage: 35, damageType: 'thunder', type: 'attack', description: 'Impact de tonnerre' },
    { id: 'lightning_storm', name: 'Tempête de foudre', damage: 45, damageType: 'lightning', type: 'attack', description: 'Pluie d\'éclairs', areaOfEffect: true }
  ],
  ultimateSkill: {
    id: 'primal_storm', name: 'Tempête Primordiale', damage: 85, damageType: 'lightning', type: 'special',
    description: 'Déchaîne toute la fureur élémentaire'
  }
};

// ============================================
// MORTS-VIVANTS CLASSIQUES SUPPLÉMENTAIRES
// ============================================

const MUMMY: Monster = {
  id: 'mummy',
  name: 'Momie',
  hp: 58, maxHp: 58,
  armorClass: 11,
  abilities: createAbilities(16, 8, 15, 6, 10, 12),
  speed: 20,
  challengeRating: 3, xpReward: 700,
  creatureType: 'undead', size: 'medium',
  portrait: '🧟',
  isBoss: false,
  vulnerabilities: ['fire'],
  immunities: ['necrotic', 'poison'],
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'paralyzed', 'poisoned'],
  description: 'Ancien gardien momifié protégeant son tombeau pour l\'éternité.',
  skills: [
    { id: 'rotting_fist', name: 'Poing putréfiant', damage: 14, damageType: 'bludgeoning', type: 'attack', description: 'Frappe maudite', attackCount: 2 },
    { id: 'dreadful_glare', name: 'Regard effroyable', damage: 0, damageType: 'necrotic', type: 'debuff', description: 'Paralyse de terreur', savingThrow: { ability: 'wisdom', dc: 11 } }
  ]
};

const MUMMY_LORD: Monster = {
  id: 'mummy_lord',
  name: 'Seigneur Momie',
  hp: 97, maxHp: 97,
  armorClass: 17,
  abilities: createAbilities(18, 10, 17, 11, 18, 16),
  speed: 20,
  challengeRating: 15, xpReward: 13000,
  creatureType: 'undead', size: 'medium',
  portrait: '👑',
  isBoss: true,
  vulnerabilities: ['fire'],
  immunities: ['necrotic', 'poison'],
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'paralyzed', 'poisoned'],
  description: 'Pharaon mort-vivant aux pouvoirs divins. Roi éternel de son tombeau.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'attack', name: 'Attaque', cost: 1, damage: 18, damageType: 'bludgeoning', description: 'Frappe rapide' },
    { id: 'blinding_dust', name: 'Poussière aveuglante', cost: 1, damage: 0, damageType: 'necrotic', description: 'Nuage de poussière' },
    { id: 'blasphemous_word', name: 'Parole blasphématoire', cost: 2, damage: 25, damageType: 'necrotic', description: 'Malédiction divine' }
  ],
  skills: [
    { id: 'rotting_fist', name: 'Poing putréfiant', damage: 18, damageType: 'bludgeoning', type: 'attack', description: 'Frappe maudite', attackCount: 2 },
    { id: 'harm', name: 'Blessure', damage: 30, damageType: 'necrotic', type: 'attack', description: 'Sort nécrotique', savingThrow: { ability: 'constitution', dc: 16 } }
  ],
  ultimateSkill: {
    id: 'whirlwind_of_sand', name: 'Tourbillon de Sable', damage: 45, damageType: 'bludgeoning', type: 'special',
    description: 'Invoque une tempête de sable dévastatrice'
  }
};

const REVENANT: Monster = {
  id: 'revenant',
  name: 'Revenant',
  hp: 136, maxHp: 136,
  armorClass: 13,
  abilities: createAbilities(18, 14, 18, 13, 16, 18),
  speed: 30,
  challengeRating: 5, xpReward: 1800,
  creatureType: 'undead', size: 'medium',
  portrait: '😠',
  isBoss: false,
  resistances: ['necrotic', 'psychic'],
  immunities: ['poison'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'paralyzed', 'poisoned', 'stunned'],
  description: 'Esprit vengeur revenu d\'entre les morts pour accomplir sa vengeance.',
  skills: [
    { id: 'fist', name: 'Poing', damage: 16, damageType: 'bludgeoning', type: 'attack', description: 'Frappe vengeresse', attackCount: 2 },
    { id: 'vengeful_glare', name: 'Regard vengeur', damage: 0, damageType: 'psychic', type: 'debuff', description: 'Marque sa proie' }
  ]
};

const ALLIP: Monster = {
  id: 'allip',
  name: 'Allip',
  hp: 40, maxHp: 40,
  armorClass: 13,
  abilities: createAbilities(6, 17, 10, 17, 15, 16),
  speed: 0,
  challengeRating: 5, xpReward: 1800,
  creatureType: 'undead', size: 'medium',
  portrait: '👻',
  isBoss: false,
  resistances: ['acid', 'fire', 'lightning', 'thunder', 'bludgeoning', 'piercing', 'slashing'],
  immunities: ['cold', 'necrotic', 'poison'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'grappled', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained'],
  description: 'Esprit d\'un érudit devenu fou, condamné à murmurer des secrets indicibles.',
  skills: [
    { id: 'maddening_touch', name: 'Toucher de folie', damage: 18, damageType: 'psychic', type: 'attack', description: 'Contact psychique' },
    { id: 'whispers_of_madness', name: 'Murmures de folie', damage: 22, damageType: 'psychic', type: 'attack', description: 'Folie contagieuse', areaOfEffect: true, savingThrow: { ability: 'wisdom', dc: 14 } }
  ]
};

const SWORD_WRAITH_COMMANDER: Monster = {
  id: 'sword_wraith_commander',
  name: 'Commandant Spectre d\'Épée',
  hp: 127, maxHp: 127,
  armorClass: 18,
  abilities: createAbilities(18, 14, 18, 11, 12, 14),
  speed: 30,
  challengeRating: 8, xpReward: 3900,
  creatureType: 'undead', size: 'medium',
  portrait: '⚔️',
  isBoss: false,
  resistances: ['necrotic'],
  immunities: ['poison'],
  conditionImmunities: ['exhaustion', 'frightened', 'poisoned', 'unconscious'],
  description: 'Guerrier mort au combat, revenu pour mener son armée spectrale.',
  skills: [
    { id: 'longsword', name: 'Épée longue', damage: 18, damageType: 'slashing', type: 'attack', description: 'Frappe martiale', attackCount: 2 },
    { id: 'call_to_arms', name: 'Appel aux armes', damage: 0, damageType: 'necrotic', type: 'buff', description: 'Renforce les alliés morts-vivants' }
  ]
};

const DEATHLOCK: Monster = {
  id: 'deathlock',
  name: 'Morteverrou',
  hp: 36, maxHp: 36,
  armorClass: 12,
  abilities: createAbilities(11, 15, 10, 14, 12, 16),
  speed: 30,
  challengeRating: 4, xpReward: 1100,
  creatureType: 'undead', size: 'medium',
  portrait: '🧙',
  isBoss: false,
  resistances: ['necrotic'],
  immunities: ['poison'],
  conditionImmunities: ['exhaustion', 'poisoned'],
  description: 'Sorcier mort-vivant lié à son patron d\'outre-tombe.',
  skills: [
    { id: 'deathly_claw', name: 'Griffe mortelle', damage: 12, damageType: 'necrotic', type: 'attack', description: 'Frappe nécrotique' },
    { id: 'eldritch_blast', name: 'Décharge occulte', damage: 16, damageType: 'force', type: 'attack', description: 'Rayon d\'énergie occulte' }
  ]
};

const SPAWN_OF_KYUSS: Monster = {
  id: 'spawn_of_kyuss',
  name: 'Rejeton de Kyuss',
  hp: 76, maxHp: 76,
  armorClass: 10,
  abilities: createAbilities(16, 11, 18, 5, 7, 3),
  speed: 30,
  challengeRating: 5, xpReward: 1800,
  creatureType: 'undead', size: 'medium',
  portrait: '🪱',
  isBoss: false,
  immunities: ['poison'],
  conditionImmunities: ['exhaustion', 'poisoned'],
  description: 'Mort-vivant infecté par les vers de Kyuss, le Dieu Ver.',
  skills: [
    { id: 'claw', name: 'Griffe', damage: 14, damageType: 'slashing', type: 'attack', description: 'Griffes putrides', attackCount: 2 },
    { id: 'burrowing_worm', name: 'Ver fouisseur', damage: 18, damageType: 'necrotic', type: 'attack', description: 'Projette un ver parasite' }
  ]
};

// ============================================
// HUMANOÏDES SUPPLÉMENTAIRES
// ============================================

const ASSASSIN: Monster = {
  id: 'assassin',
  name: 'Assassin',
  hp: 78, maxHp: 78,
  armorClass: 15,
  abilities: createAbilities(11, 16, 14, 13, 11, 10),
  speed: 30,
  challengeRating: 8, xpReward: 3900,
  creatureType: 'humanoid', size: 'medium',
  portrait: '🗡️',
  isBoss: false,
  resistances: ['poison'],
  description: 'Tueur professionnel expert en élimination silencieuse.',
  skills: [
    { id: 'shortsword', name: 'Épée courte', damage: 15, damageType: 'piercing', type: 'attack', description: 'Frappe précise', attackCount: 2 },
    { id: 'light_crossbow', name: 'Arbalète légère', damage: 12, damageType: 'piercing', type: 'attack', description: 'Tir empoisonné' },
    { id: 'sneak_attack', name: 'Attaque sournoise', damage: 28, damageType: 'piercing', type: 'attack', description: 'Frappe fatale' }
  ]
};

const GLADIATOR: Monster = {
  id: 'gladiator',
  name: 'Gladiateur',
  hp: 112, maxHp: 112,
  armorClass: 16,
  abilities: createAbilities(18, 15, 16, 10, 12, 15),
  speed: 30,
  challengeRating: 5, xpReward: 1800,
  creatureType: 'humanoid', size: 'medium',
  portrait: '🏟️',
  isBoss: false,
  description: 'Champion de l\'arène, maître du combat spectaculaire.',
  skills: [
    { id: 'spear', name: 'Lance', damage: 16, damageType: 'piercing', type: 'attack', description: 'Coup de lance', attackCount: 3 },
    { id: 'shield_bash', name: 'Coup de bouclier', damage: 10, damageType: 'bludgeoning', type: 'attack', description: 'Frappe au bouclier' }
  ]
};

const VETERAN: Monster = {
  id: 'veteran',
  name: 'Vétéran',
  hp: 58, maxHp: 58,
  armorClass: 17,
  abilities: createAbilities(16, 13, 14, 10, 11, 10),
  speed: 30,
  challengeRating: 3, xpReward: 700,
  creatureType: 'humanoid', size: 'medium',
  portrait: '🛡️',
  isBoss: false,
  description: 'Soldat expérimenté ayant survécu à d\'innombrables batailles.',
  skills: [
    { id: 'longsword', name: 'Épée longue', damage: 12, damageType: 'slashing', type: 'attack', description: 'Frappe experte', attackCount: 2 },
    { id: 'heavy_crossbow', name: 'Arbalète lourde', damage: 10, damageType: 'piercing', type: 'attack', description: 'Tir précis' }
  ]
};

const BANDIT_CAPTAIN: Monster = {
  id: 'bandit_captain',
  name: 'Capitaine Bandit',
  hp: 65, maxHp: 65,
  armorClass: 15,
  abilities: createAbilities(15, 16, 14, 14, 11, 14),
  speed: 30,
  challengeRating: 2, xpReward: 450,
  creatureType: 'humanoid', size: 'medium',
  portrait: '🏴‍☠️',
  isBoss: false,
  description: 'Chef de bande impitoyable et rusé.',
  skills: [
    { id: 'scimitar', name: 'Cimeterre', damage: 10, damageType: 'slashing', type: 'attack', description: 'Frappe rapide', attackCount: 3 },
    { id: 'dagger', name: 'Dague', damage: 6, damageType: 'piercing', type: 'attack', description: 'Lancer de dague' }
  ]
};

const CULT_FANATIC: Monster = {
  id: 'cult_fanatic',
  name: 'Fanatique de Culte',
  hp: 33, maxHp: 33,
  armorClass: 13,
  abilities: createAbilities(11, 14, 12, 10, 13, 14),
  speed: 30,
  challengeRating: 2, xpReward: 450,
  creatureType: 'humanoid', size: 'medium',
  portrait: '🕯️',
  isBoss: false,
  description: 'Adorateur dévot d\'une puissance maléfique.',
  skills: [
    { id: 'dagger', name: 'Dague', damage: 8, damageType: 'piercing', type: 'attack', description: 'Dague rituelle', attackCount: 2 },
    { id: 'sacred_flame', name: 'Flamme sacrée', damage: 10, damageType: 'radiant', type: 'attack', description: 'Feu divin corrompu' },
    { id: 'hold_person', name: 'Immobilisation', damage: 0, damageType: 'psychic', type: 'debuff', description: 'Paralyse la cible' }
  ]
};

const PRIEST: Monster = {
  id: 'priest',
  name: 'Prêtre',
  hp: 27, maxHp: 27,
  armorClass: 13,
  abilities: createAbilities(10, 10, 12, 13, 16, 13),
  speed: 30,
  challengeRating: 2, xpReward: 450,
  creatureType: 'humanoid', size: 'medium',
  portrait: '⛪',
  isBoss: false,
  description: 'Serviteur d\'une divinité, capable de miracles.',
  skills: [
    { id: 'mace', name: 'Masse', damage: 6, damageType: 'bludgeoning', type: 'attack', description: 'Masse sacrée' },
    { id: 'guiding_bolt', name: 'Trait directeur', damage: 14, damageType: 'radiant', type: 'attack', description: 'Lumière divine' },
    { id: 'cure_wounds', name: 'Soins', damage: -15, damageType: 'radiant', type: 'buff', description: 'Guérison divine' }
  ]
};

const MAGE: Monster = {
  id: 'mage',
  name: 'Mage',
  hp: 40, maxHp: 40,
  armorClass: 12,
  abilities: createAbilities(9, 14, 11, 17, 12, 11),
  speed: 30,
  challengeRating: 6, xpReward: 2300,
  creatureType: 'humanoid', size: 'medium',
  portrait: '🔮',
  isBoss: false,
  description: 'Lanceur de sorts accompli maîtrisant les arcanes.',
  skills: [
    { id: 'dagger', name: 'Dague', damage: 6, damageType: 'piercing', type: 'attack', description: 'Dague enchantée' },
    { id: 'fireball', name: 'Boule de feu', damage: 28, damageType: 'fire', type: 'attack', description: 'Explosion de feu', areaOfEffect: true, savingThrow: { ability: 'dexterity', dc: 14 } },
    { id: 'ice_storm', name: 'Tempête de grêle', damage: 18, damageType: 'cold', type: 'attack', description: 'Pluie de grêlons', areaOfEffect: true }
  ]
};

const WAR_PRIEST: Monster = {
  id: 'war_priest',
  name: 'Prêtre de Guerre',
  hp: 117, maxHp: 117,
  armorClass: 18,
  abilities: createAbilities(16, 10, 14, 11, 17, 13),
  speed: 30,
  challengeRating: 9, xpReward: 5000,
  creatureType: 'humanoid', size: 'medium',
  portrait: '⚔️',
  isBoss: false,
  description: 'Champion divin mêlant foi et martial.',
  skills: [
    { id: 'maul', name: 'Maul', damage: 18, damageType: 'bludgeoning', type: 'attack', description: 'Marteau sacré', attackCount: 2 },
    { id: 'flame_strike', name: 'Colonne de flammes', damage: 28, damageType: 'fire', type: 'attack', description: 'Feu divin', areaOfEffect: true },
    { id: 'heal', name: 'Guérison', damage: -30, damageType: 'radiant', type: 'buff', description: 'Guérison divine majeure' }
  ]
};

const BLACKGUARD: Monster = {
  id: 'blackguard',
  name: 'Garde Noir',
  hp: 153, maxHp: 153,
  armorClass: 18,
  abilities: createAbilities(18, 11, 18, 11, 14, 15),
  speed: 30,
  challengeRating: 8, xpReward: 3900,
  creatureType: 'humanoid', size: 'medium',
  portrait: '🖤',
  isBoss: false,
  description: 'Paladin déchu au service des ténèbres.',
  skills: [
    { id: 'glaive', name: 'Glaive', damage: 18, damageType: 'slashing', type: 'attack', description: 'Arme d\'hast maudite', attackCount: 3 },
    { id: 'dreadful_aspect', name: 'Aspect terrifiant', damage: 0, damageType: 'necrotic', type: 'debuff', description: 'Aura de terreur', areaOfEffect: true }
  ]
};

const CHAMPION: Monster = {
  id: 'champion',
  name: 'Champion',
  hp: 143, maxHp: 143,
  armorClass: 18,
  abilities: createAbilities(20, 15, 14, 10, 14, 12),
  speed: 30,
  challengeRating: 9, xpReward: 5000,
  creatureType: 'humanoid', size: 'medium',
  portrait: '🏆',
  isBoss: false,
  description: 'Guerrier d\'élite aux compétences martiales légendaires.',
  skills: [
    { id: 'greatsword', name: 'Épée à deux mains', damage: 20, damageType: 'slashing', type: 'attack', description: 'Frappe dévastatrice', attackCount: 3 },
    { id: 'light_crossbow', name: 'Arbalète légère', damage: 12, damageType: 'piercing', type: 'attack', description: 'Tir de précision' }
  ]
};

const WARLORD: Monster = {
  id: 'warlord',
  name: 'Seigneur de Guerre',
  hp: 229, maxHp: 229,
  armorClass: 18,
  abilities: createAbilities(20, 16, 18, 12, 12, 18),
  speed: 30,
  challengeRating: 12, xpReward: 8400,
  creatureType: 'humanoid', size: 'medium',
  portrait: '⚔️',
  isBoss: true,
  description: 'Commandant militaire légendaire inspirant la terreur.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'weapon_attack', name: 'Attaque', cost: 1, damage: 18, damageType: 'slashing', description: 'Frappe rapide' },
    { id: 'command_ally', name: 'Commandement', cost: 2, damage: 0, damageType: 'force', description: 'Ordonne à un allié d\'attaquer' },
    { id: 'frightening_charge', name: 'Charge terrifiante', cost: 3, damage: 25, damageType: 'slashing', description: 'Charge intimidante' }
  ],
  skills: [
    { id: 'greatsword', name: 'Épée à deux mains', damage: 20, damageType: 'slashing', type: 'attack', description: 'Frappe de maître', attackCount: 3 },
    { id: 'inspiring_cry', name: 'Cri inspirant', damage: 0, damageType: 'force', type: 'buff', description: 'Motive les alliés' }
  ],
  ultimateSkill: {
    id: 'battle_cry', name: 'Cri de Bataille', damage: 35, damageType: 'thunder', type: 'special',
    description: 'Hurlement qui galvanise ses troupes et terrifie ses ennemis'
  }
};

// ============================================
// MONSTRUOSITÉS SUPPLÉMENTAIRES
// ============================================

const DISPLACER_BEAST: Monster = {
  id: 'displacer_beast',
  name: 'Bête Éclipsante',
  hp: 85, maxHp: 85,
  armorClass: 13,
  abilities: createAbilities(18, 15, 16, 6, 12, 8),
  speed: 40,
  challengeRating: 3, xpReward: 700,
  creatureType: 'monstrosity', size: 'large',
  portrait: '🐆',
  isBoss: false,
  description: 'Félin à six pattes projetant une illusion pour tromper ses proies.',
  skills: [
    { id: 'tentacle', name: 'Tentacule', damage: 12, damageType: 'bludgeoning', type: 'attack', description: 'Frappe tentaculaire', attackCount: 2 }
  ]
};

const HOOK_HORROR: Monster = {
  id: 'hook_horror',
  name: 'Horreur Crochue',
  hp: 75, maxHp: 75,
  armorClass: 15,
  abilities: createAbilities(18, 10, 15, 6, 12, 7),
  speed: 30,
  challengeRating: 3, xpReward: 700,
  creatureType: 'monstrosity', size: 'large',
  portrait: '🦂',
  isBoss: false,
  description: 'Créature souterraine aux bras terminés par des crochets mortels.',
  skills: [
    { id: 'hook', name: 'Crochet', damage: 14, damageType: 'piercing', type: 'attack', description: 'Frappe crochue', attackCount: 2 }
  ]
};

const GRICK: Monster = {
  id: 'grick',
  name: 'Grick',
  hp: 27, maxHp: 27,
  armorClass: 14,
  abilities: createAbilities(14, 14, 11, 3, 14, 5),
  speed: 30,
  challengeRating: 2, xpReward: 450,
  creatureType: 'monstrosity', size: 'medium',
  portrait: '🦑',
  isBoss: false,
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  description: 'Ver serpentin aux tentacules acérés vivant dans les cavernes.',
  skills: [
    { id: 'tentacles', name: 'Tentacules', damage: 10, damageType: 'slashing', type: 'attack', description: 'Fouet tentaculaire' },
    { id: 'beak', name: 'Bec', damage: 8, damageType: 'piercing', type: 'attack', description: 'Morsure' }
  ]
};

const GRICK_ALPHA: Monster = {
  id: 'grick_alpha',
  name: 'Grick Alpha',
  hp: 75, maxHp: 75,
  armorClass: 18,
  abilities: createAbilities(18, 16, 15, 4, 14, 9),
  speed: 30,
  challengeRating: 7, xpReward: 2900,
  creatureType: 'monstrosity', size: 'large',
  portrait: '🦑',
  isBoss: false,
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  description: 'Grick géant, chef de meute redoutable.',
  skills: [
    { id: 'tail', name: 'Queue', damage: 14, damageType: 'bludgeoning', type: 'attack', description: 'Frappe de queue' },
    { id: 'tentacles', name: 'Tentacules', damage: 18, damageType: 'slashing', type: 'attack', description: 'Fouet tentaculaire', attackCount: 2 }
  ]
};

const PERYTON: Monster = {
  id: 'peryton',
  name: 'Péryton',
  hp: 33, maxHp: 33,
  armorClass: 13,
  abilities: createAbilities(16, 12, 13, 9, 12, 10),
  speed: 20,
  challengeRating: 2, xpReward: 450,
  creatureType: 'monstrosity', size: 'medium',
  portrait: '🦌',
  isBoss: false,
  description: 'Créature ailée à corps de cerf et tête d\'aigle, dévoreuse de cœurs.',
  skills: [
    { id: 'gore', name: 'Coup de bois', damage: 10, damageType: 'piercing', type: 'attack', description: 'Attaque aux bois' },
    { id: 'talons', name: 'Serres', damage: 8, damageType: 'piercing', type: 'attack', description: 'Griffes acérées' }
  ]
};

const WINTER_WOLF: Monster = {
  id: 'winter_wolf',
  name: 'Loup Arctique',
  hp: 75, maxHp: 75,
  armorClass: 13,
  abilities: createAbilities(18, 13, 14, 7, 12, 8),
  speed: 50,
  challengeRating: 3, xpReward: 700,
  creatureType: 'monstrosity', size: 'large',
  portrait: '🐺',
  isBoss: false,
  immunities: ['cold'],
  description: 'Loup géant des terres gelées au souffle de givre.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 14, damageType: 'piercing', type: 'attack', description: 'Morsure glacée' },
    { id: 'cold_breath', name: 'Souffle de froid', damage: 18, damageType: 'cold', type: 'attack', description: 'Cône glacial 15 pieds', recharge: { min: 5 }, savingThrow: { ability: 'dexterity', dc: 12 } }
  ]
};

const WORG: Monster = {
  id: 'worg',
  name: 'Worg',
  hp: 26, maxHp: 26,
  armorClass: 13,
  abilities: createAbilities(16, 13, 13, 7, 11, 8),
  speed: 50,
  challengeRating: 0.5, xpReward: 100,
  creatureType: 'monstrosity', size: 'large',
  portrait: '🐕',
  isBoss: false,
  description: 'Loup maléfique intelligent, souvent monture des gobelins.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 10, damageType: 'piercing', type: 'attack', description: 'Morsure puissante' }
  ]
};

const DEATH_TYRANT: Monster = {
  id: 'death_tyrant',
  name: 'Tyran de la Mort',
  hp: 187, maxHp: 187,
  armorClass: 19,
  abilities: createAbilities(10, 14, 14, 19, 15, 19),
  speed: 0,
  challengeRating: 14, xpReward: 11500,
  creatureType: 'undead', size: 'large',
  portrait: '👁️',
  isBoss: true,
  conditionImmunities: ['charmed', 'exhaustion', 'paralyzed', 'petrified', 'poisoned', 'prone'],
  immunities: ['poison'],
  description: 'Tyrannœil mort-vivant, aussi dangereux que de son vivant.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'eye_ray', name: 'Rayon oculaire', cost: 1, damage: 25, damageType: 'necrotic', description: 'Tire un rayon' }
  ],
  skills: [
    { id: 'bite', name: 'Morsure', damage: 18, damageType: 'piercing', type: 'attack', description: 'Mâchoire centrale' },
    { id: 'negative_energy_cone', name: 'Cône d\'énergie négative', damage: 30, damageType: 'necrotic', type: 'attack', description: 'Rayon central mortel', areaOfEffect: true }
  ],
  ultimateSkill: {
    id: 'death_ray', name: 'Rayon de Mort', damage: 55, damageType: 'necrotic', type: 'special',
    description: 'Rayon mortel instantané'
  }
};

const CATOBLEPAS: Monster = {
  id: 'catoblepas',
  name: 'Catoblépas',
  hp: 84, maxHp: 84,
  armorClass: 14,
  abilities: createAbilities(19, 12, 21, 3, 14, 8),
  speed: 30,
  challengeRating: 5, xpReward: 1800,
  creatureType: 'monstrosity', size: 'large',
  portrait: '🦬',
  isBoss: false,
  description: 'Créature hideuse au regard mortel vivant dans les marécages.',
  skills: [
    { id: 'tail', name: 'Queue', damage: 18, damageType: 'bludgeoning', type: 'attack', description: 'Coup de queue' },
    { id: 'death_ray', name: 'Rayon mortel', damage: 36, damageType: 'necrotic', type: 'attack', description: 'Regard de mort', recharge: { min: 5 }, savingThrow: { ability: 'constitution', dc: 16 } }
  ]
};

const LEUCROTTA: Monster = {
  id: 'leucrotta',
  name: 'Leucrotta',
  hp: 67, maxHp: 67,
  armorClass: 14,
  abilities: createAbilities(18, 14, 15, 9, 12, 6),
  speed: 50,
  challengeRating: 3, xpReward: 700,
  creatureType: 'monstrosity', size: 'large',
  portrait: '🦌',
  isBoss: false,
  description: 'Prédateur à la gueule bordée d\'os tranchants, imitant les voix.',
  skills: [
    { id: 'hooves', name: 'Sabots', damage: 14, damageType: 'bludgeoning', type: 'attack', description: 'Piétinement' },
    { id: 'bite', name: 'Morsure', damage: 16, damageType: 'piercing', type: 'attack', description: 'Mâchoires d\'os' }
  ]
};

// ============================================
// FIÉLONS SUPPLÉMENTAIRES (Démons et Diables mineurs)
// ============================================

const IMP: Monster = {
  id: 'imp',
  name: 'Diablotin',
  hp: 10, maxHp: 10,
  armorClass: 13,
  abilities: createAbilities(6, 17, 13, 11, 12, 14),
  speed: 20,
  challengeRating: 1, xpReward: 200,
  creatureType: 'fiend', size: 'tiny',
  portrait: '👿',
  isBoss: false,
  resistances: ['cold'],
  immunities: ['fire', 'poison'],
  conditionImmunities: ['poisoned'],
  description: 'Petit diable espion et serviteur des sorciers.',
  skills: [
    { id: 'sting', name: 'Dard', damage: 6, damageType: 'piercing', type: 'attack', description: 'Piqûre venimeuse' }
  ]
};

const QUASIT: Monster = {
  id: 'quasit',
  name: 'Quasit',
  hp: 7, maxHp: 7,
  armorClass: 13,
  abilities: createAbilities(5, 17, 10, 7, 10, 10),
  speed: 40,
  challengeRating: 1, xpReward: 200,
  creatureType: 'fiend', size: 'tiny',
  portrait: '😈',
  isBoss: false,
  resistances: ['cold', 'fire', 'lightning'],
  immunities: ['poison'],
  conditionImmunities: ['poisoned'],
  description: 'Petit démon serviteur et familier chaotique.',
  skills: [
    { id: 'claws', name: 'Griffes', damage: 5, damageType: 'slashing', type: 'attack', description: 'Griffes empoisonnées' }
  ]
};

const LEMURE: Monster = {
  id: 'lemure',
  name: 'Lémure',
  hp: 13, maxHp: 13,
  armorClass: 7,
  abilities: createAbilities(10, 5, 11, 1, 11, 3),
  speed: 15,
  challengeRating: 0, xpReward: 10,
  creatureType: 'fiend', size: 'medium',
  portrait: '👾',
  isBoss: false,
  resistances: ['cold'],
  immunities: ['fire', 'poison'],
  conditionImmunities: ['charmed', 'frightened', 'poisoned'],
  description: 'La forme la plus basse des diables, masse de chair gémissante.',
  skills: [
    { id: 'fist', name: 'Poing', damage: 4, damageType: 'bludgeoning', type: 'attack', description: 'Coup faible' }
  ]
};

const DRETCH: Monster = {
  id: 'dretch',
  name: 'Dretch',
  hp: 18, maxHp: 18,
  armorClass: 11,
  abilities: createAbilities(11, 11, 12, 5, 8, 3),
  speed: 20,
  challengeRating: 0.25, xpReward: 50,
  creatureType: 'fiend', size: 'small',
  portrait: '👹',
  isBoss: false,
  resistances: ['cold', 'fire', 'lightning'],
  immunities: ['poison'],
  conditionImmunities: ['poisoned'],
  description: 'Démon de bas étage, serviteur pathétique mais dangereux en nombre.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 5, damageType: 'piercing', type: 'attack', description: 'Morsure faible' },
    { id: 'claws', name: 'Griffes', damage: 6, damageType: 'slashing', type: 'attack', description: 'Griffes acérées' }
  ]
};

const MANES: Monster = {
  id: 'manes',
  name: 'Mânes',
  hp: 9, maxHp: 9,
  armorClass: 9,
  abilities: createAbilities(10, 9, 9, 3, 8, 4),
  speed: 20,
  challengeRating: 0.125, xpReward: 25,
  creatureType: 'fiend', size: 'small',
  portrait: '👻',
  isBoss: false,
  resistances: ['cold', 'fire', 'lightning'],
  immunities: ['poison'],
  conditionImmunities: ['charmed', 'frightened', 'poisoned'],
  description: 'Âme damnée transformée en démon inférieur.',
  skills: [
    { id: 'claws', name: 'Griffes', damage: 4, damageType: 'slashing', type: 'attack', description: 'Griffes faibles' }
  ]
};

const BEARDED_DEVIL: Monster = {
  id: 'bearded_devil',
  name: 'Diable Barbu',
  hp: 52, maxHp: 52,
  armorClass: 13,
  abilities: createAbilities(16, 15, 15, 9, 11, 11),
  speed: 30,
  challengeRating: 3, xpReward: 700,
  creatureType: 'fiend', size: 'medium',
  portrait: '😈',
  isBoss: false,
  resistances: ['cold'],
  immunities: ['fire', 'poison'],
  conditionImmunities: ['poisoned'],
  description: 'Soldat infernal à la barbe serpentine.',
  skills: [
    { id: 'beard', name: 'Barbe', damage: 8, damageType: 'piercing', type: 'attack', description: 'Barbe empoisonnée' },
    { id: 'glaive', name: 'Glaive', damage: 14, damageType: 'slashing', type: 'attack', description: 'Arme infernale' }
  ]
};

const CHAIN_DEVIL: Monster = {
  id: 'chain_devil',
  name: 'Diable des Chaînes',
  hp: 85, maxHp: 85,
  armorClass: 16,
  abilities: createAbilities(18, 15, 18, 11, 12, 14),
  speed: 30,
  challengeRating: 8, xpReward: 3900,
  creatureType: 'fiend', size: 'medium',
  portrait: '⛓️',
  isBoss: false,
  resistances: ['cold'],
  immunities: ['fire', 'poison'],
  conditionImmunities: ['poisoned'],
  description: 'Tortionnaire infernal maître des chaînes animées.',
  skills: [
    { id: 'chain', name: 'Chaîne', damage: 16, damageType: 'slashing', type: 'attack', description: 'Chaîne animate', attackCount: 2 },
    { id: 'animate_chains', name: 'Animation de chaînes', damage: 0, damageType: 'force', type: 'debuff', description: 'Les chaînes environnantes attaquent' }
  ]
};

const BONE_DEVIL: Monster = {
  id: 'bone_devil',
  name: 'Diable Osseux',
  hp: 142, maxHp: 142,
  armorClass: 19,
  abilities: createAbilities(18, 16, 18, 13, 14, 16),
  speed: 40,
  challengeRating: 9, xpReward: 5000,
  creatureType: 'fiend', size: 'large',
  portrait: '💀',
  isBoss: false,
  resistances: ['cold'],
  immunities: ['fire', 'poison'],
  conditionImmunities: ['poisoned'],
  description: 'Commandant osseux des légions infernales.',
  skills: [
    { id: 'claw', name: 'Griffe', damage: 14, damageType: 'slashing', type: 'attack', description: 'Griffes osseuses', attackCount: 2 },
    { id: 'sting', name: 'Dard', damage: 18, damageType: 'piercing', type: 'attack', description: 'Queue empoisonnée' }
  ]
};

const ICE_DEVIL: Monster = {
  id: 'ice_devil',
  name: 'Diable des Glaces',
  hp: 180, maxHp: 180,
  armorClass: 18,
  abilities: createAbilities(21, 14, 18, 18, 15, 18),
  speed: 40,
  challengeRating: 14, xpReward: 11500,
  creatureType: 'fiend', size: 'large',
  portrait: '🧊',
  isBoss: true,
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  immunities: ['cold', 'fire', 'poison'],
  conditionImmunities: ['poisoned'],
  description: 'Général gelé des Neuf Enfers, stratège implacable.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 18, damageType: 'piercing', type: 'attack', description: 'Morsure glacée' },
    { id: 'claws', name: 'Griffes', damage: 14, damageType: 'slashing', type: 'attack', description: 'Griffes de glace', attackCount: 2 },
    { id: 'tail', name: 'Queue', damage: 16, damageType: 'bludgeoning', type: 'attack', description: 'Coup de queue' },
    { id: 'wall_of_ice', name: 'Mur de glace', damage: 0, damageType: 'cold', type: 'special', description: 'Invoque un mur de glace' }
  ],
  ultimateSkill: {
    id: 'freezing_storm', name: 'Tempête Gelée', damage: 50, damageType: 'cold', type: 'special',
    description: 'Déchaîne un blizzard infernal'
  }
};

const HORNED_DEVIL: Monster = {
  id: 'horned_devil',
  name: 'Diable Cornu',
  hp: 178, maxHp: 178,
  armorClass: 18,
  abilities: createAbilities(22, 17, 21, 12, 16, 17),
  speed: 20,
  challengeRating: 11, xpReward: 7200,
  creatureType: 'fiend', size: 'large',
  portrait: '👹',
  isBoss: false,
  resistances: ['cold'],
  immunities: ['fire', 'poison'],
  conditionImmunities: ['poisoned'],
  description: 'Elite infernale aux cornes dévastatrices.',
  skills: [
    { id: 'fork', name: 'Fourche', damage: 18, damageType: 'piercing', type: 'attack', description: 'Fourche infernale', attackCount: 2 },
    { id: 'tail', name: 'Queue', damage: 14, damageType: 'piercing', type: 'attack', description: 'Coup de queue' },
    { id: 'hurl_flame', name: 'Jet de flammes', damage: 22, damageType: 'fire', type: 'attack', description: 'Lance des flammes' }
  ]
};

const ERINYES: Monster = {
  id: 'erinyes',
  name: 'Érinye',
  hp: 153, maxHp: 153,
  armorClass: 18,
  abilities: createAbilities(18, 16, 18, 14, 14, 18),
  speed: 30,
  challengeRating: 12, xpReward: 8400,
  creatureType: 'fiend', size: 'medium',
  portrait: '👼',
  isBoss: true,
  resistances: ['cold'],
  immunities: ['fire', 'poison'],
  conditionImmunities: ['poisoned'],
  description: 'Ange déchue au service des Enfers, belle et mortelle.',
  skills: [
    { id: 'longsword', name: 'Épée longue', damage: 18, damageType: 'slashing', type: 'attack', description: 'Lame infernale', attackCount: 3 },
    { id: 'longbow', name: 'Arc long', damage: 16, damageType: 'piercing', type: 'attack', description: 'Flèches empoisonnées', attackCount: 3 }
  ],
  ultimateSkill: {
    id: 'rope_of_entanglement', name: 'Corde d\'Entrave', damage: 25, damageType: 'force', type: 'special',
    description: 'Enserre et immobilise sa proie'
  }
};

const VROCK: Monster = {
  id: 'vrock',
  name: 'Vrock',
  hp: 104, maxHp: 104,
  armorClass: 15,
  abilities: createAbilities(17, 15, 18, 8, 13, 8),
  speed: 40,
  challengeRating: 6, xpReward: 2300,
  creatureType: 'fiend', size: 'large',
  portrait: '🦅',
  isBoss: false,
  resistances: ['cold', 'fire', 'lightning'],
  immunities: ['poison'],
  conditionImmunities: ['poisoned'],
  description: 'Démon vautour aux cris assourdissants.',
  skills: [
    { id: 'beak', name: 'Bec', damage: 14, damageType: 'piercing', type: 'attack', description: 'Bec crochu' },
    { id: 'talons', name: 'Serres', damage: 16, damageType: 'slashing', type: 'attack', description: 'Serres acérées' },
    { id: 'stunning_screech', name: 'Cri étourdissant', damage: 0, damageType: 'thunder', type: 'debuff', description: 'Hurlement paralysant', areaOfEffect: true, recharge: { min: 5 }, savingThrow: { ability: 'constitution', dc: 14 } }
  ]
};

const HEZROU: Monster = {
  id: 'hezrou',
  name: 'Hézrou',
  hp: 136, maxHp: 136,
  armorClass: 16,
  abilities: createAbilities(19, 17, 20, 5, 12, 13),
  speed: 30,
  challengeRating: 8, xpReward: 3900,
  creatureType: 'fiend', size: 'large',
  portrait: '🐸',
  isBoss: false,
  resistances: ['cold', 'fire', 'lightning'],
  immunities: ['poison'],
  conditionImmunities: ['poisoned'],
  description: 'Démon crapaud à la puanteur nauséabonde.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 18, damageType: 'piercing', type: 'attack', description: 'Mâchoire de batracien' },
    { id: 'claw', name: 'Griffe', damage: 14, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 }
  ]
};

const GLABREZU: Monster = {
  id: 'glabrezu',
  name: 'Glabrezu',
  hp: 157, maxHp: 157,
  armorClass: 17,
  abilities: createAbilities(20, 15, 21, 19, 17, 16),
  speed: 40,
  challengeRating: 9, xpReward: 5000,
  creatureType: 'fiend', size: 'large',
  portrait: '🦂',
  isBoss: false,
  resistances: ['cold', 'fire', 'lightning'],
  immunities: ['poison'],
  conditionImmunities: ['poisoned'],
  description: 'Démon tentateur aux pinces gigantesques.',
  skills: [
    { id: 'pincer', name: 'Pince', damage: 20, damageType: 'bludgeoning', type: 'attack', description: 'Pinces écrasantes', attackCount: 2 },
    { id: 'fist', name: 'Poing', damage: 12, damageType: 'bludgeoning', type: 'attack', description: 'Coup de poing', attackCount: 2 }
  ]
};

const NALFESHNEE: Monster = {
  id: 'nalfeshnee',
  name: 'Nalfeshnie',
  hp: 184, maxHp: 184,
  armorClass: 18,
  abilities: createAbilities(21, 10, 22, 19, 12, 15),
  speed: 20,
  challengeRating: 13, xpReward: 10000,
  creatureType: 'fiend', size: 'large',
  portrait: '🐗',
  isBoss: true,
  resistances: ['cold', 'fire', 'lightning'],
  immunities: ['poison'],
  conditionImmunities: ['poisoned'],
  description: 'Démon juge obèse aux ailes atrophiées.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 22, damageType: 'piercing', type: 'attack', description: 'Mâchoire de porc' },
    { id: 'claw', name: 'Griffe', damage: 18, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 },
    { id: 'horror_nimbus', name: 'Nimbe d\'horreur', damage: 0, damageType: 'psychic', type: 'debuff', description: 'Aura de terreur', areaOfEffect: true, recharge: { min: 5 }, savingThrow: { ability: 'wisdom', dc: 15 } }
  ],
  ultimateSkill: {
    id: 'unholy_nimbus', name: 'Nimbe Impie', damage: 45, damageType: 'radiant', type: 'special',
    description: 'Explosion de lumière maléfique'
  }
};

const MARILITH: Monster = {
  id: 'marilith',
  name: 'Marilith',
  hp: 189, maxHp: 189,
  armorClass: 18,
  abilities: createAbilities(18, 20, 20, 18, 16, 20),
  speed: 40,
  challengeRating: 16, xpReward: 15000,
  creatureType: 'fiend', size: 'large',
  portrait: '🐍',
  isBoss: true,
  resistances: ['cold', 'fire', 'lightning'],
  immunities: ['poison'],
  conditionImmunities: ['poisoned'],
  description: 'Générale démoniaque à six bras et corps de serpent.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'attack', name: 'Attaque', cost: 1, damage: 18, damageType: 'slashing', description: 'Frappe d\'épée' },
    { id: 'teleport', name: 'Téléportation', cost: 2, damage: 0, damageType: 'force', description: 'Se téléporte' }
  ],
  skills: [
    { id: 'longsword', name: 'Épées longues', damage: 18, damageType: 'slashing', type: 'attack', description: 'Six lames', attackCount: 6 },
    { id: 'tail', name: 'Queue', damage: 20, damageType: 'bludgeoning', type: 'attack', description: 'Constriction' }
  ],
  ultimateSkill: {
    id: 'dance_of_death', name: 'Danse de la Mort', damage: 75, damageType: 'slashing', type: 'special',
    description: 'Tourbillon d\'acier avec ses six épées'
  }
};

const GORISTRO: Monster = {
  id: 'goristro',
  name: 'Goristro',
  hp: 310, maxHp: 310,
  armorClass: 19,
  abilities: createAbilities(25, 11, 25, 6, 13, 14),
  speed: 40,
  challengeRating: 17, xpReward: 18000,
  creatureType: 'fiend', size: 'huge',
  portrait: '🐂',
  isBoss: true,
  resistances: ['cold', 'fire', 'lightning'],
  immunities: ['poison'],
  conditionImmunities: ['poisoned'],
  description: 'Démon taureau, bélier de siège vivant de l\'Abysse.',
  skills: [
    { id: 'gore', name: 'Encornage', damage: 32, damageType: 'piercing', type: 'attack', description: 'Cornes dévastatrices' },
    { id: 'fist', name: 'Poing', damage: 22, damageType: 'bludgeoning', type: 'attack', description: 'Coup de poing' },
    { id: 'charge', name: 'Charge', damage: 40, damageType: 'bludgeoning', type: 'attack', description: 'Charge brutale' }
  ],
  ultimateSkill: {
    id: 'rampage', name: 'Déchaînement', damage: 65, damageType: 'bludgeoning', type: 'special',
    description: 'Charge dévastatrice détruisant tout sur son passage'
  }
};

// ============================================
// BÊTES ET CRÉATURES NATURELLES
// ============================================

const GIANT_APE: Monster = {
  id: 'giant_ape',
  name: 'Singe Géant',
  hp: 157, maxHp: 157,
  armorClass: 12,
  abilities: createAbilities(23, 14, 18, 7, 12, 7),
  speed: 40,
  challengeRating: 7, xpReward: 2900,
  creatureType: 'beast', size: 'huge',
  portrait: '🦍',
  isBoss: false,
  description: 'Primate colossal d\'une force prodigieuse.',
  skills: [
    { id: 'fist', name: 'Poing', damage: 24, damageType: 'bludgeoning', type: 'attack', description: 'Coup puissant', attackCount: 2 },
    { id: 'rock', name: 'Rocher', damage: 18, damageType: 'bludgeoning', type: 'attack', description: 'Lance un rocher' }
  ]
};

const GIANT_CROCODILE: Monster = {
  id: 'giant_crocodile',
  name: 'Crocodile Géant',
  hp: 85, maxHp: 85,
  armorClass: 14,
  abilities: createAbilities(21, 9, 17, 2, 10, 7),
  speed: 30,
  challengeRating: 5, xpReward: 1800,
  creatureType: 'beast', size: 'huge',
  portrait: '🐊',
  isBoss: false,
  description: 'Reptile antique des marais profonds.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 22, damageType: 'piercing', type: 'attack', description: 'Mâchoires puissantes' },
    { id: 'tail', name: 'Queue', damage: 16, damageType: 'bludgeoning', type: 'attack', description: 'Coup de queue' }
  ]
};

const GIANT_SCORPION: Monster = {
  id: 'giant_scorpion',
  name: 'Scorpion Géant',
  hp: 52, maxHp: 52,
  armorClass: 15,
  abilities: createAbilities(15, 13, 15, 1, 9, 3),
  speed: 40,
  challengeRating: 3, xpReward: 700,
  creatureType: 'beast', size: 'large',
  portrait: '🦂',
  isBoss: false,
  description: 'Arachnide géant au dard venimeux mortel.',
  skills: [
    { id: 'claw', name: 'Pince', damage: 10, damageType: 'bludgeoning', type: 'attack', description: 'Pinces broyeuses', attackCount: 2 },
    { id: 'sting', name: 'Dard', damage: 14, damageType: 'piercing', type: 'attack', description: 'Dard empoisonné' }
  ]
};

const GIANT_SPIDER: Monster = {
  id: 'giant_spider',
  name: 'Araignée Géante',
  hp: 26, maxHp: 26,
  armorClass: 14,
  abilities: createAbilities(14, 16, 12, 2, 11, 4),
  speed: 30,
  challengeRating: 1, xpReward: 200,
  creatureType: 'beast', size: 'large',
  portrait: '🕷️',
  isBoss: false,
  description: 'Arachnide géant tissant des toiles mortelles.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 10, damageType: 'piercing', type: 'attack', description: 'Crochets venimeux' },
    { id: 'web', name: 'Toile', damage: 0, damageType: 'force', type: 'debuff', description: 'Entrave dans une toile', recharge: { min: 5 } }
  ]
};

const MAMMOTH: Monster = {
  id: 'mammoth',
  name: 'Mammouth',
  hp: 126, maxHp: 126,
  armorClass: 13,
  abilities: createAbilities(24, 9, 21, 3, 11, 6),
  speed: 40,
  challengeRating: 6, xpReward: 2300,
  creatureType: 'beast', size: 'huge',
  portrait: '🦣',
  isBoss: false,
  description: 'Éléphant laineux des terres glacées.',
  skills: [
    { id: 'gore', name: 'Défenses', damage: 22, damageType: 'piercing', type: 'attack', description: 'Coup de défenses' },
    { id: 'stomp', name: 'Piétinement', damage: 20, damageType: 'bludgeoning', type: 'attack', description: 'Écrasement' }
  ]
};

const TRICERATOPS: Monster = {
  id: 'triceratops',
  name: 'Tricératops',
  hp: 95, maxHp: 95,
  armorClass: 13,
  abilities: createAbilities(22, 9, 17, 2, 11, 5),
  speed: 50,
  challengeRating: 5, xpReward: 1800,
  creatureType: 'beast', size: 'huge',
  portrait: '🦕',
  isBoss: false,
  description: 'Dinosaure herbivore à trois cornes et collerette osseuse.',
  skills: [
    { id: 'gore', name: 'Encornage', damage: 18, damageType: 'piercing', type: 'attack', description: 'Charge aux cornes' },
    { id: 'stomp', name: 'Piétinement', damage: 14, damageType: 'bludgeoning', type: 'attack', description: 'Écrasement' }
  ]
};

const TYRANNOSAURUS_REX: Monster = {
  id: 'tyrannosaurus_rex',
  name: 'Tyrannosaure Rex',
  hp: 136, maxHp: 136,
  armorClass: 13,
  abilities: createAbilities(25, 10, 19, 2, 12, 9),
  speed: 50,
  challengeRating: 8, xpReward: 3900,
  creatureType: 'beast', size: 'huge',
  portrait: '🦖',
  isBoss: false,
  description: 'Le roi des dinosaures carnivores.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 32, damageType: 'piercing', type: 'attack', description: 'Mâchoires titanesques' },
    { id: 'tail', name: 'Queue', damage: 18, damageType: 'bludgeoning', type: 'attack', description: 'Coup de queue' }
  ]
};

// ============================================
// FÉES ET CRÉATURES FÉERIQUES
// ============================================

const PIXIE: Monster = {
  id: 'pixie', name: 'Pixie', hp: 1, maxHp: 1, armorClass: 15,
  abilities: createAbilities(2, 20, 8, 10, 14, 15),
  speed: 10,
  challengeRating: 0.25, xpReward: 50, creatureType: 'fey', size: 'tiny', portrait: '🧚', isBoss: false,
  description: 'Minuscule fée espiègle aux ailes de papillon.',
  skills: [{ id: 'confusion_dust', name: 'Poussière de confusion', damage: 0, damageType: 'psychic', type: 'debuff', description: 'Confond l\'ennemi' }]
};

const SATYR: Monster = {
  id: 'satyr', name: 'Satyre', hp: 31, maxHp: 31, armorClass: 14,
  abilities: createAbilities(12, 16, 11, 12, 10, 14),
  speed: 40,
  challengeRating: 0.5, xpReward: 100, creatureType: 'fey', size: 'medium', portrait: '🐐', isBoss: false,
  description: 'Créature mi-homme mi-chèvre, fêtard et musicien.',
  skills: [
    { id: 'ram', name: 'Coup de cornes', damage: 8, damageType: 'bludgeoning', type: 'attack', description: 'Charge' },
    { id: 'shortsword', name: 'Épée courte', damage: 10, damageType: 'piercing', type: 'attack', description: 'Frappe rapide' }
  ]
};

const BLINK_DOG: Monster = {
  id: 'blink_dog', name: 'Chien Clignotant', hp: 22, maxHp: 22, armorClass: 13,
  abilities: createAbilities(12, 17, 12, 10, 13, 11),
  speed: 40,
  challengeRating: 0.25, xpReward: 50, creatureType: 'fey', size: 'medium', portrait: '🐕', isBoss: false,
  description: 'Chien féerique capable de se téléporter.',
  skills: [{ id: 'bite', name: 'Morsure', damage: 8, damageType: 'piercing', type: 'attack', description: 'Morsure' }]
};

const SEA_HAG: Monster = {
  id: 'sea_hag', name: 'Guenaude Marine', hp: 52, maxHp: 52, armorClass: 14,
  abilities: createAbilities(16, 13, 16, 12, 12, 13),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'fey', size: 'medium', portrait: '🧙‍♀️', isBoss: false,
  description: 'Guenaude hideuse des profondeurs marines.',
  skills: [
    { id: 'claws', name: 'Griffes', damage: 12, damageType: 'slashing', type: 'attack', description: 'Griffes acérées' },
    { id: 'horrific_appearance', name: 'Apparence horrifique', damage: 0, damageType: 'psychic', type: 'debuff', description: 'Effroi paralysant', savingThrow: { ability: 'wisdom', dc: 11 } }
  ]
};

const NIGHT_HAG: Monster = {
  id: 'night_hag', name: 'Guenaude Nocturne', hp: 112, maxHp: 112, armorClass: 17,
  abilities: createAbilities(18, 15, 16, 16, 14, 16),
  speed: 30,
  challengeRating: 5, xpReward: 1800, creatureType: 'fiend', size: 'medium', portrait: '🌙', isBoss: false,
  resistances: ['cold', 'fire'], immunities: ['poison'], conditionImmunities: ['charmed'],
  description: 'Fiélon déguisé en guenaude, voleuse d\'âmes.',
  skills: [
    { id: 'claws', name: 'Griffes', damage: 16, damageType: 'slashing', type: 'attack', description: 'Griffes maudites' },
    { id: 'nightmare_haunting', name: 'Cauchemar', damage: 20, damageType: 'psychic', type: 'attack', description: 'Tourmente dans le sommeil' }
  ]
};

const ANNIS_HAG: Monster = {
  id: 'annis_hag', name: 'Guenaude Annis', hp: 75, maxHp: 75, armorClass: 17,
  abilities: createAbilities(21, 12, 14, 13, 14, 15),
  speed: 40,
  challengeRating: 6, xpReward: 2300, creatureType: 'fey', size: 'large', portrait: '👹', isBoss: false,
  resistances: ['cold'], description: 'Guenaude géante à la force terrifiante.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 18, damageType: 'piercing', type: 'attack', description: 'Dents de fer' },
    { id: 'claw', name: 'Griffe', damage: 16, damageType: 'slashing', type: 'attack', description: 'Griffes de fer', attackCount: 2 }
  ]
};

const BHEUR_HAG: Monster = {
  id: 'bheur_hag', name: 'Guenaude Bheur', hp: 91, maxHp: 91, armorClass: 17,
  abilities: createAbilities(13, 16, 14, 12, 13, 16),
  speed: 30,
  challengeRating: 7, xpReward: 2900, creatureType: 'fey', size: 'medium', portrait: '❄️', isBoss: false,
  immunities: ['cold'], description: 'Guenaude de l\'hiver éternel.',
  skills: [
    { id: 'slam', name: 'Coup de bâton', damage: 14, damageType: 'bludgeoning', type: 'attack', description: 'Bâton de glace' },
    { id: 'maddening_feast', name: 'Festin de folie', damage: 22, damageType: 'cold', type: 'attack', description: 'Malédiction hivernale' }
  ]
};

const REDCAP: Monster = {
  id: 'redcap', name: 'Chaperon Rouge', hp: 45, maxHp: 45, armorClass: 13,
  abilities: createAbilities(18, 13, 18, 10, 12, 9),
  speed: 25,
  challengeRating: 3, xpReward: 700, creatureType: 'fey', size: 'small', portrait: '🧢', isBoss: false,
  description: 'Gnome maléfique qui teint son bonnet du sang de ses victimes.',
  skills: [
    { id: 'wicked_sickle', name: 'Faucille cruelle', damage: 14, damageType: 'slashing', type: 'attack', description: 'Faucille sanglante', attackCount: 2 },
    { id: 'ironbound_boots', name: 'Bottes de fer', damage: 10, damageType: 'bludgeoning', type: 'attack', description: 'Piétinement' }
  ]
};

const QUICKLING: Monster = {
  id: 'quickling', name: 'Vif-Argent', hp: 10, maxHp: 10, armorClass: 16,
  abilities: createAbilities(4, 23, 13, 10, 12, 7),
  speed: 120,
  challengeRating: 1, xpReward: 200, creatureType: 'fey', size: 'tiny', portrait: '⚡', isBoss: false,
  description: 'Fée ultra-rapide vivant à un rythme accéléré.',
  skills: [{ id: 'dagger', name: 'Dague', damage: 10, damageType: 'piercing', type: 'attack', description: 'Frappes multiples', attackCount: 3 }]
};

const KORRED: Monster = {
  id: 'korred', name: 'Korred', hp: 102, maxHp: 102, armorClass: 17,
  abilities: createAbilities(23, 14, 20, 10, 15, 9),
  speed: 30,
  challengeRating: 7, xpReward: 2900, creatureType: 'fey', size: 'small', portrait: '🪨', isBoss: false,
  resistances: ['bludgeoning', 'piercing', 'slashing'], description: 'Fée des pierres aux cheveux animés.',
  skills: [
    { id: 'greatclub', name: 'Gourdin', damage: 18, damageType: 'bludgeoning', type: 'attack', description: 'Massue de pierre' },
    { id: 'rock', name: 'Rocher', damage: 16, damageType: 'bludgeoning', type: 'attack', description: 'Lance un rocher' }
  ]
};

// ============================================
// CONSTRUCTS SUPPLÉMENTAIRES
// ============================================

const HOMUNCULUS: Monster = {
  id: 'homunculus', name: 'Homoncule', hp: 5, maxHp: 5, armorClass: 13,
  abilities: createAbilities(4, 15, 11, 10, 10, 7),
  speed: 20,
  challengeRating: 0, xpReward: 10, creatureType: 'construct', size: 'tiny', portrait: '🧬', isBoss: false,
  immunities: ['poison'], conditionImmunities: ['charmed', 'poisoned'],
  description: 'Petit serviteur artificiel créé par un mage.',
  skills: [{ id: 'bite', name: 'Morsure', damage: 3, damageType: 'piercing', type: 'attack', description: 'Morsure empoisonnée' }]
};

const SCARECROW: Monster = {
  id: 'scarecrow', name: 'Épouvantail', hp: 36, maxHp: 36, armorClass: 11,
  abilities: createAbilities(11, 13, 11, 10, 10, 13),
  speed: 30,
  challengeRating: 1, xpReward: 200, creatureType: 'construct', size: 'medium', portrait: '🎃', isBoss: false,
  vulnerabilities: ['fire'], resistances: ['bludgeoning', 'piercing', 'slashing'],
  immunities: ['poison'], conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'paralyzed', 'poisoned', 'unconscious'],
  description: 'Épouvantail animé par un esprit maléfique.',
  skills: [
    { id: 'claw', name: 'Griffe', damage: 10, damageType: 'slashing', type: 'attack', description: 'Griffes de foin', attackCount: 2 },
    { id: 'terrifying_glare', name: 'Regard terrifiant', damage: 0, damageType: 'psychic', type: 'debuff', description: 'Paralysie de terreur', savingThrow: { ability: 'wisdom', dc: 11 } }
  ]
};

const HELMED_HORROR: Monster = {
  id: 'helmed_horror', name: 'Horreur Casquée', hp: 60, maxHp: 60, armorClass: 20,
  abilities: createAbilities(18, 13, 16, 10, 10, 10),
  speed: 30,
  challengeRating: 4, xpReward: 1100, creatureType: 'construct', size: 'medium', portrait: '🪖', isBoss: false,
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  immunities: ['force', 'necrotic', 'poison'],
  conditionImmunities: ['blinded', 'charmed', 'deafened', 'frightened', 'paralyzed', 'petrified', 'poisoned', 'stunned'],
  description: 'Armure enchantée animée, gardien éternel.',
  skills: [{ id: 'longsword', name: 'Épée longue', damage: 14, damageType: 'slashing', type: 'attack', description: 'Frappe d\'acier', attackCount: 2 }]
};

const SHIELD_GUARDIAN: Monster = {
  id: 'shield_guardian', name: 'Gardien de Bouclier', hp: 142, maxHp: 142, armorClass: 17,
  abilities: createAbilities(18, 8, 18, 7, 10, 3),
  speed: 30,
  challengeRating: 7, xpReward: 2900, creatureType: 'construct', size: 'large', portrait: '🛡️', isBoss: false,
  immunities: ['poison'], conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'paralyzed', 'poisoned'],
  description: 'Golem gardien lié à un maître par une amulette.',
  skills: [{ id: 'fist', name: 'Poing', damage: 18, damageType: 'bludgeoning', type: 'attack', description: 'Coup puissant', attackCount: 2 }]
};

const STONE_GOLEM: Monster = {
  id: 'stone_golem', name: 'Golem de Pierre', hp: 178, maxHp: 178, armorClass: 17,
  abilities: createAbilities(22, 9, 20, 3, 11, 1),
  speed: 30,
  challengeRating: 10, xpReward: 5900, creatureType: 'construct', size: 'large', portrait: '🗿', isBoss: true,
  immunities: ['poison', 'psychic'], resistances: ['bludgeoning', 'piercing', 'slashing'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'paralyzed', 'petrified', 'poisoned'],
  description: 'Statue de pierre animée d\'une force colossale.',
  skills: [
    { id: 'slam', name: 'Coup', damage: 22, damageType: 'bludgeoning', type: 'attack', description: 'Frappe de pierre', attackCount: 2 },
    { id: 'slow', name: 'Ralentissement', damage: 0, damageType: 'force', type: 'debuff', description: 'Aura ralentissante', areaOfEffect: true, recharge: { min: 5 }, savingThrow: { ability: 'wisdom', dc: 17 } }
  ],
  ultimateSkill: { id: 'seismic_pound', name: 'Frappe Sismique', damage: 45, damageType: 'bludgeoning', type: 'special', description: 'Fait trembler le sol' }
};

const IRON_GOLEM: Monster = {
  id: 'iron_golem', name: 'Golem de Fer', hp: 210, maxHp: 210, armorClass: 20,
  abilities: createAbilities(24, 9, 20, 3, 11, 1),
  speed: 30,
  challengeRating: 16, xpReward: 15000, creatureType: 'construct', size: 'large', portrait: '🤖', isBoss: true,
  immunities: ['fire', 'poison', 'psychic'], resistances: ['bludgeoning', 'piercing', 'slashing'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'paralyzed', 'petrified', 'poisoned'],
  description: 'Golem de métal presque indestructible.',
  skills: [
    { id: 'slam', name: 'Coup', damage: 26, damageType: 'bludgeoning', type: 'attack', description: 'Frappe de fer', attackCount: 2 },
    { id: 'poison_breath', name: 'Souffle empoisonné', damage: 35, damageType: 'poison', type: 'attack', description: 'Gaz toxique', areaOfEffect: true, recharge: { min: 6 }, savingThrow: { ability: 'constitution', dc: 19 } }
  ],
  ultimateSkill: { id: 'iron_fury', name: 'Furie de Fer', damage: 55, damageType: 'bludgeoning', type: 'special', description: 'Déchaînement mécanique' }
};

const CLAY_GOLEM: Monster = {
  id: 'clay_golem', name: 'Golem d\'Argile', hp: 133, maxHp: 133, armorClass: 14,
  abilities: createAbilities(20, 9, 18, 3, 8, 1),
  speed: 20,
  challengeRating: 9, xpReward: 5000, creatureType: 'construct', size: 'large', portrait: '🏺', isBoss: false,
  immunities: ['acid', 'poison', 'psychic'], resistances: ['bludgeoning', 'piercing', 'slashing'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'paralyzed', 'petrified', 'poisoned'],
  description: 'Golem d\'argile aux blessures maudites.',
  skills: [{ id: 'slam', name: 'Coup', damage: 20, damageType: 'bludgeoning', type: 'attack', description: 'Frappe d\'argile', attackCount: 2 }]
};

const FLESH_GOLEM: Monster = {
  id: 'flesh_golem', name: 'Golem de Chair', hp: 93, maxHp: 93, armorClass: 9,
  abilities: createAbilities(19, 9, 18, 6, 10, 5),
  speed: 30,
  challengeRating: 5, xpReward: 1800, creatureType: 'construct', size: 'medium', portrait: '🧟', isBoss: false,
  immunities: ['lightning', 'poison'], resistances: ['bludgeoning', 'piercing', 'slashing'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'paralyzed', 'petrified', 'poisoned'],
  description: 'Créature faite de morceaux de cadavres assemblés.',
  skills: [{ id: 'slam', name: 'Coup', damage: 16, damageType: 'bludgeoning', type: 'attack', description: 'Frappe de chair', attackCount: 2 }]
};

// ============================================
// PLANTES ET VASES
// ============================================

const AWAKENED_TREE: Monster = {
  id: 'awakened_tree', name: 'Arbre Éveillé', hp: 59, maxHp: 59, armorClass: 13,
  abilities: createAbilities(19, 6, 15, 10, 10, 7),
  speed: 20,
  challengeRating: 2, xpReward: 450, creatureType: 'plant', size: 'huge', portrait: '🌳', isBoss: false,
  vulnerabilities: ['fire'], resistances: ['bludgeoning', 'piercing'],
  description: 'Arbre animé par la magie druidique.',
  skills: [{ id: 'slam', name: 'Coup', damage: 16, damageType: 'bludgeoning', type: 'attack', description: 'Branche écrasante' }]
};

const AWAKENED_SHRUB: Monster = {
  id: 'awakened_shrub', name: 'Arbuste Éveillé', hp: 10, maxHp: 10, armorClass: 9,
  abilities: createAbilities(3, 8, 11, 10, 10, 6),
  speed: 20,
  challengeRating: 0, xpReward: 10, creatureType: 'plant', size: 'small', portrait: '🌿', isBoss: false,
  vulnerabilities: ['fire'], resistances: ['piercing'],
  description: 'Petit buisson animé.',
  skills: [{ id: 'rake', name: 'Griffure', damage: 3, damageType: 'slashing', type: 'attack', description: 'Branches épineuses' }]
};

const TWIG_BLIGHT: Monster = {
  id: 'twig_blight', name: 'Fléau de Brindilles', hp: 4, maxHp: 4, armorClass: 13,
  abilities: createAbilities(6, 13, 12, 4, 8, 3),
  speed: 20,
  challengeRating: 0.125, xpReward: 25, creatureType: 'plant', size: 'small', portrait: '🌾', isBoss: false,
  vulnerabilities: ['fire'], conditionImmunities: ['blinded', 'deafened'],
  description: 'Petit végétal maléfique camouflé.',
  skills: [{ id: 'claws', name: 'Griffes', damage: 4, damageType: 'piercing', type: 'attack', description: 'Branches griffues' }]
};

const NEEDLE_BLIGHT: Monster = {
  id: 'needle_blight', name: 'Fléau d\'Aiguilles', hp: 11, maxHp: 11, armorClass: 12,
  abilities: createAbilities(12, 12, 13, 4, 8, 3),
  speed: 30,
  challengeRating: 0.25, xpReward: 50, creatureType: 'plant', size: 'medium', portrait: '🌲', isBoss: false,
  conditionImmunities: ['blinded', 'deafened'],
  description: 'Plante humanoïde lançant des aiguilles.',
  skills: [
    { id: 'claws', name: 'Griffes', damage: 8, damageType: 'piercing', type: 'attack', description: 'Branches épineuses' },
    { id: 'needles', name: 'Aiguilles', damage: 12, damageType: 'piercing', type: 'attack', description: 'Volée d\'aiguilles' }
  ]
};

const VINE_BLIGHT: Monster = {
  id: 'vine_blight', name: 'Fléau de Lianes', hp: 26, maxHp: 26, armorClass: 12,
  abilities: createAbilities(15, 8, 14, 5, 10, 3),
  speed: 10,
  challengeRating: 0.5, xpReward: 100, creatureType: 'plant', size: 'medium', portrait: '🌱', isBoss: false,
  conditionImmunities: ['blinded', 'deafened'],
  description: 'Masse de lianes entremêlées et agressives.',
  skills: [
    { id: 'constrict', name: 'Constriction', damage: 12, damageType: 'bludgeoning', type: 'attack', description: 'Lianes étrangleuses' },
    { id: 'entangling_plants', name: 'Plantes enchevêtrées', damage: 0, damageType: 'force', type: 'debuff', description: 'Zone de lianes', areaOfEffect: true }
  ]
};

const TREANT: Monster = {
  id: 'treant', name: 'Tréant', hp: 138, maxHp: 138, armorClass: 16,
  abilities: createAbilities(23, 8, 21, 12, 16, 12),
  speed: 30,
  challengeRating: 9, xpReward: 5000, creatureType: 'plant', size: 'huge', portrait: '🌲', isBoss: true,
  vulnerabilities: ['fire'], resistances: ['bludgeoning', 'piercing'],
  description: 'Ancien gardien des forêts, arbre millénaire.',
  skills: [
    { id: 'slam', name: 'Coup', damage: 22, damageType: 'bludgeoning', type: 'attack', description: 'Branche massive', attackCount: 2 },
    { id: 'rock', name: 'Rocher', damage: 18, damageType: 'bludgeoning', type: 'attack', description: 'Lance un rocher' },
    { id: 'animate_trees', name: 'Animer les arbres', damage: 0, damageType: 'force', type: 'buff', description: 'Éveille les arbres alentour' }
  ],
  ultimateSkill: { id: 'forest_wrath', name: 'Colère de la Forêt', damage: 45, damageType: 'bludgeoning', type: 'special', description: 'La forêt se déchaîne' }
};

const BLACK_PUDDING: Monster = {
  id: 'black_pudding', name: 'Pouding Noir', hp: 85, maxHp: 85, armorClass: 7,
  abilities: createAbilities(16, 5, 16, 1, 6, 1),
  speed: 20,
  challengeRating: 4, xpReward: 1100, creatureType: 'ooze', size: 'large', portrait: '⬛', isBoss: false,
  immunities: ['acid', 'cold', 'lightning'], conditionImmunities: ['blinded', 'charmed', 'deafened', 'exhaustion', 'frightened', 'prone'],
  description: 'Vase noire corrosive dissolvant tout.',
  skills: [{ id: 'pseudopod', name: 'Pseudopode', damage: 14, damageType: 'bludgeoning', type: 'attack', description: 'Coup acide' }]
};

const OCHRE_JELLY: Monster = {
  id: 'ochre_jelly', name: 'Gelée Ocre', hp: 45, maxHp: 45, armorClass: 8,
  abilities: createAbilities(15, 6, 14, 2, 6, 1),
  speed: 10,
  challengeRating: 2, xpReward: 450, creatureType: 'ooze', size: 'large', portrait: '🟡', isBoss: false,
  resistances: ['acid'], immunities: ['lightning'], conditionImmunities: ['blinded', 'charmed', 'deafened', 'exhaustion', 'frightened', 'prone'],
  description: 'Vase jaune qui se divise quand frappée.',
  skills: [{ id: 'pseudopod', name: 'Pseudopode', damage: 12, damageType: 'bludgeoning', type: 'attack', description: 'Coup acide' }]
};

const GRAY_OOZE: Monster = {
  id: 'gray_ooze', name: 'Vase Grise', hp: 22, maxHp: 22, armorClass: 8,
  abilities: createAbilities(12, 6, 16, 1, 6, 2),
  speed: 10,
  challengeRating: 0.5, xpReward: 100, creatureType: 'ooze', size: 'medium', portrait: '⬜', isBoss: false,
  resistances: ['acid', 'cold', 'fire'], conditionImmunities: ['blinded', 'charmed', 'deafened', 'exhaustion', 'frightened', 'prone'],
  description: 'Vase grise corrodant le métal.',
  skills: [{ id: 'pseudopod', name: 'Pseudopode', damage: 8, damageType: 'bludgeoning', type: 'attack', description: 'Coup corrosif' }]
};

const OBLEX_SPAWN: Monster = {
  id: 'oblex_spawn', name: 'Rejeton d\'Oblex', hp: 18, maxHp: 18, armorClass: 13,
  abilities: createAbilities(8, 16, 15, 14, 11, 10),
  speed: 20,
  challengeRating: 0.25, xpReward: 50, creatureType: 'ooze', size: 'tiny', portrait: '🔮', isBoss: false,
  conditionImmunities: ['blinded', 'charmed', 'deafened', 'exhaustion', 'prone'],
  description: 'Jeune oblex voleur de souvenirs.',
  skills: [{ id: 'pseudopod', name: 'Pseudopode', damage: 8, damageType: 'bludgeoning', type: 'attack', description: 'Coup psychique' }]
};

const ADULT_OBLEX: Monster = {
  id: 'adult_oblex', name: 'Oblex Adulte', hp: 75, maxHp: 75, armorClass: 14,
  abilities: createAbilities(8, 19, 16, 19, 12, 15),
  speed: 20,
  challengeRating: 5, xpReward: 1800, creatureType: 'ooze', size: 'medium', portrait: '🧠', isBoss: false,
  conditionImmunities: ['blinded', 'charmed', 'deafened', 'exhaustion', 'prone'],
  description: 'Oblex voleur de souvenirs et d\'identités.',
  skills: [
    { id: 'pseudopod', name: 'Pseudopode', damage: 12, damageType: 'bludgeoning', type: 'attack', description: 'Frappe' },
    { id: 'eat_memories', name: 'Dévorer les souvenirs', damage: 18, damageType: 'psychic', type: 'attack', description: 'Vol de mémoire', savingThrow: { ability: 'wisdom', dc: 15 } }
  ]
};

const ELDER_OBLEX: Monster = {
  id: 'elder_oblex', name: 'Oblex Ancien', hp: 115, maxHp: 115, armorClass: 16,
  abilities: createAbilities(15, 16, 21, 22, 13, 18),
  speed: 20,
  challengeRating: 10, xpReward: 5900, creatureType: 'ooze', size: 'huge', portrait: '🧠', isBoss: true,
  conditionImmunities: ['blinded', 'charmed', 'deafened', 'exhaustion', 'prone'],
  description: 'Ancien oblex aux multiples simulacres.',
  skills: [
    { id: 'pseudopod', name: 'Pseudopode', damage: 18, damageType: 'bludgeoning', type: 'attack', description: 'Frappe', attackCount: 2 },
    { id: 'eat_memories', name: 'Dévorer les souvenirs', damage: 26, damageType: 'psychic', type: 'attack', description: 'Vol de mémoire', savingThrow: { ability: 'wisdom', dc: 18 } }
  ],
  ultimateSkill: { id: 'identity_theft', name: 'Vol d\'Identité', damage: 40, damageType: 'psychic', type: 'special', description: 'Vole l\'essence d\'une victime' }
};

// ============================================
// ABERRATIONS SUPPLÉMENTAIRES
// ============================================

const GIBBERING_MOUTHER: Monster = {
  id: 'gibbering_mouther', name: 'Gibbering Mouther', hp: 67, maxHp: 67, armorClass: 9,
  abilities: createAbilities(10, 8, 16, 3, 10, 6),
  speed: 10,
  challengeRating: 2, xpReward: 450, creatureType: 'aberration', size: 'medium', portrait: '👄', isBoss: false,
  conditionImmunities: ['prone'],
  description: 'Masse de chair et de bouches marmonnantes.',
  skills: [
    { id: 'bites', name: 'Morsures', damage: 14, damageType: 'piercing', type: 'attack', description: 'Multiples morsures' },
    { id: 'gibbering', name: 'Charabia', damage: 0, damageType: 'psychic', type: 'debuff', description: 'Sons rendant fou', areaOfEffect: true, savingThrow: { ability: 'wisdom', dc: 10 } }
  ]
};

const OTYUGH: Monster = {
  id: 'otyugh', name: 'Otyugh', hp: 114, maxHp: 114, armorClass: 14,
  abilities: createAbilities(16, 11, 19, 6, 13, 6),
  speed: 30,
  challengeRating: 5, xpReward: 1800, creatureType: 'aberration', size: 'large', portrait: '🦠', isBoss: false,
  description: 'Charognard des égouts aux tentacules.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 18, damageType: 'piercing', type: 'attack', description: 'Morsure infectée' },
    { id: 'tentacle', name: 'Tentacule', damage: 12, damageType: 'bludgeoning', type: 'attack', description: 'Coup de tentacule', attackCount: 2 }
  ]
};

const CLOAKER: Monster = {
  id: 'cloaker', name: 'Cape Volante', hp: 78, maxHp: 78, armorClass: 14,
  abilities: createAbilities(17, 15, 12, 13, 12, 14),
  speed: 10,
  challengeRating: 8, xpReward: 3900, creatureType: 'aberration', size: 'large', portrait: '🦇', isBoss: false,
  description: 'Créature ressemblant à une cape qui enveloppe ses proies.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 16, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'tail', name: 'Queue', damage: 12, damageType: 'slashing', type: 'attack', description: 'Coup de queue' },
    { id: 'moan', name: 'Gémissement', damage: 0, damageType: 'psychic', type: 'debuff', description: 'Gémissement effrayant', areaOfEffect: true, savingThrow: { ability: 'wisdom', dc: 13 } }
  ]
};

const GRELL: Monster = {
  id: 'grell', name: 'Grell', hp: 55, maxHp: 55, armorClass: 12,
  abilities: createAbilities(15, 14, 13, 12, 11, 9),
  speed: 10,
  challengeRating: 3, xpReward: 700, creatureType: 'aberration', size: 'medium', portrait: '🧠', isBoss: false,
  immunities: ['lightning'], conditionImmunities: ['blinded', 'prone'],
  description: 'Cerveau flottant aux tentacules paralysants.',
  skills: [
    { id: 'tentacles', name: 'Tentacules', damage: 12, damageType: 'piercing', type: 'attack', description: 'Tentacules paralysants' },
    { id: 'beak', name: 'Bec', damage: 10, damageType: 'piercing', type: 'attack', description: 'Bec acéré' }
  ]
};

const INTELLECT_DEVOURER: Monster = {
  id: 'intellect_devourer', name: 'Dévoreur d\'Intellect', hp: 21, maxHp: 21, armorClass: 12,
  abilities: createAbilities(6, 14, 13, 12, 11, 10),
  speed: 40,
  challengeRating: 2, xpReward: 450, creatureType: 'aberration', size: 'tiny', portrait: '🧠', isBoss: false,
  resistances: ['bludgeoning', 'piercing', 'slashing'], conditionImmunities: ['blinded'],
  description: 'Cerveau à pattes qui dévore l\'intelligence.',
  skills: [
    { id: 'claws', name: 'Griffes', damage: 10, damageType: 'slashing', type: 'attack', description: 'Griffes' },
    { id: 'devour_intellect', name: 'Dévorer l\'intellect', damage: 14, damageType: 'psychic', type: 'attack', description: 'Attaque mentale', savingThrow: { ability: 'intelligence', dc: 12 } }
  ]
};

const SPECTATOR: Monster = {
  id: 'spectator', name: 'Spectateur', hp: 39, maxHp: 39, armorClass: 14,
  abilities: createAbilities(8, 14, 14, 13, 14, 11),
  speed: 0,
  challengeRating: 3, xpReward: 700, creatureType: 'aberration', size: 'medium', portrait: '👁️', isBoss: false,
  conditionImmunities: ['prone'],
  description: 'Petit cousin du tyrannœil, gardien convoqué.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 10, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'eye_ray', name: 'Rayon oculaire', damage: 14, damageType: 'force', type: 'attack', description: 'Rayon aléatoire' }
  ]
};

const UMBER_HULK: Monster = {
  id: 'umber_hulk', name: 'Ombre des Roches', hp: 93, maxHp: 93, armorClass: 18,
  abilities: createAbilities(20, 13, 16, 9, 10, 10),
  speed: 30,
  challengeRating: 5, xpReward: 1800, creatureType: 'monstrosity', size: 'large', portrait: '🪲', isBoss: false,
  description: 'Insectoïde fouisseur au regard confondant.',
  skills: [
    { id: 'claw', name: 'Griffe', damage: 16, damageType: 'slashing', type: 'attack', description: 'Griffes massives', attackCount: 2 },
    { id: 'mandibles', name: 'Mandibules', damage: 14, damageType: 'slashing', type: 'attack', description: 'Mâchoires' },
    { id: 'confusing_gaze', name: 'Regard confondant', damage: 0, damageType: 'psychic', type: 'debuff', description: 'Confusion', savingThrow: { ability: 'charisma', dc: 15 } }
  ]
};

const STAR_SPAWN_HULK: Monster = {
  id: 'star_spawn_hulk', name: 'Colosse Stellaire', hp: 136, maxHp: 136, armorClass: 16,
  abilities: createAbilities(20, 8, 21, 7, 12, 9),
  speed: 30,
  challengeRating: 10, xpReward: 5900, creatureType: 'aberration', size: 'large', portrait: '⭐', isBoss: false,
  resistances: ['bludgeoning', 'piercing', 'slashing'], conditionImmunities: ['charmed', 'frightened'],
  description: 'Monstre massif venu des étoiles.',
  skills: [{ id: 'slam', name: 'Coup', damage: 22, damageType: 'bludgeoning', type: 'attack', description: 'Frappe cosmique', attackCount: 2 }]
};

const STAR_SPAWN_MANGLER: Monster = {
  id: 'star_spawn_mangler', name: 'Déchiqueteur Stellaire', hp: 71, maxHp: 71, armorClass: 14,
  abilities: createAbilities(8, 18, 12, 11, 12, 7),
  speed: 40,
  challengeRating: 5, xpReward: 1800, creatureType: 'aberration', size: 'medium', portrait: '⭐', isBoss: false,
  resistances: ['cold'], conditionImmunities: ['charmed', 'frightened', 'prone'],
  description: 'Assassin venu des étoiles aux lames multiples.',
  skills: [{ id: 'claw', name: 'Griffe', damage: 14, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 6 }]
};

const STAR_SPAWN_SEER: Monster = {
  id: 'star_spawn_seer', name: 'Voyant Stellaire', hp: 153, maxHp: 153, armorClass: 17,
  abilities: createAbilities(14, 12, 18, 22, 19, 16),
  speed: 30,
  challengeRating: 13, xpReward: 10000, creatureType: 'aberration', size: 'medium', portrait: '👁️', isBoss: true,
  resistances: ['cold'], conditionImmunities: ['charmed', 'frightened'],
  description: 'Oracle des Anciens, canalisateur de folie.',
  skills: [
    { id: 'comet_staff', name: 'Bâton comète', damage: 20, damageType: 'bludgeoning', type: 'attack', description: 'Bâton stellaire', attackCount: 2 },
    { id: 'psychic_orb', name: 'Orbe psychique', damage: 28, damageType: 'psychic', type: 'attack', description: 'Attaque mentale' }
  ],
  ultimateSkill: { id: 'collapse_distance', name: 'Effondrer la Distance', damage: 50, damageType: 'force', type: 'special', description: 'Distord l\'espace' }
};

// ============================================
// LYCANTHROPES SUPPLÉMENTAIRES
// ============================================

const WEREBEAR: Monster = {
  id: 'werebear', name: 'Ours-garou', hp: 135, maxHp: 135, armorClass: 10,
  abilities: createAbilities(19, 10, 17, 11, 12, 12),
  speed: 30,
  challengeRating: 5, xpReward: 1800, creatureType: 'humanoid', size: 'medium', portrait: '🐻', isBoss: false,
  immunities: ['bludgeoning', 'piercing', 'slashing'],
  description: 'Lycanthrope ours, souvent de nature bienveillante.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 18, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claw', name: 'Griffe', damage: 14, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 }
  ]
};

const WEREBOAR: Monster = {
  id: 'wereboar', name: 'Sanglier-garou', hp: 78, maxHp: 78, armorClass: 10,
  abilities: createAbilities(17, 10, 15, 10, 11, 8),
  speed: 30,
  challengeRating: 4, xpReward: 1100, creatureType: 'humanoid', size: 'medium', portrait: '🐗', isBoss: false,
  immunities: ['bludgeoning', 'piercing', 'slashing'],
  description: 'Lycanthrope sanglier agressif et têtu.',
  skills: [
    { id: 'tusks', name: 'Défenses', damage: 14, damageType: 'slashing', type: 'attack', description: 'Défenses' },
    { id: 'maul', name: 'Matraquage', damage: 12, damageType: 'bludgeoning', type: 'attack', description: 'Arme' }
  ]
};

const WERETIGER: Monster = {
  id: 'weretiger', name: 'Tigre-garou', hp: 120, maxHp: 120, armorClass: 12,
  abilities: createAbilities(17, 15, 16, 10, 13, 11),
  speed: 30,
  challengeRating: 4, xpReward: 1100, creatureType: 'humanoid', size: 'medium', portrait: '🐯', isBoss: false,
  immunities: ['bludgeoning', 'piercing', 'slashing'],
  description: 'Lycanthrope tigre, prédateur solitaire.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 14, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claw', name: 'Griffe', damage: 12, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 }
  ]
};

const WERERAT: Monster = {
  id: 'wererat', name: 'Rat-garou', hp: 33, maxHp: 33, armorClass: 12,
  abilities: createAbilities(10, 15, 12, 11, 10, 8),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'humanoid', size: 'medium', portrait: '🐀', isBoss: false,
  immunities: ['bludgeoning', 'piercing', 'slashing'],
  description: 'Lycanthrope rat, sournois et maladif.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 8, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'shortsword', name: 'Épée courte', damage: 10, damageType: 'piercing', type: 'attack', description: 'Épée' }
  ]
};

// ============================================
// GOBELINOÏDES ET ORCOÏDES SUPPLÉMENTAIRES
// ============================================

const GOBLIN_BOSS: Monster = {
  id: 'goblin_boss', name: 'Chef Gobelin', hp: 21, maxHp: 21, armorClass: 17,
  abilities: createAbilities(10, 14, 10, 10, 8, 10),
  speed: 30,
  challengeRating: 1, xpReward: 200, creatureType: 'humanoid', size: 'small', portrait: '👺', isBoss: false,
  description: 'Chef de bande gobeline, plus rusé que les autres.',
  skills: [
    { id: 'scimitar', name: 'Cimeterre', damage: 10, damageType: 'slashing', type: 'attack', description: 'Frappe', attackCount: 2 },
    { id: 'javelin', name: 'Javelot', damage: 8, damageType: 'piercing', type: 'attack', description: 'Lancer' }
  ]
};

const HOBGOBLIN_CAPTAIN: Monster = {
  id: 'hobgoblin_captain', name: 'Capitaine Hobgobelin', hp: 39, maxHp: 39, armorClass: 17,
  abilities: createAbilities(15, 14, 14, 12, 10, 13),
  speed: 30,
  challengeRating: 3, xpReward: 700, creatureType: 'humanoid', size: 'medium', portrait: '⚔️', isBoss: false,
  description: 'Officier hobgobelin discipliné et tactique.',
  skills: [
    { id: 'greatsword', name: 'Épée à deux mains', damage: 14, damageType: 'slashing', type: 'attack', description: 'Frappe', attackCount: 2 },
    { id: 'javelin', name: 'Javelot', damage: 10, damageType: 'piercing', type: 'attack', description: 'Lancer' }
  ]
};

const HOBGOBLIN_WARLORD: Monster = {
  id: 'hobgoblin_warlord', name: 'Seigneur de Guerre Hobgobelin', hp: 97, maxHp: 97, armorClass: 20,
  abilities: createAbilities(16, 14, 16, 14, 11, 15),
  speed: 30,
  challengeRating: 6, xpReward: 2300, creatureType: 'humanoid', size: 'medium', portrait: '👹', isBoss: false,
  description: 'Général hobgobelin redoutable.',
  skills: [
    { id: 'longsword', name: 'Épée longue', damage: 16, damageType: 'slashing', type: 'attack', description: 'Frappe', attackCount: 3 },
    { id: 'shield_bash', name: 'Coup de bouclier', damage: 10, damageType: 'bludgeoning', type: 'attack', description: 'Frappe au bouclier' }
  ]
};

const ORC_WAR_CHIEF: Monster = {
  id: 'orc_war_chief', name: 'Chef de Guerre Orc', hp: 93, maxHp: 93, armorClass: 16,
  abilities: createAbilities(18, 12, 18, 11, 11, 16),
  speed: 30,
  challengeRating: 4, xpReward: 1100, creatureType: 'humanoid', size: 'medium', portrait: '💪', isBoss: false,
  description: 'Chef de clan orc brutal et charismatique.',
  skills: [
    { id: 'greataxe', name: 'Hache', damage: 16, damageType: 'slashing', type: 'attack', description: 'Grande hache', attackCount: 2 },
    { id: 'spear', name: 'Lance', damage: 12, damageType: 'piercing', type: 'attack', description: 'Lancer de lance' }
  ]
};

const ORC_EYE_OF_GRUUMSH: Monster = {
  id: 'orc_eye_of_gruumsh', name: 'Œil de Gruumsh', hp: 45, maxHp: 45, armorClass: 16,
  abilities: createAbilities(16, 12, 16, 9, 13, 12),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'humanoid', size: 'medium', portrait: '👁️', isBoss: false,
  description: 'Prêtre guerrier de Gruumsh, borgne rituel.',
  skills: [
    { id: 'spear', name: 'Lance', damage: 12, damageType: 'piercing', type: 'attack', description: 'Lance sacrée', attackCount: 2 },
    { id: 'spiritual_weapon', name: 'Arme spirituelle', damage: 14, damageType: 'force', type: 'attack', description: 'Arme divine' }
  ]
};

const HALF_OGRE: Monster = {
  id: 'half_ogre', name: 'Demi-Ogre', hp: 30, maxHp: 30, armorClass: 12,
  abilities: createAbilities(17, 10, 14, 7, 9, 10),
  speed: 30,
  challengeRating: 1, xpReward: 200, creatureType: 'giant', size: 'large', portrait: '👹', isBoss: false,
  description: 'Croisement entre humain et ogre.',
  skills: [
    { id: 'battleaxe', name: 'Hache de bataille', damage: 14, damageType: 'slashing', type: 'attack', description: 'Grande hache' },
    { id: 'javelin', name: 'Javelot', damage: 10, damageType: 'piercing', type: 'attack', description: 'Lancer' }
  ]
};

const ETTIN: Monster = {
  id: 'ettin', name: 'Ettin', hp: 85, maxHp: 85, armorClass: 12,
  abilities: createAbilities(21, 8, 17, 6, 10, 8),
  speed: 40,
  challengeRating: 4, xpReward: 1100, creatureType: 'giant', size: 'large', portrait: '👹', isBoss: false,
  description: 'Géant à deux têtes querellant constamment.',
  skills: [
    { id: 'battleaxe', name: 'Hache', damage: 18, damageType: 'slashing', type: 'attack', description: 'Hache' },
    { id: 'morningstar', name: 'Morgenstern', damage: 18, damageType: 'piercing', type: 'attack', description: 'Masse d\'armes' }
  ]
};

const ONI: Monster = {
  id: 'oni', name: 'Oni', hp: 110, maxHp: 110, armorClass: 16,
  abilities: createAbilities(19, 11, 16, 14, 12, 15),
  speed: 30,
  challengeRating: 7, xpReward: 2900, creatureType: 'giant', size: 'large', portrait: '👹', isBoss: false,
  description: 'Ogre-mage japonais aux pouvoirs magiques.',
  skills: [
    { id: 'glaive', name: 'Glaive', damage: 18, damageType: 'slashing', type: 'attack', description: 'Arme d\'hast', attackCount: 2 },
    { id: 'cone_of_cold', name: 'Cône de froid', damage: 28, damageType: 'cold', type: 'attack', description: 'Souffle glacé', areaOfEffect: true, savingThrow: { ability: 'constitution', dc: 13 } }
  ]
};

const TROLLWIFE: Monster = {
  id: 'trollwife', name: 'Femme Troll', hp: 84, maxHp: 84, armorClass: 15,
  abilities: createAbilities(18, 13, 16, 9, 11, 12),
  speed: 30,
  challengeRating: 5, xpReward: 1800, creatureType: 'giant', size: 'large', portrait: '🧟‍♀️', isBoss: false,
  description: 'Troll femelle plus rusée et plus dangereuse.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 14, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claw', name: 'Griffe', damage: 12, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 }
  ]
};

// ============================================
// MORTS-VIVANTS ADDITIONNELS
// ============================================

const CRAWLING_CLAW: Monster = {
  id: 'crawling_claw', name: 'Main Rampante', hp: 2, maxHp: 2, armorClass: 12,
  abilities: createAbilities(13, 14, 11, 5, 10, 4),
  speed: 20,
  challengeRating: 0, xpReward: 10, creatureType: 'undead', size: 'tiny', portrait: '✋', isBoss: false,
  immunities: ['poison'], conditionImmunities: ['charmed', 'exhaustion', 'poisoned'],
  description: 'Main coupée animée par la nécromancie.',
  skills: [{ id: 'claw', name: 'Griffe', damage: 4, damageType: 'bludgeoning', type: 'attack', description: 'Frappe' }]
};

const POLTERGEIST: Monster = {
  id: 'poltergeist', name: 'Poltergeist', hp: 22, maxHp: 22, armorClass: 12,
  abilities: createAbilities(1, 14, 11, 10, 10, 11),
  speed: 0,
  challengeRating: 2, xpReward: 450, creatureType: 'undead', size: 'medium', portrait: '👻', isBoss: false,
  resistances: ['acid', 'cold', 'fire', 'lightning', 'thunder', 'bludgeoning', 'piercing', 'slashing'],
  immunities: ['necrotic', 'poison'],
  conditionImmunities: ['charmed', 'exhaustion', 'grappled', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained', 'unconscious'],
  description: 'Esprit frappeur qui lance des objets.',
  skills: [
    { id: 'forceful_slam', name: 'Choc télékinétique', damage: 10, damageType: 'force', type: 'attack', description: 'Lance des objets' },
    { id: 'telekinetic_thrust', name: 'Poussée télékinétique', damage: 0, damageType: 'force', type: 'debuff', description: 'Repousse la cible', savingThrow: { ability: 'strength', dc: 12 } }
  ]
};

const WILL_O_WISP: Monster = {
  id: 'will_o_wisp', name: 'Feu Follet', hp: 22, maxHp: 22, armorClass: 19,
  abilities: createAbilities(1, 28, 10, 13, 14, 11),
  speed: 0,
  challengeRating: 2, xpReward: 450, creatureType: 'undead', size: 'tiny', portrait: '💡', isBoss: false,
  resistances: ['acid', 'cold', 'fire', 'necrotic', 'thunder'],
  immunities: ['lightning', 'poison'],
  conditionImmunities: ['exhaustion', 'grappled', 'paralyzed', 'poisoned', 'prone', 'restrained', 'unconscious'],
  description: 'Lumière spectrale attirant les voyageurs à leur perte.',
  skills: [{ id: 'shock', name: 'Choc', damage: 12, damageType: 'lightning', type: 'attack', description: 'Décharge électrique' }]
};

const VAMPIRE_SPAWN: Monster = {
  id: 'vampire_spawn', name: 'Vampirien', hp: 82, maxHp: 82, armorClass: 15,
  abilities: createAbilities(16, 16, 16, 11, 10, 12),
  speed: 30,
  challengeRating: 5, xpReward: 1800, creatureType: 'undead', size: 'medium', portrait: '🧛', isBoss: false,
  resistances: ['necrotic'], immunities: ['poison'],
  conditionImmunities: ['poisoned'],
  description: 'Serviteur vampire, moins puissant que son créateur.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 12, damageType: 'piercing', type: 'attack', description: 'Morsure drainante' },
    { id: 'claws', name: 'Griffes', damage: 14, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 }
  ]
};

const ZOMBIE_OGRE: Monster = {
  id: 'zombie_ogre', name: 'Ogre Zombie', hp: 85, maxHp: 85, armorClass: 8,
  abilities: createAbilities(19, 6, 18, 3, 6, 5),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'undead', size: 'large', portrait: '🧟', isBoss: false,
  immunities: ['poison'], conditionImmunities: ['poisoned'],
  description: 'Ogre mort-vivant à la force brute.',
  skills: [{ id: 'morningstar', name: 'Morgenstern', damage: 16, damageType: 'bludgeoning', type: 'attack', description: 'Masse d\'armes' }]
};

const BONEYARD_HULK: Monster = {
  id: 'boneyard_hulk', name: 'Colosse d\'Os', hp: 95, maxHp: 95, armorClass: 16,
  abilities: createAbilities(20, 9, 18, 5, 10, 5),
  speed: 30,
  challengeRating: 5, xpReward: 1800, creatureType: 'undead', size: 'large', portrait: '💀', isBoss: false,
  immunities: ['poison'], conditionImmunities: ['exhaustion', 'poisoned'],
  description: 'Amas d\'ossements assemblés en créature géante.',
  skills: [{ id: 'slam', name: 'Coup', damage: 18, damageType: 'bludgeoning', type: 'attack', description: 'Frappe osseuse', attackCount: 2 }]
};

// ============================================
// CRÉATURES MARITIMES
// ============================================

const MERFOLK: Monster = {
  id: 'merfolk', name: 'Triton', hp: 11, maxHp: 11, armorClass: 11,
  abilities: createAbilities(10, 13, 12, 11, 11, 12),
  speed: 10,
  challengeRating: 0.125, xpReward: 25, creatureType: 'humanoid', size: 'medium', portrait: '🧜', isBoss: false,
  description: 'Habitant des mers mi-humain mi-poisson.',
  skills: [{ id: 'spear', name: 'Lance', damage: 6, damageType: 'piercing', type: 'attack', description: 'Lance marine' }]
};

const SAHUAGIN: Monster = {
  id: 'sahuagin', name: 'Sahuagin', hp: 22, maxHp: 22, armorClass: 12,
  abilities: createAbilities(13, 11, 12, 12, 13, 9),
  speed: 30,
  challengeRating: 0.5, xpReward: 100, creatureType: 'humanoid', size: 'medium', portrait: '🦈', isBoss: false,
  description: 'Homme-requin féroce des profondeurs.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 8, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claws', name: 'Griffes', damage: 6, damageType: 'slashing', type: 'attack', description: 'Griffes' },
    { id: 'spear', name: 'Lance', damage: 8, damageType: 'piercing', type: 'attack', description: 'Lance' }
  ]
};

const SAHUAGIN_BARON: Monster = {
  id: 'sahuagin_baron', name: 'Baron Sahuagin', hp: 76, maxHp: 76, armorClass: 16,
  abilities: createAbilities(19, 15, 16, 14, 13, 17),
  speed: 30,
  challengeRating: 5, xpReward: 1800, creatureType: 'humanoid', size: 'large', portrait: '🦈', isBoss: false,
  description: 'Noble sahuagin à quatre bras.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 14, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claw', name: 'Griffe', damage: 12, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 4 },
    { id: 'trident', name: 'Trident', damage: 14, damageType: 'piercing', type: 'attack', description: 'Trident', attackCount: 2 }
  ]
};

const SEA_SPAWN: Monster = {
  id: 'sea_spawn', name: 'Rejeton des Mers', hp: 32, maxHp: 32, armorClass: 11,
  abilities: createAbilities(15, 8, 15, 6, 10, 8),
  speed: 20,
  challengeRating: 1, xpReward: 200, creatureType: 'monstrosity', size: 'medium', portrait: '🐙', isBoss: false,
  description: 'Humain transformé par la magie des profondeurs.',
  skills: [
    { id: 'unarmed', name: 'Frappe', damage: 10, damageType: 'bludgeoning', type: 'attack', description: 'Coup' },
    { id: 'piscine_anatomy', name: 'Anatomie piscine', damage: 8, damageType: 'slashing', type: 'attack', description: 'Nageoires tranchantes' }
  ]
};

const DEEP_SCION: Monster = {
  id: 'deep_scion', name: 'Scion des Profondeurs', hp: 67, maxHp: 67, armorClass: 11,
  abilities: createAbilities(18, 13, 16, 10, 12, 14),
  speed: 30,
  challengeRating: 3, xpReward: 700, creatureType: 'humanoid', size: 'medium', portrait: '🌊', isBoss: false,
  description: 'Infiltrateur des cultes marins.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 12, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claw', name: 'Griffe', damage: 10, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 },
    { id: 'psychic_screech', name: 'Cri psychique', damage: 14, damageType: 'psychic', type: 'attack', description: 'Hurlement mental', areaOfEffect: true, savingThrow: { ability: 'wisdom', dc: 13 } }
  ]
};

const MORKOTH: Monster = {
  id: 'morkoth', name: 'Morkoth', hp: 130, maxHp: 130, armorClass: 17,
  abilities: createAbilities(14, 14, 14, 20, 15, 13),
  speed: 25,
  challengeRating: 11, xpReward: 7200, creatureType: 'aberration', size: 'medium', portrait: '🦑', isBoss: true,
  description: 'Aberration collectionneure obsessionnelle.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 14, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'tentacles', name: 'Tentacules', damage: 18, damageType: 'bludgeoning', type: 'attack', description: 'Tentacules', attackCount: 3 },
    { id: 'hypnosis', name: 'Hypnose', damage: 0, damageType: 'psychic', type: 'debuff', description: 'Charme la cible', savingThrow: { ability: 'wisdom', dc: 17 } }
  ],
  ultimateSkill: { id: 'spell_reflection', name: 'Réflexion de Sort', damage: 35, damageType: 'force', type: 'special', description: 'Renvoie un sort' }
};

// ============================================
// ÉLÉMENTAIRES SUPPLÉMENTAIRES
// ============================================

const DUST_MEPHIT: Monster = {
  id: 'dust_mephit', name: 'Méphite de Poussière', hp: 17, maxHp: 17, armorClass: 12,
  abilities: createAbilities(5, 14, 10, 9, 11, 10),
  speed: 30,
  challengeRating: 0.5, xpReward: 100, creatureType: 'elemental', size: 'small', portrait: '💨', isBoss: false,
  vulnerabilities: ['fire'], immunities: ['poison'], conditionImmunities: ['poisoned'],
  description: 'Petit élémentaire de poussière espiègle.',
  skills: [
    { id: 'claws', name: 'Griffes', damage: 6, damageType: 'slashing', type: 'attack', description: 'Griffes' },
    { id: 'blinding_breath', name: 'Souffle aveuglant', damage: 0, damageType: 'force', type: 'debuff', description: 'Nuage aveuglant', recharge: { min: 6 }, savingThrow: { ability: 'dexterity', dc: 10 } }
  ]
};

const ICE_MEPHIT: Monster = {
  id: 'ice_mephit', name: 'Méphite de Glace', hp: 21, maxHp: 21, armorClass: 11,
  abilities: createAbilities(7, 13, 10, 9, 11, 12),
  speed: 30,
  challengeRating: 0.5, xpReward: 100, creatureType: 'elemental', size: 'small', portrait: '❄️', isBoss: false,
  vulnerabilities: ['bludgeoning', 'fire'], immunities: ['cold', 'poison'], conditionImmunities: ['poisoned'],
  description: 'Petit élémentaire de glace malicieux.',
  skills: [
    { id: 'claws', name: 'Griffes', damage: 6, damageType: 'slashing', type: 'attack', description: 'Griffes' },
    { id: 'frost_breath', name: 'Souffle de givre', damage: 8, damageType: 'cold', type: 'attack', description: 'Cône glacé', recharge: { min: 6 }, savingThrow: { ability: 'dexterity', dc: 10 } }
  ]
};

const MAGMA_MEPHIT: Monster = {
  id: 'magma_mephit', name: 'Méphite de Magma', hp: 22, maxHp: 22, armorClass: 11,
  abilities: createAbilities(8, 12, 12, 7, 10, 10),
  speed: 30,
  challengeRating: 0.5, xpReward: 100, creatureType: 'elemental', size: 'small', portrait: '🔥', isBoss: false,
  vulnerabilities: ['cold'], immunities: ['fire', 'poison'], conditionImmunities: ['poisoned'],
  description: 'Petit élémentaire de magma ardent.',
  skills: [
    { id: 'claws', name: 'Griffes', damage: 8, damageType: 'slashing', type: 'attack', description: 'Griffes brûlantes' },
    { id: 'fire_breath', name: 'Souffle de feu', damage: 10, damageType: 'fire', type: 'attack', description: 'Cône de feu', recharge: { min: 6 }, savingThrow: { ability: 'dexterity', dc: 11 } }
  ]
};

const MUD_MEPHIT: Monster = {
  id: 'mud_mephit', name: 'Méphite de Boue', hp: 27, maxHp: 27, armorClass: 11,
  abilities: createAbilities(8, 12, 12, 9, 11, 7),
  speed: 20,
  challengeRating: 0.25, xpReward: 50, creatureType: 'elemental', size: 'small', portrait: '🟤', isBoss: false,
  immunities: ['poison'], conditionImmunities: ['poisoned'],
  description: 'Petit élémentaire de boue lent.',
  skills: [
    { id: 'fists', name: 'Poings', damage: 6, damageType: 'bludgeoning', type: 'attack', description: 'Coups' },
    { id: 'mud_breath', name: 'Souffle de boue', damage: 0, damageType: 'force', type: 'debuff', description: 'Entrave la cible', recharge: { min: 6 }, savingThrow: { ability: 'dexterity', dc: 11 } }
  ]
};

const STEAM_MEPHIT: Monster = {
  id: 'steam_mephit', name: 'Méphite de Vapeur', hp: 21, maxHp: 21, armorClass: 10,
  abilities: createAbilities(5, 11, 10, 11, 10, 12),
  speed: 30,
  challengeRating: 0.25, xpReward: 50, creatureType: 'elemental', size: 'small', portrait: '♨️', isBoss: false,
  immunities: ['fire', 'poison'], conditionImmunities: ['poisoned'],
  description: 'Petit élémentaire de vapeur brûlante.',
  skills: [
    { id: 'claws', name: 'Griffes', damage: 6, damageType: 'slashing', type: 'attack', description: 'Griffes' },
    { id: 'steam_breath', name: 'Souffle de vapeur', damage: 8, damageType: 'fire', type: 'attack', description: 'Cône brûlant', recharge: { min: 6 }, savingThrow: { ability: 'dexterity', dc: 10 } }
  ]
};

const SMOKE_MEPHIT: Monster = {
  id: 'smoke_mephit', name: 'Méphite de Fumée', hp: 22, maxHp: 22, armorClass: 12,
  abilities: createAbilities(6, 14, 12, 10, 10, 11),
  speed: 30,
  challengeRating: 0.25, xpReward: 50, creatureType: 'elemental', size: 'small', portrait: '💨', isBoss: false,
  immunities: ['fire', 'poison'], conditionImmunities: ['poisoned'],
  description: 'Petit élémentaire de fumée étouffante.',
  skills: [
    { id: 'claws', name: 'Griffes', damage: 6, damageType: 'slashing', type: 'attack', description: 'Griffes' },
    { id: 'cinder_breath', name: 'Souffle de cendres', damage: 0, damageType: 'fire', type: 'debuff', description: 'Nuage aveuglant', recharge: { min: 6 }, savingThrow: { ability: 'dexterity', dc: 10 } }
  ]
};

const GALEB_DUHR: Monster = {
  id: 'galeb_duhr', name: 'Galeb Duhr', hp: 85, maxHp: 85, armorClass: 16,
  abilities: createAbilities(20, 14, 20, 11, 12, 11),
  speed: 15,
  challengeRating: 6, xpReward: 2300, creatureType: 'elemental', size: 'medium', portrait: '🪨', isBoss: false,
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  immunities: ['poison'], conditionImmunities: ['exhaustion', 'paralyzed', 'poisoned', 'petrified'],
  description: 'Élémentaire de terre ressemblant à un rocher.',
  skills: [
    { id: 'slam', name: 'Coup', damage: 16, damageType: 'bludgeoning', type: 'attack', description: 'Frappe de pierre', attackCount: 2 },
    { id: 'animate_boulders', name: 'Animer les rochers', damage: 0, damageType: 'force', type: 'buff', description: 'Éveille des rochers' }
  ]
};

const AZER: Monster = {
  id: 'azer', name: 'Azer', hp: 39, maxHp: 39, armorClass: 17,
  abilities: createAbilities(17, 12, 15, 12, 13, 10),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'elemental', size: 'medium', portrait: '🔥', isBoss: false,
  immunities: ['fire', 'poison'], conditionImmunities: ['poisoned'],
  description: 'Forgeron élémentaire du Plan du Feu.',
  skills: [{ id: 'warhammer', name: 'Marteau de guerre', damage: 14, damageType: 'bludgeoning', type: 'attack', description: 'Marteau brûlant' }]
};

// ============================================
// YUGOLOTHS (Fiélons neutres maléfiques)
// ============================================

const MEZZOLOTH: Monster = {
  id: 'mezzoloth', name: 'Mezzoloth', hp: 75, maxHp: 75, armorClass: 18,
  abilities: createAbilities(18, 11, 16, 7, 10, 11),
  speed: 40,
  challengeRating: 5, xpReward: 1800, creatureType: 'fiend', size: 'medium', portrait: '🪲', isBoss: false,
  resistances: ['cold', 'fire', 'lightning'], immunities: ['acid', 'poison'], conditionImmunities: ['poisoned'],
  description: 'Soldat yugoloth insectoïde mercenaire.',
  skills: [
    { id: 'trident', name: 'Trident', damage: 14, damageType: 'piercing', type: 'attack', description: 'Trident', attackCount: 2 },
    { id: 'claws', name: 'Griffes', damage: 10, damageType: 'slashing', type: 'attack', description: 'Griffes' }
  ]
};

const NYCALOTH: Monster = {
  id: 'nycaloth', name: 'Nycaloth', hp: 123, maxHp: 123, armorClass: 18,
  abilities: createAbilities(20, 11, 19, 12, 10, 15),
  speed: 40,
  challengeRating: 9, xpReward: 5000, creatureType: 'fiend', size: 'large', portrait: '🦇', isBoss: false,
  resistances: ['cold', 'fire', 'lightning'], immunities: ['acid', 'poison'], conditionImmunities: ['poisoned'],
  description: 'Yugoloth volant aux ailes vertes, assassin aérien.',
  skills: [
    { id: 'greataxe', name: 'Hache', damage: 20, damageType: 'slashing', type: 'attack', description: 'Grande hache', attackCount: 2 },
    { id: 'claws', name: 'Griffes', damage: 14, damageType: 'slashing', type: 'attack', description: 'Griffes' }
  ]
};

const ARCANALOTH: Monster = {
  id: 'arcanaloth', name: 'Arcanaloth', hp: 104, maxHp: 104, armorClass: 17,
  abilities: createAbilities(17, 12, 14, 20, 16, 17),
  speed: 30,
  challengeRating: 12, xpReward: 8400, creatureType: 'fiend', size: 'medium', portrait: '🦊', isBoss: true,
  resistances: ['cold', 'fire'], immunities: ['acid', 'poison'], conditionImmunities: ['charmed', 'poisoned'],
  description: 'Yugoloth érudit, négociateur de contrats infernaux.',
  skills: [
    { id: 'claws', name: 'Griffes', damage: 14, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 },
    { id: 'finger_of_death', name: 'Doigt de mort', damage: 35, damageType: 'necrotic', type: 'attack', description: 'Sort mortel', savingThrow: { ability: 'constitution', dc: 17 } }
  ],
  ultimateSkill: { id: 'contract_breach', name: 'Rupture de Contrat', damage: 45, damageType: 'psychic', type: 'special', description: 'Maudit ceux qui brisent leurs serments' }
};

const ULTROLOTH: Monster = {
  id: 'ultroloth', name: 'Ultroloth', hp: 153, maxHp: 153, armorClass: 19,
  abilities: createAbilities(16, 16, 18, 18, 15, 19),
  speed: 30,
  challengeRating: 13, xpReward: 10000, creatureType: 'fiend', size: 'medium', portrait: '👁️', isBoss: true,
  resistances: ['cold', 'fire', 'lightning'], immunities: ['acid', 'poison'], conditionImmunities: ['charmed', 'frightened', 'poisoned'],
  description: 'Général yugoloth aux yeux hypnotiques.',
  legendaryActionsPerTurn: 3,
  legendaryActions: [
    { id: 'hypnotic_gaze', name: 'Regard hypnotique', cost: 1, damage: 0, damageType: 'psychic', description: 'Charme une cible' },
    { id: 'teleport', name: 'Téléportation', cost: 2, damage: 0, damageType: 'force', description: 'Se téléporte' }
  ],
  skills: [
    { id: 'longsword', name: 'Épée', damage: 18, damageType: 'slashing', type: 'attack', description: 'Épée', attackCount: 3 },
    { id: 'fire_storm', name: 'Tempête de feu', damage: 30, damageType: 'fire', type: 'attack', description: 'Flammes infernales', areaOfEffect: true }
  ],
  ultimateSkill: { id: 'soul_harvest', name: 'Moisson d\'Âmes', damage: 55, damageType: 'necrotic', type: 'special', description: 'Arrache les âmes' }
};

// ============================================
// DROWS ET ELFES NOIRS
// ============================================

const DROW: Monster = {
  id: 'drow', name: 'Drow', hp: 13, maxHp: 13, armorClass: 15,
  abilities: createAbilities(10, 14, 10, 11, 11, 12),
  speed: 30,
  challengeRating: 0.25, xpReward: 50, creatureType: 'humanoid', size: 'medium', portrait: '🧝', isBoss: false,
  description: 'Elfe noir des profondeurs.',
  skills: [
    { id: 'shortsword', name: 'Épée courte', damage: 8, damageType: 'piercing', type: 'attack', description: 'Lame empoisonnée' },
    { id: 'hand_crossbow', name: 'Arbalète de poing', damage: 6, damageType: 'piercing', type: 'attack', description: 'Carreau empoisonné' }
  ]
};

const DROW_ELITE_WARRIOR: Monster = {
  id: 'drow_elite_warrior', name: 'Guerrier d\'Élite Drow', hp: 71, maxHp: 71, armorClass: 18,
  abilities: createAbilities(13, 18, 14, 11, 13, 12),
  speed: 30,
  challengeRating: 5, xpReward: 1800, creatureType: 'humanoid', size: 'medium', portrait: '⚔️', isBoss: false,
  description: 'Guerrier drow d\'élite aux techniques mortelles.',
  skills: [
    { id: 'shortsword', name: 'Épée courte', damage: 14, damageType: 'piercing', type: 'attack', description: 'Lame double', attackCount: 2 },
    { id: 'hand_crossbow', name: 'Arbalète de poing', damage: 10, damageType: 'piercing', type: 'attack', description: 'Carreau empoisonné' }
  ]
};

const DROW_MAGE: Monster = {
  id: 'drow_mage', name: 'Mage Drow', hp: 45, maxHp: 45, armorClass: 12,
  abilities: createAbilities(9, 14, 10, 17, 13, 12),
  speed: 30,
  challengeRating: 7, xpReward: 2900, creatureType: 'humanoid', size: 'medium', portrait: '🔮', isBoss: false,
  description: 'Lanceur de sorts drow aux pouvoirs ténébreux.',
  skills: [
    { id: 'staff', name: 'Bâton', damage: 8, damageType: 'bludgeoning', type: 'attack', description: 'Bâton' },
    { id: 'lightning_bolt', name: 'Éclair', damage: 28, damageType: 'lightning', type: 'attack', description: 'Sort de foudre', savingThrow: { ability: 'dexterity', dc: 14 } },
    { id: 'darkness', name: 'Ténèbres', damage: 0, damageType: 'necrotic', type: 'debuff', description: 'Zone de ténèbres' }
  ]
};

const DROW_PRIESTESS: Monster = {
  id: 'drow_priestess', name: 'Prêtresse Drow', hp: 71, maxHp: 71, armorClass: 16,
  abilities: createAbilities(10, 14, 12, 13, 17, 18),
  speed: 30,
  challengeRating: 8, xpReward: 3900, creatureType: 'humanoid', size: 'medium', portrait: '🕷️', isBoss: false,
  description: 'Prêtresse de Lolth aux pouvoirs divins.',
  skills: [
    { id: 'scourge', name: 'Fouet à serpents', damage: 14, damageType: 'piercing', type: 'attack', description: 'Fouet empoisonné' },
    { id: 'spirit_guardians', name: 'Esprits gardiens', damage: 18, damageType: 'radiant', type: 'attack', description: 'Aura divine', areaOfEffect: true },
    { id: 'harm', name: 'Blessure', damage: 26, damageType: 'necrotic', type: 'attack', description: 'Sort de blessure' }
  ]
};

const DRAEGLOTH: Monster = {
  id: 'draegloth', name: 'Draegloth', hp: 123, maxHp: 123, armorClass: 15,
  abilities: createAbilities(20, 15, 18, 13, 11, 11),
  speed: 30,
  challengeRating: 7, xpReward: 2900, creatureType: 'fiend', size: 'large', portrait: '👿', isBoss: false,
  resistances: ['cold', 'fire', 'lightning'], immunities: ['poison'], conditionImmunities: ['poisoned'],
  description: 'Demi-démon drow, serviteur de Lolth.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 18, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claw', name: 'Griffe', damage: 16, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 }
  ]
};

// ============================================
// INSECTES GÉANTS ET VERMINES
// ============================================

const GIANT_CENTIPEDE: Monster = {
  id: 'giant_centipede', name: 'Mille-Pattes Géant', hp: 4, maxHp: 4, armorClass: 13,
  abilities: createAbilities(5, 14, 12, 1, 7, 3),
  speed: 30,
  challengeRating: 0.25, xpReward: 50, creatureType: 'beast', size: 'small', portrait: '🐛', isBoss: false,
  description: 'Arthropode venimeux géant.',
  skills: [{ id: 'bite', name: 'Morsure', damage: 6, damageType: 'piercing', type: 'attack', description: 'Morsure empoisonnée' }]
};

const GIANT_WASP: Monster = {
  id: 'giant_wasp', name: 'Guêpe Géante', hp: 13, maxHp: 13, armorClass: 12,
  abilities: createAbilities(10, 14, 10, 1, 10, 3),
  speed: 10,
  challengeRating: 0.5, xpReward: 100, creatureType: 'beast', size: 'medium', portrait: '🐝', isBoss: false,
  description: 'Insecte volant au dard mortel.',
  skills: [{ id: 'sting', name: 'Dard', damage: 10, damageType: 'piercing', type: 'attack', description: 'Dard empoisonné' }]
};

const ANKHEG_QUEEN: Monster = {
  id: 'ankheg_queen', name: 'Reine Ankheg', hp: 150, maxHp: 150, armorClass: 15,
  abilities: createAbilities(20, 10, 18, 2, 14, 8),
  speed: 30,
  challengeRating: 8, xpReward: 3900, creatureType: 'monstrosity', size: 'huge', portrait: '🦗', isBoss: true,
  description: 'Reine de la colonie ankheg.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 24, damageType: 'slashing', type: 'attack', description: 'Mandibules' },
    { id: 'acid_spray', name: 'Jet d\'acide', damage: 30, damageType: 'acid', type: 'attack', description: 'Acide corrosif', areaOfEffect: true, recharge: { min: 5 }, savingThrow: { ability: 'dexterity', dc: 15 } }
  ],
  ultimateSkill: { id: 'swarm_call', name: 'Appel de l\'Essaim', damage: 40, damageType: 'piercing', type: 'special', description: 'Invoque des ankhegs' }
};

const CARRION_CRAWLER: Monster = {
  id: 'carrion_crawler', name: 'Charognard Rampant', hp: 51, maxHp: 51, armorClass: 13,
  abilities: createAbilities(14, 13, 16, 1, 12, 5),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'monstrosity', size: 'large', portrait: '🐛', isBoss: false,
  description: 'Charognard aux tentacules paralysants.',
  skills: [
    { id: 'tentacles', name: 'Tentacules', damage: 8, damageType: 'poison', type: 'attack', description: 'Tentacules paralysants', attackCount: 2 },
    { id: 'bite', name: 'Morsure', damage: 10, damageType: 'piercing', type: 'attack', description: 'Morsure' }
  ]
};

const CAVE_FISHER: Monster = {
  id: 'cave_fisher', name: 'Pêcheur des Cavernes', hp: 58, maxHp: 58, armorClass: 16,
  abilities: createAbilities(16, 13, 14, 3, 10, 3),
  speed: 20,
  challengeRating: 3, xpReward: 700, creatureType: 'monstrosity', size: 'medium', portrait: '🦞', isBoss: false,
  description: 'Crustacé souterrain aux filaments collants.',
  skills: [
    { id: 'claw', name: 'Pince', damage: 14, damageType: 'bludgeoning', type: 'attack', description: 'Pince', attackCount: 2 },
    { id: 'filament', name: 'Filament', damage: 0, damageType: 'force', type: 'debuff', description: 'Tire la proie' }
  ]
};

const ROPER: Monster = {
  id: 'roper', name: 'Roper', hp: 93, maxHp: 93, armorClass: 20,
  abilities: createAbilities(18, 8, 17, 7, 16, 6),
  speed: 10,
  challengeRating: 5, xpReward: 1800, creatureType: 'monstrosity', size: 'large', portrait: '🪨', isBoss: false,
  description: 'Prédateur stalagmite aux tentacules.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 24, damageType: 'piercing', type: 'attack', description: 'Mâchoire géante' },
    { id: 'tendril', name: 'Tentacule', damage: 8, damageType: 'bludgeoning', type: 'attack', description: 'Vrille gluante', attackCount: 4 }
  ]
};

const PIERCER: Monster = {
  id: 'piercer', name: 'Perforateur', hp: 22, maxHp: 22, armorClass: 15,
  abilities: createAbilities(10, 13, 16, 1, 7, 3),
  speed: 5,
  challengeRating: 0.5, xpReward: 100, creatureType: 'monstrosity', size: 'medium', portrait: '📌', isBoss: false,
  description: 'Stalactite vivante qui se laisse tomber.',
  skills: [{ id: 'drop', name: 'Chute', damage: 14, damageType: 'piercing', type: 'attack', description: 'Chute mortelle' }]
};

// ============================================
// GÉANTS SUPPLÉMENTAIRES
// ============================================

const CYCLOPS: Monster = {
  id: 'cyclops', name: 'Cyclope', hp: 138, maxHp: 138, armorClass: 14,
  abilities: createAbilities(22, 11, 20, 8, 6, 10),
  speed: 30,
  challengeRating: 6, xpReward: 2300, creatureType: 'giant', size: 'huge', portrait: '👁️', isBoss: false,
  description: 'Géant à un œil, berger solitaire.',
  skills: [
    { id: 'greatclub', name: 'Gourdin', damage: 22, damageType: 'bludgeoning', type: 'attack', description: 'Massue géante', attackCount: 2 },
    { id: 'rock', name: 'Rocher', damage: 20, damageType: 'bludgeoning', type: 'attack', description: 'Lance un rocher' }
  ]
};

const FOMORIAN: Monster = {
  id: 'fomorian', name: 'Fomorien', hp: 149, maxHp: 149, armorClass: 14,
  abilities: createAbilities(23, 10, 20, 9, 14, 6),
  speed: 30,
  challengeRating: 8, xpReward: 3900, creatureType: 'giant', size: 'huge', portrait: '👹', isBoss: false,
  description: 'Géant féerique difforme et maudit.',
  skills: [
    { id: 'greatclub', name: 'Gourdin', damage: 24, damageType: 'bludgeoning', type: 'attack', description: 'Massue', attackCount: 2 },
    { id: 'evil_eye', name: 'Œil maléfique', damage: 28, damageType: 'psychic', type: 'attack', description: 'Regard maudit', savingThrow: { ability: 'charisma', dc: 14 } }
  ]
};

const GIANT_OGRE: Monster = {
  id: 'giant_ogre', name: 'Ogre Géant', hp: 59, maxHp: 59, armorClass: 11,
  abilities: createAbilities(19, 8, 16, 5, 7, 7),
  speed: 40,
  challengeRating: 2, xpReward: 450, creatureType: 'giant', size: 'large', portrait: '👹', isBoss: false,
  description: 'Ogre plus grand et plus brutal que la moyenne.',
  skills: [{ id: 'greatclub', name: 'Gourdin', damage: 16, damageType: 'bludgeoning', type: 'attack', description: 'Massue géante' }]
};

const OGRE_ZOMBIE: Monster = {
  id: 'ogre_zombie_giant', name: 'Ogre Zombie Géant', hp: 85, maxHp: 85, armorClass: 8,
  abilities: createAbilities(19, 6, 18, 3, 6, 5),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'undead', size: 'large', portrait: '🧟', isBoss: false,
  immunities: ['poison'], conditionImmunities: ['poisoned'],
  description: 'Ogre mort-vivant à la force brute.',
  skills: [{ id: 'morningstar', name: 'Morgenstern', damage: 16, damageType: 'bludgeoning', type: 'attack', description: 'Masse d\'armes' }]
};

const DIRE_TROLL: Monster = {
  id: 'dire_troll', name: 'Troll Terrifiant', hp: 172, maxHp: 172, armorClass: 15,
  abilities: createAbilities(22, 15, 21, 9, 11, 5),
  speed: 40,
  challengeRating: 13, xpReward: 10000, creatureType: 'giant', size: 'huge', portrait: '🧟‍♂️', isBoss: true,
  description: 'Troll mutant aux six bras régénérants.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 22, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claw', name: 'Griffe', damage: 18, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 6 }
  ],
  ultimateSkill: { id: 'rampage', name: 'Déchaînement', damage: 60, damageType: 'slashing', type: 'special', description: 'Frénésie de griffes' }
};

// ============================================
// CRÉATURES PLANAIRES SUPPLÉMENTAIRES
// ============================================

const GITHZERAI_MONK: Monster = {
  id: 'githzerai_monk', name: 'Moine Githzerai', hp: 38, maxHp: 38, armorClass: 14,
  abilities: createAbilities(12, 15, 12, 13, 14, 10),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'humanoid', size: 'medium', portrait: '🧘', isBoss: false,
  description: 'Moine psychique de Limbo.',
  skills: [
    { id: 'unarmed_strike', name: 'Frappe à mains nues', damage: 10, damageType: 'bludgeoning', type: 'attack', description: 'Arts martiaux', attackCount: 2 },
    { id: 'psychic_defense', name: 'Défense psychique', damage: 0, damageType: 'psychic', type: 'buff', description: 'Bouclier mental' }
  ]
};

const GITHYANKI_WARRIOR: Monster = {
  id: 'githyanki_warrior', name: 'Guerrier Githyanki', hp: 49, maxHp: 49, armorClass: 17,
  abilities: createAbilities(15, 14, 12, 13, 13, 10),
  speed: 30,
  challengeRating: 3, xpReward: 700, creatureType: 'humanoid', size: 'medium', portrait: '⚔️', isBoss: false,
  description: 'Guerrier psychique du Plan Astral.',
  skills: [
    { id: 'greatsword', name: 'Épée à deux mains', damage: 16, damageType: 'slashing', type: 'attack', description: 'Lame d\'argent', attackCount: 2 }
  ]
};

const GITHYANKI_KNIGHT: Monster = {
  id: 'githyanki_knight', name: 'Chevalier Githyanki', hp: 91, maxHp: 91, armorClass: 18,
  abilities: createAbilities(16, 14, 15, 14, 14, 15),
  speed: 30,
  challengeRating: 8, xpReward: 3900, creatureType: 'humanoid', size: 'medium', portrait: '🗡️', isBoss: false,
  description: 'Chevalier d\'élite githyanki.',
  skills: [
    { id: 'silver_greatsword', name: 'Épée d\'argent', damage: 20, damageType: 'slashing', type: 'attack', description: 'Lame psychique', attackCount: 3 },
    { id: 'telekinetic_thrust', name: 'Poussée télékinétique', damage: 14, damageType: 'force', type: 'attack', description: 'Force mentale' }
  ]
};

const SLAAD_RED: Monster = {
  id: 'slaad_red', name: 'Slaad Rouge', hp: 93, maxHp: 93, armorClass: 14,
  abilities: createAbilities(16, 12, 16, 6, 6, 7),
  speed: 30,
  challengeRating: 5, xpReward: 1800, creatureType: 'aberration', size: 'large', portrait: '🐸', isBoss: false,
  resistances: ['acid', 'cold', 'fire', 'lightning', 'thunder'],
  description: 'Batracien chaotique de Limbo.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 14, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claw', name: 'Griffe', damage: 12, damageType: 'slashing', type: 'attack', description: 'Griffes implantantes', attackCount: 2 }
  ]
};

const SLAAD_BLUE: Monster = {
  id: 'slaad_blue', name: 'Slaad Bleu', hp: 123, maxHp: 123, armorClass: 15,
  abilities: createAbilities(20, 15, 18, 7, 7, 9),
  speed: 30,
  challengeRating: 7, xpReward: 2900, creatureType: 'aberration', size: 'large', portrait: '🐸', isBoss: false,
  resistances: ['acid', 'cold', 'fire', 'lightning', 'thunder'],
  description: 'Slaad plus intelligent et dangereux.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 16, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claw', name: 'Griffe', damage: 14, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 }
  ]
};

const SLAAD_GREEN: Monster = {
  id: 'slaad_green', name: 'Slaad Vert', hp: 127, maxHp: 127, armorClass: 16,
  abilities: createAbilities(18, 15, 16, 11, 8, 12),
  speed: 30,
  challengeRating: 8, xpReward: 3900, creatureType: 'aberration', size: 'large', portrait: '🐸', isBoss: false,
  resistances: ['acid', 'cold', 'fire', 'lightning', 'thunder'],
  description: 'Slaad évolué aux pouvoirs magiques.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 18, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claw', name: 'Griffe', damage: 16, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 },
    { id: 'fireball', name: 'Boule de feu', damage: 28, damageType: 'fire', type: 'attack', description: 'Sort de feu', areaOfEffect: true, savingThrow: { ability: 'dexterity', dc: 14 } }
  ]
};

const SLAAD_GRAY: Monster = {
  id: 'slaad_gray', name: 'Slaad Gris', hp: 127, maxHp: 127, armorClass: 18,
  abilities: createAbilities(17, 17, 16, 13, 8, 14),
  speed: 30,
  challengeRating: 9, xpReward: 5000, creatureType: 'aberration', size: 'medium', portrait: '🐸', isBoss: false,
  resistances: ['acid', 'cold', 'fire', 'lightning', 'thunder'],
  description: 'Slaad métamorphe à forme humanoïde.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 16, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claw', name: 'Griffe', damage: 14, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 },
    { id: 'plane_shift', name: 'Changement de plan', damage: 0, damageType: 'force', type: 'special', description: 'Téléportation planaire' }
  ]
};

const SLAAD_DEATH: Monster = {
  id: 'slaad_death', name: 'Slaad de la Mort', hp: 170, maxHp: 170, armorClass: 18,
  abilities: createAbilities(20, 15, 19, 15, 10, 16),
  speed: 30,
  challengeRating: 10, xpReward: 5900, creatureType: 'aberration', size: 'medium', portrait: '💀', isBoss: true,
  resistances: ['acid', 'cold', 'fire', 'lightning', 'thunder'],
  description: 'Slaad ultime, maître du chaos.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 20, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claw', name: 'Griffe', damage: 18, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 },
    { id: 'cloudkill', name: 'Nuage mortel', damage: 28, damageType: 'poison', type: 'attack', description: 'Gaz toxique', areaOfEffect: true, savingThrow: { ability: 'constitution', dc: 16 } }
  ],
  ultimateSkill: { id: 'chaos_phage', name: 'Phage du Chaos', damage: 50, damageType: 'necrotic', type: 'special', description: 'Infection chaotique mortelle' }
};

const MODRON_MONODRONE: Monster = {
  id: 'modron_monodrone', name: 'Monodrone', hp: 5, maxHp: 5, armorClass: 15,
  abilities: createAbilities(10, 13, 12, 4, 10, 5),
  speed: 30,
  challengeRating: 0.125, xpReward: 25, creatureType: 'construct', size: 'medium', portrait: '⚙️', isBoss: false,
  description: 'Construct mécanique de Mechanus.',
  skills: [{ id: 'dagger', name: 'Dague', damage: 4, damageType: 'piercing', type: 'attack', description: 'Dague' }]
};

const MODRON_PENTADRONE: Monster = {
  id: 'modron_pentadrone', name: 'Pentadrone', hp: 32, maxHp: 32, armorClass: 15,
  abilities: createAbilities(15, 14, 12, 10, 10, 13),
  speed: 40,
  challengeRating: 2, xpReward: 450, creatureType: 'construct', size: 'large', portrait: '⚙️', isBoss: false,
  description: 'Modron à cinq bras coordinateur.',
  skills: [{ id: 'arm', name: 'Bras', damage: 8, damageType: 'bludgeoning', type: 'attack', description: 'Frappe', attackCount: 5 }]
};

// ============================================
// CRÉATURES VARIÉES
// ============================================

const DARKLINGS: Monster = {
  id: 'darkling', name: 'Darkling', hp: 5, maxHp: 5, armorClass: 14,
  abilities: createAbilities(9, 16, 12, 10, 12, 10),
  speed: 30,
  challengeRating: 0.5, xpReward: 100, creatureType: 'fey', size: 'small', portrait: '👤', isBoss: false,
  description: 'Fée maudite craignant la lumière.',
  skills: [{ id: 'dagger', name: 'Dague', damage: 8, damageType: 'piercing', type: 'attack', description: 'Dague' }]
};

const DARKLING_ELDER: Monster = {
  id: 'darkling_elder', name: 'Ancien Darkling', hp: 27, maxHp: 27, armorClass: 15,
  abilities: createAbilities(13, 17, 14, 10, 14, 13),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'fey', size: 'medium', portrait: '👤', isBoss: false,
  description: 'Chef des darklings, maudit par la lumière.',
  skills: [{ id: 'shortsword', name: 'Épée courte', damage: 12, damageType: 'piercing', type: 'attack', description: 'Lame sombre', attackCount: 2 }]
};

const NILBOG: Monster = {
  id: 'nilbog', name: 'Nilbog', hp: 7, maxHp: 7, armorClass: 13,
  abilities: createAbilities(8, 14, 8, 10, 8, 15),
  speed: 30,
  challengeRating: 1, xpReward: 200, creatureType: 'humanoid', size: 'small', portrait: '🤡', isBoss: false,
  description: 'Gobelin possédé par un esprit de chaos.',
  skills: [
    { id: 'staff', name: 'Bâton', damage: 6, damageType: 'bludgeoning', type: 'attack', description: 'Bâton' },
    { id: 'mocking_word', name: 'Mot moqueur', damage: 8, damageType: 'psychic', type: 'attack', description: 'Insulte magique' }
  ]
};

const NORKER: Monster = {
  id: 'norker', name: 'Norker', hp: 16, maxHp: 16, armorClass: 17,
  abilities: createAbilities(13, 10, 13, 8, 8, 7),
  speed: 30,
  challengeRating: 0.5, xpReward: 100, creatureType: 'humanoid', size: 'small', portrait: '👹', isBoss: false,
  description: 'Gobelin à la peau dure comme la pierre.',
  skills: [
    { id: 'morningstar', name: 'Morgenstern', damage: 10, damageType: 'piercing', type: 'attack', description: 'Masse d\'armes' },
    { id: 'bite', name: 'Morsure', damage: 6, damageType: 'piercing', type: 'attack', description: 'Morsure' }
  ]
};

const MEENLOCK: Monster = {
  id: 'meenlock', name: 'Meenlock', hp: 31, maxHp: 31, armorClass: 15,
  abilities: createAbilities(7, 15, 12, 11, 10, 8),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'fey', size: 'small', portrait: '😱', isBoss: false,
  conditionImmunities: ['frightened'],
  description: 'Fée cauchemardesque se nourrissant de terreur.',
  skills: [{ id: 'claw', name: 'Griffe', damage: 10, damageType: 'slashing', type: 'attack', description: 'Griffes paralysantes', attackCount: 2 }]
};

const SKULK: Monster = {
  id: 'skulk', name: 'Skulk', hp: 18, maxHp: 18, armorClass: 14,
  abilities: createAbilities(6, 19, 10, 10, 7, 1),
  speed: 30,
  challengeRating: 0.5, xpReward: 100, creatureType: 'monstrosity', size: 'medium', portrait: '👤', isBoss: false,
  conditionImmunities: ['blinded'],
  description: 'Créature invisible sauf dans la lumière.',
  skills: [{ id: 'claw', name: 'Griffe', damage: 10, damageType: 'slashing', type: 'attack', description: 'Griffes' }]
};

const BANDERHOBB: Monster = {
  id: 'banderhobb', name: 'Banderhobb', hp: 84, maxHp: 84, armorClass: 15,
  abilities: createAbilities(20, 12, 20, 11, 14, 8),
  speed: 30,
  challengeRating: 5, xpReward: 1800, creatureType: 'monstrosity', size: 'large', portrait: '🐸', isBoss: false,
  description: 'Créature de l\'Ombreterre qui avale ses proies.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 18, damageType: 'piercing', type: 'attack', description: 'Mâchoire géante' },
    { id: 'claw', name: 'Griffe', damage: 14, damageType: 'slashing', type: 'attack', description: 'Griffes' },
    { id: 'swallow', name: 'Avaler', damage: 22, damageType: 'bludgeoning', type: 'attack', description: 'Avale une créature' }
  ]
};

const SORROWSWORN_WRETCHED: Monster = {
  id: 'sorrowsworn_wretched', name: 'Pitoyable Affligé', hp: 10, maxHp: 10, armorClass: 15,
  abilities: createAbilities(7, 12, 9, 5, 6, 5),
  speed: 40,
  challengeRating: 0.25, xpReward: 50, creatureType: 'monstrosity', size: 'small', portrait: '😢', isBoss: false,
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  description: 'Manifestation de désespoir de l\'Ombreterre.',
  skills: [{ id: 'bite', name: 'Morsure', damage: 6, damageType: 'piercing', type: 'attack', description: 'Morsure' }]
};

const SORROWSWORN_LONELY: Monster = {
  id: 'sorrowsworn_lonely', name: 'Affligé Solitaire', hp: 112, maxHp: 112, armorClass: 16,
  abilities: createAbilities(16, 12, 17, 6, 11, 6),
  speed: 30,
  challengeRating: 9, xpReward: 5000, creatureType: 'monstrosity', size: 'medium', portrait: '😢', isBoss: false,
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  description: 'Manifestation de solitude mortelle.',
  skills: [
    { id: 'harpoon_arm', name: 'Bras harpon', damage: 20, damageType: 'piercing', type: 'attack', description: 'Harpon de chair', attackCount: 2 }
  ]
};

const SORROWSWORN_ANGRY: Monster = {
  id: 'sorrowsworn_angry', name: 'Affligé Furieux', hp: 255, maxHp: 255, armorClass: 18,
  abilities: createAbilities(17, 10, 19, 8, 13, 6),
  speed: 30,
  challengeRating: 13, xpReward: 10000, creatureType: 'monstrosity', size: 'medium', portrait: '😡', isBoss: true,
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  description: 'Manifestation de rage dévastatrice.',
  skills: [
    { id: 'hook', name: 'Crochet', damage: 22, damageType: 'piercing', type: 'attack', description: 'Crochets de rage', attackCount: 2 }
  ],
  ultimateSkill: { id: 'rage_incarnate', name: 'Rage Incarnée', damage: 60, damageType: 'bludgeoning', type: 'special', description: 'Déchaînement de fureur' }
};

// ============================================
// DRAGONS SUPPLÉMENTAIRES (jeunes et wyrmlings)
// ============================================

const WYRMLING_WHITE: Monster = {
  id: 'wyrmling_white', name: 'Dragonnet Blanc', hp: 32, maxHp: 32, armorClass: 16,
  abilities: createAbilities(14, 10, 14, 5, 10, 11),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'dragon', size: 'medium', portrait: '🐉', isBoss: false,
  immunities: ['cold'], description: 'Jeune dragon blanc, prédateur des glaciers.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 12, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'cold_breath', name: 'Souffle de froid', damage: 16, damageType: 'cold', type: 'attack', description: 'Cône glacial', recharge: { min: 5 }, savingThrow: { ability: 'constitution', dc: 12 } }
  ]
};

const WYRMLING_BLACK: Monster = {
  id: 'wyrmling_black', name: 'Dragonnet Noir', hp: 33, maxHp: 33, armorClass: 17,
  abilities: createAbilities(15, 14, 13, 10, 11, 13),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'dragon', size: 'medium', portrait: '🐉', isBoss: false,
  immunities: ['acid'], description: 'Jeune dragon noir, embusqué dans les marais.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 12, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'acid_breath', name: 'Souffle acide', damage: 16, damageType: 'acid', type: 'attack', description: 'Ligne acide', recharge: { min: 5 }, savingThrow: { ability: 'dexterity', dc: 11 } }
  ]
};

const WYRMLING_GREEN: Monster = {
  id: 'wyrmling_green', name: 'Dragonnet Vert', hp: 38, maxHp: 38, armorClass: 17,
  abilities: createAbilities(15, 12, 13, 14, 11, 13),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'dragon', size: 'medium', portrait: '🐉', isBoss: false,
  immunities: ['poison'], description: 'Jeune dragon vert, manipulateur des forêts.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 12, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'poison_breath', name: 'Souffle de poison', damage: 18, damageType: 'poison', type: 'attack', description: 'Cône empoisonné', recharge: { min: 5 }, savingThrow: { ability: 'constitution', dc: 11 } }
  ]
};

const WYRMLING_BLUE: Monster = {
  id: 'wyrmling_blue', name: 'Dragonnet Bleu', hp: 52, maxHp: 52, armorClass: 17,
  abilities: createAbilities(17, 10, 15, 12, 11, 15),
  speed: 30,
  challengeRating: 3, xpReward: 700, creatureType: 'dragon', size: 'medium', portrait: '🐉', isBoss: false,
  immunities: ['lightning'], description: 'Jeune dragon bleu, tyran des déserts.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 14, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'lightning_breath', name: 'Souffle de foudre', damage: 22, damageType: 'lightning', type: 'attack', description: 'Ligne électrique', recharge: { min: 5 }, savingThrow: { ability: 'dexterity', dc: 12 } }
  ]
};

const WYRMLING_RED: Monster = {
  id: 'wyrmling_red', name: 'Dragonnet Rouge', hp: 75, maxHp: 75, armorClass: 17,
  abilities: createAbilities(19, 10, 17, 12, 11, 15),
  speed: 30,
  challengeRating: 4, xpReward: 1100, creatureType: 'dragon', size: 'medium', portrait: '🐉', isBoss: false,
  immunities: ['fire'], description: 'Jeune dragon rouge, destructeur né.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 16, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'fire_breath', name: 'Souffle de feu', damage: 24, damageType: 'fire', type: 'attack', description: 'Cône de feu', recharge: { min: 5 }, savingThrow: { ability: 'dexterity', dc: 13 } }
  ]
};

const WYRMLING_BRASS: Monster = {
  id: 'wyrmling_brass', name: 'Dragonnet d\'Airain', hp: 16, maxHp: 16, armorClass: 16,
  abilities: createAbilities(15, 10, 13, 10, 11, 13),
  speed: 30,
  challengeRating: 1, xpReward: 200, creatureType: 'dragon', size: 'medium', portrait: '🐉', isBoss: false,
  immunities: ['fire'], description: 'Jeune dragon d\'airain, bavard et amical.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 10, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'breath_weapon', name: 'Souffle', damage: 8, damageType: 'fire', type: 'attack', description: 'Ligne de feu ou souffle soporifique', recharge: { min: 5 }, savingThrow: { ability: 'dexterity', dc: 11 } }
  ]
};

const WYRMLING_BRONZE: Monster = {
  id: 'wyrmling_bronze', name: 'Dragonnet de Bronze', hp: 32, maxHp: 32, armorClass: 17,
  abilities: createAbilities(17, 10, 15, 12, 11, 15),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'dragon', size: 'medium', portrait: '🐉', isBoss: false,
  immunities: ['lightning'], description: 'Jeune dragon de bronze, gardien des côtes.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 12, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'breath_weapon', name: 'Souffle', damage: 14, damageType: 'lightning', type: 'attack', description: 'Ligne de foudre', recharge: { min: 5 }, savingThrow: { ability: 'dexterity', dc: 12 } }
  ]
};

const WYRMLING_COPPER: Monster = {
  id: 'wyrmling_copper', name: 'Dragonnet de Cuivre', hp: 22, maxHp: 22, armorClass: 16,
  abilities: createAbilities(15, 12, 13, 14, 11, 13),
  speed: 30,
  challengeRating: 1, xpReward: 200, creatureType: 'dragon', size: 'medium', portrait: '🐉', isBoss: false,
  immunities: ['acid'], description: 'Jeune dragon de cuivre, farceur et rusé.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 10, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'acid_breath', name: 'Souffle acide', damage: 12, damageType: 'acid', type: 'attack', description: 'Ligne acide', recharge: { min: 5 }, savingThrow: { ability: 'dexterity', dc: 11 } }
  ]
};

const WYRMLING_GOLD: Monster = {
  id: 'wyrmling_gold', name: 'Dragonnet d\'Or', hp: 60, maxHp: 60, armorClass: 17,
  abilities: createAbilities(19, 14, 17, 14, 11, 16),
  speed: 30,
  challengeRating: 3, xpReward: 700, creatureType: 'dragon', size: 'medium', portrait: '🐉', isBoss: false,
  immunities: ['fire'], description: 'Jeune dragon d\'or, noble et juste.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 14, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'fire_breath', name: 'Souffle de feu', damage: 22, damageType: 'fire', type: 'attack', description: 'Cône de feu', recharge: { min: 5 }, savingThrow: { ability: 'dexterity', dc: 13 } }
  ]
};

const WYRMLING_SILVER: Monster = {
  id: 'wyrmling_silver', name: 'Dragonnet d\'Argent', hp: 45, maxHp: 45, armorClass: 17,
  abilities: createAbilities(17, 10, 15, 12, 11, 15),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'dragon', size: 'medium', portrait: '🐉', isBoss: false,
  immunities: ['cold'], description: 'Jeune dragon d\'argent, protecteur des mortels.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 12, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'cold_breath', name: 'Souffle de froid', damage: 18, damageType: 'cold', type: 'attack', description: 'Cône glacial', recharge: { min: 5 }, savingThrow: { ability: 'constitution', dc: 12 } }
  ]
};

// ============================================
// CRÉATURES DE L'OUTRETERRE SUPPLÉMENTAIRES
// ============================================

const MYCONID_SPROUT: Monster = {
  id: 'myconid_sprout', name: 'Pousse Mycéloïde', hp: 7, maxHp: 7, armorClass: 10,
  abilities: createAbilities(8, 10, 10, 8, 11, 5),
  speed: 10,
  challengeRating: 0, xpReward: 10, creatureType: 'plant', size: 'small', portrait: '🍄', isBoss: false,
  description: 'Jeune champignon humanoïde.',
  skills: [{ id: 'fist', name: 'Poing', damage: 3, damageType: 'bludgeoning', type: 'attack', description: 'Coup' }]
};

const MYCONID_ADULT: Monster = {
  id: 'myconid_adult', name: 'Mycéloïde Adulte', hp: 22, maxHp: 22, armorClass: 12,
  abilities: createAbilities(10, 10, 12, 10, 13, 7),
  speed: 20,
  challengeRating: 0.5, xpReward: 100, creatureType: 'plant', size: 'medium', portrait: '🍄', isBoss: false,
  description: 'Champignon humanoïde communicant par spores.',
  skills: [
    { id: 'fist', name: 'Poing', damage: 6, damageType: 'bludgeoning', type: 'attack', description: 'Coup' },
    { id: 'pacifying_spores', name: 'Spores pacifiantes', damage: 0, damageType: 'psychic', type: 'debuff', description: 'Endort la cible', savingThrow: { ability: 'constitution', dc: 11 } }
  ]
};

const MYCONID_SOVEREIGN: Monster = {
  id: 'myconid_sovereign', name: 'Souverain Mycéloïde', hp: 60, maxHp: 60, armorClass: 13,
  abilities: createAbilities(12, 10, 14, 13, 15, 10),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'plant', size: 'large', portrait: '🍄', isBoss: false,
  description: 'Chef des mycéloïdes, maître des spores.',
  skills: [
    { id: 'fist', name: 'Poing', damage: 10, damageType: 'bludgeoning', type: 'attack', description: 'Coup', attackCount: 2 },
    { id: 'animating_spores', name: 'Spores animantes', damage: 0, damageType: 'necrotic', type: 'buff', description: 'Réanime un cadavre' }
  ]
};

const QUAGGOTH: Monster = {
  id: 'quaggoth', name: 'Quaggoth', hp: 45, maxHp: 45, armorClass: 13,
  abilities: createAbilities(17, 12, 16, 6, 12, 7),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'humanoid', size: 'medium', portrait: '🦍', isBoss: false,
  immunities: ['poison'], conditionImmunities: ['poisoned'],
  description: 'Humanoïde bestial de l\'Outreterre.',
  skills: [{ id: 'claw', name: 'Griffe', damage: 12, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 }]
};

const QUAGGOTH_THONOT: Monster = {
  id: 'quaggoth_thonot', name: 'Quaggoth Thonot', hp: 45, maxHp: 45, armorClass: 13,
  abilities: createAbilities(17, 12, 16, 6, 12, 7),
  speed: 30,
  challengeRating: 3, xpReward: 700, creatureType: 'humanoid', size: 'medium', portrait: '🦍', isBoss: false,
  immunities: ['poison'], conditionImmunities: ['poisoned'],
  description: 'Quaggoth chaman aux pouvoirs psychiques.',
  skills: [
    { id: 'claw', name: 'Griffe', damage: 12, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 },
    { id: 'mind_blast', name: 'Décharge mentale', damage: 14, damageType: 'psychic', type: 'attack', description: 'Attaque psychique', savingThrow: { ability: 'wisdom', dc: 12 } }
  ]
};

const FLUMPH: Monster = {
  id: 'flumph', name: 'Flumph', hp: 7, maxHp: 7, armorClass: 12,
  abilities: createAbilities(6, 15, 10, 14, 14, 11),
  speed: 5,
  challengeRating: 0.125, xpReward: 25, creatureType: 'aberration', size: 'small', portrait: '🪼', isBoss: false,
  description: 'Créature bienveillante de l\'Outreterre.',
  skills: [{ id: 'tendrils', name: 'Tentacules', damage: 6, damageType: 'piercing', type: 'attack', description: 'Tentacules acides' }]
};

const KUTO_TOA: Monster = {
  id: 'kuo_toa', name: 'Kuo-Toa', hp: 18, maxHp: 18, armorClass: 13,
  abilities: createAbilities(13, 10, 11, 11, 10, 8),
  speed: 30,
  challengeRating: 0.25, xpReward: 50, creatureType: 'humanoid', size: 'medium', portrait: '🐟', isBoss: false,
  description: 'Homme-poisson fanatique des profondeurs.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 6, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'spear', name: 'Lance', damage: 8, damageType: 'piercing', type: 'attack', description: 'Lance' }
  ]
};

const KUTO_TOA_WHIP: Monster = {
  id: 'kuo_toa_whip', name: 'Fouetteur Kuo-Toa', hp: 65, maxHp: 65, armorClass: 11,
  abilities: createAbilities(14, 10, 14, 12, 14, 11),
  speed: 30,
  challengeRating: 1, xpReward: 200, creatureType: 'humanoid', size: 'medium', portrait: '🐟', isBoss: false,
  description: 'Prêtre kuo-toa aux pouvoirs divins.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 8, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'pincer_staff', name: 'Bâton-pince', damage: 10, damageType: 'bludgeoning', type: 'attack', description: 'Prise au piège' },
    { id: 'sacred_flame', name: 'Flamme sacrée', damage: 10, damageType: 'radiant', type: 'attack', description: 'Feu divin' }
  ]
};

const KUTO_TOA_ARCHPRIEST: Monster = {
  id: 'kuo_toa_archpriest', name: 'Archiprêtre Kuo-Toa', hp: 97, maxHp: 97, armorClass: 13,
  abilities: createAbilities(16, 14, 16, 13, 16, 14),
  speed: 30,
  challengeRating: 6, xpReward: 2300, creatureType: 'humanoid', size: 'medium', portrait: '🐟', isBoss: false,
  description: 'Grand prêtre kuo-toa aux pouvoirs immenses.',
  skills: [
    { id: 'scepter', name: 'Sceptre', damage: 14, damageType: 'bludgeoning', type: 'attack', description: 'Sceptre sacré', attackCount: 2 },
    { id: 'spirit_guardians', name: 'Esprits gardiens', damage: 20, damageType: 'radiant', type: 'attack', description: 'Aura divine', areaOfEffect: true }
  ]
};

const TROGLODYTE: Monster = {
  id: 'troglodyte', name: 'Troglodyte', hp: 13, maxHp: 13, armorClass: 11,
  abilities: createAbilities(14, 10, 14, 6, 10, 6),
  speed: 30,
  challengeRating: 0.25, xpReward: 50, creatureType: 'humanoid', size: 'medium', portrait: '🦎', isBoss: false,
  description: 'Reptile humanoïde à l\'odeur nauséabonde.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 8, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claw', name: 'Griffe', damage: 6, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 }
  ]
};

const GRIMLOCK: Monster = {
  id: 'grimlock', name: 'Grimlock', hp: 11, maxHp: 11, armorClass: 11,
  abilities: createAbilities(16, 12, 12, 9, 8, 6),
  speed: 30,
  challengeRating: 0.25, xpReward: 50, creatureType: 'humanoid', size: 'medium', portrait: '👤', isBoss: false,
  conditionImmunities: ['blinded'],
  description: 'Humain aveugle des profondeurs.',
  skills: [{ id: 'spiked_bone_club', name: 'Massue d\'os', damage: 8, damageType: 'bludgeoning', type: 'attack', description: 'Massue' }]
};

const DUERGAR: Monster = {
  id: 'duergar', name: 'Duergar', hp: 26, maxHp: 26, armorClass: 16,
  abilities: createAbilities(14, 11, 14, 11, 10, 9),
  speed: 25,
  challengeRating: 1, xpReward: 200, creatureType: 'humanoid', size: 'medium', portrait: '⛏️', isBoss: false,
  resistances: ['poison'], description: 'Nain gris des profondeurs.',
  skills: [
    { id: 'war_pick', name: 'Pic de guerre', damage: 10, damageType: 'piercing', type: 'attack', description: 'Pic' },
    { id: 'javelin', name: 'Javelot', damage: 8, damageType: 'piercing', type: 'attack', description: 'Lancer' }
  ]
};

const SVIRFNEBLIN: Monster = {
  id: 'svirfneblin', name: 'Svirfneblin', hp: 16, maxHp: 16, armorClass: 15,
  abilities: createAbilities(15, 14, 14, 12, 10, 9),
  speed: 20,
  challengeRating: 0.5, xpReward: 100, creatureType: 'humanoid', size: 'small', portrait: '🧙', isBoss: false,
  description: 'Gnome des profondeurs, discret et prudent.',
  skills: [
    { id: 'war_pick', name: 'Pic de guerre', damage: 8, damageType: 'piercing', type: 'attack', description: 'Pic' },
    { id: 'poisoned_dart', name: 'Fléchette empoisonnée', damage: 6, damageType: 'piercing', type: 'attack', description: 'Fléchette' }
  ]
};

// ============================================
// CRÉATURES SUPPLÉMENTAIRES VARIÉES
// ============================================

const GIANT_ELK: Monster = {
  id: 'giant_elk', name: 'Élan Géant', hp: 42, maxHp: 42, armorClass: 14,
  abilities: createAbilities(19, 16, 14, 7, 14, 10),
  speed: 60,
  challengeRating: 2, xpReward: 450, creatureType: 'beast', size: 'huge', portrait: '🦌', isBoss: false,
  description: 'Élan majestueux de taille colossale.',
  skills: [
    { id: 'ram', name: 'Coup de bois', damage: 14, damageType: 'bludgeoning', type: 'attack', description: 'Charge' },
    { id: 'hooves', name: 'Sabots', damage: 12, damageType: 'bludgeoning', type: 'attack', description: 'Piétinement' }
  ]
};

const GIANT_BOAR: Monster = {
  id: 'giant_boar', name: 'Sanglier Géant', hp: 42, maxHp: 42, armorClass: 12,
  abilities: createAbilities(17, 10, 16, 2, 7, 5),
  speed: 40,
  challengeRating: 2, xpReward: 450, creatureType: 'beast', size: 'large', portrait: '🐗', isBoss: false,
  description: 'Sanglier massif aux défenses mortelles.',
  skills: [{ id: 'tusk', name: 'Défense', damage: 14, damageType: 'slashing', type: 'attack', description: 'Défenses' }]
};

const GIANT_CONSTRICTOR_SNAKE: Monster = {
  id: 'giant_constrictor_snake', name: 'Serpent Constricteur Géant', hp: 60, maxHp: 60, armorClass: 12,
  abilities: createAbilities(19, 14, 12, 1, 10, 3),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'beast', size: 'huge', portrait: '🐍', isBoss: false,
  description: 'Serpent géant qui écrase ses proies.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 12, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'constrict', name: 'Constriction', damage: 16, damageType: 'bludgeoning', type: 'attack', description: 'Étranglement' }
  ]
};

const GIANT_EAGLE: Monster = {
  id: 'giant_eagle', name: 'Aigle Géant', hp: 26, maxHp: 26, armorClass: 13,
  abilities: createAbilities(16, 17, 13, 8, 14, 10),
  speed: 10,
  challengeRating: 1, xpReward: 200, creatureType: 'beast', size: 'large', portrait: '🦅', isBoss: false,
  description: 'Aigle majestueux capable de transporter des humains.',
  skills: [
    { id: 'beak', name: 'Bec', damage: 10, damageType: 'piercing', type: 'attack', description: 'Bec' },
    { id: 'talons', name: 'Serres', damage: 12, damageType: 'slashing', type: 'attack', description: 'Serres' }
  ]
};

const GIANT_OCTOPUS: Monster = {
  id: 'giant_octopus', name: 'Pieuvre Géante', hp: 52, maxHp: 52, armorClass: 11,
  abilities: createAbilities(17, 13, 13, 4, 10, 4),
  speed: 10,
  challengeRating: 1, xpReward: 200, creatureType: 'beast', size: 'large', portrait: '🐙', isBoss: false,
  description: 'Pieuvre massive des profondeurs océanes.',
  skills: [{ id: 'tentacles', name: 'Tentacules', damage: 14, damageType: 'bludgeoning', type: 'attack', description: 'Tentacules' }]
};

const GIANT_OWL: Monster = {
  id: 'giant_owl', name: 'Hibou Géant', hp: 19, maxHp: 19, armorClass: 12,
  abilities: createAbilities(13, 15, 12, 8, 13, 10),
  speed: 5,
  challengeRating: 0.25, xpReward: 50, creatureType: 'beast', size: 'large', portrait: '🦉', isBoss: false,
  description: 'Hibou géant, sage gardien des forêts.',
  skills: [{ id: 'talons', name: 'Serres', damage: 10, damageType: 'slashing', type: 'attack', description: 'Serres' }]
};

const GIANT_SHARK: Monster = {
  id: 'giant_shark', name: 'Requin Géant', hp: 126, maxHp: 126, armorClass: 13,
  abilities: createAbilities(23, 11, 21, 1, 10, 5),
  speed: 0,
  challengeRating: 5, xpReward: 1800, creatureType: 'beast', size: 'huge', portrait: '🦈', isBoss: false,
  description: 'Prédateur suprême des océans.',
  skills: [{ id: 'bite', name: 'Morsure', damage: 24, damageType: 'piercing', type: 'attack', description: 'Mâchoires géantes' }]
};

const GIANT_VULTURE: Monster = {
  id: 'giant_vulture', name: 'Vautour Géant', hp: 22, maxHp: 22, armorClass: 10,
  abilities: createAbilities(15, 10, 15, 6, 12, 7),
  speed: 10,
  challengeRating: 1, xpReward: 200, creatureType: 'beast', size: 'large', portrait: '🦅', isBoss: false,
  description: 'Charognard géant des terres désolées.',
  skills: [
    { id: 'beak', name: 'Bec', damage: 10, damageType: 'piercing', type: 'attack', description: 'Bec' },
    { id: 'talons', name: 'Serres', damage: 8, damageType: 'slashing', type: 'attack', description: 'Serres' }
  ]
};

const RIDING_HORSE: Monster = {
  id: 'riding_horse', name: 'Cheval de selle', hp: 13, maxHp: 13, armorClass: 10,
  abilities: createAbilities(16, 10, 12, 2, 11, 7),
  speed: 60,
  challengeRating: 0.25, xpReward: 50, creatureType: 'beast', size: 'large', portrait: '🐴', isBoss: false,
  description: 'Cheval domestique pour la monte.',
  skills: [{ id: 'hooves', name: 'Sabots', damage: 8, damageType: 'bludgeoning', type: 'attack', description: 'Ruade' }]
};

const WARHORSE: Monster = {
  id: 'warhorse', name: 'Cheval de guerre', hp: 19, maxHp: 19, armorClass: 11,
  abilities: createAbilities(18, 12, 13, 2, 12, 7),
  speed: 60,
  challengeRating: 0.5, xpReward: 100, creatureType: 'beast', size: 'large', portrait: '🐴', isBoss: false,
  description: 'Destrier entraîné au combat.',
  skills: [{ id: 'hooves', name: 'Sabots', damage: 12, damageType: 'bludgeoning', type: 'attack', description: 'Ruade' }]
};

const NIGHTMARE: Monster = {
  id: 'nightmare', name: 'Cauchemar', hp: 68, maxHp: 68, armorClass: 13,
  abilities: createAbilities(18, 15, 16, 10, 13, 15),
  speed: 60,
  challengeRating: 3, xpReward: 700, creatureType: 'fiend', size: 'large', portrait: '🐴', isBoss: false,
  immunities: ['fire'], description: 'Destrier infernal aux sabots enflammés.',
  skills: [
    { id: 'hooves', name: 'Sabots', damage: 16, damageType: 'bludgeoning', type: 'attack', description: 'Sabots de feu' },
    { id: 'ethereal_stride', name: 'Passage éthéré', damage: 0, damageType: 'force', type: 'special', description: 'Voyage entre les plans' }
  ]
};

const PEGASUS: Monster = {
  id: 'pegasus', name: 'Pégase', hp: 59, maxHp: 59, armorClass: 12,
  abilities: createAbilities(18, 15, 16, 10, 15, 13),
  speed: 60,
  challengeRating: 2, xpReward: 450, creatureType: 'celestial', size: 'large', portrait: '🐎', isBoss: false,
  description: 'Cheval ailé céleste, pur et noble.',
  skills: [{ id: 'hooves', name: 'Sabots', damage: 14, damageType: 'bludgeoning', type: 'attack', description: 'Sabots' }]
};

// ============================================
// AUTRES CRÉATURES (Finales)
// ============================================

const GNOLL: Monster = {
  id: 'gnoll', name: 'Gnoll', hp: 22, maxHp: 22, armorClass: 15,
  abilities: createAbilities(14, 12, 11, 6, 10, 7),
  speed: 30,
  challengeRating: 0.5, xpReward: 100, creatureType: 'humanoid', size: 'medium', portrait: '🐺', isBoss: false,
  description: 'Humanoïde hyène, démon de la faim.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 8, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'spear', name: 'Lance', damage: 10, damageType: 'piercing', type: 'attack', description: 'Lance' }
  ]
};

const GNOLL_PACK_LORD: Monster = {
  id: 'gnoll_pack_lord', name: 'Chef de Meute Gnoll', hp: 49, maxHp: 49, armorClass: 15,
  abilities: createAbilities(16, 14, 13, 8, 11, 9),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'humanoid', size: 'medium', portrait: '🐺', isBoss: false,
  description: 'Chef brutal d\'une meute de gnolls.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 10, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'glaive', name: 'Glaive', damage: 16, damageType: 'slashing', type: 'attack', description: 'Glaive', attackCount: 2 }
  ]
};

const GNOLL_FANG_OF_YEENOGHU: Monster = {
  id: 'gnoll_fang_of_yeenoghu', name: 'Croc de Yeenoghu', hp: 65, maxHp: 65, armorClass: 14,
  abilities: createAbilities(17, 15, 15, 10, 11, 13),
  speed: 30,
  challengeRating: 4, xpReward: 1100, creatureType: 'fiend', size: 'medium', portrait: '🐺', isBoss: false,
  description: 'Gnoll béni par Yeenoghu, créateur de gnolls.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 14, damageType: 'piercing', type: 'attack', description: 'Morsure maudite' },
    { id: 'claw', name: 'Griffe', damage: 12, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 }
  ]
};

const LIZARDFOLK: Monster = {
  id: 'lizardfolk', name: 'Homme-Lézard', hp: 22, maxHp: 22, armorClass: 15,
  abilities: createAbilities(15, 10, 13, 7, 12, 7),
  speed: 30,
  challengeRating: 0.5, xpReward: 100, creatureType: 'humanoid', size: 'medium', portrait: '🦎', isBoss: false,
  description: 'Reptilien tribal des marais.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 8, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'javelin', name: 'Javelot', damage: 8, damageType: 'piercing', type: 'attack', description: 'Javelot' }
  ]
};

const LIZARDFOLK_SHAMAN: Monster = {
  id: 'lizardfolk_shaman', name: 'Chaman Homme-Lézard', hp: 27, maxHp: 27, armorClass: 13,
  abilities: createAbilities(15, 10, 13, 10, 15, 8),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'humanoid', size: 'medium', portrait: '🦎', isBoss: false,
  description: 'Prêtre-druide des hommes-lézards.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 8, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'conjure_animals', name: 'Invocation d\'animaux', damage: 0, damageType: 'force', type: 'buff', description: 'Invoque des animaux' }
  ]
};

const KENKU: Monster = {
  id: 'kenku', name: 'Kenku', hp: 13, maxHp: 13, armorClass: 13,
  abilities: createAbilities(10, 16, 10, 11, 10, 10),
  speed: 30,
  challengeRating: 0.25, xpReward: 50, creatureType: 'humanoid', size: 'medium', portrait: '🐦', isBoss: false,
  description: 'Corvien maudit, incapable de voler.',
  skills: [{ id: 'shortsword', name: 'Épée courte', damage: 8, damageType: 'piercing', type: 'attack', description: 'Épée' }]
};

const YUAN_TI_PUREBLOOD: Monster = {
  id: 'yuan_ti_pureblood', name: 'Yuan-Ti Sang-Pur', hp: 40, maxHp: 40, armorClass: 11,
  abilities: createAbilities(11, 12, 12, 13, 12, 14),
  speed: 30,
  challengeRating: 1, xpReward: 200, creatureType: 'humanoid', size: 'medium', portrait: '🐍', isBoss: false,
  immunities: ['poison'], conditionImmunities: ['poisoned'],
  description: 'Serpentide presque humain, infiltrateur.',
  skills: [
    { id: 'scimitar', name: 'Cimeterre', damage: 8, damageType: 'slashing', type: 'attack', description: 'Cimeterre' },
    { id: 'poison_spray', name: 'Rayon de poison', damage: 10, damageType: 'poison', type: 'attack', description: 'Poison', savingThrow: { ability: 'constitution', dc: 12 } }
  ]
};

const YUAN_TI_MALISON: Monster = {
  id: 'yuan_ti_malison', name: 'Yuan-Ti Malison', hp: 66, maxHp: 66, armorClass: 12,
  abilities: createAbilities(16, 14, 13, 14, 12, 16),
  speed: 30,
  challengeRating: 3, xpReward: 700, creatureType: 'monstrosity', size: 'medium', portrait: '🐍', isBoss: false,
  immunities: ['poison'], conditionImmunities: ['poisoned'],
  description: 'Yuan-ti mi-humain mi-serpent.',
  skills: [
    { id: 'scimitar', name: 'Cimeterre', damage: 12, damageType: 'slashing', type: 'attack', description: 'Cimeterre', attackCount: 2 },
    { id: 'bite', name: 'Morsure', damage: 8, damageType: 'piercing', type: 'attack', description: 'Morsure empoisonnée' }
  ]
};

const YUAN_TI_ABOMINATION: Monster = {
  id: 'yuan_ti_abomination', name: 'Yuan-Ti Abomination', hp: 127, maxHp: 127, armorClass: 15,
  abilities: createAbilities(19, 16, 17, 17, 15, 18),
  speed: 40,
  challengeRating: 7, xpReward: 2900, creatureType: 'monstrosity', size: 'large', portrait: '🐍', isBoss: false,
  immunities: ['poison'], conditionImmunities: ['poisoned'],
  description: 'Yuan-ti presque totalement serpent, leader religieux.',
  skills: [
    { id: 'scimitar', name: 'Cimeterre', damage: 16, damageType: 'slashing', type: 'attack', description: 'Cimeterre', attackCount: 2 },
    { id: 'constrict', name: 'Constriction', damage: 16, damageType: 'bludgeoning', type: 'attack', description: 'Étreinte' }
  ]
};

const BULLYWUG: Monster = {
  id: 'bullywug', name: 'Bullywug', hp: 11, maxHp: 11, armorClass: 15,
  abilities: createAbilities(12, 12, 11, 7, 10, 7),
  speed: 20,
  challengeRating: 0.25, xpReward: 50, creatureType: 'humanoid', size: 'medium', portrait: '🐸', isBoss: false,
  description: 'Batracien humanoïde des marais.',
  skills: [{ id: 'spear', name: 'Lance', damage: 8, damageType: 'piercing', type: 'attack', description: 'Lance' }]
};

const TABAXI: Monster = {
  id: 'tabaxi', name: 'Tabaxi', hp: 22, maxHp: 22, armorClass: 14,
  abilities: createAbilities(10, 17, 11, 13, 14, 10),
  speed: 30,
  challengeRating: 0.25, xpReward: 50, creatureType: 'humanoid', size: 'medium', portrait: '🐱', isBoss: false,
  description: 'Félin humanoïde curieux et agile.',
  skills: [
    { id: 'claws', name: 'Griffes', damage: 8, damageType: 'slashing', type: 'attack', description: 'Griffes' },
    { id: 'shortsword', name: 'Épée courte', damage: 8, damageType: 'piercing', type: 'attack', description: 'Épée' }
  ]
};

const TORTLES: Monster = {
  id: 'tortle', name: 'Tortle', hp: 22, maxHp: 22, armorClass: 17,
  abilities: createAbilities(15, 10, 12, 11, 13, 12),
  speed: 30,
  challengeRating: 0.25, xpReward: 50, creatureType: 'humanoid', size: 'medium', portrait: '🐢', isBoss: false,
  description: 'Tortue humanoïde pacifique.',
  skills: [{ id: 'claw', name: 'Griffe', damage: 8, damageType: 'slashing', type: 'attack', description: 'Griffes' }]
};

const AARAKOCRA: Monster = {
  id: 'aarakocra', name: 'Aarakocra', hp: 13, maxHp: 13, armorClass: 12,
  abilities: createAbilities(10, 14, 10, 11, 12, 11),
  speed: 20,
  challengeRating: 0.25, xpReward: 50, creatureType: 'humanoid', size: 'medium', portrait: '🦅', isBoss: false,
  description: 'Homme-oiseau des hautes montagnes.',
  skills: [
    { id: 'talon', name: 'Serres', damage: 8, damageType: 'slashing', type: 'attack', description: 'Serres' },
    { id: 'javelin', name: 'Javelot', damage: 6, damageType: 'piercing', type: 'attack', description: 'Javelot' }
  ]
};

const THRI_KREEN: Monster = {
  id: 'thri_kreen', name: 'Thri-Kreen', hp: 33, maxHp: 33, armorClass: 15,
  abilities: createAbilities(12, 15, 13, 8, 12, 7),
  speed: 40,
  challengeRating: 1, xpReward: 200, creatureType: 'humanoid', size: 'medium', portrait: '🦗', isBoss: false,
  description: 'Insecte humanoïde mantis des déserts.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 8, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claw', name: 'Griffe', damage: 10, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 }
  ]
};

const VEGEPYGMY: Monster = {
  id: 'vegepygmy', name: 'Végépygmée', hp: 9, maxHp: 9, armorClass: 13,
  abilities: createAbilities(7, 14, 13, 6, 11, 7),
  speed: 30,
  challengeRating: 0.25, xpReward: 50, creatureType: 'plant', size: 'small', portrait: '🌱', isBoss: false,
  resistances: ['lightning', 'piercing'],
  description: 'Petite créature végétale née de spores.',
  skills: [{ id: 'claws', name: 'Griffes', damage: 6, damageType: 'slashing', type: 'attack', description: 'Griffes' }]
};

const VEGEPYGMY_CHIEF: Monster = {
  id: 'vegepygmy_chief', name: 'Chef Végépygmée', hp: 33, maxHp: 33, armorClass: 14,
  abilities: createAbilities(14, 14, 14, 7, 12, 9),
  speed: 30,
  challengeRating: 2, xpReward: 450, creatureType: 'plant', size: 'small', portrait: '🌱', isBoss: false,
  resistances: ['lightning', 'piercing'],
  description: 'Chef d\'une communauté végépygmée.',
  skills: [
    { id: 'claws', name: 'Griffes', damage: 10, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 },
    { id: 'spores', name: 'Spores', damage: 0, damageType: 'poison', type: 'debuff', description: 'Nuage de spores', areaOfEffect: true }
  ]
};

const JACKALWERE: Monster = {
  id: 'jackalwere', name: 'Chacal-garou', hp: 18, maxHp: 18, armorClass: 12,
  abilities: createAbilities(11, 15, 11, 13, 11, 10),
  speed: 40,
  challengeRating: 0.5, xpReward: 100, creatureType: 'humanoid', size: 'medium', portrait: '🐺', isBoss: false,
  immunities: ['bludgeoning', 'piercing', 'slashing'],
  description: 'Chacal métamorphe, trompeur et mortel.',
  skills: [{ id: 'bite', name: 'Morsure', damage: 8, damageType: 'piercing', type: 'attack', description: 'Morsure' }]
};

const CAMBION: Monster = {
  id: 'cambion', name: 'Cambion', hp: 82, maxHp: 82, armorClass: 19,
  abilities: createAbilities(18, 18, 16, 14, 12, 16),
  speed: 30,
  challengeRating: 5, xpReward: 1800, creatureType: 'fiend', size: 'medium', portrait: '😈', isBoss: false,
  resistances: ['cold', 'fire', 'lightning', 'poison'],
  description: 'Demi-démon, enfant d\'un mortel et d\'un fiélon.',
  skills: [
    { id: 'spear', name: 'Lance', damage: 14, damageType: 'piercing', type: 'attack', description: 'Lance fiélonne', attackCount: 2 },
    { id: 'fire_ray', name: 'Rayon de feu', damage: 16, damageType: 'fire', type: 'attack', description: 'Rayon enflammé' }
  ]
};

const INCUBUS: Monster = {
  id: 'incubus', name: 'Incube', hp: 66, maxHp: 66, armorClass: 15,
  abilities: createAbilities(15, 17, 13, 15, 12, 20),
  speed: 30,
  challengeRating: 4, xpReward: 1100, creatureType: 'fiend', size: 'medium', portrait: '😈', isBoss: false,
  resistances: ['cold', 'fire', 'lightning', 'poison'],
  description: 'Démon séducteur masculin.',
  skills: [
    { id: 'claw', name: 'Griffe', damage: 10, damageType: 'slashing', type: 'attack', description: 'Griffes' },
    { id: 'draining_kiss', name: 'Baiser drainant', damage: 20, damageType: 'psychic', type: 'attack', description: 'Draine la vie', savingThrow: { ability: 'constitution', dc: 15 } }
  ]
};

const SHADOW_DEMON: Monster = {
  id: 'shadow_demon', name: 'Démon des Ombres', hp: 66, maxHp: 66, armorClass: 13,
  abilities: createAbilities(1, 17, 12, 14, 13, 14),
  speed: 50,
  challengeRating: 4, xpReward: 1100, creatureType: 'fiend', size: 'medium', portrait: '👤', isBoss: false,
  vulnerabilities: ['radiant'],
  resistances: ['acid', 'fire', 'necrotic', 'thunder'],
  immunities: ['cold', 'lightning', 'poison'],
  conditionImmunities: ['exhaustion', 'grappled', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained'],
  description: 'Démon de pure ténèbres.',
  skills: [{ id: 'claws', name: 'Griffes', damage: 14, damageType: 'psychic', type: 'attack', description: 'Griffes d\'ombre', attackCount: 2 }]
};

const BARLGURA: Monster = {
  id: 'barlgura', name: 'Barlgura', hp: 68, maxHp: 68, armorClass: 15,
  abilities: createAbilities(18, 15, 16, 7, 14, 9),
  speed: 40,
  challengeRating: 5, xpReward: 1800, creatureType: 'fiend', size: 'large', portrait: '🦍', isBoss: false,
  resistances: ['cold', 'fire', 'lightning'],
  immunities: ['poison'],
  conditionImmunities: ['poisoned'],
  description: 'Démon singe brutal.',
  skills: [
    { id: 'fist', name: 'Poing', damage: 14, damageType: 'bludgeoning', type: 'attack', description: 'Coup', attackCount: 2 },
    { id: 'bite', name: 'Morsure', damage: 12, damageType: 'piercing', type: 'attack', description: 'Morsure' }
  ]
};

const CHASME: Monster = {
  id: 'chasme', name: 'Chasme', hp: 84, maxHp: 84, armorClass: 15,
  abilities: createAbilities(15, 15, 12, 11, 14, 10),
  speed: 20,
  challengeRating: 6, xpReward: 2300, creatureType: 'fiend', size: 'large', portrait: '🪰', isBoss: false,
  resistances: ['cold', 'fire', 'lightning'],
  immunities: ['poison'],
  conditionImmunities: ['poisoned'],
  description: 'Démon-mouche au bourdonnement soporifique.',
  skills: [
    { id: 'proboscis', name: 'Trompe', damage: 18, damageType: 'piercing', type: 'attack', description: 'Trompe drainante' },
    { id: 'drone', name: 'Bourdonnement', damage: 0, damageType: 'psychic', type: 'debuff', description: 'Endort les créatures', areaOfEffect: true }
  ]
};

const DYBBUK: Monster = {
  id: 'dybbuk', name: 'Dybbuk', hp: 37, maxHp: 37, armorClass: 14,
  abilities: createAbilities(6, 19, 16, 16, 15, 14),
  speed: 0,
  challengeRating: 4, xpReward: 1100, creatureType: 'fiend', size: 'medium', portrait: '👻', isBoss: false,
  resistances: ['acid', 'cold', 'fire', 'lightning', 'thunder'],
  immunities: ['poison'],
  conditionImmunities: ['charmed', 'exhaustion', 'frightened', 'grappled', 'paralyzed', 'petrified', 'poisoned', 'prone', 'restrained'],
  description: 'Démon possesseur de cadavres.',
  skills: [{ id: 'tentacle', name: 'Tentacule', damage: 12, damageType: 'necrotic', type: 'attack', description: 'Tentacule spectrale' }]
};

const SPAWN_OF_TIAMAT_WHITE: Monster = {
  id: 'spawn_of_tiamat_white', name: 'Rejeton de Tiamat Blanc', hp: 68, maxHp: 68, armorClass: 16,
  abilities: createAbilities(18, 14, 16, 7, 12, 8),
  speed: 30,
  challengeRating: 5, xpReward: 1800, creatureType: 'monstrosity', size: 'large', portrait: '🐉', isBoss: false,
  immunities: ['cold'], description: 'Création draconique de Tiamat.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 18, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claw', name: 'Griffe', damage: 12, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 },
    { id: 'cold_breath', name: 'Souffle de froid', damage: 24, damageType: 'cold', type: 'attack', description: 'Cône glacial', recharge: { min: 5 }, savingThrow: { ability: 'constitution', dc: 14 } }
  ]
};

// Autres créatures variées
const PIXIE_SPRITE: Monster = {
  id: 'pixie_sprite', name: 'Lutin Féérique', hp: 2, maxHp: 2, armorClass: 15,
  abilities: createAbilities(2, 20, 8, 10, 14, 15),
  speed: 10,
  challengeRating: 0.25, xpReward: 50, creatureType: 'fey', size: 'tiny', portrait: '🧚', isBoss: false,
  description: 'Minuscule fée espiègle.',
  skills: [{ id: 'confusion_dust', name: 'Poudre de confusion', damage: 0, damageType: 'psychic', type: 'debuff', description: 'Confond l\'ennemi' }]
};

const HOBGOBLIN_DEVASTATOR: Monster = {
  id: 'hobgoblin_devastator', name: 'Dévastateur Hobgobelin', hp: 45, maxHp: 45, armorClass: 13,
  abilities: createAbilities(13, 12, 14, 16, 13, 11),
  speed: 30,
  challengeRating: 4, xpReward: 1100, creatureType: 'humanoid', size: 'medium', portrait: '👹', isBoss: false,
  description: 'Mage de guerre hobgobelin.',
  skills: [
    { id: 'staff', name: 'Bâton', damage: 10, damageType: 'bludgeoning', type: 'attack', description: 'Bâton magique' },
    { id: 'fireball', name: 'Boule de feu', damage: 28, damageType: 'fire', type: 'attack', description: 'Explosion de feu', areaOfEffect: true, savingThrow: { ability: 'dexterity', dc: 13 } }
  ]
};

const HOBGOBLIN_IRON_SHADOW: Monster = {
  id: 'hobgoblin_iron_shadow', name: 'Ombre de Fer Hobgobelin', hp: 32, maxHp: 32, armorClass: 15,
  abilities: createAbilities(14, 16, 15, 14, 15, 11),
  speed: 40,
  challengeRating: 2, xpReward: 450, creatureType: 'humanoid', size: 'medium', portrait: '👹', isBoss: false,
  description: 'Moine-assassin hobgobelin.',
  skills: [
    { id: 'unarmed_strike', name: 'Frappe', damage: 10, damageType: 'bludgeoning', type: 'attack', description: 'Frappe sans arme', attackCount: 2 },
    { id: 'shadow_step', name: 'Pas d\'ombre', damage: 0, damageType: 'force', type: 'buff', description: 'Téléportation courte' }
  ]
};

const NEOGI: Monster = {
  id: 'neogi', name: 'Neogi', hp: 33, maxHp: 33, armorClass: 15,
  abilities: createAbilities(6, 16, 14, 13, 12, 15),
  speed: 30,
  challengeRating: 3, xpReward: 700, creatureType: 'aberration', size: 'small', portrait: '🕷️', isBoss: false,
  description: 'Esclavagiste arachnide psionique.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 10, damageType: 'piercing', type: 'attack', description: 'Morsure venimeuse' },
    { id: 'claws', name: 'Griffes', damage: 8, damageType: 'slashing', type: 'attack', description: 'Griffes' },
    { id: 'enslave', name: 'Asservissement', damage: 0, damageType: 'psychic', type: 'debuff', description: 'Contrôle mental', savingThrow: { ability: 'wisdom', dc: 14 } }
  ]
};

const NEOGI_MASTER: Monster = {
  id: 'neogi_master', name: 'Maître Neogi', hp: 71, maxHp: 71, armorClass: 15,
  abilities: createAbilities(6, 16, 14, 16, 12, 18),
  speed: 30,
  challengeRating: 4, xpReward: 1100, creatureType: 'aberration', size: 'medium', portrait: '🕷️', isBoss: false,
  description: 'Maître esclavagiste neogi aux pouvoirs amplifiés.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 14, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claws', name: 'Griffes', damage: 10, damageType: 'slashing', type: 'attack', description: 'Griffes', attackCount: 2 },
    { id: 'mass_enslave', name: 'Asservissement de masse', damage: 0, damageType: 'psychic', type: 'debuff', description: 'Contrôle mental de zone', areaOfEffect: true, savingThrow: { ability: 'wisdom', dc: 15 } }
  ]
};

const BARGHEST: Monster = {
  id: 'barghest', name: 'Barghest', hp: 90, maxHp: 90, armorClass: 17,
  abilities: createAbilities(19, 15, 14, 13, 12, 14),
  speed: 60,
  challengeRating: 4, xpReward: 1100, creatureType: 'fiend', size: 'large', portrait: '🐕', isBoss: false,
  resistances: ['cold', 'fire', 'lightning'],
  immunities: ['acid', 'poison'],
  description: 'Loup démon métamorphe gobelinou.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 16, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'claws', name: 'Griffes', damage: 12, damageType: 'slashing', type: 'attack', description: 'Griffes' }
  ]
};

const FLAIL_SNAIL: Monster = {
  id: 'flail_snail', name: 'Escargot à Fléaux', hp: 52, maxHp: 52, armorClass: 16,
  abilities: createAbilities(17, 5, 14, 3, 14, 5),
  speed: 10,
  challengeRating: 3, xpReward: 700, creatureType: 'elemental', size: 'large', portrait: '🐌', isBoss: false,
  immunities: ['fire', 'poison'], conditionImmunities: ['poisoned'],
  description: 'Escargot géant avec des tentacules massues.',
  skills: [{ id: 'flail', name: 'Fléau tentaculaire', damage: 12, damageType: 'bludgeoning', type: 'attack', description: 'Frappe tentaculaire', attackCount: 4 }]
};

const MEAZEL: Monster = {
  id: 'meazel', name: 'Meazel', hp: 35, maxHp: 35, armorClass: 13,
  abilities: createAbilities(8, 17, 9, 14, 13, 10),
  speed: 30,
  challengeRating: 1, xpReward: 200, creatureType: 'monstrosity', size: 'medium', portrait: '👤', isBoss: false,
  description: 'Étrangleur furtif né de la malédiction.',
  skills: [
    { id: 'garrote', name: 'Garrot', damage: 10, damageType: 'bludgeoning', type: 'attack', description: 'Étranglement' },
    { id: 'shadow_teleport', name: 'Téléportation d\'ombre', damage: 0, damageType: 'force', type: 'special', description: 'Téléporte dans les ombres' }
  ]
};

const TLINCALLI: Monster = {
  id: 'tlincalli', name: 'Tlincalli', hp: 85, maxHp: 85, armorClass: 15,
  abilities: createAbilities(16, 13, 14, 8, 12, 8),
  speed: 40,
  challengeRating: 5, xpReward: 1800, creatureType: 'monstrosity', size: 'large', portrait: '🦂', isBoss: false,
  description: 'Humanoïde scorpion du désert.',
  skills: [
    { id: 'longsword', name: 'Épée longue', damage: 14, damageType: 'slashing', type: 'attack', description: 'Épée', attackCount: 2 },
    { id: 'sting', name: 'Dard', damage: 12, damageType: 'piercing', type: 'attack', description: 'Dard empoisonné' }
  ]
};

const FROGHEMOTH: Monster = {
  id: 'froghemoth', name: 'Froghemoth', hp: 184, maxHp: 184, armorClass: 14,
  abilities: createAbilities(23, 13, 20, 2, 12, 5),
  speed: 30,
  challengeRating: 10, xpReward: 5900, creatureType: 'monstrosity', size: 'huge', portrait: '🐸', isBoss: false,
  resistances: ['fire', 'lightning'],
  description: 'Grenouille monstrueuse géante tentaculée.',
  skills: [
    { id: 'bite', name: 'Morsure', damage: 28, damageType: 'piercing', type: 'attack', description: 'Morsure' },
    { id: 'tentacle', name: 'Tentacule', damage: 18, damageType: 'bludgeoning', type: 'attack', description: 'Tentacule', attackCount: 2 },
    { id: 'tongue', name: 'Langue', damage: 16, damageType: 'bludgeoning', type: 'attack', description: 'Attrape et tire' }
  ]
};

const NAGPA: Monster = {
  id: 'nagpa', name: 'Nagpa', hp: 187, maxHp: 187, armorClass: 19,
  abilities: createAbilities(9, 15, 12, 23, 18, 21),
  speed: 30,
  challengeRating: 17, xpReward: 18000, creatureType: 'monstrosity', size: 'medium', portrait: '🦅', isBoss: true, isHostileNpc: true,
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  description: 'Sorcier-vautour maudit, érudit corrompu.',
  skills: [
    { id: 'staff', name: 'Bâton', damage: 12, damageType: 'bludgeoning', type: 'attack', description: 'Bâton' },
    { id: 'disintegrate', name: 'Désintégration', damage: 75, damageType: 'force', type: 'attack', description: 'Rayon désintégrateur', savingThrow: { ability: 'dexterity', dc: 20 } }
  ],
  ultimateSkill: { id: 'curse', name: 'Malédiction éternelle', damage: 0, damageType: 'necrotic', type: 'debuff', description: 'Maudit une créature', areaOfEffect: true, savingThrow: { ability: 'wisdom', dc: 20 } }
};

const OBLEX_ELDER_SPECIAL: Monster = {
  id: 'oblex_elder_special', name: 'Doyen Oblex', hp: 115, maxHp: 115, armorClass: 16,
  abilities: createAbilities(15, 16, 16, 22, 18, 19),
  speed: 20,
  challengeRating: 10, xpReward: 5900, creatureType: 'ooze', size: 'large', portrait: '🫧', isBoss: false,
  conditionImmunities: ['blinded', 'charmed', 'deafened', 'exhaustion', 'prone'],
  description: 'Vase psionique qui vole les souvenirs.',
  skills: [
    { id: 'pseudopod', name: 'Pseudopode', damage: 16, damageType: 'bludgeoning', type: 'attack', description: 'Pseudopode', attackCount: 3 },
    { id: 'eat_memory', name: 'Dévorer les souvenirs', damage: 28, damageType: 'psychic', type: 'attack', description: 'Vole les souvenirs', savingThrow: { ability: 'wisdom', dc: 18 } }
  ]
};

const SWORD_WRAITH_WARRIOR: Monster = {
  id: 'sword_wraith_warrior', name: 'Guerrier Spectre d\'Épée', hp: 45, maxHp: 45, armorClass: 16,
  abilities: createAbilities(18, 12, 17, 6, 9, 10),
  speed: 30,
  challengeRating: 3, xpReward: 700, creatureType: 'undead', size: 'medium', portrait: '⚔️', isBoss: false,
  resistances: ['necrotic'],
  immunities: ['poison'], conditionImmunities: ['exhaustion', 'poisoned'],
  description: 'Guerrier mort obsédé par le combat.',
  skills: [{ id: 'longsword', name: 'Épée longue', damage: 14, damageType: 'slashing', type: 'attack', description: 'Épée', attackCount: 2 }]
};

const CORE_SPAWN_CRAWLER: Monster = {
  id: 'core_spawn_crawler', name: 'Rampant du Cœur', hp: 21, maxHp: 21, armorClass: 12,
  abilities: createAbilities(8, 15, 12, 4, 10, 4),
  speed: 30,
  challengeRating: 1, xpReward: 200, creatureType: 'aberration', size: 'small', portrait: '🐛', isBoss: false,
  immunities: ['psychic'],
  description: 'Créature aberrante née d\'une entité antique.',
  skills: [{ id: 'bite', name: 'Morsure', damage: 10, damageType: 'piercing', type: 'attack', description: 'Morsure' }]
};

const CORE_SPAWN_SEER: Monster = {
  id: 'core_spawn_seer', name: 'Voyant du Cœur', hp: 90, maxHp: 90, armorClass: 17,
  abilities: createAbilities(10, 12, 14, 22, 19, 16),
  speed: 30,
  challengeRating: 6, xpReward: 2300, creatureType: 'aberration', size: 'medium', portrait: '👁️', isBoss: false,
  immunities: ['psychic'], conditionImmunities: ['charmed', 'frightened'],
  description: 'Prophète aberrant lié à une entité antique.',
  skills: [
    { id: 'psychic_orb', name: 'Orbe psychique', damage: 24, damageType: 'psychic', type: 'attack', description: 'Attaque mentale' },
    { id: 'mind_blast', name: 'Souffle mental', damage: 32, damageType: 'psychic', type: 'attack', description: 'Explosion psionique', areaOfEffect: true, savingThrow: { ability: 'intelligence', dc: 17 } }
  ]
};

const SWARM_OF_CRANIUM_RATS: Monster = {
  id: 'swarm_of_cranium_rats', name: 'Nuée de Rats Crâniens', hp: 36, maxHp: 36, armorClass: 12,
  abilities: createAbilities(9, 14, 10, 15, 11, 14),
  speed: 30,
  challengeRating: 5, xpReward: 1800, creatureType: 'beast', size: 'medium', portrait: '🐀', isBoss: false,
  resistances: ['bludgeoning', 'piercing', 'slashing'],
  conditionImmunities: ['charmed', 'frightened', 'grappled', 'paralyzed', 'petrified', 'prone', 'restrained', 'stunned'],
  description: 'Essaim de rats psioniques contrôlés par une intelligence collective.',
  skills: [
    { id: 'bites', name: 'Morsures', damage: 14, damageType: 'piercing', type: 'attack', description: 'Morsures multiples' },
    { id: 'command', name: 'Commandement', damage: 0, damageType: 'psychic', type: 'debuff', description: 'Contrôle psychique', savingThrow: { ability: 'wisdom', dc: 15 } }
  ]
};

const KOBOLD_DRAGONSHIELD: Monster = {
  id: 'kobold_dragonshield', name: 'Kobold Bouclier-Dragon', hp: 44, maxHp: 44, armorClass: 15,
  abilities: createAbilities(12, 15, 14, 8, 9, 10),
  speed: 20,
  challengeRating: 1, xpReward: 200, creatureType: 'humanoid', size: 'small', portrait: '🐲', isBoss: false,
  resistances: ['fire'],
  description: 'Kobold élite, protecteur de dragon.',
  skills: [{ id: 'sword', name: 'Épée courte', damage: 10, damageType: 'piercing', type: 'attack', description: 'Épée', attackCount: 2 }]
};

const KOBOLD_SCALE_SORCERER: Monster = {
  id: 'kobold_scale_sorcerer', name: 'Sorcier Écailleux Kobold', hp: 27, maxHp: 27, armorClass: 15,
  abilities: createAbilities(7, 15, 12, 8, 8, 14),
  speed: 30,
  challengeRating: 1, xpReward: 200, creatureType: 'humanoid', size: 'small', portrait: '🐲', isBoss: false,
  description: 'Kobold mage draconic.',
  skills: [
    { id: 'dagger', name: 'Dague', damage: 6, damageType: 'piercing', type: 'attack', description: 'Dague' },
    { id: 'chromatic_orb', name: 'Orbe chromatique', damage: 18, damageType: 'fire', type: 'attack', description: 'Orbe de feu ou glace' }
  ]
};

const XVART: Monster = {
  id: 'xvart', name: 'Xvart', hp: 7, maxHp: 7, armorClass: 13,
  abilities: createAbilities(8, 14, 12, 8, 11, 8),
  speed: 30,
  challengeRating: 0.125, xpReward: 25, creatureType: 'monstrosity', size: 'small', portrait: '👿', isBoss: false,
  description: 'Petit humanoïde bleu servant Raxivort.',
  skills: [{ id: 'shortsword', name: 'Épée courte', damage: 6, damageType: 'piercing', type: 'attack', description: 'Épée' }]
};

const XVART_WARLOCK: Monster = {
  id: 'xvart_warlock', name: 'Sorcier Xvart', hp: 22, maxHp: 22, armorClass: 12,
  abilities: createAbilities(8, 14, 12, 8, 11, 12),
  speed: 30,
  challengeRating: 1, xpReward: 200, creatureType: 'monstrosity', size: 'small', portrait: '👿', isBoss: false,
  description: 'Xvart lié à Raxivort par un pacte.',
  skills: [
    { id: 'dagger', name: 'Dague', damage: 6, damageType: 'piercing', type: 'attack', description: 'Dague' },
    { id: 'eldritch_blast', name: 'Explosion occulte', damage: 10, damageType: 'force', type: 'attack', description: 'Rayon occulte' }
  ]
};

const DERRO: Monster = {
  id: 'derro', name: 'Derro', hp: 13, maxHp: 13, armorClass: 13,
  abilities: createAbilities(10, 14, 12, 11, 5, 9),
  speed: 30,
  challengeRating: 0.25, xpReward: 50, creatureType: 'humanoid', size: 'small', portrait: '🧝', isBoss: false,
  resistances: ['psychic'],
  description: 'Nain des profondeurs fou et cruel.',
  skills: [{ id: 'shortsword', name: 'Épée courte', damage: 8, damageType: 'piercing', type: 'attack', description: 'Épée' }]
};

const DERRO_SAVANT: Monster = {
  id: 'derro_savant', name: 'Savant Derro', hp: 36, maxHp: 36, armorClass: 13,
  abilities: createAbilities(9, 14, 12, 11, 5, 14),
  speed: 30,
  challengeRating: 3, xpReward: 700, creatureType: 'humanoid', size: 'small', portrait: '🧝', isBoss: false,
  resistances: ['psychic'],
  description: 'Mage derro à la magie chaotique.',
  skills: [
    { id: 'hooked_staff', name: 'Bâton à crochet', damage: 8, damageType: 'piercing', type: 'attack', description: 'Bâton' },
    { id: 'lightning', name: 'Éclair', damage: 18, damageType: 'lightning', type: 'attack', description: 'Éclair', savingThrow: { ability: 'dexterity', dc: 12 } }
  ]
};

const FIRENEWT_WARRIOR: Monster = {
  id: 'firenewt_warrior', name: 'Guerrier Lézard de Feu', hp: 22, maxHp: 22, armorClass: 16,
  abilities: createAbilities(10, 13, 12, 7, 11, 8),
  speed: 30,
  challengeRating: 0.5, xpReward: 100, creatureType: 'humanoid', size: 'medium', portrait: '🦎', isBoss: false,
  immunities: ['fire'],
  description: 'Reptilien humanoïde du feu.',
  skills: [{ id: 'scimitar', name: 'Cimeterre', damage: 8, damageType: 'slashing', type: 'attack', description: 'Cimeterre' }]
};

const FIRENEWT_WARLOCK: Monster = {
  id: 'firenewt_warlock', name: 'Sorcier Lézard de Feu', hp: 33, maxHp: 33, armorClass: 13,
  abilities: createAbilities(13, 14, 14, 9, 11, 14),
  speed: 30,
  challengeRating: 1, xpReward: 200, creatureType: 'humanoid', size: 'medium', portrait: '🦎', isBoss: false,
  immunities: ['fire'],
  description: 'Sorcier reptilien lié à Imix.',
  skills: [
    { id: 'scimitar', name: 'Cimeterre', damage: 8, damageType: 'slashing', type: 'attack', description: 'Cimeterre' },
    { id: 'fire_bolt', name: 'Trait de feu', damage: 12, damageType: 'fire', type: 'attack', description: 'Trait enflammé' }
  ]
};

const GRUNG: Monster = {
  id: 'grung', name: 'Grung', hp: 11, maxHp: 11, armorClass: 12,
  abilities: createAbilities(7, 14, 15, 10, 11, 10),
  speed: 25,
  challengeRating: 0.25, xpReward: 50, creatureType: 'humanoid', size: 'small', portrait: '🐸', isBoss: false,
  immunities: ['poison'], conditionImmunities: ['poisoned'],
  description: 'Grenouille humanoïde venimeuse.',
  skills: [{ id: 'dagger', name: 'Dague', damage: 6, damageType: 'piercing', type: 'attack', description: 'Dague empoisonnée' }]
};

const GRUNG_ELITE: Monster = {
  id: 'grung_elite', name: 'Guerrier Grung Élite', hp: 49, maxHp: 49, armorClass: 13,
  abilities: createAbilities(7, 16, 15, 10, 11, 12),
  speed: 25,
  challengeRating: 2, xpReward: 450, creatureType: 'humanoid', size: 'small', portrait: '🐸', isBoss: false,
  immunities: ['poison'], conditionImmunities: ['poisoned'],
  description: 'Guerrier grenouille d\'élite.',
  skills: [
    { id: 'shortsword', name: 'Épée courte', damage: 10, damageType: 'piercing', type: 'attack', description: 'Épée', attackCount: 2 },
    { id: 'poison_breath', name: 'Souffle empoisonné', damage: 14, damageType: 'poison', type: 'attack', description: 'Nuage toxique', areaOfEffect: true, savingThrow: { ability: 'constitution', dc: 12 } }
  ]
};

// ============================================
// LISTES DE MONSTRES
// ============================================

export const MONSTERS_BY_CR: { [key: number]: Monster[] } = {
  0: [RAT, BAT, LEMURE, HOMUNCULUS, AWAKENED_SHRUB, CRAWLING_CLAW, MYCONID_SPROUT],
  0.125: [GIANT_RAT, KOBOLD, STIRGE, MANES, TWIG_BLIGHT, MERFOLK, MODRON_MONODRONE, FLUMPH, XVART],
  0.25: [SKELETON, ZOMBIE, GOBLIN, WOLF, FLYING_SWORD, PSEUDODRAGON, SPRITE, DRETCH, PIXIE, BLINK_DOG, NEEDLE_BLIGHT, OBLEX_SPAWN, MUD_MEPHIT, STEAM_MEPHIT, SMOKE_MEPHIT, DROW, GIANT_CENTIPEDE, SORROWSWORN_WRETCHED, KUTO_TOA, TROGLODYTE, GRIMLOCK, GIANT_OWL, RIDING_HORSE, KENKU, BULLYWUG, TABAXI, TORTLES, AARAKOCRA, VEGEPYGMY, PIXIE_SPRITE, DERRO, GRUNG],
  0.5: [ORC, HOBGOBLIN, SHADOW, COCKATRICE, DARKMANTLE, RUST_MONSTER, WORG, SATYR, VINE_BLIGHT, GRAY_OOZE, SAHUAGIN, DUST_MEPHIT, ICE_MEPHIT, MAGMA_MEPHIT, GIANT_WASP, DARKLINGS, NORKER, SKULK, PIERCER, MYCONID_ADULT, SVIRFNEBLIN, WARHORSE, GNOLL, LIZARDFOLK, JACKALWERE, FIRENEWT_WARRIOR],
  1: [BUGBEAR, GHOUL, DIRE_WOLF, SPECTER, BROWN_BEAR, ANIMATED_ARMOR, DEATH_DOG, DRYAD, HARPY, HIPPOGRIFF, IMP, QUASIT, GIANT_SPIDER, SCARECROW, QUICKLING, GOBLIN_BOSS, HALF_OGRE, SEA_SPAWN, NILBOG, WYRMLING_BRASS, WYRMLING_COPPER, KUTO_TOA_WHIP, DUERGAR, GIANT_EAGLE, GIANT_OCTOPUS, GIANT_VULTURE, YUAN_TI_PUREBLOOD, THRI_KREEN, MEAZEL, CORE_SPAWN_CRAWLER, KOBOLD_DRAGONSHIELD, KOBOLD_SCALE_SORCERER, XVART_WARLOCK, FIRENEWT_WARLOCK],
  2: [OGRE, GHAST, GARGOYLE, MIMIC, ANKHEG, CENTAUR, ETTERCAP, GELATINOUS_CUBE, GRIFFON, NOTHIC, GRICK, PERYTON, BANDIT_CAPTAIN, CULT_FANATIC, PRIEST, SEA_HAG, AWAKENED_TREE, GIBBERING_MOUTHER, OCHRE_JELLY, INTELLECT_DEVOURER, WERERAT, ORC_EYE_OF_GRUUMSH, ZOMBIE_OGRE, WILL_O_WISP, POLTERGEIST, AZER, CARRION_CRAWLER, GIANT_OGRE, OGRE_ZOMBIE, GITHZERAI_MONK, MODRON_PENTADRONE, DARKLING_ELDER, MEENLOCK, WYRMLING_WHITE, WYRMLING_BLACK, WYRMLING_GREEN, WYRMLING_BRONZE, WYRMLING_SILVER, MYCONID_SOVEREIGN, QUAGGOTH, GIANT_ELK, GIANT_BOAR, GIANT_CONSTRICTOR_SNAKE, PEGASUS, GNOLL_PACK_LORD, LIZARDFOLK_SHAMAN, VEGEPYGMY_CHIEF, HOBGOBLIN_IRON_SHADOW, GRUNG_ELITE],
  3: [WEREWOLF, HELL_HOUND, MINOTAUR, OWLBEAR, WIGHT, BASILISK, DOPPELGANGER, GREEN_HAG, MANTICORE, PHASE_SPIDER, YETI, MUMMY, DISPLACER_BEAST, HOOK_HORROR, WINTER_WOLF, LEUCROTTA, BEARDED_DEVIL, VETERAN, GIANT_SCORPION, REDCAP, GRELL, SPECTATOR, HOBGOBLIN_CAPTAIN, DEEP_SCION, CAVE_FISHER, GITHYANKI_WARRIOR, WYRMLING_BLUE, WYRMLING_GOLD, QUAGGOTH_THONOT, NIGHTMARE, YUAN_TI_MALISON, NEOGI, FLAIL_SNAIL, SWORD_WRAITH_WARRIOR, DERRO_SAVANT],
  4: [BANSHEE, FLAMESKULL, CHUUL, COUATL, GHOST, SUCCUBUS, DEATHLOCK, HELMED_HORROR, BLACK_PUDDING, WEREBOAR, WERETIGER, ORC_WAR_CHIEF, ETTIN, WYRMLING_RED, GNOLL_FANG_OF_YEENOGHU, INCUBUS, SHADOW_DEMON, DYBBUK, HOBGOBLIN_DEVASTATOR, NEOGI_MASTER, BARGHEST],
  5: [TROLL, WRAITH, SALAMANDER, GIANT, AIR_ELEMENTAL, EARTH_ELEMENTAL, FIRE_ELEMENTAL, WATER_ELEMENTAL, SHAMBLING_MOUND, UNICORN, HILL_GIANT, BULETTE, GORGON, REVENANT, ALLIP, SPAWN_OF_KYUSS, CATOBLEPAS, GLADIATOR, GIANT_CROCODILE, TRICERATOPS, NIGHT_HAG, FLESH_GOLEM, OTYUGH, ADULT_OBLEX, UMBER_HULK, STAR_SPAWN_MANGLER, WEREBEAR, VAMPIRE_SPAWN, BONEYARD_HULK, SAHUAGIN_BARON, TROLLWIFE, DROW_ELITE_WARRIOR, MEZZOLOTH, ROPER, SLAAD_RED, BANDERHOBB, GIANT_SHARK, CAMBION, BARLGURA, SPAWN_OF_TIAMAT_WHITE, TLINCALLI, SWARM_OF_CRANIUM_RATS],
  6: [YOUNG_WHITE_DRAGON, MEDUSA, CHIMERA, DRIDER, INVISIBLE_STALKER, BODAK, VROCK, MAGE, MAMMOTH, ANNIS_HAG, HOBGOBLIN_WARLORD, GALEB_DUHR, CYCLOPS, KUTO_TOA_ARCHPRIEST, CHASME, CORE_SPAWN_SEER],
  7: [MIND_FLAYER, STONE_GIANT, YOUNG_BLACK_DRAGON, GRICK_ALPHA, GIANT_APE, BHEUR_HAG, KORRED, SHIELD_GUARDIAN, ONI, DROW_MAGE, DRAEGLOTH, SLAAD_BLUE, YUAN_TI_ABOMINATION],
  8: [FROST_GIANT, YOUNG_GREEN_DRAGON, HYDRA, ASSASSIN, SWORD_WRAITH_COMMANDER, HEZROU, CHAIN_DEVIL, BLACKGUARD, TYRANNOSAURUS_REX, CLOAKER, DROW_PRIESTESS, FOMORIAN, ANKHEG_QUEEN, SLAAD_GREEN, GITHYANKI_KNIGHT],
  9: [FIRE_GIANT, CLOUD_GIANT, YOUNG_BLUE_DRAGON, YOUNG_SILVER_DRAGON, BONE_DEVIL, GLABREZU, WAR_PRIEST, CHAMPION, CLAY_GOLEM, TREANT, NYCALOTH, SLAAD_GRAY, SORROWSWORN_LONELY],
  10: [YOUNG_RED_DRAGON, ABOLETH, YOUNG_GOLD_DRAGON, DEV, STONE_GOLEM, ELDER_OBLEX, STAR_SPAWN_HULK, SLAAD_DEATH, FROGHEMOTH, OBLEX_ELDER_SPECIAL],
  11: [ROC, BEHIR, HORNED_DEVIL, MORKOTH],
  12: [ARCHMAGE, BONECLAW, ERINYES, WARLORD, ARCANALOTH],
  13: [BEHOLDER, VAMPIRE, ADULT_WHITE_DRAGON, STORM_GIANT, NEOTHELID, NALFESHNEE, STAR_SPAWN_SEER, ULTROLOTH, DIRE_TROLL, SORROWSWORN_ANGRY],
  14: [ADULT_BLACK_DRAGON, ELDER_BRAIN, GITHYANKI_SUPREME_COMMANDER, ICE_DEVIL, DEATH_TYRANT],
  15: [ADULT_GREEN_DRAGON, STRAHD_VON_ZAROVICH, PURPLE_WORM, DROW_MATRON, SKULL_LORD, MUMMY_LORD],
  16: [ADULT_BLUE_DRAGON, ADULT_SILVER_DRAGON, PLANETAR, PHOENIX, MARILITH, IRON_GOLEM],
  17: [ADULT_RED_DRAGON, DEATH_KNIGHT, ADULT_GOLD_DRAGON, GORISTRO, NAGPA],
  18: [DEMILICH],
  19: [BALOR],
  20: [PIT_FIEND, ANCIENT_WHITE_DRAGON, NIGHTWALKER],
  21: [LICH, SOLAR, ANCIENT_BLACK_DRAGON, STAR_SPAWN_EMISSARY],
  22: [ANCIENT_GREEN_DRAGON, LEVISTUS, GLASYA, ZARATAN],
  23: [ANCIENT_BLUE_DRAGON, ANCIENT_SILVER_DRAGON, MAMMON, BELIAL, BAALZEBUL, ACERERAK, BAPHOMET, ZUGGTMOY, JUIBLEX, FRAZURBLUU, YEENOGHU, GRAZZT, KRAKEN, EMPYREAN, ELDER_TEMPEST],
  24: [ANCIENT_RED_DRAGON, ANCIENT_GOLD_DRAGON, DISPATER],
  25: [MEPHISTOPHELES],
  26: [ZARIEL, DEMOGORGON, ORCUS, VECNA],
  30: [TARRASQUE, ASMODEUS, TIAMAT, BAHAMUT]
};

export const ALL_MONSTERS: Monster[] = [
  // CR 0-1/8
  RAT, BAT, GIANT_RAT, KOBOLD, STIRGE, LEMURE, MANES, HOMUNCULUS, AWAKENED_SHRUB, TWIG_BLIGHT, CRAWLING_CLAW, MERFOLK, MODRON_MONODRONE, MYCONID_SPROUT, FLUMPH, XVART,
  // CR 1/4
  SKELETON, ZOMBIE, GOBLIN, WOLF, FLYING_SWORD, PSEUDODRAGON, SPRITE, DRETCH, PIXIE, BLINK_DOG, NEEDLE_BLIGHT, OBLEX_SPAWN, MUD_MEPHIT, STEAM_MEPHIT, SMOKE_MEPHIT, DROW, GIANT_CENTIPEDE, SORROWSWORN_WRETCHED, KUTO_TOA, TROGLODYTE, GRIMLOCK, GIANT_OWL, RIDING_HORSE, KENKU, BULLYWUG, TABAXI, TORTLES, AARAKOCRA, VEGEPYGMY, PIXIE_SPRITE, DERRO, GRUNG,
  // CR 1/2
  ORC, HOBGOBLIN, SHADOW, COCKATRICE, DARKMANTLE, RUST_MONSTER, WORG, SATYR, VINE_BLIGHT, GRAY_OOZE, SAHUAGIN, DUST_MEPHIT, ICE_MEPHIT, MAGMA_MEPHIT, GIANT_WASP, DARKLINGS, NORKER, SKULK, PIERCER, MYCONID_ADULT, SVIRFNEBLIN, WARHORSE, GNOLL, LIZARDFOLK, JACKALWERE, FIRENEWT_WARRIOR,
  // CR 1
  BUGBEAR, GHOUL, DIRE_WOLF, SPECTER, BROWN_BEAR, ANIMATED_ARMOR, DEATH_DOG, DRYAD, HARPY, HIPPOGRIFF, IMP, QUASIT, GIANT_SPIDER, SCARECROW, QUICKLING, GOBLIN_BOSS, HALF_OGRE, SEA_SPAWN, NILBOG, WYRMLING_BRASS, WYRMLING_COPPER, KUTO_TOA_WHIP, DUERGAR, GIANT_EAGLE, GIANT_OCTOPUS, GIANT_VULTURE, YUAN_TI_PUREBLOOD, THRI_KREEN, MEAZEL, CORE_SPAWN_CRAWLER, KOBOLD_DRAGONSHIELD, KOBOLD_SCALE_SORCERER, XVART_WARLOCK, FIRENEWT_WARLOCK,
  // CR 2
  OGRE, GHAST, GARGOYLE, MIMIC, ANKHEG, CENTAUR, ETTERCAP, GELATINOUS_CUBE, GRIFFON, NOTHIC, GRICK, PERYTON, BANDIT_CAPTAIN, CULT_FANATIC, PRIEST, SEA_HAG, AWAKENED_TREE, GIBBERING_MOUTHER, OCHRE_JELLY, INTELLECT_DEVOURER, WERERAT, ORC_EYE_OF_GRUUMSH, ZOMBIE_OGRE, WILL_O_WISP, POLTERGEIST, AZER, CARRION_CRAWLER, GIANT_OGRE, OGRE_ZOMBIE, GITHZERAI_MONK, MODRON_PENTADRONE, DARKLING_ELDER, MEENLOCK, WYRMLING_WHITE, WYRMLING_BLACK, WYRMLING_GREEN, WYRMLING_BRONZE, WYRMLING_SILVER, MYCONID_SOVEREIGN, QUAGGOTH, GIANT_ELK, GIANT_BOAR, GIANT_CONSTRICTOR_SNAKE, PEGASUS, GNOLL_PACK_LORD, LIZARDFOLK_SHAMAN, VEGEPYGMY_CHIEF, HOBGOBLIN_IRON_SHADOW, GRUNG_ELITE,
  // CR 3
  WEREWOLF, HELL_HOUND, MINOTAUR, OWLBEAR, WIGHT, BASILISK, DOPPELGANGER, GREEN_HAG, MANTICORE, PHASE_SPIDER, YETI, MUMMY, DISPLACER_BEAST, HOOK_HORROR, WINTER_WOLF, LEUCROTTA, BEARDED_DEVIL, VETERAN, GIANT_SCORPION, REDCAP, GRELL, SPECTATOR, HOBGOBLIN_CAPTAIN, DEEP_SCION, CAVE_FISHER, GITHYANKI_WARRIOR, WYRMLING_BLUE, WYRMLING_GOLD, QUAGGOTH_THONOT, NIGHTMARE, YUAN_TI_MALISON, NEOGI, FLAIL_SNAIL, SWORD_WRAITH_WARRIOR, DERRO_SAVANT,
  // CR 4
  BANSHEE, FLAMESKULL, CHUUL, COUATL, GHOST, SUCCUBUS, DEATHLOCK, HELMED_HORROR, BLACK_PUDDING, WEREBOAR, WERETIGER, ORC_WAR_CHIEF, ETTIN, WYRMLING_RED, GNOLL_FANG_OF_YEENOGHU, INCUBUS, SHADOW_DEMON, DYBBUK, HOBGOBLIN_DEVASTATOR, NEOGI_MASTER, BARGHEST,
  // CR 5
  TROLL, WRAITH, SALAMANDER, GIANT, AIR_ELEMENTAL, EARTH_ELEMENTAL, FIRE_ELEMENTAL, WATER_ELEMENTAL, SHAMBLING_MOUND, UNICORN, HILL_GIANT, BULETTE, GORGON, REVENANT, ALLIP, SPAWN_OF_KYUSS, CATOBLEPAS, GLADIATOR, GIANT_CROCODILE, TRICERATOPS, NIGHT_HAG, FLESH_GOLEM, OTYUGH, ADULT_OBLEX, UMBER_HULK, STAR_SPAWN_MANGLER, WEREBEAR, VAMPIRE_SPAWN, BONEYARD_HULK, SAHUAGIN_BARON, TROLLWIFE, DROW_ELITE_WARRIOR, MEZZOLOTH, ROPER, SLAAD_RED, BANDERHOBB, GIANT_SHARK, CAMBION, BARLGURA, SPAWN_OF_TIAMAT_WHITE, TLINCALLI, SWARM_OF_CRANIUM_RATS,
  // CR 6
  YOUNG_WHITE_DRAGON, MEDUSA, CHIMERA, DRIDER, INVISIBLE_STALKER, BODAK, VROCK, MAGE, MAMMOTH, ANNIS_HAG, HOBGOBLIN_WARLORD, GALEB_DUHR, CYCLOPS, KUTO_TOA_ARCHPRIEST, CHASME, CORE_SPAWN_SEER,
  // CR 7-10 (Jeunes dragons, monstres, fiélons, constructs, slaads)
  MIND_FLAYER, STONE_GIANT, YOUNG_BLACK_DRAGON, GRICK_ALPHA, GIANT_APE, BHEUR_HAG, KORRED, SHIELD_GUARDIAN, ONI, DROW_MAGE, DRAEGLOTH, SLAAD_BLUE, YUAN_TI_ABOMINATION,
  FROST_GIANT, YOUNG_GREEN_DRAGON, HYDRA, ASSASSIN, SWORD_WRAITH_COMMANDER, HEZROU, CHAIN_DEVIL, BLACKGUARD, TYRANNOSAURUS_REX, CLOAKER, DROW_PRIESTESS, FOMORIAN, ANKHEG_QUEEN, SLAAD_GREEN, GITHYANKI_KNIGHT,
  FIRE_GIANT, CLOUD_GIANT, YOUNG_BLUE_DRAGON, YOUNG_SILVER_DRAGON, BONE_DEVIL, GLABREZU, WAR_PRIEST, CHAMPION, CLAY_GOLEM, TREANT, NYCALOTH, SLAAD_GRAY, SORROWSWORN_LONELY,
  YOUNG_RED_DRAGON, ABOLETH, YOUNG_GOLD_DRAGON, DEV, STONE_GOLEM, ELDER_OBLEX, STAR_SPAWN_HULK, SLAAD_DEATH, FROGHEMOTH, OBLEX_ELDER_SPECIAL,
  // CR 11-12
  ROC, BEHIR, ARCHMAGE, BONECLAW, HORNED_DEVIL, ERINYES, WARLORD, MORKOTH, ARCANALOTH,
  // CR 13-17 (Dragons adultes, boss intermédiaires, célestes, fiélons majeurs, constructs)
  BEHOLDER, VAMPIRE, ADULT_WHITE_DRAGON, STORM_GIANT, NEOTHELID, NALFESHNEE, STAR_SPAWN_SEER, ULTROLOTH, DIRE_TROLL, SORROWSWORN_ANGRY,
  ADULT_BLACK_DRAGON, ELDER_BRAIN, GITHYANKI_SUPREME_COMMANDER, ICE_DEVIL, DEATH_TYRANT,
  ADULT_GREEN_DRAGON, STRAHD_VON_ZAROVICH, PURPLE_WORM, DROW_MATRON, SKULL_LORD, MUMMY_LORD,
  ADULT_BLUE_DRAGON, ADULT_SILVER_DRAGON, PLANETAR, PHOENIX, MARILITH, IRON_GOLEM,
  ADULT_RED_DRAGON, DEATH_KNIGHT, ADULT_GOLD_DRAGON, GORISTRO, NAGPA,
  // CR 18
  DEMILICH,
  // CR 19-21 (Boss puissants)
  BALOR,
  PIT_FIEND, ANCIENT_WHITE_DRAGON, NIGHTWALKER,
  LICH, SOLAR, ANCIENT_BLACK_DRAGON, STAR_SPAWN_EMISSARY,
  // CR 22-24 (Dragons anciens, Archidiables, Seigneurs démons, Titans)
  ANCIENT_GREEN_DRAGON, LEVISTUS, GLASYA, ZARATAN,
  ANCIENT_BLUE_DRAGON, ANCIENT_SILVER_DRAGON, MAMMON, BELIAL, BAALZEBUL, ACERERAK, BAPHOMET, ZUGGTMOY, JUIBLEX, FRAZURBLUU, YEENOGHU, GRAZZT, KRAKEN, EMPYREAN, ELDER_TEMPEST,
  ANCIENT_RED_DRAGON, ANCIENT_GOLD_DRAGON, DISPATER,
  MEPHISTOPHELES,
  // CR 26+ (Entités quasi-divines)
  ZARIEL, DEMOGORGON, ORCUS, VECNA,
  // CR 30 (Divinités et créatures légendaires)
  TARRASQUE, ASMODEUS, TIAMAT, BAHAMUT
];

// Alias pour compatibilité avec l'ancien code
export const MONSTERS = ALL_MONSTERS;

// ============================================
// LAZY LOADING - MONSTRES CONVERTIS (CR 1-100)
// ============================================

/**
 * Obtient tous les monstres convertis vers l'échelle Eternalys (CR 1-100)
 * La conversion est effectuée à la demande, pas à l'import
 */
export function getConvertedMonsters(): Monster[] {
  return getLazyConvertedMonsters(() => ALL_MONSTERS);
}

/**
 * Obtient tous les boss convertis vers l'échelle Eternalys (CR 1-100)
 */
export function getConvertedBosses(): Monster[] {
  return getLazyConvertedBosses(() => BOSSES);
}

/**
 * Obtient un monstre converti par son ID
 */
export function getConvertedMonsterById(id: string): Monster | undefined {
  const monster = ALL_MONSTERS.find(m => m.id === id);
  if (!monster) return undefined;
  return convertMonsterToEternalysScale(monster);
}

// PERSONNAGES HOSTILES NOMMÉS (pour le bestiaire) - version D&D
const HOSTILE_NPCS_DND: Monster[] = [
  // Archidiables
  ZARIEL, ASMODEUS, MEPHISTOPHELES, DISPATER, MAMMON, BELIAL, LEVISTUS, GLASYA, BAALZEBUL,
  // Seigneurs Démons
  DEMOGORGON, ORCUS, GRAZZT, YEENOGHU, JUIBLEX, ZUGGTMOY, BAPHOMET, FRAZURBLUU,
  // Morts-vivants légendaires
  STRAHD_VON_ZAROVICH, ACERERAK, VECNA,
  // Divinités hostiles
  TIAMAT, BAHAMUT,
  // Autres personnages hostiles nommés
  DROW_MATRON, GITHYANKI_SUPREME_COMMANDER, ARCHMAGE
];

export const HOSTILE_NPCS: Monster[] = HOSTILE_NPCS_DND;

// Boss organisés par tier de difficulté
export const BOSSES_TIER_1: Monster[] = [BEHOLDER, VAMPIRE, ADULT_WHITE_DRAGON, STORM_GIANT]; // Niveau 1 du donjon
export const BOSSES_TIER_2: Monster[] = [ADULT_RED_DRAGON, DEATH_KNIGHT, LICH, ADULT_BLACK_DRAGON, ADULT_BLUE_DRAGON, ADULT_GREEN_DRAGON, ADULT_GOLD_DRAGON, ADULT_SILVER_DRAGON, STRAHD_VON_ZAROVICH, PURPLE_WORM, DROW_MATRON, PLANETAR, PHOENIX, SKULL_LORD, ELDER_BRAIN, DEMILICH]; // Niveau 2 du donjon
export const BOSSES_TIER_3: Monster[] = [ANCIENT_RED_DRAGON, ANCIENT_WHITE_DRAGON, ANCIENT_BLACK_DRAGON, ANCIENT_BLUE_DRAGON, ANCIENT_GREEN_DRAGON, ANCIENT_GOLD_DRAGON, ANCIENT_SILVER_DRAGON, BALOR, PIT_FIEND, SOLAR, ACERERAK, NIGHTWALKER, STAR_SPAWN_EMISSARY, KRAKEN, EMPYREAN, ZARATAN, ELDER_TEMPEST]; // Niveau 3 du donjon
export const BOSSES_TIER_4: Monster[] = [ZARIEL, MEPHISTOPHELES, DISPATER, DEMOGORGON, ORCUS, GRAZZT, YEENOGHU, BAPHOMET, VECNA, MAMMON, BELIAL, LEVISTUS, GLASYA, BAALZEBUL, ZUGGTMOY, JUIBLEX, FRAZURBLUU]; // Niveau 4 du donjon (Archidiables et Seigneurs Démons)
export const BOSSES_TIER_5: Monster[] = [TARRASQUE, ASMODEUS, TIAMAT, BAHAMUT]; // Niveau 5+ (Divinités et Tarrasque)

export const BOSSES: Monster[] = [
  ...BOSSES_TIER_1, ...BOSSES_TIER_2, ...BOSSES_TIER_3, ...BOSSES_TIER_4, ...BOSSES_TIER_5
];

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

// Obtenir un monstre aléatoire par CR
export function getRandomMonsterByCR(cr: number): Monster {
  const monsters = MONSTERS_BY_CR[cr] || MONSTERS_BY_CR[0.25];
  const index = Math.floor(Math.random() * monsters.length);
  return JSON.parse(JSON.stringify(monsters[index])); // Deep copy
}

// Obtenir un monstre aléatoire adapté au niveau de donjon
export function getRandomMonster(dungeonLevel: number = 1): Monster {
  // Calculer le CR cible basé sur le niveau du donjon
  let minCR: number, maxCR: number;
  
  if (dungeonLevel <= 5) {
    minCR = 0; maxCR = 2;
  } else if (dungeonLevel <= 10) {
    minCR = 1; maxCR = 5;
  } else if (dungeonLevel <= 20) {
    minCR = 3; maxCR = 10;
  } else if (dungeonLevel <= 30) {
    minCR = 6; maxCR = 15;
  } else if (dungeonLevel <= 40) {
    minCR = 10; maxCR = 20;
  } else {
    minCR = 15; maxCR = 30;
  }
  
  // Trouver des monstres dans cette plage de CR
  const availableCRs = Object.keys(MONSTERS_BY_CR)
    .map(Number)
    .filter(cr => cr >= minCR && cr <= maxCR);
  
  // Si pas de monstres dans cette plage, prendre le CR le plus proche
  if (availableCRs.length === 0) {
    const allCRs = Object.keys(MONSTERS_BY_CR).map(Number).sort((a, b) => a - b);
    const closestCR = allCRs.reduce((prev, curr) => 
      Math.abs(curr - minCR) < Math.abs(prev - minCR) ? curr : prev
    );
    return getRandomMonsterByCR(closestCR);
  }
  
  const randomCR = availableCRs[Math.floor(Math.random() * availableCRs.length)];
  return getRandomMonsterByCR(randomCR);
}

// Obtenir des monstres aléatoires pour une rencontre
export function getRandomEncounter(targetCR: number, count: number = 1): Monster[] {
  const result: Monster[] = [];
  const availableCRs = Object.keys(MONSTERS_BY_CR)
    .map(Number)
    .filter(cr => cr <= targetCR)
    .sort((a, b) => b - a);
  
  for (let i = 0; i < count; i++) {
    // Choisir un CR aléatoire proche du target
    const crIndex = Math.min(
      Math.floor(Math.random() * 3),
      availableCRs.length - 1
    );
    const selectedCR = availableCRs[crIndex] || 0.25;
    result.push(getRandomMonsterByCR(selectedCR));
  }
  
  return result;
}

// Obtenir un boss aléatoire adapté au niveau du donjon
export function getRandomBoss(dungeonLevel: number = 1): Monster {
  // Sélectionner les boss par tier basé sur le niveau du donjon
  let bossList: Monster[];
  
  if (dungeonLevel >= 41) {
    bossList = BOSSES_TIER_5;
  } else if (dungeonLevel >= 31) {
    bossList = [...BOSSES_TIER_4, ...BOSSES_TIER_5];
  } else if (dungeonLevel >= 21) {
    bossList = [...BOSSES_TIER_3, ...BOSSES_TIER_4];
  } else if (dungeonLevel >= 11) {
    bossList = [...BOSSES_TIER_2, ...BOSSES_TIER_3];
  } else if (dungeonLevel >= 6) {
    bossList = [...BOSSES_TIER_1, ...BOSSES_TIER_2];
  } else {
    bossList = BOSSES_TIER_1;
  }
  
  // Fallback si pas de boss dans le tier
  if (!bossList || bossList.length === 0) {
    bossList = BOSSES_TIER_1;
  }
  
  const index = Math.floor(Math.random() * bossList.length);
  const boss = JSON.parse(JSON.stringify(bossList[index])); // Deep copy
  
  // Réinitialiser les actions légendaires
  if (boss.legendaryActionsPerTurn) {
    boss.legendaryActionsRemaining = boss.legendaryActionsPerTurn;
  }
  
  return boss;
}

// Obtenir des monstres par type
export function getMonstersByType(type: CreatureType): Monster[] {
  return ALL_MONSTERS.filter(m => m.creatureType === type);
}

// Obtenir un monstre par ID
export function getMonsterById(id: string): Monster | undefined {
  return ALL_MONSTERS.find(m => m.id === id);
}

// Réinitialiser les actions légendaires (appelé à chaque nouveau tour)
export function resetLegendaryActions(monster: Monster): void {
  if (monster.legendaryActionsPerTurn) {
    monster.legendaryActionsRemaining = monster.legendaryActionsPerTurn;
  }
}

// Utiliser une action légendaire
export function useLegendaryAction(monster: Monster, action: LegendaryAction): boolean {
  if (!monster.legendaryActionsRemaining || monster.legendaryActionsRemaining < action.cost) {
    return false;
  }
  monster.legendaryActionsRemaining -= action.cost;
  return true;
}

// Tester la recharge d'une compétence (comme les souffles de dragon)
export function testRecharge(skill: MonsterSkill): boolean {
  if (!skill.recharge) return true;
  const roll = Math.floor(Math.random() * 6) + 1;
  return roll >= skill.recharge.min;
}
