import React from 'react';
import { KEYBOARD_LAYOUT, KEY_TO_ZHUYIN } from '../constants';

interface VirtualKeyboardProps {
  activeKey: string | null; // The key currently needing to be pressed
  pressedKey: string | null; // The key the user just pressed (for visual feedback)
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ activeKey, pressedKey }) => {
  return (
    <div className="bg-sky-100 p-4 rounded-3xl border-4 border-sky-300 shadow-inner select-none">
      <div className="flex flex-col gap-2">
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5 sm:gap-2">
            {row.map((key) => {
              const zhuyin = KEY_TO_ZHUYIN[key];
              const isActive = activeKey === key;
              const isPressed = pressedKey === key;

              let baseClass = "relative flex flex-col items-center justify-center w-10 h-12 sm:w-12 sm:h-14 lg:w-14 lg:h-16 rounded-xl border-b-4 transition-all duration-100 text-sm sm:text-base";
              let colorClass = "bg-white border-slate-300 text-slate-700";

              if (isActive) {
                colorClass = "bg-yellow-300 border-yellow-500 text-yellow-900 animate-pulse ring-2 ring-yellow-400";
              } else if (isPressed) {
                colorClass = "bg-green-400 border-green-600 text-white transform translate-y-1 border-b-0 mb-[4px]";
              }

              // Special handling for Space
              if (key === ' ') {
                 // Space bar not rendered in standard rows typically, but if added in layout:
                 return null;
              }

              return (
                <div
                  key={key}
                  className={`${baseClass} ${colorClass}`}
                >
                  <span className="font-bold text-lg sm:text-xl font-fredoka leading-none">{zhuyin}</span>
                  <span className="text-[10px] opacity-40 uppercase absolute bottom-1 right-1">{key}</span>
                </div>
              );
            })}
          </div>
        ))}
        {/* Space Bar Row */}
        <div className="flex justify-center mt-2">
           <div 
             className={`
               flex items-center justify-center w-64 h-12 sm:h-14 rounded-xl border-b-4 transition-all duration-100
               ${activeKey === ' ' ? "bg-yellow-300 border-yellow-500 text-yellow-900 animate-pulse ring-2 ring-yellow-400" : ""}
               ${pressedKey === ' ' ? "bg-green-400 border-green-600 border-b-0 mt-[4px]" : "bg-white border-slate-300"}
             `}
           >
             <span className="font-bold text-slate-400">一聲 (空白鍵)</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;