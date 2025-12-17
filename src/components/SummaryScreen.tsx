import { useEffect, useState, useRef } from 'react';
import { gameStore } from '../store/gameStore';
import { GameState } from '../types/game.types';
import { saveGameToHistory } from '../lib/gameHistory';
import './SummaryScreen.css';

export function SummaryScreen() {
  const [state, setState] = useState<GameState>(gameStore.getState());
  const [selectedTab, setSelectedTab] = useState(0);
  const historySaved = useRef(false);
  
  useEffect(() => {
    return gameStore.subscribe(() => setState(gameStore.getState()));
  }, []);

  const { team, encounterCount, history, combatLog, dungeonLevel } = state;
  
  // Déterminer si c'est une victoire ou une défaite
  const isVictory = combatLog.some(log => log.includes('VICTOIRE'));
  
  // Sauvegarder l'historique une seule fois
  useEffect(() => {
    if (!historySaved.current && team.length > 0) {
      historySaved.current = true;
      const bossKilled = history.find(h => h.type === 'boss' && h.title.includes('vaincu'));
      saveGameToHistory(
        isVictory ? 'victory' : 'defeat',
        team,
        encounterCount,
        bossKilled ? bossKilled.title.replace('Combat contre ', '').replace(' vaincu', '') : undefined,
        undefined, // startTime
        dungeonLevel // Niveau actuel du donjon
      );
    }
  }, [team, encounterCount, isVictory, history, dungeonLevel]);
  
  // Calculer les totaux de l'équipe
  const teamStats = {
    totalDamage: team.reduce((sum, c) => sum + (c.stats?.totalDamageDealt || 0), 0),
    totalTaken: team.reduce((sum, c) => sum + (c.stats?.totalDamageTaken || 0), 0),
    totalHealing: team.reduce((sum, c) => sum + (c.stats?.totalHealingDone || 0), 0),
    totalKills: team.reduce((sum, c) => sum + (c.stats?.monstersKilled?.length || 0), 0),
    totalItems: team.reduce((sum, c) => sum + (c.inventory?.length || 0), 0)
  };

  const handleReturnToMenu = () => {
    gameStore.resetGame();
  };

  const handleNextLevel = () => {
    gameStore.advanceToNextLevel();
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#a0a0a0';
      case 'rare': return '#4a9eff';
      case 'epic': return '#a855f7';
      case 'legendary': return '#fbbf24';
      default: return '#a0a0a0';
    }
  };

  return (
    <div className={`summary-screen ${isVictory ? 'victory' : 'defeat'}`}>
      <div className="summary-header">
        <h1>{isVictory ? '🏆 VICTOIRE !' : '💀 DÉFAITE...'}</h1>
        <p className="subtitle">
          {isVictory 
            ? `Vous avez vaincu le boss du Niveau ${dungeonLevel} !` 
            : 'Votre équipe a succombé dans les profondeurs...'}
        </p>
        <div className="adventure-info">
          <span>🏰 Niveau : {dungeonLevel}</span>
          <span>🚪 Salles explorées : {encounterCount}</span>
          <span>⚔️ Combats : {history.filter(h => h.type === 'combat' || h.type === 'boss').length}</span>
          <span>💎 Trésors : {history.filter(h => h.type === 'treasure').length}</span>
        </div>
      </div>

      <div className="summary-tabs">
        {team.map((char, i) => (
          <button 
            key={char.id}
            className={`summary-tab ${i === selectedTab ? 'active' : ''} ${char.hp <= 0 ? 'dead' : ''}`}
            onClick={() => setSelectedTab(i)}
          >
            <span className="tab-portrait">{char.portrait}</span>
            <span className="tab-name">{char.name}</span>
          </button>
        ))}
      </div>

      <div className="summary-content">
        {(() => {
          const char = team[selectedTab];
          if (!char) return null;

          return (
            <div className="character-summary">
              <div className="char-header">
                <span className="char-portrait">{char.portrait}</span>
                <div className="char-info">
                  <h2>{char.name}</h2>
                  <span className="char-class">{char.class}</span>
                  <div className={`status ${char.hp > 0 ? 'alive' : 'dead'}`}>
                    {char.hp > 0 ? '✅ Survivant' : '💀 Tombé au combat'}
                  </div>
                  <div className="final-hp">
                    ❤️ {Math.max(0, char.hp)} / {char.maxHp}
                  </div>
                </div>
              </div>

              <div className="stats-section">
                <h3>📊 Statistiques de combat</h3>
                <div className="stats-row">
                  <div className="stat-card damage">
                    <span className="stat-icon">⚔️</span>
                    <span className="stat-value">{char.stats?.totalDamageDealt || 0}</span>
                    <span className="stat-label">Dégâts infligés</span>
                  </div>
                  <div className="stat-card taken">
                    <span className="stat-icon">💔</span>
                    <span className="stat-value">{char.stats?.totalDamageTaken || 0}</span>
                    <span className="stat-label">Dégâts subis</span>
                  </div>
                  <div className="stat-card healing">
                    <span className="stat-icon">💚</span>
                    <span className="stat-value">{char.stats?.totalHealingDone || 0}</span>
                    <span className="stat-label">Soins effectués</span>
                  </div>
                </div>
              </div>

              <div className="monsters-section">
                <h3>💀 Monstres vaincus ({char.stats?.monstersKilled?.length || 0})</h3>
                {char.stats?.monstersKilled && char.stats.monstersKilled.length > 0 ? (
                  <div className="monsters-list">
                    {char.stats.monstersKilled.map((monster, i) => (
                      <div key={i} className={`monster-killed ${monster.isBoss ? 'boss' : ''}`}>
                        <span className="monster-portrait">{monster.portrait}</span>
                        <span className="monster-name">{monster.name}</span>
                        {monster.isBoss && <span className="boss-badge">BOSS</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-kills">Aucun monstre vaincu</p>
                )}
                
                {char.stats?.strongestMonsterKilled && (
                  <div className="strongest-killed">
                    <span className="label">🏆 Plus puissant vaincu :</span>
                    <div className="monster-badge">
                      <span>{char.stats.strongestMonsterKilled.portrait}</span>
                      <span>{char.stats.strongestMonsterKilled.name}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="inventory-section">
                <h3>🎒 Objets obtenus ({char.inventory?.length || 0})</h3>
                {char.inventory && char.inventory.length > 0 ? (
                  <div className="items-list">
                    {char.inventory.map((item, i) => (
                      <div 
                        key={i} 
                        className="item-obtained"
                        style={{ borderColor: getRarityColor(item.rarity) }}
                      >
                        <span className="item-icon">{item.icon}</span>
                        <div className="item-details">
                          <span 
                            className="item-name"
                            style={{ color: getRarityColor(item.rarity) }}
                          >
                            {item.name}
                          </span>
                          <span className="item-rarity">{item.rarity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-items">Aucun objet obtenu</p>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      <div className="team-totals">
        <h3>📈 Totaux de l'équipe</h3>
        <div className="totals-grid">
          <div className="total-item">
            <span className="total-icon">⚔️</span>
            <span className="total-value">{teamStats.totalDamage}</span>
            <span className="total-label">Dégâts totaux</span>
          </div>
          <div className="total-item">
            <span className="total-icon">💔</span>
            <span className="total-value">{teamStats.totalTaken}</span>
            <span className="total-label">Dégâts subis</span>
          </div>
          <div className="total-item">
            <span className="total-icon">💚</span>
            <span className="total-value">{teamStats.totalHealing}</span>
            <span className="total-label">Soins totaux</span>
          </div>
          <div className="total-item">
            <span className="total-icon">💀</span>
            <span className="total-value">{teamStats.totalKills}</span>
            <span className="total-label">Monstres vaincus</span>
          </div>
          <div className="total-item">
            <span className="total-icon">💎</span>
            <span className="total-value">{teamStats.totalItems}</span>
            <span className="total-label">Objets obtenus</span>
          </div>
        </div>
      </div>

      <div className="summary-buttons">
        {isVictory && (
          <button className="next-level-btn" onClick={handleNextLevel}>
            ⬆️ Niveau {dungeonLevel + 1}
            <span className="next-level-info">
              Monstres +{(dungeonLevel) * 50}% | Boss +{(dungeonLevel) * 75}%
            </span>
          </button>
        )}
        <button className="return-btn" onClick={handleReturnToMenu}>
          🏠 Retour au menu principal
        </button>
      </div>
    </div>
  );
}

