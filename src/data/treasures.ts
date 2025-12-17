import { Character } from '../types/game.types';

export interface Treasure {
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  effect: TreasureEffect;
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
  // Effets passifs (bonus permanents non liés aux stats de base)
  passive?: {
    type: 'initiative' | 'stealth' | 'evasion' | 'critical' | 'lifesteal' | 'thorns' | 'regeneration' | 'resistance';
    value: number; // % ou bonus fixe selon le type
    damageType?: 'fire' | 'cold' | 'lightning' | 'acid' | 'poison' | 'necrotic' | 'radiant' | 'force' | 'psychic' | 'thunder'; // Pour resistance
  };
}

export interface ObtainedTreasure {
  treasure: Treasure;
  assignedTo: Character;
  timestamp: number;
}

// Trésors communs
const commonTreasures: Treasure[] = [
  {
    id: 'potion_sante',
    name: 'Potion de Santé',
    icon: '🧪',
    rarity: 'common',
    description: 'Restaure 30 PV immédiatement',
    effect: { type: 'heal', value: 30 }
  },
  {
    id: 'herbes_guerison',
    name: 'Herbes de Guérison',
    icon: '🌿',
    rarity: 'common',
    description: 'Restaure 20 PV immédiatement',
    effect: { type: 'heal', value: 20 }
  },
  {
    id: 'pierre_force',
    name: 'Pierre de Force',
    icon: '💎',
    rarity: 'common',
    description: '+3 en Attaque de façon permanente',
    effect: { type: 'stat_boost', stat: 'attack', value: 3, duration: 'permanent' }
  },
  {
    id: 'amulette_protection',
    name: 'Amulette de Protection',
    icon: '📿',
    rarity: 'common',
    description: '+2 en Défense de façon permanente',
    effect: { type: 'stat_boost', stat: 'defense', value: 2, duration: 'permanent' }
  },
  {
    id: 'bottes_rapidite',
    name: 'Bottes de Rapidité',
    icon: '👢',
    rarity: 'common',
    description: '+2 en Vitesse de façon permanente',
    effect: { type: 'stat_boost', stat: 'speed', value: 2, duration: 'permanent' }
  },
  {
    id: 'cristal_mana_petit',
    name: 'Petit Cristal de Mana',
    icon: '🔮',
    rarity: 'common',
    description: '+2 en Attaque Magique de façon permanente',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 2, duration: 'permanent' }
  },
  {
    id: 'talisman_arcane',
    name: 'Talisman Arcanique',
    icon: '✨',
    rarity: 'common',
    description: '+2 en Résistance Magique de façon permanente',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 2, duration: 'permanent' }
  },
  {
    id: 'fiole_energie',
    name: 'Fiole d\'Énergie',
    icon: '⚗️',
    rarity: 'common',
    description: 'Restaure 25 PV immédiatement',
    effect: { type: 'heal', value: 25 }
  }
];

// Trésors rares
const rareTreasures: Treasure[] = [
  {
    id: 'elixir_vitalite',
    name: 'Élixir de Vitalité',
    icon: '⚗️',
    rarity: 'rare',
    description: '+15 PV max et soigne complètement',
    effect: { type: 'stat_boost', stat: 'maxHp', value: 15, duration: 'permanent' }
  },
  {
    id: 'gantelet_puissance',
    name: 'Gantelet de Puissance',
    icon: '🧤',
    rarity: 'rare',
    description: '+5 en Attaque de façon permanente',
    effect: { type: 'stat_boost', stat: 'attack', value: 5, duration: 'permanent' }
  },
  {
    id: 'bouclier_ancestral',
    name: 'Bouclier Ancestral',
    icon: '🛡️',
    rarity: 'rare',
    description: '+4 en Défense de façon permanente',
    effect: { type: 'stat_boost', stat: 'defense', value: 4, duration: 'permanent' }
  },
  {
    id: 'cape_vent',
    name: 'Cape du Vent',
    icon: '🧣',
    rarity: 'rare',
    description: '+4 en Vitesse de façon permanente',
    effect: { type: 'stat_boost', stat: 'speed', value: 4, duration: 'permanent' }
  },
  {
    id: 'cristal_mana_moyen',
    name: 'Cristal de Mana',
    icon: '💠',
    rarity: 'rare',
    description: '+5 en Attaque Magique de façon permanente',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 5, duration: 'permanent' }
  },
  {
    id: 'robe_archimage',
    name: 'Robe de l\'Archimage',
    icon: '🧙',
    rarity: 'rare',
    description: '+5 en Résistance Magique de façon permanente',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 5, duration: 'permanent' }
  },
  {
    id: 'grimoire_flammes',
    name: 'Grimoire des Flammes',
    icon: '📕',
    rarity: 'rare',
    description: 'Apprend le sort "Boule de Feu" (25 dégâts de feu)',
    effect: { type: 'skill', skillName: 'Boule de Feu', skillDamage: 25, skillType: 'damage', skillDamageType: 'fire' }
  },
  {
    id: 'pendentif_guerison',
    name: 'Pendentif de Guérison',
    icon: '💚',
    rarity: 'rare',
    description: 'Apprend le sort "Soin Léger" (20 PV)',
    effect: { type: 'skill', skillName: 'Soin Léger', skillDamage: 20, skillType: 'heal' }
  },
  {
    id: 'anneau_givre',
    name: 'Anneau de Givre',
    icon: '❄️',
    rarity: 'rare',
    description: 'Apprend "Souffle Glacé" (22 dégâts de froid)',
    effect: { type: 'skill', skillName: 'Souffle Glacé', skillDamage: 22, skillType: 'damage', skillDamageType: 'cold' }
  },
  {
    id: 'amulette_lumiere',
    name: 'Amulette de Lumière',
    icon: '☀️',
    rarity: 'rare',
    description: '+3 Attaque Magique et +3 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 3, duration: 'permanent' }
  }
];

