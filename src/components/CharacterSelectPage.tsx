import { useState } from 'react';
import { Character, getModifier } from '../types/game.types';
import { AVAILABLE_CHARACTERS } from '../data/characters';
import { gameStore } from '../store/gameStore';
import { XPBar } from './XPBar';
import './CharacterSelectPage.css';

interface SelectedCharacter extends Character {
  customName?: string;
}

export function CharacterSelectPage() {
  const [selectedCharacters, setSelectedCharacters] = useState<(SelectedCharacter | null)[]>([null, null, null, null]);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempName, setTempName] = useState('');
  const maxTeamSize = 4;

  // Ouvrir le menu de sélection pour un slot
  const openCharacterMenu = (slotIndex: number) => {
    setActiveSlot(slotIndex);
  };

  // Fermer le menu de sélection
  const closeCharacterMenu = () => {
    setActiveSlot(null);
  };

  // Sélectionner un personnage pour le slot actif
  const selectCharacter = (character: Character) => {
    if (activeSlot === null) return;
    
    // Vérifier si le personnage est déjà sélectionné dans un autre slot
    const isAlreadySelected = selectedCharacters.some(c => c?.id === character.id);
    if (isAlreadySelected) return;
    
    const newSelection = [...selectedCharacters];
    newSelection[activeSlot] = { ...character, customName: character.name };
    setSelectedCharacters(newSelection);
    setActiveSlot(null);
  };

  // Retirer un personnage d'un slot
  const removeCharacter = (slotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelection = [...selectedCharacters];
    newSelection[slotIndex] = null;
    setSelectedCharacters(newSelection);
  };

  // Édition du nom
  const startEditingName = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const char = selectedCharacters[index];
    if (!char) return;
    setEditingIndex(index);
    setTempName(char.customName || char.name);
  };

  const saveName = () => {
    if (editingIndex !== null && tempName.trim() && selectedCharacters[editingIndex]) {
      const updated = [...selectedCharacters];
      updated[editingIndex] = {
        ...updated[editingIndex]!,
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

  // Vérifier si un personnage est déjà sélectionné
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
          Cliquez sur un emplacement pour choisir un héros
        </p>
      </div>

      {/* Emplacements d'équipe */}
      <div className="team-slots-container">
        <div className="team-slots">
          {selectedCharacters.map((char, index) => (
            <div 
              key={index} 
              className={`team-slot ${char ? 'filled' : 'empty'} ${activeSlot === index ? 'active' : ''}`}
              onClick={() => char ? null : openCharacterMenu(index)}
            >
              {char ? (
                <>
                  <button 
                    className="remove-btn"
                    onClick={(e) => removeCharacter(index, e)}
                    title="Retirer ce personnage"
                  >
                    ✕
                  </button>
                  <span className="slot-portrait">{char.portrait}</span>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      className="name-input"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onBlur={saveName}
                      onKeyDown={handleKeyDown}
                      autoFocus
                      maxLength={15}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span 
                      className="slot-name editable"
                      onClick={(e) => startEditingName(index, e)}
                      title="Cliquez pour modifier le nom"
                    >
                      {char.customName || char.name}
                      <span className="edit-icon">✏️</span>
                    </span>
                  )}
                  <span className="slot-class">{char.class} Niv.{char.level}</span>
                  <div className="slot-stats">
                    <span title="PV">❤️ {char.hp}</span>
                    <span title="CA">🛡️ {char.armorClass}</span>
                  </div>
                  <div className="slot-xp">
                    <XPBar character={char} compact />
                  </div>
                  {/* Cliquer pour changer */}
                  <button 
                    className="change-btn"
                    onClick={(e) => { e.stopPropagation(); openCharacterMenu(index); }}
                    title="Changer de personnage"
                  >
                    🔄 Changer
                  </button>
                </>
              ) : (
                <div className="empty-slot-content">
                  <span className="slot-empty-icon">+</span>
                  <span className="slot-empty-text">Ajouter</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bouton Entrer dans le donjon - toujours visible */}
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

      {/* Menu de sélection de personnage (overlay) */}
      {activeSlot !== null && (
        <div className="character-menu-overlay" onClick={closeCharacterMenu}>
          <div className="character-menu" onClick={(e) => e.stopPropagation()}>
            <div className="menu-header">
              <h2>Choisir un héros</h2>
              <button className="close-menu-btn" onClick={closeCharacterMenu}>✕</button>
            </div>
            
            <div className="menu-content">
              {AVAILABLE_CHARACTERS.map(character => {
                const isSelected = isCharacterSelected(character.id);
                
                return (
                  <div
                    key={character.id}
                    className={`menu-character-card ${isSelected ? 'already-selected' : ''}`}
                    onClick={() => !isSelected && selectCharacter(character)}
                  >
                    {isSelected && <div className="already-in-team">Déjà dans l'équipe</div>}
                    
                    <div className="menu-card-header">
                      <span className="menu-portrait">{character.portrait}</span>
                      <div className="menu-card-info">
                        <h3>{character.name}</h3>
                        <p className="menu-class">{character.class} Niv. {character.level}</p>
                      </div>
                    </div>

                    {/* Stats D&D principales */}
                    <div className="menu-stats-row">
                      <div className="menu-stat">
                        <span className="ms-icon">❤️</span>
                        <span className="ms-value">{character.hp}</span>
                        <span className="ms-label">PV</span>
                      </div>
                      <div className="menu-stat">
                        <span className="ms-icon">🛡️</span>
                        <span className="ms-value">{character.armorClass}</span>
                        <span className="ms-label">CA</span>
                      </div>
                      <div className="menu-stat">
                        <span className="ms-icon">⚔️</span>
                        <span className="ms-value">{getModifierString(Math.max(character.abilities.strength, character.abilities.dexterity) + character.proficiencyBonus - 10)}</span>
                        <span className="ms-label">ATT</span>
                      </div>
                      <div className="menu-stat">
                        <span className="ms-icon">🎯</span>
                        <span className="ms-value">+{character.proficiencyBonus}</span>
                        <span className="ms-label">MAÎT</span>
                      </div>
                    </div>
                    
                    {/* Barre d'XP */}
                    <div className="menu-xp-bar">
                      <XPBar character={character} compact />
                    </div>

                    {/* Caractéristiques D&D */}
                    <div className="menu-abilities">
                      <div className="menu-ability">
                        <span className="ma-label">FOR</span>
                        <span className="ma-score">{character.abilities.strength}</span>
                        <span className="ma-mod">{getModifierString(character.abilities.strength)}</span>
                      </div>
                      <div className="menu-ability">
                        <span className="ma-label">DEX</span>
                        <span className="ma-score">{character.abilities.dexterity}</span>
                        <span className="ma-mod">{getModifierString(character.abilities.dexterity)}</span>
                      </div>
                      <div className="menu-ability">
                        <span className="ma-label">CON</span>
                        <span className="ma-score">{character.abilities.constitution}</span>
                        <span className="ma-mod">{getModifierString(character.abilities.constitution)}</span>
                      </div>
                      <div className="menu-ability">
                        <span className="ma-label">INT</span>
                        <span className="ma-score">{character.abilities.intelligence}</span>
                        <span className="ma-mod">{getModifierString(character.abilities.intelligence)}</span>
                      </div>
                      <div className="menu-ability">
                        <span className="ma-label">SAG</span>
                        <span className="ma-score">{character.abilities.wisdom}</span>
                        <span className="ma-mod">{getModifierString(character.abilities.wisdom)}</span>
                      </div>
                      <div className="menu-ability">
                        <span className="ma-label">CHA</span>
                        <span className="ma-score">{character.abilities.charisma}</span>
                        <span className="ma-mod">{getModifierString(character.abilities.charisma)}</span>
                      </div>
                    </div>

                    {/* Compétences */}
                    <div className="menu-skills">
                      {character.skills.slice(0, 3).map(skill => (
                        <span 
                          key={skill.id} 
                          className={`menu-skill-tag ${getDamageTypeClass(skill.damageType)}`}
                          title={skill.description}
                        >
                          {skill.name}
                        </span>
                      ))}
                      {character.skills.length > 3 && (
                        <span className="menu-skill-more">+{character.skills.length - 3}</span>
                      )}
                    </div>

                    {!isSelected && (
                      <button className="select-character-btn">
                        ✓ Sélectionner
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
