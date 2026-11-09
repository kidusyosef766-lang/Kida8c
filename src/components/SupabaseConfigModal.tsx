import React, { useState } from 'react';
import { getSupabaseConfig, saveSupabaseConfig } from '../lib/supabase';
import { X, Database, CheckCircle2, AlertCircle, Key, Link2, RefreshCw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url.includes('YOUR_PROJECT') ? '' : currentConfig.url);
  const [key, setKey] = useState(currentConfig.key === 'YOUR_SUPABASE_ANON_KEY' ? '' : currentConfig.key);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(url, key);
    setSavedSuccess(true);
  };

  const handleResetToDemo = () => {
    saveSupabaseConfig('', '');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1a172c] border border-[#3b3658] w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#7C4DFF]/20 border border-[#7C4DFF]/40 flex items-center justify-center text-[#7C4DFF]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-brand">Supabase Connection Settings</h2>
            <p className="text-xs text-slate-400">Configure real Supabase backend or preview demo</p>
          </div>
        </div>

        <div className="mb-4 p-3 rounded-xl bg-[#24203a] border border-[#443e68] text-xs space-y-1.5">
          <div className="flex items-center gap-2">
            {currentConfig.isConfigured ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-400 font-semibold">Active: Connected to custom Supabase instance</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-[#55D6FF] shrink-0" />
                <span className="text-[#55D6FF] font-semibold">Active: Instant Preview Mode (Mock OTP code: 888888)</span>
              </>
            )}
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Kida8C supports both 100% instant interactive preview (no setup required) and full live Supabase OTP authentication with your own project credentials.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-[#55D6FF]" />
              Supabase Project URL
            </label>
            <input
              type="text"
              placeholder="https://your-project.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-[#242238] border border-[#48425F] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#7C4DFF] focus:ring-1 focus:ring-[#7C4DFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#FF4D9D]" />
              Supabase Anon Public Key
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-[#242238] border border-[#48425F] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FF4D9D] focus:ring-1 focus:ring-[#FF4D9D]"
            />
          </div>

          {savedSuccess && (
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Configuration saved! Reloading client...
            </p>
          )}

          <div className="flex items-center justify-between pt-2 gap-3">
            <button
              type="button"
              onClick={handleResetToDemo}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset to Demo Mode
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7C4DFF] to-[#FF4D9D] hover:opacity-90 shadow-lg shadow-[#7C4DFF]/25 transition-all"
            >
              Save Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
