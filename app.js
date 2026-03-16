const tg = window.Telegram.WebApp;
tg.expand();

// --- КОНФИГУРАЦИЯ МОНЕТ ---
const COINS = [
    { id: 0, name: 'BTC', amount: '0.01', color: '#f3ba2f', status: 'active', svg: '<svg viewBox="0 0 24 24" fill="#f3ba2f"><path d="M23.638 14.904c-1.391 5.589-7.031 9.005-12.621 7.614-5.589-1.391-9.005-7.031-7.614-12.621 1.391-5.589 7.031-9.005 12.621-7.614 5.59 1.391 9.005 7.031 7.614 12.621zm-6.333-3.032c.218-1.452-.887-2.234-2.397-2.755l.49-1.965-1.197-.298-.477 1.914c-.314-.078-.638-.152-.96-.225l.482-1.93-1.197-.298-.49 1.965c-.26-.06-.516-.117-.762-.178l.001-.005-1.65-.412-.319 1.278s.888.204.87.216c.484.12.572.441.557.696l-.558 2.238c.033.008.077.02.125.037l-.126-.031-.782 3.14c-.059.147-.21.368-.548.284.012.018-.87-.217-.87-.217l-.595 1.372 1.557.389c.29.073.574.148.853.219l-.494 1.984 1.198.298.494-1.982c.327.089.645.174.954.254l-.49 1.968 1.198.298.494-1.983c2.043.387 3.58.23 4.227-1.617.521-1.488-.026-2.345-1.101-2.903.783-.181 1.373-.697 1.53-1.756zm-2.73 3.837c-.37 1.489-2.878.684-3.69.481l.659-2.641c.812.203 3.414.604 3.031 2.16zm.371-3.858c-.337 1.353-2.427.666-3.104.498l.598-2.397c.677.168 2.857.484 2.506 1.899z"/></svg>' },
    { id: 1, name: 'ETH', amount: '0.3', color: '#627eea', status: 'active', svg: '<svg viewBox="0 0 24 24" fill="#627eea"><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.37 4.35zm.056-17.97l-7.37 12.21 7.37 4.36 7.37-4.36L12 0z"/></svg>' },
    { id: 2, name: 'SOL', amount: '12', color: '#14f195', status: 'active', svg: '<svg viewBox="0 0 24 24" fill="#14f195"><path d="M4.39 12l2.67-2.67c.39-.39 1.02-.39 1.41 0l4.66 4.66c.39.39 1.02.39 1.41 0L19.21 9.33c.39-.39.39-1.02 0-1.41l-2.67-2.67c-.39-.39-1.02-.39-1.41 0l-4.66 4.66c-.39.39-1.02.39-1.41 0L4.39 5.24c-.39-.39-.39-1.02 0-1.41l2.67-2.67c.39-.39 1.02-.39 1.41 0l4.66 4.66c.39.39 1.02.39 1.41 0l4.66-4.66c.39-.39 1.02-.39 1.41 0l2.67 2.67c.39.39.39 1.02 0 1.41l-4.66 4.66c-.39.39-1.02.39-1.41 0l-4.66-4.66c-.39-.39-1.02-.39-1.41 0L4.39 12z"/></svg>' },
    { id: 3, name: 'TON', amount: '250', color: '#0088cc', status: 'active', svg: '<svg viewBox="0 0 24 24" fill="#0088cc"><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zM7.11 8.533h9.78c.846 0 1.34.945.867 1.646l-4.89 7.234c-.422.624-1.312.624-1.734 0l-4.89-7.234c-.473-.701.021-1.646.867-1.646z"/></svg>' },
    { id: 4, name: 'PEPE', amount: 'FINISHED', color: '#3d9a24', status: 'finished', winner: '@CryptoDegen', svg: '<svg viewBox="0 0 24 24" fill="#3d9a24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7.5h2V12.5z"/></svg>' }
];

// --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ---
let currentIdx = 0;
let timeLeft = 6000; 
let energy = parseInt(localStorage.getItem('user_energy')) || 10;
const maxEnergy = 10;

// --- ИНИЦИАЛИЗАЦИЯ ---
window.onload = () => {
    // Скрываем лоадер через 1.5 сек
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        initGame();
    }, 1500);
};

function initGame() {
    updateCoinUI();
    updateEnergyUI();
    startTimer();
    
    // Главная кнопка
    const btn = document.getElementById('tap-btn');
    btn.addEventListener('click', (e) => handleTap(e));
    
    // Генерация случайных победителей в ленту
    generateFakeLeaders();
}

