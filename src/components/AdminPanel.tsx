import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { authStore } from '../store/authStore';
import type { SafeUser } from '../types/database.types';
import './AdminPanel.css';

interface AdminPanelProps {
  onClose: () => void;
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = authStore.getState().currentUser;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    const { users: fetchedUsers, error: fetchError } = await authService.getAllUsers();
    if (fetchError) {
      setError(fetchError);
    } else {
      setUsers(fetchedUsers);
    }
    setIsLoading(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Vérifier que l'utilisateur est admin
  if (!currentUser?.is_admin) {
    return (
      <div className="admin-panel-overlay" onClick={onClose}>
        <div className="admin-panel" onClick={e => e.stopPropagation()}>
          <div className="admin-error">
            ⛔ Accès non autorisé
          </div>
          <button className="close-btn" onClick={onClose}>Fermer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel-overlay" onClick={onClose}>
      <div className="admin-panel" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <div className="admin-header">
          <h2>👑 Panneau Administrateur</h2>
          <p className="admin-subtitle">Gestion des utilisateurs d'Eternalys</p>
        </div>

        {isLoading ? (
          <div className="admin-loading">
            <span className="loading-spinner">⏳</span>
            Chargement des utilisateurs...
          </div>
        ) : error ? (
          <div className="admin-error">
            ⚠️ {error}
            <button onClick={loadUsers}>Réessayer</button>
          </div>
        ) : (
          <>
            <div className="users-stats">
              <div className="stat-box">
                <span className="stat-value">{users.length}</span>
                <span className="stat-label">Utilisateurs</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">{users.filter(u => u.is_admin).length}</span>
                <span className="stat-label">Admins</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">
                  {users.filter(u => {
                    if (!u.last_login) return false;
                    const lastLogin = new Date(u.last_login);
                    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                    return lastLogin > dayAgo;
                  }).length}
                </span>
                <span className="stat-label">Actifs (24h)</span>
              </div>
            </div>

            <div className="users-list">
              <div className="users-list-header">
                <span className="col-username">Utilisateur</span>
                <span className="col-role">Rôle</span>
                <span className="col-created">Inscription</span>
                <span className="col-login">Dernière connexion</span>
              </div>
              
              {users.map(user => (
                <div 
                  key={user.id} 
                  className={`user-row ${user.is_admin ? 'admin' : ''} ${user.id === currentUser?.id ? 'current' : ''}`}
                >
                  <span className="col-username">
                    {user.is_admin ? '👑 ' : '👤 '}
                    {user.username}
                    {user.id === currentUser?.id && ' (vous)'}
                  </span>
                  <span className="col-role">
                    <span className={`role-badge ${user.is_admin ? 'admin' : 'user'}`}>
                      {user.is_admin ? 'Admin' : 'Joueur'}
                    </span>
                  </span>
                  <span className="col-created">
                    {formatDate(user.created_at)}
                  </span>
                  <span className="col-login">
                    {formatDate(user.last_login)}
                  </span>
                </div>
              ))}
            </div>

            <button className="refresh-btn" onClick={loadUsers}>
              🔄 Actualiser
            </button>
          </>
        )}
      </div>
    </div>
  );
}



