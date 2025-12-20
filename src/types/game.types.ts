// =============================================================================
// TYPES ETERNALYS - SYSTÈME D&D 5e ÉTENDU
// =============================================================================
// Système 100% basé sur les caractéristiques D&D
// Niveaux personnages: 1-100 | CR monstres: 1-100 | Niveaux donjon: 50
// =============================================================================

// =============================================================================
// SYSTÈME D&D - CARACTÉRISTIQUES
// =============================================================================

/**
 * Les 6 caractéristiques D&D
 */
export interface AbilityScores {
  strength: number;     // Force - attaques mêlée, dégâts physiques, jets de sauvegarde
  dexterity: number;    // Dextérité - CA, initiative, attaques à distance, finesse
  constitution: number; // Constitution - points de vie, concentration
  intelligence: number; // Intelligence - sorts arcanes (Mage, Nécromancien)
  wisdom: number;       // Sagesse - perception, sorts divins (Clerc, Druide)
  charisma: number;     // Charisme - sorts (Ensorceleur, Occultiste, Barde, Paladin)
}

/**
 * Calcul du modificateur D&D - FONCTION CENTRALE
 */
export function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

// =============================================================================
// TYPES DE DÉGÂTS D&D
// =============================================================================

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
  | 'force'         // Force (magique pure)
  | 'psychic'       // Psychique
  | 'thunder';      // Tonnerre

// =============================================================================
// TYPES DE CRÉATURES D&D
// =============================================================================

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

export type CreatureSize = 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan';

// =============================================================================
// CONDITIONS D&D
// =============================================================================

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

// =============================================================================
// SYSTÈME DE TALENTS
// =============================================================================

export interface CharacterTalent {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: number; // Niveau où le talent est débloqué (5, 10, 15...)
  branch: string; // Branche de spécialisation
  effects: TalentEffect[];
}

export interface TalentEffect {
  type: 'ability_bonus' | 'skill_unlock' | 'passive' | 'resistance' | 'hp_bonus' | 'damage_bonus';
  ability?: keyof AbilityScores;
  value?: number;
  damageType?: DamageType;
  skillId?: string;
  passiveType?: 'critical' | 'lifesteal' | 'thorns' | 'regeneration' | 'evasion';
}

// =============================================================================
// PERSONNAGES
// =============================================================================

export interface Character {
  id: string;
  name: string;
  class: string;
  portrait: string;
  
  // === NIVEAU ET PROGRESSION ===
  level: number;          // Niveau actuel (1-100)
  xp?: number;            // XP actuel vers le prochain niveau
  totalXP?: number;       // XP total gagné
  
  // === POINTS DE VIE ===
  hp: number;             // PV actuels
  maxHp: number;          // PV maximum
  tempHp?: number;        // Points de vie temporaires
  temporaryHp?: number;   // Alias pour compatibilité
  
  // === CARACTÉRISTIQUES D&D (BASE DU SYSTÈME) ===
  abilities: AbilityScores;
  
  // === STATS DÉRIVÉES (calculées depuis abilities) ===
  armorClass: number;     // CA = 10 + mod(DEX) + armure
  speed: number;          // Vitesse de déplacement en pieds
  proficiencyBonus: number; // Bonus de maîtrise (basé sur niveau)
  initiative?: number;    // mod(DEX) + bonus
  
  // === MAÎTRISES ===
  savingThrowProficiencies: (keyof AbilityScores)[]; // Jets de sauvegarde maîtrisés
  
  // === COMPÉTENCES ===
  skills: Skill[];
  
  // === TALENTS CHOISIS ===
  talents?: CharacterTalent[];
  pendingTalentChoice?: boolean; // true si le personnage doit choisir un talent
  
  // === BUFFS/CONDITIONS ===
  buffs?: ActiveBuff[];
  conditions?: Condition[];
  
  // === RÉSISTANCES ===
  resistances?: DamageType[];
  immunities?: DamageType[];
  vulnerabilities?: DamageType[];
  
  // === INVENTAIRE ET ÉQUIPEMENT ===
  inventory?: InventoryItem[];
  equipment?: CharacterEquipment;
  
  // === EFFETS PASSIFS (objets/talents) ===
  passiveEffects?: {
    lifesteal?: number;
    critical?: number;
    thorns?: number;
    regeneration?: number;
    evasion?: number;
    damageReduction?: Record<string, number>;
  };
  
