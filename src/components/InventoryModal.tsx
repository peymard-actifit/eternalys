import { useEffect, useState, useCallback } from 'react';
import { gameStore } from '../store/gameStore';
import { Character, InventoryItem, Equipment, EquipmentSlotType, CharacterEquipment, getModifier } from '../types/game.types';
import { calculateEquipmentBonuses } from '../data/equipment';
import './InventoryModal.css';

// Labels pour les emplacements d'équipement
const SLOT_LABELS: Record<EquipmentSlotType, { label: string; icon: string }> = {
  head: { label: 'Casque', icon: '⛑️' },
  armor: { label: 'Armure', icon: '🛡️' },
  cloak: { label: 'Cape', icon: '🧣' },
  gloves: { label: 'Gants', icon: '🧤' },
  bracers: { label: 'Avant-bras', icon: '💪' },
  belt: { label: 'Ceinture', icon: '🪢' },
  boots: { label: 'Bottes', icon: '👢' },
  necklace: { label: 'Collier', icon: '📿' },
  ring1: { label: 'Anneau 1', icon: '💍' },
  ring2: { label: 'Anneau 2', icon: '💍' },
  mainHand: { label: 'Main principale', icon: '⚔️' },
  offHand: { label: 'Main secondaire', icon: '🛡️' },
  ranged: { label: 'Arme à distance', icon: '🏹' },
  trinket1: { label: 'Breloque 1', icon: '🔮' },
  trinket2: { label: 'Breloque 2', icon: '🔮' },
  trinket3: { label: 'Breloque 3', icon: '🔮' },
  trinket4: { label: 'Breloque 4', icon: '🔮' },
  trinket5: { label: 'Breloque 5', icon: '🔮' },
  consumable1: { label: 'Consommable 1', icon: '🧪' },
  consumable2: { label: 'Consommable 2', icon: '🍖' },
  consumable3: { label: 'Consommable 3', icon: '🔦' },
};

// Position des emplacements - non utilisé directement car on utilise une grille
const SLOT_POSITIONS: Record<EquipmentSlotType, { top: string; left: string; side?: 'left' | 'right' }> = {
  head: { top: '0%', left: '50%' },
  necklace: { top: '10%', left: '50%' },
  cloak: { top: '20%', left: '15%', side: 'left' },
  armor: { top: '20%', left: '50%' },
  mainHand: { top: '30%', left: '10%', side: 'left' },
  offHand: { top: '30%', left: '90%', side: 'right' },
  bracers: { top: '40%', left: '15%', side: 'left' },
  gloves: { top: '40%', left: '90%', side: 'right' },
  belt: { top: '50%', left: '50%' },
  ring1: { top: '50%', left: '15%', side: 'left' },
  ring2: { top: '50%', left: '85%', side: 'right' },
  boots: { top: '60%', left: '50%' },
  ranged: { top: '20%', left: '85%', side: 'right' },
  trinket1: { top: '70%', left: '10%' },
  trinket2: { top: '70%', left: '30%' },
  trinket3: { top: '70%', left: '50%' },
  trinket4: { top: '70%', left: '70%' },
  trinket5: { top: '70%', left: '90%' },
  consumable1: { top: '85%', left: '30%' },
  consumable2: { top: '85%', left: '50%' },
  consumable3: { top: '85%', left: '70%' },
};

