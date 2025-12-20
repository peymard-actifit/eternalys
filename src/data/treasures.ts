import { Character, EquipmentSlotType } from '../types/game.types';

export interface Treasure {
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  effect: TreasureEffect;
  // Type d'emplacement d'équipement pour ce trésor
  equipmentSlot?: EquipmentSlotType;
}

export interface TreasureEffect {
  type: 'stat_boost' | 'heal' | 'skill' | 'buff' | 'resurrect' | 'passive';
  stat?: 'hp' | 'maxHp' | 'attack' | 'magicAttack' | 'defense' | 'magicDefense' | 'speed';
  value?: number;
  percentage?: number;
  skillName?: string;
  skillDamage?: number;
  skillType?: 'damage' | 'heal';
  skillDamageType?: 'physical' | 'magical' | 'holy' | 'fire' | 'cold' | 'lightning' | 'thunder' | 'acid' | 'poison' | 'necrotic' | 'radiant' | 'force' | 'psychic' | 'bludgeoning' | 'piercing' | 'slashing';
  duration?: 'permanent' | 'combat';
  // Effets passifs
  passive?: {
    type: 'initiative' | 'stealth' | 'evasion' | 'critical' | 'lifesteal' | 'thorns' | 'regeneration' | 'resistance';
    value: number;
    damageType?: 'fire' | 'cold' | 'lightning' | 'acid' | 'poison' | 'necrotic' | 'radiant' | 'force' | 'psychic' | 'thunder';
  };
}

export interface ObtainedTreasure {
  treasure: Treasure;
  assignedTo: Character;
  timestamp: number;
}

// ============================================
// ÉQUILIBRAGE v2.2.0 - NORMES PAR RARETÉ
// ============================================
// COMMUN : Stats +2-3, Soins 15-20 PV, Pas de sorts
// RARE : Stats +4-6, Soins 25-35 PV, Sorts 18-25 dégâts, Passifs 8-12%
// ÉPIQUE : Stats +8-10, Soins 45-60 PV, Sorts 30-40 dégâts, Passifs 15-20%
// LÉGENDAIRE : Stats +12-15, Soins 80-100 PV, Sorts 50-65 dégâts, Passifs 25-35%
// ============================================

// ============================================
// TRÉSORS COMMUNS (+2-3 stats, 15-20 PV soins)
// ============================================
const commonTreasures: Treasure[] = [
  // Soins
  {
    id: 'potion_sante',
    name: 'Potion de Santé',
    icon: '🧪',
    rarity: 'common',
    description: 'Restaure 18 PV immédiatement',
    effect: { type: 'heal', value: 18 },
    equipmentSlot: 'consumable1'
  },
  {
    id: 'herbes_guerison',
    name: 'Herbes de Guérison',
    icon: '🌿',
    rarity: 'common',
    description: 'Restaure 15 PV immédiatement',
    effect: { type: 'heal', value: 15 },
    equipmentSlot: 'consumable2'
  },
  {
    id: 'fiole_energie',
    name: 'Fiole d\'Énergie',
    icon: '⚗️',
    rarity: 'common',
    description: 'Restaure 20 PV immédiatement',
    effect: { type: 'heal', value: 20 },
    equipmentSlot: 'consumable3'
  },
  // Stats physiques
  {
    id: 'pierre_force',
    name: 'Pierre de Force',
    icon: '💎',
    rarity: 'common',
    description: '+2 Attaque permanente',
    effect: { type: 'stat_boost', stat: 'attack', value: 2, duration: 'permanent' },
    equipmentSlot: 'trinket1'
  },
  {
    id: 'amulette_protection',
    name: 'Amulette de Protection',
    icon: '📿',
    rarity: 'common',
    description: '+2 Défense permanente',
    effect: { type: 'stat_boost', stat: 'defense', value: 2, duration: 'permanent' },
    equipmentSlot: 'necklace'
  },
  {
    id: 'bottes_rapidite',
    name: 'Bottes de Rapidité',
    icon: '👢',
    rarity: 'common',
    description: '+3 Vitesse permanente',
    effect: { type: 'stat_boost', stat: 'speed', value: 3, duration: 'permanent' },
    equipmentSlot: 'boots'
  },
  // Stats magiques
  {
    id: 'cristal_mana_petit',
    name: 'Petit Cristal de Mana',
    icon: '🔮',
    rarity: 'common',
    description: '+2 Attaque Magique permanente',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 2, duration: 'permanent' },
    equipmentSlot: 'trinket2'
  },
  {
    id: 'talisman_arcane',
    name: 'Talisman Arcanique',
    icon: '✨',
    rarity: 'common',
    description: '+2 Résistance Magique permanente',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 2, duration: 'permanent' },
    equipmentSlot: 'trinket3'
  },
  // PV
  {
    id: 'baie_vitalite',
    name: 'Baie de Vitalité',
    icon: '🍒',
    rarity: 'common',
    description: '+8 PV max permanents',
    effect: { type: 'stat_boost', stat: 'maxHp', value: 8, duration: 'permanent' },
    equipmentSlot: 'consumable1'
  }
];

