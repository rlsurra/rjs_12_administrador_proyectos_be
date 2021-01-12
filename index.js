const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

//Creacion del servidor
const app = express();

//Conectar a la base de datos
conectarDB();

//Habilitar CORS
app.use(cors());

//Habilitar express.json para leer datos que el usuario coloque. Otra opción es body parser.
app.use(express.json({extend: true}));

//Puerto de la app
const PORT = process.env.PORT || 4000

//Definir la página principal
app.get('/', (req, res) => {
    res.send('Hola mundo');
})

//Importar rutas
app.use('/api/usuarios', require('./routes/usuarios')); //Cada uno de estos es un middleware
app.use('/api/auth', require('./routes/auth')); //Cada uno de estos es un middleware
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

//Arrancar la app
app.listen(PORT, () => {
    console.log(`El servidor está funcionando en el puerto ${PORT}`);
});