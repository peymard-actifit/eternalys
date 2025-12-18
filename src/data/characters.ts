import { Character, AbilityScores } from '../types/game.types';
import { CLASS_STARTER_EQUIPMENT } from './equipment';

// Helper pour créer les caractéristiques D&D
const createAbilities = (str: number, dex: number, con: number, int: number, wis: number, cha: number): AbilityScores => ({
  strength: str, dexterity: dex, constitution: con, intelligence: int, wisdom: wis, charisma: cha
});

// ==============================================
// SYSTÈME D'ÉQUILIBRAGE ETHERNALYS v3.0
// PERSONNAGES NIVEAU 1 - D&D 5e STYLE
// ==============================================
// Stats niveau 1 D&D 5e:
// - PV de base: Dé de vie max + mod CON
// - Bonus de maîtrise: +2 au niveau 1
// - Caractéristiques: Point buy standard (27 points)
//   ou array standard [15, 14, 13, 12, 10, 8]
// - CA de base: selon armure portée
// ==============================================

// Calcul des PV niveau 1: Dé de vie max + modificateur CON
const calculateHP = (hitDie: number, conMod: number): number => hitDie + conMod;
const getModifier = (score: number): number => Math.floor((score - 10) / 2);

export const AVAILABLE_CHARACTERS: Character[] = [
  // ============================================
  // GUERRIERS (d10)
  // ============================================
  {
    id: 'warrior',
    name: 'Thorin',
    class: 'Guerrier',
    level: 1,
    hp: 12, // d10 + 2 (CON 14)
    maxHp: 12,
    abilities: createAbilities(16, 13, 14, 10, 12, 8), // Standard array: STR > DEX > CON > WIS > INT > CHA
    armorClass: 16, // Cotte de mailles (16) + bouclier (+2) = 18, mais level 1 = 16
    proficiencyBonus: 2,
    savingThrowProficiencies: ['strength', 'constitution'],
    attack: 5,      // FOR mod (3) + proficiency (2)
    magicAttack: 0,
    defense: 16,
    magicDefense: 6,
    speed: 30,
    portrait: '⚔️',
    equipment: CLASS_STARTER_EQUIPMENT['Guerrier'],
    skills: [
      { 
        id: 'slash', 
        name: 'Tranche', 
        damage: 8, // 1d8 + FOR (3) = ~8
        type: 'attack',
        damageType: 'slashing',
        targetType: 'enemy',
        cooldown: 0,
        description: 'Attaque à l\'épée longue. 1d8+3 tranchant.'
      },
      { 
        id: 'second_wind', 
        name: 'Second souffle', 
        damage: -6, // 1d10 + niveau = ~6 au niveau 1
        type: 'heal',
        targetType: 'self',
        cooldown: 4,
        description: 'Se soigne de 1d10+1 PV. Repos court.'
      }
    ]
  },
  {
    id: 'berserker',
    name: 'Ragnar',
    class: 'Berserker',
    level: 1,
    hp: 14, // d12 + 2 (CON 14)
    maxHp: 14,
    abilities: createAbilities(17, 13, 14, 8, 10, 8), // FOR priorité absolue
    armorClass: 13, // Armure de peaux, pas de bouclier
    proficiencyBonus: 2,
    savingThrowProficiencies: ['strength', 'constitution'],
    attack: 7,      // FOR mod (3) + rage (+2) + proficiency (2)
    magicAttack: 0,
    defense: 12,
    magicDefense: 4,
    speed: 30,
    portrait: '🪓',
    equipment: CLASS_STARTER_EQUIPMENT['Berserker'],
    skills: [
      { 
        id: 'reckless_attack', 
        name: 'Attaque téméraire', 
        damage: 12, // 1d12 + FOR (3) + rage (2) = ~12
        type: 'attack',
        damageType: 'slashing',
        targetType: 'enemy',
        cooldown: 1,
        description: 'Grande hache avec avantage. 1d12+5 tranchant.',
        requiresAttackRoll: true,
        grantAdvantage: true  // Attaque téméraire donne l'avantage
      },
      { 
        id: 'rage', 
        name: 'Rage', 
        damage: 0, 
        type: 'buff',
        targetType: 'self',
        buffStats: { stat: 'attack', value: 2, turns: 4 },
        cooldown: 5,
        description: 'Entre en rage: +2 dégâts, résistance contondant/perforant/tranchant.'
      }
    ]
  },
  {
    id: 'knight',
    name: 'Gauvain',
    class: 'Chevalier',
    level: 1,
    hp: 12, // d10 + 2
    maxHp: 12,
    abilities: createAbilities(15, 10, 14, 10, 13, 14), // CHA pour aura
    armorClass: 18, // Cotte de mailles + bouclier
    proficiencyBonus: 2,
    savingThrowProficiencies: ['wisdom', 'charisma'],
    attack: 4,      // FOR mod (2) + proficiency (2)
    magicAttack: 2, // CHA mod pour sorts
    defense: 18,
    magicDefense: 8,
    speed: 30,
    portrait: '🛡️',
    equipment: CLASS_STARTER_EQUIPMENT['Chevalier'],
    skills: [
      { 
        id: 'divine_smite', 
        name: 'Châtiment divin', 
        damage: 9, // 1d8 arme + 2d8 radiant = ~13 mais niveau 1 = ~9
        type: 'attack',
        damageType: 'radiant',
        targetType: 'enemy',
        bonusVsDemon: 4,
        bonusVsUndead: 4,
        cooldown: 3,
        description: 'Consomme un emplacement de sort. +2d8 radiants.'
      },
      { 
        id: 'lay_on_hands', 
        name: 'Imposition des mains', 
        damage: -5, // 5 PV au niveau 1 (niveau x 5)
        type: 'heal',
        damageType: 'radiant',
        targetType: 'ally',
        cooldown: 4,
        description: 'Réserve de 5 PV de soins.'
      }
    ]
  },
  
  // ============================================
  // MAGES (d6)
  // ============================================
  {
    id: 'mage',
    name: 'Elara',
    class: 'Mage',
    level: 1,
    hp: 7, // d6 + 1 (CON 12)
    maxHp: 7,
    abilities: createAbilities(8, 14, 12, 16, 13, 10), // INT priorité
    armorClass: 12, // 10 + DEX (2), pas d'armure
    proficiencyBonus: 2,
    savingThrowProficiencies: ['intelligence', 'wisdom'],
    attack: 0,
    magicAttack: 5, // INT mod (3) + proficiency (2)
    defense: 10,
    magicDefense: 10,
    speed: 30,
    portrait: '🔮',
    equipment: CLASS_STARTER_EQUIPMENT['Mage'],
    skills: [
      { 
        id: 'fire_bolt', 
        name: 'Trait de feu', 
        damage: 7, // 1d10 = ~5.5, + INT mod limité = ~7
        type: 'attack',
        damageType: 'fire',
        targetType: 'enemy',
        cooldown: 0,
        description: 'Sort mineur. 1d10 dégâts de feu.',
        isSpellAttack: true,
        requiresAttackRoll: true
      },
      { 
        id: 'magic_missile', 
        name: 'Projectile magique', 
        damage: 10, // 3d4+3 = 10.5
        type: 'attack',
        damageType: 'force',
        targetType: 'enemy',
        cooldown: 2,
        description: 'Touche automatique. 3d4+3 force.'
      }
    ]
  },
  {
    id: 'necromancer',
    name: 'Morrigan',
    class: 'Nécromancien',
    level: 1,
    hp: 7, // d6 + 1
    maxHp: 7,
    abilities: createAbilities(8, 14, 12, 16, 12, 10), // INT priorité
    armorClass: 12,
    proficiencyBonus: 2,
    savingThrowProficiencies: ['intelligence', 'wisdom'],
    attack: 0,
    magicAttack: 5,
    defense: 10,
    magicDefense: 9,
    speed: 30,
    portrait: '💀',
    equipment: CLASS_STARTER_EQUIPMENT['Nécromancien'],
    skills: [
      { 
        id: 'chill_touch', 
        name: 'Contact glacial', 
        damage: 6, // 1d8 nécrotique
        type: 'attack',
        damageType: 'necrotic',
        targetType: 'enemy',
        cooldown: 0,
        description: 'Sort mineur. 1d8 nécrotique, empêche régénération.',
        isSpellAttack: true,
        requiresAttackRoll: true
      },
      { 
        id: 'false_life', 
        name: 'Simulacre de vie', 
        damage: -6, // 1d4+4 PV temporaires
        type: 'heal',
        targetType: 'self',
        cooldown: 3,
        description: 'Gagne 1d4+4 PV temporaires.'
      }
    ]
  },
  {
    id: 'elementalist',
    name: 'Zephyr',
    class: 'Élémentaliste',
    level: 1,
    hp: 8, // d6 + 2 (CON 14)
    maxHp: 8,
    abilities: createAbilities(8, 14, 14, 16, 10, 12), // INT + CON
    armorClass: 12,
    proficiencyBonus: 2,
    savingThrowProficiencies: ['constitution', 'intelligence'],
    attack: 0,
    magicAttack: 5,
    defense: 10,
    magicDefense: 9,
    speed: 30,
    portrait: '🌪️',
    equipment: CLASS_STARTER_EQUIPMENT['Élémentaliste'],
    skills: [
      { 
        id: 'shocking_grasp', 
        name: 'Poigne électrique', 
        damage: 6, // 1d8 foudre
        type: 'attack',
        damageType: 'lightning',
        targetType: 'enemy',
        cooldown: 0,
        description: 'Sort mineur. 1d8 foudre, avantage vs armure métal.',
        isSpellAttack: true,
        requiresAttackRoll: true
      },
      { 
        id: 'chromatic_orb', 
        name: 'Orbe chromatique', 
        damage: 13, // 3d8 élémentaire
        type: 'attack',
        damageType: 'lightning',
        targetType: 'enemy',
        cooldown: 2,
        description: 'Sort niveau 1. 3d8 dégâts élémentaires.',
        isSpellAttack: true,
        requiresAttackRoll: true
      }
    ]
  },
  {
    id: 'sorcerer',
    name: 'Kael',
    class: 'Ensorceleur',
    level: 1,
    hp: 7, // d6 + 1
    maxHp: 7,
    abilities: createAbilities(8, 14, 12, 10, 10, 17), // CHA priorité
    armorClass: 12,
    proficiencyBonus: 2,
    savingThrowProficiencies: ['constitution', 'charisma'],
    attack: 0,
    magicAttack: 5, // CHA mod (3) + proficiency (2)
    defense: 10,
    magicDefense: 8,
    speed: 30,
    portrait: '⚡',
    equipment: CLASS_STARTER_EQUIPMENT['Ensorceleur'],
    skills: [
      { 
        id: 'ray_of_frost', 
        name: 'Rayon de givre', 
        damage: 6, // 1d8 froid
        type: 'attack',
        damageType: 'cold',
        targetType: 'enemy',
        debuffStats: { stat: 'speed', value: 3, turns: 1 },
        cooldown: 0,
        description: 'Sort mineur. 1d8 froid, -3m vitesse.',
        isSpellAttack: true,
        requiresAttackRoll: true
      },
      { 
        id: 'chaos_bolt', 
        name: 'Trait de chaos', 
        damage: 12, // 2d8+1d6
        type: 'attack',
        damageType: 'force',
        targetType: 'enemy',
        cooldown: 2,
        description: 'Sort niveau 1. Dégâts aléatoires.',
        isSpellAttack: true,
        requiresAttackRoll: true
      }
    ]
  },
  {
    id: 'warlock',
    name: 'Azrael',
    class: 'Occultiste',
    level: 1,
    hp: 9, // d8 + 1
    maxHp: 9,
    abilities: createAbilities(8, 14, 12, 12, 10, 16), // CHA priorité
    armorClass: 13, // Armure de cuir
    proficiencyBonus: 2,
    savingThrowProficiencies: ['wisdom', 'charisma'],
    attack: 0,
    magicAttack: 5,
    defense: 12,
    magicDefense: 8,
    speed: 30,
    portrait: '👁️‍🗨️',
    equipment: CLASS_STARTER_EQUIPMENT['Occultiste'],
    skills: [
      { 
        id: 'eldritch_blast', 
        name: 'Décharge occulte', 
        damage: 8, // 1d10 + CHA (invocation)
        type: 'attack',
        damageType: 'force',
        targetType: 'enemy',
        cooldown: 0,
        description: 'Sort mineur signature. 1d10 force.',
        isSpellAttack: true,
        requiresAttackRoll: true
      },
      { 
        id: 'hex', 
        name: 'Maléfice', 
        damage: 6, // 1d6 nécrotique bonus
        type: 'debuff',
        damageType: 'necrotic',
        targetType: 'enemy',
        debuffStats: { stat: 'attack', value: 2, turns: 3 },
        cooldown: 3,
        description: 'Marque une cible. +1d6 nécrotique par attaque.'
      }
    ]
  },
  
  // ============================================
  // SOIGNEURS (d8)
  // ============================================
  {
    id: 'healer',
    name: 'Liora',
    class: 'Prêtresse',
    level: 1,
    hp: 10, // d8 + 2
    maxHp: 10,
    abilities: createAbilities(10, 12, 14, 10, 16, 13), // SAG priorité
    armorClass: 16, // Chemise de mailles + bouclier
    proficiencyBonus: 2,
    savingThrowProficiencies: ['wisdom', 'charisma'],
    attack: 2,
    magicAttack: 5, // SAG mod (3) + proficiency (2)
    defense: 14,
    magicDefense: 10,
    speed: 30,
    portrait: '✨',
    equipment: CLASS_STARTER_EQUIPMENT['Prêtresse'],
    skills: [
      { 
        id: 'cure_wounds', 
        name: 'Soins des blessures', 
        damage: -9, // 1d8 + SAG (3) = ~7.5, arrondi 9
        type: 'heal',
        damageType: 'radiant',
        targetType: 'ally',
        cooldown: 2,
        description: 'Sort niveau 1. Soigne 1d8+3 PV.'
      },
      { 
        id: 'sacred_flame', 
        name: 'Flamme sacrée', 
        damage: 6, // 1d8 radiant
        type: 'attack',
        damageType: 'radiant',
        targetType: 'enemy',
        cooldown: 0,
        description: 'Sort mineur. 1d8 radiant, jet de DEX.',
        savingThrow: { ability: 'dexterity', dc: 13 },
        requiresAttackRoll: false
      }
    ]
  },
  {
    id: 'druid',
    name: 'Sylvestre',
    class: 'Druide',
    level: 1,
    hp: 10, // d8 + 2
    maxHp: 10,
    abilities: createAbilities(10, 14, 14, 12, 16, 8), // SAG + CON
    armorClass: 14, // Armure de cuir + bouclier (bois)
    proficiencyBonus: 2,
    savingThrowProficiencies: ['intelligence', 'wisdom'],
    attack: 2,
    magicAttack: 5,
    defense: 13,
    magicDefense: 10,
    speed: 30,
    portrait: '🌿',
    equipment: CLASS_STARTER_EQUIPMENT['Druide'],
    skills: [
      { 
        id: 'healing_word', 
        name: 'Mot de guérison', 
        damage: -6, // 1d4 + SAG (3)
        type: 'heal',
        targetType: 'ally',
        cooldown: 2,
        description: 'Sort niveau 1 bonus. Soigne 1d4+3 à distance.'
      },
      { 
        id: 'produce_flame', 
        name: 'Flammes', 
        damage: 6, // 1d8 feu
        type: 'attack',
        damageType: 'fire',
        targetType: 'enemy',
        cooldown: 0,
        description: 'Sort mineur. 1d8 feu.',
        isSpellAttack: true,
        requiresAttackRoll: true
      }
    ]
  },
  {
    id: 'oracle',
    name: 'Cassandre',
    class: 'Oracle',
    level: 1,
    hp: 9, // d8 + 1
    maxHp: 9,
    abilities: createAbilities(8, 12, 12, 14, 17, 12), // SAG très haute
    armorClass: 12,
    proficiencyBonus: 2,
    savingThrowProficiencies: ['wisdom', 'charisma'],
    attack: 0,
    magicAttack: 5,
    defense: 11,
    magicDefense: 11,
    speed: 30,
    portrait: '🔮',
    equipment: CLASS_STARTER_EQUIPMENT['Oracle'],
    skills: [
      { 
        id: 'guidance', 
        name: 'Assistance', 
        damage: 0,
        type: 'buff',
        targetType: 'ally',
        buffStats: { stat: 'attack', value: 2, turns: 2 },
        cooldown: 2,
        description: 'Sort mineur. +1d4 à un jet au choix.'
      },
      { 
        id: 'cure_wounds', 
        name: 'Soins', 
        damage: -9,
        type: 'heal',
        targetType: 'ally',
        cooldown: 2,
        description: 'Sort niveau 1. Soigne 1d8+3 PV.'
      }
    ]
  },
  {
    id: 'life_cleric',
    name: 'Seraphina',
    class: 'Clerc de Vie',
    level: 1,
    hp: 10, // d8 + 2
    maxHp: 10,
    abilities: createAbilities(14, 10, 14, 10, 16, 12), // FOR pour armure lourde
    armorClass: 18, // Cotte de mailles + bouclier (domaine vie)
    proficiencyBonus: 2,
    savingThrowProficiencies: ['wisdom', 'charisma'],
    attack: 4, // FOR (2) + proficiency
    magicAttack: 5,
    defense: 16,
    magicDefense: 10,
    speed: 30,
    portrait: '☀️',
    equipment: CLASS_STARTER_EQUIPMENT['Clerc de Vie'],
    skills: [
      { 
        id: 'cure_wounds_blessed', 
        name: 'Soins bénis', 
        damage: -12, // 1d8 + SAG (3) + 2 + 1 (domaine) = ~10-12
        type: 'heal',
        damageType: 'radiant',
        targetType: 'ally',
        cooldown: 2,
        description: 'Soins majorés. 1d8+6 PV (Disciple de la Vie).'
      },
      { 
        id: 'toll_the_dead', 
        name: 'Glas funèbre', 
        damage: 6, // 1d8 ou 1d12 si blessé
        type: 'attack',
        damageType: 'necrotic',
        targetType: 'enemy',
        cooldown: 0,
        description: 'Sort mineur. 1d8 nécrotique (1d12 si cible blessée).',
        savingThrow: { ability: 'wisdom', dc: 13 },
        requiresAttackRoll: false
      }
    ]
  },
  
  // ============================================
  // ROUBLARDS (d8)
  // ============================================
  {
    id: 'rogue',
    name: 'Ombre',
    class: 'Roublard',
    level: 1,
    hp: 10, // d8 + 2
    maxHp: 10,
    abilities: createAbilities(10, 17, 14, 13, 12, 8), // DEX priorité
    armorClass: 14, // Armure de cuir (11) + DEX (3)
    proficiencyBonus: 2,
    savingThrowProficiencies: ['dexterity', 'intelligence'],
    attack: 5, // DEX (3) + proficiency (2)
    magicAttack: 0,
    defense: 13,
    magicDefense: 7,
    speed: 30,
    portrait: '🗡️',
    equipment: CLASS_STARTER_EQUIPMENT['Roublard'],
    skills: [
      { 
        id: 'sneak_attack', 
        name: 'Attaque sournoise', 
        damage: 10, // 1d6 (rapière) + 1d6 (sneak) + DEX = ~10
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        cooldown: 1,
        description: 'Si avantage ou allié adjacent. +1d6 dégâts.'
      },
      { 
        id: 'cunning_action', 
        name: 'Ruse', 
        damage: 0, 
        type: 'buff',
        targetType: 'self',
        buffStats: { stat: 'speed', value: 5, turns: 1 },
        cooldown: 2,
        description: 'Désengagement, Sprint ou Cachette en action bonus.'
      }
    ]
  },
  {
    id: 'ninja',
    name: 'Kaito',
    class: 'Ninja',
    level: 1,
    hp: 10,
    maxHp: 10,
    abilities: createAbilities(10, 17, 14, 12, 14, 8), // DEX + SAG pour perception
    armorClass: 14,
    proficiencyBonus: 2,
    savingThrowProficiencies: ['dexterity', 'wisdom'],
    attack: 5,
    magicAttack: 0,
    defense: 13,
    magicDefense: 8,
    speed: 35, // Ninjas plus rapides
    portrait: '🥷',
    equipment: CLASS_STARTER_EQUIPMENT['Ninja'],
    skills: [
      { 
        id: 'shuriken', 
        name: 'Shuriken', 
        damage: 7, // 1d4 + DEX x2 (deux shurikens)
        type: 'attack',
        damageType: 'slashing',
        targetType: 'enemy',
        cooldown: 0,
        description: 'Lance deux shurikens. 2x(1d4+3) tranchant.'
      },
      { 
        id: 'smoke_bomb', 
        name: 'Bombe fumigène', 
        damage: 0, 
        type: 'debuff',
        targetType: 'enemy',
        debuffStats: { stat: 'attack', value: 3, turns: 2 },
        cooldown: 3,
        description: 'Aveugle la cible. -3 attaque pendant 2 tours.'
      }
    ]
  },
  {
    id: 'thief',
    name: 'Filou',
    class: 'Voleur',
    level: 1,
    hp: 10,
    maxHp: 10,
    abilities: createAbilities(8, 17, 14, 14, 10, 12), // DEX + INT
    armorClass: 14,
    proficiencyBonus: 2,
    savingThrowProficiencies: ['dexterity', 'charisma'],
    attack: 5,
    magicAttack: 0,
    defense: 13,
    magicDefense: 6,
    speed: 30,
    portrait: '🎭',
    equipment: CLASS_STARTER_EQUIPMENT['Voleur'],
    skills: [
      { 
        id: 'quick_fingers', 
        name: 'Doigts agiles', 
        damage: 7, // Attaque rapide
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        lifesteal: 25,
        cooldown: 2,
        description: 'Attaque et vole 25% en PV.'
      },
      { 
        id: 'fast_hands', 
        name: 'Mains lestes', 
        damage: 0, 
        type: 'buff',
        targetType: 'self',
        buffStats: { stat: 'speed', value: 4, turns: 2 },
        cooldown: 2,
        description: 'Utiliser objet en action bonus. +4 vitesse.'
      }
    ]
  },
  {
    id: 'assassin',
    name: 'Vex',
    class: 'Assassin',
    level: 1,
    hp: 10,
    maxHp: 10,
    abilities: createAbilities(10, 17, 14, 14, 10, 8), // DEX + INT
    armorClass: 14,
    proficiencyBonus: 2,
    savingThrowProficiencies: ['dexterity', 'intelligence'],
    attack: 5,
    magicAttack: 0,
    defense: 13,
    magicDefense: 6,
    speed: 30,
    portrait: '☠️',
    equipment: CLASS_STARTER_EQUIPMENT['Assassin'],
    skills: [
      { 
        id: 'assassinate', 
        name: 'Assassinat', 
        damage: 14, // Dégâts doublés sur cible surprise
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        cooldown: 4,
        description: 'Critique automatique si la cible est surprise.'
      },
      { 
        id: 'poison_blade', 
        name: 'Lame empoisonnée', 
        damage: 6, 
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        poison: { damage: 3, turns: 3 },
        cooldown: 3,
        description: 'Applique du poison. 3 dégâts/tour pendant 3 tours.'
      }
    ]
  },
  
  // ============================================
  // ARCHERS / RÔDEURS (d10)
  // ============================================
  {
    id: 'archer',
    name: 'Sylva',
    class: 'Archère',
    level: 1,
    hp: 11, // d10 + 1
    maxHp: 11,
    abilities: createAbilities(12, 16, 12, 10, 14, 8), // DEX + SAG
    armorClass: 14, // Armure de cuir + DEX
    proficiencyBonus: 2,
    savingThrowProficiencies: ['strength', 'dexterity'],
    attack: 5, // DEX (3) + proficiency (2)
    magicAttack: 0,
    defense: 13,
    magicDefense: 8,
    speed: 30,
    portrait: '🏹',
    equipment: CLASS_STARTER_EQUIPMENT['Archère'],
    skills: [
      { 
        id: 'aimed_shot', 
        name: 'Tir visé', 
        damage: 10, // 1d8 + DEX (3) + marque
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        cooldown: 1,
        description: 'Tir précis à l\'arc long. 1d8+3 perforant.'
      },
      { 
        id: 'hunters_mark', 
        name: 'Marque du chasseur', 
        damage: 0, 
        type: 'buff',
        targetType: 'self',
        buffStats: { stat: 'attack', value: 3, turns: 3 },
        cooldown: 4,
        description: 'Marque une proie. +1d6 aux attaques.'
      }
    ]
  },
  {
    id: 'ranger',
    name: 'Artémis',
    class: 'Rôdeur',
    level: 1,
    hp: 12, // d10 + 2
    maxHp: 12,
    abilities: createAbilities(12, 16, 14, 10, 14, 8), // DEX + SAG + CON
    armorClass: 14,
    proficiencyBonus: 2,
    savingThrowProficiencies: ['strength', 'dexterity'],
    attack: 5,
    magicAttack: 4, // Quelques sorts de rôdeur
    defense: 13,
    magicDefense: 8,
    speed: 30,
    portrait: '🌲',
    equipment: CLASS_STARTER_EQUIPMENT['Rôdeur'],
    skills: [
      { 
        id: 'favored_enemy', 
        name: 'Ennemi juré', 
        damage: 9, // Bonus contre certains ennemis
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        cooldown: 0,
        description: 'Attaque avec bonus contre ennemi favori.'
      },
      { 
        id: 'ensnaring_strike', 
        name: 'Frappe piégeuse', 
        damage: 6, 
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        debuffStats: { stat: 'speed', value: 5, turns: 2 },
        cooldown: 2,
        description: 'Sort niveau 1. Entrave la cible.'
      }
    ]
  },
  {
    id: 'crossbowman',
    name: 'Balthazar',
    class: 'Arbalétrier',
    level: 1,
    hp: 11,
    maxHp: 11,
    abilities: createAbilities(14, 16, 12, 10, 12, 8), // DEX + FOR pour arbalète lourde
    armorClass: 15, // Cuir clouté + DEX
    proficiencyBonus: 2,
    savingThrowProficiencies: ['strength', 'constitution'],
    attack: 5,
    magicAttack: 0,
    defense: 14,
    magicDefense: 6,
    speed: 30,
    portrait: '🎯',
    equipment: CLASS_STARTER_EQUIPMENT['Arbalétrier'],
    skills: [
      { 
        id: 'heavy_bolt', 
        name: 'Carreau lourd', 
        damage: 11, // 1d10 + DEX = ~8.5 + bonus
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        cooldown: 1,
        description: 'Tir d\'arbalète lourde. 1d10+3 perforant.'
      },
      { 
        id: 'crossbow_expert', 
        name: 'Expert arbalète', 
        damage: 7, // Tir rapide
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        cooldown: 0,
        description: 'Ignore le rechargement. Tir bonus.'
      }
    ]
  },
  
  // ============================================
  // TANKS / PROTECTEURS (d10/d12)
  // ============================================
  {
    id: 'paladin',
    name: 'Aldric',
    class: 'Paladin',
    level: 1,
    hp: 12, // d10 + 2
    maxHp: 12,
    abilities: createAbilities(16, 10, 14, 8, 12, 14), // FOR + CHA
    armorClass: 18, // Cotte de mailles + bouclier
    proficiencyBonus: 2,
    savingThrowProficiencies: ['wisdom', 'charisma'],
    attack: 5, // FOR (3) + proficiency (2)
    magicAttack: 4, // CHA (2) + proficiency
    defense: 16,
    magicDefense: 9,
    speed: 30,
    portrait: '⚜️',
    equipment: CLASS_STARTER_EQUIPMENT['Paladin'],
    skills: [
      { 
        id: 'divine_smite', 
        name: 'Châtiment divin', 
        damage: 12, // Arme + 2d8 radiant
        type: 'attack',
        damageType: 'radiant',
        targetType: 'enemy',
        bonusVsDemon: 4,
        bonusVsUndead: 4,
        cooldown: 3,
        description: 'Consomme un emplacement. +2d8 radiants.'
      },
      { 
        id: 'lay_on_hands', 
        name: 'Imposition des mains', 
        damage: -5, // 5 PV au niveau 1
        type: 'heal',
        damageType: 'radiant',
        targetType: 'ally',
        cooldown: 4,
        description: 'Réserve de 5 PV de soins.'
      }
    ]
  },
  {
    id: 'guardian',
    name: 'Goliath',
    class: 'Gardien',
    level: 1,
    hp: 14, // d12 + 2 (barbare tank)
    maxHp: 14,
    abilities: createAbilities(17, 10, 14, 8, 12, 8), // FOR + CON
    armorClass: 17, // Cotte de mailles + bouclier
    proficiencyBonus: 2,
    savingThrowProficiencies: ['strength', 'constitution'],
    attack: 5,
    magicAttack: 0,
    defense: 18,
    magicDefense: 6,
    speed: 30,
    portrait: '🏰',
    equipment: CLASS_STARTER_EQUIPMENT['Gardien'],
    skills: [
      { 
        id: 'shield_bash', 
        name: 'Coup de bouclier', 
        damage: 6, // 1d4 + FOR
        type: 'attack',
        damageType: 'bludgeoning',
        targetType: 'enemy',
        debuffStats: { stat: 'attack', value: 2, turns: 1 },
        cooldown: 1,
        description: 'Repousse l\'ennemi. Réduit son attaque.'
      },
      { 
        id: 'protection', 
        name: 'Protection', 
        damage: 0, 
        type: 'buff',
        targetType: 'ally',
        buffStats: { stat: 'defense', value: 3, turns: 2 },
        cooldown: 2,
        description: 'Impose désavantage aux attaques contre un allié.'
      }
    ]
  },
  {
    id: 'warlord',
    name: 'Marcus',
    class: 'Seigneur de guerre',
    level: 1,
    hp: 12,
    maxHp: 12,
    abilities: createAbilities(16, 12, 14, 10, 10, 14), // FOR + CHA
    armorClass: 18,
    proficiencyBonus: 2,
    savingThrowProficiencies: ['strength', 'charisma'],
    attack: 5,
    magicAttack: 0,
    defense: 16,
    magicDefense: 7,
    speed: 30,
    portrait: '👑',
    equipment: CLASS_STARTER_EQUIPMENT['Seigneur de guerre'],
    skills: [
      { 
        id: 'commanding_strike', 
        name: 'Frappe de commandement', 
        damage: 8, // 1d8 + FOR
        type: 'attack',
        damageType: 'slashing',
        targetType: 'enemy',
        cooldown: 0,
        description: 'Attaque qui permet à un allié de riposter.'
      },
      { 
        id: 'rally', 
        name: 'Ralliement', 
        damage: 0, 
        type: 'buff',
        targetType: 'all_allies',
        buffStats: { stat: 'attack', value: 1, turns: 2 },
        cooldown: 3,
        description: 'Inspire l\'équipe. +1 attaque pour tous.'
      }
    ]
  },
  
  // ============================================
  // MOINES (d8)
  // ============================================
  {
    id: 'monk',
    name: 'Li Wei',
    class: 'Moine',
    level: 1,
    hp: 10, // d8 + 2
    maxHp: 10,
    abilities: createAbilities(10, 17, 14, 10, 14, 8), // DEX + SAG
    armorClass: 15, // 10 + DEX (3) + SAG (2) = 15 (Défense sans armure)
    proficiencyBonus: 2,
    savingThrowProficiencies: ['strength', 'dexterity'],
    attack: 5, // DEX (3) + proficiency (2)
    magicAttack: 0,
    defense: 14,
    magicDefense: 8,
    speed: 30, // +10 pieds au niveau 2
    portrait: '🥋',
    equipment: CLASS_STARTER_EQUIPMENT['Moine'],
    skills: [
      { 
        id: 'flurry_of_blows', 
        name: 'Déluge de coups', 
        damage: 10, // 2 attaques bonus = 2x(1d4+3)
        type: 'attack',
        damageType: 'bludgeoning',
        targetType: 'enemy',
        cooldown: 2,
        description: 'Dépense 1 ki. Deux frappes bonus.'
      },
      { 
        id: 'patient_defense', 
        name: 'Défense patiente', 
        damage: 0, 
        type: 'buff',
        targetType: 'self',
        buffStats: { stat: 'defense', value: 3, turns: 1 },
        cooldown: 2,
        description: 'Dépense 1 ki. Esquive en action bonus.'
      }
    ]
  },
  {
    id: 'pugilist',
    name: 'Brutus',
    class: 'Pugiliste',
    level: 1,
    hp: 12, // d10 + 2 (variante combattant)
    maxHp: 12,
    abilities: createAbilities(17, 14, 14, 8, 10, 8), // FOR + CON
    armorClass: 13, // 10 + DEX (2) + bonus
    proficiencyBonus: 2,
    savingThrowProficiencies: ['strength', 'constitution'],
    attack: 5,
    magicAttack: 0,
    defense: 13,
    magicDefense: 5,
    speed: 30,
    portrait: '👊',
    equipment: CLASS_STARTER_EQUIPMENT['Pugiliste'],
    skills: [
      { 
        id: 'haymaker', 
        name: 'Uppercut', 
        damage: 9, // Coup puissant
        type: 'attack',
        damageType: 'bludgeoning',
        targetType: 'enemy',
        cooldown: 2,
        description: 'Coup dévastateur au corps à corps.'
      },
      { 
        id: 'brace', 
        name: 'Garde haute', 
        damage: 0, 
        type: 'buff',
        targetType: 'self',
        buffStats: { stat: 'defense', value: 2, turns: 2 },
        cooldown: 2,
        description: 'Se met en garde. +2 défense.'
      }
    ]
  },
  
  // ============================================
  // BARDES (d8)
  // ============================================
  {
    id: 'bard',
    name: 'Orphée',
    class: 'Barde',
    level: 1,
    hp: 10, // d8 + 2
    maxHp: 10,
    abilities: createAbilities(10, 14, 14, 12, 10, 16), // CHA priorité
    armorClass: 13, // Armure de cuir + DEX
    proficiencyBonus: 2,
    savingThrowProficiencies: ['dexterity', 'charisma'],
    attack: 4, // DEX (2) + proficiency
    magicAttack: 5, // CHA (3) + proficiency
    defense: 12,
    magicDefense: 8,
    speed: 30,
    portrait: '🎵',
    equipment: CLASS_STARTER_EQUIPMENT['Barde'],
    skills: [
      { 
        id: 'vicious_mockery', 
        name: 'Moquerie cruelle', 
        damage: 5, // 1d4 psychique
        type: 'attack',
        damageType: 'psychic',
        targetType: 'enemy',
        debuffStats: { stat: 'attack', value: 2, turns: 1 },
        cooldown: 0,
        description: 'Sort mineur. 1d4 psychique, désavantage.'
      },
      { 
        id: 'bardic_inspiration', 
        name: 'Inspiration bardique', 
        damage: 0, 
        type: 'buff',
        targetType: 'ally',
        buffStats: { stat: 'attack', value: 3, turns: 2 },
        cooldown: 3,
        description: 'Donne 1d6 inspiration à un allié.'
      }
    ]
  },
  {
    id: 'skald',
    name: 'Sigurd',
    class: 'Scalde',
    level: 1,
    hp: 11, // d8 + 3 (hybride barde/barbare)
    maxHp: 11,
    abilities: createAbilities(14, 12, 16, 8, 10, 14), // CHA + CON + FOR
    armorClass: 15, // Chemise de mailles
    proficiencyBonus: 2,
    savingThrowProficiencies: ['constitution', 'charisma'],
    attack: 4,
    magicAttack: 4,
    defense: 14,
    magicDefense: 7,
    speed: 30,
    portrait: '🎸',
    equipment: CLASS_STARTER_EQUIPMENT['Scalde'],
    skills: [
      { 
        id: 'thunderwave', 
        name: 'Vague tonnante', 
        damage: 9, // 2d8 tonnerre
        type: 'attack',
        damageType: 'thunder',
        targetType: 'enemy',
        cooldown: 2,
        description: 'Sort niveau 1. 2d8 tonnerre, repousse.'
      },
      { 
        id: 'song_of_rest', 
        name: 'Chant de repos', 
        damage: -4, // 1d6 soins
        type: 'heal',
        targetType: 'all_allies',
        cooldown: 5,
        description: 'Soigne 1d6 PV à toute l\'équipe.'
      }
    ]
  }
];
