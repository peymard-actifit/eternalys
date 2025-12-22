import { useEffect, useState, useCallback } from 'react';
import { gameStore } from './store/gameStore';
import { authStore } from './store/authStore';
import { GameState, Character, CharacterTalent } from './types/game.types';
import { WelcomePage } from './components/WelcomePage';
import { MenuPage } from './components/MenuPage';
import { CharacterSelectPage } from './components/CharacterSelectPage';
import { DungeonPage } from './components/DungeonPage';
import { CombatPage } from './components/CombatPage';
import { EventModal } from './components/EventModal';
import { GameOverScreen } from './components/GameOverScreen';
import { InventoryModal } from './components/InventoryModal';
import { SummaryScreen } from './components/SummaryScreen';
import { PauseMenu } from './components/PauseMenu';
import { Bestiary } from './components/Bestiary';
import { LevelUpModal } from './components/LevelUpModal';
import { TestChecklist } from './components/TestChecklist';
import { useDeviceClass } from './hooks/useDeviceDetection';

// Liste des emails autorisés pour les tests (admin/testeur)
const TESTER_EMAILS = [
  'antoine@eternalys.com',
  'admin@eternalys.com',
  'testeur@eternalys.com',
  'pey@eternalys.com',
  // Ajouter d'autres emails ici
];
import './App.css';
import './styles/responsive.css';
import './styles/animations-toggle.css';
import './styles/device-specific.css';
import './styles/z-index.css';

