import { useEffect, useState, useCallback, useRef } from 'react';
import { gameStore } from '../store/gameStore';
import { GameState, Character, Monster, Skill, MonsterSkill, CombatHistoryEntry, ActiveBuff, InventoryItem } from '../types/game.types';
import { getMonsterAction, getMonsterTaunt } from '../lib/openai';
import { getMonsterDrops, applyDropEffect } from '../data/monsterDrops';
import { CharacterSheet } from './CharacterSheet';
import { DiceRoller, rollDice } from './DiceRoller';
import { useAnimationPreferences } from '../hooks/useAnimationPreferences';
import { 
  makeAttackRoll, 
  rollDamage, 
  applyTemporaryHp, 
  applyDamageWithTempHp,
  hasAdvantageOnAttack,
  hasDisadvantageOnAttack,
  makeSavingThrow,
  ABILITY_LABELS,
  AttackRollResult,
  DamageRollResult,
  SavingThrowResult
} from '../utils/dndMechanics';
import './CombatPage.css';

export function CombatPage() {
  const [state, setState] = useState<GameState>(gameStore.getState());
  const [isAnimating, setIsAnimating] = useState(false);
  const { autoMode, toggleAutoMode } = useAnimationPreferences();
  const [monsterDialogue, setMonsterDialogue] = useState<string>('');
  const [showDialogue, setShowDialogue] = useState(false);
  const [selectingTarget, setSelectingTarget] = useState<'ally' | 'enemy' | null>(null);
  const [pendingSkill, setPendingSkill] = useState<Skill | null>(null);
  const [combatHistory, setCombatHistory] = useState<CombatHistoryEntry[]>([]);
  const [combatTurn, setCombatTurn] = useState(1);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState(false);
  const [isActionsMinimized, setIsActionsMinimized] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTurnRef = useRef<string | null>(null);
  // Utiliser une ref pour accumuler les drops de manière SYNCHRONE
  // (useState est asynchrone et causerait des problèmes avec checkCombatEnd)
  const accumulatedDropsRef = useRef<InventoryItem[]>([]);
  // Drops à distribuer (affiché seulement quand TOUS les monstres sont morts)
  const [pendingDrops, setPendingDrops] = useState<{ drops: InventoryItem[] } | null>(null);
  const [selectingDropCharacter, setSelectingDropCharacter] = useState<InventoryItem | null>(null);
  const [screenShake, setScreenShake] = useState(false);
  // Compteur de tours complets (tous ont joué au moins une fois)
  const [fullRounds, setFullRounds] = useState(0);
  // Effet de dégâts visuels
  const [damageEffect, setDamageEffect] = useState<{ targetId: string; type: 'physical' | 'magical' } | null>(null);
  // Menu contextuel (clic droit)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; entity: Character | Monster } | null>(null);
  // Fiche de personnage/monstre
  const [showCharacterSheet, setShowCharacterSheet] = useState<Character | Monster | null>(null);
  // Animation de jet de dés 3D
  const [activeDiceRoll, setActiveDiceRoll] = useState<{
    dieType: 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';
    count: number;
    modifier: number;
    damageType?: string;
    label?: string;
    preRolledValues?: number[]; // Valeurs pré-calculées (pour éviter de relancer)
    waitForClick?: boolean; // Attendre un clic pour fermer (tours ennemis)
    onDismiss?: () => void; // Callback quand fermé
  } | null>(null);
  // Résultat du dernier jet d'attaque (pour affichage)
  const [lastAttackResult, setLastAttackResult] = useState<{
    roll: number;
    roll2?: number; // Second jet pour avantage/désavantage
    modifier: number;
    total: number;
    targetAC: number;
    hit: boolean;
    isCritical: boolean;
    isCriticalMiss?: boolean;
    hasAdvantage?: boolean;
    hasDisadvantage?: boolean;
    attacker: string;
    target: string;
    waitForClick?: boolean; // Attendre un clic pour fermer
    onDismiss?: () => void; // Callback quand fermé
  } | null>(null);
  
  // Action en attente de confirmation (pour la fenêtre modale)
  const [pendingAction, setPendingAction] = useState<{
    type: 'attack' | 'skill';
    skill?: Skill;
    target?: Monster | Character;
    attacker?: Character;
  } | null>(null);
  
  useEffect(() => {
    return gameStore.subscribe(() => setState(gameStore.getState()));
  }, []);

  // Réinitialiser l'historique au début d'un combat
  useEffect(() => {
    const hasEnemies = state.currentEnemies && state.currentEnemies.length > 0;
    if (hasEnemies && state.combatLog.length === 1) {
      setCombatHistory([]);
      setCombatTurn(1);
      setFullRounds(0); // Réinitialiser les tours complets
      lastTurnRef.current = null;
      // Réinitialiser les drops accumulés au début du combat
      accumulatedDropsRef.current = [];
      setPendingDrops(null);
    }
  }, [state.currentEnemies?.length]);

  // Fermer le menu contextuel quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Fermer la fiche avec Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showCharacterSheet) {
          setShowCharacterSheet(null);
        } else if (contextMenu) {
          setContextMenu(null);
        } else if (lastAttackResult) {
          setLastAttackResult(null);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showCharacterSheet, contextMenu, lastAttackResult]);
  
  // Auto-fermer l'indicateur de jet d'attaque
  // - Mode normal: après 2 secondes si pas waitForClick
  // - Mode auto: après 1.2s même si waitForClick
  useEffect(() => {
    if (lastAttackResult) {
      const delay = autoMode ? 1200 : (!lastAttackResult.waitForClick ? 2000 : 0);
      
      if (delay > 0) {
        const timer = setTimeout(() => {
          if (lastAttackResult.onDismiss) {
            lastAttackResult.onDismiss();
          }
          setLastAttackResult(null);
        }, delay);
        return () => clearTimeout(timer);
      }
    }
  }, [lastAttackResult, autoMode]);

  // Auto-fermer le dice roll en mode auto (1.5s)
  useEffect(() => {
    if (activeDiceRoll && autoMode && activeDiceRoll.waitForClick) {
      const timer = setTimeout(() => {
        if (activeDiceRoll.onDismiss) {
          activeDiceRoll.onDismiss();
        }
        setActiveDiceRoll(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeDiceRoll, autoMode]);

  // Auto-confirmer les actions en mode auto (0.8s)
  useEffect(() => {
    if (pendingAction && autoMode) {
      const timer = setTimeout(() => {
        confirmAction();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [pendingAction, autoMode]);

  // Gérer le clic droit sur une entité
  const handleContextMenu = (e: React.MouseEvent, entity: Character | Monster) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, entity });
  };

  // Long press pour mobile - ouvrir la fiche
  const handleTouchStart = (entity: Character | Monster) => {
    longPressTimerRef.current = setTimeout(() => {
      // Récupérer la version à jour de l'entité depuis le state global
      let entityToShow: Character | Monster = entity;
      if ('class' in entity) {
        const updatedChar = gameStore.getState().team.find(c => c.id === entity.id);
        if (updatedChar) entityToShow = updatedChar;
      } else {
        const updatedMonster = gameStore.getState().currentEnemies.find(e => e.id === entity.id);
        if (updatedMonster) entityToShow = updatedMonster;
      }
      setShowCharacterSheet(entityToShow);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // Ouvrir la fiche depuis le menu contextuel
  const handleExamine = () => {
    if (contextMenu) {
      // Récupérer la version à jour de l'entité depuis le state global
      let entityToShow: Character | Monster = contextMenu.entity;
      if ('class' in contextMenu.entity) {
        const updatedChar = gameStore.getState().team.find(c => c.id === contextMenu.entity.id);
        if (updatedChar) entityToShow = updatedChar;
      } else {
        const updatedMonster = gameStore.getState().currentEnemies.find(e => e.id === contextMenu.entity.id);
        if (updatedMonster) entityToShow = updatedMonster;
      }
      setShowCharacterSheet(entityToShow);
      setContextMenu(null);
    }
  };

  const { team, currentEnemies, currentEnemy, turnOrder, currentTurnIndex, combatLog, selectedEnemyIndex, bossScaling } = state;
  
  // Support multi-monstres
  const enemies = currentEnemies || (currentEnemy ? [currentEnemy] : []);
  if (enemies.length === 0) return null;
  
  // L'ennemi sélectionné par défaut ou par le joueur
  const selectedEnemy = enemies[selectedEnemyIndex || 0] || enemies[0];
  
  // Ennemis en vie
  const aliveEnemies = enemies.filter(e => e.hp > 0);

  // IMPORTANT: turnOrder contient des références qui ne sont pas mises à jour quand team change
  // On doit donc obtenir le personnage actuel depuis team (qui EST mis à jour) pour avoir les stats correctes
  const currentTurnFromOrder = turnOrder[currentTurnIndex];
  
  // Si c'est un personnage, obtenir la version mise à jour depuis team
  // Sinon (monstre), obtenir depuis currentEnemies
  let currentTurn: Character | Monster | undefined = currentTurnFromOrder;
  if (currentTurnFromOrder && 'class' in currentTurnFromOrder) {
    // C'est un personnage - obtenir la version mise à jour depuis team
    currentTurn = team.find(c => c.id === currentTurnFromOrder.id) || currentTurnFromOrder;
  } else if (currentTurnFromOrder && 'isBoss' in currentTurnFromOrder) {
    // C'est un monstre - obtenir depuis currentEnemies
    currentTurn = enemies.find(e => e.id === (currentTurnFromOrder as Monster).id) || currentTurnFromOrder;
  }
  
  const isPlayerTurn = currentTurn && 'class' in currentTurn;
  const isEnemyTurn = currentTurn && 'isBoss' in currentTurn && aliveEnemies.some(e => e.id === (currentTurn as Monster).id);

  // Calcul dynamique de la couleur de la barre de vie
  const getHpBarColor = (currentHp: number, maxHp: number): string => {
    const percentage = (currentHp / maxHp) * 100;
    if (percentage <= 0) return '#1a1a1a'; // Noir
    if (percentage <= 33) return '#c0392b'; // Rouge
    if (percentage <= 66) return '#f39c12'; // Jaune/Orange
    return '#27ae60'; // Vert
  };

  // Calcul des modifications de stats pour le tooltip
  const getStatModifiers = (entity: Character | Monster) => {
    const mods: { stat: string; base: number; current: number; diff: number }[] = [];
    
    // Utiliser baseStats si disponibles, sinon utiliser les stats actuelles comme base
    const baseAttack = 'baseAttack' in entity && entity.baseAttack !== undefined ? entity.baseAttack : entity.attack;
    const baseMagicAttack = 'baseMagicAttack' in entity && entity.baseMagicAttack !== undefined ? entity.baseMagicAttack : (entity.magicAttack || 0);
    const baseDefense = 'baseDefense' in entity && entity.baseDefense !== undefined ? entity.baseDefense : entity.defense;
    const baseMagicDefense = 'baseMagicDefense' in entity && entity.baseMagicDefense !== undefined ? entity.baseMagicDefense : entity.magicDefense;
    const baseSpeed = 'baseSpeed' in entity && entity.baseSpeed !== undefined ? entity.baseSpeed : entity.speed;
    
    mods.push({ stat: 'Attaque', base: baseAttack, current: entity.attack, diff: entity.attack - baseAttack });
    mods.push({ stat: 'Att. Magique', base: baseMagicAttack, current: entity.magicAttack || 0, diff: (entity.magicAttack || 0) - baseMagicAttack });
    mods.push({ stat: 'Défense', base: baseDefense, current: entity.defense, diff: entity.defense - baseDefense });
    mods.push({ stat: 'Déf. Magique', base: baseMagicDefense, current: entity.magicDefense, diff: entity.magicDefense - baseMagicDefense });
    mods.push({ stat: 'Vitesse', base: baseSpeed, current: entity.speed, diff: entity.speed - baseSpeed });
    
    return mods;
  };

  // Rendu du tooltip de stats
  const renderStatsTooltip = (entity: Character | Monster) => {
    const mods = getStatModifiers(entity);
    const hasModifiers = mods.some(m => m.diff !== 0);
    
    return (
      <div className="stats-tooltip">
        <div className="tooltip-header">📊 Statistiques détaillées</div>
        {mods.map((m, i) => (
          <div key={i} className={`stat-line ${m.diff > 0 ? 'buff' : m.diff < 0 ? 'debuff' : ''}`}>
            <span className="stat-name">{m.stat}</span>
            <span className="stat-values">
              <span className="base-value">{m.base}</span>
              {m.diff !== 0 && (
                <>
                  <span className="arrow">→</span>
                  <span className="current-value">{m.current}</span>
                  <span className={`diff ${m.diff > 0 ? 'positive' : 'negative'}`}>
                    ({m.diff > 0 ? '+' : ''}{m.diff})
                  </span>
                </>
              )}
            </span>
          </div>
        ))}
        {hasModifiers && entity.buffs && entity.buffs.length > 0 && (
          <div className="active-effects">
            <div className="effects-header">Effets actifs:</div>
            {entity.buffs.map((buff, i) => (
              <span key={i} className="effect-badge" title={`${buff.value} pendant ${buff.turnsRemaining} tours`}>
                {buff.icon} {buff.type} {buff.turnsRemaining}t
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Déclencher un effet visuel de dégâts
  const triggerDamageEffect = (targetId: string, damageType: 'physical' | 'magical') => {
    setDamageEffect({ targetId, type: damageType });
    setTimeout(() => setDamageEffect(null), 500);
  };

  // Décrémenter les buffs et cooldowns du personnage actuel à chaque nouveau tour
  const processBuffsForCharacter = useCallback((characterId: string) => {
    // IMPORTANT: Récupérer l'équipe actuelle du state GLOBAL (pas de la closure)
    const currentState = gameStore.getState();
    const currentTeam = currentState.team;
    const logs: string[] = [...currentState.combatLog];
    
    const updatedTeam = currentTeam.map(char => {
      if (char.id !== characterId) return char;
      
      // Copie profonde du personnage avec ses skills
      let updatedChar = { 
        ...char,
        skills: char.skills ? char.skills.map(s => ({ ...s })) : [],
        buffs: char.buffs ? [...char.buffs] : []
      };
      
      // =============================================
      // APPLIQUER LA RÉGÉNÉRATION PASSIVE (des objets)
      // =============================================
      if (updatedChar.passiveEffects?.regeneration && updatedChar.passiveEffects.regeneration > 0) {
        const regenAmount = updatedChar.passiveEffects.regeneration;
        const healAmount = Math.min(regenAmount, updatedChar.maxHp - updatedChar.hp);
        if (healAmount > 0) {
          updatedChar.hp = Math.min(updatedChar.maxHp, updatedChar.hp + regenAmount);
          logs.push(`💚 ${updatedChar.name} régénère ${healAmount} PV (passif)`);
          if (updatedChar.stats) {
            updatedChar.stats.totalHealingDone += healAmount;
          }
        }
      }
      
      // =============================================
      // DÉCRÉMENTER LES COOLDOWNS DES COMPÉTENCES
      // =============================================
      if (updatedChar.skills && updatedChar.skills.length > 0) {
        updatedChar.skills = updatedChar.skills.map(skill => {
          if (skill.currentCooldown && skill.currentCooldown > 0) {
            const newCooldown = skill.currentCooldown - 1;
            if (newCooldown === 0) {
              logs.push(`⏰ ${updatedChar.name}: ${skill.name} est prêt !`);
            }
            return { ...skill, currentCooldown: newCooldown };
          }
          return skill;
        });
      }
      
      // =============================================
      // TRAITER LES BUFFS
      // =============================================
      if (!updatedChar.buffs || updatedChar.buffs.length === 0) {
        return updatedChar;
      }
      
      const updatedBuffs: ActiveBuff[] = [];
      const expiredBuffNames: string[] = [];
      
      // IMPORTANT: Itérer sur updatedChar.buffs (pas char.buffs)
      updatedChar.buffs.forEach(buff => {
        // Traiter TOUS les buffs dont ce personnage est propriétaire
        if (buff.ownerId === characterId) {
          // Appliquer les effets de début de tour (régén, poison)
          if (buff.type === 'regen') {
            const healAmount = Math.min(buff.value, updatedChar.maxHp - updatedChar.hp);
            if (healAmount > 0) {
              updatedChar.hp = Math.min(updatedChar.maxHp, updatedChar.hp + buff.value);
              logs.push(`💚 ${updatedChar.name} régénère ${healAmount} PV`);
              if (updatedChar.stats) {
                updatedChar.stats.totalHealingDone += healAmount;
              }
            }
          } else if (buff.type === 'poison') {
            const poisonDmg = buff.value;
            updatedChar.hp = Math.max(0, updatedChar.hp - poisonDmg);
            logs.push(`🧪 ${updatedChar.name} subit ${poisonDmg} dégâts de poison`);
            if (updatedChar.stats) {
              updatedChar.stats.totalDamageTaken += poisonDmg;
            }
          }
          
          // Décrémenter la durée du buff
          const newTurns = buff.turnsRemaining - 1;
          
          if (newTurns <= 0) {
            // Buff expiré - noter son nom pour le log
            if (buff.type === 'attack') {
              expiredBuffNames.push('attaque');
            } else if (buff.type === 'magicAttack') {
              expiredBuffNames.push('attaque magique');
            } else if (buff.type === 'defense') {
              expiredBuffNames.push('défense');
            } else if (buff.type === 'magicDefense') {
              expiredBuffNames.push('résistance magique');
            } else if (buff.type === 'speed') {
              expiredBuffNames.push('vitesse');
            } else if (buff.type === 'damage_reflect') {
              expiredBuffNames.push('renvoi de dégâts');
            } else if (buff.type === 'regen') {
              expiredBuffNames.push('régénération');
            } else if (buff.type === 'poison') {
              expiredBuffNames.push('poison');
            }
            // NE PAS ajouter aux buffs (supprimé de la liste)
          } else {
            // Buff toujours actif, on le garde avec la durée décrémentée
            updatedBuffs.push({ ...buff, turnsRemaining: newTurns });
          }
        } else {
          // Buff d'un autre personnage (comme un buff de groupe), garder tel quel
          updatedBuffs.push(buff);
        }
      });
      
      // Mettre à jour les buffs du personnage
      updatedChar.buffs = updatedBuffs;
      
      // IMPORTANT: Recalculer les stats à partir des baseStats + buffs restants
      // Cela garantit que les stats reviennent à la normale quand un buff expire
      const recalculated = gameStore.recalculateStats(updatedChar);
      updatedChar.attack = recalculated.attack;
      updatedChar.magicAttack = recalculated.magicAttack;
      updatedChar.defense = recalculated.defense;
      updatedChar.magicDefense = recalculated.magicDefense;
      updatedChar.speed = recalculated.speed;
      
      // Logger les buffs expirés
      if (expiredBuffNames.length > 0) {
        logs.push(`⏳ ${updatedChar.name} perd le(s) effet(s): ${expiredBuffNames.join(', ')}`);
      }
      
      return updatedChar;
    });
    
    gameStore.setState({ team: updatedTeam, combatLog: logs });
  }, []);

  // Vérifier si c'est un nouveau tour pour un personnage
  useEffect(() => {
    if (isPlayerTurn && currentTurn) {
      const currentCharId = (currentTurn as Character).id;
      if (lastTurnRef.current !== currentCharId) {
        lastTurnRef.current = currentCharId;
        // Nouveau tour pour ce personnage, traiter ses buffs
        processBuffsForCharacter(currentCharId);
      }
    }
  }, [currentTurnIndex, isPlayerTurn, processBuffsForCharacter]);

  // Ajouter une entrée à l'historique de combat
  const addCombatHistoryEntry = (entry: Omit<CombatHistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: CombatHistoryEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    setCombatHistory(prev => [...prev, newEntry]);
  };

  // Tracker les stats de combat
  // IMPORTANT: Utiliser gameStore.getState().team pour avoir les cooldowns à jour !
  const trackDamageDealt = (attackerId: string, damage: number) => {
    const currentTeam = gameStore.getState().team;
    const updatedTeam = currentTeam.map(c => {
      if (c.id === attackerId) {
        const stats = c.stats || { totalDamageDealt: 0, totalDamageTaken: 0, totalHealingDone: 0, monstersKilled: [] };
        return {
          ...c,
          stats: { ...stats, totalDamageDealt: stats.totalDamageDealt + damage }
        };
      }
      return c;
    });
    gameStore.setState({ team: updatedTeam });
  };

  const trackDamageTaken = (targetId: string, damage: number) => {
    const currentTeam = gameStore.getState().team;
    const updatedTeam = currentTeam.map(c => {
      if (c.id === targetId) {
        const stats = c.stats || { totalDamageDealt: 0, totalDamageTaken: 0, totalHealingDone: 0, monstersKilled: [] };
        return {
          ...c,
          stats: { ...stats, totalDamageTaken: stats.totalDamageTaken + damage }
        };
      }
      return c;
    });
    gameStore.setState({ team: updatedTeam });
  };

  const trackHealing = (healerId: string, healing: number) => {
    const currentTeam = gameStore.getState().team;
    const updatedTeam = currentTeam.map(c => {
      if (c.id === healerId) {
        const stats = c.stats || { totalDamageDealt: 0, totalDamageTaken: 0, totalHealingDone: 0, monstersKilled: [] };
        return {
          ...c,
          stats: { ...stats, totalHealingDone: stats.totalHealingDone + healing }
        };
      }
      return c;
    });
    gameStore.setState({ team: updatedTeam });
  };

  // Choisir la cible du monstre en tenant compte de la Provocation
  const getMonsterTarget = (aliveTeam: Character[]): Character => {
    // Vérifier si un personnage a le buff Provocation (damage_reflect avec défense)
    const tauntingChars = aliveTeam.filter(c => 
      c.buffs?.some(b => b.type === 'damage_reflect' && b.isApplied)
    );
    
    if (tauntingChars.length > 0) {
      // Cibler prioritairement le personnage qui provoque
      return tauntingChars[Math.floor(Math.random() * tauntingChars.length)];
    }
    
    // Sinon, cible aléatoire
    return aliveTeam[Math.floor(Math.random() * aliveTeam.length)];
  };

  // Appliquer le renvoi de dégâts (buff temporaire ET épines passives)
  const applyDamageReflect = (target: Character, damage: number, enemy: Monster, logs: string[]): number => {
    let totalReflected = 0;
    
    // 1. Renvoi de dégâts via buff temporaire
    const reflectBuff = target.buffs?.find(b => b.type === 'damage_reflect');
    if (reflectBuff && damage > 0) {
      const reflectedDamage = Math.max(1, Math.floor(damage * reflectBuff.value / 100));
      enemy.hp = Math.max(0, enemy.hp - reflectedDamage);
      totalReflected += reflectedDamage;
      
      logs.push(`🔄 ${target.name} renvoie ${reflectedDamage} dégâts à ${enemy.name} (buff) !`);
      trackDamageDealt(target.id, reflectedDamage);
      
      addCombatHistoryEntry({
        turn: combatTurn,
        actor: target.name,
        actorPortrait: target.portrait,
        action: 'Renvoi de dégâts',
        target: enemy.name,
        damage: reflectedDamage,
        isPlayerAction: true,
        damageType: 'physical'
      });
    }
    
    // 2. Épines passives (thorns) via objets/trésors
    if (target.passiveEffects?.thorns && target.passiveEffects.thorns > 0 && damage > 0) {
      const thornsDamage = Math.max(1, Math.floor(damage * target.passiveEffects.thorns / 100));
      enemy.hp = Math.max(0, enemy.hp - thornsDamage);
      totalReflected += thornsDamage;
      
      logs.push(`🌵 ${target.name} renvoie ${thornsDamage} dégâts à ${enemy.name} (épines) !`);
      trackDamageDealt(target.id, thornsDamage);
      
      addCombatHistoryEntry({
        turn: combatTurn,
        actor: target.name,
        actorPortrait: target.portrait,
        action: 'Épines',
        target: enemy.name,
        damage: thornsDamage,
        isPlayerAction: true,
        damageType: 'physical'
      });
    }
    
    return totalReflected;
  };

  const trackMonsterKill = (killerId: string, monster: Monster) => {
    // IMPORTANT: Utiliser gameStore.getState().team pour préserver les cooldowns !
    const currentTeam = gameStore.getState().team;
    const updatedTeam = currentTeam.map(c => {
      if (c.id === killerId) {
        const stats = c.stats || { totalDamageDealt: 0, totalDamageTaken: 0, totalHealingDone: 0, monstersKilled: [] };
        const updatedMonstersKilled = [...stats.monstersKilled, { ...monster }];
        // Mettre à jour le monstre le plus puissant
        let strongestMonster = stats.strongestMonsterKilled;
        if (!strongestMonster || (monster.attack + monster.defense) > (strongestMonster.attack + strongestMonster.defense)) {
          strongestMonster = { ...monster };
        }
        return {
          ...c,
          stats: { 
            ...stats, 
            monstersKilled: updatedMonstersKilled,
            strongestMonsterKilled: strongestMonster
          }
        };
      }
      return c;
    });
    gameStore.setState({ team: updatedTeam });
  };

  // Calculer les dégâts en tenant compte du type (physique/magique)
  // Types de dégâts physiques D&D
  const physicalDamageTypes = ['physical', 'bludgeoning', 'piercing', 'slashing'];
  // Types de dégâts magiques D&D
  const magicalDamageTypes = ['magical', 'holy', 'fire', 'cold', 'lightning', 'acid', 'poison', 'necrotic', 'radiant', 'force', 'psychic', 'thunder'];
  
  const isPhysicalDamage = (type: string): boolean => physicalDamageTypes.includes(type);
  const isMagicalDamage = (type: string): boolean => magicalDamageTypes.includes(type);
  
  // Vérifier si l'attaque est un coup critique (retourne le multiplicateur)
  const checkCritical = (attacker: Character | Monster): { isCritical: boolean; multiplier: number } => {
    let critChance = 5; // 5% de base
    
    // Ajouter le bonus de critique passif du personnage
    if ('class' in attacker && attacker.passiveEffects?.critical) {
      critChance += attacker.passiveEffects.critical;
    }
    
    const roll = Math.random() * 100;
    return {
      isCritical: roll < critChance,
      multiplier: roll < critChance ? 2 : 1
    };
  };
  
  // Vérifier si la cible esquive l'attaque
  const checkEvasion = (target: Character | Monster): boolean => {
    if ('class' in target && target.passiveEffects?.evasion) {
      const roll = Math.random() * 100;
      return roll < target.passiveEffects.evasion;
    }
    return false;
  };
  
  const calculateDamage = (
    baseDamage: number, 
    attacker: Character | Monster, 
    target: Character | Monster,
    damageType: string = 'physical',
    skill?: Skill,
    isCritical: boolean = false
  ): number => {
    let totalDamage = baseDamage;
    
    const isPhysical = isPhysicalDamage(damageType);
    
    if ('class' in attacker) {
      if (isPhysical) {
        // Bonus d'attaque physique (Force via les stats de base)
        const attackBonus = Math.floor(attacker.attack * 0.3);
        totalDamage += attackBonus;
      } else {
        // Bonus d'attaque magique (Intelligence via les stats de base)
        const magicStat = attacker.magicAttack || 0;
        const magicBonus = Math.floor(magicStat * 0.3);
        totalDamage += magicBonus;
      }
    }
    
    // Bonus contre certains types de monstres
    if (skill && 'isBoss' in target) {
      // Bonus vs démons (fiends en D&D)
      if (skill.bonusVsDemon && (target.monsterType === 'demon' || target.creatureType === 'fiend')) {
        totalDamage += skill.bonusVsDemon;
      }
      // Bonus vs morts-vivants
      if (skill.bonusVsUndead && (target.monsterType === 'undead' || target.creatureType === 'undead')) {
        totalDamage += skill.bonusVsUndead;
      }
    }
    
    // Appliquer le multiplicateur de critique
    if (isCritical) {
      totalDamage = Math.floor(totalDamage * 2);
    }
    
    // Calculer la défense appropriée
    let defense = 0;
    if (isPhysical) {
      defense = target.defense;
    } else {
      defense = 'magicDefense' in target ? target.magicDefense : Math.floor(target.defense * 0.5);
    }
    
    // Vérifier les résistances/immunités/vulnérabilités (D&D)
    if ('resistances' in target && target.resistances?.includes(damageType as any)) {
      // Pour les personnages, utiliser le pourcentage personnalisé si disponible
      if ('class' in target && target.passiveEffects?.damageReduction?.[damageType]) {
        const reductionPercent = target.passiveEffects.damageReduction[damageType];
        totalDamage = Math.floor(totalDamage * (1 - reductionPercent / 100));
      } else {
        totalDamage = Math.floor(totalDamage * 0.5); // Résistance = 50% de dégâts par défaut
      }
    }
    if ('immunities' in target && target.immunities?.includes(damageType as any)) {
      totalDamage = 0; // Immunité = 0 dégâts
    }
    if ('vulnerabilities' in target && target.vulnerabilities?.includes(damageType as any)) {
      totalDamage = Math.floor(totalDamage * 2); // Vulnérabilité = 200% de dégâts
    }
    
    // Appliquer les PV temporaires en premier
    if ('class' in target && target.temporaryHp && target.temporaryHp > 0) {
      const absorbedByTempHp = Math.min(target.temporaryHp, totalDamage);
      totalDamage -= absorbedByTempHp;
      // Note: la réduction des PV temporaires sera gérée dans le code appelant
    }
    
    return Math.max(1, totalDamage - defense);
  };
  
  // Appliquer les épines (thorns) quand un personnage reçoit des dégâts
  const applyThorns = (
    defender: Character, 
    attacker: Monster, 
    damageReceived: number,
    logs: string[]
  ): number => {
    if (defender.passiveEffects?.thorns && defender.passiveEffects.thorns > 0) {
      const thornsDamage = Math.floor(damageReceived * defender.passiveEffects.thorns / 100);
      if (thornsDamage > 0) {
        attacker.hp = Math.max(0, attacker.hp - thornsDamage);
        logs.push(`🌵 ${defender.name} renvoie ${thornsDamage} dégâts à ${attacker.name} (épines)`);
        return thornsDamage;
      }
    }
    return 0;
  };

  const displayMonsterDialogue = (dialogue: string) => {
    setMonsterDialogue(dialogue);
    setShowDialogue(true);
    setTimeout(() => setShowDialogue(false), 2500);
  };

  // IA du monstre avec compétences (multi-monstres)
  useEffect(() => {
    // Le monstre actuel est celui dont c'est le tour
    const currentMonster = isEnemyTurn ? currentTurn as Monster : null;
    
    if (isEnemyTurn && !isAnimating && currentMonster && currentMonster.hp > 0) {
      setIsAnimating(true);
      
      const executeMonsterTurn = async () => {
        try {
          // Vérifier si le boss peut utiliser son ultime (après X tours COMPLETS)
          // Un tour complet = tous les personnages et monstres ont joué au moins une fois
          if (currentMonster.isBoss && 
              currentMonster.ultimateSkill && 
              !currentMonster.ultimateUsed && 
              fullRounds >= (currentMonster.ultimateTurnTrigger || 4)) {
            
            // Utiliser la compétence ultime !
            displayMonsterDialogue(`💀 ${currentMonster.name} prépare son attaque ULTIME !`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Activer le tremblement d'écran (2 secondes) !
            setScreenShake(true);
            setTimeout(() => setScreenShake(false), 2000);
            
            // IMPORTANT: Marquer l'ultime comme utilisé dans le STATE GLOBAL
            const updatedEnemiesForUltimate = enemies.map(e => 
              e.id === currentMonster.id ? { ...e, ultimateUsed: true } : e
            );
            gameStore.setState({ currentEnemies: updatedEnemiesForUltimate });
            
            // Garder la référence locale aussi pour la suite de cette fonction
            currentMonster.ultimateUsed = true;
            
            // Exécuter l'ultime sur tous les personnages
            const logs = [...combatLog, `⚡ ${currentMonster.name} utilise ${currentMonster.ultimateSkill.name} !`];
            const aliveTeam = team.filter(c => c.hp > 0);
            const ultimate = currentMonster.ultimateSkill;
            let totalDamage = 0;
            
            for (const target of aliveTeam) {
              const damage = calculateDamage(ultimate.damage, currentMonster, target, ultimate.damageType || 'magical');
              target.hp = Math.max(0, target.hp - damage);
              totalDamage += damage;
              trackDamageTaken(target.id, damage);
              triggerDamageEffect(target.id, ultimate.damageType === 'physical' ? 'physical' : 'magical');
              logs.push(`💥 ${target.name} subit ${damage} dégâts !`);
              
              // Appliquer les effets spéciaux de l'ultime
              if (ultimate.effect) {
                const effect = ultimate.effect as { type: string; stat?: string; value?: number; turns?: number; poison?: number; hits?: number };
                
                // Debuff sur toute l'équipe
                if (effect.type === 'debuff_all' && effect.stat && effect.value && effect.turns) {
                  const debuffValue = effect.value;
                  const debuffIcon = effect.stat === 'speed' ? '🥶' : effect.stat === 'defense' ? '💔' : '📉';
                  
                  if (!target.buffs) target.buffs = [];
                  target.buffs.push({
                    type: effect.stat as 'attack' | 'defense' | 'speed' | 'magicAttack' | 'magicDefense',
                    value: -debuffValue,
                    turnsRemaining: effect.turns,
                    name: `Debuff ${effect.stat}`,
                    icon: debuffIcon,
                    isApplied: true
                  });
                  
                  // Appliquer le debuff
                  if (effect.stat === 'defense') target.defense = Math.max(0, target.defense - debuffValue);
                  else if (effect.stat === 'speed') target.speed = Math.max(1, target.speed - debuffValue);
                  else if (effect.stat === 'attack') target.attack = Math.max(1, target.attack - debuffValue);
                  else if (effect.stat === 'magicDefense') target.magicDefense = Math.max(0, target.magicDefense - debuffValue);
                  
                  logs.push(`⬇️ ${target.name} subit -${debuffValue} ${effect.stat} !`);
                }
                
                // Poison sur toute l'équipe
                if ((effect.type === 'poison_all' || effect.type === 'burn_all') && effect.value && effect.turns) {
                  if (!target.buffs) target.buffs = [];
                  target.buffs.push({
                    type: 'poison',
                    value: effect.value,
                    turnsRemaining: effect.turns,
                    name: effect.type === 'burn_all' ? 'Brûlure' : 'Poison',
                    icon: effect.type === 'burn_all' ? '🔥' : '🧪',
                    isApplied: true
                  });
                  logs.push(`${effect.type === 'burn_all' ? '🔥' : '🧪'} ${target.name} est ${effect.type === 'burn_all' ? 'brûlé' : 'empoisonné'} !`);
                }
                
                // Gel (freeze_all)
                if (effect.type === 'freeze_all' && effect.value && effect.turns) {
                  if (!target.buffs) target.buffs = [];
                  target.buffs.push({
                    type: 'speed',
                    value: -effect.value,
                    turnsRemaining: effect.turns,
                    name: 'Gelé',
                    icon: '❄️',
                    isApplied: true
                  });
                  target.speed = Math.max(1, target.speed - effect.value);
                  logs.push(`❄️ ${target.name} est gelé ! (Vitesse -${effect.value})`);
                }
              }
            }
            
            // Lifesteal pour le boss
            if (ultimate.effect && (ultimate.effect as { type: string }).type === 'lifesteal_all') {
              const healAmount = Math.floor(totalDamage * 0.5);
              currentMonster.hp = Math.min(currentMonster.maxHp, currentMonster.hp + healAmount);
              logs.push(`🧛 ${currentMonster.name} récupère ${healAmount} PV !`);
            }
            
            addCombatHistoryEntry({
              turn: combatTurn,
              actor: currentMonster.name,
              actorPortrait: currentMonster.portrait,
              action: `⚡ ${ultimate.name} (ULTIME)`,
              target: 'Toute l\'équipe',
              damage: totalDamage,
              isPlayerAction: false,
              damageType: ultimate.damageType || 'magical'
            });
            
            // IMPORTANT: Utiliser le state global pour préserver les cooldowns
            const globalTeam = gameStore.getState().team;
            const updatedTeamAfterUlt = globalTeam.map(c => {
              const aliveChar = aliveTeam.find(a => a.id === c.id);
              if (aliveChar) {
                return { ...c, hp: aliveChar.hp, buffs: aliveChar.buffs };
              }
              return c;
            });
            gameStore.setState({ team: updatedTeamAfterUlt });
            checkCombatEnd(logs, null, undefined, enemies);
            setIsAnimating(false);
            return;
          }
          
          const useSkill = currentMonster.skills && currentMonster.skills.length > 0 && Math.random() > 0.3;
          
          if (useSkill && currentMonster.skills) {
            const availableSkills = currentMonster.skills.filter(s => !s.currentCooldown || s.currentCooldown <= 0);
            if (availableSkills.length > 0) {
              const skill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
              await executeMonsterSkill(skill, currentMonster);
              setIsAnimating(false);
              return;
            }
          }
          
          const action = await getMonsterAction(currentMonster, team, combatLog);
          displayMonsterDialogue(action.dialogue);
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          const aliveTeam = team.filter(c => c.hp > 0);
          if (aliveTeam.length > 0) {
            // Vérifier la Provocation en priorité
            const target = getMonsterTarget(aliveTeam);
            const logs = [...combatLog];
            
            // === JET DE TOUCHE D&D 5e POUR MONSTRE ===
            const monsterAttackResult = makeAttackRoll(currentMonster, target, false, false, false);
            
            // Log du jet de touche
            logs.push(`🎲 ${currentMonster.name} : ${monsterAttackResult.attackRoll.rolls[0]} + ${monsterAttackResult.totalAttackBonus} = ${monsterAttackResult.attackRoll.total} vs CA ${monsterAttackResult.targetAC}`);
            
            // Afficher l'animation de dés 3D pour le monstre et ATTENDRE le clic
            await new Promise<void>(resolve => {
              setActiveDiceRoll({
                dieType: 'd20',
                count: 1,
                modifier: monsterAttackResult.totalAttackBonus,
                damageType: 'physical',
                label: `${currentMonster.name} attaque ${target.name} !`,
                preRolledValues: monsterAttackResult.attackRoll.rolls,
                waitForClick: true,
                onDismiss: resolve
              });
            });
            
            // Afficher le résultat du jet pour le monstre et attendre le clic
            await new Promise<void>(resolve => {
              setLastAttackResult({
                roll: monsterAttackResult.attackRoll.rolls[0],
                modifier: monsterAttackResult.totalAttackBonus,
                total: monsterAttackResult.attackRoll.total,
                targetAC: monsterAttackResult.targetAC,
                hit: monsterAttackResult.hit,
                isCritical: monsterAttackResult.isCriticalHit,
                isCriticalMiss: monsterAttackResult.isCriticalMiss,
                attacker: currentMonster.name,
                target: target.name,
                waitForClick: true,
                onDismiss: resolve
              });
            });
            
            if (monsterAttackResult.isCriticalMiss) {
              // Échec critique !
              logs.push(`💨 Échec critique ! ${currentMonster.name} rate complètement son attaque !`);
              addCombatHistoryEntry({
                turn: combatTurn,
                actor: currentMonster.name,
                actorPortrait: currentMonster.portrait,
                action: 'Attaque (échec critique)',
                target: target.name,
                damage: 0,
                isPlayerAction: false,
                damageType: 'physical'
              });
              checkCombatEnd(logs, null, undefined, enemies);
            } else if (!monsterAttackResult.hit) {
              // Rate simplement
              logs.push(`💨 ${currentMonster.name} rate ${target.name} !`);
              addCombatHistoryEntry({
                turn: combatTurn,
                actor: currentMonster.name,
                actorPortrait: currentMonster.portrait,
                action: 'Attaque (raté)',
                target: target.name,
                damage: 0,
                isPlayerAction: false,
                damageType: 'physical'
              });
              checkCombatEnd(logs, null, undefined, enemies);
            } else {
              // Vérifier l'évasion du personnage (compétences spéciales)
              if (checkEvasion(target) && !monsterAttackResult.isCriticalHit) {
                logs.push(`💨 ${target.name} esquive l'attaque de ${currentMonster.name} grâce à sa compétence !`);
                addCombatHistoryEntry({
                  turn: combatTurn,
                  actor: currentMonster.name,
                  actorPortrait: currentMonster.portrait,
                  action: 'Attaque (esquivée)',
                  target: target.name,
                  damage: 0,
                  isPlayerAction: false,
                  damageType: 'physical'
                });
                checkCombatEnd(logs, null, undefined, enemies);
              } else {
                // TOUCHÉ ! Calcul des dégâts
                let damage = calculateDamage(currentMonster.attack, currentMonster, target, 'physical');
                
                // Dégâts doublés sur critique
                if (monsterAttackResult.isCriticalHit) {
                  damage = Math.floor(damage * 2);
                  logs.push(`💥 COUP CRITIQUE ! ${currentMonster.name} inflige ${damage} dégâts à ${target.name} !`);
                } else {
                  logs.push(`⚔️ ${currentMonster.name} touche ${target.name} pour ${damage} dégâts !`);
                }
                
                target.hp = Math.max(0, target.hp - damage);
                trackDamageTaken(target.id, damage);
                triggerDamageEffect(target.id, 'physical');
                
                // Appliquer le renvoi de dégâts et épines
                applyDamageReflect(target, damage, currentMonster, logs);
                
                addCombatHistoryEntry({
                  turn: combatTurn,
                  actor: currentMonster.name,
                  actorPortrait: currentMonster.portrait,
                  action: monsterAttackResult.isCriticalHit ? 'Attaque (CRIT)' : 'Attaque',
                  target: target.name,
                  damage,
                  isPlayerAction: false,
                  damageType: 'physical'
                });
                
                checkCombatEnd(logs, null, undefined, enemies);
              }
            }
          }
        } catch (error) {
          console.error('Error in monster turn:', error);
          const aliveTeam = team.filter(c => c.hp > 0);
          if (aliveTeam.length > 0) {
            // Utiliser getMonsterTarget pour la Provocation
            const target = getMonsterTarget(aliveTeam);
            displayMonsterDialogue('GRAAAH!');
            await new Promise(resolve => setTimeout(resolve, 1000));
            const logs = [...combatLog];
            
            // Jet de touche même en fallback
            const fallbackAttackResult = makeAttackRoll(currentMonster, target, false, false, false);
            
            logs.push(`🎲 ${currentMonster.name} : ${fallbackAttackResult.attackRoll.rolls[0]} + ${fallbackAttackResult.totalAttackBonus} = ${fallbackAttackResult.attackRoll.total} vs CA ${fallbackAttackResult.targetAC}`);
            
            // Attendre le clic du joueur
            await new Promise<void>(resolve => {
              setActiveDiceRoll({
                dieType: 'd20',
                count: 1,
                modifier: fallbackAttackResult.totalAttackBonus,
                damageType: 'physical',
                label: `${currentMonster.name} attaque ${target.name} !`,
                preRolledValues: fallbackAttackResult.attackRoll.rolls,
                waitForClick: true,
                onDismiss: resolve
              });
            });
            
            // Afficher le résultat et attendre le clic
            await new Promise<void>(resolve => {
              setLastAttackResult({
                roll: fallbackAttackResult.attackRoll.rolls[0],
                modifier: fallbackAttackResult.totalAttackBonus,
                total: fallbackAttackResult.attackRoll.total,
                targetAC: fallbackAttackResult.targetAC,
                hit: fallbackAttackResult.hit,
                isCritical: fallbackAttackResult.isCriticalHit,
                isCriticalMiss: fallbackAttackResult.isCriticalMiss,
                attacker: currentMonster.name,
                target: target.name,
                waitForClick: true,
                onDismiss: resolve
              });
            });
            
            if (!fallbackAttackResult.hit) {
              logs.push(`💨 ${currentMonster.name} rate son attaque !`);
              checkCombatEnd(logs, null, undefined, enemies);
            } else if (checkEvasion(target) && !fallbackAttackResult.isCriticalHit) {
              logs.push(`💨 ${target.name} esquive l'attaque de ${currentMonster.name} !`);
              checkCombatEnd(logs, null, undefined, enemies);
            } else {
              let damage = calculateDamage(currentMonster.attack, currentMonster, target, 'physical');
              if (fallbackAttackResult.isCriticalHit) {
                damage = Math.floor(damage * 2);
              }
              target.hp = Math.max(0, target.hp - damage);
              trackDamageTaken(target.id, damage);
              triggerDamageEffect(target.id, 'physical');
              
              logs.push(`${fallbackAttackResult.isCriticalHit ? '💥 CRIT ! ' : ''}${currentMonster.name} inflige ${damage} dégâts à ${target.name} !`);
              
              // Appliquer le renvoi de dégâts et épines
              applyDamageReflect(target, damage, currentMonster, logs);
              
              addCombatHistoryEntry({
                turn: combatTurn,
                actor: currentMonster.name,
                actorPortrait: currentMonster.portrait,
                action: fallbackAttackResult.isCriticalHit ? 'Attaque (CRIT)' : 'Attaque',
                target: target.name,
                damage,
                isPlayerAction: false,
                damageType: 'physical'
              });
              
              checkCombatEnd(logs, null, undefined, enemies);
            }
          }
        }
        
        setIsAnimating(false);
      };
      
      executeMonsterTurn();
    }
  }, [currentTurnIndex, isEnemyTurn, isAnimating]);

  const executeMonsterSkill = async (skill: MonsterSkill, monster: Monster) => {
    displayMonsterDialogue(`${skill.name}!`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aliveTeam = team.filter(c => c.hp > 0);
    const logs: string[] = [...combatLog];
    
    // Déterminer si la compétence nécessite un jet de touche
    // Pas de jet de touche pour: effets de zone, jets de sauvegarde, ou si explicitement désactivé
    const needsAttackRoll = skill.requiresAttackRoll !== false && 
                            !skill.areaOfEffect && 
                            !skill.savingThrow &&
                            (skill.type === 'attack' || skill.type === 'special' || skill.type === 'multiattack');
    
    if (skill.type === 'attack' || skill.type === 'special' || skill.type === 'multiattack') {
      if (aliveTeam.length > 0) {
        // Utiliser getMonsterTarget pour la Provocation
        const target = getMonsterTarget(aliveTeam);
        
        // Nombre d'attaques (pour multiattack)
        const attackCount = skill.attackCount || 1;
        let totalDamage = 0;
        let hitCount = 0;
        let critCount = 0;
        
        for (let i = 0; i < attackCount; i++) {
          if (needsAttackRoll) {
            // === JET DE TOUCHE D&D 5e POUR COMPÉTENCE DE MONSTRE ===
            const isSpell = skill.isSpellAttack || skill.damageType === 'magical';
            const skillAttackResult = makeAttackRoll(monster, target, isSpell, false, false);
            
            // Log du jet de touche
            const attackTypeIcon = isSpell ? '✨' : '⚔️';
            logs.push(`🎲 ${monster.name} (${skill.name}${attackCount > 1 ? ` #${i+1}` : ''}) : ${skillAttackResult.attackRoll.rolls[0]} + ${skillAttackResult.totalAttackBonus} = ${skillAttackResult.attackRoll.total} vs CA ${skillAttackResult.targetAC}`);
            
            // Afficher l'animation de dés 3D et attendre le clic
            await new Promise<void>(resolve => {
              setActiveDiceRoll({
                dieType: 'd20',
                count: 1,
                modifier: skillAttackResult.totalAttackBonus,
                damageType: isSpell ? 'magical' : 'physical',
                label: `${monster.name}: ${skill.name}`,
                preRolledValues: skillAttackResult.attackRoll.rolls,
                waitForClick: true,
                onDismiss: resolve
              });
            });
            
            // Afficher le résultat du jet et attendre le clic
            await new Promise<void>(resolve => {
              setLastAttackResult({
                roll: skillAttackResult.attackRoll.rolls[0],
                modifier: skillAttackResult.totalAttackBonus,
                total: skillAttackResult.attackRoll.total,
                targetAC: skillAttackResult.targetAC,
                hit: skillAttackResult.hit,
                isCritical: skillAttackResult.isCriticalHit,
                isCriticalMiss: skillAttackResult.isCriticalMiss,
                attacker: monster.name,
                target: target.name,
                waitForClick: true,
                onDismiss: resolve
              });
            });
            
            if (skillAttackResult.isCriticalMiss) {
              logs.push(`💨 Échec critique sur ${skill.name}${attackCount > 1 ? ` #${i+1}` : ''} !`);
            } else if (!skillAttackResult.hit) {
              logs.push(`${attackTypeIcon} ${skill.name}${attackCount > 1 ? ` #${i+1}` : ''} rate ${target.name} !`);
            } else if (checkEvasion(target) && !skillAttackResult.isCriticalHit) {
              logs.push(`💨 ${target.name} esquive ${skill.name}${attackCount > 1 ? ` #${i+1}` : ''} !`);
            } else {
              // TOUCHÉ !
              hitCount++;
              let damage = calculateDamage(skill.damage, monster, target, skill.damageType);
              
              if (skillAttackResult.isCriticalHit) {
                damage = Math.floor(damage * 2);
                critCount++;
              }
              
              totalDamage += damage;
              target.hp = Math.max(0, target.hp - damage);
              trackDamageTaken(target.id, damage);
              triggerDamageEffect(target.id, skill.damageType === 'magical' ? 'magical' : 'physical');
              
              if (skillAttackResult.isCriticalHit) {
                logs.push(`💥 CRITIQUE ! ${skill.name}${attackCount > 1 ? ` #${i+1}` : ''} inflige ${damage} dégâts à ${target.name} !`);
              } else {
                logs.push(`${attackTypeIcon} ${skill.name}${attackCount > 1 ? ` #${i+1}` : ''} touche ${target.name} pour ${damage} dégâts !`);
              }
              
              // Appliquer le renvoi de dégâts et épines
              applyDamageReflect(target, damage, monster, logs);
              
              // Vol de vie sur cette attaque
              if (skill.effect?.type === 'lifesteal') {
                const healed = Math.floor(damage * (skill.effect.value || 50) / 100);
                monster.hp = Math.min(monster.maxHp, monster.hp + healed);
                logs.push(`🧛 ${monster.name} récupère ${healed} PV !`);
              }
            }
          } else if (skill.savingThrow) {
            // === JET DE SAUVEGARDE D&D 5e ===
            const saveResult = makeSavingThrow(target, skill.savingThrow.ability, skill.savingThrow.dc);
            const abilityLabel = ABILITY_LABELS[skill.savingThrow.ability];
            
            const chosenSaveRoll = saveResult.roll.chosenRoll || saveResult.roll.rolls[0];
            logs.push(`🎲 ${target.name} jet de ${abilityLabel}: ${chosenSaveRoll} + ${saveResult.totalBonus} = ${saveResult.roll.total} vs DD ${skill.savingThrow.dc}`);
            
            // Afficher l'animation de dés 3D pour le jet de sauvegarde et attendre clic
            await new Promise<void>(resolve => {
              setActiveDiceRoll({
                dieType: 'd20',
                count: 1,
                modifier: saveResult.totalBonus,
                damageType: skill.damageType === 'magical' ? 'magical' : 'physical',
                label: `${target.name}: Jet de ${abilityLabel}`,
                preRolledValues: saveResult.roll.rolls,
                waitForClick: true,
                onDismiss: resolve
              });
            });
            
            if (saveResult.success) {
              // Sauvegarde réussie - dégâts réduits de moitié généralement
              const halfDamage = Math.floor(calculateDamage(skill.damage, monster, target, skill.damageType) / 2);
              if (halfDamage > 0) {
                totalDamage += halfDamage;
                hitCount++;
                target.hp = Math.max(0, target.hp - halfDamage);
                trackDamageTaken(target.id, halfDamage);
                triggerDamageEffect(target.id, skill.damageType === 'magical' ? 'magical' : 'physical');
                logs.push(`✓ Sauvegarde réussie ! ${target.name} ne subit que ${halfDamage} dégâts !`);
              } else {
                logs.push(`✓ ${target.name} esquive complètement ${skill.name} !`);
              }
            } else {
              // Sauvegarde ratée - dégâts complets
              const damage = calculateDamage(skill.damage, monster, target, skill.damageType);
              totalDamage += damage;
              hitCount++;
              target.hp = Math.max(0, target.hp - damage);
              trackDamageTaken(target.id, damage);
              triggerDamageEffect(target.id, skill.damageType === 'magical' ? 'magical' : 'physical');
              logs.push(`✗ Sauvegarde ratée ! ${target.name} subit ${damage} dégâts de ${skill.name} !`);
              
              applyDamageReflect(target, damage, monster, logs);
            }
          } else {
            // Pas de jet de touche ni save - effet automatique
            if (checkEvasion(target)) {
              logs.push(`💨 ${target.name} esquive ${skill.name} de ${monster.name} !`);
            } else {
              const damage = calculateDamage(skill.damage, monster, target, skill.damageType);
              totalDamage += damage;
              hitCount++;
              target.hp = Math.max(0, target.hp - damage);
              trackDamageTaken(target.id, damage);
              triggerDamageEffect(target.id, skill.damageType === 'magical' ? 'magical' : 'physical');
              
              logs.push(`${monster.name} utilise ${skill.name} ! (${damage} dégâts ${skill.damageType === 'magical' ? 'magiques' : 'physiques'} à ${target.name})`);
              
              applyDamageReflect(target, damage, monster, logs);
              
              if (skill.effect?.type === 'lifesteal') {
                const healed = Math.floor(damage * (skill.effect.value || 50) / 100);
                monster.hp = Math.min(monster.maxHp, monster.hp + healed);
                logs.push(`🧛 ${monster.name} récupère ${healed} PV !`);
              }
            }
          }
        }
        
        // Résumé pour multiattack
        if (attackCount > 1) {
          logs.push(`📊 Résumé: ${hitCount}/${attackCount} touches, ${totalDamage} dégâts totaux${critCount > 0 ? `, ${critCount} critiques` : ''}`);
        }
        
        addCombatHistoryEntry({
          turn: combatTurn,
          actor: monster.name,
          actorPortrait: monster.portrait,
          action: `${skill.name}${critCount > 0 ? ' (CRIT)' : ''}`,
          target: target.name,
          damage: totalDamage,
          isPlayerAction: false,
          damageType: skill.damageType
        });
      }
    } else if (skill.type === 'buff' && skill.effect) {
      if (skill.effect.type === 'heal') {
        monster.hp = Math.min(monster.maxHp, monster.hp + (skill.effect.value || 0));
        logs.push(`${monster.name} se régénère de ${skill.effect.value} PV !`);
      } else {
        logs.push(`${monster.name} utilise ${skill.name} !`);
      }
      
      addCombatHistoryEntry({
        turn: combatTurn,
        actor: monster.name,
        actorPortrait: monster.portrait,
        action: skill.name,
        heal: skill.effect.type === 'heal' ? skill.effect.value : undefined,
        isPlayerAction: false
      });
    }
    
    if (skill.cooldown) {
      skill.currentCooldown = skill.cooldown;
    }
    
    checkCombatEnd(logs, null, undefined, enemies);
  };

  // Vérifier fin de combat (multi-monstres)
  // updatedEnemies contient les ennemis avec leurs HP à jour (passé directement car setState est asynchrone)
  const checkCombatEnd = (logs: string[], lastAttackerId: string | null, killedEnemy?: Monster, updatedEnemies?: Monster[]) => {
    // IMPORTANT: Utiliser les ennemis passés en paramètre (car setState est asynchrone)
    const currentEnemiesList = updatedEnemies || enemies;
    const stillAliveEnemies = currentEnemiesList.filter(e => e.hp > 0);
    
    // Si un ennemi a été tué, ACCUMULER ses drops dans la ref (synchrone)
    if (killedEnemy && killedEnemy.hp <= 0) {
      if (lastAttackerId) {
        trackMonsterKill(lastAttackerId, killedEnemy);
      }
      
      // Générer les drops du monstre et les ACCUMULER dans la ref
      const drops = getMonsterDrops(killedEnemy);
      const encounterCount = state.encounterCount;
      const dropsWithTurn = drops.map(d => ({ ...d, obtainedAt: encounterCount }));
      
      logs.push(`💀 ${killedEnemy.name} est vaincu !`);
      
      if (dropsWithTurn.length > 0) {
        logs.push(`💎 ${killedEnemy.name} laisse tomber ${dropsWithTurn.length} objet(s) !`);
        // ACCUMULER les drops de manière SYNCHRONE via ref
        accumulatedDropsRef.current = [...accumulatedDropsRef.current, ...dropsWithTurn];
      }
    }
    
    // Vérifier si TOUS les monstres sont morts
    if (stillAliveEnemies.length === 0) {
      // TOUS les ennemis sont vaincus !
      const cleanTeam = state.team.map(c => {
        let cleanChar = { ...c };
        if (c.buffs) {
          c.buffs.forEach(buff => {
            if (buff.isApplied) {
              if (buff.type === 'attack') cleanChar.attack = Math.max(1, cleanChar.attack - buff.value);
              else if (buff.type === 'magicAttack') cleanChar.magicAttack = Math.max(1, (cleanChar.magicAttack || 0) - buff.value);
              else if (buff.type === 'defense') cleanChar.defense = Math.max(0, cleanChar.defense - buff.value);
              else if (buff.type === 'magicDefense') cleanChar.magicDefense = Math.max(0, cleanChar.magicDefense - buff.value);
              else if (buff.type === 'speed') cleanChar.speed = Math.max(1, cleanChar.speed - buff.value);
            }
          });
        }
        cleanChar.buffs = [];
        return cleanChar;
      });
      
      const isBossFight = currentEnemiesList.some(e => e.isBoss);
      
      // Récupérer TOUS les drops accumulés (ref est synchrone)
      const allDrops = [...accumulatedDropsRef.current];
      
      // S'il y a des drops à distribuer, afficher le modal
      if (allDrops.length > 0) {
        setPendingDrops({ drops: allDrops });
        gameStore.setState({ combatLog: [...logs, 'Victoire ! Récupération du butin...'], team: cleanTeam });
      } else {
        // Pas de drops, terminer le combat directement
        if (isBossFight) {
          gameStore.setState({ 
            phase: 'summary', 
            combatLog: [...logs, 'VICTOIRE ! Le boss est vaincu !'],
            currentEnemies: [],
            currentEnemy: undefined,
            team: cleanTeam
          });
        } else {
          gameStore.setState({ 
            phase: 'dungeon', 
            combatLog: [...logs, 'Victoire ! Tous les ennemis sont vaincus !'],
            currentEnemies: [],
            currentEnemy: undefined,
            team: cleanTeam
          });
        }
      }
      
      // Reset des drops accumulés
      accumulatedDropsRef.current = [];
      return;
    }
    
    // Il reste des monstres en vie - le combat continue
    // IMPORTANT: Utiliser le state global pour avoir les HP à jour
    const currentGlobalTeamForCheck = gameStore.getState().team;
    const teamAlive = currentGlobalTeamForCheck.some(c => c.hp > 0);
    if (!teamAlive) {
      // L'équipe est vaincue
      const cleanTeam = currentGlobalTeamForCheck.map(c => {
        let cleanChar = { ...c };
        if (c.buffs) {
          c.buffs.forEach(buff => {
            if (buff.isApplied) {
              if (buff.type === 'attack') cleanChar.attack = Math.max(1, cleanChar.attack - buff.value);
              else if (buff.type === 'magicAttack') cleanChar.magicAttack = Math.max(1, (cleanChar.magicAttack || 0) - buff.value);
              else if (buff.type === 'defense') cleanChar.defense = Math.max(0, cleanChar.defense - buff.value);
              else if (buff.type === 'magicDefense') cleanChar.magicDefense = Math.max(0, cleanChar.magicDefense - buff.value);
              else if (buff.type === 'speed') cleanChar.speed = Math.max(1, cleanChar.speed - buff.value);
            }
          });
        }
        cleanChar.buffs = [];
        return cleanChar;
      });
      gameStore.setState({ 
        phase: 'summary', 
        combatLog: [...logs, 'DÉFAITE...'],
        currentEnemies: [],
        currentEnemy: undefined,
        team: cleanTeam
      });
      accumulatedDropsRef.current = [];
    } else {
      // Le combat continue - passer au tour suivant
      // IMPORTANT: Utiliser le state global pour avoir les données à jour (cooldowns, HP, etc.)
      const currentGlobalTeam = gameStore.getState().team;
      
      // On doit vérifier les HP à jour (pas ceux dans turnOrder qui peuvent être obsolètes)
      const getEntityHp = (entity: Character | Monster): number => {
        // Si c'est un monstre, récupérer son HP à jour depuis currentEnemiesList
        if ('isBoss' in entity) {
          const updatedMonster = currentEnemiesList.find(e => e.id === entity.id);
          return updatedMonster ? updatedMonster.hp : entity.hp;
        }
        // Si c'est un personnage, récupérer son HP à jour depuis le state global
        const updatedChar = currentGlobalTeam.find(c => c.id === entity.id);
        return updatedChar ? updatedChar.hp : entity.hp;
      };
      
      let nextIndex = (currentTurnIndex + 1) % turnOrder.length;
      let attempts = 0;
      while (getEntityHp(turnOrder[nextIndex]) <= 0 && attempts < turnOrder.length) {
        nextIndex = (nextIndex + 1) % turnOrder.length;
        attempts++;
      }
      
      // Incrémenter les tours complets quand on revient au premier
      // NOTE: Les buffs sont décrémentés dans processBuffsForCharacter au début du tour de chaque personnage
      // NE PAS appeler gameStore.decrementBuffs() ici car cela causerait une double décrémentation !
      if (nextIndex === 0) {
        setFullRounds(prev => prev + 1); // Un tour complet est terminé !
        // Réinitialiser les actions légendaires pour le prochain round
        gameStore.resetLegendaryActionsForAll();
      }
      
      // Exécuter les actions légendaires après un tour de joueur
      // (le tour actuel était celui d'un joueur si currentTurn est un Character)
      const wasPlayerTurn = currentTurn && 'class' in currentTurn;
      let finalLogs = logs;
      if (wasPlayerTurn) {
        finalLogs = executeLegendaryAction(logs);
      }
      
      setCombatTurn(prev => prev + 1);
      // IMPORTANT: NE PAS écraser team - utiliser le state global qui contient les cooldowns à jour
      gameStore.setState({ 
        currentTurnIndex: nextIndex, 
        combatLog: finalLogs, 
        currentEnemies: currentEnemiesList
      });
    }
  };

  useEffect(() => {
    if (aliveEnemies.length > 0 && combatLog.length === 1) {
      const taunt = getMonsterTaunt(aliveEnemies[0], 'start');
      setTimeout(() => displayMonsterDialogue(taunt), 500);
    }
  }, []);
  
  // Fonction pour exécuter une action légendaire d'un monstre après un tour de joueur
  const executeLegendaryAction = useCallback((logs: string[]): string[] => {
    const updatedLogs = [...logs];
    
    // Trouver les monstres légendaires vivants avec des actions légendaires restantes
    const legendaryMonsters = aliveEnemies.filter(
      e => e.isLegendary && e.legendaryActions && e.legendaryActionsRemaining && e.legendaryActionsRemaining > 0
    );
    
    if (legendaryMonsters.length === 0) return updatedLogs;
    
    // Choisir un monstre légendaire au hasard
    const monster = legendaryMonsters[Math.floor(Math.random() * legendaryMonsters.length)];
    if (!monster.legendaryActions) return updatedLogs;
    
    // Filtrer les actions qu'il peut se permettre
    const affordableActions = monster.legendaryActions.filter(
      a => a.cost <= (monster.legendaryActionsRemaining || 0)
    );
    
    if (affordableActions.length === 0) return updatedLogs;
    
    // Choisir une action au hasard (30% de chance d'utiliser une action légendaire)
    if (Math.random() > 0.3) return updatedLogs;
    
    const action = affordableActions[Math.floor(Math.random() * affordableActions.length)];
    
    // Exécuter l'action
    const updatedMonster = gameStore.useLegendaryAction(monster.id, action.id);
    if (!updatedMonster) return updatedLogs;
    
    updatedLogs.push(`⚡ ${monster.name} utilise ${action.name} ! (Action légendaire)`);
    
    // Appliquer les effets de l'action
    if (action.damage && action.damage > 0) {
      const aliveTeam = team.filter(c => c.hp > 0);
      if (aliveTeam.length > 0) {
        const target = aliveTeam[Math.floor(Math.random() * aliveTeam.length)];
        const damage = Math.max(1, action.damage - target.defense);
        target.hp = Math.max(0, target.hp - damage);
        
        updatedLogs.push(`  → ${target.name} subit ${damage} dégâts !`);
        
        if (action.damageType) {
          triggerDamageEffect(target.id, action.damageType === 'fire' || action.damageType === 'cold' || 
            action.damageType === 'lightning' || action.damageType === 'psychic' || 
            action.damageType === 'necrotic' || action.damageType === 'radiant' ? 'magical' : 'physical');
        }
        
        addCombatHistoryEntry({
          turn: combatTurn,
          actor: monster.name,
          actorPortrait: monster.portrait,
          action: action.name + ' (Légendaire)',
          target: target.name,
          damage,
          isPlayerAction: false,
          damageType: action.damageType || 'physical'
        });
      }
    }
    
    // Appliquer les effets spéciaux
    if (action.effect) {
      if (action.effect.type === 'heal' && action.effect.value) {
        monster.hp = Math.min(monster.maxHp, monster.hp + action.effect.value);
        updatedLogs.push(`  → ${monster.name} récupère ${action.effect.value} PV !`);
      }
    }
    
    return updatedLogs;
  }, [aliveEnemies, team, combatTurn, triggerDamageEffect, addCombatHistoryEntry]);

  // Demander confirmation pour une attaque de base
  const requestAttack = () => {
    if (!isPlayerTurn || isAnimating || selectingTarget || pendingAction) return;
    if (aliveEnemies.length === 0) return;
    
    const currentCharId = (currentTurn as Character).id;
    const globalTeam = gameStore.getState().team;
    const attacker = globalTeam.find(c => c.id === currentCharId) || (currentTurn as Character);
    const target = aliveEnemies.find(e => e.id === selectedEnemy.id) || aliveEnemies[0];
    
    setPendingAction({
      type: 'attack',
      attacker,
      target
    });
  };
  
  // Annuler l'action en attente
  const cancelPendingAction = () => {
    setPendingAction(null);
  };
  
  // Exécuter l'attaque après confirmation
  const executeAttack = async () => {
    if (!pendingAction || pendingAction.type !== 'attack') return;
    
    const attacker = pendingAction.attacker!;
    const target = pendingAction.target as Monster;
    
    setPendingAction(null);
    setIsAnimating(true);
    
    const logs = [...combatLog];
    
    // === JET DE TOUCHE D&D 5e ===
    const hasAdvantage = hasAdvantageOnAttack(attacker, target);
    const hasDisadvantage = hasDisadvantageOnAttack(attacker, target);
    const attackResult = makeAttackRoll(attacker, target, false, hasAdvantage, hasDisadvantage);
    
    // Afficher le résultat du jet avec les 2 dés si avantage/désavantage
    const rolls = attackResult.attackRoll.rolls;
    
    // Afficher l'animation de dés 3D avec waitForClick pour attendre le clic du joueur
    await new Promise<void>(resolve => {
      setActiveDiceRoll({
        dieType: 'd20',
        count: 1,
        modifier: attackResult.totalAttackBonus,
        damageType: 'physical',
        label: `${attacker.name} attaque ${target.name} !`,
        preRolledValues: rolls,
        waitForClick: true,
        onDismiss: resolve
      });
    });
    
    // Afficher le résultat et attendre le clic du joueur pour continuer
    await new Promise<void>(resolve => {
      setLastAttackResult({
        roll: rolls[0],
        roll2: rolls.length > 1 ? rolls[1] : undefined,
        modifier: attackResult.totalAttackBonus,
        total: attackResult.attackRoll.total,
        targetAC: attackResult.targetAC,
        hit: attackResult.hit,
        isCritical: attackResult.isCriticalHit,
        isCriticalMiss: attackResult.isCriticalMiss,
        hasAdvantage,
        hasDisadvantage,
        attacker: attacker.name,
        target: target.name,
        waitForClick: true,
        onDismiss: resolve
      });
    });
    
    // Log du jet de touche avec les 2 dés affichés
    const chosenRoll = attackResult.attackRoll.chosenRoll || rolls[0];
    const rollText = hasAdvantage ? `🎲🎲 (Avantage: ${rolls[0]}/${rolls[1]} → ${chosenRoll})` : 
                     hasDisadvantage ? `🎲🎲 (Désavantage: ${rolls[0]}/${rolls[1]} → ${chosenRoll})` : '🎲';
    logs.push(`${rollText} Jet d'attaque: ${chosenRoll} + ${attackResult.totalAttackBonus} = ${attackResult.attackRoll.total} vs CA ${attackResult.targetAC}`);
    
    // Si l'attaque rate
    if (!attackResult.hit) {
      logs.push(`❌ ${attacker.name} rate son attaque contre ${target.name} !`);
      
      addCombatHistoryEntry({
        turn: combatTurn,
        actor: attacker.name,
        actorPortrait: attacker.portrait,
        action: attackResult.isCriticalMiss ? 'Échec critique!' : 'Raté',
        target: target.name,
        effect: `🎲 ${attackResult.attackRoll.total} vs CA ${attackResult.targetAC}`,
        isPlayerAction: true,
        damageType: 'physical'
      });
      
      checkCombatEnd(logs, attacker.id, undefined, enemies);
      setIsAnimating(false);
      return;
    }
    
    // === CALCUL DES DÉGÂTS ===
    const isCritical = attackResult.isCriticalHit;
    
    // Jet de dégâts avec les dés
    const damageResult = rollDamage(attacker.attack, 'physical', isCritical, 0);
    let damage = damageResult.totalDamage;
    
    // Appliquer la défense
    const defense = target.defense;
    damage = Math.max(1, damage - defense);
    
    if (isCritical) {
      logs.push(`💥 COUP CRITIQUE ! ${attacker.name} frappe avec puissance !`);
    }
    
    target.hp = Math.max(0, target.hp - damage);
    trackDamageDealt(attacker.id, damage);
    triggerDamageEffect(target.id, 'physical');
    
    // Appliquer le vol de vie passif (depuis les objets/trésors)
    let attackerHp = attacker.hp;
    if (attacker.passiveEffects?.lifesteal && attacker.passiveEffects.lifesteal > 0) {
      const stolen = Math.floor(damage * attacker.passiveEffects.lifesteal / 100);
      if (stolen > 0) {
        attackerHp = Math.min(attacker.maxHp, attacker.hp + stolen);
        trackHealing(attacker.id, stolen);
        logs.push(`🧛 ${attacker.name} vole ${stolen} PV !`);
      }
    }
    
    // Mettre à jour les HP dans la liste locale des ennemis
    const updatedEnemies = enemies.map(e => 
      e.id === target.id ? { ...e, hp: target.hp } : e
    );
    
    // Mettre à jour le state avec les HP modifiés des ennemis
    gameStore.setState({ currentEnemies: updatedEnemies });
    
    // Mettre à jour l'équipe avec les HP (vol de vie ou non)
    const currentTeam = gameStore.getState().team;
    const updatedTeam = currentTeam.map(c => 
      c.id === attacker.id ? { ...c, hp: attackerHp } : c
    );
    gameStore.setState({ team: updatedTeam });
    
    addCombatHistoryEntry({
      turn: combatTurn,
      actor: attacker.name,
      actorPortrait: attacker.portrait,
      action: isCritical ? 'Attaque CRITIQUE!' : 'Attaque',
      target: target.name,
      damage,
      effect: `🎲 ${attackResult.attackRoll.total} vs CA ${attackResult.targetAC}`,
      isPlayerAction: true,
      damageType: 'physical'
    });
    
    logs.push(`${attacker.name} inflige ${damage} dégâts (${damageResult.damageRoll.rolls.join('+')}${damageResult.damageRoll.modifier !== 0 ? (damageResult.damageRoll.modifier > 0 ? '+' : '') + damageResult.damageRoll.modifier : ''}) à ${target.name} !`);
    
    // Vérifier si l'ennemi ciblé est mort
    const killedEnemy = target.hp <= 0 ? { ...target } : undefined;
    
    if (target.hp > 0) {
      const hpPercent = target.hp / target.maxHp;
      if (hpPercent < 0.3) {
        setTimeout(() => displayMonsterDialogue(getMonsterTaunt(target, 'low_hp')), 500);
      } else {
        setTimeout(() => displayMonsterDialogue(getMonsterTaunt(target, 'hurt')), 500);
      }
    }
    
    // Passer updatedEnemies directement car setState est asynchrone
    checkCombatEnd(logs, attacker.id, killedEnemy, updatedEnemies);
    setIsAnimating(false);
  };

  // Demander confirmation pour une compétence
  const requestSkillUse = (skill: Skill) => {
    if (!isPlayerTurn || isAnimating || pendingAction) return;
    
    // Vérifier le cooldown
    if (skill.currentCooldown && skill.currentCooldown > 0) {
      return; // Compétence en cooldown, ne rien faire
    }
    
    const currentCharId = (currentTurn as Character).id;
    const globalTeam = gameStore.getState().team;
    const attacker = globalTeam.find(c => c.id === currentCharId) || (currentTurn as Character);
    
    // Pour les compétences de type 'damage' (obtenues via objets), cibler ennemi par défaut
    const targetType = skill.targetType || (skill.type === 'heal' || skill.type === 'buff' ? 'ally' : 'enemy');
    
    if (targetType === 'all_allies' || targetType === 'self') {
      // Pour self et all_allies, pas besoin de sélection de cible, demander confirmation directement
      setPendingAction({
        type: 'skill',
        skill,
        attacker,
        target: targetType === 'self' ? attacker : undefined
      });
      return;
    }
    
    if (targetType === 'ally') {
      // Besoin de sélectionner un allié, ouvrir la sélection de cible
      setSelectingTarget('ally');
      setPendingSkill(skill);
    } else {
      // Compétence offensive, cibler l'ennemi sélectionné et demander confirmation
      const target = aliveEnemies.find(e => e.id === selectedEnemy.id) || aliveEnemies[0];
      setPendingAction({
        type: 'skill',
        skill,
        attacker,
        target
      });
    }
  };

  const handleTargetSelect = (target: Character) => {
    if (!pendingSkill || !selectingTarget) return;
    
    const currentCharId = (currentTurn as Character).id;
    const globalTeam = gameStore.getState().team;
    const attacker = globalTeam.find(c => c.id === currentCharId) || (currentTurn as Character);
    
    // Demander confirmation avec la cible sélectionnée
    setPendingAction({
      type: 'skill',
      skill: pendingSkill,
      attacker,
      target
    });
    
    setSelectingTarget(null);
    setPendingSkill(null);
  };

  const cancelTargetSelection = () => {
    setSelectingTarget(null);
    setPendingSkill(null);
  };
  
  // Confirmer et exécuter l'action en attente
  const confirmAction = async () => {
    if (!pendingAction) return;
    
    if (pendingAction.type === 'attack') {
      await executeAttack();
    } else if (pendingAction.type === 'skill' && pendingAction.skill && pendingAction.attacker) {
      const skill = pendingAction.skill;
      const attacker = pendingAction.attacker;
      const target = pendingAction.target || null;
      
      setPendingAction(null);
      executeSkill(skill, attacker, target as Character | Monster | null);
    }
  };

  const executeSkill = async (skill: Skill, attackerParam: Character, target: Character | Monster | null) => {
    setIsAnimating(true);
    const logs: string[] = [...combatLog];
    const damageType = skill.damageType || 'physical';
    
    // IMPORTANT: Récupérer l'attacker depuis le STATE GLOBAL pour avoir les passiveEffects à jour
    let currentTeam = gameStore.getState().team;
    let attacker = currentTeam.find(c => c.id === attackerParam.id) || attackerParam;
    
    // Appliquer le cooldown à la compétence utilisée
    if (skill.cooldown && skill.cooldown > 0) {
      const updatedTeam = currentTeam.map(char => {
        if (char.id === attacker.id) {
          return {
            ...char,
            skills: char.skills.map(s => 
              s.id === skill.id ? { ...s, currentCooldown: skill.cooldown } : s
            )
          };
        }
        return char;
      });
      gameStore.setState({ team: updatedTeam });
      
      // Mettre à jour aussi l'attacker local pour que les actions suivantes aient le bon state
      attacker = updatedTeam.find(c => c.id === attacker.id) || attacker;
      currentTeam = updatedTeam;
    }
    
    if (skill.type === 'heal') {
      // IMPORTANT: Récupérer le team depuis le STATE GLOBAL pour préserver les cooldowns
      const currentTeamState = gameStore.getState().team;
      const updatedTeam = currentTeamState.map(c => ({ ...c, skills: c.skills?.map(s => ({ ...s })) || [] }));
      const targetIndices: number[] = [];
      
      // Déterminer les cibles de soin
      if (skill.targetType === 'all_allies') {
        // Soin de groupe - soigner tous les alliés vivants
        updatedTeam.forEach((c, i) => { if (c.hp > 0) targetIndices.push(i); });
      } else if (skill.targetType === 'self') {
        const idx = updatedTeam.findIndex(c => c.id === attacker.id);
        if (idx !== -1) targetIndices.push(idx);
      } else if (target && 'class' in target) {
        const idx = updatedTeam.findIndex(c => c.id === target.id);
        if (idx !== -1) targetIndices.push(idx);
      }
      
      let totalHealing = 0;
      
      // Vérifier si c'est une compétence de PV temporaires (Simulacre de vie)
      const isTempHpSkill = skill.id === 'false_life' || skill.name.toLowerCase().includes('simulacre');
      
      targetIndices.forEach(idx => {
        const t = updatedTeam[idx];
        
        if (isTempHpSkill) {
          // PV TEMPORAIRES - Jet de dés: 1d4+4
          const tempHpRoll = rollDice('d4', 1, 4);
          const tempHpAmount = tempHpRoll.total;
          
          // Les PV temporaires ne s'accumulent pas - on garde le max
          const currentTempHp = t.temporaryHp || 0;
          t.temporaryHp = Math.max(currentTempHp, tempHpAmount);
          
          logs.push(`✨ ${t.name} gagne ${tempHpAmount} PV temporaires (🎲 ${tempHpRoll.rolls[0]}+4) !`);
        } else {
          // Soin normal
          const healAmount = Math.min(Math.abs(skill.damage), t.maxHp - t.hp);
          t.hp = Math.min(t.maxHp, t.hp + Math.abs(skill.damage));
          totalHealing += healAmount;
        }
        
        if (skill.healOverTime) {
          const regen: ActiveBuff = {
            id: 'regen_' + Date.now() + '_' + t.id,
            name: 'Régénération',
            type: 'regen',
            value: skill.healOverTime.value,
            turnsRemaining: skill.healOverTime.turns,
            ownerId: t.id,
            icon: '💚',
            isApplied: false
          };
          t.buffs = [...(t.buffs || []), regen];
        }
      });
      
      if (!isTempHpSkill) {
        trackHealing(attacker.id, totalHealing);
      }
      
      if (targetIndices.length > 1) {
        if (isTempHpSkill) {
          logs.push(`${attacker.name} utilise ${skill.name} sur toute l'équipe !`);
        } else {
          logs.push(`${attacker.name} utilise ${skill.name} sur toute l'équipe ! (+${Math.abs(skill.damage)} PV chacun)`);
        }
        if (skill.healOverTime) {
          logs.push(`Toute l'équipe régénère ${skill.healOverTime.value} PV/tour pendant ${skill.healOverTime.turns} tours`);
        }
      } else if (targetIndices.length === 1) {
        const t = updatedTeam[targetIndices[0]];
        if (!isTempHpSkill) {
          logs.push(`${attacker.name} utilise ${skill.name} sur ${t.name} ! (+${Math.abs(skill.damage)} PV)`);
        }
        if (skill.healOverTime) {
          logs.push(`${t.name} régénère ${skill.healOverTime.value} PV/tour pendant ${skill.healOverTime.turns} tours`);
        }
      }
      
      addCombatHistoryEntry({
        turn: combatTurn,
        actor: attacker.name,
        actorPortrait: attacker.portrait,
        action: skill.name,
        target: targetIndices.length > 1 ? 'Équipe' : (targetIndices.length === 1 ? updatedTeam[targetIndices[0]].name : 'Personne'),
        heal: totalHealing,
        isPlayerAction: true,
        damageType
      });
      
      // Mettre à jour l'équipe
      gameStore.setState({ team: updatedTeam });
    } else if (skill.type === 'buff') {
      // IMPORTANT: Récupérer le team depuis le STATE GLOBAL (pas la closure) pour préserver les cooldowns
      const currentTeamState = gameStore.getState().team;
      const updatedTeam = currentTeamState.map(c => ({ ...c, skills: c.skills?.map(s => ({ ...s })) || [] }));
      const targetIndices: number[] = [];
      
      // Déterminer les cibles
      if (skill.targetType === 'all_allies') {
        updatedTeam.forEach((c, i) => { if (c.hp > 0) targetIndices.push(i); });
      } else if (skill.targetType === 'self') {
        const idx = updatedTeam.findIndex(c => c.id === attacker.id);
        if (idx !== -1) targetIndices.push(idx);
      } else if (target && 'class' in target) {
        const idx = updatedTeam.findIndex(c => c.id === target.id);
        if (idx !== -1) targetIndices.push(idx);
      }
      
      targetIndices.forEach(idx => {
        const t = updatedTeam[idx];
        if (skill.buffStats) {
          const getBuffIcon = (stat: string) => {
            switch (stat) {
              case 'attack': return '⚔️';
              case 'magicAttack': return '✨';
              case 'defense': return '🛡️';
              case 'magicDefense': return '🔮';
              case 'speed': return '💨';
              default: return '📈';
            }
          };
          
          const getStatLabel = (stat: string) => {
            switch (stat) {
              case 'attack': return 'Attaque';
              case 'magicAttack': return 'Att. Magique';
              case 'defense': return 'Défense';
              case 'magicDefense': return 'Rés. Magique';
              case 'speed': return 'Vitesse';
              default: return stat;
            }
          };
          
          const buff: ActiveBuff = {
            id: skill.id + '_' + Date.now() + '_' + t.id,
            name: skill.name,
            type: skill.buffStats.stat as any,
            value: skill.buffStats.value,
            turnsRemaining: skill.buffStats.turns,
            ownerId: t.id,
            icon: getBuffIcon(skill.buffStats.stat),
            isApplied: true
          };
          
          // Initialiser buffs si nécessaire
          if (!t.buffs) t.buffs = [];
          t.buffs = [...t.buffs, buff];
          
          // Recalculer les stats à partir des baseStats + tous les buffs actifs
          const recalculated = gameStore.recalculateStats(t);
          t.attack = recalculated.attack;
          t.magicAttack = recalculated.magicAttack;
          t.defense = recalculated.defense;
          t.magicDefense = recalculated.magicDefense;
          t.speed = recalculated.speed;
          t.baseAttack = recalculated.baseAttack;
          t.baseMagicAttack = recalculated.baseMagicAttack;
          t.baseDefense = recalculated.baseDefense;
          t.baseMagicDefense = recalculated.baseMagicDefense;
          t.baseSpeed = recalculated.baseSpeed;
          
          logs.push(`${t.name} gagne +${skill.buffStats.value} ${getStatLabel(skill.buffStats.stat)} pendant ${skill.buffStats.turns} tours !`);
        }
        
        if (skill.damageReflect) {
          const reflect: ActiveBuff = {
            id: 'reflect_' + Date.now() + '_' + t.id,
            name: 'Renvoi de dégâts',
            type: 'damage_reflect',
            value: skill.damageReflect,
            turnsRemaining: 3,
            ownerId: t.id,
            icon: '🔄',
            isApplied: true
          };
          if (!t.buffs) t.buffs = [];
          t.buffs = [...t.buffs, reflect];
          logs.push(`${t.name} renvoie ${skill.damageReflect}% des dégâts pendant 3 tours !`);
        }
      });
      
      // Mettre à jour le state avec l'équipe modifiée
      gameStore.setState({ team: updatedTeam });
      
      logs.push(`${attacker.name} utilise ${skill.name} !`);
      
      addCombatHistoryEntry({
        turn: combatTurn,
        actor: attacker.name,
        actorPortrait: attacker.portrait,
        action: skill.name,
        target: targetIndices.length === 1 ? updatedTeam[targetIndices[0]].name : 'Équipe',
        effect: skill.buffStats ? `+${skill.buffStats.value} ${skill.buffStats.stat} (${skill.buffStats.turns}t)` : skill.damageReflect ? `Renvoi ${skill.damageReflect}%` : '',
        isPlayerAction: true
      });
    } else if ((skill.type === 'debuff' || skill.type === 'attack' || skill.type === 'damage') && target && 'isBoss' in target) {
      let damage = skill.damage;
      
      if (damage > 0) {
        // Déterminer si la compétence nécessite un jet de touche
        // Pas de jet pour: effets de zone, jets de sauvegarde, ou explicitement désactivé (requiresAttackRoll: false)
        const needsAttackRoll = skill.requiresAttackRoll === true && 
                                !skill.areaOfEffect && 
                                !skill.savingThrow;
        
        let hit = true;
        let isCritical = false;
        
        if (needsAttackRoll) {
          // === JET DE TOUCHE D&D 5e POUR COMPÉTENCE DE JOUEUR ===
          // Vérifier si la compétence donne l'avantage (ex: Attaque téméraire)
          const skillGrantsAdvantage = skill.grantAdvantage === true;
          const hasAdvantage = skillGrantsAdvantage || hasAdvantageOnAttack(attacker, target);
          const hasDisadvantage = hasDisadvantageOnAttack(attacker, target);
          
          // Déterminer si c'est une attaque de sort ou physique
          const isSpell = skill.isSpellAttack === true;
          const skillAttackResult = makeAttackRoll(attacker, target, isSpell, hasAdvantage, hasDisadvantage);
          
          // Afficher le résultat du jet avec les 2 dés si avantage/désavantage
          const skillRolls = skillAttackResult.attackRoll.rolls;
          const chosenSkillRoll = skillAttackResult.attackRoll.chosenRoll || skillRolls[0];
          
          // Afficher l'animation de dés 3D avec waitForClick pour attendre le clic du joueur
          await new Promise<void>(resolve => {
            setActiveDiceRoll({
              dieType: 'd20',
              count: 1,
              modifier: skillAttackResult.totalAttackBonus,
              damageType: isSpell ? 'magical' : 'physical',
              label: `${attacker.name}: ${skill.name}`,
              preRolledValues: skillRolls,
              waitForClick: true,
              onDismiss: resolve
            });
          });
          
          // Afficher le résultat et attendre le clic du joueur
          await new Promise<void>(resolve => {
            setLastAttackResult({
              roll: skillRolls[0],
              roll2: skillRolls.length > 1 ? skillRolls[1] : undefined,
              modifier: skillAttackResult.totalAttackBonus,
              total: skillAttackResult.attackRoll.total,
              targetAC: skillAttackResult.targetAC,
              hit: skillAttackResult.hit,
              isCritical: skillAttackResult.isCriticalHit,
              isCriticalMiss: skillAttackResult.isCriticalMiss,
              hasAdvantage,
              hasDisadvantage,
              attacker: attacker.name,
              target: target.name,
              waitForClick: true,
              onDismiss: resolve
            });
          });
          
          // Log du jet de touche avec indication d'avantage si applicable
          const advantageText = skillGrantsAdvantage ? `🎲🎲 (Téméraire: ${skillRolls.join('/')} → ${chosenSkillRoll})` : 
                               hasAdvantage ? `🎲🎲 (Avantage: ${skillRolls.join('/')} → ${chosenSkillRoll})` : 
                               hasDisadvantage ? `🎲🎲 (Désavantage: ${skillRolls.join('/')})` : '🎲';
          logs.push(`${advantageText} ${attacker.name} (${skill.name}): ${chosenSkillRoll} + ${skillAttackResult.totalAttackBonus} = ${skillAttackResult.attackRoll.total} vs CA ${skillAttackResult.targetAC}`);
          
          hit = skillAttackResult.hit;
          isCritical = skillAttackResult.isCriticalHit;
          
          if (skillAttackResult.isCriticalMiss) {
            logs.push(`💨 Échec critique ! ${skill.name} rate complètement !`);
            addCombatHistoryEntry({
              turn: combatTurn,
              actor: attacker.name,
              actorPortrait: attacker.portrait,
              action: `${skill.name} (échec crit.)`,
              target: target.name,
              damage: 0,
              isPlayerAction: true,
              damageType
            });
            checkCombatEnd(logs, attacker.id, undefined, enemies);
            setIsAnimating(false);
            return;
          } else if (!hit) {
            const missIcon = skill.isSpellAttack ? '✨' : '⚔️';
            logs.push(`${missIcon} ${skill.name} rate ${target.name} !`);
            addCombatHistoryEntry({
              turn: combatTurn,
              actor: attacker.name,
              actorPortrait: attacker.portrait,
              action: `${skill.name} (raté)`,
              target: target.name,
              damage: 0,
              isPlayerAction: true,
              damageType
            });
            checkCombatEnd(logs, attacker.id, undefined, enemies);
            setIsAnimating(false);
            return;
          }
        } else {
          // Pas de jet de touche - vérifier le coup critique normal
          const critCheck = checkCritical(attacker);
          isCritical = critCheck.isCritical;
        }
        
        // TOUCHÉ ! Calcul des dégâts
        const actualDamage = calculateDamage(damage, attacker, target, damageType, skill, isCritical);
        
        target.hp = Math.max(0, target.hp - actualDamage);
        trackDamageDealt(attacker.id, actualDamage);
        
        // Déterminer si c'est un dégât physique ou magique pour l'effet visuel
        const isPhysicalDmg = isPhysicalDamage(damageType);
        triggerDamageEffect(target.id, isPhysicalDmg ? 'physical' : 'magical');
        
        // Mettre à jour les HP dans la liste locale des ennemis
        const updatedEnemies = enemies.map(e => 
          e.id === target.id ? { ...e, hp: target.hp } : e
        );
        gameStore.setState({ currentEnemies: updatedEnemies });
        
        if (isCritical) {
          logs.push(`💥 COUP CRITIQUE ! ${attacker.name} utilise ${skill.name} !`);
        }
        logs.push(`${attacker.name} utilise ${skill.name} ! (${actualDamage} dégâts ${damageType === 'magical' ? 'magiques' : damageType === 'holy' ? 'sacrés' : 'physiques'} à ${target.name})`);
        
        addCombatHistoryEntry({
          turn: combatTurn,
          actor: attacker.name,
          actorPortrait: attacker.portrait,
          action: isCritical ? `${skill.name} (CRITIQUE!)` : skill.name,
          target: target.name,
          damage: actualDamage,
          isPlayerAction: true,
          damageType
        });
        
        // Lifesteal de la compétence
        let totalLifesteal = skill.lifesteal || 0;
        
        // Ajouter le lifesteal passif du personnage (des objets/trésors)
        if (attacker.passiveEffects?.lifesteal) {
          totalLifesteal += attacker.passiveEffects.lifesteal;
        }
        
        if (totalLifesteal > 0) {
          const stolen = Math.floor(actualDamage * totalLifesteal / 100);
          attacker.hp = Math.min(attacker.maxHp, attacker.hp + stolen);
          trackHealing(attacker.id, stolen);
          logs.push(`🧛 ${attacker.name} récupère ${stolen} PV (vol de vie ${totalLifesteal}%) !`);
          
          // Mettre à jour l'équipe pour persister le vol de vie
          const currentTeam = gameStore.getState().team;
          const updatedTeam = currentTeam.map(c => 
            c.id === attacker.id ? { ...c, hp: attacker.hp } : c
          );
          gameStore.setState({ team: updatedTeam });
        }
        
        if (target.hp > 0) {
          const hpPercent = target.hp / target.maxHp;
          if (hpPercent < 0.3) {
            setTimeout(() => displayMonsterDialogue(getMonsterTaunt(target, 'low_hp')), 500);
          } else {
            setTimeout(() => displayMonsterDialogue(getMonsterTaunt(target, 'hurt')), 500);
          }
        }
        
        // Vérifier si l'ennemi ciblé est mort (pour le tracking)
        const killedEnemy = target.hp <= 0 ? { ...target } : undefined;
        checkCombatEnd(logs, attacker.id, killedEnemy, updatedEnemies);
        setIsAnimating(false);
        return;
      }
      
      checkCombatEnd(logs, attacker.id, undefined, enemies);
      setIsAnimating(false);
      return;
    }
    
    checkCombatEnd(logs, attacker.id, undefined, enemies);
    setIsAnimating(false);
  };

  const renderBuffs = (character: Character) => {
    if (!character.buffs || character.buffs.length === 0) return null;
    return (
      <div className="active-buffs">
        {character.buffs.map((buff, i) => (
          <span key={i} className="buff-icon" title={`${buff.name}: ${buff.turnsRemaining} tour(s) restant(s)`}>
            {buff.icon}<sub>{buff.turnsRemaining}</sub>
          </span>
        ))}
      </div>
    );
  };

  // Rendu des buffs pour les monstres
  const renderMonsterBuffs = (monster: Monster) => {
    if (!monster.buffs || monster.buffs.length === 0) return null;
    return (
      <div className="active-buffs monster-buffs">
        {monster.buffs.map((buff, i) => (
          <span key={i} className="buff-icon" title={`${buff.name}: ${buff.turnsRemaining} tour(s) restant(s)`}>
            {buff.icon}<sub>{buff.turnsRemaining}</sub>
          </span>
        ))}
      </div>
    );
  };

  const getSkillIcon = (skill: Skill) => {
    if (skill.type === 'heal') return '💚';
    if (skill.type === 'buff') return '⬆️';
    if (skill.type === 'debuff') return '⬇️';
    if (skill.damageType === 'magical') return '🔮';
    if (skill.damageType === 'holy') return '✝️';
    if (skill.lifesteal) return '🧛';
    if (skill.poison) return '🧪';
    if (skill.damageReflect) return '🔄';
    return '⚔️';
  };

  // Détermine si un type de dégâts est physique (utilise ATK) ou magique (utilise MAG)
  const isPhysicalDamageType = (type?: string): boolean => {
    if (!type) return true; // Par défaut physique
    return ['physical', 'bludgeoning', 'piercing', 'slashing'].includes(type);
  };

  const getDamageTypeLabel = (type?: string) => {
    if (!type) return 'Physique';
    
    // Types physiques D&D
    if (isPhysicalDamageType(type)) {
      switch (type) {
        case 'bludgeoning': return 'Contondant';
        case 'piercing': return 'Perforant';
        case 'slashing': return 'Tranchant';
        default: return 'Physique';
      }
    }
    
    // Types magiques/élémentaires D&D
    switch (type) {
      case 'magical': return 'Magique';
      case 'holy': 
      case 'radiant': return 'Radiant ✨';
      case 'fire': return 'Feu 🔥';
      case 'cold': return 'Froid ❄️';
      case 'lightning': return 'Foudre ⚡';
      case 'thunder': return 'Tonnerre 🔊';
      case 'acid': return 'Acide 🧪';
      case 'poison': return 'Poison ☠️';
      case 'necrotic': return 'Nécrotique 💀';
      case 'force': return 'Force 💫';
      case 'psychic': return 'Psychique 🧠';
      default: return 'Magique';
    }
  };

  // Générer le tooltip des stats avec les modifications
  const getStatsTooltip = (entity: Character | Monster): string => {
    const lines: string[] = [];
    
    if ('class' in entity) {
      // C'est un personnage
      const char = entity as Character;
      lines.push(`📊 ${char.name} - ${char.class}`);
      lines.push(`─────────────────`);
      lines.push(`⚔️ Attaque: ${char.attack}`);
      lines.push(`✨ Att. Magique: ${char.magicAttack || 0}`);
      lines.push(`🛡️ Défense: ${char.defense}`);
      lines.push(`🔮 Rés. Magique: ${char.magicDefense}`);
      lines.push(`💨 Vitesse: ${char.speed}`);
      
      if (char.buffs && char.buffs.length > 0) {
        lines.push(`─────────────────`);
        lines.push(`✨ Buffs actifs:`);
        char.buffs.forEach(buff => {
          const sign = buff.type === 'regen' || buff.type === 'damage_reflect' ? '' : '+';
          let statName = '';
          switch (buff.type) {
            case 'attack': statName = 'ATK'; break;
            case 'magicAttack': statName = 'MAG'; break;
            case 'defense': statName = 'DEF'; break;
            case 'magicDefense': statName = 'RÉS'; break;
            case 'speed': statName = 'VIT'; break;
            case 'regen': statName = 'Régén PV/tour'; break;
            case 'damage_reflect': statName = 'Renvoi %'; break;
            case 'poison': statName = 'Poison'; break;
          }
          lines.push(`  ${buff.icon} ${buff.name}: ${sign}${buff.value} ${statName} (${buff.turnsRemaining}t)`);
        });
      }
    } else {
      // C'est un monstre
      const monster = entity as Monster;
      lines.push(`👹 ${monster.name}`);
      if (monster.isBoss) lines.push(`👑 BOSS`);
      lines.push(`─────────────────`);
      lines.push(`⚔️ Attaque: ${monster.attack}`);
      lines.push(`🛡️ Défense: ${monster.defense}`);
      lines.push(`🔮 Rés. Magique: ${monster.magicDefense}`);
      lines.push(`💨 Vitesse: ${monster.speed}`);
    }
    
    return lines.join('\n');
  };

  // Obtenir la couleur de stat modifiée (pour personnages et monstres)
  const getStatModClass = (entity: Character | Monster, statType: string): string => {
    if (!entity.buffs) return '';
    const buff = entity.buffs.find(b => b.type === statType);
    if (buff) {
      return buff.value > 0 ? 'stat-buffed' : 'stat-debuffed';
    }
    return '';
  };

  // Obtenir l'indicateur de modification pour les monstres
  const getStatModIndicator = (entity: Character | Monster, statType: string): JSX.Element | null => {
    if (!entity.buffs) return null;
    const buff = entity.buffs.find(b => b.type === statType);
    if (buff) {
      return buff.value > 0 
        ? <span className="stat-mod-indicator buff">⬆</span> 
        : <span className="stat-mod-indicator debuff">⬇</span>;
    }
    return null;
  };

  // Sélectionner un personnage pour recevoir un drop
  const handleSelectDropCharacter = (item: InventoryItem) => {
    setSelectingDropCharacter(item);
  };

  // Assigner un drop à un personnage
  const handleAssignDrop = (characterId: string) => {
    if (!selectingDropCharacter || !pendingDrops) return;
    
    // IMPORTANT: Utiliser gameStore.getState().team pour préserver les cooldowns !
    const currentTeam = gameStore.getState().team;
    const character = currentTeam.find(c => c.id === characterId);
    if (!character) return;
    
    // Créer une copie du personnage pour appliquer les effets
    const characterCopy = { 
      ...character, 
      skills: character.skills?.map(s => ({ ...s })) || [],
      inventory: [...(character.inventory || [])]
    };
    
    // Appliquer les effets de l'objet
    const effects = applyDropEffect(selectingDropCharacter, characterCopy);
    
    // Ajouter à l'inventaire
    characterCopy.inventory.push(selectingDropCharacter);
    
    // Mettre à jour le state en préservant les cooldowns des autres personnages
    const updatedTeam = currentTeam.map(c => 
      c.id === characterId ? characterCopy : c
    );
    gameStore.setState({ team: updatedTeam });
    
    // Retirer l'item des drops en attente
    const remainingDrops = pendingDrops.drops.filter(d => d.id !== selectingDropCharacter.id);
    
    // Log l'attribution
    const logs = [...combatLog, `${character.name} obtient ${selectingDropCharacter.icon} ${selectingDropCharacter.name} ! ${effects.join(', ')}`];
    gameStore.setState({ combatLog: logs });
    
    setSelectingDropCharacter(null);
    
    if (remainingDrops.length === 0) {
      // TOUS les drops distribués - maintenant terminer le combat
      setPendingDrops(null);
      
      // Vérifier si c'était un boss fight (utiliser enemies qui contient tous les monstres du combat)
      const isBossFight = enemies.some(e => e.isBoss);
      
      if (isBossFight) {
        gameStore.setState({ 
          phase: 'summary', 
          combatLog: [...logs, 'VICTOIRE ! Le boss est vaincu !'],
          currentEnemies: [],
          currentEnemy: undefined
        });
      } else {
        gameStore.setState({ 
          phase: 'dungeon', 
          combatLog: [...logs, `Combat terminé !`],
          currentEnemies: [],
          currentEnemy: undefined
        });
      }
    } else {
      setPendingDrops({ drops: remainingDrops });
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#a0a0a0';
      case 'rare': return '#4a9eff';
      case 'epic': return '#a855f7';
      case 'legendary': return '#fbbf24';
      default: return '#fff';
    }
  };

  return (
    <div className={`combat-page ${screenShake ? 'screen-shake' : ''}`}>
      <div className="combat-header">
        <h2>⚔️ COMBAT ⚔️</h2>
        {enemies.some(e => e.isBoss) && <span className="boss-label">👑 BOSS</span>}
        {enemies.length > 1 && <span className="multi-enemy-label">⚔️ {aliveEnemies.length}/{enemies.length}</span>}
      </div>

      {selectingTarget && (
        <div className="target-selection-overlay">
          <div className="target-selection-modal">
            <h3>🎯 Choisir la cible de {pendingSkill?.name}</h3>
            <p className="skill-desc">{pendingSkill?.description}</p>
            <div className="target-list">
              {team.filter(c => c.hp > 0).map(character => (
                <button
                  key={character.id}
                  className="target-btn"
                  onClick={() => handleTargetSelect(character)}
                >
                  <span className="target-portrait">{character.portrait}</span>
                  <div className="target-info">
                    <span className="target-name">{character.name}</span>
                    <span className="target-class">{character.class}</span>
                    <div className="target-hp">
                      <div 
                        className="hp-fill" 
                        style={{ 
                          width: `${(character.hp / character.maxHp) * 100}%`,
                          background: getHpBarColor(character.hp, character.maxHp)
                        }}
                      ></div>
                      <span className="hp-text">{character.hp}/{character.maxHp}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button className="cancel-btn" onClick={cancelTargetSelection}>
              ❌ Annuler
            </button>
          </div>
        </div>
      )}

      <div className="combat-main-layout">
        {/* Bouton toggle historique mobile */}
        <button 
          className={`mobile-history-toggle ${isMobileHistoryOpen ? 'open' : ''}`}
          onClick={() => setIsMobileHistoryOpen(!isMobileHistoryOpen)}
        >
          {isMobileHistoryOpen ? '▶' : '◀'}
        </button>

        <div className={`combat-history-panel ${isHistoryExpanded ? 'expanded' : 'compact'} ${isMobileHistoryOpen ? 'mobile-open' : ''}`}>
          {/* Bouton fermer mobile */}
          <button 
            className="close-history-btn"
            onClick={() => setIsMobileHistoryOpen(false)}
          >
            ✕
          </button>
          <div className="history-header" onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}>
            <h4>📜 Historique ({combatHistory.length})</h4>
            <button className="history-toggle-btn">
              {isHistoryExpanded ? '▼ Réduire' : '▲ Agrandir'}
            </button>
          </div>
          <div className="combat-history-list">
            {combatHistory.length === 0 ? (
              <p className="history-empty">⏳ En attente de la première action...</p>
            ) : (
              [...combatHistory].reverse().slice(0, isHistoryExpanded ? 100 : 8).map(entry => {
                // Icône de type de dégâts selon D&D
                const getDamageIcon = (type: string | undefined) => {
                  switch (type) {
                    case 'fire': return '🔥';
                    case 'cold': return '❄️';
                    case 'lightning': return '⚡';
                    case 'poison': return '☠️';
                    case 'necrotic': return '💀';
                    case 'radiant': case 'holy': return '✨';
                    case 'force': return '💫';
                    case 'magical': return '🔮';
                    case 'slashing': return '🗡️';
                    case 'piercing': return '🏹';
                    case 'bludgeoning': return '🔨';
                    default: return '⚔️';
                  }
                };
                
                return (
                  <div 
                    key={entry.id} 
                    className={`combat-history-entry ${entry.isPlayerAction ? 'player' : 'enemy'}`}
                  >
                    <div className="history-actor">
                      <span className="history-portrait">{entry.actorPortrait}</span>
                      <span className="history-turn">Tour {entry.turn}</span>
                    </div>
                    <div className="history-details">
                      <span className="history-action">
                        {entry.isPlayerAction ? '🎯' : '👹'} {entry.action}
                      </span>
                      {entry.target && (
                        <span className="history-target">
                          ➜ <strong>{entry.target}</strong>
                        </span>
                      )}
                      {entry.damage !== undefined && entry.damage > 0 && (
                        <span className={`history-damage ${entry.damageType || 'physical'}`}>
                          {getDamageIcon(entry.damageType)} -{entry.damage} dégâts
                        </span>
                      )}
                      {entry.heal !== undefined && entry.heal > 0 && (
                        <span className="history-heal">💚 +{entry.heal} PV restaurés</span>
                      )}
                      {entry.effect && (
                        <span className="history-effect">✦ {entry.effect}</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="combat-arena">
          {/* Section des ennemis - Support multi-monstres */}
          <div className="enemies-section">
            {enemies.length > 1 && (
              <div className="enemy-count-badge">
                {aliveEnemies.length} / {enemies.length} ennemis
              </div>
            )}
            
            {/* Indicateur scaling boss */}
            {enemies.some(e => e.isBoss) && bossScaling > 0 && (
              <div className="boss-scaling-badge">
                ⚡ Renforcé +{bossScaling}%
              </div>
            )}
            
            <div className="enemies-grid">
              {enemies.map((enemy, idx) => {
                const isCurrentTurn = currentTurn && 'isBoss' in currentTurn && (currentTurn as Monster).id === enemy.id;
                const isSelected = idx === (selectedEnemyIndex || 0);
                const isDead = enemy.hp <= 0;
                const isReceivingDamage = damageEffect?.targetId === enemy.id;
                const dmgType = damageEffect?.type;
                
                return (
                  <div 
                    key={enemy.id}
                    className={`enemy-card ${isCurrentTurn ? 'active-turn' : ''} ${isSelected ? 'selected' : ''} ${isDead ? 'dead' : ''} ${isReceivingDamage ? `damage-${dmgType}` : ''}`}
                    onClick={() => !isDead && gameStore.setState({ selectedEnemyIndex: idx })}
                    onContextMenu={(e) => handleContextMenu(e, enemy)}
                    onTouchStart={() => handleTouchStart(enemy)}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                  >
                    <div className="enemy-portrait-container">
                      <div className={`enemy-portrait ${isAnimating && isCurrentTurn ? 'attacking' : ''}`}>
                        {enemy.portrait}
                      </div>
                      
                      {showDialogue && isSelected && (
                        <div className="monster-dialogue">
                          <div className="dialogue-bubble">
                            <span className="dialogue-text">{monsterDialogue}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="enemy-name">{enemy.name}</h3>
                    {enemy.isBoss && <span className="boss-badge">👑 BOSS</span>}
                    {enemy.monsterType && (
                      <span className="monster-type">{enemy.monsterType}</span>
                    )}
                    {renderMonsterBuffs(enemy)}
                    <div className="enemy-hp-bar">
                      <div 
                        className="hp-fill enemy" 
                        style={{ 
                          width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%`,
                          background: getHpBarColor(enemy.hp, enemy.maxHp)
                        }}
                      ></div>
                      <span className="hp-text">{Math.max(0, enemy.hp)}/{enemy.maxHp}</span>
                    </div>
                    
                    {/* Stats avec tooltip détaillé */}
                    <div className="enemy-stats stats-with-tooltip">
                      <span className={getStatModClass(enemy, 'attack')}>
                        ⚔️ {enemy.attack}
                        {getStatModIndicator(enemy, 'attack')}
                      </span>
                      <span className={getStatModClass(enemy, 'magicAttack')}>
                        ✨ {enemy.magicAttack || 0}
                        {getStatModIndicator(enemy, 'magicAttack')}
                      </span>
                      <span className={getStatModClass(enemy, 'defense')}>
                        🛡️ {enemy.defense}
                        {getStatModIndicator(enemy, 'defense')}
                      </span>
                      <span className={getStatModClass(enemy, 'magicDefense')}>
                        🔮 {enemy.magicDefense}
                        {getStatModIndicator(enemy, 'magicDefense')}
                      </span>
                      <span className={getStatModClass(enemy, 'speed')}>
                        💨 {enemy.speed}
                        {getStatModIndicator(enemy, 'speed')}
                      </span>
                      {renderStatsTooltip(enemy)}
                    </div>
                    
                    {enemy.skills && enemy.skills.length > 0 && !isDead && (
                      <div className="monster-skills">
                        <span className="skills-label">Compétences:</span>
                        <div className="skills-list">
                          {enemy.skills.map(skill => (
                            <span 
                              key={skill.id} 
                              className={`monster-skill-tag ${skill.damageType}`}
                              title={skill.description}
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {isDead && <div className="enemy-dead-overlay">💀 VAINCU</div>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="versus">VS</div>

          <div className="team-section">
            {team.map(character => {
              const isCurrent = currentTurn && 'id' in currentTurn && currentTurn.id === character.id;
              const isDead = character.hp <= 0;
              const isReceivingDamage = damageEffect?.targetId === character.id;
              const damageType = damageEffect?.type;
              
              return (
                <div 
                  key={character.id} 
                  className={`team-fighter ${isCurrent ? 'active-turn' : ''} ${isDead ? 'dead' : ''} ${isReceivingDamage ? `damage-${damageType}` : ''}`}
                  title={getStatsTooltip(character)}
                  onContextMenu={(e) => handleContextMenu(e, character)}
                  onTouchStart={() => handleTouchStart(character)}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={handleTouchEnd}
                >
                  <span className="fighter-portrait">{character.portrait}</span>
                  <div className="fighter-info">
                    <span className="fighter-name">{character.name}</span>
                    <span className="fighter-class">{character.class}</span>
                    {renderBuffs(character)}
                    <div className="fighter-hp-bar">
                      <div 
                        className="hp-fill" 
                        style={{ 
                          width: `${Math.max(0, (character.hp / character.maxHp) * 100)}%`,
                          background: getHpBarColor(character.hp, character.maxHp)
                        }}
                      ></div>
                      {/* PV Temporaires - Effet visuel */}
                      {character.temporaryHp && character.temporaryHp > 0 && (
                        <>
                          <div 
                            className="temp-hp-fill" 
                            style={{ 
                              width: `${Math.min(100, (character.temporaryHp / character.maxHp) * 100)}%`
                            }}
                          ></div>
                          <span className="temp-hp-indicator">+{character.temporaryHp} temp</span>
                        </>
                      )}
                      <span className="hp-text">
                        {Math.max(0, character.hp)}/{character.maxHp}
                        {character.temporaryHp && character.temporaryHp > 0 && ` (+${character.temporaryHp})`}
                      </span>
                    </div>
                    <div className="fighter-all-stats stats-with-tooltip">
                      <span className={getStatModClass(character, 'attack')}>
                        ⚔️{character.attack}
                        {character.buffs?.find(b => b.type === 'attack') && <span className="stat-mod-indicator">⬆</span>}
                      </span>
                      <span className={getStatModClass(character, 'magicAttack')}>
                        ✨{character.magicAttack || 0}
                        {character.buffs?.find(b => b.type === 'magicAttack') && <span className="stat-mod-indicator">⬆</span>}
                      </span>
                      <span className={getStatModClass(character, 'defense')}>
                        🛡️{character.defense}
                        {character.buffs?.find(b => b.type === 'defense') && <span className="stat-mod-indicator">⬆</span>}
                      </span>
                      <span className={getStatModClass(character, 'magicDefense')}>
                        🔮{character.magicDefense}
                        {character.buffs?.find(b => b.type === 'magicDefense') && <span className="stat-mod-indicator">⬆</span>}
                      </span>
                      <span className={getStatModClass(character, 'speed')}>
                        💨{character.speed}
                        {character.buffs?.find(b => b.type === 'speed') && <span className="stat-mod-indicator">⬆</span>}
                      </span>
                      {renderStatsTooltip(character)}
                    </div>
                  </div>
                  {isCurrent && <span className="turn-indicator">⚡</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isPlayerTurn && !isAnimating && !selectingTarget && (currentTurn as Character).hp > 0 && (
        <div className={`combat-actions action-panel ${isActionsMinimized ? 'minimized' : ''}`}>
          <div className="actions-header">
            <div className="action-panel-buttons">
              <button 
                className="action-panel-btn inventory"
                onClick={() => gameStore.setState({ showInventory: true })}
              >
                🎒 Inv
              </button>
              <button 
                className="action-panel-btn menu"
                onClick={() => gameStore.setState({ showPauseMenu: true })}
              >
                ⚙️
              </button>
              <button 
                className={`animation-toggle-btn ${autoMode ? 'auto-on' : 'auto-off'}`}
                onClick={toggleAutoMode}
                title={autoMode ? 'Mode Auto activé' : 'Mode Auto désactivé'}
              >
                <span className="toggle-icon">{autoMode ? '🔓' : '🔒'}</span>
              </button>
              {/* Bouton minimize visible UNIQUEMENT sur mobile/tablette */}
              <button 
                className="minimize-actions-btn mobile-only"
                onClick={() => setIsActionsMinimized(!isActionsMinimized)}
              >
                {isActionsMinimized ? '▼ Ouvrir' : '▲ Réduire'}
              </button>
            </div>
            <h4>⚔️ ACTIONS</h4>
          </div>
          <div className="action-buttons">
            <button
              className="action-btn attack"
              onClick={requestAttack}
            >
              <span className="action-icon">⚔️</span>
              <span>Attaque</span>
              <span className="damage-preview">{(currentTurn as Character).attack} dégâts</span>
            </button>
            {(currentTurn as Character).skills?.filter(s => s.currentCooldown === 0 || s.currentCooldown === undefined).map(skill => (
              <div key={skill.id} className="skill-btn-wrapper">
                <button
                  className={`action-btn skill ${skill.type || ''}`}
                  onClick={() => requestSkillUse(skill)}
                >
                  <span>{skill.name}</span>
                  <span className="damage-preview">
                    {skill.type === 'heal' ? `+${skill.healing} PV` : `${skill.damage} dégâts`}
                  </span>
                </button>
                <div className="skill-tooltip">
                  <div className="tooltip-header">{skill.name}</div>
                  <p className="tooltip-desc">{skill.description}</p>
                  <div className="tooltip-stats">
                    {skill.damage > 0 && (
                      <div className="tooltip-stat">
                        <span className="stat-name">Dégâts</span>
                        <span className="stat-value">{skill.damage}</span>
                      </div>
                    )}
                    {skill.healing && skill.healing > 0 && (
                      <div className="tooltip-stat">
                        <span className="stat-name">Soins</span>
                        <span className="stat-value heal">+{skill.healing}</span>
                      </div>
                    )}
                    {skill.cooldown && skill.cooldown > 0 && (
                      <div className="tooltip-stat">
                        <span className="stat-name">Recharge</span>
                        <span className="stat-value">{skill.cooldown} tours</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {(currentTurn as Character).skills?.filter(s => s.currentCooldown && s.currentCooldown > 0).map(skill => (
              <div key={skill.id} className="skill-btn-wrapper">
                <button
                  className="action-btn skill on-cooldown"
                  disabled
                >
                  <span>{skill.name}</span>
                  <span className="cooldown-indicator">🕐 {skill.currentCooldown} tours</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isAnimating && !selectingTarget && (
        <div className="combat-waiting">
          <p>{isEnemyTurn && currentTurn ? `${(currentTurn as Monster).name} prépare son attaque...` : 'Exécution...'}</p>
        </div>
      )}

      <div className="turn-order">
        <h4>Initiative</h4>
        <div className="turn-list">
          {turnOrder.map((entity, i) => {
            const isDead = entity.hp <= 0;
            return (
              <div 
                key={i} 
                className={`turn-item ${i === currentTurnIndex ? 'current' : ''} ${isDead ? 'dead' : ''}`}
                title={'name' in entity ? entity.name : ''}
              >
                {'portrait' in entity && entity.portrait}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de distribution des drops */}
      {pendingDrops && pendingDrops.drops.length > 0 && (
        <div className="drops-overlay">
          <div className="drops-modal">
            <h2>💎 Butin obtenu !</h2>
            <p className="drops-info">Sélectionnez un objet puis choisissez le personnage qui le recevra.</p>
            
            <div className="drops-list">
              {pendingDrops.drops.map((drop, i) => (
                <div 
                  key={i} 
                  className={`drop-item ${selectingDropCharacter?.id === drop.id ? 'selected' : ''}`}
                  style={{ borderColor: getRarityColor(drop.rarity) }}
                  onClick={() => handleSelectDropCharacter(drop)}
                >
                  <span className="drop-icon">{drop.icon}</span>
                  <div className="drop-info">
                    <span className="drop-name" style={{ color: getRarityColor(drop.rarity) }}>
                      {drop.name}
                    </span>
                    <span className="drop-rarity">{drop.rarity}</span>
                    <span className="drop-desc">{drop.description}</span>
                  </div>
                </div>
              ))}
            </div>

            {selectingDropCharacter && (
              <div className="character-select-section">
                <h3>Attribuer {selectingDropCharacter.icon} {selectingDropCharacter.name} à :</h3>
                <div className="character-buttons">
                  {team.filter(c => c.hp > 0).map(char => (
                    <button 
                      key={char.id}
                      className="char-select-btn with-stats"
                      onClick={() => handleAssignDrop(char.id)}
                    >
                      <span className="char-portrait">{char.portrait}</span>
                      <div className="char-info">
                        <span className="char-name">{char.name}</span>
                        <span className="char-class">{char.class}</span>
                        <div className="char-hp">❤️ {char.hp}/{char.maxHp}</div>
                        <div className="char-stats-grid">
                          <span title="Attaque">⚔️ {char.attack}</span>
                          <span title="Attaque Magique">✨ {char.magicAttack || 0}</span>
                          <span title="Défense">🛡️ {char.defense}</span>
                          <span title="Défense Magique">🔮 {char.magicDefense}</span>
                          <span title="Vitesse">💨 {char.speed}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Fenêtre de confirmation d'action */}
      {pendingAction && (
        <div className="action-confirmation-overlay" onClick={cancelPendingAction}>
          <div className="action-confirmation-modal" onClick={e => e.stopPropagation()}>
            <div className="confirmation-header">
              <h3>⚔️ Confirmer l'action</h3>
            </div>
            <div className="confirmation-content">
              {pendingAction.type === 'attack' ? (
                <p>
                  <span className="confirmation-actor">{pendingAction.attacker?.portrait} {pendingAction.attacker?.name}</span>
                  <span className="confirmation-arrow">➤</span>
                  <span className="confirmation-action">Attaque</span>
                  <span className="confirmation-arrow">➤</span>
                  <span className="confirmation-target">{'portrait' in (pendingAction.target || {}) ? (pendingAction.target as Monster).portrait : ''} {pendingAction.target?.name}</span>
                </p>
              ) : (
                <p>
                  <span className="confirmation-actor">{pendingAction.attacker?.portrait} {pendingAction.attacker?.name}</span>
                  <span className="confirmation-arrow">➤</span>
                  <span className="confirmation-action">{pendingAction.skill?.name}</span>
                  {pendingAction.target && (
                    <>
                      <span className="confirmation-arrow">➤</span>
                      <span className="confirmation-target">
                        {'portrait' in pendingAction.target ? pendingAction.target.portrait : ''} {pendingAction.target.name}
                      </span>
                    </>
                  )}
                </p>
              )}
              {pendingAction.skill?.description && (
                <p className="confirmation-description">{pendingAction.skill.description}</p>
              )}
            </div>
            <div className="confirmation-buttons">
              <button className="confirmation-btn cancel" onClick={cancelPendingAction}>
                ❌ Annuler
              </button>
              <button className="confirmation-btn confirm" onClick={confirmAction}>
                ✅ Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu contextuel (clic droit) */}
      {contextMenu && (
        <div 
          className="context-menu"
          style={{ 
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000
          }}
          onClick={e => e.stopPropagation()}
        >
          <button className="context-menu-item" onClick={handleExamine}>
            🔍 Examiner
          </button>
        </div>
      )}
      
      {/* Fiche de personnage/monstre */}
      {showCharacterSheet && (
        <CharacterSheet 
          entity={showCharacterSheet}
          onClose={() => setShowCharacterSheet(null)}
        />
      )}
      
      {/* Animation de dés 3D */}
      {activeDiceRoll && (
        <DiceRoller
          roll={{
            dieType: activeDiceRoll.dieType,
            count: activeDiceRoll.preRolledValues?.length || activeDiceRoll.count,
            modifier: activeDiceRoll.modifier,
            damageType: activeDiceRoll.damageType,
            label: activeDiceRoll.label,
            preRolledValues: activeDiceRoll.preRolledValues
          }}
          onComplete={() => {
            if (activeDiceRoll.onDismiss) {
              activeDiceRoll.onDismiss();
            }
            setActiveDiceRoll(null);
          }}
          showAnimation={true}
          damageType={activeDiceRoll.damageType}
          waitForClick={activeDiceRoll.waitForClick}
        />
      )}
      
      {/* Indicateur de jet d'attaque D&D amélioré */}
      {lastAttackResult && (
        <div 
          className={`attack-roll-indicator ${lastAttackResult.hit ? 'hit' : 'miss'} ${lastAttackResult.isCritical ? 'critical' : ''} ${lastAttackResult.isCriticalMiss ? 'critical-miss' : ''} ${lastAttackResult.waitForClick ? 'clickable' : ''}`}
          onClick={() => {
            if (lastAttackResult.onDismiss) {
              lastAttackResult.onDismiss();
            }
            setLastAttackResult(null);
          }}
        >
          <div className="roll-header">
            <span className="roll-attacker">{lastAttackResult.attacker}</span>
            <span className="roll-arrow">⚔️</span>
            <span className="roll-target">{lastAttackResult.target}</span>
          </div>
          
          {/* Affichage des dés - 2 si avantage/désavantage */}
          <div className="roll-dice-container">
            {lastAttackResult.hasAdvantage && (
              <div className="advantage-label">🎲🎲 AVANTAGE</div>
            )}
            {lastAttackResult.hasDisadvantage && (
              <div className="disadvantage-label">🎲🎲 DÉSAVANTAGE</div>
            )}
            
            <div className="roll-dice">
              {/* Premier dé */}
              <div className={`die-3d d20 ${lastAttackResult.roll === 20 ? 'nat20' : lastAttackResult.roll === 1 ? 'nat1' : ''} ${
                lastAttackResult.hasAdvantage && lastAttackResult.roll2 !== undefined 
                  ? (lastAttackResult.roll > lastAttackResult.roll2 ? 'chosen' : 'discarded')
                  : lastAttackResult.hasDisadvantage && lastAttackResult.roll2 !== undefined
                    ? (lastAttackResult.roll < lastAttackResult.roll2 ? 'chosen' : 'discarded')
                    : 'chosen'
              }`}>
                <span className="die-value">{lastAttackResult.roll}</span>
              </div>
              
              {/* Second dé si avantage/désavantage */}
              {lastAttackResult.roll2 !== undefined && (
                <div className={`die-3d d20 ${lastAttackResult.roll2 === 20 ? 'nat20' : lastAttackResult.roll2 === 1 ? 'nat1' : ''} ${
                  lastAttackResult.hasAdvantage 
                    ? (lastAttackResult.roll2 > lastAttackResult.roll ? 'chosen' : 'discarded')
                    : (lastAttackResult.roll2 < lastAttackResult.roll ? 'chosen' : 'discarded')
                }`}>
                  <span className="die-value">{lastAttackResult.roll2}</span>
                </div>
              )}
              
              <span className="roll-modifier">
                +{lastAttackResult.modifier}
              </span>
            </div>
          </div>
          
          <div className={`roll-total ${lastAttackResult.hit ? 'hit' : 'miss'}`}>
            = <span className="total-value">{lastAttackResult.total}</span>
          </div>
          <div className="roll-vs-ac">
            vs CA <span className="ac-value">{lastAttackResult.targetAC}</span>
          </div>
          <div className={`roll-result ${lastAttackResult.isCritical ? 'critical' : lastAttackResult.isCriticalMiss ? 'critical-miss' : lastAttackResult.hit ? 'hit' : 'miss'}`}>
            {lastAttackResult.isCritical ? '💥 COUP CRITIQUE !' : 
             lastAttackResult.isCriticalMiss ? '💨 ÉCHEC CRITIQUE !' :
             lastAttackResult.hit ? '✓ TOUCHÉ !' : '✗ RATÉ !'}
          </div>
          {lastAttackResult.waitForClick && (
            <div className="click-to-continue">
              👆 Cliquez pour continuer
            </div>
          )}
        </div>
      )}
    </div>
  );
}
