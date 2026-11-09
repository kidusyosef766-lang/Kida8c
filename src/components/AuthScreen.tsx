import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Phone, Sparkles, ArrowRight, ShieldCheck, Settings } from 'lucide-react';
import { SupabaseConfigModal } from './SupabaseConfigModal';

interface Props {
  onSuccess?: () => void;
}

export const AuthScreen: React.FC<Props> = () => {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [identity, setIdentity] = useState('');
  const [otp, setOtp] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  async function sendCode() {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!identity.trim()) {
      setErrorMsg('Enter your email or phone number.');
      return;
    }

    setLoading(true);

    try {
      const result = method === 'email'
        ? await supabase.auth.signInWithOtp({ email: identity.trim() })
        : await supabase.auth.signInWithOtp({ phone: identity.trim() });

      setLoading(false);

      if (result.error) {
        setErrorMsg(result.error.message);
        return;
      }

      setCodeSent(true);
      const hint = (result as any).generatedCode ? ` (Preview OTP code: ${(result as any).generatedCode})` : '';
      setSuccessMsg(`Verification code sent! Check your ${method === 'email' ? 'inbox' : 'SMS'}.${hint}`);
      if ((result as any).generatedCode) {
        setOtp((result as any).generatedCode);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Failed to send OTP code.');
    }
  }

  async function verifyCode() {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!otp.trim()) {
      setErrorMsg('Enter the 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      const result = method === 'email'
        ? await supabase.auth.verifyOtp({
            email: identity.trim(),
            token: otp.trim(),
            type: 'email'
          })
        : await supabase.auth.verifyOtp({
            phone: identity.trim(),
            token: otp.trim(),
            type: 'sms'
          });

      setLoading(false);

      if (result.error) {
        setErrorMsg(result.error.message);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || 'Verification failed.');
    }
  }

  function handleQuickDemoFill() {
    if (method === 'email') {
      setIdentity('creator@kida8c.io');
    } else {
      setIdentity('+14155552671');
    }
    setErrorMsg(null);
  }

  return (
    <div className="min-h-screen bg-[#10101D] text-white flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Decorative cosmic background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#7C4DFF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#FF4D9D]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#55D6FF]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top right Supabase settings button */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setIsConfigOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#201D32] border border-[#3b3658] text-slate-300 hover:text-white hover:border-[#7C4DFF] transition-colors"
          title="Supabase Settings"
        >
          <Settings className="w-3.5 h-3.5 text-[#55D6FF]" />
          <span>Backend Config</span>
        </button>
      </div>

      <div className="w-full max-w-[420px] bg-[#161426]/90 border border-[#2b2742] rounded-3xl p-7 md:p-8 shadow-2xl relative backdrop-blur-md">
        {/* Brand Logo & Slogan */}
        <div className="text-center md:text-left">
          <div className="inline-flex items-baseline gap-0.5">
            <span className="text-4xl md:text-5xl font-black tracking-tight text-white font-brand">
              Kida<span className="text-[#FF4D9D]">8C</span>
            </span>
          </div>

          <p className="text-[#55D6FF] tracking-[0.25em] text-[11px] font-extrabold uppercase mt-2">
            CONNECT. CREATE. SHARE.
          </p>

          <h1 className="text-white text-2xl md:text-[28px] font-black mt-8 leading-snug font-brand">
            Your world starts here.
          </h1>

          <p className="text-[#B8B8C9] text-sm leading-relaxed mt-2.5">
            Discover videos, share moments and connect with creators around the world.
          </p>
        </div>

        {/* Method Toggle: Email / Phone */}
        <div className="grid grid-cols-2 gap-3 mt-7">
          <button
            type="button"
            onClick={() => {
              setMethod('email');
              setCodeSent(false);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-extrabold transition-all border ${
              method === 'email'
                ? 'bg-[#7C4DFF] border-[#7C4DFF] text-white shadow-lg shadow-[#7C4DFF]/30'
                : 'bg-[#201D32] border-[#48425F] text-[#B8B8C9] hover:text-white hover:border-[#55516E]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMethod('phone');
              setCodeSent(false);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-extrabold transition-all border ${
              method === 'phone'
                ? 'bg-[#7C4DFF] border-[#7C4DFF] text-white shadow-lg shadow-[#7C4DFF]/30'
                : 'bg-[#201D32] border-[#48425F] text-[#B8B8C9] hover:text-white hover:border-[#55516E]'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>Phone</span>
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
            <span className="font-bold">•</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <div className="mt-5 space-y-3.5">
          <div>
            <div className="relative">
              <input
                type={method === 'email' ? 'email' : 'tel'}
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                placeholder={
                  method === 'email'
                    ? 'Enter your email'
                    : 'Phone with country code (e.g. +1...)'
                }
                autoCapitalize="none"
                disabled={codeSent}
                className="w-full bg-[#242238] border border-[#48425F] rounded-xl px-4 py-3.5 text-sm text-white placeholder-[#89889B] focus:outline-none focus:border-[#55D6FF] focus:ring-1 focus:ring-[#55D6FF] transition-all disabled:opacity-60"
              />
              {!codeSent && !identity && (
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#55D6FF] hover:underline"
                >
                  Quick Demo
                </button>
              )}
            </div>
          </div>

          {codeSent && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="block text-xs font-semibold text-[#B8B8C9] mb-1.5">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code (e.g. 888888)"
                maxLength={8}
                className="w-full bg-[#242238] border border-[#FF4D9D] rounded-xl px-4 py-3.5 text-base tracking-widest text-center font-mono font-bold text-white placeholder-[#89889B] focus:outline-none focus:ring-2 focus:ring-[#FF4D9D]/50"
              />
              <div className="flex justify-between items-center mt-1.5 px-1">
                <span className="text-[11px] text-slate-400">Use code: <code className="text-[#FF4D9D] font-bold">888888</code></span>
                <button
                  type="button"
                  onClick={() => {
                    setCodeSent(false);
                    setOtp('');
                  }}
                  className="text-[11px] text-[#55D6FF] hover:underline font-semibold"
                >
                  Change {method}
                </button>
              </div>
            </div>
          )}

          {/* Action button */}
          <button
            type="button"
            onClick={codeSent ? verifyCode : sendCode}
            disabled={loading}
            className="w-full bg-[#FF4D9D] hover:bg-[#ff3b91] active:scale-[0.99] text-white py-3.5 px-4 rounded-xl text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-[#FF4D9D]/30 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <>
                <span>{codeSent ? 'Verify Code' : 'Send Code'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Quick Demo Guest Button */}
        <div className="mt-4 pt-4 border-t border-[#2b2742] text-center">
          <button
            type="button"
            onClick={() => {
              setIdentity('guest@kida8c.io');
              setMethod('email');
              supabase.auth.signInWithOtp({ email: 'guest@kida8c.io' }).then(() => {
                supabase.auth.verifyOtp({
                  email: 'guest@kida8c.io',
                  token: '888888',
                  type: 'email'
                });
              });
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-colors border border-white/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#55D6FF]" />
            <span>Instant One-Click Guest Access</span>
          </button>
        </div>

        {/* Terms */}
        <p className="text-[#89889B] text-[11px] text-center mt-5 leading-normal">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>

      {/* Footer slogan branding */}
      <div className="text-center text-[#55516E] text-xs mt-6 tracking-wide">
        Kida8C • A world of creativity
      </div>

      <SupabaseConfigModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
    </div>
  );
};
