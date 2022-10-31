const express = require('express');
const bodyParser = require('body-parser');

const app = express();


const Conta = require('./model/conta')

const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27017/';
const database_name = 'MinhaLojaDB';
const collection_name= 'Fidelidade'
var db;
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            console.log('ERRO: não foi possível conectar à base de dados ` ' + database_name + ' `.');
            throw error;
        }
        db = client.db(database_name).collection(collection_name);
        console.log('Conectado à base de dados ` ' + database_name + ' `!');
    });
//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// Retorna todas as contas
app.get('/Conta', (req, res, next) => {
    db.find({}).toArray((err, result) => {
        if (err) return console.log("Error: " + err);
        res.send(result);
    });
});

// Retorna uma conta associada a um CPF
app.get('/Conta/:cpf', (req, res, next) => {
    const result = db.findOne({ "cpf": req.params.cpf }, (err, result) => {
    if (err) return console.log("Conta não encontrada")
    res.send(result);
    });
});

// Cria uma nova conta no programa de fidelidade
app.post('/Conta', (req, res, next) => {
    var conta = new Conta({
        "cpf": req.body.cpf,
        "pontos": req.body.pontos
     });
    db.insertOne(conta, (err, result) => {
        if (err) return console.log("Error: " + err);
        console.log('Conta cadastrada com sucesso no BD!');
        res.send('Conta cadastrada com sucesso no BD!');
    });
});

// Atualiza a pontuação de uma conta
app.put('/Conta/:cpf', (req, res, next) => {
    db.updateOne({"cpf": req.params.cpf }, {
        $set: {
          "pontos": req.body.pontos
       }
    }, (err, result) => {
        if (err) return console.log("Error: " + err);
        console.log('Pontuação de usuário atualizada com sucesso no BD!');
        res.send('Pontuação de usuário atualizada com sucesso no BD!');
    });
});

// Remove a conta de um cliente
app.delete('/Conta/:cpf', (req, res, next) => {
    db.deleteOne({cpf: req.params.cpf },(err, result) => {
        if (err) return console.log("Error: " + err);
        console.log('Conta de usuário removida do BD!');
        res.send('Conta de usuário removida do BD!');
    });
});

//Servidor
let porta = 8090;
app.listen(porta, () => {
 console.log('Servidor em execução na porta: ' + porta);
});
