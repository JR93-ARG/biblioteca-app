//! Importa el módulo mysql2/promise para trabajar con MySQL utilizando promesas
const mysql = require('mysql2/promise');

//! Crea un pool de conexiones a la base de datos MySQL
const pool = mysql.createPool({
  host: 'localhost',   // Dirección del servidor de la base de datos
  user: 'root',        // Nombre de usuario para conectarse a la base de datos
  password: '1234',    // Contraseña del usuario
  database: 'bibliotecalocal' // Nombre de la base de datos a la que se conecta
});

//! Exporta el pool de conexiones para que pueda ser utilizado en otros módulos
module.exports = pool;