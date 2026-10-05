import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Info,
  Sparkles,
} from 'lucide-react';
import { Question, Category, Team } from '../types';
import { soundEffects } from '../utils/audio';

interface QuestionModalProps {
  question: Question;
  category: Category;
  activeTeam: Team;
  opponentTeam: Team;
  soundEnabled: boolean;
  onResolve: (awardedTo: 'teamA' | 'teamB' | null, points: number) => void;
  onClose: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  question,
  category,
  activeTeam,
  opponentTeam,
  soundEnabled,
  onResolve,
  onClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [awardedTeam, setAwardedTeam] = useState<'teamA' | 'teamB' | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0 && !isRevealed) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, isRevealed]);

  const handleSelectOption = (idx: number) => {
    if (isRevealed) return;
    setSelectedIndex(idx);
    soundEffects.playSelect(soundEnabled);
  };

  const handleReveal = () => {
    if (isRevealed) return;
    setIsRevealed(true);
    setTimerActive(false);

    const isCorrect = selectedIndex === question.correctIndex;
    if (isCorrect) {
      soundEffects.playCorrect(soundEnabled);
      setAwardedTeam(activeTeam.id);
    } else {
      soundEffects.playWrong(soundEnabled);
      setAwardedTeam(null);
    }
  };

  const handleConfirmAndNext = () => {
    onResolve(awardedTeam, question.points);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-xs sm:text-sm font-bold font-display uppercase tracking-wider text-slate-700">
              {category.name}
            </span>
            <span className="text-slate-300">·</span>
            <span className="px-2 py-0.5 text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md">
              {question.points} Punkte
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Timer Button */}
            <button
              type="button"
              onClick={() => setTimerActive(!timerActive)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                timerActive
                  ? timeLeft <= 10
                    ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold animate-pulse'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
              title="60 Sekunden Timer starten/stoppen"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{timeLeft}s</span>
            </button>

            {/* Active Team badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs"
              style={{
                backgroundColor: `${activeTeam.color}15`,
                borderColor: `${activeTeam.color}40`,
                color: activeTeam.color,
              }}
            >
              <span>Am Zug: {activeTeam.name}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* Question Text Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6 shadow-2xs">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold font-display text-slate-900 leading-snug">
              {question.question}
            </h2>
          </div>

          {/* 4 Multiple Choice Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedIndex === idx;
              const isCorrectAnswer = isRevealed && question.correctIndex === idx;
              const isWrongSelected = isRevealed && isSelected && !isCorrectAnswer;

              let cardStyle =
                'bg-white border-slate-200 hover:border-indigo-400 hover:bg-slate-50 text-slate-800 shadow-2xs';

              if (isSelected && !isRevealed) {
                cardStyle =
                  'bg-indigo-50/70 border-indigo-500 text-indigo-950 ring-2 ring-indigo-200 shadow-sm';
              } else if (isCorrectAnswer) {
                cardStyle =
                  'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300 font-semibold shadow-sm';
              } else if (isWrongSelected) {
                cardStyle =
                  'bg-rose-50 border-rose-400 text-rose-950 ring-1 ring-rose-200';
              } else if (isRevealed) {
                cardStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isRevealed}
                  onClick={() => handleSelectOption(idx)}
                  className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${cardStyle}`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isCorrectAnswer
                        ? 'bg-emerald-600 text-white'
                        : isWrongSelected
                        ? 'bg-rose-600 text-white'
                        : isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="text-sm leading-relaxed pt-0.5">
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Post-Reveal: Didaktische Erklärung */}
          {isRevealed && (
            <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 animate-fade-in space-y-1.5">
              <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs uppercase tracking-wider">
                <Info className="w-4 h-4 text-indigo-600" />
                <span>Didaktische Erklärung & Hintergrund:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}

          {/* Point Distribution Override (if revealed) */}
          {isRevealed && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-600 font-medium">
                Punktevergabe (+{question.points} Pkt):
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAwardedTeam(activeTeam.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                    awardedTeam === activeTeam.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {activeTeam.name} (+{question.points})
                </button>
                <button
                  type="button"
                  onClick={() => setAwardedTeam(opponentTeam.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                    awardedTeam === opponentTeam.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                  title="Punkte an das gegnerische Team geben"
                >
                  {opponentTeam.name} (+{question.points})
                </button>
                <button
                  type="button"
                  onClick={() => setAwardedTeam(null)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    awardedTeam === null
                      ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                      : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Keine Punkte (0)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-200 bg-slate-50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            Abbrechen
          </button>

          {!isRevealed ? (
            <button
              type="button"
              onClick={handleReveal}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Antwort auflösen</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmAndNext}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>Nächste Runde</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
