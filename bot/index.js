import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

// Сюда вставь токен от @BotFather
const BOT_TOKEN = process.env.BOT_TOKEN || 'ТВОЙ_ТОКЕН_БОТА';
// Сюда вставь ссылку на твой Web App (после деплоя на Vercel/Netlify)
const WEB_APP_URL = 'https://your-crypto-button-app.vercel.app';

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  const startPayload = ctx.payload; // Это ID того, кто пригласил
  const userId = ctx.from.id;
  const userName = ctx.from.first_name;

  let welcomeMessage = `Hello, ${userName}! 🚀\n\nWelcome to the **Crypto Button** game! \n\n` +
    `💰 Prize: 0.01 BTC\n` +
    `⏱ Timer: 60 seconds\n` +
    `⚡ Attempts: 5 (Free)\n\n` +
    `Be the last person to click the button before the timer hits zero to win!`;

  if (startPayload) {
    // В реальном проекте здесь будет запрос к БД: "Начислить +5 попыток юзеру с ID = startPayload"
    console.log(`User ${userId} invited by ${startPayload}`);
    welcomeMessage += `\n\n🎁 You joined via referral link! Both of you get bonus attempts.`;
  }

  return ctx.replyWithMarkdownV2(
    welcomeMessage.replace(/\./g, '\\.').replace(/\!/g, '\\!').replace(/\-/g, '\\-'),
    Markup.inlineKeyboard([
      [Markup.button.webApp('🎮 PLAY NOW', WEB_APP_URL)],
      [Markup.button.url('📢 Join Channel', 'https://t.me/your_channel')],
      [Markup.button.switchToChat('🤝 Invite Friend', `Check out this game! I'm winning BTC!`) ]
    ])
  );
});

// Хендлер для оплаты Telegram Stars (задел на будущее)
bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));
bot.on('successful_payment', (ctx) => {
  ctx.reply('Payment successful! Your attempts have been added.');
});

bot.launch().then(() => {
  console.log('🚀 Bot is running!');
});

// Остановка бота при выключении сервера
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

