import { useState } from 'react';
import { Chess } from 'chess.js';

type Square = string;

interface CustomChessBoardProps {
  game: Chess;
  onMove: (from: Square, to: Square) => boolean;
  isDisabled?: boolean;
}

// Unicode chess pieces
const pieceSymbols: { [key: string]: string } = {
  'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
  'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟'
};

// Wooden piece styling
const getWoodenPieceStyle = (piece: string) => {
  if (piece.includes('w')) {
    // Light wood pieces - cream/beige with wood grain effect
    return `
      background: linear-gradient(135deg, #f5f5dc 0%, #deb887 50%, #d2b48c 100%);
      color: #8b4513;
      border: 2px solid #daa520;
      text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.3);
      box-shadow: 
        inset 0 1px 0 rgba(255, 255, 255, 0.4),
        inset 0 -1px 0 rgba(139, 69, 19, 0.2),
        0 2px 4px rgba(0, 0, 0, 0.3);
    `;
  } else {
    // Dark wood pieces - walnut/mahogany with wood grain
    return `
      background: linear-gradient(135deg, #8b4513 0%, #654321 50%, #4a4a4a 100%);
      color: #f5deb3;
      border: 2px solid #2f1b14;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
      box-shadow: 
        inset 0 1px 0 rgba(245, 222, 179, 0.2),
        inset 0 -1px 0 rgba(0, 0, 0, 0.3),
        0 2px 4px rgba(0, 0, 0, 0.4);
    `;
  }
};

