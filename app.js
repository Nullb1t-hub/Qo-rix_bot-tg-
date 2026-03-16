const tg = window.Telegram.WebApp;
tg.expand();

// Настройки монет
const COINS = [
    { name: 'BTC', amount: '0.01', color: '#f3ba2f', status: 'active', svg: '<svg viewBox="0 0 24 24" fill="#f3ba2f"><path d="M23.638 14.904c-1.391 5.589-7.031 9.005-12.621 7.614-5.589-1.391-9.005-7.031-7.614-12.621 1.391-5.589 7.031-9.005 12.621-7.614 5.59 1.391 9.005 7.031 7.614 12.621zm-6.333-3.032c.218-1.452-.887-2.234-2.397-2.755l.49-1.965-1.197-.298-.477 1.914c-.314-.078-.638-.152-.96-.225l.482-1.93-1.197-.298-.49 1.965c-.26-.06-.516-.117-.762-.178l.001-.005-1.65-.412-.319 1.278s.888.204.87.216c.484.12.572.441.557.696l-.558 2.238c.033.008.077.02.125.037l-.126-.031-.782 3.14c-.059.147-.21.368-.548.284.012.018-.87-.217-.87-.217l-.595 1.372 1.557.389c.29.073.574.148.853.219l-.494 1.984 1.198.298.494-1.982c.327.089.645.174.954.254l-.49 1.968 1.198.298.494-1.983c2.043.387 3.58.23 4.227-1.617.521-1.488-.026-2.345-1.101-2.903.783-.181 1.373-.697 1.53-1.756zm-2.73 3.837c-.37 1.489-2.878.684-3.69.481l.659-2.641c.812.203 3.414.604 3.031 2.16zm.371-3.858c-.337 1.353-2.427.666-3.104.498l.598-2.397c.677.168 2.857.484 2.506 1.899z"/></svg>' },
    { name: 'ETH', amount: '0.3', color: '#627eea', status: 'active', svg: '<svg viewBox="0 0 24 24" fill="#627eea"><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-1038-7.37 4.35zm.056-17.97l-7.37 12.21 7.37 4.36 7.37-4.36L12 0z"/></svg>' },
    { name: 'PEPE', amount: 'WINNER: @DegenKing', color: '#3d9a24', status: 'finished', winnerTries: '34,201', svg: '<svg viewBox="0 0 24 24" fill="#3d9a24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7.5h2V12.5z"/></svg>' }
];

let currentIdx = 0;
let timeLeft = 6000;
let energy = parseInt(localStorage.getItem('energy')) || 5;
let timerId = null;

// Инициализация при загрузке
window.onload = () => {
    // Симуляция загрузки
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('app').classList.remove('hidden');
        updateUI();
        startGlobalTimer();
    }, 2000);
};

function updateUI() {
    const coin = COINS[currentIdx];
    const btn = document.getElementById('tap-btn');
    const prize = document.getElementById('prize-text');
    
    document.getElementById('energy-val').innerText = energy;
    document.getElementById('coin-icon-svg').innerHTML = coin.svg;
    
    if (coin.status === 'finished') {
        prize.innerHTML = `<span class="text-red-500">FINISHED</span><br><small style="font-size:12px">Winner Tries: ${coin.winnerTries}</small>`;
        btn.classList.add('disabled');
        btn.onclick = null;
    } else {
        prize.innerHTML = `${coin.amount} <span style="color:${coin.color}">${coin.name}</span>`;
        btn.classList.remove('disabled');
        btn.onclick = handleTap;
    }
    
    // Меняем тень кнопки
    btn.className = `crypto-button shadow-${coin.name.toLowerCase()}`;
}

function handleTap() {
    if (energy > 0) {
        energy--;
        timeLeft = 6000; // Сброс на 60:00
        localStorage.setItem('energy', energy);
        updateUI();
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('heavy');
    } else {
        openShop();
    }
}

function startGlobalTimer() {
    setInterval(() => {
        if (COINS[currentIdx].status === 'active' && timeLeft > 0) {
            timeLeft--;
            // Рандомный сброс (имитация игроков)
            if (timeLeft < 5500 && Math.random() < 0.005) timeLeft = 6000;
            
            const sec = Math.floor(timeLeft / 100);
            const ms = timeLeft % 100;
            document.getElementById('main-timer').innerText = `${sec.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
        }
    }, 10);
}

function selectCoin(idx) {
    currentIdx = idx;
    timeLeft = 6000;
    updateUI();
    document.querySelectorAll('.coin-item').forEach((el, i) => {
        el.classList.toggle('active', i === idx);
    });
}

// Навигация на страницу аккаунта
function goToAccount() {
    window.location.href = 'account.html';
}

// Магазин
function openShop() { document.getElementById('shop-modal').classList.remove('hidden'); }
function closeShop() { document.getElementById('shop-modal').classList.add('hidden'); }

function buy(amount, type) {
    const price = type === 'ton' ? (amount === 10 ? 2 : 9.5) : (amount === 10 ? 500 : 2500);
    tg.showConfirm(`Buy ${amount} attempts for ${price} ${type.toUpperCase()}?`, (ok) => {
        if (ok) {
            energy += amount;
            localStorage.setItem('energy', energy);
            updateUI();
            tg.showAlert("Energy refilled!");
            closeShop();
        }
    });
}