// Trésors épiques
const epicTreasures: Treasure[] = [
  {
    id: 'coeur_dragon',
    name: 'Cœur de Dragon',
    icon: '❤️‍🔥',
    rarity: 'epic',
    description: '+30 PV max et +5 Attaque permanents',
    effect: { type: 'buff', stat: 'maxHp', value: 30 }
  },
  {
    id: 'anneau_immortel',
    name: 'Anneau de l\'Immortel',
    icon: '💍',
    rarity: 'epic',
    description: 'Ressuscite un allié mort avec 50% PV',
    effect: { type: 'resurrect', percentage: 50 }
  },
  {
    id: 'epee_lumiere',
    name: 'Épée de Lumière',
    icon: '⚔️',
    rarity: 'epic',
    description: '+8 Attaque et +3 Vitesse permanents',
    effect: { type: 'stat_boost', stat: 'attack', value: 8, duration: 'permanent' }
  },
  {
    id: 'armure_titan',
    name: 'Armure du Titan',
    icon: '🦾',
    rarity: 'epic',
    description: '+25 PV max et +6 Défense permanents',
    effect: { type: 'stat_boost', stat: 'defense', value: 6, duration: 'permanent' }
  },
  {
    id: 'orbe_foudre',
    name: 'Orbe de Foudre',
    icon: '⚡',
    rarity: 'epic',
    description: 'Apprend "Éclair Dévastateur" (40 dégâts de foudre)',
    effect: { type: 'skill', skillName: 'Éclair Dévastateur', skillDamage: 40, skillType: 'damage', skillDamageType: 'lightning' }
  },
  {
    id: 'baton_archimage',
    name: 'Bâton de l\'Archimage',
    icon: '🪄',
    rarity: 'epic',
    description: '+10 Attaque Magique et +5 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 10, duration: 'permanent' }
  },
  {
    id: 'cape_ombre',
    name: 'Cape des Ombres',
    icon: '🌑',
    rarity: 'epic',
    description: '+8 Résistance Magique et +4 Vitesse',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 8, duration: 'permanent' }
  },
  {
    id: 'essence_arcane',
    name: 'Essence Arcanique Pure',
    icon: '🌟',
    rarity: 'epic',
    description: '+12 Attaque Magique permanente',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 12, duration: 'permanent' }
  },
  {
    id: 'grimoire_necromancie',
    name: 'Grimoire de Nécromancie',
    icon: '📓',
    rarity: 'epic',
    description: 'Apprend "Drain de Vie" (35 dégâts nécrotiques + vol de vie)',
    effect: { type: 'skill', skillName: 'Drain de Vie', skillDamage: 35, skillType: 'damage', skillDamageType: 'necrotic' }
  },
  {
    id: 'bouclier_spectral',
    name: 'Bouclier Spectral',
    icon: '👻',
    rarity: 'epic',
    description: '+10 Résistance Magique permanente',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 10, duration: 'permanent' }
  }
];

// Trésors légendaires
const legendaryTreasures: Treasure[] = [
  {
    id: 'couronne_roi',
    name: 'Couronne du Roi Déchu',
    icon: '👑',
    rarity: 'legendary',
    description: '+50 PV max, +10 Attaque, +5 Défense permanents',
    effect: { type: 'buff', stat: 'maxHp', value: 50 }
  },
  {
    id: 'larme_phenix',
    name: 'Larme du Phénix',
    icon: '🔥',
    rarity: 'legendary',
    description: 'Ressuscite un allié avec 100% PV + bonus',
    effect: { type: 'resurrect', percentage: 100 }
  },
  {
    id: 'sceptre_eternel',
    name: 'Sceptre Éternel',
    icon: '🏆',
    rarity: 'legendary',
    description: 'Apprend "Jugement Divin" (60 dégâts radiants)',
    effect: { type: 'skill', skillName: 'Jugement Divin', skillDamage: 60, skillType: 'damage', skillDamageType: 'radiant' }
  },
  {
    id: 'orbe_cosmos',
    name: 'Orbe du Cosmos',
    icon: '🌌',
    rarity: 'legendary',
    description: '+15 Attaque Magique et +10 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 15, duration: 'permanent' }
  },
  {
    id: 'armure_divine',
    name: 'Armure Divine',
    icon: '⚜️',
    rarity: 'legendary',
    description: '+40 PV max, +8 Défense, +8 Rés. Magique',
    effect: { type: 'buff', stat: 'defense', value: 8 }
  },
  {
    id: 'tome_arcane_supreme',
    name: 'Tome Arcanique Suprême',
    icon: '📖',
    rarity: 'legendary',
    description: '+20 Attaque Magique permanente',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 20, duration: 'permanent' }
  }
];

// ============================================
// OBJETS MAGIQUES D&D - Adaptés à Ethernalys
// ============================================