export function InventoryModal() {
  const [state, setState] = useState(gameStore.getState());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transferringItem, setTransferringItem] = useState<InventoryItem | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlotType | null>(null);
  const [hoveredEquipment, setHoveredEquipment] = useState<Equipment | null>(null);
  const [activeTab, setActiveTab] = useState<'equipment' | 'inventory' | 'stats'>('equipment');
  
  useEffect(() => {
    return gameStore.subscribe(() => setState(gameStore.getState()));
  }, []);

  const { team, showInventory } = state;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!showInventory) return;
    
    if (e.key === 'i' || e.key === 'I' || e.key === 'Escape') {
      if (transferringItem || selectedSlot) {
        setTransferringItem(null);
        setSelectedSlot(null);
      } else {
        e.preventDefault();
        gameStore.setState({ showInventory: false });
      }
    } else if (e.key === 'ArrowLeft' && !transferringItem) {
      e.preventDefault();
      setCurrentIndex(prev => (prev - 1 + team.length) % team.length);
    } else if (e.key === 'ArrowRight' && !transferringItem) {
      e.preventDefault();
      setCurrentIndex(prev => (prev + 1) % team.length);
    }
  }, [showInventory, team.length, transferringItem, selectedSlot]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!showInventory || team.length === 0) return null;

  const currentCharacter = team[currentIndex];
  const inventory = currentCharacter.inventory || [];
  const equipment = currentCharacter.equipment || {};
  const equipmentBonuses = calculateEquipmentBonuses(equipment);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#a0a0a0';
      case 'uncommon': return '#2ecc71';
      case 'rare': return '#4a9eff';
      case 'epic': return '#a855f7';
      case 'legendary': return '#fbbf24';
      default: return '#a0a0a0';
    }
  };

  const handleClose = () => {
    setTransferringItem(null);
    setSelectedSlot(null);
    gameStore.setState({ showInventory: false });
  };

  const handlePrev = () => {
    if (!transferringItem) {
      setCurrentIndex(prev => (prev - 1 + team.length) % team.length);
    }
  };

  const handleNext = () => {
    if (!transferringItem) {
      setCurrentIndex(prev => (prev + 1) % team.length);
    }
  };

  const handleTransferItem = (item: InventoryItem) => {
    setTransferringItem(item);
  };

  const handleSelectNewOwner = (newOwner: Character) => {
    if (!transferringItem) return;
    
    const updatedTeam = [...team];
    const currentOwnerIndex = currentIndex;
    if (updatedTeam[currentOwnerIndex].inventory) {
      updatedTeam[currentOwnerIndex].inventory = updatedTeam[currentOwnerIndex].inventory!.filter(
        i => i.id !== transferringItem.id || i.obtainedAt !== transferringItem.obtainedAt
      );
    }
    
    const newOwnerIndex = updatedTeam.findIndex(c => c.id === newOwner.id);
    if (newOwnerIndex !== -1) {
      if (!updatedTeam[newOwnerIndex].inventory) {
        updatedTeam[newOwnerIndex].inventory = [];
      }
      updatedTeam[newOwnerIndex].inventory!.push(transferringItem);
    }
    
    gameStore.setState({ team: updatedTeam });
    setTransferringItem(null);
  };

  const cancelTransfer = () => {
    setTransferringItem(null);
    setSelectedSlot(null);
  };

  const getEquippedItem = (slot: EquipmentSlotType): Equipment | undefined => {
    return equipment[slot as keyof CharacterEquipment];
  };

  const getModifierString = (score: number): string => {
    const mod = getModifier(score);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  // Rendu d'un emplacement d'équipement
  const renderEquipmentSlot = (slotType: EquipmentSlotType) => {
    const slotInfo = SLOT_LABELS[slotType];
    const equipped = getEquippedItem(slotType);
    
    return (
      <div
        key={slotType}
        className={`equipment-slot ${equipped ? 'equipped' : 'empty'} ${selectedSlot === slotType ? 'selected' : ''}`}
        onClick={() => setSelectedSlot(selectedSlot === slotType ? null : slotType)}
        onMouseEnter={() => equipped && setHoveredEquipment(equipped)}
        onMouseLeave={() => setHoveredEquipment(null)}
        title={equipped ? `${equipped.name} (${slotInfo.label})` : slotInfo.label}
      >
        <div 
          className="slot-background"
          style={equipped ? { borderColor: getRarityColor(equipped.rarity) } : {}}
        >
          {equipped ? (
            <span className="equipped-item-icon">{equipped.icon}</span>
          ) : (
            <span className="empty-slot-icon">{slotInfo.icon}</span>
          )}
        </div>
        <span className="slot-label">{slotInfo.label}</span>
      </div>
    );
  };

  // Tooltip d'équipement
  const renderEquipmentTooltip = () => {
    if (!hoveredEquipment) return null;
    
    return (
      <div className="equipment-tooltip">
        <h4 style={{ color: getRarityColor(hoveredEquipment.rarity) }}>
          {hoveredEquipment.icon} {hoveredEquipment.name}
        </h4>
        <span className="tooltip-rarity" style={{ color: getRarityColor(hoveredEquipment.rarity) }}>
          {hoveredEquipment.rarity.toUpperCase()}
        </span>
        <p className="tooltip-desc">{hoveredEquipment.description}</p>
        {hoveredEquipment.bonuses && (
          <div className="tooltip-bonuses">
            {hoveredEquipment.bonuses.strength && hoveredEquipment.bonuses.strength > 0 && (
              <span className="bonus">💪 +{hoveredEquipment.bonuses.strength} FOR</span>
            )}
            {hoveredEquipment.bonuses.dexterity && hoveredEquipment.bonuses.dexterity > 0 && (
              <span className="bonus">🎯 +{hoveredEquipment.bonuses.dexterity} DEX</span>
            )}
            {hoveredEquipment.bonuses.constitution && hoveredEquipment.bonuses.constitution > 0 && (
              <span className="bonus">❤️ +{hoveredEquipment.bonuses.constitution} CON</span>
            )}
            {hoveredEquipment.bonuses.intelligence && hoveredEquipment.bonuses.intelligence > 0 && (
              <span className="bonus">📖 +{hoveredEquipment.bonuses.intelligence} INT</span>
            )}
            {hoveredEquipment.bonuses.wisdom && hoveredEquipment.bonuses.wisdom > 0 && (
              <span className="bonus">🔮 +{hoveredEquipment.bonuses.wisdom} SAG</span>
            )}
            {hoveredEquipment.bonuses.charisma && hoveredEquipment.bonuses.charisma > 0 && (
              <span className="bonus">✨ +{hoveredEquipment.bonuses.charisma} CHA</span>
            )}
            {hoveredEquipment.bonuses.armorClass && hoveredEquipment.bonuses.armorClass > 0 && (
              <span className="bonus">🔰 +{hoveredEquipment.bonuses.armorClass} CA</span>
            )}
          </div>
        )}
        {hoveredEquipment.weaponCategory && (
          <span className="weapon-info">
            {hoveredEquipment.damage} {hoveredEquipment.damageType}
            {hoveredEquipment.twoHanded && ' (2 mains)'}
            {hoveredEquipment.finesse && ' (finesse)'}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="inventory-overlay" onClick={handleClose}>
      <div className="inventory-modal pathfinder-style" onClick={e => e.stopPropagation()}>
        {/* Modal de transfert d'objet */}
        {transferringItem && (
          <div className="transfer-overlay">
            <div className="transfer-modal">
              <h3>🔄 Transférer l'objet</h3>
              <div 
                className="transfer-item"
                style={{ borderColor: getRarityColor(transferringItem.rarity) }}
              >
                <span className="item-icon">{transferringItem.icon}</span>
                <span 
                  className="item-name"
                  style={{ color: getRarityColor(transferringItem.rarity) }}
                >
                  {transferringItem.name}
                </span>
              </div>
              
              <p className="transfer-label">Choisir le nouveau propriétaire :</p>
              
              <div className="transfer-targets">
                {team.filter(c => c.id !== currentCharacter.id).map(char => (
                  <button
                    key={char.id}
                    className="transfer-target-btn"
                    onClick={() => handleSelectNewOwner(char)}
                  >
                    <span className="target-portrait">{char.portrait}</span>
                    <div className="target-info">
                      <span className="target-name">{char.name}</span>
                      <span className="target-class">{char.class}</span>
                      <span className="target-items">
                        🎒 {char.inventory?.length || 0} objets
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              
              <button className="cancel-transfer-btn" onClick={cancelTransfer}>
                ❌ Annuler
              </button>
            </div>
          </div>
        )}

        {/* Header avec navigation */}
        <div className="inventory-header">
          <button className="nav-btn prev" onClick={handlePrev} disabled={team.length <= 1 || !!transferringItem}>
            ◀
          </button>
          
          <div className="character-display">
            <span className="char-portrait">{currentCharacter.portrait}</span>
            <div className="char-details">
              <h2>{currentCharacter.name}</h2>
              <span className="char-class">{currentCharacter.class} Niv. {currentCharacter.level}</span>
            </div>
          </div>
          
          <button className="nav-btn next" onClick={handleNext} disabled={team.length <= 1 || !!transferringItem}>
            ▶
          </button>
        </div>

        {/* Onglets de personnages */}
        <div className="character-tabs">
          {team.map((char, i) => (
            <button 
              key={char.id}
              className={`tab ${i === currentIndex ? 'active' : ''}`}
              onClick={() => !transferringItem && setCurrentIndex(i)}
              disabled={!!transferringItem}
            >
              {char.portrait}
            </button>
          ))}
        </div>

        {/* Tabs Équipement / Inventaire / Stats */}
        <div className="content-tabs">
          <button 
            className={`content-tab ${activeTab === 'equipment' ? 'active' : ''}`}
            onClick={() => setActiveTab('equipment')}
          >
            ⚔️ Équipement
          </button>
          <button 
            className={`content-tab ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            🎒 Inventaire ({inventory.length})
          </button>
          <button 
            className={`content-tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Statistiques
          </button>
        </div>

        {/* Contenu principal */}
        <div className="main-content">
          {activeTab === 'equipment' && (
            <div className="equipment-panel">
              {/* Zone gauche: Caractéristiques D&D */}
              <div className="abilities-panel">
                <h3>📜 Caractéristiques</h3>
                <div className="abilities-grid">
                  <div className="ability-score strength">
                    <span className="ability-name">FOR</span>
                    <span className="ability-value">{currentCharacter.abilities.strength}</span>
                    <span className="ability-mod">{getModifierString(currentCharacter.abilities.strength)}</span>
                  </div>
                  <div className="ability-score dexterity">
                    <span className="ability-name">DEX</span>
                    <span className="ability-value">{currentCharacter.abilities.dexterity}</span>
                    <span className="ability-mod">{getModifierString(currentCharacter.abilities.dexterity)}</span>
                  </div>
                  <div className="ability-score constitution">
                    <span className="ability-name">CON</span>
                    <span className="ability-value">{currentCharacter.abilities.constitution}</span>
                    <span className="ability-mod">{getModifierString(currentCharacter.abilities.constitution)}</span>
                  </div>
                  <div className="ability-score intelligence">
                    <span className="ability-name">INT</span>
                    <span className="ability-value">{currentCharacter.abilities.intelligence}</span>
                    <span className="ability-mod">{getModifierString(currentCharacter.abilities.intelligence)}</span>
                  </div>
                  <div className="ability-score wisdom">
                    <span className="ability-name">SAG</span>
                    <span className="ability-value">{currentCharacter.abilities.wisdom}</span>
                    <span className="ability-mod">{getModifierString(currentCharacter.abilities.wisdom)}</span>
                  </div>
                  <div className="ability-score charisma">
                    <span className="ability-name">CHA</span>
                    <span className="ability-value">{currentCharacter.abilities.charisma}</span>
                    <span className="ability-mod">{getModifierString(currentCharacter.abilities.charisma)}</span>
                  </div>
                </div>

                {/* Stats dérivées */}
                <div className="derived-stats">
                  <div className="derived-stat">
                    <span className="ds-label">CA</span>
                    <span className="ds-value">{currentCharacter.armorClass}</span>
                  </div>
                  <div className="derived-stat">
                    <span className="ds-label">PV</span>
                    <span className="ds-value">{currentCharacter.hp}/{currentCharacter.maxHp}</span>
                  </div>
                  <div className="derived-stat">
                    <span className="ds-label">Vitesse</span>
                    <span className="ds-value">{currentCharacter.speed}m</span>
                  </div>
                  <div className="derived-stat">
                    <span className="ds-label">Maîtrise</span>
                    <span className="ds-value">+{currentCharacter.proficiencyBonus}</span>
                  </div>
                </div>
              </div>

              {/* Zone centrale: Équipements style Paperdoll */}
              <div className="character-model-zone">
                <div className="equipment-paperdoll">
                  {/* Disposition autour du personnage invisible */}
                  <div className="paperdoll-container">
                    {/* Colonne gauche - Armes et accessoires gauche */}
                    <div className="paperdoll-column left">
                      {renderEquipmentSlot('mainHand')}
                      {renderEquipmentSlot('bracers')}
                      {renderEquipmentSlot('ring1')}
                    </div>
                    
                    {/* Colonne centrale - Corps */}
                    <div className="paperdoll-column center">
                      {renderEquipmentSlot('head')}
                      <div className="neck-row">
                        {renderEquipmentSlot('necklace')}
                        {renderEquipmentSlot('cloak')}
                      </div>
                      {renderEquipmentSlot('armor')}
                      <div className="waist-row">
                        {renderEquipmentSlot('gloves')}
                        {renderEquipmentSlot('belt')}
                      </div>
                      {renderEquipmentSlot('boots')}
                    </div>
                    
                    {/* Colonne droite - Armes et accessoires droite */}
                    <div className="paperdoll-column right">
                      {renderEquipmentSlot('offHand')}
                      {renderEquipmentSlot('ranged')}
                      {renderEquipmentSlot('ring2')}
                    </div>
                  </div>
                  
                  {/* Section Breloques */}
                  <div className="accessory-section">
                    <div className="accessory-title">🔮 Breloques</div>
                    <div className="accessory-slots trinkets-row">
                      {renderEquipmentSlot('trinket1')}
                      {renderEquipmentSlot('trinket2')}
                      {renderEquipmentSlot('trinket3')}
                      {renderEquipmentSlot('trinket4')}
                      {renderEquipmentSlot('trinket5')}
                    </div>
                  </div>
                  
                  {/* Section Consommables */}
                  <div className="accessory-section">
                    <div className="accessory-title">🧪 Consommables</div>
                    <div className="accessory-slots consumables-row">
                      {renderEquipmentSlot('consumable1')}
                      {renderEquipmentSlot('consumable2')}
                      {renderEquipmentSlot('consumable3')}
                    </div>
                  </div>
                </div>

                {/* Tooltip */}
                {renderEquipmentTooltip()}
              </div>

              {/* Zone droite: Stats de combat D&D */}
              <div className="combat-stats-panel">
                <h3>⚔️ Statistiques</h3>
                <div className="combat-stats-grid">
                  <div className="combat-stat armor-class">
                    <span className="cs-icon">🛡️</span>
                    <span className="cs-label">CA</span>
                    <span className="cs-value">{currentCharacter.armorClass || 10}</span>
                    {equipmentBonuses.armorClass && equipmentBonuses.armorClass > 0 && (
                      <span className="cs-bonus">(+{equipmentBonuses.armorClass})</span>
                    )}
                  </div>
                  <div className="combat-stat proficiency">
                    <span className="cs-icon">🎯</span>
                    <span className="cs-label">Maîtrise</span>
                    <span className="cs-value">+{currentCharacter.proficiencyBonus || 2}</span>
                  </div>
                  <div className="combat-stat initiative">
                    <span className="cs-icon">⚡</span>
                    <span className="cs-label">Initiative</span>
                    <span className="cs-value">{currentCharacter.initiative || 0}</span>
                  </div>
                  <div className="combat-stat hp">
                    <span className="cs-icon">❤️</span>
                    <span className="cs-label">PV Max</span>
                    <span className="cs-value">{currentCharacter.maxHp}</span>
                    {equipmentBonuses.maxHp && equipmentBonuses.maxHp > 0 && (
                      <span className="cs-bonus">(+{equipmentBonuses.maxHp})</span>
                    )}
                  </div>
                </div>

                {/* Compétences */}
                <h3 className="skills-title">📚 Compétences</h3>
                <div className="skills-list">
                  {currentCharacter.skills.map(skill => (
                    <div key={skill.id} className="skill-item">
                      <span className="skill-name">{skill.name}</span>
                      <span className={`skill-type ${skill.type}`}>
                        {skill.type === 'attack' && '⚔️'}
                        {skill.type === 'heal' && '💚'}
                        {skill.type === 'buff' && '⬆️'}
                        {skill.type === 'debuff' && '⬇️'}
                      </span>
                      {skill.cooldown && skill.cooldown > 0 && (
                        <span className="skill-cd">🕐 {skill.cooldown}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="inventory-content">
              <p className="transfer-hint">💡 Cliquez sur un objet pour le transférer</p>
              
              {inventory.length === 0 ? (
                <div className="empty-inventory">
                  <p>Aucun objet obtenu pour l'instant...</p>
                  <span className="empty-icon">📦</span>
                </div>
              ) : (
                <div className="inventory-grid">
                  {inventory.map((item, i) => (
                    <div 
                      key={`${item.id}-${i}`} 
                      className="inventory-item clickable"
                      style={{ borderColor: getRarityColor(item.rarity) }}
                      onClick={() => handleTransferItem(item)}
                    >
                      <div 
                        className="item-icon"
                        style={{ backgroundColor: `${getRarityColor(item.rarity)}20` }}
                      >
                        {item.icon}
                      </div>
                      <div className="item-info">
                        <span 
                          className="item-name"
                          style={{ color: getRarityColor(item.rarity) }}
                        >
                          {item.name}
                        </span>
                        <span className="item-rarity">{item.rarity}</span>
                        <p className="item-desc">{item.description}</p>
                        <span className="item-turn">Tour {item.obtainedAt}</span>
                      </div>
                      <span className="transfer-icon">🔄</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="stats-content">
              <div className="inventory-stats">
                <h3>📊 Statistiques de combat</h3>
                <div className="stats-grid">
                  <div className="stat-box damage">
                    <span className="stat-icon">⚔️</span>
                    <span className="stat-value">{currentCharacter.stats?.totalDamageDealt || 0}</span>
                    <span className="stat-label">Dégâts infligés</span>
                  </div>
                  <div className="stat-box taken">
                    <span className="stat-icon">💔</span>
                    <span className="stat-value">{currentCharacter.stats?.totalDamageTaken || 0}</span>
                    <span className="stat-label">Dégâts subis</span>
                  </div>
                  <div className="stat-box healing">
                    <span className="stat-icon">💚</span>
                    <span className="stat-value">{currentCharacter.stats?.totalHealingDone || 0}</span>
                    <span className="stat-label">Soins effectués</span>
                  </div>
                  <div className="stat-box kills">
                    <span className="stat-icon">💀</span>
                    <span className="stat-value">{currentCharacter.stats?.monstersKilled?.length || 0}</span>
                    <span className="stat-label">Monstres vaincus</span>
                  </div>
                </div>
                
                {currentCharacter.stats?.strongestMonsterKilled && (
                  <div className="strongest-monster">
                    <span className="label">Monstre le plus puissant vaincu :</span>
                    <div className="monster-badge">
                      <span className="monster-portrait">{currentCharacter.stats.strongestMonsterKilled.portrait}</span>
                      <span className="monster-name">{currentCharacter.stats.strongestMonsterKilled.name}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Jets de sauvegarde */}
              <div className="saving-throws-panel">
                <h3>🎲 Jets de sauvegarde</h3>
                <div className="saves-grid">
                  {(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const).map(ability => {
                    const isProficient = currentCharacter.savingThrowProficiencies?.includes(ability);
                    const mod = getModifier(currentCharacter.abilities[ability]);
                    const total = mod + (isProficient ? currentCharacter.proficiencyBonus : 0);
                    const labels: Record<string, string> = {
                      strength: 'FOR', dexterity: 'DEX', constitution: 'CON',
                      intelligence: 'INT', wisdom: 'SAG', charisma: 'CHA'
                    };
                    return (
                      <div key={ability} className={`save-item ${isProficient ? 'proficient' : ''}`}>
                        <span className="save-prof">{isProficient ? '●' : '○'}</span>
                        <span className="save-name">{labels[ability]}</span>
                        <span className="save-value">{total >= 0 ? '+' : ''}{total}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="inventory-footer">
          <span className="hint">⬅️ ➡️ Naviguer • I/Échap Fermer</span>
          <button className="close-btn" onClick={handleClose}>✕ Fermer</button>
        </div>
      </div>
    </div>
  );
}
