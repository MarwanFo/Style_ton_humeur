import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Plus, Search, Edit2, Trash2, Award, Flame, AlertCircle, X, UserPlus, Pencil, ShieldAlert } from 'lucide-react';

interface UserStreak {
  currentStreak: number;
  maxStreak: number;
}

interface User {
  id: number;
  email: string;
  displayName: string;
  gender: string;
  age: number;
  role?: string;
  tier?: string;
  streak?: UserStreak;
  createdAt: string;
}

// --- Form Interfaces ---

interface CreateUserForm {
  displayName: string;
  email: string;
  password: string;
  age: string;
  gender: string;
}

interface EditUserForm {
  displayName: string;
  age: string;
  gender: string;
  role: string;
  tier: string;
  currentStreak: string;
}

const EMPTY_CREATE_FORM: CreateUserForm = {
  displayName: '',
  email: '',
  password: '',
  age: '',
  gender: 'homme',
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<string>('ALL');
  const [tierFilter, setTierFilter] = useState<string>('ALL');

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserForm>(EMPTY_CREATE_FORM);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createValidation, setCreateValidation] = useState<Record<string, string>>({});

  // Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditUserForm>({ displayName: '', age: '', gender: '', role: '', tier: '', currentStreak: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editValidation, setEditValidation] = useState<Record<string, string>>({});

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // ===================== FETCH =====================

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:3000/api/admin/users', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token || ''}` },
      });
      if (!response.ok) throw new Error(`Erreur serveur (${response.status}).`);
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger les utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ===================== FILTERS =====================

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = genderFilter === 'ALL' || user.gender?.toUpperCase() === genderFilter.toUpperCase();
    const userTier = user.tier || 'FREE';
    const matchesTier = tierFilter === 'ALL' || userTier.toUpperCase() === tierFilter.toUpperCase();
    return matchesSearch && matchesGender && matchesTier;
  });

  // ===================== CREATE =====================

  const openCreateModal = () => {
    setCreateForm(EMPTY_CREATE_FORM);
    setCreateError(null);
    setCreateValidation({});
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateForm(EMPTY_CREATE_FORM);
    setCreateError(null);
    setCreateValidation({});
  };

  const updateCreateField = (field: keyof CreateUserForm, value: string) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
    if (createValidation[field]) {
      setCreateValidation((prev) => { const n = { ...prev }; delete n[field]; return n; });
    }
  };

  const validateCreate = (): boolean => {
    const e: Record<string, string> = {};
    if (!createForm.displayName.trim()) e.displayName = 'Obligatoire.';
    if (!createForm.email.trim()) e.email = 'Obligatoire.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.email.trim())) e.email = 'Email invalide.';
    if (!createForm.password.trim()) e.password = 'Obligatoire.';
    else if (createForm.password.trim().length < 6) e.password = 'Min. 6 caractères.';
    if (!createForm.age.trim()) e.age = 'Obligatoire.';
    else { const n = parseInt(createForm.age, 10); if (isNaN(n) || n < 1 || n > 120) e.age = 'Entre 1 et 120.'; }
    setCreateValidation(e);
    return Object.keys(e).length === 0;
  };

  const handleCreateUser = async () => {
    if (!validateCreate()) return;
    setCreateLoading(true);
    setCreateError(null);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('http://localhost:3000/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token || ''}` },
        body: JSON.stringify({
          displayName: createForm.displayName.trim(),
          email: createForm.email.trim().toLowerCase(),
          password: createForm.password.trim(),
          age: parseInt(createForm.age, 10),
          gender: createForm.gender,
        }),
      });
      if (res.status === 409) { setCreateError('Un utilisateur avec cet email existe déjà.'); return; }
      if (!res.ok) { const d = await res.json().catch(() => null); throw new Error(d?.message || `Erreur (${res.status}).`); }
      closeCreateModal();
      await fetchUsers();
    } catch (err: any) {
      setCreateError(err.message || 'Impossible de créer cet utilisateur.');
    } finally {
      setCreateLoading(false);
    }
  };

  // ===================== EDIT =====================

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditForm({
      displayName: user.displayName || '',
      age: String(user.age || ''),
      gender: user.gender || 'homme',
      role: user.role || 'USER',
      tier: user.tier || 'FREE',
      currentStreak: String(user.streak?.currentStreak || 0),
    });
    setEditError(null);
    setEditValidation({});
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditError(null);
    setEditValidation({});
  };

  const updateEditField = (field: keyof EditUserForm, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    if (editValidation[field]) {
      setEditValidation((prev) => { const n = { ...prev }; delete n[field]; return n; });
    }
  };

  const validateEdit = (): boolean => {
    const e: Record<string, string> = {};
    if (!editForm.displayName.trim()) e.displayName = 'Obligatoire.';
    if (!editForm.age.trim()) e.age = 'Obligatoire.';
    else { const n = parseInt(editForm.age, 10); if (isNaN(n) || n < 1 || n > 120) e.age = 'Entre 1 et 120.'; }
    const streak = parseInt(editForm.currentStreak, 10);
    if (isNaN(streak) || streak < 0) e.currentStreak = 'Nombre positif requis.';
    setEditValidation(e);
    return Object.keys(e).length === 0;
  };

  const handleEditUser = async () => {
    if (!editingUser || !validateEdit()) return;
    setEditLoading(true);
    setEditError(null);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`http://localhost:3000/api/admin/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token || ''}` },
        body: JSON.stringify({
          displayName: editForm.displayName.trim(),
          age: parseInt(editForm.age, 10),
          gender: editForm.gender,
          role: editForm.role,
          tier: editForm.tier,
          currentStreak: parseInt(editForm.currentStreak, 10),
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.message || `Erreur serveur (${res.status}).`);
      }
      closeEditModal();
      await fetchUsers();
    } catch (err: any) {
      setEditError(err.message || "Impossible de modifier l'utilisateur.");
    } finally {
      setEditLoading(false);
    }
  };

  // ===================== DELETE =====================

  const openDeleteModal = (user: User) => {
    setDeletingUser(user);
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingUser(null);
    setDeleteError(null);
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`http://localhost:3000/api/admin/users/${deletingUser.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token || ''}` },
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.message || `Erreur serveur (${res.status}).`);
      }
      closeDeleteModal();
      await fetchUsers();
    } catch (err: any) {
      setDeleteError(err.message || "Impossible de supprimer l'utilisateur.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ===================== RENDER HELPERS =====================

  const renderFieldError = (msg?: string) =>
    msg ? <span style={{ fontSize: '12px', color: 'var(--danger)', fontWeight: 500 }}>{msg}</span> : null;

  const errorBorderStyle = (field: string, errors: Record<string, string>) =>
    errors[field] ? { borderColor: 'var(--danger)' } : {};

  // ===================== JSX =====================

  return (
    <div className="dashboard-content">
      {/* Header */}
      <div className="dashboard-title-row">
        <div>
          <h1 className="dashboard-page-title">Gestion des Utilisateurs</h1>
          <p className="dashboard-page-subtitle">Consultez, recherchez et gérez les profils utilisateurs d'Aura Studio.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="badge-total">{users.length} {users.length > 1 ? 'Utilisateurs' : 'Utilisateur'} au total</span>
          <button className="btn-primary" onClick={openCreateModal}>
            <Plus size={16} /><span>Ajouter un utilisateur</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel users-actions-row">
        <div className="search-wrapper">
          <Search size={18} className="input-icon-left" />
          <input type="text" className="form-input" placeholder="Rechercher par pseudo ou email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="filters-wrapper">
          <select className="filter-select" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
            <option value="ALL">Tous les genres</option>
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
            <option value="autre">Autre</option>
          </select>
          <select className="filter-select" value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}>
            <option value="ALL">Tous les forfaits</option>
            <option value="FREE">FREE</option>
            <option value="PREMIUM">PREMIUM</option>
          </select>
        </div>
      </div>

      {/* Table / States */}
      {loading ? (
        <div className="glass-panel loading-box"><div className="loading-spinner"></div><p>Chargement des utilisateurs en cours...</p></div>
      ) : error ? (
        <div className="glass-panel error-alert-box">
          <div className="error-icon-wrapper"><AlertCircle size={24} /></div>
          <h4 className="error-title-text">Erreur de chargement</h4>
          <p className="error-subtitle-text">{error}</p>
          <button className="btn-retry" onClick={fetchUsers}>Réessayer</button>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="recent-checkins-section glass-panel">
          <div className="table-wrapper empty flex-center">
            <div className="empty-state-card">
              <UsersIcon size={48} className="empty-icon" />
              <p className="empty-title">Aucun utilisateur trouvé</p>
              <p className="empty-subtitle">Ajustez vos filtres ou votre recherche.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Rôle</th>
                <th>Forfait</th>
                <th>Série Actuelle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const initials = user.displayName ? user.displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?';
                const userTier = user.tier || 'FREE';
                const userRole = user.role || 'Utilisateur';
                return (
                  <tr key={user.id}>
                    <td>
                      <div className="user-profile-cell">
                        <div className="user-avatar-circle"><span>{initials}</span></div>
                        <div className="user-details">
                          <span className="user-display-name">{user.displayName}</span>
                          <span className="user-email-sub">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{userRole}</td>
                    <td>
                      <span className={`badge-tier ${userTier.toLowerCase()}`}>
                        {userTier === 'PREMIUM' && <Award size={12} style={{ marginRight: '4px' }} />}
                        {userTier}
                      </span>
                    </td>
                    <td>
                      <div className="streak-counter"><Flame size={16} /><span>{user.streak?.currentStreak || 0} j</span></div>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button className="btn-action-icon edit" onClick={() => openEditModal(user)} title="Modifier"><Edit2 size={14} /></button>
                        <button className="btn-action-icon delete" onClick={() => openDeleteModal(user)} title="Supprimer"><Trash2 size={14} /></button>
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
          CREATE USER MODAL
         ============================================================ */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeCreateModal(); }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-icon-badge"><UserPlus size={20} /></div>
                <div>
                  <h3 className="modal-title">Nouvel Utilisateur</h3>
                  <p className="modal-subtitle">Remplissez les informations du nouveau compte.</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={closeCreateModal}><X size={16} /></button>
            </div>
            <div className="modal-body">
              {createError && <div className="modal-error-banner"><AlertCircle size={16} /><span>{createError}</span></div>}
              <div className="form-group">
                <label className="form-label">Nom complet *</label>
                <input type="text" className="form-input" placeholder="Ex: Marwane Faridi" value={createForm.displayName} onChange={(e) => updateCreateField('displayName', e.target.value)} style={errorBorderStyle('displayName', createValidation)} />
                {renderFieldError(createValidation.displayName)}
              </div>
              <div className="form-group">
                <label className="form-label">Adresse email *</label>
                <input type="email" className="form-input" placeholder="utilisateur@example.com" value={createForm.email} onChange={(e) => updateCreateField('email', e.target.value)} style={errorBorderStyle('email', createValidation)} />
                {renderFieldError(createValidation.email)}
              </div>
              <div className="form-group">
                <label className="form-label">Mot de passe *</label>
                <input type="password" className="form-input" placeholder="Minimum 6 caractères" value={createForm.password} onChange={(e) => updateCreateField('password', e.target.value)} style={errorBorderStyle('password', createValidation)} />
                {renderFieldError(createValidation.password)}
              </div>
              <div className="modal-form-row">
                <div className="form-group">
                  <label className="form-label">Âge *</label>
                  <input type="number" className="form-input" placeholder="Ex: 22" min="1" max="120" value={createForm.age} onChange={(e) => updateCreateField('age', e.target.value)} style={errorBorderStyle('age', createValidation)} />
                  {renderFieldError(createValidation.age)}
                </div>
                <div className="form-group">
                  <label className="form-label">Genre *</label>
                  <select className="filter-select" value={createForm.gender} onChange={(e) => updateCreateField('gender', e.target.value)} style={{ width: '100%' }}>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeCreateModal}>Annuler</button>
              <button className="btn-submit" onClick={handleCreateUser} disabled={createLoading}>
                {createLoading ? (<><div className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div><span>Création...</span></>) : (<><UserPlus size={16} /><span>Créer le compte</span></>)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          EDIT USER MODAL
         ============================================================ */}
      {showEditModal && editingUser && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeEditModal(); }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-icon-badge" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}>
                  <Pencil size={20} />
                </div>
                <div>
                  <h3 className="modal-title">Modifier l'utilisateur</h3>
                  <p className="modal-subtitle">{editingUser.email}</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={closeEditModal}><X size={16} /></button>
            </div>
            <div className="modal-body">
              {editError && <div className="modal-error-banner"><AlertCircle size={16} /><span>{editError}</span></div>}

              <div className="form-group">
                <label className="form-label">Nom d'affichage *</label>
                <input type="text" className="form-input" value={editForm.displayName} onChange={(e) => updateEditField('displayName', e.target.value)} style={errorBorderStyle('displayName', editValidation)} />
                {renderFieldError(editValidation.displayName)}
              </div>

              <div className="modal-form-row">
                <div className="form-group">
                  <label className="form-label">Âge *</label>
                  <input type="number" className="form-input" min="1" max="120" value={editForm.age} onChange={(e) => updateEditField('age', e.target.value)} style={errorBorderStyle('age', editValidation)} />
                  {renderFieldError(editValidation.age)}
                </div>
                <div className="form-group">
                  <label className="form-label">Genre</label>
                  <select className="filter-select" value={editForm.gender} onChange={(e) => updateEditField('gender', e.target.value)} style={{ width: '100%' }}>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>

              <div className="modal-form-row">
                <div className="form-group">
                  <label className="form-label">Rôle</label>
                  <select className="filter-select" value={editForm.role} onChange={(e) => updateEditField('role', e.target.value)} style={{ width: '100%' }}>
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Forfait</label>
                  <select className="filter-select" value={editForm.tier} onChange={(e) => updateEditField('tier', e.target.value)} style={{ width: '100%' }}>
                    <option value="FREE">FREE</option>
                    <option value="PREMIUM">PREMIUM</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Score Série (Streak) 🔥</label>
                <input type="number" className="form-input" min="0" value={editForm.currentStreak} onChange={(e) => updateEditField('currentStreak', e.target.value)} style={errorBorderStyle('currentStreak', editValidation)} />
                {renderFieldError(editValidation.currentStreak)}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeEditModal}>Annuler</button>
              <button className="btn-submit" onClick={handleEditUser} disabled={editLoading}>
                {editLoading ? (<><div className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></div><span>Mise à jour...</span></>) : (<><Pencil size={16} /><span>Enregistrer</span></>)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          DELETE CONFIRMATION MODAL
         ============================================================ */}
      {showDeleteModal && deletingUser && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeDeleteModal(); }}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-icon-badge" style={{ background: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)' }}>
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 className="modal-title">Confirmer la suppression</h3>
                  <p className="modal-subtitle">Cette action est irréversible.</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={closeDeleteModal}><X size={16} /></button>
            </div>
            <div className="modal-body">
              {deleteError && <div className="modal-error-banner"><AlertCircle size={16} /><span>{deleteError}</span></div>}

              <div className="delete-confirm-content">
                <div className="delete-user-preview">
                  <div className="user-avatar-circle" style={{ width: 48, height: 48, fontSize: 16 }}>
                    <span>{deletingUser.displayName ? deletingUser.displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?'}</span>
                  </div>
                  <div className="user-details">
                    <span className="user-display-name" style={{ fontSize: '15px' }}>{deletingUser.displayName}</span>
                    <span className="user-email-sub">{deletingUser.email}</span>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '20px', marginTop: '16px' }}>
                  Êtes-vous sûr de vouloir supprimer cet utilisateur ? Toutes ses données (check-ins, recommandations, badges, scans) seront définitivement supprimées.
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeDeleteModal}>Annuler</button>
              <button
                className="btn-submit"
                onClick={handleDeleteUser}
                disabled={deleteLoading}
                style={{ background: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)', boxShadow: '0 4px 15px rgba(239,68,68,0.25)' }}
              >
                {deleteLoading ? (<><div className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: '#FFF' }}></div><span>Suppression...</span></>) : (<><Trash2 size={16} /><span>Supprimer définitivement</span></>)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
