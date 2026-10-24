import { describe, expect, it } from 'vitest';
import { applyMove, createInitialState } from '../src/core/gameState';
import { canCapture, canMove, getEffectiveRank } from '../src/core/rules';
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

describe('Trap Mechanism Rules (trap.test.ts)', () => {
  it('reduces enemy piece effective rank to 0 when inside a trap, allowing even Rat or Cat to capture Elephant', () => {
    const state = createInitialState();
    // 红方象进入蓝方陷阱 (2, 0)
    const trappedRedElephant = makePiece(PieceType.Elephant, Side.Red, 2, 0);
    const blueCat = makePiece(PieceType.Cat, Side.Blue, 2, 1);
    state.pieces = [trappedRedElephant, blueCat];

    expect(getEffectiveRank(trappedRedElephant)).toBe(0);
    expect(canCapture(state, blueCat, trappedRedElephant)).toBe(true);
    expect(canMove(state, blueCat, { x: 2, y: 0 })).toBe(true);
  });

  it('allows Elephant to capture an enemy Rat if the Rat is inside the Elephant side trap', () => {
    const state = createInitialState();
    // 红方鼠在蓝方陷阱 (3, 1)
    const trappedRedRat = makePiece(PieceType.Rat, Side.Red, 3, 1);
    const blueElephant = makePiece(PieceType.Elephant, Side.Blue, 3, 2);
    state.pieces = [trappedRedRat, blueElephant];

    expect(getEffectiveRank(trappedRedRat)).toBe(0);
    expect(canCapture(state, blueElephant, trappedRedRat)).toBe(true);
  });

  it('does NOT penalize a piece standing in its OWN trap', () => {
    const state = createInitialState();
    // 蓝方狮站在蓝方自己的陷阱 (4, 0)
    const blueLionInOwnTrap = makePiece(PieceType.Lion, Side.Blue, 4, 0);
    const redTiger = makePiece(PieceType.Tiger, Side.Red, 4, 1);
    state.pieces = [blueLionInOwnTrap, redTiger];

    expect(getEffectiveRank(blueLionInOwnTrap)).toBe(7);
    expect(canCapture(state, redTiger, blueLionInOwnTrap)).toBe(false);
  });

  it('immediately restores a piece full rank once it steps out of the enemy trap', () => {
    let state = createInitialState();
    const redLion = makePiece(PieceType.Lion, Side.Red, 3, 1); // 蓝方陷阱 D2
    const blueTiger = makePiece(PieceType.Tiger, Side.Blue, 4, 2);
    state.pieces = [redLion, blueTiger];
    state.turn = Side.Red;

    expect(getEffectiveRank(redLion)).toBe(0);

    // 红狮走出陷阱到 (3, 2)
    state = applyMove(state, {
      from: { x: 3, y: 1 },
      to: { x: 3, y: 2 },
      piece: redLion,
    });

    const movedLion = state.pieces.find((p) => p.id === redLion.id)!;
    expect(getEffectiveRank(movedLion)).toBe(7);
    // 蓝方虎(6) 不能吃恢复等级后的红狮(7)
    expect(canCapture(state, blueTiger, movedLion)).toBe(false);
  });
});
