import { Character, Monster, GameEvent, Room, GameState, HistoryEntry, TreasureLegacy, PendingTreasureData } from '../types/game.types';
import { getRandomMonster, getRandomBoss, MONSTERS, resetLegendaryActions } from '../data/monsters';
import { getRandomEvent } from '../data/events';
import { getRandomTreasure, Treasure, allTreasures } from '../data/treasures';

// Calculer le modificateur D&D à partir d'une caractéristique
const getModifier = (score: number): number => Math.floor((score - 10) / 2);

// Import des fonctions D&D
import { 
  getAbilityModifier, 
  getProficiencyBonus, 
  calculateArmorClass 
} from '../config/dndSystem';

// Récupérer les monstres accompagnateurs d'un boss
const getBossMinions = (boss: Monster): Monster[] => {
  if (!boss.minions || boss.minions.length === 0) return [];
  
  const minions: Monster[] = [];
  // Sélectionner 1-2 monstres accompagnateurs aléatoires parmi la liste du boss
  const minionCount = Math.floor(Math.random() * 2) + 1; // 1 ou 2 monstres
  
  for (let i = 0; i < minionCount; i++) {
    const minionId = boss.minions[Math.floor(Math.random() * boss.minions.length)];
    const minionTemplate = MONSTERS.find(m => m.id === minionId);
    
    if (minionTemplate) {
      minions.push({
        ...minionTemplate,
        id: `${minionTemplate.id}_minion_${i}_${Date.now()}`,
        skills: minionTemplate.skills?.map(s => ({ ...s }))
      });
    }
  }
  
  return minions;
};

// État initial du jeu
const createInitialRooms = (): Room[][] => {
  const rooms: Room[][] = [];
  for (let y = 0; y < 20; y++) {
    rooms[y] = [];
    for (let x = 0; x < 20; x++) {
      rooms[y][x] = {
        x,
        y,
        discovered: false,
        visited: false,
        type: 'unknown'
      };
    }
  }
  // Position de départ au centre
  rooms[10][10] = {
    x: 10,
    y: 10,
    discovered: true,
    visited: true,
    type: 'start'
  };
  return rooms;
};

const initialState: GameState = {
  phase: 'menu',
  team: [],
  currentRoom: { x: 10, y: 10 },
  rooms: createInitialRooms(),
  encounterCount: 0,
  combatCount: 0, // Compteur de combats pour le scaling du boss
  bossScaling: 0, // 0% au début, +5% par combat
  currentEnemies: [], // Plusieurs monstres possibles
  combatLog: [],
  combatHistory: [],
  combatTurn: 1,
  turnOrder: [],
  currentTurnIndex: 0,
  history: [],
  pendingTreasures: [],
  selectedEnemyIndex: 0,
  // Système de niveaux (50 niveaux de donjon)
  dungeonLevel: 1,
  roomsPerLevel: 10, // 10 salles au niveau 1
  roomsExploredThisLevel: 0, // Compteur de salles explorées
  previousBossId: undefined,
  monsterScaling: 0, // Pas de scaling au niveau 1
  bossScalingMultiplier: 0 // Pas de scaling au niveau 1
};

// Store simple avec listeners
type Listener = () => void;
let state: GameState = { ...initialState };
let listeners: Listener[] = [];

// Clé pour localStorage
const STORAGE_KEY = 'eternalys_game_state';

// Phases qui peuvent être persistées (pas menu, pas écrans de fin)
const PERSISTABLE_PHASES = ['character_select', 'dungeon', 'combat', 'event', 'treasure'];

// Sauvegarder l'état dans localStorage
const saveToLocalStorage = (gameState: GameState) => {
  try {
    // Ne sauvegarder que si on est dans une phase de jeu actif
    if (PERSISTABLE_PHASES.includes(gameState.phase)) {
      // Créer une copie complète pour la sauvegarde
      const stateToSave = {
        phase: gameState.phase,
        team: gameState.team,
        currentRoom: gameState.currentRoom,
        rooms: gameState.rooms,
        encounterCount: gameState.encounterCount,
        combatCount: gameState.combatCount,
        bossScaling: gameState.bossScaling,
        currentEnemies: gameState.currentEnemies,
        currentEnemy: gameState.currentEnemy,
        combatTurn: gameState.combatTurn,
        turnOrder: gameState.turnOrder,
        currentTurnIndex: gameState.currentTurnIndex,
        history: gameState.history,
        combatLog: gameState.combatLog,
        combatHistory: gameState.combatHistory,
        pendingTreasures: gameState.pendingTreasures,
        selectedEnemyIndex: gameState.selectedEnemyIndex,
        dungeonLevel: gameState.dungeonLevel,
        roomsPerLevel: gameState.roomsPerLevel,
        previousBossId: gameState.previousBossId,
        monsterScaling: gameState.monsterScaling,
        bossScalingMultiplier: gameState.bossScalingMultiplier,
        // Timestamp pour debug
        savedAt: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }
  } catch (e) {
    console.warn('Impossible de sauvegarder l\'état du jeu:', e);
  }
};

// Charger l'état depuis localStorage
const loadFromLocalStorage = (): Partial<GameState> | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Vérifier que la phase est valide et que l'équipe existe
      if (parsed && PERSISTABLE_PHASES.includes(parsed.phase) && parsed.team && parsed.team.length > 0) {
        console.log('[GameStore] État restauré depuis localStorage, phase:', parsed.phase);
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Impossible de charger l\'état du jeu:', e);
    // En cas d'erreur, effacer la sauvegarde corrompue
    clearLocalStorage();
  }
  return null;
};

