import React from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { Users, Info, TrendingUp } from 'lucide-react';

const Header = ({ onlineCount, currentPrize }) => {
  return (
    <header className="w-full p-4 flex flex-col gap-4 bg-black/40 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      {/* Верхняя линия: Правила и Кошелек */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => alert('Rules: Be the last one to click before the timer hits 00:00 to win!')}
          className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors bg-white/5 px-3 py-2 rounded-full border border-white/10"
        >
          <Info size={14} />
          RULES (ENG)
        </button>
        
        {/* Кнопка подключения TON */}
        <div className="scale-90 origin-right">
          <TonConnectButton />
        </div>
      </div>

      {/* Нижняя линия: Статистика */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-1">Current Prize</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-2xl font-black text-white tracking-tight">
              {currentPrize.amount} <span className="text-orange-500">{currentPrize.symbol}</span>
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 text-green-400 mb-1">
            <TrendingUp size={12} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Live Stats</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
            <Users size={14} className="text-blue-400" />
            <span className="text-sm font-mono font-bold text-gray-200">
              {onlineCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