// ============================================
// TRÉSORS RARES (+4-6 stats, 25-35 PV soins, 18-25 dégâts sorts)
// ============================================
const rareTreasures: Treasure[] = [
  // Soins
  {
    id: 'potion_guerison_grande',
    name: 'Potion de Guérison Supérieure',
    icon: '⚗️',
    rarity: 'rare',
    description: 'Restaure 30 PV immédiatement',
    effect: { type: 'heal', value: 30 },
    equipmentSlot: 'consumable1'
  },
  // Stats physiques
  {
    id: 'gantelet_puissance',
    name: 'Gantelet de Puissance',
    icon: '🧤',
    rarity: 'rare',
    description: '+5 Attaque permanente',
    effect: { type: 'stat_boost', stat: 'attack', value: 5, duration: 'permanent' },
    equipmentSlot: 'gloves'
  },
  {
    id: 'bouclier_ancestral',
    name: 'Bouclier Ancestral',
    icon: '🛡️',
    rarity: 'rare',
    description: '+5 Défense permanente',
    effect: { type: 'stat_boost', stat: 'defense', value: 5, duration: 'permanent' },
    equipmentSlot: 'offHand'
  },
  {
    id: 'cape_vent',
    name: 'Cape du Vent',
    icon: '🧣',
    rarity: 'rare',
    description: '+5 Vitesse permanente',
    effect: { type: 'stat_boost', stat: 'speed', value: 5, duration: 'permanent' },
    equipmentSlot: 'cloak'
  },
  // Stats magiques
  {
    id: 'cristal_mana_moyen',
    name: 'Cristal de Mana',
    icon: '💠',
    rarity: 'rare',
    description: '+5 Attaque Magique permanente',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 5, duration: 'permanent' },
    equipmentSlot: 'trinket1'
  },
  {
    id: 'robe_archimage_mineure',
    name: 'Robe de Mage',
    icon: '🧙',
    rarity: 'rare',
    description: '+5 Résistance Magique permanente',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 5, duration: 'permanent' },
    equipmentSlot: 'armor'
  },
  // PV
  {
    id: 'elixir_vitalite',
    name: 'Élixir de Vitalité',
    icon: '💊',
    rarity: 'rare',
    description: '+15 PV max permanents',
    effect: { type: 'stat_boost', stat: 'maxHp', value: 15, duration: 'permanent' },
    equipmentSlot: 'consumable2'
  },
  // Compétences (18-25 dégâts)
  {
    id: 'grimoire_flammes',
    name: 'Grimoire des Flammes',
    icon: '📕',
    rarity: 'rare',
    description: 'Apprend "Boule de Feu" (20 dégâts de feu)',
    effect: { type: 'skill', skillName: 'Boule de Feu', skillDamage: 20, skillType: 'damage', skillDamageType: 'fire' },
    equipmentSlot: 'offHand'
  },
  {
    id: 'anneau_givre',
    name: 'Anneau de Givre',
    icon: '❄️',
    rarity: 'rare',
    description: 'Apprend "Souffle Glacé" (18 dégâts de froid)',
    effect: { type: 'skill', skillName: 'Souffle Glacé', skillDamage: 18, skillType: 'damage', skillDamageType: 'cold' },
    equipmentSlot: 'ring1'
  },
  {
    id: 'pendentif_guerison',
    name: 'Pendentif de Guérison',
    icon: '💚',
    rarity: 'rare',
    description: 'Apprend "Soin Léger" (22 PV)',
    effect: { type: 'skill', skillName: 'Soin Léger', skillDamage: 22, skillType: 'heal' },
    equipmentSlot: 'necklace'
  },
  {
    id: 'perle_pouvoir',
    name: 'Perle de Pouvoir',
    icon: '🔮',
    rarity: 'rare',
    description: 'Apprend "Rayon de Givre" (18 dégâts de froid)',
    effect: { type: 'skill', skillName: 'Rayon de Givre', skillDamage: 18, skillType: 'damage', skillDamageType: 'cold' },
    equipmentSlot: 'trinket2'
  }
];

// ============================================
// TRÉSORS ÉPIQUES (+8-10 stats, 45-60 PV soins, 30-40 dégâts sorts)
// ============================================
const epicTreasures: Treasure[] = [
  // Soins
  {
    id: 'potion_guerison_supreme',
    name: 'Potion de Guérison Suprême',
    icon: '💉',
    rarity: 'epic',
    description: 'Restaure 50 PV immédiatement',
    effect: { type: 'heal', value: 50 },
    equipmentSlot: 'consumable1'
  },
  // Stats physiques
  {
    id: 'epee_lumiere',
    name: 'Épée de Lumière',
    icon: '⚔️',
    rarity: 'epic',
    description: '+9 Attaque permanente',
    effect: { type: 'stat_boost', stat: 'attack', value: 9, duration: 'permanent' },
    equipmentSlot: 'mainHand'
  },
  {
    id: 'armure_titan',
    name: 'Armure du Titan',
    icon: '🦾',
    rarity: 'epic',
    description: '+9 Défense permanente',
    effect: { type: 'stat_boost', stat: 'defense', value: 9, duration: 'permanent' },
    equipmentSlot: 'armor'
  },
  {
    id: 'bottes_rapidite_epic',
    name: 'Bottes de Célérité',
    icon: '👟',
    rarity: 'epic',
    description: '+8 Vitesse permanente',
    effect: { type: 'stat_boost', stat: 'speed', value: 8, duration: 'permanent' },
    equipmentSlot: 'boots'
  },
  // Stats magiques
  {
    id: 'baton_archimage',
    name: 'Bâton de l\'Archimage',
    icon: '🪄',
    rarity: 'epic',
    description: '+10 Attaque Magique permanente',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 10, duration: 'permanent' },
    equipmentSlot: 'mainHand'
  },
  {
    id: 'cape_ombre',
    name: 'Cape des Ombres',
    icon: '🌑',
    rarity: 'epic',
    description: '+9 Résistance Magique permanente',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 9, duration: 'permanent' },
    equipmentSlot: 'cloak'
  },
  // PV + bonus
  {
    id: 'coeur_dragon',
    name: 'Cœur de Dragon',
    icon: '❤️‍🔥',
    rarity: 'epic',
    description: '+25 PV max et +4 Attaque permanents',
    effect: { type: 'buff', stat: 'maxHp', value: 25 },
    equipmentSlot: 'trinket1'
  },
  // Résurrection
  {
    id: 'anneau_immortel',
    name: 'Anneau de l\'Immortel',
    icon: '💍',
    rarity: 'epic',
    description: 'Ressuscite un allié mort avec 50% PV',
    effect: { type: 'resurrect', percentage: 50 },
    equipmentSlot: 'ring1'
  },
  // Compétences (30-40 dégâts)
  {
    id: 'orbe_foudre',
    name: 'Orbe de Foudre',
    icon: '⚡',
    rarity: 'epic',
    description: 'Apprend "Éclair Dévastateur" (35 dégâts de foudre)',
    effect: { type: 'skill', skillName: 'Éclair Dévastateur', skillDamage: 35, skillType: 'damage', skillDamageType: 'lightning' },
    equipmentSlot: 'trinket2'
  },
  {
    id: 'grimoire_necromancie',
    name: 'Grimoire de Nécromancie',
    icon: '📓',
    rarity: 'epic',
    description: 'Apprend "Drain de Vie" (32 dégâts nécrotiques)',
    effect: { type: 'skill', skillName: 'Drain de Vie', skillDamage: 32, skillType: 'damage', skillDamageType: 'necrotic' },
    equipmentSlot: 'offHand'
  },
  {
    id: 'baguette_boule_feu',
    name: 'Baguette de Boule de Feu',
    icon: '🔥',
    rarity: 'epic',
    description: 'Apprend "Grande Boule de Feu" (38 dégâts de feu)',
    effect: { type: 'skill', skillName: 'Grande Boule de Feu', skillDamage: 38, skillType: 'damage', skillDamageType: 'fire' },
    equipmentSlot: 'mainHand'
  },
  {
    id: 'baton_guerison',
    name: 'Bâton de Guérison',
    icon: '🏥',
    rarity: 'epic',
    description: 'Apprend "Guérison Majeure" (45 PV)',
    effect: { type: 'skill', skillName: 'Guérison Majeure', skillDamage: 45, skillType: 'heal' },
    equipmentSlot: 'mainHand'
  }
];

