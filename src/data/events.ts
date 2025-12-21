import { GameEvent } from '../types/game.types';

// =============================================================================
// ÉVÉNEMENTS ÉQUILIBRÉS D&D 5e - v2.30
// =============================================================================
// Valeurs calibrées pour être significatives mais pas écrasantes :
// - Soins : 5-15 PV (niveau bas), correspond à des sorts de niveau 1
// - Buffs caractéristiques : +1 à +2 (comme D&D 5e, très significatif)
// - Buffs CA : +1 à +2 (très puissant en D&D)
// - Dégâts : 3-12 PV (pièges dangereux mais survivables)
// =============================================================================

export const POSITIVE_EVENTS: GameEvent[] = [
  // === SOINS ===
  {
    id: 'healing_spring',
    name: 'Source de guérison',
    description: 'Vous découvrez une source magique aux eaux cristallines. Toute l\'équipe récupère des points de vie !',
    type: 'positive',
    effect: { type: 'heal', value: 8, target: 'all' }
  },
  {
    id: 'wandering_healer',
    name: 'Guérisseur errant',
    description: 'Un mystérieux guérisseur apparaît et soigne le membre le plus faible de votre équipe.',
    type: 'positive',
    effect: { type: 'heal', value: 12, target: 'weakest' }
  },
  {
    id: 'sacred_altar',
    name: 'Autel sacré',
    description: 'Vous priez devant un autel ancien. Une lumière divine restaure vos forces.',
    type: 'positive',
    effect: { type: 'heal', value: 10, target: 'all' }
  },
  {
    id: 'oasis_cachee',
    name: 'Oasis cachée',
    description: 'Une oasis secrète offre repos et réconfort à vos héros fatigués.',
    type: 'positive',
    effect: { type: 'heal', value: 6, target: 'all' }
  },
  {
    id: 'esprit_guerisseur',
    name: 'Esprit guérisseur',
    description: 'Un esprit bienveillant soigne vos blessures les plus graves.',
    type: 'positive',
    effect: { type: 'heal', value: 15, target: 'weakest' }
  },
  
  // === BUFFS FORCE (Attaque physique) ===
  {
    id: 'ancient_blessing',
    name: 'Bénédiction ancienne',
    description: 'Un esprit bienveillant bénit votre équipe. La Force de tous augmente de +1 !',
    type: 'positive',
    effect: { type: 'buff_strength', value: 1, target: 'all' }
  },
  {
    id: 'hero_spirit',
    name: 'Esprit du héros',
    description: 'L\'esprit d\'un ancien héros vous transmet sa force. Le plus fort gagne +2 Force !',
    type: 'positive',
    effect: { type: 'buff_strength', value: 2, target: 'strongest' }
  },
  {
    id: 'forge_divine',
    name: 'Forge divine',
    description: 'Vous découvrez une forge ancienne qui renforce vos muscles.',
    type: 'positive',
    effect: { type: 'buff_strength', value: 1, target: 'all' }
  },
  {
    id: 'rage_bataille',
    name: 'Rage de bataille',
    description: 'Une fureur ancestrale s\'empare d\'un de vos guerriers ! +2 Force !',
    type: 'positive',
    effect: { type: 'buff_strength', value: 2, target: 'random' }
  },
  
  // === BUFFS INTELLIGENCE (Attaque magique) ===
  {
    id: 'arcane_knowledge',
    name: 'Savoir arcanique',
    description: 'Vous découvrez d\'anciens grimoires. L\'Intelligence de tous augmente de +1 !',
    type: 'positive',
    effect: { type: 'buff_intelligence', value: 1, target: 'all' }
  },
  {
    id: 'mana_crystal',
    name: 'Cristal de mana',
    description: 'Un cristal brillant infuse votre équipe d\'énergie arcanique. +1 Intelligence !',
    type: 'positive',
    effect: { type: 'buff_intelligence', value: 1, target: 'all' }
  },
  {
    id: 'archmage_blessing',
    name: 'Bénédiction de l\'archimage',
    description: 'Le fantôme d\'un archimage vous bénit. Un membre gagne +2 Intelligence !',
    type: 'positive',
    effect: { type: 'buff_intelligence', value: 2, target: 'random' }
  },
  {
    id: 'elemental_surge',
    name: 'Surge élémentaire',
    description: 'Les éléments se déchaînent en votre faveur. +1 Intelligence pour tous !',
    type: 'positive',
    effect: { type: 'buff_intelligence', value: 1, target: 'all' }
  },
  
  // === BUFFS SAGESSE ===
  {
    id: 'meditation_profonde',
    name: 'Méditation profonde',
    description: 'Un lieu de sérénité vous permet de méditer. +1 Sagesse pour tous !',
    type: 'positive',
    effect: { type: 'buff_wisdom', value: 1, target: 'all' }
  },
  {
    id: 'vision_divine',
    name: 'Vision divine',
    description: 'Une vision mystique éclaire votre esprit. +2 Sagesse !',
    type: 'positive',
    effect: { type: 'buff_wisdom', value: 2, target: 'random' }
  },
  
  // === BUFFS CONSTITUTION ===
  {
    id: 'vitalite_ancienne',
    name: 'Vitalité ancienne',
    description: 'Une énergie vitale ancestrale renforce votre corps. +1 Constitution !',
    type: 'positive',
    effect: { type: 'buff_constitution', value: 1, target: 'all' }
  },
  {
    id: 'endurance_heroique',
    name: 'Endurance héroïque',
    description: 'Le membre le plus faible reçoit une bénédiction de vigueur. +2 Constitution !',
    type: 'positive',
    effect: { type: 'buff_constitution', value: 2, target: 'weakest' }
  },
  
  // === BUFFS DEXTÉRITÉ ===
  {
    id: 'grace_elfique',
    name: 'Grâce elfique',
    description: 'Un enchantement ancien améliore vos réflexes. +1 Dextérité !',
    type: 'positive',
    effect: { type: 'buff_dexterity', value: 1, target: 'all' }
  },
  {
    id: 'agilite_feline',
    name: 'Agilité féline',
    description: 'Vous vous sentez léger comme une plume. +2 Dextérité !',
    type: 'positive',
    effect: { type: 'buff_dexterity', value: 2, target: 'random' }
  },
  
  // === BUFFS CLASSE D'ARMURE ===
  {
    id: 'guardian_spirit',
    name: 'Esprit gardien',
    description: 'Un esprit protecteur renforce vos défenses. +1 CA pour tous !',
    type: 'positive',
    effect: { type: 'buff_armorClass', value: 1, target: 'all' }
  },
  {
    id: 'fairy_dust',
    name: 'Poussière de fée',
    description: 'Des fées répandent leur poussière magique. +2 CA pour tous !',
    type: 'positive',
    effect: { type: 'buff_armorClass', value: 2, target: 'all' }
  },
  {
    id: 'benediction_acier',
    name: 'Bénédiction d\'acier',
    description: 'Vos armures brillent d\'une lueur protectrice. +1 CA !',
    type: 'positive',
    effect: { type: 'buff_armorClass', value: 1, target: 'all' }
  },
  {
    id: 'protection_ancestrale',
    name: 'Protection ancestrale',
    description: 'Les esprits de vos ancêtres veillent sur le plus vulnérable. +2 CA !',
    type: 'positive',
    effect: { type: 'buff_armorClass', value: 2, target: 'weakest' }
  }
];

