var net = require('net');

var HOST = 'localhost';
var puertoInicial = 1;
var puertoFinal = 3000;
var ports = [];

while (puertoInicial < puertoFinal) {
    var port = puertoInicial;

    (function (port) {
        var client = new net.Socket();
        client.setTimeout(1000);

        client.connect(port, HOST, function (data) {
            console.log(HOST + ' PUERTO ABIERTO: ' + port);
            //client.write('');
            ports.push(ports);
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

    })(port);

    puertoInicial++;
}

console.log(ports);