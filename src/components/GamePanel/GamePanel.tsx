import React from 'react';
import { AlertTriangle, Crown, ShieldAlert } from 'lucide-react';
import { PIECE_NAMES_ZH } from '../../core/constants';
import { EndReason, GameState, GameStatus, Side } from '../../core/types';
import { AnimalIcon } from '../Piece/AnimalIcon';

interface GamePanelProps {
  side: Side;
  state: GameState;
  isAI: boolean;
  isAIThinking: boolean;
  denThreatened: boolean;
  rotationDeg: number;
}

const END_REASON_TEXT: Record<EndReason, string> = {
  [EndReason.DenOccupied]: '占领敌方兽穴',
  [EndReason.Elimination]: '全歼敌方棋子',
  [EndReason.NoLegalMoves]: '对手无子可走（困毙）',
  [EndReason.ThreefoldRepetition]: '三次重复局面判和',
  [EndReason.HundredPlyRule]: '连续100步无吃子判和',
};

export const GamePanel: React.FC<GamePanelProps> = ({
  side,
  state,
  isAI,
  isAIThinking,
  denThreatened,
  rotationDeg,
}) => {
  const isBlue = side === Side.Blue;
  const isMyTurn = state.turn === side && state.status === GameStatus.Playing;
  const isWinner =
    (side === Side.Blue && state.status === GameStatus.BlueWon) ||
    (side === Side.Red && state.status === GameStatus.RedWon);

  // 该阵营吃掉的对方棋子（即对方损失的棋子）
  const enemySide = isBlue ? Side.Red : Side.Blue;
  const capturedEnemyPieces = state.capturedPieces[enemySide];
  const aliveCount = state.pieces.filter((p) => p.side === side).length;

  return (
    <div
      style={{ transform: `rotate(${rotationDeg}deg)` }}
      className={`
        w-full rounded-2xl p-4 border-2 transition-all duration-300 flex flex-col gap-3
        ${isBlue
          ? 'bg-slate-900/90 border-blue-500/50 shadow-[0_0_25px_rgba(37,99,235,0.2)]'
          : 'bg-slate-900/90 border-rose-500/50 shadow-[0_0_25px_rgba(225,29,72,0.2)]'
        }
        ${isMyTurn ? (isBlue ? 'ring-2 ring-blue-400' : 'ring-2 ring-rose-400') : 'opacity-85'}
      `}
    >
      {/* 顶部阵营标题与回合指示 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-3.5 h-3.5 rounded-full ${
              isBlue ? 'bg-blue-400 shadow-[0_0_10px_#60a5fa]' : 'bg-rose-400 shadow-[0_0_10px_#fb7185]'
            }`}
          />
          <h2 className="text-lg font-black tracking-wide">
            {isBlue ? '蓝方阵营' : isAI ? '红方 AI' : '红方阵营'}
          </h2>
        </div>

        {isWinner && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
            <Crown className="w-3.5 h-3.5" /> 获胜
          </span>
        )}

        {!isWinner && state.status === GameStatus.Playing && (
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold ${
              isMyTurn
                ? isBlue
                  ? 'bg-blue-600 text-white animate-pulse'
                  : 'bg-rose-600 text-white animate-pulse'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isMyTurn ? (isAIThinking ? 'AI 思考中…' : '当前回合 · 请走子') : '等待对手'}
          </span>
        )}
      </div>

      {/* 兽穴逼近告警横幅 */}
      {denThreatened && state.status === GameStatus.Playing && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-950/90 border border-red-400 text-red-200 text-xs font-bold animate-bounce">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span>警报：敌方棋子正逼近己方兽穴！</span>
        </div>
      )}

      {/* 存活战力与无吃子计数 */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-800/80 rounded-xl px-3 py-2 flex items-center justify-between">
          <span className="text-slate-400">存活棋子</span>
          <span className="font-black text-sm">{aliveCount} / 8</span>
        </div>
        <div className="bg-slate-800/80 rounded-xl px-3 py-2 flex items-center justify-between">
          <span className="text-slate-400">斩获敌子</span>
          <span className="font-black text-sm text-amber-300">{capturedEnemyPieces.length}</span>
        </div>
      </div>

      {/* 战利品托盘（被己方吃掉的对方棋子） */}
      <div>
        <div className="text-[11px] font-semibold text-slate-400 mb-1.5">
          已消灭敌方棋子托盘：
        </div>
        <div className="min-h-[44px] p-1.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-wrap gap-1.5 items-center">
          {capturedEnemyPieces.length === 0 ? (
            <span className="text-xs text-slate-600 px-2">暂无斩获</span>
          ) : (
            capturedEnemyPieces.map((p, idx) => (
              <div
                key={`${p.id}-${idx}`}
                className={`
                  flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border
                  ${p.side === Side.Blue
                    ? 'bg-blue-950/80 text-blue-200 border-blue-700/50'
                    : 'bg-rose-950/80 text-rose-200 border-rose-700/50'
                  }
                `}
              >
                <AnimalIcon type={p.type} className="w-3.5 h-3.5" />
                <span>{PIECE_NAMES_ZH[p.type]}</span>
                <span className="text-[10px] opacity-75">{p.rank}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 终局或和棋提示 */}
      {state.status !== GameStatus.Playing && state.endReason && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-400/50 text-amber-200 text-xs font-bold">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>终局原因：{END_REASON_TEXT[state.endReason]}</span>
        </div>
      )}
    </div>
  );
};
