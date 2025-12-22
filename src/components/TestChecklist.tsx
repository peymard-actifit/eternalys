import { useState, useEffect, useCallback } from 'react';
import { VERSION } from '../version';
import './TestChecklist.css';

// Types pour les tests
interface TestItem {
  id: string;
  phase: string;
  number: string;
  description: string;
  target?: string;
  result: 'pending' | 'pass' | 'fail';
  notes: string;
}

interface MetricItem {
  id: string;
  phase: string;
  name: string;
  value: string;
  target: string;
  unit: string;
}

// Configuration des tests du Cycle Gamma
const GAMMA_TESTS: Omit<TestItem, 'result' | 'notes'>[] = [
  // Phase 0γ - INIT
  { id: '0.1', phase: '0γ', number: '0.1', description: 'Le jeu se charge sans erreur', target: 'Oui' },
  { id: '0.2', phase: '0γ', number: '0.2', description: 'Console navigateur vide d\'erreurs', target: '0 erreur' },
  { id: '0.3', phase: '0γ', number: '0.3', description: 'Menu principal accessible', target: 'Oui' },
  { id: '0.4', phase: '0γ', number: '0.4', description: 'Sélection personnages fonctionne', target: 'Oui' },
  { id: '0.5', phase: '0γ', number: '0.5', description: 'Entrée en donjon possible', target: 'Oui' },
  
  // Phase 1γ - COMBAT BASE
  { id: '1.1', phase: '1γ', number: '1.1', description: 'Attaque de base inflige des dégâts', target: '> 0' },
  { id: '1.2', phase: '1γ', number: '1.2', description: 'Jet d\'attaque affiché', target: 'Visible' },
  { id: '1.3', phase: '1γ', number: '1.3', description: 'Jet de dégâts affiché', target: 'Visible' },
  { id: '1.4', phase: '1γ', number: '1.4', description: 'Monstre perd des HP', target: 'HP diminue' },
  { id: '1.5', phase: '1γ', number: '1.5', description: 'Monstre peut mourir', target: 'HP=0 → mort' },
  { id: '1.6', phase: '1γ', number: '1.6', description: 'Tour passe au suivant', target: 'Auto' },
  { id: '1.7', phase: '1γ', number: '1.7', description: 'Monstre peut attaquer', target: 'Dégâts reçus' },
  { id: '1.8', phase: '1γ', number: '1.8', description: 'Personnage peut mourir', target: 'HP=0 → mort' },
  
  // Phase 2γ - COMBAT SKILLS
  { id: '2.1', phase: '2γ', number: '2.1', description: 'Compétence offensive fait des dégâts', target: '> 0' },
  { id: '2.2', phase: '2γ', number: '2.2', description: 'Dégâts utilisent le bon modificateur', target: 'Stat correcte' },
  { id: '2.3', phase: '2γ', number: '2.3', description: 'Animation/affichage des dégâts', target: 'Visible' },
  { id: '2.4', phase: '2γ', number: '2.4', description: 'Compétence de soin restaure HP', target: 'HP augmente' },
  { id: '2.5', phase: '2γ', number: '2.5', description: 'Soin utilise modificateur Sagesse', target: '+WIS mod' },
  { id: '2.6', phase: '2γ', number: '2.6', description: 'Buff applique bonus correct', target: 'Stats +' },
  { id: '2.7', phase: '2γ', number: '2.7', description: 'Debuff applique malus correct', target: 'Stats -' },
  { id: '2.8', phase: '2γ', number: '2.8', description: 'AoE touche tous les ennemis', target: 'Multi-cibles' },
  { id: '2.9', phase: '2γ', number: '2.9', description: 'Compétence avec CD respecte le CD', target: 'Grisée après' },
  
  // Phase 3γ - BOSS
  { id: '3.1', phase: '3γ', number: '3.1', description: 'Boss apparaît au bon étage', target: 'Étage 5+' },
  { id: '3.2', phase: '3γ', number: '3.2', description: 'Boss a le sprite/nom correct', target: 'Visible' },
  { id: '3.3', phase: '3γ', number: '3.3', description: 'Boss utilise ses compétences', target: 'Skills activés' },
  { id: '3.4', phase: '3γ', number: '3.4', description: 'Boss ne bloque pas le combat', target: 'Pas de freeze' },
  { id: '3.5', phase: '3γ', number: '3.5', description: 'Boss peut être vaincu', target: 'Mort possible' },
  { id: '3.6', phase: '3γ', number: '3.6', description: 'Victoire boss donne XP', target: 'XP reçu' },
  { id: '3.7', phase: '3γ', number: '3.7', description: 'Victoire boss donne loot', target: 'Items reçus' },
  { id: '3.8', phase: '3γ', number: '3.8', description: 'Combat boss = défi sans frustration', target: 'Faisable' },
  
  // Phase 4γ - PROGRESSION
  { id: '4.1', phase: '4γ', number: '4.1', description: 'XP gagné après combat', target: '> 0' },
  { id: '4.2', phase: '4γ', number: '4.2', description: 'XP affiché sur fiche personnage', target: 'Visible' },
  { id: '4.3', phase: '4γ', number: '4.3', description: 'Barre XP progresse', target: 'Visuellement' },
  { id: '4.4', phase: '4γ', number: '4.4', description: 'Level up à 50 XP (niveau 1)', target: 'Correct' },
  { id: '4.5', phase: '4γ', number: '4.5', description: 'Stats augmentent au level up', target: '+HP, +stats' },
  { id: '4.6', phase: '4γ', number: '4.6', description: 'Nouvelles compétences débloquées', target: 'Si applicable' },
  
  // Phase 5γ - INVENTAIRE
  { id: '5.1', phase: '5γ', number: '5.1', description: 'Inventaire accessible (touche I)', target: 'Oui' },
  { id: '5.2', phase: '5γ', number: '5.2', description: 'Inventaire accessible (clic perso)', target: 'Oui' },
  { id: '5.3', phase: '5γ', number: '5.3', description: 'Items affichés correctement', target: 'Visible' },
  { id: '5.4', phase: '5γ', number: '5.4', description: 'Équipement applicable', target: 'Équipable' },
  { id: '5.5', phase: '5γ', number: '5.5', description: 'Bonus équipement appliqué', target: 'Stats modifiées' },
  { id: '5.6', phase: '5γ', number: '5.6', description: 'Arme change les dégâts', target: 'Dégâts diff.' },
  { id: '5.7', phase: '5γ', number: '5.7', description: 'Armure change la CA', target: 'CA modifiée' },
  
  // Phase 6γ - ÉVÉNEMENTS
  { id: '6.1', phase: '6γ', number: '6.1', description: 'Événements se déclenchent', target: 'Oui' },
  { id: '6.2', phase: '6γ', number: '6.2', description: 'Événement positif = effet positif', target: 'Buff/heal' },
  { id: '6.3', phase: '6γ', number: '6.3', description: 'Événement négatif = effet négatif', target: 'Debuff/dmg' },
  { id: '6.4', phase: '6γ', number: '6.4', description: 'Valeurs événements équilibrées', target: 'Pas excessif' },
  { id: '6.5', phase: '6γ', number: '6.5', description: 'Événement ne casse pas le jeu', target: 'Pas de freeze' },
  
  // Phase 7γ - UI/UX
  { id: '7.1', phase: '7γ', number: '7.1', description: 'Boutons répondent au clic', target: '< 200ms' },
  { id: '7.2', phase: '7γ', number: '7.2', description: 'Animations fluides (mode On)', target: 'Smooth' },
  { id: '7.3', phase: '7γ', number: '7.3', description: 'Mode Skip fonctionne', target: 'Pas d\'anim' },
  { id: '7.4', phase: '7γ', number: '7.4', description: 'Affichage central jets (Skip)', target: 'Visible' },
  { id: '7.5', phase: '7γ', number: '7.5', description: 'Tooltips lisibles', target: 'Pas coupés' },
  { id: '7.6', phase: '7γ', number: '7.6', description: 'Bouton passer tour fonctionne', target: 'Tour passé' },
  { id: '7.7', phase: '7γ', number: '7.7', description: 'Bouton retarder tour fonctionne', target: 'Tour décalé' },
  { id: '7.8', phase: '7γ', number: '7.8', description: 'Historique combat lisible', target: 'Scrollable' },
  { id: '7.9', phase: '7γ', number: '7.9', description: 'Ordre initiative affiché', target: 'Visible' },
  { id: '7.10', phase: '7γ', number: '7.10', description: 'Responsive mobile (si testé)', target: 'Utilisable' },
];

