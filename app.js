var express = require('express');//Para hacer el render
var mongoose = require('mongoose');//para la base de datos
var bodyParser = require('body-parser');//Para parsear el body
var multer = require('multer'); //para los formularios y poder pasar archivos
var cloudinary = require('cloudinary');//Un servidor en donde podemos subir imágenes

cloudinary.config({
	cloud_name: "dbiwlivzv",
	api_key: "761944685346717",
	api_secret: "mVR_rxUQ0h33iKU0j0BH-oTlkKI"
});

var app = express();

mongoose.connect("mongodb://localhost/primera_pagina");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer({dest: "./upload"}).single('image_avatar'));

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

app.get("/menu", function(solicitud, respuesta){
	Product.find(function(error, documento){
		if(error){ console.log(error); }
		respuesta.render("menu/index", { products: documento });
	});
});

//Creación de producto
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

		cloudinary.uploader.upload(solicitud.file.path, 
			function(result) {
				product.imageUrl = result.url;
				product.save(function(err){
					console.log(product);
					respuesta.render("index");
				});
			}
        );

		/*product.save(function(err){
			console.log(product);
			respuesta.render("index");
		});*/

	}else{
		respuesta.render("menu/new");
	}

	//respuesta.render("menu/new");
});

app.get("/menu/new", function(solicitud, respuesta){
	respuesta.render("menu/new");
});

app.listen(8080);