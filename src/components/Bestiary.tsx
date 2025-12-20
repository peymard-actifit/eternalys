import { useState, useEffect } from 'react';
import { Monster, CreatureType } from '../types/game.types';
import { ALL_MONSTERS, MONSTERS_BY_CR, getMonstersByType } from '../data/monsters';
import './Bestiary.css';

interface BestiaryProps {
  isOpen: boolean;
  onClose: () => void;
}

// Labels en français pour les types de créatures
const CREATURE_TYPE_LABELS: Record<CreatureType, string> = {
  aberration: 'Aberration',
  beast: 'Bête',
  celestial: 'Céleste',
  construct: 'Artificiel',
  dragon: 'Dragon',
  elemental: 'Élémentaire',
  fey: 'Fée',
  fiend: 'Fiélon',
  giant: 'Géant',
  humanoid: 'Humanoïde',
  monstrosity: 'Monstruosité',
  ooze: 'Vase',
  plant: 'Plante',
  undead: 'Mort-vivant'
};

// Icônes pour les types de créatures
const CREATURE_TYPE_ICONS: Record<CreatureType, string> = {
  aberration: '🦑',
  beast: '🐺',
  celestial: '👼',
  construct: '🤖',
  dragon: '🐉',
  elemental: '🌪️',
  fey: '🧚',
  fiend: '😈',
  giant: '🗿',
  humanoid: '🧝',
  monstrosity: '👹',
  ooze: '🫧',
  plant: '🌿',
  undead: '💀'
};

// Couleurs pour les CR
const getCRColor = (cr: number): string => {
  if (cr >= 20) return '#ff4444'; // Rouge vif
  if (cr >= 15) return '#ff8844'; // Orange
  if (cr >= 10) return '#ffaa00'; // Or
  if (cr >= 5) return '#aa44ff'; // Violet
  if (cr >= 2) return '#4488ff'; // Bleu
  if (cr >= 1) return '#44aa44'; // Vert
  return '#888888'; // Gris
};

// Formater le CR pour l'affichage
const formatCR = (cr: number): string => {
  if (cr === 0.125) return '1/8';
  if (cr === 0.25) return '1/4';
  if (cr === 0.5) return '1/2';
  return cr.toString();
};

// Types de tri
type SortMode = 'type' | 'cr' | 'name';
type FilterMode = CreatureType | 'all' | 'hostileNpc' | 'boss';
type DangerLevel = 'all' | 'local' | 'community' | 'regional' | 'continental' | 'global' | 'planar' | 'cosmic' | 'divine';

// Paliers de dangerosité CR (basé sur dndSystem.ts)
const DANGER_LEVELS: Record<DangerLevel, { min: number; max: number; name: string; icon: string }> = {
  all: { min: 0, max: 100, name: 'Tous', icon: '🌐' },
  local: { min: 1, max: 5, name: 'Locale', icon: '🏠' },
  community: { min: 6, max: 15, name: 'Communauté', icon: '🏘️' },
  regional: { min: 16, max: 30, name: 'Régionale', icon: '🏰' },
  continental: { min: 31, max: 50, name: 'Continentale', icon: '🌍' },
  global: { min: 51, max: 70, name: 'Mondiale', icon: '🌐' },
  planar: { min: 71, max: 85, name: 'Planaire', icon: '✨' },
  cosmic: { min: 86, max: 95, name: 'Cosmique', icon: '🌌' },
  divine: { min: 96, max: 100, name: 'Divine', icon: '⚡' }
};

