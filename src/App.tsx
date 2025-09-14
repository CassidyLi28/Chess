import { useState, useMemo } from 'react';
import { PuzzleBoard } from './components/PuzzleBoard';
import { PuzzleFilters } from './components/PuzzleFilters';
import { AnalysisMode } from './components/AnalysisMode';
import { ThemeToggle } from './components/theme-toggle';
import { Timer, Target, ChevronLeft, ChevronRight, Filter, Brain, Puzzle } from 'lucide-react';
import type { Puzzle as PuzzleType, PuzzleFilters as PuzzleFiltersType } from './types/puzzle';
import { advancedPuzzleDatabase } from './data/advancedPuzzles';

// Main puzzle collection
const puzzleCollection = advancedPuzzleDatabase;

type AppMode = 'puzzles' | 'analysis';

function App() {
  const [mode, setMode] = useState<AppMode>('puzzles');
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(180); // 3 minutes
  const [filters, setFilters] = useState<PuzzleFiltersType>({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Filter puzzles based on current filters
  const filteredPuzzles = useMemo(() => {
    console.log('🔍 Filtering puzzles with filters:', filters);
    console.log('🔍 Total puzzles in database:', puzzleCollection.length);
    
    const filtered = puzzleCollection.filter(puzzle => {
      if (filters.difficulty && puzzle.difficulty !== filters.difficulty) return false;
      if (filters.category && puzzle.category !== filters.category) return false;
      if (filters.themes?.length && !filters.themes.some(theme => puzzle.themes.includes(theme))) return false;
      if (filters.ratingRange) {
        const [min, max] = filters.ratingRange;
        if (puzzle.rating < min || puzzle.rating > max) return false;
      }
      return true;
    });
    
    console.log('🔍 Filtered puzzles count:', filtered.length);
    console.log('🔍 Sample of categories:', puzzleCollection.map(p => p.category).slice(0, 10));
    console.log('🔍 Sample of themes:', puzzleCollection.map(p => p.themes).slice(0, 5));
    
    return filtered;
  }, [filters]);
  
  const currentPuzzle = filteredPuzzles[currentPuzzleIndex] || puzzleCollection[0];

  const handlePuzzleComplete = (success: boolean) => {
    if (success) {
      setStreak(prev => prev + 1);
      // Auto-advance to next puzzle after success
      setTimeout(() => {
        setCurrentPuzzleIndex(prev => (prev + 1) % puzzleCollection.length);
      }, 2000);
    } else {
      setStreak(0);
    }
  };

  const nextPuzzle = () => {
    if (filteredPuzzles.length === 0) return;
    setCurrentPuzzleIndex(prev => (prev + 1) % filteredPuzzles.length);
  };

  const prevPuzzle = () => {
    if (filteredPuzzles.length === 0) return;
    setCurrentPuzzleIndex(prev => prev === 0 ? filteredPuzzles.length - 1 : prev - 1);
  };

  const getRandomPuzzle = () => {
    if (filteredPuzzles.length === 0) return;
    // Get a random puzzle different from the current one
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * filteredPuzzles.length);
    } while (newIndex === currentPuzzleIndex && filteredPuzzles.length > 1);
    
    setCurrentPuzzleIndex(newIndex);
  };

  // Reset puzzle index when filters change
  const handleFiltersChange = (newFilters: PuzzleFiltersType) => {
    setFilters(newFilters);
    setCurrentPuzzleIndex(0); // Reset to first puzzle of filtered results
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
          <span className="text-lg font-semibold">Chess Training</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Mode Switcher */}
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setMode('puzzles')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                mode === 'puzzles' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Puzzle className="h-4 w-4" />
              Puzzles
            </button>
            <button
              onClick={() => setMode('analysis')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                mode === 'analysis' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Brain className="h-4 w-4" />
              Analysis
            </button>
          </div>

          {mode === 'puzzles' && (
            <>
              <div className="bg-white/10 rounded-full px-3 py-1 flex items-center gap-2">
                <Timer className="w-4 h-4" />
                <span className="font-mono font-bold">{formatTime(timer)}</span>
              </div>
              <PuzzleFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                isOpen={filtersOpen}
                onToggle={() => setFiltersOpen(!filtersOpen)}
              />
            </>
          )}
          
          <ThemeToggle />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {mode === 'puzzles' ? (
          <>
            {/* Puzzle Navigation */}
            <div className="bg-[#272522] p-4 flex justify-between items-center border-b border-white/10">
              <button 
                onClick={prevPuzzle}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <div className="text-center">
                <div className="text-lg font-bold">{currentPuzzle.title}</div>
                <div className="text-sm text-gray-400">
                  Puzzle {currentPuzzleIndex + 1} of {filteredPuzzles.length} • Rating: {currentPuzzle.rating}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {currentPuzzle.difficulty} • {currentPuzzle.category} • {currentPuzzle.themes.slice(0, 3).join(', ')}
                  {currentPuzzle.themes.length > 3 && ` +${currentPuzzle.themes.length - 3}`}
                </div>
              </div>
              
              <button 
                onClick={nextPuzzle}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <PuzzleBoard 
              puzzle={currentPuzzle} 
              onPuzzleComplete={handlePuzzleComplete}
              onNewPuzzle={getRandomPuzzle}
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
          </>
        ) : (
          <AnalysisMode onBack={() => setMode('puzzles')} />
        )}
      </div>
    </div>
  );
}

export default App
