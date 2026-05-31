import React from 'react';
import { Users, ShieldAlert, Award, Calendar, Flame, TrendingUp, RefreshCcw } from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { useDashboardStats } from '../hooks/useDashboardStats';

// Register ChartJS elements
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Dashboard() {
  const { stats, loading, error, refresh } = useDashboardStats();

  // Chart configuration for moods distribution
  const doughnutData = {
    labels: ['Joyeux', 'Calme', 'Confiant', 'Stressé', 'Nostalgique'],
    datasets: [
      {
        data: stats ? [
          stats.mood_distribution.joyeux,
          stats.mood_distribution.calme,
          stats.mood_distribution.confiant,
          stats.mood_distribution.stressé,
          stats.mood_distribution.nostalgique
        ] : [0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(139, 92, 246, 0.6)', // Violet (Joyeux)
          'rgba(16, 185, 129, 0.6)',  // Emeraude (Calme)
          'rgba(99, 102, 2 indigo)',  // Indigo (Confiant)
          'rgba(245, 158, 11, 0.6)',  // Ambre (Stressé)
          'rgba(236, 72, 153, 0.6)'   // Rose (Nostalgique)
        ],
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Scans par jour',
        data: [0, 0, 0, 0, 0, 0, 0], // 0 values for now
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        borderColor: '#8B5CF6',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#9CA3AF',
          font: { family: 'Inter' }
        }
      }
    }
  };

  if (loading && !stats) {
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
          <h1 className="dashboard-page-title">Vue d'ensemble</h1>
          <p className="dashboard-page-subtitle">Statistiques générales de la plateforme Aura Studio.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={refresh} className="date-badge glass-panel hover:bg-white/10 transition-colors">
            <RefreshCcw size={16} />
            <span>Actualiser</span>
          </button>
          <div className="date-badge glass-panel">
            <Calendar size={16} />
            <span>Aujourd'hui, {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-label">Total Utilisateurs</span>
            <div className="stat-icon-wrapper purple">
              <Users size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <h2 className="stat-value">{stats?.total_users || 0}</h2>
            <p className="stat-trend neutral">Utilisateurs enregistrés</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-label">Daily Check-ins</span>
            <div className="stat-icon-wrapper pink">
              <Award size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <h2 className="stat-value">{stats?.total_checkins || 0}</h2>
            <p className="stat-trend neutral">Total des interactions</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-label">Moyenne Streak</span>
            <div className="stat-icon-wrapper indigo">
              <Flame size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <h2 className="stat-value">{stats?.avg_streak || 0} j</h2>
            <p className="stat-trend neutral">Série moyenne par utilisateur</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-label">Badges Débloqués</span>
            <div className="stat-icon-wrapper green">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <h2 className="stat-value">{stats?.total_badges_unlocked || 0}</h2>
            <p className="stat-trend neutral">Récompenses obtenues</p>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="charts-grid">
        <div className="chart-card glass-panel">
          <h3 className="chart-card-title">Distribution des Humeurs</h3>
          <div className="chart-container flex-center" style={{ height: '240px', position: 'relative' }}>
            <Doughnut data={doughnutData} options={chartOptions} />
            {(!stats || Object.values(stats.mood_distribution).every(v => v === 0)) && (
              <div className="chart-empty-overlay flex-center">
                <p className="empty-message">Aucune donnée disponible</p>
              </div>
            )}
          </div>
        </div>

        <div className="chart-card glass-panel">
          <h3 className="chart-card-title">Activité Hebdomadaire (Scans)</h3>
          <div className="chart-container flex-center" style={{ height: '240px', position: 'relative' }}>
            <Bar data={barData} options={chartOptions} />
            <div className="chart-empty-overlay flex-center">
              <p className="empty-message">Données à venir</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
