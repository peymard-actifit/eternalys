import { Monster, InventoryItem } from '../types/game.types';

// ============================================
// SYSTÈME DE DROPS PROPORTIONNELS AU CR v2.3.0
// ============================================
// CR 0-1: Commun uniquement (bonus +1-3)
// CR 2-4: Commun + Rare (bonus +2-5)
// CR 5-9: Rare + Épique (bonus +4-8)
// CR 10+: Épique + Légendaire (bonus +8-15)
// Boss: Toujours Légendaire (bonus +12-20)
// ============================================

export interface MonsterDrop {
  monsterId: string;
  drops: {
    item: Omit<InventoryItem, 'obtainedAt'>;
    dropRate: number;
  }[];
}

// Types d'effets pour les drops
type DropEffectType = 
  | 'stat_attack' | 'stat_magic' | 'stat_defense' | 'stat_magic_defense' | 'stat_speed' | 'stat_hp'
  | 'critical' | 'lifesteal' | 'thorns' | 'regeneration' | 'evasion'
  | 'resist_fire' | 'resist_cold' | 'resist_lightning' | 'resist_poison' | 'resist_necrotic'
  | 'skill_fire' | 'skill_cold' | 'skill_lightning' | 'skill_holy' | 'skill_necrotic' | 'skill_heal';

