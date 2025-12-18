import { Equipment, CharacterEquipment, EquipmentSlotType } from '../types/game.types';

// ============================================
// ÉQUIPEMENTS DE BASE D&D/PATHFINDER
// ============================================

// ============================================
// ARMES - SIMPLES MÊLÉE
// ============================================
export const WEAPONS_SIMPLE_MELEE: Equipment[] = [
  {
    id: 'club',
    name: 'Gourdin',
    icon: '🪵',
    slotType: 'mainHand',
    rarity: 'common',
    description: 'Un simple gourdin en bois. 1d4 contondant.',
    weaponCategory: 'simple_melee',
    damage: '1d4',
    damageType: 'bludgeoning',
    bonuses: { attack: 1 },
    value: 1
  },
  {
    id: 'dagger',
    name: 'Dague',
    icon: '🗡️',
    slotType: 'mainHand',
    rarity: 'common',
    description: 'Une dague légère et polyvalente. 1d4 perforant. Finesse.',
    weaponCategory: 'simple_melee',
    damage: '1d4',
    damageType: 'piercing',
    finesse: true,
    bonuses: { attack: 2, speed: 1 },
    value: 2
  },
  {
    id: 'handaxe',
    name: 'Hachette',
    icon: '🪓',
    slotType: 'mainHand',
    rarity: 'common',
    description: 'Une petite hache de lancer. 1d6 tranchant.',
    weaponCategory: 'simple_melee',
    damage: '1d6',
    damageType: 'slashing',
    bonuses: { attack: 3 },
    value: 5
  },
  {
    id: 'mace',
    name: 'Masse d\'armes',
    icon: '🔨',
    slotType: 'mainHand',
    rarity: 'common',
    description: 'Une masse en métal. 1d6 contondant.',
    weaponCategory: 'simple_melee',
    damage: '1d6',
    damageType: 'bludgeoning',
    bonuses: { attack: 3 },
    value: 5
  },
  {
    id: 'quarterstaff',
    name: 'Bâton',
    icon: '🏑',
    slotType: 'mainHand',
    rarity: 'common',
    description: 'Un bâton de bois solide. 1d6 contondant (1d8 à deux mains).',
    weaponCategory: 'simple_melee',
    damage: '1d6',
    damageType: 'bludgeoning',
    bonuses: { attack: 2, defense: 1 },
    value: 2
  },
  {
    id: 'spear',
    name: 'Lance',
    icon: '🔱',
    slotType: 'mainHand',
    rarity: 'common',
    description: 'Une lance polyvalente. 1d6 perforant.',
    weaponCategory: 'simple_melee',
    damage: '1d6',
    damageType: 'piercing',
    bonuses: { attack: 3 },
    value: 1
  }
];

// ============================================
// ARMES - MARTIALES MÊLÉE
// ============================================
export const WEAPONS_MARTIAL_MELEE: Equipment[] = [
  {
    id: 'longsword',
    name: 'Épée longue',
    icon: '⚔️',
    slotType: 'mainHand',
    rarity: 'common',
    description: 'Une épée longue classique. 1d8 tranchant (1d10 à deux mains).',
    weaponCategory: 'martial_melee',
    damage: '1d8',
    damageType: 'slashing',
    bonuses: { attack: 5 },
    value: 15
  },
  {
    id: 'battleaxe',
    name: 'Hache de bataille',
    icon: '🪓',
    slotType: 'mainHand',
    rarity: 'common',
    description: 'Une puissante hache de guerre. 1d8 tranchant.',
    weaponCategory: 'martial_melee',
    damage: '1d8',
    damageType: 'slashing',
    bonuses: { attack: 6 },
    value: 10
  },
  {
    id: 'warhammer',
    name: 'Marteau de guerre',
    icon: '🔨',
    slotType: 'mainHand',
    rarity: 'common',
    description: 'Un marteau de guerre dévastateur. 1d8 contondant.',
    weaponCategory: 'martial_melee',
    damage: '1d8',
    damageType: 'bludgeoning',
    bonuses: { attack: 5 },
    value: 15
  },
  {
    id: 'rapier',
    name: 'Rapière',
    icon: '🗡️',
    slotType: 'mainHand',
    rarity: 'common',
    description: 'Une fine épée d\'estoc. 1d8 perforant. Finesse.',
    weaponCategory: 'martial_melee',
    damage: '1d8',
    damageType: 'piercing',
    finesse: true,
    bonuses: { attack: 5, speed: 2 },
    value: 25
  },
  {
    id: 'shortsword',
    name: 'Épée courte',
    icon: '🗡️',
    slotType: 'mainHand',
    rarity: 'common',
    description: 'Une épée courte agile. 1d6 perforant. Finesse.',
    weaponCategory: 'martial_melee',
    damage: '1d6',
    damageType: 'piercing',
    finesse: true,
    bonuses: { attack: 4, speed: 2 },
    value: 10
  },
  {
    id: 'scimitar',
    name: 'Cimeterre',
    icon: '⚔️',
    slotType: 'mainHand',
    rarity: 'common',
    description: 'Une lame courbe tranchante. 1d6 tranchant. Finesse.',
    weaponCategory: 'martial_melee',
    damage: '1d6',
    damageType: 'slashing',
    finesse: true,
    bonuses: { attack: 4, speed: 2 },
    value: 25
  },
  {
    id: 'greataxe',
    name: 'Grande hache',
    icon: '🪓',
    slotType: 'mainHand',
    rarity: 'common',
    description: 'Une énorme hache à deux mains. 1d12 tranchant.',
    weaponCategory: 'martial_melee',
    damage: '1d12',
    damageType: 'slashing',
    twoHanded: true,
    bonuses: { attack: 8 },
    value: 30
  },
  {
    id: 'greatsword',
    name: 'Épée à deux mains',
    icon: '⚔️',
    slotType: 'mainHand',
    rarity: 'common',
    description: 'Une massive épée à deux mains. 2d6 tranchant.',
    weaponCategory: 'martial_melee',
    damage: '2d6',
    damageType: 'slashing',
    twoHanded: true,
    bonuses: { attack: 8 },
    value: 50
  },
  {
    id: 'halberd',
    name: 'Hallebarde',
    icon: '🔱',
    slotType: 'mainHand',
    rarity: 'common',
    description: 'Une arme d\'hast polyvalente. 1d10 tranchant.',
    weaponCategory: 'martial_melee',
    damage: '1d10',
    damageType: 'slashing',
    twoHanded: true,
    bonuses: { attack: 7 },
    value: 20
  },
  {
    id: 'flail',
    name: 'Fléau d\'armes',
    icon: '⛓️',
    slotType: 'mainHand',
    rarity: 'common',
    description: 'Un fléau à chaîne. 1d8 contondant.',
    weaponCategory: 'martial_melee',
    damage: '1d8',
    damageType: 'bludgeoning',
    bonuses: { attack: 5 },
    value: 10
  }
];

