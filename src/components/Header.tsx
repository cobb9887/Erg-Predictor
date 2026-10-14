import React from 'react';
import { Waves, CalendarClock, LifeBuoy } from 'lucide-react';
import { NewburghWaterwaysLogo } from './NewburghWaterwaysLogo';

interface HeaderProps {
  onScrollToSection: (sectionId: string) => void;
  onOpenSafetyModal: (tab?: 'safety' | 'sources') => void;
  onSelectNextPractice: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onScrollToSection,
  onOpenSafetyModal,
  onSelectNextPractice,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0c1222]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3">
        {/* Zone 1: Brand wordmark (single element with official Newburgh Waterways Center logo) */}
        <button
          onClick={onSelectNextPractice}
          className="flex items-center gap-3 text-left group shrink-0 focus:outline-none"
          title="Newburgh Waterways Center - Water vs Erg Predictor"
        >
          <div className="px-2 py-1 rounded-lg bg-white/95 border border-slate-300 shadow-sm flex items-center justify-center">
            <NewburghWaterwaysLogo size="sm" />
          </div>
          <div className="hidden xl:flex flex-col">
            <span className="text-xs font-bold text-white tracking-tight">
              Rowing Safety & Prediction
            </span>
            <span className="text-[10px] text-[#2BB4C0]">
              Hudson River Mile 60
            </span>
          </div>
        </button>

        {/* Zone 2: Clean single-line nav links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-300">
          <button
            onClick={() => onScrollToSection('verdict-section')}
            className="hover:text-[#2BB4C0] transition-colors whitespace-nowrap shrink-0"
          >
            Prediction
          </button>
          <button
            onClick={() => onScrollToSection('schedule-section')}
            className="hover:text-[#2BB4C0] transition-colors whitespace-nowrap shrink-0"
          >
            Schedule
          </button>
          <button
            onClick={() => onScrollToSection('telemetry-section')}
            className="hover:text-[#2BB4C0] transition-colors whitespace-nowrap shrink-0"
          >
            River Telemetry
          </button>
          <button
            onClick={() => onScrollToSection('tide-visualizer')}
            className="hover:text-[#2BB4C0] transition-colors whitespace-nowrap shrink-0"
          >
            Tide & Chop
          </button>
          <button
            onClick={() => onScrollToSection('windfinder-section')}
            className="hover:text-[#F5A623] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            <span>Windfinder Sync</span>
          </button>
          <button
            onClick={() => onScrollToSection('fleet-section')}
            className="hover:text-[#2BB4C0] transition-colors whitespace-nowrap shrink-0"
          >
            Fleet Matrix
          </button>
          <button
            onClick={() => onScrollToSection('simulator-section')}
            className="hover:text-[#2BB4C0] transition-colors whitespace-nowrap shrink-0"
          >
            Simulator
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onOpenSafetyModal('sources')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="View Weather & Tide Data Sources"
          >
            <span>Data Sources</span>
          </button>

          <button
            onClick={() => onOpenSafetyModal('safety')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="View USRowing 4-Oar & Weather Safety Rules"
          >
            <LifeBuoy className="w-3.5 h-3.5 text-cyan-400" />
            <span>Safety Rules</span>
          </button>

          <button
            onClick={onSelectNextPractice}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#131c38] bg-[#2BB4C0] hover:bg-[#38CBD8] rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            <CalendarClock className="w-3.5 h-3.5" />
            <span>Next Practice</span>
          </button>
        </div>
      </div>
    </header>
  );
};