  // === STATISTIQUES DE PARTIE ===
  stats?: CharacterStats;
  
  // === COMPATIBILITÉ (sera supprimé progressivement) ===
  attack?: number;        // DEPRECATED - utiliser getAttackBonus()
  magicAttack?: number;   // DEPRECATED - utiliser getSpellAttackBonus()
  defense?: number;       // DEPRECATED - utiliser armorClass
  magicDefense?: number;  // DEPRECATED
  baseAttack?: number;
  baseMagicAttack?: number;
  baseDefense?: number;
  baseMagicDefense?: number;
  baseSpeed?: number;
}

// =============================================================================
// BUFFS ET EFFETS
// =============================================================================

export interface ActiveBuff {
  id: string;
  name: string;
  type: 'ability' | 'ac' | 'damage' | 'healing' | 'speed' | 'resistance' | 'advantage' | 'regen' | 'poison' | 'attack' | 'magicAttack' | 'defense' | 'magicDefense' | 'damage_reflect';
  abilityAffected?: keyof AbilityScores;
  value: number;
  turnsRemaining: number;
  ownerId: string;
  icon: string;
  isApplied?: boolean;
}

// =============================================================================
// INVENTAIRE
// =============================================================================

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  rarity: string;
  description: string;
  obtainedAt: number;
}

// =============================================================================
// ÉQUIPEMENT (Style Pathfinder/BG3)
// =============================================================================

export type EquipmentSlotType = 
  | 'head' | 'armor' | 'cloak' | 'gloves' | 'bracers' | 'belt' | 'boots'
  | 'necklace' | 'ring1' | 'ring2' | 'mainHand' | 'offHand' | 'ranged'
  | 'trinket1' | 'trinket2' | 'trinket3' | 'trinket4' | 'trinket5'
  | 'consumable1' | 'consumable2' | 'consumable3';

export type WeaponCategory = 'simple_melee' | 'martial_melee' | 'simple_ranged' | 'martial_ranged' | 'shield' | 'focus';
export type ArmorCategory = 'light' | 'medium' | 'heavy' | 'shield' | 'clothing';

export interface Equipment {
  id: string;
  name: string;
  icon: string;
  slotType: EquipmentSlotType;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  description: string;
  
  // Bonus aux caractéristiques (nouveau système)
  bonuses?: {
    strength?: number;
    dexterity?: number;
    constitution?: number;
    intelligence?: number;
    wisdom?: number;
    charisma?: number;
    armorClass?: number;
    speed?: number;
    maxHp?: number;
    // DEPRECATED - pour compatibilité
    attack?: number;
    magicAttack?: number;
    defense?: number;
    magicDefense?: number;
  };
  
  // Pour les armes
  weaponCategory?: WeaponCategory;
  damage?: string;        // Notation de dé: "1d8", "2d6+3"
  damageType?: DamageType;
  twoHanded?: boolean;
  finesse?: boolean;      // Peut utiliser DEX au lieu de FOR
  
  // Pour les armures
  armorCategory?: ArmorCategory;
  baseAC?: number;
  maxDexBonus?: number;   // Limite de bonus DEX (null = pas de limite)
  stealthDisadvantage?: boolean;
  
  // Effets spéciaux
  effects?: EquipmentEffect[];
  
  // Prérequis
  requirements?: {
    strength?: number;
    classes?: string[];
    level?: number;
  };
  
  value?: number;
}

export interface EquipmentEffect {
  type: 'resistance' | 'immunity' | 'skill' | 'passive' | 'onHit';
  damageType?: DamageType;
  skillGranted?: Skill;
  passiveBonus?: {
    type: 'critical' | 'lifesteal' | 'thorns' | 'regeneration' | 'evasion' | 'initiative';
    value: number;
  };
}

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
  trinket1?: Equipment;
  trinket2?: Equipment;
  trinket3?: Equipment;
  trinket4?: Equipment;
  trinket5?: Equipment;
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

// =============================================================================
// COMPÉTENCES
// =============================================================================

export interface Skill {
  id: string;
  name: string;
  description?: string;
  type: 'attack' | 'heal' | 'buff' | 'debuff' | 'damage';
  
  // === DÉGÂTS/SOINS ===
  damage: number;         // Valeur de base (positif = dégâts, négatif = soins)
  damageType?: DamageType | 'physical' | 'magical' | 'holy';
  damageDice?: string;    // Notation de dé: "2d6", "1d8+3"
  
