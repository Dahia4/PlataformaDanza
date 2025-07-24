const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');  // Para manejar sesiones
const bodyParser = require('body-parser');   // Para procesar formularios
const path = require('path');

const app = express();
const port = 3000;

// Middleware para procesar datos de formularios
app.use(bodyParser.urlencoded({ extended: false }));

// Configurar carpeta pública
app.use(express.static('public'));
app.use(express.json());

// Configurar sesión
app.use(session({
  secret: 'tu_clave_secreta_aqui',
  resave: false,
  saveUninitialized: true
}));

// Conexión a SQLite
const db = new sqlite3.Database('mi_base.db');

// Crear tabla usuarios y agregar usuario admin si no existe
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

  db.get("SELECT * FROM usuarios WHERE username = ?", ['admin'], (err, row) => {
    if (err) {
      console.error(err);
    }
    if (!row) {
      db.run("INSERT INTO usuarios (username, password) VALUES (?, ?)", ['admin', '1234']);
    }
  });
});

// Datos básicos de estilos de danza (puedes luego guardar en base de datos)
const estilos = [
  { id: 1, nombre: 'Hip Hop', descripcion: 'El hip hop es un movimiento cultural y artístico originado en la década de 1970 en el Bronx, Nueva York, por comunidades afroamericanas y latinas. Más allá de ser simplemente un género musical, el hip hop engloba cuatro elementos principales: el rap (MCing), la música DJ/turntablism, el breakdance (B-boying) y el grafiti. El hip hop se caracteriza por su ritmo fuerte y enérgico, sus letras con contenido social y narrativo, sus movimientos de baile expresivos y sus expresiones artísticas visuales.' },
  { id: 2, nombre: 'Jazz', descripcion: 'El jazz es un género musical que se originó a finales del siglo XIX y principios del XX en Nueva Orleans, Estados Unidos. Se caracteriza por su uso de la improvisación, ritmos sincopados y una fusión de influencias africanas y europeas. El jazz ha evolucionado a lo largo de las décadas, dando lugar a numerosos subgéneros como el bebop, el cool jazz y el jazz fusion.' },
  { id: 3, nombre: 'Clásico', descripcion: 'La danza clásica, también conocida como ballet, es un estilo de danza que se basa en técnicas y principios formales. Se originó en las cortes reales de Europa durante el Renacimiento y ha evolucionado a lo largo de los siglos. El ballet se caracteriza por su énfasis en la técnica, la precisión y la expresión artística a través del movimiento.' },
  { id: 4, nombre: 'Contemporáneo', descripcion: 'La danza contemporánea es un estilo de danza que se desarrolló en el siglo XX y se caracteriza por su enfoque en la expresión individual y la fusión de diferentes técnicas y estilos. A menudo incorpora elementos de improvisación y se aleja de las estructuras formales del ballet clásico.' }
];

// Endpoint para obtener lista de estilos (protegido)
app.get('/api/estilos', authMiddleware, (req, res) => {
  res.json(estilos);
});

// Endpoint para obtener detalle de un estilo por id (protegido)
app.get('/api/estilos/:id', authMiddleware, (req, res) => {
  const estilo = estilos.find(e => e.id === parseInt(req.params.id));
  if (estilo) {
    res.json(estilo);
  } else {
    res.status(404).json({ error: 'Estilo no encontrado' });
  }
});

// Endpoint para obtener alumnos (protegido)
app.get('/api/alumnos', authMiddleware, (req, res) => {
  db.all("SELECT * FROM alumnos", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});



app.post('/api/asistencias', authMiddleware, (req, res) => {
  const alumnoId = req.session.userId;
  const { fecha, presente } = req.body;

  const query = `INSERT INTO asistencias (alumno_id, fecha, presente) VALUES (?, ?, ?)`;
  db.run(query, [alumnoId, fecha, presente ? 1 : 0], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Asistencia guardada', id: this.lastID });
  });
});

app.get('/api/asistencias', authMiddleware, (req, res) => {
  const alumnoId = req.session.userId;

  const query = `SELECT fecha, presente FROM asistencias WHERE alumno_id = ? ORDER BY fecha DESC`;
  db.all(query, [alumnoId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});



// Ruta para mostrar la página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

// Procesar formulario de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM usuarios WHERE username = ? AND password = ?", [username, password], (err, user) => {
    if (err) {
      return res.status(500).send('Error en el servidor');
    }
    if (user) {
      // Guardar en sesión
      req.session.userId = user.id;
      res.redirect('/'); // Redirige a página principal (protegida)
    } else {
      res.send('Usuario o contraseña incorrectos');
    }
  });
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Middleware para proteger rutas privadas (por ejemplo /)
function authMiddleware(req, res, next) {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Proteger la página principal con middleware
app.get('/', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});


