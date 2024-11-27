// Importa el módulo express
const express = require('express');
// Importa el módulo cors para habilitar CORS (Cross-Origin Resource Sharing)
const cors = require('cors');
// Importa el módulo body-parser para analizar el cuerpo de las solicitudes
const bodyParser = require('body-parser');
// Importa las rutas de la biblioteca desde el archivo biblioteca.js
const bibliotecaRoutes = require('./routes/biblioteca');

// Crea una instancia de la aplicación Express
const app = express();
// Define el puerto en el que el servidor escuchará, usando una variable de entorno o el puerto 3000 por defecto
const PORT = process.env.PORT || 3000;

//! Habilita CORS para permitir solicitudes desde otros dominios
app.use(cors());
//! Configura body-parser para analizar cuerpos de solicitudes en formato JSON
app.use(bodyParser.json());
//! Sirve archivos estáticos desde el directorio 'public'
app.use(express.static('public'));

//! Rutas de la API
// Usa las rutas definidas en bibliotecaRoutes para todas las rutas que comienzan con '/api'
app.use('/api', bibliotecaRoutes);

//! Iniciar el servidor
// Hace que la aplicación escuche en el puerto definido y muestra un mensaje en la consola cuando el servidor está en funcionamiento
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});