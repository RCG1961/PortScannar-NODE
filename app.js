var express = require('express');
var app = express();
var engines = require('consolidate');
var bodyParser = require('body-parser');
var net = require('net');

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
        if (totalPuertos == contPorts - dato.length){
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

function verJson(arr){
    dato.push(arr);
    console.log(dato);
}

app.post('/mysql', function (req, res) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'me',
        password: 'secret',
        database: 'my_db'
    });

    connection.connect();

    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
    });

    connection.end();
    res.json({'respuesta' : 'buena'});
});


//TODO:
app.listen(3000, function () {
    console.log('Listo Para Escanear...');
    //require("openurl").open("http://localhost:3000");
});