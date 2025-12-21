// =============================================================================
// PERSONNAGES ETERNALYS - SYSTÈME D&D 5e
// =============================================================================

import { Character, AbilityScores, Skill } from '../types/game.types';
import { CLASS_STARTER_EQUIPMENT } from './equipment';

// Fonctions D&D locales
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

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Crée un objet AbilityScores
 */
const createAbilities = (
  str: number, 
  dex: number, 
  con: number, 
  int: number, 
  wis: number, 
  cha: number
): AbilityScores => ({
  strength: str,
  dexterity: dex,
  constitution: con,
  intelligence: int,
  wisdom: wis,
  charisma: cha
});

/**
 * Crée un personnage niveau 1 avec le nouveau système
 */
function createCharacter(
  id: string,
  name: string,
  className: string,
  portrait: string,
  abilities: AbilityScores,
  savingThrowProficiencies: (keyof AbilityScores)[],
  baseArmorClass: number,
  speed: number,
  skills: Skill[]
): Character {
  const level = 1;
  const proficiencyBonus = getProficiencyBonus(level);
  const maxHp = calculateMaxHP(className, level, abilities.constitution);
  
  return {
    id,
    name,
    class: className,
    portrait,
    
    // Niveau et XP
    level,
    xp: 0,
    totalXP: 0,
    
    // Points de vie
    hp: maxHp,
    maxHp,
    
    // Caractéristiques D&D - BASE DU SYSTÈME
    abilities,
    
    // Stats dérivées
    armorClass: baseArmorClass,
    speed,
    proficiencyBonus,
    
    // Maîtrises
    savingThrowProficiencies,
    
    // Compétences
    skills,
    
    // Équipement de départ
    equipment: CLASS_STARTER_EQUIPMENT[className],
    
    // Talents (vide au niveau 1)
    talents: [],
    pendingTalentChoice: false,
    
    // Pas de buffs/conditions au départ
    buffs: [],
    conditions: [],
    
    // Stats de partie
    stats: {
      totalDamageDealt: 0,
      totalDamageTaken: 0,
      totalHealingDone: 0,
      monstersKilled: []
    }
  };
}

// =============================================================================
// PERSONNAGES DISPONIBLES
// =============================================================================

