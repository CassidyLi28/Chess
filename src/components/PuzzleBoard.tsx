import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import type { Puzzle, PuzzleMove } from '@/types/puzzle';

type Square = string;

interface PuzzleBoardProps {
  puzzle: Puzzle;
  onPuzzleComplete: (success: boolean) => void;
}

export const PuzzleBoard = ({ puzzle, onPuzzleComplete }: PuzzleBoardProps) => {
  // Single source of truth - use Chess instance directly
  const chess = useMemo(() => new Chess(puzzle.fen), [puzzle.fen]);
  const [position, setPosition] = useState(() => chess.fen());
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  
  // Reset everything when puzzle changes
  useEffect(() => {
    console.log('🎯 NEW PUZZLE LOADED:', puzzle.fen);
    console.log('🎯 Chess.js board state:', chess.ascii());
    console.log('🎯 Knight at f3?', chess.get('f3'));
    
    // Reset chess board to puzzle position
    chess.load(puzzle.fen);
    setPosition(chess.fen());
    setCurrentMoveIndex(0);
    setIsComplete(false);
    setFeedback('');
  }, [puzzle.id, puzzle.fen, chess]);

  const onPieceDrop = useCallback((sourceSquare: string, targetSquare: string) => {
    console.log('🎯 DROP EVENT:', sourceSquare, 'to', targetSquare);
    
    if (isComplete) return false;
    
    try {
      const move = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // Always promote to queen for simplicity
      });
      
      if (move === null) {
        console.log('❌ Invalid move - piece will snap back');
        return false;
      }
      
      console.log('✅ Valid move made:', move);
      
      // Update position from single source of truth
      setPosition(chess.fen());
      
      const expectedMove = puzzle.solution[currentMoveIndex];
      
      if (move.from === expectedMove.from && move.to === expectedMove.to) {
        setCurrentMoveIndex(prev => prev + 1);
        
        if (currentMoveIndex + 1 >= puzzle.solution.length) {
          setIsComplete(true);
          setFeedback('🎉 Puzzle solved! Well done!');
          onPuzzleComplete(true);
        } else {
          setFeedback(`✅ Correct! Move ${currentMoveIndex + 2} of ${puzzle.solution.length}`);
        }
      } else {
        setFeedback(`Move: ${move.from}→${move.to}. Expected: ${expectedMove.from}→${expectedMove.to}`);
      }
      
      return true; // Move is valid - piece should stay
    } catch (error) {
      console.error('Move error:', error);
      return false; // Error - piece will snap back
    }
  }, [chess, isComplete, puzzle.solution, currentMoveIndex, onPuzzleComplete]);

  const resetPuzzle = useCallback(() => {
    console.log('🔄 RESET PUZZLE');
    chess.load(puzzle.fen); // Reset chess instance to puzzle position
    setPosition(chess.fen()); // Update visual position
    setCurrentMoveIndex(0);
    setIsComplete(false);
    setFeedback('Puzzle reset');
  }, [chess, puzzle.fen]);

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
        <div className="w-full max-w-lg">
          <Chessboard
            key={`chess-${position}`} // Force re-render when position changes
            position={position}
            onPieceDrop={onPieceDrop}
            boardOrientation="white"
            boardWidth={500}
            customBoardStyle={{
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
            customDarkSquareStyle={{ 
              backgroundColor: '#b58863',
            }}
            customLightSquareStyle={{ 
              backgroundColor: '#f0d9b5',
            }}
            arePiecesDraggable={!isComplete}
            isDraggablePiece={({ piece }) => piece[0] === 'w'}
            animationDuration={200}
            showBoardNotation={true}
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