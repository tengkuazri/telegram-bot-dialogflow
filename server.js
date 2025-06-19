const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

const DIALOGFLOW_URL = process.env.DIALOGFLOW_URL; // Webhook endpoint dari Dialogflow

app.post('/telegram', async (req, res) => {
  const chatId = req.body.message.chat.id;
  const message = req.body.message.text;

  try {
    // Kirim ke Dialogflow webhook
    const dialogflowResponse = await axios.post(DIALOGFLOW_URL, {
      queryResult: {
        queryText: message
      }
    });

    const reply = dialogflowResponse.data.fulfillmentText || 'Maaf, saya tidak paham.';

    // Kirim balasan ke Telegram
    await axios.post(TELEGRAM_API, {
      chat_id: chatId,
      text: reply,
    });

    res.sendStatus(200);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }
});

app.get('/', (req, res) => {
  res.send('Bot is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