// ============================================
// ARMES À DISTANCE
// ============================================
export const WEAPONS_RANGED: Equipment[] = [
  {
    id: 'shortbow',
    name: 'Arc court',
    icon: '🏹',
    slotType: 'ranged',
    rarity: 'common',
    description: 'Un arc compact et maniable. 1d6 perforant.',
    weaponCategory: 'simple_ranged',
    damage: '1d6',
    damageType: 'piercing',
    twoHanded: true,
    bonuses: { attack: 4 },
    value: 25
  },
  {
    id: 'longbow',
    name: 'Arc long',
    icon: '🏹',
    slotType: 'ranged',
    rarity: 'common',
    description: 'Un grand arc puissant. 1d8 perforant.',
    weaponCategory: 'martial_ranged',
    damage: '1d8',
    damageType: 'piercing',
    twoHanded: true,
    bonuses: { attack: 6 },
    value: 50
  },
  {
    id: 'light_crossbow',
    name: 'Arbalète légère',
    icon: '🎯',
    slotType: 'ranged',
    rarity: 'common',
    description: 'Une arbalète légère facile à manier. 1d8 perforant.',
    weaponCategory: 'simple_ranged',
    damage: '1d8',
    damageType: 'piercing',
    twoHanded: true,
    bonuses: { attack: 5 },
    value: 25
  },
  {
    id: 'heavy_crossbow',
    name: 'Arbalète lourde',
    icon: '🎯',
    slotType: 'ranged',
    rarity: 'common',
    description: 'Une arbalète puissante. 1d10 perforant.',
    weaponCategory: 'martial_ranged',
    damage: '1d10',
    damageType: 'piercing',
    twoHanded: true,
    bonuses: { attack: 7 },
    value: 50
  }
];

// ============================================
// BOUCLIERS
// ============================================
export const SHIELDS: Equipment[] = [
  {
    id: 'buckler',
    name: 'Targe',
    icon: '🛡️',
    slotType: 'offHand',
    rarity: 'common',
    description: 'Un petit bouclier léger. +1 CA.',
    armorCategory: 'shield',
    bonuses: { defense: 2, armorClass: 1 },
    value: 5
  },
  {
    id: 'shield',
    name: 'Bouclier',
    icon: '🛡️',
    slotType: 'offHand',
    rarity: 'common',
    description: 'Un bouclier standard. +2 CA.',
    armorCategory: 'shield',
    bonuses: { defense: 4, armorClass: 2 },
    value: 10
  },
  {
    id: 'tower_shield',
    name: 'Pavois',
    icon: '🛡️',
    slotType: 'offHand',
    rarity: 'uncommon',
    description: 'Un immense bouclier de tour. +3 CA, -2 vitesse.',
    armorCategory: 'shield',
    bonuses: { defense: 6, armorClass: 3, speed: -2 },
    requirements: { strength: 15 },
    value: 30
  }
];