// ============================================
// TRÉSORS LÉGENDAIRES (+12-15 stats, 80-100 PV soins, 50-65 dégâts sorts)
// ============================================
const legendaryTreasures: Treasure[] = [
  // Soins
  {
    id: 'potion_guerison_legendaire',
    name: 'Potion de Guérison Légendaire',
    icon: '🧪',
    rarity: 'legendary',
    description: 'Restaure 100 PV immédiatement',
    effect: { type: 'heal', value: 100 },
    equipmentSlot: 'consumable1'
  },
  // Stats physiques
  {
    id: 'epee_vorpale',
    name: 'Épée Vorpale',
    icon: '⚔️',
    rarity: 'legendary',
    description: '+14 Attaque permanente',
    effect: { type: 'stat_boost', stat: 'attack', value: 14, duration: 'permanent' },
    equipmentSlot: 'mainHand'
  },
  {
    id: 'armure_invincibilite',
    name: 'Armure d\'Invincibilité',
    icon: '🛡️',
    rarity: 'legendary',
    description: '+14 Défense permanente',
    effect: { type: 'stat_boost', stat: 'defense', value: 14, duration: 'permanent' },
    equipmentSlot: 'armor'
  },
  // Stats magiques
  {
    id: 'tome_arcane_supreme',
    name: 'Tome Arcanique Suprême',
    icon: '📖',
    rarity: 'legendary',
    description: '+15 Attaque Magique permanente',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 15, duration: 'permanent' },
    equipmentSlot: 'offHand'
  },
  {
    id: 'robe_archimage',
    name: 'Robe de l\'Archimage',
    icon: '🧙',
    rarity: 'legendary',
    description: '+14 Résistance Magique permanente',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 14, duration: 'permanent' },
    equipmentSlot: 'armor'
  },
  // Multi-stats
  {
    id: 'couronne_roi',
    name: 'Couronne du Roi Déchu',
    icon: '👑',
    rarity: 'legendary',
    description: '+35 PV max, +8 Attaque, +6 Défense permanents',
    effect: { type: 'buff', stat: 'maxHp', value: 35 },
    equipmentSlot: 'head'
  },
  {
    id: 'armure_divine',
    name: 'Armure Divine',
    icon: '⚜️',
    rarity: 'legendary',
    description: '+30 PV max, +10 Défense, +8 Rés. Magique',
    effect: { type: 'buff', stat: 'defense', value: 10 },
    equipmentSlot: 'armor'
  },
  {
    id: 'orbe_cosmos',
    name: 'Orbe du Cosmos',
    icon: '🌌',
    rarity: 'legendary',
    description: '+12 Attaque Magique et +10 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 12, duration: 'permanent' },
    equipmentSlot: 'trinket1'
  },
  // Résurrection
  {
    id: 'larme_phenix',
    name: 'Larme du Phénix',
    icon: '🔥',
    rarity: 'legendary',
    description: 'Ressuscite un allié avec 100% PV',
    effect: { type: 'resurrect', percentage: 100 },
    equipmentSlot: 'trinket2'
  },
  // Compétences (50-65 dégâts)
  {
    id: 'sceptre_eternel',
    name: 'Sceptre Éternel',
    icon: '🏆',
    rarity: 'legendary',
    description: 'Apprend "Jugement Divin" (55 dégâts radiants)',
    effect: { type: 'skill', skillName: 'Jugement Divin', skillDamage: 55, skillType: 'damage', skillDamageType: 'radiant' },
    equipmentSlot: 'mainHand'
  },
  {
    id: 'sphere_annihilation',
    name: 'Sphère d\'Annihilation',
    icon: '⚫',
    rarity: 'legendary',
    description: 'Apprend "Désintégration" (60 dégâts de force)',
    effect: { type: 'skill', skillName: 'Désintégration', skillDamage: 60, skillType: 'damage', skillDamageType: 'force' },
    equipmentSlot: 'trinket3'
  },
  {
    id: 'baguette_rayon_mort',
    name: 'Baguette du Rayon de la Mort',
    icon: '💀',
    rarity: 'legendary',
    description: 'Apprend "Rayon de la Mort" (58 dégâts nécrotiques)',
    effect: { type: 'skill', skillName: 'Rayon de la Mort', skillDamage: 58, skillType: 'damage', skillDamageType: 'necrotic' },
    equipmentSlot: 'mainHand'
  }
];

// ============================================
// OBJETS D&D - COMMUNS
// ============================================
const dndCommonItems: Treasure[] = [
  {
    id: 'potion_guerison_dnd',
    name: 'Potion de Guérison',
    icon: '🧪',
    rarity: 'common',
    description: 'Restaure 2d4+2 (7) PV',
    effect: { type: 'heal', value: 17 },
    equipmentSlot: 'consumable1'
  },
  {
    id: 'dague_argent',
    name: 'Dague en Argent',
    icon: '🗡️',
    rarity: 'common',
    description: '+2 Attaque, efficace contre lycanthropes',
    effect: { type: 'stat_boost', stat: 'attack', value: 2, duration: 'permanent' },
    equipmentSlot: 'mainHand'
  },
  {
    id: 'symbole_sacre',
    name: 'Symbole Sacré',
    icon: '✝️',
    rarity: 'common',
    description: '+2 Attaque Magique',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 2, duration: 'permanent' },
    equipmentSlot: 'trinket1'
  },
  {
    id: 'torche_eternelle',
    name: 'Torche Éternelle',
    icon: '🔦',
    rarity: 'common',
    description: '+2 Attaque Magique',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 2, duration: 'permanent' },
    equipmentSlot: 'offHand'
  },
  {
    id: 'corde_escalade',
    name: 'Corde d\'Escalade',
    icon: '🪢',
    rarity: 'common',
    description: '+3 Vitesse permanente',
    effect: { type: 'stat_boost', stat: 'speed', value: 3, duration: 'permanent' },
    equipmentSlot: 'belt'
  }
];

// ============================================
// OBJETS D&D - RARES (Uncommon D&D)
// ============================================
const dndRareItems: Treasure[] = [
  {
    id: 'cape_protection',
    name: 'Cape de Protection',
    icon: '🧥',
    rarity: 'rare',
    description: '+4 Défense et +4 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'defense', value: 4, duration: 'permanent' },
    equipmentSlot: 'cloak'
  },
  {
    id: 'bottes_elfiques',
    name: 'Bottes Elfiques',
    icon: '👢',
    rarity: 'rare',
    description: '+6 Vitesse, déplacement silencieux',
    effect: { type: 'stat_boost', stat: 'speed', value: 6, duration: 'permanent' },
    equipmentSlot: 'boots'
  },
  {
    id: 'gants_ogre',
    name: 'Gants de Pouvoir d\'Ogre',
    icon: '🧤',
    rarity: 'rare',
    description: '+6 Attaque (Force 19)',
    effect: { type: 'stat_boost', stat: 'attack', value: 6, duration: 'permanent' },
    equipmentSlot: 'gloves'
  },
  {
    id: 'bandeau_intellect',
    name: 'Bandeau d\'Intellect',
    icon: '👑',
    rarity: 'rare',
    description: '+6 Attaque Magique (Intelligence 19)',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 6, duration: 'permanent' },
    equipmentSlot: 'head'
  },
  {
    id: 'amulette_sante',
    name: 'Amulette de Santé',
    icon: '💎',
    rarity: 'rare',
    description: '+18 PV max (Constitution 19)',
    effect: { type: 'stat_boost', stat: 'maxHp', value: 18, duration: 'permanent' },
    equipmentSlot: 'necklace'
  },
  {
    id: 'baguette_secrets',
    name: 'Baguette des Secrets',
    icon: '🪄',
    rarity: 'rare',
    description: '+5 Attaque Magique',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 5, duration: 'permanent' },
    equipmentSlot: 'mainHand'
  },
  {
    id: 'armure_mithral',
    name: 'Armure de Mithral',
    icon: '🛡️',
    rarity: 'rare',
    description: '+6 Défense, légère comme l\'air',
    effect: { type: 'stat_boost', stat: 'defense', value: 6, duration: 'permanent' },
    equipmentSlot: 'armor'
  },
  {
    id: 'anneau_saut',
    name: 'Anneau de Saut',
    icon: '💍',
    rarity: 'rare',
    description: '+5 Vitesse permanente',
    effect: { type: 'stat_boost', stat: 'speed', value: 5, duration: 'permanent' },
    equipmentSlot: 'ring1'
  }
];

