import React, { useEffect, useRef } from 'react';
import { Eye, Handshake, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { PIECE_NAMES_ZH } from '../../core/constants';
import { EndReason, GameState, GameStatus, Side } from '../../core/types';
import { GameMode } from '../Controls/Controls';
import { AnimalIcon } from '../Piece/AnimalIcon';

interface GameOverModalProps {
  isOpen: boolean;
  state: GameState;
  mode: GameMode;
  onRestart: () => void;
  onInspectBoard: () => void;
}

const END_REASON_DESC: Record<EndReason, string> = {
  [EndReason.DenOccupied]: '成功突入并占领了敌方兽穴！',
  [EndReason.Elimination]: '全歼了敌方全部 8 枚百兽棋子！',
  [EndReason.NoLegalMoves]: '将对手完全包围困毙，对手已无合法着法！',
  [EndReason.ThreefoldRepetition]: '同一局面连续重复出现 3 次，握手言和。',
  [EndReason.HundredPlyRule]: '双方连续 100 步未发生吃子，握手言和。',
};

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  state,
  mode,
  onRestart,
  onInspectBoard,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = dialogRef.current;
    if (!dialog || event.target !== dialog) return;

    const rect = dialog.getBoundingClientRect();
    const isDialogContent =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;

    if (!isDialogContent) {
      dialog.close();
      onInspectBoard();
    }
  };

  if (state.status === GameStatus.Playing) return null;

  const isBlueWon = state.status === GameStatus.BlueWon;
  const isRedWon = state.status === GameStatus.RedWon;
  const isDraw = state.status === GameStatus.Draw;

  const blueAlive = state.pieces.filter((p) => p.side === Side.Blue);
  const redAlive = state.pieces.filter((p) => p.side === Side.Red);
  const blueCapturedEnemies = state.capturedPieces[Side.Red];
  const redCapturedEnemies = state.capturedPieces[Side.Blue];

  let bannerGradient = 'from-amber-500/30 via-slate-900 to-slate-900 border-amber-400/70';
  let titleText = '势均力敌 · 握手言和';
  let badgeText = 'DRAW GAME';

  if (isBlueWon) {
    bannerGradient = 'from-blue-600/40 via-indigo-950 to-slate-900 border-blue-400';
    titleText = mode === 'ai' ? '恭喜获胜！蓝方击败 AI' : '蓝方阵营 · 荣耀获胜！';
    badgeText = 'BLUE VICTORY';
  } else if (isRedWon) {
    bannerGradient = 'from-rose-600/40 via-red-950 to-slate-900 border-rose-400';
    titleText = mode === 'ai' ? '遗憾落败 · 红方 AI 获胜' : '红方阵营 · 荣耀获胜！';
    badgeText = 'RED VICTORY';
  }

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="gameOverTitle"
      onClose={onInspectBoard}
      onClick={handleDialogClick}
      className={`m-auto w-[min(92vw,580px)] rounded-3xl bg-gradient-to-b ${bannerGradient} text-slate-100 border-2 p-0 shadow-[0_24px_70px_rgba(0,0,0,0.85)] overflow-hidden`}
    >
      <div className="p-6 flex flex-col items-center text-center gap-5">
        {/* 顶部奖杯/和棋徽章 */}
        <div className="relative flex items-center justify-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center border-2 shadow-xl ${
              isDraw
                ? 'bg-amber-500/20 border-amber-300 text-amber-300'
                : isBlueWon
                  ? 'bg-blue-500/25 border-blue-300 text-amber-300'
                  : 'bg-rose-500/25 border-rose-300 text-amber-300'
            }`}
          >
            {isDraw ? <Handshake className="w-10 h-10" /> : <Trophy className="w-10 h-10" />}
          </div>
          <Sparkles className="w-6 h-6 text-amber-300 absolute -top-1 -right-2 animate-pulse" />
        </div>

        {/* 胜负大标题与原因 */}
        <div className="space-y-1.5">
          <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-black tracking-widest bg-white/10 text-amber-300">
            {badgeText}
          </span>
          <h2 id="gameOverTitle" className="text-2xl sm:text-3xl font-black tracking-wide text-white drop-shadow">
            {titleText}
          </h2>
          {state.endReason && (
            <p className="text-sm font-bold text-amber-200/90">
              {END_REASON_DESC[state.endReason]}
            </p>
          )}
        </div>

        {/* 对局统计数据卡片 */}
        <div className="w-full grid grid-cols-3 gap-2.5 bg-slate-950/60 p-3.5 rounded-2xl border border-white/10">
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-400">总交锋步数</span>
            <span className="text-xl font-black text-amber-300 mt-0.5">
              {state.moveHistory.length} 步
            </span>
          </div>
          <div className="flex flex-col items-center border-x border-white/10 px-2">
            <span className="text-xs text-blue-300">蓝方存活 / 斩获</span>
            <span className="text-xl font-black text-blue-200 mt-0.5">
              {blueAlive.length} 存 / {blueCapturedEnemies.length} 胜
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-rose-300">红方存活 / 斩获</span>
            <span className="text-xl font-black text-rose-200 mt-0.5">
              {redAlive.length} 存 / {redCapturedEnemies.length} 胜
            </span>
          </div>
        </div>

        {/* 双方存活棋子一览 */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/30">
            <div className="text-xs font-extrabold text-blue-300 mb-2">
              蓝方幸存阵容 ({blueAlive.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {blueAlive.length === 0 ? (
                <span className="text-xs text-slate-500">全军覆没</span>
              ) : (
                blueAlive.map((p) => (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-900/70 border border-blue-400/40 text-xs font-bold text-blue-100"
                  >
                    <AnimalIcon type={p.type} className="w-4 h-4" />
                    {PIECE_NAMES_ZH[p.type]}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30">
            <div className="text-xs font-extrabold text-rose-300 mb-2">
              红方幸存阵容 ({redAlive.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {redAlive.length === 0 ? (
                <span className="text-xs text-slate-500">全军覆没</span>
              ) : (
                redAlive.map((p) => (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-900/70 border border-rose-400/40 text-xs font-bold text-rose-100"
                  >
                    <AnimalIcon type={p.type} className="w-4 h-4" />
                    {PIECE_NAMES_ZH[p.type]}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="w-full grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              dialogRef.current?.close();
              onInspectBoard();
            }}
            className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-sm flex items-center justify-center gap-2 border border-slate-600 transition"
          >
            <Eye className="w-4 h-4" /> 查看终局棋盘
          </button>

          <button
            type="button"
            onClick={() => {
              dialogRef.current?.close();
              onRestart();
            }}
            className="min-h-[48px] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.5)] transition"
          >
            <RotateCcw className="w-4 h-4" /> 再来一局
          </button>
        </div>
      </div>
    </dialog>
  );
};
