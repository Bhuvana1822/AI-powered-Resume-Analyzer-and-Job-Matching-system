import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { analysisService } from '../services/analysisService';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileSearch, TrendingUp, Award, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await analysisService.getDashboard(user ? user.id : null);
      setStats(data);
    } catch (err) {
      setError('Failed to fetch dashboard metrics. Make sure the Spring Boot backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#9ca3af' }}>
        <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#6366f1' }} />
        <p>Loading user dashboard analytics...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="card" style={{ textAlign: 'center', margin: '2rem auto', maxWidth: '600px' }}>
        <AlertTriangle size={36} color="#f43f5e" style={{ margin: '0 auto 1rem' }} />
        <p style={{ color: '#f43f5e', marginBottom: '1rem' }}>{error || 'No data available'}</p>
        <button onClick={fetchDashboardStats} className="btn-secondary">Retry</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <LayoutDashboard color="#6366f1" /> Analytics Dashboard
          </h1>
          <p style={{ color: '#9ca3af' }}>Overview of your resume performance and job matching statistics</p>
        </div>
        <Link to="/analyze" className="btn-primary">
          <FileSearch size={18} /> New Resume Match
        </Link>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ borderLeft: '4px solid #6366f1' }}>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Analyzed</p>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', margin: '0.3rem 0', color: '#ffffff' }}>
            {stats.totalAnalyses}
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#a5b4fc' }}>Resumes Processed</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #06b6d4' }}>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Average Match Score</p>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', margin: '0.3rem 0', color: '#38bdf8' }}>
            {stats.averageMatchPercentage}%
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Overall Compatibility</span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Best Match</p>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', margin: '0.3rem 0', color: '#34d399' }}>
            {stats.bestMatchPercentage}%
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {stats.bestMatchJobTitle}
          </span>
        </div>

        <div className="card" style={{ borderLeft: '4px solid #f43f5e' }}>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Top Missing Skill</p>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '0.6rem 0', color: '#f43f5e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {stats.topMissingSkills?.length > 0 ? stats.topMissingSkills[0].skill : 'None'}
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {stats.topMissingSkills?.length > 0 ? `Missing in ${stats.topMissingSkills[0].count} analyses` : 'All skills present'}
          </span>
        </div>
      </div>

      {/* Top Missing Skills Breakdown */}
      {stats.topMissingSkills?.length > 0 && (
        <div className="card" style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.2rem', color: '#a5b4fc' }}>
            Most Common Missing Skills Across Applications
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {stats.topMissingSkills.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontWeight: '600', color: '#e5e7eb' }}>{item.skill}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="badge badge-missing" style={{ fontSize: '0.8rem' }}>Missing {item.count}x</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Analyses Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Recent Resume Analyses</h3>
          <Link to="/history" style={{ fontSize: '0.9rem', color: '#6366f1', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            View Full History <ArrowRight size={14} />
          </Link>
        </div>

        {stats.recentAnalyses?.length === 0 ? (
          <p style={{ color: '#9ca3af', padding: '1rem 0' }}>No recent analyses recorded. Try running your first analysis!</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: '#9ca3af' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Job Position</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Resume File</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Match %</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentAnalyses.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: '600', color: '#e5e7eb' }}>{row.jobTitle}</td>
                    <td style={{ padding: '0.9rem 1rem', color: '#9ca3af' }}>{row.fileName || 'Uploaded Resume'}</td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <span className={row.matchPercentage >= 75 ? 'badge badge-matched' : 'badge badge-missing'}>
                        {row.matchPercentage}%
                      </span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <button 
                        onClick={() => navigate('/results', { state: { result: row } })} 
                        className="btn-secondary" 
                        style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
