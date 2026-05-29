import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    try {
      // Mock login to simulate admin gateway. Since user asked for UI only first,
      // we check for standard credentials. If valid, we redirect to dashboard.
      if (email === 'admin@aurastudio.com' && password === 'admin123') {
        localStorage.setItem('admin_token', 'mock_admin_token');
        localStorage.setItem('admin_user', JSON.stringify({ email, role: 'ADMIN' }));
        navigate('/');
      } else {
        setError('Identifiants invalides ou privilèges insuffisants.');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background Glowing Orbs */}
      <div className="bg-glow-container">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="login-card glass-panel">
        <div className="login-header">
          <div className="logo-badge">
            <Shield size={28} className="logo-icon" />
          </div>
          <h1 className="login-title">Aura Studio</h1>
          <p className="login-subtitle">Portail d'Administration Sécurisé</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label className="form-label">Adresse Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon-left" />
              <input
                type="email"
                placeholder="admin@aurastudio.com"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <div className="input-with-icon">
              <Key size={18} className="input-icon-left" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary login-btn" disabled={loading}>
            {loading ? 'Connexion...' : 'Accéder au Dashboard'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="login-footer">
          <p>🔑 Accès restreint au personnel autorisé d'Aura Studio.</p>
        </div>
      </div>
    </div>
  );
}
