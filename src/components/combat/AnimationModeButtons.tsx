import { AnimationMode } from '../../hooks/useAnimationPreferences';
import './AnimationModeButtons.css';

interface AnimationModeButtonsProps {
  animationMode: AnimationMode;
  onSetMode: (mode: AnimationMode) => void;
}

export function AnimationModeButtons({ animationMode, onSetMode }: AnimationModeButtonsProps) {
  return (
    <div className="animation-mode-buttons">
      <button 
        className={`mode-btn ${animationMode === 'off' ? 'active' : ''}`}
        onClick={() => onSetMode('off')}
        title="Mode Manuel - Cliquez pour valider chaque jet"
      >
        🔒
      </button>
      <button 
        className={`mode-btn ${animationMode === 'on' ? 'active' : ''}`}
        onClick={() => onSetMode('on')}
        title="Mode Auto - Validation automatique avec animations"
      >
        🔓
      </button>
      <button 
        className={`mode-btn ${animationMode === 'skip' ? 'active' : ''}`}
        onClick={() => onSetMode('skip')}
        title="Mode Skip - Pas d'animations, résultats directs"
      >
        ⏩
      </button>
    </div>
  );
}