export const AVAILABLE_CHARACTERS: Character[] = [
  // ============================================
  // GUERRIERS (d10)
  // ============================================
  createCharacter(
    'warrior',
    'Thorin',
    'Guerrier',
    '⚔️',
    createAbilities(16, 13, 14, 10, 12, 8),
    ['strength', 'constitution'],
    16, // Cotte de mailles (16)
    30,
    [
      { 
        id: 'slash', 
        name: 'Tranche', 
        damage: 0, // Calculé dynamiquement
        damageDice: '1d8',
        type: 'attack',
        damageType: 'slashing',
        targetType: 'enemy',
        requiresAttackRoll: true,
        cooldown: 0,
        description: 'Attaque à l\'épée longue. 1d8 + FOR tranchant.'
      },
      { 
        id: 'second_wind', 
        name: 'Second souffle', 
        damage: -6,
        damageDice: '1d10',
        type: 'heal',
        targetType: 'self',
        cooldown: 4,
        description: 'Récupère 1d10 + niveau PV. Une fois par repos court.'
      }
    ]
  ),

  createCharacter(
    'berserker',
    'Ragnar',
    'Berserker',
    '🪓',
    createAbilities(17, 13, 14, 8, 10, 8),
    ['strength', 'constitution'],
    13, // Armure de peaux
    30,
    [
      { 
        id: 'reckless_attack', 
        name: 'Attaque téméraire', 
        damage: 0,
        damageDice: '1d12',
        type: 'attack',
        damageType: 'slashing',
        targetType: 'enemy',
        requiresAttackRoll: true,
        grantAdvantage: true,
        cooldown: 1,
        description: 'Attaque avec avantage. Les ennemis ont avantage contre vous jusqu\'à votre prochain tour.'
      },
      { 
        id: 'rage', 
        name: 'Rage', 
        damage: 0, 
        type: 'buff',
        targetType: 'self',
        buffStats: { stat: 'ability', ability: 'strength', value: 2, turns: 4 },
        cooldown: 5,
        description: 'Entre en rage: +2 dégâts mêlée, résistance contondant/perforant/tranchant.'
      }
    ]
  ),

  createCharacter(
    'knight',
    'Gauvain',
    'Chevalier',
    '🛡️',
    createAbilities(15, 10, 14, 10, 13, 14),
    ['wisdom', 'charisma'],
    18, // Cotte de mailles + bouclier
    30,
    [
      { 
        id: 'divine_smite', 
        name: 'Châtiment divin', 
        damage: 0,
        damageDice: '2d8',
        type: 'attack',
        damageType: 'radiant',
        targetType: 'enemy',
        requiresAttackRoll: true,
        bonusVsDemon: 4,
        bonusVsUndead: 4,
        cooldown: 3,
        description: 'Consomme un emplacement de sort. +2d8 dégâts radiants (+1d8 vs morts-vivants/fiélons).'
      },
      { 
        id: 'lay_on_hands', 
        name: 'Imposition des mains', 
        damage: -5,
        type: 'heal',
        targetType: 'ally',
        cooldown: 4,
        description: 'Puise dans votre réserve de 5 × niveau PV pour soigner.'
      }
    ]
  ),

  // ============================================
  // MAGES (d6)
  // ============================================
  createCharacter(
    'mage',
    'Elara',
    'Mage',
    '🔮',
    createAbilities(8, 14, 12, 16, 13, 10),
    ['intelligence', 'wisdom'],
    12, // 10 + DEX
    30,
    [
      { 
        id: 'fire_bolt', 
        name: 'Trait de feu', 
        damage: 0,
        damageDice: '1d10',
        type: 'attack',
        damageType: 'fire',
        targetType: 'enemy',
        isSpellAttack: true,
        requiresAttackRoll: true,
        cooldown: 0,
        description: 'Sort mineur. Jet d\'attaque à distance, 1d10 dégâts de feu.'
      },
      { 
        id: 'magic_missile', 
        name: 'Projectile magique', 
        damage: 0,
        damageDice: '3d4+3',
        type: 'damage',
        damageType: 'force',
        targetType: 'enemy',
        requiresAttackRoll: false, // Touche automatiquement
        cooldown: 2,
        description: 'Trois projectiles qui touchent automatiquement. 1d4+1 force chacun.'
      }
    ]
  ),

  createCharacter(
    'necromancer',
    'Morrigan',
    'Nécromancien',
    '💀',
    createAbilities(8, 14, 12, 16, 12, 10),
    ['intelligence', 'wisdom'],
    12,
    30,
    [
      { 
        id: 'chill_touch', 
        name: 'Contact glacial', 
        damage: 0,
        damageDice: '1d8',
        type: 'attack',
        damageType: 'necrotic',
        targetType: 'enemy',
        isSpellAttack: true,
        requiresAttackRoll: true,
        cooldown: 0,
        description: 'Sort mineur. 1d8 nécrotique, empêche la régénération jusqu\'à votre prochain tour.'
      },
      { 
        id: 'false_life', 
        name: 'Simulacre de vie', 
        damage: -6,
        damageDice: '1d4+4',
        type: 'heal',
        targetType: 'self',
        cooldown: 3,
        description: 'Gagne 1d4+4 PV temporaires pendant 1 heure.'
      }
    ]
  ),

  createCharacter(
    'elementalist',
    'Zephyr',
    'Élémentaliste',
    '🌪️',
    createAbilities(8, 14, 14, 16, 10, 12),
    ['constitution', 'intelligence'],
    12,
    30,
    [
      { 
        id: 'shocking_grasp', 
        name: 'Poigne électrique', 
        damage: 0,
        damageDice: '1d8',
        type: 'attack',
        damageType: 'lightning',
        targetType: 'enemy',
        isSpellAttack: true,
        requiresAttackRoll: true,
        cooldown: 0,
        description: 'Sort mineur au contact. 1d8 foudre, avantage contre cibles en armure métallique.'
      },
      { 
        id: 'chromatic_orb', 
        name: 'Orbe chromatique', 
        damage: 0,
        damageDice: '3d8',
        type: 'attack',
        damageType: 'lightning',
        targetType: 'enemy',
        isSpellAttack: true,
        requiresAttackRoll: true,
        cooldown: 2,
        description: 'Sort niveau 1. 3d8 dégâts du type élémentaire choisi.'
      }
    ]
  ),

  createCharacter(
    'sorcerer',
    'Kael',
    'Ensorceleur',
    '⚡',
    createAbilities(8, 14, 12, 10, 10, 17),
    ['constitution', 'charisma'],
    12,
    30,
    [
      { 
        id: 'ray_of_frost', 
        name: 'Rayon de givre', 
        damage: 0,
        damageDice: '1d8',
        type: 'attack',
        damageType: 'cold',
        targetType: 'enemy',
        isSpellAttack: true,
        requiresAttackRoll: true,
        debuffStats: { stat: 'speed', value: 3, turns: 1 },
        cooldown: 0,
        description: 'Sort mineur. 1d8 froid, réduit la vitesse de 3m jusqu\'à votre prochain tour.'
      },
      { 
        id: 'chaos_bolt', 
        name: 'Trait de chaos', 
        damage: 0,
        damageDice: '2d8+1d6',
        type: 'attack',
        damageType: 'force',
        targetType: 'enemy',
        isSpellAttack: true,
        requiresAttackRoll: true,
        cooldown: 2,
        description: 'Sort niveau 1. 2d8+1d6 dégâts de type aléatoire. Peut rebondir sur doubles.'
      }
    ]
  ),

  createCharacter(
    'warlock',
    'Azrael',
    'Occultiste',
    '👁️‍🗨️',
    createAbilities(8, 14, 12, 12, 10, 16),
    ['wisdom', 'charisma'],
    13, // Armure de cuir
    30,
    [
      { 
        id: 'eldritch_blast', 
        name: 'Décharge occulte', 
        damage: 0,
        damageDice: '1d10',
        type: 'attack',
        damageType: 'force',
        targetType: 'enemy',
        isSpellAttack: true,
        requiresAttackRoll: true,
        cooldown: 0,
        description: 'Sort mineur signature. 1d10 force. Rayons supplémentaires aux niveaux supérieurs.'
      },
      { 
        id: 'hex', 
        name: 'Maléfice', 
        damage: 0,
        damageDice: '1d6',
        type: 'debuff',
        damageType: 'necrotic',
        targetType: 'enemy',
        debuffStats: { stat: 'attack', value: 2, turns: 3 },
        cooldown: 3,
        description: 'Marque une cible. +1d6 nécrotique par attaque. Désavantage sur un type de jet.'
      }
    ]
  ),

  // ============================================
  // SOIGNEURS (d8)
  // ============================================
  createCharacter(
    'healer',
    'Liora',
    'Prêtresse',
    '✨',
    createAbilities(10, 12, 14, 10, 16, 13),
    ['wisdom', 'charisma'],
    16, // Chemise de mailles + bouclier
    30,
    [
      { 
        id: 'cure_wounds', 
        name: 'Soins des blessures', 
        damage: -9,
        damageDice: '1d8',
        type: 'heal',
        targetType: 'ally',
        cooldown: 2,
        description: 'Sort niveau 1. Soigne 1d8 + mod SAG PV au toucher.'
      },
      { 
        id: 'sacred_flame', 
        name: 'Flamme sacrée', 
        damage: 0,
        damageDice: '1d8',
        type: 'damage',
        damageType: 'radiant',
        targetType: 'enemy',
        requiresAttackRoll: false,
        savingThrow: { ability: 'dexterity', dc: 13 },
        cooldown: 0,
        description: 'Sort mineur. 1d8 radiant, jet de sauvegarde DEX pour annuler.'
      }
    ]
  ),

  createCharacter(
    'druid',
    'Sylvestre',
    'Druide',
    '🌿',
    createAbilities(10, 14, 14, 12, 16, 8),
    ['intelligence', 'wisdom'],
    14, // Armure de cuir + bouclier bois
    30,
    [
      { 
        id: 'healing_word', 
        name: 'Mot de guérison', 
        damage: -6,
        damageDice: '1d4',
        type: 'heal',
        targetType: 'ally',
        cooldown: 2,
        description: 'Sort niveau 1 bonus. Soigne 1d4 + mod SAG à distance.'
      },
      { 
        id: 'produce_flame', 
        name: 'Flammes', 
        damage: 0,
        damageDice: '1d8',
        type: 'attack',
        damageType: 'fire',
        targetType: 'enemy',
        isSpellAttack: true,
        requiresAttackRoll: true,
        cooldown: 0,
        description: 'Sort mineur. Crée une flamme, peut l\'attaquer pour 1d8 feu.'
      }
    ]
  ),

  createCharacter(
    'oracle',
    'Cassandre',
    'Oracle',
    '🔮',
    createAbilities(8, 12, 12, 14, 17, 12),
    ['wisdom', 'charisma'],
    12,
    30,
    [
      { 
        id: 'guidance', 
        name: 'Assistance', 
        damage: 0,
        type: 'buff',
        targetType: 'ally',
        buffStats: { stat: 'attack', value: 2, turns: 2 },
        cooldown: 2,
        description: 'Sort mineur. La cible ajoute 1d4 à un jet de caractéristique.'
      },
      { 
        id: 'cure_wounds', 
        name: 'Soins', 
        damage: -9,
        damageDice: '1d8',
        type: 'heal',
        targetType: 'ally',
        cooldown: 2,
        description: 'Sort niveau 1. Soigne 1d8 + mod SAG PV.'
      }
    ]
  ),

  createCharacter(
    'life_cleric',
    'Seraphina',
    'Clerc de Vie',
    '☀️',
    createAbilities(14, 10, 14, 10, 16, 12),
    ['wisdom', 'charisma'],
    18, // Cotte de mailles + bouclier (domaine vie)
    30,
    [
      { 
        id: 'cure_wounds_blessed', 
        name: 'Soins bénis', 
        damage: -12,
        damageDice: '1d8+3',
        type: 'heal',
        targetType: 'ally',
        cooldown: 2,
        description: 'Soins majorés (Disciple de la Vie). 1d8 + mod SAG + 3 PV.'
      },
      { 
        id: 'toll_the_dead', 
        name: 'Glas funèbre', 
        damage: 0,
        damageDice: '1d8',
        type: 'damage',
        damageType: 'necrotic',
        targetType: 'enemy',
        requiresAttackRoll: false,
        savingThrow: { ability: 'wisdom', dc: 13 },
        cooldown: 0,
        description: 'Sort mineur. 1d8 nécrotique (1d12 si cible blessée), JS SAG pour annuler.'
      }
    ]
  ),

  // ============================================
  // ROUBLARDS (d8)
  // ============================================
  createCharacter(
    'rogue',
    'Ombre',
    'Roublard',
    '🗡️',
    createAbilities(10, 17, 14, 13, 12, 8),
    ['dexterity', 'intelligence'],
    14, // Armure de cuir + DEX
    30,
    [
      { 
        id: 'sneak_attack', 
        name: 'Attaque sournoise', 
        damage: 0,
        damageDice: '2d6',
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        requiresAttackRoll: true,
        cooldown: 1,
        description: 'Si avantage ou allié adjacent. 1d6 + 1d6 (attaque sournoise) + DEX perforant.'
      },
      { 
        id: 'cunning_action', 
        name: 'Ruse', 
        damage: 0, 
        type: 'buff',
        targetType: 'self',
        buffStats: { stat: 'speed', value: 5, turns: 1 },
        cooldown: 2,
        description: 'Action bonus: Désengagement, Sprint ou Se cacher.'
      }
    ]
  ),

  createCharacter(
    'ninja',
    'Kaito',
    'Ninja',
    '🥷',
    createAbilities(10, 17, 14, 12, 14, 8),
    ['dexterity', 'wisdom'],
    14,
    35, // Ninjas plus rapides
    [
      { 
        id: 'shuriken', 
        name: 'Shuriken', 
        damage: 0,
        damageDice: '2d4',
        type: 'attack',
        damageType: 'slashing',
        targetType: 'enemy',
        requiresAttackRoll: true,
        cooldown: 0,
        description: 'Lance deux shurikens. 2 × (1d4 + DEX) tranchant.'
      },
      { 
        id: 'smoke_bomb', 
        name: 'Bombe fumigène', 
        damage: 0, 
        type: 'debuff',
        targetType: 'enemy',
        debuffStats: { stat: 'attack', value: 3, turns: 2 },
        cooldown: 3,
        description: 'Aveugle la zone. Ennemis affectés: -3 aux attaques pendant 2 tours.'
      }
    ]
  ),

  createCharacter(
    'thief',
    'Filou',
    'Voleur',
    '🎭',
    createAbilities(8, 17, 14, 14, 10, 12),
    ['dexterity', 'charisma'],
    14,
    30,
    [
      { 
        id: 'quick_fingers', 
        name: 'Doigts agiles', 
        damage: 0,
        damageDice: '1d6',
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        requiresAttackRoll: true,
        lifesteal: 25,
        cooldown: 2,
        description: 'Attaque rapide et vole 25% des dégâts en PV.'
      },
      { 
        id: 'fast_hands', 
        name: 'Mains lestes', 
        damage: 0, 
        type: 'buff',
        targetType: 'self',
        buffStats: { stat: 'speed', value: 4, turns: 2 },
        cooldown: 2,
        description: 'Utiliser objet, crocheter ou désamorcer en action bonus. +4 vitesse.'
      }
    ]
  ),

  createCharacter(
    'assassin',
    'Vex',
    'Assassin',
    '☠️',
    createAbilities(10, 17, 14, 14, 10, 8),
    ['dexterity', 'intelligence'],
    14,
    30,
    [
      { 
        id: 'assassinate', 
        name: 'Assassinat', 
        damage: 0,
        damageDice: '4d6',
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        requiresAttackRoll: true,
        cooldown: 4,
        description: 'Critique automatique si la cible est surprise. Dégâts doublés.'
      },
      { 
        id: 'poison_blade', 
        name: 'Lame empoisonnée', 
        damage: 0,
        damageDice: '1d6',
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        requiresAttackRoll: true,
        poison: { damage: 3, turns: 3 },
        cooldown: 3,
        description: 'Applique du poison. 3 dégâts de poison par tour pendant 3 tours.'
      }
    ]
  ),

  // ============================================
  // ARCHERS / RÔDEURS (d10)
  // ============================================
  createCharacter(
    'archer',
    'Sylva',
    'Archère',
    '🏹',
    createAbilities(12, 16, 12, 10, 14, 8),
    ['strength', 'dexterity'],
    14, // Armure de cuir + DEX
    30,
    [
      { 
        id: 'aimed_shot', 
        name: 'Tir visé', 
        damage: 0,
        damageDice: '1d8',
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        requiresAttackRoll: true,
        cooldown: 1,
        description: 'Tir précis à l\'arc long. 1d8 + DEX perforant.'
      },
      { 
        id: 'hunters_mark', 
        name: 'Marque du chasseur', 
        damage: 0, 
        type: 'buff',
        targetType: 'self',
        buffStats: { stat: 'attack', value: 3, turns: 3 },
        cooldown: 4,
        description: 'Sort niveau 1. Marque une proie: +1d6 dégâts par attaque contre elle.'
      }
    ]
  ),

  createCharacter(
    'ranger',
    'Artémis',
    'Rôdeur',
    '🌲',
    createAbilities(12, 16, 14, 10, 14, 8),
    ['strength', 'dexterity'],
    14,
    30,
    [
      { 
        id: 'favored_enemy', 
        name: 'Ennemi juré', 
        damage: 0,
        damageDice: '1d8+2',
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        requiresAttackRoll: true,
        cooldown: 0,
        description: 'Attaque avec bonus contre votre ennemi favori.'
      },
      { 
        id: 'ensnaring_strike', 
        name: 'Frappe piégeuse', 
        damage: 0,
        damageDice: '1d6',
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        requiresAttackRoll: true,
        debuffStats: { stat: 'speed', value: 5, turns: 2 },
        cooldown: 2,
        description: 'Sort niveau 1. Lianes qui entrave la cible (JS FOR pour se libérer).'
      }
    ]
  ),

  createCharacter(
    'crossbowman',
    'Balthazar',
    'Arbalétrier',
    '🎯',
    createAbilities(14, 16, 12, 10, 12, 8),
    ['strength', 'constitution'],
    15, // Cuir clouté + DEX
    30,
    [
      { 
        id: 'heavy_bolt', 
        name: 'Carreau lourd', 
        damage: 0,
        damageDice: '1d10',
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        requiresAttackRoll: true,
        cooldown: 1,
        description: 'Tir d\'arbalète lourde. 1d10 + DEX perforant.'
      },
      { 
        id: 'crossbow_expert', 
        name: 'Expert arbalète', 
        damage: 0,
        damageDice: '1d6',
        type: 'attack',
        damageType: 'piercing',
        targetType: 'enemy',
        requiresAttackRoll: true,
        cooldown: 0,
        description: 'Ignore le rechargement. Tir bonus avec arbalète de poing.'
      }
    ]
  ),

  // ============================================
  // TANKS / PROTECTEURS (d10/d12)
  // ============================================
  createCharacter(
    'paladin',
    'Aldric',
    'Paladin',
    '⚜️',
    createAbilities(16, 10, 14, 8, 12, 14),
    ['wisdom', 'charisma'],
    18, // Cotte de mailles + bouclier
    30,
    [
      { 
        id: 'divine_smite', 
        name: 'Châtiment divin', 
        damage: 0,
        damageDice: '2d8',
        type: 'attack',
        damageType: 'radiant',
        targetType: 'enemy',
        requiresAttackRoll: true,
        bonusVsDemon: 4,
        bonusVsUndead: 4,
        cooldown: 3,
        description: 'Consomme un emplacement de sort. +2d8 dégâts radiants.'
      },
      { 
        id: 'lay_on_hands', 
        name: 'Imposition des mains', 
        damage: -5,
        type: 'heal',
        targetType: 'ally',
        cooldown: 4,
        description: 'Puise dans votre réserve de 5 × niveau PV pour soigner.'
      }
    ]
  ),

  createCharacter(
    'guardian',
    'Goliath',
    'Gardien',
    '🏰',
    createAbilities(17, 10, 14, 8, 12, 8),
    ['strength', 'constitution'],
    17, // Cotte de mailles + bouclier
    30,
    [
      { 
        id: 'shield_bash', 
        name: 'Coup de bouclier', 
        damage: 0,
        damageDice: '1d4',
        type: 'attack',
        damageType: 'bludgeoning',
        targetType: 'enemy',
        requiresAttackRoll: true,
        debuffStats: { stat: 'attack', value: 2, turns: 1 },
        cooldown: 1,
        description: 'Repousse l\'ennemi et réduit ses attaques.'
      },
      { 
        id: 'protection', 
        name: 'Protection', 
        damage: 0, 
        type: 'buff',
        targetType: 'ally',
        buffStats: { stat: 'ac', value: 3, turns: 2 },
        cooldown: 2,
        description: 'Réaction: impose désavantage aux attaques contre un allié adjacent.'
      }
    ]
  ),

  createCharacter(
    'warlord',
    'Marcus',
    'Seigneur de guerre',
    '👑',
    createAbilities(16, 12, 14, 10, 10, 14),
    ['strength', 'charisma'],
    18,
    30,
    [
      { 
        id: 'commanding_strike', 
        name: 'Frappe de commandement', 
        damage: 0,
        damageDice: '1d8',
        type: 'attack',
        damageType: 'slashing',
        targetType: 'enemy',
        requiresAttackRoll: true,
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
        description: 'Inspire l\'équipe. +1 aux jets d\'attaque pour tous les alliés.'
      }
    ]
  ),

  // ============================================
  // MOINES (d8)
  // ============================================
  createCharacter(
    'monk',
    'Li Wei',
    'Moine',
    '🥋',
    createAbilities(10, 17, 14, 10, 14, 8),
    ['strength', 'dexterity'],
    15, // 10 + DEX (3) + SAG (2) = Défense sans armure
    30,
    [
      { 
        id: 'flurry_of_blows', 
        name: 'Déluge de coups', 
        damage: 0,
        damageDice: '2d4',
        type: 'attack',
        damageType: 'bludgeoning',
        targetType: 'enemy',
        requiresAttackRoll: true,
        cooldown: 2,
        description: 'Dépense 1 ki. Deux frappes bonus. 2 × (1d4 + DEX) contondant.'
      },
      { 
        id: 'patient_defense', 
        name: 'Défense patiente', 
        damage: 0, 
        type: 'buff',
        targetType: 'self',
        buffStats: { stat: 'ac', value: 3, turns: 1 },
        cooldown: 2,
        description: 'Dépense 1 ki. Esquive en action bonus (désavantage aux attaques contre vous).'
      }
    ]
  ),

  createCharacter(
    'pugilist',
    'Brutus',
    'Pugiliste',
    '👊',
    createAbilities(17, 14, 14, 8, 10, 8),
    ['strength', 'constitution'],
    13, // 10 + DEX (2) + bonus
    30,
    [
      { 
        id: 'haymaker', 
        name: 'Uppercut', 
        damage: 0,
        damageDice: '1d8',
        type: 'attack',
        damageType: 'bludgeoning',
        targetType: 'enemy',
        requiresAttackRoll: true,
        cooldown: 2,
        description: 'Coup dévastateur. 1d8 + FOR contondant.'
      },
      { 
        id: 'brace', 
        name: 'Garde haute', 
        damage: 0, 
        type: 'buff',
        targetType: 'self',
        buffStats: { stat: 'ac', value: 2, turns: 2 },
        cooldown: 2,
        description: 'Se met en garde. +2 à la CA pendant 2 tours.'
      }
    ]
  ),

  // ============================================
  // BARDES (d8)
  // ============================================
  createCharacter(
    'bard',
    'Orphée',
    'Barde',
    '🎵',
    createAbilities(10, 14, 14, 12, 10, 16),
    ['dexterity', 'charisma'],
    13, // Armure de cuir + DEX
    30,
    [
      { 
        id: 'vicious_mockery', 
        name: 'Moquerie cruelle', 
        damage: 0,
        damageDice: '1d4',
        type: 'damage',
        damageType: 'psychic',
        targetType: 'enemy',
        requiresAttackRoll: false,
        savingThrow: { ability: 'wisdom', dc: 14 },
        debuffStats: { stat: 'attack', value: 2, turns: 1 },
        cooldown: 0,
        description: 'Sort mineur. 1d4 psychique et désavantage à la prochaine attaque (JS SAG).'
      },
      { 
        id: 'bardic_inspiration', 
        name: 'Inspiration bardique', 
        damage: 0, 
        type: 'buff',
        targetType: 'ally',
        buffStats: { stat: 'attack', value: 3, turns: 2 },
        cooldown: 3,
        description: 'Action bonus. Donne un dé d\'inspiration (1d6) à un allié.'
      }
    ]
  ),

  createCharacter(
    'skald',
    'Sigurd',
    'Scalde',
    '🎸',
    createAbilities(14, 12, 16, 8, 10, 14),
    ['constitution', 'charisma'],
    15, // Chemise de mailles
    30,
    [
      { 
        id: 'thunderwave', 
        name: 'Vague tonnante', 
        damage: 0,
        damageDice: '2d8',
        type: 'damage',
        damageType: 'thunder',
        targetType: 'all_enemies',
        requiresAttackRoll: false,
        savingThrow: { ability: 'constitution', dc: 14 },
        cooldown: 2,
        description: 'Sort niveau 1. 2d8 tonnerre en zone, repousse de 3m (JS CON pour demi-dégâts).'
      },
      { 
        id: 'song_of_rest', 
        name: 'Chant de repos', 
        damage: -4,
        damageDice: '1d6',
        type: 'heal',
        targetType: 'all_allies',
        cooldown: 5,
        description: 'Pendant un repos court, alliés récupèrent 1d6 PV supplémentaires.'
      }
    ]
  )
];

