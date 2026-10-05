/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Category,
  Question,
  Team,
  BoardCellState,
  AppView,
} from './types';
import { DEFAULT_CATEGORIES, DEFAULT_QUESTIONS } from './data/defaultQuestions';
import { Header } from './components/Header';
import { QuestionsEditor } from './components/QuestionsEditor';
import { TeamSetup } from './components/TeamSetup';
import { GameBoard } from './components/GameBoard';
import { QuestionModal } from './components/QuestionModal';
import { WinnerCelebration } from './components/WinnerCelebration';
import { soundEffects } from './utils/audio';

const STORAGE_KEY = 'ki_quiz_state_v2';

export default function App() {
  const [quizTitle] = useState<string>('KI-Quiz');

  // Load state from localStorage or defaults
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.categories?.length === 3) return parsed.categories;
      }
    } catch {}
    return DEFAULT_CATEGORIES;
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.questions?.length) return parsed.questions;
      }
    } catch {}
    return DEFAULT_QUESTIONS;
  });

  const [teams, setTeams] = useState<{ teamA: Team; teamB: Team }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.teams?.teamA && parsed.teams?.teamB) return parsed.teams;
      }
    } catch {}
    return {
      teamA: {
        id: 'teamA',
        name: 'Team Neuronen',
        color: '#0284c7', // Sky Blue
        icon: 'brain',
        score: 0,
      },
      teamB: {
        id: 'teamB',
        name: 'Team Algorithmen',
        color: '#ea580c', // Orange
        icon: 'bot',
        score: 0,
      },
    };
  });

  const [activeTeamId, setActiveTeamId] = useState<'teamA' | 'teamB'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activeTeamId) return parsed.activeTeamId;
      }
    } catch {}
    return 'teamA';
  });

  const [boardCells, setBoardCells] = useState<Record<string, BoardCellState>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.boardCells) return parsed.boardCells;
      }
    } catch {}
    return {};
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.currentView) return parsed.currentView;
      }
    } catch {}
    return 'play';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.soundEnabled === 'boolean') return parsed.soundEnabled;
      }
    } catch {}
    return true;
  });

  // Active question modal state
  const [activeModalCoords, setActiveModalCoords] = useState<{
    categoryId: string;
    level: 1 | 2 | 3 | 4;
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        categories,
        questions,
        teams,
        activeTeamId,
        boardCells,
        currentView,
        soundEnabled,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {}
  }, [
    categories,
    questions,
    teams,
    activeTeamId,
    boardCells,
    currentView,
    soundEnabled,
  ]);

  // Handler to restore original default questions (Always available)
  const handleRestoreDefaultQuestions = () => {
    const confirmed = window.confirm(
      'Möchtest du alle 12 Fragen und Kategorien auf die ursprünglichen Standardfragen zurücksetzen?'
    );
    if (confirmed) {
      setCategories(DEFAULT_CATEGORIES);
      setQuestions(DEFAULT_QUESTIONS);
      setBoardCells({});
      soundEffects.playCorrect(soundEnabled);
    }
  };

  const handleSelectCell = (categoryId: string, level: 1 | 2 | 3 | 4) => {
    setActiveModalCoords({ categoryId, level });
  };

  const handleResolveQuestion = (
    awardedTo: 'teamA' | 'teamB' | null,
    points: number
  ) => {
    if (!activeModalCoords) return;

    const cellKey = `${activeModalCoords.categoryId}-${activeModalCoords.level}`;
    const question = questions.find(
      (q) =>
        q.categoryId === activeModalCoords.categoryId &&
        q.level === activeModalCoords.level
    );

    const newBoardCells: Record<string, BoardCellState> = {
      ...boardCells,
      [cellKey]: {
        categoryId: activeModalCoords.categoryId,
        level: activeModalCoords.level,
        questionId: question ? question.id : cellKey,
        isAnswered: true,
        awardedTo,
        pointsEarned: awardedTo ? points : 0,
      },
    };
    setBoardCells(newBoardCells);

    if (awardedTo) {
      setTeams((prev) => ({
        ...prev,
        [awardedTo]: {
          ...prev[awardedTo],
          score: prev[awardedTo].score + points,
        },
      }));
    }

    setActiveTeamId((prev) => (prev === 'teamA' ? 'teamB' : 'teamA'));
    setActiveModalCoords(null);

    const totalCells = categories.length * 4;
    const answeredCount = Object.values(newBoardCells).filter(
      (c) => c.isAnswered
    ).length;

    if (answeredCount >= totalCells) {
      setTimeout(() => {
        setCurrentView('winner');
      }, 500);
    }
  };

  const handleSwitchTurn = () => {
    soundEffects.playSelect(soundEnabled);
    setActiveTeamId((prev) => (prev === 'teamA' ? 'teamB' : 'teamA'));
  };

  const handleResetBoard = () => {
    if (
      window.confirm(
        'Möchtest du das Board leeren? Alle Fragen werden wieder freigegeben und Punkte auf 0 gesetzt.'
      )
    ) {
      setBoardCells({});
      setTeams((prev) => ({
        teamA: { ...prev.teamA, score: 0 },
        teamB: { ...prev.teamB, score: 0 },
      }));
      soundEffects.playSelect(soundEnabled);
    }
  };

  const handlePlayAgain = () => {
    setBoardCells({});
    setTeams((prev) => ({
      teamA: { ...prev.teamA, score: 0 },
      teamB: { ...prev.teamB, score: 0 },
    }));
    setCurrentView('play');
    soundEffects.playSelect(soundEnabled);
  };

  const activeQuestion = activeModalCoords
    ? questions.find(
        (q) =>
          q.categoryId === activeModalCoords.categoryId &&
          q.level === activeModalCoords.level
      ) || null
    : null;

  const activeCategory = activeModalCoords
    ? categories.find((c) => c.id === activeModalCoords.categoryId) || null
    : null;

  return (
    <div className="h-screen max-h-screen w-screen flex flex-col bg-slate-50 text-slate-900 antialiased overflow-hidden select-none">
      {/* 1. Fixed Header */}
      <Header
        currentView={currentView}
        quizTitle={quizTitle}
        soundEnabled={soundEnabled}
        gameStarted={Object.keys(boardCells).length > 0}
        onNavigate={(view) => {
          soundEffects.playSelect(soundEnabled);
          setCurrentView(view);
        }}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onRestoreDefaultQuestions={handleRestoreDefaultQuestions}
      />

      {/* 2. Main Content Area */}
      {currentView === 'play' ? (
        // Play view fits exactly in 100vh without vertical scrolling!
        <main className="flex-1 min-h-0 w-full max-w-6xl mx-auto px-2 sm:px-4 py-2 flex flex-col overflow-hidden">
          <GameBoard
            categories={categories}
            questions={questions}
            teams={teams}
            activeTeamId={activeTeamId}
            boardCells={boardCells}
            soundEnabled={soundEnabled}
            onSelectCell={handleSelectCell}
            onSwitchTurn={handleSwitchTurn}
            onResetBoard={handleResetBoard}
            onRestoreOriginalQuestions={handleRestoreDefaultQuestions}
            onEndGame={() => {
              soundEffects.playVictory(soundEnabled);
              setCurrentView('winner');
            }}
            onEditQuestions={() => {
              soundEffects.playSelect(soundEnabled);
              setCurrentView('questions');
            }}
            onEditTeams={() => {
              soundEffects.playSelect(soundEnabled);
              setCurrentView('teams');
            }}
          />
        </main>
      ) : (
        // Other views (Questions, Teams, Winner) can scroll gracefully
        <main className="flex-1 min-h-0 w-full overflow-y-auto px-3 sm:px-6 py-4 sm:py-6">
          {currentView === 'questions' && (
            <QuestionsEditor
              categories={categories}
              questions={questions}
              onUpdateCategories={setCategories}
              onUpdateQuestions={setQuestions}
              onRestoreOriginalQuestions={handleRestoreDefaultQuestions}
              onProceedToTeams={() => {
                soundEffects.playSelect(soundEnabled);
                setCurrentView('teams');
              }}
            />
          )}

          {currentView === 'teams' && (
            <TeamSetup
              teams={teams}
              activeTeamId={activeTeamId}
              soundEnabled={soundEnabled}
              onUpdateTeams={setTeams}
              onSetActiveTeamId={setActiveTeamId}
              onBackToQuestions={() => {
                soundEffects.playSelect(soundEnabled);
                setCurrentView('questions');
              }}
              onStartGame={() => {
                soundEffects.playSelect(soundEnabled);
                setCurrentView('play');
              }}
            />
          )}

          {currentView === 'winner' && (
            <WinnerCelebration
              teams={teams}
              boardCells={boardCells}
              soundEnabled={soundEnabled}
              onPlayAgain={handlePlayAgain}
              onEditQuestions={() => {
                soundEffects.playSelect(soundEnabled);
                setCurrentView('questions');
              }}
              onRestoreOriginalQuestions={handleRestoreDefaultQuestions}
              onBackToBoard={() => {
                soundEffects.playSelect(soundEnabled);
                setCurrentView('play');
              }}
            />
          )}
        </main>
      )}

      {/* 3. Question Modal Overlay */}
      {activeModalCoords && activeQuestion && activeCategory && (
        <QuestionModal
          question={activeQuestion}
          category={activeCategory}
          activeTeam={teams[activeTeamId]}
          opponentTeam={teams[activeTeamId === 'teamA' ? 'teamB' : 'teamA']}
          soundEnabled={soundEnabled}
          onResolve={handleResolveQuestion}
          onClose={() => setActiveModalCoords(null)}
        />
      )}
    </div>
  );
}
