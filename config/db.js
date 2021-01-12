const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log('¡Conexión a DB exitosa!')
    } catch(error){
        console.log(error);
        process.exit(1); //Detener la app
    }
}

module.exports = conectarDB;