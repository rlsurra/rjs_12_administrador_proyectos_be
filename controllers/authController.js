const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {

    //Revisamos la validación de express en routes
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({msg: errores.array()[0].msg})
    }

    const { email, password } = req.body;

    try {
        //Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email });
        if(usuario === null){
            return res.status(400).json({msg: "El usuario no existe"});
        }

        //Validamos el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if(!passCorrecto){
            return res.status(400).json({msg: "El password es incorrecto"});
        }

        //Creamos el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //Firmo el token
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 // segundos -> 1 hora
        }, (error, token) => {
            if(error) throw error;

            return res.status(200).json({
                token
            });
        });
        
    } catch (error) {
        console.log(error);
    }
}

exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({usuario})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'})
    }
}