// Objets D&D Communs
const dndCommonItems: Treasure[] = [
  {
    id: 'potion_guerison',
    name: 'Potion de Guérison',
    icon: '🧪',
    rarity: 'common',
    description: 'Restaure 2d4+2 (7) PV immédiatement',
    effect: { type: 'heal', value: 7 }
  },
  {
    id: 'dague_argent',
    name: 'Dague en Argent',
    icon: '🗡️',
    rarity: 'common',
    description: '+2 Attaque, bonus contre les lycanthropes',
    effect: { type: 'stat_boost', stat: 'attack', value: 2, duration: 'permanent' }
  },
  {
    id: 'symbole_sacre',
    name: 'Symbole Sacré',
    icon: '✝️',
    rarity: 'common',
    description: '+2 Attaque Magique, bonus contre morts-vivants',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 2, duration: 'permanent' }
  },
  {
    id: 'torche_eternelle',
    name: 'Torche Éternelle',
    icon: '🔦',
    rarity: 'common',
    description: '+1 Attaque Magique, éclaire dans les ténèbres',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 1, duration: 'permanent' }
  },
  {
    id: 'corde_escalade',
    name: 'Corde d\'Escalade',
    icon: '🪢',
    rarity: 'common',
    description: '+2 Vitesse permanente',
    effect: { type: 'stat_boost', stat: 'speed', value: 2, duration: 'permanent' }
  }
];

// Objets D&D Rares (Uncommon en D&D)
const dndRareItems: Treasure[] = [
  {
    id: 'cape_protection',
    name: 'Cape de Protection',
    icon: '🧥',
    rarity: 'rare',
    description: '+3 Défense et +3 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'defense', value: 3, duration: 'permanent' }
  },
  {
    id: 'bottes_elfiques',
    name: 'Bottes Elfiques',
    icon: '👢',
    rarity: 'rare',
    description: '+5 Vitesse, déplacement silencieux',
    effect: { type: 'stat_boost', stat: 'speed', value: 5, duration: 'permanent' }
  },
  {
    id: 'gants_ogre',
    name: 'Gants de Pouvoir d\'Ogre',
    icon: '🧤',
    rarity: 'rare',
    description: '+6 Attaque (Force 19)',
    effect: { type: 'stat_boost', stat: 'attack', value: 6, duration: 'permanent' }
  },
  {
    id: 'bandeau_intellect',
    name: 'Bandeau d\'Intellect',
    icon: '👑',
    rarity: 'rare',
    description: '+6 Attaque Magique (Intelligence 19)',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 6, duration: 'permanent' }
  },
  {
    id: 'amulette_sante',
    name: 'Amulette de Santé',
    icon: '💎',
    rarity: 'rare',
    description: '+20 PV max (Constitution 19)',
    effect: { type: 'stat_boost', stat: 'maxHp', value: 20, duration: 'permanent' }
  },
  {
    id: 'perle_pouvoir',
    name: 'Perle de Pouvoir',
    icon: '🔮',
    rarity: 'rare',
    description: 'Apprend "Rayon de Givre" (15 dégâts de froid)',
    effect: { type: 'skill', skillName: 'Rayon de Givre', skillDamage: 15, skillType: 'damage', skillDamageType: 'cold' }
  },
  {
    id: 'baguette_secrets',
    name: 'Baguette des Secrets',
    icon: '🪄',
    rarity: 'rare',
    description: '+4 Attaque Magique et +2 Rés. Magique',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 4, duration: 'permanent' }
  },
  {
    id: 'armure_mithral',
    name: 'Armure de Mithral',
    icon: '🛡️',
    rarity: 'rare',
    description: '+5 Défense, légère comme l\'air',
    effect: { type: 'stat_boost', stat: 'defense', value: 5, duration: 'permanent' }
  },
  {
    id: 'anneau_saut',
    name: 'Anneau de Saut',
    icon: '💍',
    rarity: 'rare',
    description: '+4 Vitesse et +2 Défense',
    effect: { type: 'stat_boost', stat: 'speed', value: 4, duration: 'permanent' }
  },
  {
    id: 'potion_guerison_grande',
    name: 'Potion de Guérison Supérieure',
    icon: '⚗️',
    rarity: 'rare',
    description: 'Restaure 4d4+4 (14) PV immédiatement',
    effect: { type: 'heal', value: 14 }
  }
];

// Objets D&D Épiques (Rare en D&D)
const dndEpicItems: Treasure[] = [
  {
    id: 'ceinture_geant',
    name: 'Ceinture de Force de Géant des Collines',
    icon: '🥋',
    rarity: 'epic',
    description: '+10 Attaque (Force 21)',
    effect: { type: 'stat_boost', stat: 'attack', value: 10, duration: 'permanent' }
  },
  {
    id: 'cape_deplacement',
    name: 'Cape de Déplacement',
    icon: '🧣',
    rarity: 'epic',
    description: '+8 Défense (désavantage aux attaques)',
    effect: { type: 'stat_boost', stat: 'defense', value: 8, duration: 'permanent' }
  },
  {
    id: 'epee_tranchante',
    name: 'Épée Tranchante +2',
    icon: '⚔️',
    rarity: 'epic',
    description: '+8 Attaque, coups critiques améliorés',
    effect: { type: 'stat_boost', stat: 'attack', value: 8, duration: 'permanent' }
  },
  {
    id: 'baton_mage',
    name: 'Bâton du Mage',
    icon: '🪄',
    rarity: 'epic',
    description: '+10 Attaque Magique, stocke des sorts',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 10, duration: 'permanent' }
  },
  {
    id: 'armure_nain',
    name: 'Armure de Plates Naine',
    icon: '🦾',
    rarity: 'epic',
    description: '+10 Défense, résistance au poison',
    effect: { type: 'stat_boost', stat: 'defense', value: 10, duration: 'permanent' }
  },
  {
    id: 'anneau_protection',
    name: 'Anneau de Protection +2',
    icon: '💍',
    rarity: 'epic',
    description: '+5 Défense et +5 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'defense', value: 5, duration: 'permanent' }
  },
  {
    id: 'bottes_rapidite',
    name: 'Bottes de Rapidité',
    icon: '👟',
    rarity: 'epic',
    description: '+10 Vitesse, clic pour doubler la vitesse',
    effect: { type: 'stat_boost', stat: 'speed', value: 10, duration: 'permanent' }
  },
  {
    id: 'baguette_boule_feu',
    name: 'Baguette de Boule de Feu',
    icon: '🔥',
    rarity: 'epic',
    description: 'Apprend "Boule de Feu" (35 dégâts de feu)',
    effect: { type: 'skill', skillName: 'Boule de Feu', skillDamage: 35, skillType: 'damage', skillDamageType: 'fire' }
  },
  {
    id: 'baguette_eclair',
    name: 'Baguette d\'Éclairs',
    icon: '⚡',
    rarity: 'epic',
    description: 'Apprend "Éclair" (35 dégâts de foudre)',
    effect: { type: 'skill', skillName: 'Éclair', skillDamage: 35, skillType: 'damage', skillDamageType: 'lightning' }
  },
  {
    id: 'ioun_force',
    name: 'Pierre Ioun de Force',
    icon: '💠',
    rarity: 'epic',
    description: '+6 Attaque, orbite autour de la tête',
    effect: { type: 'stat_boost', stat: 'attack', value: 6, duration: 'permanent' }
  },
  {
    id: 'ioun_insight',
    name: 'Pierre Ioun d\'Intuition',
    icon: '🔷',
    rarity: 'epic',
    description: '+6 Attaque Magique et +4 Rés. Magique',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 6, duration: 'permanent' }
  },
  {
    id: 'potion_guerison_supreme',
    name: 'Potion de Guérison Suprême',
    icon: '💉',
    rarity: 'epic',
    description: 'Restaure 10d4+20 (45) PV immédiatement',
    effect: { type: 'heal', value: 45 }
  }
];

