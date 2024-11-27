//! Definición de las URLs de las APIs para libros, miembros, préstamos y devoluciones
const apiUrlLibros = 'http://localhost:3000/api/libros';
const apiUrlMiembros = 'http://localhost:3000/api/miembros';
const apiUrlPrestamos = 'http://localhost:3000/api/prestamos';
const apiUrlDevoluciones = 'http://localhost:3000/api/devoluciones';

//! Función para cargar todos los libros desde la API
async function loadLibros() {
  // Realiza una solicitud GET a la API de libros
  const response = await fetch(apiUrlLibros);
  // Verifica si la respuesta no es exitosa
  if (!response.ok) {
    // Muestra un mensaje de error en la consola
    console.error('Error al cargar los libros:', response.statusText);
    return;
  }
  // Convierte la respuesta a formato JSON
  const libros = await response.json();
  
  // Obtiene el cuerpo de la tabla de libros y lo limpia
  const itemTableBody = document.getElementById('tabla-libros').querySelector('tbody');
  itemTableBody.innerHTML = ''; // Limpia la tabla

  // Itera sobre cada libro y crea una fila en la tabla
  libros.forEach(libro => {
    const row = document.createElement('tr');
    // Define el contenido HTML de la fila con los datos del libro
    row.innerHTML = `
      <td>${libro.titulo}</td>
      <td>${libro.autor}</td>
      <td>${libro.genero}</td>
      <td>${libro.anio}</td>
      <td>${libro.disponible ? 'Disponible' : 'No Disponible'}</td>
    `;
    // Añade la fila a la tabla
    itemTableBody.appendChild(row);
  });

  // Obtiene los selectores de libros para préstamos y devoluciones
  const libroSelect = document.getElementById('libro-select');
  const libroSelectDevolucion = document.getElementById('libro-select-devolucion');
  // Limpia los selectores y añade una opción por defecto
  libroSelect.innerHTML = '<option value="">Seleccione un libro</option>';
  libroSelectDevolucion.innerHTML = '<option value="">Seleccione un libro</option>';
  // Itera sobre cada libro y añade opciones a los selectores
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

//! Función para cargar todos los miembros desde la API
async function loadMiembros() {
  // Realiza una solicitud GET a la API de miembros
  const response = await fetch(apiUrlMiembros);
  // Verifica si la respuesta no es exitosa
  if (!response.ok) {
    // Muestra un mensaje de error en la consola
    console.error('Error al cargar los miembros:', response.statusText);
    return;
  }
  // Convierte la respuesta a formato JSON
  const miembros = await response.json();
  
  // Obtiene el cuerpo de la tabla de miembros y lo limpia
  const itemTableBody = document.getElementById('tabla-miembros').querySelector('tbody');
  itemTableBody.innerHTML = ''; // Limpia la tabla

  // Itera sobre cada miembro y crea una fila en la tabla
  miembros.forEach(miembro => {
    const row = document.createElement('tr');
    // Define el contenido HTML de la fila con los datos del miembro
    row.innerHTML = `
      <td>${miembro.nombre}</td>
      <td>${miembro.id}</td>
    `;
    // Añade la fila a la tabla
    itemTableBody.appendChild(row);
  });

  // Obtiene los selectores de miembros para préstamos y devoluciones
  const miembroSelect = document.getElementById('miembro-select');
  const miembroSelectDevolucion = document.getElementById('miembro-select-devolucion');
  // Limpia los selectores y añade una opción por defecto
  miembroSelect.innerHTML = '<option value="">Seleccione un miembro</option>';
  miembroSelectDevolucion.innerHTML = '<option value="">Seleccione un miembro</option>';
  // Itera sobre cada miembro y añade opciones a los selectores
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

//! Función para guardar un nuevo libro en la API
async function guardarLibro(event) {
  event.preventDefault(); // Previene el comportamiento por defecto del formulario
  // Obtiene los valores de los campos del formulario
  const titulo = document.getElementById('titulo').value;
  const autor = document.getElementById('autor').value;
  const genero = document.getElementById('genero').value;
  const anio = document.getElementById('anio').value;

  // Crea un objeto con los datos del libro
  const data = { titulo, autor, genero, anio };

  // Configura las opciones de la solicitud POST
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  // Realiza la solicitud POST a la API de libros
  const response = await fetch(apiUrlLibros, options);
  // Verifica si la respuesta no es exitosa
  if (!response.ok) {
    // Muestra un mensaje de error en la consola
    console.error('Error al guardar el libro:', response.statusText);
    return;
  }
  // Recarga la lista de libros
  loadLibros();
}

//! Función para guardar un nuevo miembro en la API
async function guardarMiembro(event) {
  event.preventDefault(); // Previene el comportamiento por defecto del formulario
  // Obtiene los valores de los campos del formulario
  const nombre = document.getElementById('nombre-miembro').value;
  const id = document.getElementById('id-miembro').value;

  // Crea un objeto con los datos del miembro
  const data = { nombre, id };

  // Configura las opciones de la solicitud POST
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  // Realiza la solicitud POST a la API de miembros
  const response = await fetch(apiUrlMiembros, options);
  // Verifica si la respuesta no es exitosa
  if (!response.ok) {
    // Muestra un mensaje de error en la consola
    console.error('Error al guardar el miembro:', response.statusText);
    return;
  }
  // Recarga la lista de miembros
  loadMiembros();
}

//! Función para tomar prestado un libro
async function tomarPrestado(event) {
  event.preventDefault(); // Previene el comportamiento por defecto del formulario
  // Obtiene los valores seleccionados de los selectores
  const idMiembro = document.getElementById('miembro-select').value;
  const idLibro = document.getElementById('libro-select').value;

  // Crea un objeto con los datos del préstamo
  const data = { idMiembro, idLibro };

  // Configura las opciones de la solicitud POST
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  // Realiza la solicitud POST a la API de préstamos
  const response = await fetch(apiUrlPrestamos, options);
  // Verifica si la respuesta no es exitosa
  if (!response.ok) {
    // Muestra un mensaje de error en la consola
    console.error('Error al tomar prestado el libro:', response.statusText);
    return;
  }
  // Recarga la lista de libros y muestra un mensaje de éxito
  loadLibros();
  document.getElementById('mensaje').textContent = 'Libro tomado prestado correctamente';
}

//! Función para devolver un libro
async function devolverLibro(event) {
  event.preventDefault(); // Previene el comportamiento por defecto del formulario
  // Obtiene los valores seleccionados de los selectores
  const idMiembro = document.getElementById('miembro-select-devolucion').value;
  const idLibro = document.getElementById('libro-select-devolucion').value;

  // Crea un objeto con los datos de la devolución
  const data = { idMiembro, idLibro };

  // Configura las opciones de la solicitud POST
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  // Realiza la solicitud POST a la API de devoluciones
  const response = await fetch(apiUrlDevoluciones, options);
  // Verifica si la respuesta no es exitosa
  if (!response.ok) {
    // Muestra un mensaje de error en la consola
    console.error('Error al devolver el libro:', response.statusText);
    return;
  }
  // Recarga la lista de libros y muestra un mensaje de éxito
  loadLibros();
  document.getElementById('mensaje').textContent = 'Libro devuelto correctamente';
}

//! Inicializa el evento de envío del formulario para cada formulario específico
document.getElementById('form-libros').addEventListener('submit', guardarLibro);
document.getElementById('form-miembros').addEventListener('submit', guardarMiembro);
document.getElementById('form-prestamo').addEventListener('submit', tomarPrestado);
document.getElementById('form-devolucion').addEventListener('submit', devolverLibro);

//! Carga los datos de libros y miembros cuando el documento está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  loadLibros();
  loadMiembros();
});