// ============================================
// ARMURES LÉGÈRES
// ============================================
export const ARMOR_LIGHT: Equipment[] = [
  {
    id: 'padded_armor',
    name: 'Armure matelassée',
    icon: '🥋',
    slotType: 'armor',
    rarity: 'common',
    description: 'Couches de tissu matelassé. CA 11 + DEX.',
    armorCategory: 'light',
    baseAC: 11,
    stealthDisadvantage: true,
    bonuses: { defense: 2 },
    value: 5
  },
  {
    id: 'leather_armor',
    name: 'Armure de cuir',
    icon: '🧥',
    slotType: 'armor',
    rarity: 'common',
    description: 'Cuir tanné souple. CA 11 + DEX.',
    armorCategory: 'light',
    baseAC: 11,
    bonuses: { defense: 3 },
    value: 10
  },
  {
    id: 'studded_leather',
    name: 'Cuir clouté',
    icon: '🧥',
    slotType: 'armor',
    rarity: 'common',
    description: 'Cuir renforcé de rivets. CA 12 + DEX.',
    armorCategory: 'light',
    baseAC: 12,
    bonuses: { defense: 4 },
    value: 45
  }
];

// ============================================
// ARMURES MOYENNES
// ============================================
export const ARMOR_MEDIUM: Equipment[] = [
  {
    id: 'hide_armor',
    name: 'Armure de peaux',
    icon: '🦌',
    slotType: 'armor',
    rarity: 'common',
    description: 'Peaux d\'animaux épaisses. CA 12 + DEX (max 2).',
    armorCategory: 'medium',
    baseAC: 12,
    maxDexBonus: 2,
    bonuses: { defense: 5 },
    value: 10
  },
  {
    id: 'chain_shirt',
    name: 'Chemise de mailles',
    icon: '⛓️',
    slotType: 'armor',
    rarity: 'common',
    description: 'Mailles métalliques légères. CA 13 + DEX (max 2).',
    armorCategory: 'medium',
    baseAC: 13,
    maxDexBonus: 2,
    bonuses: { defense: 6 },
    value: 50
  },
  {
    id: 'scale_mail',
    name: 'Armure d\'écailles',
    icon: '🐉',
    slotType: 'armor',
    rarity: 'common',
    description: 'Écailles métalliques superposées. CA 14 + DEX (max 2).',
    armorCategory: 'medium',
    baseAC: 14,
    maxDexBonus: 2,
    stealthDisadvantage: true,
    bonuses: { defense: 7 },
    value: 50
  },
  {
    id: 'breastplate',
    name: 'Cuirasse',
    icon: '🛡️',
    slotType: 'armor',
    rarity: 'uncommon',
    description: 'Plastron métallique ajusté. CA 14 + DEX (max 2).',
    armorCategory: 'medium',
    baseAC: 14,
    maxDexBonus: 2,
    bonuses: { defense: 8 },
    value: 400
  },
  {
    id: 'half_plate',
    name: 'Demi-plate',
    icon: '🛡️',
    slotType: 'armor',
    rarity: 'uncommon',
    description: 'Armure de plates partielle. CA 15 + DEX (max 2).',
    armorCategory: 'medium',
    baseAC: 15,
    maxDexBonus: 2,
    stealthDisadvantage: true,
    bonuses: { defense: 9 },
    value: 750
  }
];

// ============================================
// ARMURES LOURDES
// ============================================
export const ARMOR_HEAVY: Equipment[] = [
  {
    id: 'ring_mail',
    name: 'Cotte d\'anneaux',
    icon: '⛓️',
    slotType: 'armor',
    rarity: 'common',
    description: 'Anneaux de métal sur cuir. CA 14.',
    armorCategory: 'heavy',
    baseAC: 14,
    stealthDisadvantage: true,
    bonuses: { defense: 8 },
    value: 30
  },
  {
    id: 'chain_mail',
    name: 'Cotte de mailles',
    icon: '⛓️',
    slotType: 'armor',
    rarity: 'common',
    description: 'Mailles entrelacées. CA 16. FOR 13 requis.',
    armorCategory: 'heavy',
    baseAC: 16,
    stealthDisadvantage: true,
    bonuses: { defense: 10 },
    requirements: { strength: 13 },
    value: 75
  },
  {
    id: 'splint_mail',
    name: 'Armure à éclisses',
    icon: '🛡️',
    slotType: 'armor',
    rarity: 'uncommon',
    description: 'Bandes métalliques verticales. CA 17. FOR 15 requis.',
    armorCategory: 'heavy',
    baseAC: 17,
    stealthDisadvantage: true,
    bonuses: { defense: 11 },
    requirements: { strength: 15 },
    value: 200
  },
  {
    id: 'plate_armor',
    name: 'Harnois',
    icon: '🏰',
    slotType: 'armor',
    rarity: 'rare',
    description: 'Armure de plates complète. CA 18. FOR 15 requis.',
    armorCategory: 'heavy',
    baseAC: 18,
    stealthDisadvantage: true,
    bonuses: { defense: 14 },
    requirements: { strength: 15 },
    value: 1500
  }
];

