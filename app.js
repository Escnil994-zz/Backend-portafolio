'use strict'

//Cargar módulos de Node para crear el servidor
var express = require('express');
var body_parser = require('body-parser');

//Ejecutar express para trabajar con https
var app = express();

//Cargar ficheros rutas

var projects_routes = require('./routes/projects');

//Cargar MiddleWares
app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());


//Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Añadir prefijos a rutas -- Cargar rutas

app.use(projects_routes);

//Exportar el modulo (fichero actual)

module.exports = app