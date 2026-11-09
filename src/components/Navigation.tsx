import React from 'react';
import { TabType } from '../types';
import { Home, PlaySquare, Compass, PlusSquare, User } from 'lucide-react';

interface Props {
  tab: TabType;
  setTab: (tab: TabType) => void;
}

const navItems: { key: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
  { key: 'Home', label: 'Home', icon: Home },
  { key: 'Shorts', label: 'Shorts', icon: PlaySquare },
  { key: 'Discover', label: 'Discover', icon: Compass },
  { key: 'Create', label: 'Create', icon: PlusSquare },
  { key: 'Profile', label: 'Profile', icon: User }
];

export const Navigation: React.FC<Props> = ({ tab, setTab }) => {
  return (
    <nav className="fixed md:hidden bottom-0 inset-x-0 z-40 bg-[#121021]/95 backdrop-blur-lg border-t border-[#2d2847] px-2 py-1.5 shadow-[0_-8px_20px_rgba(0,0,0,0.5)]">
      <div className="grid grid-cols-5 items-center h-14 max-w-md mx-auto">
        {navItems.map(({ key, label, icon: Icon }) => {
          const isActive = tab === key;
          const isCreate = key === 'Create';

          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="min-h-[44px] min-w-[44px] flex flex-col items-center justify-center relative cursor-pointer group"
            >
              {isCreate ? (
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#FF4D9D] text-white shadow-lg shadow-[#FF4D9D]/40 scale-105'
                    : 'bg-[#292244] text-[#FF4D9D] border border-[#FF4D9D]/30 group-hover:bg-[#FF4D9D] group-hover:text-white'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
              ) : (
                <>
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-[#55D6FF]' : 'text-[#9995AC]'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-bold tracking-tight mt-1 transition-colors ${
                      isActive ? 'text-[#55D6FF]' : 'text-[#9995AC]'
                    }`}
                  >
                    {label}
                  </span>
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-[#55D6FF] mt-0.5 animate-pulse" />
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