function App() {
  const [state, setState] = useState<GameState>(gameStore.getState());
  const [showBestiary, setShowBestiary] = useState(false);
  const [hasEnteredGame, setHasEnteredGame] = useState(false);
  const [authState, setAuthState] = useState(authStore.getState());
  const [isRestoring, setIsRestoring] = useState(true);
  const [levelUpCharacterIndex, setLevelUpCharacterIndex] = useState(0);
  
  // Restaurer l'état du jeu au chargement
  useEffect(() => {
    // Tenter de restaurer une partie en cours
    const wasRestored = gameStore.restoreSavedState();
    if (wasRestored) {
      // Une partie était en cours, entrer directement dans le jeu
      if (import.meta.env.DEV) console.log('[App] Partie restaurée, entrée directe dans le jeu');
      setHasEnteredGame(true);
      // Mettre à jour l'état local avec l'état restauré
      setState(gameStore.getState());
    }
    setIsRestoring(false);
  }, []);
  
  // Écouter les changements d'authentification
  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const currentAuthState = authStore.getState();
    if (currentAuthState.isAuthenticated && currentAuthState.currentUser) {
      setHasEnteredGame(true);
    }
    
    // S'abonner aux changements d'auth pour détecter la déconnexion
    const unsubscribe = authStore.subscribe(() => {
      const newAuthState = authStore.getState();
      setAuthState(newAuthState);
      
      // Si l'utilisateur s'est déconnecté, revenir à la page de bienvenue
      if (!newAuthState.isAuthenticated && !newAuthState.currentUser) {
        setHasEnteredGame(false);
        // Réinitialiser le jeu au menu et effacer la sauvegarde locale
        gameStore.clearSavedState();
        gameStore.setState({ phase: 'menu' });
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  // Détection automatique du type d'appareil et ajout des classes CSS
  useDeviceClass();
  
  useEffect(() => {
    return gameStore.subscribe(() => setState(gameStore.getState()));
  }, []);

  // Gestion des raccourcis clavier
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const currentState = gameStore.getState();
    const { phase, showInventory, showPauseMenu } = currentState;
    
    // B - Bestiaire (disponible partout sauf menu principal)
    if ((e.key === 'b' || e.key === 'B') && !showInventory && !showPauseMenu) {
      if (phase !== 'menu') {
        e.preventDefault();
        setShowBestiary(prev => !prev);
        return;
      }
    }
    
    // Échap - Menu pause (sauf sur le menu principal et les écrans de fin)
    if (e.key === 'Escape') {
      // Si le bestiaire est ouvert, le fermer d'abord
      if (showBestiary) {
        e.preventDefault();
        setShowBestiary(false);
        return;
      }
      
      // Si l'inventaire est ouvert, le fermer d'abord
      if (showInventory) {
        e.preventDefault();
        gameStore.setState({ showInventory: false });
        return;
      }
      
      // Phases où le menu pause est disponible
      const pauseAvailablePhases = ['character_select', 'dungeon', 'combat', 'event', 'treasure'];
      if (pauseAvailablePhases.includes(phase)) {
        e.preventDefault();
        gameStore.setState({ showPauseMenu: !showPauseMenu });
      }
    }
    
    // I - Inventaire (seulement pendant l'exploration et le combat)
    if ((e.key === 'i' || e.key === 'I') && !showPauseMenu && !showBestiary) {
      if (phase === 'dungeon' || phase === 'combat') {
        e.preventDefault();
        gameStore.setState({ showInventory: !showInventory });
      }
    }
  }, [showBestiary]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const { phase, showInventory, showPauseMenu } = state;

  // Callback pour entrer dans le jeu
  const handleEnterGame = useCallback(() => {
    setHasEnteredGame(true);
  }, []);

  // Gestion du level up
  const handleTalentSelect = useCallback((updatedCharacter: Character, _talent: CharacterTalent) => {
    // Mettre à jour le personnage dans l'équipe
    const updatedTeam = state.team.map(char => 
      char.id === updatedCharacter.id ? updatedCharacter : char
    );
    
    // Trouver le prochain personnage qui doit level up
    const nextLevelUpIndex = updatedTeam.findIndex((char, idx) => 
      idx > levelUpCharacterIndex && char.pendingTalentChoice
    );
    
    if (nextLevelUpIndex >= 0) {
      // Passer au prochain personnage
      setLevelUpCharacterIndex(nextLevelUpIndex);
      gameStore.setState({ team: updatedTeam });
    } else {
      // Tous les level ups sont terminés, retourner au donjon
      setLevelUpCharacterIndex(0);
      gameStore.setState({ 
        team: updatedTeam, 
        phase: 'dungeon' 
      });
    }
  }, [state.team, levelUpCharacterIndex]);

  const handleSkipLevelUp = useCallback(() => {
    // Marquer le personnage comme ayant fait son choix (même s'il n'a pas choisi de talent)
    const currentChar = state.team[levelUpCharacterIndex];
    if (!currentChar) return;
    
    const updatedTeam = state.team.map(char => 
      char.id === currentChar.id ? { ...char, pendingTalentChoice: false } : char
    );
    
    // Trouver le prochain personnage qui doit level up
    const nextLevelUpIndex = updatedTeam.findIndex((char, idx) => 
      idx > levelUpCharacterIndex && char.pendingTalentChoice
    );
    
    if (nextLevelUpIndex >= 0) {
      setLevelUpCharacterIndex(nextLevelUpIndex);
      gameStore.setState({ team: updatedTeam });
    } else {
      setLevelUpCharacterIndex(0);
      gameStore.setState({ 
        team: updatedTeam, 
        phase: 'dungeon' 
      });
    }
  }, [state.team, levelUpCharacterIndex]);

  const renderLevelUp = () => {
    // Trouver le premier personnage avec un level up en attente
    const charIndex = state.team.findIndex((char, idx) => 
      idx >= levelUpCharacterIndex && char.pendingTalentChoice
    );
    
    if (charIndex < 0) {
      // Pas de level up en attente, retourner au donjon
      gameStore.setState({ phase: 'dungeon' });
      return <DungeonPage />;
    }
    
    const character = state.team[charIndex];
    
    return (
      <>
        <DungeonPage />
        <LevelUpModal 
          character={character}
          onSelectTalent={handleTalentSelect}
          onSkip={handleSkipLevelUp}
        />
      </>
    );
  };

  // Afficher un écran de chargement pendant la restauration
  if (isRestoring) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <span className="loading-icon">🏰</span>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'a pas encore passé l'écran de bienvenue
  if (!hasEnteredGame) {
    return <WelcomePage onEnterGame={handleEnterGame} />;
  }

  const renderPage = () => {
    switch (phase) {
      case 'menu':
        return <MenuPage />;
      case 'character_select':
        return <CharacterSelectPage />;
      case 'dungeon':
        return <DungeonPage />;
      case 'combat':
        return <CombatPage />;
      case 'event':
        return (
          <>
            <DungeonPage />
            <EventModal />
          </>
        );
      case 'treasure':
        return <DungeonPage />;
      case 'summary':
        return <SummaryScreen />;
      case 'victory':
        return <GameOverScreen isVictory={true} />;
      case 'defeat':
        return <GameOverScreen isVictory={false} />;
      case 'level_up':
        return renderLevelUp();
      default:
        return <MenuPage />;
    }
  };

  // Déterminer si l'utilisateur peut accéder à la checklist de test
  const canAccessTestChecklist = (): 'admin' | 'testeur' | 'player' => {
    // En mode DEV, toujours autoriser
    if (import.meta.env.DEV) return 'admin';
    
    // Vérifier si l'utilisateur est dans la liste des testeurs
    const userEmail = authState.currentUser?.email?.toLowerCase();
    if (userEmail && TESTER_EMAILS.some(email => userEmail.includes(email.split('@')[0]))) {
      return 'testeur';
    }
    
    return 'player';
  };

  const userRole = canAccessTestChecklist();

  return (
    <div className="app">
      {renderPage()}
      {showInventory && <InventoryModal />}
      {showPauseMenu && <PauseMenu />}
      <Bestiary isOpen={showBestiary} onClose={() => setShowBestiary(false)} />
      {/* Checklist de test - accessible via Ctrl+Shift+T (admin/testeur uniquement) */}
      {(userRole === 'admin' || userRole === 'testeur') && (
        <TestChecklist userRole={userRole} />
      )}
    </div>
  );
}

export default App;
