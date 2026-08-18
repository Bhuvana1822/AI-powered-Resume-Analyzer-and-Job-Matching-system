import React from 'react';
import { Lightbulb } from 'lucide-react';

export default function SuggestionCard({ suggestions = [] }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="card" style={{ borderLeft: '4px solid #6366f1' }}>
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.2rem', marginBottom: '1rem', color: '#a5b4fc' }}>
        <Lightbulb size={20} color="#f59e0b" /> How to Improve Your Resume
      </h3>
      <ol style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#e5e7eb' }}>
        {suggestions.map((suggestion, idx) => (
          <li key={idx} style={{ lineHeight: '1.5' }}>
            {suggestion}
          </li>
        ))}
      </ol>
    </div>
  );
}
