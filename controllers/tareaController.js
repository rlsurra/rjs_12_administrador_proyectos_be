const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

//Creamos una tarea
exports.crearTarea = async (req, res) => {

    //Revisamos errores de validación
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    //Chequeamos que el proyecto exista
    const {proyecto} = req.body;

    try {
        //Chequeamos que el proyecto exista
        const existeProyecto = await Proyecto.findById(proyecto);
        if(existeProyecto === null){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }
        //Chequeamos que el usuario sea el creador del proyecto
        console.log(existeProyecto.creador.toString());
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'Acción no autorizada'});
        }
        //Crear un nuevo tarea
        const tarea = new Tarea(req.body);
        tarea.save();
        //Agregado de una tarea
        res.status(200).send(tarea)
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

//Obtenemos tareas del usuario
exports.obtenerTareas = async (req, res) => {

    try {
        //Chequeamos que el proyecto exista
        const {proyecto} = req.query; //Se pasa por params
        console.log(req.query);
        const existeProyecto = await Proyecto.findById(proyecto);
        //proyecto tiene que tener lo que espera un objid id que son determinada cantidad de caracteres, sino sale por el catch
        if(existeProyecto === null){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }
        //Obtenemos las tareas
        const tareas = await Tarea.find({proyecto}).sort({creado: -1}); //El -1 hace el orden inverso
        res.status(200).json({tareas});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

//Actualizamos tareas del usuario
exports.actualizarTarea = async (req, res) => {

    try {

        const {nombre, estado} = req.body;

        //Chequeamos que la tarea exista, el proyecto no es necesario chequear porque sino no existiría la tarea        
        const existeTarea = await Tarea.findById(req.params.id);
        if(existeTarea === null){
            return res.status(404).json({msg: 'Tarea no encontrada'});
        }

        //Creamos el nuevo objeto
        let nuevaTarea = {};
        if(nombre){
            nuevaTarea.nombre = nombre
        }
        nuevaTarea.estado = estado

        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true })

        res.status(200).json(tarea)

    } catch (error) {
        console.log(error);
        res.status(500).json({msg : 'Hubo un error'});
    }

}

exports.eliminarTarea = async (req, res) => {

    try {

        const {nombre, estado} = req.body;

        //Chequeamos que la tarea exista, el proyecto no es necesario chequear porque sino no existiría la tarea        
        const existeTarea = await Tarea.findById(req.params.id);
        if(existeTarea === null){
            return res.status(404).json({msg: 'Tarea no encontrada'});
        }

        tarea = await Tarea.findOneAndRemove({ _id: req.params.id });

        res.status(200).json({msg : 'La tarea se eliminó en forma exitosa'})

    } catch (error) {
        console.log(error);
        res.status(500).json({msg : 'Hubo un error'});
    }

}