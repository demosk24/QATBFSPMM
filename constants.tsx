
import React from 'react';

export const MATRIX_CHARS = "01010101ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%^&*()";

export const COLORS = {
  cyan: '#22d3ee',
  green: '#4ade80',
  red: '#ef4444',
  yellow: '#fbbf24',
  black: '#020617',
  navy: '#0f172a'
};

export const ScanLines = () => (
  <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden opacity-10">
    <div className="h-full w-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
  </div>
);
