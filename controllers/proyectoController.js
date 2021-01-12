const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {

    //Revisamos errores de validación
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    try {
        //Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);
        //Obtenemos el usuario a partir de JWT
        proyecto.creador = req.usuario.id;
        //Guardamos el proyecto
        proyecto.save();
        res.status(200).send(proyecto)
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

//Obtenemos proyectos del usuario
exports.obtenerProyectos = async (req, res) => {

    try {
        const proyectos = await Proyecto.find({creador: req.usuario.id}).sort({creado: -1}); //El -1 hace el orden inverso
        res.status(200).json({proyectos});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

//Actualizamos proyectos del usuario
exports.actualizarProyecto = async (req, res) => {

    //Revisamos errores de validación
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    //Extraer la información del proyecto
    const {nombre} = req.body;
    const nuevoProyecto = {};

    if(nombre !== null){
        nuevoProyecto.nombre = nombre;
    }

    try {
        //Revisamos que el proyecto exista
        let proyecto = await Proyecto.findById(req.params.id);

        if(proyecto === null){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Obtenemos el creador y lo validamos con la persona autenticada
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'Acción no autorizada'});
        }

        //Actualizamos el proyecto
        console.log('id: ' + req.params.id + ' | ' + nuevoProyecto.nombre );
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set : nuevoProyecto }, { new: true })

        res.status(200).json({msg : 'El proyecto se actualizó en forma exitosa'})

    } catch (error) {
        console.log(error);
        res.status(500).json({msg : 'Hubo un error'});
    }

}

//Obtenemos proyectos del usuario
exports.eliminarProyecto = async (req, res) => {

    try {
        //Revisamos que el proyecto exista
        let proyecto = await Proyecto.findById(req.params.id);

        if(proyecto === null){
            return res.status(404).json({msg: 'Proyecto no encontrado'});
        }

        //Obtenemos el creador y lo validamos con la persona autenticada
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'Acción no autorizada'});
        }

        //Actualizamos el proyecto
        proyecto = await Proyecto.findOneAndRemove({ _id: req.params.id })
 
        res.status(200).json({msg : 'El proyecto se eliminó en forma exitosa'})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}