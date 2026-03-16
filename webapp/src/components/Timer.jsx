import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Timer = ({ timeLeft }) => {
  // timeLeft приходит в сотых долях секунды (например, 6000 = 60.00 сек)
  const seconds = Math.floor(timeLeft / 100);
  const milliseconds = timeLeft % 100;

  // Форматируем для отображения: 00:59:99
  const formatPart = (num) => num.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <div className="flex items-center gap-3">
        {/* Блок Секунд */}
        <TimerBlock value={formatPart(seconds)} label="SECONDS" color="text-white" />
        
        <span className="text-4xl font-black text-gray-700 mt-[-20px]">:</span>
        
        {/* Блок Миллисекунд (сотых долей) */}
        <TimerBlock value={formatPart(milliseconds)} label="MS" color="text-orange-500" isSmall />
      </div>
      
      {/* Прогресс-бар снизу для динамики */}
      <div className="w-64 h-1.5 bg-gray-900 rounded-full mt-8 overflow-hidden border border-white/5">
        <motion.div 
          className="h-full bg-gradient-to-r from-orange-600 to-orange-400"
          initial={{ width: "100%" }}
          animate={{ width: `${(timeLeft / 6000) * 100}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </div>
  );
};

const TimerBlock = ({ value, label, color, isSmall = false }) => (
  <div className="flex flex-col items-center">
    <div className={`
      ${isSmall ? 'w-16 h-20 text-3xl' : 'w-24 h-28 text-6xl'} 
      bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] 
      rounded-2xl border border-white/10 shadow-2xl 
      flex items-center justify-center font-black tracking-tighter
      relative overflow-hidden
    `}>
      {/* Блик сверху */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.1 }}
          className={color}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
    <span className="text-[10px] font-bold text-gray-600 mt-2 tracking-[0.2em]">{label}</span>
  </div>
);

export default Timer;

