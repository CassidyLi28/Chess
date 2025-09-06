import { useState } from 'react';
import { PuzzleBoard } from './components/PuzzleBoard';
import { ThemeToggle } from './components/theme-toggle';
import { Timer, Target } from 'lucide-react';
import type { Puzzle } from './types/puzzle';

// Known working knight fork puzzle from lichess
const samplePuzzle: Puzzle = {
  id: '1',
  fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4',
  solution: [
    { from: 'f3', to: 'g5' }
  ],
  theme: ['fork', 'tactics'],
  difficulty: 'medium',
  description: 'Move the knight to fork the king and queen!'
};

function App() {
  const [currentPuzzle] = useState<Puzzle>(samplePuzzle);
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(180); // 3 minutes

  const handlePuzzleComplete = (success: boolean) => {
    if (success) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#312e2b] text-white overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-[#272522]">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-green-500" />
          <span className="text-lg font-semibold">Chess Puzzles</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/10 rounded-full px-3 py-1 flex items-center gap-2">
            <Timer className="w-4 h-4" />
            <span className="font-mono font-bold">{formatTime(timer)}</span>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <PuzzleBoard 
          puzzle={currentPuzzle} 
          onPuzzleComplete={handlePuzzleComplete}
        />
        
        {/* Bottom Stats */}
        <div className="bg-[#272522] p-4 flex justify-center items-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{streak}</div>
            <div className="text-xs text-gray-400 uppercase">Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">1847</div>
            <div className="text-xs text-gray-400 uppercase">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">85%</div>
            <div className="text-xs text-gray-400 uppercase">Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
