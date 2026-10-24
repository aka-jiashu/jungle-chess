export enum Side {
  Blue = 'blue', // 己方/蓝方，底端 y = 0~2
  Red = 'red',   // 敌方/红方，顶端 y = 6~8
}

export enum TerrainType {
  Land = 'land',
  River = 'river',
  Trap = 'trap',
  Den = 'den',
}

export enum PieceType {
  Rat = 'rat',
  Cat = 'cat',
  Dog = 'dog',
  Wolf = 'wolf',
  Leopard = 'leopard',
  Tiger = 'tiger',
  Lion = 'lion',
  Elephant = 'elephant',
}

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface Position {
  x: number; // 0..6 (A..G)
  y: number; // 0..8 (1..9)
}

export interface Piece {
  id: string;
  type: PieceType;
  side: Side;
  rank: Rank;
  position: Position;
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
  isRiverJump?: boolean;
}

export enum GameStatus {
  Playing = 'playing',
  BlueWon = 'blue_won',
  RedWon = 'red_won',
  Draw = 'draw',
}

export enum EndReason {
  DenOccupied = 'den_occupied',
  Elimination = 'elimination',
  NoLegalMoves = 'no_legal_moves',
  ThreefoldRepetition = 'threefold_repetition',
  HundredPlyRule = 'hundred_ply_rule',
}

export interface GameState {
  pieces: Piece[];
  turn: Side;
  status: GameStatus;
  endReason?: EndReason;
  moveHistory: Move[];
  capturedPieces: {
    [Side.Blue]: Piece[]; // 蓝方被吃的棋子
    [Side.Red]: Piece[];  // 红方被吃的棋子
  };
  pliesWithoutCapture: number;
  positionCounts: Record<string, number>;
}

export type AIDifficulty = 'easy' | 'medium';
