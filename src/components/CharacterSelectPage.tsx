import { useState } from 'react';
import { Character } from '../types/game.types';
import { AVAILABLE_CHARACTERS } from '../data/characters';
import { gameStore } from '../store/gameStore';
import './CharacterSelectPage.css';

interface SelectedCharacter extends Character {
  customName?: string;
}

export function CharacterSelectPage() {
  const [selectedCharacters, setSelectedCharacters] = useState<SelectedCharacter[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempName, setTempName] = useState('');
  const maxTeamSize = 4;

  const toggleCharacter = (character: Character) => {
    const isSelected = selectedCharacters.some(c => c.id === character.id);
    
    if (isSelected) {
      setSelectedCharacters(selectedCharacters.filter(c => c.id !== character.id));
    } else if (selectedCharacters.length < maxTeamSize) {
      setSelectedCharacters([...selectedCharacters, { ...character, customName: character.name }]);
    }
  };

  const startEditingName = (index: number) => {
    setEditingIndex(index);
    setTempName(selectedCharacters[index].customName || selectedCharacters[index].name);
  };

  const saveName = () => {
    if (editingIndex !== null && tempName.trim()) {
      const updated = [...selectedCharacters];
      updated[editingIndex] = {
        ...updated[editingIndex],
        customName: tempName.trim(),
        name: tempName.trim()
      };
      setSelectedCharacters(updated);
    }
    setEditingIndex(null);
    setTempName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveName();
    } else if (e.key === 'Escape') {
      setEditingIndex(null);
      setTempName('');
    }
  };

  const handleStartDungeon = () => {
    if (selectedCharacters.length > 0) {
      // Appliquer les noms personnalisés
      const teamWithNames = selectedCharacters.map(c => ({
        ...c,
        name: c.customName || c.name
      }));
      gameStore.selectTeam(teamWithNames);
    }
  };

  return (
    <div className="character-select-page">
      <div className="select-header">
        <h1>🏰 Sélection de l'équipe</h1>
        <p className="select-subtitle">
          Choisissez jusqu'à {maxTeamSize} héros pour explorer le donjon
        </p>
        <p className="select-hint">💡 Cliquez sur un nom pour le personnaliser</p>
      </div>

      <div className="team-slots">
        {Array.from({ length: maxTeamSize }).map((_, i) => (
          <div key={i} className={`team-slot ${selectedCharacters[i] ? 'filled' : 'empty'}`}>
            {selectedCharacters[i] ? (
              <>
                <span className="slot-portrait">{selectedCharacters[i].portrait}</span>
                {editingIndex === i ? (
                  <input
                    type="text"
                    className="name-input"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={saveName}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    maxLength={15}
                  />
                ) : (
                  <span 
                    className="slot-name editable"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditingName(i);
                    }}
                    title="Cliquez pour modifier le nom"
                  >
                    {selectedCharacters[i].customName || selectedCharacters[i].name}
                    <span className="edit-icon">✏️</span>
                  </span>
                )}
                <span className="slot-class">{selectedCharacters[i].class}</span>
                <button 
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCharacter(selectedCharacters[i]);
                  }}
                >
                  ✕
                </button>
              </>
            ) : (
              <span className="slot-empty">?</span>
            )}
          </div>
        ))}
      </div>

      <div className="characters-grid">
        {AVAILABLE_CHARACTERS.map(character => {
          const isSelected = selectedCharacters.some(c => c.id === character.id);
          const isDisabled = !isSelected && selectedCharacters.length >= maxTeamSize;
          
          return (
            <div
              key={character.id}
              className={`character-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => !isDisabled && toggleCharacter(character)}
            >
              <div className="card-portrait">{character.portrait}</div>
              <div className="card-info">
                <h3 className="card-name">{character.name}</h3>
                <p className="card-class">{character.class}</p>
              </div>
              <div className="card-stats">
                <div className="stat">
                  <span className="stat-icon">❤️</span>
                  <span className="stat-value">{character.hp}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">⚔️</span>
                  <span className="stat-value">{character.attack}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">🛡️</span>
                  <span className="stat-value">{character.defense}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">🔮</span>
                  <span className="stat-value">{character.magicDefense}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">💨</span>
                  <span className="stat-value">{character.speed}</span>
                </div>
              </div>
              <div className="card-skills">
                {character.skills.map(skill => (
                  <span 
                    key={skill.id} 
                    className={`skill-tag ${skill.damageType || 'physical'}`}
                    title={skill.description}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
              {isSelected && <div className="selected-overlay">✓</div>}
            </div>
          );
        })}
      </div>

      <div className="select-actions">
        <button 
          className="start-dungeon-button"
          disabled={selectedCharacters.length === 0}
          onClick={handleStartDungeon}
        >
          <span className="button-icon">🏰</span>
          Entrer dans le Donjon
          <span className="team-count">({selectedCharacters.length}/{maxTeamSize})</span>
        </button>
      </div>
    </div>
  );
}
