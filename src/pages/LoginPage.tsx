import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { AdminUser } from '../types';

interface LoginPageProps {
  onLogin: (email: string, pass: string) => Promise<AdminUser>;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Veuillez renseigner votre email et mot de passe administrateur.');
      return;
    }

    try {
      setIsLoading(true);
      await onLogin(email, password);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Échec de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('eugenetonato@gmail.com');
    setPassword('ArchivEx2026!');
    setErrorMsg('');
  };

  return (
    <div
      id="login-page-container"
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden select-none"
    >
      {/* 1. Fullscreen Vibrant Flower Background Shifted to Deep Violet */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-violet-950">
        <img
          src="/login_bg_flower.jpg"
          alt="Vibrant Violet Flower Background"
          className="w-full h-full object-cover scale-100 filter hue-rotate-[220deg] brightness-[0.85] contrast-[1.1] saturate-[1.15]"
          referrerPolicy="no-referrer"
        />
        {/* Soft luxurious violet and purple overlays to add modern depth and highlight the form */}
        <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/50 via-[#1E1B4B]/20 to-indigo-950/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-violet-950/40 to-violet-950/80" />
      </div>

      {/* Floating Sparkle Elements (Highly visible, elegant 4-point glowing stars and particles) */}
      {/* Sparkle 1: Top Right - Large 4-Point Star */}
      <div className="absolute top-[12%] right-[18%] z-10 pointer-events-none select-none animate-[pulse_1.8s_infinite_200ms]">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]">
          <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2Z" />
        </svg>
      </div>
      <div className="absolute top-[12%] right-[18%] z-10 pointer-events-none select-none w-6 h-6 bg-white rounded-full animate-ping opacity-35" />

      {/* Sparkle 2: Bottom Left - Medium 4-Point Star */}
      <div className="absolute bottom-[20%] left-[12%] z-10 pointer-events-none select-none animate-[pulse_2.2s_infinite_600ms]">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-violet-200 drop-shadow-[0_0_6px_rgba(167,139,250,0.9)]">
          <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2Z" />
        </svg>
      </div>

      {/* Sparkle 3: Top Left - Small 4-Point Star */}
      <div className="absolute top-[25%] left-[18%] z-10 pointer-events-none select-none animate-[pulse_1.5s_infinite_100ms]">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
          <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2Z" />
        </svg>
      </div>

      {/* Sparkle 4: Bottom Right - Small 4-Point Star */}
      <div className="absolute bottom-[28%] right-[15%] z-10 pointer-events-none select-none animate-[pulse_2s_infinite_400ms]">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-violet-300 drop-shadow-[0_0_5px_rgba(196,181,253,0.8)]">
          <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2Z" />
        </svg>
      </div>

      {/* Sparkling Dots */}
      <div className="absolute top-[45%] left-[8%] w-1.5 h-1.5 bg-white rounded-full animate-pulse opacity-90" />
      <div className="absolute top-[65%] right-[8%] w-2 h-2 bg-violet-300 rounded-full animate-ping opacity-70" />
      <div className="absolute bottom-[10%] right-[30%] w-1.5 h-1.5 bg-white rounded-full animate-pulse opacity-80" />
      <div className="absolute top-[8%] left-[40%] w-2 h-2 bg-purple-200 rounded-full animate-ping opacity-60" />

      {/* 2. Horizontal layout: Form on Left/Center, Logo on the Right Side (on Desktop) */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16 relative z-20">
        
        {/* Mobile Header Branding (Only visible on Mobile) */}
        <div className="md:hidden text-center space-y-3 mb-2">
          <div className="inline-flex items-center justify-center w-24 h-auto p-1 bg-white/20 rounded-xl backdrop-blur-md border border-white/30 overflow-hidden mix-blend-multiply">
            <img
              src="/logo.jpg"
              alt="ArchivEx Logo Mobile"
              className="w-full h-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white drop-shadow-xs">ArchivEx Console</h1>
            <p className="text-xs text-white/80 font-bold drop-shadow-2xs">Portail de Gestion Académique</p>
          </div>
        </div>

        {/* FORM CONTAINER: Centered Premium Glassmorphic Login Card */}
        <div className="w-full max-w-md bg-white/15 border-2 border-white/45 rounded-[32px] p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.18)] backdrop-blur-md transition-all duration-300 hover:border-white/60">
          
          {/* Card Header (Clean & Minimalist, showing on tablet/desktop as a subtitle) */}
          <div className="text-center md:text-left space-y-1 pb-4 border-b border-white/20 mb-5">
            <h1 className="text-lg font-extrabold tracking-tight text-white drop-shadow-xs flex items-center justify-center md:justify-start gap-2">
              <span>Authentification Admin</span>
            </h1>
            <p className="text-xs text-white/80 font-semibold drop-shadow-2xs">Saisissez vos identifiants pour débloquer l'accès</p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-600/35 border border-white/30 text-white text-xs flex items-center gap-2 mb-4 drop-shadow-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-white" />
              <span className="font-bold">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input Field */}
            <div className="space-y-1.5">
              <label htmlFor="login-email-input" className="block text-xs font-black uppercase tracking-widest text-white drop-shadow-2xs">
                Email Professionnel
              </label>
              <div className="relative group">
                <Mail className="w-4 h-4 text-white/70 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                <input
                  id="login-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="eugene.tonato@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/15 border border-white/25 text-sm text-white placeholder-white/50 focus:outline-hidden focus:border-white focus:bg-white/25 focus:ring-2 focus:ring-white/10 transition-all font-semibold"
                />
              </div>
            </div>

            {/* Password Input Field */}
            <div className="space-y-1.5">
              <label htmlFor="login-password-input" className="block text-xs font-black uppercase tracking-widest text-white drop-shadow-2xs">
                Mot de Passe Sécurisé
              </label>
              <div className="relative group">
                <Lock className="w-4 h-4 text-white/70 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                <input
                  id="login-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/15 border border-white/25 text-sm text-white placeholder-white/50 focus:outline-hidden focus:border-white focus:bg-white/25 focus:ring-2 focus:ring-white/10 transition-all font-semibold"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-2 bg-white hover:bg-white/95 text-[#D97706] rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-amber-600/30 border-t-amber-600 rounded-full animate-spin" />
                  <span>Validation des accès...</span>
                </>
              ) : (
                <>
                  <span>Ouvrir la Console</span>
                  <ArrowRight className="w-4 h-4 text-[#D97706]" />
                </>
              )}
            </button>
          </form>

          {/* Form Actions footer */}
          <div className="pt-4 border-t border-white/20 mt-4 text-center">
            <span className="text-[10px] text-white/80 font-bold drop-shadow-2xs">ArchivEx Console de Supervision</span>
          </div>
        </div>

        {/* LOGO CONTAINER: Logo sits on the right side next to the form (Visible on Desktop) */}
        <div className="hidden md:flex flex-col items-center justify-center text-center max-w-sm shrink-0">
          <div className="p-6 rounded-[32px] bg-white/10 backdrop-blur-md border-2 border-white/25 shadow-xl transition-all duration-300 hover:border-white/40 flex items-center justify-center">
            <img
              src="/logo.jpg"
              alt="ArchivEx Official Logo"
              className="w-72 h-auto mix-blend-multiply filter contrast-[1.18] brightness-[1.03]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

      </div>

      {/* Bottom Minimal Copyright Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-white/70 pointer-events-none select-none font-semibold drop-shadow-2xs">
        © 2026 ArchivEx Corporation. Tous droits réservés.
      </div>
    </div>
  );
};
