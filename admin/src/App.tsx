import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Badges from './pages/Badges';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import './App.css';

// Route Guard to protect admin routes
const ProtectedRoute = () => {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    return <Navigate to="/secure-aura-studio-gateway" replace />;
  }
  return <Outlet />;
};

// Main Layout Wrapper
const Layout = () => {
  return (
    <div className="admin-app-layout">
      {/* Background Glowing Orbs */}
      <div className="bg-glow-container">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      
      <Sidebar />
      <div className="main-content-area">
        <Header />
        <main className="page-viewport">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Secure login URL */}
        <Route path="/secure-aura-studio-gateway" element={<Login />} />
        
        {/* Protected Admin Console */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/badges" element={<Badges />} />
            {/* Fallbacks */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