// ============================================
// VÊTEMENTS / ROBES
// ============================================
export const CLOTHING: Equipment[] = [
  {
    id: 'common_clothes',
    name: 'Vêtements communs',
    icon: '👕',
    slotType: 'armor',
    rarity: 'common',
    description: 'Des vêtements simples du quotidien.',
    armorCategory: 'clothing',
    bonuses: {},
    value: 1
  },
  {
    id: 'travelers_clothes',
    name: 'Tenue de voyage',
    icon: '👔',
    slotType: 'armor',
    rarity: 'common',
    description: 'Vêtements robustes pour voyager.',
    armorCategory: 'clothing',
    bonuses: { speed: 1 },
    value: 2
  },
  {
    id: 'mage_robes',
    name: 'Robe de mage',
    icon: '🧙',
    slotType: 'armor',
    rarity: 'common',
    description: 'Une robe traditionnelle de lanceur de sorts.',
    armorCategory: 'clothing',
    bonuses: { magicAttack: 2, magicDefense: 2 },
    value: 10
  },
  {
    id: 'priest_vestments',
    name: 'Habits sacerdotaux',
    icon: '⛪',
    slotType: 'armor',
    rarity: 'common',
    description: 'Les vêtements cérémoniels d\'un prêtre.',
    armorCategory: 'clothing',
    bonuses: { magicDefense: 3 },
    value: 15
  }
];

// ============================================
// CASQUES
// ============================================
export const HELMETS: Equipment[] = [
  {
    id: 'leather_cap',
    name: 'Calotte de cuir',
    icon: '🎩',
    slotType: 'head',
    rarity: 'common',
    description: 'Une simple protection en cuir pour la tête.',
    bonuses: { defense: 1 },
    value: 5
  },
  {
    id: 'iron_helm',
    name: 'Casque de fer',
    icon: '⛑️',
    slotType: 'head',
    rarity: 'common',
    description: 'Un casque en fer basique.',
    bonuses: { defense: 2 },
    value: 15
  },
  {
    id: 'great_helm',
    name: 'Grand heaume',
    icon: '⛑️',
    slotType: 'head',
    rarity: 'uncommon',
    description: 'Un heaume couvrant tout le visage.',
    bonuses: { defense: 3, armorClass: 1 },
    value: 30
  },
  {
    id: 'circlet',
    name: 'Diadème',
    icon: '👑',
    slotType: 'head',
    rarity: 'common',
    description: 'Un fin diadème métallique.',
    bonuses: { magicAttack: 1, magicDefense: 1 },
    value: 20
  },
  {
    id: 'hood',
    name: 'Capuche',
    icon: '🧥',
    slotType: 'head',
    rarity: 'common',
    description: 'Une capuche discrète.',
    bonuses: { speed: 1 },
    value: 2
  }
];

// ============================================
// GANTS
// ============================================
export const GLOVES: Equipment[] = [
  {
    id: 'leather_gloves',
    name: 'Gants de cuir',
    icon: '🧤',
    slotType: 'gloves',
    rarity: 'common',
    description: 'De simples gants en cuir.',
    bonuses: { attack: 1 },
    value: 2
  },
  {
    id: 'gauntlets',
    name: 'Gantelets',
    icon: '🧤',
    slotType: 'gloves',
    rarity: 'common',
    description: 'Des gantelets métalliques.',
    bonuses: { attack: 2, defense: 1 },
    value: 10
  },
  {
    id: 'arcane_gloves',
    name: 'Gants arcaniques',
    icon: '✨',
    slotType: 'gloves',
    rarity: 'uncommon',
    description: 'Des gants imprégnés de magie.',
    bonuses: { magicAttack: 2 },
    value: 25
  }
];

// ============================================
// AVANT-BRAS / BRACELETS
// ============================================
export const BRACERS: Equipment[] = [
  {
    id: 'leather_bracers',
    name: 'Brassards de cuir',
    icon: '💪',
    slotType: 'bracers',
    rarity: 'common',
    description: 'Des protections en cuir pour les avant-bras.',
    bonuses: { defense: 1 },
    value: 5
  },
  {
    id: 'iron_bracers',
    name: 'Brassards de fer',
    icon: '💪',
    slotType: 'bracers',
    rarity: 'common',
    description: 'Des brassards métalliques solides.',
    bonuses: { defense: 2 },
    value: 15
  },
  {
    id: 'archer_bracers',
    name: 'Brassards d\'archer',
    icon: '🎯',
    slotType: 'bracers',
    rarity: 'common',
    description: 'Protègent les avant-bras lors du tir.',
    bonuses: { attack: 2 },
    value: 20
  }
];

// ============================================
// CEINTURES
// ============================================
export const BELTS: Equipment[] = [
  {
    id: 'leather_belt',
    name: 'Ceinture de cuir',
    icon: '🪢',
    slotType: 'belt',
    rarity: 'common',
    description: 'Une ceinture basique.',
    bonuses: {},
    value: 1
  },
  {
    id: 'pouch_belt',
    name: 'Ceinture à poches',
    icon: '👝',
    slotType: 'belt',
    rarity: 'common',
    description: 'Une ceinture avec des sacoches.',
    bonuses: {},
    value: 5
  },
  {
    id: 'warriors_belt',
    name: 'Ceinturon de guerrier',
    icon: '⚔️',
    slotType: 'belt',
    rarity: 'uncommon',
    description: 'Un ceinturon robuste pour porter des armes.',
    bonuses: { attack: 1, defense: 1 },
    value: 15
  }
];

