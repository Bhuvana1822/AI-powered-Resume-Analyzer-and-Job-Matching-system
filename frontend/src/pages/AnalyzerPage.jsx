import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeService } from '../services/resumeService';
import { analysisService } from '../services/analysisService';
import { useAuth } from '../context/AuthContext';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';

export default function AnalyzerPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedResumeData, setUploadedResumeData] = useState(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const name = selectedFile.name.toLowerCase();
    if (!name.endsWith('.pdf') && !name.endsWith('.docx') && !name.endsWith('.doc') && !name.endsWith('.txt')) {
      setError('Invalid file format. Please upload a PDF or DOCX file.');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Auto upload resume file to parse text instantly
    setLoading(true);
    try {
      const res = await resumeService.uploadResume(selectedFile, user ? user.id : null);
      setUploadedResumeData(res);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload and parse resume file. Please check file integrity.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file && !uploadedResumeData) {
      setError('Please upload your resume file (PDF/DOCX) first.');
      return;
    }
    if (!jobDescription || jobDescription.trim().length < 20) {
      setError('Please paste a comprehensive Job Description (at least 20 characters).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        resumeId: uploadedResumeData?.resumeId,
        resumeText: uploadedResumeData?.extractedText,
        fileName: file ? file.name : uploadedResumeData?.fileName,
        jobTitle: jobTitle.trim(),
        jobDescription: jobDescription.trim(),
        userId: user ? user.id : 1,
      };

      const result = await analysisService.analyze(payload);
      // Navigate to results page with state / ID
      navigate('/results', { state: { result } });
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while evaluating the resume against the job description.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Resume Analyzer & Job Matcher
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '1.05rem' }}>
          Upload your resume and paste the job description below to start dynamic AI matching
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.4)', color: '#f43f5e', padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleAnalyze}>
        <div className="grid-2" style={{ marginBottom: '2rem' }}>
          {/* Section 1: Resume Upload */}
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a5b4fc' }}>
              <UploadCloud size={22} color="#6366f1" /> 1. Upload Resume
            </h2>

            <label htmlFor="resume-file" className={`dropzone ${file ? 'active' : ''}`}>
              <UploadCloud className="dropzone-icon" />
              <p style={{ fontWeight: '600', marginBottom: '0.3rem' }}>
                {file ? file.name : 'Click or Drag & Drop Resume File'}
              </p>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                Supports PDF, DOCX formats (Max 10MB)
              </p>
              <input
                id="resume-file"
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>

            {uploadedResumeData && (
              <div style={{ marginTop: '1.2rem', padding: '0.85rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#34d399', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} />
                <span>Resume parsed successfully ({uploadedResumeData.fileName})</span>
              </div>
            )}
          </div>

          {/* Section 2: Job Description */}
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a5b4fc' }}>
              <FileText size={22} color="#06b6d4" /> 2. Job Description
            </h2>

            <div className="form-group">
              <label className="form-label">Job Title (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Java Full Stack Developer, React Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Paste Job Description *</label>
              <textarea
                className="form-textarea"
                placeholder="Paste the target job description details, required technical skills, experience requirements, and responsibilities here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', maxWidth: '380px', padding: '1.1rem', fontSize: '1.1rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Analyzing Resume & Job Matching...
              </>
            ) : (
              <>
                <Sparkles size={20} /> Analyze Resume Now
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
