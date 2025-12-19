import { useState } from 'react';
import { supabase, canUseSupabase } from '../lib/supabase';
import { authService } from '../services/authService';
import './DebugSupabase.css';

interface TestResult {
  table: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  count?: number;
}

export function DebugSupabase({ onClose }: { onClose: () => void }) {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    const newResults: TestResult[] = [];

    // Vérifier si Supabase est configuré
    if (!canUseSupabase() || !supabase) {
      newResults.push({ 
        table: 'config', 
        status: 'error', 
        message: 'Supabase non configuré - Variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY manquantes' 
      });
      setResults([...newResults]);
      setIsRunning(false);
      return;
    }

    // Test table users
    newResults.push({ table: 'users', status: 'pending', message: 'Test en cours...' });
    setResults([...newResults]);
    
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) {
        newResults[0] = { table: 'users', status: 'error', message: error.message };
      } else {
        newResults[0] = { 
          table: 'users', 
          status: 'success', 
          message: `Table OK`, 
          count: users?.length || 0 
        };
      }
    } catch (e: any) {
      newResults[0] = { table: 'users', status: 'error', message: e.message };
    }
    setResults([...newResults]);

    // Test table game_saves
    newResults.push({ table: 'game_saves', status: 'pending', message: 'Test en cours...' });
    setResults([...newResults]);
    
    try {
      const { data: saves, error } = await supabase
        .from('game_saves')
        .select('*');
      
      if (error) {
        newResults[1] = { table: 'game_saves', status: 'error', message: error.message };
      } else {
        newResults[1] = { 
          table: 'game_saves', 
          status: 'success', 
          message: `Table OK`, 
          count: saves?.length || 0 
        };
      }
    } catch (e: any) {
      newResults[1] = { table: 'game_saves', status: 'error', message: e.message };
    }
    setResults([...newResults]);

    // Test table game_history
    newResults.push({ table: 'game_history', status: 'pending', message: 'Test en cours...' });
    setResults([...newResults]);
    
    try {
      const { data: history, error } = await supabase
        .from('game_history')
        .select('*');
      
      if (error) {
        newResults[2] = { table: 'game_history', status: 'error', message: error.message };
      } else {
        newResults[2] = { 
          table: 'game_history', 
          status: 'success', 
          message: `Table OK`, 
          count: history?.length || 0 
        };
      }
    } catch (e: any) {
      newResults[2] = { table: 'game_history', status: 'error', message: e.message };
    }
    setResults([...newResults]);

    // Test création admin
    newResults.push({ table: 'admin', status: 'pending', message: 'Vérification compte admin...' });
    setResults([...newResults]);
    
    try {
      await authService.ensureAdminExists();
      const { data: admin } = await supabase
        .from('users')
        .select('*')
        .eq('username', 'admin')
        .single();
      
      if (admin) {
        newResults[3] = { 
          table: 'admin', 
          status: 'success', 
          message: `Compte admin OK (is_admin: ${admin.is_admin})` 
        };
      } else {
        newResults[3] = { 
          table: 'admin', 
          status: 'error', 
          message: 'Compte admin non trouvé' 
        };
      }
    } catch (e: any) {
      newResults[3] = { table: 'admin', status: 'error', message: e.message };
    }
    setResults([...newResults]);

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  return (
    <div className="debug-overlay" onClick={onClose}>
      <div className="debug-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <h2>🔧 Test Supabase</h2>
        
        <button 
          className="run-tests-btn" 
          onClick={runTests}
          disabled={isRunning}
        >
          {isRunning ? '⏳ Tests en cours...' : '🚀 Lancer les tests'}
        </button>

        {results.length > 0 && (
          <div className="results-list">
            {results.map((result, index) => (
              <div key={index} className={`result-item ${result.status}`}>
                <span className="result-icon">{getStatusIcon(result.status)}</span>
                <span className="result-table">{result.table}</span>
                <span className="result-message">
                  {result.message}
                  {result.count !== undefined && ` (${result.count} entrées)`}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="debug-info">
          <p><strong>URL Supabase:</strong> {import.meta.env.VITE_SUPABASE_URL ? '✅ Configuré' : '❌ Non configuré'}</p>
          <p><strong>Clé Supabase:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configuré' : '❌ Non configuré'}</p>
        </div>
      </div>
    </div>
  );
}


