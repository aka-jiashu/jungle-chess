import { Piece, PieceType, Position, Rank, Side } from './types';

export const BOARD_WIDTH = 7;
export const BOARD_HEIGHT = 9;

export const PIECE_RANKS: Record<PieceType, Rank> = {
  [PieceType.Rat]: 1,
  [PieceType.Cat]: 2,
  [PieceType.Dog]: 3,
  [PieceType.Wolf]: 4,
  [PieceType.Leopard]: 5,
  [PieceType.Tiger]: 6,
  [PieceType.Lion]: 7,
  [PieceType.Elephant]: 8,
};

export const PIECE_NAMES_ZH: Record<PieceType, string> = {
  [PieceType.Rat]: '鼠',
  [PieceType.Cat]: '猫',
  [PieceType.Dog]: '狗',
  [PieceType.Wolf]: '狼',
  [PieceType.Leopard]: '豹',
  [PieceType.Tiger]: '虎',
  [PieceType.Lion]: '狮',
  [PieceType.Elephant]: '象',
};

// 小河 12 格：左水域 x∈[1,2], y∈[3,5]；右水域 x∈[4,5], y∈[3,5]
export const RIVER_POSITIONS: Position[] = [
  { x: 1, y: 3 }, { x: 2, y: 3 },
  { x: 1, y: 4 }, { x: 2, y: 4 },
  { x: 1, y: 5 }, { x: 2, y: 5 },
  { x: 4, y: 3 }, { x: 5, y: 3 },
  { x: 4, y: 4 }, { x: 5, y: 4 },
  { x: 4, y: 5 }, { x: 5, y: 5 },
];

// 陷阱坐标
export const TRAP_POSITIONS: Record<Side, Position[]> = {
  [Side.Blue]: [
    { x: 2, y: 0 }, // C1
    { x: 4, y: 0 }, // E1
    { x: 3, y: 1 }, // D2
  ],
  [Side.Red]: [
    { x: 2, y: 8 }, // C9
    { x: 4, y: 8 }, // E9
    { x: 3, y: 7 }, // D8
  ],
};

// 兽穴坐标
export const DEN_POSITIONS: Record<Side, Position> = {
  [Side.Blue]: { x: 3, y: 0 }, // D1
  [Side.Red]: { x: 3, y: 8 },  // D9
};

// 初始棋子布局
export const INITIAL_PIECES: Piece[] = [
  // 蓝方 (y <= 2)
  { id: 'blue-elephant', type: PieceType.Elephant, side: Side.Blue, rank: 8, position: { x: 6, y: 2 } },
  { id: 'blue-lion',     type: PieceType.Lion,     side: Side.Blue, rank: 7, position: { x: 6, y: 0 } },
  { id: 'blue-tiger',    type: PieceType.Tiger,    side: Side.Blue, rank: 6, position: { x: 0, y: 0 } },
  { id: 'blue-leopard',  type: PieceType.Leopard,  side: Side.Blue, rank: 5, position: { x: 4, y: 2 } },
  { id: 'blue-wolf',     type: PieceType.Wolf,     side: Side.Blue, rank: 4, position: { x: 2, y: 2 } },
  { id: 'blue-dog',      type: PieceType.Dog,      side: Side.Blue, rank: 3, position: { x: 5, y: 1 } },
  { id: 'blue-cat',      type: PieceType.Cat,      side: Side.Blue, rank: 2, position: { x: 1, y: 1 } },
  { id: 'blue-rat',      type: PieceType.Rat,      side: Side.Blue, rank: 1, position: { x: 0, y: 2 } },

  // 红方 (y >= 6)
  { id: 'red-elephant',  type: PieceType.Elephant, side: Side.Red,  rank: 8, position: { x: 0, y: 6 } },
  { id: 'red-lion',      type: PieceType.Lion,     side: Side.Red,  rank: 7, position: { x: 0, y: 8 } },
  { id: 'red-tiger',     type: PieceType.Tiger,    side: Side.Red,  rank: 6, position: { x: 6, y: 8 } },
  { id: 'red-leopard',   type: PieceType.Leopard,  side: Side.Red,  rank: 5, position: { x: 2, y: 6 } },
  { id: 'red-wolf',      type: PieceType.Wolf,     side: Side.Red,  rank: 4, position: { x: 4, y: 6 } },
  { id: 'red-dog',       type: PieceType.Dog,      side: Side.Red,  rank: 3, position: { x: 1, y: 7 } },
  { id: 'red-cat',       type: PieceType.Cat,      side: Side.Red,  rank: 2, position: { x: 5, y: 7 } },
  { id: 'red-rat',       type: PieceType.Rat,      side: Side.Red,  rank: 1, position: { x: 6, y: 6 } },
];
