export interface PuzzleMove {
  from: string;
  to: string;
  promotion?: string;
}

export interface Puzzle {
  id: string;
  fen: string;
  solution: PuzzleMove[];
  theme: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  description?: string;
}

export interface UserProgress {
  currentStreak: number;
  longestStreak: number;
  solvedPuzzles: string[];
  totalSolved: number;
}

