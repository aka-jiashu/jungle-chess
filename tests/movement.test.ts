import { describe, expect, it } from 'vitest';
import { createInitialState } from '../src/core/gameState';
import { getTerrainAt, isInBounds } from '../src/core/board';
import { canMove } from '../src/core/rules';
import { getLegalMovesForPiece } from '../src/core/moveGenerator';
import { Piece, PieceType, Side, TerrainType } from '../src/core/types';
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

describe('Board & Basic Movement Rules (movement.test.ts)', () => {
  it('identifies board bounds and terrains accurately', () => {
    expect(isInBounds({ x: 0, y: 0 })).toBe(true);
    expect(isInBounds({ x: 6, y: 8 })).toBe(true);
    expect(isInBounds({ x: -1, y: 0 })).toBe(false);
    expect(isInBounds({ x: 7, y: 0 })).toBe(false);
    expect(isInBounds({ x: 0, y: 9 })).toBe(false);

    expect(getTerrainAt({ x: 1, y: 3 })).toBe(TerrainType.River);
    expect(getTerrainAt({ x: 3, y: 4 })).toBe(TerrainType.Land); // 中央走道
    expect(getTerrainAt({ x: 2, y: 0 })).toBe(TerrainType.Trap);
    expect(getTerrainAt({ x: 3, y: 0 })).toBe(TerrainType.Den);
    expect(getTerrainAt({ x: 3, y: 8 })).toBe(TerrainType.Den);
  });

  it('allows orthogonal 1-step movement on land and forbids diagonal or multi-step moves', () => {
    const state = createInitialState();
    const wolf = makePiece(PieceType.Wolf, Side.Blue, 2, 2);
    state.pieces = [wolf];

    expect(canMove(state, wolf, { x: 2, y: 1 })).toBe(true);
    expect(canMove(state, wolf, { x: 3, y: 2 })).toBe(true);
    // 斜走禁止
    expect(canMove(state, wolf, { x: 3, y: 3 })).toBe(false);
    // 跨2格禁止
    expect(canMove(state, wolf, { x: 2, y: 0 })).toBe(false);
  });

  it('strictly forbids any piece from entering its own Den', () => {
    const state = createInitialState();
    const blueCat = makePiece(PieceType.Cat, Side.Blue, 3, 1);
    const redCat = makePiece(PieceType.Cat, Side.Red, 3, 7);
    state.pieces = [blueCat, redCat];

    // 蓝方不能进 (3, 0)
    expect(canMove(state, blueCat, { x: 3, y: 0 })).toBe(false);
    // 红方不能进 (3, 8)
    state.turn = Side.Red;
    expect(canMove(state, redCat, { x: 3, y: 8 })).toBe(false);
  });

  it('allows only the Rat to enter River tiles, blocking all other animals from swimming', () => {
    const state = createInitialState();
    const rat = makePiece(PieceType.Rat, Side.Blue, 1, 2);
    const leopard = makePiece(PieceType.Leopard, Side.Blue, 2, 2);
    const lion = makePiece(PieceType.Lion, Side.Blue, 4, 2);
    state.pieces = [rat, leopard, lion];

    // 鼠可以入水 (1, 3)
    expect(canMove(state, rat, { x: 1, y: 3 })).toBe(true);
    // 豹不能入水 (2, 3)
    expect(canMove(state, leopard, { x: 2, y: 3 })).toBe(false);
    // 狮不能落入水格 (4, 3)
    expect(canMove(state, lion, { x: 4, y: 3 })).toBe(false);
  });

  it('forbids moving onto a square occupied by a friendly piece', () => {
    const state = createInitialState();
    const elephant = makePiece(PieceType.Elephant, Side.Blue, 6, 2);
    const dog = makePiece(PieceType.Dog, Side.Blue, 6, 1);
    state.pieces = [elephant, dog];

    expect(canMove(state, elephant, { x: 6, y: 1 })).toBe(false);
    const moves = getLegalMovesForPiece(state, elephant);
    expect(moves.some((m) => m.to.x === 6 && m.to.y === 1)).toBe(false);
  });
});
