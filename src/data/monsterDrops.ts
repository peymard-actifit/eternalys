import { Monster, InventoryItem } from '../types/game.types';

// Définition des drops de monstres
export interface MonsterDrop {
  monsterId: string;
  drops: {
    item: Omit<InventoryItem, 'obtainedAt'>;
    dropRate: number; // 0-100
  }[];
}

// Drops des monstres normaux
export const MONSTER_DROPS: MonsterDrop[] = [
  // Gobelins
  {
    monsterId: 'goblin',
    drops: [
      {
        item: { id: 'goblin_dagger', name: 'Dague de Gobelin', icon: '🗡️', rarity: 'common', description: '+2 Attaque permanente' },
        dropRate: 30
      },
      {
        item: { id: 'goblin_coin', name: 'Pièce volée', icon: '🪙', rarity: 'common', description: '+1 Vitesse permanente' },
        dropRate: 20
      }
    ]
  },
  // Squelettes
  {
    monsterId: 'skeleton',
    drops: [
      {
        item: { id: 'bone_fragment', name: 'Fragment d\'os', icon: '🦴', rarity: 'common', description: '+2 Défense permanente' },
        dropRate: 35
      },
      {
        item: { id: 'rusty_sword', name: 'Épée rouillée', icon: '⚔️', rarity: 'common', description: '+3 Attaque permanente' },
        dropRate: 15
      }
    ]
  },
  // Gelée
  {
    monsterId: 'slime',
    drops: [
      {
        item: { id: 'slime_essence', name: 'Essence de gelée', icon: '💧', rarity: 'common', description: '+10 PV permanents' },
        dropRate: 40
      },
      {
        item: { id: 'acid_vial', name: 'Fiole d\'acide', icon: '🧪', rarity: 'rare', description: '+3 Attaque Magique permanente' },
        dropRate: 15
      }
    ]
  },
  // Chauve-souris
  {
    monsterId: 'bat',
    drops: [
      {
        item: { id: 'bat_wing', name: 'Aile de chauve-souris', icon: '🦇', rarity: 'common', description: '+2 Vitesse permanente' },
        dropRate: 35
      }
    ]
  },
  // Rat géant
  {
    monsterId: 'rat',
    drops: [
      {
        item: { id: 'rat_tail', name: 'Queue de rat', icon: '🐀', rarity: 'common', description: '+1 Vitesse permanente' },
        dropRate: 40
      }
    ]
  },
  // Araignée
  {
    monsterId: 'spider',
    drops: [
      {
        item: { id: 'spider_silk', name: 'Soie d\'araignée', icon: '🕸️', rarity: 'rare', description: '+3 Résistance Magique permanente' },
        dropRate: 30
      },
      {
        item: { id: 'venom_sac', name: 'Sac de venin', icon: '💜', rarity: 'rare', description: '+4 Attaque Magique permanente' },
        dropRate: 15
      }
    ]
  },
  // Loup
  {
    monsterId: 'wolf',
    drops: [
      {
        item: { id: 'wolf_pelt', name: 'Peau de loup', icon: '🐺', rarity: 'common', description: '+3 Défense permanente' },
        dropRate: 35
      },
      {
        item: { id: 'wolf_fang', name: 'Croc de loup', icon: '🦷', rarity: 'rare', description: '+4 Attaque permanente' },
        dropRate: 20
      }
    ]
  },
  // Orc
  {
    monsterId: 'orc',
    drops: [
      {
        item: { id: 'orc_axe', name: 'Hache d\'Orc', icon: '🪓', rarity: 'rare', description: '+5 Attaque permanente' },
        dropRate: 25
      },
      {
        item: { id: 'orc_armor_piece', name: 'Morceau d\'armure orc', icon: '🛡️', rarity: 'rare', description: '+4 Défense permanente' },
        dropRate: 20
      }
    ]
  },
  // Zombie
  {
    monsterId: 'zombie',
    drops: [
      {
        item: { id: 'rotten_flesh', name: 'Chair putréfiée', icon: '🧟', rarity: 'common', description: '+15 PV permanents' },
        dropRate: 40
      },
      {
        item: { id: 'zombie_heart', name: 'Cœur de zombie', icon: '💀', rarity: 'rare', description: '+3 Résistance Magique permanente' },
        dropRate: 15
      }
    ]
  },
  // Spectre
  {
    monsterId: 'ghost',
    drops: [
      {
        item: { id: 'ectoplasm', name: 'Ectoplasme', icon: '👻', rarity: 'rare', description: '+5 Attaque Magique permanente' },
        dropRate: 35
      },
      {
        item: { id: 'spirit_essence', name: 'Essence spectrale', icon: '✨', rarity: 'epic', description: '+8 Résistance Magique permanente' },
        dropRate: 10
      }
    ]
  },
  // Imp
  {
    monsterId: 'imp',
    drops: [
      {
        item: { id: 'imp_horn', name: 'Corne de diablotin', icon: '👹', rarity: 'rare', description: '+4 Attaque Magique permanente' },
        dropRate: 30
      },
      {
        item: { id: 'hellfire_shard', name: 'Éclat de feu infernal', icon: '🔥', rarity: 'epic', description: '+6 Attaque Magique permanente' },
        dropRate: 10
      }
    ]
  },
  // Golem
  {
    monsterId: 'golem',
    drops: [
      {
        item: { id: 'stone_heart', name: 'Cœur de pierre', icon: '🪨', rarity: 'rare', description: '+6 Défense permanente' },
        dropRate: 30
      },
      {
        item: { id: 'golem_core', name: 'Noyau de golem', icon: '💎', rarity: 'epic', description: '+25 PV permanents' },
        dropRate: 15
      }
    ]
  },
  // Vampire
  {
    monsterId: 'vampire',
    drops: [
      {
        item: { id: 'vampire_fang', name: 'Croc de vampire', icon: '🧛', rarity: 'epic', description: 'Vol de vie +10%' },
        dropRate: 25
      },
      {
        item: { id: 'blood_vial', name: 'Fiole de sang', icon: '🩸', rarity: 'rare', description: '+20 PV permanents' },
        dropRate: 35
      }
    ]
  },
  // Élémentaire
  {
    monsterId: 'fire_elemental',
    drops: [
      {
        item: { id: 'fire_crystal', name: 'Cristal de feu', icon: '🔥', rarity: 'epic', description: '+8 Attaque Magique permanente' },
        dropRate: 30
      },
      {
        item: { id: 'flame_essence', name: 'Essence de flamme', icon: '🌋', rarity: 'rare', description: '+5 Attaque permanente' },
        dropRate: 35
      }
    ]
  },
  // Drake
  {
    monsterId: 'drake',
    drops: [
      {
        item: { id: 'drake_scale', name: 'Écaille de drake', icon: '🐲', rarity: 'epic', description: '+7 Défense et +4 Rés. Magique permanents' },
        dropRate: 30
      },
      {
        item: { id: 'drake_claw', name: 'Griffe de drake', icon: '🦎', rarity: 'rare', description: '+6 Attaque permanente' },
        dropRate: 35
      }
    ]
  },
  // Cyclope
  {
    monsterId: 'cyclops',
    drops: [
      {
        item: { id: 'cyclops_eye', name: 'Œil de cyclope', icon: '👁️', rarity: 'epic', description: '+10 Attaque Magique permanente' },
        dropRate: 25
      },
      {
        item: { id: 'titan_bone', name: 'Os de titan', icon: '🦴', rarity: 'rare', description: '+8 Défense permanente' },
        dropRate: 35
      }
    ]
  },
  // Banshee
  {
    monsterId: 'banshee',
    drops: [
      {
        item: { id: 'banshee_tear', name: 'Larme de banshee', icon: '💧', rarity: 'rare', description: '+5 Attaque Magique permanente' },
        dropRate: 35
      },
      {
        item: { id: 'wailing_essence', name: 'Essence de lamentation', icon: '😭', rarity: 'epic', description: '+8 Résistance Magique permanente' },
        dropRate: 15
      }
    ]
  },
  // Minotaure
  {
    monsterId: 'minotaur',
    drops: [
      {
        item: { id: 'minotaur_horn', name: 'Corne de minotaure', icon: '🐂', rarity: 'rare', description: '+6 Attaque permanente' },
        dropRate: 35
      },
      {
        item: { id: 'labyrinth_map', name: 'Carte du labyrinthe', icon: '🗺️', rarity: 'rare', description: '+3 Vitesse permanente' },
        dropRate: 20
      }
    ]
  },
  // Harpie
  {
    monsterId: 'harpy',
    drops: [
      {
        item: { id: 'harpy_feather', name: 'Plume de harpie', icon: '🪶', rarity: 'common', description: '+2 Vitesse permanente' },
        dropRate: 45
      },
      {
        item: { id: 'razor_talon', name: 'Serre tranchante', icon: '🦅', rarity: 'rare', description: '+4 Attaque permanente' },
        dropRate: 25
      }
    ]
  },
  // Assassin des ombres
  {
    monsterId: 'shadow_assassin',
    drops: [
      {
        item: { id: 'shadow_blade', name: 'Lame d\'ombre', icon: '🗡️', rarity: 'epic', description: '+8 Attaque permanente' },
        dropRate: 25
      },
      {
        item: { id: 'smoke_bomb', name: 'Bombe fumigène', icon: '💨', rarity: 'rare', description: '+4 Vitesse permanente' },
        dropRate: 35
      }
    ]
  },
  // Élémentaire de glace
  {
    monsterId: 'ice_elemental',
    drops: [
      {
        item: { id: 'frost_crystal', name: 'Cristal de givre', icon: '❄️', rarity: 'rare', description: '+6 Attaque Magique permanente' },
        dropRate: 35
      },
      {
        item: { id: 'frozen_heart', name: 'Cœur gelé', icon: '💙', rarity: 'epic', description: '+10 Résistance Magique permanente' },
        dropRate: 15
      }
    ]
  },
  // Chevalier noir
  {
    monsterId: 'dark_knight',
    drops: [
      {
        item: { id: 'cursed_blade', name: 'Lame maudite', icon: '⚔️', rarity: 'epic', description: '+7 Attaque permanente' },
        dropRate: 30
      },
      {
        item: { id: 'dark_plate', name: 'Plaque sombre', icon: '🛡️', rarity: 'rare', description: '+6 Défense permanente' },
        dropRate: 35
      }
    ]
  },
  // Basilic
  {
    monsterId: 'basilisk',
    drops: [
      {
        item: { id: 'basilisk_eye', name: 'Œil de basilic', icon: '👁️', rarity: 'epic', description: '+8 Attaque Magique permanente' },
        dropRate: 25
      },
      {
        item: { id: 'petrified_scale', name: 'Écaille pétrifiée', icon: '🦎', rarity: 'rare', description: '+5 Défense permanente' },
        dropRate: 35
      }
    ]
  },
  // Nécromancien
  {
    monsterId: 'necromancer',
    drops: [
      {
        item: { id: 'skull_staff', name: 'Bâton de crânes', icon: '💀', rarity: 'epic', description: '+9 Attaque Magique permanente' },
        dropRate: 30
      },
      {
        item: { id: 'dark_tome', name: 'Tome sombre', icon: '📕', rarity: 'rare', description: '+5 Résistance Magique permanente' },
        dropRate: 35
      }
    ]
  },
  // Gardien de pierre
  {
    monsterId: 'stone_guardian',
    drops: [
      {
        item: { id: 'ancient_rune', name: 'Rune ancienne', icon: '🪨', rarity: 'epic', description: '+10 Défense permanente' },
        dropRate: 30
      },
      {
        item: { id: 'golem_heart', name: 'Cœur de golem', icon: '💎', rarity: 'rare', description: '+20 PV permanents' },
        dropRate: 35
      }
    ]
  },
  // Chien infernal
  {
    monsterId: 'hell_hound',
    drops: [
      {
        item: { id: 'hellfire_fang', name: 'Croc infernal', icon: '🔥', rarity: 'rare', description: '+5 Attaque permanente' },
        dropRate: 40
      },
      {
        item: { id: 'brimstone', name: 'Pierre de soufre', icon: '🟠', rarity: 'rare', description: '+4 Attaque Magique permanente' },
        dropRate: 30
      }
    ]
  },
  // Spectre vengeur
  {
    monsterId: 'wraith',
    drops: [
      {
        item: { id: 'spirit_shard', name: 'Éclat d\'esprit', icon: '👤', rarity: 'rare', description: '+6 Attaque Magique permanente' },
        dropRate: 35
      },
      {
        item: { id: 'ethereal_cloak', name: 'Cape éthérée', icon: '🧥', rarity: 'epic', description: '+8 Résistance Magique permanente' },
        dropRate: 20
      }
    ]
  }
];

