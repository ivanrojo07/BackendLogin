'use strict'

var Usuario = require('../models/usuario');
var connection = require('../conexion/conexion');
var DATABASE = 'login';
var TABLE = 'usuarios';
var sha1 = require('sha1');

function prueba (req, res){
	if (req.params.nombre) {
		var nombre = req.params.nombre;
	}
	else{
		var nombre = 'mundo';
	}

	res.status(200).send({
		message: "Hola "+nombre
	});
}

function loginUsuario(req, res) {
	// body...
	var email = req.body.email;
	var password = sha1(req.body.password);
	var sql = 'SELECT * FROM '+TABLE+' WHERE email = '+email+' and password = '+password;
	console.log(sql);

	// var query = connection.query('SELECT * FROM '+TABLE+' WHERE email = ?', [email], function(error,results,fields) {
	// 	if (error) {
	// 		console.log("error");
	// 		res.status(400).send({ failed : "Error ocurred "});
	// 	} else {
	// 		if (results.length > 0) {
	// 			if ([1].password == password) {
	// 				console.log("Logeado");
	// 				res.status(200).send({ success : "Usuario logeado"});
	// 			} 
	// 			else {
	// 				console.log("no coinciden");
	// 				res.status(204).send({ success: "Correo y Contraseña no coinciden"});
	// 			}
	// 		} 
	// 		else {
	// 			console.log("correo no existe");
	// 			res.status(204).send({ success : "El Correo no existe"});
	// 		}
	// 	}
	// });
	connection.query('SELECT * FROM '+TABLE+' WHERE email = ? AND password = ?', [email, password], function(error, results, fields){
		if (error) {
			res.status(400).send({ failed : "Error con el servidor"});

		} 
		if (results == "") {
			res.status(200).send({ failed : "El usuario o la contraseña son incorrectas" });
		}
		else {
			res.status(200).send({ success : "Usuario logeado " });
		}
	})
}

function getUsuarios (req, res){

	var query = connection.query(`SELECT ${TABLE}.nombre, ${TABLE}.apellido, ${TABLE}.email FROM ${DATABASE}.${TABLE} ORDER BY idusuario DESC;`, 
		function(error, results, fields){
		if(error){
			res.status(500).send({message: "Error en la consulta"});
			throw error;
		}
		else{
			res.status(200).send({usuarios:results});
			// console.log(fields);
		}
	});
	// var sql = `SELECT ${TABLE}.nombre, ${TABLE}.apellido, ${TABLE}.email FROM ${DATABASE}.${TABLE};`;
	// res.status(200).send({ usuarios: sql});

}

function getUsuario(req, res) {
	var usuarioId = req.params.id;

	var query = connection.query(`SELECT ${TABLE}.nombre, ${TABLE}.apellido, ${TABLE}.email FROM ${DATABASE}.${TABLE} WHERE idusuario =${usuarioId}`, function(error, result, field){
		if (error) {
			res.status(500).send({message: "Error en la consulta"});
		} 
		else {
			res.status(200).send({usuario: result});
		}
	});
}

function saveUsuario(req, res) {
	// body...
	var usuario = new Usuario();
	var params = req.body;

	usuario.nombre = params.nombre;
	usuario.apellido = params.apellido;
	usuario.email = params.email;
	usuario.password = sha1(params.password);
	console.log(sha1(usuario.password));
	var query = connection.query('INSERT INTO '+DATABASE+'.'+TABLE+' SET ?', usuario, function(error, results, fields){
		if (error) throw error;
		else{
			res.status(200).send({ usuario: usuario});
		}
	});
	// console.log(query.sql);

	// res.status(200).send({ sql: sql});

	// console.log("POST: "+usuario.nombre);


}

function updateUsuario(req, res) {
	// body...
	var usuarioId = req.params.id;
	var update = req.body;
	var sql = `UPDATE ${TABLE} SET`;
	if (update.nombre) {
		sql += ` nombre = '${update.nombre}',`;
	} 
	if (update.apellido) {
		sql += ` apellido = '${update.apellido}',`;
	}
	if (update.email) {
		sql += ` email = '${update.email}',`;
	}
	if (update.password) {
		sql += ` password = '${sha1(update.password)}' `;
	}
	sql = sql.substring(0, sql.length-1);
	sql += ` WHERE idusuario = ${usuarioId};`;
	var query = connection.query(sql, function(error, result, field){
		if (error) {
			res.status(400).send({ message: "Error de conexión"});
		} 
		else {
			connection.query(`SELECT ${TABLE}.nombre, ${TABLE}.apellido, ${TABLE}.email FROM ${DATABASE}.${TABLE} WHERE idusuario =${usuarioId}`, function(error, result, field){
				if (error) {
					res.status(500).send({message: "Error en la consulta"});
				} 
				else {
					res.status(200).send({usuario : result});
				}
			});
		}
	});
	// res.send({sql : sql});
}

function deleteUsuario(req, res) {
	// body...
	var usuarioId = req.params.id;
	connection.query('DELETE FROM '+TABLE+' WHERE idusuario = ?', [usuarioId], function(error, result, field){
		if (error) {
			res.status(500).send({ message: "Error de conexión"});
		}
		if(result['affectedRows'] == 0) {
			res.status(400).send({ message: "No existe dato del usuario"});
		} 
		else {
			console.log(result);
			res.status(200).send({ message: "Usuario eliminado correctamente" });
		}
	});
}

module.exports = {
	prueba,
	loginUsuario,
	getUsuarios,
	getUsuario,
	saveUsuario,
	updateUsuario,
	deleteUsuario,
};