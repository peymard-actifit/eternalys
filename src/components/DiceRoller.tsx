import { useState, useEffect } from 'react';
import './DiceRoller.css';

// Types de dés D&D
export type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

interface DiceRoll {
  dieType: DieType;
  count: number;
  modifier: number;
  damageType?: string;
  label?: string;
}

interface DiceResult {
  rolls: number[];
  total: number;
  modifier: number;
  isCritical?: boolean;
  dieType: DieType;
}

interface DiceRollerProps {
  roll: DiceRoll;
  onComplete: (result: DiceResult) => void;
  showAnimation?: boolean;
  damageType?: string;
}

// Icônes des faces de dés
const DIE_ICONS: Record<DieType, string> = {
  'd4': '🔺',
  'd6': '🎲',
  'd8': '💎',
  'd10': '🔷',
  'd12': '⭐',
  'd20': '🌟',
  'd100': '💯'
};

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

// Couleurs selon le type de dégâts
const DAMAGE_TYPE_COLORS: Record<string, string> = {
  physical: '#c0c0c0',
  slashing: '#c0c0c0',
  piercing: '#a0a0a0',
  bludgeoning: '#808080',
  fire: '#ff6b35',
  cold: '#4fc3f7',
  lightning: '#ffd93d',
  acid: '#76ff03',
  poison: '#9c27b0',
  necrotic: '#4a148c',
  radiant: '#fff176',
  force: '#64b5f6',
  psychic: '#e040fb',
  thunder: '#90caf9',
  magical: '#9b59b6',
  holy: '#ffd700',
  heal: '#4caf50'
};

// Fonction utilitaire pour lancer un dé
export function rollDie(dieType: DieType): number {
  return Math.floor(Math.random() * DIE_MAX[dieType]) + 1;
}

// Fonction pour lancer plusieurs dés
export function rollDice(dieType: DieType, count: number, modifier: number = 0): DiceResult {
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(rollDie(dieType));
  }
  const total = rolls.reduce((sum, r) => sum + r, 0) + modifier;
  const isCritical = dieType === 'd20' && rolls.some(r => r === 20);
  
  return { rolls, total, modifier, isCritical, dieType };
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

// Composant d'un dé animé
function AnimatedDie({ 
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
  const [isRolling, setIsRolling] = useState(true);
  const [displayValue, setDisplayValue] = useState(1);
  const [showResult, setShowResult] = useState(false);
  
  const color = damageType ? DAMAGE_TYPE_COLORS[damageType] || '#9b59b6' : '#9b59b6';
  const max = DIE_MAX[dieType];
  const isCrit = dieType === 'd20' && finalValue === 20;
  const isFail = dieType === 'd20' && finalValue === 1;
  
  useEffect(() => {
    // Animation de roulement
    const rollInterval = setInterval(() => {
      setDisplayValue(Math.floor(Math.random() * max) + 1);
    }, 50);
    
    // Arrêter après un délai
    const stopTimeout = setTimeout(() => {
      clearInterval(rollInterval);
      setIsRolling(false);
      setDisplayValue(finalValue);
      setTimeout(() => setShowResult(true), 100);
    }, 600 + delay);
    
    return () => {
      clearInterval(rollInterval);
      clearTimeout(stopTimeout);
    };
  }, [finalValue, max, delay]);
  
  return (
    <div 
      className={`animated-die ${dieType} ${isRolling ? 'rolling' : ''} ${showResult ? 'result' : ''} ${isCrit ? 'critical' : ''} ${isFail ? 'fail' : ''}`}
      style={{ '--die-color': color } as React.CSSProperties}
    >
      <div className="die-face">
        <span className="die-icon">{DIE_ICONS[dieType]}</span>
        <span className="die-value">{displayValue}</span>
      </div>
      <div className="die-label">{dieType}</div>
    </div>
  );
}

// Composant principal de lancer de dés
export function DiceRoller({ roll, onComplete, showAnimation = true, damageType }: DiceRollerProps) {
  const [result, setResult] = useState<DiceResult | null>(null);
  const [phase, setPhase] = useState<'rolling' | 'result'>('rolling');
  
  useEffect(() => {
    // Effectuer le lancer
    const diceResult = rollDice(roll.dieType, roll.count, roll.modifier);
    setResult(diceResult);
    
    // Timer pour la phase de résultat
    const resultTimer = setTimeout(() => {
      setPhase('result');
      // Délai supplémentaire avant de callback
      setTimeout(() => {
        onComplete(diceResult);
      }, 800);
    }, 800 + (roll.count * 100));
    
    return () => clearTimeout(resultTimer);
  }, [roll, onComplete]);
  
  if (!showAnimation || !result) {
    return null;
  }
  
  return (
    <div className={`dice-roller-overlay ${phase}`}>
      <div className="dice-roller-container">
        {roll.label && (
          <div className="dice-roll-label">{roll.label}</div>
        )}
        
        <div className="dice-group">
          {result.rolls.map((value, index) => (
            <AnimatedDie 
              key={index}
              dieType={roll.dieType}
              finalValue={value}
              delay={index * 100}
              damageType={damageType || roll.damageType}
            />
          ))}
        </div>
        
        {phase === 'result' && (
          <div className={`dice-total ${result.isCritical ? 'critical' : ''}`}>
            <span className="total-label">Total:</span>
            <span className="total-value">
              {result.rolls.reduce((s, r) => s + r, 0)}
              {roll.modifier !== 0 && (
                <span className="modifier">
                  {roll.modifier > 0 ? '+' : ''}{roll.modifier}
                </span>
              )}
              <span className="equals">=</span>
              <span className="final">{result.total}</span>
            </span>
            {result.isCritical && (
              <div className="critical-banner">💥 CRITIQUE !</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Composant simplifié pour afficher le résultat d'un jet
export function DiceResultDisplay({ result, damageType }: { result: DiceResult; damageType?: string }) {
  const color = damageType ? DAMAGE_TYPE_COLORS[damageType] || '#9b59b6' : '#9b59b6';
  
  return (
    <span className="dice-result-inline" style={{ color }}>
      {DIE_ICONS[result.dieType]} ({result.rolls.join('+')})
      {result.modifier !== 0 && (
        <span className="modifier">{result.modifier > 0 ? '+' : ''}{result.modifier}</span>
      )}
      = <strong>{result.total}</strong>
    </span>
  );
}