// Configuration des métriques
const GAMMA_METRICS: Omit<MetricItem, 'value'>[] = [
  // Combat
  { id: 'm1', phase: '1γ', name: 'Tours pour tuer monstre', target: '2-4', unit: 'tours' },
  { id: 'm2', phase: '1γ', name: 'HP perdus par combat', target: '30-60', unit: '%' },
  { id: 'm3', phase: '1γ', name: 'Dégâts moyens attaque', target: '5-12', unit: 'HP' },
  // Skills
  { id: 'm4', phase: '2γ', name: 'Dégâts skill offensif', target: '8-18', unit: 'HP' },
  { id: 'm5', phase: '2γ', name: 'HP soignés par heal', target: '10-25', unit: 'HP' },
  { id: 'm6', phase: '2γ', name: 'Bonus buff appliqué', target: '+1 à +3', unit: '' },
  // Boss
  { id: 'm7', phase: '3γ', name: 'Tours pour vaincre boss', target: '8-12', unit: 'tours' },
  { id: 'm8', phase: '3γ', name: 'HP perdus contre boss', target: '60-90', unit: '%' },
  { id: 'm9', phase: '3γ', name: 'HP du boss observé', target: '50-80', unit: 'HP' },
  // Progression
  { id: 'm10', phase: '4γ', name: 'XP par monstre', target: '10-20', unit: 'XP' },
  { id: 'm11', phase: '4γ', name: 'XP par boss', target: '30-50', unit: 'XP' },
  { id: 'm12', phase: '4γ', name: 'Combats pour level up', target: '3-6', unit: 'combats' },
  // Events
  { id: 'm13', phase: '6γ', name: 'Buff événement observé', target: '+1 à +3', unit: '' },
  { id: 'm14', phase: '6γ', name: 'Heal événement observé', target: '5-15', unit: 'HP' },
  { id: 'm15', phase: '6γ', name: 'Dégâts événement observé', target: '4-12', unit: 'HP' },
];

