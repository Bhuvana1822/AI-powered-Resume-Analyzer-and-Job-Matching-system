import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import CircularGauge from '../components/CircularGauge';
import SkillBadge from '../components/SkillBadge';
import SuggestionCard from '../components/SuggestionCard';
import { CheckCircle2, XCircle, ArrowLeft, Briefcase, GraduationCap, Award, BookOpen, Share2 } from 'lucide-react';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result;

  if (!result) {
    return (
      <div className="card" style={{ textAlign: 'center', margin: '3rem auto', maxWidth: '600px' }}>
        <h2>No Analysis Result Found</h2>
        <p style={{ color: '#9ca3af', margin: '1rem 0 1.5rem' }}>Please analyze a resume and job description first.</p>
        <Link to="/analyze" className="btn-primary">Go to Analyzer</Link>
      </div>
    );
  }

  const {
    jobTitle,
    fileName,
    matchPercentage = 0,
    matchedSkills = [],
    missingSkills = [],
    suggestions = [],
    recommendedSkills = [],
    experienceMatch,
    educationMatch,
    overallRecommendation
  } = result;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button onClick={() => navigate('/analyze')} className="btn-secondary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', marginBottom: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowLeft size={14} /> Back to Analyzer
          </button>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>Analysis Report</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>
            Target Position: <span style={{ color: '#38bdf8', fontWeight: '600' }}>{jobTitle || 'Software Role'}</span> &bull; File: <span style={{ color: '#e5e7eb' }}>{fileName || 'Uploaded Resume'}</span>
          </p>
        </div>
        <div>
          <button onClick={() => window.print()} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Share2 size={16} /> Export / Print Report
          </button>
        </div>
      </div>

      {/* Main Score & Overview Grid */}
      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        {/* Overall Match Circular Gauge Card */}
        <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, rgba(18, 24, 38, 0.9), rgba(30, 41, 59, 0.9))' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#a5b4fc', marginBottom: '1.5rem' }}>Overall Resume–Job Match</h3>
          <CircularGauge score={matchPercentage} size={180} strokeWidth={16} />
          
          <div style={{ marginTop: '1.5rem', padding: '0.75rem 1.25rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', border: '1px solid var(--border-color)', maxWidth: '90%' }}>
            <p style={{ fontSize: '0.95rem', fontWeight: '600', color: '#e5e7eb' }}>
              {overallRecommendation}
            </p>
          </div>
        </div>

        {/* Match Breakdown Summary Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#a5b4fc', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={20} color="#6366f1" /> Qualification Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Skills Matched count */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <span style={{ fontWeight: '600' }}>Matched Skills</span>
              </div>
              <span className="badge badge-matched" style={{ fontSize: '0.9rem' }}>{matchedSkills.length} Detected</span>
            </div>

            {/* Skills Missing count */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <XCircle size={18} color="#f43f5e" />
                <span style={{ fontWeight: '600' }}>Missing Skills</span>
              </div>
              <span className="badge badge-missing" style={{ fontSize: '0.9rem' }}>{missingSkills.length} Missing</span>
            </div>

            {/* Experience Match */}
            <div style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                <Briefcase size={18} color="#06b6d4" />
                <span style={{ fontWeight: '600' }}>Experience Match</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#9ca3af', paddingLeft: '1.6rem' }}>
                {experienceMatch || 'Calculated based on detected timeline keywords.'}
              </p>
            </div>

            {/* Education Match */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                <GraduationCap size={18} color="#f59e0b" />
                <span style={{ fontWeight: '600' }}>Education Match</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#9ca3af', paddingLeft: '1.6rem' }}>
                {educationMatch || 'Degree and qualification verification.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Matched Skills */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399' }}>
          <CheckCircle2 size={22} /> Matched Skills ({matchedSkills.length})
        </h3>
        {matchedSkills.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>No direct technical skill overlaps detected.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            {matchedSkills.map((skill, idx) => (
              <SkillBadge key={idx} skill={skill} type="matched" />
            ))}
          </div>
        )}
      </div>

      {/* Section: Missing Skills with Detailed Explanations */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f43f5e' }}>
          <XCircle size={22} /> Missing Skills ({missingSkills.length}) & Gap Analysis
        </h3>
        {missingSkills.length === 0 ? (
          <p style={{ color: '#34d399', fontSize: '0.9rem' }}>Congratulations! You match all target required skills.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {missingSkills.map((item, idx) => (
              <div key={idx} style={{ background: 'rgba(244, 63, 94, 0.06)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                <XCircle size={18} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ fontWeight: '700', color: '#f43f5e', marginRight: '0.5rem' }}>{item.skill}:</span>
                  <span style={{ color: '#e5e7eb', fontSize: '0.92rem' }}>{item.explanation}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section: Improvement Suggestions */}
      <div style={{ marginBottom: '2rem' }}>
        <SuggestionCard suggestions={suggestions} />
      </div>

      {/* Section: Recommended Skills to Learn */}
      {recommendedSkills.length > 0 && (
        <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid #06b6d4' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8' }}>
            <BookOpen size={20} /> Recommended Skills to Learn / Add
          </h3>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Prioritize acquiring these key technologies to significantly strengthen your job alignment:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            {recommendedSkills.map((skill, idx) => (
              <span key={idx} className="badge badge-info">
                + {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