// Objets D&D Légendaires (Very Rare / Legendary en D&D)
const dndLegendaryItems: Treasure[] = [
  {
    id: 'ceinture_geant_feu',
    name: 'Ceinture de Force de Géant du Feu',
    icon: '🔥',
    rarity: 'legendary',
    description: '+15 Attaque (Force 25)',
    effect: { type: 'stat_boost', stat: 'attack', value: 15, duration: 'permanent' }
  },
  {
    id: 'ceinture_geant_tempete',
    name: 'Ceinture de Force de Géant des Tempêtes',
    icon: '⛈️',
    rarity: 'legendary',
    description: '+20 Attaque (Force 29)',
    effect: { type: 'stat_boost', stat: 'attack', value: 20, duration: 'permanent' }
  },
  {
    id: 'epee_vorpale',
    name: 'Épée Vorpale',
    icon: '⚔️',
    rarity: 'legendary',
    description: '+15 Attaque, décapite sur 20 naturel',
    effect: { type: 'stat_boost', stat: 'attack', value: 15, duration: 'permanent' }
  },
  {
    id: 'baton_archmage',
    name: 'Bâton de l\'Archimage',
    icon: '🪄',
    rarity: 'legendary',
    description: '+15 Attaque Magique et +10 Rés. Magique',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 15, duration: 'permanent' }
  },
  {
    id: 'robe_archimage',
    name: 'Robe de l\'Archimage',
    icon: '🧙',
    rarity: 'legendary',
    description: '+12 Défense et +15 Rés. Magique',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 15, duration: 'permanent' }
  },
  {
    id: 'armure_invincibilite',
    name: 'Armure d\'Invincibilité',
    icon: '🛡️',
    rarity: 'legendary',
    description: '+15 Défense, résistance à tous les dégâts',
    effect: { type: 'stat_boost', stat: 'defense', value: 15, duration: 'permanent' }
  },
  {
    id: 'anneau_trois_souhaits',
    name: 'Anneau des Trois Souhaits',
    icon: '💫',
    rarity: 'legendary',
    description: '+50 PV max, +10 Attaque, +10 Att. Magique',
    effect: { type: 'buff', stat: 'maxHp', value: 50 }
  },
  {
    id: 'sphere_annihilation',
    name: 'Sphère d\'Annihilation',
    icon: '⚫',
    rarity: 'legendary',
    description: 'Apprend "Désintégration" (75 dégâts de force)',
    effect: { type: 'skill', skillName: 'Désintégration', skillDamage: 75, skillType: 'damage', skillDamageType: 'force' }
  },
  {
    id: 'main_vecna',
    name: 'Main de Vecna',
    icon: '✋',
    rarity: 'legendary',
    description: '+12 Attaque Magique, drain de vie',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 12, duration: 'permanent' }
  },
  {
    id: 'oeil_vecna',
    name: 'Œil de Vecna',
    icon: '👁️',
    rarity: 'legendary',
    description: '+8 Attaque Magique, vision des ténèbres',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 8, duration: 'permanent' }
  },
  {
    id: 'potion_guerison_legendaire',
    name: 'Potion de Guérison Légendaire',
    icon: '🧪',
    rarity: 'legendary',
    description: 'Restaure tous les PV immédiatement',
    effect: { type: 'heal', value: 200 }
  },
  {
    id: 'manuel_exercice',
    name: 'Manuel d\'Exercices Physiques',
    icon: '📘',
    rarity: 'legendary',
    description: '+10 PV max et +8 Attaque permanents',
    effect: { type: 'stat_boost', stat: 'attack', value: 8, duration: 'permanent' }
  },
  {
    id: 'tome_comprehension',
    name: 'Tome de Compréhension',
    icon: '📗',
    rarity: 'legendary',
    description: '+8 Rés. Magique permanente',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 8, duration: 'permanent' }
  },
  {
    id: 'tome_pensee',
    name: 'Tome de Pensée Claire',
    icon: '📙',
    rarity: 'legendary',
    description: '+12 Attaque Magique permanente',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 12, duration: 'permanent' }
  }
];

