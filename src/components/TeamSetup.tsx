import React, { useState } from 'react';
import {
  Users,
  Bot,
  Zap,
  Sparkles,
  Rocket,
  Brain,
  Cpu,
  Flame,
  ArrowRight,
  ArrowLeft,
  Shuffle,
} from 'lucide-react';
import { Team } from '../types';
import { soundEffects } from '../utils/audio';

interface TeamSetupProps {
  teams: {
    teamA: Team;
    teamB: Team;
  };
  activeTeamId: 'teamA' | 'teamB';
  soundEnabled: boolean;
  onUpdateTeams: (teams: { teamA: Team; teamB: Team }) => void;
  onSetActiveTeamId: (teamId: 'teamA' | 'teamB') => void;
  onBackToQuestions: () => void;
  onStartGame: () => void;
}

const AVAILABLE_ICONS = [
  { id: 'brain', label: 'Gehirn', icon: Brain },
  { id: 'bot', label: 'Roboter', icon: Bot },
  { id: 'sparkles', label: 'Funken', icon: Sparkles },
  { id: 'rocket', label: 'Rakete', icon: Rocket },
  { id: 'cpu', label: 'Chip', icon: Cpu },
  { id: 'flame', label: 'Flamme', icon: Flame },
];

const COLOR_PRESETS = [
  { id: '#0284c7', label: 'Blau' },
  { id: '#ea580c', label: 'Orange' },
  { id: '#9333ea', label: 'Violett' },
  { id: '#db2777', label: 'Pink' },
  { id: '#059669', label: 'Smaragd' },
  { id: '#ca8a04', label: 'Gold' },
];

