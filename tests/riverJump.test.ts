import { describe, expect, it } from 'vitest';
import { createInitialState } from '../src/core/gameState';
import { canMove, isRiverJumpBlocked } from '../src/core/rules';
import { Piece, PieceType, Side } from '../src/core/types';
import { PIECE_RANKS } from '../src/core/constants';

function makePiece(type: PieceType, side: Side, x: number, y: number): Piece {
  return {
    id: `${side}-${type}-${x}-${y}`,
    type,
    side,
    rank: PIECE_RANKS[type],
    position: { x, y },
  };
}

describe('Lion & Tiger River Jumping Rules (riverJump.test.ts)', () => {
  it('allows Lion and Tiger to jump vertically across 3 river tiles (y=2 <-> y=6)', () => {
    const state = createInitialState();
    const lion = makePiece(PieceType.Lion, Side.Blue, 1, 2);
    const tiger = makePiece(PieceType.Tiger, Side.Blue, 5, 6);
    state.pieces = [lion, tiger];

    // 纵向跳河: (1, 2) -> (1, 6)
    expect(canMove(state, lion, { x: 1, y: 6 })).toBe(true);
    // 纵向往回跳: (5, 6) -> (5, 2)
    expect(canMove(state, tiger, { x: 5, y: 2 })).toBe(true);
  });

  it('allows Lion and Tiger to jump horizontally across 2 river tiles (x=0<->3 and x=3<->6)', () => {
    const state = createInitialState();
    const lion = makePiece(PieceType.Lion, Side.Blue, 0, 4);
    const tiger = makePiece(PieceType.Tiger, Side.Blue, 3, 5);
    state.pieces = [lion, tiger];

    // 横向跳河: (0, 4) -> (3, 4)
    expect(canMove(state, lion, { x: 3, y: 4 })).toBe(true);
    // 中央走道向两侧跳: (3, 5) -> (0, 5) 和 (3, 5) -> (6, 5)
    expect(canMove(state, tiger, { x: 0, y: 5 })).toBe(true);
    expect(canMove(state, tiger, { x: 6, y: 5 })).toBe(true);
  });

  it('forbids non-Lion/Tiger pieces (e.g., Leopard, Elephant) from jumping across the river', () => {
    const state = createInitialState();
    const leopard = makePiece(PieceType.Leopard, Side.Blue, 1, 2);
    const elephant = makePiece(PieceType.Elephant, Side.Blue, 0, 4);
    state.pieces = [leopard, elephant];

    expect(canMove(state, leopard, { x: 1, y: 6 })).toBe(false);
    expect(canMove(state, elephant, { x: 3, y: 4 })).toBe(false);
  });

  it('blocks river jump when an ENEMY Rat is in any intermediate river square', () => {
    const state = createInitialState();
    const lion = makePiece(PieceType.Lion, Side.Blue, 1, 2);
    const enemyRat = makePiece(PieceType.Rat, Side.Red, 1, 4);
    state.pieces = [lion, enemyRat];

    expect(isRiverJumpBlocked(state, { x: 1, y: 2 }, { x: 1, y: 6 })).toBe(true);
    expect(canMove(state, lion, { x: 1, y: 6 })).toBe(false);
  });

  it('blocks river jump when a FRIENDLY Rat is in any intermediate river square', () => {
    const state = createInitialState();
    const tiger = makePiece(PieceType.Tiger, Side.Blue, 3, 4);
    const friendlyRat = makePiece(PieceType.Rat, Side.Blue, 2, 4);
    state.pieces = [tiger, friendlyRat];

    expect(isRiverJumpBlocked(state, { x: 3, y: 4 }, { x: 0, y: 4 })).toBe(true);
    expect(canMove(state, tiger, { x: 0, y: 4 })).toBe(false);
    // 另一侧没鼠阻挡，可正常跳
    expect(canMove(state, tiger, { x: 6, y: 4 })).toBe(true);
  });
});
