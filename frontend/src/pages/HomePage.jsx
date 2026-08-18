import React from 'react';
import { Link } from 'react-router-dom';
import { FileUp, FileText, Cpu, CheckCircle2, ArrowRight, ShieldCheck, Zap, BarChart3, BookOpen } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', color: '#a5b4fc', marginBottom: '1.5rem' }}>
          <Zap size={14} color="#38bdf8" /> Dynamic AI/NLP Resume Evaluation Engine
        </div>
        
        <h1 className="hero-title">
          Land Your Dream Job with <span>AI-Powered Resume Matching</span>
        </h1>
        
        <p className="hero-subtitle">
          Instantly evaluate your resume against target job descriptions. Extract technical skills, calculate match percentages, uncover missing keywords, and get tailored actionable recommendations.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link to="/analyze" className="btn-primary" style={{ padding: '1rem 2.2rem', fontSize: '1.05rem' }}>
            Analyze Resume Now <ArrowRight size={18} />
          </Link>
          <Link to="/dashboard" className="btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Main Workflow Steps */}
      <section style={{ margin: '4rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>How It Works</h2>
          <p style={{ color: '#9ca3af' }}>Follow our seamless 5-step automated resume optimization workflow</p>
        </div>

        <div className="grid-3">
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', color: '#818cf8' }}>
              <FileUp size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>1. Upload Resume</h3>
            <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Upload your PDF or DOCX resume. Apache Tika parses clean raw text instantly.</p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', color: '#38bdf8' }}>
              <FileText size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>2. Input Job Description</h3>
            <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Paste target job post details to evaluate exact skill alignment and qualifications.</p>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', color: '#34d399' }}>
              <Cpu size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>3. AI/NLP Skill Parsing</h3>
            <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Extract technical skills, tools, frameworks, education, and experience keywords.</p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section style={{ margin: '4rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Key Platform Features</h2>
          <p style={{ color: '#9ca3af' }}>Everything you need to bypass ATS filters and target roles effectively</p>
        </div>

        <div className="grid-2">
          <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <BarChart3 size={32} color="#6366f1" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Dynamic Match Score</h4>
              <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Calculates transparent match percentage combining skill keyword weights and contextual text similarity.</p>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <CheckCircle2 size={32} color="#10b981" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Skill Breakdown & Gap Explanations</h4>
              <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Identifies matched skills and provides explicit explanations for every missing skill requirement.</p>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <BookOpen size={32} color="#f59e0b" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Tailored Improvement Tips</h4>
              <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Generates practical, non-invented suggestions to format bullet points and highlight actual achievements.</p>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <ShieldCheck size={32} color="#06b6d4" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Analysis History & Analytics</h4>
              <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Track your evaluation history over time and analyze top missing skills across all job applications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.15))', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '3rem 1.5rem', margin: '3rem 0' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.8rem' }}>Ready to Optimize Your Resume?</h2>
        <p style={{ color: '#cbd5e1', maxWidth: '550px', margin: '0 auto 1.5rem' }}>Upload your resume now and get a full skill comparison and match report in seconds.</p>
        <Link to="/analyze" className="btn-primary" style={{ padding: '0.9rem 2rem' }}>
          Start Free Analysis
        </Link>
      </div>
    </div>
  );
}
