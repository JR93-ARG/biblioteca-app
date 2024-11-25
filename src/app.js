const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bibliotecaRoutes = require('./routes/biblioteca');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Rutas de la API
app.use('/api', bibliotecaRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});