// HTTP

var http= require('http');
var fs = require('fs');
    var options= {
        host: 'www.uaq.mx',
        port: 80,
        //path: '/informatica/lat.html'
        //path: '/informatica/img/lati.png'
        path: '/leyes/ley-org.pdf'
    }
var tipoArchivo = options.path.slice(-4)
    // method HEAD- headers 
    // var req = http.request(options, function(res) {
    // console.log(JSON.stringify(res.headers));
    //   }
    // );
    // req.end();

    // method GET- headers 
    // var req = http.request(options, function(res) {
    // console.log(JSON.stringify(res.headers));
    //   }
    // );
    // req.end();
    http.get(options, function(res) {
       console.log('STATUS: ' + res.statusCode);
          console.log('HEADERS: ' + JSON.stringify(res.headers));
        console.log("Content-type:" + res.headers['content-type'])
          // res.setEncoding("utf8");
          // res.on('data', function (chunk) {
          //   console.log('BODY: ' + chunk);
          // });

          var file = fs.createWriteStream("downloads/file" + tipoArchivo);
          // descargar archivos
            var request = http.get(options, function(response) {
              response.pipe(file);
            });
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });