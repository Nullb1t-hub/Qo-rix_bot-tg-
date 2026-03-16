import React from 'react';
import { Zap, Star } from 'lucide-react';

const ShopModal = ({ isOpen, onClose, onBuy }) => {
  if (!isOpen) return null;

  const packs = [
    { id: 1, attempts: 10, priceTon: 2, priceStars: 500 },
    { id: 2, attempts: 35, priceTon: 6.19, priceStars: 1500 },
    { id: 3, attempts: 50, priceTon: 9.5, priceStars: 2500 },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm px-4 pb-10">
      <div className="w-full bg-dark border border-white/10 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black italic tracking-tighter text-white">REFILL ENERGY</h2>
          <button onClick={onClose} className="text-gray-500 font-bold">CLOSE</button>
        </div>

        <div className="grid gap-3">
          {packs.map((pack) => (
            <div key={pack.id} className="flex items-center justify-between bg-white/5 border border-white/5 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-500/20 p-2 rounded-lg text-yellow-500">
                  <Zap size={20} fill="currentColor" />
                </div>
                <div>
                  <p className="font-bold text-white">+{pack.attempts} Attempts</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Bonus Energy</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => onBuy('ton', pack)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black py-2 px-4 rounded-xl transition-all"
                >
                  {pack.priceTon} TON
                </button>
                <button 
                  onClick={() => onBuy('stars', pack)}
                  className="bg-orange-500 hover:bg-orange-400 text-black text-[10px] font-black py-2 px-4 rounded-xl flex items-center gap-1"
                >
                  <Star size={10} fill="currentColor" /> {pack.priceStars}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopModal;

