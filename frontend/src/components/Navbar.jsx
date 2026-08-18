import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, FileSearch, LayoutDashboard, History, LogIn, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Sparkles className="nav-brand-icon" style={{ color: '#6366f1' }} />
        <span>ResumeAI Matcher</span>
      </Link>

      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
        <Link to="/analyze" className={`nav-link ${isActive('/analyze')}`}>
          <FileSearch size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Analyze Resume
        </Link>
        <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
          <LayoutDashboard size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Dashboard
        </Link>
        <Link to="/history" className={`nav-link ${isActive('/history')}`}>
          <History size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> History
        </Link>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#a5b4fc', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <User size={14} /> {user.name}
            </span>
            <button onClick={logout} className="btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
              <LogOut size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-btn">
              <LogIn size={15} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
