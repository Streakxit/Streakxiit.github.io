const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Servidor funcionando ✅");
});

app.get("/pago-ok", (req, res) => {
  res.send(`
    <h1>Pago confirmado 🎉</h1>
    <p>Gracias por tu compra</p>
    <a href="https://tu-link-del-producto.com">Descargar producto</a>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor activo en puerto " + PORT);
});