// ============================================
// BOTTES
// ============================================
export const BOOTS: Equipment[] = [
  {
    id: 'leather_boots',
    name: 'Bottes de cuir',
    icon: '👢',
    slotType: 'boots',
    rarity: 'common',
    description: 'Des bottes de voyage basiques.',
    bonuses: { speed: 1 },
    value: 5
  },
  {
    id: 'iron_boots',
    name: 'Bottes ferrées',
    icon: '👢',
    slotType: 'boots',
    rarity: 'common',
    description: 'Des bottes renforcées de métal.',
    bonuses: { defense: 1 },
    value: 10
  },
  {
    id: 'soft_boots',
    name: 'Bottes souples',
    icon: '👟',
    slotType: 'boots',
    rarity: 'common',
    description: 'Des bottes silencieuses.',
    bonuses: { speed: 2 },
    value: 15
  }
];

// ============================================
// CAPES
// ============================================
export const CLOAKS: Equipment[] = [
  {
    id: 'travelers_cloak',
    name: 'Cape de voyage',
    icon: '🧥',
    slotType: 'cloak',
    rarity: 'common',
    description: 'Une cape simple pour se protéger des intempéries.',
    bonuses: {},
    value: 5
  },
  {
    id: 'cloak_protection',
    name: 'Cape de protection',
    icon: '🧣',
    slotType: 'cloak',
    rarity: 'uncommon',
    description: 'Une cape enchantée offrant une protection.',
    bonuses: { defense: 1, magicDefense: 2 },
    value: 50
  }
];

// ============================================
// COLLIERS / AMULETTES
// ============================================
export const NECKLACES: Equipment[] = [
  {
    id: 'simple_pendant',
    name: 'Pendentif simple',
    icon: '📿',
    slotType: 'necklace',
    rarity: 'common',
    description: 'Un simple pendentif décoratif.',
    bonuses: {},
    value: 5
  },
  {
    id: 'holy_symbol',
    name: 'Symbole sacré',
    icon: '✝️',
    slotType: 'necklace',
    rarity: 'common',
    description: 'Le symbole d\'une divinité.',
    bonuses: { magicDefense: 2 },
    value: 25
  },
  {
    id: 'arcane_focus',
    name: 'Focus arcanique',
    icon: '🔮',
    slotType: 'necklace',
    rarity: 'common',
    description: 'Un cristal pour canaliser la magie.',
    bonuses: { magicAttack: 2 },
    value: 25
  }
];

// ============================================
// ANNEAUX
// ============================================
export const RINGS: Equipment[] = [
  {
    id: 'simple_ring',
    name: 'Anneau simple',
    icon: '💍',
    slotType: 'ring1',
    rarity: 'common',
    description: 'Un anneau sans pouvoir particulier.',
    bonuses: {},
    value: 5
  },
  {
    id: 'signet_ring',
    name: 'Chevalière',
    icon: '💍',
    slotType: 'ring1',
    rarity: 'common',
    description: 'Un anneau sceau pour les documents.',
    bonuses: {},
    value: 10
  }
];

// ============================================
// FOCUS ARCANIQUES (pour mages)
// ============================================
export const ARCANE_FOCUS: Equipment[] = [
  {
    id: 'crystal_orb',
    name: 'Orbe de cristal',
    icon: '🔮',
    slotType: 'offHand',
    rarity: 'common',
    description: 'Un orbe pour canaliser la magie.',
    weaponCategory: 'focus',
    bonuses: { magicAttack: 3 },
    value: 20
  },
  {
    id: 'wand',
    name: 'Baguette',
    icon: '🪄',
    slotType: 'mainHand',
    rarity: 'common',
    description: 'Une baguette magique basique.',
    weaponCategory: 'focus',
    bonuses: { magicAttack: 2 },
    value: 10
  },
  {
    id: 'staff_arcane',
    name: 'Bâton arcanique',
    icon: '🏑',
    slotType: 'mainHand',
    rarity: 'common',
    description: 'Un bâton enchanté pour les mages.',
    weaponCategory: 'focus',
    twoHanded: true,
    bonuses: { magicAttack: 4, magicDefense: 1 },
    value: 30
  }
];

// ============================================
// CONSOMMABLES DE BASE
// ============================================
export const CONSUMABLES: Equipment[] = [
  {
    id: 'potion_healing',
    name: 'Potion de soins',
    icon: '🧪',
    slotType: 'consumable1',
    rarity: 'common',
    description: 'Restaure 2d4+2 PV.',
    value: 50
  },
  {
    id: 'rations',
    name: 'Rations',
    icon: '🍖',
    slotType: 'consumable2',
    rarity: 'common',
    description: 'De la nourriture pour une journée.',
    value: 1
  },
  {
    id: 'torch',
    name: 'Torche',
    icon: '🔦',
    slotType: 'consumable3',
    rarity: 'common',
    description: 'Éclaire pendant 1 heure.',
    value: 1
  }
];

// ============================================
// ÉQUIPEMENTS DE DÉPART PAR CLASSE
// ============================================

