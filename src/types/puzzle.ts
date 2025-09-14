export interface PuzzleMove {
  from: string;
  to: string;
  promotion?: string;
}

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master' | 'grandmaster';

export type TacticalTheme = 
  | 'fork' | 'pin' | 'skewer' | 'discovered-attack' | 'double-attack' 
  | 'deflection' | 'decoy' | 'clearance' | 'interference' | 'x-ray'
  | 'sacrifice' | 'queen-sacrifice' | 'rook-sacrifice' | 'bishop-sacrifice' | 'knight-sacrifice' | 'pawn-sacrifice'
  | 'mating-attack' | 'back-rank-mate' | 'smothered-mate' | 'anastasia-mate' | 'legal-mate'
  | 'endgame' | 'pawn-endgame' | 'rook-endgame' | 'queen-endgame' | 'bishop-endgame' | 'knight-endgame'
  | 'zugzwang' | 'stalemate-trick' | 'promotion' | 'underpromotion'
  | 'trapped-piece' | 'weak-king' | 'exposed-king' | 'piece-coordination'
  | 'positional-sacrifice' | 'exchange-sacrifice' | 'greek-gift' | 'bxh7-sacrifice';

export type PuzzleCategory = 
  | 'tactics' | 'endgames' | 'sacrifices' | 'mating-patterns' 
  | 'positional' | 'calculation' | 'opening-traps' | 'defensive';

export interface Puzzle {
  id: string;
  fen: string;
  solution: PuzzleMove[];
  themes: TacticalTheme[];
  category: PuzzleCategory;
  difficulty: DifficultyLevel;
  rating: number; // Puzzle rating 800-3000+
  title: string;
  description: string;
  gameInfo?: {
    white: string;
    black: string;
    event?: string;
    year?: number;
  };
  tags?: string[];
}

export interface PuzzleFilters {
  category?: PuzzleCategory;
  difficulty?: DifficultyLevel;
  themes?: TacticalTheme[];
  ratingRange?: [number, number];
}

export interface UserProgress {
  currentStreak: number;
  longestStreak: number;
  solvedPuzzles: string[];
  totalSolved: number;
  preferredDifficulty?: DifficultyLevel;
  weakThemes?: TacticalTheme[];
}