// ============================================
// OBJETS DE RÉSISTANCE MAGIQUE
// ============================================

const magicResistanceItems: Treasure[] = [
  // Communs
  {
    id: 'amulette_protection_mineure',
    name: 'Amulette de Protection Mineure',
    icon: '📿',
    rarity: 'common',
    description: '+3 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 3, duration: 'permanent' }
  },
  {
    id: 'talisman_gardien',
    name: 'Talisman du Gardien',
    icon: '🔷',
    rarity: 'common',
    description: '+2 Résistance Magique et +1 Défense',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 2, duration: 'permanent' }
  },
  {
    id: 'pierre_anti_magie',
    name: 'Pierre Anti-Magie',
    icon: '💎',
    rarity: 'common',
    description: '+4 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 4, duration: 'permanent' }
  },
  // Rares
  {
    id: 'manteau_resistance',
    name: 'Manteau de Résistance',
    icon: '🧥',
    rarity: 'rare',
    description: '+6 Résistance Magique, protection contre les sorts',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 6, duration: 'permanent' }
  },
  {
    id: 'broche_bouclier',
    name: 'Broche de Bouclier Arcanique',
    icon: '💠',
    rarity: 'rare',
    description: '+5 Résistance Magique et +3 Défense',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 5, duration: 'permanent' }
  },
  {
    id: 'anneau_dissipation',
    name: 'Anneau de Dissipation',
    icon: '💍',
    rarity: 'rare',
    description: '+7 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 7, duration: 'permanent' }
  },
  {
    id: 'cape_mage_rebelle',
    name: 'Cape du Mage Rebelle',
    icon: '🧣',
    rarity: 'rare',
    description: '+5 Résistance Magique et +3 Attaque Magique',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 5, duration: 'permanent' }
  },
  // Épiques
  {
    id: 'armure_mage_tueur',
    name: 'Armure du Mage-Tueur',
    icon: '🦾',
    rarity: 'epic',
    description: '+10 Résistance Magique, avantage contre les mages',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 10, duration: 'permanent' }
  },
  {
    id: 'collier_absorption',
    name: 'Collier d\'Absorption Magique',
    icon: '📿',
    rarity: 'epic',
    description: '+12 Résistance Magique, absorbe les sorts',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 12, duration: 'permanent' }
  },
  {
    id: 'bouclier_miroir',
    name: 'Bouclier Miroir',
    icon: '🪞',
    rarity: 'epic',
    description: '+8 Résistance Magique et +5 Défense',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 8, duration: 'permanent' }
  },
  // Légendaires
  {
    id: 'armure_antimagie',
    name: 'Armure d\'Antimagie',
    icon: '⚜️',
    rarity: 'legendary',
    description: '+18 Résistance Magique, immunité partielle aux sorts',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 18, duration: 'permanent' }
  },
  {
    id: 'manteau_archimage_noir',
    name: 'Manteau de l\'Archimage Noir',
    icon: '🖤',
    rarity: 'legendary',
    description: '+15 Résistance Magique et +10 Attaque Magique',
    effect: { type: 'stat_boost', stat: 'magicDefense', value: 15, duration: 'permanent' }
  }
];

// ============================================
// OBJETS D&D AVEC EFFETS PASSIFS UTILES
// ============================================

