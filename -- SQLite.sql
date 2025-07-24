-- SQLite
CREATE TABLE IF NOT EXISTS asistencias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  alumno_id INTEGER,
  fecha TEXT,
  presente BOOLEAN,
  FOREIGN KEY (alumno_id) REFERENCES usuarios(id)
);

