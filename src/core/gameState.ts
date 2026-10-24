import { INITIAL_PIECES } from './constants';
import { getPieceAt, manhattanDistance, posEquals } from './board';
import { evaluateTerminalState } from './referee';
import { GameState, GameStatus, Move, Piece, Side } from './types';

/**
 * 生成当前局面的唯一字符串哈希（包含走子方与所有存活棋子的类型、阵营和坐标）
 */
export function computePositionHash(pieces: Piece[], turn: Side): string {
  const sorted = [...pieces]
    .map((p) => `${p.side[0]}${p.rank}@${p.position.x},${p.position.y}`)
    .sort()
    .join('|');
  return `${turn}:${sorted}`;
}

export function createInitialState(
  customPieces?: Piece[],
  startingTurn: Side = Side.Blue
): GameState {
  const pieces = (customPieces ?? INITIAL_PIECES).map((p) => ({
    ...p,
    position: { ...p.position },
  }));

  const initialHash = computePositionHash(pieces, startingTurn);

  return {
    pieces,
    turn: startingTurn,
    status: GameStatus.Playing,
    moveHistory: [],
    capturedPieces: {
      [Side.Blue]: [],
      [Side.Red]: [],
    },
    pliesWithoutCapture: 0,
    positionCounts: {
      [initialHash]: 1,
    },
  };
}

/**
 * 不可变地执行一步棋，返回更新后的新 GameState。
 */
export function applyMove(state: GameState, move: Move): GameState {
  const targetOccupant = move.captured ?? getPieceAt(state, move.to);

  const nextPieces = state.pieces
    .filter((p) => !(targetOccupant && p.id === targetOccupant.id) && !posEquals(p.position, move.to))
    .map((p) =>
      p.id === move.piece.id || posEquals(p.position, move.from)
        ? { ...p, position: { ...move.to } }
        : { ...p, position: { ...p.position } }
    );

  const nextTurn = state.turn === Side.Blue ? Side.Red : Side.Blue;
  const nextCaptured = {
    [Side.Blue]: [...state.capturedPieces[Side.Blue]],
    [Side.Red]: [...state.capturedPieces[Side.Red]],
  };

  if (targetOccupant) {
    nextCaptured[targetOccupant.side].push(targetOccupant);
  }

  const nextPliesWithoutCapture = targetOccupant ? 0 : state.pliesWithoutCapture + 1;
  const nextHash = computePositionHash(nextPieces, nextTurn);
  const nextPositionCounts = {
    ...state.positionCounts,
    [nextHash]: (state.positionCounts[nextHash] ?? 0) + 1,
  };

  const recordedMove: Move = {
    from: { ...move.from },
    to: { ...move.to },
    piece: { ...move.piece, position: { ...move.from } },
    captured: targetOccupant ? { ...targetOccupant } : undefined,
    isRiverJump: move.isRiverJump ?? manhattanDistance(move.from, move.to) > 1,
  };

  const nextState: GameState = {
    pieces: nextPieces,
    turn: nextTurn,
    status: GameStatus.Playing,
    moveHistory: [...state.moveHistory, recordedMove],
    capturedPieces: nextCaptured,
    pliesWithoutCapture: nextPliesWithoutCapture,
    positionCounts: nextPositionCounts,
  };

  const verdict = evaluateTerminalState(nextState, nextHash);
  nextState.status = verdict.status;
  nextState.endReason = verdict.endReason;

  return nextState;
}
