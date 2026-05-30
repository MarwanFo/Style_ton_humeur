import React from 'react';
import { Users, ShieldAlert, Award, Calendar, Flame, TrendingUp } from 'lucide-react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

// Register ChartJS elements
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Dashboard() {
  // Empty states / 0 values as requested by user
  const stats = {
    totalUsers: 0,
    premiumUsers: 0,
    activeStreaks: 0,
    totalScansToday: 0
  };

  // Chart configuration for empty moods distribution
  const doughnutData = {
    labels: ['Joyeux', 'Calme', 'Fatigué', 'Stressé', 'Audacieux'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0], // Empty state / 0
        backgroundColor: [
          'rgba(139, 92, 246, 0.6)', // Violet
          'rgba(236, 72, 153, 0.6)',  // Rose
          'rgba(99, 102, 241, 0.6)',  // Indigo
          'rgba(245, 158, 11, 0.6)',  // Ambre
          'rgba(16, 185, 129, 0.6)'   // Emeraude
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
        data: [0, 0, 0, 0, 0, 0, 0], // 0 values
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

  return (
    <div className="dashboard-content">
      <div className="dashboard-title-row">
        <div>
          <h1 className="dashboard-page-title">Vue d'ensemble</h1>
          <p className="dashboard-page-subtitle">Statistiques générales de la plateforme Aura Studio.</p>
        </div>
        <div className="date-badge glass-panel">
          <Calendar size={16} />
          <span>Aujourd'hui, {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
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
            <h2 className="stat-value">{stats.totalUsers}</h2>
            <p className="stat-trend neutral">Aucun inscrit enregistré</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-label">Abonnés Premium</span>
            <div className="stat-icon-wrapper pink">
              <Award size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <h2 className="stat-value">{stats.premiumUsers}</h2>
            <p className="stat-trend neutral">0% du total de la plateforme</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-label">Séries actives (Streak)</span>
            <div className="stat-icon-wrapper indigo">
              <Flame size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <h2 className="stat-value">{stats.activeStreaks}</h2>
            <p className="stat-trend neutral">Moyenne de 0 jour/utilisateur</p>
          </div>
        </div>

        <div className="stat-card glass-panel">
          <div className="stat-card-header">
            <span className="stat-label">Analyses d'humeur aujourd'hui</span>
            <div className="stat-icon-wrapper green">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="stat-card-body">
            <h2 className="stat-value">{stats.totalScansToday}</h2>
            <p className="stat-trend neutral">Aucun scan IA effectué aujourd'hui</p>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="charts-grid">
        <div className="chart-card glass-panel">
          <h3 className="chart-card-title">Distribution des Humeurs</h3>
          <div className="chart-container flex-center" style={{ height: '240px', position: 'relative' }}>
            <Doughnut data={doughnutData} options={chartOptions} />
            <div className="chart-empty-overlay flex-center">
              <p className="empty-message">Aucune donnée disponible</p>
            </div>
          </div>
        </div>

        <div className="chart-card glass-panel">
          <h3 className="chart-card-title">Activité Hebdomadaire (Scans)</h3>
          <div className="chart-container flex-center" style={{ height: '240px', position: 'relative' }}>
            <Bar data={barData} options={chartOptions} />
            <div className="chart-empty-overlay flex-center">
              <p className="empty-message">Aucune donnée disponible</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Check-ins List (Empty State) */}
      <div className="recent-checkins-section glass-panel">
        <div className="section-header-row">
          <h3 className="section-title">Dernières Analyses d'Humeur Mobile</h3>
          <span className="badge-total">0 Enregistré</span>
        </div>
        <div className="table-wrapper empty flex-center">
          <div className="empty-state-card">
            <ShieldAlert size={48} className="empty-icon" />
            <p className="empty-title">Aucune analyse d'humeur récente</p>
            <p className="empty-subtitle">Les looks et les analyses d'humeur générés par les utilisateurs s'afficheront ici en temps réel.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
