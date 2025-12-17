import { useState, useEffect } from 'react';
import { GameHistory } from '../types/game.types';
import { getGameHistory, clearGameHistory, formatDuration, formatDate } from '../lib/gameHistory';
import './GameHistoryModal.css';

interface GameHistoryModalProps {
  onClose: () => void;
}

export function GameHistoryModal({ onClose }: GameHistoryModalProps) {
  const [history, setHistory] = useState<GameHistory[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameHistory | null>(null);
  const [selectedCharIndex, setSelectedCharIndex] = useState<number>(0);

  useEffect(() => {
    setHistory(getGameHistory());
  }, []);

  const handleClearHistory = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer tout l\'historique ?')) {
      clearGameHistory();
      setHistory([]);
      setSelectedGame(null);
    }
  };

  const getResultLabel = (result: string) => {
    switch (result) {
      case 'victory': return { text: 'Victoire', icon: '🏆', color: '#f1c40f' };
      case 'defeat': return { text: 'Défaite', icon: '💀', color: '#e74c3c' };
      case 'abandoned': return { text: 'Abandonné', icon: '🏳️', color: '#95a5a6' };
      default: return { text: result, icon: '❓', color: '#fff' };
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#a0a0a0';
      case 'rare': return '#4a9eff';
      case 'epic': return '#a855f7';
      case 'legendary': return '#fbbf24';
      default: return '#fff';
    }
  };

  return (
    <div className="history-overlay" onClick={onClose}>
      <div className="history-modal" onClick={e => e.stopPropagation()}>
        <div className="history-header">
          <h2>📜 Historique des parties</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {history.length === 0 ? (
          <div className="history-empty">
            <span className="empty-icon">📭</span>
            <p>Aucune partie enregistrée</p>
            <p className="hint">Jouez votre première partie !</p>
          </div>
        ) : (
          <div className="history-content">
            <div className="history-list">
              {history.map(game => {
                const result = getResultLabel(game.result);
                return (
                  <div 
                    key={game.id}
                    className={`history-entry ${game.id === selectedGame?.id ? 'selected' : ''}`}
                    onClick={() => { setSelectedGame(game); setSelectedCharIndex(0); }}
                  >
                    <div className="entry-result" style={{ color: result.color }}>
                      <span className="result-icon">{result.icon}</span>
                      <span className="result-text">{result.text}</span>
                    </div>
                    <div className="entry-info">
                      <span className="entry-date">{formatDate(game.date)}</span>
                      <span className="entry-version">v{game.version}</span>
                      {game.dungeonLevel && game.dungeonLevel > 1 && (
                        <span className="entry-level">🏰 Niv.{game.dungeonLevel}</span>
                      )}
                    </div>
                    <div className="entry-stats">
                      <span>🚪 {game.roomsExplored} salles</span>
                      <span>⏱️ {formatDuration(game.duration)}</span>
                    </div>
                    <div className="entry-team">
                      {game.team.map((char, i) => (
                        <span key={i} className="team-portrait" title={char.name}>
                          {char.portrait}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedGame && (
              <div className="game-details">
                <h3>Détails de la partie</h3>
                
                <div className="details-header">
                  <div 
                    className="details-result"
                    style={{ color: getResultLabel(selectedGame.result).color }}
                  >
                    {getResultLabel(selectedGame.result).icon} {getResultLabel(selectedGame.result).text}
                  </div>
                  <div className="details-meta">
                    <span>{formatDate(selectedGame.date)}</span>
                    <span className="version-badge">v{selectedGame.version}</span>
                  </div>
                </div>

                <div className="details-stats">
                  <div className="stat-item">
                    <span className="stat-icon">🏰</span>
                    <span className="stat-value">{selectedGame.dungeonLevel || 1}</span>
                    <span className="stat-label">Niveau</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">🚪</span>
                    <span className="stat-value">{selectedGame.roomsExplored}</span>
                    <span className="stat-label">Salles</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">⏱️</span>
                    <span className="stat-value">{formatDuration(selectedGame.duration)}</span>
                    <span className="stat-label">Durée</span>
                  </div>
                  {selectedGame.bossDefeated && (
                    <div className="stat-item boss">
                      <span className="stat-icon">👑</span>
                      <span className="stat-value">{selectedGame.bossDefeated}</span>
                      <span className="stat-label">Boss vaincu</span>
                    </div>
                  )}
                </div>

                <h4>Équipe</h4>
                
                {/* Onglets pour sélectionner un personnage */}
                <div className="character-tabs">
                  {selectedGame.team.map((char, i) => (
                    <button 
                      key={i}
                      className={`char-tab ${i === selectedCharIndex ? 'active' : ''} ${char.finalHp <= 0 ? 'dead' : ''}`}
                      onClick={() => setSelectedCharIndex(i)}
                    >
                      <span className="tab-portrait">{char.portrait}</span>
                      <span className="tab-name">{char.name}</span>
                    </button>
                  ))}
                </div>

                {/* Détails du personnage sélectionné */}
                {selectedGame.team[selectedCharIndex] && (
                  <div className={`character-detail-card ${selectedGame.team[selectedCharIndex].finalHp <= 0 ? 'dead' : ''}`}>
                    <div className="char-header">
                      <span className="char-portrait-large">{selectedGame.team[selectedCharIndex].portrait}</span>
                      <div className="char-identity">
                        <span className="char-name-large">{selectedGame.team[selectedCharIndex].name}</span>
                        <span className="char-class-large">{selectedGame.team[selectedCharIndex].class}</span>
                        <div className="char-hp-bar">
                          <div 
                            className="hp-fill"
                            style={{ 
                              width: `${(selectedGame.team[selectedCharIndex].finalHp / selectedGame.team[selectedCharIndex].maxHp) * 100}%`,
                              background: selectedGame.team[selectedCharIndex].finalHp <= 0 ? '#444' : 
                                selectedGame.team[selectedCharIndex].finalHp < selectedGame.team[selectedCharIndex].maxHp * 0.3 ? '#c0392b' : '#27ae60'
                            }}
                          />
                          <span className="hp-text">
                            {selectedGame.team[selectedCharIndex].finalHp <= 0 ? '💀 Vaincu' : 
                              `❤️ ${selectedGame.team[selectedCharIndex].finalHp}/${selectedGame.team[selectedCharIndex].maxHp}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Statistiques du personnage */}
                    <div className="char-stats-section">
                      <h5>📊 Statistiques</h5>
                      <div className="stats-grid">
                        <div className="stat-box">
                          <span className="stat-icon">⚔️</span>
                          <span className="stat-val">{selectedGame.team[selectedCharIndex].attack || '?'}</span>
                          <span className="stat-lbl">Attaque</span>
                        </div>
                        <div className="stat-box">
                          <span className="stat-icon">✨</span>
                          <span className="stat-val">{selectedGame.team[selectedCharIndex].magicAttack || 0}</span>
                          <span className="stat-lbl">Att. Mag.</span>
                        </div>
                        <div className="stat-box">
                          <span className="stat-icon">🛡️</span>
                          <span className="stat-val">{selectedGame.team[selectedCharIndex].defense || '?'}</span>
                          <span className="stat-lbl">Défense</span>
                        </div>
                        <div className="stat-box">
                          <span className="stat-icon">🔮</span>
                          <span className="stat-val">{selectedGame.team[selectedCharIndex].magicDefense || 0}</span>
                          <span className="stat-lbl">Rés. Mag.</span>
                        </div>
                        <div className="stat-box">
                          <span className="stat-icon">💨</span>
                          <span className="stat-val">{selectedGame.team[selectedCharIndex].speed || '?'}</span>
                          <span className="stat-lbl">Vitesse</span>
                        </div>
                      </div>
                    </div>

                    {/* Performance en combat */}
                    <div className="char-performance-section">
                      <h5>⚔️ Performance</h5>
                      <div className="performance-grid">
                        <span title="Dégâts infligés">⚔️ {selectedGame.team[selectedCharIndex].damageDealt} dégâts</span>
                        <span title="Dégâts subis">💔 {selectedGame.team[selectedCharIndex].damageTaken} subis</span>
                        <span title="Soins prodigués">💚 {selectedGame.team[selectedCharIndex].healingDone} soins</span>
                        <span title="Monstres vaincus">💀 {selectedGame.team[selectedCharIndex].monstersKilled} kills</span>
                      </div>
                    </div>

                    {/* Monstre le plus puissant vaincu */}
                    {selectedGame.team[selectedCharIndex].strongestMonsterKilled && (
                      <div className="strongest-monster-section">
                        <h5>🏆 Monstre le plus puissant vaincu</h5>
                        <div className="monster-card">
                          <span className="monster-portrait">{selectedGame.team[selectedCharIndex].strongestMonsterKilled.portrait}</span>
                          <div className="monster-info">
                            <span className="monster-name">
                              {selectedGame.team[selectedCharIndex].strongestMonsterKilled.isBoss && '👑 '}
                              {selectedGame.team[selectedCharIndex].strongestMonsterKilled.name}
                            </span>
                            <span className="monster-stats">
                              ⚔️ {selectedGame.team[selectedCharIndex].strongestMonsterKilled.attack} | 
                              🛡️ {selectedGame.team[selectedCharIndex].strongestMonsterKilled.defense}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Inventaire */}
                    <div className="inventory-section">
                      <h5>🎒 Objets ({selectedGame.team[selectedCharIndex].inventory?.length || 0})</h5>
                      {selectedGame.team[selectedCharIndex].inventory && selectedGame.team[selectedCharIndex].inventory.length > 0 ? (
                        <div className="inventory-grid">
                          {selectedGame.team[selectedCharIndex].inventory.map((item, idx) => (
                            <div 
                              key={idx} 
                              className="inventory-item"
                              style={{ borderColor: getRarityColor(item.rarity) }}
                              title={item.name}
                            >
                              <span className="item-icon">{item.icon}</span>
                              <span className="item-name" style={{ color: getRarityColor(item.rarity) }}>
                                {item.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="no-items">Aucun objet</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {history.length > 0 && (
          <div className="history-footer">
            <span className="history-count">{history.length} partie(s) enregistrée(s)</span>
            <button className="clear-btn" onClick={handleClearHistory}>
              🗑️ Effacer l'historique
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


