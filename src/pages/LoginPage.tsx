import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
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

  return (
    <div
      id="login-page-container"
      className="min-h-screen bg-[#160D2E] flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 relative overflow-hidden"
    >
      {/* Subtle ambient light in deep violet */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#5B3CC4]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#6366F1]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10 animate-in-scale">
        {/* Brand Header */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5B3CC4] to-[#7B57E4] text-white shadow-xl shadow-[#5B3CC4]/40 mb-1 border border-[#7B57E4]/40">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">ArchivEx Admin</h1>
            <p className="text-xs sm:text-sm text-[#A799CC] mt-1">
              Portail de gestion pédagogique & validation des paiements
            </p>
          </div>
        </div>

        {/* Login Box */}
        <div className="bg-[#1E123D] border border-[#30205C] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-[#30205C] pb-4">
            <h2 className="text-base font-bold text-white">Authentification Administrateur</h2>
            <p className="text-xs text-[#A799CC] mt-0.5">
              Accès réservé au personnel académique accrédité.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-pink-950/80 border border-pink-800 text-pink-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-pink-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email-input" className="block text-xs font-bold uppercase tracking-wider text-[#C5BADF] mb-1.5">
                Email Professionnel
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8E7EB8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="archivexadmin@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#130B29] border border-[#30205C] text-sm text-white focus:outline-hidden focus:border-[#5B3CC4] focus:ring-2 focus:ring-[#5B3CC4]/30 transition-all placeholder-[#8E7EB8]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password-input" className="block text-xs font-bold uppercase tracking-wider text-[#C5BADF] mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8E7EB8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="login-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#130B29] border border-[#30205C] text-sm text-white focus:outline-hidden focus:border-[#5B3CC4] focus:ring-2 focus:ring-[#5B3CC4]/30 transition-all placeholder-[#8E7EB8]"
                />
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#5B3CC4] hover:bg-[#4C2FB0] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#5B3CC4]/30 transition-all active:scale-[0.98] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Vérification...</span>
                </>
              ) : (
                <>
                  <span>Accéder au Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
