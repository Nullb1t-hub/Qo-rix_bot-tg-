import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Timer from './components/Timer';
import BigButton from './components/BigButton';
import Leaderboard from './components/Leaderboard';
import ShopModal from './components/ShopModal';
import { useTonConnectUI } from '@tonconnect/ui-react';

const COINS = [
  { symbol: 'BTC', amount: '0.01', bg: 'bg-orange-500', shadow: 'shadow-orange-500/40' },
  { symbol: 'ETH', amount: '0.3', bg: 'bg-indigo-500', shadow: 'shadow-indigo-500/40' },
  { symbol: 'SOL', amount: '5', bg: 'bg-purple-500', shadow: 'shadow-purple-500/40' },
  { symbol: 'TON', amount: '150', bg: 'bg-blue-500', shadow: 'shadow-blue-500/40' },
  { symbol: 'PEPE', amount: '100M', bg: 'bg-green-600', shadow: 'shadow-green-600/40' }
];

const INITIAL_LEADERS = [
  { name: 'WhaleHunter', time: '00:03' },
  { name: 'CryptoDegen', time: '00:08' },
  { name: 'TonMaxi', time: '00:15' },
  { name: 'SatoshiSecret', time: '00:24' },
  { name: 'PepeLover', time: '00:32' }
];

function App() {
  const [currentCoinIdx, setCurrentCoinIdx] = useState(0);
  const [onlineCount, setOnlineCount] = useState(3500);
  const [timeLeft, setTimeLeft] = useState(6000); // 60.00 секунд
  const [attempts, setAttempts] = useState(5);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [tonConnectUI] = useTonConnectUI();

  // 1. Умный рандом онлайна (2000 - 13000)
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const change = Math.floor(Math.random() * 601) - 300; // +/- 300
        let newValue = prev + change;
        if (newValue < 2000) newValue = 2000 + Math.abs(change);
        if (newValue > 13000) newValue = 13000 - Math.abs(change);
        return newValue;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 2. Логика таймера и авто-сброса (имитация других игроков)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) return 6000; // Кто-то выиграл (или просто ресет)
        
        // Авто-перебивание: если время между 59 и 33 сек, есть шанс 3%, что кто-то нажмет
        if (prev < 5900 && prev > 3300) {
          if (Math.random() < 0.03) return 6000;
        }
        
        return prev - 1;
      });
    }, 10);
    return () => clearInterval(timer);
  }, []);

  const handleTap = () => {
    if (attempts > 0) {
      setAttempts(prev => prev - 1);
      setTimeLeft(6000); // Сброс таймера игроком
    } else {
      setIsShopOpen(true); // Если нет попыток - открываем магазин
    }
  };

  const handleBuy = async (method, pack) => {
    if (method === 'ton') {
      // Пока просто эмуляция для макета
      console.log(`Paying ${pack.priceTon} TON for ${pack.attempts} attempts`);
      // Здесь будет вызов транзакции через tonConnectUI.sendTransaction(...)
    } else {
      console.log(`Paying stars for ${pack.attempts} attempts`);
      // Здесь будет вызов платежа через Telegram Stars
    }
    // После "оплаты" (для макета сразу):
    setAttempts(prev => prev + pack.attempts);
    setIsShopOpen(false);
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center select-none overflow-x-hidden">
      <Header 
        onlineCount={onlineCount} 
        currentPrize={COINS[currentCoinIdx]} 
      />

      <main className="flex-1 w-full flex flex-col items-center justify-center py-6">
        {/* Клик по таймеру меняет монету (для теста макета) */}
        <div onClick={() => setCurrentCoinIdx((currentCoinIdx + 1) % COINS.length)}>
          <Timer timeLeft={timeLeft} />
        </div>

        <BigButton 
          onTap={handleTap} 
          attempts={attempts} 
          coinSymbol={COINS[currentCoinIdx].symbol}
          coinColor={COINS[currentCoinIdx]}
        />

        <Leaderboard leaders={INITIAL_LEADERS} />
      </main>

      <ShopModal 
        isOpen={isShopOpen} 
        onClose={() => setIsShopOpen(false)} 
        onBuy={handleBuy} 
      />
    </div>
  );
}

export default App;

