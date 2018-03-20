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

var dato = new Array();
app.post('/escaner', function (req, res) {
    var HOST = 'localhost';
    var puertoInicial = req.body.portinit;
    var puertoFinal = req.body.portfin;
    var dato = new Array(), promises = [];
    var openPorts = '';
    var datosPort = [];
    for (let port = puertoInicial; port <= puertoFinal; port++) {
        var client = new net.Socket();
        client.setTimeout(1000);
        datosPort = port;
        client.connect(port, HOST, ()=> {            
            //console.log(HOST + ' PUERTO ABIERTO: ' + port);
            verJson(port);
            //client.write('');
            // openPorts += ","+port.toString();
        });
        client.on('timeout',(data)=> {
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

    //res.json(dato);
    //verJson(dato);
    setTimeout(()=>{
        res.json(dato);
    },3000);
    // res.send(openPorts);
});

function verJson(arr){
    dato.push(arr);
    console.log(dato);
}