// Effacer la sauvegarde
const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // Ignorer
  }
};

export const gameStore = {
  getState: (): GameState => state,
  
  subscribe: (listener: Listener): (() => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  
  setState: (newState: Partial<GameState>) => {
    state = { ...state, ...newState };
    // Sauvegarder automatiquement à chaque changement d'état
    saveToLocalStorage(state);
    listeners.forEach(l => l());
  },
  
  // Restaurer l'état sauvegardé (appelé au démarrage)
  restoreSavedState: (): boolean => {
    const saved = loadFromLocalStorage();
    if (saved && saved.team && saved.team.length > 0) {
      state = { ...initialState, ...saved };
      listeners.forEach(l => l());
      return true;
    }
    return false;
  },
  
  // Effacer la sauvegarde locale
  clearSavedState: () => {
    clearLocalStorage();
  },
  
  // Actions
  startGame: () => {
    gameStore.setState({ phase: 'character_select' });
  },
  
  selectTeam: (team: Character[]) => {
    // Appliquer les bonus des caractéristiques D&D aux stats de combat
    // puis s'assurer que les buffs sont initialisés
    const initializedTeam = team.map(c => {
      const withBonuses = applyAbilityBonuses(c);
      return { 
        ...withBonuses, 
        buffs: [],
        magicDefense: withBonuses.magicDefense || 10
      };
    });
    
    gameStore.setState({
      team: initializedTeam,
      phase: 'dungeon',
      rooms: createInitialRooms(),
      currentRoom: { x: 10, y: 10 },
      encounterCount: 0,
      history: [],
      pendingTreasures: [],
      dungeonLevel: 1,
      roomsPerLevel: 10,
      previousBossId: undefined,
      monsterScaling: 0,
      bossScalingMultiplier: 0
    });
  },
  
  addToHistory: (entry: HistoryEntry) => {
    const history = [...state.history, entry];
    gameStore.setState({ history });
  },
  
  moveToRoom: (x: number, y: number) => {
    const rooms = [...state.rooms.map(row => [...row])];
    const encounterCount = state.encounterCount + 1;
    
    // Découvrir la salle
    rooms[y][x].discovered = true;
    rooms[y][x].visited = true;
    
    // Nombre de salles avant le boss selon le niveau
    const roomsBeforeBoss = state.roomsPerLevel;
    
    // Scaling des monstres et boss selon le niveau
    const monsterMultiplier = 1 + (state.monsterScaling / 100);
    const bossMultiplier = 1 + (state.bossScalingMultiplier / 100);
    
    // La Xème rencontre est le boss (selon roomsPerLevel)
    if (encounterCount >= roomsBeforeBoss) {
      // Choisir un boss adapté au niveau du donjon, différent du précédent
      let boss = getRandomBoss(state.dungeonLevel);
      let attempts = 0;
      while (boss.id === state.previousBossId && attempts < 10) {
        boss = getRandomBoss(state.dungeonLevel);
        attempts++;
      }
      
      // Scaling du boss = bossScaling (combats) + bossScalingMultiplier (niveau)
      const totalBossScaling = (state.bossScaling / 100) + (bossMultiplier - 1);
      
      // Appliquer le scaling au boss
      const scaledBoss: Monster = {
        ...boss,
        hp: Math.floor(boss.hp * (1 + totalBossScaling)),
        maxHp: Math.floor(boss.maxHp * (1 + totalBossScaling)),
        attack: Math.floor(boss.attack * (1 + totalBossScaling)),
        magicAttack: boss.magicAttack ? Math.floor(boss.magicAttack * (1 + totalBossScaling)) : undefined,
        defense: Math.floor(boss.defense * (1 + totalBossScaling)),
        magicDefense: Math.floor(boss.magicDefense * (1 + totalBossScaling)),
        ultimateUsed: false,
        ultimateTurnTrigger: boss.ultimateTurnTrigger || 5,
        ultimateSkill: boss.ultimateSkill ? {
          ...boss.ultimateSkill,
          damage: Math.floor((boss.ultimateSkill.damage || 0) * (1 + totalBossScaling))
        } : undefined,
        skills: boss.skills?.map(s => ({
          ...s,
          damage: Math.floor(s.damage * (1 + totalBossScaling))
        }))
      };
      
      // Récupérer les monstres accompagnateurs thématiques (avec scaling)
      const minions = getBossMinions(boss).map(m => ({
        ...m,
        hp: Math.floor(m.hp * monsterMultiplier),
        maxHp: Math.floor(m.maxHp * monsterMultiplier),
        attack: Math.floor(m.attack * monsterMultiplier),
        magicAttack: m.magicAttack ? Math.floor(m.magicAttack * monsterMultiplier) : undefined,
        defense: Math.floor(m.defense * monsterMultiplier),
        magicDefense: Math.floor(m.magicDefense * monsterMultiplier)
      }));
      const allEnemies = [scaledBoss, ...minions];
      
      rooms[y][x].type = 'boss';
      rooms[y][x].content = scaledBoss;
      
      const levelText = state.dungeonLevel > 1 ? ` [Niveau ${state.dungeonLevel}]` : '';
      const scalingText = totalBossScaling > 0 ? ` (Renforcé +${Math.round(totalBossScaling * 100)}%)` : '';
      const minionText = minions.length > 0 ? ` et ${minions.length} serviteur(s)` : '';
      gameStore.addToHistory({
        turn: encounterCount,
        type: 'boss',
        title: `Boss${levelText} : ${scaledBoss.name}${scalingText}${minionText}`,
        description: `Vous affrontez le boss${minionText} !${scalingText}`,
        icon: scaledBoss.portrait,
        isPositive: false
      });
      
      gameStore.setState({
        rooms,
        currentRoom: { x, y },
        encounterCount,
        currentEnemies: allEnemies,
        currentEnemy: scaledBoss,
        phase: 'combat'
      });
      gameStore.initCombatMultiple(allEnemies);
    } else {
      // Rencontre aléatoire
      const roll = Math.random();
      
      if (roll < 0.5) {
        // Combat (50%)
        // Générer 1-3 monstres selon la progression
        const monsterCount = gameStore.getMonsterCount(encounterCount);
        const monsters: Monster[] = [];
        
        for (let i = 0; i < monsterCount; i++) {
          // Utiliser le niveau de donjon pour obtenir un monstre approprié
          const monster = getRandomMonster(state.dungeonLevel);
          // Appliquer le scaling aux PV et dégâts (système D&D simplifié)
          const scaledMonster: Monster = {
            ...monster,
            id: `${monster.id}_${i}_${Date.now()}`,
            hp: Math.floor(monster.hp * monsterMultiplier),
            maxHp: Math.floor(monster.maxHp * monsterMultiplier),
            armorClass: monster.armorClass || 10,
            skills: monster.skills?.map(s => ({
              ...s,
              damage: Math.floor(s.damage * monsterMultiplier)
            }))
          };
          monsters.push(scaledMonster);
        }
        
        rooms[y][x].type = 'combat';
        rooms[y][x].content = monsters[0];
        
        const levelText = state.dungeonLevel > 1 ? ` [Niv.${state.dungeonLevel}]` : '';
        const monsterNames = monsters.map(m => m.name).join(', ');
        gameStore.addToHistory({
          turn: encounterCount,
          type: 'combat',
          title: monsterCount > 1 ? `Combat${levelText} : ${monsterCount} ennemis` : `Combat${levelText} : ${monsters[0].name}`,
          description: `Vous affrontez ${monsterNames} !`,
          icon: monsters[0].portrait,
          isPositive: false
        });
        
        // Incrémenter le scaling du boss
        const newBossScaling = state.bossScaling + 5;
        const newCombatCount = state.combatCount + 1;
        
        gameStore.setState({
          rooms,
          currentRoom: { x, y },
          encounterCount,
          combatCount: newCombatCount,
          bossScaling: newBossScaling,
          currentEnemies: monsters,
          currentEnemy: monsters[0],
          phase: 'combat'
        });
        gameStore.initCombatMultiple(monsters);
      } else if (roll < 0.8) {
        // Événement (30%)
        const event = getRandomEvent();
        rooms[y][x].type = 'event';
        rooms[y][x].content = event;
        
        gameStore.addToHistory({
          turn: encounterCount,
          type: 'event',
          title: event.name,
          description: event.description,
          icon: event.type === 'positive' ? '✨' : '⚠️',
          isPositive: event.type === 'positive'
        });
        
        gameStore.setState({
          rooms,
          currentRoom: { x, y },
          encounterCount,
          currentEvent: event,
          phase: 'event'
        });
      } else {
        // Trésor (20%)
        gameStore.generateTreasure(x, y, rooms, encounterCount);
      }
    }
  },
  
  // Déterminer le nombre de monstres selon la progression
  getMonsterCount: (encounterCount: number): number => {
    // Plus on avance, plus il y a de chances d'avoir plusieurs monstres
    const roll = Math.random();
    if (encounterCount <= 3) {
      // Début : 90% 1 monstre, 10% 2 monstres
      return roll < 0.9 ? 1 : 2;
    } else if (encounterCount <= 6) {
      // Milieu : 60% 1 monstre, 30% 2 monstres, 10% 3 monstres
      if (roll < 0.6) return 1;
      if (roll < 0.9) return 2;
      return 3;
    } else {
      // Fin : 40% 1 monstre, 40% 2 monstres, 20% 3 monstres
      if (roll < 0.4) return 1;
      if (roll < 0.8) return 2;
      return 3;
    }
  },
  
  generateTreasure: (x: number, y: number, rooms: Room[][], encounterCount: number) => {
    const treasure = getRandomTreasure();
    
    // Créer les données du trésor en attente (sans attribution)
    const pendingTreasure: PendingTreasureData = {
      treasureId: treasure.id,
      treasureName: treasure.name,
      treasureIcon: treasure.icon,
      treasureRarity: treasure.rarity,
      treasureDescription: treasure.description,
      assignedToId: '', // Sera choisi par le joueur
      assignedToName: '',
      effects: []
    };
    
    // Ajouter à l'historique (assignedTo sera mis à jour plus tard)
    gameStore.addToHistory({
      turn: encounterCount,
      type: 'treasure',
      title: `${treasure.icon} ${treasure.name}`,
      description: treasure.description,
      icon: treasure.icon,
      isPositive: true,
      treasureId: treasure.id,
      treasureRarity: treasure.rarity,
      assignedTo: ''
    });
    
    // Conversion vers l'ancien format pour compatibilité
    const legacyTreasure: TreasureLegacy = {
      id: treasure.id,
      name: treasure.name,
      description: treasure.description,
      effect: {
        type: 'heal_all',
        value: 0
      }
    };
    
    rooms[y][x].type = 'treasure';
    rooms[y][x].content = legacyTreasure;
    
    gameStore.setState({
      rooms,
      currentRoom: { x, y },
      encounterCount,
      pendingTreasures: [pendingTreasure],
      phase: 'treasure'
    });
  },
  
  // Finaliser l'attribution du trésor après le choix du joueur
  finalizeTreasure: (selectedCharacter: Character, effects: string[]) => {
    const team = [...state.team];
    const pendingTreasure = state.pendingTreasures?.[0];
    
    if (pendingTreasure) {
      // Ajouter l'objet à l'inventaire du personnage ET copier toutes les modifications de stats
      const charIndex = team.findIndex(c => c.id === selectedCharacter.id);
      if (charIndex !== -1) {
        // Copier TOUTES les modifications de selectedCharacter (stats, passiveEffects, skills, etc.)
        team[charIndex] = {
          ...team[charIndex],
          ...selectedCharacter,
          // S'assurer que l'inventaire est correctement mis à jour
          inventory: [...(selectedCharacter.inventory || []), {
            id: pendingTreasure.treasureId,
            name: pendingTreasure.treasureName,
            icon: pendingTreasure.treasureIcon,
            rarity: pendingTreasure.treasureRarity,
            description: pendingTreasure.treasureDescription,
            obtainedAt: state.encounterCount
          }]
        };
      }
      
      // Mettre à jour l'historique avec le personnage choisi
      const history = [...state.history];
      const lastTreasureEntry = history.find(h => h.treasureId === pendingTreasure.treasureId);
      if (lastTreasureEntry) {
        lastTreasureEntry.assignedTo = selectedCharacter.name;
      }
      
      gameStore.setState({
        team,
        history,
        pendingTreasures: [],
        phase: 'dungeon'
      });
    } else {
      gameStore.setState({
        pendingTreasures: [],
        phase: 'dungeon'
      });
    }
  },
  
  closeTreasureModal: () => {
    gameStore.setState({
      pendingTreasures: [],
      phase: 'dungeon'
    });
  },
  
  initCombat: (enemy: Monster) => {
    // Rétro-compatibilité: utiliser initCombatMultiple
    gameStore.initCombatMultiple([enemy]);
  },
  
  initCombatMultiple: (enemies: Monster[]) => {
    // Préparer les personnages pour le combat (réinitialiser cooldowns, buffs)
    const teamReady = state.team.map(c => ({
      ...c,
      buffs: c.buffs || [],
      // Réinitialiser les cooldowns au début du combat
      skills: c.skills.map(skill => ({ ...skill, currentCooldown: 0 }))
    }));
    
    // Mettre à jour l'équipe
    gameStore.setState({ team: teamReady });
    
    const aliveTeam = teamReady.filter(c => c.hp > 0);
    
    // Préparer les monstres pour le combat
    const monstersReady = enemies.map(e => {
      // Réinitialiser les actions légendaires pour les créatures légendaires
      if (e.legendaryActionsPerTurn) {
        resetLegendaryActions(e);
      }
      
      return {
        ...e,
        buffs: e.buffs || [],
        ultimateUsed: e.ultimateUsed ?? false,
        legendaryActionsRemaining: e.legendaryActionsPerTurn || 0
      };
    });
    
    // Trier par initiative (DEX modifier)
    const allCombatants = [...aliveTeam, ...monstersReady];
    const turnOrder = allCombatants.sort((a, b) => {
      const aInit = getModifier(a.abilities?.dexterity || 10);
      const bInit = getModifier(b.abilities?.dexterity || 10);
      return bInit - aInit;
    });
    
    const enemyNames = monstersReady.map(e => e.name).join(', ');
    const combatTitle = monstersReady.length > 1 
      ? `Combat contre ${monstersReady.length} ennemis : ${enemyNames} !`
      : `Combat contre ${monstersReady[0].name} !`;
    
    gameStore.setState({
      turnOrder,
      currentTurnIndex: 0,
      combatLog: [combatTitle],
      combatHistory: [],
      combatTurn: 1,
      currentEnemies: monstersReady,
      currentEnemy: monstersReady[0],
      selectedEnemyIndex: 0
    });
  },
  
  // Recalculer les stats d'un personnage en utilisant le système D&D
  recalculateStats: (character: Character): Character => {
    const abilities = character.abilities;
    if (!abilities) return character;
    
    // Bonus de maîtrise basé sur le niveau
    const proficiencyBonus = getProficiencyBonus(character.level || 1);
    
    // Calcul de la CA (10 + DEX + armure)
    let baseAC = 10;
    let acBonus = 0;
    
    // Appliquer les buffs à la CA
    if (character.buffs) {
      character.buffs.forEach(buff => {
        if (buff.type === 'ac') acBonus += buff.value;
      });
    }
    
    const armorClass = baseAC + getAbilityModifier(abilities.dexterity) + acBonus;
    
    // Calcul de la vitesse
    let speedBonus = 0;
    if (character.buffs) {
      character.buffs.forEach(buff => {
        if (buff.type === 'speed') speedBonus += buff.value;
      });
    }
    const speed = Math.max(1, (character.speed || 30) + speedBonus);
    
    // Appliquer les buffs aux caractéristiques
    let updatedAbilities = { ...abilities };
    if (character.buffs) {
      character.buffs.forEach(buff => {
        if (buff.type === 'ability' && buff.abilityAffected) {
          updatedAbilities[buff.abilityAffected] = (updatedAbilities[buff.abilityAffected] || 10) + buff.value;
        }
      });
    }
    
    return {
      ...character,
      abilities: updatedAbilities,
      armorClass,
      speed,
      proficiencyBonus,
      initiative: getAbilityModifier(updatedAbilities.dexterity)
    };
  },
  
  // Décrémenter la durée des buffs et les supprimer si expirés
  decrementBuffs: () => {
    const team = state.team.map(character => {
      if (!character.buffs || character.buffs.length === 0) return character;
      
      // Décrémenter la durée et filtrer les buffs expirés
      const updatedBuffs = character.buffs
        .map(buff => ({
          ...buff,
          turnsRemaining: buff.turnsRemaining - 1
        }))
        .filter(buff => buff.turnsRemaining > 0);
      
      // Mettre à jour le personnage avec les buffs restants
      const charWithUpdatedBuffs = { ...character, buffs: updatedBuffs };
      
      // Recalculer les stats à partir des valeurs de base + buffs restants
      return gameStore.recalculateStats(charWithUpdatedBuffs);
    });
    
    gameStore.setState({ team });
  },
  
  // Réinitialiser les actions légendaires des monstres à chaque nouveau tour (round complet)
  resetLegendaryActionsForAll: () => {
    const currentEnemies = state.currentEnemies.map(enemy => {
      if (enemy.legendaryActionsPerTurn) {
        return {
          ...enemy,
          legendaryActionsRemaining: enemy.legendaryActionsPerTurn
        };
      }
      return enemy;
    });
    
    gameStore.setState({ currentEnemies, currentEnemy: currentEnemies[0] });
  },
  
  // Utiliser une action légendaire
  useLegendaryAction: (enemyId: string, actionId: string) => {
    const currentEnemies = state.currentEnemies.map(enemy => {
      if (enemy.id === enemyId && enemy.legendaryActions) {
        const action = enemy.legendaryActions.find(a => a.id === actionId);
        if (action && enemy.legendaryActionsRemaining && enemy.legendaryActionsRemaining >= action.cost) {
          return {
            ...enemy,
            legendaryActionsRemaining: enemy.legendaryActionsRemaining - action.cost
          };
        }
      }
      return enemy;
    });
    
    gameStore.setState({ currentEnemies, currentEnemy: currentEnemies[0] });
    return currentEnemies.find(e => e.id === enemyId);
  },
  
  // Supprimer tous les buffs à la fin du combat
  clearAllBuffs: () => {
    const team = state.team.map(character => {
      // Supprimer tous les buffs et recalculer les stats
      const charWithNoBuffs = { ...character, buffs: [] };
      return gameStore.recalculateStats(charWithNoBuffs);
    });
    
    gameStore.setState({ team });
  },
  
  // Fin du combat - nettoyer les buffs et distribuer l'XP
  endCombat: (victory: boolean) => {
    gameStore.clearAllBuffs();
    
    if (victory) {
      // Calculer l'XP gagné
      const totalXP = state.currentEnemies.reduce((sum, enemy) => sum + (enemy.xpReward || 0), 0);
      const xpPerCharacter = Math.floor(totalXP / state.team.length);
      
      // Distribuer l'XP à chaque personnage vivant
      const updatedTeam = state.team.map(character => {
        if (character.hp <= 0) return character;
        
        const newXP = (character.xp || 0) + xpPerCharacter;
        const newTotalXP = (character.totalXP || 0) + xpPerCharacter;
        
        // Vérifier le level up
        const xpNeeded = gameStore.getXPForNextLevel(character.level);
        if (newXP >= xpNeeded && character.level < 100) {
          // Level up !
          const newLevel = character.level + 1;
          const newMaxHP = gameStore.calculateMaxHP(character.class, newLevel, character.abilities.constitution);
          const hpGain = newMaxHP - character.maxHp;
          
          return {
            ...character,
            level: newLevel,
            xp: newXP - xpNeeded,
            totalXP: newTotalXP,
            maxHp: newMaxHP,
            hp: Math.min(character.hp + hpGain, newMaxHP),
            proficiencyBonus: gameStore.getProficiencyBonus(newLevel),
            pendingTalentChoice: [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100].includes(newLevel)
          };
        }
        
        return {
          ...character,
          xp: newXP,
          totalXP: newTotalXP
        };
      });
      
      // Vérifier si des personnages ont level up avec choix de talent
      const leveledUp = updatedTeam.some(c => c.pendingTalentChoice);
      
      const isBossFight = state.currentEnemies.some(e => e.isBoss);
      
      // Log XP gagné
      console.log(`[Combat] Victoire! XP gagné: ${totalXP} (${xpPerCharacter}/personnage)`);
      if (leveledUp) {
        console.log('[Combat] Des personnages ont gagné un niveau et doivent choisir un talent !');
      }
      
      // Si des personnages doivent choisir un talent, passer à la phase level_up
      if (leveledUp) {
        gameStore.setState({ 
          phase: 'level_up',
          team: updatedTeam,
          currentEnemies: [],
          currentEnemy: undefined,
        });
      } else if (isBossFight) {
        // Après un boss, passer au niveau de donjon suivant
        const newDungeonLevel = Math.min(50, state.dungeonLevel + 1);
        gameStore.setState({ 
          phase: 'victory',
          team: updatedTeam,
          currentEnemies: [],
          currentEnemy: undefined,
          dungeonLevel: newDungeonLevel,
          roomsExploredThisLevel: 0
        });
      } else {
        gameStore.setState({ 
          phase: 'dungeon',
          team: updatedTeam, 
          currentEnemies: [],
          currentEnemy: undefined,
          roomsExploredThisLevel: (state.roomsExploredThisLevel || 0) + 1
        });
      }
    } else {
      gameStore.setState({ 
        phase: 'defeat', 
        currentEnemies: [],
        currentEnemy: undefined 
      });
    }
  },
  
  // Fonctions utilitaires D&D
  getXPForNextLevel: (level: number): number => {
    const thresholds: Record<number, number> = {
      1: 300, 2: 600, 3: 1800, 4: 3800, 5: 7500, 6: 9000, 7: 11000, 8: 14000, 9: 16000, 10: 21000,
      11: 15000, 12: 20000, 13: 20000, 14: 25000, 15: 30000, 16: 30000, 17: 40000, 18: 40000, 19: 50000, 20: 50000
    };
    if (level <= 20 && thresholds[level]) return thresholds[level];
    return Math.floor(50000 * (1 + (level - 20) * 0.1));
  },
  
  getProficiencyBonus: (level: number): number => Math.floor((level - 1) / 4) + 2,
  
  calculateMaxHP: (className: string, level: number, conScore: number): number => {
    const HIT_DICE: Record<string, number> = {
      'Mage': 6, 'Nécromancien': 6, 'Élémentaliste': 6, 'Ensorceleur': 6,
      'Occultiste': 8, 'Prêtresse': 8, 'Druide': 8, 'Oracle': 8, 'Clerc de Vie': 8,
      'Barde': 8, 'Scalde': 8, 'Roublard': 8, 'Ninja': 8, 'Voleur': 8, 'Assassin': 8,
      'Moine': 8, 'Pugiliste': 8, 'Guerrier': 10, 'Chevalier': 10, 'Paladin': 10,
      'Archère': 10, 'Rôdeur': 10, 'Arbalétrier': 10, 'Seigneur de guerre': 10,
      'Berserker': 12, 'Gardien': 12,
    };
    const hitDie = HIT_DICE[className] || 8;
    const conMod = Math.floor((conScore - 10) / 2);
    const level1HP = hitDie + conMod;
    const averageHitDie = Math.ceil(hitDie / 2) + 1;
    const additionalHP = (level - 1) * (averageHitDie + conMod);
    return Math.max(1, level1HP + additionalHP);
  },
  
  performAttack: (attacker: Character | Monster, target: Character | Monster, damage: number) => {
    const actualDamage = Math.max(1, damage - target.defense);
    target.hp = Math.max(0, target.hp - actualDamage);
    
    const log = [...state.combatLog, `${attacker.name} inflige ${actualDamage} dégâts à ${target.name} !`];
    
    // Vérifier si le combat est terminé
    if ('isBoss' in target && target.hp <= 0) {
      // Ennemi vaincu - nettoyer les buffs
      gameStore.clearAllBuffs();
      
      if (target.isBoss) {
        gameStore.setState({ phase: 'victory', combatLog: [...log, 'VICTOIRE ! Le boss est vaincu !'] });
      } else {
        gameStore.setState({ 
          phase: 'dungeon', 
          combatLog: [...log, `${target.name} est vaincu !`],
          currentEnemy: undefined 
        });
      }
    } else {
      // Vérifier si l'équipe est vaincue
      const teamAlive = state.team.some(c => c.hp > 0);
      if (!teamAlive) {
        gameStore.clearAllBuffs();
        gameStore.setState({ phase: 'defeat', combatLog: [...log, 'DÉFAITE...'] });
      } else {
        // Passer au tour suivant (en sautant les morts)
        let nextIndex = (state.currentTurnIndex + 1) % state.turnOrder.length;
        let attempts = 0;
        while (state.turnOrder[nextIndex].hp <= 0 && attempts < state.turnOrder.length) {
          nextIndex = (nextIndex + 1) % state.turnOrder.length;
          attempts++;
        }
        
        // Décrémenter les buffs quand on revient au premier personnage
        if (nextIndex === 0) {
          gameStore.decrementBuffs();
        }
        
        gameStore.setState({ currentTurnIndex: nextIndex, combatLog: log });
      }
    }
  },
  
  applyEvent: (event: GameEvent) => {
    const team = [...state.team];
    const { effect } = event;
    
    let targets: Character[] = [];
    const aliveTeam = team.filter(c => c.hp > 0);
    
    switch (effect.target) {
      case 'all':
        targets = aliveTeam;
        break;
      case 'random':
        if (aliveTeam.length > 0) {
          targets = [aliveTeam[Math.floor(Math.random() * aliveTeam.length)]];
        }
        break;
      case 'weakest':
        if (aliveTeam.length > 0) {
          targets = [aliveTeam.reduce((min, c) => c.hp < min.hp ? c : min, aliveTeam[0])];
        }
        break;
      case 'strongest':
        if (aliveTeam.length > 0) {
          targets = [aliveTeam.reduce((max, c) => c.hp > max.hp ? c : max, aliveTeam[0])];
        }
        break;
    }
    
    targets.forEach(t => {
      switch (effect.type) {
        case 'heal':
          t.hp = Math.min(t.maxHp, t.hp + effect.value);
          break;
        case 'damage':
          t.hp = Math.max(0, t.hp - effect.value);
          break;
        case 'buff_attack':
          t.attack += effect.value;
          break;
        case 'buff_magic_attack':
          t.magicAttack = (t.magicAttack || 0) + effect.value;
          break;
        case 'buff_defense':
          t.defense += effect.value;
          break;
        case 'debuff_attack':
          t.attack = Math.max(1, t.attack - effect.value);
          break;
        case 'debuff_magic_attack':
          t.magicAttack = Math.max(1, (t.magicAttack || 0) - effect.value);
          break;
        case 'debuff_defense':
          t.defense = Math.max(0, t.defense - effect.value);
          break;
      }
    });
    
    gameStore.setState({ team, phase: 'dungeon', currentEvent: undefined });
  },
  
  applyTreasure: (treasure: TreasureLegacy) => {
    const team = [...state.team];
    
    switch (treasure.effect.type) {
      case 'heal_all':
        team.forEach(c => {
          if (c.hp > 0) {
            c.hp = Math.min(c.maxHp, c.hp + treasure.effect.value);
          }
        });
        break;
      case 'buff_permanent':
        team.forEach(c => {
          c.attack += treasure.effect.value;
        });
        break;
      case 'revive':
        const dead = team.find(c => c.hp <= 0);
        if (dead) {
          dead.hp = treasure.effect.value;
        }
        break;
    }
    
    gameStore.setState({ team });
  },
  
  getAdjacentRooms: (): { x: number; y: number }[] => {
    const { x, y } = state.currentRoom;
    const adjacent: { x: number; y: number }[] = [];
    
    const directions = [
      { dx: 0, dy: -1 }, // Haut
      { dx: 0, dy: 1 },  // Bas
      { dx: -1, dy: 0 }, // Gauche
      { dx: 1, dy: 0 }   // Droite
    ];
    
    directions.forEach(({ dx, dy }) => {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < 20 && ny >= 0 && ny < 20 && !state.rooms[ny][nx].visited) {
        adjacent.push({ x: nx, y: ny });
      }
    });
    
    return adjacent;
  },
  
  // Récupérer les infos d'un trésor par son ID
  getTreasureInfo: (treasureId: string): Treasure | null => {
    return allTreasures.find((t: Treasure) => t.id === treasureId) || null;
  },
  
  // Passer au niveau suivant après avoir vaincu le boss
  advanceToNextLevel: () => {
    const currentLevel = state.dungeonLevel;
    const newLevel = currentLevel + 1;
    
    // Calculer le scaling pour le nouveau niveau (équilibré)
    // Niveau 2: monstres +25%, boss +35%
    // Niveau 3: monstres +50%, boss +70%
    // Niveau 4+: monstres +75%, boss +100%
    let newMonsterScaling: number;
    let newBossScaling: number;
    
    if (newLevel <= 2) {
      newMonsterScaling = (newLevel - 1) * 25; // +25% par niveau
      newBossScaling = (newLevel - 1) * 35; // +35% par niveau
    } else if (newLevel === 3) {
      newMonsterScaling = 50; // +50%
      newBossScaling = 70; // +70%
    } else {
      // Niveau 4+ : scaling plus progressif
      newMonsterScaling = 50 + (newLevel - 3) * 25; // +50% + 25% par niveau après 3
      newBossScaling = 70 + (newLevel - 3) * 30; // +70% + 30% par niveau après 3
    }
    
    // Nombre de salles : niveau 1 = 10, niveau 2 = 12, niveau 3 = 14, niveau 4+ = 16
    const newRoomsPerLevel = newLevel === 1 ? 10 : (newLevel === 2 ? 12 : (newLevel === 3 ? 14 : 16));
    
    // Récupérer l'ID du boss actuel pour éviter de le régénérer
    const currentBossId = state.currentEnemies.find(e => e.isBoss)?.id.split('_')[0];
    
    // Ressusciter tous les personnages vaincus et les soigner complètement
    // Ils gardent leurs objets !
    const revivedTeam = state.team.map(char => ({
      ...char,
      hp: char.maxHp, // Restaurer tous les PV
      buffs: [] // Nettoyer les buffs
    }));
    
    gameStore.setState({
      team: revivedTeam,
      dungeonLevel: newLevel,
      roomsPerLevel: newRoomsPerLevel,
      previousBossId: currentBossId,
      monsterScaling: newMonsterScaling,
      bossScalingMultiplier: newBossScaling,
      encounterCount: 0,
      combatCount: 0,
      bossScaling: 0, // Reset le scaling de combat pour ce niveau
      rooms: createInitialRooms(),
      currentRoom: { x: 10, y: 10 },
      currentEnemies: [],
      currentEnemy: undefined,
      combatLog: [
        `🎉 Bienvenue au Niveau ${newLevel} !`, 
        `✨ Toute l'équipe a été ressuscitée et soignée !`,
        `Monstres +${newMonsterScaling}% | Boss +${newBossScaling}%`, 
        `${newRoomsPerLevel} salles avant le boss`
      ],
      phase: 'dungeon'
    });
    
    gameStore.addToHistory({
      turn: 0,
      type: 'event',
      title: `Niveau ${newLevel} débloqué !`,
      description: `Les monstres sont renforcés de ${newMonsterScaling}% et le boss de ${newBossScaling}%`,
      icon: '🏰',
      isPositive: true
    });
  },
  
  resetGame: () => {
    // Effacer la sauvegarde locale
    clearLocalStorage();
    
    state = { 
      ...initialState, 
      rooms: createInitialRooms(), 
      history: [], 
      pendingTreasures: [], 
      combatHistory: [],
      dungeonLevel: 1,
      roomsPerLevel: 10,
      previousBossId: undefined,
      monsterScaling: 0,
      bossScalingMultiplier: 0
    };
    listeners.forEach(l => l());
  }
};
