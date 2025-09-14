import type { Puzzle } from '@/types/puzzle';

export const advancedPuzzleDatabase: Puzzle[] = [
  // ===== MATING PATTERNS (1000-2000) =====
  {
    id: 'mate-smothered-001',
    fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4',
    solution: [{ from: 'f3', to: 'g5' }, { from: 'f7', to: 'f6' }, { from: 'g5', to: 'e6' }],
    themes: ['smothered-mate', 'sacrifice'],
    category: 'mating-patterns',
    difficulty: 'intermediate',
    rating: 1450,
    title: 'Smothered Mate Threat',
    description: 'Set up a smothered mate pattern',
    tags: ['classical-mate']
  },

  {
    id: 'mate-backrank-001',
    fen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
    solution: [{ from: 'a1', to: 'a8' }],
    themes: ['back-rank-mate'],
    category: 'mating-patterns',
    difficulty: 'beginner',
    rating: 1100,
    title: 'Back Rank Mate',
    description: 'Simple back rank checkmate',
    tags: ['basic-mate']
  },

  {
    id: 'tactics-fork-001',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4',
    solution: [{ from: 'f3', to: 'g5' }],
    themes: ['fork', 'double-attack'],
    category: 'tactics',
    difficulty: 'intermediate',
    rating: 1280,
    title: 'Knight Fork',
    description: 'Fork the king and queen with your knight',
    tags: ['basic-tactics']
  },

  // ===== SACRIFICES (1200-2500) =====
  {
    id: 'sacrifice-greek-001',
    fen: 'rnbqkb1r/ppp2ppp/3p1n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 4',
    solution: [{ from: 'c4', to: 'f7' }, { from: 'e8', to: 'f7' }, { from: 'f3', to: 'g5' }],
    themes: ['greek-gift', 'sacrifice'],
    category: 'sacrifices',
    difficulty: 'intermediate',
    rating: 1520,
    title: 'Greek Gift Sacrifice',
    description: 'Classic Bxh7+ Greek gift sacrifice',
    tags: ['classical-sacrifice']
  },

  {
    id: 'sacrifice-queen-001',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP1QPPP/RNB1K2R w KQkq - 4 4',
    solution: [{ from: 'e2', to: 'h5' }, { from: 'f6', to: 'g4' }, { from: 'h5', to: 'f7' }],
    themes: ['queen-sacrifice', 'mating-attack'],
    category: 'sacrifices',
    difficulty: 'advanced',
    rating: 1850,
    title: 'Queen Sacrifice Attack',
    description: 'Sacrifice the queen for checkmate',
    tags: ['brilliant-sacrifice']
  },

  {
    id: 'sacrifice-exchange-001',
    fen: 'r3k2r/ppp2ppp/2n1bn2/2bpp3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 8',
    solution: [{ from: 'a1', to: 'c1' }, { from: 'c6', to: 'e7' }, { from: 'c1', to: 'c7' }],
    themes: ['exchange-sacrifice', 'positional-sacrifice'],
    category: 'sacrifices',
    difficulty: 'expert',
    rating: 2100,
    title: 'Exchange Sacrifice',
    description: 'Sacrifice the rook for positional compensation',
    tags: ['positional-play']
  },

  // ===== ENDGAMES (1000-2400) =====
  {
    id: 'endgame-pawn-001',
    fen: '8/8/8/4k3/4P3/4K3/8/8 w - - 0 1',
    solution: [{ from: 'e3', to: 'f4' }, { from: 'e5', to: 'd6' }, { from: 'f4', to: 'f5' }],
    themes: ['pawn-endgame', 'opposition'],
    category: 'endgames',
    difficulty: 'intermediate',
    rating: 1200,
    title: 'Pawn Endgame Opposition',
    description: 'Use opposition to win the pawn ending',
    tags: ['fundamental-endgame']
  },

  {
    id: 'endgame-rook-001',
    fen: '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
    solution: [{ from: 'e1', to: 'e7' }, { from: 'g8', to: 'h8' }, { from: 'e7', to: 'f7' }],
    themes: ['rook-endgame', 'technique'],
    category: 'endgames',
    difficulty: 'advanced',
    rating: 1750,
    title: 'Rook Endgame Technique',
    description: 'Precise rook endgame play',
    tags: ['endgame-precision']
  },

  {
    id: 'endgame-zugzwang-001',
    fen: '8/8/8/3k4/3P4/3K4/8/8 b - - 0 1',
    solution: [{ from: 'd5', to: 'c6' }, { from: 'd3', to: 'e4' }, { from: 'c6', to: 'd6' }],
    themes: ['zugzwang', 'pawn-endgame'],
    category: 'endgames',
    difficulty: 'expert',
    rating: 2000,
    title: 'Zugzwang Position',
    description: 'Whoever moves first loses',
    tags: ['theoretical-endgame']
  },

  // ===== OPENING TRAPS (900-1600) =====
  {
    id: 'opening-legal-001',
    fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 2 3',
    solution: [{ from: 'f6', to: 'g4' }, { from: 'f3', to: 'e5' }, { from: 'd8', to: 'g5' }],
    themes: ['legal-mate', 'discovered-attack'],
    category: 'opening-traps',
    difficulty: 'intermediate',
    rating: 1350,
    title: 'Legall Mate Trap',
    description: 'The famous Legall mate sacrifice',
    gameInfo: { white: 'Legall', black: 'Saint Brie', event: 'Paris', year: 1750 },
    tags: ['historical-trap']
  },

  {
    id: 'opening-fried-liver-001',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4',
    solution: [{ from: 'f3', to: 'g5' }, { from: 'd7', to: 'd6' }, { from: 'c4', to: 'f7' }],
    themes: ['sacrifice', 'mating-attack'],
    category: 'opening-traps',
    difficulty: 'intermediate',
    rating: 1420,
    title: 'Fried Liver Attack',
    description: 'The devastating Fried Liver sacrifice',
    tags: ['italian-game']
  },

  // ===== POSITIONAL PLAY (1400-2300) =====
  {
    id: 'positional-weak-squares-001',
    fen: 'r1bqkb1r/ppp2ppp/2n2n2/3pp3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 5',
    solution: [{ from: 'c4', to: 'd5' }, { from: 'f6', to: 'd5' }, { from: 'f3', to: 'd5' }],
    themes: ['weak-king', 'piece-coordination'],
    category: 'positional',
    difficulty: 'advanced',
    rating: 1680,
    title: 'Exploiting Weak Squares',
    description: 'Control key central squares',
    tags: ['strategic-play']
  },

  {
    id: 'positional-outpost-001',
    fen: 'r1bqkb1r/ppp2ppp/2n2n2/3p4/3P4/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 5',
    solution: [{ from: 'c3', to: 'e4' }, { from: 'f6', to: 'e4' }, { from: 'f3', to: 'e4' }],
    themes: ['piece-coordination', 'outpost'],
    category: 'positional',
    difficulty: 'advanced',
    rating: 1720,
    title: 'Knight Outpost',
    description: 'Establish a powerful knight outpost',
    tags: ['positional-advantage']
  },

  // ===== DEFENSIVE RESOURCES (1300-2100) =====
  {
    id: 'defensive-counterattack-001',
    fen: 'r2q1rk1/ppp2ppp/2n1bn2/3p4/2PP4/2N2N2/PP2BPPP/R2Q1RK1 b - - 0 8',
    solution: [{ from: 'd5', to: 'c4' }, { from: 'e2', to: 'c4' }, { from: 'f6', to: 'd5' }],
    themes: ['counterattack', 'deflection'],
    category: 'defensive',
    difficulty: 'advanced',
    rating: 1650,
    title: 'Defensive Counterattack',
    description: 'Strike back with a counter-attack',
    tags: ['defensive-tactics']
  },

  {
    id: 'defensive-stalemate-001',
    fen: '8/8/8/8/8/2k5/2p5/2K5 w - - 0 1',
    solution: [{ from: 'c1', to: 'c2' }],
    themes: ['stalemate-trick', 'defensive'],
    category: 'defensive',
    difficulty: 'expert',
    rating: 1950,
    title: 'Stalemate Defense',
    description: 'Save the game with stalemate',
    tags: ['defensive-resource']
  },

  // ===== CALCULATION CHALLENGES (1600-2600) =====
  {
    id: 'calculation-deep-001',
    fen: 'r2q1rk1/ppp1bppp/2n1bn2/3p4/2PP4/2N1PN2/PP1B1PPP/R2QK2R w KQ - 0 8',
    solution: [
      { from: 'd2', to: 'h6' }, { from: 'g7', to: 'h6' }, { from: 'd1', to: 'h5' }, 
      { from: 'f6', to: 'g4' }, { from: 'h5', to: 'h6' }, { from: 'g8', to: 'h8' },
      { from: 'h6', to: 'h7' }
    ],
    themes: ['sacrifice', 'mating-attack', 'calculation'],
    category: 'calculation',
    difficulty: 'expert',
    rating: 2200,
    title: 'Deep Calculation',
    description: 'Calculate 7 moves deep to mate',
    tags: ['complex-calculation']
  },

  {
    id: 'calculation-combinations-001',
    fen: 'r1bq1rk1/ppp2ppp/2n1bn2/3p4/2PP4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 8',
    solution: [
      { from: 'f3', to: 'h4' }, { from: 'f6', to: 'h5' }, { from: 'd1', to: 'h5' },
      { from: 'h7', to: 'h6' }, { from: 'h4', to: 'f5' }
    ],
    themes: ['sacrifice', 'attack', 'calculation'],
    category: 'calculation',
    difficulty: 'master',
    rating: 2350,
    title: 'Tactical Combination',
    description: 'Find the brilliant tactical shot',
    tags: ['master-level']
  },
  // ===== BEGINNER TACTICS (800-1200) =====
  {
    id: 'beginner-001',
    fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 2 3',
    solution: [{ from: 'f6', to: 'g4' }],
    themes: ['fork'],
    category: 'tactics',
    difficulty: 'beginner',
    rating: 850,
    title: 'Simple Knight Fork',
    description: 'Fork the king and queen with your knight',
    tags: ['basic-fork']
  },

  {
    id: 'beginner-004',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/3P1N2/PPP2PPP/RNBQKB1R w KQkq - 4 4',
    solution: [{ from: 'f1', to: 'c4' }, { from: 'f6', to: 'g4' }, { from: 'f3', to: 'g5' }],
    themes: ['pin'],
    category: 'tactics',
    difficulty: 'beginner',
    rating: 920,
    title: 'Basic Pin Pattern',
    description: 'Pin the knight to win material',
    tags: ['pin-tactics']
  },

  {
    id: 'beginner-005',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w kq - 5 4',
    solution: [{ from: 'f3', to: 'g5' }],
    themes: ['skewer'],
    category: 'tactics',
    difficulty: 'beginner',
    rating: 880,
    title: 'Knight Skewer',
    description: 'Skewer the bishop and knight',
    tags: ['skewer-tactics']
  },

  {
    id: 'beginner-006',
    fen: 'rnbqkb1r/ppp2ppp/3p1n2/4p3/4P3/3P1N2/PPP2PPP/RNBQKB1R w KQkq - 0 4',
    solution: [{ from: 'f1', to: 'b5' }],
    themes: ['pin'],
    category: 'tactics',
    difficulty: 'beginner',
    rating: 900,
    title: 'Bishop Pin',
    description: 'Pin the knight to the king',
    tags: ['pin-pattern']
  },
  
  {
    id: 'beginner-002',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4',
    solution: [{ from: 'f3', to: 'g5' }],
    themes: ['fork'],
    category: 'tactics',
    difficulty: 'beginner',
    rating: 900,
    title: 'Classic Ng5 Fork',
    description: 'The most common knight fork pattern',
    gameInfo: { white: 'Training Position', black: 'Student', year: 2024 },
    tags: ['knight-tactics']
  },

  {
    id: 'beginner-003',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 5 4',
    solution: [{ from: 'c5', to: 'f2' }, { from: 'g1', to: 'h1' }, { from: 'f2', to: 'd4' }],
    themes: ['fork', 'double-attack'],
    category: 'tactics',
    difficulty: 'beginner',
    rating: 950,
    title: 'Bishop Fork Discovery',
    description: 'Use your bishop to create a double attack',
    tags: ['bishop-tactics']
  },

  // ===== INTERMEDIATE TACTICS (1200-1600) =====
  {
    id: 'intermediate-001',
    fen: 'r2qkb1r/ppp2ppp/2n1bn2/3pp3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 4 6',
    solution: [
      { from: 'c4', to: 'f7' },
      { from: 'e8', to: 'f7' },
      { from: 'f3', to: 'g5' },
      { from: 'f7', to: 'e8' },
      { from: 'd1', to: 'h5' }
    ],
    themes: ['sacrifice', 'mating-attack'],
    category: 'sacrifices',
    difficulty: 'intermediate',
    rating: 1350,
    title: 'Fried Liver Attack',
    description: 'Classic Bxf7+ sacrifice leading to mate',
    gameInfo: { white: 'Italian Game', black: 'Two Knights Defense' },
    tags: ['opening-traps', 'king-hunt']
  },

  {
    id: 'intermediate-002',
    fen: 'r1bq1rk1/ppp2ppp/2n1bn2/3p4/2PP4/2N2N2/PP2BPPP/R1BQ1RK1 w - - 0 8',
    solution: [
      { from: 'f3', to: 'g5' },
      { from: 'e6', to: 'g5' },
      { from: 'e2', to: 'h5' },
      { from: 'g7', to: 'g6' },
      { from: 'h5', to: 'g5' }
    ],
    themes: ['sacrifice', 'weak-king'],
    category: 'tactics',
    difficulty: 'intermediate',
    rating: 1420,
    title: 'Kingside Attack Pattern',
    description: 'Sacrifice to expose the enemy king',
    tags: ['kingside-attack']
  },

  // ===== ADVANCED TACTICS (1600-2000) =====
  {
    id: 'advanced-001',
    fen: 'r2q1rk1/ppp1bppp/2n1bn2/3p4/2PP4/2N1PN2/PP1B1PPP/R2QK2R w KQ - 6 9',
    solution: [
      { from: 'd2', to: 'h6' },
      { from: 'g7', to: 'h6' },
      { from: 'd1', to: 'h5' },
      { from: 'f6', to: 'g4' },
      { from: 'h5', to: 'h6' },
      { from: 'g8', to: 'h8' },
      { from: 'e3', to: 'g4' }
    ],
    themes: ['greek-gift', 'mating-attack'],
    category: 'sacrifices',
    difficulty: 'advanced',
    rating: 1750,
    title: 'Greek Gift Sacrifice',
    description: 'Classical Bxh6 sacrifice with mate',
    gameInfo: { white: 'Master Game', black: 'Training', event: 'Tactical Training' },
    tags: ['bxh7-sacrifice', 'classical']
  },

  {
    id: 'advanced-002',
    fen: 'r2qk2r/ppp2ppp/2n1bn2/2bpp3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 4 6',
    solution: [
      { from: 'd1', to: 'h5' },
      { from: 'c6', to: 'e7' },
      { from: 'f3', to: 'g5' },
      { from: 'f6', to: 'g8' },
      { from: 'g5', to: 'h7' }
    ],
    themes: ['queen-sacrifice', 'deflection'],
    category: 'calculation',
    difficulty: 'advanced',
    rating: 1850,
    title: 'Queen Hunt Deflection',
    description: 'Force deflection with queen activity',
    tags: ['calculation-heavy']
  },

  // ===== EXPERT LEVEL (2000-2400) =====
  {
    id: 'expert-001',
    fen: '2rq1rk1/pp2bppp/2n1pn2/3p4/2PP4/1PN1PN2/P3BPPP/2RQ1RK1 w - - 0 12',
    solution: [
      { from: 'c3', to: 'd5' },
      { from: 'f6', to: 'd5' },
      { from: 'c4', to: 'd5' },
      { from: 'e6', to: 'd5' },
      { from: 'e2', to: 'c4' },
      { from: 'd8', to: 'a5' },
      { from: 'c4', to: 'd5' }
    ],
    themes: ['positional-sacrifice', 'piece-coordination'],
    category: 'positional',
    difficulty: 'expert',
    rating: 2150,
    title: 'Positional Pawn Sacrifice',
    description: 'Sacrifice for long-term positional advantage',
    gameInfo: { white: 'Petrosian', black: 'Botvinnik', event: 'World Championship', year: 1963 },
    tags: ['positional-play', 'endgame-advantage']
  },

  {
    id: 'expert-002',
    fen: 'r1b1kb1r/pp3ppp/2n1pq2/3p4/2PP4/2N2N2/PP3PPP/R1BQKB1R w KQkq - 2 8',
    solution: [
      { from: 'c4', to: 'd5' },
      { from: 'e6', to: 'd5' },
      { from: 'f1', to: 'b5' },
      { from: 'c8', to: 'd7' },
      { from: 'b5', to: 'c6' },
      { from: 'b7', to: 'c6' },
      { from: 'd1', to: 'a4' }
    ],
    themes: ['pin', 'weak-king', 'piece-coordination'],
    category: 'tactics',
    difficulty: 'expert',
    rating: 2200,
    title: 'Complex Pin Pattern',
    description: 'Multiple pins create tactical opportunities',
    tags: ['complex-tactics']
  },

  // ===== MASTER LEVEL (2400-2600) =====
  {
    id: 'master-001',
    fen: '3r2k1/1p3ppp/p1n1p3/2PpP3/1P1P4/P2B1N2/6PP/3R2K1 w - - 0 25',
    solution: [
      { from: 'd3', to: 'h7' },
      { from: 'g8', to: 'h7' },
      { from: 'f3', to: 'g5' },
      { from: 'h7', to: 'g8' },
      { from: 'h2', to: 'h4' },
      { from: 'f7', to: 'f6' },
      { from: 'h4', to: 'h5' }
    ],
    themes: ['sacrifice', 'pawn-storm', 'weak-king'],
    category: 'calculation',
    difficulty: 'master',
    rating: 2480,
    title: 'Pawn Storm Breakthrough',
    description: 'Calculate deep pawn storm sacrifice',
    gameInfo: { white: 'Tal', black: 'Petrosian', event: 'Candidates', year: 1959 },
    tags: ['calculation-deep', 'attacking-masterpiece']
  },

  {
    id: 'master-002',
    fen: '6k1/5pp1/7p/3Pp3/1r2P3/5PKP/8/2R5 w - - 0 40',
    solution: [
      { from: 'c1', to: 'c8' },
      { from: 'g8', to: 'h7' },
      { from: 'c8', to: 'h8' },
      { from: 'h7', to: 'g6' },
      { from: 'h8', to: 'h6' },
      { from: 'g6', to: 'f5' },
      { from: 'h6', to: 'f6' }
    ],
    themes: ['rook-endgame', 'zugzwang'],
    category: 'endgames',
    difficulty: 'master',
    rating: 2520,
    title: 'Precise Rook Endgame',
    description: 'Find the only winning continuation',
    gameInfo: { white: 'Capablanca', black: 'Marshall', event: 'New York', year: 1909 },
    tags: ['endgame-precision', 'technique']
  },

  // ===== GRANDMASTER LEVEL (2600+) =====
  {
    id: 'grandmaster-001',
    fen: '2r3k1/1p3p1p/p2p1np1/q1pPp3/P1P1P3/1P1Q1N1P/6P1/2R1R1K1 w - - 0 28',
    solution: [
      { from: 'f3', to: 'h4' },
      { from: 'f6', to: 'h5' },
      { from: 'd3', to: 'g3' },
      { from: 'a5', to: 'a1' },
      { from: 'e1', to: 'a1' },
      { from: 'c8', to: 'c1' },
      { from: 'a1', to: 'c1' },
      { from: 'h5', to: 'g3' },
      { from: 'h2', to: 'g3' }
    ],
    themes: ['deflection', 'clearance', 'x-ray'],
    category: 'calculation',
    difficulty: 'grandmaster',
    rating: 2750,
    title: 'Multi-Piece Deflection',
    description: 'Complex deflection sequence requiring precise calculation',
    gameInfo: { white: 'Kasparov', black: 'Karpov', event: 'World Championship', year: 1984 },
    tags: ['world-championship', 'calculation-extreme']
  },

  {
    id: 'grandmaster-002',
    fen: '8/pk6/1p2P3/1P1pKp2/3P1P2/8/8/8 w - - 0 55',
    solution: [
      { from: 'e5', to: 'f6' },
      { from: 'b7', to: 'c6' },
      { from: 'f6', to: 'g7' },
      { from: 'c6', to: 'd7' },
      { from: 'g7', to: 'f8' },
      { from: 'd7', to: 'e8' },
      { from: 'e6', to: 'e7' }
    ],
    themes: ['pawn-endgame', 'zugzwang', 'promotion'],
    category: 'endgames',
    difficulty: 'grandmaster',
    rating: 2850,
    title: 'Triangulation Study',
    description: 'Master-level pawn endgame with triangulation',
    gameInfo: { white: 'Study Position', black: 'Composed', event: 'Endgame Study' },
    tags: ['endgame-study', 'triangulation', 'pure-technique']
  },

  // ===== SPECIALIZED MATING PATTERNS =====
  {
    id: 'mate-001',
    fen: 'r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1',
    solution: [
      { from: 'a7', to: 'a8', promotion: 'q' }
    ],
    themes: ['promotion', 'back-rank-mate'],
    category: 'mating-patterns',
    difficulty: 'advanced',
    rating: 1900,
    title: 'Promotion Back Rank',
    description: 'Promote to deliver back rank mate',
    tags: ['promotion-tactics']
  },

  {
    id: 'mate-002',
    fen: 'r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/3P1N2/PPP1NPPP/R2Q1RK1 w - - 8 10',
    solution: [
      { from: 'f3', to: 'h4' },
      { from: 'g4', to: 'h3' },
      { from: 'g2', to: 'h3' },
      { from: 'f6', to: 'h5' },
      { from: 'd1', to: 'h5' }
    ],
    themes: ['smothered-mate', 'deflection'],
    category: 'mating-patterns',
    difficulty: 'expert',
    rating: 2100,
    title: 'Smothered Mate Pattern',
    description: 'Classical smothered mate with deflection',
    gameInfo: { white: 'Legall', black: 'Saint Brie', event: 'Paris', year: 1750 },
    tags: ['classical-mate', 'historical']
  }
];

// Helper functions for filtering
export const getPuzzlesByDifficulty = (difficulty: string): Puzzle[] => {
  return advancedPuzzleDatabase.filter(p => p.difficulty === difficulty);
};

export const getPuzzlesByCategory = (category: string): Puzzle[] => {
  return advancedPuzzleDatabase.filter(p => p.category === category);
};

export const getPuzzlesByTheme = (theme: string): Puzzle[] => {
  return advancedPuzzleDatabase.filter(p => p.themes.includes(theme as any));
};

export const getPuzzlesByRatingRange = (min: number, max: number): Puzzle[] => {
  return advancedPuzzleDatabase.filter(p => p.rating >= min && p.rating <= max);
};