// Guerrier
export const WARRIOR_STARTER: CharacterEquipment = {
  head: HELMETS.find(h => h.id === 'iron_helm'),
  armor: ARMOR_HEAVY.find(a => a.id === 'chain_mail'),
  gloves: GLOVES.find(g => g.id === 'gauntlets'),
  bracers: BRACERS.find(b => b.id === 'iron_bracers'),
  belt: BELTS.find(b => b.id === 'warriors_belt'),
  boots: BOOTS.find(b => b.id === 'iron_boots'),
  cloak: CLOAKS.find(c => c.id === 'travelers_cloak'),
  mainHand: WEAPONS_MARTIAL_MELEE.find(w => w.id === 'longsword'),
  offHand: SHIELDS.find(s => s.id === 'shield'),
  consumable1: CONSUMABLES.find(c => c.id === 'potion_healing')
};

// Berserker
export const BERSERKER_STARTER: CharacterEquipment = {
  armor: ARMOR_MEDIUM.find(a => a.id === 'hide_armor'),
  gloves: GLOVES.find(g => g.id === 'leather_gloves'),
  bracers: BRACERS.find(b => b.id === 'leather_bracers'),
  belt: BELTS.find(b => b.id === 'leather_belt'),
  boots: BOOTS.find(b => b.id === 'leather_boots'),
  mainHand: WEAPONS_MARTIAL_MELEE.find(w => w.id === 'greataxe'),
  consumable1: CONSUMABLES.find(c => c.id === 'potion_healing')
};

// Chevalier / Paladin
export const PALADIN_STARTER: CharacterEquipment = {
  head: HELMETS.find(h => h.id === 'great_helm'),
  armor: ARMOR_HEAVY.find(a => a.id === 'chain_mail'),
  gloves: GLOVES.find(g => g.id === 'gauntlets'),
  bracers: BRACERS.find(b => b.id === 'iron_bracers'),
  belt: BELTS.find(b => b.id === 'warriors_belt'),
  boots: BOOTS.find(b => b.id === 'iron_boots'),
  cloak: CLOAKS.find(c => c.id === 'travelers_cloak'),
  necklace: NECKLACES.find(n => n.id === 'holy_symbol'),
  mainHand: WEAPONS_MARTIAL_MELEE.find(w => w.id === 'longsword'),
  offHand: SHIELDS.find(s => s.id === 'shield'),
  consumable1: CONSUMABLES.find(c => c.id === 'potion_healing')
};

// Mage
export const MAGE_STARTER: CharacterEquipment = {
  head: HELMETS.find(h => h.id === 'circlet'),
  armor: CLOTHING.find(c => c.id === 'mage_robes'),
  gloves: GLOVES.find(g => g.id === 'arcane_gloves'),
  boots: BOOTS.find(b => b.id === 'soft_boots'),
  cloak: CLOAKS.find(c => c.id === 'travelers_cloak'),
  necklace: NECKLACES.find(n => n.id === 'arcane_focus'),
  mainHand: ARCANE_FOCUS.find(f => f.id === 'staff_arcane'),
  consumable1: CONSUMABLES.find(c => c.id === 'potion_healing')
};

// Nécromancien
export const NECROMANCER_STARTER: CharacterEquipment = {
  head: HELMETS.find(h => h.id === 'hood'),
  armor: CLOTHING.find(c => c.id === 'mage_robes'),
  gloves: GLOVES.find(g => g.id === 'leather_gloves'),
  boots: BOOTS.find(b => b.id === 'soft_boots'),
  necklace: NECKLACES.find(n => n.id === 'arcane_focus'),
  mainHand: ARCANE_FOCUS.find(f => f.id === 'wand'),
  offHand: ARCANE_FOCUS.find(f => f.id === 'crystal_orb'),
  consumable1: CONSUMABLES.find(c => c.id === 'potion_healing')
};

// Élémentaliste / Ensorceleur
export const SORCERER_STARTER: CharacterEquipment = {
  head: HELMETS.find(h => h.id === 'circlet'),
  armor: CLOTHING.find(c => c.id === 'mage_robes'),
  gloves: GLOVES.find(g => g.id === 'arcane_gloves'),
  boots: BOOTS.find(b => b.id === 'soft_boots'),
  necklace: NECKLACES.find(n => n.id === 'arcane_focus'),
  mainHand: ARCANE_FOCUS.find(f => f.id === 'staff_arcane'),
  consumable1: CONSUMABLES.find(c => c.id === 'potion_healing')
};

// Prêtresse / Clerc
export const CLERIC_STARTER: CharacterEquipment = {
  head: HELMETS.find(h => h.id === 'iron_helm'),
  armor: ARMOR_MEDIUM.find(a => a.id === 'chain_shirt'),
  gloves: GLOVES.find(g => g.id === 'leather_gloves'),
  boots: BOOTS.find(b => b.id === 'leather_boots'),
  cloak: CLOAKS.find(c => c.id === 'travelers_cloak'),
  necklace: NECKLACES.find(n => n.id === 'holy_symbol'),
  mainHand: WEAPONS_SIMPLE_MELEE.find(w => w.id === 'mace'),
  offHand: SHIELDS.find(s => s.id === 'shield'),
  consumable1: CONSUMABLES.find(c => c.id === 'potion_healing')
};

