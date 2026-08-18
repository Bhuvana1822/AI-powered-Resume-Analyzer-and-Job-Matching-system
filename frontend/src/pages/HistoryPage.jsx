import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analysisService } from '../services/analysisService';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import SkillBadge from '../components/SkillBadge';
import SuggestionCard from '../components/SuggestionCard';
import CircularGauge from '../components/CircularGauge';
import { History, Search, Eye, Calendar, FileText, Loader2, AlertCircle } from 'lucide-react';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [historyList, setHistoryList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await analysisService.getHistory(user ? user.id : null);
      setHistoryList(data);
      setFilteredList(data);
    } catch (err) {
      setError('Failed to fetch analysis history.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredList(historyList);
    } else {
      const filtered = historyList.filter(item => 
        (item.jobTitle && item.jobTitle.toLowerCase().includes(term.toLowerCase())) ||
        (item.fileName && item.fileName.toLowerCase().includes(term.toLowerCase()))
      );
      setFilteredList(filtered);
    }
  };

  const openDetailModal = (item) => {
    setSelectedAnalysis(item);
    setIsModalOpen(true);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <History color="#06b6d4" /> Resume Analysis History
          </h1>
          <p style={{ color: '#9ca3af' }}>Review past evaluations and monitor match improvements</p>
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search by job or file..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#9ca3af' }}>
          <Loader2 size={36} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#6366f1' }} />
          <p>Loading evaluation history...</p>
        </div>
      ) : error ? (
        <div className="card" style={{ textAlign: 'center', margin: '2rem auto', maxWidth: '600px', color: '#f43f5e' }}>
          <AlertCircle size={36} style={{ margin: '0 auto 1rem' }} />
          <p>{error}</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <FileText size={48} color="#6b7280" style={{ margin: '0 auto 1rem' }} />
          <h3>No Analysis Records Found</h3>
          <p style={{ color: '#9ca3af', margin: '0.5rem 0 1.5rem' }}>Run a resume analysis to start populating your history.</p>
          <button onClick={() => navigate('/analyze')} className="btn-primary">Start New Analysis</button>
        </div>
      ) : (
        <div className="card">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: '#9ca3af' }}>
                  <th style={{ padding: '0.9rem 1rem' }}>Job Title</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Resume Document</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Match Score</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Skills Matched / Missing</th>
                  <th style={{ padding: '0.9rem 1rem' }}>Date</th>
                  <th style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#e5e7eb' }}>{item.jobTitle || 'Target Role'}</td>
                    <td style={{ padding: '1rem', color: '#9ca3af' }}>{item.fileName || 'Resume Document'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={item.matchPercentage >= 75 ? 'badge badge-matched' : 'badge badge-missing'}>
                        {item.matchPercentage}%
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#9ca3af', fontSize: '0.85rem' }}>
                      <span style={{ color: '#34d399', fontWeight: '600' }}>{item.matchedSkills?.length || 0} matched</span>
                      {' / '}
                      <span style={{ color: '#f43f5e', fontWeight: '600' }}>{item.missingSkills?.length || 0} missing</span>
                    </td>
                    <td style={{ padding: '1rem', color: '#9ca3af', fontSize: '0.85rem' }}>
                      <Calendar size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      {formatDate(item.createdAt)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button
                        onClick={() => openDetailModal(item)}
                        className="btn-secondary"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                      >
                        <Eye size={14} /> Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analysis Detail Inspection Modal */}
      {selectedAnalysis && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Analysis Detail — ${selectedAnalysis.jobTitle}`}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <CircularGauge score={selectedAnalysis.matchPercentage} size={140} strokeWidth={12} />
            <p style={{ marginTop: '0.75rem', fontWeight: '600', color: '#e5e7eb' }}>
              {selectedAnalysis.overallRecommendation}
            </p>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ color: '#34d399', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Matched Skills</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {selectedAnalysis.matchedSkills?.map((s, idx) => (
                <SkillBadge key={idx} skill={s} type="matched" />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ color: '#f43f5e', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Missing Skills</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {selectedAnalysis.missingSkills?.map((item, idx) => (
                <SkillBadge key={idx} skill={typeof item === 'string' ? item : item.skill} type="missing" />
              ))}
            </div>
          </div>

          {selectedAnalysis.suggestions?.length > 0 && (
            <div style={{ marginTop: '1.25rem' }}>
              <SuggestionCard suggestions={selectedAnalysis.suggestions} />
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
