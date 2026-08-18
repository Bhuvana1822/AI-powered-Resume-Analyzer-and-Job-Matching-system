import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function SkillBadge({ skill, type = 'matched' }) {
  if (type === 'matched') {
    return (
      <span className="badge badge-matched">
        <CheckCircle2 size={14} /> {skill}
      </span>
    );
  }

  return (
    <span className="badge badge-missing">
      <XCircle size={14} /> {skill}
    </span>
  );
}
