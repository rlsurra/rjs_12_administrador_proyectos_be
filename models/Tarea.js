const mongoose = require('mongoose');

const TareaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true //elimina espacios en blanco
    },
    estado: {
        type: Boolean,
        default: false
    },
    creado: {
        type: Date,
        default: Date.now()
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId, //el id del usuario
        ref: 'Proyecto',
        required: true
    }
});

module.exports = mongoose.model('Tarea', TareaSchema);