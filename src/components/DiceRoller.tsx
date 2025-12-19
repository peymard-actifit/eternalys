import { useState, useEffect, useCallback } from 'react';
import './DiceRoller.css';

// Types de dés D&D
export type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

export interface DiceRoll {
  dieType: DieType;
  count: number;
  modifier: number;
  damageType?: string;
  label?: string;
  preRolledValues?: number[]; // Valeurs pré-calculées (pour éviter de relancer)
}

export interface DiceResult {
  rolls: number[];
  total: number;
  modifier: number;
  isCritical?: boolean;
  isNatural1?: boolean;
  isNatural20?: boolean;
  dieType: DieType;
}

interface DiceRollerProps {
  roll: DiceRoll;
  onComplete: (result: DiceResult) => void;
  showAnimation?: boolean;
  damageType?: string;
  waitForClick?: boolean; // Si true, attend un clic pour fermer
}

// Maximum pour chaque type de dé
const DIE_MAX: Record<DieType, number> = {
  'd4': 4,
  'd6': 6,
  'd8': 8,
  'd10': 10,
  'd12': 12,
  'd20': 20,
  'd100': 100
};

// Fonction utilitaire pour lancer un dé
export function rollDie(dieType: DieType): number {
  return Math.floor(Math.random() * DIE_MAX[dieType]) + 1;
}

// Fonction pour lancer plusieurs dés avec support avantage/désavantage
export function rollDice(
  dieType: DieType, 
  count: number, 
  modifier: number = 0,
  hasAdvantage: boolean = false,
  hasDisadvantage: boolean = false
): DiceResult {
  const rolls: number[] = [];
  
  // Pour le d20 avec avantage/désavantage, lancer 2 dés
  if (dieType === 'd20' && count === 1 && (hasAdvantage || hasDisadvantage)) {
    const roll1 = rollDie(dieType);
    const roll2 = rollDie(dieType);
    const chosenRoll = hasAdvantage 
      ? Math.max(roll1, roll2) 
      : Math.min(roll1, roll2);
    rolls.push(chosenRoll);
    // On pourrait stocker les deux pour affichage mais on garde le choisi
  } else {
    for (let i = 0; i < count; i++) {
      rolls.push(rollDie(dieType));
    }
  }
  
  const total = rolls.reduce((sum, r) => sum + r, 0) + modifier;
  const isNatural20 = dieType === 'd20' && rolls.some(r => r === 20);
  const isNatural1 = dieType === 'd20' && rolls.some(r => r === 1);
  const isCritical = isNatural20;
  
  return { 
    rolls, 
    total, 
    modifier, 
    isCritical, 
    isNatural1,
    isNatural20,
    dieType 
  };
}

// Parser une chaîne de dés D&D (ex: "2d6+3", "1d20", "3d8-2")
export function parseDiceString(diceString: string): DiceRoll | null {
  const match = diceString.match(/^(\d+)d(\d+)([+-]\d+)?$/i);
  if (!match) return null;
  
  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const modifier = match[3] ? parseInt(match[3]) : 0;
  
  // Trouver le type de dé correspondant
  let dieType: DieType = 'd6';
  if (sides === 4) dieType = 'd4';
  else if (sides === 6) dieType = 'd6';
  else if (sides === 8) dieType = 'd8';
  else if (sides === 10) dieType = 'd10';
  else if (sides === 12) dieType = 'd12';
  else if (sides === 20) dieType = 'd20';
  else if (sides === 100) dieType = 'd100';
  
  return { dieType, count, modifier };
}

// ============================================
// COMPOSANT DÉ 3D ANIMÉ STYLE BALDUR'S GATE 3
// ============================================
function Animated3DDie({ 
  dieType, 
  finalValue, 
  delay, 
  damageType 
}: { 
  dieType: DieType; 
  finalValue: number; 
  delay: number;
  damageType?: string;
}) {
  const [phase, setPhase] = useState<'rolling' | 'result'>('rolling');
  const [displayValue, setDisplayValue] = useState(1);
  
  const max = DIE_MAX[dieType];
  const isCrit = dieType === 'd20' && finalValue === 20;
  const isFail = dieType === 'd20' && finalValue === 1;
  
  useEffect(() => {
    // Animation de roulement aléatoire
    const rollInterval = setInterval(() => {
      setDisplayValue(Math.floor(Math.random() * max) + 1);
    }, 60);
    
    // Arrêter après un délai
    const stopTimeout = setTimeout(() => {
      clearInterval(rollInterval);
      setDisplayValue(finalValue);
      setPhase('result');
    }, 800 + delay);
    
    return () => {
      clearInterval(rollInterval);
      clearTimeout(stopTimeout);
    };
  }, [finalValue, max, delay]);
  
  // Classes CSS dynamiques
  const dieClasses = [
    'animated-die-3d',
    dieType,
    phase,
    damageType || '',
    isCrit ? 'critical' : '',
    isFail ? 'fail' : ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className={dieClasses}>
      <div className="die-cube">
        {/* Face principale visible */}
        <div className="die-face-3d front">
          {displayValue}
        </div>
        {/* Faces secondaires pour l'effet 3D */}
        <div className="die-face-3d back">{Math.ceil(max / 2)}</div>
        <div className="die-face-3d right">{Math.ceil(max / 3)}</div>
        <div className="die-face-3d left">{Math.ceil(max / 4)}</div>
        <div className="die-face-3d top">{Math.ceil(max / 5) || 1}</div>
        <div className="die-face-3d bottom">{max}</div>
      </div>
      <div className="die-type-indicator">{dieType}</div>
    </div>
  );
}

