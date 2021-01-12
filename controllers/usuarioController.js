const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

    //Revisamos la validación de express en routes
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()})
    }

    //Extraigo email y password
    const {email, password } = req.body;


    try {
        let usuario = await Usuario.findOne({ email });

        //console.log(usuario);

        if(usuario !== null){
            return res.status(400).json({
                msg: 'El usuario ya existe'
            });
        }
        //Guardar el nuevo usuario
        usuario = new Usuario(req.body);

        //Hasheamos el password
        const salt = await bcryptjs.genSalt(10); //10 es el numero de bits, + nro, + memoria
        usuario.password = await bcryptjs.hash(password, salt);

        await usuario.save();

        //Creo el jwt
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
        return res.status(400).json({
            msg: 'Hubo un error: ${error}'
        });
    }
}