export const CustomChessBoard = ({ game, onMove, isDisabled = false }: CustomChessBoardProps) => {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);

  const board = game.board();
  
  // Create squares array (a8 to h1)
  const squares = [];
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  
  for (let rank of ranks) {
    for (let file of files) {
      squares.push(`${file}${rank}` as Square);
    }
  }

  const getPiece = (square: Square) => {
    const piece = game.get(square);
    if (!piece) return null;
    return `${piece.color}${piece.type.toUpperCase()}`;
  };

  const handleSquareClick = (square: Square) => {
    if (isDisabled) return;

    const piece = game.get(square);
    
    if (selectedSquare) {
      // Try to make a move
      if (selectedSquare !== square) {
        const success = onMove(selectedSquare, square);
        if (success) {
          setSelectedSquare(null);
          setPossibleMoves([]);
          return;
        }
      }
      
      // If move failed or clicked same square, deselect or select new piece
      if (piece && piece.color === 'w') {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setPossibleMoves(moves.map(move => move.to));
      } else {
        setSelectedSquare(null);
        setPossibleMoves([]);
      }
    } else {
      // Select a piece
      if (piece && piece.color === 'w') {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setPossibleMoves(moves.map(move => move.to));
      }
    }
  };

  const isLight = (square: Square) => {
    const file = square.charCodeAt(0) - 97; // a=0, b=1, etc.
    const rank = parseInt(square[1]) - 1;
    return (file + rank) % 2 === 0;
  };

  const isSelected = (square: Square) => selectedSquare === square;
  const isPossibleMove = (square: Square) => possibleMoves.includes(square);

  return (
    <div className="flex flex-col items-center">
      {/* Large board container with colorful design */}
      <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-6 shadow-2xl border border-purple-400/30">
        {/* Top coordinate labels - files (a-h) */}
        <div className="grid grid-cols-8 gap-1 mb-3 px-2">
          {files.map((file) => (
            <div key={file} className="w-20 text-center text-lg font-bold text-purple-200">
              {file}
            </div>
          ))}
        </div>

        {/* Board with rank labels */}
        <div className="flex items-center">
          {/* Left rank labels (8-1) */}
          <div className="flex flex-col gap-1 pr-3">
            {ranks.map((rank) => (
              <div key={rank} className="h-20 flex items-center text-lg font-bold text-purple-200">
                {rank}
              </div>
            ))}
          </div>

          {/* Large colorful chess board */}
          <div className="grid grid-cols-8 gap-1 p-2 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 shadow-inner border-2 border-amber-300">
            {squares.map((square) => {
              const piece = getPiece(square);
              const light = isLight(square);
              const selected = isSelected(square);
              const possibleMove = isPossibleMove(square);
              
              return (
                <div
                  key={square}
                  className={`
                    w-20 h-20 flex items-center justify-center cursor-pointer text-4xl
                    relative transition-all duration-200 select-none rounded-lg border-2
                    ${light 
                      ? 'bg-gradient-to-br from-emerald-200 via-green-300 to-emerald-400 border-emerald-500/50' 
                      : 'bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 border-rose-700/50'
                    }
                    ${selected 
                      ? 'ring-4 ring-yellow-400 ring-offset-2 shadow-xl brightness-110 scale-105 border-yellow-500' 
                      : ''
                    }
                    ${possibleMove 
                      ? 'ring-4 ring-blue-400 ring-offset-1' 
                      : ''
                    }
                    hover:brightness-110 hover:scale-105 active:scale-95
                    shadow-lg
                  `}
                  onClick={() => handleSquareClick(square)}
                >
                  {/* Wooden piece */}
                  {piece && (
                    <div 
                      className={`
                        w-16 h-16 rounded-full flex items-center justify-center text-5xl font-bold
                        transition-all duration-200 border-4 shadow-lg
                        ${selected ? 'scale-110' : ''}
                      `}
                      style={{
                        background: piece.includes('w') 
                          ? 'linear-gradient(135deg, #f5f5dc 0%, #deb887 50%, #d2b48c 100%)'
                          : 'linear-gradient(135deg, #8b4513 0%, #654321 50%, #4a4a4a 100%)',
                        color: piece.includes('w') ? '#8b4513' : '#f5deb3',
                        borderColor: piece.includes('w') ? '#daa520' : '#2f1b14',
                        textShadow: piece.includes('w') 
                          ? '1px 1px 2px rgba(139, 69, 19, 0.3)'
                          : '1px 1px 2px rgba(0, 0, 0, 0.5)',
                        boxShadow: piece.includes('w')
                          ? `inset 0 1px 0 rgba(255, 255, 255, 0.4),
                             inset 0 -1px 0 rgba(139, 69, 19, 0.2),
                             0 4px 8px rgba(0, 0, 0, 0.3)`
                          : `inset 0 1px 0 rgba(245, 222, 179, 0.2),
                             inset 0 -1px 0 rgba(0, 0, 0, 0.3),
                             0 4px 8px rgba(0, 0, 0, 0.4)`
                      }}
                    >
                      {pieceSymbols[piece]}
                    </div>
                  )}
                  
                  {/* Move indicator for empty squares */}
                  {possibleMove && !piece && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full opacity-80 shadow-lg animate-pulse border-2 border-blue-300"></div>
                    </div>
                  )}

                  {/* Capture indicator for occupied squares */}
                  {possibleMove && piece && (
                    <div className="absolute inset-0 border-8 border-blue-500 rounded-lg opacity-80 animate-pulse"></div>
                  )}

                  {/* Square coordinate label */}
                  <div className="absolute bottom-1 right-1 text-xs font-bold opacity-40 text-gray-800">
                    {square}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right rank labels (8-1) */}
          <div className="flex flex-col gap-1 pl-3">
            {ranks.map((rank) => (
              <div key={rank} className="h-20 flex items-center text-lg font-bold text-purple-200">
                {rank}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom coordinate labels - files (a-h) */}
        <div className="grid grid-cols-8 gap-1 mt-3 px-2">
          {files.map((file) => (
            <div key={file} className="w-20 text-center text-lg font-bold text-purple-200">
              {file}
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced game info panel */}
      <div className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-800/90 to-blue-800/90 rounded-xl backdrop-blur-sm border border-purple-400/30">
        <div className="flex items-center gap-6 text-base">
          <div className="text-purple-200">
            Selected: <span className="text-yellow-400 font-bold font-mono">{selectedSquare || 'none'}</span>
          </div>
          {possibleMoves.length > 0 && (
            <div className="text-purple-200">
              Available moves: <span className="text-blue-400 font-bold font-mono">{possibleMoves.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};