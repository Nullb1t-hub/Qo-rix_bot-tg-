import React from 'react';
import { Trophy, Clock, ChevronRight } from 'lucide-react';

const Leaderboard = ({ leaders }) => {
  return (
    <div className="w-full px-4 mt-4 pb-10">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="flex items-center gap-2 text-gray-400 text-sm font-bold tracking-widest">
          <Trophy size={16} className="text-yellow-500" />
          TOP 5 LEADERS
        </h3>
        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">Last Records</span>
      </div>

      <div className="space-y-2">
        {leaders.map((player, index) => (
          <div 
            key={index}
            className={`
              flex items-center justify-between p-4 rounded-2xl border
              ${index === 0 ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border-yellow-500/20' : 'bg-white/5 border-white/5'}
              transition-transform active:scale-[0.98]
            `}
          >
            <div className="flex items-center gap-4">
              {/* Медаль или Номер */}
              <div className="w-8 h-8 flex items-center justify-center font-black text-lg">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : (index + 1)}
              </div>
              
              <div>
                <p className="font-bold text-white text-sm">{player.name}</p>
                <p className="text-[10px] text-gray-500 font-medium">Player Status: Active</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-mono font-black text-orange-500 text-sm">{player.time}</p>
                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter">Seconds</p>
              </div>
              <ChevronRight size={14} className="text-gray-700" />
            </div>
          </div>
        ))}
      </div>

      {/* Кнопка "Пригласить" прямо под списком */}
      <div className="mt-6 p-1 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600">
        <button className="w-full py-4 bg-dark rounded-[14px] font-black text-sm tracking-widest uppercase hover:bg-transparent transition-all">
          Invite Friend +5 Attempts
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
