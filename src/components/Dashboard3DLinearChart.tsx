import React, { useState } from 'react';
import { TrendingUp, Users, DollarSign, Sparkles, HelpCircle } from 'lucide-react';

interface Dashboard3DLinearChartProps {
  totalInscriptions?: number;
  totalRevenus?: number;
}

export const Dashboard3DLinearChart: React.FC<Dashboard3DLinearChartProps> = ({
  totalInscriptions = 195,
  totalRevenus = 780000
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ series: 'inscriptions' | 'revenus'; index: number } | null>(null);

  const months = ['Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre'];

  // Realistic trend data over the last 6 months leading to current metrics
  const inscriptionsData = [45, 68, 92, 120, 155, totalInscriptions];
  const revenusData = [180000, 272000, 368000, 480000, 620000, totalRevenus];

  // Coordinates mapping
  const width = 500;
  const height = 180;
  const paddingLeft = 60;
  const paddingRight = 40;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Max values for scale
  const maxInscriptions = 250;
  const maxRevenus = 1000000;

  // X coords for 6 points
  const getX = (index: number) => {
    return paddingLeft + (index / (months.length - 1)) * chartWidth;
  };

  // Y coords
  const getInscriptionsY = (val: number) => {
    return height - paddingBottom - (val / maxInscriptions) * chartHeight;
  };

  const getRevenusY = (val: number) => {
    return height - paddingBottom - (val / maxRevenus) * chartHeight;
  };

  const inscriptionsPoints = inscriptionsData.map((val, idx) => ({
    x: getX(idx),
    y: getInscriptionsY(val),
    val
  }));

  const revenusPoints = revenusData.map((val, idx) => ({
    x: getX(idx),
    y: getRevenusY(val),
    val
  }));

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1E1145] via-[#110829] to-[#09031C] rounded-2xl border border-violet-500/25 p-4 sm:p-5 text-white shadow-xl">
      {/* Glow effects */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-violet-600 text-white flex items-center justify-center shadow-md">
            <TrendingUp className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold tracking-tight">Courbe de Croissance 3D</h3>
            <p className="text-[10px] text-violet-300/70">Inscriptions & revenus cumulés des 6 derniers mois</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-violet-400 animate-pulse" /> Projection 3D
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* SVG Canvas (8 cols on large screens) */}
        <div className="lg:col-span-8 select-none">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible filter drop-shadow-md">
            <defs>
              {/* Gradients for ribbons area fade */}
              <linearGradient id="area-inscriptions" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="area-revenus" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#EC4899" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
              </linearGradient>

              {/* Sidebar wall gradients */}
              <linearGradient id="wall-inscriptions" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#5B21B6" stopOpacity="0.7" />
              </linearGradient>
              <linearGradient id="wall-revenus" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#DB2777" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#9D174D" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = paddingTop + ratio * chartHeight;
              return (
                <g key={i}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="#2D2258"
                    strokeWidth="1"
                    strokeDasharray={ratio === 1 ? 'none' : '3 3'}
                  />
                  {/* Grid Labels Left */}
                  {i === 0 && (
                    <text x={paddingLeft - 8} y={y + 3} textAnchor="end" className="text-[8px] font-mono fill-violet-300">
                      250 / 1M
                    </text>
                  )}
                  {i === 2 && (
                    <text x={paddingLeft - 8} y={y + 3} textAnchor="end" className="text-[8px] font-mono fill-violet-300">
                      125 / 500k
                    </text>
                  )}
                  {i === 4 && (
                    <text x={paddingLeft - 8} y={y + 3} textAnchor="end" className="text-[8px] font-mono fill-violet-300">
                      0
                    </text>
                  )}
                </g>
              );
            })}

            {/* 3D Area under Revenus */}
            <path
              d={`
                M ${revenusPoints[0].x} ${revenusPoints[0].y}
                L ${revenusPoints[1].x} ${revenusPoints[1].y}
                L ${revenusPoints[2].x} ${revenusPoints[2].y}
                L ${revenusPoints[3].x} ${revenusPoints[3].y}
                L ${revenusPoints[4].x} ${revenusPoints[4].y}
                L ${revenusPoints[5].x} ${revenusPoints[5].y}
                L ${width - paddingRight} ${height - paddingBottom}
                L ${paddingLeft} ${height - paddingBottom}
                Z
              `}
              fill="url(#area-revenus)"
            />

            {/* 3D Area under Inscriptions */}
            <path
              d={`
                M ${inscriptionsPoints[0].x} ${inscriptionsPoints[0].y}
                L ${inscriptionsPoints[1].x} ${inscriptionsPoints[1].y}
                L ${inscriptionsPoints[2].x} ${inscriptionsPoints[2].y}
                L ${inscriptionsPoints[3].x} ${inscriptionsPoints[3].y}
                L ${inscriptionsPoints[4].x} ${inscriptionsPoints[4].y}
                L ${inscriptionsPoints[5].x} ${inscriptionsPoints[5].y}
                L ${width - paddingRight} ${height - paddingBottom}
                L ${paddingLeft} ${height - paddingBottom}
                Z
              `}
              fill="url(#area-inscriptions)"
            />

            {/* DRAW 3D RIBBONS */}

            {/* SERIES 2: REVENUS (Pink Ribbon) */}
            {revenusPoints.map((p, idx) => {
              if (idx === revenusPoints.length - 1) return null;
              const next = revenusPoints[idx + 1];
              const depth = 8; // 3D ribbon vertical depth height

              return (
                <g key={`rev-ribbon-${idx}`}>
                  {/* Side wall extrusion to create 3D ribbon look */}
                  <polygon
                    points={`
                      ${p.x},${p.y}
                      ${next.x},${next.y}
                      ${next.x},${next.y + depth}
                      ${p.x},${p.y + depth}
                    `}
                    fill="url(#wall-revenus)"
                  />
                  {/* Top main stroke ribbon line */}
                  <line
                    x1={p.x}
                    y1={p.y}
                    x2={next.x}
                    y2={next.y}
                    stroke="#EC4899"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}

            {/* SERIES 1: INSCRIPTIONS (Violet Ribbon) */}
            {inscriptionsPoints.map((p, idx) => {
              if (idx === inscriptionsPoints.length - 1) return null;
              const next = inscriptionsPoints[idx + 1];
              const depth = 8; // 3D ribbon vertical depth height

              return (
                <g key={`ins-ribbon-${idx}`}>
                  {/* Side wall extrusion to create 3D ribbon look */}
                  <polygon
                    points={`
                      ${p.x},${p.y}
                      ${next.x},${next.y}
                      ${next.x},${next.y + depth}
                      ${p.x},${p.y + depth}
                    `}
                    fill="url(#wall-inscriptions)"
                  />
                  {/* Top main stroke ribbon line */}
                  <line
                    x1={p.x}
                    y1={p.y}
                    x2={next.x}
                    y2={next.y}
                    stroke="#8B5CF6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}

            {/* HOVER INTERACTION POINTS */}
            {months.map((m, idx) => {
              const pIns = inscriptionsPoints[idx];
              const pRev = revenusPoints[idx];

              const insHovered = hoveredPoint?.series === 'inscriptions' && hoveredPoint.index === idx;
              const revHovered = hoveredPoint?.series === 'revenus' && hoveredPoint.index === idx;

              return (
                <g key={`points-${idx}`}>
                  {/* Vertical hover guide bar */}
                  {(insHovered || revHovered) && (
                    <line
                      x1={pIns.x}
                      y1={paddingTop}
                      x2={pIns.x}
                      y2={height - paddingBottom}
                      stroke="#8B5CF6"
                      strokeOpacity="0.4"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* Inscriptions Dot */}
                  <circle
                    cx={pIns.x}
                    cy={pIns.y}
                    r={insHovered ? 6 : 4}
                    fill="#1E1145"
                    stroke="#8B5CF6"
                    strokeWidth={insHovered ? 3.5 : 2}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredPoint({ series: 'inscriptions', index: idx })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />

                  {/* Revenus Dot */}
                  <circle
                    cx={pRev.x}
                    cy={pRev.y}
                    r={revHovered ? 6 : 4}
                    fill="#1E1145"
                    stroke="#EC4899"
                    strokeWidth={revHovered ? 3.5 : 2}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredPoint({ series: 'revenus', index: idx })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />

                  {/* X Axis Month Labels */}
                  <text
                    x={pIns.x}
                    y={height - paddingBottom + 16}
                    textAnchor="middle"
                    className="text-[9px] font-bold fill-violet-300 font-sans"
                  >
                    {m}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Floating Legends / Mini Stats Panel (4 cols on large screens) */}
        <div className="lg:col-span-4 space-y-3">
          {/* Card Legend 1 - Inscriptions */}
          <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shadow-xs" />
                <span>Inscriptions (Étudiants)</span>
              </div>
              <Users className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-sm font-black text-white">+{inscriptionsData[5] - inscriptionsData[0]} nouveaux</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-md">
                +{( ((inscriptionsData[5] - inscriptionsData[0]) / inscriptionsData[0]) * 100 ).toFixed(0)}%
              </span>
            </div>
            <p className="text-[10px] text-violet-300/60 leading-relaxed">
              {hoveredPoint?.series === 'inscriptions' ? (
                <>Saisie en <strong>{months[hoveredPoint.index]}</strong> : <span className="text-white font-bold">{inscriptionsData[hoveredPoint.index]} étudiants</span></>
              ) : (
                <>Évolution mensuelle de la base de données étudiante active.</>
              )}
            </p>
          </div>

          {/* Card Legend 2 - Revenus */}
          <div className="p-3 bg-white/5 border border-white/5 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899] shadow-xs" />
                <span>Revenus des Pass (FCFA)</span>
              </div>
              <DollarSign className="w-3.5 h-3.5 text-pink-400" />
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-sm font-black text-white">{totalRevenus.toLocaleString()} FCFA</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded-md">
                Croissance
              </span>
            </div>
            <p className="text-[10px] text-violet-300/60 leading-relaxed">
              {hoveredPoint?.series === 'revenus' ? (
                <>Revenus de <strong>{months[hoveredPoint.index]}</strong> : <span className="text-white font-bold">{revenusData[hoveredPoint.index].toLocaleString()} FCFA</span></>
              ) : (
                <>Trésorerie globale issue de la souscription instantanée des Pass.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
