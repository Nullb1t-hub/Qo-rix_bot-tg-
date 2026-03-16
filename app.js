const tg = window.Telegram.WebApp;
tg.expand();

// Данные монет с SVG кодами (чтобы иконки не ломались)
const COINS = [
    { name: 'BTC', amount: '0.01', color: '#f3ba2f', shadow: 'shadow-btc', svg: '<svg viewBox="0 0 24 24" fill="#f3ba2f" width="100" height="100"><path d="M23.638 14.904c-1.391 5.589-7.031 9.005-12.621 7.614-5.589-1.391-9.005-7.031-7.614-12.621 1.391-5.589 7.031-9.005 12.621-7.614 5.59 1.391 9.005 7.031 7.614 12.621zm-6.333-3.032c.218-1.452-.887-2.234-2.397-2.755l.49-1.965-1.197-.298-.477 1.914c-.314-.078-.638-.152-.96-.225l.482-1.93-1.197-.298-.49 1.965c-.26-.06-.516-.117-.762-.178l.001-.005-1.65-.412-.319 1.278s.888.204.87.216c.484.12.572.441.557.696l-.558 2.238c.033.008.077.02.125.037l-.126-.031-.782 3.14c-.059.147-.21.368-.548.284.012.018-.87-.217-.87-.217l-.595 1.372 1.557.389c.29.073.574.148.853.219l-.494 1.984 1.198.298.494-1.982c.327.089.645.174.954.254l-.49 1.968 1.198.298.494-1.983c2.043.387 3.58.23 4.227-1.617.521-1.488-.026-2.345-1.101-2.903.783-.181 1.373-.697 1.53-1.756zm-2.73 3.837c-.37 1.489-2.878.684-3.69.481l.659-2.641c.812.203 3.414.604 3.031 2.16zm.371-3.858c-.337 1.353-2.427.666-3.104.498l.598-2.397c.677.168 2.857.484 2.506 1.899z"/></svg>' },
    { name: 'ETH', amount: '0.3', color: '#627eea', shadow: 'shadow-eth', svg: '<svg viewBox="0 0 24 24" fill="#627eea" width="100" height="100"><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.37 4.35zm.056-17.97l-7.37 12.21 7.37 4.36 7.37-4.36L12 0z"/></svg>' },
    { name: 'SOL', amount: '5', color: '#14f195', shadow: 'shadow-sol', svg: '<svg viewBox="0 0 24 24" fill="#14f195" width="100" height="100"><path d="M4.39 12l2.67-2.67c.39-.39 1.02-.39 1.41 0l4.66 4.66c.39.39 1.02.39 1.41 0L19.21 9.33c.39-.39.39-1.02 0-1.41l-2.67-2.67c-.39-.39-1.02-.39-1.41 0l-4.66 4.66c-.39.39-1.02.39-1.41 0L4.39 5.24c-.39-.39-.39-1.02 0-1.41l2.67-2.67c.39-.39 1.02-.39 1.41 0l4.66 4.66c.39.39 1.02.39 1.41 0l4.66-4.66c.39-.39 1.02-.39 1.41 0l2.67 2.67c.39.39.39 1.02 0 1.41l-4.66 4.66c-.39.39-1.02.39-1.41 0l-4.66-4.66c-.39-.39-1.02-.39-1.41 0L4.39 12z"/></svg>' },
    { name: 'TON', amount: '150', color: '#0088cc', shadow: 'shadow-ton', svg: '<svg viewBox="0 0 24 24" fill="#0088cc" width="100" height="100"><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zM7.11 8.533h9.78c.846 0 1.34.945.867 1.646l-4.89 7.234c-.422.624-1.312.624-1.734 0l-4.89-7.234c-.473-.701.021-1.646.867-1.646z"/></svg>' },
    { name: 'PEPE', amount: '100M', color: '#3d9a24', shadow: 'shadow-pepe', svg: '<svg viewBox="0 0 24 24" fill="#3d9a24" width="100" height="100"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7.5h2V12.5z"/></svg>' }
];

let currentCoinIdx = 0;
let timeLeft = 6000; // 60.00 секунд
let attempts = 5;
let online = 3500;
let timerRunning = false;

