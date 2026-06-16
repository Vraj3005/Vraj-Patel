'use client';

export default function GridBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-background">
      {/* Static dot grid */}
      <div className="absolute inset-0 cyber-grid opacity-60" />

      {/* Radial fade at edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, #0a0a0a 100%)',
        }}
      />
    </div>
  );
}
