# 💃 Plataforma de Gestión para Academias de Danza

Una aplicación web diseñada para optimizar la gestión académica de academias de danza, permitiendo el acceso a información sobre estilos, control de asistencia y funcionalidades para alumnos y administradores.

## 🌟 Funcionalidades principales

- Registro e inicio de sesión con control de sesión.
- Listado visual de estilos de danza con imágenes.
- Página detallada de cada estilo (nombre, descripción, imagen).
- Registro y consulta de asistencia por parte del alumno.
- Validación de formularios.
- Manejo de errores (404, errores del servidor).
- Interfaz amigable y responsive usando Bootstrap.

## 🛠️ Tecnologías utilizadas

- **Node.js** + **Express**: Backend y servidor web.
- **SQLite** / **MySQL**: Base de datos para usuarios, estilos y asistencia.
- **Bootstrap 5**: Diseño responsive y visual atractivo.
- **JavaScript**: Funcionalidad dinámica en frontend y backend.
- **HTML/CSS**: Estructura y estilos de las páginas.

## 📂 Estructura del proyecto
PlataformaDanza/
├── public/ # Archivos estáticos (HTML, CSS, imágenes)
│ ├── img/ # Imágenes de los estilos de danza
│ ├── index.html # Página principal
│ └── estilo.html # Página de detalle por estilo
├── routes/ # Rutas de la API
│ └── estilos.js
├── db/ # Base de datos SQLite o conexión MySQL
│ └── mi_base.db
├── app.js # Servidor principal con Express
└── README.md # Este archivo