// --- ЛОГИКА ТАПА ---
function handleTap(e) {
    if (COINS[currentIdx].status === 'finished') return;

    if (energy > 0) {
        energy--;
        timeLeft = 6000; // Ресет таймера
        saveEnergy();
        updateEnergyUI();
        
        // Эффект вылетающей цифры
        createFlyEffect(e);
        
        // Вибрация
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
    } else {
        openShop();
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('error');
    }
}

function createFlyEffect(e) {
    const flyText = document.createElement('div');
    flyText.innerText = "+1";
    flyText.className = "fly-text";
    
    // Позиция тапа
    const x = e.clientX || e.touches[0].clientX;
    const y = e.clientY || e.touches[0].clientY;
    
    flyText.style.left = `${x}px`;
    flyText.style.top = `${y}px`;
    flyText.style.color = COINS[currentIdx].color;

    document.body.appendChild(flyText);

    // Удаляем после анимации
    setTimeout(() => flyText.remove(), 800);
}

// --- ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ---
function updateCoinUI() {
    const coin = COINS[currentIdx];
    const prizeElem = document.getElementById('prize-text');
    const btn = document.getElementById('tap-btn');
    const svgCont = document.getElementById('coin-icon-svg');

    svgCont.innerHTML = coin.svg;
    btn.className = `crypto-button shadow-${coin.name.toLowerCase()}`;

    if (coin.status === 'finished') {
        prizeElem.innerHTML = `<span style="color:#ff4444">RAFFLE OVER</span><br><small style="font-size:14px; color:#555">Winner: ${coin.winner}</small>`;
        btn.style.filter = "grayscale(1)";
        btn.style.opacity = "0.4";
    } else {
        prizeElem.innerHTML = `${coin.amount} <span style="color:${coin.color}">${coin.name}</span>`;
        btn.style.filter = "none";
        btn.style.opacity = "1";
    }

    // Подсветка в меню
    document.querySelectorAll('.coin-item').forEach((el, i) => {
        el.classList.toggle('active', i === currentIdx);
    });
}

function selectCoin(idx) {
    if (idx === currentIdx) return;
    currentIdx = idx;
    timeLeft = 6000;
    updateCoinUI();
    if (tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
}

// --- ТАЙМЕР ---
function startTimer() {
    setInterval(() => {
        const coin = COINS[currentIdx];
        if (coin.status === 'active' && timeLeft > 0) {
            timeLeft--;
            
            // Рандомная активность других "игроков"
            if (timeLeft < 5800 && Math.random() < 0.003) {
                timeLeft = 6000;
            }

            const sec = Math.floor(timeLeft / 100);
            const ms = timeLeft % 100;
            
            document.getElementById('main-timer').innerText = 
                `${sec.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
        } else if (coin.status === 'finished') {
             document.getElementById('main-timer').innerText = "00:00";
        }
    }, 10);
}

function updateEnergyUI() {
    document.getElementById('energy-val').innerText = energy;
    const btn = document.getElementById('tap-btn');
    if (energy <= 0) btn.style.border = "2px solid #ff4444";
    else btn.style.border = "12px solid #0a0a0a";
}

function saveEnergy() {
    localStorage.setItem('user_energy', energy);
}

// --- МАГАЗИН ---
function openShop() { document.getElementById('shop-modal').classList.remove('hidden'); }
function closeShop() { document.getElementById('shop-modal').classList.add('hidden'); }

async function buy(amount, method) {
    if (method === 'stars') {
        tg.showConfirm(`Buy ${amount} tries for ★ ${amount * 10}?`, (ok) => {
            if (ok) {
                // В будущем: переход к платежному шлюзу Stars
                processSuccess(amount);
            }
        });
    } else if (method === 'ton') {
        // Вызов функции из ton-logic.js
        if (typeof sendTonPayment === 'function') {
            const price = amount === 15 ? 0.3 : 1.5;
            const success = await sendTonPayment(price, "ВАШ_КОШЕЛЕК", "Energy Refill");
            if (success) processSuccess(amount);
        } else {
            tg.showAlert("TON Wallet not connected!");
        }
    }
}

function processSuccess(amount) {
    energy += amount;
    saveEnergy();
    updateEnergyUI();
    closeShop();
    tg.showAlert("Success! Energy refilled.");
}

function generateFakeLeaders() {
    const list = document.getElementById('leaders');
    const names = ['@dex_god', '@ton_whale', '@sol_king', '@lucky_tapper', '@anon_99'];
    list.innerHTML = names.map(n => `
        <div class="leader-item" style="display:flex; justify-content:space-between; font-size:12px; padding:5px 0; border-bottom:1px solid #111;">
            <span>${n}</span>
            <span class="yellow">LAST TAP!</span>
        </div>
    `).join('');
}
