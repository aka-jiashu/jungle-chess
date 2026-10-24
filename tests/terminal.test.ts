import { describe, expect, it } from 'vitest';
import { applyMove, createInitialState } from '../src/core/gameState';
import { checkDenThreat } from '../src/core/referee';
import { EndReason, GameStatus, Piece, PieceType, Side } from '../src/core/types';
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

describe('Terminal Conditions & Referee Rules (terminal.test.ts)', () => {
  it('declares immediate victory when a piece enters the enemy Den', () => {
    let state = createInitialState();
    const blueLion = makePiece(PieceType.Lion, Side.Blue, 3, 7);
    const redRat = makePiece(PieceType.Rat, Side.Red, 0, 6);
    state.pieces = [blueLion, redRat];
    state.turn = Side.Blue;

    state = applyMove(state, {
      from: { x: 3, y: 7 },
      to: { x: 3, y: 8 },
      piece: blueLion,
    });

    expect(state.status).toBe(GameStatus.BlueWon);
    expect(state.endReason).toBe(EndReason.DenOccupied);
  });

  it('declares victory when all enemy pieces are eliminated', () => {
    let state = createInitialState();
    const blueTiger = makePiece(PieceType.Tiger, Side.Blue, 2, 2);
    const lastRedCat = makePiece(PieceType.Cat, Side.Red, 2, 3);
    state.pieces = [blueTiger, lastRedCat];
    state.turn = Side.Blue;

    state = applyMove(state, {
      from: { x: 2, y: 2 },
      to: { x: 2, y: 3 },
      piece: blueTiger,
      captured: lastRedCat,
    });

    expect(state.status).toBe(GameStatus.BlueWon);
    expect(state.endReason).toBe(EndReason.Elimination);
  });

  it('declares victory by stalemate (NoLegalMoves) when the opponent has no legal moves left', () => {
    let state = createInitialState();
    // 红方猫在角落 (0, 8)，被蓝方狮(1, 8)和蓝方虎(0, 6 -> 0, 7)困死且无法吃子
    const redCat = makePiece(PieceType.Cat, Side.Red, 0, 8);
    const blueLion = makePiece(PieceType.Lion, Side.Blue, 1, 8);
    const blueTiger = makePiece(PieceType.Tiger, Side.Blue, 0, 6);
    state.pieces = [redCat, blueLion, blueTiger];
    state.turn = Side.Blue;

    // 蓝方虎走 (0, 6) -> (0, 7)，封死红方猫唯一的出路
    state = applyMove(state, {
      from: { x: 0, y: 6 },
      to: { x: 0, y: 7 },
      piece: blueTiger,
    });

    expect(state.status).toBe(GameStatus.BlueWon);
    expect(state.endReason).toBe(EndReason.NoLegalMoves);
  });

  it('declares Draw on Threefold Repetition of the same board position and turn', () => {
    let state = createInitialState();
    const blueLion = makePiece(PieceType.Lion, Side.Blue, 0, 0);
    const redLion = makePiece(PieceType.Lion, Side.Red, 0, 8);
    state.pieces = [blueLion, redLion];
    state.turn = Side.Blue;
    // 重置计数以记录初始局面为第1次
    state = createInitialState([blueLion, redLion]);

    // 往返第1次 -> 回到原点 (出现第2次)
    state = applyMove(state, { from: { x: 0, y: 0 }, to: { x: 0, y: 1 }, piece: state.pieces[0] });
    state = applyMove(state, { from: { x: 0, y: 8 }, to: { x: 0, y: 7 }, piece: state.pieces[1] });
    state = applyMove(state, { from: { x: 0, y: 1 }, to: { x: 0, y: 0 }, piece: state.pieces[0] });
    state = applyMove(state, { from: { x: 0, y: 7 }, to: { x: 0, y: 8 }, piece: state.pieces[1] });
    expect(state.status).toBe(GameStatus.Playing);

    // 往返第2次 -> 回到原点 (出现第3次 -> 判和)
    state = applyMove(state, { from: { x: 0, y: 0 }, to: { x: 0, y: 1 }, piece: state.pieces[0] });
    state = applyMove(state, { from: { x: 0, y: 8 }, to: { x: 0, y: 7 }, piece: state.pieces[1] });
    state = applyMove(state, { from: { x: 0, y: 1 }, to: { x: 0, y: 0 }, piece: state.pieces[0] });
    state = applyMove(state, { from: { x: 0, y: 7 }, to: { x: 0, y: 8 }, piece: state.pieces[1] });

    expect(state.status).toBe(GameStatus.Draw);
    expect(state.endReason).toBe(EndReason.ThreefoldRepetition);
  });

  it('declares Draw on 100-Ply Rule (100 consecutive plies without capture)', () => {
    let state = createInitialState([
      makePiece(PieceType.Lion, Side.Blue, 0, 0),
      makePiece(PieceType.Lion, Side.Red, 6, 8),
    ]);
    state.pliesWithoutCapture = 99;

    state = applyMove(state, {
      from: { x: 0, y: 0 },
      to: { x: 0, y: 1 },
      piece: state.pieces[0],
    });

    expect(state.pliesWithoutCapture).toBe(100);
    expect(state.status).toBe(GameStatus.Draw);
    expect(state.endReason).toBe(EndReason.HundredPlyRule);
  });

  it('detects Den threat when an enemy piece is within Manhattan distance <= 2 of a Den', () => {
    const state = createInitialState([
      makePiece(PieceType.Leopard, Side.Red, 3, 2), // 距离蓝穴 (3,0) 为 2 步
      makePiece(PieceType.Lion, Side.Blue, 0, 0),
    ]);

    const threats = checkDenThreat(state);
    expect(threats[Side.Blue]).toBe(true);
    expect(threats[Side.Red]).toBe(false);
  });
});
