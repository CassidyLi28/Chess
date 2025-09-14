import { Chess } from 'chess.js';

interface StockfishEvaluation {
  evaluation: number;
  bestMove?: string;
  depth: number;
  mate?: number;
}

interface MoveAnalysis {
  move: string;
  evaluation: StockfishEvaluation;
  classification: 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
  comment: string;
}

class StockfishService {
  private engine: any = null;
  private isReady = false;
  private evaluationPromise: Promise<StockfishEvaluation> | null = null;

  async initialize(): Promise<void> {
    if (this.isReady) return;

    try {
      // Dynamic import to avoid SSR issues
      const Stockfish = (await import('stockfish')).default;
      this.engine = Stockfish();
      
      return new Promise((resolve) => {
        this.engine.addMessageListener((line: string) => {
          if (line === 'uciok') {
            this.engine.postMessage('setoption name Threads value 1');
            this.engine.postMessage('setoption name Hash value 16');
            this.engine.postMessage('isready');
          } else if (line === 'readyok') {
            this.isReady = true;
            resolve();
          }
        });
        
        this.engine.postMessage('uci');
      });
    } catch (error) {
      console.error('Failed to initialize Stockfish:', error);
      throw error;
    }
  }

  async evaluatePosition(fen: string, depth = 15): Promise<StockfishEvaluation> {
    if (!this.isReady) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      let bestMove = '';
      let evaluation = 0;
      let currentDepth = 0;
      let mate: number | undefined;

      const timeout = setTimeout(() => {
        reject(new Error('Stockfish evaluation timeout'));
      }, 10000);

      const messageHandler = (line: string) => {
        if (line.startsWith('info')) {
          // Parse evaluation from UCI info
          const depthMatch = line.match(/depth (\d+)/);
          const scoreMatch = line.match(/score cp (-?\d+)/);
          const mateMatch = line.match(/score mate (-?\d+)/);
          const pvMatch = line.match(/pv (\w+)/);

          if (depthMatch) {
            currentDepth = parseInt(depthMatch[1]);
          }

          if (scoreMatch) {
            evaluation = parseInt(scoreMatch[1]) / 100; // Convert centipawns to pawns
            mate = undefined;
          } else if (mateMatch) {
            mate = parseInt(mateMatch[1]);
            evaluation = mate > 0 ? 999 : -999;
          }

          if (pvMatch) {
            bestMove = pvMatch[1];
          }
        } else if (line.startsWith('bestmove')) {
          clearTimeout(timeout);
          this.engine.removeMessageListener(messageHandler);
          
          const moveMatch = line.match(/bestmove (\w+)/);
          if (moveMatch) {
            bestMove = moveMatch[1];
          }

          resolve({
            evaluation,
            bestMove,
            depth: currentDepth,
            mate
          });
        }
      };

      this.engine.addMessageListener(messageHandler);
      this.engine.postMessage(`position fen ${fen}`);
      this.engine.postMessage(`go depth ${depth}`);
    });
  }

  async analyzeMove(beforeFen: string, afterFen: string, move: string): Promise<MoveAnalysis> {
    try {
      const [beforeEval, afterEval] = await Promise.all([
        this.evaluatePosition(beforeFen),
        this.evaluatePosition(afterFen)
      ]);

      const evalDiff = afterEval.evaluation - beforeEval.evaluation;
      
      let classification: MoveAnalysis['classification'];
      let comment: string;

      // Classification based on evaluation change
      if (beforeEval.bestMove && move.startsWith(beforeEval.bestMove.slice(0, 4))) {
        classification = 'excellent';
        comment = 'Best move! Stockfish agrees with your choice.';
      } else if (evalDiff >= -0.1) {
        classification = 'excellent';
        comment = 'Excellent move! No significant evaluation loss.';
      } else if (evalDiff >= -0.25) {
        classification = 'good';
        comment = 'Good move with minor evaluation loss.';
      } else if (evalDiff >= -0.5) {
        classification = 'inaccuracy';
        comment = 'Inaccuracy. A slightly better move was available.';
      } else if (evalDiff >= -1.0) {
        classification = 'mistake';
        comment = 'Mistake. This move loses significant advantage.';
      } else {
        classification = 'blunder';
        comment = 'Blunder! This move severely damages your position.';
      }

      return {
        move,
        evaluation: afterEval,
        classification,
        comment
      };
    } catch (error) {
      console.error('Failed to analyze move:', error);
      return {
        move,
        evaluation: { evaluation: 0, depth: 0 },
        classification: 'good',
        comment: 'Unable to analyze move'
      };
    }
  }

  async getBestMoveHint(fen: string): Promise<string | null> {
    try {
      const evaluation = await this.evaluatePosition(fen, 12);
      return evaluation.bestMove || null;
    } catch (error) {
      console.error('Failed to get best move hint:', error);
      return null;
    }
  }

  destroy(): void {
    if (this.engine) {
      this.engine.terminate();
      this.engine = null;
      this.isReady = false;
    }
  }
}

// Singleton instance
export const stockfishService = new StockfishService();