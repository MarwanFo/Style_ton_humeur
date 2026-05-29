import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Award, ShieldAlert, LogOut, Sparkles, Image } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/secure-aura-studio-gateway');
  };

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-brand">
        <div className="brand-logo purple-gradient">
          <Sparkles size={20} className="brand-icon" />
        </div>
        <div className="brand-info">
          <span className="brand-name">Aura Studio</span>
          <span className="brand-badge">ADMIN</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <LayoutDashboard size={18} />
          <span>Vue d'ensemble</span>
        </NavLink>

        <NavLink 
          to="/users" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={(e) => e.preventDefault()}
        >
          <Users size={18} />
          <span>Utilisateurs</span>
          <span className="link-badge">Pro</span>
        </NavLink>

        <NavLink 
          to="/checkins" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={(e) => e.preventDefault()}
        >
          <Image size={18} style={{ marginRight: '1px' }} />
          <span>Analyses d'Humeur</span>
          <span className="link-badge">Pro</span>
        </NavLink>

        <NavLink 
          to="/badges" 
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          onClick={(e) => e.preventDefault()}
        >
          <Award size={18} />
          <span>Catalogue Badges</span>
          <span className="link-badge">Pro</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
