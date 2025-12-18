// Types pour le jeu Ethernalys - Système inspiré de D&D 5e

// ============================================
// SYSTÈME D&D - CARACTÉRISTIQUES
// ============================================

// Les 6 caractéristiques de D&D
export interface AbilityScores {
  strength: number;     // Force - attaques au corps à corps, dégâts physiques
  dexterity: number;    // Dextérité - CA, initiative, attaques à distance
  constitution: number; // Constitution - points de vie
  intelligence: number; // Intelligence - sorts arcanes
  wisdom: number;       // Sagesse - perception, sorts divins
  charisma: number;     // Charisme - sorts, intimidation
}

// Calcul du modificateur D&D
export function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

// Types de dégâts D&D
export type DamageType = 
  // Physiques
  | 'bludgeoning'   // Contondant
  | 'piercing'      // Perforant
  | 'slashing'      // Tranchant
  // Élémentaires
  | 'fire'          // Feu
  | 'cold'          // Froid
  | 'lightning'     // Foudre
  | 'acid'          // Acide
  | 'poison'        // Poison
  // Autres
  | 'necrotic'      // Nécrotique
  | 'radiant'       // Radiant
  | 'force'         // Force
  | 'psychic'       // Psychique
  | 'thunder';      // Tonnerre

// Types de créatures D&D
export type CreatureType = 
  | 'aberration'    // Aberration
  | 'beast'         // Bête
  | 'celestial'     // Céleste
  | 'construct'     // Artificiel
  | 'dragon'        // Dragon
  | 'elemental'     // Élémentaire
  | 'fey'           // Fée
  | 'fiend'         // Fiélon (démon/diable)
  | 'giant'         // Géant
  | 'humanoid'      // Humanoïde
  | 'monstrosity'   // Monstruosité
  | 'ooze'          // Vase
  | 'plant'         // Plante
  | 'undead';       // Mort-vivant

// Taille des créatures
export type CreatureSize = 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan';

// ============================================
// PERSONNAGES
// ============================================
export interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  hp: number;
  maxHp: number;
  tempHp?: number; // Points de vie temporaires
  // Caractéristiques D&D
  abilities: AbilityScores;
  // Stats dérivées
  armorClass: number; // Classe d'armure
  speed: number; // Vitesse de déplacement
  proficiencyBonus: number; // Bonus de maîtrise
  // Jets de sauvegarde maîtrisés
  savingThrowProficiencies: (keyof AbilityScores)[];
  // Combat simplifié (pour compatibilité)
  attack: number;
  magicAttack: number;
  defense: number;
  magicDefense: number;
  // Compétences
  skills: Skill[];
  portrait: string;
  // Buffs/Debuffs
  buffs?: ActiveBuff[];
  conditions?: Condition[];
  // Résistances
  resistances?: DamageType[];
  immunities?: DamageType[];
  vulnerabilities?: DamageType[];
  // Inventaire et Équipement
  inventory?: InventoryItem[];
  equipment?: CharacterEquipment;
  stats?: CharacterStats;
  // Stats de base pour tracking
  baseAttack?: number;
  baseMagicAttack?: number;
  baseDefense?: number;
  baseMagicDefense?: number;
  baseSpeed?: number;
}

// Conditions D&D
export type Condition = 
  | 'blinded'       // Aveuglé
  | 'charmed'       // Charmé
  | 'deafened'      // Assourdi
  | 'exhaustion'    // Épuisement
  | 'frightened'    // Effrayé
  | 'grappled'      // Agrippé
  | 'incapacitated' // Neutralisé
  | 'invisible'     // Invisible
  | 'paralyzed'     // Paralysé
  | 'petrified'     // Pétrifié
  | 'poisoned'      // Empoisonné
  | 'prone'         // À terre
  | 'restrained'    // Entravé
  | 'stunned'       // Étourdi
  | 'unconscious';  // Inconscient

export interface ActiveBuff {
  id: string;
  name: string;
  type: 'attack' | 'magicAttack' | 'defense' | 'magicDefense' | 'damage_reflect' | 'regen' | 'poison' | 'speed';
  value: number;
  turnsRemaining: number;
  ownerId: string;
  icon: string;
  isApplied?: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  rarity: string;
  description: string;
  obtainedAt: number;
}

// ============================================
// SYSTÈME D'ÉQUIPEMENT (Pathfinder/BG3 style)
// ============================================

