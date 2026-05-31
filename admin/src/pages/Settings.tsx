import React, { useState, useEffect } from 'react';
import { Sliders, CreditCard, Save, AlertCircle, CheckCircle, RefreshCcw } from 'lucide-react';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [priceMad, setPriceMad] = useState<string>('99');
  const [isTryOnPremium, setIsTryOnPremium] = useState(true);
  const [isBeautyPremium, setIsBeautyPremium] = useState(true);
  const [isVoicePremium, setIsVoicePremium] = useState(true);
  const [isSentimentsPremium, setIsSentimentsPremium] = useState(false);
  const [isMusicPremium, setIsMusicPremium] = useState(false);

  const fetchConfig = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:3000/api/system-config', {
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
        throw new Error(`Erreur serveur (${response.status}) : Impossible de charger la configuration.`);
      }

      const data = await response.json();
      setPriceMad(String(data.premiumPriceMad || 99));
      setIsTryOnPremium(!!data.isTryOnPremium);
      setIsBeautyPremium(!!data.isBeautyPremium);
      setIsVoicePremium(!!data.isVoicePremium);
      setIsSentimentsPremium(!!data.isSentimentsPremium);
      setIsMusicPremium(!!data.isMusicPremium);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors du chargement des configurations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(priceMad);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Veuillez saisir un prix valide supérieur à 0.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:3000/api/system-config', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`,
        },
        body: JSON.stringify({
          premiumPriceMad: parsedPrice,
          isTryOnPremium,
          isBeautyPremium,
          isVoicePremium,
          isSentimentsPremium,
          isMusicPremium,
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem('admin_token');
        window.location.reload();
        return;
      }

      if (!response.ok) {
        const d = await response.json().catch(() => null);
        throw new Error(d?.message || `Erreur serveur (${response.status}).`);
      }

      setSuccess('La configuration du système a été mise à jour avec succès ! ✨');
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Impossible d\'enregistrer la configuration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-content">
      {/* Header */}
      <div className="dashboard-title-row">
        <div>
          <h1 className="dashboard-page-title">Gestion des Paiements & Options</h1>
          <p className="dashboard-page-subtitle">Configurez les options Premium d'Aura et déterminez le prix de l'abonnement.</p>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel loading-box">
          <div className="loading-spinner"></div>
          <p>Chargement des configurations système en cours...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
          
          {error && (
            <div className="error-banner" style={{ margin: 0, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', color: 'var(--success)', padding: '14px 18px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 600 }}>
              <CheckCircle size={18} />
              <span>{success}</span>
            </div>
          )}

          {/* Pricing settings card */}
          <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <CreditCard size={20} style={{ color: 'var(--primary)' }} />
              <span>Tarification Aura Premium</span>
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
              Configurez le tarif mensuel récurrent prélevé aux membres Premium. Les montants sont affichés en Dirhams Marocains (MAD) sur l'ensemble de l'application mobile.
            </p>

            <div className="form-group" style={{ maxWidth: '300px', margin: 0 }}>
              <label className="form-label">Prix Premium (MAD / mois) *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  className="form-input"
                  value={priceMad}
                  onChange={(e) => setPriceMad(e.target.value)}
                  placeholder="99"
                  min="1"
                  style={{ width: '100%', paddingRight: '60px', fontWeight: 700 }}
                  disabled={saving}
                />
                <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)', fontSize: '14px' }}>
                  MAD
                </span>
              </div>
            </div>
          </div>

          {/* Feature toggles card */}
          <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
              <Sliders size={20} style={{ color: 'var(--primary)' }} />
              <span>Statut des fonctionnalités (Gratuit / Premium)</span>
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
              Activez pour rendre une fonctionnalité payante (accessible uniquement aux membres Premium), ou désactivez pour la rendre gratuite pour tous les utilisateurs.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
              
              {/* VTON Switch */}
              <div className="switch-container">
                <div className="switch-details">
                  <span className="switch-title">👗 Essayage Virtuel Cabine IA (VTON)</span>
                  <span className="switch-description">Restreint les essayages aux abonnés Premium (comprend 3 essais gratuits pour tester).</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isTryOnPremium}
                    onChange={(e) => setIsTryOnPremium(e.target.checked)}
                    disabled={saving}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Beauty Switch */}
              <div className="switch-container">
                <div className="switch-details">
                  <span className="switch-title">🎨 Colorimétrie & Beauté IA</span>
                  <span className="switch-description">Recommande les couleurs saisonnières et le maquillage idéal en version Premium.</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isBeautyPremium}
                    onChange={(e) => setIsBeautyPremium(e.target.checked)}
                    disabled={saving}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Voice Switch */}
              <div className="switch-container">
                <div className="switch-details">
                  <span className="switch-title">🎙️ Assistant Vocal Pocket Stylist</span>
                  <span className="switch-description">Permet de converser vocalement en temps réel avec le styliste personnel.</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isVoicePremium}
                    onChange={(e) => setIsVoicePremium(e.target.checked)}
                    disabled={saving}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Sentiments Switch */}
              <div className="switch-container">
                <div className="switch-details">
                  <span className="switch-title">🧠 Analyse Émotionnelle IA</span>
                  <span className="switch-description">Analyse les expressions du visage et le ton de la voix pour déterminer l'humeur.</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isSentimentsPremium}
                    onChange={(e) => setIsSentimentsPremium(e.target.checked)}
                    disabled={saving}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Music Switch */}
              <div className="switch-container">
                <div className="switch-details">
                  <span className="switch-title">🎵 Recommandations Musicales Spotify</span>
                  <span className="switch-description">Génère des listes de lecture d'ambiance et des thérapies sonores basées sur l'humeur.</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={isMusicPremium}
                    onChange={(e) => setIsMusicPremium(e.target.checked)}
                    disabled={saving}
                  />
                  <span className="slider"></span>
                </label>
              </div>

            </div>
          </div>

          {/* Submit button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <RefreshCcw className="animate-spin" size={16} />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Enregistrer les configurations</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