export const TeamSetup: React.FC<TeamSetupProps> = ({
  teams,
  activeTeamId,
  soundEnabled,
  onUpdateTeams,
  onSetActiveTeamId,
  onBackToQuestions,
  onStartGame,
}) => {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleUpdateTeam = (
    teamKey: 'teamA' | 'teamB',
    field: keyof Team,
    val: any
  ) => {
    onUpdateTeams({
      ...teams,
      [teamKey]: {
        ...teams[teamKey],
        [field]: val,
      },
    });
  };

  const handleRandomizeStartingTeam = () => {
    setIsFlipping(true);
    soundEffects.playSelect(soundEnabled);
    let flips = 0;
    const interval = setInterval(() => {
      onSetActiveTeamId(flips % 2 === 0 ? 'teamA' : 'teamB');
      flips++;
      if (flips >= 8) {
        clearInterval(interval);
        const finalPick: 'teamA' | 'teamB' = Math.random() < 0.5 ? 'teamA' : 'teamB';
        onSetActiveTeamId(finalPick);
        setIsFlipping(false);
        soundEffects.playCorrect(soundEnabled);
      }
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          Schritt 2: Gruppenkonfiguration
        </span>
        <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-0.5">
          Gruppennamen & Wappen festlegen
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          Vergib die beiden Gruppennamen für deine Kursgruppe. Das Spiel wechselt nach jeder beantworteten Frage automatisch zur nächsten Gruppe.
        </p>
      </div>

      {/* Two Teams Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* TEAM A */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            activeTeamId === 'teamA'
              ? 'bg-sky-50/50 border-sky-400 shadow-sm ring-2 ring-sky-200'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-700">
              Gruppe 1
            </span>
            {activeTeamId === 'teamA' && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                Beginnt
              </span>
            )}
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Gruppenname
              </label>
              <input
                type="text"
                value={teams.teamA.name}
                onChange={(e) => handleUpdateTeam('teamA', 'name', e.target.value)}
                className="w-full px-3 py-2 text-sm font-bold bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500"
                placeholder="Name Gruppe 1"
              />
            </div>

            {/* Color picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Teamfarbe
              </label>
              <div className="flex items-center gap-2">
                {COLOR_PRESETS.map((cp) => (
                  <button
                    key={cp.id}
                    type="button"
                    onClick={() => handleUpdateTeam('teamA', 'color', cp.id)}
                    style={{ backgroundColor: cp.id }}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                      teams.teamA.color === cp.id
                        ? 'ring-3 ring-slate-900/30 scale-110'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    title={cp.label}
                  />
                ))}
              </div>
            </div>

            {/* Icon picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Wappen
              </label>
              <div className="flex items-center gap-2">
                {AVAILABLE_ICONS.map((ic) => {
                  const IconComp = ic.icon;
                  const isSelected = teams.teamA.icon === ic.id;
                  return (
                    <button
                      key={ic.id}
                      type="button"
                      onClick={() => handleUpdateTeam('teamA', 'icon', ic.id)}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-sky-100 border-sky-400 text-sky-800'
                          : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900'
                      }`}
                      title={ic.label}
                    >
                      <IconComp className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* TEAM B */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            activeTeamId === 'teamB'
              ? 'bg-orange-50/50 border-orange-400 shadow-sm ring-2 ring-orange-200'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-700">
              Gruppe 2
            </span>
            {activeTeamId === 'teamB' && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                Beginnt
              </span>
            )}
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Gruppenname
              </label>
              <input
                type="text"
                value={teams.teamB.name}
                onChange={(e) => handleUpdateTeam('teamB', 'name', e.target.value)}
                className="w-full px-3 py-2 text-sm font-bold bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                placeholder="Name Gruppe 2"
              />
            </div>

            {/* Color picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Teamfarbe
              </label>
              <div className="flex items-center gap-2">
                {COLOR_PRESETS.map((cp) => (
                  <button
                    key={cp.id}
                    type="button"
                    onClick={() => handleUpdateTeam('teamB', 'color', cp.id)}
                    style={{ backgroundColor: cp.id }}
                    className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                      teams.teamB.color === cp.id
                        ? 'ring-3 ring-slate-900/30 scale-110'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    title={cp.label}
                  />
                ))}
              </div>
            </div>

            {/* Icon picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Wappen
              </label>
              <div className="flex items-center gap-2">
                {AVAILABLE_ICONS.map((ic) => {
                  const IconComp = ic.icon;
                  const isSelected = teams.teamB.icon === ic.id;
                  return (
                    <button
                      key={ic.id}
                      type="button"
                      onClick={() => handleUpdateTeam('teamB', 'icon', ic.id)}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-orange-100 border-orange-400 text-orange-800'
                          : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900'
                      }`}
                      title={ic.label}
                    >
                      <IconComp className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Starting Turn Selection */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Wer beginnt die 1. Runde?
          </span>
          <p className="text-sm text-slate-800 mt-0.5">
            Aktuell ausgewählt:{' '}
            <strong className="text-indigo-700 font-bold">
              {activeTeamId === 'teamA' ? teams.teamA.name : teams.teamB.name}
            </strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSetActiveTeamId('teamA')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              activeTeamId === 'teamA'
                ? 'bg-sky-600 text-white border-sky-600 font-bold'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {teams.teamA.name}
          </button>
          <button
            onClick={() => onSetActiveTeamId('teamB')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              activeTeamId === 'teamB'
                ? 'bg-orange-600 text-white border-orange-600 font-bold'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {teams.teamB.name}
          </button>
          <button
            onClick={handleRandomizeStartingTeam}
            disabled={isFlipping}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg transition-colors cursor-pointer"
            title="Münzwurf / Zufallsauswahl"
          >
            <Shuffle className={`w-3.5 h-3.5 ${isFlipping ? 'animate-spin' : ''}`} />
            <span>Münzwurf</span>
          </button>
        </div>
      </div>

      {/* Nav Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          onClick={onBackToQuestions}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück zu den Fragen</span>
        </button>

        <button
          onClick={onStartGame}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <span>Spiel starten!</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
