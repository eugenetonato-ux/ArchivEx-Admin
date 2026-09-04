import React, { useState } from 'react';
import { PieChart, BarChart3, Layers, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { KpiStats, Ressource } from '../types';

interface Dashboard3DChartsProps {
  stats: KpiStats;
  recentRessources: Ressource[];
}

type ChartViewMode = 'pie3d' | 'bar3d' | 'both';

export const Dashboard3DCharts: React.FC<Dashboard3DChartsProps> = ({ stats, recentRessources }) => {
  const [viewMode, setViewMode] = useState<ChartViewMode>('both');
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Safe totals & breakdown
  const total = Math.max(1, stats.totalRessources);
  const epreuvesCount = stats.totalEpreuves;
  const corrigesCount = stats.totalCorriges;
  const resumesCount = stats.totalResumes;

  // Pie/Donut chart data slices - Premium Violet & Indigo Gradient Palette
  const pieSlices = [
    {
      id: 'epreuves',
      label: 'Épreuves d\'Examens',
      value: epreuvesCount,
      colorTop: 'url(#grad-epreuves-top)',
      colorSide: 'url(#grad-epreuves-side)',
      colorInner: '#251654',
      colorEdge: '#A78BFA',
      badgeBg: 'bg-violet-950/60 text-violet-200 border-violet-500/30'
    },
    {
      id: 'corriges',
      label: 'Corrigés Officiels',
      value: corrigesCount,
      colorTop: 'url(#grad-corriges-top)',
      colorSide: 'url(#grad-corriges-side)',
      colorInner: '#1C1A4A',
      colorEdge: '#C7D2FE',
      badgeBg: 'bg-indigo-950/60 text-indigo-200 border-indigo-500/30'
    },
    {
      id: 'resumes',
      label: 'Résumés & Fiches',
      value: resumesCount,
      colorTop: 'url(#grad-resumes-top)',
      colorSide: 'url(#grad-resumes-side)',
      colorInner: '#381652',
      colorEdge: '#F472B6',
      badgeBg: 'bg-fuchsia-950/60 text-fuchsia-200 border-fuchsia-500/30'
    }
  ];

  // Calculate angles for 3D pie
  let currentAngle = -Math.PI / 2; // Start from top (-90deg)
  const pieDataWithAngles = pieSlices.map((slice) => {
    const sliceAngle = (slice.value / total) * (2 * Math.PI);
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;
    const midAngle = startAngle + sliceAngle / 2;
    const percent = Math.round((slice.value / total) * 100);
    return {
      ...slice,
      startAngle,
      endAngle,
      midAngle,
      percent
    };
  });

  // 3D Bar chart data items
  const maxBarValue = Math.max(
    1,
    stats.totalEpreuves,
    stats.totalCorriges,
    stats.totalResumes,
    stats.totalUeS1,
    stats.totalUeS2,
    stats.paiementsConfirmes
  );

  const barItems = [
    {
      id: 'epreuves',
      label: 'Épreuves',
      role: 'Sujets d\'examen collectés',
      value: stats.totalEpreuves,
      colorFront: '#7C3AED', // Premium Violet
      colorSide: '#5B21B6',
      colorTop: '#A78BFA'
    },
    {
      id: 'corriges',
      label: 'Corrigés',
      role: 'Solutions rédigées',
      value: stats.totalCorriges,
      colorFront: '#4F46E5', // Premium Indigo
      colorSide: '#3730A3',
      colorTop: '#818CF8'
    },
    {
      id: 'resumes',
      label: 'Résumés',
      role: 'Fiches récapitulatives',
      value: stats.totalResumes,
      colorFront: '#EC4899', // Vibrant Pink accent
      colorSide: '#BE185D',
      colorTop: '#F472B6'
    },
    {
      id: 'ues1',
      label: 'Matières S1',
      role: 'Unités du premier semestre',
      value: stats.totalUeS1,
      colorFront: '#6366F1',
      colorSide: '#4338CA',
      colorTop: '#818CF8'
    },
    {
      id: 'ues2',
      label: 'Matières S2',
      role: 'Unités du second semestre',
      value: stats.totalUeS2,
      colorFront: '#8B5CF6',
      colorSide: '#6D28D9',
      colorTop: '#A78BFA'
    },
    {
      id: 'pass',
      label: 'Pass Actifs',
      role: 'Abonnements confirmés',
      value: stats.paiementsConfirmes,
      colorFront: '#D946EF',
      colorSide: '#A21CAF',
      colorTop: '#E879F9'
    }
  ];

  // Helper dimensions for drawing 3D Donut/Ring
  const cx = 175;
  const cy = 100;
  const rx = 120;
  const ry = 62;
  const depth = 20;

  // Inner radius values for the Donut Hole (48% of outer radius)
  const irx = rx * 0.48;
  const iry = ry * 0.48;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1A0F3D] via-[#110829] to-[#08031A] rounded-2xl border border-violet-500/25 shadow-xl shadow-purple-950/25 p-4 sm:p-5 md:p-6 space-y-5 text-white">
      {/* Decorative premium violet glow in background */}
      <div className="absolute -left-16 -top-16 w-56 h-56 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Mode Selector */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#5B3CC4] text-white flex items-center justify-center shadow-lg shadow-violet-500/20 border border-violet-400/20">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">Rapport d'activité & Répartition générale</h3>
              <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-indigo-400 animate-pulse" /> Premium 3D
              </span>
            </div>
            <p className="text-xs text-violet-200/70">Visualisez instantanément vos ressources pédagogiques et l'engagement étudiant</p>
          </div>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-semibold text-violet-200 self-start md:self-auto backdrop-blur-md">
          <button
            id="btn-3d-both"
            onClick={() => setViewMode('both')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'both'
                ? 'bg-gradient-to-r from-[#7C3AED] to-[#5B3CC4] text-white font-bold shadow-xs'
                : 'hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Vue Combinée</span>
          </button>
          <button
            id="btn-3d-pie"
            onClick={() => setViewMode('pie3d')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'pie3d'
                ? 'bg-gradient-to-r from-[#7C3AED] to-[#5B3CC4] text-white font-bold shadow-xs'
                : 'hover:text-white hover:bg-white/5'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Anneau 3D</span>
          </button>
          <button
            id="btn-3d-bar"
            onClick={() => setViewMode('bar3d')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'bar3d'
                ? 'bg-gradient-to-r from-[#7C3AED] to-[#5B3CC4] text-white font-bold shadow-xs'
                : 'hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Flux & Matières</span>
          </button>
        </div>
      </div>

      {/* Main Visual Panels Grid */}
      <div className={`grid gap-5 relative z-10 ${viewMode === 'both' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
        
        {/* ===================== DIAGRAMME EN ANNEAU 3D STYLISÉ ===================== */}
        {(viewMode === 'pie3d' || viewMode === 'both') && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex flex-col justify-between space-y-4 ${
              viewMode === 'both' ? 'lg:col-span-5' : 'w-full'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
                  <PieChart className="w-4 h-4 text-violet-400" />
                  <span>Répartition des documents</span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-violet-300">
                  {stats.totalRessources} fichier{stats.totalRessources > 1 ? 's' : ''} en ligne
                </span>
              </div>
            </div>

            {/* 3D Ring SVG Canvas */}
            <div className="relative flex items-center justify-center py-2 select-none">
              <svg
                viewBox="0 0 350 220"
                className="w-full max-w-[320px] h-auto overflow-visible filter drop-shadow-lg"
              >
                <defs>
                  {/* Outer premium shadow */}
                  <radialGradient id="ring3d-floor-shadow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#010005" stopOpacity="0.65" />
                    <stop offset="60%" stopColor="#010005" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#010005" stopOpacity="0" />
                  </radialGradient>

                  {/* Gradient Violet-Indigo for Épreuves */}
                  <linearGradient id="grad-epreuves-top" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#4F46E5" />
                  </linearGradient>
                  <linearGradient id="grad-epreuves-side" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6D28D9" />
                    <stop offset="100%" stopColor="#312E81" />
                  </linearGradient>

                  {/* Gradient Light Lavender-Indigo for Corrigés */}
                  <linearGradient id="grad-corriges-top" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                  <linearGradient id="grad-corriges-side" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#5B21B6" />
                    <stop offset="100%" stopColor="#3730A3" />
                  </linearGradient>

                  {/* Gradient Fuchsia-Orchid Purple for Résumés */}
                  <linearGradient id="grad-resumes-top" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F472B6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient id="grad-resumes-side" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#BE185D" />
                    <stop offset="100%" stopColor="#5B21B6" />
                  </linearGradient>
                </defs>

                {/* Ambient Floor Shadow */}
                <ellipse
                  cx={cx}
                  cy={cy + depth + 12}
                  rx={rx + 10}
                  ry={ry + 6}
                  fill="url(#ring3d-floor-shadow)"
                />

                {stats.totalRessources === 0 ? (
                  <g>
                    {/* Empty Ring Placeholder */}
                    <path
                      d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy} M ${cx - irx} ${cy} A ${irx} ${iry} 0 1 1 ${cx + irx} ${cy} A ${irx} ${iry} 0 1 1 ${cx - irx} ${cy}`}
                      fill="#25174A"
                      stroke="#4C2FB0"
                      strokeWidth="1.5"
                    />
                    <text
                      x={cx}
                      y={cy + 4}
                      textAnchor="middle"
                      className="text-xs font-bold fill-violet-300 font-sans"
                    >
                      Aucun document
                    </text>
                  </g>
                ) : (
                  <g>
                    {/* DRAW EACH SLICE OF THE 3D DONUT/RING */}
                    {pieDataWithAngles.map((slice, idx) => {
                      if (slice.value === 0) return null;
                      const isHovered = hoveredSlice === idx;

                      // Vector calculation for lift displacement when hovered
                      const liftX = isHovered ? Math.cos(slice.midAngle) * 8 : 0;
                      const liftY = isHovered ? Math.sin(slice.midAngle) * 5 : 0;

                      // Outer points
                      const outerX1 = cx + rx * Math.cos(slice.startAngle);
                      const outerY1 = cy + ry * Math.sin(slice.startAngle);
                      const outerX2 = cx + rx * Math.cos(slice.endAngle);
                      const outerY2 = cy + ry * Math.sin(slice.endAngle);

                      // Inner points (for donut hole)
                      const innerX1 = cx + irx * Math.cos(slice.startAngle);
                      const innerY1 = cy + iry * Math.sin(slice.startAngle);
                      const innerX2 = cx + irx * Math.cos(slice.endAngle);
                      const innerY2 = cy + iry * Math.sin(slice.endAngle);

                      const largeArc = slice.endAngle - slice.startAngle > Math.PI ? 1 : 0;

                      // 1. TOP FACE (Donut sector ring segment)
                      const pathTop = `
                        M ${outerX1} ${outerY1}
                        A ${rx} ${ry} 0 ${largeArc} 1 ${outerX2} ${outerY2}
                        L ${innerX2} ${innerY2}
                        A ${irx} ${iry} 0 ${largeArc} 0 ${innerX1} ${innerY1}
                        Z
                      `;

                      // 2. OUTER SIDE WALL
                      const pathOuterWall = `
                        M ${outerX1} ${outerY1}
                        A ${rx} ${ry} 0 ${largeArc} 1 ${outerX2} ${outerY2}
                        L ${outerX2} ${outerY2 + depth}
                        A ${rx} ${ry} 0 ${largeArc} 0 ${outerX1} ${outerY1 + depth}
                        Z
                      `;

                      // 3. INNER HOLE WALL
                      const pathInnerWall = `
                        M ${innerX1} ${innerY1}
                        A ${irx} ${iry} 0 ${largeArc} 1 ${innerX2} ${innerY2}
                        L ${innerX2} ${innerY2 + depth}
                        A ${irx} ${iry} 0 ${largeArc} 0 ${innerX1} ${innerY1 + depth}
                        Z
                      `;

                      // 4. RADIAL START CUT
                      const pathStartCut = `
                        M ${innerX1} ${innerY1}
                        L ${outerX1} ${outerY1}
                        L ${outerX1} ${outerY1 + depth}
                        L ${innerX1} ${innerY1 + depth}
                        Z
                      `;

                      // 5. RADIAL END CUT
                      const pathEndCut = `
                        M ${innerX2} ${innerY2}
                        L ${outerX2} ${outerY2}
                        L ${outerX2} ${outerY2 + depth}
                        L ${innerX2} ${innerY2 + depth}
                        Z
                      `;

                      return (
                        <g
                          key={slice.id}
                          transform={`translate(${liftX}, ${liftY})`}
                          onMouseEnter={() => setHoveredSlice(idx)}
                          onMouseLeave={() => setHoveredSlice(null)}
                          className="cursor-pointer transition-transform duration-300 ease-out"
                        >
                          {/* Inner Wall Shadow */}
                          <path
                            d={pathInnerWall}
                            fill={slice.colorInner}
                            opacity={hoveredSlice !== null && !isHovered ? 0.35 : 0.8}
                            className="transition-all duration-200"
                          />

                          {/* Radial cuts (for 3D depth sides) */}
                          <path
                            d={pathStartCut}
                            fill={slice.colorSide}
                            opacity={hoveredSlice !== null && !isHovered ? 0.35 : 0.85}
                            className="transition-all duration-200"
                          />
                          <path
                            d={pathEndCut}
                            fill={slice.colorSide}
                            opacity={hoveredSlice !== null && !isHovered ? 0.35 : 0.85}
                            className="transition-all duration-200"
                          />

                          {/* Outer extrusion Wall */}
                          <path
                            d={pathOuterWall}
                            fill={slice.colorSide}
                            opacity={hoveredSlice !== null && !isHovered ? 0.35 : 0.95}
                            className="transition-all duration-200"
                          />

                          {/* Top Face ring sector */}
                          <path
                            d={pathTop}
                            fill={slice.colorTop}
                            stroke={isHovered ? '#FFFFFF' : slice.colorEdge}
                            strokeWidth={isHovered ? '2' : '1'}
                            opacity={hoveredSlice !== null && !isHovered ? 0.45 : 1}
                            className="transition-all duration-200 filter hover:brightness-110"
                          />
                        </g>
                      );
                    })}

                    {/* CENTRAL TEXT LABEL floating in the hollow donut hole */}
                    <g transform={`translate(${cx}, ${cy + 2})`} className="pointer-events-none">
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        className="text-sm font-black fill-white tracking-tight drop-shadow-md"
                      >
                        {hoveredSlice !== null ? pieDataWithAngles[hoveredSlice].value : stats.totalRessources}
                      </text>
                      <text
                        x="0"
                        y="11"
                        textAnchor="middle"
                        className="text-[8px] font-black uppercase tracking-widest fill-violet-300 drop-shadow-xs"
                      >
                        {hoveredSlice !== null ? pieDataWithAngles[hoveredSlice].label.split(' ')[0] : 'Total'}
                      </text>
                    </g>
                  </g>
                )}
              </svg>
            </div>

            {/* Interactive Legend with values */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
              {pieDataWithAngles.map((slice, idx) => (
                <div
                  key={slice.id}
                  onMouseEnter={() => setHoveredSlice(idx)}
                  onMouseLeave={() => setHoveredSlice(null)}
                  className={`p-2 rounded-xl cursor-pointer transition-all border ${
                    hoveredSlice === idx
                      ? 'bg-white/15 border-violet-400 shadow-md shadow-violet-500/10'
                      : 'bg-white/5 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0 shadow-xs"
                      style={{ background: slice.colorTop }}
                    />
                    <span className="text-[10px] sm:text-[11px] font-bold text-white truncate">
                      {slice.label.split(' ')[0]}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-xs sm:text-sm font-extrabold text-white">{slice.value}</span>
                    <span className="text-[9px] sm:text-[10px] font-black text-violet-300">{slice.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== DIAGRAMME EN BANDES 3D ===================== */}
        {(viewMode === 'bar3d' || viewMode === 'both') && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex flex-col justify-between space-y-4 ${
              viewMode === 'both' ? 'lg:col-span-7' : 'w-full'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                  <span>Volumes d'activités & Abonnements</span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-violet-300">
                  {stats.totalUe} matières actives
                </span>
              </div>
            </div>

            {/* 3D Bar SVG Canvas */}
            <div className="relative flex items-center justify-center my-1 select-none overflow-x-auto">
              <svg
                viewBox="0 0 460 210"
                className="w-full min-w-[380px] max-w-[500px] h-auto overflow-visible filter drop-shadow-md"
              >
                {/* 3D Floor Base Grid - customized with sleek cybernetic grid colors */}
                <path
                  d="M 20 160 L 100 130 L 440 130 L 360 160 Z"
                  fill="#1B123D"
                  stroke="#382270"
                  strokeWidth="1.5"
                />
                <line x1="100" y1="130" x2="440" y2="130" stroke="#4C2FB0" strokeDasharray="3 3" />
                <line x1="60" y1="145" x2="400" y2="145" stroke="#311F5E" strokeDasharray="3 3" />
                <line x1="20" y1="160" x2="360" y2="160" stroke="#4C2FB0" strokeWidth="2" />

                {/* 3D BARS */}
                {barItems.map((bar, idx) => {
                  const isHovered = hoveredBar === idx;
                  const barWidth = 32;
                  const depthOffset = 14;
                  const depthYOffset = 8;
                  const maxH = 110;
                  const barH = Math.max(8, (bar.value / maxBarValue) * maxH);

                  // Base coordinates for bar column
                  const spacing = 58;
                  const baseX = 45 + idx * spacing;
                  const baseY = 155 - idx * 2.5; // Slight isometric rise

                  const topY = baseY - barH;

                  return (
                    <g
                      key={bar.id}
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                      className="cursor-pointer transition-all duration-200"
                    >
                      {/* Bar Floor Drop Shadow */}
                      <ellipse
                        cx={baseX + barWidth / 2 + depthOffset / 2}
                        cy={baseY + 4}
                        rx={barWidth * 0.65}
                        ry={depthYOffset * 0.7}
                        fill="rgba(2,0,10,0.6)"
                      />

                      {/* 1. FRONT FACE */}
                      <rect
                        x={baseX}
                        y={topY}
                        width={barWidth}
                        height={barH}
                        fill={bar.colorFront}
                        opacity={hoveredBar !== null && !isHovered ? 0.4 : 1}
                        className="transition-all duration-200"
                      />

                      {/* 2. SIDE FACE (Extrusion on right side) */}
                      <polygon
                        points={`
                          ${baseX + barWidth},${topY}
                          ${baseX + barWidth + depthOffset},${topY - depthYOffset}
                          ${baseX + barWidth + depthOffset},${baseY - depthYOffset}
                          ${baseX + barWidth},${baseY}
                        `}
                        fill={bar.colorSide}
                        opacity={hoveredBar !== null && !isHovered ? 0.4 : 1}
                        className="transition-all duration-200"
                      />

                      {/* 3. TOP CAP FACE (Diamond / Isometric Top) */}
                      <polygon
                        points={`
                          ${baseX},${topY}
                          ${baseX + depthOffset},${topY - depthYOffset}
                          ${baseX + barWidth + depthOffset},${topY - depthYOffset}
                          ${baseX + barWidth},${topY}
                        `}
                        fill={isHovered ? '#FFFFFF' : bar.colorTop}
                        stroke={isHovered ? bar.colorFront : 'none'}
                        strokeWidth="1"
                        opacity={hoveredBar !== null && !isHovered ? 0.4 : 1}
                        className="transition-all duration-200 filter hover:brightness-110"
                      />

                      {/* Floating value pill above top face */}
                      <g transform={`translate(${baseX + (barWidth + depthOffset) / 2}, ${topY - depthYOffset - 8})`}>
                        <rect
                          x="-14"
                          y="-13"
                          width="28"
                          height="16"
                          rx="4"
                          fill={isHovered ? '#EC4899' : '#4C2FB0'}
                          className="transition-colors duration-200"
                        />
                        <text
                          x="0"
                          y="-2"
                          textAnchor="middle"
                          fill="#FFFFFF"
                          className="text-[9px] font-black font-mono"
                        >
                          {bar.value}
                        </text>
                      </g>

                      {/* Bottom Category Label */}
                      <text
                        x={baseX + barWidth / 2}
                        y={baseY + 18}
                        textAnchor="middle"
                        className={`text-[9px] sm:text-[10px] font-black font-sans transition-colors ${
                          isHovered ? 'fill-rose-400' : 'fill-violet-300'
                        }`}
                      >
                        {bar.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Quick summary band */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-violet-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-extrabold text-white">Synthèse :</span>
                <span className="text-violet-200/80">
                  {stats.totalEpreuves + stats.totalCorriges} fiches d'exercices corrigés en ligne
                </span>
              </div>
              <div className="flex items-center gap-1 font-black text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{stats.montantTotalCollecte.toLocaleString()} FCFA collectés</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
