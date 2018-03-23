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
            //console.log(port);
            client.destroy();
        });

        client.on('data',(data)=> {
            // console.log('DATA: ' + data);
            contPorts++;
            client.destroy();
        });

        client.on('close', (err)=> {
            //console.log("Conexión cerrada");
            contPorts++;
        })

        client.on('error', (err)=> {
            // console.log("Error: "+err.message);
        }); 
    }

    setInterval(()=>{
        if (totalPuertos == contPorts){
            res.json(dato);
            dato = [];
        }
    },1000)
    return false;
});

function verJson(arr){
    dato.push(arr);
    console.log(dato);
}
//TODO:
app.listen(3000, function () {
    console.log('Listo Para Escanear...');
    //require("openurl").open("http://localhost:3000");
});