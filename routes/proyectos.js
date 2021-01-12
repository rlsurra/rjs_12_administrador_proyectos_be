const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

//Creacion de proyectos
// -> api/proyectos
router.post('/',
    auth,
    [
        check('nombre','El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);

router.get('/',
    auth, //Validamos que este autenticado
    proyectoController.obtenerProyectos
);

router.put('/:id',
    auth, //Validamos que este autenticado
    [
        check('nombre','El nombre del proyecto es obligatorio').not().isEmpty() //para que no ponga uno nuevo vacío
    ],
    proyectoController.actualizarProyecto
);

router.delete('/:id',
    auth, //Validamos que este autenticado
    proyectoController.eliminarProyecto
);

module.exports = router;