// Drops des Boss (objets plus puissants)
export const BOSS_DROPS: MonsterDrop[] = [
  // Dragon ancien
  {
    monsterId: 'dragon',
    drops: [
      {
        item: { id: 'dragon_heart', name: 'Cœur de Dragon', icon: '❤️‍🔥', rarity: 'legendary', description: '+50 PV max, +10 Attaque et +10 Attaque Magique' },
        dropRate: 100
      },
      {
        item: { id: 'dragon_scale_armor', name: 'Armure d\'écailles de dragon', icon: '🐉', rarity: 'legendary', description: '+15 Défense et +15 Résistance Magique' },
        dropRate: 50
      },
      {
        item: { id: 'dragon_flame', name: 'Flamme éternelle', icon: '🔥', rarity: 'epic', description: 'Sort: Souffle de feu (60 dégâts magiques)' },
        dropRate: 70
      }
    ]
  },
  // Liche
  {
    monsterId: 'lich',
    drops: [
      {
        item: { id: 'lich_phylactery', name: 'Phylactère de la Liche', icon: '💀', rarity: 'legendary', description: '+20 Attaque Magique et +15 Résistance Magique' },
        dropRate: 100
      },
      {
        item: { id: 'staff_of_death', name: 'Bâton de la Mort', icon: '☠️', rarity: 'legendary', description: 'Sort: Rayon mortel (70 dégâts magiques)' },
        dropRate: 60
      },
      {
        item: { id: 'dark_robe', name: 'Robe des ténèbres', icon: '🧙', rarity: 'epic', description: '+12 Attaque Magique et +8 Rés. Magique' },
        dropRate: 75
      }
    ]
  },
  // Seigneur démon
  {
    monsterId: 'demon_lord',
    drops: [
      {
        item: { id: 'demon_crown', name: 'Couronne du Seigneur Démon', icon: '👑', rarity: 'legendary', description: '+15 à toutes les statistiques' },
        dropRate: 100
      },
      {
        item: { id: 'hellfire_blade', name: 'Lame infernale', icon: '⚔️', rarity: 'legendary', description: '+20 Attaque, dégâts bonus contre tous types' },
        dropRate: 55
      },
      {
        item: { id: 'demon_wings', name: 'Ailes démoniaques', icon: '😈', rarity: 'epic', description: '+10 Vitesse et +10 Attaque Magique' },
        dropRate: 70
      }
    ]
  },
  // Hydre
  {
    monsterId: 'hydra',
    drops: [
      {
        item: { id: 'hydra_heads', name: 'Têtes d\'Hydre', icon: '🐍', rarity: 'legendary', description: 'Régénération +10 PV/tour permanent' },
        dropRate: 100
      },
      {
        item: { id: 'hydra_blood', name: 'Sang d\'Hydre', icon: '💉', rarity: 'epic', description: '+40 PV max et +8 Défense' },
        dropRate: 70
      },
      {
        item: { id: 'acid_glands', name: 'Glandes acides', icon: '🧪', rarity: 'epic', description: '+12 Attaque Magique, poison +5/tour' },
        dropRate: 60
      }
    ]
  },
  // Titan des ombres
  {
    monsterId: 'shadow_titan',
    drops: [
      {
        item: { id: 'void_essence', name: 'Essence du Vide', icon: '🌑', rarity: 'legendary', description: '+25 Attaque Magique et +20 Résistance Magique' },
        dropRate: 100
      },
      {
        item: { id: 'titan_gauntlet', name: 'Gantelet du Titan', icon: '🦾', rarity: 'legendary', description: '+15 Attaque et +12 Défense' },
        dropRate: 55
      },
      {
        item: { id: 'shadow_cloak', name: 'Cape d\'ombre', icon: '👤', rarity: 'epic', description: '+12 Vitesse et +10 Résistance Magique' },
        dropRate: 65
      }
    ]
  },
  // === NOUVEAUX BOSS DROPS ===
  // Phénix ardent
  {
    monsterId: 'phoenix',
    drops: [
      {
        item: { id: 'phoenix_feather', name: 'Plume de Phénix', icon: '🔥', rarity: 'legendary', description: 'Résurrection unique avec 50% PV' },
        dropRate: 100
      },
      {
        item: { id: 'eternal_flame', name: 'Flamme éternelle', icon: '🔥', rarity: 'legendary', description: '+20 Attaque Magique permanente' },
        dropRate: 60
      },
      {
        item: { id: 'ash_wings', name: 'Ailes de cendres', icon: '🪶', rarity: 'epic', description: '+10 Vitesse et +8 Attaque Magique' },
        dropRate: 70
      }
    ]
  },
  // Seigneur vampire
  {
    monsterId: 'vampire_lord',
    drops: [
      {
        item: { id: 'blood_crown', name: 'Couronne sanglante', icon: '👑', rarity: 'legendary', description: 'Vol de vie +20% sur toutes les attaques' },
        dropRate: 100
      },
      {
        item: { id: 'crimson_cape', name: 'Cape cramoisie', icon: '🧛', rarity: 'legendary', description: '+15 Attaque et +35 PV permanents' },
        dropRate: 55
      },
      {
        item: { id: 'blood_chalice', name: 'Calice de sang', icon: '🍷', rarity: 'epic', description: '+12 Attaque et régénération +5 PV/tour' },
        dropRate: 70
      }
    ]
  },
  // Géant du givre
  {
    monsterId: 'frost_giant',
    drops: [
      {
        item: { id: 'frozen_crown', name: 'Couronne glaciale', icon: '👑', rarity: 'legendary', description: '+20 Défense et +15 Résistance Magique' },
        dropRate: 100
      },
      {
        item: { id: 'glacier_hammer', name: 'Marteau du glacier', icon: '🔨', rarity: 'legendary', description: '+18 Attaque et ralentit les ennemis' },
        dropRate: 55
      },
      {
        item: { id: 'permafrost_armor', name: 'Armure de permafrost', icon: '🥶', rarity: 'epic', description: '+15 Défense et +40 PV permanents' },
        dropRate: 65
      }
    ]
  },
  // Ange déchu
  {
    monsterId: 'fallen_angel',
    drops: [
      {
        item: { id: 'fallen_halo', name: 'Auréole corrompue', icon: '😇', rarity: 'legendary', description: '+20 Attaque Magique et +15 Résistance Magique' },
        dropRate: 100
      },
      {
        item: { id: 'corrupted_wings', name: 'Ailes corrompues', icon: '🪽', rarity: 'legendary', description: '+15 Vitesse et +10 Attaque' },
        dropRate: 55
      },
      {
        item: { id: 'divine_tear', name: 'Larme divine', icon: '💧', rarity: 'epic', description: 'Sort: Jugement céleste (80 dégâts sacrés)' },
        dropRate: 60
      }
    ]
  },
  // Kraken abyssal
  {
    monsterId: 'kraken',
    drops: [
      {
        item: { id: 'kraken_eye', name: 'Œil du Kraken', icon: '🐙', rarity: 'legendary', description: '+15 à toutes les statistiques' },
        dropRate: 100
      },
      {
        item: { id: 'tentacle_ring', name: 'Anneau tentaculaire', icon: '💍', rarity: 'legendary', description: '+18 Attaque et +12 Défense' },
        dropRate: 55
      },
      {
        item: { id: 'abyssal_ink', name: 'Encre abyssale', icon: '🖤', rarity: 'epic', description: '+12 Attaque Magique et +8 Vitesse' },
        dropRate: 70
      }
    ]
  }
];

