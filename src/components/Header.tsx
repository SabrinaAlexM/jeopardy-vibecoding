import React from 'react';
import { Volume2, VolumeX, Maximize, Minimize, RotateCcw, HelpCircle } from 'lucide-react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  quizTitle: string;
  soundEnabled: boolean;
  gameStarted: boolean;
  onNavigate: (view: AppView) => void;
  onToggleSound: () => void;
  onRestoreDefaultQuestions: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  quizTitle,
  soundEnabled,
  gameStarted,
  onNavigate,
  onToggleSound,
  onRestoreDefaultQuestions,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  React.useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs shrink-0">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-13 sm:h-14 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark - "KI-Quiz" */}
        <div
          onClick={() => onNavigate('play')}
          className="cursor-pointer flex items-center gap-2 group"
        >
          <span className="text-xl sm:text-2xl font-black font-display tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
            {quizTitle || 'KI-Quiz'}
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={() => onNavigate('questions')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              currentView === 'questions'
                ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            1. Fragen
          </button>
          <button
            onClick={() => onNavigate('teams')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              currentView === 'teams'
                ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            2. Gruppen
          </button>
          <button
            onClick={() => onNavigate('play')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              currentView === 'play'
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            3. Spielen
          </button>
        </nav>

        {/* Zone 3: Actions (Always restore questions + Sound + Fullscreen) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Always accessible Reset to Original Questions */}
          <button
            onClick={onRestoreDefaultQuestions}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-lg transition-colors cursor-pointer"
            title="Ursprüngliche Fragen wiederherstellen"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Ursprungsfragen</span>
          </button>

          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            title={soundEnabled ? 'Ton stummschalten' : 'Ton aktivieren'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            title={isFullscreen ? 'Vollbild beenden' : 'Beamer- & Vollbildmodus (bildschirmfüllend)'}
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4 text-indigo-600" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
