import { useEffect, useState, useCallback } from 'react';
import { gameStore } from '../store/gameStore';
import { Character, InventoryItem } from '../types/game.types';
import './InventoryModal.css';

export function InventoryModal() {
  const [state, setState] = useState(gameStore.getState());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transferringItem, setTransferringItem] = useState<InventoryItem | null>(null);
  
  useEffect(() => {
    return gameStore.subscribe(() => setState(gameStore.getState()));
  }, []);

  const { team, showInventory } = state;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!showInventory) return;
    
    if (e.key === 'i' || e.key === 'I' || e.key === 'Escape') {
      if (transferringItem) {
        setTransferringItem(null);
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
  }, [showInventory, team.length, transferringItem]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!showInventory || team.length === 0) return null;

  const currentCharacter = team[currentIndex];
  const inventory = currentCharacter.inventory || [];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#a0a0a0';
      case 'rare': return '#4a9eff';
      case 'epic': return '#a855f7';
      case 'legendary': return '#fbbf24';
      default: return '#a0a0a0';
    }
  };

  const handleClose = () => {
    setTransferringItem(null);
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
    
    // Retirer l'objet du propriétaire actuel
    const currentOwnerIndex = currentIndex;
    if (updatedTeam[currentOwnerIndex].inventory) {
      updatedTeam[currentOwnerIndex].inventory = updatedTeam[currentOwnerIndex].inventory!.filter(
        i => i.id !== transferringItem.id || i.obtainedAt !== transferringItem.obtainedAt
      );
    }
    
    // Ajouter l'objet au nouveau propriétaire
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
  };

  return (
    <div className="inventory-overlay" onClick={handleClose}>
      <div className="inventory-modal" onClick={e => e.stopPropagation()}>
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

        <div className="inventory-header">
          <button className="nav-btn prev" onClick={handlePrev} disabled={team.length <= 1 || !!transferringItem}>
            ◀
          </button>
          
          <div className="character-display">
            <span className="char-portrait">{currentCharacter.portrait}</span>
            <div className="char-details">
              <h2>{currentCharacter.name}</h2>
              <span className="char-class">{currentCharacter.class}</span>
            </div>
          </div>
          
          <button className="nav-btn next" onClick={handleNext} disabled={team.length <= 1 || !!transferringItem}>
            ▶
          </button>
        </div>

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

        <div className="inventory-content">
          <h3>🎒 Inventaire ({inventory.length} objets)</h3>
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

        <div className="inventory-footer">
          <span className="hint">⬅️ ➡️ Naviguer • I/Échap Fermer</span>
          <button className="close-btn" onClick={handleClose}>✕ Fermer</button>
        </div>
      </div>
    </div>
  );
}