// 1. ПРЕЛОАДЕР (Загрузка)
window.addEventListener('load', () => {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(interval);
            document.getElementById('loader').classList.add('hidden');
            document.getElementById('app').classList.remove('hidden');
            startGame();
        }
    }, 200);
});

function startGame() {
    timerRunning = true;
    updateCoinUI();
    runTimer();
    runOnline();
    updateLeaderboard();
}

// 2. ТАЙМЕР 60:00:00
function runTimer() {
    setInterval(() => {
        if (!timerRunning) return;
        
        if (timeLeft > 0) {
            timeLeft--;
            // Имитация перебивания другими игроками (сброс на 33-59 сек)
            if (timeLeft < 5800 && timeLeft > 3300 && Math.random() < 0.004) {
                timeLeft = 6000;
            }
        } else {
            // Если время вышло - кто-то выиграл, переход к след. монете
            timeLeft = 6000;
            selectCoin((currentCoinIdx + 1) % COINS.length);
        }
        
        const totalSec = Math.floor(timeLeft / 100);
        const ms = timeLeft % 100;
        document.getElementById('main-timer').innerText = `${totalSec.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
    }, 10);
}

// 3. ОБНОВЛЕНИЕ UI МОНЕТЫ
function selectCoin(idx) {
    currentCoinIdx = idx;
    // Обновляем активный класс в сетке
    document.querySelectorAll('.coin-item').forEach((el, i) => {
        el.classList.toggle('active', i === idx);
        el.style.backgroundColor = i === idx ? COINS[idx].color : '';
    });
    updateCoinUI();
}

function updateCoinUI() {
    const coin = COINS[currentCoinIdx];
    const prizeText = document.getElementById('prize-text');
    const tapBtn = document.getElementById('tap-btn');
    
    prizeText.innerHTML = `${coin.amount} <span style="color: ${coin.color}">${coin.name}</span>`;
    document.getElementById('coin-icon-svg').innerHTML = coin.svg;
    
    // Смена цвета тени кнопки
    tapBtn.className = `crypto-button shadow-${coin.name.toLowerCase()}`;
    document.querySelector('.coin-spinner').style.background = coin.color;
    document.querySelector('.coin-spinner').style.boxShadow = `0 0 30px ${coin.color}`;
}

// 4. ЛОГИКА ТАПА
function handleTap() {
    if (attempts > 0) {
        attempts--;
        timeLeft = 6000; // Сброс таймера
        document.getElementById('energy-val').innerText = attempts;
        
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
        
        // Анимация кнопки
        const btn = document.getElementById('tap-btn');
        btn.style.transform = 'scale(0.9)';
        setTimeout(() => btn.style.transform = 'scale(1)', 100);
    } else {
        openShop();
    }
}

// 5. УМНЫЙ ОНЛАЙН
function runOnline() {
    setInterval(() => {
        const diff = Math.floor(Math.random() * 100) - 50;
        online = Math.min(Math.max(online + diff, 2000), 13000);
        document.getElementById('online-count').innerText = online.toLocaleString();
    }, 2000);
}

// 6. МАГАЗИН И ПРOЧЕЕ
function openShop() { document.getElementById('shop-modal').classList.remove('hidden'); }
function closeShop() { document.getElementById('shop-modal').classList.add('hidden'); }

function invite() {
    attempts += 5;
    document.getElementById('energy-val').innerText = attempts;
    tg.showAlert("Friends invited! +5 Energy added.");
}

function updateLeaderboard() {
    const leaders = [
        { n: 'Killer77', t: '00:04' },
        { n: 'TopG', t: '00:12' },
        { n: 'MoonWalker', t: '00:21' },
        { n: 'DegenLife', t: '00:35' },
        { n: 'Richie', t: '00:52' }
    ];
    document.getElementById('leaders').innerHTML = leaders.map((l, i) => `
        <div style="display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid #222; font-size:12px;">
            <span>${i+1}. ${l.n}</span>
            <span style="color:var(--btc)">${l.t}</span>
        </div>
    `).join('');
}

// Делаем функции глобальными для HTML
window.selectCoin = selectCoin;
window.handleTap = handleTap;
window.openShop = openShop;
window.closeShop = closeShop;
window.invite = invite;