// Noms des phases
const PHASE_NAMES: Record<string, string> = {
  '0γ': 'INIT',
  '1γ': 'COMBAT BASE',
  '2γ': 'COMBAT SKILLS',
  '3γ': 'BOSS',
  '4γ': 'PROGRESSION',
  '5γ': 'INVENTAIRE',
  '6γ': 'ÉVÉNEMENTS',
  '7γ': 'UI/UX',
};

interface TestChecklistProps {
  userRole?: 'admin' | 'testeur' | 'player';
}

export const TestChecklist: React.FC<TestChecklistProps> = ({ userRole = 'admin' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTab, setShowTab] = useState(false);
  const [tests, setTests] = useState<TestItem[]>([]);
  const [metrics, setMetrics] = useState<MetricItem[]>([]);
  const [activePhase, setActivePhase] = useState<string>('all');
  const [exportText, setExportText] = useState<string>('');
  const [showExport, setShowExport] = useState(false);
  const [testerName, setTesterName] = useState('');

  // Initialiser les tests et métriques
  useEffect(() => {
    // Charger depuis localStorage ou initialiser
    const savedTests = localStorage.getItem('gamma_tests');
    const savedMetrics = localStorage.getItem('gamma_metrics');
    const savedTester = localStorage.getItem('gamma_tester');
    
    if (savedTests) {
      setTests(JSON.parse(savedTests));
    } else {
      setTests(GAMMA_TESTS.map(t => ({ ...t, result: 'pending' as const, notes: '' })));
    }
    
    if (savedMetrics) {
      setMetrics(JSON.parse(savedMetrics));
    } else {
      setMetrics(GAMMA_METRICS.map(m => ({ ...m, value: '' })));
    }
    
    if (savedTester) {
      setTesterName(savedTester);
    }
  }, []);

  // Sauvegarder les changements
  useEffect(() => {
    if (tests.length > 0) {
      localStorage.setItem('gamma_tests', JSON.stringify(tests));
    }
  }, [tests]);

  useEffect(() => {
    if (metrics.length > 0) {
      localStorage.setItem('gamma_metrics', JSON.stringify(metrics));
    }
  }, [metrics]);

  useEffect(() => {
    if (testerName) {
      localStorage.setItem('gamma_tester', testerName);
    }
  }, [testerName]);

  // Raccourci clavier Ctrl+Alt+G (G pour Gamma) - évite les conflits navigateur
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ctrl+Alt+G pour ouvrir/fermer (admin et testeur)
    if (e.ctrlKey && e.altKey && (e.key === 'g' || e.key === 'G')) {
      e.preventDefault();
      if (userRole === 'admin' || userRole === 'testeur') {
        setIsOpen(prev => !prev);
      }
    }
    // F9 comme alternative (moins utilisé par les navigateurs)
    if (e.key === 'F9') {
      e.preventDefault();
      if (userRole === 'admin' || userRole === 'testeur') {
        setIsOpen(prev => !prev);
      }
    }
    // Échap pour fermer
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
      setShowExport(false);
    }
  }, [userRole, isOpen]);

  // Afficher l'onglet caché après un délai (pour ne pas être intrusif)
  useEffect(() => {
    if (userRole === 'admin') {
      const timer = setTimeout(() => setShowTab(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [userRole]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Mettre à jour un test
  const updateTestResult = (id: string, result: 'pass' | 'fail' | 'pending') => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, result } : t));
  };

  const updateTestNotes = (id: string, notes: string) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, notes } : t));
  };

  // Mettre à jour une métrique
  const updateMetricValue = (id: string, value: string) => {
    setMetrics(prev => prev.map(m => m.id === id ? { ...m, value } : m));
  };

  // Réinitialiser tous les tests
  const resetAll = () => {
    if (confirm('Réinitialiser tous les tests et métriques ?')) {
      setTests(GAMMA_TESTS.map(t => ({ ...t, result: 'pending' as const, notes: '' })));
      setMetrics(GAMMA_METRICS.map(m => ({ ...m, value: '' })));
      localStorage.removeItem('gamma_tests');
      localStorage.removeItem('gamma_metrics');
    }
  };

  // Générer l'export pour Claude
  const generateExport = () => {
    const now = new Date().toISOString().split('T')[0];
    const phases = ['0γ', '1γ', '2γ', '3γ', '4γ', '5γ', '6γ', '7γ'];
    
    let text = `CYCLE DE MISSION GAMMA - RÉSULTATS\n`;
    text += `Date: ${now}\n`;
    text += `Testeur: ${testerName || 'Non spécifié'}\n`;
    text += `Version: ${VERSION}\n`;
    text += `${'='.repeat(50)}\n\n`;

    // Résumé
    const passed = tests.filter(t => t.result === 'pass').length;
    const failed = tests.filter(t => t.result === 'fail').length;
    const pending = tests.filter(t => t.result === 'pending').length;
    const total = tests.length;
    
    text += `RÉSUMÉ: ${passed}/${total} réussis (${Math.round(passed/total*100)}%)\n`;
    text += `- Réussis: ${passed}\n`;
    text += `- Échoués: ${failed}\n`;
    text += `- En attente: ${pending}\n\n`;

    // Tests par phase
    for (const phase of phases) {
      const phaseTests = tests.filter(t => t.phase === phase);
      const phasePassed = phaseTests.filter(t => t.result === 'pass').length;
      const phaseFailed = phaseTests.filter(t => t.result === 'fail').length;
      
      text += `PHASE ${phase} - ${PHASE_NAMES[phase]} (${phasePassed}/${phaseTests.length})\n`;
      text += `${'-'.repeat(40)}\n`;
      
      for (const test of phaseTests) {
        const icon = test.result === 'pass' ? '✅' : test.result === 'fail' ? '❌' : '⏳';
        text += `${icon} ${test.number}: ${test.description}\n`;
        if (test.notes) {
          text += `   Notes: ${test.notes}\n`;
        }
      }
      
      // Métriques de la phase
      const phaseMetrics = metrics.filter(m => m.phase === phase);
      if (phaseMetrics.length > 0 && phaseMetrics.some(m => m.value)) {
        text += `\nMétriques:\n`;
        for (const metric of phaseMetrics) {
          if (metric.value) {
            text += `- ${metric.name}: ${metric.value} ${metric.unit} (cible: ${metric.target})\n`;
          }
        }
      }
      
      text += `\n`;
    }

    // Points bloquants
    const blockers = tests.filter(t => t.result === 'fail');
    if (blockers.length > 0) {
      text += `POINTS BLOQUANTS (${blockers.length})\n`;
      text += `${'-'.repeat(40)}\n`;
      for (const blocker of blockers) {
        text += `- ${blocker.number}: ${blocker.description}\n`;
        if (blocker.notes) {
          text += `  → ${blocker.notes}\n`;
        }
      }
    }

    setExportText(text);
    setShowExport(true);
  };

  // Copier dans le presse-papier
  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportText);
    alert('Copié ! Colle ce texte dans le chat Claude.');
  };

  // Filtrer les tests par phase
  const filteredTests = activePhase === 'all' 
    ? tests 
    : tests.filter(t => t.phase === activePhase);

  const filteredMetrics = activePhase === 'all'
    ? metrics
    : metrics.filter(m => m.phase === activePhase);

  // Calculer les stats
  const stats = {
    total: tests.length,
    passed: tests.filter(t => t.result === 'pass').length,
    failed: tests.filter(t => t.result === 'fail').length,
    pending: tests.filter(t => t.result === 'pending').length,
  };

  // Onglet caché sur le côté (admin uniquement)
  const renderHiddenTab = () => {
    if (userRole !== 'admin' || !showTab || isOpen) return null;
    
    return (
      <div 
        className="test-checklist-hidden-tab"
        onClick={() => setIsOpen(true)}
        title="Ouvrir Checklist Gamma (Ctrl+Alt+G ou F9)"
      >
        <span className="tab-icon">🧪</span>
        <span className="tab-arrow">◀</span>
      </div>
    );
  };

  return (
    <>
      {renderHiddenTab()}
      {!isOpen ? null : (
    <div className="test-checklist-overlay">
      <div className="test-checklist-modal">
        {/* Header */}
        <div className="test-checklist-header">
          <div className="header-left">
            <h2>🧪 Cycle de Mission Gamma</h2>
            <span className="header-stats">
              ✅ {stats.passed} | ❌ {stats.failed} | ⏳ {stats.pending} / {stats.total}
            </span>
          </div>
          <div className="header-right">
            <input
              type="text"
              placeholder="Nom du testeur"
              value={testerName}
              onChange={(e) => setTesterName(e.target.value)}
              className="tester-input"
            />
            <button onClick={generateExport} className="btn-export">
              📋 Exporter pour Claude
            </button>
            <button onClick={resetAll} className="btn-reset">
              🔄 Reset
            </button>
            <button onClick={() => setIsOpen(false)} className="btn-close">
              ✕
            </button>
          </div>
        </div>

        {/* Tabs des phases */}
        <div className="phase-tabs">
          <button 
            className={`phase-tab ${activePhase === 'all' ? 'active' : ''}`}
            onClick={() => setActivePhase('all')}
          >
            Tout
          </button>
          {Object.entries(PHASE_NAMES).map(([phase, name]) => {
            const phaseTests = tests.filter(t => t.phase === phase);
            const phasePassed = phaseTests.filter(t => t.result === 'pass').length;
            const phaseFailed = phaseTests.filter(t => t.result === 'fail').length;
            
            let statusClass = '';
            if (phaseFailed > 0) statusClass = 'has-failed';
            else if (phasePassed === phaseTests.length) statusClass = 'all-passed';
            
            return (
              <button 
                key={phase}
                className={`phase-tab ${activePhase === phase ? 'active' : ''} ${statusClass}`}
                onClick={() => setActivePhase(phase)}
              >
                {phase} {name}
                <span className="phase-count">{phasePassed}/{phaseTests.length}</span>
              </button>
            );
          })}
        </div>

        {/* Contenu */}
        <div className="test-checklist-content">
          {/* Liste des tests */}
          <div className="tests-section">
            <h3>Tests</h3>
            <div className="tests-list">
              {filteredTests.map(test => (
                <div key={test.id} className={`test-item ${test.result}`}>
                  <div className="test-info">
                    <span className="test-number">{test.number}</span>
                    <span className="test-description">{test.description}</span>
                    <span className="test-target">Cible: {test.target}</span>
                  </div>
                  <div className="test-actions">
                    <button 
                      className={`btn-result pass ${test.result === 'pass' ? 'selected' : ''}`}
                      onClick={() => updateTestResult(test.id, 'pass')}
                      title="Réussi"
                    >
                      ✅
                    </button>
                    <button 
                      className={`btn-result fail ${test.result === 'fail' ? 'selected' : ''}`}
                      onClick={() => updateTestResult(test.id, 'fail')}
                      title="Échoué"
                    >
                      ❌
                    </button>
                    <button 
                      className={`btn-result pending ${test.result === 'pending' ? 'selected' : ''}`}
                      onClick={() => updateTestResult(test.id, 'pending')}
                      title="En attente"
                    >
                      ⏳
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Notes..."
                    value={test.notes}
                    onChange={(e) => updateTestNotes(test.id, e.target.value)}
                    className="test-notes"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Métriques */}
          {filteredMetrics.length > 0 && (
            <div className="metrics-section">
              <h3>Métriques</h3>
              <div className="metrics-list">
                {filteredMetrics.map(metric => (
                  <div key={metric.id} className="metric-item">
                    <span className="metric-name">{metric.name}</span>
                    <input
                      type="text"
                      placeholder={metric.target}
                      value={metric.value}
                      onChange={(e) => updateMetricValue(metric.id, e.target.value)}
                      className="metric-input"
                    />
                    <span className="metric-unit">{metric.unit}</span>
                    <span className="metric-target">Cible: {metric.target}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal d'export */}
        {showExport && (
          <div className="export-modal">
            <div className="export-content">
              <h3>📋 Export pour Claude</h3>
              <p>Copie ce texte et colle-le dans le chat Claude :</p>
              <textarea 
                value={exportText} 
                readOnly 
                className="export-textarea"
              />
              <div className="export-actions">
                <button onClick={copyToClipboard} className="btn-copy">
                  📋 Copier
                </button>
                <button onClick={() => setShowExport(false)} className="btn-close-export">
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer avec instructions */}
        <div className="test-checklist-footer">
          <span>💡 Raccourcis: Ctrl+Alt+G ou F9 pour ouvrir/fermer | Échap pour fermer</span>
        </div>
      </div>
    </div>
      )}
    </>
  );
};

export default TestChecklist;

