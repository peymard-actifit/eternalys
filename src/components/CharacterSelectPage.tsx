import { useState, useRef } from 'react';
import { Character, getModifier } from '../types/game.types';
import { AVAILABLE_CHARACTERS } from '../data/characters';
import { gameStore } from '../store/gameStore';
import './CharacterSelectPage.css';

interface SelectedCharacter extends Character {
  customName?: string;
}

export function CharacterSelectPage() {
  const [selectedCharacters, setSelectedCharacters] = useState<(SelectedCharacter | null)[]>([null, null, null, null]);
  const [hoveredCharacter, setHoveredCharacter] = useState<Character | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const maxTeamSize = 4;

  // Sélectionner/désélectionner un personnage
  const toggleCharacter = (character: Character) => {
    const existingIndex = selectedCharacters.findIndex(c => c?.id === character.id);
    
    if (existingIndex !== -1) {
      // Retirer le personnage
      const newSelection = [...selectedCharacters];
      newSelection[existingIndex] = null;
      setSelectedCharacters(newSelection);
    } else {
      // Ajouter le personnage au premier slot vide
      const emptyIndex = selectedCharacters.findIndex(c => c === null);
      if (emptyIndex !== -1) {
        const newSelection = [...selectedCharacters];
        newSelection[emptyIndex] = { ...character, customName: character.name };
        setSelectedCharacters(newSelection);
      }
    }
  };

  // Gérer le survol pour le tooltip
  const handleMouseEnter = (character: Character, e: React.MouseEvent) => {
    setHoveredCharacter(character);
    updateTooltipPosition(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoveredCharacter) {
      updateTooltipPosition(e);
    }
  };

  const updateTooltipPosition = (e: React.MouseEvent) => {
    const offset = 15;
    let x = e.clientX + offset;
    let y = e.clientY + offset;
    
    // Ajuster si le tooltip sort de l'écran
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      if (x + rect.width > window.innerWidth) {
        x = e.clientX - rect.width - offset;
      }
      if (y + rect.height > window.innerHeight) {
        y = e.clientY - rect.height - offset;
      }
    }
    
    setTooltipPos({ x, y });
  };

  const handleMouseLeave = () => {
    setHoveredCharacter(null);
  };

  // Démarrer le donjon
  const handleStartDungeon = () => {
    const team = selectedCharacters.filter((c): c is SelectedCharacter => c !== null);
    if (team.length > 0) {
      const teamWithNames = team.map(c => ({
        ...c,
        name: c.customName || c.name
      }));
      gameStore.selectTeam(teamWithNames);
    }
  };

  // Compter les personnages sélectionnés
  const selectedCount = selectedCharacters.filter(c => c !== null).length;

  // Vérifier si un personnage est sélectionné
  const isCharacterSelected = (characterId: string) => {
    return selectedCharacters.some(c => c?.id === characterId);
  };

  const getModifierString = (score: number): string => {
    const mod = getModifier(score);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const getDamageTypeClass = (damageType?: string): string => {
    const physicalTypes = ['slashing', 'piercing', 'bludgeoning', 'physical'];
    const magicalTypes = ['fire', 'cold', 'lightning', 'acid', 'poison', 'necrotic', 'force', 'psychic', 'thunder', 'magical'];
    const holyTypes = ['radiant', 'holy'];
    
    if (!damageType) return 'physical';
    if (physicalTypes.includes(damageType)) return 'physical';
    if (holyTypes.includes(damageType)) return 'holy';
    if (magicalTypes.includes(damageType)) return 'magical';
    return 'physical';
  };

  return (
    <div className="character-select-page">
      {/* Header */}
      <div className="select-header">
        <h1>🏰 Sélection de l'équipe</h1>
        <p className="select-subtitle">
          Cliquez sur un héros pour le sélectionner ({selectedCount}/{maxTeamSize})
        </p>
      </div>

      {/* Grille de tous les personnages */}
      <div className="characters-grid">
        {AVAILABLE_CHARACTERS.map(character => {
          const isSelected = isCharacterSelected(character.id);
          const isFull = selectedCount >= maxTeamSize && !isSelected;
          
          return (
            <div
              key={character.id}
              className={`char-mini-card ${isSelected ? 'selected' : ''} ${isFull ? 'disabled' : ''}`}
              onClick={() => !isFull && toggleCharacter(character)}
              onMouseEnter={(e) => handleMouseEnter(character, e)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {isSelected && <div className="selected-badge">✓</div>}
              <span className="char-mini-portrait">{character.portrait}</span>
              <span className="char-mini-name">{character.name}</span>
              <span className="char-mini-class">{character.class}</span>
            </div>
          );
        })}
      </div>

      {/* Équipe sélectionnée */}
      {selectedCount > 0 && (
        <div className="selected-team">
          <h3>Équipe sélectionnée</h3>
          <div className="selected-portraits">
            {selectedCharacters.filter(c => c !== null).map(char => (
              <div 
                key={char!.id} 
                className="selected-portrait"
                onClick={() => toggleCharacter(char!)}
                title="Cliquez pour retirer"
              >
                <span className="sp-icon">{char!.portrait}</span>
                <span className="sp-name">{char!.name}</span>
                <span className="sp-remove">✕</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bouton Entrer */}
      <div className="select-actions">
        <button 
          className="start-dungeon-button"
          disabled={selectedCount === 0}
          onClick={handleStartDungeon}
        >
          <span className="button-icon">🏰</span>
          Entrer dans le Donjon
          <span className="team-count">({selectedCount}/{maxTeamSize})</span>
        </button>
        {selectedCount === 0 && (
          <p className="action-hint">Sélectionnez au moins un héros</p>
        )}
      </div>

      {/* Tooltip au survol */}
      {hoveredCharacter && (
        <div 
          ref={tooltipRef}
          className="char-tooltip"
          style={{ 
            left: tooltipPos.x, 
            top: tooltipPos.y 
          }}
        >
          <div className="tooltip-header">
            <span className="t-portrait">{hoveredCharacter.portrait}</span>
            <div className="t-info">
              <h4>{hoveredCharacter.name}</h4>
              <p>{hoveredCharacter.class} Niv. {hoveredCharacter.level}</p>
            </div>
          </div>

          <div className="tooltip-stats">
            <div className="t-stat">
              <span>❤️ PV</span>
              <span>{hoveredCharacter.hp}/{hoveredCharacter.maxHp}</span>
            </div>
            <div className="t-stat">
              <span>🛡️ CA</span>
              <span>{hoveredCharacter.armorClass}</span>
            </div>
            <div className="t-stat">
              <span>🎯 Maît.</span>
              <span>+{hoveredCharacter.proficiencyBonus}</span>
            </div>
          </div>

          <div className="tooltip-abilities">
            <div className="t-ability">
              <span className="ta-label">FOR</span>
              <span className="ta-score">{hoveredCharacter.abilities.strength}</span>
              <span className="ta-mod">{getModifierString(hoveredCharacter.abilities.strength)}</span>
            </div>
            <div className="t-ability">
              <span className="ta-label">DEX</span>
              <span className="ta-score">{hoveredCharacter.abilities.dexterity}</span>
              <span className="ta-mod">{getModifierString(hoveredCharacter.abilities.dexterity)}</span>
            </div>
            <div className="t-ability">
              <span className="ta-label">CON</span>
              <span className="ta-score">{hoveredCharacter.abilities.constitution}</span>
              <span className="ta-mod">{getModifierString(hoveredCharacter.abilities.constitution)}</span>
            </div>
            <div className="t-ability">
              <span className="ta-label">INT</span>
              <span className="ta-score">{hoveredCharacter.abilities.intelligence}</span>
              <span className="ta-mod">{getModifierString(hoveredCharacter.abilities.intelligence)}</span>
            </div>
            <div className="t-ability">
              <span className="ta-label">SAG</span>
              <span className="ta-score">{hoveredCharacter.abilities.wisdom}</span>
              <span className="ta-mod">{getModifierString(hoveredCharacter.abilities.wisdom)}</span>
            </div>
            <div className="t-ability">
              <span className="ta-label">CHA</span>
              <span className="ta-score">{hoveredCharacter.abilities.charisma}</span>
              <span className="ta-mod">{getModifierString(hoveredCharacter.abilities.charisma)}</span>
            </div>
          </div>

          <div className="tooltip-skills">
            <h5>Compétences</h5>
            <div className="t-skills-list">
              {hoveredCharacter.skills.map(skill => (
                <span 
                  key={skill.id} 
                  className={`t-skill-tag ${getDamageTypeClass(skill.damageType)}`}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
