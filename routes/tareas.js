const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//Creacion de proyectos
// -> api/tareas
router.post('/',
    auth,
    [
        check('nombre','El nombre de la tarea es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

router.get('/',
    auth, //Validamos que este autenticado
    tareaController.obtenerTareas
);

router.put('/:id',
    auth, //Validamos que este autenticado
    [
        check('nombre','El nombre de la tarea es obligatorio').not().isEmpty(), //para que no ponga uno nuevo vacío
        check('proyecto','El proyecto de la tarea es obligatorio').not().isEmpty() //esto es para nosotros
    ],
    tareaController.actualizarTarea
);

router.delete('/:id',
    auth, //Validamos que este autenticado
    tareaController.eliminarTarea
);

module.exports = router;