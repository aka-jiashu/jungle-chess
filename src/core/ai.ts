import { DEN_POSITIONS } from './constants';
import { isEnemyDen, isEnemyTrap, isRiver, manhattanDistance } from './board';
import { applyMove } from './gameState';
import { getLegalMoves } from './moveGenerator';
import { AIDifficulty, GameState, GameStatus, Move, Piece, PieceType, Side } from './types';

const PIECE_VALUES: Record<PieceType, number> = {
  [PieceType.Rat]: 260,      // 鼠能克象且能下水，战略价值高于猫狗
  [PieceType.Cat]: 120,
  [PieceType.Dog]: 180,
  [PieceType.Wolf]: 250,
  [PieceType.Leopard]: 340,
  [PieceType.Tiger]: 520,
  [PieceType.Lion]: 680,
  [PieceType.Elephant]: 780,
};

function evaluatePiece(piece: Piece): number {
  const enemySide = piece.side === Side.Blue ? Side.Red : Side.Blue;
  const enemyDen = DEN_POSITIONS[enemySide];
  const distToEnemyDen = manhattanDistance(piece.position, enemyDen);

  let score = PIECE_VALUES[piece.type];

  // 鼓励棋子向敌方兽穴推进（越近加分越多）
  score += (14 - distToEnemyDen) * 18;

  // 若进入敌方陷阱（距离敌穴仅 1 格），虽然战力降为 0，但下一步即可进穴，给高额战术分
  if (isEnemyTrap(piece.position, piece.side)) {
    score += 90;
  }

  // 鼠在河中具备阻挡狮虎跳河的战术价值
  if (piece.type === PieceType.Rat && isRiver(piece.position)) {
    score += 25;
  }

  return score;
}

/**
 * 静态局面评估函数（以 perspectiveSide 为正分方向）
 */
export function evaluateBoard(state: GameState, perspectiveSide: Side): number {
  if (state.status === GameStatus.BlueWon) {
    return perspectiveSide === Side.Blue ? 100000 : -100000;
  }
  if (state.status === GameStatus.RedWon) {
    return perspectiveSide === Side.Red ? 100000 : -100000;
  }
  if (state.status === GameStatus.Draw) {
    return 0;
  }

  let total = 0;
  for (const piece of state.pieces) {
    const val = evaluatePiece(piece);
    if (piece.side === perspectiveSide) {
      total += val;
    } else {
      total -= val;
    }
  }
  return total;
}

function orderMoves(moves: Move[]): Move[] {
  return [...moves].sort((a, b) => {
    const scoreA = (a.captured ? PIECE_VALUES[a.captured.type] * 2 : 0) + (a.isRiverJump ? 30 : 0);
    const scoreB = (b.captured ? PIECE_VALUES[b.captured.type] * 2 : 0) + (b.isRiverJump ? 30 : 0);
    return scoreB - scoreA;
  });
}

function minimax(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizingSide: Side
): number {
  if (depth === 0 || state.status !== GameStatus.Playing) {
    return evaluateBoard(state, maximizingSide);
  }

  const legalMoves = orderMoves(getLegalMoves(state));
  if (legalMoves.length === 0) {
    return evaluateBoard(state, maximizingSide);
  }

  const isMaximizing = state.turn === maximizingSide;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of legalMoves) {
      const nextState = applyMove(state, move);
      const evaluation = minimax(nextState, depth - 1, alpha, beta, maximizingSide);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of legalMoves) {
      const nextState = applyMove(state, move);
      const evaluation = minimax(nextState, depth - 1, alpha, beta, maximizingSide);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

/**
 * 为当前走子方选择一步 AI 着法
 */
export function chooseAIMove(
  state: GameState,
  difficulty: AIDifficulty = 'medium'
): Move | null {
  if (state.status !== GameStatus.Playing) return null;

  const legalMoves = getLegalMoves(state);
  if (legalMoves.length === 0) return null;

  const aiSide = state.turn;

  // 1. 无论什么难度，如果有一步直接进敌方兽穴获胜的着法，立即执行
  for (const move of legalMoves) {
    if (isEnemyDen(move.to, aiSide)) {
      return move;
    }
  }

  if (difficulty === 'easy') {
    // 简单难度：一层启发式评估 + 适度随机性
    const scoredMoves = legalMoves.map((move) => {
      const nextState = applyMove(state, move);
      const baseScore = evaluateBoard(nextState, aiSide);
      const noise = (Math.random() - 0.5) * 140;
      return { move, score: baseScore + noise };
    });
    scoredMoves.sort((a, b) => b.score - a.score);
    return scoredMoves[0].move;
  }

  // 中等难度：3 层深度 Minimax + Alpha-Beta 剪枝
  const ordered = orderMoves(legalMoves);
  let bestMove = ordered[0];
  let bestScore = -Infinity;
  let alpha = -Infinity;
  const beta = Infinity;

  for (const move of ordered) {
    const nextState = applyMove(state, move);
    const score = minimax(nextState, 2, alpha, beta, aiSide);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
    alpha = Math.max(alpha, score);
  }

  return bestMove;
}
