require('dotenv').config(); // Adicione esta linha no início do seu arquivo server.js

const http = require('http');
const ngrok = require('@ngrok/ngrok');
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const port = 8080;

// Configurações do Twilio
const accountSid = '';
const authToken = '';
const client = new twilio(accountSid, authToken);

// Usar bodyParser para interpretar os dados de requisições POST
app.use(bodyParser.urlencoded({ extended: false }));

// Rota para receber mensagens do WhatsApp
app.post('/whatsapp', (req, res) => {
  const incomingMsg = req.body.Body.toLowerCase();
  const from = req.body.From;

  let responseMsg;

  if (incomingMsg.includes('olá')) {
    responseMsg = 'Olá! Como posso te ajudar hoje?';
  } else if (incomingMsg.includes('tchau')) {
    responseMsg = 'Tchau! Tenha um ótimo dia!';
  } else {
    responseMsg = 'Desculpe, não entendi sua mensagem. Você pode dizer "olá" ou "tchau".';
  }

  client.messages
    .create({
      body: responseMsg,
      from: 'whatsapp:+18608651858',  // Número de sandbox do Twilio exemplo
      to: from
    })
    .then(message => console.log(`Mensagem enviada: ${message.sid}`))
    .catch(err => console.error(err));

  res.send('Mensagem recebida');
});

// Criar o servidor
http.createServer(app).listen(port, async () => {
  console.log(`Servidor Node.js rodando na porta ${port}...`);
  
  // Conectar ao ngrok
  const url = await ngrok.connect({ addr: port, authtoken: process.env.NGROK_AUTHTOKEN });
  console.log(`Ingress established at: ${url}`);
});
