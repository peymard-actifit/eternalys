import { useState } from 'react';
import { Character, getModifier } from '../types/game.types';
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
  const [hoveredCharacter, setHoveredCharacter] = useState<Character | null>(null);
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

  const getModifierString = (score: number): string => {
    const mod = getModifier(score);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  // Fonction pour obtenir la couleur du type de dégât
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
      <div className="select-header">
        <h1>🏰 Sélection de l'équipe</h1>
        <p className="select-subtitle">
          Choisissez jusqu'à {maxTeamSize} héros pour explorer le donjon
        </p>
        <p className="select-hint">💡 Survolez un personnage pour voir ses caractéristiques D&D</p>
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
              onMouseEnter={() => setHoveredCharacter(character)}
              onMouseLeave={() => setHoveredCharacter(null)}
            >
              <div className="card-portrait">{character.portrait}</div>
              <div className="card-info">
                <h3 className="card-name">{character.name}</h3>
                <p className="card-class">{character.class} Niv. {character.level}</p>
              </div>
              
              {/* Caractéristiques D&D - Mini version */}
              <div className="card-abilities">
                <div className="ability-mini str" title="Force">
                  <span className="ab-label">FOR</span>
                  <span className="ab-value">{character.abilities.strength}</span>
                  <span className="ab-mod">{getModifierString(character.abilities.strength)}</span>
                </div>
                <div className="ability-mini dex" title="Dextérité">
                  <span className="ab-label">DEX</span>
                  <span className="ab-value">{character.abilities.dexterity}</span>
                  <span className="ab-mod">{getModifierString(character.abilities.dexterity)}</span>
                </div>
                <div className="ability-mini con" title="Constitution">
                  <span className="ab-label">CON</span>
                  <span className="ab-value">{character.abilities.constitution}</span>
                  <span className="ab-mod">{getModifierString(character.abilities.constitution)}</span>
                </div>
                <div className="ability-mini int" title="Intelligence">
                  <span className="ab-label">INT</span>
                  <span className="ab-value">{character.abilities.intelligence}</span>
                  <span className="ab-mod">{getModifierString(character.abilities.intelligence)}</span>
                </div>
                <div className="ability-mini wis" title="Sagesse">
                  <span className="ab-label">SAG</span>
                  <span className="ab-value">{character.abilities.wisdom}</span>
                  <span className="ab-mod">{getModifierString(character.abilities.wisdom)}</span>
                </div>
                <div className="ability-mini cha" title="Charisme">
                  <span className="ab-label">CHA</span>
                  <span className="ab-value">{character.abilities.charisma}</span>
                  <span className="ab-mod">{getModifierString(character.abilities.charisma)}</span>
                </div>
              </div>

              {/* Stats de combat */}
              <div className="card-stats">
                <div className="stat" title="Points de vie">
                  <span className="stat-icon">❤️</span>
                  <span className="stat-value">{character.hp}</span>
                </div>
                <div className="stat" title="Classe d'armure">
                  <span className="stat-icon">🔰</span>
                  <span className="stat-value">{character.armorClass}</span>
                </div>
                <div className="stat" title="Attaque physique">
                  <span className="stat-icon">⚔️</span>
                  <span className="stat-value">{character.attack}</span>
                </div>
                <div className="stat" title="Attaque magique">
                  <span className="stat-icon">🔮</span>
                  <span className="stat-value">{character.magicAttack}</span>
                </div>
                <div className="stat" title="Défense">
                  <span className="stat-icon">🛡️</span>
                  <span className="stat-value">{character.defense}</span>
                </div>
                <div className="stat" title="Vitesse">
                  <span className="stat-icon">💨</span>
                  <span className="stat-value">{character.speed}m</span>
                </div>
              </div>

              {/* Compétences */}
              <div className="card-skills">
                {character.skills.map(skill => (
                  <span 
                    key={skill.id} 
                    className={`skill-tag ${getDamageTypeClass(skill.damageType)}`}
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

      {/* Panneau de détails au survol */}
      {hoveredCharacter && (
        <div className="character-detail-panel">
          <div className="detail-header">
            <span className="detail-portrait">{hoveredCharacter.portrait}</span>
            <div className="detail-info">
              <h3>{hoveredCharacter.name}</h3>
              <p>{hoveredCharacter.class} Niveau {hoveredCharacter.level}</p>
            </div>
          </div>
          
          <div className="detail-abilities">
            <h4>📜 Caractéristiques D&D</h4>
            <div className="detail-abilities-grid">
              <div className="detail-ability str">
                <span className="da-name">Force</span>
                <span className="da-score">{hoveredCharacter.abilities.strength}</span>
                <span className="da-mod">{getModifierString(hoveredCharacter.abilities.strength)}</span>
              </div>
              <div className="detail-ability dex">
                <span className="da-name">Dextérité</span>
                <span className="da-score">{hoveredCharacter.abilities.dexterity}</span>
                <span className="da-mod">{getModifierString(hoveredCharacter.abilities.dexterity)}</span>
              </div>
              <div className="detail-ability con">
                <span className="da-name">Constitution</span>
                <span className="da-score">{hoveredCharacter.abilities.constitution}</span>
                <span className="da-mod">{getModifierString(hoveredCharacter.abilities.constitution)}</span>
              </div>
              <div className="detail-ability int">
                <span className="da-name">Intelligence</span>
                <span className="da-score">{hoveredCharacter.abilities.intelligence}</span>
                <span className="da-mod">{getModifierString(hoveredCharacter.abilities.intelligence)}</span>
              </div>
              <div className="detail-ability wis">
                <span className="da-name">Sagesse</span>
                <span className="da-score">{hoveredCharacter.abilities.wisdom}</span>
                <span className="da-mod">{getModifierString(hoveredCharacter.abilities.wisdom)}</span>
              </div>
              <div className="detail-ability cha">
                <span className="da-name">Charisme</span>
                <span className="da-score">{hoveredCharacter.abilities.charisma}</span>
                <span className="da-mod">{getModifierString(hoveredCharacter.abilities.charisma)}</span>
              </div>
            </div>
          </div>

          <div className="detail-derived">
            <div className="derived-item">
              <span className="di-label">PV</span>
              <span className="di-value">{hoveredCharacter.hp}</span>
            </div>
            <div className="derived-item">
              <span className="di-label">CA</span>
              <span className="di-value">{hoveredCharacter.armorClass}</span>
            </div>
            <div className="derived-item">
              <span className="di-label">Maîtrise</span>
              <span className="di-value">+{hoveredCharacter.proficiencyBonus}</span>
            </div>
            <div className="derived-item">
              <span className="di-label">Vitesse</span>
              <span className="di-value">{hoveredCharacter.speed}m</span>
            </div>
          </div>

          <div className="detail-saves">
            <h4>🎲 Jets de sauvegarde maîtrisés</h4>
            <div className="saves-list">
              {hoveredCharacter.savingThrowProficiencies.map(save => {
                const labels: Record<string, string> = {
                  strength: 'Force', dexterity: 'Dextérité', constitution: 'Constitution',
                  intelligence: 'Intelligence', wisdom: 'Sagesse', charisma: 'Charisme'
                };
                return (
                  <span key={save} className="save-tag">● {labels[save]}</span>
                );
              })}
            </div>
          </div>

          <div className="detail-skills">
            <h4>⚔️ Compétences</h4>
            {hoveredCharacter.skills.map(skill => (
              <div key={skill.id} className="detail-skill">
                <span className="ds-name">{skill.name}</span>
                <span className="ds-desc">{skill.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
