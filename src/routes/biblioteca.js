// Importa el módulo express
const express = require('express');
// Crea un router de Express
const router = express.Router();
// Importa el pool de conexiones a la base de datos desde el archivo db.js
const pool = require('../db');

//! Rutas para libros

// !Ruta para crear un nuevo libro
router.post('/libros', async (req, res) => {
    // Extrae los datos del libro del cuerpo de la solicitud
    const { titulo, autor, genero, anio } = req.body;
    try {
        // Inserta un nuevo libro en la base de datos
        const [result] = await pool.query(
            'INSERT INTO libros (titulo, autor, genero, anio, disponible) VALUES (?, ?, ?, ?, true)',
            [titulo, autor, genero, anio]
        );
        // Responde con el ID del nuevo libro creado
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        // Maneja errores y responde con un mensaje de error
        res.status(500).json({ error: 'Error al crear el libro' });
    }
});

//! Ruta para obtener todos los libros
router.get('/libros', async (req, res) => {
    try {
        // Consulta todos los libros en la base de datos
        const [rows] = await pool.query('SELECT * FROM libros');
        // Responde con los datos de los libros
        res.json(rows);
    } catch (error) {
        // Maneja errores y responde con un mensaje de error
        res.status(500).json({ error: 'Error al obtener los libros' });
    }
});

// Rutas para miembros

//! Ruta para crear un nuevo miembro
router.post('/miembros', async (req, res) => {
    // Extrae los datos del miembro del cuerpo de la solicitud
    const { nombre, id } = req.body;
    try {
        // Inserta un nuevo miembro en la base de datos
        const [result] = await pool.query(
            'INSERT INTO miembros (nombre, id) VALUES (?, ?)',
            [nombre, id]
        );
        // Responde con el ID del nuevo miembro creado
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        // Maneja errores y responde con un mensaje de error
        res.status(500).json({ error: 'Error al crear el miembro' });
    }
});

//! Ruta para obtener todos los miembros
router.get('/miembros', async (req, res) => {
    try {
        // Consulta todos los miembros en la base de datos
        const [rows] = await pool.query('SELECT * FROM miembros');
        // Responde con los datos de los miembros
        res.json(rows);
    } catch (error) {
        // Maneja errores y responde con un mensaje de error
        res.status(500).json({ error: 'Error al obtener los miembros' });
    }
});



//! Rutas para préstamos

//! Ruta para registrar un préstamo
router.post('/prestamos', async (req, res) => {
    // Extrae los datos del préstamo del cuerpo de la solicitud
    const { idMiembro, idLibro } = req.body;
    try {
        // Marcar el libro como no disponible
        await pool.query('UPDATE libros SET disponible = false WHERE id = ?', [idLibro]);

        // Registrar el préstamo en la base de datos
        const [result] = await pool.query(
            'INSERT INTO prestamos (miembro_id, libro_id, fecha_prestamo) VALUES (?, ?, CURDATE())',
            [idMiembro, idLibro]
        );
        // Responde con el ID del nuevo préstamo creado
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        // Maneja errores y responde con un mensaje de error
        res.status(500).json({ error: 'Error al registrar el préstamo' });
    }
});

//! Rutas para devoluciones

//! Ruta para registrar una devolución
router.post('/devoluciones', async (req, res) => {
    // Extrae los datos de la devolución del cuerpo de la solicitud
    const { idMiembro, idLibro } = req.body;
    try {
        // Verificar que el miembro que devuelve el libro sea el mismo que lo pidió prestado
        const [rows] = await pool.query(
            'SELECT * FROM prestamos WHERE miembro_id = ? AND libro_id = ? AND fecha_devolucion IS NULL',
            [idMiembro, idLibro]
        );

        // Si no se encuentra el préstamo, responde con un error
        if (rows.length === 0) {
            return res.status(400).json({ error: 'El miembro no tiene este libro prestado o ya fue devuelto' });
        }

        // Marcar el libro como disponible
        await pool.query('UPDATE libros SET disponible = true WHERE id = ?', [idLibro]);

        // Registrar la devolución en la base de datos
        await pool.query(
            'UPDATE prestamos SET fecha_devolucion = CURDATE() WHERE miembro_id = ? AND libro_id = ? AND fecha_devolucion IS NULL',
            [idMiembro, idLibro]
        );
        // Responde con un mensaje de éxito
        res.status(200).json({ message: 'Libro devuelto correctamente' });
    } catch (error) {
        // Maneja errores y responde con un mensaje de error
        res.status(500).json({ error: 'Error al registrar la devolución' });
    }
});

//! Exporta el router para que pueda ser utilizado en otros módulos
module.exports = router;