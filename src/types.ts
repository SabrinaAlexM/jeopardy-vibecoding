export type DifficultyLevel = 1 | 2 | 3 | 4;

export interface Question {
  id: string;
  categoryId: string;
  level: DifficultyLevel;
  points: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, or 3
  explanation: string;
}

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind color token or hex
}

export interface Team {
  id: 'teamA' | 'teamB';
  name: string;
  color: string; // hex or color scheme identifier
  icon: string; // Lucide icon identifier
  score: number;
}

export interface BoardCellState {
  categoryId: string;
  level: DifficultyLevel;
  questionId: string;
  isAnswered: boolean;
  awardedTo?: 'teamA' | 'teamB' | null;
  pointsEarned: number;
}

export type AppView = 'play' | 'teams' | 'questions' | 'winner';

export interface QuizState {
  categories: Category[];
  questions: Question[];
  teams: {
    teamA: Team;
    teamB: Team;
  };
  activeTeamId: 'teamA' | 'teamB';
  boardCells: Record<string, BoardCellState>; // key: `${categoryId}-${level}`
  currentQuestionId: string | null;
  gameStarted: boolean;
  gameFinished: boolean;
  soundEnabled: boolean;
}
