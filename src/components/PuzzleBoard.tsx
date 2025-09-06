import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import type { Puzzle, PuzzleMove } from '@/types/puzzle';

interface PuzzleBoardProps {
  puzzle: Puzzle;
  onPuzzleComplete: (success: boolean) => void;
}

export const PuzzleBoard = ({ puzzle, onPuzzleComplete }: PuzzleBoardProps) => {
  const [game, setGame] = useState(() => new Chess(puzzle.fen));
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [boardPosition, setBoardPosition] = useState(puzzle.fen);

  // Force board to update when puzzle changes
  useEffect(() => {
    console.log('🎯 PUZZLE CHANGED - Setting up new game');
    const newGame = new Chess(puzzle.fen);
    console.log('🎯 PUZZLE FEN:', puzzle.fen);
    console.log('🎯 PIECE AT f3:', newGame.get('f3'));
    setGame(newGame);
    setBoardPosition(puzzle.fen);
    setCurrentMoveIndex(0);
    setIsComplete(false);
    setFeedback('');
  }, [puzzle.id, puzzle.fen]);

  const makeMove = (from: string, to: string, promotion?: string) => {
    const gameCopy = new Chess(game.fen());
    
    console.log('Attempting move:', from, 'to', to);
    console.log('Expected move:', puzzle.solution[currentMoveIndex]);
    
    try {
      const move = gameCopy.move({ from, to, promotion });
      if (!move) {
        setFeedback('Invalid move!');
        return false;
      }

      console.log('Move made:', move);

      const expectedMove = puzzle.solution[currentMoveIndex];
      
      if (move.from === expectedMove.from && move.to === expectedMove.to) {
        setGame(gameCopy);
        setCurrentMoveIndex(prev => prev + 1);
        
        if (currentMoveIndex + 1 >= puzzle.solution.length) {
          setIsComplete(true);
          setFeedback('Puzzle solved! Well done!');
          onPuzzleComplete(true);
        } else {
          setFeedback(`Correct! Move ${currentMoveIndex + 2} of ${puzzle.solution.length}`);
        }
        return true;
      } else {
        // Allow any legal move for now to test
        setGame(gameCopy);
        setBoardPosition(gameCopy.fen()); // Update board position
        setFeedback(`Move made: ${move.from}-${move.to}. Expected: ${expectedMove.from}-${expectedMove.to}`);
        return true;
      }
    } catch (error) {
      console.error('Move error:', error);
      setFeedback('Invalid move!');
      return false;
    }
  };

  const onDrop = (sourceSquare: string, targetSquare: string, piece: string) => {
    if (isComplete) return false;
    
    const promotion = piece.toLowerCase().includes('p') && 
      (targetSquare[1] === '8' || targetSquare[1] === '1') ? 'q' : undefined;
    
    return makeMove(sourceSquare, targetSquare, promotion);
  };

  const resetPuzzle = () => {
    console.log('🔄 RESET BUTTON CLICKED!');
    console.log('🔄 Creating new game with FEN:', puzzle.fen);
    const newGame = new Chess(puzzle.fen);
    console.log('🔄 New game position:', newGame.fen());
    console.log('🔄 Knight at f3 after reset:', newGame.get('f3'));
    
    setGame(newGame);
    setBoardPosition(puzzle.fen); // Force position update
    setCurrentMoveIndex(0);
    setIsComplete(false);
    setFeedback('Reset puzzle');
  };

  const isCorrect = feedback.includes('Correct') || feedback.includes('solved');

  return (
    <div className="flex-1 flex flex-col">
      {/* Puzzle Info */}
      <div className="p-4 text-center border-b border-white/10">
        <div className="text-white/60 text-sm mb-1">Puzzle • {puzzle.difficulty}</div>
        <div className="text-white font-medium">{puzzle.description}</div>
        <div className="flex gap-2 justify-center mt-2">
          {puzzle.theme.map((theme, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-full"
            >
              {theme}
            </span>
          ))}
        </div>
      </div>

      {/* Chess Board */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm aspect-square">
          <Chessboard
            position={boardPosition} // Use dedicated state for board position
            onPieceDrop={onDrop}
            boardOrientation="white"
            customBoardStyle={{
              borderRadius: '8px',
            }}
            customDarkSquareStyle={{ backgroundColor: '#b58863' }}
            customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
            arePiecesDraggable={!isComplete}
            isDraggablePiece={({ piece }) => {
              return piece[0] === 'w'; // Only white pieces are draggable
            }}
            animationDuration={200}
          />
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

      {/* Action Buttons */}
      <div className="p-4 flex gap-3 justify-center">
        <button
          onClick={resetPuzzle}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-all duration-150 transform hover:scale-105 active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Board
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