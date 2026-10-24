import React, { useEffect, useState } from 'react';
import { Board } from './components/Board/Board';
import { Controls } from './components/Controls/Controls';
import { GameOverModal } from './components/GameOverModal/GameOverModal';
import { GamePanel } from './components/GamePanel/GamePanel';
import { RulesModal } from './components/RulesModal/RulesModal';
import { GameStatus, Side } from './core/types';
import { useJungleGame } from './hooks/useJungleGame';

export const App: React.FC = () => {
  const {
    state,
    mode,
    aiDifficulty,
    orientation,
    soundEnabled,
    selectedPiece,
    legalMovesForSelected,
    denThreats,
    isAIThinking,
    isInteractive,
    canUndo,
    setMode,
    setAiDifficulty,
    setOrientation,
    toggleSound,
    onSelectPiece,
    onClearSelection,
    onExecuteMove,
    onUndo,
    onRestart,
  } = useJungleGame();

  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);

  // 当对局状态进入终局（胜负或和棋）时，自动弹出豪华结算弹窗
  useEffect(() => {
    if (state.status !== GameStatus.Playing) {
      setIsGameOverModalOpen(true);
    } else {
      setIsGameOverModalOpen(false);
    }
  }, [state.status]);

  const redPanelRotation = orientation === 'faceToFace180' ? 180 : 0;

  return (
    <main className="w-screen h-dvh safe-area-pad bg-gradient-to-br from-slate-950 via-emerald-950/90 to-slate-950 flex flex-col lg:flex-row items-center justify-between gap-3 overflow-hidden select-none">
      {/* 左侧栏：蓝方状态面板 + 品牌标题 */}
      <section className="w-full lg:w-[276px] shrink-0 flex flex-col gap-3 justify-between">
        <header className="hidden lg:flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-900/85 border border-emerald-700/40 shadow-lg">
          <div>
            <h1 className="text-lg font-black tracking-wider text-amber-300">
              森林皇家斗兽棋
            </h1>
            <p className="text-[11px] text-emerald-300/80">
              Jungle Chess · iPad Air Edition
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
            Retina 2x
          </span>
        </header>

        <GamePanel
          side={Side.Blue}
          state={state}
          isAI={false}
          isAIThinking={false}
          denThreatened={denThreats[Side.Blue]}
          rotationDeg={0}
        />
      </section>

      {/* 中央核心棋盘区 */}
      <section className="flex-1 h-full flex items-center justify-center overflow-hidden">
        <Board
          state={state}
          selectedPiece={selectedPiece}
          legalMovesForSelected={legalMovesForSelected}
          denThreats={denThreats}
          orientation={orientation}
          isInteractive={isInteractive}
          onSelectPiece={onSelectPiece}
          onExecuteMove={onExecuteMove}
          onClearSelection={onClearSelection}
        />
      </section>

      {/* 右侧栏：红方状态面板 + 全局控制台 */}
      <section className="w-full lg:w-[276px] shrink-0 flex flex-col gap-3 justify-between">
        <GamePanel
          side={Side.Red}
          state={state}
          isAI={mode === 'ai'}
          isAIThinking={isAIThinking}
          denThreatened={denThreats[Side.Red]}
          rotationDeg={redPanelRotation}
        />

        <Controls
          mode={mode}
          aiDifficulty={aiDifficulty}
          orientation={orientation}
          soundEnabled={soundEnabled}
          canUndo={canUndo}
          pliesWithoutCapture={state.pliesWithoutCapture}
          moveCount={state.moveHistory.length}
          onChangeMode={setMode}
          onChangeDifficulty={setAiDifficulty}
          onChangeOrientation={setOrientation}
          onToggleSound={toggleSound}
          onUndo={onUndo}
          onRestart={onRestart}
          onOpenRules={() => setIsRulesOpen(true)}
        />
      </section>

      {/* 斗兽棋克制与规则速查弹窗 */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

      {/* 终局豪华结算弹出框 */}
      <GameOverModal
        isOpen={isGameOverModalOpen}
        state={state}
        mode={mode}
        onRestart={() => {
          setIsGameOverModalOpen(false);
          onRestart();
        }}
        onInspectBoard={() => setIsGameOverModalOpen(false)}
      />
    </main>
  );
};
