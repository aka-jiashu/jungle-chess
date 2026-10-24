import { getPieceAt, manhattanDistance } from './board';
import { canMove } from './rules';
import { GameState, Move, Piece, PieceType, Position, Side } from './types';

const ORTHOGONAL_DIRS: Position[] = [
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: -1, y: 0 },
];

const JUMP_CANDIDATE_OFFSETS: Position[] = [
  { x: 3, y: 0 },
  { x: -3, y: 0 },
  { x: 0, y: 4 },
  { x: 0, y: -4 },
];

export function getLegalMovesForPiece(state: GameState, piece: Piece): Move[] {
  const moves: Move[] = [];
  const { from } = { from: piece.position };

  // 1. 基础四向相邻格
  for (const dir of ORTHOGONAL_DIRS) {
    const to = { x: from.x + dir.x, y: from.y + dir.y };
    if (canMove(state, piece, to)) {
      const captured = getPieceAt(state, to);
      moves.push({
        from,
        to,
        piece,
        captured,
        isRiverJump: false,
      });
    }
  }

  // 2. 狮、虎跳河候选目标格
  if (piece.type === PieceType.Lion || piece.type === PieceType.Tiger) {
    for (const offset of JUMP_CANDIDATE_OFFSETS) {
      const to = { x: from.x + offset.x, y: from.y + offset.y };
      if (canMove(state, piece, to)) {
        const captured = getPieceAt(state, to);
        moves.push({
          from,
          to,
          piece,
          captured,
          isRiverJump: manhattanDistance(from, to) > 1,
        });
      }
    }
  }

  return moves;
}

export function getLegalMoves(state: GameState, side: Side = state.turn): Move[] {
  const moves: Move[] = [];
  for (const piece of state.pieces) {
    if (piece.side === side) {
      moves.push(...getLegalMovesForPiece(state, piece));
    }
  }
  return moves;
}
