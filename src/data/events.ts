import { GameEvent } from '../types/game.types';

export const POSITIVE_EVENTS: GameEvent[] = [
  // Soins
  {
    id: 'healing_spring',
    name: 'Source de guérison',
    description: 'Vous découvrez une source magique aux eaux cristallines. Toute l\'équipe récupère des points de vie !',
    type: 'positive',
    effect: { type: 'heal', value: 30, target: 'all' }
  },
  {
    id: 'wandering_healer',
    name: 'Guérisseur errant',
    description: 'Un mystérieux guérisseur apparaît et soigne le membre le plus faible de votre équipe.',
    type: 'positive',
    effect: { type: 'heal', value: 50, target: 'weakest' }
  },
  {
    id: 'sacred_altar',
    name: 'Autel sacré',
    description: 'Vous priez devant un autel ancien. Une lumière divine restaure vos forces.',
    type: 'positive',
    effect: { type: 'heal', value: 40, target: 'all' }
  },
  {
    id: 'oasis_cachee',
    name: 'Oasis cachée',
    description: 'Une oasis secrète offre repos et réconfort à vos héros fatigués.',
    type: 'positive',
    effect: { type: 'heal', value: 35, target: 'all' }
  },
  {
    id: 'esprit_guerisseur',
    name: 'Esprit guérisseur',
    description: 'Un esprit bienveillant soigne vos blessures les plus graves.',
    type: 'positive',
    effect: { type: 'heal', value: 60, target: 'weakest' }
  },
  
  // Buffs Attaque Physique
  {
    id: 'ancient_blessing',
    name: 'Bénédiction ancienne',
    description: 'Un esprit bienveillant bénit votre équipe. L\'attaque physique de tous les membres augmente !',
    type: 'positive',
    effect: { type: 'buff_attack', value: 5, target: 'all' }
  },
  {
    id: 'hero_spirit',
    name: 'Esprit du héros',
    description: 'L\'esprit d\'un ancien héros vous transmet sa force. Le plus fort devient encore plus puissant !',
    type: 'positive',
    effect: { type: 'buff_attack', value: 12, target: 'strongest' }
  },
  {
    id: 'forge_divine',
    name: 'Forge divine',
    description: 'Vous découvrez une forge ancienne qui renforce vos armes.',
    type: 'positive',
    effect: { type: 'buff_attack', value: 4, target: 'all' }
  },
  {
    id: 'rage_bataille',
    name: 'Rage de bataille',
    description: 'Une fureur ancestrale s\'empare de vos guerriers !',
    type: 'positive',
    effect: { type: 'buff_attack', value: 8, target: 'random' }
  },
  
  // Buffs Attaque Magique
  {
    id: 'arcane_knowledge',
    name: 'Savoir arcanique',
    description: 'Vous découvrez d\'anciens grimoires qui renforcent les pouvoirs magiques de toute l\'équipe !',
    type: 'positive',
    effect: { type: 'buff_magic_attack', value: 5, target: 'all' }
  },
  {
    id: 'mana_crystal',
    name: 'Cristal de mana',
    description: 'Un cristal brillant infuse votre équipe d\'énergie arcanique. La puissance magique augmente !',
    type: 'positive',
    effect: { type: 'buff_magic_attack', value: 8, target: 'all' }
  },
  {
    id: 'archmage_blessing',
    name: 'Bénédiction de l\'archimage',
    description: 'Le fantôme d\'un archimage vous bénit. Un membre aléatoire gagne en puissance magique !',
    type: 'positive',
    effect: { type: 'buff_magic_attack', value: 10, target: 'random' }
  },
  {
    id: 'elemental_surge',
    name: 'Surge élémentaire',
    description: 'Les éléments se déchaînent en votre faveur. La magie de votre équipe s\'intensifie !',
    type: 'positive',
    effect: { type: 'buff_magic_attack', value: 6, target: 'all' }
  },
  {
    id: 'fontaine_arcane',
    name: 'Fontaine arcanique',
    description: 'Une fontaine de mana pure renforce les pouvoirs de vos mages.',
    type: 'positive',
    effect: { type: 'buff_magic_attack', value: 7, target: 'all' }
  },
  {
    id: 'resonance_mystique',
    name: 'Résonance mystique',
    description: 'Les énergies du donjon amplifient vos sorts !',
    type: 'positive',
    effect: { type: 'buff_magic_attack', value: 12, target: 'strongest' }
  },
  
  // Buffs Défense
  {
    id: 'guardian_spirit',
    name: 'Esprit gardien',
    description: 'Un esprit protecteur renforce vos défenses. Vous vous sentez plus résistants.',
    type: 'positive',
    effect: { type: 'buff_defense', value: 5, target: 'all' }
  },
  {
    id: 'fairy_dust',
    name: 'Poussière de fée',
    description: 'Des fées bienveillantes répandent leur poussière magique sur votre équipe.',
    type: 'positive',
    effect: { type: 'buff_defense', value: 8, target: 'all' }
  },
  {
    id: 'benediction_acier',
    name: 'Bénédiction d\'acier',
    description: 'Vos armures brillent d\'une lueur protectrice.',
    type: 'positive',
    effect: { type: 'buff_defense', value: 6, target: 'all' }
  },
  {
    id: 'protection_ancestrale',
    name: 'Protection ancestrale',
    description: 'Les esprits de vos ancêtres veillent sur vous.',
    type: 'positive',
    effect: { type: 'buff_defense', value: 10, target: 'weakest' }
  }
];

