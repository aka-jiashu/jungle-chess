import React from 'react';
import { DEN_POSITIONS, TRAP_POSITIONS } from '../../core/constants';
import { getTerrainAt, posEquals } from '../../core/board';
import { Move, Piece, Position, Side, TerrainType } from '../../core/types';
import { PieceView } from '../Piece/Piece';

interface CellProps {
  pos: Position;
  occupant?: Piece;
  isSelected: boolean;
  legalMoveToHere?: Move;
  isLastMoveFrom: boolean;
  isLastMoveTo: boolean;
  isDenThreatened: boolean;
  isCurrentTurnPiece: boolean;
  pieceRotationDeg: number;
  labelRotationDeg: number;
  onCellTap: (pos: Position) => void;
  onPointerDownPiece: (e: React.PointerEvent<HTMLDivElement>, piece: Piece) => void;
}

/**
 * 森林探险卡通风棋盘格组件：
 * - 兽穴 (Den) 与陷阱 (Trap) 采用高清原画贴图 + 精致徽标
 * - 小河 (River) 包含动态波光、荷叶、水花与锦鲤游鱼装饰
 * - 陆地 (Land) 根据坐标哈希随机点缀青草簇、野花或石板路（中央桥道）
 */
export const Cell: React.FC<CellProps> = ({
  pos,
  occupant,
  isSelected,
  legalMoveToHere,
  isLastMoveFrom,
  isLastMoveTo,
  isDenThreatened,
  isCurrentTurnPiece,
  pieceRotationDeg,
  labelRotationDeg,
  onCellTap,
  onPointerDownPiece,
}) => {
  const terrain = getTerrainAt(pos);
  const isBlueDen = posEquals(pos, DEN_POSITIONS[Side.Blue]);
  const isRedDen = posEquals(pos, DEN_POSITIONS[Side.Red]);
  const isBlueTrap = TRAP_POSITIONS[Side.Blue].some((p) => posEquals(p, pos));
  const isRedTrap = TRAP_POSITIONS[Side.Red].some((p) => posEquals(p, pos));

  // 判断是否为两河之间的陆地石桥走道 (y ∈ [3, 5], x ∈ {0, 3, 6})
  const isBridgeLand =
    terrain === TerrainType.Land && pos.y >= 3 && pos.y <= 5;
  // 棋盘浅深交替草坪色
  const isLightGrass = (pos.x + pos.y) % 2 === 0;
  // 伪随机装饰种子
  const decorVariant = (pos.x * 7 + pos.y * 13) % 5;

  let terrainClass = isLightGrass
    ? 'bg-gradient-to-br from-emerald-700/90 to-green-800/90 border-emerald-500/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.12)]'
    : 'bg-gradient-to-br from-emerald-800/95 to-green-900/95 border-emerald-600/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]';

  if (isBridgeLand) {
    terrainClass =
      'bg-gradient-to-br from-amber-800/80 via-stone-700/85 to-emerald-900/90 border-amber-500/45 shadow-inner';
  } else if (terrain === TerrainType.River) {
    terrainClass = 'river-tile border-cyan-300/50 shadow-[inset_0_3px_10px_rgba(3,105,161,0.8)]';
  } else if (isBlueDen) {
    terrainClass = 'border-2 border-blue-400 shadow-[0_0_16px_rgba(59,130,246,0.5)]';
  } else if (isRedDen) {
    terrainClass = 'border-2 border-rose-400 shadow-[0_0_16px_rgba(244,63,94,0.5)]';
  } else if (isBlueTrap || isRedTrap) {
    terrainClass = 'border-2 border-amber-500/80 shadow-inner';
  }

  return (
    <div
      data-cell-x={pos.x}
      data-cell-y={pos.y}
      onClick={() => onCellTap(pos)}
      className={`
        relative w-full h-full min-w-[44px] min-h-[44px] border rounded-xl overflow-hidden
        flex items-center justify-center transition-all duration-150
        ${terrainClass}
        ${isLastMoveFrom ? 'ring-3 ring-amber-300/80' : ''}
        ${isLastMoveTo ? 'ring-3 ring-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.6)]' : ''}
        ${isDenThreatened ? 'ring-4 ring-red-500 animate-pulse' : ''}
        ${legalMoveToHere ? 'cursor-pointer' : ''}
      `}
    >
      {/* 1. 兽穴高清原画背景 */}
      {terrain === TerrainType.Den && (
        <>
          <img
            src={`${import.meta.env.BASE_URL}assets/${isBlueDen ? 'den-blue.jpg' : 'den-red.jpg'}`}
            alt={isBlueDen ? '蓝方兽穴' : '红方兽穴'}
            style={{ transform: `rotate(${labelRotationDeg}deg)` }}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />
          {!occupant && (
            <div
              style={{ transform: `rotate(${labelRotationDeg}deg)` }}
              className="relative z-10 flex flex-col items-center justify-end h-full pb-1 pointer-events-none select-none"
            >
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-black tracking-wider shadow border ${
                  isBlueDen
                    ? 'bg-blue-950/90 text-sky-200 border-blue-400/70'
                    : 'bg-red-950/90 text-rose-200 border-rose-400/70'
                }`}
              >
                {isBlueDen ? '蓝方兽穴' : '红方兽穴'}
              </span>
            </div>
          )}
        </>
      )}

      {/* 2. 陷阱高清原画背景 */}
      {terrain === TerrainType.Trap && (
        <>
          <img
            src={`${import.meta.env.BASE_URL}assets/trap-tile.jpg`}
            alt="森林陷阱"
            style={{ transform: `rotate(${labelRotationDeg}deg)` }}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none brightness-90"
          />
          <div
            className={`absolute inset-0 pointer-events-none ${
              isBlueTrap ? 'bg-blue-950/25' : 'bg-rose-950/25'
            }`}
          />
          {!occupant && (
            <div
              style={{ transform: `rotate(${labelRotationDeg}deg)` }}
              className="relative z-10 flex flex-col items-center justify-end h-full pb-1 pointer-events-none select-none"
            >
              <span className="px-1.5 py-0.5 rounded-md bg-amber-950/90 border border-amber-400/70 text-amber-200 text-[10px] font-black tracking-widest shadow">
                陷阱
              </span>
            </div>
          )}
        </>
      )}

      {/* 3. 小河丰富生态插画（荷叶、莲花、游鱼、水波纹） */}
      {terrain === TerrainType.River && (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-85"
          aria-hidden="true"
        >
          {/* 水波纹 */}
          <path
            d="M10 20Q18 16 26 20T42 20M22 46Q30 42 38 46T54 46"
            stroke="#bae6fd"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.45"
          />
          {/* 荷叶与小红鱼交错分布 */}
          {decorVariant === 0 && (
            <g>
              <circle cx="46" cy="18" r="10" fill="#22c55e" fillOpacity="0.8" />
              <path d="M46 18L56 14" stroke="#0284c7" strokeWidth="2.5" />
              <circle cx="44" cy="16" r="3" fill="#fda4af" />
            </g>
          )}
          {decorVariant === 2 && (
            <g>
              {/* 小锦鲤 */}
              <ellipse cx="26" cy="34" rx="7" ry="3.5" transform="rotate(-25 26 34)" fill="#fb923c" fillOpacity="0.85" />
              <polygon points="32,37 38,35 35,42" fill="#f97316" fillOpacity="0.85" />
            </g>
          )}
          {decorVariant === 3 && (
            <g>
              <circle cx="20" cy="44" r="9" fill="#16a34a" fillOpacity="0.75" />
              <path d="M20 44L11 42" stroke="#0369a1" strokeWidth="2.5" />
            </g>
          )}
        </svg>
      )}

      {/* 4. 森林草坪与石桥通道生态微装饰 */}
      {terrain === TerrainType.Land && (
        <svg
          viewBox="0 0 64 64"
          fill="none"
          className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-45"
          aria-hidden="true"
        >
          {isBridgeLand ? (
            <>
              {/* 河间陆地木石栈道纹理 */}
              <rect x="8" y="10" width="48" height="10" rx="3" fill="#a8a29e" fillOpacity="0.35" />
              <rect x="8" y="27" width="48" height="10" rx="3" fill="#a8a29e" fillOpacity="0.35" />
              <rect x="8" y="44" width="48" height="10" rx="3" fill="#a8a29e" fillOpacity="0.35" />
            </>
          ) : (
            <>
              {decorVariant === 1 && (
                <path
                  d="M14 50L11 41M14 50L16 40M14 50L20 44"
                  stroke="#86efac"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              )}
              {decorVariant === 2 && (
                <g>
                  <circle cx="48" cy="48" r="3.5" fill="#fde047" />
                  <circle cx="48" cy="48" r="1.5" fill="#f97316" />
                </g>
              )}
              {decorVariant === 4 && (
                <path
                  d="M46 18L43 11M46 18L48 10M46 18L52 13"
                  stroke="#4ade80"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </>
          )}
        </svg>
      )}

      {/* 上一步走子轨迹光晕 */}
      {(isLastMoveFrom || isLastMoveTo) && (
        <div className="absolute inset-0 bg-amber-400/20 pointer-events-none" />
      )}

      {/* 上一步起点脚印标记 */}
      {isLastMoveFrom && !occupant && (
        <span className="relative z-10 w-3 h-3 rounded-full bg-amber-300 shadow-[0_0_8px_#fbbf24] pointer-events-none" />
      )}

      {/* 棋子渲染 */}
      {occupant && (
        <PieceView
          piece={occupant}
          isSelected={isSelected}
          isCurrentTurn={isCurrentTurnPiece}
          rotationDeg={pieceRotationDeg}
          onPointerDownPiece={onPointerDownPiece}
        />
      )}

      {/* 合法移动目标格引导光环 */}
      {legalMoveToHere && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          {legalMoveToHere.captured ? (
            <div className="w-[90%] h-[90%] rounded-full border-4 border-rose-400 shadow-[0_0_16px_rgba(244,63,94,0.9)] animate-pulse" />
          ) : (
            <div
              className={`
                w-5 h-5 rounded-full shadow-[0_0_14px_rgba(251,191,36,1)]
                ${legalMoveToHere.isRiverJump ? 'bg-cyan-300 ring-4 ring-cyan-400/50' : 'bg-amber-300 ring-4 ring-amber-400/45'}
              `}
            />
          )}
        </div>
      )}
    </div>
  );
};
