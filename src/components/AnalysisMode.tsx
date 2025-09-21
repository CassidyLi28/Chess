import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import { RotateCcw, Play, Brain, MessageSquare, ArrowRight } from 'lucide-react';

interface AnalysisModeProps {
  onBack: () => void;
}

interface MoveAnalysis {
  move: string;
  side: 'white' | 'black' | 'ai';
  evaluation: string;
  explanation: string;
  fen: string;
}

// Interesting mid-game position with tactical possibilities
const MID_GAME_POSITION = "r2qkb1r/ppp2ppp/2n1bn2/3pp3/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq - 0 6";

export const AnalysisMode = ({ onBack }: AnalysisModeProps) => {
  const [chess] = useState(() => {
    const game = new Chess();
    game.load(MID_GAME_POSITION);
    return game;
  });
  const [position, setPosition] = useState(() => chess.fen());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [moveHistory, setMoveHistory] = useState<MoveAnalysis[]>([]);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [waitingForAI, setWaitingForAI] = useState(false);

  const getPieceSymbol = (piece: any) => {
    const symbols: { [key: string]: string } = {
      'wk': '♔', 'wq': '♕', 'wr': '♖', 'wb': '♗', 'wn': '♘', 'wp': '♙',
      'bk': '♚', 'bq': '♛', 'br': '♜', 'bb': '♝', 'bn': '♞', 'bp': '♟'
    };
    return symbols[piece.color + piece.type] || '';
  };

  const analyzeMove = (move: any, isPlayerMove: boolean): MoveAnalysis => {
    const score = evaluateMove(move);
    let evaluation = 'OKAY';
    let explanation = '';
    
    // Determine evaluation based on score
    if (score >= 200) {
      evaluation = 'BRILLIANT';
    } else if (score >= 100) {
      evaluation = 'EXCELLENT';
    } else if (score >= 50) {
      evaluation = 'GOOD';
    } else if (score >= 0) {
      evaluation = 'OKAY';
    } else if (score >= -50) {
      evaluation = 'INACCURACY';
    } else {
      evaluation = 'MISTAKE';
    }

    // Generate explanation based on move characteristics
    if (move.san.includes('#')) {
      explanation = 'Checkmate! Game over.';
    } else if (move.captured && score > 0) {
      explanation = `Captures ${move.captured}, winning material advantageously.`;
    } else if (move.captured && score <= 0) {
      explanation = `Captures ${move.captured}, but this trade may not be favorable.`;
    } else if (move.san.includes('+') && score > 30) {
      explanation = 'Gives check while maintaining good position.';
    } else if (move.san.includes('+') && score <= 30) {
      explanation = 'Gives check, but may expose pieces unnecessarily.';
    } else if (score < -100) {
      explanation = 'Hangs a piece! This move loses material.';
    } else if (move.san.includes('O')) {
      explanation = 'Castles, improving king safety.';
    } else if (['e4', 'e5', 'd4', 'd5'].includes(move.to)) {
      explanation = 'Controls the center, a key strategic principle.';
    } else if (move.piece === 'n' || move.piece === 'b') {
      explanation = 'Develops a piece, improving coordination.';
    } else if (score > 20) {
      explanation = 'A strong positional move.';
    } else if (score < -20) {
      explanation = 'Weakens the position or creates vulnerabilities.';
    } else {
      explanation = 'A solid, principled move.';
    }

    return {
      move: move.san,
      side: isPlayerMove ? 'white' : 'ai',
      evaluation,
      explanation,
      fen: chess.fen()
    };
  };

  const getAIMove = (): any => {
    const moves = chess.moves({ verbose: true });
    if (moves.length === 0) return null;

    // Check if opponent just made a mistake - look for punishment moves
    const lastPlayerMove = moveHistory[moveHistory.length - 1];
    const shouldPunish = lastPlayerMove?.side === 'white' && 
                        (lastPlayerMove.evaluation === 'MISTAKE' || lastPlayerMove.evaluation === 'INACCURACY');

    // Evaluate each move and pick the best one
    let bestMove = null;
    let bestScore = -Infinity;

    for (const move of moves) {
      let score = evaluateMove(move);
      
      // If punishing, heavily favor captures and attacks
      if (shouldPunish) {
        if (move.captured) {
          score += 100; // Extra bonus for captures after mistakes
        }
        if (move.san.includes('+')) {
          score += 60; // Extra bonus for checks after mistakes
        }
        // Look for moves that attack undefended pieces
        const targetSquare = move.to;
        const targetPiece = chess.get(targetSquare);
        if (targetPiece && targetPiece.color !== chess.turn()) {
          score += 30; // Bonus for attacking opponent pieces
        }
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    // When punishing, be less random and more aggressive
    const randomnessRange = shouldPunish ? 20 : 50;
    const topMoves = moves.filter(m => {
      let score = evaluateMove(m);
      if (shouldPunish && m.captured) score += 100;
      if (shouldPunish && m.san.includes('+')) score += 60;
      return score >= bestScore - randomnessRange;
    });
    
    return topMoves[Math.floor(Math.random() * topMoves.length)] || bestMove;
  };

  const evaluateMove = (move: any): number => {
    let score = 0;
    
    // Save current position
    const originalFen = chess.fen();
    
    // Make the move temporarily
    chess.move(move);
    
    // 1. Material evaluation (most important)
    if (move.captured) {
      const pieceValues = { 'p': 100, 'n': 300, 'b': 300, 'r': 500, 'q': 900, 'k': 0 };
      score += pieceValues[move.captured] || 0;
      
      // Bonus for good trades
      const attackerValue = pieceValues[move.piece] || 0;
      const capturedValue = pieceValues[move.captured] || 0;
      if (capturedValue >= attackerValue) {
        score += 50; // Good trade
      }
    }
    
    // 2. Check if move hangs a piece (major penalty)
    const isMovePieceAttacked = isSquareAttackedByOpponent(move.to);
    if (isMovePieceAttacked) {
      const pieceValues = { 'p': 100, 'n': 300, 'b': 300, 'r': 500, 'q': 900, 'k': 0 };
      const pieceValue = pieceValues[move.piece] || 0;
      
      // Check if piece is defended
      const isDefended = isSquareDefendedByUs(move.to);
      if (!isDefended) {
        score -= pieceValue * 2; // Heavy penalty for hanging pieces
      } else if (move.captured) {
        // If it's defended, evaluate the trade
        const capturedValue = pieceValues[move.captured] || 0;
        if (pieceValue > capturedValue) {
          score -= (pieceValue - capturedValue); // Penalty for bad trade
        }
      } else {
        score -= pieceValue / 2; // Penalty for putting piece under attack even if defended
      }
    }
    
    // 3. Checks are good but not at any cost
    if (move.san.includes('+')) {
      score += 30;
    }
    
    // 4. Checkmate is winning
    if (chess.isCheckmate()) {
      score += 10000;
    }
    
    // 5. Center control
    const centerSquares = ['e4', 'e5', 'd4', 'd5'];
    if (centerSquares.includes(move.to)) {
      score += 20;
    }
    
    // 6. Development bonus (early game)
    if (move.piece === 'n' || move.piece === 'b') {
      const backRank = chess.turn() === 'w' ? '8' : '1';
      if (move.from.includes(backRank)) {
        score += 15; // Bonus for developing pieces
      }
    }
    
    // 7. Castling is generally good
    if (move.san.includes('O')) {
      score += 25;
    }
    
    // 8. Pawn structure considerations
    if (move.piece === 'p') {
      // Bonus for pawn advances
      const rank = parseInt(move.to[1]);
      if (chess.turn() === 'b') {
        if (rank <= 4) score += (5 - rank) * 5; // Black pawns advancing
      } else {
        if (rank >= 5) score += (rank - 4) * 5; // White pawns advancing
      }
      
      // Penalty for creating isolated pawns
      const file = move.to[0];
      const adjacentFiles = [String.fromCharCode(file.charCodeAt(0) - 1), String.fromCharCode(file.charCodeAt(0) + 1)];
      let hasAdjacentPawns = false;
      for (let r = 1; r <= 8; r++) {
        for (const adjFile of adjacentFiles) {
          if (adjFile >= 'a' && adjFile <= 'h') {
            const square = adjFile + r;
            const piece = chess.get(square);
            if (piece && piece.type === 'p' && piece.color === chess.turn()) {
              hasAdjacentPawns = true;
              break;
            }
          }
        }
        if (hasAdjacentPawns) break;
      }
      if (!hasAdjacentPawns) {
        score -= 10; // Penalty for isolated pawns
      }
    }
    
    // Restore position
    chess.load(originalFen);
    
    return score;
  };

  const isSquareAttackedByOpponent = (square: string): boolean => {
    const currentTurn = chess.turn();
    const opponentColor = currentTurn === 'w' ? 'b' : 'w';
    
    // Switch turns to check opponent attacks
    const fen = chess.fen();
    const fenParts = fen.split(' ');
    fenParts[1] = opponentColor; // Switch active color
    
    try {
      chess.load(fenParts.join(' '));
      const attacks = chess.moves({ verbose: true }).filter(m => m.to === square);
      chess.load(fen); // Restore original position
      return attacks.length > 0;
    } catch (error) {
      chess.load(fen); // Restore on error
      return false;
    }
  };

  const isSquareDefendedByUs = (square: string): boolean => {
    const defenders = chess.moves({ verbose: true }).filter(m => m.to === square);
    return defenders.length > 0;
  };

  const makeAIMove = useCallback(() => {
    if (chess.isGameOver() || isAIThinking) return;

    setIsAIThinking(true);
    
    setTimeout(() => {
      const aiMove = getAIMove();
      if (aiMove) {
        const move = chess.move(aiMove);
        if (move) {
          setPosition(chess.fen());
          const analysis = analyzeMove(move, false);
          setMoveHistory(prev => [...prev, analysis]);
        }
      }
      setIsAIThinking(false);
      setWaitingForAI(false);
    }, 1000 + Math.random() * 1500); // 1-2.5 second thinking time
  }, [chess, isAIThinking]);

  const handleSquareClick = (square: string) => {
    if (waitingForAI || isAIThinking || chess.isGameOver()) return;

    if (selectedSquare) {
      // Try to make a move
      if (selectedSquare !== square) {
        try {
          const move = chess.move({
            from: selectedSquare,
            to: square,
            promotion: 'q'
          });
          
          if (move) {
            setPosition(chess.fen());
            const analysis = analyzeMove(move, true);
            setMoveHistory(prev => [...prev, analysis]);
            
            // If it's a bad move, make AI more aggressive
            if (analysis.evaluation === 'MISTAKE' || analysis.evaluation === 'INACCURACY') {
              // AI will look for punishment moves
              setWaitingForAI(true);
              setTimeout(() => makeAIMove(), 800); // Slightly longer for "thinking"
            } else {
              // Queue normal AI response
              setWaitingForAI(true);
              setTimeout(() => makeAIMove(), 500);
            }
          }
        } catch (error) {
          console.log('Invalid move');
        }
      }
      setSelectedSquare(null);
    } else {
      // Select a piece
      const piece = chess.get(square);
      if (piece && piece.color === chess.turn()) {
        setSelectedSquare(square);
      }
    }
  };

  const resetGame = () => {
    chess.load(MID_GAME_POSITION);
    setPosition(chess.fen());
    setMoveHistory([]);
    setSelectedSquare(null);
    setWaitingForAI(false);
    setIsAIThinking(false);
  };

  const getEvaluationColor = (evaluation: string) => {
    switch (evaluation) {
      case 'BRILLIANT': return 'text-yellow-400';
      case 'EXCELLENT': return 'text-green-400';
      case 'GOOD': return 'text-blue-400';
      case 'OKAY': return 'text-gray-400';
      case 'INACCURACY': return 'text-orange-400';
      case 'MISTAKE': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-3 text-center border-b border-white/10">
        <div className="text-white font-medium">Interactive Analysis Mode</div>
        <div className="text-sm text-gray-400 mt-1">
          Make moves and get AI responses with real-time analysis
        </div>
      </div>

      {/* Chess Board Container */}
      <div className="flex-1 flex items-center justify-center p-8">
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
                className={`aspect-square flex items-center justify-center cursor-pointer transition-all duration-150 relative ${selectedSquare === square ? 'ring-4 ring-yellow-400 ring-inset' : ''} ${piece ? 'hover:bg-yellow-300/20' : ''}`}
                style={{
                  backgroundColor: isDark ? '#769656' : '#eeeed2',
                }}
                onClick={() => handleSquareClick(square)}
              >
                {piece && (
                  <span 
                    className="select-none pointer-events-none text-shadow-sm transition-transform hover:scale-110"
                    style={{
                      fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
                      color: piece.color === 'w' ? '#ffffff' : '#000000',
                      textShadow: piece.color === 'w' 
                        ? '1px 1px 2px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.6)' 
                        : '1px 1px 2px rgba(255,255,255,0.8), 0 0 4px rgba(255,255,255,0.6)',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    }}
                  >
                    {getPieceSymbol(piece)}
                  </span>
                )}
                {/* Square coordinates for chess.com style */}
                {(col === 0 && row === 7) && (
                  <div className="absolute bottom-1 left-1 text-xs font-bold opacity-70" 
                       style={{ color: isDark ? '#eeeed2' : '#769656' }}>
                    {8 - row}
                  </div>
                )}
                {(row === 7) && (
                  <div className="absolute bottom-1 right-1 text-xs font-bold opacity-70" 
                       style={{ color: isDark ? '#eeeed2' : '#769656' }}>
                    {String.fromCharCode(97 + col)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Move History and Analysis */}
      <div className="p-4 bg-[#272522]">
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 max-h-80 overflow-y-auto">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Move Analysis
          </h3>
          
          {moveHistory.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-4">
              Make a move to see analysis
            </p>
          )}
          
          <div className="space-y-3">
            {moveHistory.map((analysis, index) => (
              <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      analysis.side === 'white' ? 'bg-white text-black' : 'bg-gray-800 text-white'
                    }`}>
                      {analysis.side === 'ai' ? '🤖 AI' : analysis.side.toUpperCase()}
                    </span>
                    <span className="text-white font-mono">{analysis.move}</span>
                  </div>
                  <span className={`text-xs font-bold ${getEvaluationColor(analysis.evaluation)}`}>
                    {analysis.evaluation}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{analysis.explanation}</p>
              </div>
            ))}
            
            {isAIThinking && (
              <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 animate-pulse text-purple-300" />
                  <span className="text-purple-200">AI is analyzing your move...</span>
                </div>
              </div>
            )}
            
            {waitingForAI && !isAIThinking && (
              <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-300" />
                  <span className="text-blue-200">AI will respond...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 flex gap-3 justify-center border-t border-white/10">
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          New Game
        </button>
        
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          Back to Puzzles
        </button>
        
        {chess.isGameOver() && (
          <div className="px-4 py-2 bg-yellow-600 text-white rounded-lg">
            Game Over: {chess.isCheckmate() ? 'Checkmate!' : chess.isDraw() ? 'Draw' : 'Stalemate'}
          </div>
        )}
      </div>
    </div>
  );
};