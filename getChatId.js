const TelegramBot = require("node-telegram-bot-api");
const token = "6098399510:AAE9noNdk2SemHrasT7tSJM4hxceh_vtcQ4";
const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  console.log("Chat Id:", chatId);
});