// ============================================
// OBJETS D&D - ÉPIQUES (Rare D&D)
// ============================================
const dndEpicItems: Treasure[] = [
  {
    id: 'ceinture_geant',
    name: 'Ceinture de Force de Géant des Collines',
    icon: '🥋',
    rarity: 'epic',
    description: '+10 Attaque (Force 21)',
    effect: { type: 'stat_boost', stat: 'attack', value: 10, duration: 'permanent' },
    equipmentSlot: 'belt'
  },
  {
    id: 'cape_deplacement',
    name: 'Cape de Déplacement',
    icon: '🧣',
    rarity: 'epic',
    description: '+9 Défense (désavantage aux attaques ennemies)',
    effect: { type: 'stat_boost', stat: 'defense', value: 9, duration: 'permanent' },
    equipmentSlot: 'cloak'
  },
  {
    id: 'epee_tranchante',
    name: 'Épée Tranchante +2',
    icon: '⚔️',
    rarity: 'epic',
    description: '+9 Attaque, coups critiques améliorés',
    effect: { type: 'stat_boost', stat: 'attack', value: 9, duration: 'permanent' },
    equipmentSlot: 'mainHand'
  },
  {
    id: 'baton_mage',
    name: 'Bâton du Mage',
    icon: '🪄',
    rarity: 'epic',
    description: '+10 Attaque Magique',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 10, duration: 'permanent' },
    equipmentSlot: 'mainHand'
  },
  {
    id: 'armure_nain',
    name: 'Armure de Plates Naine',
    icon: '🦾',
    rarity: 'epic',
    description: '+10 Défense, résistance au poison',
    effect: { type: 'stat_boost', stat: 'defense', value: 10, duration: 'permanent' },
    equipmentSlot: 'armor'
  },
  {
    id: 'anneau_protection',
    name: 'Anneau de Protection +2',
    icon: '💍',
    rarity: 'epic',
    description: '+6 Défense et +6 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'defense', value: 6, duration: 'permanent' },
    equipmentSlot: 'ring1'
  },
  {
    id: 'baguette_eclair',
    name: 'Baguette d\'Éclairs',
    icon: '⚡',
    rarity: 'epic',
    description: 'Apprend "Éclair" (36 dégâts de foudre)',
    effect: { type: 'skill', skillName: 'Éclair', skillDamage: 36, skillType: 'damage', skillDamageType: 'lightning' },
    equipmentSlot: 'mainHand'
  },
  {
    id: 'ioun_force',
    name: 'Pierre Ioun de Force',
    icon: '💠',
    rarity: 'epic',
    description: '+8 Attaque',
    effect: { type: 'stat_boost', stat: 'attack', value: 8, duration: 'permanent' },
    equipmentSlot: 'trinket1'
  },
  {
    id: 'ioun_insight',
    name: 'Pierre Ioun d\'Intuition',
    icon: '🔷',
    rarity: 'epic',
    description: '+8 Attaque Magique',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 8, duration: 'permanent' },
    equipmentSlot: 'trinket2'
  }
];

// ============================================
// OBJETS D&D - LÉGENDAIRES (Very Rare / Legendary D&D)
// ============================================
const dndLegendaryItems: Treasure[] = [
  {
    id: 'ceinture_geant_feu',
    name: 'Ceinture de Force de Géant du Feu',
    icon: '🔥',
    rarity: 'legendary',
    description: '+14 Attaque (Force 25)',
    effect: { type: 'stat_boost', stat: 'attack', value: 14, duration: 'permanent' },
    equipmentSlot: 'belt'
  },
  {
    id: 'ceinture_geant_tempete',
    name: 'Ceinture de Force de Géant des Tempêtes',
    icon: '⛈️',
    rarity: 'legendary',
    description: '+15 Attaque (Force 29)',
    effect: { type: 'stat_boost', stat: 'attack', value: 15, duration: 'permanent' },
    equipmentSlot: 'belt'
  },
  {
    id: 'baton_archimage',
    name: 'Bâton de l\'Archimage',
    icon: '🪄',
    rarity: 'legendary',
    description: '+14 Attaque Magique et +8 Rés. Magique',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 14, duration: 'permanent' },
    equipmentSlot: 'mainHand'
  },
  {
    id: 'anneau_trois_souhaits',
    name: 'Anneau des Trois Souhaits',
    icon: '💫',
    rarity: 'legendary',
    description: '+35 PV max, +8 Attaque, +8 Att. Magique',
    effect: { type: 'buff', stat: 'maxHp', value: 35 },
    equipmentSlot: 'ring1'
  },
  {
    id: 'main_vecna',
    name: 'Main de Vecna',
    icon: '✋',
    rarity: 'legendary',
    description: '+12 Attaque Magique, drain de vie',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 12, duration: 'permanent' },
    equipmentSlot: 'gloves'
  },
  {
    id: 'oeil_vecna',
    name: 'Œil de Vecna',
    icon: '👁️',
    rarity: 'legendary',
    description: '+12 Attaque Magique',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 12, duration: 'permanent' },
    equipmentSlot: 'trinket1'
  },
  {
    id: 'manuel_exercice',
    name: 'Manuel d\'Exercices Physiques',
    icon: '📘',
    rarity: 'legendary',
    description: '+12 PV max et +10 Attaque permanents',
    effect: { type: 'stat_boost', stat: 'attack', value: 10, duration: 'permanent' },
    equipmentSlot: 'offHand'
  },
  {
    id: 'tome_comprehension',
    name: 'Tome de Compréhension',
    icon: '📗',
    rarity: 'legendary',
    description: '+12 Résistance Magique permanente',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 12, duration: 'permanent' },
    equipmentSlot: 'offHand'
  },
  {
    id: 'tome_pensee',
    name: 'Tome de Pensée Claire',
    icon: '📙',
    rarity: 'legendary',
    description: '+13 Attaque Magique permanente',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 13, duration: 'permanent' },
    equipmentSlot: 'offHand'
  }
];

