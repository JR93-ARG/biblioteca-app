const apiUrlLibros = 'http://localhost:3000/api/libros';
const apiUrlMiembros = 'http://localhost:3000/api/miembros';
const apiUrlPrestamos = 'http://localhost:3000/api/prestamos';
const apiUrlDevoluciones = 'http://localhost:3000/api/devoluciones';

// Función para cargar todos los libros
async function loadLibros() {
  const response = await fetch(apiUrlLibros);
  if (!response.ok) {
    console.error('Error al cargar los libros:', response.statusText);
    return;
  }
  const libros = await response.json();
  
  const itemTableBody = document.getElementById('tabla-libros').querySelector('tbody');
  itemTableBody.innerHTML = ''; // Limpia la tabla

  libros.forEach(libro => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${libro.titulo}</td>
      <td>${libro.autor}</td>
      <td>${libro.genero}</td>
      <td>${libro.anio}</td>
      <td>${libro.disponible ? 'Disponible' : 'No Disponible'}</td>
    `;
    itemTableBody.appendChild(row);
  });

  // Cargar libros en el selector de préstamos
  const libroSelect = document.getElementById('libro-select');
  const libroSelectDevolucion = document.getElementById('libro-select-devolucion');
  libroSelect.innerHTML = '<option value="">Seleccione un libro</option>';
  libroSelectDevolucion.innerHTML = '<option value="">Seleccione un libro</option>';
  libros.forEach(libro => {
    if (libro.disponible) {
      const option = document.createElement('option');
      option.value = libro.id;
      option.textContent = libro.titulo;
      libroSelect.appendChild(option);
    }
    const optionDevolucion = document.createElement('option');
    optionDevolucion.value = libro.id;
    optionDevolucion.textContent = libro.titulo;
    libroSelectDevolucion.appendChild(optionDevolucion);
  });
}

// Función para cargar todos los miembros
async function loadMiembros() {
  const response = await fetch(apiUrlMiembros);
  if (!response.ok) {
    console.error('Error al cargar los miembros:', response.statusText);
    return;
  }
  const miembros = await response.json();
  
  const itemTableBody = document.getElementById('tabla-miembros').querySelector('tbody');
  itemTableBody.innerHTML = ''; // Limpia la tabla

  miembros.forEach(miembro => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${miembro.nombre}</td>
      <td>${miembro.id}</td>
    `;
    itemTableBody.appendChild(row);
  });

  // Cargar miembros en el selector de préstamos
  const miembroSelect = document.getElementById('miembro-select');
  const miembroSelectDevolucion = document.getElementById('miembro-select-devolucion');
  miembroSelect.innerHTML = '<option value="">Seleccione un miembro</option>';
  miembroSelectDevolucion.innerHTML = '<option value="">Seleccione un miembro</option>';
  miembros.forEach(miembro => {
    const option = document.createElement('option');
    option.value = miembro.id;
    option.textContent = miembro.nombre;
    miembroSelect.appendChild(option);
    const optionDevolucion = document.createElement('option');
    optionDevolucion.value = miembro.id;
    optionDevolucion.textContent = miembro.nombre;
    miembroSelectDevolucion.appendChild(optionDevolucion);
  });
}

// Función para guardar un libro
async function guardarLibro(event) {
  event.preventDefault();
  const titulo = document.getElementById('titulo').value;
  const autor = document.getElementById('autor').value;
  const genero = document.getElementById('genero').value;
  const anio = document.getElementById('anio').value;

  const data = { titulo, autor, genero, anio };

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  const response = await fetch(apiUrlLibros, options);
  if (!response.ok) {
    console.error('Error al guardar el libro:', response.statusText);
    return;
  }
  loadLibros();
}

// Función para guardar un miembro
async function guardarMiembro(event) {
  event.preventDefault();
  const nombre = document.getElementById('nombre-miembro').value;
  const id = document.getElementById('id-miembro').value;

  const data = { nombre, id };

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  const response = await fetch(apiUrlMiembros, options);
  if (!response.ok) {
    console.error('Error al guardar el miembro:', response.statusText);
    return;
  }
  loadMiembros();
}

// Función para tomar prestado un libro
async function tomarPrestado(event) {
  event.preventDefault();
  const idMiembro = document.getElementById('miembro-select').value;
  const idLibro = document.getElementById('libro-select').value;

  const data = { idMiembro, idLibro };

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  const response = await fetch(apiUrlPrestamos, options);
  if (!response.ok) {
    console.error('Error al tomar prestado el libro:', response.statusText);
    return;
  }
  loadLibros();
  document.getElementById('mensaje').textContent = 'Libro tomado prestado correctamente';
}

// Función para devolver un libro
async function devolverLibro(event) {
  event.preventDefault();
  const idMiembro = document.getElementById('miembro-select-devolucion').value;
  const idLibro = document.getElementById('libro-select-devolucion').value;

  const data = { idMiembro, idLibro };

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  const response = await fetch(apiUrlDevoluciones, options);
  if (!response.ok) {
    console.error('Error al devolver el libro:', response.statusText);
    return;
  }
  loadLibros();
  document.getElementById('mensaje').textContent = 'Libro devuelto correctamente';
}

// Inicializa el evento de envío del formulario
document.getElementById('form-libros').addEventListener('submit', guardarLibro);
document.getElementById('form-miembros').addEventListener('submit', guardarMiembro);
document.getElementById('form-prestamo').addEventListener('submit', tomarPrestado);
document.getElementById('form-devolucion').addEventListener('submit', devolverLibro);
document.addEventListener("DOMContentLoaded", () => {
  loadLibros();
  loadMiembros();
});