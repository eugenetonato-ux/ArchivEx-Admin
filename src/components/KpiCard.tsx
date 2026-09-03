import React from 'react';
import { LucideIcon, Sparkles } from 'lucide-react';

interface KpiCardProps {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorScheme?: 'violet' | 'indigo' | 'rose' | 'orange' | 'emerald';
  trendBadge?: string;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  colorScheme = 'violet',
  trendBadge,
  onClick
}) => {
  const schemeStyles = {
    violet: {
      bgGradient: 'from-[#7C3AED] via-[#5B3CC4] to-[#4C1D95]',
      shadowColor: 'shadow-violet-600/30 hover:shadow-violet-600/40',
      iconBg: 'bg-white/20 text-white',
      badgeBg: 'bg-white/20 text-white border-white/30',
      accentBorder: 'border-violet-400/30'
    },
    indigo: {
      bgGradient: 'from-[#4F46E5] via-[#3B82F6] to-[#1E3A8A]',
      shadowColor: 'shadow-blue-600/30 hover:shadow-blue-600/40',
      iconBg: 'bg-white/20 text-white',
      badgeBg: 'bg-white/20 text-white border-white/30',
      accentBorder: 'border-blue-400/30'
    },
    rose: {
      bgGradient: 'from-[#E11D48] via-[#F43F5E] to-[#881337]',
      shadowColor: 'shadow-rose-600/30 hover:shadow-rose-600/40',
      iconBg: 'bg-white/20 text-white',
      badgeBg: 'bg-white/20 text-white border-white/30',
      accentBorder: 'border-rose-400/30'
    },
    orange: {
      bgGradient: 'from-[#D97706] via-[#F97316] to-[#78350F]',
      shadowColor: 'shadow-amber-600/30 hover:shadow-amber-600/40',
      iconBg: 'bg-white/20 text-white',
      badgeBg: 'bg-white/20 text-white border-white/30',
      accentBorder: 'border-amber-400/30'
    },
    emerald: {
      bgGradient: 'from-[#059669] via-[#10B981] to-[#064E3B]',
      shadowColor: 'shadow-emerald-600/30 hover:shadow-emerald-600/40',
      iconBg: 'bg-white/20 text-white',
      badgeBg: 'bg-white/20 text-white border-white/30',
      accentBorder: 'border-emerald-400/30'
    }
  };

  const current = schemeStyles[colorScheme] || schemeStyles.violet;

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative overflow-hidden bg-gradient-to-br ${current.bgGradient} p-4 sm:p-5 rounded-2xl border ${current.accentBorder} ${current.shadowColor} shadow-md transition-all duration-300 group ${
        onClick ? 'cursor-pointer hover:-translate-y-1 active:translate-y-0 active:scale-[0.99]' : ''
      }`}
    >
      {/* Decorative top glass shine */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 opacity-60 pointer-events-none" />
      
      {/* Dynamic light bubble decoration */}
      <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest flex items-center gap-1">
          {title}
          {trendBadge && <Sparkles className="w-2.5 h-2.5 text-amber-300 animate-pulse" />}
        </span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur-md ${current.iconBg} transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-xs`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="relative z-10 mt-3 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-xs">
          {value}
        </span>
        {trendBadge && (
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border backdrop-blur-xs ${current.badgeBg} shadow-2xs`}>
            {trendBadge}
          </span>
        )}
      </div>

      {subtitle && (
        <div className="relative z-10 mt-2.5 pt-2 border-t border-white/10">
          <p className="text-[11px] text-white/90 font-semibold tracking-wide truncate">
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
};
