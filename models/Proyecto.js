const mongoose = require('mongoose');

const ProyectoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true //elimina espacios en blanco
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId, //el id del usuario
        ref: 'Usuario',
        required: true
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Proyecto', ProyectoSchema);