var express = require('express');
var app = express();
var engines = require('consolidate');
var bodyParser = require('body-parser');
var net = require('net');
var http = require('http');
var fs = require('fs');
var StringDecoder = require('string_decoder').StringDecoder;



app.use('/static', express.static(__dirname + '/public'));
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.use(bodyParser.json()); // support json encoded bodies
app.use(function (req, res, next) {
    req.on('timeout', function () {
        // pretend like data was written out
        res.write = res.end = function () { return true };
        // no headers, plz
        res.setHeader = res.writeHead = res.addTrailers = function () { };
    });
    next();
})
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req, res) {
    res.render('index.html');
});

var dato = new Array();
app.post('/escaner', function (req, res) {
    var puertoInicial = req.body.portinit;
    var puertoFinal = req.body.portfin;
    var host = req.body.host;

    var contPorts = 0;

    var totalPuertos = puertoFinal  - puertoInicial;

    for (let port = puertoInicial; port <= puertoFinal; port++) {
        var client = new net.Socket();
        client.setTimeout(1000);
        datosPort = port;
        client.connect(port, host, ()=> {            
            console.log(host + ' PUERTO ABIERTO: ' + port);
            verJson(port);
            //client.write('');
        });
        client.on('timeout',(data)=> {
            client.destroy();
        });

        client.on('data',(data)=> {
            // console.log('DATA: ' + data);
            contPorts++;
            client.destroy();
        });

        client.on('close', (err)=> {
            contPorts++;
            client.destroy();
        })

        client.on('error', (err)=> {
            // console.log("Error: "+err.message);
            client.destroy();
        }); 
    }

    var respuesta = setInterval(()=>{
        console.log("TOTAL :", totalPuertos);
        console.log("CONTADOR: ", contPorts);
        console.log("LENGTH: ", dato.length);

        if ((totalPuertos == contPorts - dato.length) || (puertoFinal == contPorts + dato.length) || (totalPuertos==contPorts)){
            if (dato.length > 0) {
                res.json(dato);
            } else {
                res.json({'Sin Puertos': 'Sin Puertos'});
            }
            clearInterval(respuesta);
            dato = [];
        }
    },1000)
});

var verJson = (arr)=>{
    dato.push(arr);
    console.log(dato);
}

app.post('/mysql', function (req, res) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: req.body.host,
        user: req.body.user,
        password: req.body.pass,
        database: req.body.database
    });
    connection.connect();
    connection.query(req.body.stament, function (error, results, fields) {
        if (error){
            res.json({error : error});
        } else {
            res.json(results);
        }
        
    });
    connection.end();
});

// HTTP
app.post('/http', function (req, res) {

	var http = require('http')
	var header = "";
	var body = "";
	var file = "";
    var options= {
        host: req.body.host,
        port: 80,
        path: req.body.path
    };
    var comando = req.body.comando
    console.log(options)
    switch (comando){
    	case "header":
	    	var request = http.request(options, function(results) {
	    		header = JSON.stringify(results.headers);
	    		res.json(header)
	      		}
	  	  	);
	    	request.on('error', function(err) {
	      		console.log(err);
			})
	    	request.end();
	    	break;
	    case "get":
		        var tipoArchivo = options.path.slice(-4)
		        http.get(options, function(results) {
          		var content = results.headers['content-type']
		             if ( content.includes("html")){ // si es html o http
               			 var decoder = new StringDecoder('utf8');
		                results.on('data', function (chunk) {
		                	body += decoder.write(chunk);
		              });
		                results.on('end', function(){
		                	res.json(body);
		                });
		             }else {
		              var file = fs.createWriteStream("downloads/file" + tipoArchivo);
		                var request = http.get(options, function(response) {
		                  response.pipe(file);
		                });
		                body = "Archivo descargado en la carpeta downloads";
		                res.json(body);
		            }
		        }).on('error', function(e) {
		            body = "Error: " + e.message;
		        });
		        break;
	}  
});


//TODO:
app.listen(3000, function () {
    console.log('Listo Para Escanear...');
    //require("openurl").open("http://localhost:3000");
});