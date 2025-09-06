# Chess Puzzle Trainer

A modern React-based chess puzzle training app with Chess.com-inspired design that helps users improve their tactical skills through interactive puzzles and challenges.

## ✨ Features

### 🎯 Puzzle System
- Interactive chess puzzles with move validation
- Knight fork tactics and multi-move sequences
- Real-time feedback on moves (correct/incorrect)
- Puzzle themes and difficulty levels

### 🎨 Modern UI/UX
- Chess.com-style mobile interface design
- Dark theme with brown chess board colors
- shadcn/ui components for consistent styling
- Responsive design optimized for mobile and desktop
- Smooth animations and hover effects

### 📊 Progress Tracking
- Current streak counter
- Rating and accuracy display
- User progress persistence (localStorage)
- Statistics dashboard

### ⚡ Interactive Features
- Drag and drop piece movement
- Timer functionality
- Reset puzzle capability
- Visual feedback for moves

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite for fast development
- react-chessboard for interactive chess UI
- chess.js for game logic and move validation
- Tailwind CSS v4 for styling
- shadcn/ui component library
- Lucide React for icons

**Chess Engine:**
- chess.js for move validation
- FEN position handling
- Game state management

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production  
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── PuzzleBoard.tsx
│   └── theme-toggle.tsx
├── hooks/
│   └── useDarkMode.ts
├── types/
│   └── puzzle.ts
└── utils/
```

## 🎮 Current Puzzle

The app includes a knight fork tactical puzzle where players must:
1. Identify the white knight on f3
2. Move it to g5 to fork the black king and queen
3. Solve the puzzle to increase their streak

## 🔧 Development Notes

- Uses separate state management for chess game logic vs visual board position
- Implements proper TypeScript interfaces for puzzle data
- Includes comprehensive logging for debugging move validation
- Handles react-chessboard rendering issues with state separation

## 🎯 Future Enhancements

- [ ] Multiple puzzle types (pins, skewers, discovered attacks)
- [ ] Stockfish integration for analysis
- [ ] Puzzle database integration
- [ ] User accounts and cloud sync
- [ ] Sound effects and animations
- [ ] Puzzle ratings and difficulty progression