export function Bestiary({ isOpen, onClose }: BestiaryProps) {
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('type');
  const [filterType, setFilterType] = useState<FilterMode>('all');
  const [dangerFilter, setDangerFilter] = useState<DangerLevel>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fermer avec Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'b' || e.key === 'B') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filtrer les monstres
  let filteredMonsters = [...ALL_MONSTERS];
  
  // Filtre par type de créature
  if (filterType === 'hostileNpc') {
    filteredMonsters = filteredMonsters.filter(m => m.isHostileNpc === true);
  } else if (filterType === 'boss') {
    filteredMonsters = filteredMonsters.filter(m => m.isBoss === true);
  } else if (filterType !== 'all') {
    filteredMonsters = filteredMonsters.filter(m => m.creatureType === filterType);
  }
  
  // Filtre par niveau de dangerosité (CR)
  if (dangerFilter !== 'all') {
    const { min, max } = DANGER_LEVELS[dangerFilter];
    filteredMonsters = filteredMonsters.filter(m => {
      const cr = m.challengeRating || 0;
      return cr >= min && cr <= max;
    });
  }
  
  // Filtre par recherche textuelle
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredMonsters = filteredMonsters.filter(m => 
      m.name.toLowerCase().includes(term) || 
      m.description?.toLowerCase().includes(term)
    );
  }

  // Trier les monstres
  const sortedMonsters = [...filteredMonsters].sort((a, b) => {
    switch (sortMode) {
      case 'type':
        if (a.creatureType !== b.creatureType) {
          return a.creatureType.localeCompare(b.creatureType);
        }
        return (a.challengeRating || 0) - (b.challengeRating || 0);
      case 'cr':
        if ((a.challengeRating || 0) !== (b.challengeRating || 0)) {
          return (a.challengeRating || 0) - (b.challengeRating || 0);
        }
        return a.name.localeCompare(b.name);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Grouper les monstres selon le mode de tri
  const groupedMonsters: { [key: string]: Monster[] } = {};
  
  sortedMonsters.forEach(monster => {
    let key: string;
    
    if (sortMode === 'type') {
      key = monster.creatureType;
    } else if (sortMode === 'cr') {
      key = `CR ${formatCR(monster.challengeRating || 0)}`;
    } else {
      // Par nom - première lettre
      key = monster.name[0].toUpperCase();
    }
    
    if (!groupedMonsters[key]) {
      groupedMonsters[key] = [];
    }
    groupedMonsters[key].push(monster);
  });

  // Obtenir les types de créatures présents
  const creatureTypes = Object.keys(CREATURE_TYPE_LABELS) as CreatureType[];

  return (
    <div className="bestiary-overlay" onClick={onClose}>
      <div className="bestiary-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bestiary-header">
          <h2>📖 Bestiaire</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bestiary-controls">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher un monstre..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="sort-controls">
            <span className="sort-label">Trier par:</span>
            <button 
              className={`sort-btn ${sortMode === 'type' ? 'active' : ''}`}
              onClick={() => setSortMode('type')}
            >
              Type
            </button>
            <button 
              className={`sort-btn ${sortMode === 'cr' ? 'active' : ''}`}
              onClick={() => setSortMode('cr')}
            >
              CR
            </button>
            <button 
              className={`sort-btn ${sortMode === 'name' ? 'active' : ''}`}
              onClick={() => setSortMode('name')}
            >
              Nom
            </button>
          </div>
        </div>

        {/* Filtres par niveau de dangerosité */}
        <div className="danger-filters">
          <span className="filter-label">⚠️ Dangerosité:</span>
          {(Object.keys(DANGER_LEVELS) as DangerLevel[]).map(level => {
            const { name, icon, min, max } = DANGER_LEVELS[level];
            const count = level === 'all' 
              ? ALL_MONSTERS.length 
              : ALL_MONSTERS.filter(m => (m.challengeRating || 0) >= min && (m.challengeRating || 0) <= max).length;
            if (count === 0 && level !== 'all') return null;
            return (
              <button 
                key={level}
                className={`danger-filter-btn ${dangerFilter === level ? 'active' : ''}`}
                onClick={() => setDangerFilter(level)}
                title={level === 'all' ? 'Tous les niveaux' : `CR ${min}-${max}`}
              >
                {icon} {name} {level !== 'all' && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* Filtres par type */}
        <div className="type-filters">
          <button 
            className={`type-filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            Tous ({ALL_MONSTERS.length})
          </button>
          <button 
            className={`type-filter-btn special ${filterType === 'hostileNpc' ? 'active' : ''}`}
            onClick={() => setFilterType('hostileNpc')}
            title="Personnages hostiles nommés"
          >
            👿 PNJ ({ALL_MONSTERS.filter(m => m.isHostileNpc).length})
          </button>
          <button 
            className={`type-filter-btn special ${filterType === 'boss' ? 'active' : ''}`}
            onClick={() => setFilterType('boss')}
            title="Boss"
          >
            💀 Boss ({ALL_MONSTERS.filter(m => m.isBoss).length})
          </button>
          {creatureTypes.map(type => {
            const count = ALL_MONSTERS.filter(m => m.creatureType === type).length;
            if (count === 0) return null;
            return (
              <button 
                key={type}
                className={`type-filter-btn ${filterType === type ? 'active' : ''}`}
                onClick={() => setFilterType(type)}
                title={CREATURE_TYPE_LABELS[type]}
              >
                {CREATURE_TYPE_ICONS[type]} {count}
              </button>
            );
          })}
        </div>

        {/* Contenu principal */}
        <div className="bestiary-content">
          {/* Liste des monstres */}
          <div className="monster-list">
            {Object.entries(groupedMonsters).map(([groupKey, monsters]) => (
              <div key={groupKey} className="monster-group">
                <h3 className="group-header">
                  {sortMode === 'type' && CREATURE_TYPE_ICONS[groupKey as CreatureType]}
                  {sortMode === 'type' ? CREATURE_TYPE_LABELS[groupKey as CreatureType] : groupKey}
                  <span className="group-count">({monsters.length})</span>
                </h3>
                <div className="monster-cards">
                  {monsters.map(monster => (
                    <div 
                      key={monster.id}
                      className={`monster-card ${selectedMonster?.id === monster.id ? 'selected' : ''} ${monster.isBoss ? 'boss' : ''}`}
                      onClick={() => setSelectedMonster(monster)}
                    >
                      <span className="monster-portrait">{monster.portrait}</span>
                      <div className="monster-info">
                        <span className="monster-name">{monster.name}</span>
                        <span 
                          className="monster-cr"
                          style={{ color: getCRColor(monster.challengeRating || 0) }}
                        >
                          CR {formatCR(monster.challengeRating || 0)}
                        </span>
                      </div>
                      {monster.isBoss && <span className="boss-badge">BOSS</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {sortedMonsters.length === 0 && (
              <div className="no-results">
                <span className="no-results-icon">🔍</span>
                <p>Aucun monstre trouvé</p>
              </div>
            )}
          </div>

          {/* Détails du monstre sélectionné */}
          {selectedMonster && (
            <div className="monster-details">
              <div className="details-header">
                <span className="details-portrait">{selectedMonster.portrait}</span>
                <div className="details-title">
                  <h3>{selectedMonster.name}</h3>
                  <span className="details-type">
                    {CREATURE_TYPE_ICONS[selectedMonster.creatureType]} {CREATURE_TYPE_LABELS[selectedMonster.creatureType]}
                    {selectedMonster.size && ` • ${selectedMonster.size}`}
                  </span>
                </div>
                {selectedMonster.isBoss && <span className="details-boss-badge">BOSS</span>}
              </div>

              <div className="details-stats">
                <div className="stat-row">
                  <span className="stat-label">CR</span>
                  <span 
                    className="stat-value cr-value"
                    style={{ color: getCRColor(selectedMonster.challengeRating || 0) }}
                  >
                    {formatCR(selectedMonster.challengeRating || 0)}
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">XP</span>
                  <span className="stat-value">{selectedMonster.xpReward || 0}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">❤️ PV</span>
                  <span className="stat-value">{selectedMonster.maxHp}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">🛡️ CA</span>
                  <span className="stat-value">{selectedMonster.armorClass || 10}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">⚔️ Attaque</span>
                  <span className="stat-value">{selectedMonster.attack}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">🛡️ Défense</span>
                  <span className="stat-value">{selectedMonster.defense}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">💨 Vitesse</span>
                  <span className="stat-value">{selectedMonster.speed}</span>
                </div>
              </div>

              {/* Caractéristiques D&D */}
              {selectedMonster.abilities && (
                <div className="details-abilities">
                  <h4>Caractéristiques</h4>
                  <div className="abilities-grid">
                    <div className="ability">
                      <span className="ability-name">FOR</span>
                      <span className="ability-score">{selectedMonster.abilities.strength}</span>
                    </div>
                    <div className="ability">
                      <span className="ability-name">DEX</span>
                      <span className="ability-score">{selectedMonster.abilities.dexterity}</span>
                    </div>
                    <div className="ability">
                      <span className="ability-name">CON</span>
                      <span className="ability-score">{selectedMonster.abilities.constitution}</span>
                    </div>
                    <div className="ability">
                      <span className="ability-name">INT</span>
                      <span className="ability-score">{selectedMonster.abilities.intelligence}</span>
                    </div>
                    <div className="ability">
                      <span className="ability-name">SAG</span>
                      <span className="ability-score">{selectedMonster.abilities.wisdom}</span>
                    </div>
                    <div className="ability">
                      <span className="ability-name">CHA</span>
                      <span className="ability-score">{selectedMonster.abilities.charisma}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Résistances et immunités */}
              {(selectedMonster.resistances?.length || selectedMonster.immunities?.length || selectedMonster.vulnerabilities?.length) && (
                <div className="details-defenses">
                  <h4>Défenses</h4>
                  {selectedMonster.immunities && selectedMonster.immunities.length > 0 && (
                    <div className="defense-row">
                      <span className="defense-label">Immunités:</span>
                      <span className="defense-value">{selectedMonster.immunities.join(', ')}</span>
                    </div>
                  )}
                  {selectedMonster.resistances && selectedMonster.resistances.length > 0 && (
                    <div className="defense-row">
                      <span className="defense-label">Résistances:</span>
                      <span className="defense-value">{selectedMonster.resistances.join(', ')}</span>
                    </div>
                  )}
                  {selectedMonster.vulnerabilities && selectedMonster.vulnerabilities.length > 0 && (
                    <div className="defense-row vulnerability">
                      <span className="defense-label">Vulnérabilités:</span>
                      <span className="defense-value">{selectedMonster.vulnerabilities.join(', ')}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Compétences */}
              {selectedMonster.skills && selectedMonster.skills.length > 0 && (
                <div className="details-skills">
                  <h4>Compétences</h4>
                  {selectedMonster.skills.map((skill, i) => (
                    <div key={i} className="skill-item">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-damage">{skill.damage} dégâts</span>
                      {skill.damageType && <span className="skill-type">{skill.damageType}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Compétence ultime (Boss) */}
              {selectedMonster.ultimateSkill && (
                <div className="details-ultimate">
                  <h4>🔥 Ultime</h4>
                  <div className="ultimate-skill">
                    <span className="skill-name">{selectedMonster.ultimateSkill.name}</span>
                    <span className="skill-damage">{selectedMonster.ultimateSkill.damage} dégâts</span>
                    {selectedMonster.ultimateSkill.description && (
                      <p className="skill-desc">{selectedMonster.ultimateSkill.description}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedMonster.description && (
                <div className="details-description">
                  <h4>Description</h4>
                  <p>{selectedMonster.description}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer avec stats */}
        <div className="bestiary-footer">
          <span>Total: {ALL_MONSTERS.length} créatures</span>
          <span>|</span>
          <span>Boss: {ALL_MONSTERS.filter(m => m.isBoss).length}</span>
          <span>|</span>
          <span>Appuyez sur B ou Échap pour fermer</span>
        </div>
      </div>
    </div>
  );
}

