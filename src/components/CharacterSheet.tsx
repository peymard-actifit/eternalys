import { Character, Monster } from '../types/game.types';
import { getXPForNextLevel } from '../store/progressionStore';
import './CharacterSheet.css';

interface CharacterSheetProps {
  entity: Character | Monster | null | undefined;
  onClose: () => void;
}

// Icônes pour les types de dégâts
const DAMAGE_TYPE_ICONS: Record<string, string> = {
  fire: '🔥',
  cold: '❄️',
  lightning: '⚡',
  acid: '🧪',
  poison: '☠️',
  necrotic: '💀',
  radiant: '✨',
  force: '💫',
  psychic: '🧠',
  thunder: '🌩️',
  bludgeoning: '🔨',
  piercing: '🗡️',
  slashing: '⚔️',
  physical: '⚔️'
};

// Icônes pour les caractéristiques
const ABILITY_ICONS: Record<string, string> = {
  strength: '💪',
  dexterity: '🏃',
  constitution: '❤️',
  intelligence: '📚',
  wisdom: '👁️',
  charisma: '💬'
};

// Noms français des caractéristiques
const ABILITY_NAMES: Record<string, string> = {
  strength: 'Force',
  dexterity: 'Dextérité',
  constitution: 'Constitution',
  intelligence: 'Intelligence',
  wisdom: 'Sagesse',
  charisma: 'Charisme'
};

// Calcul du modificateur D&D
const getModifier = (score: number): number => {
  if (typeof score !== 'number' || isNaN(score)) return 0;
  return Math.floor((score - 10) / 2);
};

// Formater le modificateur avec signe
const formatModifier = (mod: number): string => mod >= 0 ? `+${mod}` : `${mod}`;

