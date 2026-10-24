import {
  getPieceAt,
  getRiverJumpPath,
  isEnemyTrap,
  isInBounds,
  isOwnDen,
  isRiver,
  manhattanDistance,
} from './board';
import { GameState, Piece, PieceType, Position } from './types';

/**
 * 获取棋子当前所在格的有效战力等级。
 * 若处于对方半场陷阱中，战力临时降为 0；否则保持原等级。
 */
export function getEffectiveRank(piece: Piece): number {
  if (isEnemyTrap(piece.position, piece.side)) {
    return 0;
  }
  return piece.rank;
}

/**
 * 判断狮/虎从 from 跳河到 to 的水路中间是否被任意一方的鼠阻挡。
 */
export function isRiverJumpBlocked(
  state: GameState,
  from: Position,
  to: Position
): boolean {
  const path = getRiverJumpPath(from, to);
  if (!path) return true;

  for (const waterPos of path) {
    const occupant = getPieceAt(state, waterPos);
    if (occupant) {
      return true;
    }
  }
  return false;
}

/**
 * 判断 attacker 是否可以吃掉处于目标格的 defender。
 * （假定移动几何路径已合法）
 */
export function canCapture(
  _state: GameState,
  attacker: Piece,
  defender: Piece
): boolean {
  if (attacker.side === defender.side) {
    return false;
  }

  const attackerInRiver = isRiver(attacker.position);
  const defenderInRiver = isRiver(defender.position);

  // 水陆隔离规则：水中的棋子不能吃陆地棋子，陆地棋子也不能吃水中棋子
  if (attackerInRiver !== defenderInRiver) {
    return false;
  }

  // 若防守方在攻击方半场的陷阱内（即对防守方而言是敌方陷阱），有效等级为 0，任意棋子可吃
  const defenderEffectiveRank = getEffectiveRank(defender);
  if (defenderEffectiveRank === 0) {
    return true;
  }

  // 鼠克象 & 象不能吃鼠（仅在防守方不在陷阱中时生效）
  if (attacker.type === PieceType.Rat && defender.type === PieceType.Elephant) {
    return true;
  }
  if (attacker.type === PieceType.Elephant && defender.type === PieceType.Rat) {
    return false;
  }

  return attacker.rank >= defenderEffectiveRank;
}

/**
 * 判断棋子 piece 能否合法移动到目标坐标 to（包含常规移动、入水、跳河、吃子）。
 */
export function canMove(
  state: GameState,
  piece: Piece,
  to: Position
): boolean {
  if (!isInBounds(to)) return false;

  const from = piece.position;
  if (from.x === to.x && from.y === to.y) return false;

  // 绝对禁止进入己方兽穴
  if (isOwnDen(to, piece.side)) return false;

  const dist = manhattanDistance(from, to);
  const targetIsRiver = isRiver(to);

  if (dist === 1) {
    // 只有鼠能进入小河
    if (targetIsRiver && piece.type !== PieceType.Rat) {
      return false;
    }
  } else {
    // 距离 > 1 时，仅允许狮、虎直线跳河
    if (piece.type !== PieceType.Lion && piece.type !== PieceType.Tiger) {
      return false;
    }
    const jumpPath = getRiverJumpPath(from, to);
    if (!jumpPath) {
      return false;
    }
    if (isRiverJumpBlocked(state, from, to)) {
      return false;
    }
  }

  const defender = getPieceAt(state, to);
  if (defender) {
    return canCapture(state, piece, defender);
  }

  return true;
}
