const express = require('express');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

async function enviarProducto(email) {
  await transporter.sendMail({
    from: EMAIL_USER,
    to: email,
    subject: 'Tu producto digital',
    text: 'Gracias por tu compra. Aquí tienes tu producto.',
  });
}

// Webhook Mercado Pago
app.post('/webhook', async (req, res) => {
  const paymentId = req.body?.data?.id;
  if (!paymentId) return res.sendStatus(200);

  const mpRes = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    }
  );

  const payment = await mpRes.json();

  if (payment.status === 'approved') {
    const emailCliente = payment.payer.email;
    await enviarProducto(emailCliente);
  }

  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('SERVIDOR ACTIVO ');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor corriendo');
});
