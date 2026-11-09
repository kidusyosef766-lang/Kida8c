import React from 'react';
import { TabType, UserSession } from '../types';
import {
  Smartphone,
  Monitor,
  LogOut,
  Sparkles,
  PlusCircle,
  Database
} from 'lucide-react';

interface Props {
  tab: TabType;
  setTab: (tab: TabType) => void;
  onLogout: () => void;
  isSimulatorMode: boolean;
  setIsSimulatorMode: (val: boolean) => void;
  onOpenConfig: () => void;
  session: UserSession | null;
}

export const Header: React.FC<Props> = ({
  tab,
  setTab,
  onLogout,
  isSimulatorMode,
  setIsSimulatorMode,
  onOpenConfig,
  session
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#10101D]/90 backdrop-blur-md border-b border-[#29243f] px-4 md:px-8 py-3.5 flex items-center justify-between gap-4 md:gap-8 transition-colors">
      {/* Zone 1: Brand Logo */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setTab('Home')}
          className="text-2xl md:text-3xl font-black tracking-tight text-white font-brand hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
        >
          Kida<span className="text-[#FF4D9D]">8C</span>
        </button>
        <span className="hidden lg:inline-block text-[10px] font-extrabold tracking-widest text-[#55D6FF] uppercase">
          CONNECT. CREATE. SHARE.
        </span>
      </div>

      {/* Zone 2: Desktop Navigation Links (single-line, concise) */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-extrabold tracking-wide text-[#9995AC]">
        {(['Home', 'Shorts', 'Discover', 'Create', 'Profile'] as const).map(item => (
          <button
            key={item}
            onClick={() => setTab(item)}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              tab === item
                ? 'text-[#55D6FF] font-black drop-shadow-[0_0_8px_rgba(85,214,255,0.4)]'
                : 'hover:text-white'
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Zone 3: Right Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Device Viewport Toggle (Phone Simulator vs Full Web) */}
        <button
          onClick={() => setIsSimulatorMode(!isSimulatorMode)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#201D32] border border-[#3b3558] text-slate-300 hover:text-white hover:border-[#55D6FF] transition-all"
          title={isSimulatorMode ? 'Switch to Full Web View' : 'Switch to Mobile Simulator'}
        >
          {isSimulatorMode ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-[#55D6FF]" />
              <span className="hidden xl:inline">Full Web View</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-[#FF70B5]" />
              <span className="hidden xl:inline">Phone Frame</span>
            </>
          )}
        </button>

        {/* Supabase backend config quick access */}
        <button
          onClick={onOpenConfig}
          className="p-2 rounded-xl bg-[#201D32] border border-[#3b3558] text-slate-300 hover:text-[#55D6FF] hover:border-[#55D6FF] transition-colors"
          title="Supabase Config"
        >
          <Database className="w-4 h-4" />
        </button>

        {/* Create quick button if not on Create */}
        {tab !== 'Create' && (
          <button
            onClick={() => setTab('Create')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF4D9D] hover:bg-[#ff3b91] text-white text-xs font-extrabold shadow-md shadow-[#FF4D9D]/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create</span>
          </button>
        )}

        {/* Sign out */}
        <button
          onClick={onLogout}
          className="px-3 py-1.5 rounded-xl text-xs font-extrabold text-[#55D6FF] hover:text-[#7ce2ff] bg-transparent hover:bg-white/5 transition-colors cursor-pointer"
        >
          Sign out
        </button>
      </div>
    </header>
  );
};