// Fonction pour obtenir les drops d'un monstre
export function getMonsterDrops(monster: Monster): InventoryItem[] {
  const drops: InventoryItem[] = [];
  const dropTable = monster.isBoss ? BOSS_DROPS : MONSTER_DROPS;
  
  const monsterDrops = dropTable.find(d => d.monsterId === monster.id);
  
  if (!monsterDrops || monsterDrops.drops.length === 0) {
    // Fallback: générer un item générique basé sur le type de monstre
    const genericDrop = getGenericDrop(monster);
    if (genericDrop) {
      drops.push({ ...genericDrop, obtainedAt: 0 });
    }
    return drops;
  }
  
  if (monster.isBoss) {
    // Les boss donnent TOUS leurs objets
    for (const drop of monsterDrops.drops) {
      drops.push({
        ...drop.item,
        obtainedAt: 0
      });
    }
  } else {
    // Les monstres normaux donnent AU MOINS 1 objet garanti (le premier)
    // + chance de drops supplémentaires
    drops.push({
      ...monsterDrops.drops[0].item,
      obtainedAt: 0
    });
    
    // Drops additionnels selon le dropRate
    for (let i = 1; i < monsterDrops.drops.length; i++) {
      const drop = monsterDrops.drops[i];
      const roll = Math.random() * 100;
      if (roll < drop.dropRate) {
        drops.push({
          ...drop.item,
          obtainedAt: 0
        });
      }
    }
  }
  
  return drops;
}