// ============================================
// OBJETS DE RÉSISTANCE MAGIQUE
// ============================================
const magicResistanceItems: Treasure[] = [
  // Communs (+2-3)
  {
    id: 'amulette_protection_mineure',
    name: 'Amulette de Protection Mineure',
    icon: '📿',
    rarity: 'common',
    description: '+3 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 3, duration: 'permanent' },
    equipmentSlot: 'necklace'
  },
  {
    id: 'talisman_gardien',
    name: 'Talisman du Gardien',
    icon: '🔷',
    rarity: 'common',
    description: '+2 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 2, duration: 'permanent' },
    equipmentSlot: 'trinket1'
  },
  {
    id: 'pierre_anti_magie',
    name: 'Pierre Anti-Magie',
    icon: '💎',
    rarity: 'common',
    description: '+3 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 3, duration: 'permanent' },
    equipmentSlot: 'trinket2'
  },
  // Rares (+4-6)
  {
    id: 'manteau_resistance',
    name: 'Manteau de Résistance',
    icon: '🧥',
    rarity: 'rare',
    description: '+6 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 6, duration: 'permanent' },
    equipmentSlot: 'cloak'
  },
  {
    id: 'broche_bouclier',
    name: 'Broche de Bouclier Arcanique',
    icon: '💠',
    rarity: 'rare',
    description: '+5 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 5, duration: 'permanent' },
    equipmentSlot: 'trinket3'
  },
  {
    id: 'anneau_dissipation',
    name: 'Anneau de Dissipation',
    icon: '💍',
    rarity: 'rare',
    description: '+6 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 6, duration: 'permanent' },
    equipmentSlot: 'ring2'
  },
  {
    id: 'cape_mage_rebelle',
    name: 'Cape du Mage Rebelle',
    icon: '🧣',
    rarity: 'rare',
    description: '+5 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 5, duration: 'permanent' },
    equipmentSlot: 'cloak'
  },
  // Épiques (+8-10)
  {
    id: 'armure_mage_tueur',
    name: 'Armure du Mage-Tueur',
    icon: '🦾',
    rarity: 'epic',
    description: '+10 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 10, duration: 'permanent' },
    equipmentSlot: 'armor'
  },
  {
    id: 'collier_absorption',
    name: 'Collier d\'Absorption Magique',
    icon: '📿',
    rarity: 'epic',
    description: '+10 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 10, duration: 'permanent' },
    equipmentSlot: 'necklace'
  },
  {
    id: 'bouclier_miroir',
    name: 'Bouclier Miroir',
    icon: '🪞',
    rarity: 'epic',
    description: '+8 Résistance Magique et +5 Défense',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 8, duration: 'permanent' },
    equipmentSlot: 'offHand'
  },
  {
    id: 'bouclier_spectral',
    name: 'Bouclier Spectral',
    icon: '👻',
    rarity: 'epic',
    description: '+9 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 9, duration: 'permanent' },
    equipmentSlot: 'offHand'
  },
  // Légendaires (+12-15)
  {
    id: 'armure_antimagie',
    name: 'Armure d\'Antimagie',
    icon: '⚜️',
    rarity: 'legendary',
    description: '+15 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 15, duration: 'permanent' },
    equipmentSlot: 'armor'
  },
  {
    id: 'manteau_archimage_noir',
    name: 'Manteau de l\'Archimage Noir',
    icon: '🖤',
    rarity: 'legendary',
    description: '+13 Résistance Magique et +8 Att. Magique',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 13, duration: 'permanent' },
    equipmentSlot: 'cloak'
  }
];