// Générer un drop basé sur le CR du monstre
function generateCRBasedDrop(monster: Monster, effectType: DropEffectType): Omit<InventoryItem, 'obtainedAt'> {
  const cr = monster.challengeRating || 1;
  const isBoss = monster.isBoss;
  
  // Déterminer la rareté et les valeurs selon le CR
  let rarity: 'common' | 'rare' | 'epic' | 'legendary';
  let baseValue: number;
  let bonusMultiplier: number;
  
  if (isBoss) {
    rarity = 'legendary';
    baseValue = 12 + Math.floor(cr / 2);
    bonusMultiplier = 1.5;
  } else if (cr >= 10) {
    rarity = Math.random() < 0.4 ? 'legendary' : 'epic';
    baseValue = 8 + Math.floor(cr / 3);
    bonusMultiplier = 1.2;
  } else if (cr >= 5) {
    rarity = Math.random() < 0.3 ? 'epic' : 'rare';
    baseValue = 4 + Math.floor(cr / 2);
    bonusMultiplier = 1;
  } else if (cr >= 2) {
    rarity = Math.random() < 0.25 ? 'rare' : 'common';
    baseValue = 2 + cr;
    bonusMultiplier = 0.8;
  } else {
    rarity = 'common';
    baseValue = 1 + cr;
    bonusMultiplier = 0.6;
  }
  
  const value = Math.floor(baseValue * bonusMultiplier);
  const percentValue = Math.floor((5 + cr * 2) * bonusMultiplier); // Pour les effets en %
  
  // Générer l'item selon le type d'effet
  switch (effectType) {
    case 'stat_attack':
      return {
        id: `drop_atk_${monster.id}_${Date.now()}`,
        name: `Griffe de ${monster.name}`,
        icon: '🗡️',
        rarity,
        description: `+${value} Attaque permanente`
      };
    case 'stat_magic':
      return {
        id: `drop_mag_${monster.id}_${Date.now()}`,
        name: `Essence de ${monster.name}`,
        icon: '✨',
        rarity,
        description: `+${value} Attaque Magique permanente`
      };
    case 'stat_defense':
      return {
        id: `drop_def_${monster.id}_${Date.now()}`,
        name: `Écaille de ${monster.name}`,
        icon: '🛡️',
        rarity,
        description: `+${value} Défense permanente`
      };
    case 'stat_magic_defense':
      return {
        id: `drop_mdef_${monster.id}_${Date.now()}`,
        name: `Amulette de ${monster.name}`,
        icon: '🔮',
        rarity,
        description: `+${value} Résistance Magique permanente`
      };
    case 'stat_speed':
      return {
        id: `drop_spd_${monster.id}_${Date.now()}`,
        name: `Plume de ${monster.name}`,
        icon: '💨',
        rarity,
        description: `+${Math.floor(value * 0.7)} Vitesse permanente`
      };
    case 'stat_hp':
      return {
        id: `drop_hp_${monster.id}_${Date.now()}`,
        name: `Cœur de ${monster.name}`,
        icon: '❤️',
        rarity,
        description: `+${value * 4} PV permanents`
      };
    case 'critical':
      return {
        id: `drop_crit_${monster.id}_${Date.now()}`,
        name: `Œil perçant de ${monster.name}`,
        icon: '🎯',
        rarity,
        description: `+${percentValue}% chance de coup critique`
      };
    case 'lifesteal':
      return {
        id: `drop_life_${monster.id}_${Date.now()}`,
        name: `Croc vampirique de ${monster.name}`,
        icon: '🩸',
        rarity,
        description: `Vol de vie ${percentValue}%`
      };
    case 'thorns':
      return {
        id: `drop_thorns_${monster.id}_${Date.now()}`,
        name: `Épine de ${monster.name}`,
        icon: '🌵',
        rarity,
        description: `Renvoie ${percentValue}% des dégâts reçus`
      };
    case 'regeneration':
      return {
        id: `drop_regen_${monster.id}_${Date.now()}`,
        name: `Cœur régénérant de ${monster.name}`,
        icon: '💚',
        rarity,
        description: `Régénère ${Math.floor(value / 2)} PV par tour`
      };
    case 'evasion':
      return {
        id: `drop_eva_${monster.id}_${Date.now()}`,
        name: `Cape d'ombre de ${monster.name}`,
        icon: '👤',
        rarity,
        description: `${Math.floor(percentValue * 0.7)}% de chance d'esquiver`
      };
    case 'resist_fire':
      return {
        id: `drop_rfire_${monster.id}_${Date.now()}`,
        name: `Écaille ignifugée de ${monster.name}`,
        icon: '🔥',
        rarity,
        description: `Résistance au Feu (50% dégâts)`
      };
    case 'resist_cold':
      return {
        id: `drop_rcold_${monster.id}_${Date.now()}`,
        name: `Cristal glacé de ${monster.name}`,
        icon: '❄️',
        rarity,
        description: `Résistance au Froid (50% dégâts)`
      };
    case 'resist_lightning':
      return {
        id: `drop_rlight_${monster.id}_${Date.now()}`,
        name: `Conducteur de ${monster.name}`,
        icon: '⚡',
        rarity,
        description: `Résistance à la Foudre (50% dégâts)`
      };
    case 'resist_poison':
      return {
        id: `drop_rpoison_${monster.id}_${Date.now()}`,
        name: `Glande antivenin de ${monster.name}`,
        icon: '☠️',
        rarity,
        description: `Résistance au Poison (50% dégâts)`
      };
    case 'resist_necrotic':
      return {
        id: `drop_rnecro_${monster.id}_${Date.now()}`,
        name: `Amulette sacrée de ${monster.name}`,
        icon: '✝️',
        rarity,
        description: `Résistance Nécrotique (50% dégâts)`
      };
    case 'skill_fire':
      return {
        id: `drop_sfire_${monster.id}_${Date.now()}`,
        name: `Flamme de ${monster.name}`,
        icon: '🔥',
        rarity,
        description: `Sort: Boule de Feu (${value * 3} dégâts de feu)`
      };
    case 'skill_cold':
      return {
        id: `drop_scold_${monster.id}_${Date.now()}`,
        name: `Givre de ${monster.name}`,
        icon: '❄️',
        rarity,
        description: `Sort: Rayon de Givre (${value * 3} dégâts de froid)`
      };
    case 'skill_lightning':
      return {
        id: `drop_slight_${monster.id}_${Date.now()}`,
        name: `Foudre de ${monster.name}`,
        icon: '⚡',
        rarity,
        description: `Sort: Éclair (${value * 3} dégâts de foudre)`
      };
    case 'skill_holy':
      return {
        id: `drop_sholy_${monster.id}_${Date.now()}`,
        name: `Lumière de ${monster.name}`,
        icon: '☀️',
        rarity,
        description: `Sort: Lumière Sacrée (${value * 3} dégâts radiants)`
      };
    case 'skill_necrotic':
      return {
        id: `drop_snecro_${monster.id}_${Date.now()}`,
        name: `Ombre de ${monster.name}`,
        icon: '💀',
        rarity,
        description: `Sort: Drain de Vie (${value * 3} dégâts nécrotiques)`
      };
    case 'skill_heal':
      return {
        id: `drop_sheal_${monster.id}_${Date.now()}`,
        name: `Larme de ${monster.name}`,
        icon: '💧',
        rarity,
        description: `Sort: Soin (${value * 4} PV)`
      };
  }
}

