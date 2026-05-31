import React, { useState, useEffect } from 'react';
import { Search, Trash2, AlertCircle, X, Eye, Brain, Smile, Compass, ShieldOff } from 'lucide-react';

interface SentimentScan {
  id: number;
  userId: number;
  userDisplayName: string;
  userEmail: string;
  dominantEmotion: string;
  verdict: string;
  indicators: any;
  facialReading: string;
  conseilAura: string;
  createdAt: string;
}

export default function Sentiments() {
  const [scans, setScans] = useState<SentimentScan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [emotionFilter, setEmotionFilter] = useState<string>('ALL');

  // Detail Modal state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedScan, setSelectedScan] = useState<SentimentScan | null>(null);

  // Delete Confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingScan, setDeletingScan] = useState<SentimentScan | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string>('');

  const fetchScans = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:3000/api/admin/sentiments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        window.location.reload();
        return;
      }

      if (!response.ok) {
        throw new Error(`Erreur serveur (${response.status}) : Impossible de charger l'historique.`);
      }

      const data = await response.json();
      setScans(data);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors du chargement des analyses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  // Filter logic
  const filteredScans = scans.filter((scan) => {
    const matchesSearch =
      (scan.userDisplayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (scan.userEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (scan.verdict || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEmotion =
      emotionFilter === 'ALL' ||
      (scan.dominantEmotion || '').toUpperCase() === emotionFilter.toUpperCase();

    return matchesSearch && matchesEmotion;
  });

  // Extract unique emotions for the filter dropdown
  const uniqueEmotions = Array.from(new Set(scans.map((s) => s.dominantEmotion).filter(Boolean)));

  // Open detail modal
  const openDetailModal = (scan: SentimentScan) => {
    setSelectedScan(scan);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedScan(null);
  };

  // Open delete modal
  const openDeleteModal = (scan: SentimentScan) => {
    setDeletingScan(scan);
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingScan(null);
    setDeleteError('');
  };

  // Delete scan
  const handleDeleteScan = async () => {
    if (!deletingScan) return;
    setDeleteLoading(true);
    setDeleteError('');
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:3000/api/admin/sentiments/${deletingScan.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur (${response.status}) : Impossible de supprimer ce scan.`);
      }

      closeDeleteModal();
      await fetchScans();
    } catch (err: any) {
      setDeleteError(err.message || 'Une erreur est survenue.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Helper to get stylized color classes for emotions
  const getEmotionBadgeClass = (emotion: string) => {
    const e = (emotion || '').toLowerCase();
    if (e.includes('joie') || e.includes('joy') || e.includes('heureux') || e.includes('cont') || e.includes('excit')) {
      return 'badge-tier premium';
    }
    if (e.includes('trist') || e.includes('sad') || e.includes('mélan') || e.includes('fatig')) {
      return 'badge-tier free';
    }
    if (e.includes('col') || e.includes('ang') || e.includes('irrit') || e.includes('stress')) {
      return 'badge-tier danger-mood';
    }
    return 'badge-tier active-mood';
  };

  // Helper to safely parse indicators
  const getIndicatorEntries = (indicators: any): [string, string][] => {
    try {
      if (!indicators) return [];
      let parsed = indicators;
      if (typeof indicators === 'string') {
        parsed = JSON.parse(indicators);
      }
      if (typeof parsed !== 'object' || Array.isArray(parsed)) return [];
      return Object.entries(parsed).map(([key, value]) => [key, String(value)]);
    } catch {
      return [];
    }
  };

  return (
    <div className="dashboard-content">
      {/* 1. Header */}
      <div className="dashboard-title-row">
        <div>
          <h1 className="dashboard-page-title">Analyses de Sentiments (IA)</h1>
          <p className="dashboard-page-subtitle">
            Supervisez les résultats des analyses émotionnelles générées par l'IA Gemini.
          </p>
        </div>
        <span className="badge-total">
          {scans.length} {scans.length > 1 ? 'Analyses' : 'Analyse'} enregistrées
        </span>
      </div>

      {/* 2. Search & Filters */}
      <div className="glass-panel users-actions-row">
        <div className="search-wrapper">
          <Search size={18} className="input-icon-left" />
          <input
            type="text"
            className="form-input"
            placeholder="Rechercher par utilisateur, verdict..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters-wrapper">
          <select
            className="filter-select"
            value={emotionFilter}
            onChange={(e) => setEmotionFilter(e.target.value)}
          >
            <option value="ALL">Toutes les émotions</option>
            {uniqueEmotions.map((emotion) => (
              <option key={emotion} value={emotion}>
                {emotion}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Main content states */}
      {loading ? (
        <div className="glass-panel loading-box">
          <div className="loading-spinner"></div>
          <p>Chargement des analyses en cours...</p>
        </div>
      ) : error ? (
        <div className="glass-panel error-alert-box">
          <div className="error-icon-wrapper">
            <AlertCircle size={24} />
          </div>
          <h4 className="error-title-text">Erreur de chargement</h4>
          <p className="error-subtitle-text">{error}</p>
          <button className="btn-retry" onClick={fetchScans}>
            Réessayer
          </button>
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="recent-checkins-section glass-panel">
          <div className="table-wrapper empty flex-center">
            <div className="empty-state-card">
              <Brain size={48} className="empty-icon" />
              <p className="empty-title">Aucune analyse trouvée</p>
              <p className="empty-subtitle">
                Aucune analyse de sentiments ne correspond à vos filtres.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Émotion Dominante</th>
                <th>Verdict IA</th>
                <th>Date du Scan</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredScans.map((scan) => {
                const initials = scan.userDisplayName
                  ? scan.userDisplayName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
                  : '?';

                return (
                  <tr key={scan.id}>
                    <td>
                      <div className="user-profile-cell">
                        <div className="user-avatar-circle" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
                          <span>{initials}</span>
                        </div>
                        <div className="user-details">
                          <span className="user-display-name">{scan.userDisplayName}</span>
                          <span className="user-email-sub">{scan.userEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={getEmotionBadgeClass(scan.dominantEmotion)}>
                        {scan.dominantEmotion}
                      </span>
                    </td>
                    <td style={{ maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {scan.verdict || '—'}
                    </td>
                    <td>
                      {new Date(scan.createdAt).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button
                          type="button"
                          className="btn-action-icon edit"
                          onClick={() => openDetailModal(scan)}
                          title="Voir les détails"
                          style={{ color: 'var(--primary)', borderColor: 'rgba(139, 92, 246, 0.15)' }}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          className="btn-action-icon delete"
                          onClick={() => openDeleteModal(scan)}
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ============================================================
          DETAILS MODAL
         ============================================================ */}
      {showDetailModal && selectedScan && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeDetailModal(); }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-icon-badge" style={{ background: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)' }}>
                  <Brain size={20} />
                </div>
                <div>
                  <h3 className="modal-title">Détails de l'analyse</h3>
                  <p className="modal-subtitle">Effectuée le {new Date(selectedScan.createdAt).toLocaleString('fr-FR')}</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={closeDetailModal}><X size={16} /></button>
            </div>

            <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
              {/* Privacy notice */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.15)', padding: '10px 14px', borderRadius: '10px' }}>
                <ShieldOff size={16} style={{ color: '#F59E0B', flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: '#6B7280' }}>Les photos et enregistrements vocaux sont privés et non accessibles depuis le panneau admin.</span>
              </div>

              {/* User info */}
              <div className="form-group">
                <label className="form-label">Utilisateur</label>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#1F2937' }}>
                  {selectedScan.userDisplayName || 'Inconnu'}
                </p>
                <p style={{ fontSize: '12px', color: '#6B7280' }}>{selectedScan.userEmail || 'N/A'}</p>
              </div>

              {/* Emotion */}
              <div className="form-group">
                <label className="form-label">Émotion détectée</label>
                <div>
                  <span className={getEmotionBadgeClass(selectedScan.dominantEmotion)} style={{ fontSize: '13px', padding: '6px 12px' }}>
                    {selectedScan.dominantEmotion || 'Non définie'}
                  </span>
                </div>
              </div>

              {/* Verdict */}
              <div className="form-group">
                <label className="form-label">Verdict de l'IA</label>
                <div style={{ fontSize: '13px', color: '#1F2937', lineHeight: '1.6', background: 'rgba(139, 92, 246, 0.04)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(139, 92, 246, 0.12)' }}>
                  {selectedScan.verdict || 'Aucun verdict disponible.'}
                </div>
              </div>

              {/* Facial reading */}
              {selectedScan.facialReading && (
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Smile size={14} />
                    <span>Analyse émotionnelle</span>
                  </label>
                  <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                    {selectedScan.facialReading}
                  </div>
                </div>
              )}

              {/* Conseil Aura */}
              {selectedScan.conseilAura && (
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Compass size={14} />
                    <span>Conseil Aura & Recommandations</span>
                  </label>
                  <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                    {selectedScan.conseilAura}
                  </div>
                </div>
              )}

              {/* Indicators */}
              {(() => {
                const entries = getIndicatorEntries(selectedScan.indicators);
                if (entries.length === 0) return null;
                return (
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Brain size={14} />
                      <span>Indicateurs émotionnels</span>
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {entries.map(([key, value]) => (
                        <div key={key} style={{ padding: '10px 14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(139, 92, 246, 0.12)' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'capitalize' }}>
                            {key}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#8B5CF6' }}>
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeDetailModal}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          DELETE CONFIRMATION MODAL
         ============================================================ */}
      {showDeleteModal && deletingScan && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeDeleteModal(); }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-icon-badge" style={{ background: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)' }}>
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 className="modal-title">Supprimer l'analyse ?</h3>
                  <p className="modal-subtitle">Cette action est irréversible.</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={closeDeleteModal}><X size={16} /></button>
            </div>
            <div className="modal-body">
              {deleteError && <div className="modal-error-banner"><AlertCircle size={16} /><span>{deleteError}</span></div>}
              <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '20px' }}>
                Êtes-vous sûr de vouloir supprimer définitivement cette analyse de sentiments effectuée pour{' '}
                <strong style={{ color: '#1F2937' }}>{deletingScan.userDisplayName}</strong> ?
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeDeleteModal}>Annuler</button>
              <button
                className="btn-submit"
                onClick={handleDeleteScan}
                disabled={deleteLoading}
                style={{ background: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)', boxShadow: '0 4px 15px rgba(239,68,68,0.25)' }}
              >
                {deleteLoading ? (
                  <><div className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: '#FFF' }}></div><span>Suppression...</span></>
                ) : (
                  <><Trash2 size={16} /><span>Supprimer</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
