import React, { useState, useEffect } from 'react';
import { PracticeSession } from './types/rowing';
import { getUpcomingPracticeSessions } from './services/weatherService';
import { Header } from './components/Header';
import { HeroVerdict } from './components/HeroVerdict';
import { ScheduleGrid } from './components/ScheduleGrid';
import { ConditionsTelemetry } from './components/ConditionsTelemetry';
import { RiverTideVisualizer } from './components/RiverTideVisualizer';
import { BoatMatrix } from './components/BoatMatrix';
import { BoathouseSimulator } from './components/BoathouseSimulator';
import { WindfinderComparison } from './components/WindfinderComparison';
import { NewburghWaterwaysLogo } from './components/NewburghWaterwaysLogo';
import { CoachBriefingModal } from './components/CoachBriefingModal';
import { SafetyReferenceModal } from './components/SafetyReferenceModal';
import { Waves, RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isCoachBriefingOpen, setIsCoachBriefingOpen] = useState<boolean>(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState<boolean>(false);
  const [safetyModalTab, setSafetyModalTab] = useState<'safety' | 'sources'>('safety');

  const openSafetyModal = (tab: 'safety' | 'sources' = 'safety') => {
    setSafetyModalTab(tab);
    setIsSafetyModalOpen(true);
  };

  // Load upcoming sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUpcomingPracticeSessions();
      setSessions(data);
      if (data.length > 0) {
        // Default to immediate next upcoming practice session
        const next = data.find((s) => s.isNextUpcoming) || data[0];
        setSelectedSessionId(next.id);
      }
    } catch (err) {
      console.error('Failed to load practice forecast:', err);
      setError('Unable to load river weather stream. Using boathouse baseline model.');
    } finally {
      setLoading(false);
    }
  };

  const selectedSession =
    sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  const handleSelectNextPractice = () => {
    if (sessions.length > 0) {
      const next = sessions.find((s) => s.isNextUpcoming) || sessions[0];
      setSelectedSessionId(next.id);
      scrollToSection('verdict-section');
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onScrollToSection={scrollToSection}
        onOpenSafetyModal={openSafetyModal}
        onSelectNextPractice={handleSelectNextPractice}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-12 sm:space-y-16">
        {loading ? (
          <div className="min-h-[480px] flex flex-col items-center justify-center space-y-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-8">
            <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <div className="text-center">
              <span className="text-base font-bold text-white block">
                Loading Hudson River & Newburgh Telemetry...
              </span>
              <span className="text-xs text-slate-400">
                Fetching Open-Meteo atmospheric forecast, tide stream, and 4-Oar temperature metrics
              </span>
            </div>
          </div>
        ) : error && !selectedSession ? (
          <div className="p-8 rounded-2xl border border-rose-800/60 bg-rose-950/20 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <div>
              <h2 className="text-lg font-bold text-white">Connection Interrupted</h2>
              <p className="text-xs text-slate-400 mt-1">{error}</p>
            </div>
            <button
              onClick={loadSessions}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-white"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry River Connection</span>
            </button>
          </div>
        ) : selectedSession ? (
          <>
            {/* 1. Primary Verdict Hero */}
            <HeroVerdict
              session={selectedSession}
              onOpenCoachBriefing={() => setIsCoachBriefingOpen(true)}
              onScrollToSchedule={() => scrollToSection('schedule-section')}
            />

            {/* 2. Practice Schedule Outlook */}
            <ScheduleGrid
              sessions={sessions}
              activeSessionId={selectedSession.id}
              onSelectSession={(s) => setSelectedSessionId(s.id)}
            />

            {/* 3. Deep Hudson River & Weather Telemetry */}
            <ConditionsTelemetry session={selectedSession} />

            {/* 4. Newburgh Bay Wind vs Current Vector Visualizer */}
            <RiverTideVisualizer session={selectedSession} />

            {/* 5. Windfinder Station vs High-Res Estuary Prediction Model */}
            <WindfinderComparison session={selectedSession} />

            {/* 6. Boathouse Fleet Clearance Matrix */}
            <BoatMatrix
              boatClearances={selectedSession.prediction.boatClearances}
              waterLikelihood={selectedSession.prediction.waterLikelihood}
              combinedTempF={selectedSession.prediction.combinedTemperatureF}
            />

            {/* 7. Interactive Boathouse Condition Simulator */}
            <BoathouseSimulator
              baseWeather={selectedSession.weather}
              baseTide={selectedSession.tide}
            />
          </>
        ) : null}
      </main>

      {/* Boathouse Footer */}
      <footer className="mt-16 border-t border-slate-800 bg-[#0c1222] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-white/95 border border-slate-300">
              <NewburghWaterwaysLogo size="sm" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white">
                Newburgh Waterways Center · Newburgh Rowing Club
              </span>
              <span className="text-[11px] text-slate-400">
                Ward Brothers Memorial Park · Hudson River Mile 60
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span>Ward Brothers Memorial Park, Newburgh, NY</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>USRowing Safety Committee Standards</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => openSafetyModal('sources')}
              className="text-cyan-400 hover:underline"
            >
              Data Sources & Stations
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => openSafetyModal('safety')}
              className="text-cyan-400 hover:underline"
            >
              Safety Rules Reference
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedSession && (
        <CoachBriefingModal
          session={selectedSession}
          isOpen={isCoachBriefingOpen}
          onClose={() => setIsCoachBriefingOpen(false)}
        />
      )}

      <SafetyReferenceModal
        isOpen={isSafetyModalOpen}
        initialTab={safetyModalTab}
        onClose={() => setIsSafetyModalOpen(false)}
      />
    </div>
  );
}
