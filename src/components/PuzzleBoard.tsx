import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import { RotateCcw, ChevronRight, CheckCircle, XCircle, Brain, Lightbulb } from 'lucide-react';
import type { Puzzle, PuzzleMove } from '@/types/puzzle';
// import { stockfishService } from '@/services/stockfish';

type Square = string;

interface PuzzleBoardProps {
  puzzle: Puzzle;
  onPuzzleComplete: (success: boolean) => void;
  onNewPuzzle?: () => void;
}

export const PuzzleBoard = ({ puzzle, onPuzzleComplete, onNewPuzzle }: PuzzleBoardProps) => {
  // Single source of truth - use Chess instance directly
  const chess = useMemo(() => new Chess(puzzle.fen), [puzzle.fen]);
  const [position, setPosition] = useState(() => chess.fen());
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [hint, setHint] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Helper function to get piece symbols
  const getPieceSymbol = (piece: any) => {
    const symbols: { [key: string]: string } = {
      'wk': '♔', 'wq': '♕', 'wr': '♖', 'wb': '♗', 'wn': '♘', 'wp': '♙',
      'bk': '♚', 'bq': '♛', 'br': '♜', 'bb': '♝', 'bn': '♞', 'bp': '♟'
    };
    return symbols[piece.color + piece.type] || '';
  };

  const handleSquareClick = (square: string) => {
    console.log('🎯 CLICK:', square, 'Selected:', selectedSquare, 'Complete:', isComplete);
    
    if (isComplete) return;

    if (selectedSquare) {
      // Try to make a move
      if (selectedSquare !== square) {
        console.log('🎯 ATTEMPTING MOVE:', selectedSquare, 'to', square);
        try {
          const move = chess.move({
            from: selectedSquare,
            to: square,
            promotion: 'q'
          });
          
          if (move) {
            console.log('✅ MOVE SUCCESS:', move);
            const beforeFen = chess.fen();
            
            const expectedMove = puzzle.solution[currentMoveIndex];
            console.log('🎯 Expected:', expectedMove, 'Made:', move);
            
            const isCorrectMove = move.from === expectedMove.from && move.to === expectedMove.to;
            
            if (isCorrectMove) {
              // Keep the move for correct moves
              setPosition(chess.fen());
              setCurrentMoveIndex(prev => prev + 1);
              
              if (currentMoveIndex + 1 >= puzzle.solution.length) {
                setIsComplete(true);
                setFeedback('🎉 Puzzle solved! Well done!');
                onPuzzleComplete(true);
              } else {
                setFeedback(`✅ Correct! Move ${currentMoveIndex + 2} of ${puzzle.solution.length}`);
              }
              
              // Analyze correct move
              analyzeMove(move, beforeFen, chess.fen(), true);
            } else {
              // Reset position for wrong moves
              chess.undo();
              setPosition(chess.fen());
              setFeedback(`Try again! Look for ${expectedMove.from.toUpperCase()}→${expectedMove.to.toUpperCase()}`);
              
              // Analyze wrong move
              analyzeMove(move, beforeFen, chess.fen(), false);
            }
          } else {
            console.log('❌ INVALID MOVE');
            setFeedback('Invalid move!');
          }
        } catch (error) {
          console.log('❌ MOVE ERROR:', error);
          setFeedback('Invalid move!');
        }
      }
      setSelectedSquare(null);
    } else {
      // Select a piece (only white pieces)
      const piece = chess.get(square);
      console.log('🎯 PIECE AT', square, ':', piece);
      if (piece && piece.color === 'w') {
        console.log('✅ SELECTING WHITE PIECE');
        setSelectedSquare(square);
      } else {
        console.log('❌ NOT A WHITE PIECE');
      }
    }
  };

  const analyzeMove = async (move: any, beforeFen: string, afterFen: string, isCorrect: boolean = false) => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      if (isCorrect) {
        setAiAnalysis(`EXCELLENT: Perfect! This is the puzzle solution.`);
      } else {
        // Analyze the wrong move and provide educational feedback
        const analysis = analyzeWrongMove(move, puzzle);
        setAiAnalysis(analysis);
      }
      setIsAnalyzing(false);
    }, 300);
  };

  const analyzeWrongMove = (move: any, puzzle: Puzzle): string => {
    const expectedMove = puzzle.solution[currentMoveIndex];
    const playerMove = `${move.from}${move.to}`;
    const correctMove = `${expectedMove.from}${expectedMove.to}`;
    
    // Check if it's a reasonable alternative
    if (isReasonableMove(move, puzzle)) {
      return `GOOD IDEA: ${playerMove} is playable, but ${correctMove} is stronger because it ${getMovePurpose(expectedMove, puzzle)}.`;
    }
    
    // Check if it loses material
    if (losesMateriasMove(move)) {
      return `MISTAKE: ${playerMove} loses material. Try ${correctMove} instead - it ${getMovePurpose(expectedMove, puzzle)}.`;
    }
    
    // Check if it misses the tactical theme
    const theme = puzzle.themes[0];
    return `INACCURACY: ${playerMove} misses the ${theme.replace('-', ' ')} pattern. Look for ${correctMove} which ${getMovePurpose(expectedMove, puzzle)}.`;
  };

  const isReasonableMove = (move: any, puzzle: Puzzle): boolean => {
    // Check if move develops pieces, controls center, or creates threats
    const piece = chess.get(move.from);
    if (!piece) return false;
    
    // Developing moves are usually reasonable
    if (piece.type === 'n' || piece.type === 'b') {
      return true;
    }
    
    // Central pawn moves are often good
    if (piece.type === 'p' && ['d4', 'd5', 'e4', 'e5'].includes(move.to)) {
      return true;
    }
    
    return false;
  };

  const losesMateriasMove = (move: any): boolean => {
    // Simple heuristic - if the destination square is attacked by a lower value piece
    const piece = chess.get(move.from);
    if (!piece) return false;
    
    // Check if moving to an attacked square
    const attacks = chess.moves({ square: move.to, verbose: true });
    return attacks.length > 0;
  };

  const getMovePurpose = (expectedMove: any, puzzle: Puzzle): string => {
    const theme = puzzle.themes[0];
    
    switch (theme) {
      case 'fork':
        return 'attacks two pieces at once';
      case 'pin':
        return 'pins the piece to a more valuable target';
      case 'skewer':
        return 'forces the valuable piece to move and wins material';
      case 'sacrifice':
        return 'sacrifices material for a winning attack';
      case 'back-rank-mate':
        return 'delivers checkmate on the back rank';
      case 'mating-attack':
        return 'creates unstoppable checkmate threats';
      case 'endgame':
        return 'wins the endgame with precise technique';
      case 'discovered-attack':
        return 'creates a discovered attack';
      case 'deflection':
        return 'deflects the defending piece';
      default:
        return 'follows the key tactical pattern';
    }
  };

  const getHint = async () => {
    setIsAnalyzing(true);
    // Temporarily disabled - provide basic hint
    setTimeout(() => {
      const expectedMove = puzzle.solution[currentMoveIndex];
      if (expectedMove) {
        setHint(`Try moving from ${expectedMove.from.toUpperCase()} to ${expectedMove.to.toUpperCase()}`);
      } else {
        setHint('No more moves in this puzzle');
      }
      setIsAnalyzing(false);
    }, 300);
  };
  
  // Reset everything when puzzle changes
  useEffect(() => {
    console.log('🎯 NEW PUZZLE LOADED:', puzzle.fen);
    console.log('🎯 Expected solution:', puzzle.solution);
    chess.load(puzzle.fen);
    console.log('🎯 Chess.js board state:');
    console.log(chess.ascii());
    console.log('🎯 Piece at f3:', chess.get('f3'));
    console.log('🎯 Piece at g5:', chess.get('g5'));
    console.log('🎯 Possible moves from f3:', chess.moves({square: 'f3', verbose: true}));
    
    setPosition(chess.fen());
    setCurrentMoveIndex(0);
    setIsComplete(false);
    setFeedback('');
    setSelectedSquare(null);
    setAiAnalysis('');
    setHint('');
  }, [puzzle.id, puzzle.fen, chess]);


  const resetPuzzle = useCallback(() => {
    console.log('🔄 RESET PUZZLE');
    chess.load(puzzle.fen); // Reset chess instance to puzzle position
    setPosition(chess.fen()); // Update visual position
    setCurrentMoveIndex(0);
    setIsComplete(false);
    setFeedback('Puzzle reset');
    setSelectedSquare(null);
  }, [chess, puzzle.fen]);

  const isCorrect = feedback.includes('Correct') || feedback.includes('solved');

  return (
    <div className="flex-1 flex flex-col">
      {/* Puzzle Info */}
      <div className="p-3 text-center border-b border-white/10">
        <div className="text-white font-medium">{puzzle.description}</div>
        <div className="flex gap-2 justify-center mt-2">
          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
            {puzzle.difficulty}
          </span>
          <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
            {puzzle.rating}
          </span>
          <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
            {puzzle.themes[0]?.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Chess Board */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-8 gap-0 rounded-lg overflow-hidden shadow-2xl w-full max-w-2xl aspect-square">
          {Array.from({ length: 64 }).map((_, index) => {
            const row = Math.floor(index / 8);
            const col = index % 8;
            const isDark = (row + col) % 2 === 1;
            const square = String.fromCharCode(97 + col) + (8 - row);
            const piece = chess.get(square);
            
            return (
              <div
                key={square}
                className={`aspect-square flex items-center justify-center font-bold cursor-pointer hover:scale-105 transition-all duration-200 ${selectedSquare === square ? 'ring-4 ring-blue-400 ring-inset shadow-lg' : ''}`}
                style={{
                  backgroundColor: isDark ? '#B58863' : '#F0D9B5',
                  color: '#000000',
                  fontSize: 'clamp(2rem, 6vw, 4rem)'
                }}
                onClick={() => handleSquareClick(square)}
              >
                {piece && (
                  <span className="select-none pointer-events-none">
                    {getPieceSymbol(piece)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="p-4">
          <div className={`rounded-lg p-4 text-center ${
            isCorrect 
              ? 'bg-green-500/20 border border-green-500/30'
              : 'bg-red-500/20 border border-red-500/30'
          }`}>
            <div className="flex items-center gap-2 justify-center">
              {isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
              <span className={`font-medium ${
                isCorrect ? 'text-green-200' : 'text-red-200'
              }`}>
                {feedback}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis */}
      {(aiAnalysis || hint) && (
        <div className="p-4">
          {aiAnalysis && (
            <div className="mb-3 rounded-lg p-3 bg-purple-500/20 border border-purple-500/30">
              <div className="flex items-center gap-2 text-purple-200">
                <Brain className="h-4 w-4" />
                <span className="font-medium">AI Analysis</span>
              </div>
              <p className="text-sm mt-1 text-purple-100">{aiAnalysis}</p>
            </div>
          )}
          {hint && (
            <div className="rounded-lg p-3 bg-yellow-500/20 border border-yellow-500/30">
              <div className="flex items-center gap-2 text-yellow-200">
                <Lightbulb className="h-4 w-4" />
                <span className="font-medium">Hint</span>
              </div>
              <p className="text-sm mt-1 text-yellow-100">{hint}</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="p-4 flex gap-3 justify-center flex-wrap">
        <button
          onClick={() => onNewPuzzle ? onNewPuzzle() : resetPuzzle()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-all duration-150 transform hover:scale-105 active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
          {onNewPuzzle ? 'New Puzzle' : 'Reset Board'}
        </button>
        
        <button
          onClick={getHint}
          disabled={isAnalyzing || isComplete}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <Lightbulb className="h-4 w-4" />
          {isAnalyzing ? 'Analyzing...' : 'Get Hint'}
        </button>
        
        {isComplete && (
          <button
            onClick={() => onPuzzleComplete(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Next Puzzle
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};