export const NEGATIVE_EVENTS: GameEvent[] = [
  // === DÉGÂTS ===
  {
    id: 'poison_trap',
    name: 'Piège empoisonné',
    description: 'Vous déclenchez un piège ! Du gaz toxique blesse légèrement toute l\'équipe.',
    type: 'negative',
    effect: { type: 'damage', value: 4, target: 'all' }
  },
  {
    id: 'dark_magic',
    name: 'Magie noire',
    description: 'Des runes sombres s\'activent et blessent un membre au hasard.',
    type: 'negative',
    effect: { type: 'damage', value: 8, target: 'random' }
  },
  {
    id: 'shadow_attack',
    name: 'Attaque de l\'ombre',
    description: 'Une ombre surgit et frappe le membre le plus fort !',
    type: 'negative',
    effect: { type: 'damage', value: 10, target: 'strongest' }
  },
  {
    id: 'falling_rocks',
    name: 'Éboulement',
    description: 'Le plafond s\'effondre partiellement ! Des rochers tombent.',
    type: 'negative',
    effect: { type: 'damage', value: 6, target: 'all' }
  },
  {
    id: 'phantom_strike',
    name: 'Frappe spectrale',
    description: 'Un fantôme attaque le membre le plus faible.',
    type: 'negative',
    effect: { type: 'damage', value: 12, target: 'weakest' }
  },
  {
    id: 'explosion_arcane',
    name: 'Explosion arcanique',
    description: 'Une gemme instable explose !',
    type: 'negative',
    effect: { type: 'damage', value: 5, target: 'all' }
  },
  {
    id: 'fleches_poison',
    name: 'Flèches empoisonnées',
    description: 'Des flèches surgissent des murs.',
    type: 'negative',
    effect: { type: 'damage', value: 7, target: 'random' }
  },
  
  // === DEBUFFS FORCE ===
  {
    id: 'cursed_room',
    name: 'Salle maudite',
    description: 'Une malédiction affaiblit votre Force. -1 Force pour tous.',
    type: 'negative',
    effect: { type: 'debuff_strength', value: 1, target: 'all' }
  },
  {
    id: 'cursed_artifact',
    name: 'Artefact maudit',
    description: 'Vous touchez un artefact maudit. -2 Force pour tous.',
    type: 'negative',
    effect: { type: 'debuff_strength', value: 2, target: 'all' }
  },
  {
    id: 'fatigue_combat',
    name: 'Fatigue de combat',
    description: 'L\'épuisement vous gagne. -1 Force.',
    type: 'negative',
    effect: { type: 'debuff_strength', value: 1, target: 'all' }
  },
  
  // === DEBUFFS INTELLIGENCE ===
  {
    id: 'mana_drain',
    name: 'Drainage de mana',
    description: 'Un sortilège aspire votre énergie magique. -1 Intelligence.',
    type: 'negative',
    effect: { type: 'debuff_intelligence', value: 1, target: 'all' }
  },
  {
    id: 'antimagic_field',
    name: 'Champ antimagie',
    description: 'Un champ supprime une partie de vos pouvoirs. -2 Intelligence.',
    type: 'negative',
    effect: { type: 'debuff_intelligence', value: 2, target: 'all' }
  },
  {
    id: 'void_touch',
    name: 'Toucher du vide',
    description: 'Une entité du vide touche votre mage le plus puissant. -2 Intelligence.',
    type: 'negative',
    effect: { type: 'debuff_intelligence', value: 2, target: 'strongest' }
  },
  {
    id: 'silence_magique',
    name: 'Silence magique',
    description: 'Une aura de silence étouffe vos pouvoirs. -1 Intelligence.',
    type: 'negative',
    effect: { type: 'debuff_intelligence', value: 1, target: 'all' }
  },
  
  // === DEBUFFS SAGESSE ===
  {
    id: 'confusion_mentale',
    name: 'Confusion mentale',
    description: 'Un brouillard mental obscurcit vos pensées. -1 Sagesse.',
    type: 'negative',
    effect: { type: 'debuff_wisdom', value: 1, target: 'all' }
  },
  {
    id: 'cauchemar_eveille',
    name: 'Cauchemar éveillé',
    description: 'Des visions horrifiques troublent votre esprit. -2 Sagesse.',
    type: 'negative',
    effect: { type: 'debuff_wisdom', value: 2, target: 'random' }
  },
  
  // === DEBUFFS CLASSE D'ARMURE ===
  {
    id: 'weakening_aura',
    name: 'Aura d\'affaiblissement',
    description: 'Une aura maléfique fragilise vos défenses. -1 CA.',
    type: 'negative',
    effect: { type: 'debuff_armorClass', value: 1, target: 'all' }
  },
  {
    id: 'corrosion_armure',
    name: 'Corrosion d\'armure',
    description: 'Un acide ronge vos équipements. -2 CA.',
    type: 'negative',
    effect: { type: 'debuff_armorClass', value: 2, target: 'all' }
  },
  {
    id: 'malefice_fragilite',
    name: 'Maléfice de fragilité',
    description: 'Un sortilège vous rend vulnérable. -2 CA.',
    type: 'negative',
    effect: { type: 'debuff_armorClass', value: 2, target: 'random' }
  }
];

export function getRandomEvent(): GameEvent {
  const isPositive = Math.random() < 0.5;
  const events = isPositive ? POSITIVE_EVENTS : NEGATIVE_EVENTS;
  const index = Math.floor(Math.random() * events.length);
  return events[index];
}
