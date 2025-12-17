import { Character, AbilityScores } from '../types/game.types';

// Helper pour créer les caractéristiques D&D
const createAbilities = (str: number, dex: number, con: number, int: number, wis: number, cha: number): AbilityScores => ({
  strength: str, dexterity: dex, constitution: con, intelligence: int, wisdom: wis, charisma: cha
});

// ==============================================
// SYSTÈME D'ÉQUILIBRAGE ETHERNALYS v2.0
// ==============================================
// Cooldowns basés sur la puissance:
// - Attaques faibles (< 30 dégâts): 0-1 tour
// - Attaques moyennes (30-45 dégâts): 2 tours
// - Attaques fortes (> 45 dégâts): 3 tours
// - Soins individuels: 2 tours
// - Soins de groupe: 4 tours
// - Buffs personnels: 2 tours
// - Buffs d'équipe: 4 tours
// - Débuffs: 2-3 tours
// ==============================================

export const AVAILABLE_CHARACTERS: Character[] = [
  // ============================================
  // GUERRIERS
  // ============================================
  {
    id: 'warrior',
    name: 'Thorin',
    class: 'Guerrier',
    level: 5,
    hp: 130,
    maxHp: 130,
    abilities: createAbilities(18, 14, 16, 10, 12, 10),
    armorClass: 18,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['strength', 'constitution'],
    attack: 24,
    magicAttack: 5,
    defense: 18,
    magicDefense: 10,
    speed: 30,
    portrait: '⚔️',
    skills: [
      { 
        id: 'slash', 
        name: 'Tranche', 
        damage: 28, 
        type: 'attack',
        damageType: 'slashing',
        targetType: 'enemy',
        cooldown: 1,
        description: 'Attaque tranchante rapide (28 dégâts)'
      },
      { 
        id: 'war_cry', 
        name: 'Cri de guerre', 
        damage: 0, 
        type: 'buff',
        targetType: 'all_allies',
        buffStats: { stat: 'attack', value: 5, turns: 3 },
        cooldown: 4,
        description: 'Booste l\'attaque de toute l\'équipe de +5 pendant 3 tours'
      }
    ]
  },
  {
    id: 'berserker',
    name: 'Ragnar',
    class: 'Berserker',
    level: 5,
    hp: 110,
    maxHp: 110,
    abilities: createAbilities(20, 14, 16, 8, 10, 8),
    armorClass: 14,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['strength', 'constitution'],
    attack: 32,
    magicAttack: 3,
    defense: 10,
    magicDefense: 5,
    speed: 38,
    portrait: '🪓',
    skills: [
      { 
        id: 'fury', 
        name: 'Furie', 
        damage: 40, 
        type: 'attack',
        damageType: 'slashing',
        targetType: 'enemy',
        cooldown: 3,
        description: 'Attaque dévastatrice à 40 dégâts tranchants'
      },
      { 
        id: 'blood_rage', 
        name: 'Rage sanguinaire', 
        damage: 0, 
        type: 'buff',
        targetType: 'self',
        buffStats: { stat: 'attack', value: 12, turns: 2 },
        cooldown: 3,
        description: 'Booste sa propre attaque de +12 pendant 2 tours'
      }
    ]
  },
  {
    id: 'knight',
    name: 'Gauvain',
    class: 'Chevalier',
    level: 5,
    hp: 120,
    maxHp: 120,
    abilities: createAbilities(16, 12, 16, 10, 14, 14),
    armorClass: 20,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['wisdom', 'charisma'],
    attack: 20,
    magicAttack: 12,
    defense: 22,
    magicDefense: 16,
    speed: 28,
    portrait: '🛡️',
    skills: [
      { 
        id: 'holy_strike', 
        name: 'Frappe sacrée', 
        damage: 25, 
        type: 'attack',
        damageType: 'radiant',
        targetType: 'enemy',
        bonusVsDemon: 15,
        bonusVsUndead: 15,
        cooldown: 2,
        description: 'Dégâts radiants, +15 contre fiélons et morts-vivants'
      },
      { 
        id: 'protection', 
        name: 'Protection', 
        damage: 0, 
        type: 'buff',
        targetType: 'ally',
        buffStats: { stat: 'defense', value: 10, turns: 3 },
        cooldown: 3,
        description: 'Booste la défense d\'un allié de +10 pendant 3 tours'
      }
    ]
  },
  
  // ============================================
  // MAGES
  // ============================================
  {
    id: 'mage',
    name: 'Elara',
    class: 'Mage',
    level: 5,
    hp: 80,
    maxHp: 80,
    abilities: createAbilities(8, 14, 12, 18, 14, 12),
    armorClass: 13,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['intelligence', 'wisdom'],
    attack: 8,
    magicAttack: 28,
    defense: 8,
    magicDefense: 20,
    speed: 28,
    portrait: '🔮',
    skills: [
      { 
        id: 'fireball', 
        name: 'Boule de feu', 
        damage: 42, 
        type: 'attack',
        damageType: 'fire',
        targetType: 'enemy',
        cooldown: 3,
        description: 'Inflige 42 dégâts de feu',
        savingThrow: { ability: 'dexterity', dc: 15 }
      },
      { 
        id: 'arcane_power', 
        name: 'Pouvoir arcanique', 
        damage: 0, 
        type: 'buff',
        targetType: 'ally',
        buffStats: { stat: 'magicAttack', value: 8, turns: 3 },
        cooldown: 3,
        description: 'Booste les dégâts magiques d\'un allié de +8 pendant 3 tours'
      }
    ]
  },
  {
    id: 'necromancer',
    name: 'Morrigan',
    class: 'Nécromancien',
    level: 5,
    hp: 75,
    maxHp: 75,
    abilities: createAbilities(8, 14, 12, 18, 12, 14),
    armorClass: 12,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['intelligence', 'charisma'],
    attack: 6,
    magicAttack: 26,
    defense: 6,
    magicDefense: 18,
    speed: 28,
    portrait: '💀',
    skills: [
      { 
        id: 'drain', 
        name: 'Drain de vie', 
        damage: 30, 
        type: 'attack',
        damageType: 'necrotic',
        targetType: 'enemy',
        lifesteal: 50,
        cooldown: 3,
        description: 'Inflige 30 dégâts nécrotiques et récupère 50% en PV'
      },
      { 
        id: 'curse', 
        name: 'Malédiction', 
        damage: 12, 
        type: 'debuff',
        damageType: 'necrotic',
        targetType: 'enemy',
        debuffStats: { stat: 'magicDefense', value: 8, turns: 3 },
        cooldown: 3,
        description: 'Dégâts nécrotiques + réduit la rés. magique de 8 pendant 3 tours'
      }
    ]
  },
  {
    id: 'elementalist',
    name: 'Zephyr',
    class: 'Élémentaliste',
    level: 5,
    hp: 85,
    maxHp: 85,
    abilities: createAbilities(8, 16, 14, 18, 12, 10),
    armorClass: 14,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['constitution', 'intelligence'],
    attack: 7,
    magicAttack: 30,
    defense: 7,
    magicDefense: 22,
    speed: 30,
    portrait: '🌪️',
    skills: [
      { 
        id: 'lightning', 
        name: 'Foudre', 
        damage: 48, 
        type: 'attack',
        damageType: 'lightning',
        targetType: 'enemy',
        cooldown: 3,
        description: 'Éclair dévastateur de 48 dégâts de foudre'
      },
      { 
        id: 'elemental_surge', 
        name: 'Surge élémentaire', 
        damage: 0, 
        type: 'buff',
        targetType: 'all_allies',
        buffStats: { stat: 'magicAttack', value: 5, turns: 3 },
        cooldown: 4,
        description: 'Booste les dégâts magiques de toute l\'équipe de +5'
      }
    ]
  },
  {
    id: 'sorcerer',
    name: 'Kael',
    class: 'Ensorceleur',
    level: 5,
    hp: 75,
    maxHp: 75,
    abilities: createAbilities(8, 14, 14, 12, 10, 20),
    armorClass: 13,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['constitution', 'charisma'],
    attack: 6,
    magicAttack: 32,
    defense: 6,
    magicDefense: 16,
    speed: 30,
    portrait: '⚡',
    skills: [
      { 
        id: 'chaos_bolt', 
        name: 'Trait de chaos', 
        damage: 38, 
        type: 'attack',
        damageType: 'force',
        targetType: 'enemy',
        cooldown: 2,
        description: 'Rayon d\'énergie chaotique de 38 dégâts de force'
      },
      { 
        id: 'quicken', 
        name: 'Accélération', 
        damage: 0, 
        type: 'buff',
        targetType: 'self',
        buffStats: { stat: 'speed', value: 15, turns: 3 },
        cooldown: 3,
        description: 'Augmente sa vitesse de +15 pendant 3 tours'
      }
    ]
  },
  {
    id: 'warlock',
    name: 'Azrael',
    class: 'Occultiste',
    level: 5,
    hp: 85,
    maxHp: 85,
    abilities: createAbilities(10, 14, 14, 12, 12, 18),
    armorClass: 14,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['wisdom', 'charisma'],
    attack: 8,
    magicAttack: 28,
    defense: 8,
    magicDefense: 18,
    speed: 28,
    portrait: '👁️‍🗨️',
    skills: [
      { 
        id: 'eldritch_blast', 
        name: 'Décharge occulte', 
        damage: 35, 
        type: 'attack',
        damageType: 'force',
        targetType: 'enemy',
        cooldown: 2,
        description: 'Rayon de force mystique de 35 dégâts'
      },
      { 
        id: 'hex', 
        name: 'Malédiction', 
        damage: 18, 
        type: 'debuff',
        damageType: 'necrotic',
        targetType: 'enemy',
        debuffStats: { stat: 'attack', value: 8, turns: 3 },
        cooldown: 3,
        description: '18 dégâts nécrotiques + réduit l\'attaque de 8'
      }
    ]
  },
  
  // ============================================
  // SOIGNEURS
  // ============================================
  {
    id: 'healer',
    name: 'Liora',
    class: 'Prêtresse',
    level: 5,
    hp: 90,
    maxHp: 90,
    abilities: createAbilities(10, 12, 14, 12, 18, 14),
    armorClass: 16,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['wisdom', 'charisma'],
    attack: 8,
    magicAttack: 18,
    defense: 12,
    magicDefense: 18,
    speed: 28,
    portrait: '✨',
    skills: [
      { 
        id: 'heal', 
        name: 'Soin majeur', 
        damage: -35, 
        type: 'heal',
        damageType: 'radiant',
        targetType: 'ally',
        cooldown: 2,
        description: 'Soigne un allié de 35 PV'
      },
      { 
        id: 'divine_smite', 
        name: 'Châtiment divin', 
        damage: 25, 
        type: 'attack',
        damageType: 'radiant',
        targetType: 'enemy',
        bonusVsDemon: 20,
        bonusVsUndead: 20,
        cooldown: 2,
        description: 'Dégâts radiants, +20 contre fiélons et morts-vivants'
      }
    ]
  },
  {
    id: 'druid',
    name: 'Sylvestre',
    class: 'Druide',
    level: 5,
    hp: 95,
    maxHp: 95,
    abilities: createAbilities(12, 14, 14, 12, 18, 10),
    armorClass: 14,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['intelligence', 'wisdom'],
    attack: 10,
    magicAttack: 16,
    defense: 12,
    magicDefense: 16,
    speed: 28,
    portrait: '🌿',
    skills: [
      { 
        id: 'nature_heal', 
        name: 'Régénération', 
        damage: -22, 
        type: 'heal',
        targetType: 'ally',
        healOverTime: { value: 8, turns: 3 },
        cooldown: 3,
        description: 'Soigne 22 PV + 8 PV/tour pendant 3 tours'
      },
      { 
        id: 'thorns', 
        name: 'Peau d\'épines', 
        damage: 0, 
        type: 'buff',
        targetType: 'ally',
        damageReflect: 35,
        cooldown: 3,
        description: 'L\'allié renvoie 35% des dégâts reçus pendant 3 tours'
      }
    ]
  },
  {
    id: 'oracle',
    name: 'Cassandre',
    class: 'Oracle',
    level: 5,
    hp: 80,
    maxHp: 80,
    abilities: createAbilities(8, 14, 12, 14, 20, 14),
    armorClass: 13,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['wisdom', 'charisma'],
    attack: 6,
    magicAttack: 20,
    defense: 10,
    magicDefense: 22,
    speed: 28,
    portrait: '🔮',
    skills: [
      { 
        id: 'vision', 
        name: 'Vision guérisseuse', 
        damage: -28, 
        type: 'heal',
        targetType: 'ally',
        cooldown: 2,
        description: 'Soigne un allié de 28 PV'
      },
      { 
        id: 'foresight', 
        name: 'Prescience', 
        damage: 0, 
        type: 'buff',
        targetType: 'ally',
        buffStats: { stat: 'magicDefense', value: 12, turns: 3 },
        cooldown: 3,
        description: 'L\'allié gagne +12 résistance magique pendant 3 tours'
      }
    ]
  },
  {
    id: 'life_cleric',
    name: 'Seraphina',
    class: 'Clerc de Vie',
    level: 5,
    hp: 100,
    maxHp: 100,
    abilities: createAbilities(14, 10, 16, 10, 18, 14),
    armorClass: 18,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['wisdom', 'charisma'],
    attack: 12,
    magicAttack: 20,
    defense: 14,
    magicDefense: 16,
    speed: 26,
    portrait: '☀️',
    skills: [
      { 
        id: 'mass_heal', 
        name: 'Soin de groupe', 
        damage: -20, 
        type: 'heal',
        damageType: 'radiant',
        targetType: 'all_allies',
        cooldown: 4,
        description: 'Soigne toute l\'équipe de 20 PV'
      },
      { 
        id: 'spiritual_weapon', 
        name: 'Arme spirituelle', 
        damage: 22, 
        type: 'attack',
        damageType: 'force',
        targetType: 'enemy',
        cooldown: 2,
        description: 'Attaque de force de 22 dégâts'
      }
    ]
  },
  
  // ============================================
  // ASSASSINS / ROUBLARDS
  // ============================================
  {
    id: 'rogue',
    name: 'Ombre',
    class: 'Roublard',
    level: 5,
    hp: 90,
    maxHp: 90,
    abilities: createAbilities(10, 20, 14, 14, 12, 12),
    armorClass: 16,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['dexterity', 'intelligence'],
    attack: 28,
    magicAttack: 5,
    defense: 10,
    magicDefense: 8,
    speed: 32,
    portrait: '🗡️',
    skills: [
      { 
        id: 'backstab', 
        name: 'Attaque sournoise', 
        damage: 48, 
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        cooldown: 3,
        description: 'Dégâts critiques massifs de 48 dégâts perforants'
      },
      { 
        id: 'poison_blade', 
        name: 'Lame empoisonnée', 
        damage: 18, 
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        poison: { damage: 10, turns: 3 },
        cooldown: 3,
        description: '18 dégâts + poison (10 dégâts/tour pendant 3 tours)'
      }
    ]
  },
  {
    id: 'ninja',
    name: 'Kaito',
    class: 'Ninja',
    level: 5,
    hp: 85,
    maxHp: 85,
    abilities: createAbilities(12, 20, 12, 14, 14, 10),
    armorClass: 17,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['dexterity', 'wisdom'],
    attack: 30,
    magicAttack: 8,
    defense: 8,
    magicDefense: 12,
    speed: 38,
    portrait: '🥷',
    skills: [
      { 
        id: 'shuriken', 
        name: 'Shuriken', 
        damage: 35, 
        type: 'attack',
        damageType: 'slashing',
        targetType: 'enemy',
        cooldown: 2,
        description: 'Lancer précis de 35 dégâts tranchants'
      },
      { 
        id: 'smoke_bomb', 
        name: 'Bombe fumigène', 
        damage: 0, 
        type: 'debuff',
        targetType: 'enemy',
        debuffStats: { stat: 'attack', value: 10, turns: 2 },
        cooldown: 3,
        description: 'Aveugle l\'ennemi, -10 attaque pendant 2 tours'
      }
    ]
  },
  {
    id: 'thief',
    name: 'Filou',
    class: 'Voleur',
    level: 5,
    hp: 90,
    maxHp: 90,
    abilities: createAbilities(10, 18, 14, 14, 12, 14),
    armorClass: 15,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['dexterity', 'charisma'],
    attack: 26,
    magicAttack: 5,
    defense: 12,
    magicDefense: 10,
    speed: 34,
    portrait: '🎭',
    skills: [
      { 
        id: 'steal', 
        name: 'Larcin', 
        damage: 28, 
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        lifesteal: 35,
        cooldown: 2,
        description: 'Vol rapide, récupère 35% des dégâts en PV'
      },
      { 
        id: 'trick', 
        name: 'Feinte', 
        damage: 0, 
        type: 'buff',
        targetType: 'self',
        buffStats: { stat: 'speed', value: 12, turns: 2 },
        cooldown: 2,
        description: 'Augmente sa vitesse de +12 pendant 2 tours'
      }
    ]
  },
  {
    id: 'assassin',
    name: 'Vex',
    class: 'Assassin',
    level: 5,
    hp: 80,
    maxHp: 80,
    abilities: createAbilities(12, 20, 12, 16, 12, 10),
    armorClass: 16,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['dexterity', 'intelligence'],
    attack: 32,
    magicAttack: 6,
    defense: 8,
    magicDefense: 10,
    speed: 34,
    portrait: '☠️',
    skills: [
      { 
        id: 'death_strike', 
        name: 'Frappe mortelle', 
        damage: 52, 
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        cooldown: 4,
        description: 'Attaque dévastatrice de 52 dégâts'
      },
      { 
        id: 'vanish', 
        name: 'Disparition', 
        damage: 0, 
        type: 'buff',
        targetType: 'self',
        buffStats: { stat: 'defense', value: 15, turns: 1 },
        cooldown: 3,
        description: 'Devient invisible, +15 défense pendant 1 tour'
      }
    ]
  },
  
  // ============================================
  // ARCHERS / RANGERS
  // ============================================
  {
    id: 'archer',
    name: 'Sylva',
    class: 'Archère',
    level: 5,
    hp: 85,
    maxHp: 85,
    abilities: createAbilities(12, 18, 14, 12, 14, 10),
    armorClass: 15,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['strength', 'dexterity'],
    attack: 26,
    magicAttack: 5,
    defense: 10,
    magicDefense: 12,
    speed: 32,
    portrait: '🏹',
    skills: [
      { 
        id: 'precision_shot', 
        name: 'Tir précis', 
        damage: 40, 
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        cooldown: 3,
        description: 'Tir critique de 40 dégâts perforants'
      },
      { 
        id: 'crippling_shot', 
        name: 'Tir handicapant', 
        damage: 22, 
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        debuffStats: { stat: 'speed', value: 10, turns: 2 },
        cooldown: 2,
        description: '22 dégâts + ralentit l\'ennemi de 10 vitesse'
      }
    ]
  },
  {
    id: 'ranger',
    name: 'Artémis',
    class: 'Rôdeur',
    level: 5,
    hp: 100,
    maxHp: 100,
    abilities: createAbilities(14, 16, 14, 10, 16, 10),
    armorClass: 15,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['strength', 'dexterity'],
    attack: 24,
    magicAttack: 8,
    defense: 12,
    magicDefense: 14,
    speed: 34,
    portrait: '🌲',
    skills: [
      { 
        id: 'trap', 
        name: 'Piège à mâchoires', 
        damage: 28, 
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        debuffStats: { stat: 'defense', value: 8, turns: 2 },
        cooldown: 2,
        description: '28 dégâts + réduit la défense de 8'
      },
      { 
        id: 'nature_call', 
        name: 'Marque du chasseur', 
        damage: 0, 
        type: 'buff',
        targetType: 'ally',
        buffStats: { stat: 'attack', value: 8, turns: 3 },
        cooldown: 3,
        description: 'Booste l\'attaque d\'un allié de +8 pendant 3 tours'
      }
    ]
  },
  {
    id: 'crossbowman',
    name: 'Balthazar',
    class: 'Arbalétrier',
    level: 5,
    hp: 95,
    maxHp: 95,
    abilities: createAbilities(14, 16, 16, 12, 12, 10),
    armorClass: 16,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['strength', 'constitution'],
    attack: 30,
    magicAttack: 3,
    defense: 12,
    magicDefense: 8,
    speed: 28,
    portrait: '🎯',
    skills: [
      { 
        id: 'heavy_bolt', 
        name: 'Carreau lourd', 
        damage: 45, 
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        cooldown: 3,
        description: 'Tir dévastateur de 45 dégâts perforants'
      },
      { 
        id: 'armor_piercing', 
        name: 'Tir perforant', 
        damage: 32, 
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        debuffStats: { stat: 'defense', value: 10, turns: 2 },
        cooldown: 2,
        description: '32 dégâts + réduit défense de 10 pendant 2 tours'
      }
    ]
  },
  
  // ============================================
  // TANKS / PROTECTEURS
  // ============================================
  {
    id: 'paladin',
    name: 'Aldric',
    class: 'Paladin',
    level: 5,
    hp: 140,
    maxHp: 140,
    abilities: createAbilities(16, 10, 16, 10, 14, 18),
    armorClass: 20,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['wisdom', 'charisma'],
    attack: 18,
    magicAttack: 14,
    defense: 20,
    magicDefense: 18,
    speed: 26,
    portrait: '⚜️',
    skills: [
      { 
        id: 'divine_strike', 
        name: 'Châtiment divin', 
        damage: 28, 
        type: 'attack',
        damageType: 'radiant',
        targetType: 'enemy',
        bonusVsDemon: 25,
        bonusVsUndead: 25,
        cooldown: 2,
        description: 'Dégâts radiants, +25 contre fiélons et morts-vivants'
      },
      { 
        id: 'lay_hands', 
        name: 'Imposition des mains', 
        damage: -40, 
        type: 'heal',
        damageType: 'radiant',
        targetType: 'ally',
        cooldown: 3,
        description: 'Soin sacré puissant de 40 PV sur un allié'
      }
    ]
  },
  {
    id: 'guardian',
    name: 'Goliath',
    class: 'Gardien',
    level: 5,
    hp: 160,
    maxHp: 160,
    abilities: createAbilities(18, 10, 20, 8, 14, 10),
    armorClass: 20,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['strength', 'constitution'],
    attack: 16,
    magicAttack: 3,
    defense: 25,
    magicDefense: 14,
    speed: 26,
    portrait: '🏰',
    skills: [
      { 
        id: 'taunt', 
        name: 'Provocation', 
        damage: 0, 
        type: 'buff',
        targetType: 'self',
        buffStats: { stat: 'defense', value: 12, turns: 2 },
        damageReflect: 25,
        cooldown: 3,
        description: 'Attire les attaques, +12 défense et renvoie 25% des dégâts'
      },
      { 
        id: 'crush', 
        name: 'Écrasement', 
        damage: 28, 
        type: 'attack',
        damageType: 'bludgeoning',
        targetType: 'enemy',
        cooldown: 2,
        description: 'Attaque lourde de 28 dégâts contondants'
      }
    ]
  },
  {
    id: 'warlord',
    name: 'Marcus',
    class: 'Seigneur de guerre',
    level: 5,
    hp: 150,
    maxHp: 150,
    abilities: createAbilities(18, 12, 16, 12, 14, 16),
    armorClass: 18,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['strength', 'charisma'],
    attack: 22,
    magicAttack: 5,
    defense: 18,
    magicDefense: 12,
    speed: 28,
    portrait: '👑',
    skills: [
      { 
        id: 'command', 
        name: 'Commandement', 
        damage: 25, 
        type: 'attack',
        damageType: 'slashing',
        targetType: 'enemy',
        cooldown: 1,
        description: 'Frappe de 25 dégâts tranchants'
      },
      { 
        id: 'rally', 
        name: 'Ralliement', 
        damage: 0, 
        type: 'buff',
        targetType: 'all_allies',
        buffStats: { stat: 'defense', value: 5, turns: 3 },
        cooldown: 4,
        description: 'Booste la défense de toute l\'équipe de +5 pendant 3 tours'
      }
    ]
  },
  
  // ============================================
  // MOINES / COMBATTANTS
  // ============================================
  {
    id: 'monk',
    name: 'Li Wei',
    class: 'Moine',
    level: 5,
    hp: 95,
    maxHp: 95,
    abilities: createAbilities(12, 18, 14, 10, 16, 10),
    armorClass: 17,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['strength', 'dexterity'],
    attack: 24,
    magicAttack: 10,
    defense: 12,
    magicDefense: 15,
    speed: 42,
    portrait: '🥋',
    skills: [
      { 
        id: 'flurry', 
        name: 'Déluge de coups', 
        damage: 36, 
        type: 'attack',
        damageType: 'bludgeoning',
        targetType: 'enemy',
        cooldown: 2,
        description: 'Série de coups rapides infligeant 36 dégâts'
      },
      { 
        id: 'stunning_strike', 
        name: 'Frappe étourdissante', 
        damage: 22, 
        type: 'attack',
        damageType: 'bludgeoning',
        targetType: 'enemy',
        debuffStats: { stat: 'speed', value: 12, turns: 1 },
        cooldown: 3,
        description: '22 dégâts + réduit la vitesse de 12'
      }
    ]
  },
  {
    id: 'pugilist',
    name: 'Brutus',
    class: 'Pugiliste',
    level: 5,
    hp: 120,
    maxHp: 120,
    abilities: createAbilities(18, 14, 18, 8, 12, 10),
    armorClass: 14,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['strength', 'constitution'],
    attack: 26,
    magicAttack: 3,
    defense: 14,
    magicDefense: 8,
    speed: 30,
    portrait: '👊',
    skills: [
      { 
        id: 'haymaker', 
        name: 'Uppercut', 
        damage: 45, 
        type: 'attack',
        damageType: 'bludgeoning',
        targetType: 'enemy',
        cooldown: 3,
        description: 'Coup puissant de 45 dégâts contondants'
      },
      { 
        id: 'brace', 
        name: 'Garde haute', 
        damage: 0, 
        type: 'buff',
        targetType: 'self',
        buffStats: { stat: 'defense', value: 10, turns: 2 },
        cooldown: 2,
        description: 'Augmente sa défense de +10 pendant 2 tours'
      }
    ]
  },
  
  // ============================================
  // BARDES
  // ============================================
  {
    id: 'bard',
    name: 'Orphée',
    class: 'Barde',
    level: 5,
    hp: 85,
    maxHp: 85,
    abilities: createAbilities(10, 16, 12, 14, 12, 18),
    armorClass: 14,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['dexterity', 'charisma'],
    attack: 12,
    magicAttack: 20,
    defense: 10,
    magicDefense: 15,
    speed: 30,
    portrait: '🎵',
    skills: [
      { 
        id: 'vicious_mockery', 
        name: 'Moquerie cruelle', 
        damage: 22, 
        type: 'attack',
        damageType: 'psychic',
        targetType: 'enemy',
        debuffStats: { stat: 'attack', value: 6, turns: 2 },
        cooldown: 2,
        description: '22 dégâts psychiques + -6 attaque pendant 2 tours'
      },
      { 
        id: 'inspiration', 
        name: 'Inspiration bardique', 
        damage: 0, 
        type: 'buff',
        targetType: 'ally',
        buffStats: { stat: 'attack', value: 10, turns: 3 },
        cooldown: 3,
        description: 'Inspire un allié, +10 attaque pendant 3 tours'
      }
    ]
  },
  {
    id: 'skald',
    name: 'Sigurd',
    class: 'Scalde',
    level: 5,
    hp: 105,
    maxHp: 105,
    abilities: createAbilities(16, 12, 16, 10, 12, 16),
    armorClass: 16,
    proficiencyBonus: 3,
    savingThrowProficiencies: ['constitution', 'charisma'],
    attack: 20,
    magicAttack: 14,
    defense: 14,
    magicDefense: 13,
    speed: 28,
    portrait: '🎸',
    skills: [
      { 
        id: 'battle_hymn', 
        name: 'Hymne de guerre', 
        damage: 28, 
        type: 'attack',
        damageType: 'thunder',
        targetType: 'enemy',
        cooldown: 2,
        description: 'Frappe sonore de 28 dégâts de tonnerre'
      },
      { 
        id: 'war_song', 
        name: 'Chant de guerre', 
        damage: 0, 
        type: 'buff',
        targetType: 'all_allies',
        buffStats: { stat: 'attack', value: 6, turns: 2 },
        cooldown: 4,
        description: 'Booste l\'attaque de toute l\'équipe de +6'
      }
    ]
  }
];
