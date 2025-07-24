// Cargamos el módulo de SQLite
const sqlite3 = require('sqlite3').verbose();

// Creamos o abrimos la base de datos 'mi_base.db'
const db = new sqlite3.Database('mi_base.db');

// Ejecutamos instrucciones dentro de la base de datos
db.serialize(() => {
  // Creamos una tabla llamada 'usuarios' si no existe
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT
  )`);

  // Insertamos un usuario con nombre "Dahiana"
  db.run("INSERT INTO usuarios(nombre) VALUES (?)", ['Dahiana']);

  // Mostramos los usuarios registrados en consola
  db.each("SELECT id, nombre FROM usuarios", (err, row) => {
    if (err) {
      console.error("Error al consultar:", err.message);
    } else {
      console.log(`Usuario ${row.id}: ${row.nombre}`);
    }
  });
});

// Cerramos la base de datos al final
db.close();
