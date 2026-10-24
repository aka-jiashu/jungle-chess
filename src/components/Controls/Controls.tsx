import React from 'react';
import {
  BookOpen,
  Bot,
  RotateCcw,
  Smartphone,
  Undo2,
  Users,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AIDifficulty } from '../../core/types';
import { BoardOrientation } from '../Board/Board';

export type GameMode = 'pvp' | 'ai';

interface ControlsProps {
  mode: GameMode;
  aiDifficulty: AIDifficulty;
  orientation: BoardOrientation;
  soundEnabled: boolean;
  canUndo: boolean;
  pliesWithoutCapture: number;
  moveCount: number;
  onChangeMode: (mode: GameMode) => void;
  onChangeDifficulty: (diff: AIDifficulty) => void;
  onChangeOrientation: (orientation: BoardOrientation) => void;
  onToggleSound: () => void;
  onUndo: () => void;
  onRestart: () => void;
  onOpenRules: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  mode,
  aiDifficulty,
  orientation,
  soundEnabled,
  canUndo,
  pliesWithoutCapture,
  moveCount,
  onChangeMode,
  onChangeDifficulty,
  onChangeOrientation,
  onToggleSound,
  onUndo,
  onRestart,
  onOpenRules,
}) => {
  return (
    <div className="w-full rounded-2xl p-3.5 bg-slate-900/90 border border-slate-800 flex flex-col gap-3">
      {/* 模式选择：双人同屏 vs 单人 AI */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          对战模式
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => onChangeMode('pvp')}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
              mode === 'pvp'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Users className="w-4 h-4" /> 双人同屏
          </button>
          <button
            type="button"
            onClick={() => onChangeMode('ai')}
            className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
              mode === 'ai'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Bot className="w-4 h-4" /> 单人战 AI
          </button>
        </div>

        {/* AI 难度选择 */}
        {mode === 'ai' && (
          <div className="grid grid-cols-2 gap-1.5 mt-1">
            <button
              type="button"
              onClick={() => onChangeDifficulty('easy')}
              className={`min-h-[44px] rounded-xl text-xs font-bold transition ${
                aiDifficulty === 'easy'
                  ? 'bg-emerald-500/25 border border-emerald-400 text-emerald-200'
                  : 'bg-slate-800/70 text-slate-400'
              }`}
            >
              AI 难度：简单
            </button>
            <button
              type="button"
              onClick={() => onChangeDifficulty('medium')}
              className={`min-h-[44px] rounded-xl text-xs font-bold transition ${
                aiDifficulty === 'medium'
                  ? 'bg-emerald-500/25 border border-emerald-400 text-emerald-200'
                  : 'bg-slate-800/70 text-slate-400'
              }`}
            >
              AI 难度：中等
            </button>
          </div>
        )}
      </div>

      {/* iPad Air 视角与棋盘旋转模式 */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Smartphone className="w-3.5 h-3.5" /> iPad 桌面视角切换
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => onChangeOrientation('standard')}
            className={`min-h-[44px] px-2 py-1.5 rounded-xl text-xs font-bold transition ${
              orientation === 'standard'
                ? 'bg-sky-500 text-slate-950 font-extrabold'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            单向正视
          </button>
          <button
            type="button"
            onClick={() => onChangeOrientation('faceToFace180')}
            className={`min-h-[44px] px-2 py-1.5 rounded-xl text-xs font-bold transition ${
              orientation === 'faceToFace180'
                ? 'bg-sky-500 text-slate-950 font-extrabold'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            180° 面对面
          </button>
          <button
            type="button"
            onClick={() => onChangeOrientation('horizontal90')}
            className={`min-h-[44px] px-2 py-1.5 rounded-xl text-xs font-bold transition ${
              orientation === 'horizontal90'
                ? 'bg-sky-500 text-slate-950 font-extrabold'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            90° 横置棋盘
          </button>
        </div>
      </div>

      {/* 常用对局操作：悔棋、重开、音效、规则速查 */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-xs font-bold flex items-center justify-center gap-1.5 transition"
        >
          <Undo2 className="w-4 h-4" /> 悔棋
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="min-h-[44px] px-3 py-2 rounded-xl bg-rose-600/85 hover:bg-rose-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
        >
          <RotateCcw className="w-4 h-4" /> 重新开始
        </button>

        <button
          type="button"
          onClick={onToggleSound}
          className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400" /> 音效：开启
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" /> 音效：静音
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenRules}
          className="min-h-[44px] px-3 py-2 rounded-xl bg-indigo-600/85 hover:bg-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
        >
          <BookOpen className="w-4 h-4" /> 规则速查
        </button>
      </div>

      {/* 步数与和棋计数状态 */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
        <span>总回合步数：{moveCount}</span>
        <span>无吃子步数：{pliesWithoutCapture} / 100</span>
      </div>
    </div>
  );
};
