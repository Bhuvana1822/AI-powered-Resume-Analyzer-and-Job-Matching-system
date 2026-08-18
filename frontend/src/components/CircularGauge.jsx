import React from 'react';

export default function CircularGauge({ score = 0, size = 170, strokeWidth = 14 }) {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 80) return '#10b981'; // Emerald
    if (s >= 60) return '#38bdf8'; // Sky cyan
    if (s >= 40) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose red
  };

  const color = getColor(score);

  return (
    <div className="score-circle-container" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Animated Progress Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s ease-in-out, stroke 0.5s ease' }}
        />
      </svg>
      <div className="score-circle-text">
        <div className="score-number" style={{ color: color }}>{score}%</div>
        <div className="score-label">Job Match</div>
      </div>
    </div>
  );
}
