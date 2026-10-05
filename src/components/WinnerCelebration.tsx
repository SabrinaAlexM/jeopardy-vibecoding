import React, { useEffect } from 'react';
import {
  Trophy,
  Crown,
  Sparkles,
  RotateCcw,
  Medal,
  Brain,
  Bot,
  Rocket,
  Cpu,
  Flame,
} from 'lucide-react';
import { Team, BoardCellState } from '../types';
import { triggerConfetti } from '../utils/confetti';
import { soundEffects } from '../utils/audio';

interface WinnerCelebrationProps {
  teams: {
    teamA: Team;
    teamB: Team;
  };
  boardCells: Record<string, BoardCellState>;
  soundEnabled: boolean;
  onPlayAgain: () => void;
  onEditQuestions: () => void;
  onRestoreOriginalQuestions: () => void;
  onBackToBoard: () => void;
}

const AVAILABLE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  brain: Brain,
  bot: Bot,
  sparkles: Sparkles,
  rocket: Rocket,
  cpu: Cpu,
  flame: Flame,
};

export const WinnerCelebration: React.FC<WinnerCelebrationProps> = ({
  teams,
  boardCells,
  soundEnabled,
  onPlayAgain,
  onEditQuestions,
  onRestoreOriginalQuestions,
  onBackToBoard,
}) => {
  const isTie = teams.teamA.score === teams.teamB.score;
  const winner =
    teams.teamA.score > teams.teamB.score ? teams.teamA : teams.teamB;
  const runnerUp =
    teams.teamA.score > teams.teamB.score ? teams.teamB : teams.teamA;

  useEffect(() => {
    triggerConfetti(4000);
    soundEffects.playVictory(soundEnabled);
  }, [soundEnabled]);

  const renderIcon = (iconId: string) => {
    const IconComp = AVAILABLE_ICONS[iconId] || Trophy;
    return <IconComp className="w-8 h-8" />;
  };

  const teamACount = Object.values(boardCells).filter(
    (c) => c.awardedTo === 'teamA'
  ).length;
  const teamBCount = Object.values(boardCells).filter(
    (c) => c.awardedTo === 'teamB'
  ).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 text-center animate-fade-in">
      {/* Trophy Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-md">
        <div className="flex flex-col items-center">
          <div className="inline-flex p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-500 mb-3 shadow-xs">
            <Trophy className="w-12 h-12" />
          </div>

          <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-1">
            Siegerehrung
          </span>

          {isTie ? (
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
                Ein faires Unentschieden!
              </h1>
              <p className="text-sm text-slate-600 mt-1.5 max-w-md mx-auto">
                Beide Gruppen haben genau {winner.score} Punkte erzielt. Grossartige Leistung beider Teams!
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-center gap-1.5 mb-1 text-amber-600 font-bold text-xs uppercase tracking-wider">
                <Crown className="w-4 h-4" />
                <span>Herzlichen Glückwunsch!</span>
                <Crown className="w-4 h-4" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
                {winner.name} gewinnt das Quiz!
              </h1>
              <p className="text-sm text-slate-600 mt-1.5 max-w-md mx-auto">
                Mit starkem Wissen und Teamwork holt sich <strong className="text-slate-900">{winner.name}</strong> den Sieg!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        {/* WINNER */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isTie
              ? 'bg-white border-slate-200'
              : 'bg-amber-50/40 border-amber-300 ring-2 ring-amber-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold font-mono text-amber-700 uppercase tracking-wider">
              {isTie ? 'Platz 1 (Geteilt)' : '1. Platz · Champion'}
            </span>
            <div className="p-1 rounded-md bg-amber-100 text-amber-700">
              <Medal className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: winner.color }}
            >
              {renderIcon(winner.icon)}
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-slate-900">
                {winner.name}
              </h3>
              <span className="text-xs text-slate-500">
                {winner.id === 'teamA' ? teamACount : teamBCount} Fragen richtig
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-amber-200/60 flex items-baseline justify-between">
            <span className="text-xs text-slate-500">Punkte:</span>
            <span className="text-2xl font-black font-mono text-amber-600 tabular-nums">
              {winner.score}
            </span>
          </div>
        </div>

        {/* RUNNER UP */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider">
              {isTie ? 'Platz 1 (Geteilt)' : '2. Platz'}
            </span>
            <div className="p-1 rounded-md bg-slate-100 text-slate-500">
              <Medal className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-xs opacity-90"
              style={{ backgroundColor: runnerUp.color }}
            >
              {renderIcon(runnerUp.icon)}
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-slate-900">
                {runnerUp.name}
              </h3>
              <span className="text-xs text-slate-500">
                {runnerUp.id === 'teamA' ? teamACount : teamBCount} Fragen richtig
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
            <span className="text-xs text-slate-500">Punkte:</span>
            <span className="text-2xl font-black font-mono text-slate-700 tabular-nums">
              {runnerUp.score}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4">
        <button
          onClick={onPlayAgain}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Revanche spielen</span>
        </button>

        <button
          onClick={onRestoreOriginalQuestions}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          title="Die ursprünglichen 12 Fragen wiederherstellen"
        >
          <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
          <span>Ursprungsfragen laden</span>
        </button>

        <button
          onClick={onEditQuestions}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Fragen editieren</span>
        </button>

        <button
          onClick={onBackToBoard}
          className="px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          Zum Board
        </button>
      </div>
    </div>
  );
};
