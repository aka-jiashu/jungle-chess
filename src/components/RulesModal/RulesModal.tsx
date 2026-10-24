import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { PIECE_NAMES_ZH, PIECE_RANKS } from '../../core/constants';
import { PieceType } from '../../core/types';
import { AnimalIcon } from '../Piece/AnimalIcon';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ORDERED_TYPES: PieceType[] = [
  PieceType.Elephant,
  PieceType.Lion,
  PieceType.Tiger,
  PieceType.Leopard,
  PieceType.Wolf,
  PieceType.Dog,
  PieceType.Cat,
  PieceType.Rat,
];

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
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

  // Safari fallback for closedby="any" light-dismiss
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
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="rulesDialogTitle"
      onClose={onClose}
      onClick={handleDialogClick}
      className="m-auto w-[min(92vw,680px)] max-h-[86dvh] rounded-3xl bg-slate-900 text-slate-100 border-2 border-amber-500/60 p-0 shadow-2xl overflow-hidden"
    >
      <div className="p-6 overflow-y-auto max-h-[86dvh] flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 id="rulesDialogTitle" className="text-xl font-black text-amber-300">
            斗兽棋 · 战力克制与特殊规则速查卡
          </h2>
          <button
            type="button"
            onClick={() => {
              dialogRef.current?.close();
              onClose();
            }}
            className="min-w-[44px] min-h-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center"
            aria-label="关闭规则弹窗"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1~8 级战力食物链 */}
        <div>
          <h3 className="text-sm font-extrabold text-sky-300 mb-2.5">
            一、8 级战力食物链（大吃小、同级互吃、唯独陆地鼠克象）
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {ORDERED_TYPES.map((type) => (
              <div
                key={type}
                className="flex flex-col items-center p-2 rounded-xl bg-slate-800/90 border border-slate-700"
              >
                <span className="text-[11px] font-black px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 mb-1">
                  Lv.{PIECE_RANKS[type]}
                </span>
                <AnimalIcon type={type} className="w-7 h-7 text-amber-200" />
                <span className="text-sm font-black mt-1">{PIECE_NAMES_ZH[type]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 核心特殊规则 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80">
            <div className="font-black text-amber-300 text-sm mb-1">1. 鼠克象 & 水陆隔离</div>
            <p className="text-slate-300">
              • 陆地上的<strong>鼠(1)</strong>可以吃<strong>象(8)</strong>，象在常态下绝不能吃鼠。<br />
              • 只有<strong>鼠</strong>可以下水（小河）。<br />
              • <strong>水中的鼠不能吃陆地上的象</strong>（或任何陆地棋子）；陆地上的棋子也不能吃水中的鼠。两鼠同在水中可互吃。
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80">
            <div className="font-black text-cyan-300 text-sm mb-1">2. 狮、虎跳河与水鼠阻挡</div>
            <p className="text-slate-300">
              • <strong>狮(7)</strong>和<strong>虎(6)</strong>在河岸边可直线跳过小河落到对岸第一格陆地，并可连跳带吃。<br />
              • 若跳跃直线经过的水格内有<strong>任意一方的鼠（无论敌鼠或己鼠）</strong>，均不得跳过。
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80">
            <div className="font-black text-rose-300 text-sm mb-1">3. 陷阱战力归零机制</div>
            <p className="text-slate-300">
              • 棋子进入<strong>对方半场的陷阱</strong>时，有效战力临时降为 <strong>0</strong>（显示“困”标记），对方任意棋子均可吃掉它。<br />
              • 只要走出敌方陷阱，战力立即完全恢复；在己方陷阱内不受任何影响。
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/80">
            <div className="font-black text-emerald-300 text-sm mb-1">4. 兽穴禁入与胜负和棋</div>
            <p className="text-slate-300">
              • 任何棋子<strong>绝对禁止进入己方兽穴</strong>。<br />
              • <strong>获胜条件</strong>：占领敌方兽穴、全歼敌子、或令对手困毙无子可走。<br />
              • <strong>和棋条件</strong>：同一局面重复出现 3 次，或连续 100 步无吃子。
            </p>
          </div>
        </div>
      </div>
    </dialog>
  );
};
