import React, { useState } from 'react';
import { Plus, Edit2, Trash2, ShieldAlert, Award, RefreshCcw, X } from 'lucide-react';
import { useBadges } from '../hooks/useBadges';
import type { Badge } from '../hooks/useBadges';

export default function Badges() {
  const { badges, loading, error, createBadge, updateBadge, deleteBadge, refresh } = useBadges();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    icon: '',
    thresholdDays: 1,
  });

  const handleOpenModal = (badge: Badge | null = null) => {
    if (badge) {
      setEditingBadge(badge);
      setFormData({
        code: badge.code,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        thresholdDays: badge.criteria.thresholdDays,
      });
    } else {
      setEditingBadge(null);
      setFormData({
        code: '',
        name: '',
        description: '',
        icon: '',
        thresholdDays: 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    if (editingBadge) {
      success = await updateBadge(editingBadge.id, formData);
    } else {
      success = await createBadge(formData);
    }
    if (success) setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce badge ?')) {
      await deleteBadge(id);
    }
  };

  if (loading && badges.length === 0) {
    return (
      <div className="flex-center" style={{ height: '80vh' }}>
        <RefreshCcw className="animate-spin text-purple-500" size={40} />
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="dashboard-title-row">
        <div>
          <h1 className="dashboard-page-title">Gestion des Badges</h1>
          <p className="dashboard-page-subtitle">Catalogue des récompenses débloquables par les utilisateurs.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => handleOpenModal()} className="add-btn glass-panel hover:bg-white/10 transition-colors">
            <Plus size={18} />
            <span>Créer un badge</span>
          </button>
          <button onClick={refresh} className="date-badge glass-panel hover:bg-white/10 transition-colors">
            <RefreshCcw size={16} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="error-alert glass-panel mb-6">
          <ShieldAlert size={20} className="text-red-400" />
          <p>{error}</p>
        </div>
      )}

      <div className="badges-grid stats-grid">
        {badges.map((badge) => (
          <div key={badge.id} className="stat-card glass-panel badge-admin-card">
            <div className="stat-card-header">
              <div className="badge-icon-display">{badge.icon}</div>
              <div className="badge-actions">
                <button onClick={() => handleOpenModal(badge)} className="icon-action-btn edit">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(badge.id)} className="icon-action-btn delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="stat-card-body">
              <h3 className="badge-name">{badge.name}</h3>
              <p className="badge-description">{badge.description}</p>
              <div className="badge-threshold mt-4">
                <Award size={14} className="text-purple-400" />
                <span>Palier : {badge.criteria.thresholdDays} jours</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay flex-center">
          <div className="modal-content glass-panel animate-fade-in">
            <div className="modal-header">
              <h2 className="modal-title">{editingBadge ? 'Modifier le badge' : 'Nouveau badge'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="close-modal-btn">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Code Unique</label>
                <input 
                  type="text" 
                  value={formData.code} 
                  onChange={(e) => setFormData({...formData, code: e.target.value})} 
                  placeholder="ex: mood_master_7d"
                  required
                />
              </div>
              <div className="form-group">
                <label>Nom du badge</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="ex: Maître de l'Humeur"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  placeholder="Décrivez comment obtenir ce badge..."
                  required
                />
              </div>
              <div className="form-group">
                <label>Icône (Emoji)</label>
                <input 
                  type="text" 
                  value={formData.icon} 
                  onChange={(e) => setFormData({...formData, icon: e.target.value})} 
                  placeholder="ex: ✨"
                  required
                />
                <div className="icon-options">
                  {['✨', '🏆', '🎖️', '🌟', '💎', '🔥', '⚡', '🎯', '👑', '🎨', '🎵', '🌈', '🦄', '🚀', '💪', '🎮', '📚', '🏅', '🎪', '🎭'].map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({...formData, icon})}
                      className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Palier (Jours)</label>
                <input 
                  type="number" 
                  value={formData.thresholdDays} 
                  onChange={(e) => setFormData({...formData, thresholdDays: parseInt(e.target.value)})} 
                  min="1"
                  required
                />
              </div>
              <button type="submit" className="submit-btn purple-gradient">
                {editingBadge ? 'Enregistrer les modifications' : 'Créer le badge'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .badge-admin-card {
          min-height: 200px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .badge-icon-display {
          font-size: 32px;
          background: rgba(139, 92, 246, 0.1);
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
        }
        .badge-actions {
          display: flex;
          gap: 8px;
        }
        .icon-action-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #9CA3AF;
          transition: all 0.2s;
        }
        .icon-action-btn:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }
        .icon-action-btn.edit:hover { color: #8B5CF6; border-color: #8B5CF6; }
        .icon-action-btn.delete:hover { color: #EF4444; border-color: #EF4444; }
        
        .badge-name { font-size: 18px; font-weight: 700; margin-bottom: 4px; color: white; }
        .badge-description { font-size: 14px; color: #9CA3AF; line-height: 1.5; }
        .badge-threshold { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #8B5CF6; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(10px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-content { 
          width: 100%; 
          max-width: 500px; 
          max-height: 90vh;
          padding: 32px; 
          background: #1F2937 !important; 
          border: 1px solid rgba(255, 255, 255, 0.15); 
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          backdrop-filter: none !important;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-shrink: 0; }
        .modal-title { font-size: 24px; font-weight: 800; color: white; letter-spacing: -0.5px; }
        .close-modal-btn { background: rgba(255, 255, 255, 0.05); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: #9CA3AF; transition: all 0.2s; flex-shrink: 0; }
        .close-modal-btn:hover { color: white; background: rgba(255, 255, 255, 0.1); }
        
        .modal-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 13px; color: #9CA3AF; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .modal-form input, .modal-form textarea {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 14px;
          border-radius: 12px;
          color: white;
          font-size: 15px;
          outline: none;
          transition: all 0.2s;
        }
        .modal-form input:focus, .modal-form textarea:focus { border-color: #8B5CF6; background: rgba(0, 0, 0, 0.3); box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2); }
        .form-row { display: flex; gap: 16px; }
        .flex-1 { flex: 1; }
        .submit-btn { margin-top: 12px; padding: 16px; border-radius: 14px; font-weight: 700; font-size: 16px; color: white; transition: all 0.2s; cursor: pointer; border: none; }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(139, 92, 246, 0.3); }
        .submit-btn:active { transform: translateY(0); }
        .purple-gradient { background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); }
        .icon-options { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
        .icon-option { 
          width: 40px; 
          height: 40px; 
          border-radius: 10px; 
          background: rgba(0, 0, 0, 0.2); 
          border: 1px solid rgba(255, 255, 255, 0.1); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 20px; 
          cursor: pointer; 
          transition: all 0.2s; 
        }
        .icon-option:hover { background: rgba(139, 92, 246, 0.2); border-color: #8B5CF6; }
        .icon-option.selected { background: rgba(139, 92, 246, 0.3); border-color: #8B5CF6; box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.3); }
      `}</style>
    </div>
  );
}
