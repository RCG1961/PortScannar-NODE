// HTTP

 var http= require('http');
  var fs = require('fs');
  var  https = require('https'); // Para conexiones seguras

    // 1.- method HEAD- headers 
        // var options= { 
    //     host: 'www.uaq.mx',
    //     port: 80,
    //     //path: '/informatica/lat.html'
    //     //path: '/informatica/img/lati.png'
    //     //path: '/leyes/ley-org.pdf'
    // }
    // SINTAXIS: HEAD + (url completa)
    // var req = http.request(options, function(res) {
    // console.log(JSON.stringify(res.headers));
    //   }
    // );
    // req.end();


     //2.- method GET 
     // SINTAXIS GET + (url completa)
         // var options= { 
    //     host: 'www.uaq.mx',
    //     port: 80,
    //     //path: '/informatica/lat.html'
    //     //path: '/informatica/img/lati.png'
    //     //path: '/leyes/ley-org.pdf'
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //         }
    // }
    // if  (options.path!=null){ // Si no hay path, no se podrá    
    //     var tipoArchivo = options.path.slice(-4)
    //     http.get(options, function(res) {
    //        console.log('STATUS: ' + res.statusCode);
    //           console.log('HEADERS: ' + JSON.stringify(res.headers));
    //         console.log("Content-type:" + res.headers['content-type'])
    //         var content = res.headers['content-type']
    //         console.log(content)
    //          if ( content.includes("html")){ // si es html o http
    //             console.log("HOLA")
    //             res.on('data', function (chunk) {
    //             console.log('BODY: ' + chunk);
    //           });
    //          }else {
    //           var file = fs.createWriteStream("downloads/file" + tipoArchivo);
    //             var request = http.get(options, function(response) {
    //               response.pipe(file);
    //             });
    //             console.log("Archivo descargado con éxito en la carpeta downloads")
    //         }
    //     }).on('error', function(e) {
    //         console.log("Got error: " + e.message);
    //     });
    // }
    // else{
    //     console.log("Falta el path") 
  // }

    //3.- method POST 
    var options = {
      hostname: 'www.ptsv2.com',
      port: 443,
      path: '/t/tj6hv-1522023185/post',
      method: 'POST',
      headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
         }
    };

    var req = https.request(options, function(res) {
         res.on('data', function (body) {
        console.log('Body: ' + body);
        });
    });

    req.on('error', function(e) {
         console.log('Problema con la petción: ' + e.message);
    });

   req.write( "Hello, World", 2, "hola kike"); //Con parámetros
    req.end();
  