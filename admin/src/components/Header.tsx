import React from 'react';
import { Bell, Search, Shield, ChevronDown } from 'lucide-react';

export default function Header() {
  const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{"email":"admin@aurastudio.com"}');

  return (
    <header className="header glass-panel">
      {/* Search Bar */}
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="Rechercher un utilisateur, un badge..." 
          className="search-input"
          disabled
        />
      </div>

      {/* Header Actions */}
      <div className="header-actions">
        {/* Notifications Icon (0 Unread Badge) */}
        <button className="icon-btn" disabled>
          <Bell size={18} />
          <span className="badge-dot"></span>
        </button>

        <div className="divider"></div>

        {/* Profile Card */}
        <div className="admin-profile-pill">
          <div className="avatar-frame">
            <Shield size={16} className="avatar-icon" />
          </div>
          <div className="profile-details">
            <span className="profile-name">Administrateur</span>
            <span className="profile-email">{adminUser.email}</span>
          </div>
          <ChevronDown size={16} className="dropdown-arrow" />
        </div>
      </div>
    </header>
  );
}
