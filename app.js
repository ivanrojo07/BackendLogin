'use strict'
//librerias
// var http = require('http');
// var path = require('path');
var express = require('express');
var hogan = require('hogan-express');
// var mysql = require('mysql');
//var fs = require('fs');
var bodyParser = require('body-parser');
var api = require('./routes/usuario');

var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');

	next();
});

app.get('/prueba/:nombre?', (req,res)=>{
	if (req.params.nombre) {
		var nombre = req.params.nombre;
	}
	else{
		var nombre = "SIN NOMBRE";
	}

	res.status(200).send({
		data: [2,3,4],
		message: "Hola mundo con NODEJS y EXPRESS -"+nombre
	});
});

app.use('/api', api);

module.exports = app;