// Druide
export const DRUID_STARTER: CharacterEquipment = {
  head: HELMETS.find(h => h.id === 'leather_cap'),
  armor: ARMOR_LIGHT.find(a => a.id === 'leather_armor'),
  gloves: GLOVES.find(g => g.id === 'leather_gloves'),
  boots: BOOTS.find(b => b.id === 'leather_boots'),
  cloak: CLOAKS.find(c => c.id === 'travelers_cloak'),
  mainHand: WEAPONS_SIMPLE_MELEE.find(w => w.id === 'quarterstaff'),
  offHand: SHIELDS.find(s => s.id === 'buckler'),
  consumable1: CONSUMABLES.find(c => c.id === 'potion_healing')
};

// Roublard / Voleur / Assassin
const daggerForOffhand = WEAPONS_SIMPLE_MELEE.find(w => w.id === 'dagger');
export const ROGUE_STARTER: CharacterEquipment = {
  head: HELMETS.find(h => h.id === 'hood'),
  armor: ARMOR_LIGHT.find(a => a.id === 'leather_armor'),
  gloves: GLOVES.find(g => g.id === 'leather_gloves'),
  bracers: BRACERS.find(b => b.id === 'leather_bracers'),
  belt: BELTS.find(b => b.id === 'pouch_belt'),
  boots: BOOTS.find(b => b.id === 'soft_boots'),
  mainHand: WEAPONS_MARTIAL_MELEE.find(w => w.id === 'shortsword'),
  offHand: daggerForOffhand ? { ...daggerForOffhand, slotType: 'offHand' as EquipmentSlotType } : undefined,
  consumable1: CONSUMABLES.find(c => c.id === 'potion_healing')
};

// Archère / Rôdeur
export const RANGER_STARTER: CharacterEquipment = {
  head: HELMETS.find(h => h.id === 'leather_cap'),
  armor: ARMOR_LIGHT.find(a => a.id === 'leather_armor'),
  gloves: GLOVES.find(g => g.id === 'leather_gloves'),
  bracers: BRACERS.find(b => b.id === 'archer_bracers'),
  belt: BELTS.find(b => b.id === 'leather_belt'),
  boots: BOOTS.find(b => b.id === 'leather_boots'),
  cloak: CLOAKS.find(c => c.id === 'travelers_cloak'),
  mainHand: WEAPONS_MARTIAL_MELEE.find(w => w.id === 'shortsword'),
  ranged: WEAPONS_RANGED.find(w => w.id === 'longbow'),
  consumable1: CONSUMABLES.find(c => c.id === 'potion_healing')
};

// Moine
export const MONK_STARTER: CharacterEquipment = {
  armor: CLOTHING.find(c => c.id === 'common_clothes'),
  gloves: GLOVES.find(g => g.id === 'leather_gloves'),
  bracers: BRACERS.find(b => b.id === 'leather_bracers'),
  belt: BELTS.find(b => b.id === 'leather_belt'),
  boots: BOOTS.find(b => b.id === 'soft_boots'),
  mainHand: WEAPONS_SIMPLE_MELEE.find(w => w.id === 'quarterstaff'),
  consumable1: CONSUMABLES.find(c => c.id === 'potion_healing')
};

// Barde
const bardDagger = WEAPONS_SIMPLE_MELEE.find(w => w.id === 'dagger');
export const BARD_STARTER: CharacterEquipment = {
  armor: ARMOR_LIGHT.find(a => a.id === 'leather_armor'),
  gloves: GLOVES.find(g => g.id === 'leather_gloves'),
  boots: BOOTS.find(b => b.id === 'soft_boots'),
  cloak: CLOAKS.find(c => c.id === 'travelers_cloak'),
  mainHand: WEAPONS_MARTIAL_MELEE.find(w => w.id === 'rapier'),
  offHand: bardDagger ? { ...bardDagger, slotType: 'offHand' as EquipmentSlotType } : undefined,
  consumable1: CONSUMABLES.find(c => c.id === 'potion_healing')
};

// Gardien (Tank)
export const GUARDIAN_STARTER: CharacterEquipment = {
  head: HELMETS.find(h => h.id === 'great_helm'),
  armor: ARMOR_HEAVY.find(a => a.id === 'chain_mail'),
  gloves: GLOVES.find(g => g.id === 'gauntlets'),
  bracers: BRACERS.find(b => b.id === 'iron_bracers'),
  belt: BELTS.find(b => b.id === 'warriors_belt'),
  boots: BOOTS.find(b => b.id === 'iron_boots'),
  mainHand: WEAPONS_MARTIAL_MELEE.find(w => w.id === 'flail'),
  offHand: SHIELDS.find(s => s.id === 'tower_shield'),
  consumable1: CONSUMABLES.find(c => c.id === 'potion_healing')
};

