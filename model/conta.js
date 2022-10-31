const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContaSchema = new Schema({
    cpf: {
        type: String, 
        required: [true, 'CPF Obrigatório']},
    pontos: {
        type: Number, 
        required: [true, 'Pontos Obrigatório']},
});

// Exportar o modelo
module.exports = mongoose.model('conta', ContaSchema);