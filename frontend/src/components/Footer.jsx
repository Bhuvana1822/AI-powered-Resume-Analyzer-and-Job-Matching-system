import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p>AI-Powered Resume Analyzer & Job Matcher &copy; {new Date().getFullYear()} — College Major Project</p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.4rem', color: '#6b7280' }}>
          Spring Boot Java Backend &bull; React Frontend &bull; Apache Tika Parser &bull; Dynamic Keyword Matching Engine
        </p>
      </div>
    </footer>
  );
}
