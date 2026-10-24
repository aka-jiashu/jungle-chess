import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  DEN_POSITIONS,
  RIVER_POSITIONS,
  TRAP_POSITIONS,
} from './constants';
import { GameState, Piece, Position, Side, TerrainType } from './types';

export function posEquals(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

export function isInBounds(pos: Position): boolean {
  return pos.x >= 0 && pos.x < BOARD_WIDTH && pos.y >= 0 && pos.y < BOARD_HEIGHT;
}

export function manhattanDistance(a: Position, b: Position): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function isRiver(pos: Position): boolean {
  return RIVER_POSITIONS.some((p) => posEquals(p, pos));
}

export function isOwnDen(pos: Position, side: Side): boolean {
  return posEquals(DEN_POSITIONS[side], pos);
}

export function isEnemyDen(pos: Position, side: Side): boolean {
  const enemy = side === Side.Blue ? Side.Red : Side.Blue;
  return posEquals(DEN_POSITIONS[enemy], pos);
}

export function isOwnTrap(pos: Position, side: Side): boolean {
  return TRAP_POSITIONS[side].some((p) => posEquals(p, pos));
}

export function isEnemyTrap(pos: Position, side: Side): boolean {
  const enemy = side === Side.Blue ? Side.Red : Side.Blue;
  return TRAP_POSITIONS[enemy].some((p) => posEquals(p, pos));
}

export function getTerrainAt(pos: Position): TerrainType {
  if (posEquals(DEN_POSITIONS[Side.Blue], pos) || posEquals(DEN_POSITIONS[Side.Red], pos)) {
    return TerrainType.Den;
  }
  if (
    TRAP_POSITIONS[Side.Blue].some((p) => posEquals(p, pos)) ||
    TRAP_POSITIONS[Side.Red].some((p) => posEquals(p, pos))
  ) {
    return TerrainType.Trap;
  }
  if (isRiver(pos)) {
    return TerrainType.River;
  }
  return TerrainType.Land;
}

export function getPieceAt(state: GameState, pos: Position): Piece | undefined {
  return state.pieces.find((p) => posEquals(p.position, pos));
}

/**
 * 若 from -> to 是一次合法的狮/虎直线跨河跳跃，返回中间经过的所有水域格坐标；
 * 否则返回 null。
 */
export function getRiverJumpPath(from: Position, to: Position): Position[] | null {
  if (!isInBounds(from) || !isInBounds(to)) return null;
  if (isRiver(from) || isRiver(to)) return null;

  // 必须同行或同列
  if (from.x !== to.x && from.y !== to.y) return null;

  const path: Position[] = [];
  if (from.x === to.x) {
    const step = to.y > from.y ? 1 : -1;
    for (let y = from.y + step; y !== to.y; y += step) {
      const mid = { x: from.x, y };
      if (!isRiver(mid)) return null;
      path.push(mid);
    }
  } else {
    const step = to.x > from.x ? 1 : -1;
    for (let x = from.x + step; x !== to.x; x += step) {
      const mid = { x, y: from.y };
      if (!isRiver(mid)) return null;
      path.push(mid);
    }
  }

  return path.length > 0 ? path : null;
}