// ============================================
// OBJETS AVEC EFFETS PASSIFS
// ============================================
const passiveEffectItems: Treasure[] = [
  // INITIATIVE - Rares (8-12%)
  {
    id: 'bottes_elfiques_silence',
    name: 'Bottes Elfiques du Silence',
    icon: '👢',
    rarity: 'rare',
    description: '+10% Initiative (agit plus tôt)',
    effect: { type: 'passive', passive: { type: 'initiative', value: 10 } },
    equipmentSlot: 'boots'
  },
  {
    id: 'anneau_vent',
    name: 'Anneau du Vent',
    icon: '💨',
    rarity: 'rare',
    description: '+12% Initiative',
    effect: { type: 'passive', passive: { type: 'initiative', value: 12 } },
    equipmentSlot: 'ring1'
  },
  // INITIATIVE - Épiques (15-20%)
  {
    id: 'cape_ombre_furtive',
    name: 'Cape de l\'Ombre Furtive',
    icon: '🌑',
    rarity: 'epic',
    description: '+18% Initiative',
    effect: { type: 'passive', passive: { type: 'initiative', value: 18 } },
    equipmentSlot: 'cloak'
  },
  
  // ÉVASION - Rares (8-12%)
  {
    id: 'cape_evasion',
    name: 'Cape d\'Évasion',
    icon: '🧣',
    rarity: 'rare',
    description: '10% de chance d\'esquiver',
    effect: { type: 'passive', passive: { type: 'evasion', value: 10 } },
    equipmentSlot: 'cloak'
  },
  // ÉVASION - Épiques (15-20%)
  {
    id: 'bottes_dimension',
    name: 'Bottes de Dimension',
    icon: '👟',
    rarity: 'epic',
    description: '15% de chance d\'esquiver',
    effect: { type: 'passive', passive: { type: 'evasion', value: 15 } },
    equipmentSlot: 'boots'
  },
  {
    id: 'anneau_flou',
    name: 'Anneau de Flou',
    icon: '💫',
    rarity: 'epic',
    description: '18% de chance d\'esquiver',
    effect: { type: 'passive', passive: { type: 'evasion', value: 18 } },
    equipmentSlot: 'ring2'
  },
  
  // COUPS CRITIQUES - Rares (8-12%)
  {
    id: 'dague_chance',
    name: 'Dague de la Chance',
    icon: '🗡️',
    rarity: 'rare',
    description: '+10% de chance de coup critique',
    effect: { type: 'passive', passive: { type: 'critical', value: 10 } },
    equipmentSlot: 'mainHand'
  },
  // COUPS CRITIQUES - Épiques (15-20%)
  {
    id: 'anneau_precision',
    name: 'Anneau de Précision',
    icon: '🎯',
    rarity: 'epic',
    description: '+15% de chance de coup critique',
    effect: { type: 'passive', passive: { type: 'critical', value: 15 } },
    equipmentSlot: 'ring1'
  },
  // COUPS CRITIQUES - Légendaires (25-35%)
  {
    id: 'epee_executeur',
    name: 'Épée de l\'Exécuteur',
    icon: '⚔️',
    rarity: 'legendary',
    description: '+25% de chance de coup critique',
    effect: { type: 'passive', passive: { type: 'critical', value: 25 } },
    equipmentSlot: 'mainHand'
  },
  
  // VOL DE VIE - Rares (8-12%)
  {
    id: 'lame_vampire',
    name: 'Lame du Vampire',
    icon: '🩸',
    rarity: 'rare',
    description: 'Récupère 10% des dégâts en PV',
    effect: { type: 'passive', passive: { type: 'lifesteal', value: 10 } },
    equipmentSlot: 'mainHand'
  },
  // VOL DE VIE - Épiques (15-20%)
  {
    id: 'griffe_nosferatu',
    name: 'Griffe de Nosferatu',
    icon: '🧛',
    rarity: 'epic',
    description: 'Récupère 18% des dégâts en PV',
    effect: { type: 'passive', passive: { type: 'lifesteal', value: 18 } },
    equipmentSlot: 'gloves'
  },
  // VOL DE VIE - Légendaires (25-35%)
  {
    id: 'faux_mort',
    name: 'Faux de la Mort',
    icon: '💀',
    rarity: 'legendary',
    description: 'Récupère 28% des dégâts en PV',
    effect: { type: 'passive', passive: { type: 'lifesteal', value: 28 } },
    equipmentSlot: 'mainHand'
  },
  
  // ÉPINES - Rares (8-12%)
  {
    id: 'armure_epines',
    name: 'Armure d\'Épines',
    icon: '🌵',
    rarity: 'rare',
    description: 'Renvoie 10% des dégâts reçus',
    effect: { type: 'passive', passive: { type: 'thorns', value: 10 } },
    equipmentSlot: 'armor'
  },
  // ÉPINES - Épiques (15-20%)
  {
    id: 'bouclier_vengeance',
    name: 'Bouclier de Vengeance',
    icon: '🛡️',
    rarity: 'epic',
    description: 'Renvoie 18% des dégâts reçus',
    effect: { type: 'passive', passive: { type: 'thorns', value: 18 } },
    equipmentSlot: 'offHand'
  },
  // ÉPINES - Légendaires (25-35%)
  {
    id: 'armure_malediction',
    name: 'Armure de Malédiction',
    icon: '☠️',
    rarity: 'legendary',
    description: 'Renvoie 30% des dégâts reçus',
    effect: { type: 'passive', passive: { type: 'thorns', value: 30 } },
    equipmentSlot: 'armor'
  },
  
  // RÉGÉNÉRATION - Rares (2-3 PV/tour)
  {
    id: 'anneau_regeneration',
    name: 'Anneau de Régénération',
    icon: '💚',
    rarity: 'rare',
    description: 'Régénère 3 PV par tour',
    effect: { type: 'passive', passive: { type: 'regeneration', value: 3 } },
    equipmentSlot: 'ring1'
  },
  // RÉGÉNÉRATION - Épiques (4-6 PV/tour)
  {
    id: 'amulette_troll',
    name: 'Amulette du Troll',
    icon: '🧟',
    rarity: 'epic',
    description: 'Régénère 5 PV par tour',
    effect: { type: 'passive', passive: { type: 'regeneration', value: 5 } },
    equipmentSlot: 'necklace'
  },
  // RÉGÉNÉRATION - Légendaires (8-12 PV/tour)
  {
    id: 'coeur_hydre',
    name: 'Cœur d\'Hydre',
    icon: '🐉',
    rarity: 'legendary',
    description: 'Régénère 10 PV par tour',
    effect: { type: 'passive', passive: { type: 'regeneration', value: 10 } },
    equipmentSlot: 'trinket1'
  },
  
  // RÉSISTANCES ÉLÉMENTAIRES - Toutes Rares (50% réduction)
  {
    id: 'anneau_feu',
    name: 'Anneau de Protection contre le Feu',
    icon: '🔥',
    rarity: 'rare',
    description: 'Résistance au feu (50% dégâts)',
    effect: { type: 'passive', passive: { type: 'resistance', value: 50, damageType: 'fire' } },
    equipmentSlot: 'ring1'
  },
  {
    id: 'anneau_froid',
    name: 'Anneau de Protection contre le Froid',
    icon: '❄️',
    rarity: 'rare',
    description: 'Résistance au froid (50% dégâts)',
    effect: { type: 'passive', passive: { type: 'resistance', value: 50, damageType: 'cold' } },
    equipmentSlot: 'ring2'
  },
  {
    id: 'anneau_foudre',
    name: 'Anneau de Protection contre la Foudre',
    icon: '⚡',
    rarity: 'rare',
    description: 'Résistance à la foudre (50% dégâts)',
    effect: { type: 'passive', passive: { type: 'resistance', value: 50, damageType: 'lightning' } },
    equipmentSlot: 'ring1'
  },
  // RÉSISTANCE MULTI-ÉLÉMENTS - Légendaire
  {
    id: 'cape_elements',
    name: 'Cape des Éléments',
    icon: '🌈',
    rarity: 'legendary',
    description: 'Résistance à tous les éléments (30%)',
    effect: { type: 'passive', passive: { type: 'resistance', value: 30, damageType: 'fire' } },
    equipmentSlot: 'cloak'
  }
];