const passiveEffectItems: Treasure[] = [
  // FURTIVITÉ / INITIATIVE
  {
    id: 'bottes_elfiques_silence',
    name: 'Bottes Elfiques du Silence',
    icon: '👢',
    rarity: 'rare',
    description: '+5 Vitesse, +10% Initiative (agit plus tôt)',
    effect: { 
      type: 'passive', 
      passive: { type: 'initiative', value: 10 }
    }
  },
  {
    id: 'cape_ombre_furtive',
    name: 'Cape de l\'Ombre Furtive',
    icon: '🌑',
    rarity: 'epic',
    description: '+20% Initiative et +5 Résistance Magique',
    effect: { 
      type: 'passive', 
      passive: { type: 'initiative', value: 20 }
    }
  },
  {
    id: 'anneau_vent',
    name: 'Anneau du Vent',
    icon: '💨',
    rarity: 'rare',
    description: '+15% Initiative, déplacement comme le vent',
    effect: { 
      type: 'passive', 
      passive: { type: 'initiative', value: 15 }
    }
  },
  
  // ÉVASION
  {
    id: 'cape_evasion',
    name: 'Cape d\'Évasion',
    icon: '🧣',
    rarity: 'rare',
    description: '10% de chance d\'esquiver les attaques',
    effect: { 
      type: 'passive', 
      passive: { type: 'evasion', value: 10 }
    }
  },
  {
    id: 'bottes_dimension',
    name: 'Bottes de Dimension',
    icon: '👟',
    rarity: 'epic',
    description: '15% de chance d\'esquiver, téléportation courte',
    effect: { 
      type: 'passive', 
      passive: { type: 'evasion', value: 15 }
    }
  },
  {
    id: 'anneau_flou',
    name: 'Anneau de Flou',
    icon: '💫',
    rarity: 'epic',
    description: '20% de chance d\'esquiver les attaques',
    effect: { 
      type: 'passive', 
      passive: { type: 'evasion', value: 20 }
    }
  },
  
  // COUPS CRITIQUES
  {
    id: 'dague_chance',
    name: 'Dague de la Chance',
    icon: '🗡️',
    rarity: 'rare',
    description: '+10% de chance de coup critique',
    effect: { 
      type: 'passive', 
      passive: { type: 'critical', value: 10 }
    }
  },
  {
    id: 'anneau_precision',
    name: 'Anneau de Précision',
    icon: '🎯',
    rarity: 'epic',
    description: '+15% de chance de coup critique',
    effect: { 
      type: 'passive', 
      passive: { type: 'critical', value: 15 }
    }
  },
  {
    id: 'epee_executeur',
    name: 'Épée de l\'Exécuteur',
    icon: '⚔️',
    rarity: 'legendary',
    description: '+25% de chance de coup critique, +8 Attaque',
    effect: { 
      type: 'passive', 
      passive: { type: 'critical', value: 25 }
    }
  },
  
  // VOL DE VIE
  {
    id: 'lame_vampire',
    name: 'Lame du Vampire',
    icon: '🩸',
    rarity: 'rare',
    description: 'Récupère 10% des dégâts infligés en PV',
    effect: { 
      type: 'passive', 
      passive: { type: 'lifesteal', value: 10 }
    }
  },
  {
    id: 'griffe_nosferatu',
    name: 'Griffe de Nosferatu',
    icon: '🧛',
    rarity: 'epic',
    description: 'Récupère 20% des dégâts infligés en PV',
    effect: { 
      type: 'passive', 
      passive: { type: 'lifesteal', value: 20 }
    }
  },
  {
    id: 'faux_mort',
    name: 'Faux de la Mort',
    icon: '💀',
    rarity: 'legendary',
    description: 'Récupère 30% des dégâts infligés en PV, +10 Attaque',
    effect: { 
      type: 'passive', 
      passive: { type: 'lifesteal', value: 30 }
    }
  },
  
  // ÉPINES / RIPOSTE
  {
    id: 'armure_epines',
    name: 'Armure d\'Épines',
    icon: '🌵',
    rarity: 'rare',
    description: 'Renvoie 10% des dégâts reçus à l\'attaquant',
    effect: { 
      type: 'passive', 
      passive: { type: 'thorns', value: 10 }
    }
  },
  {
    id: 'bouclier_vengeance',
    name: 'Bouclier de Vengeance',
    icon: '🛡️',
    rarity: 'epic',
    description: 'Renvoie 20% des dégâts reçus, +5 Défense',
    effect: { 
      type: 'passive', 
      passive: { type: 'thorns', value: 20 }
    }
  },
  {
    id: 'armure_malediction',
    name: 'Armure de Malédiction',
    icon: '☠️',
    rarity: 'legendary',
    description: 'Renvoie 35% des dégâts reçus à l\'attaquant',
    effect: { 
      type: 'passive', 
      passive: { type: 'thorns', value: 35 }
    }
  },
  
  // RÉGÉNÉRATION
  {
    id: 'anneau_regeneration',
    name: 'Anneau de Régénération',
    icon: '💚',
    rarity: 'rare',
    description: 'Régénère 3 PV au début de chaque tour',
    effect: { 
      type: 'passive', 
      passive: { type: 'regeneration', value: 3 }
    }
  },
  {
    id: 'amulette_troll',
    name: 'Amulette du Troll',
    icon: '🧟',
    rarity: 'epic',
    description: 'Régénère 5 PV au début de chaque tour',
    effect: { 
      type: 'passive', 
      passive: { type: 'regeneration', value: 5 }
    }
  },
  {
    id: 'coeur_hydre',
    name: 'Cœur d\'Hydre',
    icon: '🐉',
    rarity: 'legendary',
    description: 'Régénère 10 PV au début de chaque tour, +30 PV max',
    effect: { 
      type: 'passive', 
      passive: { type: 'regeneration', value: 10 }
    }
  },
  
  // RÉSISTANCES ÉLÉMENTAIRES
  {
    id: 'anneau_feu',
    name: 'Anneau de Protection contre le Feu',
    icon: '🔥',
    rarity: 'rare',
    description: 'Résistance au feu (50% dégâts)',
    effect: { 
      type: 'passive', 
      passive: { type: 'resistance', value: 50, damageType: 'fire' }
    }
  },
  {
    id: 'anneau_froid',
    name: 'Anneau de Protection contre le Froid',
    icon: '❄️',
    rarity: 'rare',
    description: 'Résistance au froid (50% dégâts)',
    effect: { 
      type: 'passive', 
      passive: { type: 'resistance', value: 50, damageType: 'cold' }
    }
  },
  {
    id: 'anneau_foudre',
    name: 'Anneau de Protection contre la Foudre',
    icon: '⚡',
    rarity: 'rare',
    description: 'Résistance à la foudre (50% dégâts)',
    effect: { 
      type: 'passive', 
      passive: { type: 'resistance', value: 50, damageType: 'lightning' }
    }
  },
  {
    id: 'cape_elements',
    name: 'Cape des Éléments',
    icon: '🌈',
    rarity: 'legendary',
    description: 'Résistance à tous les éléments (30% dégâts)',
    effect: { 
      type: 'passive', 
      passive: { type: 'resistance', value: 30, damageType: 'fire' } // Appliqué à tous
    }
  }
];

// ============================================
// NOUVEAUX OBJETS D&D ICONIQUES
// ============================================

