const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken'); // Adicionado para lidar com tokens JWT
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 4000;

// Habilitar o CORS
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Corrigido o endereço de origem
  methods: ['GET', 'POST'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
}));

app.use(bodyParser.urlencoded({ extended: true }));

// Rota para lidar com o envio de mensagens do formulário
app.post('/enviar-mensagem', async (req, res) => {
  try {
    // Aqui você pode adicionar o código para lidar com a lógica de envio de mensagem
    // Para este exemplo, vamos apenas enviar a solicitação para outra URL e retornar a resposta

    const response = await fetch('http://localhost:5500/enviar-mensagem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Adicione quaisquer outros cabeçalhos necessários aqui
      },
      body: JSON.stringify(req.body),
    });

    // Agora, envie a resposta de volta ao cliente
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erro ao enviar a mensagem:', error);
    res.status(500).json({ error: 'Erro ao enviar a mensagem' });
  }
});

// Configuração do SDK da AWS e do DynamoDB
AWS.config.update({ region: 'us-east-1' }); // Defina a região correta
const docClient = new AWS.DynamoDB.DocumentClient();

// Configuração do serviço de e-mail com nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'horusaiapp@gmail.com',
    pass: 'Yhwh2024@',
  },
});

// Rota para recuperar senhas do usuário atualmente autenticado
app.get('/recuperarSenhas', async (req, res) => {
  try {
    // Obtenha o identificador único do usuário autenticado (exemplo: ID de usuário do Amazon Cognito)
    const userId = req.headers['usuario-id']; // Supondo que você esteja enviando o ID de usuário como parte dos cabeçalhos da solicitação

    // Consulta ao DynamoDB usando o ID de usuário para recuperar as senhas associadas a esse usuário
    const params = {
      TableName: 'Senhas',
      KeyConditionExpression: 'titulo = :titulo',
      ExpressionAttributeValues: {
        ':titulo': userId,
      },
      ProjectionExpression: 'titulo, senha', // Projeção para incluir apenas os campos de título e senha
    };

    // Execute a consulta ao DynamoDB
    const data = await docClient.query(params).promise();

    // Envie os resultados de volta como resposta
    res.json(data.Items);
  } catch (error) {
    console.error('Erro ao recuperar senhas:', error);
    res.status(500).json({ error: 'Erro ao recuperar senhas' });
  }
});

// Inicie o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
