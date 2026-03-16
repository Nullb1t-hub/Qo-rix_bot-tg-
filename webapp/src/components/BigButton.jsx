import React from 'react';
import { motion } from 'framer-motion';

const BigButton = ({ onTap, attempts, coinSymbol, coinColor }) => {
  const isDisabled = attempts <= 0;

  const handleClick = () => {
    if (!isDisabled) {
      // Вибрация для Telegram (если запущено в приложении)
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
      }
      onTap();
    }
  };

  return (
    <div className="relative flex items-center justify-center my-12">
      {/* Слой свечения вокруг кнопки */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute w-72 h-72 rounded-full blur-[60px] ${coinColor.bg} opacity-30`}
      />

      {/* Сама кнопка */}
      <motion.button
        whileTap={!isDisabled ? { scale: 0.92, y: 5 } : {}}
        onClick={handleClick}
        disabled={isDisabled}
        className={`
          relative w-64 h-64 rounded-full flex flex-col items-center justify-center
          transition-all duration-300 select-none outline-none
          border-[12px] border-black/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)]
          ${isDisabled 
            ? 'bg-gray-800 cursor-not-allowed grayscale' 
            : `cursor-pointer ${coinColor.bg} active:shadow-inner`
          }
        `}
      >
        {/* Внутренний градиент и блик */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/40 via-transparent to-white/30" />
        
        {/* Текст внутри кнопки */}
        <span className="text-6xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
          {coinSymbol}
        </span>
        
        <span className={`mt-2 text-xs font-black tracking-[0.3em] uppercase ${isDisabled ? 'text-gray-500' : 'text-white/80'}`}>
          {isDisabled ? 'No Attempts' : 'Push to Win'}
        </span>

        {/* Индикатор оставшихся попыток прямо на кнопке (опционально) */}
        <div className="absolute -bottom-4 bg-gray-900 border border-white/10 px-4 py-1.5 rounded-full shadow-xl">
          <span className="text-sm font-bold">
            <span className="text-yellow-400">⚡</span> {attempts} <span className="text-gray-400 text-[10px] ml-1">LEFT</span>
          </span>
        </div>
      </motion.button>
    </div>
  );
};

export default BigButton;
