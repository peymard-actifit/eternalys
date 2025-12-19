import { useEffect, useState, useCallback } from 'react';
import { gameStore } from './store/gameStore';
import { authStore } from './store/authStore';
import { GameState } from './types/game.types';
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
import { useDeviceClass } from './hooks/useDeviceDetection';
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
        // Réinitialiser le jeu au menu
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
      default:
        return <MenuPage />;
    }
  };

  return (
    <div className="app">
      {renderPage()}
      {showInventory && <InventoryModal />}
      {showPauseMenu && <PauseMenu />}
      <Bestiary isOpen={showBestiary} onClose={() => setShowBestiary(false)} />
    </div>
  );
}

export default App;
