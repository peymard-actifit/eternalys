// ============================================
// BESTIAIRE D&D 5e - ETHERNALYS
// Monstres organisés par Challenge Rating (CR)
// ============================================

import { Monster, CreatureType, AbilityScores, LegendaryAction, MonsterSkill } from '../types/game.types';

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
  attack: 1, defense: 0, magicDefense: 0, speed: 20,
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
  attack: 1, defense: 0, magicDefense: 0, speed: 30,
  challengeRating: 0, xpReward: 10,
  creatureType: 'beast', size: 'tiny',
  portrait: '🦇',
  isBoss: false
};

const GIANT_RAT: Monster = {
  id: 'giant_rat',
  name: 'Rat géant',
  hp: 7, maxHp: 7,
  armorClass: 12,
  abilities: createAbilities(7, 15, 11, 2, 10, 4),
  attack: 4, defense: 1, magicDefense: 0, speed: 30,
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
  attack: 4, defense: 1, magicDefense: 0, speed: 30,
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
  attack: 5, defense: 2, magicDefense: 1, speed: 30,
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
  attack: 4, defense: 3, magicDefense: 1, speed: 20,
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
  attack: 5, defense: 2, magicDefense: 1, speed: 30,
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
  attack: 7, defense: 2, magicDefense: 1, speed: 40,
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
  attack: 9, defense: 3, magicDefense: 2, speed: 30,
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
  attack: 6, defense: 4, magicDefense: 2, speed: 30,
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
  attack: 9, magicAttack: 9, defense: 2, magicDefense: 3, speed: 40,
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
  attack: 11, defense: 4, magicDefense: 2, speed: 30,
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
  attack: 7, defense: 2, magicDefense: 2, speed: 30,
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
  attack: 11, defense: 3, magicDefense: 2, speed: 50,
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
  attack: 10, magicAttack: 10, defense: 2, magicDefense: 4, speed: 50,
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
  attack: 11, defense: 4, magicDefense: 2, speed: 40,
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
  attack: 13, defense: 4, magicDefense: 2, speed: 40,
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
  attack: 9, defense: 3, magicDefense: 3, speed: 30,
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
  attack: 10, defense: 5, magicDefense: 4, speed: 60,
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
  attack: 11, defense: 4, magicDefense: 3, speed: 15,
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
  attack: 11, defense: 4, magicDefense: 3, speed: 40,
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
  attack: 10, magicAttack: 21, defense: 4, magicDefense: 4, speed: 50,
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
  attack: 17, defense: 5, magicDefense: 3, speed: 40,
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
  attack: 14, defense: 5, magicDefense: 2, speed: 40,
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
  attack: 11, defense: 4, magicDefense: 4, speed: 30,
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
  attack: 12, magicAttack: 12, defense: 3, magicDefense: 5, speed: 40,
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
  attack: 13, magicAttack: 13, defense: 3, magicDefense: 5, speed: 40,
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
  attack: 14, defense: 5, magicDefense: 3, speed: 30,
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
  attack: 17, magicAttack: 17, defense: 4, magicDefense: 5, speed: 60,
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
  attack: 13, magicAttack: 13, defense: 5, magicDefense: 4, speed: 30,
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
  attack: 15, magicAttack: 45, defense: 7, magicDefense: 6, speed: 80,
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
  attack: 13, magicAttack: 13, defense: 5, magicDefense: 5, speed: 30,
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
  attack: 15, magicAttack: 22, defense: 5, magicDefense: 7, speed: 30,
  challengeRating: 7, xpReward: 2900,
  creatureType: 'aberration', size: 'medium',
  portrait: '🦑',
  isBoss: false,
  resistances: ['psychic'],
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
  attack: 18, defense: 6, magicDefense: 3, speed: 40,
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
  attack: 19, defense: 7, magicDefense: 4, speed: 40,
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
  attack: 25, defense: 7, magicDefense: 5, speed: 40,
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
  attack: 28, defense: 8, magicDefense: 5, speed: 30,
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
  attack: 21, magicAttack: 21, defense: 8, magicDefense: 6, speed: 40,
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
  attack: 18, magicAttack: 56, defense: 8, magicDefense: 7, speed: 80,
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
  attack: 19, magicAttack: 19, defense: 7, magicDefense: 7, speed: 40,
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
  attack: 14, magicAttack: 28, defense: 8, magicDefense: 10, speed: 20,
  challengeRating: 8, xpReward: 4000,
  creatureType: 'aberration', size: 'large',
  portrait: '👁️',
  isBoss: true,
  isLegendary: true,
  legendaryActionsPerTurn: 2,
  conditionImmunities: ['prone'],
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
  attack: 20, magicAttack: 45, defense: 10, magicDefense: 10, speed: 60,
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
  attack: 16, magicAttack: 18, defense: 8, magicDefense: 9, speed: 35,
  challengeRating: 8, xpReward: 4000,
  creatureType: 'undead', size: 'medium',
  portrait: '🧛',
  isBoss: true,
  isLegendary: true,
  legendaryActionsPerTurn: 2,
  resistances: ['necrotic'],
  immunities: ['poison'],
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
  attack: 18, magicAttack: 22, defense: 10, magicDefense: 9, speed: 30,
  challengeRating: 10, xpReward: 6000,
  creatureType: 'undead', size: 'medium',
  portrait: '⚔️',
  isBoss: true,
  immunities: ['necrotic', 'poison'],
  conditionImmunities: ['frightened', 'poisoned'],
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
  attack: 24, magicAttack: 55, defense: 12, magicDefense: 12, speed: 70,
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
  attack: 12, magicAttack: 38, defense: 8, magicDefense: 14, speed: 30,
  challengeRating: 14, xpReward: 12000,
  creatureType: 'undead', size: 'medium',
  portrait: '💀',
  isBoss: true,
  isLegendary: true,
  legendaryActionsPerTurn: 2,
  resistances: ['cold', 'lightning', 'necrotic'],
  immunities: ['poison'],
  conditionImmunities: ['charmed', 'frightened', 'paralyzed', 'poisoned'],
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
  attack: 22, magicAttack: 30, defense: 11, magicDefense: 10, speed: 40,
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
  attack: 22, magicAttack: 32, defense: 11, magicDefense: 11, speed: 35,
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
  attack: 20, magicAttack: 32, defense: 12, magicDefense: 14, speed: 60,
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
  attack: 26, defense: 14, magicDefense: 12, speed: 40,
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
  attack: 3, defense: 0, magicDefense: 0, speed: 40,
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
  attack: 5, defense: 3, magicDefense: 0, speed: 50,
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
  attack: 4, defense: 1, magicDefense: 2, speed: 15,
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
  attack: 2, defense: 0, magicDefense: 3, speed: 40,
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
  attack: 6, defense: 2, magicDefense: 2, speed: 20,
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
  attack: 8, defense: 2, magicDefense: 1, speed: 10,
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
  attack: 6, defense: 3, magicDefense: 2, speed: 40,
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
  attack: 8, defense: 5, magicDefense: 0, speed: 25,
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
  attack: 9, defense: 3, magicDefense: 2, speed: 40,
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
  attack: 5, defense: 2, magicDefense: 4, speed: 30,
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
  attack: 7, defense: 2, magicDefense: 2, speed: 40,
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
  attack: 9, defense: 2, magicDefense: 2, speed: 60,
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
  attack: 11, defense: 4, magicDefense: 2, speed: 30,
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
  attack: 12, defense: 3, magicDefense: 2, speed: 50,
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
  attack: 10, defense: 3, magicDefense: 2, speed: 30,
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
  attack: 8, defense: 2, magicDefense: 0, speed: 15,
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
  attack: 12, defense: 4, magicDefense: 2, speed: 80,
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
  attack: 10, defense: 4, magicDefense: 3, speed: 30,
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
  attack: 12, defense: 5, magicDefense: 2, speed: 20,
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
  attack: 11, defense: 4, magicDefense: 3, speed: 30,
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
  attack: 13, defense: 5, magicDefense: 4, speed: 30,
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
  attack: 13, defense: 4, magicDefense: 2, speed: 50,
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
  attack: 11, defense: 3, magicDefense: 2, speed: 30,
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
  attack: 13, defense: 4, magicDefense: 2, speed: 40,
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
  attack: 14, defense: 6, magicDefense: 2, speed: 30,
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
  attack: 12, defense: 6, magicDefense: 8, speed: 90,
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
  attack: 10, defense: 3, magicDefense: 4, speed: 40,
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
  attack: 8, defense: 4, magicDefense: 6, speed: 60,
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
  attack: 14, defense: 4, magicDefense: 3, speed: 90,
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
  attack: 16, defense: 7, magicDefense: 3, speed: 30,
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
  attack: 14, defense: 3, magicDefense: 3, speed: 50,
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
  attack: 15, defense: 5, magicDefense: 3, speed: 90,
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
  attack: 15, defense: 5, magicDefense: 3, speed: 20,
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
  attack: 12, defense: 4, magicDefense: 6, speed: 50,
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
  attack: 15, defense: 5, magicDefense: 4, speed: 60,
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
  attack: 14, defense: 6, magicDefense: 5, speed: 30,
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
  attack: 14, defense: 4, magicDefense: 4, speed: 50,
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
// LISTES DE MONSTRES
// ============================================

export const MONSTERS_BY_CR: { [key: number]: Monster[] } = {
  0: [RAT, BAT],
  0.125: [GIANT_RAT, KOBOLD, STIRGE],
  0.25: [SKELETON, ZOMBIE, GOBLIN, WOLF, FLYING_SWORD, PSEUDODRAGON, SPRITE],
  0.5: [ORC, HOBGOBLIN, SHADOW, COCKATRICE, DARKMANTLE, RUST_MONSTER],
  1: [BUGBEAR, GHOUL, DIRE_WOLF, SPECTER, BROWN_BEAR, ANIMATED_ARMOR, DEATH_DOG, DRYAD, HARPY, HIPPOGRIFF],
  2: [OGRE, GHAST, GARGOYLE, MIMIC, ANKHEG, CENTAUR, ETTERCAP, GELATINOUS_CUBE, GRIFFON, NOTHIC],
  3: [WEREWOLF, HELL_HOUND, MINOTAUR, OWLBEAR, WIGHT, BASILISK, DOPPELGANGER, GREEN_HAG, MANTICORE, PHASE_SPIDER, YETI],
  4: [BANSHEE, FLAMESKULL, CHUUL, COUATL, GHOST, SUCCUBUS],
  5: [TROLL, WRAITH, SALAMANDER, GIANT, AIR_ELEMENTAL, EARTH_ELEMENTAL, FIRE_ELEMENTAL, WATER_ELEMENTAL, SHAMBLING_MOUND, UNICORN],
  6: [YOUNG_WHITE_DRAGON, MEDUSA, CHIMERA, DRIDER, INVISIBLE_STALKER],
  7: [MIND_FLAYER, STONE_GIANT],
  8: [FROST_GIANT],
  9: [FIRE_GIANT, CLOUD_GIANT],
  10: [YOUNG_RED_DRAGON, ABOLETH],
  13: [BEHOLDER, VAMPIRE],
  17: [ADULT_RED_DRAGON, DEATH_KNIGHT],
  19: [BALOR],
  20: [PIT_FIEND],
  21: [LICH, SOLAR],
  24: [ANCIENT_RED_DRAGON],
  30: [TARRASQUE]
};

export const ALL_MONSTERS: Monster[] = [
  // CR 0-1/8
  RAT, BAT, GIANT_RAT, KOBOLD, STIRGE,
  // CR 1/4
  SKELETON, ZOMBIE, GOBLIN, WOLF, FLYING_SWORD, PSEUDODRAGON, SPRITE,
  // CR 1/2
  ORC, HOBGOBLIN, SHADOW, COCKATRICE, DARKMANTLE, RUST_MONSTER,
  // CR 1
  BUGBEAR, GHOUL, DIRE_WOLF, SPECTER, BROWN_BEAR, ANIMATED_ARMOR, DEATH_DOG, DRYAD, HARPY, HIPPOGRIFF,
  // CR 2
  OGRE, GHAST, GARGOYLE, MIMIC, ANKHEG, CENTAUR, ETTERCAP, GELATINOUS_CUBE, GRIFFON, NOTHIC,
  // CR 3
  WEREWOLF, HELL_HOUND, MINOTAUR, OWLBEAR, WIGHT, BASILISK, DOPPELGANGER, GREEN_HAG, MANTICORE, PHASE_SPIDER, YETI,
  // CR 4
  BANSHEE, FLAMESKULL, CHUUL, COUATL, GHOST, SUCCUBUS,
  // CR 5
  TROLL, WRAITH, SALAMANDER, GIANT, AIR_ELEMENTAL, EARTH_ELEMENTAL, FIRE_ELEMENTAL, WATER_ELEMENTAL, SHAMBLING_MOUND, UNICORN,
  // CR 6
  YOUNG_WHITE_DRAGON, MEDUSA, CHIMERA, DRIDER, INVISIBLE_STALKER,
  // CR 7+
  MIND_FLAYER, STONE_GIANT,
  FROST_GIANT, FIRE_GIANT, CLOUD_GIANT,
  YOUNG_RED_DRAGON, ABOLETH,
  // BOSS
  BEHOLDER, VAMPIRE,
  ADULT_RED_DRAGON, DEATH_KNIGHT,
  BALOR, PIT_FIEND,
  LICH, SOLAR,
  ANCIENT_RED_DRAGON,
  TARRASQUE
];

// Alias pour compatibilité avec l'ancien code
export const MONSTERS = ALL_MONSTERS;

// Boss organisés par tier de difficulté
export const BOSSES_TIER_1: Monster[] = [BEHOLDER, VAMPIRE]; // Niveau 1 du donjon
export const BOSSES_TIER_2: Monster[] = [ADULT_RED_DRAGON, DEATH_KNIGHT, LICH]; // Niveau 2 du donjon
export const BOSSES_TIER_3: Monster[] = [ANCIENT_RED_DRAGON, BALOR, PIT_FIEND, SOLAR]; // Niveau 3+ du donjon
export const BOSSES_TIER_4: Monster[] = [TARRASQUE]; // Niveau 4+ du donjon (légendaire)

export const BOSSES: Monster[] = [
  ...BOSSES_TIER_1, ...BOSSES_TIER_2, ...BOSSES_TIER_3, ...BOSSES_TIER_4
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

// Obtenir un monstre aléatoire (pour compatibilité)
export function getRandomMonster(): Monster {
  // Choisir un CR aléatoire parmi les monstres normaux (CR 0-10)
  const normalCRs = [0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const randomCR = normalCRs[Math.floor(Math.random() * normalCRs.length)];
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
  let bossList: Monster[];
  
  // Sélectionner le tier de boss en fonction du niveau du donjon
  if (dungeonLevel >= 4) {
    // Niveau 4+ : tous les boss possibles (y compris Tarrasque)
    bossList = [...BOSSES_TIER_3, ...BOSSES_TIER_4];
  } else if (dungeonLevel === 3) {
    // Niveau 3 : boss tier 2-3
    bossList = [...BOSSES_TIER_2, ...BOSSES_TIER_3];
  } else if (dungeonLevel === 2) {
    // Niveau 2 : boss tier 1-2
    bossList = [...BOSSES_TIER_1, ...BOSSES_TIER_2];
  } else {
    // Niveau 1 : boss tier 1 uniquement
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