// Déterminer les types de drops possibles selon le type de créature
function getDropTypesForMonster(monster: Monster): DropEffectType[] {
  const types: DropEffectType[] = [];
  const creatureType = monster.creatureType;
  
  // Types de base toujours disponibles
  types.push('stat_attack', 'stat_defense', 'stat_hp');
  
  // Types spécifiques selon la créature
  switch (creatureType) {
    case 'undead':
      types.push('resist_necrotic', 'skill_necrotic', 'lifesteal');
      break;
    case 'fiend':
      types.push('resist_fire', 'skill_fire', 'stat_magic', 'lifesteal');
      break;
    case 'dragon':
      types.push('resist_fire', 'skill_fire', 'stat_magic_defense', 'critical');
      break;
    case 'elemental':
      types.push('stat_magic', 'skill_fire', 'skill_cold', 'skill_lightning', 'resist_fire', 'resist_cold');
      break;
    case 'beast':
      types.push('stat_speed', 'critical', 'evasion');
      break;
    case 'humanoid':
      types.push('stat_magic', 'stat_speed', 'critical', 'skill_heal');
      break;
    case 'celestial':
      types.push('skill_holy', 'skill_heal', 'stat_magic_defense', 'regeneration');
      break;
    case 'aberration':
      types.push('stat_magic', 'resist_poison', 'evasion');
      break;
    case 'construct':
      types.push('stat_defense', 'stat_magic_defense', 'thorns');
      break;
    case 'giant':
      types.push('stat_hp', 'stat_attack', 'thorns');
      break;
    case 'monstrosity':
      types.push('resist_poison', 'critical', 'lifesteal');
      break;
    case 'ooze':
      types.push('resist_poison', 'stat_magic_defense', 'regeneration');
      break;
    case 'plant':
      types.push('resist_poison', 'regeneration', 'stat_hp');
      break;
    case 'fey':
      types.push('stat_magic', 'evasion', 'skill_cold', 'stat_speed');
      break;
    default:
      types.push('stat_magic', 'stat_speed', 'stat_magic_defense');
  }
  
  return types;
}

// Fonction principale pour obtenir les drops d'un monstre
export function getMonsterDrops(monster: Monster): InventoryItem[] {
  const drops: InventoryItem[] = [];
  const cr = monster.challengeRating || 1;
  const isBoss = monster.isBoss;
  
  // Nombre de drops selon le CR et si c'est un boss
  let numDrops: number;
  if (isBoss) {
    numDrops = 3; // Les boss donnent toujours 3 items
  } else if (cr >= 10) {
    numDrops = Math.random() < 0.5 ? 2 : 1;
  } else if (cr >= 5) {
    numDrops = Math.random() < 0.3 ? 2 : 1;
  } else {
    numDrops = 1;
  }
  
  // Obtenir les types de drops possibles pour ce monstre
  const possibleTypes = getDropTypesForMonster(monster);
  const usedTypes: Set<DropEffectType> = new Set();
  
  for (let i = 0; i < numDrops; i++) {
    // Filtrer les types déjà utilisés
    const availableTypes = possibleTypes.filter(t => !usedTypes.has(t));
    if (availableTypes.length === 0) break;
    
    // Choisir un type aléatoire
    const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    usedTypes.add(selectedType);
    
    // Générer l'item
    const item = generateCRBasedDrop(monster, selectedType);
    drops.push({ ...item, obtainedAt: 0 });
  }
  
  return drops;
}