// Types d'emplacements d'équipement
export type EquipmentSlotType = 
  | 'head'           // Casque
  | 'armor'          // Armure/Torse
  | 'cloak'          // Cape
  | 'gloves'         // Gants
  | 'bracers'        // Avant-bras/Bracelets
  | 'belt'           // Ceinture
  | 'boots'          // Bottes/Jambières
  | 'necklace'       // Collier/Amulette
  | 'ring1'          // Anneau 1
  | 'ring2'          // Anneau 2
  | 'mainHand'       // Main principale (arme)
  | 'offHand'        // Main secondaire (bouclier/arme légère)
  | 'ranged'         // Arme à distance
  | 'consumable1'    // Emplacement consommable 1
  | 'consumable2'    // Emplacement consommable 2
  | 'consumable3';   // Emplacement consommable 3

// Catégorie d'arme
export type WeaponCategory = 
  | 'simple_melee'   // Armes simples de mêlée
  | 'martial_melee'  // Armes de guerre de mêlée
  | 'simple_ranged'  // Armes simples à distance
  | 'martial_ranged' // Armes de guerre à distance
  | 'shield'         // Bouclier
  | 'focus';         // Focus arcanique

// Catégorie d'armure
export type ArmorCategory = 'light' | 'medium' | 'heavy' | 'shield' | 'clothing';

// Pièce d'équipement
export interface Equipment {
  id: string;
  name: string;
  icon: string;
  slotType: EquipmentSlotType;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  description: string;
  // Stats bonus
  bonuses?: {
    attack?: number;
    magicAttack?: number;
    defense?: number;
    magicDefense?: number;
    speed?: number;
    maxHp?: number;
    armorClass?: number;
    // Bonus de caractéristiques
    strength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
  };
  // Pour les armes
  weaponCategory?: WeaponCategory;
  damage?: string;        // Ex: "1d8", "2d6"
  damageType?: DamageType;
  twoHanded?: boolean;
  finesse?: boolean;      // Utilise DEX ou FOR
  // Pour les armures
  armorCategory?: ArmorCategory;
  baseAC?: number;
  maxDexBonus?: number;   // Bonus DEX max pour armures moyennes/lourdes
  stealthDisadvantage?: boolean;
  // Effets spéciaux
  effects?: EquipmentEffect[];
  // Prérequis
  requirements?: {
    strength?: number;
    classes?: string[];
  };
  // Prix en pièces d'or
  value?: number;
}

// Effet d'équipement
export interface EquipmentEffect {
  type: 'resistance' | 'immunity' | 'skill' | 'passive' | 'onHit';
  damageType?: DamageType;
  skillGranted?: Skill;
  passiveBonus?: {
    type: 'critical' | 'lifesteal' | 'thorns' | 'regeneration' | 'evasion' | 'initiative';
    value: number;
  };
}

// Emplacements d'équipement du personnage
export interface CharacterEquipment {
  head?: Equipment;
  armor?: Equipment;
  cloak?: Equipment;
  gloves?: Equipment;
  bracers?: Equipment;
  belt?: Equipment;
  boots?: Equipment;
  necklace?: Equipment;
  ring1?: Equipment;
  ring2?: Equipment;
  mainHand?: Equipment;
  offHand?: Equipment;
  ranged?: Equipment;
  consumable1?: Equipment;
  consumable2?: Equipment;
  consumable3?: Equipment;
}

export interface CharacterStats {
  totalDamageDealt: number;
  totalDamageTaken: number;
  totalHealingDone: number;
  monstersKilled: Monster[];
  strongestMonsterKilled?: Monster;
}

export interface Skill {
  id: string;
  name: string;
  damage: number;
  type: 'attack' | 'heal' | 'buff' | 'debuff' | 'damage';
  damageType?: DamageType | 'physical' | 'magical' | 'holy';
  description?: string;
  effects?: SkillEffect[];
  targetType?: 'enemy' | 'ally' | 'self' | 'all_allies' | 'all_enemies';
  bonusVsDemon?: number;
  bonusVsUndead?: number;
  lifesteal?: number;
  damageReflect?: number;
  buffStats?: { stat: 'attack' | 'magicAttack' | 'defense' | 'magicDefense' | 'speed'; value: number; turns: number };
  debuffStats?: { stat: 'attack' | 'magicAttack' | 'defense' | 'magicDefense' | 'speed'; value: number; turns: number };
  healOverTime?: { value: number; turns: number };
  poison?: { damage: number; turns: number };
  cooldown?: number;
  currentCooldown?: number;
  // D&D spécifique
  savingThrow?: { ability: keyof AbilityScores; dc: number };
  areaOfEffect?: { type: 'cone' | 'sphere' | 'line' | 'cube'; size: number };
}