const iconicDndItems: Treasure[] = [
  // Armes légendaires
  {
    id: 'flammetongue',
    name: 'Épée Flammetongue',
    icon: '🗡️',
    rarity: 'legendary',
    description: '+12 Attaque, apprend "Flamme Ardente" (45 dégâts de feu)',
    effect: { type: 'skill', skillName: 'Flamme Ardente', skillDamage: 45, skillType: 'damage', skillDamageType: 'fire' }
  },
  {
    id: 'frostbrand',
    name: 'Épée Frostbrand',
    icon: '❄️',
    rarity: 'legendary',
    description: '+12 Attaque, apprend "Lame Glaciale" (45 dégâts de froid)',
    effect: { type: 'skill', skillName: 'Lame Glaciale', skillDamage: 45, skillType: 'damage', skillDamageType: 'cold' }
  },
  {
    id: 'lame_soleil',
    name: 'Lame du Soleil',
    icon: '☀️',
    rarity: 'legendary',
    description: '+15 Attaque, apprend "Rayon Solaire" (55 dégâts radiants)',
    effect: { type: 'skill', skillName: 'Rayon Solaire', skillDamage: 55, skillType: 'damage', skillDamageType: 'radiant' }
  },
  {
    id: 'lame_neuf_vies',
    name: 'Épée des Neuf Vies',
    icon: '⚔️',
    rarity: 'legendary',
    description: '+10 Attaque, apprend "Frappe Fatale" (60 dégâts tranchants)',
    effect: { type: 'skill', skillName: 'Frappe Fatale', skillDamage: 60, skillType: 'damage', skillDamageType: 'slashing' }
  },
  
  // Objets protecteurs
  {
    id: 'bouclier_foi',
    name: 'Bouclier de la Foi',
    icon: '🛡️',
    rarity: 'epic',
    description: '+10 Défense et +8 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'defense', value: 10, duration: 'permanent' }
  },
  {
    id: 'heaume_salut',
    name: 'Heaume du Salut',
    icon: '⛑️',
    rarity: 'epic',
    description: '+25 PV max et +5 Résistance Magique',
    effect: { type: 'stat_boost', stat: 'maxHp', value: 25, duration: 'permanent' }
  },
  
  // Objets de soins
  {
    id: 'baguette_soins',
    name: 'Baguette de Soins',
    icon: '🪄',
    rarity: 'rare',
    description: 'Apprend "Soin" (30 PV)',
    effect: { type: 'skill', skillName: 'Soin', skillDamage: 30, skillType: 'heal' }
  },
  {
    id: 'baton_guerison',
    name: 'Bâton de Guérison',
    icon: '🏥',
    rarity: 'epic',
    description: 'Apprend "Guérison Majeure" (50 PV)',
    effect: { type: 'skill', skillName: 'Guérison Majeure', skillDamage: 50, skillType: 'heal' }
  },
  
  // Artefacts destructeurs
  {
    id: 'baguette_rayon_mort',
    name: 'Baguette du Rayon de la Mort',
    icon: '💀',
    rarity: 'legendary',
    description: 'Apprend "Rayon de la Mort" (70 dégâts nécrotiques)',
    effect: { type: 'skill', skillName: 'Rayon de la Mort', skillDamage: 70, skillType: 'damage', skillDamageType: 'necrotic' }
  },
  {
    id: 'orbe_destruction',
    name: 'Orbe de Destruction',
    icon: '🔴',
    rarity: 'legendary',
    description: 'Apprend "Rayon Destructeur" (65 dégâts de force)',
    effect: { type: 'skill', skillName: 'Rayon Destructeur', skillDamage: 65, skillType: 'damage', skillDamageType: 'force' }
  },
  {
    id: 'sceptre_tonnerre',
    name: 'Sceptre du Tonnerre',
    icon: '🌩️',
    rarity: 'epic',
    description: 'Apprend "Vague de Tonnerre" (40 dégâts de tonnerre)',
    effect: { type: 'skill', skillName: 'Vague de Tonnerre', skillDamage: 40, skillType: 'damage', skillDamageType: 'thunder' }
  },
  {
    id: 'griffe_dragon_acide',
    name: 'Griffe de Dragon d\'Acide',
    icon: '🐲',
    rarity: 'epic',
    description: 'Apprend "Souffle Acide" (38 dégâts d\'acide)',
    effect: { type: 'skill', skillName: 'Souffle Acide', skillDamage: 38, skillType: 'damage', skillDamageType: 'acid' }
  },
  
  // Bijoux de puissance
  {
    id: 'couronne_magicien',
    name: 'Couronne du Magicien',
    icon: '👑',
    rarity: 'legendary',
    description: '+18 Attaque Magique',
    effect: { type: 'stat_boost', stat: 'magicAttack', value: 18, duration: 'permanent' }
  },
  {
    id: 'anneau_champion',
    name: 'Anneau du Champion',
    icon: '💍',
    rarity: 'epic',
    description: '+8 Attaque et +8 Défense',
    effect: { type: 'stat_boost', stat: 'attack', value: 8, duration: 'permanent' }
  }
];

export const allTreasures = [
  ...commonTreasures,
  ...rareTreasures,
  ...epicTreasures,
  ...legendaryTreasures,
  // Objets D&D adaptés
  ...dndCommonItems,
  ...dndRareItems,
  ...dndEpicItems,
  ...dndLegendaryItems,
  // Objets de résistance magique
  ...magicResistanceItems,
  // Objets avec effets passifs
  ...passiveEffectItems,
  // Objets D&D iconiques
  ...iconicDndItems
];