// ============================================
// COMPOSANT PRINCIPAL DE LANCER DE DÉS
// ============================================
export function DiceRoller({ roll, onComplete, showAnimation = true, damageType, waitForClick = false }: DiceRollerProps) {
  const [result, setResult] = useState<DiceResult | null>(null);
  const [phase, setPhase] = useState<'rolling' | 'result'>('rolling');
  const [canClose, setCanClose] = useState(false);
  
  const handleComplete = useCallback((diceResult: DiceResult) => {
    onComplete(diceResult);
  }, [onComplete]);
  
  const handleClick = useCallback(() => {
    if (canClose && result) {
      handleComplete(result);
    }
  }, [canClose, result, handleComplete]);
  
  useEffect(() => {
    // Utiliser les valeurs pré-calculées si disponibles, sinon lancer
    let diceResult: DiceResult;
    if (roll.preRolledValues && roll.preRolledValues.length > 0) {
      // Utiliser les valeurs déjà calculées
      const total = roll.preRolledValues.reduce((a, b) => a + b, 0) + roll.modifier;
      const isNatural20 = roll.dieType === 'd20' && roll.preRolledValues.some(v => v === 20);
      const isNatural1 = roll.dieType === 'd20' && roll.preRolledValues.every(v => v === 1);
      
      diceResult = {
        rolls: roll.preRolledValues,
        total,
        modifier: roll.modifier,
        isCritical: isNatural20,
        isNatural1,
        isNatural20,
        dieType: roll.dieType
      };
    } else {
      // Lancer les dés normalement
      diceResult = rollDice(roll.dieType, roll.count, roll.modifier);
    }
    
    setResult(diceResult);
    
    // Timer pour la phase de résultat
    const resultTimer = setTimeout(() => {
      setPhase('result');
      setCanClose(true);
    }, 800 + (roll.count * 100));
    
    // Timer pour fermeture automatique (sauf si waitForClick)
    let completeTimer: NodeJS.Timeout | undefined;
    if (!waitForClick) {
      completeTimer = setTimeout(() => {
        handleComplete(diceResult);
      }, 1500 + (roll.count * 100));
    }
    
    return () => {
      clearTimeout(resultTimer);
      if (completeTimer) clearTimeout(completeTimer);
    };
  }, [roll.dieType, roll.count, roll.modifier, roll.preRolledValues, waitForClick, handleComplete]);
  
  if (!showAnimation || !result) {
    return null;
  }
  
  const effectiveDamageType = damageType || roll.damageType;
  
  return (
    <div 
      className={`dice-roller-overlay ${phase} ${waitForClick && canClose ? 'clickable' : ''}`}
      onClick={waitForClick ? handleClick : undefined}
    >
      <div className="dice-roller-container">
        {roll.label && (
          <div className="dice-roll-label">{roll.label}</div>
        )}
        
        <div className="dice-group">
          {result.rolls.map((value, index) => (
            <Animated3DDie 
              key={index}
              dieType={roll.dieType}
              finalValue={value}
              delay={index * 100}
              damageType={effectiveDamageType}
            />
          ))}
        </div>
        
        {phase === 'result' && (
          <div className={`dice-total ${result.isCritical ? 'critical' : ''} ${result.isNatural1 ? 'fail' : ''}`}>
            <span className="total-label">Résultat</span>
            <span className="total-value">
              {result.rolls.length > 1 && (
                <>
                  <span className="rolls-breakdown">
                    ({result.rolls.join(' / ')})
                  </span>
                </>
              )}
              {roll.modifier !== 0 && (
                <span className="modifier">
                  {roll.modifier > 0 ? '+' : ''}{roll.modifier}
                </span>
              )}
              <span className="equals">=</span>
              <span className="final">{result.total}</span>
            </span>
            
            {result.isCritical && (
              <div className="critical-banner">💥 COUP CRITIQUE !</div>
            )}
            {result.isNatural1 && !result.isCritical && (
              <div className="fail-banner">💨 ÉCHEC CRITIQUE !</div>
            )}
            
            {waitForClick && canClose && (
              <div className="click-to-continue">Cliquez pour continuer</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// COMPOSANT D'AFFICHAGE DE RÉSULTAT EN LIGNE
// ============================================
export function DiceResultDisplay({ result, damageType }: { result: DiceResult; damageType?: string }) {
  const color = getDamageTypeColor(damageType);
  
  return (
    <span className="dice-result-inline" style={{ color }}>
      🎲 ({result.rolls.join('+')})
      {result.modifier !== 0 && (
        <span className="modifier">{result.modifier > 0 ? '+' : ''}{result.modifier}</span>
      )}
      = <strong>{result.total}</strong>
      {result.isCritical && <span className="crit-indicator">💥</span>}
    </span>
  );
}

// Couleur selon type de dégâts
function getDamageTypeColor(damageType?: string): string {
  const colors: Record<string, string> = {
    physical: '#c0c0c0',
    slashing: '#c0c0c0',
    piercing: '#a0a0a0',
    bludgeoning: '#808080',
    fire: '#ff6b35',
    cold: '#4fc3f7',
    lightning: '#ffd93d',
    acid: '#84cc16',
    poison: '#22c55e',
    necrotic: '#a855f7',
    radiant: '#ffd700',
    force: '#a855f7',
    psychic: '#e040fb',
    thunder: '#90caf9',
    magical: '#9b59b6',
    holy: '#ffd700',
    heal: '#4ade80'
  };
  
  return damageType ? colors[damageType] || '#9b59b6' : '#9b59b6';
}