// Pugiliste
export const PUGILIST_STARTER: CharacterEquipment = {
  armor: CLOTHING.find(c => c.id === 'common_clothes'),
  gloves: GLOVES.find(g => g.id === 'gauntlets'),
  bracers: BRACERS.find(b => b.id === 'leather_bracers'),
  belt: BELTS.find(b => b.id === 'leather_belt'),
  boots: BOOTS.find(b => b.id === 'leather_boots'),
  consumable1: CONSUMABLES.find(c => c.id === 'potion_healing')
};

// Arbalétrier
export const CROSSBOWMAN_STARTER: CharacterEquipment = {
  head: HELMETS.find(h => h.id === 'leather_cap'),
  armor: ARMOR_LIGHT.find(a => a.id === 'studded_leather'),
  gloves: GLOVES.find(g => g.id === 'leather_gloves'),
  bracers: BRACERS.find(b => b.id === 'archer_bracers'),
  boots: BOOTS.find(b => b.id === 'leather_boots'),
  ranged: WEAPONS_RANGED.find(w => w.id === 'heavy_crossbow'),
  mainHand: WEAPONS_SIMPLE_MELEE.find(w => w.id === 'dagger'),
  consumable1: CONSUMABLES.find(c => c.id === 'potion_healing')
};

// Occultiste (Warlock)
export const WARLOCK_STARTER: CharacterEquipment = {
  head: HELMETS.find(h => h.id === 'hood'),
  armor: ARMOR_LIGHT.find(a => a.id === 'leather_armor'),
  gloves: GLOVES.find(g => g.id === 'arcane_gloves'),
  boots: BOOTS.find(b => b.id === 'soft_boots'),
  necklace: NECKLACES.find(n => n.id === 'arcane_focus'),
  mainHand: ARCANE_FOCUS.find(f => f.id === 'wand'),
  offHand: ARCANE_FOCUS.find(f => f.id === 'crystal_orb'),
  consumable1: CONSUMABLES.find(c => c.id === 'potion_healing')
};

// Mapping des classes vers leur équipement de départ
export const CLASS_STARTER_EQUIPMENT: Record<string, CharacterEquipment> = {
  'Guerrier': WARRIOR_STARTER,
  'Berserker': BERSERKER_STARTER,
  'Chevalier': PALADIN_STARTER,
  'Paladin': PALADIN_STARTER,
  'Mage': MAGE_STARTER,
  'Nécromancien': NECROMANCER_STARTER,
  'Élémentaliste': SORCERER_STARTER,
  'Ensorceleur': SORCERER_STARTER,
  'Occultiste': WARLOCK_STARTER,
  'Prêtresse': CLERIC_STARTER,
  'Druide': DRUID_STARTER,
  'Oracle': CLERIC_STARTER,
  'Clerc de Vie': CLERIC_STARTER,
  'Roublard': ROGUE_STARTER,
  'Ninja': ROGUE_STARTER,
  'Voleur': ROGUE_STARTER,
  'Assassin': ROGUE_STARTER,
  'Archère': RANGER_STARTER,
  'Rôdeur': RANGER_STARTER,
  'Arbalétrier': CROSSBOWMAN_STARTER,
  'Gardien': GUARDIAN_STARTER,
  'Seigneur de guerre': WARRIOR_STARTER,
  'Moine': MONK_STARTER,
  'Pugiliste': PUGILIST_STARTER,
  'Barde': BARD_STARTER,
  'Scalde': BARD_STARTER
};

// Calculer les bonus totaux d'un équipement
export function calculateEquipmentBonuses(equipment: CharacterEquipment): {
  attack: number;
  magicAttack: number;
  defense: number;
  magicDefense: number;
  speed: number;
  maxHp: number;
  armorClass: number;
} {
  let bonuses = {
    attack: 0,
    magicAttack: 0,
    defense: 0,
    magicDefense: 0,
    speed: 0,
    maxHp: 0,
    armorClass: 0
  };

  const slots = Object.values(equipment) as (Equipment | undefined)[];
  
  for (const item of slots) {
    if (item?.bonuses) {
      bonuses.attack += item.bonuses.attack || 0;
      bonuses.magicAttack += item.bonuses.magicAttack || 0;
      bonuses.defense += item.bonuses.defense || 0;
      bonuses.magicDefense += item.bonuses.magicDefense || 0;
      bonuses.speed += item.bonuses.speed || 0;
      bonuses.maxHp += item.bonuses.maxHp || 0;
      bonuses.armorClass += item.bonuses.armorClass || 0;
    }
  }

  return bonuses;
}

// Liste de tous les équipements disponibles
export const ALL_EQUIPMENT: Equipment[] = [
  ...WEAPONS_SIMPLE_MELEE,
  ...WEAPONS_MARTIAL_MELEE,
  ...WEAPONS_RANGED,
  ...SHIELDS,
  ...ARMOR_LIGHT,
  ...ARMOR_MEDIUM,
  ...ARMOR_HEAVY,
  ...CLOTHING,
  ...HELMETS,
  ...GLOVES,
  ...BRACERS,
  ...BELTS,
  ...BOOTS,
  ...CLOAKS,
  ...NECKLACES,
  ...RINGS,
  ...ARCANE_FOCUS,
  ...CONSUMABLES
];

