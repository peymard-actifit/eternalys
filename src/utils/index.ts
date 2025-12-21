/**
 * ============================================
 * UTILS - Export centralisé
 * ============================================
 * 
 * Ce fichier regroupe tous les exports des modules utilitaires.
 * Importer depuis '@/utils' ou '../utils' pour accéder à tout.
 */

// ============================================
// ACCÈS AU STATE
// ============================================
export {
  // Personnages
  getCharacterFromState,
  getAliveCharacters,
  updateCharacterInState,
  updateCharacterSkills,
  // Monstres
  getMonsterFromState,
  getAliveMonsters,
  updateMonsterInState,
  // Cooldowns
  applySkillCooldown as applySkillCooldownUtil,
  decrementCharacterCooldowns,
  isSkillOnCooldown,
  getAvailableSkills,
  // Buffs
  addBuffToCharacter,
  // Passifs
  hasPassiveEffect,
  getPassiveEffectValue,
} from './combatUtils';

// ============================================
// ACTIONS DE COMBAT
// ============================================
export {
  // Tracking
  trackDamageDealt,
  trackDamageTaken,
  trackHealing,
  trackMonsterKill,
  // Calculs
  calculateDamage,
  checkEvasion,
  checkCritical,
  // Vol de vie et épines
  applyLifesteal,
  getTotalLifesteal,
  applyThorns,
  // Ciblage
  getMonsterTarget,
  // Buffs et cooldowns (versions de combatActions)
  applySkillCooldown,
  decrementCooldowns,
  decrementBuffs,
  addBuff,
  // Régénération
  applyRegeneration,
  // Attaques
  performPlayerAttack,
  // Types
  type CombatLog,
  type DamageResult,
  type AttackResult,
} from './combatActions';

// ============================================
// MÉCANIQUE D&D
// ============================================
export {
  // Jets de dés
  rollDie,
  rollDice,
  // Caractéristiques
  getAbilityModifier,
  getProficiencyBonus,
  // Attaques
  getAttackBonus,
  makeAttackRoll,
  // Dégâts
  parseDamageString,
  getDamageDice,
  rollDamage,
  // PV temporaires
  applyTemporaryHp,
  applyDamageWithTempHp,
  // Avantage/Désavantage
  hasAdvantageOnAttack,
  hasDisadvantageOnAttack,
  // Jets de sauvegarde
  getSavingThrowBonus,
  makeSavingThrow,
  // Labels
  ABILITY_LABELS,
  // Types
  type DieType,
  type DiceRollResult,
  type AttackRollResult,
  type DamageRollResult,
  type SavingThrowResult,
} from './dndMechanics';

// ============================================
// ACTIONS DES MONSTRES
// ============================================
export {
  // Recharge
  testRecharge,
  markSkillUsed,
  attemptRechargeAll,
  // Sélection d'action
  selectMonsterSkill,
  canUseUltimate,
  // Actions légendaires
  resetLegendaryActions,
  canUseLegendaryAction,
  selectLegendaryAction,
  useLegendaryAction,
  // Exécution d'attaque
  performMonsterAttack,
  performSavingThrowSkill,
  decideMonsterAction,
  // Types
  type MonsterAction,
  type MonsterAttackResult,
} from './monsterActions';