// Appliquer les effets d'un item drop (système D&D)
export function applyDropEffect(item: InventoryItem, character: any): string[] {
  const effects: string[] = [];
  const desc = item.description.toLowerCase();
  
  // Bonus de Force (remplace l'ancien bonus d'attaque)
  const strMatch = desc.match(/\+(\d+)\s*(force|attaque\s*permanente)/i);
  if (strMatch) {
    const value = parseInt(strMatch[1]);
    if (character.abilities) {
      character.abilities.strength = (character.abilities.strength || 10) + value;
    }
    effects.push(`+${value} 💪 Force`);
  }
  
  // Bonus d'Intelligence (remplace l'ancien bonus d'attaque magique)
  const intMatch = desc.match(/\+(\d+)\s*(intelligence|attaque\s*magique)/i);
  if (intMatch) {
    const value = parseInt(intMatch[1]);
    if (character.abilities) {
      character.abilities.intelligence = (character.abilities.intelligence || 10) + value;
    }
    effects.push(`+${value} 📚 Intelligence`);
  }
  
  // Bonus de CA (remplace l'ancien bonus de défense)
  const acMatch = desc.match(/\+(\d+)\s*(ca|classe\s*d'armure|d[ée]fense\s*permanente)/i);
  if (acMatch) {
    const value = parseInt(acMatch[1]);
    character.armorClass = (character.armorClass || 10) + value;
    effects.push(`+${value} 🛡️ CA`);
  }
  
  // Bonus de Sagesse (remplace l'ancien bonus de résistance magique)
  const wisMatch = desc.match(/\+(\d+)\s*(sagesse|r[ée]sistance\s*magique)/i);
  if (wisMatch) {
    const value = parseInt(wisMatch[1]);
    if (character.abilities) {
      character.abilities.wisdom = (character.abilities.wisdom || 10) + value;
    }
    effects.push(`+${value} 👁️ Sagesse`);
  }
  
  // Bonus de Constitution (PV)
  const conMatch = desc.match(/\+(\d+)\s*constitution/i);
  if (conMatch) {
    const value = parseInt(conMatch[1]);
    if (character.abilities) {
      character.abilities.constitution = (character.abilities.constitution || 10) + value;
    }
    // Bonus aux PV (environ 1 PV par niveau par point de CON)
    const hpBonus = value * (character.level || 1);
    character.maxHp = (character.maxHp || 10) + hpBonus;
    character.hp = (character.hp || 10) + hpBonus;
    effects.push(`+${value} ❤️ Constitution (+${hpBonus} PV)`);
  }
  
  const hpMatch = desc.match(/\+(\d+)\s*pv\s*(permanents)?/i);
  if (hpMatch) {
    const value = parseInt(hpMatch[1]);
    character.maxHp = (character.maxHp || 10) + value;
    character.hp = (character.hp || 10) + value;
    effects.push(`+${value} ❤️ PV`);
  }
  
  const speedMatch = desc.match(/\+(\d+)\s*vitesse/i);
  if (speedMatch) {
    const value = parseInt(speedMatch[1]);
    character.speed = (character.speed || 30) + value;
    effects.push(`+${value} 💨 Vitesse`);
  }
  
  // Bonus de Dextérité
  const dexMatch = desc.match(/\+(\d+)\s*dext[ée]rit[ée]/i);
  if (dexMatch) {
    const value = parseInt(dexMatch[1]);
    if (character.abilities) {
      character.abilities.dexterity = (character.abilities.dexterity || 10) + value;
    }
    effects.push(`+${value} 🏃 Dextérité`);
  }
  
  // Bonus de Charisme
  const chaMatch = desc.match(/\+(\d+)\s*charisme/i);
  if (chaMatch) {
    const value = parseInt(chaMatch[1]);
    if (character.abilities) {
      character.abilities.charisma = (character.abilities.charisma || 10) + value;
    }
    effects.push(`+${value} 💬 Charisme`);
  }
  
  // Effets passifs (stockés pour le combat)
  const critMatch = desc.match(/\+(\d+)%\s*chance\s*de\s*coup\s*critique/i);
  if (critMatch) {
    effects.push(`+${critMatch[1]}% 🎯 Critique`);
  }
  
  const lifestealMatch = desc.match(/vol\s*de\s*vie\s*(\d+)%/i);
  if (lifestealMatch) {
    effects.push(`🩸 Vol de vie ${lifestealMatch[1]}%`);
  }
  
  const thornsMatch = desc.match(/renvoie\s*(\d+)%/i);
  if (thornsMatch) {
    effects.push(`🌵 Épines ${thornsMatch[1]}%`);
  }
  
  const regenMatch = desc.match(/r[ée]g[ée]n[èe]re\s*(\d+)\s*pv/i);
  if (regenMatch) {
    effects.push(`💚 Régén ${regenMatch[1]} PV/tour`);
  }
  
  const evasionMatch = desc.match(/(\d+)%\s*de\s*chance\s*d'esquiver/i);
  if (evasionMatch) {
    effects.push(`👤 Esquive ${evasionMatch[1]}%`);
  }
  
  // Résistances
  const resistFireMatch = desc.match(/r[ée]sistance\s*au\s*feu/i);
  if (resistFireMatch) {
    effects.push(`🔥 Résistance Feu`);
  }
  
  const resistColdMatch = desc.match(/r[ée]sistance\s*au\s*froid/i);
  if (resistColdMatch) {
    effects.push(`❄️ Résistance Froid`);
  }
  
  const resistLightMatch = desc.match(/r[ée]sistance\s*[àa]\s*la\s*foudre/i);
  if (resistLightMatch) {
    effects.push(`⚡ Résistance Foudre`);
  }
  
  const resistPoisonMatch = desc.match(/r[ée]sistance\s*au\s*poison/i);
  if (resistPoisonMatch) {
    effects.push(`☠️ Résistance Poison`);
  }
  
  const resistNecroMatch = desc.match(/r[ée]sistance\s*n[ée]crotique/i);
  if (resistNecroMatch) {
    effects.push(`✝️ Résistance Nécro`);
  }
  
  // Sorts (ajouter comme compétence)
  const skillMatch = desc.match(/sort:\s*([^\(]+)\s*\((\d+)\s*d[ée]g[aâ]ts?\s*(de\s*)?([^\)]+)?\)/i);
  if (skillMatch) {
    const skillName = skillMatch[1].trim();
    const skillDamage = parseInt(skillMatch[2]);
    const skillDamageType = skillMatch[4]?.trim() || 'magical';
    
    // Mapper le type de dégâts
    let damageType: string = 'magical';
    if (skillDamageType.includes('feu')) damageType = 'fire';
    else if (skillDamageType.includes('froid')) damageType = 'cold';
    else if (skillDamageType.includes('foudre')) damageType = 'lightning';
    else if (skillDamageType.includes('radiant')) damageType = 'radiant';
    else if (skillDamageType.includes('n[ée]crotique')) damageType = 'necrotic';
    
    // Ajouter la compétence au personnage
    if (!character.skills) character.skills = [];
    character.skills.push({
      id: `skill_${item.id}_${Date.now()}`,
      name: skillName,
      damage: skillDamage,
      type: 'damage',
      damageType,
      targetType: 'enemy',
      description: `${skillDamage} dégâts ${skillDamageType}`,
      cooldown: 2
    });
    
    effects.push(`✨ Sort: ${skillName}`);
  }
  
  // Sorts de soin
  const healSkillMatch = desc.match(/sort:\s*soin\s*\((\d+)\s*pv\)/i);
  if (healSkillMatch) {
    const healAmount = parseInt(healSkillMatch[1]);
    
    if (!character.skills) character.skills = [];
    character.skills.push({
      id: `heal_${item.id}_${Date.now()}`,
      name: 'Soin',
      damage: healAmount,
      type: 'heal',
      targetType: 'ally',
      description: `Restaure ${healAmount} PV`,
      cooldown: 3
    });
    
    effects.push(`💚 Sort: Soin`);
  }
  
  return effects;
}