export interface SkillEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'lifesteal' | 'reflect' | 'regen' | 'poison' | 'bonus_vs_type';
  value: number;
  duration?: number;
  targetType?: string;
}

// ============================================
// MONSTRES D&D
// ============================================
export interface Monster {
  id: string;
  name: string;
  // Stats de base
  hp: number;
  maxHp: number;
  armorClass: number;
  // Caractéristiques D&D
  abilities: AbilityScores;
  // Combat simplifié
  attack: number;
  magicAttack?: number;
  defense: number;
  magicDefense: number;
  speed: number;
  // Infos D&D
  challengeRating: number; // CR (indice de dangerosité)
  xpReward: number;
  creatureType: CreatureType;
  size: CreatureSize;
  alignment?: string;
  // Affichage
  portrait: string;
  description?: string;
  // Boss
  isBoss: boolean;
  isLegendary?: boolean;
  // Résistances D&D
  resistances?: DamageType[];
  immunities?: DamageType[];
  vulnerabilities?: DamageType[];
  conditionImmunities?: Condition[];
  // Compétences
  skills?: MonsterSkill[];
  // Actions légendaires (X fois par tour pour les légendaires)
  legendaryActions?: LegendaryAction[];
  legendaryActionsPerTurn?: number; // Nombre d'actions légendaires par tour
  legendaryActionsRemaining?: number; // Actions restantes ce tour
  // Ultime (pour les boss)
  ultimateSkill?: MonsterSkill;
  ultimateUsed?: boolean;
  ultimateTurnTrigger?: number;
  // Accompagnateurs
  minions?: string[];
  // Stats de base pour tracking
  baseAttack?: number;
  baseMagicAttack?: number;
  baseDefense?: number;
  baseMagicDefense?: number;
  baseSpeed?: number;
  // Buffs actifs
  buffs?: ActiveBuff[];
  // Compatibilité ancien système
  monsterType?: 'demon' | 'undead' | 'beast' | 'humanoid' | 'elemental' | 'dragon';
}

export interface LegendaryAction {
  id: string;
  name: string;
  cost: number; // Coût en actions légendaires (1-3)
  damage?: number;
  damageType?: DamageType;
  description: string;
  effect?: {
    type: 'damage' | 'heal' | 'buff_self' | 'debuff_target' | 'move' | 'special' | 'lifesteal';
    value?: number;
    stat?: string;
    turns?: number; // Durée de l'effet en tours
    condition?: Condition;
  };
}

export interface MonsterSkill {
  id: string;
  name: string;
  damage: number;
  damageType: DamageType | 'physical' | 'magical';
  type: 'attack' | 'special' | 'buff' | 'debuff' | 'multiattack';
  description: string;
  // Attaques multiples
  attackCount?: number;
  // Effets
  effect?: {
    type: 'damage' | 'heal' | 'buff_self' | 'debuff_target' | 'lifesteal' | 'grapple' | 'frighten' | 'poison'
      | 'debuff_attack' | 'debuff_defense' | 'debuff_speed' | 'debuff_magic_attack' | 'debuff_magic_defense';
    value?: number;
    stat?: string;
    turns?: number;
    condition?: Condition;
  };
  // Recharge (comme les souffles de dragon)
  recharge?: { min: number; max?: number }; // Recharge sur 5-6 par exemple (max optionnel, défaut: 6)
  isRecharged?: boolean;
  // Jet de sauvegarde
  savingThrow?: { ability: keyof AbilityScores; dc: number };
  // Zone d'effet
  areaOfEffect?: boolean;
  cooldown?: number;
  currentCooldown?: number;
}

// ============================================
// ÉVÉNEMENTS
// ============================================
export interface GameEvent {
  id: string;
  name: string;
  description: string;
  type: 'positive' | 'negative';
  effect: EventEffect;
}

export interface EventEffect {
  type: 'heal' | 'damage' | 'buff_attack' | 'buff_magic_attack' | 'buff_defense' | 'debuff_attack' | 'debuff_magic_attack' | 'debuff_defense';
  value: number;
  target: 'all' | 'random' | 'weakest' | 'strongest';
}

