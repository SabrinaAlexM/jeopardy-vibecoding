import React from 'react';
import {
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Bot,
  Brain,
  Rocket,
  Cpu,
  Flame,
  Shuffle,
  Undo2,
} from 'lucide-react';
import { Category, Question, Team, BoardCellState } from '../types';
import { soundEffects } from '../utils/audio';

interface GameBoardProps {
  categories: Category[];
  questions: Question[];
  teams: {
    teamA: Team;
    teamB: Team;
  };
  activeTeamId: 'teamA' | 'teamB';
  boardCells: Record<string, BoardCellState>;
  soundEnabled: boolean;
  onSelectCell: (categoryId: string, level: 1 | 2 | 3 | 4) => void;
  onSwitchTurn: () => void;
  onResetBoard: () => void;
  onRestoreOriginalQuestions: () => void;
  onEndGame: () => void;
  onEditQuestions: () => void;
  onEditTeams: () => void;
}

const AVAILABLE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  brain: Brain,
  bot: Bot,
  sparkles: Sparkles,
  rocket: Rocket,
  cpu: Cpu,
  flame: Flame,
};

export const GameBoard: React.FC<GameBoardProps> = ({
  categories,
  questions,
  teams,
  activeTeamId,
  boardCells,
  soundEnabled,
  onSelectCell,
  onSwitchTurn,
  onResetBoard,
  onRestoreOriginalQuestions,
  onEndGame,
  onEditQuestions,
  onEditTeams,
}) => {
  const activeTeam = teams[activeTeamId];
  const opponentTeam = teams[activeTeamId === 'teamA' ? 'teamB' : 'teamA'];

  const totalCells = categories.length * 4;
  const answeredCount = Object.values(boardCells).filter((c) => c.isAnswered).length;

  const renderTeamIcon = (team: Team) => {
    const IconComp = AVAILABLE_ICONS[team.icon] || Brain;
    return <IconComp className="w-4 h-4 sm:w-5 h-5" />;
  };

  return (
    <div className="h-full flex flex-col justify-between overflow-hidden">
      {/* 1. Sleek Unified Score & Turn Header (~52px) */}
      <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center shrink-0">
        {/* TEAM A SCORE */}
        <div
          className={`col-span-5 sm:col-span-4 p-2 sm:p-2.5 rounded-xl border transition-all ${
            activeTeamId === 'teamA'
              ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-300 shadow-sm'
              : 'bg-white border-slate-200 opacity-90'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                style={{ backgroundColor: teams.teamA.color }}
              >
                {renderTeamIcon(teams.teamA)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold font-display text-slate-900 truncate">
                    {teams.teamA.name}
                  </span>
                  {activeTeamId === 'teamA' && (
                    <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                  )}
                </div>
                <span className="text-[10px] text-slate-500 block -mt-0.5">Gruppe 1</span>
              </div>
            </div>
            <div className="text-right pl-2">
              <div className="text-xl sm:text-2xl font-black font-mono text-sky-700 tabular-nums leading-none">
                {teams.teamA.score}
              </div>
              <span className="text-[9px] uppercase font-bold text-slate-400">Pkt</span>
            </div>
          </div>
        </div>

        {/* CENTER TURN INDICATOR */}
        <div className="col-span-2 sm:col-span-4 flex flex-col items-center justify-center text-center px-1">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <span className="text-slate-400">Am Zug:</span>
            <strong
              className="font-bold px-2 py-0.5 rounded-md text-xs border"
              style={{
                backgroundColor: `${activeTeam.color}15`,
                borderColor: `${activeTeam.color}40`,
                color: activeTeam.color,
              }}
            >
              {activeTeam.name}
            </strong>
          </div>
          <button
            onClick={onSwitchTurn}
            className="inline-flex items-center gap-1 mt-0.5 text-[11px] text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
            title="Zug an die andere Gruppe übergeben"
          >
            <Shuffle className="w-3 h-3" />
            <span className="hidden sm:inline">Wechseln</span>
          </button>
        </div>

        {/* TEAM B SCORE */}
        <div
          className={`col-span-5 sm:col-span-4 p-2 sm:p-2.5 rounded-xl border transition-all ${
            activeTeamId === 'teamB'
              ? 'bg-orange-50/80 border-orange-400 ring-2 ring-orange-300 shadow-sm'
              : 'bg-white border-slate-200 opacity-90'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                style={{ backgroundColor: teams.teamB.color }}
              >
                {renderTeamIcon(teams.teamB)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold font-display text-slate-900 truncate">
                    {teams.teamB.name}
                  </span>
                  {activeTeamId === 'teamB' && (
                    <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  )}
                </div>
                <span className="text-[10px] text-slate-500 block -mt-0.5">Gruppe 2</span>
              </div>
            </div>
            <div className="text-right pl-2">
              <div className="text-xl sm:text-2xl font-black font-mono text-orange-700 tabular-nums leading-none">
                {teams.teamB.score}
              </div>
              <span className="text-[9px] uppercase font-bold text-slate-400">Pkt</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Responsive Jeopardy Grid (3 columns x 5 rows: 1 Category Header + 4 Question Rows) */}
      <div className="flex-1 min-h-0 grid grid-cols-3 grid-rows-5 gap-2 sm:gap-2.5 my-2">
        {/* ROW 1: 3 CATEGORY HEADERS */}
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className="bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-center flex flex-col items-center justify-center shadow-xs overflow-hidden"
          >
            <div className="flex items-center gap-1.5 max-w-full">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <h3 className="text-xs sm:text-sm font-bold font-display text-slate-900 truncate">
                {cat.name}
              </h3>
            </div>
            <span className="text-[10px] text-slate-500 leading-none mt-0.5">
              Kategorie {idx + 1}
            </span>
          </div>
        ))}

        {/* ROWS 2 to 5: QUESTION CARDS */}
        {([1, 2, 3, 4] as const).map((level) => {
          const points = level * 100;
          return categories.map((cat) => {
            const cellKey = `${cat.id}-${level}`;
            const cellState = boardCells[cellKey];
            const isAnswered = cellState?.isAnswered;
            const awardedTeamId = cellState?.awardedTo;

            if (isAnswered) {
              const awardedTeam = awardedTeamId ? teams[awardedTeamId] : null;
              return (
                <div
                  key={cellKey}
                  className="h-full min-h-0 rounded-xl bg-slate-100/80 border border-slate-200/80 flex flex-col items-center justify-center text-slate-400 select-none"
                >
                  {awardedTeam ? (
                    <div className="flex flex-col items-center gap-0.5">
                      <div
                        className="px-2 py-0.5 rounded-md text-white text-[11px] font-bold shadow-xs truncate max-w-[90px]"
                        style={{ backgroundColor: awardedTeam.color }}
                      >
                        +{points}
                      </div>
                      <span className="text-[10px] text-slate-500 truncate max-w-[100px]">
                        {awardedTeam.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <XCircle className="w-5 h-5 text-slate-400" />
                      <span className="text-[10px] text-slate-400 font-mono">0 Pkt</span>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={cellKey}
                onClick={() => {
                  soundEffects.playSelect(soundEnabled);
                  onSelectCell(cat.id, level);
                }}
                className="group h-full min-h-0 rounded-xl bg-white border border-slate-200/90 hover:border-indigo-500 hover:bg-indigo-50/30 text-center flex flex-col items-center justify-center transition-all duration-150 transform hover:-translate-y-0.5 shadow-xs hover:shadow-md cursor-pointer p-1"
              >
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
                  Stufe {level}
                </span>
                <span className="text-xl sm:text-2xl md:text-3xl font-black font-mono text-indigo-600 group-hover:text-indigo-700 tabular-nums leading-tight">
                  {points}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 group-hover:text-indigo-500 font-medium">
                  Punkte
                </span>
              </button>
            );
          });
        })}
      </div>

      {/* 3. Sleek Compact Footer Toolbar (~38px) */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200 text-xs text-slate-600 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
            {answeredCount}/{totalCells} Fragen
          </span>
          <button
            onClick={onEditQuestions}
            className="px-2 sm:px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          >
            Fragen bearbeiten
          </button>
          <button
            onClick={onEditTeams}
            className="px-2 sm:px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          >
            Gruppen
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Always available Reset to original questions */}
          <button
            onClick={onRestoreOriginalQuestions}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 border border-slate-200 rounded-md transition-colors cursor-pointer"
            title="Die ursprünglichen Standardfragen für CAS PICTS laden"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span className="hidden sm:inline">Ursprungsfragen laden</span>
          </button>

          <button
            onClick={onResetBoard}
            className="px-2 sm:px-2.5 py-1 text-slate-500 hover:text-rose-700 hover:bg-rose-50 border border-slate-200 rounded-md transition-colors cursor-pointer"
            title="Punkte auf 0 und alle Felder wieder freigeben"
          >
            Board leeren
          </button>

          <button
            onClick={onEndGame}
            className="inline-flex items-center gap-1.5 px-3 py-1 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md shadow-xs transition-colors cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>Sieger feiern</span>
          </button>
        </div>
      </div>
    </div>
  );
};
