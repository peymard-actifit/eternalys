import { useState, useEffect } from 'react';
import { saveService } from '../services/authService';
import { authStore } from '../store/authStore';
import { gameStore } from '../store/gameStore';
import type { GameSave } from '../types/database.types';
import './SaveModal.css';

interface SaveModalProps {
  mode: 'save' | 'load';
  onClose: () => void;
  onLoad?: (gameState: object) => void;
}

export function SaveModal({ mode, onClose, onLoad }: SaveModalProps) {
  const [saves, setSaves] = useState<(GameSave | null)[]>([null, null, null]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingSlot, setSavingSlot] = useState<number | null>(null);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [saveName, setSaveName] = useState('');
  const currentUser = authStore.getState().currentUser;

  useEffect(() => {
    loadSaves();
  }, []);

  const loadSaves = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    const { saves: fetchedSaves, error: fetchError } = await saveService.getSaves(currentUser.id);
    
    if (fetchError) {
      setError(fetchError);
    } else {
      // Organiser les sauvegardes par slot
      const organized: (GameSave | null)[] = [null, null, null];
      fetchedSaves.forEach(save => {
        if (save.slot_number >= 1 && save.slot_number <= 3) {
          organized[save.slot_number - 1] = save;
        }
      });
      setSaves(organized);
    }
    setIsLoading(false);
  };

  const handleSave = async (slotNumber: number) => {
    if (!currentUser) return;
    
    // Si pas de nom, demander
    if (!editingSlot) {
      setEditingSlot(slotNumber);
      const existingSave = saves[slotNumber - 1];
      setSaveName(existingSave?.save_name || `Sauvegarde ${slotNumber}`);
      return;
    }

    setSavingSlot(slotNumber);
    setError(null);

    const gameState = gameStore.getState();
    const { save, error: saveError } = await saveService.saveGame(
      currentUser.id,
      slotNumber,
      saveName,
      gameState,
      0 // TODO: Track play time
    );

    if (saveError) {
      setError(saveError);
    } else if (save) {
      const newSaves = [...saves];
      newSaves[slotNumber - 1] = save;
      setSaves(newSaves);
      setEditingSlot(null);
    }
    setSavingSlot(null);
  };

  const handleLoad = async (slotNumber: number) => {
    if (!currentUser || !onLoad) return;
    
    setSavingSlot(slotNumber);
    setError(null);

    const { save, error: loadError } = await saveService.loadGame(currentUser.id, slotNumber);

    if (loadError) {
      setError(loadError);
    } else if (save) {
      onLoad(save.game_state as object);
      onClose();
    }
    setSavingSlot(null);
  };

  const handleDelete = async (slotNumber: number) => {
    if (!currentUser) return;
    
    if (!confirm('Voulez-vous vraiment supprimer cette sauvegarde ?')) {
      return;
    }

    setSavingSlot(slotNumber);
    const { error: deleteError } = await saveService.deleteSave(currentUser.id, slotNumber);

    if (deleteError) {
      setError(deleteError);
    } else {
      const newSaves = [...saves];
      newSaves[slotNumber - 1] = null;
      setSaves(newSaves);
    }
    setSavingSlot(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPlayTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (!currentUser) {
    return (
      <div className="save-modal-overlay" onClick={onClose}>
        <div className="save-modal" onClick={e => e.stopPropagation()}>
          <div className="save-error">
            ⚠️ Vous devez être connecté pour accéder aux sauvegardes
          </div>
          <button className="close-btn" onClick={onClose}>Fermer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="save-modal-overlay" onClick={onClose}>
      <div className="save-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        
        <div className="save-header">
          <h2>{mode === 'save' ? '💾 Sauvegarder' : '📂 Charger'}</h2>
          <p className="save-subtitle">
            {mode === 'save' 
              ? 'Choisissez un emplacement de sauvegarde'
              : 'Choisissez une sauvegarde à charger'}
          </p>
        </div>

        {isLoading ? (
          <div className="save-loading">
            <span className="loading-spinner">⏳</span>
            Chargement...
          </div>
        ) : (
          <div className="save-slots">
            {[1, 2, 3].map(slotNumber => {
              const save = saves[slotNumber - 1];
              const isEditing = editingSlot === slotNumber;
              const isBusy = savingSlot === slotNumber;

              return (
                <div 
                  key={slotNumber} 
                  className={`save-slot ${save ? 'has-save' : 'empty'} ${isBusy ? 'busy' : ''}`}
                >
                  <div className="slot-header">
                    <span className="slot-number">Slot {slotNumber}</span>
                    {save && (
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(slotNumber)}
                        disabled={isBusy}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    )}
                  </div>

                  {save ? (
                    <div className="slot-content">
                      <div className="save-name">{save.save_name}</div>
                      <div className="save-info">
                        <span>📅 {formatDate(save.updated_at)}</span>
                        <span>⏱️ {formatPlayTime(save.play_time)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="slot-content empty">
                      <span className="empty-icon">📭</span>
                      <span>Emplacement vide</span>
                    </div>
                  )}

                  {isEditing ? (
                    <div className="save-name-input">
                      <input
                        type="text"
                        value={saveName}
                        onChange={e => setSaveName(e.target.value)}
                        placeholder="Nom de la sauvegarde"
                        autoFocus
                      />
                      <div className="save-name-buttons">
                        <button onClick={() => setEditingSlot(null)}>Annuler</button>
                        <button onClick={() => handleSave(slotNumber)} disabled={!saveName.trim()}>
                          Sauvegarder
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="slot-actions">
                      {mode === 'save' ? (
                        <button 
                          className="action-btn save"
                          onClick={() => handleSave(slotNumber)}
                          disabled={isBusy}
                        >
                          {isBusy ? '⏳' : '💾'} {save ? 'Écraser' : 'Sauvegarder'}
                        </button>
                      ) : (
                        <button 
                          className="action-btn load"
                          onClick={() => handleLoad(slotNumber)}
                          disabled={!save || isBusy}
                        >
                          {isBusy ? '⏳' : '📂'} Charger
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {error && (
          <div className="save-error">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}


