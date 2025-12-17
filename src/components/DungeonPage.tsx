import { useEffect, useState } from 'react';
import { gameStore } from '../store/gameStore';
import { GameState, HistoryEntry, Character } from '../types/game.types';
import { TreasureModal } from './TreasureModal';
import { allTreasures, getRarityColor, Treasure } from '../data/treasures';
import './DungeonPage.css';

export function DungeonPage() {
  const [state, setState] = useState<GameState>(gameStore.getState());
  const [hoveredEntry, setHoveredEntry] = useState<HistoryEntry | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    return gameStore.subscribe(() => setState(gameStore.getState()));
  }, []);

  const adjacentRooms = gameStore.getAdjacentRooms();
  const { team, currentRoom, rooms, encounterCount, history, pendingTreasures } = state;

  // Calcul dynamique de la couleur de la barre de vie
  const getHpBarColor = (currentHp: number, maxHp: number): string => {
    const percentage = (currentHp / maxHp) * 100;
    if (percentage <= 0) return '#1a1a1a'; // Noir
    if (percentage <= 33) return '#c0392b'; // Rouge
    if (percentage <= 66) return '#f39c12'; // Jaune/Orange
    return '#27ae60'; // Vert
  };

  // Calcul des modifications de stats pour le tooltip
  const getStatModifiers = (entity: Character) => {
    const mods: { stat: string; base: number; current: number; diff: number }[] = [];
    
    // Utiliser baseStats si disponibles, sinon utiliser les stats actuelles comme base
    const baseAttack = entity.baseAttack !== undefined ? entity.baseAttack : entity.attack;
    const baseMagicAttack = entity.baseMagicAttack !== undefined ? entity.baseMagicAttack : (entity.magicAttack || 0);
    const baseDefense = entity.baseDefense !== undefined ? entity.baseDefense : entity.defense;
    const baseMagicDefense = entity.baseMagicDefense !== undefined ? entity.baseMagicDefense : entity.magicDefense;
    const baseSpeed = entity.baseSpeed !== undefined ? entity.baseSpeed : entity.speed;
    
    mods.push({ stat: 'Attaque', base: baseAttack, current: entity.attack, diff: entity.attack - baseAttack });
    mods.push({ stat: 'Att. Magique', base: baseMagicAttack, current: entity.magicAttack || 0, diff: (entity.magicAttack || 0) - baseMagicAttack });
    mods.push({ stat: 'Défense', base: baseDefense, current: entity.defense, diff: entity.defense - baseDefense });
    mods.push({ stat: 'Déf. Magique', base: baseMagicDefense, current: entity.magicDefense, diff: entity.magicDefense - baseMagicDefense });
    mods.push({ stat: 'Vitesse', base: baseSpeed, current: entity.speed, diff: entity.speed - baseSpeed });
    
    return mods;
  };

  // Rendu du tooltip de stats
  const renderStatsTooltip = (character: Character) => {
    const mods = getStatModifiers(character);
    const hasModifiers = mods.some(m => m.diff !== 0);
    
    return (
      <div className="stats-tooltip">
        <div className="tooltip-header">📊 Statistiques détaillées</div>
        {mods.map((m, i) => (
          <div key={i} className={`stat-line ${m.diff > 0 ? 'buff' : m.diff < 0 ? 'debuff' : ''}`}>
            <span className="stat-name">{m.stat}</span>
            <span className="stat-values">
              <span className="base-value">{m.base}</span>
              {m.diff !== 0 && (
                <>
                  <span className="arrow">→</span>
                  <span className="current-value">{m.current}</span>
                  <span className={`diff ${m.diff > 0 ? 'positive' : 'negative'}`}>
                    ({m.diff > 0 ? '+' : ''}{m.diff})
                  </span>
                </>
              )}
            </span>
          </div>
        ))}
        {hasModifiers && character.buffs && character.buffs.length > 0 && (
          <div className="active-effects">
            <div className="effects-header">Effets actifs:</div>
            {character.buffs.map((buff, i) => (
              <span key={i} className="effect-badge" title={`${buff.value} pendant ${buff.turnsRemaining} tours`}>
                {buff.icon} {buff.type} {buff.turnsRemaining}t
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleMoveToRoom = (x: number, y: number) => {
    gameStore.moveToRoom(x, y);
  };

  const handleMouseEnter = (entry: HistoryEntry, e: React.MouseEvent) => {
    if (entry.type === 'treasure' && entry.treasureId) {
      setHoveredEntry(entry);
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredEntry(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoveredEntry) {
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }
  };

  // Récupérer le trésor en attente
  const pendingTreasure: Treasure | null = pendingTreasures && pendingTreasures.length > 0
    ? allTreasures.find(t => t.id === pendingTreasures[0].treasureId) || null
    : null;

  const handleTreasureClose = (selectedCharacter: Character, effects: string[]) => {
    gameStore.finalizeTreasure(selectedCharacter, effects);
  };

  // Calculer la vue du plateau (zone visible autour du joueur)
  const viewSize = 9;
  const halfView = Math.floor(viewSize / 2);
  
  const getVisibleRooms = () => {
    const visible = [];
    for (let dy = -halfView; dy <= halfView; dy++) {
      const row = [];
      for (let dx = -halfView; dx <= halfView; dx++) {
        const x = currentRoom.x + dx;
        const y = currentRoom.y + dy;
        if (x >= 0 && x < 20 && y >= 0 && y < 20) {
          row.push({ ...rooms[y][x], x, y });
        } else {
          row.push(null);
        }
      }
      visible.push(row);
    }
    return visible;
  };

  const visibleRooms = getVisibleRooms();

  const isAdjacent = (x: number, y: number) => {
    return adjacentRooms.some(r => r.x === x && r.y === y);
  };

  const getRoomDisplay = (room: any) => {
    if (!room) return { icon: '', className: 'void' };
    if (room.x === currentRoom.x && room.y === currentRoom.y) {
      return { icon: '👥', className: 'current' };
    }
    if (room.visited) {
      switch (room.type) {
        case 'start': return { icon: '🏠', className: 'start' };
        case 'combat': return { icon: '⚔️', className: 'combat' };
        case 'event': return { icon: '❓', className: 'event' };
        case 'treasure': return { icon: '💎', className: 'treasure' };
        case 'boss': return { icon: '👑', className: 'boss' };
        default: return { icon: '·', className: 'visited' };
      }
    }
    if (isAdjacent(room.x, room.y)) {
      return { icon: '?', className: 'adjacent' };
    }
    return { icon: '·', className: 'unknown' };
  };

  // Obtenir les infos d'un trésor
  const getTreasureDetails = (treasureId: string) => {
    return allTreasures.find(t => t.id === treasureId);
  };

  return (
    <div className="dungeon-page">
      {/* Modal de trésor avec sélection de personnage */}
      {pendingTreasure && (
        <TreasureModal
          treasure={pendingTreasure}
          team={team}
          onClose={handleTreasureClose}
        />
      )}

      {/* Tooltip pour les trésors */}
      {hoveredEntry && hoveredEntry.treasureId && (
        <div 
          className="treasure-tooltip"
          style={{
            left: tooltipPos.x + 15,
            top: tooltipPos.y - 10
          }}
        >
          {(() => {
            const treasure = getTreasureDetails(hoveredEntry.treasureId);
            if (!treasure) return null;
            return (
              <>
                <div className="tooltip-header" style={{ borderColor: getRarityColor(treasure.rarity) }}>
                  <span className="tooltip-icon">{treasure.icon}</span>
                  <span className="tooltip-name" style={{ color: getRarityColor(treasure.rarity) }}>
                    {treasure.name}
                  </span>
                </div>
                <div className="tooltip-rarity" style={{ color: getRarityColor(treasure.rarity) }}>
                  {treasure.rarity === 'common' ? 'Commun' :
                   treasure.rarity === 'rare' ? 'Rare' :
                   treasure.rarity === 'epic' ? 'Épique' : 'Légendaire'}
                </div>
                <div className="tooltip-desc">{treasure.description}</div>
                {hoveredEntry.assignedTo && (
                  <div className="tooltip-assigned">
                    Attribué à : <strong>{hoveredEntry.assignedTo}</strong>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      <div className="dungeon-header">
        <h2>🏰 Exploration du Donjon</h2>
        <div className="encounter-counter">
          <span className="counter-label">Salles explorées :</span>
          <span className="counter-value">{encounterCount}/9</span>
          {encounterCount >= 9 && <span className="boss-warning">⚠️ Prochaine salle : BOSS !</span>}
        </div>
      </div>

      <div className="dungeon-layout">
        {/* Panel équipe */}
        <div className="team-panel">
          <h3>👥 Équipe</h3>
          {team.map(character => (
            <div key={character.id} className={`team-member ${character.hp <= 0 ? 'dead' : ''}`}>
              <span className="member-portrait">{character.portrait}</span>
              <div className="member-info">
                <span className="member-name">{character.name}</span>
                <span className="member-class">{character.class}</span>
                <div className="hp-bar">
                  <div 
                    className="hp-fill" 
                    style={{ 
                      width: `${Math.max(0, (character.hp / character.maxHp) * 100)}%`,
                      background: getHpBarColor(character.hp, character.maxHp)
                    }}
                  ></div>
                  <span className="hp-text">{Math.max(0, character.hp)}/{character.maxHp}</span>
                </div>
                <div className="member-all-stats stats-with-tooltip">
                  <span>⚔️{character.attack}</span>
                  <span>✨{character.magicAttack || 0}</span>
                  <span>🛡️{character.defense}</span>
                  <span>🔮{character.magicDefense}</span>
                  <span>💨{character.speed}</span>
                  {renderStatsTooltip(character)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carte du donjon */}
        <div className="dungeon-map-container">
          <div className="dungeon-map">
            <div className="map-grid">
              {visibleRooms.map((row, rowIndex) => (
                <div key={rowIndex} className="map-row">
                  {row.map((room, colIndex) => {
                    const display = getRoomDisplay(room);
                    const canMove = room && isAdjacent(room.x, room.y);
                    
                    return (
                      <div
                        key={colIndex}
                        className={`map-cell ${display.className} ${canMove ? 'clickable' : ''}`}
                        onClick={() => canMove && handleMoveToRoom(room!.x, room!.y)}
                        title={canMove ? 'Cliquez pour explorer' : ''}
                      >
                        {display.icon}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="map-actions">
            <h4>Directions disponibles</h4>
            <div className="direction-buttons">
              {adjacentRooms.length > 0 ? (
                adjacentRooms.map((room, i) => (
                  <button
                    key={i}
                    className="direction-btn"
                    onClick={() => handleMoveToRoom(room.x, room.y)}
                  >
                    {room.y < currentRoom.y ? '⬆️ Nord' : 
                     room.y > currentRoom.y ? '⬇️ Sud' :
                     room.x < currentRoom.x ? '⬅️ Ouest' : '➡️ Est'}
                  </button>
                ))
              ) : (
                <p className="no-directions">Aucune direction disponible</p>
              )}
            </div>
          </div>
        </div>

        {/* Historique */}
        <div className="history-panel">
          <h3>📜 Historique</h3>
          <div className="history-list">
            {history.length === 0 ? (
              <p className="history-empty">L'aventure commence...</p>
            ) : (
              [...history].reverse().map((entry, i) => (
                <div 
                  key={i} 
                  className={`history-entry ${entry.type} ${entry.isPositive ? 'positive' : 'negative'} ${entry.treasureId ? 'has-tooltip' : ''}`}
                  onMouseEnter={(e) => handleMouseEnter(entry, e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                  style={entry.treasureRarity ? { borderLeftColor: getRarityColor(entry.treasureRarity) } : {}}
                >
                  <div className="entry-header">
                    <span className="entry-icon">{entry.icon}</span>
                    <span className="entry-turn">Tour {entry.turn}</span>
                  </div>
                  <div className="entry-content">
                    <span className="entry-title">{entry.title}</span>
                    {entry.assignedTo && (
                      <span className="entry-assigned">→ {entry.assignedTo}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
