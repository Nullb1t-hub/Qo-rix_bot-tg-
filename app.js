const tg = window.Telegram.WebApp;
tg.expand();

// Данные монет
const COINS = [
    { id: 0, name: 'BTC', amount: '0.01', color: '#f3ba2f', status: 'active', svg: '<svg viewBox="0 0 24 24" fill="#f3ba2f"><path d="M23.638 14.904c-1.391 5.589-7.031 9.005-12.621 7.614-5.589-1.391-9.005-7.031-7.614-12.621 1.391-5.589 7.031-9.005 12.621-7.614 5.59 1.391 9.005 7.031 7.614 12.621zm-6.333-3.032c.218-1.452-.887-2.234-2.397-2.755l.49-1.965-1.197-.298-.477 1.914c-.314-.078-.638-.152-.96-.225l.482-1.93-1.197-.298-.49 1.965c-.26-.06-.516-.117-.762-.178l.001-.005-1.65-.412-.319 1.278s.888.204.87.216c.484.12.572.441.557.696l-.558 2.238c.033.008.077.02.125.037l-.126-.031-.782 3.14c-.059.147-.21.368-.548.284.012.018-.87-.217-.87-.217l-.595 1.372 1.557.389c.29.073.574.148.853.219l-.494 1.984 1.198.298.494-1.982c.327.089.645.174.954.254l-.49 1.968 1.198.298.494-1.983c2.043.387 3.58.23 4.227-1.617.521-1.488-.026-2.345-1.101-2.903.783-.181 1.373-.697 1.53-1.756zm-2.73 3.837c-.37 1.489-2.878.684-3.69.481l.659-2.641c.812.203 3.414.604 3.031 2.16zm.371-3.858c-.337 1.353-2.427.666-3.104.498l.598-2.397c.677.168 2.857.484 2.506 1.899z"/></svg>' },
    { id: 1, name: 'ETH', amount: '0.3', color: '#627eea', status: 'active', svg: '<svg viewBox="0 0 24 24" fill="#627eea"><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.37 4.35zm.056-17.97l-7.37 12.21 7.37 4.36 7.37-4.36L12 0z"/></svg>' },
    { id: 2, name: 'SOL', amount: '12', color: '#14f195', status: 'active', svg: '<svg viewBox="0 0 24 24" fill="#14f195"><path d="M4.39 12l2.67-2.67c.39-.39 1.02-.39 1.41 0l4.66 4.66c.39.39 1.02.39 1.41 0L19.21 9.33c.39-.39.39-1.02 0-1.41l-2.67-2.67c-.39-.39-1.02-.39-1.41 0l-4.66 4.66c-.39.39-1.02.39-1.41 0L4.39 5.24c-.39-.39-.39-1.02 0-1.41l2.67-2.67c.39-.39 1.02-.39 1.41 0l4.66 4.66c.39.39 1.02.39 1.41 0l4.66-4.66c.39-.39 1.02-.39 1.41 0l2.67 2.67c.39.39.39 1.02 0 1.41l-4.66 4.66c-.39.39-1.02.39-1.41 0l-4.66-4.66c-.39-.39-1.02-.39-1.41 0L4.39 12z"/></svg>' },
    { id: 3, name: 'TON', amount: '250', color: '#0088cc', status: 'active', svg: '<svg viewBox="0 0 24 24" fill="#0088cc"><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zM7.11 8.533h9.78c.846 0 1.34.945.867 1.646l-4.89 7.234c-.422.624-1.312.624-1.734 0l-4.89-7.234c-.473-.701.021-1.646.867-1.646z"/></svg>' },
    { id: 4, name: 'PEPE', amount: 'FINISHED', color: '#3d9a24', status: 'finished', winner: '@CryptoBoss', svg: '<svg viewBox="0 0 24 24" fill="#3d9a24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7.5h2V12.5z"/></svg>' }
];

let currentIdx = 0;
let timeLeft = 6000; 
let energy = parseInt(localStorage.getItem('user_energy')) || 10;
let timerRunning = false;

// Инициализация при старте
window.onload = () => {
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
    
    // Вешаем клик на главную кнопку
    const btn = document.getElementById('tap-btn');
    btn.addEventListener('click', handleTap);
    
    // Онлайн счетчик
    setInterval(() => {
        const count = Math.floor(Math.random() * (4500 - 3200) + 3200);
        document.getElementById('online-count').innerText = count.toLocaleString();
    }, 3000);
}

function updateCoinUI() {
    const coin = COINS[currentIdx];
    const prizeElem = document.getElementById('prize-text');
    const btn = document.getElementById('tap-btn');
    const svgCont = document.getElementById('coin-icon-svg');

    svgCont.innerHTML = coin.svg;
    btn.className = `crypto-button shadow-${coin.name.toLowerCase()}`;

    if (coin.status === 'finished') {
        prizeElem.innerHTML = `<span style="color:#ff4444">ROUND FINISHED</span><br><small style="font-size:12px">Winner: ${coin.winner}</small>`;
        btn.style.opacity = "0.3";
        btn.style.pointerEvents = "none";
    } else {
        prizeElem.innerHTML = `${coin.amount} <span style="color:${coin.color}">${coin.name}</span>`;
        btn.style.opacity = "1";
        btn.style.pointerEvents = "auto";
    }

    // Подсветка активной монеты в меню
    document.querySelectorAll('.coin-item').forEach((el, i) => {
        el.classList.toggle('active', i === currentIdx);
    });
}

function selectCoin(idx) {
    currentIdx = idx;
    timeLeft = 6000;
    updateCoinUI();
    if (tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
}

function handleTap() {
    if (energy > 0) {
        energy--;
        timeLeft = 6000; // Сброс таймера на 60:00
        saveEnergy();
        updateEnergyUI();
        
        // Анимация кнопки
        const btn = document.getElementById('tap-btn');
        btn.style.transform = 'scale(0.92)';
        setTimeout(() => btn.style.transform = 'scale(1)', 100);

        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
    } else {
        openShop();
    }
}

function startTimer() {
    setInterval(() => {
        if (COINS[currentIdx].status === 'active' && timeLeft > 0) {
            timeLeft--;
            
            // Имитация перебивания таймера другими (редко)
            if (timeLeft < 5000 && Math.random() < 0.002) {
                timeLeft = 6000;
            }

            const totalMs = timeLeft;
            const sec = Math.floor(totalMs / 100);
            const ms = totalMs % 100;
            
            document.getElementById('main-timer').innerText = 
                `${sec.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
        }
    }, 10);
}

function updateEnergyUI() {
    document.getElementById('energy-val').innerText = energy;
    const btn = document.getElementById('tap-btn');
    if (energy <= 0) {
        btn.classList.add('disabled');
    } else {
        btn.classList.remove('disabled');
    }
}

function saveEnergy() {
    localStorage.setItem('user_energy', energy);
}

function openShop() { document.getElementById('shop-modal').classList.remove('hidden'); }
function closeShop() { document.getElementById('shop-modal').classList.add('hidden'); }

// Функция покупки (пока заглушка под Stars)
function buy(amount, method) {
    const price = method === 'stars' ? (amount === 10 ? 50 : 200) : (amount === 10 ? 0.5 : 2);
    
    tg.showConfirm(`Purchase ${amount} tries for ${price} ${method.toUpperCase()}?`, (ok) => {
        if (ok) {
            // Тут будет вызов tg.openInvoice для Stars
            energy += amount;
            saveEnergy();
            updateEnergyUI();
            closeShop();
            tg.showAlert("Success! Your energy has been refilled.");
        }
    });
}