  // === CIBLAGE ===
  targetType?: 'enemy' | 'ally' | 'self' | 'all_allies' | 'all_enemies';
  areaOfEffect?: { type: 'cone' | 'sphere' | 'line' | 'cube'; size: number };
  
  // === JETS D'ATTAQUE ===
  requiresAttackRoll?: boolean;
  isSpellAttack?: boolean; // Utilise caractéristique de lancement de sorts
  grantAdvantage?: boolean;
  
  // === JETS DE SAUVEGARDE ===
  savingThrow?: { ability: keyof AbilityScores; dc: number };
  
  // === COOLDOWN ===
  cooldown?: number;
  currentCooldown?: number;
  
  // === EFFETS ADDITIONNELS ===
  effects?: SkillEffect[];
  buffStats?: { stat: 'attack' | 'magicAttack' | 'defense' | 'magicDefense' | 'speed'; value: number; turns: number };
  debuffStats?: { stat: 'attack' | 'magicAttack' | 'defense' | 'magicDefense' | 'speed'; value: number; turns: number };
  healOverTime?: { value: number; turns: number };
  poison?: { damage: number; turns: number };
  lifesteal?: number;
  damageReflect?: number;
  bonusVsDemon?: number;
  bonusVsUndead?: number;
}

export interface SkillEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'lifesteal' | 'reflect' | 'regen' | 'poison' | 'bonus_vs_type';
  value: number;
  duration?: number;
  targetType?: string;
}

// =============================================================================
// MONSTRES
// =============================================================================

export interface Monster {
  id: string;
  name: string;
  portrait: string;
  description?: string;
  
  // === INFOS D&D ===
  creatureType: CreatureType;
  size: CreatureSize;
  alignment?: string;
  
  // === CR ET XP (nouvelle échelle 1-100) ===
  challengeRating: number;  // CR 1-100
  xpReward: number;         // XP donné à la victoire
  
  // === POINTS DE VIE ===
  hp: number;
  maxHp: number;
  
  // === CARACTÉRISTIQUES D&D ===
  abilities: AbilityScores;
  armorClass: number;
  speed: number;
  
  // === RÉSISTANCES ===
  resistances?: DamageType[];
  immunities?: DamageType[];
  vulnerabilities?: DamageType[];
  conditionImmunities?: Condition[];
  
  // === COMPÉTENCES ===
  skills?: MonsterSkill[];
  
  // === BOSS ===
  isBoss: boolean;
  isLegendary?: boolean;
  isHostileNpc?: boolean; // Personnages hostiles nommés (Strahd, Zariel...)
  
  // Actions légendaires
  legendaryActions?: LegendaryAction[];
  legendaryActionsPerTurn?: number;
  legendaryActionsRemaining?: number;
  
  // Ultime
  ultimateSkill?: MonsterSkill;
  ultimateUsed?: boolean;
  ultimateTurnTrigger?: number;
  
  // Sbires
  minions?: string[];
  
  // === BUFFS ===
  buffs?: ActiveBuff[];
  
  // === COMPATIBILITÉ (DEPRECATED) ===
  attack?: number;
  magicAttack?: number;
  defense?: number;
  magicDefense?: number;
  baseAttack?: number;
  baseMagicAttack?: number;
  baseDefense?: number;
  baseMagicDefense?: number;
  baseSpeed?: number;
  monsterType?: 'demon' | 'undead' | 'beast' | 'humanoid' | 'elemental' | 'dragon';
}

export interface LegendaryAction {
  id: string;
  name: string;
  cost: number;
  damage?: number;
  damageType?: DamageType;
  description: string;
  effect?: {
    type: 'damage' | 'heal' | 'buff_self' | 'debuff_target' | 'move' | 'special' | 'lifesteal';
    value?: number;
    stat?: string;
    turns?: number;
    condition?: Condition;
  };
}

export interface MonsterSkill {
  id: string;
  name: string;
  description: string;
  type: 'attack' | 'special' | 'buff' | 'debuff' | 'multiattack';
  
  // === DÉGÂTS ===
  damage: number;
  damageType: DamageType | 'physical' | 'magical';
  damageDice?: string;
  
  // === MULTIATTAQUE ===
  attackCount?: number;
  
