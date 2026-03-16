// Инициализация TON Connect UI
const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://raw.githubusercontent.com/' + window.location.pathname.split('/')[1] + '/' + window.location.pathname.split('/')[2] + '/main/tonconnect-manifest.json',
    buttonRootId: 'ton-connect-account' // ID из файла account.html или create.html
});

// Функция для отправки транзакции (Оплата листинга или энергии)
async function sendTonPayment(amount, destinationAddress, comment) {
    const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // 60 секунд на подтверждение
        messages: [
            {
                address: destinationAddress, // Твой кошелек, куда придут деньги
                amount: (amount * 1000000000).toString(), // Перевод из TON в наноТОНы
                payload: "" // Можно добавить коммент в будущем через boc
            }
        ]
    };

    try {
        const result = await tonConnectUI.sendTransaction(transaction);
        tg.showAlert("Transaction sent successfully!");
        return true;
    } catch (e) {
        console.error(e);
        tg.showAlert("Transaction canceled or failed.");
        return false;
    }
}

// Проверка подключения кошелька
tonConnectUI.onStatusChange(wallet => {
    if (wallet) {
        const address = wallet.account.address;
        localStorage.setItem('user_wallet', address);
        console.log("Wallet connected:", address);
        // Если мы на странице аккаунта, можно обновить UI
        if(document.getElementById('acc-wallet-status')) {
            document.getElementById('acc-wallet-status').innerText = "CONNECTED";
        }
    } else {
        localStorage.removeItem('user_wallet');
    }
});