export const NEGATIVE_EVENTS: GameEvent[] = [
  // Dégâts
  {
    id: 'poison_trap',
    name: 'Piège empoisonné',
    description: 'Vous déclenchez un piège ! Du gaz toxique envahit la salle et blesse toute l\'équipe.',
    type: 'negative',
    effect: { type: 'damage', value: 15, target: 'all' }
  },
  {
    id: 'dark_magic',
    name: 'Magie noire',
    description: 'Des runes sombres s\'activent soudainement et blessent un membre au hasard.',
    type: 'negative',
    effect: { type: 'damage', value: 25, target: 'random' }
  },
  {
    id: 'shadow_attack',
    name: 'Attaque de l\'ombre',
    description: 'Une ombre surgit des ténèbres et frappe le membre le plus fort de votre équipe !',
    type: 'negative',
    effect: { type: 'damage', value: 30, target: 'strongest' }
  },
  {
    id: 'falling_rocks',
    name: 'Éboulement',
    description: 'Le plafond s\'effondre partiellement ! Des rochers tombent sur votre équipe.',
    type: 'negative',
    effect: { type: 'damage', value: 20, target: 'all' }
  },
  {
    id: 'phantom_strike',
    name: 'Frappe spectrale',
    description: 'Un fantôme traverse la pièce et attaque le membre le plus faible.',
    type: 'negative',
    effect: { type: 'damage', value: 35, target: 'weakest' }
  },
  {
    id: 'explosion_arcane',
    name: 'Explosion arcanique',
    description: 'Une gemme instable explose et blesse tout le monde !',
    type: 'negative',
    effect: { type: 'damage', value: 18, target: 'all' }
  },
  {
    id: 'fleches_poison',
    name: 'Flèches empoisonnées',
    description: 'Des flèches surgissent des murs et touchent un membre de votre groupe.',
    type: 'negative',
    effect: { type: 'damage', value: 28, target: 'random' }
  },
  
  // Debuffs Attaque Physique
  {
    id: 'cursed_room',
    name: 'Salle maudite',
    description: 'Une malédiction pèse sur cette salle. L\'attaque de tous les membres diminue.',
    type: 'negative',
    effect: { type: 'debuff_attack', value: 3, target: 'all' }
  },
  {
    id: 'cursed_artifact',
    name: 'Artefact maudit',
    description: 'Vous touchez un artefact maudit. Votre force s\'affaiblit temporairement.',
    type: 'negative',
    effect: { type: 'debuff_attack', value: 5, target: 'all' }
  },
  {
    id: 'fatigue_combat',
    name: 'Fatigue de combat',
    description: 'L\'épuisement vous gagne et affaiblit vos coups.',
    type: 'negative',
    effect: { type: 'debuff_attack', value: 4, target: 'all' }
  },
  
  // Debuffs Attaque Magique
  {
    id: 'mana_drain',
    name: 'Drainage de mana',
    description: 'Un sortilège ancien aspire l\'énergie magique de votre équipe. Dégâts magiques réduits !',
    type: 'negative',
    effect: { type: 'debuff_magic_attack', value: 4, target: 'all' }
  },
  {
    id: 'antimagic_field',
    name: 'Champ antimagie',
    description: 'Un champ antimagie supprime une partie de vos pouvoirs arcaniques. Magie affaiblie !',
    type: 'negative',
    effect: { type: 'debuff_magic_attack', value: 6, target: 'all' }
  },
  {
    id: 'void_touch',
    name: 'Toucher du vide',
    description: 'Une entité du vide effleure votre mage le plus puissant. Sa magie s\'en trouve diminuée.',
    type: 'negative',
    effect: { type: 'debuff_magic_attack', value: 8, target: 'strongest' }
  },
  {
    id: 'silence_magique',
    name: 'Silence magique',
    description: 'Une aura de silence étouffe partiellement vos pouvoirs.',
    type: 'negative',
    effect: { type: 'debuff_magic_attack', value: 5, target: 'all' }
  },
  {
    id: 'parasites_mana',
    name: 'Parasites de mana',
    description: 'De petites créatures invisibles se nourrissent de votre mana.',
    type: 'negative',
    effect: { type: 'debuff_magic_attack', value: 3, target: 'all' }
  },
  
  // Debuffs Défense
  {
    id: 'weakening_aura',
    name: 'Aura d\'affaiblissement',
    description: 'Une aura maléfique émane des murs. La défense de votre équipe diminue.',
    type: 'negative',
    effect: { type: 'debuff_defense', value: 3, target: 'all' }
  },
  {
    id: 'corrosion_armure',
    name: 'Corrosion d\'armure',
    description: 'Un acide ronge vos équipements protecteurs.',
    type: 'negative',
    effect: { type: 'debuff_defense', value: 4, target: 'all' }
  },
  {
    id: 'malefice_fragilite',
    name: 'Maléfice de fragilité',
    description: 'Un sortilège vous rend vulnérables aux attaques.',
    type: 'negative',
    effect: { type: 'debuff_defense', value: 6, target: 'random' }
  }
];

export function getRandomEvent(): GameEvent {
  const isPositive = Math.random() < 0.5;
  const events = isPositive ? POSITIVE_EVENTS : NEGATIVE_EVENTS;
  const index = Math.floor(Math.random() * events.length);
  return events[index];
}