// ============================================
// PLATEAU DE JEU
// ============================================
export interface Room {
  x: number;
  y: number;
  discovered: boolean;
  visited: boolean;
  type: 'start' | 'combat' | 'event' | 'treasure' | 'boss' | 'unknown';
  content?: Monster | GameEvent | TreasureLegacy;
}

export interface TreasureLegacy {
  id: string;
  name: string;
  description: string;
  effect: {
    type: 'heal_all' | 'buff_permanent' | 'revive';
    value: number;
  };
}

// ============================================
// HISTORIQUE
// ============================================
export interface HistoryEntry {
  turn: number;
  type: 'combat' | 'event' | 'treasure' | 'boss';
  title: string;
  description: string;
  icon: string;
  isPositive: boolean;
  treasureId?: string;
  treasureRarity?: string;
  assignedTo?: string;
}

export interface CombatHistoryEntry {
  id: string;
  turn: number;
  actor: string;
  actorPortrait: string;
  action: string;
  target?: string;
  damage?: number;
  heal?: number;
  effect?: string;
  isPlayerAction: boolean;
  damageType?: DamageType | 'physical' | 'magical' | 'holy';
  timestamp: number;
}

// ============================================
// ÉTAT DU JEU
// ============================================
export type GamePhase = 'menu' | 'character_select' | 'dungeon' | 'combat' | 'event' | 'treasure' | 'victory' | 'defeat' | 'summary';

export interface GameState {
  phase: GamePhase;
  team: Character[];
  currentRoom: { x: number; y: number };
  rooms: Room[][];
  encounterCount: number;
  combatCount: number;
  bossScaling: number;
  currentEnemies: Monster[];
  currentEnemy?: Monster;
  currentEvent?: GameEvent;
  currentTreasure?: TreasureLegacy;
  combatLog: string[];
  combatHistory: CombatHistoryEntry[];
  combatTurn: number;
  turnOrder: (Character | Monster)[];
  currentTurnIndex: number;
  history: HistoryEntry[];
  pendingTreasures?: PendingTreasureData[];
  pendingSkill?: Skill;
  selectingTarget?: 'ally' | 'enemy' | null;
  selectedEnemyIndex?: number;
  showInventory?: boolean;
  showPauseMenu?: boolean;
  inventoryCharacterIndex?: number;
  // Système de niveaux
  dungeonLevel: number; // Niveau actuel du donjon (1, 2, 3...)
  roomsPerLevel: number; // Nombre de salles avant le boss pour ce niveau
  previousBossId?: string; // ID du dernier boss vaincu (pour éviter les répétitions)
  monsterScaling: number; // % d'augmentation des stats des monstres
  bossScalingMultiplier: number; // % d'augmentation des stats du boss
}

export interface BaseStats {
  attack: number;
  magicAttack: number;
  defense: number;
  magicDefense: number;
  speed: number;
}

export interface StatModification {
  source: string;
  value: number;
  type: 'buff' | 'debuff' | 'item' | 'event';
}

export interface PendingTreasureData {
  treasureId: string;
  treasureName: string;
  treasureIcon: string;
  treasureRarity: string;
  treasureDescription: string;
  assignedToId: string;
  assignedToName: string;
  effects: string[];
}

// ============================================
// COMBAT
// ============================================
export interface CombatAction {
  type: 'attack' | 'skill' | 'defend';
  source: Character | Monster;
  target: Character | Monster;
  skill?: Skill;
  damage?: number;
}

// ============================================
// HISTORIQUE DES PARTIES
// ============================================
export interface GameHistory {
  id: string;
  date: string;
  version: string;
  result: 'victory' | 'defeat' | 'abandoned';
  roomsExplored: number;
  dungeonLevel: number; // Niveau atteint dans le donjon
  team: {
    name: string;
    class: string;
    portrait: string;
    finalHp: number;
    maxHp: number;
    // Statistiques de combat
    attack: number;
    magicAttack: number;
    defense: number;
    magicDefense: number;
    speed: number;
    // Stats de performance
    damageDealt: number;
    damageTaken: number;
    healingDone: number;
    monstersKilled: number;
    // Monstre le plus puissant vaincu
    strongestMonsterKilled?: {
      name: string;
      portrait: string;
      attack: number;
      defense: number;
      isBoss: boolean;
    };
    // Objets portés
    inventory: {
      name: string;
      icon: string;
      rarity: string;
    }[];
  }[];
  bossDefeated?: string;
  duration: number;
}