// Obtenir un trésor aléatoire avec probabilités
export function getRandomTreasure(): Treasure {
  const roll = Math.random() * 100;
  
  // Combiner les trésors de base avec les objets D&D et les nouveaux objets
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
  if (roll < 50) {
    pool = allCommon; // 50% commun
  } else if (roll < 80) {
    pool = allRare; // 30% rare
  } else if (roll < 95) {
    pool = allEpic; // 15% épique
  } else {
    pool = allLegendary; // 5% légendaire
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
      } else if (effect.stat === 'attack') {
        character.attack += effect.value || 0;
        // Mettre à jour baseAttack aussi
        if (character.baseAttack !== undefined) {
          character.baseAttack += effect.value || 0;
        }
        effects.push(`+${effect.value} ⚔️ Attaque`);
      } else if (effect.stat === 'magicAttack') {
        character.magicAttack = (character.magicAttack || 0) + (effect.value || 0);
        if (character.baseMagicAttack !== undefined) {
          character.baseMagicAttack += effect.value || 0;
        }
        effects.push(`+${effect.value} ✨ Attaque Magique`);
      } else if (effect.stat === 'defense') {
        character.defense += effect.value || 0;
        if (character.baseDefense !== undefined) {
          character.baseDefense += effect.value || 0;
        }
        effects.push(`+${effect.value} 🛡️ Défense`);
      } else if (effect.stat === 'magicDefense') {
        character.magicDefense = (character.magicDefense || 0) + (effect.value || 0);
        if (character.baseMagicDefense !== undefined) {
          character.baseMagicDefense += effect.value || 0;
        }
        effects.push(`+${effect.value} 🔮 Rés. Magique`);
      } else if (effect.stat === 'speed') {
        character.speed += effect.value || 0;
        if (character.baseSpeed !== undefined) {
          character.baseSpeed += effect.value || 0;
        }
        effects.push(`+${effect.value} 💨 Vitesse`);
      }
      break;
      
    case 'buff':
      // Buff multiple selon le trésor
      if (treasure.id === 'coeur_dragon') {
        character.maxHp += 30;
        character.hp += 30;
        character.attack += 5;
        if (character.baseAttack !== undefined) character.baseAttack += 5;
        effects.push('+30 PV max', '+5 ⚔️ Attaque');
      } else if (treasure.id === 'couronne_roi') {
        character.maxHp += 50;
        character.hp += 50;
        character.attack += 10;
        character.defense += 5;
        if (character.baseAttack !== undefined) character.baseAttack += 10;
        if (character.baseDefense !== undefined) character.baseDefense += 5;
        effects.push('+50 PV max', '+10 ⚔️ Attaque', '+5 🛡️ Défense');
      } else if (treasure.id === 'armure_divine') {
        character.maxHp += 40;
        character.hp += 40;
        character.defense += 8;
        character.magicDefense = (character.magicDefense || 0) + 8;
        if (character.baseDefense !== undefined) character.baseDefense += 8;
        if (character.baseMagicDefense !== undefined) character.baseMagicDefense += 8;
        effects.push('+40 PV max', '+8 🛡️ Défense', '+8 🔮 Rés. Magique');
      } else if (treasure.id === 'orbe_cosmos') {
        character.magicAttack = (character.magicAttack || 0) + 15;
        character.magicDefense = (character.magicDefense || 0) + 10;
        if (character.baseMagicAttack !== undefined) character.baseMagicAttack += 15;
        if (character.baseMagicDefense !== undefined) character.baseMagicDefense += 10;
        effects.push('+15 ✨ Att. Magique', '+10 🔮 Rés. Magique');
      } else if (treasure.id === 'anneau_trois_souhaits') {
        character.maxHp += 50;
        character.hp += 50;
        character.attack += 10;
        character.magicAttack = (character.magicAttack || 0) + 10;
        if (character.baseAttack !== undefined) character.baseAttack += 10;
        if (character.baseMagicAttack !== undefined) character.baseMagicAttack += 10;
        effects.push('+50 PV max', '+10 ⚔️ Attaque', '+10 ✨ Att. Magique');
      }
      break;
      
    case 'skill':
      const newSkill = {
        id: treasure.id + '_skill',
        name: effect.skillName || 'Nouveau Sort',
        damage: effect.skillDamage || 20,
        type: (effect.skillType || 'damage') as 'damage' | 'heal',
        damageType: effect.skillDamageType,
        targetType: effect.skillType === 'heal' ? 'ally' as const : 'enemy' as const,
        description: `${effect.skillDamage} dégâts ${effect.skillDamageType || 'magiques'}`
      };
      character.skills.push(newSkill);
      effects.push(`Nouveau sort: ${effect.skillName}`);
      break;
      
    case 'passive':
      // Effets passifs - stockés sur le personnage pour être appliqués en combat
      if (effect.passive) {
        // Ajouter l'effet passif à l'inventaire (il sera utilisé en combat)
        const passiveType = effect.passive.type;
        const passiveValue = effect.passive.value;
        
        switch (passiveType) {
          case 'initiative':
            // Bonus d'initiative = bonus de vitesse
            character.speed += Math.floor(character.speed * passiveValue / 100);
            if (character.baseSpeed !== undefined) {
              character.baseSpeed += Math.floor(character.baseSpeed * passiveValue / 100);
            }
            effects.push(`+${passiveValue}% 💨 Initiative`);
            break;
          case 'regeneration':
            // Ajouter un buff permanent de régénération
            effects.push(`Régénère ${passiveValue} PV/tour`);
            break;
          case 'lifesteal':
            effects.push(`Vol de vie ${passiveValue}%`);
            break;
          case 'thorns':
            effects.push(`Renvoie ${passiveValue}% dégâts`);
            break;
          case 'evasion':
            effects.push(`${passiveValue}% d'esquive`);
            break;
          case 'critical':
            effects.push(`+${passiveValue}% coup critique`);
            break;
          case 'resistance':
            effects.push(`Résistance ${effect.passive.damageType}: ${passiveValue}%`);
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
