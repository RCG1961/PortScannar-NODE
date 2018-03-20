var express = require('express');
var app = express();
var engines = require('consolidate');
var bodyParser = require('body-parser');
var net = require('net');

app.use('/static', express.static(__dirname + '/public'));
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req, res) {
    res.render('index.html');
});


app.listen(3000, function () {
    console.log('Listo Para Escanear...');
    require("openurl").open("http://localhost:3000");
});

var openPorts = [];
app.post('/escaner', function (req, res) {
    var HOST = 'localhost';
    var puertoInicial = req.body.portinit;
    var puertoFinal = req.body.portfin;
    var dato = new Array(), promises = [];

    for (let port = puertoInicial; port <= puertoFinal; port++) {
        var client = new net.Socket();
        client.setTimeout(1000);

        client.connect(port, HOST, function () {            
            console.log(HOST + ' PUERTO ABIERTO: ' + port);
            //client.write('');
            promises.push(promises[port] = 0);
        });
        client.on('timeout', function (data) {
            client.destroy();
        });

        client.on('data', function (data) {
            //console.log('DATA: ' + data);
            client.destroy();
        });

        client.on('close', function (err) {
            //console.log("Conexión cerrada");
        })

        client.on('error', function (err) {
            // console.log("Error: "+err.message);
        });
    }
    // console.log(openPorts);
    res.json(promises);
    // res.send(openPorts);
    var openPorts = [];
});