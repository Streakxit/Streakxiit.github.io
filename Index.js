 const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

// VARIABLES (aunque estén vacías por ahora)
const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || null;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// Función de entrega
async function enviarProducto(email) {
  await transporter.sendMail({
    from: EMAIL_USER,
    to: email,
    subject: 'Tu producto digital',
    text: 'Gracias por tu compra. Aquí está tu producto.',
  });
}

// WEBHOOK (modo simulación)
app.post('/webhook', async (req, res) => {
  console.log('Webhook recibido:', req.body);

  // SIMULACIÓN DE PAGO APROBADO
  const emailCliente = req.body?.email;

  if (emailCliente) {
    await enviarProducto(emailCliente);
    console.log('Producto enviado a', emailCliente);
  }

  res.sendStatus(200);
});

// Test rápido
app.get('/test-email', async (req, res) => {
  const email = req.query.email;
  if (!email) return res.send('Falta ?email=');

  await enviarProducto(email);
  res.send('Email enviado');
});

app.get('/', (req, res) => {
  res.send('Servidor activo 🚀 (sin token)');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor corriendo');
});