// ============================================
// ARMES ET OBJETS D&D ICONIQUES
// ============================================
const iconicDndItems: Treasure[] = [
  // Armes légendaires avec sorts (50-65 dégâts)
  {
    id: 'flammetongue',
    name: 'Épée Flammetongue',
    icon: '🗡️',
    rarity: 'legendary',
    description: 'Apprend "Flamme Ardente" (52 dégâts de feu)',
    effect: { type: 'skill', skillName: 'Flamme Ardente', skillDamage: 52, skillType: 'damage', skillDamageType: 'fire' },
    equipmentSlot: 'mainHand'
  },
  {
    id: 'frostbrand',
    name: 'Épée Frostbrand',
    icon: '❄️',
    rarity: 'legendary',
    description: 'Apprend "Lame Glaciale" (50 dégâts de froid)',
    effect: { type: 'skill', skillName: 'Lame Glaciale', skillDamage: 50, skillType: 'damage', skillDamageType: 'cold' },
    equipmentSlot: 'mainHand'
  },
  {
    id: 'lame_soleil',
    name: 'Lame du Soleil',
    icon: '☀️',
    rarity: 'legendary',
    description: 'Apprend "Rayon Solaire" (58 dégâts radiants)',
    effect: { type: 'skill', skillName: 'Rayon Solaire', skillDamage: 58, skillType: 'damage', skillDamageType: 'radiant' },
    equipmentSlot: 'mainHand'
  },
  {
    id: 'lame_neuf_vies',
    name: 'Épée des Neuf Vies',
    icon: '⚔️',
    rarity: 'legendary',
    description: 'Apprend "Frappe Fatale" (55 dégâts tranchants)',
    effect: { type: 'skill', skillName: 'Frappe Fatale', skillDamage: 55, skillType: 'damage', skillDamageType: 'slashing' },
    equipmentSlot: 'mainHand'
  },
  {
    id: 'orbe_destruction',
    name: 'Orbe de Destruction',
    icon: '🔴',
    rarity: 'legendary',
    description: 'Apprend "Rayon Destructeur" (62 dégâts de force)',
    effect: { type: 'skill', skillName: 'Rayon Destructeur', skillDamage: 62, skillType: 'damage', skillDamageType: 'force' },
    equipmentSlot: 'trinket1'
  },
  
  // Objets protecteurs épiques
  {
    id: 'bouclier_foi',
    name: 'Bouclier de la Foi',
    icon: '🛡️',
    rarity: 'epic',
    description: '+9 Défense et +6 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'defense', value: 9, duration: 'permanent' },
    equipmentSlot: 'offHand'
  },
  {
    id: 'heaume_salut',
    name: 'Heaume du Salut',
    icon: '⛑️',
    rarity: 'epic',
    description: '+22 PV max permanents',
    effect: { type: 'stat_boost', stat: 'maxHp', value: 22, duration: 'permanent' },
    equipmentSlot: 'head'
  },
  
  // Objets de soins
  {
    id: 'baguette_soins',
    name: 'Baguette de Soins',
    icon: '🪄',
    rarity: 'rare',
    description: 'Apprend "Soin" (25 PV)',
    effect: { type: 'skill', skillName: 'Soin', skillDamage: 25, skillType: 'heal' },
    equipmentSlot: 'mainHand'
  },
  
  // Sorts épiques (30-40 dégâts)
  {
    id: 'sceptre_tonnerre',
    name: 'Sceptre du Tonnerre',
    icon: '🌩️',
    rarity: 'epic',
    description: 'Apprend "Vague de Tonnerre" (35 dégâts de tonnerre)',
    effect: { type: 'skill', skillName: 'Vague de Tonnerre', skillDamage: 35, skillType: 'damage', skillDamageType: 'thunder' },
    equipmentSlot: 'mainHand'
  },
  {
    id: 'griffe_dragon_acide',
    name: 'Griffe de Dragon d\'Acide',
    icon: '🐲',
    rarity: 'epic',
    description: 'Apprend "Souffle Acide" (33 dégâts d\'acide)',
    effect: { type: 'skill', skillName: 'Souffle Acide', skillDamage: 33, skillType: 'damage', skillDamageType: 'acid' },
    equipmentSlot: 'gloves'
  },
  
  // Bijoux de puissance
  {
    id: 'couronne_magicien',
    name: 'Couronne du Magicien',
    icon: '👑',
    rarity: 'legendary',
    description: '+14 Attaque Magique',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 14, duration: 'permanent' },
    equipmentSlot: 'head'
  },
  {
    id: 'anneau_champion',
    name: 'Anneau du Champion',
    icon: '💍',
    rarity: 'epic',
    description: '+8 Attaque et +6 Défense',
    effect: { type: 'stat_boost', stat: 'attack', value: 8, duration: 'permanent' },
    equipmentSlot: 'ring1'
  }
];

// ============================================
// EXPORT DE TOUS LES TRÉSORS
// ============================================
export const allTreasures = [
  ...commonTreasures,
  ...rareTreasures,
  ...epicTreasures,
  ...legendaryTreasures,
  ...dndCommonItems,
  ...dndRareItems,
  ...dndEpicItems,
  ...dndLegendaryItems,
  ...magicResistanceItems,
  ...passiveEffectItems,
  ...iconicDndItems
];

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

// Obtenir un trésor aléatoire avec probabilités équilibrées
export function getRandomTreasure(): Treasure {
  const roll = Math.random() * 100;
  
  // Combiner les trésors par rareté
  const allCommon = [
    ...commonTreasures, 
    ...dndCommonItems,
    ...magicResistanceItems.filter(i => i.rarity === 'common')
  ];
  const allRare = [
    ...rareTreasures, 
    ...dndRareItems,
    ...magicResistanceItems.filter(i => i.rarity === 'rare'),
    ...passiveEffectItems.filter(i => i.rarity === 'rare'),
    ...iconicDndItems.filter(i => i.rarity === 'rare')
  ];
  const allEpic = [
    ...epicTreasures, 
    ...dndEpicItems,
    ...magicResistanceItems.filter(i => i.rarity === 'epic'),
    ...passiveEffectItems.filter(i => i.rarity === 'epic'),
    ...iconicDndItems.filter(i => i.rarity === 'epic')
  ];
  const allLegendary = [
    ...legendaryTreasures, 
    ...dndLegendaryItems,
    ...magicResistanceItems.filter(i => i.rarity === 'legendary'),
    ...passiveEffectItems.filter(i => i.rarity === 'legendary'),
    ...iconicDndItems.filter(i => i.rarity === 'legendary')
  ];
  
  let pool: Treasure[];
  // Probabilités : 50% commun, 30% rare, 15% épique, 5% légendaire
  if (roll < 50) {
    pool = allCommon;
  } else if (roll < 80) {
    pool = allRare;
  } else if (roll < 95) {
    pool = allEpic;
  } else {
    pool = allLegendary;
  }
  
  return pool[Math.floor(Math.random() * pool.length)];
}

