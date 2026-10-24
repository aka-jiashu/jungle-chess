import React, { useRef, useState } from 'react';
import { BOARD_HEIGHT, BOARD_WIDTH, DEN_POSITIONS } from '../../core/constants';
import { getPieceAt, posEquals } from '../../core/board';
import { GameState, Move, Piece, Position, Side } from '../../core/types';
import { Cell } from '../Cell/Cell';
import { PieceView } from '../Piece/Piece';

export type BoardOrientation = 'standard' | 'faceToFace180' | 'horizontal90';

interface BoardProps {
  state: GameState;
  selectedPiece: Piece | null;
  legalMovesForSelected: Move[];
  denThreats: Record<Side, boolean>;
  orientation: BoardOrientation;
  isInteractive: boolean;
  onSelectPiece: (piece: Piece) => void;
  onExecuteMove: (move: Move) => void;
  onClearSelection: () => void;
}

interface DragState {
  piece: Piece;
  clientX: number;
  clientY: number;
  startedMoving: boolean;
}

export const Board: React.FC<BoardProps> = ({
  state,
  selectedPiece,
  legalMovesForSelected,
  denThreats,
  orientation,
  isInteractive,
  onSelectPiece,
  onExecuteMove,
  onClearSelection,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const pointerDownPosRef = useRef<{ x: number; y: number } | null>(null);

  const lastMove = state.moveHistory[state.moveHistory.length - 1];
  const isHorizontal = orientation === 'horizontal90';

  // 计算某阵营棋子的旋转角度
  const getPieceRotation = (side: Side): number => {
    if (orientation === 'faceToFace180') {
      return side === Side.Red ? 180 : 0;
    }
    if (orientation === 'horizontal90') {
      // 左蓝（朝右 90°）右红（朝左 -90°）
      return side === Side.Blue ? 90 : -90;
    }
    return 0;
  };

  const getLabelRotation = (pos: Position): number => {
    if (orientation === 'faceToFace180' && pos.y >= 6) {
      return 180;
    }
    if (orientation === 'horizontal90') {
      return pos.y <= 2 ? 90 : -90;
    }
    return 0;
  };

  const handleCellTap = (pos: Position) => {
    if (!isInteractive) return;

    // 如果点击的是合法落子目标格，直接走子
    const move = legalMovesForSelected.find((m) => posEquals(m.to, pos));
    if (move) {
      onExecuteMove(move);
      return;
    }

    const clickedPiece = getPieceAt(state, pos);
    if (clickedPiece && clickedPiece.side === state.turn) {
      onSelectPiece(clickedPiece);
    } else {
      onClearSelection();
    }
  };

  const handlePointerDownPiece = (
    e: React.PointerEvent<HTMLDivElement>,
    piece: Piece
  ) => {
    if (!isInteractive || e.button !== 0) return;

    // 如果当前已选中己方棋子，且点到的是可吃的对方棋子，交由 Cell 的 onClick 完成吃子
    if (piece.side !== state.turn) {
      return;
    }

    e.stopPropagation();
    onSelectPiece(piece);

    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
    setDragState({
      piece,
      clientX: e.clientX,
      clientY: e.clientY,
      startedMoving: false,
    });

    if (boardRef.current) {
      try {
        boardRef.current.setPointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture is unavailable in synthetic tests
      }
    }
  };

  const handleBoardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState || !pointerDownPosRef.current) return;

    const dx = e.clientX - pointerDownPosRef.current.x;
    const dy = e.clientY - pointerDownPosRef.current.y;
    const dist = Math.hypot(dx, dy);

    setDragState((prev) =>
      prev
        ? {
            ...prev,
            clientX: e.clientX,
            clientY: e.clientY,
            startedMoving: prev.startedMoving || dist > 6,
          }
        : null
    );
  };

  const finishDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState) return;

    if (boardRef.current && boardRef.current.hasPointerCapture?.(e.pointerId)) {
      try {
        boardRef.current.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }

    if (dragState.startedMoving && typeof document !== 'undefined') {
      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      const cellEl = elements.find((el) => el.hasAttribute('data-cell-x'));
      if (cellEl) {
        const targetX = Number(cellEl.getAttribute('data-cell-x'));
        const targetY = Number(cellEl.getAttribute('data-cell-y'));
        const matchedMove = legalMovesForSelected.find(
          (m) => m.to.x === targetX && m.to.y === targetY
        );
        if (matchedMove) {
          onExecuteMove(matchedMove);
        }
      }
    }

    setDragState(null);
    pointerDownPosRef.current = null;
  };

  // 生成视觉网格顺序：
  // 标准纵向模式 (7 列 × 9 行)：y 从 8 到 0（顶红底蓝），x 从 0 到 6
  // 90° 横向旋转模式 (9 列 × 7 行)：左蓝(y=0)右红(y=8)，视觉行 r 从 0..6 对应 x=0..6，视觉列 c 从 0..8 对应 y=0..8
  const cells: Position[] = [];
  if (!isHorizontal) {
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        cells.push({ x, y });
      }
    }
  } else {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        cells.push({ x, y });
      }
    }
  }

  return (
    <div
      ref={boardRef}
      onPointerMove={handleBoardPointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={() => {
        setDragState(null);
        pointerDownPosRef.current = null;
      }}
      className={`
        relative p-3 rounded-3xl bg-gradient-to-b from-amber-900 via-amber-950 to-stone-900
        border-[5px] border-amber-500/80 shadow-[0_16px_50px_rgba(0,0,0,0.85),inset_0_2px_8px_rgba(251,191,36,0.35)]
        grid gap-1.5 select-none
        ${!isHorizontal
          ? 'grid-cols-7 grid-rows-9 aspect-[7/9] h-[min(92dvh,760px)] max-w-full'
          : 'grid-cols-9 grid-rows-7 aspect-[9/7] w-[min(64vw,760px)] max-h-[86dvh]'
        }
      `}
    >
      {cells.map((pos) => {
        const occupant = getPieceAt(state, pos);
        const isSelected = Boolean(
          selectedPiece && posEquals(selectedPiece.position, pos)
        );
        const legalMoveToHere = legalMovesForSelected.find((m) =>
          posEquals(m.to, pos)
        );
        const isLastMoveFrom = Boolean(lastMove && posEquals(lastMove.from, pos));
        const isLastMoveTo = Boolean(lastMove && posEquals(lastMove.to, pos));
        const isDenThreatened =
          (posEquals(pos, DEN_POSITIONS[Side.Blue]) && denThreats[Side.Blue]) ||
          (posEquals(pos, DEN_POSITIONS[Side.Red]) && denThreats[Side.Red]);

        return (
          <Cell
            key={`${pos.x}-${pos.y}`}
            pos={pos}
            occupant={occupant}
            isSelected={isSelected}
            legalMoveToHere={legalMoveToHere}
            isLastMoveFrom={isLastMoveFrom}
            isLastMoveTo={isLastMoveTo}
            isDenThreatened={isDenThreatened}
            isCurrentTurnPiece={Boolean(occupant && occupant.side === state.turn)}
            pieceRotationDeg={occupant ? getPieceRotation(occupant.side) : 0}
            labelRotationDeg={getLabelRotation(pos)}
            onCellTap={handleCellTap}
            onPointerDownPiece={handlePointerDownPiece}
          />
        );
      })}

      {/* 拖拽中的浮动棋子预览层 */}
      {dragState && dragState.startedMoving && (
        <div
          style={{
            position: 'fixed',
            left: dragState.clientX - 38,
            top: dragState.clientY - 38,
            width: 76,
            height: 76,
            pointerEvents: 'none',
            zIndex: 100,
          }}
          className="flex items-center justify-center opacity-90 scale-110"
        >
          <PieceView
            piece={dragState.piece}
            isSelected={true}
            isCurrentTurn={true}
            rotationDeg={getPieceRotation(dragState.piece.side)}
          />
        </div>
      )}
    </div>
  );
};
