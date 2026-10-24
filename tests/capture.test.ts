import { describe, expect, it } from 'vitest';
import { createInitialState } from '../src/core/gameState';
import { canCapture, canMove } from '../src/core/rules';
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

describe('Capture & Land/Water Isolation Rules (capture.test.ts)', () => {
  it('allows stronger or equal rank pieces to capture on land, and forbids weaker from capturing stronger', () => {
    const state = createInitialState();
    const blueLion = makePiece(PieceType.Lion, Side.Blue, 3, 2);
    const redTiger = makePiece(PieceType.Tiger, Side.Red, 3, 3);
    const redLion = makePiece(PieceType.Lion, Side.Red, 2, 2);
    const redElephant = makePiece(PieceType.Elephant, Side.Red, 4, 2);
    state.pieces = [blueLion, redTiger, redLion, redElephant];

    // 狮(7) 吃 虎(6)
    expect(canCapture(state, blueLion, redTiger)).toBe(true);
    // 狮(7) 吃 狮(7) 同级互吃
    expect(canCapture(state, blueLion, redLion)).toBe(true);
    // 狮(7) 不能吃 象(8)
    expect(canCapture(state, blueLion, redElephant)).toBe(false);
  });

  it('enforces Rat vs Elephant mutual counter: Land Rat captures Elephant, Elephant NEVER captures Rat', () => {
    const state = createInitialState();
    const blueRat = makePiece(PieceType.Rat, Side.Blue, 3, 2);
    const redElephant = makePiece(PieceType.Elephant, Side.Red, 3, 3);
    state.pieces = [blueRat, redElephant];

    // 陆地鼠可以吃象
    expect(canCapture(state, blueRat, redElephant)).toBe(true);
    expect(canMove(state, blueRat, { x: 3, y: 3 })).toBe(true);

    // 象绝不能吃鼠
    expect(canCapture(state, redElephant, blueRat)).toBe(false);
    expect(canMove(state, redElephant, { x: 3, y: 2 })).toBe(false);
  });

  it('forbids a Rat in River from capturing an Elephant (or another Rat) on Land', () => {
    const state = createInitialState();
    const riverRat = makePiece(PieceType.Rat, Side.Blue, 1, 3); // 水中
    const landElephant = makePiece(PieceType.Elephant, Side.Red, 0, 3); // 河岸陆地
    const landRat = makePiece(PieceType.Rat, Side.Red, 1, 2); // 河岸陆地
    state.pieces = [riverRat, landElephant, landRat];

    expect(canCapture(state, riverRat, landElephant)).toBe(false);
    expect(canMove(state, riverRat, { x: 0, y: 3 })).toBe(false);

    expect(canCapture(state, riverRat, landRat)).toBe(false);
    expect(canMove(state, riverRat, { x: 1, y: 2 })).toBe(false);
  });

  it('forbids a piece on Land (including Land Rat) from capturing a Rat in River', () => {
    const state = createInitialState();
    const landRat = makePiece(PieceType.Rat, Side.Blue, 1, 2); // 陆地
    const riverRat = makePiece(PieceType.Rat, Side.Red, 1, 3); // 水中
    state.pieces = [landRat, riverRat];

    expect(canCapture(state, landRat, riverRat)).toBe(false);
    expect(canMove(state, landRat, { x: 1, y: 3 })).toBe(false);
  });

  it('allows a Rat in River to capture an enemy Rat also in River', () => {
    const state = createInitialState();
    const blueRiverRat = makePiece(PieceType.Rat, Side.Blue, 1, 3);
    const redRiverRat = makePiece(PieceType.Rat, Side.Red, 1, 4);
    state.pieces = [blueRiverRat, redRiverRat];

    expect(canCapture(state, blueRiverRat, redRiverRat)).toBe(true);
    expect(canMove(state, blueRiverRat, { x: 1, y: 4 })).toBe(true);
  });

  it('allows Lion/Tiger to jump across river and capture an eligible enemy piece on the far bank', () => {
    const state = createInitialState();
    const blueLion = makePiece(PieceType.Lion, Side.Blue, 1, 2);
    const redTiger = makePiece(PieceType.Tiger, Side.Red, 1, 6);
    const redElephant = makePiece(PieceType.Elephant, Side.Red, 2, 6);
    const blueTiger = makePiece(PieceType.Tiger, Side.Blue, 2, 2);
    state.pieces = [blueLion, redTiger, redElephant, blueTiger];

    // 狮跳河吃对岸虎
    expect(canMove(state, blueLion, { x: 1, y: 6 })).toBe(true);
    // 虎不能跳河吃对岸象
    expect(canMove(state, blueTiger, { x: 2, y: 6 })).toBe(false);
  });
});
