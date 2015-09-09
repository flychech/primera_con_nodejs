var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();

mongoose.connect("mongodb://localhost/primera_pagina");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Definir el schema de los productos
var productSchema = {
	title:String,
	description:String,
	imageUrl:String,
	pricing:Number
};

var Product = 	mongoose.model("Product", productSchema);

app.set("view engine", "jade"); //Indicamos que el engine de las vistas va a ser jade

app.use(express.static("public"));//para indicar en donde están los assets

app.get("/", function(solicitud, respuesta){

	respuesta.render("index");
});

app.post("/menu", function(solicitud, respuesta){
	//console.log(solicitud.body);
	if(solicitud.body.password == '12345678'){

		var data = {
			title: solicitud.body.title,
			description: solicitud.body.description,
			imageUrl: "data.png",
			pricing: solicitud.body.pricing
		}

		var product = new Product(data);

		product.save(function(err){
			console.log(product);
			respuesta.render("index");
		});

	}else{
		respuesta.render("menu/new");
	}

	//respuesta.render("menu/new");
});

app.get("/menu/new", function(solicitud, respuesta){
	respuesta.render("menu/new");
});

app.listen(8080);