// Appliquer l'effet d'un trésor à un personnage
export function applyTreasureEffect(treasure: Treasure, character: Character): string[] {
  const effects: string[] = [];
  const { effect } = treasure;
  
  switch (effect.type) {
    case 'heal':
      const healAmount = Math.min(effect.value || 0, character.maxHp - character.hp);
      character.hp = Math.min(character.maxHp, character.hp + (effect.value || 0));
      effects.push(`+${healAmount} PV`);
      break;
      
    case 'stat_boost':
      if (effect.stat === 'maxHp') {
        character.maxHp += effect.value || 0;
        character.hp += effect.value || 0;
        effects.push(`+${effect.value} PV max`);
      } else if (effect.stat === 'attack' || effect.stat === 'strength') {
        // Convertir en bonus de Force (système D&D)
        if (character.abilities) {
          character.abilities.strength = (character.abilities.strength || 10) + (effect.value || 0);
        }
        effects.push(`+${effect.value} 💪 Force`);
      } else if (effect.stat === 'magicAttack' || effect.stat === 'intelligence') {
        // Convertir en bonus d'Intelligence (système D&D)
        if (character.abilities) {
          character.abilities.intelligence = (character.abilities.intelligence || 10) + (effect.value || 0);
        }
        effects.push(`+${effect.value} 📚 Intelligence`);
      } else if (effect.stat === 'defense' || effect.stat === 'armorClass') {
        // Convertir en bonus de CA (système D&D)
        character.armorClass = (character.armorClass || 10) + (effect.value || 0);
        effects.push(`+${effect.value} 🛡️ CA`);
      } else if (effect.stat === 'magicDefense' || effect.stat === 'wisdom') {
        // Convertir en bonus de Sagesse (système D&D)
        if (character.abilities) {
          character.abilities.wisdom = (character.abilities.wisdom || 10) + (effect.value || 0);
        }
        effects.push(`+${effect.value} 👁️ Sagesse`);
      } else if (effect.stat === 'speed') {
        character.speed = (character.speed || 30) + (effect.value || 0);
        effects.push(`+${effect.value} 💨 Vitesse`);
      } else if (effect.stat === 'dexterity') {
        if (character.abilities) {
          character.abilities.dexterity = (character.abilities.dexterity || 10) + (effect.value || 0);
        }
        effects.push(`+${effect.value} 🏃 Dextérité`);
      } else if (effect.stat === 'constitution') {
        if (character.abilities) {
          character.abilities.constitution = (character.abilities.constitution || 10) + (effect.value || 0);
        }
        // Bonus aux PV
        const hpBonus = (effect.value || 0) * (character.level || 1);
        character.maxHp = (character.maxHp || 10) + hpBonus;
        character.hp = (character.hp || 10) + hpBonus;
        effects.push(`+${effect.value} ❤️ Constitution (+${hpBonus} PV)`);
      } else if (effect.stat === 'charisma') {
        if (character.abilities) {
          character.abilities.charisma = (character.abilities.charisma || 10) + (effect.value || 0);
        }
        effects.push(`+${effect.value} 💬 Charisme`);
      }
      break;
      
    case 'buff':
      // Buff multiple selon le trésor (converti en système D&D)
      if (treasure.id === 'coeur_dragon') {
        character.maxHp += 25;
        character.hp += 25;
        if (character.abilities) {
          character.abilities.strength = (character.abilities.strength || 10) + 2;
        }
        effects.push('+25 PV max', '+2 💪 Force');
      } else if (treasure.id === 'couronne_roi') {
        character.maxHp += 35;
        character.hp += 35;
        if (character.abilities) {
          character.abilities.strength = (character.abilities.strength || 10) + 2;
          character.abilities.charisma = (character.abilities.charisma || 10) + 2;
        }
        character.armorClass = (character.armorClass || 10) + 2;
        effects.push('+35 PV max', '+2 💪 Force', '+2 💬 Charisme', '+2 🛡️ CA');
      } else if (treasure.id === 'armure_divine') {
        character.maxHp += 30;
        character.hp += 30;
        character.armorClass = (character.armorClass || 10) + 4;
        if (character.abilities) {
          character.abilities.wisdom = (character.abilities.wisdom || 10) + 2;
        }
        effects.push('+30 PV max', '+4 🛡️ CA', '+2 👁️ Sagesse');
      } else if (treasure.id === 'orbe_cosmos') {
        if (character.abilities) {
          character.abilities.intelligence = (character.abilities.intelligence || 10) + 4;
          character.abilities.wisdom = (character.abilities.wisdom || 10) + 3;
        }
        effects.push('+4 📚 Intelligence', '+3 👁️ Sagesse');
      } else if (treasure.id === 'anneau_trois_souhaits') {
        character.maxHp += 35;
        character.hp += 35;
        if (character.abilities) {
          character.abilities.strength = (character.abilities.strength || 10) + 2;
          character.abilities.intelligence = (character.abilities.intelligence || 10) + 2;
          character.abilities.charisma = (character.abilities.charisma || 10) + 2;
        }
        effects.push('+35 PV max', '+2 💪 Force', '+2 📚 Intelligence', '+2 💬 Charisme');
      }
      break;
      
    case 'skill':
      const newSkill = {
        id: treasure.id + '_skill_' + Date.now(),
        name: effect.skillName || 'Nouveau Sort',
        damage: effect.skillDamage || 20,
        type: (effect.skillType === 'heal' ? 'heal' : 'damage') as 'damage' | 'heal',
        damageType: effect.skillDamageType || 'magical',
        targetType: effect.skillType === 'heal' ? 'ally' as const : 'enemy' as const,
        description: effect.skillType === 'heal' 
          ? `Restaure ${effect.skillDamage} PV`
          : `${effect.skillDamage} dégâts ${effect.skillDamageType || 'magiques'}`,
        cooldown: effect.skillType === 'heal' ? 3 : 2,
        currentCooldown: 0
      };
      // S'assurer que skills existe
      if (!character.skills) character.skills = [];
      character.skills.push(newSkill);
      effects.push(`✨ Nouveau sort: ${effect.skillName}`);
      break;
      
    case 'passive':
      if (effect.passive) {
        const passiveType = effect.passive.type;
        const passiveValue = effect.passive.value;
        
        // Initialiser les effets passifs si nécessaire
        if (!character.passiveEffects) {
          character.passiveEffects = {};
        }
        
        switch (passiveType) {
          case 'initiative':
            // Bonus d'initiative = bonus de Dextérité (système D&D)
            if (character.abilities) {
              character.abilities.dexterity = (character.abilities.dexterity || 10) + 1;
            }
            effects.push(`+1 🏃 Dextérité (Initiative)`);
            break;
          case 'regeneration':
            character.passiveEffects.regeneration = (character.passiveEffects.regeneration || 0) + passiveValue;
            effects.push(`Régénère ${passiveValue} PV/tour`);
            break;
          case 'lifesteal':
            character.passiveEffects.lifesteal = (character.passiveEffects.lifesteal || 0) + passiveValue;
            effects.push(`Vol de vie ${passiveValue}%`);
            break;
          case 'thorns':
            character.passiveEffects.thorns = (character.passiveEffects.thorns || 0) + passiveValue;
            effects.push(`Renvoie ${passiveValue}% dégâts`);
            break;
          case 'evasion':
            character.passiveEffects.evasion = (character.passiveEffects.evasion || 0) + passiveValue;
            effects.push(`${passiveValue}% d'esquive`);
            break;
          case 'critical':
            character.passiveEffects.critical = (character.passiveEffects.critical || 0) + passiveValue;
            effects.push(`+${passiveValue}% coup critique`);
            break;
          case 'resistance':
            // Ajouter la résistance au tableau de résistances du personnage
            if (effect.passive.damageType) {
              if (!character.resistances) {
                character.resistances = [];
              }
              // Ne pas ajouter en double
              if (!character.resistances.includes(effect.passive.damageType as any)) {
                character.resistances.push(effect.passive.damageType as any);
              }
              // Stocker aussi le pourcentage de réduction dans passiveEffects
              if (!character.passiveEffects.damageReduction) {
                character.passiveEffects.damageReduction = {};
              }
              character.passiveEffects.damageReduction[effect.passive.damageType] = 
                (character.passiveEffects.damageReduction[effect.passive.damageType] || 0) + passiveValue;
              effects.push(`🛡️ Résistance ${effect.passive.damageType}: ${passiveValue}%`);
            }
            break;
        }
      }
      break;
      
    case 'resurrect':
      effects.push('Peut ressusciter un allié');
      break;
  }
  
  return effects;
}

// Obtenir la couleur selon la rareté
export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common': return '#a0a0a0';
    case 'rare': return '#4a9eff';
    case 'epic': return '#a855f7';
    case 'legendary': return '#fbbf24';
    default: return '#ffffff';
  }
}

// Obtenir le label français de la rareté
export function getRarityLabel(rarity: string): string {
  switch (rarity) {
    case 'common': return 'Commun';
    case 'rare': return 'Rare';
    case 'epic': return 'Épique';
    case 'legendary': return 'Légendaire';
    default: return '';
  }
}
