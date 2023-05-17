const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const fetch = require("node-fetch");
const schedule = require("node-schedule");

const token = "TELEGRAM)BOT_TOKEN";
const bot = new TelegramBot(token);

let chatId;

/// Define keyboard buttons
bot.onText(/\/start/, (msg, match) => {
  chatId = msg.chat.id;
  const userId = msg.from.id;
  if (userId !== 964403295) {
    bot.sendMessage(chatId, "Sorry, you are not authorized to use this bot.");
    return;
  }
  console.log(userId);
  const message = "Welcome to MotivNow bot! Please select an option:";
  bot.sendMessage(chatId, message, {
    reply_markup: {
      keyboard: [
        [{ text: "Get Message" }],
        [{ text: "Help" }],
        [{ text: "Clear" }],
      ],
      resize_keyboard: true,
    },
  });
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (messageText === "Get Message") {
    console.log("Get Message button clicked");
    try {
      fetchImage()
        .then((imageUrl) => {
          return fetchRandomQuote().then((quote) => {
            const escapedQuote = quote.replace(/\./g, "\\.");
            bot.sendPhoto(chatId, imageUrl, {
              caption: escapedQuote,
              parse_mode: "MarkdownV2",
              reply_markup: {
                keyboard: [
                  [{ text: "Get Message" }],
                  [{ text: "Help" }],
                  [{ text: "Clear" }],
                ],
                resize_keyboard: true,
              },
            });
          });
        })
        .catch((error) => {
          console.error("Error sending message:", error.message);
          bot.sendMessage(
            chatId,
            "Sorry, there was an error sending the message. Please try again later.",
            {
              reply_markup: {
                keyboard: [
                  [{ text: "Get Message" }],
                  [{ text: "Help" }],
                  [{ text: "Clear" }],
                ],
                resize_keyboard: true,
              },
            }
          );
        });
    } catch (error) {
      console.error("Error sending message:", error.message);
      bot.sendMessage(
        chatId,
        "Sorry, there was an error sending the message. Please try again later.",
        {
          reply_markup: {
            keyboard: [
              [{ text: "Get Message" }],
              [{ text: "Help" }],
              [{ text: "Clear" }],
            ],
            resize_keyboard: true,
          },
        }
      );
    }
  } else if (messageText === "Help") {
    const helpMessage =
      "This bot allows you to receive random messages with a quote and an image that is close to the context of the given quote.\n\nTo receive a message, simply type or press button 'Get Message'.\n\nTo clear the feed, simply type or press 'Clear'.";
    bot.sendMessage(chatId, helpMessage, {
      reply_markup: {
        keyboard: [
          [{ text: "Get Message" }],
          [{ text: "Help" }],
          [{ text: "Clear" }],
        ],
        resize_keyboard: true,
      },
    });
  } else if (messageText === "Clear") {
    bot.sendMessage(chatId, "Feed cleared.", {
      reply_markup: {
        remove_keyboard: false,
      },
    });
  } // Schedule message sending at random times in the morning and afternoon
  schedule.scheduleJob(
    { hour: getRandomHour(9, 11), minute: getRandomMinute() },
    () => {
      sendScheduledMessage(chatId);
    }
  );
  schedule.scheduleJob(
    { hour: getRandomHour(13, 17), minute: getRandomMinute() },
    () => {
      sendScheduledMessage(chatId);
    }
  );
});

// Function to send scheduled message
function sendScheduledMessage(chatId) {
  try {
    fetchImage()
      .then((imageUrl) => {
        return fetchRandomQuote().then((quote) => {
          const escapedQuote = quote.replace(/\./g, "\\.");
          bot.sendPhoto(chatId, imageUrl, {
            caption: escapedQuote,
            parse_mode: "MarkdownV2",
            reply_markup: {
              keyboard: [
                [{ text: "Get Message" }],
                [{ text: "Help" }],
                [{ text: "Clear" }],
              ],
              resize_keyboard: true,
            },
          });
        });
      })
      .catch((error) => {
        console.error("Error sending message:", error.message);
        bot.sendMessage(
          chatId,
          "Sorry, there was an error sending the message. Please try again later.",
          {
            reply_markup: {
              keyboard: [
                [{ text: "Get Message" }],
                [{ text: "Help" }],
                [{ text: "Clear" }],
              ],
              resize_keyboard: true,
            },
          }
        );
      });
  } catch (error) {
    console.error("Error sending message:", error.message);
    bot.sendMessage(
      chatId,
      "Sorry, there was an error sending the message. Please try again later.",
      {
        reply_markup: {
          keyboard: [
            [{ text: "Get Message" }],
            [{ text: "Help" }],
            [{ text: "Clear" }],
          ],
          resize_keyboard: true,
        },
      }
    );
  }
}

// Function to generate a random hour within the specified range
function getRandomHour(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Function to generate a random minute (0 - 59)
function getRandomMinute() {
  return Math.floor(Math.random() * 60);
}

//ZenQuotes API
function fetchRandomQuote() {
  return axios
    .get("https://zenquotes.io/api/random")
    .then((response) => response.data[0].q);
}
//Unsplash api
function fetchImage() {
  const apikey = "UNSPLASH_API_KEY";
  const url =
    "https://api.unsplash.com/photos/random?query=nature&orientation=landscape";
  return axios
    .get(url, {
      headers: {
        Authorization: `Client-ID ${apikey}`,
      },
    })
    .then((response) => response.data.urls.regular);
}

// Start the bot
bot.on("polling_error", (error) => {
  console.error("Polling error:", error);
});
bot.startPolling();
console.log("Bot is running...");
