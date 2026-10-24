import { DEN_POSITIONS } from './constants';
import { isEnemyDen, manhattanDistance } from './board';
import { getLegalMoves } from './moveGenerator';
import { EndReason, GameState, GameStatus, Side } from './types';

export interface RefereeVerdict {
  status: GameStatus;
  endReason?: EndReason;
}

/**
 * 在一位玩家完成移动、且轮次已切换到下一位玩家后，判定当前对局是否已终局。
 * @param state 更新后的对局状态（state.turn 为即将走子的一方）
 * @param currentHash 更新后的局面哈希
 */
export function evaluateTerminalState(
  state: GameState,
  currentHash: string
): RefereeVerdict {
  const lastMove = state.moveHistory[state.moveHistory.length - 1];

  // 1. 占领敌穴判定
  if (lastMove && isEnemyDen(lastMove.to, lastMove.piece.side)) {
    return {
      status: lastMove.piece.side === Side.Blue ? GameStatus.BlueWon : GameStatus.RedWon,
      endReason: EndReason.DenOccupied,
    };
  }

  // 2. 全歼敌子判定
  const blueCount = state.pieces.filter((p) => p.side === Side.Blue).length;
  const redCount = state.pieces.filter((p) => p.side === Side.Red).length;
  if (redCount === 0) {
    return { status: GameStatus.BlueWon, endReason: EndReason.Elimination };
  }
  if (blueCount === 0) {
    return { status: GameStatus.RedWon, endReason: EndReason.Elimination };
  }

  // 3. 困毙判定（当前轮到走子的一方没有任何合法移动）
  const nextSideLegalMoves = getLegalMoves(state, state.turn);
  if (nextSideLegalMoves.length === 0) {
    return {
      status: state.turn === Side.Blue ? GameStatus.RedWon : GameStatus.BlueWon,
      endReason: EndReason.NoLegalMoves,
    };
  }

  // 4. 三次重复局面判和
  if ((state.positionCounts[currentHash] ?? 0) >= 3) {
    return {
      status: GameStatus.Draw,
      endReason: EndReason.ThreefoldRepetition,
    };
  }

  // 5. 连续 100 步（100 plies）无吃子判和
  if (state.pliesWithoutCapture >= 100) {
    return {
      status: GameStatus.Draw,
      endReason: EndReason.HundredPlyRule,
    };
  }

  return { status: GameStatus.Playing };
}

/**
 * 检测双方兽穴是否正遭受敌方棋子逼近威胁（敌方棋子距离己方兽穴曼哈顿距离 <= 2）
 */
export function checkDenThreat(state: GameState): Record<Side, boolean> {
  let blueThreatened = false;
  let redThreatened = false;

  for (const piece of state.pieces) {
    if (piece.side === Side.Red) {
      if (manhattanDistance(piece.position, DEN_POSITIONS[Side.Blue]) <= 2) {
        blueThreatened = true;
      }
    } else {
      if (manhattanDistance(piece.position, DEN_POSITIONS[Side.Red]) <= 2) {
        redThreatened = true;
      }
    }
  }

  return {
    [Side.Blue]: blueThreatened,
    [Side.Red]: redThreatened,
  };
}