export function CharacterSheet({ entity, onClose }: CharacterSheetProps) {
  // Protection contre les entités null/undefined
  if (!entity || typeof entity !== 'object') {
    return (
      <div className="character-sheet-overlay" onClick={onClose}>
        <div className="character-sheet" onClick={e => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>✕</button>
          <div className="sheet-error">
            <span className="error-icon">⚠️</span>
            <p>Impossible de charger les informations de cette entité</p>
            <button className="error-close-btn" onClick={onClose}>Fermer</button>
          </div>
        </div>
      </div>
    );
  }

  // Valeurs par défaut pour éviter les erreurs
  const safeEntity = {
    name: entity.name || 'Inconnu',
    portrait: entity.portrait || '❓',
    hp: entity.hp ?? 0,
    maxHp: entity.maxHp ?? 1,
    attack: entity.attack ?? 0,
    defense: entity.defense ?? 0,
    speed: entity.speed ?? 0,
    magicAttack: entity.magicAttack ?? 0,
    magicDefense: entity.magicDefense ?? 0,
    abilities: entity.abilities || null,
    skills: entity.skills || [],
    ...entity
  };

  const isCharacter = 'class' in safeEntity;
  const isMonster = 'isMonster' in safeEntity || 'creatureType' in safeEntity || 'challengeRating' in safeEntity;
  
  // Gestion de la touche Échap
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="character-sheet-overlay" 
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="character-sheet" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        {/* En-tête */}
        <div className="sheet-header">
          <div className="entity-portrait-large">
            {entity.portrait}
          </div>
          <div className="entity-info">
            <h2 className="entity-name">{entity.name}</h2>
            {isCharacter && (
              <>
                <span className="entity-class">{(entity as Character).class}</span>
                <div className="entity-level-info">
                  <span className="level-badge">Niv. {(entity as Character).level || 1}</span>
                  {(entity as Character).xp !== undefined && (
                    <span className="xp-info">
                      XP: {(entity as Character).xp || 0} / {getXPForNextLevel((entity as Character).level || 1)}
                    </span>
                  )}
                </div>
              </>
            )}
            {isMonster && (
              <div className="monster-tags">
                {(entity as Monster).creatureType && (
                  <span className="creature-type">{(entity as Monster).creatureType}</span>
                )}
                {(entity as Monster).size && (
                  <span className="creature-size">{(entity as Monster).size}</span>
                )}
                {(entity as Monster).challengeRating !== undefined && (
                  <span className="cr-tag">CR {(entity as Monster).challengeRating}</span>
                )}
                {(entity as Monster).isBoss && (
                  <span className="boss-tag">Boss</span>
                )}
                {(entity as Monster).isLegendary && (
                  <span className="legendary-tag">Légendaire</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Barre de vie */}
        <div className="sheet-hp-section">
          <div className="hp-bar-container">
            <div 
              className="hp-bar-fill" 
              style={{ width: `${Math.max(0, (entity.hp / entity.maxHp) * 100)}%` }}
            />
            <span className="hp-text">{entity.hp} / {entity.maxHp} PV</span>
          </div>
          {isMonster && (entity as Monster).armorClass && (
            <div className="armor-class">
              <span className="ac-icon">🛡️</span>
              <span className="ac-value">{(entity as Monster).armorClass}</span>
              <span className="ac-label">CA</span>
            </div>
          )}
        </div>

        {/* Caractéristiques D&D */}
        {entity.abilities && (
          <div className="abilities-section">
            <h3>📊 Caractéristiques</h3>
            <div className="abilities-grid">
              {Object.entries(entity.abilities).map(([ability, score]) => (
                <div key={ability} className="ability-box">
                  <span className="ability-icon">{ABILITY_ICONS[ability]}</span>
                  <span className="ability-name">{ABILITY_NAMES[ability]}</span>
                  <span className="ability-score">{score}</span>
                  <span className="ability-mod">{formatModifier(getModifier(score))}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats de combat */}
        <div className="combat-stats-section">
          <h3>⚔️ Combat</h3>
          <div className="combat-stats-grid">
            <div className="combat-stat">
              <span className="stat-icon">⚔️</span>
              <span className="stat-label">Attaque</span>
              <span className="stat-value">{entity.attack}</span>
            </div>
            {(entity.magicAttack !== undefined && entity.magicAttack > 0) && (
              <div className="combat-stat">
                <span className="stat-icon">✨</span>
                <span className="stat-label">Att. Magique</span>
                <span className="stat-value">{entity.magicAttack}</span>
              </div>
            )}
            <div className="combat-stat">
              <span className="stat-icon">🛡️</span>
              <span className="stat-label">Défense</span>
              <span className="stat-value">{entity.defense}</span>
            </div>
            {(entity.magicDefense !== undefined && entity.magicDefense > 0) && (
              <div className="combat-stat">
                <span className="stat-icon">🔮</span>
                <span className="stat-label">Rés. Magique</span>
                <span className="stat-value">{entity.magicDefense}</span>
              </div>
            )}
            <div className="combat-stat">
              <span className="stat-icon">💨</span>
              <span className="stat-label">Vitesse</span>
              <span className="stat-value">{entity.speed}</span>
            </div>
          </div>
        </div>

        {/* Résistances et Immunités (style BG3) */}
        {(isMonster || isCharacter) && (
          <div className="resistances-section">
            <h3>🛡️ Résistances & Immunités</h3>
            <div className="resistances-grid">
              {/* Résistances - Monstres */}
              {isMonster && (entity as Monster).resistances && (entity as Monster).resistances!.length > 0 && (
                <div className="resistance-row">
                  <span className="resistance-label">Résistances:</span>
                  <div className="resistance-icons">
                    {(entity as Monster).resistances!.map(r => (
                      <span key={r} className="resistance-icon" title={`Résistance: ${r}`}>
                        {DAMAGE_TYPE_ICONS[r] || '🔷'} <span className="resistance-name">{r}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Résistances - Personnages (obtenues via objets) */}
              {isCharacter && (entity as Character).resistances && (entity as Character).resistances!.length > 0 && (
                <div className="resistance-row">
                  <span className="resistance-label">Résistances:</span>
                  <div className="resistance-icons">
                    {(entity as Character).resistances!.map(r => {
                      const reductionPercent = (entity as Character).passiveEffects?.damageReduction?.[r] || 50;
                      return (
                        <span key={r} className="resistance-icon" title={`Résistance: ${r} (${reductionPercent}% réduction)`}>
                          {DAMAGE_TYPE_ICONS[r] || '🔷'} <span className="resistance-name">{r}</span>
                          <span className="resistance-percent">{reductionPercent}%</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Immunités - Monstres */}
              {isMonster && (entity as Monster).immunities && (entity as Monster).immunities!.length > 0 && (
                <div className="resistance-row immunity">
                  <span className="resistance-label">Immunités:</span>
                  <div className="resistance-icons">
                    {(entity as Monster).immunities!.map(i => (
                      <span key={i} className="resistance-icon immune" title={`Immunité: ${i}`}>
                        {DAMAGE_TYPE_ICONS[i] || '🔶'} <span className="resistance-name">{i}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Vulnérabilités - Monstres */}
              {isMonster && (entity as Monster).vulnerabilities && (entity as Monster).vulnerabilities!.length > 0 && (
                <div className="resistance-row vulnerability">
                  <span className="resistance-label">Vulnérabilités:</span>
                  <div className="resistance-icons">
                    {(entity as Monster).vulnerabilities!.map(v => (
                      <span key={v} className="resistance-icon vulnerable" title={`Vulnérable: ${v}`}>
                        {DAMAGE_TYPE_ICONS[v] || '🔴'} <span className="resistance-name">{v}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Effets passifs pour personnages */}
              {isCharacter && (entity as Character).passiveEffects && (
                <div className="passive-effects">
                  {(entity as Character).passiveEffects?.lifesteal && (entity as Character).passiveEffects!.lifesteal! > 0 && (
                    <div className="passive-effect">
                      <span className="effect-icon">🧛</span>
                      <span className="effect-name">Vol de vie</span>
                      <span className="effect-value">{(entity as Character).passiveEffects!.lifesteal}%</span>
                    </div>
                  )}
                  {(entity as Character).passiveEffects?.critical && (entity as Character).passiveEffects!.critical! > 0 && (
                    <div className="passive-effect">
                      <span className="effect-icon">💥</span>
                      <span className="effect-name">Critique</span>
                      <span className="effect-value">+{(entity as Character).passiveEffects!.critical}%</span>
                    </div>
                  )}
                  {(entity as Character).passiveEffects?.evasion && (entity as Character).passiveEffects!.evasion! > 0 && (
                    <div className="passive-effect">
                      <span className="effect-icon">💨</span>
                      <span className="effect-name">Esquive</span>
                      <span className="effect-value">{(entity as Character).passiveEffects!.evasion}%</span>
                    </div>
                  )}
                  {(entity as Character).passiveEffects?.thorns && (entity as Character).passiveEffects!.thorns! > 0 && (
                    <div className="passive-effect">
                      <span className="effect-icon">🌵</span>
                      <span className="effect-name">Épines</span>
                      <span className="effect-value">{(entity as Character).passiveEffects!.thorns}%</span>
                    </div>
                  )}
                  {(entity as Character).passiveEffects?.regeneration && (entity as Character).passiveEffects!.regeneration! > 0 && (
                    <div className="passive-effect">
                      <span className="effect-icon">💚</span>
                      <span className="effect-name">Régénération</span>
                      <span className="effect-value">{(entity as Character).passiveEffects!.regeneration}/tour</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Message si aucune résistance */}
              {isMonster && 
                (!(entity as Monster).resistances || (entity as Monster).resistances!.length === 0) &&
                (!(entity as Monster).immunities || (entity as Monster).immunities!.length === 0) &&
                (!(entity as Monster).vulnerabilities || (entity as Monster).vulnerabilities!.length === 0) && (
                <div className="no-resistances">Aucune résistance particulière</div>
              )}
            </div>
          </div>
        )}

        {/* Compétences */}
        {entity.skills && entity.skills.length > 0 && (
          <div className="skills-section">
            <h3>📜 Compétences</h3>
            <div className="skills-list">
              {entity.skills.map(skill => (
                <div key={skill.id} className={`skill-entry ${skill.type}`}>
                  <div className="skill-header">
                    <span className="skill-name">{skill.name}</span>
                    {skill.cooldown && skill.cooldown > 0 && (
                      <span className="skill-cooldown">⏳ {skill.cooldown}t</span>
                    )}
                  </div>
                  <div className="skill-details">
                    {skill.damage !== 0 && (
                      <span className="skill-damage">
                        {skill.type === 'heal' ? `+${Math.abs(skill.damage)} PV` : `${skill.damage} dégâts`}
                      </span>
                    )}
                    {skill.damageType && (
                      <span className="skill-damage-type">
                        {DAMAGE_TYPE_ICONS[skill.damageType] || '⚔️'} {skill.damageType}
                      </span>
                    )}
                  </div>
                  <p className="skill-description">{skill.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description du monstre */}
        {isMonster && (entity as Monster).description && (
          <div className="description-section">
            <h3>📖 Description</h3>
            <p className="monster-description">{(entity as Monster).description}</p>
          </div>
        )}

        {/* Challenge Rating pour monstres */}
        {isMonster && (entity as Monster).challengeRating !== undefined && (
          <div className="cr-section">
            <span className="cr-label">Facteur de Puissance:</span>
            <span className="cr-value">{(entity as Monster).challengeRating}</span>
            <span className="xp-value">({(entity as Monster).xpReward} XP)</span>
          </div>
        )}
      </div>
    </div>
  );
}

