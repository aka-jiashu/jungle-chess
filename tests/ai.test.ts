import { describe, expect, it } from 'vitest';
import { createInitialState } from '../src/core/gameState';
import { chooseAIMove } from '../src/core/ai';
import { Piece, PieceType, Side } from '../src/core/types';
import { PIECE_RANKS } from '../src/core/constants';

function makePiece(type: PieceType, side: Side, x: number, y: number): Piece {
  return {
    id: `${side}-${type}`,
    type,
    side,
    rank: PIECE_RANKS[type],
    position: { x, y },
  };
}

describe('Single-Player AI Engine (ai.test.ts)', () => {
  it('chooses an immediate winning move into the enemy Den when available', () => {
    const state = createInitialState([
      makePiece(PieceType.Lion, Side.Red, 3, 1), // 一步进蓝穴 (3,0)
      makePiece(PieceType.Elephant, Side.Blue, 0, 2),
    ]);
    state.turn = Side.Red;

    const move = chooseAIMove(state, 'medium');
    expect(move).not.toBeNull();
    expect(move!.to).toEqual({ x: 3, y: 0 });
  });

  it('prefers capturing a high-value undefended enemy piece in medium difficulty', () => {
    const state = createInitialState([
      makePiece(PieceType.Elephant, Side.Red, 3, 4),
      makePiece(PieceType.Lion, Side.Blue, 3, 3), // 可被红象直接吃掉
      makePiece(PieceType.Cat, Side.Blue, 0, 0),
    ]);
    state.turn = Side.Red;

    const move = chooseAIMove(state, 'medium');
    expect(move).not.toBeNull();
    expect(move!.to).toEqual({ x: 3, y: 3 });
    expect(move!.captured?.type).toBe(PieceType.Lion);
  });

  it('returns a valid legal move in easy difficulty from initial board state', () => {
    const state = createInitialState();
    const move = chooseAIMove(state, 'easy');
    expect(move).not.toBeNull();
    expect(move!.piece.side).toBe(Side.Blue);
  });
});
