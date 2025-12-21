/**
 * ============================================
 * TYPES DE DÉGÂTS D&D 5e - Référence rapide
 * ============================================
 * 
 * Ce fichier fournit des constantes et helpers pour les types de dégâts.
 */

import { DamageType } from './game.types';

// ============================================
// GROUPES DE TYPES DE DÉGÂTS
// ============================================

/** Dégâts physiques (affectés par armure) */
export const PHYSICAL_DAMAGE_TYPES: DamageType[] = [
  'bludgeoning',  // Contondant
  'piercing',     // Perforant
  'slashing',     // Tranchant
];

/** Dégâts élémentaires */
export const ELEMENTAL_DAMAGE_TYPES: DamageType[] = [
  'fire',         // Feu
  'cold',         // Froid
  'lightning',    // Foudre
  'acid',         // Acide
  'thunder',      // Tonnerre
];

/** Dégâts magiques */
export const MAGICAL_DAMAGE_TYPES: DamageType[] = [
  'force',        // Force
  'radiant',      // Radiant
  'necrotic',     // Nécrotique
  'psychic',      // Psychique
];

/** Type poison (souvent immunisé) */
export const POISON_DAMAGE_TYPE: DamageType = 'poison';

// ============================================
// LABELS FRANÇAIS
// ============================================

export const DAMAGE_TYPE_LABELS: Record<DamageType, string> = {
  bludgeoning: 'Contondant',
  piercing: 'Perforant',
  slashing: 'Tranchant',
  fire: 'Feu',
  cold: 'Froid',
  lightning: 'Foudre',
  acid: 'Acide',
  poison: 'Poison',
  necrotic: 'Nécrotique',
  radiant: 'Radiant',
  force: 'Force',
  psychic: 'Psychique',
  thunder: 'Tonnerre',
};

// ============================================
// ICÔNES
// ============================================

export const DAMAGE_TYPE_ICONS: Record<DamageType, string> = {
  bludgeoning: '🔨',
  piercing: '🗡️',
  slashing: '⚔️',
  fire: '🔥',
  cold: '❄️',
  lightning: '⚡',
  acid: '🧪',
  poison: '☠️',
  necrotic: '💀',
  radiant: '✨',
  force: '💫',
  psychic: '🧠',
  thunder: '🌩️',
};

// ============================================
// COULEURS CSS
// ============================================

export const DAMAGE_TYPE_COLORS: Record<DamageType, string> = {
  bludgeoning: '#a0a0a0',  // Gris
  piercing: '#c0c0c0',     // Argent
  slashing: '#d0d0d0',     // Blanc-gris
  fire: '#ff4500',         // Orange-rouge
  cold: '#00bfff',         // Bleu glace
  lightning: '#ffd700',    // Or électrique
  acid: '#7fff00',         // Vert chartreuse
  poison: '#9400d3',       // Violet foncé
  necrotic: '#2f4f4f',     // Gris ardoise foncé
  radiant: '#fffacd',      // Jaune citron
  force: '#9370db',        // Violet medium
  psychic: '#da70d6',      // Orchidée
  thunder: '#4169e1',      // Bleu royal
};

// ============================================
// HELPERS
// ============================================

/**
 * Vérifie si un type de dégât est physique
 */
export function isPhysicalDamage(type: string): boolean {
  return PHYSICAL_DAMAGE_TYPES.includes(type as DamageType) || type === 'physical';
}

/**
 * Vérifie si un type de dégât est élémentaire
 */
export function isElementalDamage(type: string): boolean {
  return ELEMENTAL_DAMAGE_TYPES.includes(type as DamageType);
}

/**
 * Vérifie si un type de dégât est magique
 */
export function isMagicalDamage(type: string): boolean {
  return MAGICAL_DAMAGE_TYPES.includes(type as DamageType) || type === 'magical';
}

/**
 * Obtient le label français d'un type de dégât
 */
export function getDamageTypeLabel(type: string): string {
  if (type === 'physical') return 'Physique';
  if (type === 'magical') return 'Magique';
  if (type === 'holy') return 'Sacré';
  return DAMAGE_TYPE_LABELS[type as DamageType] || type;
}

/**
 * Obtient l'icône d'un type de dégât
 */
export function getDamageTypeIcon(type: string): string {
  if (type === 'physical') return '⚔️';
  if (type === 'magical') return '✨';
  if (type === 'holy') return '☀️';
  return DAMAGE_TYPE_ICONS[type as DamageType] || '💥';
}

/**
 * Obtient la couleur CSS d'un type de dégât
 */
export function getDamageTypeColor(type: string): string {
  if (type === 'physical') return '#a0a0a0';
  if (type === 'magical') return '#9370db';
  if (type === 'holy') return '#ffd700';
  return DAMAGE_TYPE_COLORS[type as DamageType] || '#ffffff';
}