// =============================================================================
// HELPERS POUR LE LEVEL UP
// =============================================================================

/**
 * Augmente le niveau d'un personnage et recalcule ses stats
 */
export function levelUpCharacter(character: Character): Character {
  const newLevel = character.level + 1;
  const newProfBonus = getProficiencyBonus(newLevel);
  const newMaxHp = calculateMaxHP(character.class, newLevel, character.abilities.constitution);
  const hpGain = newMaxHp - character.maxHp;
  
  return {
    ...character,
    level: newLevel,
    proficiencyBonus: newProfBonus,
    maxHp: newMaxHp,
    hp: Math.min(character.hp + hpGain, newMaxHp), // Gagne les PV du level up
    pendingTalentChoice: [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100].includes(newLevel)
  };
}

/**
 * Ajoute de l'XP à un personnage et gère le level up
 */
export function addXPToCharacter(character: Character, xp: number): Character {
  const newTotalXP = character.totalXP + xp;
  const newXP = character.xp + xp;
  
  // Vérifier si level up
  const xpForNextLevel = getXPForNextLevel(character.level);
  
  let updatedCharacter = {
    ...character,
    xp: newXP,
    totalXP: newTotalXP
  };
  
  // Level up si assez d'XP
  if (newXP >= xpForNextLevel && character.level < 100) {
    updatedCharacter.xp = newXP - xpForNextLevel;
    updatedCharacter = levelUpCharacter(updatedCharacter);
  }
  
  return updatedCharacter;
}

/**
 * Retourne l'XP nécessaire pour le prochain niveau
 */
function getXPForNextLevel(level: number): number {
  if (level >= 100) return Infinity;
  if (level < 1) return XP_THRESHOLDS[0];
  return XP_THRESHOLDS[level] - (XP_THRESHOLDS[level - 1] || 0);
}

// =============================================================================
// EXPORT
// =============================================================================

export { createAbilities, createCharacter, getXPForNextLevel };
