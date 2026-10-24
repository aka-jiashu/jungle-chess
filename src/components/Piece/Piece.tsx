import React from 'react';
import { PIECE_NAMES_ZH } from '../../core/constants';
import { getEffectiveRank } from '../../core/rules';
import { isRiver } from '../../core/board';
import { Piece as PieceModel, Side } from '../../core/types';
import { AnimalIcon } from './AnimalIcon';

interface PieceProps {
  piece: PieceModel;
  isSelected: boolean;
  isCurrentTurn: boolean;
  rotationDeg: number; // 0 | 180 | 90 | -90
  onPointerDownPiece?: (e: React.PointerEvent<HTMLDivElement>, piece: PieceModel) => void;
}

export const PieceView: React.FC<PieceProps> = ({
  piece,
  isSelected,
  isCurrentTurn,
  rotationDeg,
  onPointerDownPiece,
}) => {
  const effectiveRank = getEffectiveRank(piece);
  const isTrapped = effectiveRank === 0;
  const inWater = isRiver(piece.position);
  const isBlue = piece.side === Side.Blue;

  return (
    <div
      onPointerDown={(e) => onPointerDownPiece?.(e, piece)}
      style={{ transform: `rotate(${rotationDeg}deg)` }}
      className={`
        drag-handle relative w-[90%] h-[90%] rounded-full flex flex-col items-center justify-center
        transition-transform duration-200 select-none z-10
        ${isBlue
          ? 'bg-gradient-to-b from-sky-400 via-blue-700 to-blue-950 text-blue-50 border-[2.5px] border-amber-300/90 shadow-[0_5px_0_#1e3a8a,0_8px_14px_rgba(0,0,0,0.6)]'
          : 'bg-gradient-to-b from-rose-400 via-red-700 to-red-950 text-rose-50 border-[2.5px] border-amber-300/90 shadow-[0_5px_0_#7f1d1d,0_8px_14px_rgba(0,0,0,0.6)]'
        }
        ${isSelected ? 'scale-112 -translate-y-1 ring-4 ring-amber-300 shadow-[0_8px_24px_rgba(251,191,36,0.95)] z-30' : ''}
        ${!isSelected && isCurrentTurn ? 'hover:scale-105' : ''}
      `}
    >
      {/* 勋章高光内环与肖像底盘 */}
      <div className="absolute inset-[3px] rounded-full border border-white/30 bg-radial from-white/15 to-transparent pointer-events-none" />

      {/* 左上角：1~8 战力等级角标 (三重标识之一) */}
      <span
        className={`
          absolute -top-1.5 -left-1.5 min-w-[23px] h-[23px] px-1 rounded-full text-[11px] font-black
          flex items-center justify-center shadow-md border-2 z-20
          ${isTrapped
            ? 'bg-amber-950 text-amber-300 border-amber-400 animate-pulse'
            : isBlue
              ? 'bg-blue-950 text-amber-300 border-sky-300'
              : 'bg-red-950 text-amber-300 border-rose-300'
          }
        `}
        title={isTrapped ? '深陷敌方陷阱：战力归零' : `战力等级 ${piece.rank}`}
      >
        {isTrapped ? '0' : piece.rank}
      </span>

      {/* 右上角特殊状态徽章（入水 / 受困） */}
      {isTrapped && (
        <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow border border-amber-900 z-20">
          困
        </span>
      )}
      {!isTrapped && inWater && (
        <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-cyan-300 text-slate-950 text-[10px] font-black shadow border border-cyan-900 z-20">
          泳
        </span>
      )}

      {/* 中央全彩动物角色插画 (三重标识之二) */}
      <AnimalIcon type={piece.type} className="w-8 h-8 -mt-1 drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)] relative z-10" />

      {/* 底部名牌缎带 (三重标识之三) */}
      <span
        className={`
          relative z-10 -mt-1 px-2 py-[1px] rounded-full text-[11px] font-black tracking-widest leading-tight
          border shadow-sm
          ${isBlue
            ? 'bg-blue-950/90 text-amber-200 border-blue-400/50'
            : 'bg-red-950/90 text-amber-200 border-rose-400/50'
          }
        `}
      >
        {PIECE_NAMES_ZH[piece.type]}
      </span>
    </div>
  );
};