  // === JETS ===
  requiresAttackRoll?: boolean;
  isSpellAttack?: boolean;
  savingThrow?: { ability: keyof AbilityScores; dc: number };
  areaOfEffect?: boolean;
  
  // === RECHARGE ===
  recharge?: { min: number; max?: number };
  isRecharged?: boolean;
  cooldown?: number;
  currentCooldown?: number;
  
  // === EFFETS ===
  effect?: {
    type: 'damage' | 'heal' | 'buff_self' | 'debuff_target' | 'lifesteal' | 'grapple' | 'frighten' | 'poison'
      | 'debuff_attack' | 'debuff_defense' | 'debuff_speed' | 'debuff_magic_attack' | 'debuff_magic_defense';
    value?: number;
    stat?: string;
    turns?: number;
    condition?: Condition;
  };
}

// =============================================================================
// ÉVÉNEMENTS
// =============================================================================

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  type: 'positive' | 'negative';
  effect: EventEffect;
}

export interface EventEffect {
  type: 'heal' | 'damage' | 'buff_attack' | 'buff_magic_attack' | 'buff_defense' | 'debuff_attack' | 'debuff_magic_attack' | 'debuff_defense' | 'xp_bonus';
  value: number;
  target: 'all' | 'random' | 'weakest' | 'strongest';
}

// =============================================================================
// PLATEAU DE JEU
// =============================================================================

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
    type: 'heal_all' | 'buff_permanent' | 'revive' | 'xp_bonus';
    value: number;
  };
}

// =============================================================================
// HISTORIQUE
// =============================================================================

export interface HistoryEntry {
  turn: number;
  type: 'combat' | 'event' | 'treasure' | 'boss' | 'level_up';
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
  diceRoll?: { roll: number; modifier: number; total: number; advantage?: boolean };
}

// =============================================================================
// ÉTAT DU JEU
// =============================================================================

export type GamePhase = 'welcome' | 'menu' | 'character_select' | 'dungeon' | 'combat' | 'event' | 'treasure' | 'level_up' | 'victory' | 'defeat' | 'summary';

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
  
  // === SYSTÈME DE DONJON (50 niveaux) ===
  dungeonLevel: number;       // Niveau actuel du donjon (1-50)
  roomsPerLevel: number;      // Salles avant le boss
  roomsExploredThisLevel: number; // Salles explorées dans ce niveau
  previousBossId?: string;
  
  // === SCALING (pour compatibilité) ===
  monsterScaling: number;
  bossScalingMultiplier: number;
  
  // === LEVEL UP EN ATTENTE ===
  pendingLevelUps?: string[]; // IDs des personnages qui doivent level up
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

// =============================================================================
// COMBAT
// =============================================================================

export interface CombatAction {
  type: 'attack' | 'skill' | 'defend';
  source: Character | Monster;
  target: Character | Monster;
  skill?: Skill;
  damage?: number;
}

export interface AttackRollResult {
  roll: number;           // Résultat du d20
  modifier: number;       // Modificateur total
  total: number;          // Roll + modifier
  isCritical: boolean;    // Natural 20
  isCriticalMiss: boolean; // Natural 1
  hasAdvantage: boolean;
  hasDisadvantage: boolean;
  secondRoll?: number;    // Pour avantage/désavantage
}

export interface SavingThrowResult {
  success: boolean;
  roll: number;
  total: number;
  dc: number;
  ability: keyof AbilityScores;
}

// =============================================================================
// HISTORIQUE DES PARTIES
// =============================================================================

export interface GameHistory {
  id: string;
  date: string;
  version: string;
  result: 'victory' | 'defeat' | 'abandoned';
  roomsExplored: number;
  dungeonLevel: number;
  team: {
    name: string;
    class: string;
    portrait: string;
    finalHp: number;
    maxHp: number;
    level: number;
    totalXP: number;
    damageDealt: number;
    damageTaken: number;
    healingDone: number;
    monstersKilled: number;
    strongestMonsterKilled?: {
      name: string;
      portrait: string;
      challengeRating: number;
      isBoss: boolean;
    };
    inventory: {
      name: string;
      icon: string;
      rarity: string;
    }[];
  }[];
  bossDefeated?: string;
  duration: number;
}

// =============================================================================
// STATS DE BASE (pour compatibilité, sera supprimé)
// =============================================================================

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
