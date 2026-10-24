import React from 'react';
import { PieceType } from '../../core/types';

interface AnimalIconProps {
  type: PieceType;
  className?: string;
}

/**
 * 全彩高精森林卡通动物头像（多层 SVG 矢量插画，适配 iPad Retina 2x 屏）
 */
export const AnimalIcon: React.FC<AnimalIconProps> = ({ type, className = 'w-8 h-8' }) => {
  switch (type) {
    case PieceType.Elephant:
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          {/* 宽大象耳 */}
          <ellipse cx="13" cy="31" rx="9" ry="13" fill="#94a3b8" stroke="#334155" strokeWidth="2.5" />
          <ellipse cx="14" cy="32" rx="5.5" ry="8.5" fill="#fda4af" />
          <ellipse cx="51" cy="31" rx="9" ry="13" fill="#94a3b8" stroke="#334155" strokeWidth="2.5" />
          <ellipse cx="50" cy="32" rx="5.5" ry="8.5" fill="#fda4af" />
          {/* 头部 */}
          <circle cx="32" cy="29" r="16" fill="#cbd5e1" stroke="#334155" strokeWidth="2.5" />
          {/* 皇冠头饰 */}
          <path d="M23 15L27 9L32 14L37 9L41 15H23Z" fill="#fbbf24" stroke="#92400e" strokeWidth="1.8" strokeLinejoin="round" />
          {/* 象牙 */}
          <path d="M22 40C17 44 16 49 20 51C23 51 25 46 25 42" fill="#fef3c7" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
          <path d="M42 40C47 44 48 49 44 51C41 51 39 46 39 42" fill="#fef3c7" stroke="#92400e" strokeWidth="2" strokeLinecap="round" />
          {/* 长鼻 */}
          <path d="M28 32C28 42 26 53 32 54C36 54 37 49 34 48" fill="#cbd5e1" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M32 32V48" stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" />
          {/* 眼睛 */}
          <circle cx="25" cy="27" r="2.6" fill="#0f172a" />
          <circle cx="24.2" cy="26.2" r="0.9" fill="#ffffff" />
          <circle cx="39" cy="27" r="2.6" fill="#0f172a" />
          <circle cx="38.2" cy="26.2" r="0.9" fill="#ffffff" />
        </svg>
      );

    case PieceType.Lion:
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          {/* 蓬松鬃毛 */}
          <path
            d="M32 6L39 10L47 9L50 17L57 22L55 30L58 38L51 44L49 52L41 52L32 57L23 52L15 52L13 44L6 38L9 30L7 22L14 17L17 9L25 10L32 6Z"
            fill="#b45309"
            stroke="#451a03"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* 耳朵 */}
          <circle cx="20" cy="19" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
          <circle cx="44" cy="19" r="5" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
          {/* 脸庞 */}
          <circle cx="32" cy="33" r="14" fill="#fbbf24" stroke="#78350f" strokeWidth="2.4" />
          {/* 吻部 */}
          <ellipse cx="29" cy="39" rx="5" ry="4" fill="#fef3c7" />
          <ellipse cx="35" cy="39" rx="5" ry="4" fill="#fef3c7" />
          <path d="M29 35H35L32 39L29 35Z" fill="#78350f" />
          {/* 威严双目 */}
          <circle cx="26" cy="30" r="2.5" fill="#1e293b" />
          <circle cx="25.3" cy="29.2" r="0.9" fill="#ffffff" />
          <circle cx="38" cy="30" r="2.5" fill="#1e293b" />
          <circle cx="37.3" cy="29.2" r="0.9" fill="#ffffff" />
          <path d="M23 26L28 28M41 26L36 28" stroke="#78350f" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case PieceType.Tiger:
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          {/* 虎耳 */}
          <circle cx="17" cy="17" r="6.5" fill="#f97316" stroke="#431407" strokeWidth="2.5" />
          <circle cx="17" cy="17" r="3" fill="#fde68a" />
          <circle cx="47" cy="17" r="6.5" fill="#f97316" stroke="#431407" strokeWidth="2.5" />
          <circle cx="47" cy="17" r="3" fill="#fde68a" />
          {/* 虎头 */}
          <ellipse cx="32" cy="34" rx="18" ry="16" fill="#fb923c" stroke="#431407" strokeWidth="2.5" />
          {/* 白色脸颊 */}
          <path d="M16 36C16 44 23 49 32 49C41 49 48 44 48 36C44 33 38 35 32 35C26 35 20 33 16 36Z" fill="#fffbeb" />
          {/* 额头王字纹 */}
          <path d="M26 21H38M28 25H36M32 19V28" stroke="#1c1917" strokeWidth="2.8" strokeLinecap="round" />
          {/* 两侧虎斑 */}
          <path d="M15 31H20M16 35H21M49 31H44M48 35H43" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
          {/* 眼睛与鼻 */}
          <circle cx="25" cy="32" r="2.6" fill="#0f172a" />
          <circle cx="39" cy="32" r="2.6" fill="#0f172a" />
          <polygon points="29,37 35,37 32,41" fill="#f43f5e" stroke="#431407" strokeWidth="1.5" />
          <path d="M28 43C30 45 34 45 36 43" stroke="#431407" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case PieceType.Leopard:
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          <circle cx="18" cy="18" r="5.5" fill="#eab308" stroke="#422006" strokeWidth="2.4" />
          <circle cx="46" cy="18" r="5.5" fill="#eab308" stroke="#422006" strokeWidth="2.4" />
          <ellipse cx="32" cy="34" rx="16" ry="15" fill="#facc15" stroke="#422006" strokeWidth="2.5" />
          {/* 豹纹斑点 */}
          <circle cx="23" cy="24" r="2.2" fill="#713f12" />
          <circle cx="41" cy="24" r="2.2" fill="#713f12" />
          <circle cx="32" cy="22" r="2" fill="#713f12" />
          <circle cx="19" cy="35" r="2" fill="#713f12" />
          <circle cx="45" cy="35" r="2" fill="#713f12" />
          {/* 绿宝石豹眼 */}
          <circle cx="26" cy="32" r="2.6" fill="#065f46" />
          <circle cx="25.5" cy="31.5" r="1" fill="#a7f3d0" />
          <circle cx="38" cy="32" r="2.6" fill="#065f46" />
          <circle cx="37.5" cy="31.5" r="1" fill="#a7f3d0" />
          {/* 吻部 */}
          <ellipse cx="32" cy="40" rx="6" ry="4.5" fill="#fef9c3" />
          <polygon points="29.5,37.5 34.5,37.5 32,40.5" fill="#422006" />
          <path d="M29 42.5L32 44L35 42.5" stroke="#422006" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case PieceType.Wolf:
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          {/* 尖立狼耳 */}
          <polygon points="15,30 16,10 28,21" fill="#64748b" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points="18,26 18,14 25,21" fill="#cbd5e1" />
          <polygon points="49,30 48,10 36,21" fill="#64748b" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points="46,26 46,14 39,21" fill="#cbd5e1" />
          {/* 狼头轮廓 */}
          <polygon points="13,33 24,20 40,20 51,33 32,53" fill="#94a3b8" stroke="#1e293b" strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points="20,35 32,27 44,35 32,52" fill="#f1f5f9" />
          {/* 锐利黄眼 */}
          <polygon points="22,30 29,32 24,34" fill="#f59e0b" stroke="#0f172a" strokeWidth="1.2" />
          <polygon points="42,30 35,32 40,34" fill="#f59e0b" stroke="#0f172a" strokeWidth="1.2" />
          {/* 狼鼻 */}
          <circle cx="32" cy="45" r="3.2" fill="#0f172a" />
        </svg>
      );

    case PieceType.Dog:
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          {/* 垂耳 */}
          <path d="M19 21C11 21 9 34 14 41C17 44 21 38 20 30" fill="#92400e" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M45 21C53 21 55 34 50 41C47 44 43 38 44 30" fill="#92400e" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
          {/* 头部 */}
          <circle cx="32" cy="34" r="15" fill="#d97706" stroke="#451a03" strokeWidth="2.5" />
          <ellipse cx="32" cy="39" rx="8" ry="6.5" fill="#fef3c7" />
          {/* 吐小舌头 */}
          <path d="M30 44V48C30 50 34 50 34 48V44" fill="#fb7185" stroke="#881337" strokeWidth="1.8" />
          {/* 眼睛与鼻 */}
          <circle cx="26" cy="30" r="2.6" fill="#1e293b" />
          <circle cx="25.2" cy="29.2" r="0.9" fill="#ffffff" />
          <circle cx="38" cy="30" r="2.6" fill="#1e293b" />
          <circle cx="37.2" cy="29.2" r="0.9" fill="#ffffff" />
          <ellipse cx="32" cy="37" rx="3.8" ry="2.6" fill="#1e293b" />
        </svg>
      );

    case PieceType.Cat:
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          {/* 猫耳 */}
          <path d="M16 30L15 12L28 21H36L49 12L48 30C51 37 46 49 32 49C18 49 13 37 16 30Z" fill="#fda4af" stroke="#881337" strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points="18,24 18,16 25,21" fill="#f43f5e" />
          <polygon points="46,24 46,16 39,21" fill="#f43f5e" />
          {/* 灵动大眼 */}
          <circle cx="25" cy="33" r="3" fill="#0f172a" />
          <circle cx="24" cy="32" r="1.1" fill="#ffffff" />
          <circle cx="39" cy="33" r="3" fill="#0f172a" />
          <circle cx="38" cy="32" r="1.1" fill="#ffffff" />
          {/* 粉鼻与胡须 */}
          <polygon points="30,37 34,37 32,39.5" fill="#e11d48" />
          <path d="M29 41C30.5 42.5 33.5 42.5 35 41" stroke="#881337" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 34H19M11 39H19M45 34H54M45 39H53" stroke="#881337" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case PieceType.Rat:
      return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
          {/* 大圆鼠耳 */}
          <circle cx="18" cy="20" r="9" fill="#94a3b8" stroke="#1e293b" strokeWidth="2.4" />
          <circle cx="18" cy="20" r="5.5" fill="#fda4af" />
          <circle cx="46" cy="20" r="9" fill="#94a3b8" stroke="#1e293b" strokeWidth="2.4" />
          <circle cx="46" cy="20" r="5.5" fill="#fda4af" />
          {/* 尖巧鼠脸 */}
          <path d="M18 32C18 22 46 22 46 32C46 42 36 51 32 51C28 51 18 42 18 32Z" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2.5" />
          {/* 机灵双眼 */}
          <circle cx="26" cy="33" r="2.6" fill="#0f172a" />
          <circle cx="25.2" cy="32.2" r="1" fill="#ffffff" />
          <circle cx="38" cy="33" r="2.6" fill="#0f172a" />
          <circle cx="37.2" cy="32.2" r="1" fill="#ffffff" />
          {/* 粉红鼻头与门牙 */}
          <circle cx="32" cy="46" r="3" fill="#f43f5e" stroke="#881337" strokeWidth="1.5" />
          <path d="M12 41H22M13 45H22M42 41H52M42 45H51" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
  }
};
