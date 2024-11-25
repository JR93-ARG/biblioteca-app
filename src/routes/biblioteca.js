const express = require('express');
const router = express.Router();
const pool = require('../db');

// Rutas para libros
router.post('/libros', async (req, res) => {
    const { titulo, autor, genero, anio } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO libros (titulo, autor, genero, anio, disponible) VALUES (?, ?, ?, ?, true)',
            [titulo, autor, genero, anio]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el libro' });
    }
});

router.get('/libros', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM libros');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los libros' });
    }
});

router.put('/libros/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, autor, genero, anio } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE libros SET titulo = ?, autor = ?, genero = ?, anio = ? WHERE id = ?',
            [titulo, autor, genero, anio, id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Libro no encontrado' });
        res.json({ message: 'Libro actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el libro' });
    }
});

router.delete('/libros/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM libros WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Libro no encontrado' });
        res.json({ message: 'Libro eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el libro' });
    }
});

// Rutas para miembros
router.post('/miembros', async (req, res) => {
    const { nombre, id } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO miembros (nombre, id) VALUES (?, ?)',
            [nombre, id]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el miembro' });
    }
});

router.get('/miembros', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM miembros');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los miembros' });
    }
});

router.delete('/miembros/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM miembros WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Miembro no encontrado' });
        res.json({ message: 'Miembro eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el miembro' });
    }
});

// Rutas para préstamos
router.post('/prestamos', async (req, res) => {
    const { idMiembro, idLibro } = req.body;
    try {
        // Marcar el libro como no disponible
        await pool.query('UPDATE libros SET disponible = false WHERE id = ?', [idLibro]);

        // Registrar el préstamo
        const [result] = await pool.query(
            'INSERT INTO prestamos (miembro_id, libro_id, fecha_prestamo) VALUES (?, ?, CURDATE())',
            [idMiembro, idLibro]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el préstamo' });
    }
});

// Rutas para devoluciones
router.post('/devoluciones', async (req, res) => {
    const { idMiembro, idLibro } = req.body;
    try {
        // Marcar el libro como disponible
        await pool.query('UPDATE libros SET disponible = true WHERE id = ?', [idLibro]);

        // Registrar la devolución
        await pool.query(
            'UPDATE prestamos SET fecha_devolucion = CURDATE() WHERE miembro_id = ? AND libro_id = ? AND fecha_devolucion IS NULL',
            [idMiembro, idLibro]
        );
        res.status(200).json({ message: 'Libro devuelto correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar la devolución' });
    }
});

module.exports = router;