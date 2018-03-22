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

var dato = new Array();
app.post('/escaner', function (req, res) {
    var HOST = 'localhost';
    var puertoInicial = req.body.portinit;
    var puertoFinal = req.body.portfin;
    var dato = new Array(), promises = [];
    var openPorts = '';
    var contPorts = 0;
    var datosPort = [];
    for (let port = puertoInicial; port <= puertoFinal; port++) {
        var client = new net.Socket();
        client.setTimeout(1000);
        datosPort = port;
        client.connect(port, HOST, ()=> {            
            console.log(HOST + ' PUERTO ABIERTO: ' + port);
            verJson(port);
            //client.write('');
        });
        client.on('timeout',(data)=> {
            contPorts++;
            client.destroy();
        });

        client.on('data',(data)=> {
            // console.log('DATA: ' + data);
            client.destroy();
        });

        client.on('close', (err)=> {
            //console.log("Conexión cerrada");
            
        })

        client.on('error', (err)=> {
            // console.log("Error: "+err.message);
        });
        
    }

    setInterval(()=>{
        console.log(contPorts);
        if (puertoFinal - puertoInicial == contPorts){
            res.json(dato);
            dato = [];
        }
    },1000)
});

function verJson(arr){
    dato.push(arr);
    console.log(dato);
}

app.listen(3000, function () {
    console.log('Listo Para Escanear...');
    require("openurl").open("http://localhost:3000");
});