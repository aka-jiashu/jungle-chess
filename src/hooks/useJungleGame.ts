import { useCallback, useEffect, useMemo, useState } from 'react';
import { soundManager } from '../audio/soundManager';
import { BoardOrientation } from '../components/Board/Board';
import { GameMode } from '../components/Controls/Controls';
import { chooseAIMove } from '../core/ai';
import { isEnemyTrap } from '../core/board';
import { applyMove, createInitialState } from '../core/gameState';
import { getLegalMovesForPiece } from '../core/moveGenerator';
import { checkDenThreat } from '../core/referee';
import { AIDifficulty, GameState, GameStatus, Move, Piece, Side } from '../core/types';

const STORAGE_KEY = 'jungle_chess_ipad_save_v1';

interface PersistedSession {
  stateHistory: GameState[];
  mode: GameMode;
  aiDifficulty: AIDifficulty;
  orientation: BoardOrientation;
  soundEnabled: boolean;
}

function loadSession(): PersistedSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedSession;
    if (Array.isArray(parsed.stateHistory) && parsed.stateHistory.length > 0) {
      return parsed;
    }
  } catch {
    // Ignore storage read errors
  }
  return null;
}

export function useJungleGame() {
  const saved = useMemo(() => loadSession(), []);

  const [stateHistory, setStateHistory] = useState<GameState[]>(
    () => saved?.stateHistory ?? [createInitialState()]
  );
  const [mode, setMode] = useState<GameMode>(() => saved?.mode ?? 'ai');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>(
    () => saved?.aiDifficulty ?? 'medium'
  );
  const [orientation, setOrientation] = useState<BoardOrientation>(
    () => saved?.orientation ?? 'standard'
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(
    () => saved?.soundEnabled ?? true
  );
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [isAIThinking, setIsAIThinking] = useState<boolean>(false);

  const currentState = stateHistory[stateHistory.length - 1];

  // 同步音效开关
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // 自动持久化至 localStorage
  useEffect(() => {
    try {
      const payload: PersistedSession = {
        stateHistory,
        mode,
        aiDifficulty,
        orientation,
        soundEnabled,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors
    }
  }, [stateHistory, mode, aiDifficulty, orientation, soundEnabled]);

  const selectedPiece = useMemo(
    () => currentState.pieces.find((p) => p.id === selectedPieceId) ?? null,
    [currentState.pieces, selectedPieceId]
  );

  const legalMovesForSelected = useMemo(() => {
    if (!selectedPiece || currentState.status !== GameStatus.Playing) return [];
    if (selectedPiece.side !== currentState.turn) return [];
    return getLegalMovesForPiece(currentState, selectedPiece);
  }, [currentState, selectedPiece]);

  const denThreats = useMemo(() => checkDenThreat(currentState), [currentState]);

  const executeMove = useCallback(
    (move: Move) => {
      const nextState = applyMove(currentState, move);
      setStateHistory((prev) => [...prev, nextState]);
      setSelectedPieceId(null);

      // 触发对应合成音效
      if (nextState.status === GameStatus.BlueWon || nextState.status === GameStatus.RedWon) {
        soundManager.playVictory();
      } else if (move.captured) {
        soundManager.playCapture();
      } else if (isEnemyTrap(move.to, move.piece.side)) {
        soundManager.playTrapWarning();
      } else {
        soundManager.playMove(Boolean(move.isRiverJump));
      }

      const nextThreats = checkDenThreat(nextState);
      if (
        nextState.status === GameStatus.Playing &&
        ((move.piece.side === Side.Red && nextThreats[Side.Blue]) ||
          (move.piece.side === Side.Blue && nextThreats[Side.Red]))
      ) {
        soundManager.playDenAlert();
      }
    },
    [currentState]
  );

  // 单人 AI 模式下，轮到红方时自动调度 AI 思考与走子
  useEffect(() => {
    if (
      mode !== 'ai' ||
      currentState.status !== GameStatus.Playing ||
      currentState.turn !== Side.Red
    ) {
      setIsAIThinking(false);
      return;
    }

    setIsAIThinking(true);
    const timer = window.setTimeout(() => {
      const aiMove = chooseAIMove(currentState, aiDifficulty);
      setIsAIThinking(false);
      if (aiMove) {
        executeMove(aiMove);
      }
    }, 320);

    return () => window.clearTimeout(timer);
  }, [mode, aiDifficulty, currentState, executeMove]);

  const handleSelectPiece = useCallback((piece: Piece) => {
    setSelectedPieceId(piece.id);
    soundManager.playSelect();
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedPieceId(null);
  }, []);

  const handleUndo = useCallback(() => {
    if (stateHistory.length <= 1) return;
    setSelectedPieceId(null);
    setStateHistory((prev) => {
      if (mode === 'ai' && prev.length >= 3 && prev[prev.length - 1].turn === Side.Blue) {
        // AI 模式下悔棋直接撤回玩家与 AI 各一步（共 2 步）
        return prev.slice(0, -2);
      }
      return prev.slice(0, -1);
    });
  }, [stateHistory.length, mode]);

  const handleRestart = useCallback(() => {
    setSelectedPieceId(null);
    setStateHistory([createInitialState()]);
  }, []);

  const isInteractive =
    currentState.status === GameStatus.Playing &&
    !(mode === 'ai' && currentState.turn === Side.Red);

  return {
    state: currentState,
    mode,
    aiDifficulty,
    orientation,
    soundEnabled,
    selectedPiece,
    legalMovesForSelected,
    denThreats,
    isAIThinking,
    isInteractive,
    canUndo: stateHistory.length > 1 && !isAIThinking,
    setMode,
    setAiDifficulty,
    setOrientation,
    toggleSound: () => setSoundEnabled((prev) => !prev),
    onSelectPiece: handleSelectPiece,
    onClearSelection: handleClearSelection,
    onExecuteMove: executeMove,
    onUndo: handleUndo,
    onRestart: handleRestart,
  };
}