// Générer un drop générique pour les monstres sans table de drops
function getGenericDrop(monster: Monster): Omit<InventoryItem, 'obtainedAt'> | null {
  const rarity = monster.isBoss ? 'legendary' : (monster.attack > 30 ? 'rare' : 'common');
  const value = monster.isBoss ? 15 : (monster.attack > 30 ? 5 : 2);
  
  const dropTypes = [
    { name: `Trophée de ${monster.name}`, icon: '🏆', stat: 'attack', desc: `+${value} Attaque permanente` },
    { name: `Essence de ${monster.name}`, icon: '✨', stat: 'magicAttack', desc: `+${value} Attaque Magique permanente` },
    { name: `Écaille de ${monster.name}`, icon: '🛡️', stat: 'defense', desc: `+${value} Défense permanente` },
    { name: `Fragment de ${monster.name}`, icon: '💎', stat: 'hp', desc: `+${value * 5} PV permanents` }
  ];
  
  const selectedDrop = dropTypes[Math.floor(Math.random() * dropTypes.length)];
  
  return {
    id: `generic_${monster.id}_${Date.now()}`,
    name: selectedDrop.name,
    icon: selectedDrop.icon,
    rarity,
    description: selectedDrop.desc
  };
}

// Appliquer les effets d'un item drop
export function applyDropEffect(item: InventoryItem, character: any): string[] {
  const effects: string[] = [];
  const desc = item.description.toLowerCase();
  
  // Parser la description pour appliquer les effets
  const attackMatch = desc.match(/\+(\d+)\s*attaque\s*permanente/i);
  if (attackMatch) {
    const value = parseInt(attackMatch[1]);
    character.attack += value;
    effects.push(`+${value} ⚔️ Attaque`);
  }
  
  const magicAttackMatch = desc.match(/\+(\d+)\s*attaque\s*magique/i);
  if (magicAttackMatch) {
    const value = parseInt(magicAttackMatch[1]);
    character.magicAttack = (character.magicAttack || 0) + value;
    effects.push(`+${value} ✨ Att. Magique`);
  }
  
  const defenseMatch = desc.match(/\+(\d+)\s*d[ée]fense\s*permanente/i);
  if (defenseMatch) {
    const value = parseInt(defenseMatch[1]);
    character.defense += value;
    effects.push(`+${value} 🛡️ Défense`);
  }
  
  const magicDefMatch = desc.match(/\+(\d+)\s*r[ée]sistance\s*magique/i);
  if (magicDefMatch) {
    const value = parseInt(magicDefMatch[1]);
    character.magicDefense = (character.magicDefense || 0) + value;
    effects.push(`+${value} 🔮 Rés. Magique`);
  }
  
  const hpMatch = desc.match(/\+(\d+)\s*pv\s*(permanents|max)?/i);
  if (hpMatch) {
    const value = parseInt(hpMatch[1]);
    character.maxHp += value;
    character.hp += value;
    effects.push(`+${value} ❤️ PV`);
  }
  
  const speedMatch = desc.match(/\+(\d+)\s*vitesse/i);
  if (speedMatch) {
    const value = parseInt(speedMatch[1]);
    character.speed += value;
    effects.push(`+${value} 💨 Vitesse`);
  }
  
  // Cas spéciaux pour les stats multiples
  const allStatsMatch = desc.match(/\+(\d+)\s*[àa]\s*toutes\s*les\s*statistiques/i);
  if (allStatsMatch) {
    const value = parseInt(allStatsMatch[1]);
    character.attack += value;
    character.magicAttack = (character.magicAttack || 0) + value;
    character.defense += value;
    character.magicDefense = (character.magicDefense || 0) + value;
    character.speed += value;
    character.maxHp += value * 3;
    character.hp += value * 3;
    effects.push(`+${value} à toutes les stats`);
  }
  
  return effects;
}

