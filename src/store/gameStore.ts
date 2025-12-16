import { Character, Monster, GameEvent, Room, GameState } from '../types/game.types';
import { getRandomMonster, getRandomBoss } from '../data/monsters';
import { getRandomEvent, getRandomTreasure } from '../data/events';

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
  combatLog: [],
  turnOrder: [],
  currentTurnIndex: 0
};

// Store simple avec listeners
type Listener = () => void;
let state: GameState = { ...initialState };
let listeners: Listener[] = [];

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
    listeners.forEach(l => l());
  },
  
  // Actions
  startGame: () => {
    gameStore.setState({ phase: 'character_select' });
  },
  
  selectTeam: (team: Character[]) => {
    gameStore.setState({
      team: team.map(c => ({ ...c })),
      phase: 'dungeon',
      rooms: createInitialRooms(),
      currentRoom: { x: 10, y: 10 },
      encounterCount: 0
    });
  },
  
  moveToRoom: (x: number, y: number) => {
    const rooms = [...state.rooms.map(row => [...row])];
    const encounterCount = state.encounterCount + 1;
    
    // Découvrir la salle
    rooms[y][x].discovered = true;
    rooms[y][x].visited = true;
    
    // Déterminer le type de rencontre
    if (encounterCount >= 10) {
      // Boss final
      roomType = 'boss';
      const boss = getRandomBoss();
      rooms[y][x].type = 'boss';
      rooms[y][x].content = boss;
      
      gameStore.setState({
        rooms,
        currentRoom: { x, y },
        encounterCount,
        currentEnemy: boss,
        phase: 'combat'
      });
      gameStore.initCombat(boss);
    } else {
      // Rencontre aléatoire
      const roll = Math.random();
      
      if (roll < 0.5) {
        // Combat (50%)
        const monster = getRandomMonster();
        rooms[y][x].type = 'combat';
        rooms[y][x].content = monster;
        
        gameStore.setState({
          rooms,
          currentRoom: { x, y },
          encounterCount,
          currentEnemy: monster,
          phase: 'combat'
        });
        gameStore.initCombat(monster);
      } else if (roll < 0.8) {
        // Événement (30%)
        const event = getRandomEvent();
        rooms[y][x].type = 'event';
        rooms[y][x].content = event;
        
        gameStore.setState({
          rooms,
          currentRoom: { x, y },
          encounterCount,
          currentEvent: event,
          phase: 'event'
        });
      } else {
        // Trésor (20%)
        const treasure = getRandomTreasure();
        rooms[y][x].type = 'treasure';
        rooms[y][x].content = treasure;
        
        // Appliquer le trésor
        gameStore.applyTreasure(treasure);
        
        gameStore.setState({
          rooms,
          currentRoom: { x, y },
          encounterCount,
          phase: 'dungeon'
        });
      }
    }
  },
  
  initCombat: (enemy: Monster) => {
    const allCombatants = [...state.team, enemy];
    const turnOrder = allCombatants.sort((a, b) => b.speed - a.speed);
    
    gameStore.setState({
      turnOrder,
      currentTurnIndex: 0,
      combatLog: [`Combat contre ${enemy.name} !`]
    });
  },
  
  performAttack: (attacker: Character | Monster, target: Character | Monster, damage: number) => {
    const actualDamage = Math.max(1, damage - target.defense);
    target.hp = Math.max(0, target.hp - actualDamage);
    
    const log = [...state.combatLog, `${attacker.name} inflige ${actualDamage} dégâts à ${target.name} !`];
    
    // Vérifier si le combat est terminé
    if ('isBoss' in target && target.hp <= 0) {
      // Ennemi vaincu
      if (target.isBoss) {
        gameStore.setState({ phase: 'victory', combatLog: [...log, 'VICTOIRE ! Le boss est vaincu !'] });
      } else {
        gameStore.setState({ phase: 'dungeon', combatLog: [...log, `${target.name} est vaincu !`] });
      }
    } else {
      // Vérifier si l'équipe est vaincue
      const teamAlive = state.team.some(c => c.hp > 0);
      if (!teamAlive) {
        gameStore.setState({ phase: 'defeat', combatLog: [...log, 'DÉFAITE...'] });
      } else {
        // Passer au tour suivant
        const nextIndex = (state.currentTurnIndex + 1) % state.turnOrder.length;
        gameStore.setState({ currentTurnIndex: nextIndex, combatLog: log });
      }
    }
  },
  
  applyEvent: (event: GameEvent) => {
    const team = [...state.team];
    const { effect } = event;
    
    let targets: Character[] = [];
    
    switch (effect.target) {
      case 'all':
        targets = team;
        break;
      case 'random':
        targets = [team[Math.floor(Math.random() * team.length)]];
        break;
      case 'weakest':
        targets = [team.reduce((min, c) => c.hp < min.hp ? c : min, team[0])];
        break;
      case 'strongest':
        targets = [team.reduce((max, c) => c.hp > max.hp ? c : max, team[0])];
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
        case 'buff_defense':
          t.defense += effect.value;
          break;
        case 'debuff_attack':
          t.attack = Math.max(1, t.attack - effect.value);
          break;
        case 'debuff_defense':
          t.defense = Math.max(0, t.defense - effect.value);
          break;
      }
    });
    
    gameStore.setState({ team, phase: 'dungeon' });
  },
  
  applyTreasure: (treasure: any) => {
    const team = [...state.team];
    
    switch (treasure.effect.type) {
      case 'heal_all':
        team.forEach(c => {
          c.hp = Math.min(c.maxHp, c.hp + treasure.effect.value);
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
  
  resetGame: () => {
    state = { ...initialState, rooms: createInitialRooms() };
    listeners.forEach(l => l());
  }
};

