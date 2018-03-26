// HTTP

  var http= require('http');
   var fs = require('fs');
   var StringDecoder = require('string_decoder').StringDecoder;
 //  var  https = require('https'); // Para conexiones seguras

 //    //1.- method HEAD- headers 
 //        var options= { 
 //        host: 'www.uaq.mx',
 //        port: 80,
 //        path: '/iajsdiaijsdisj'
 //        //path: '/informatica/img/lati.png'
 //        //path: '/leyes/ley-org.pdf'
 //    }
 //    console.log(options)
 //    //SINTAXIS: HEAD + (url completa)
 //    var request = http.request(options, function(results) {
 //    console.log(JSON.stringify(results.headers));
 //      }
 //    );
 //    request.end();


     //2.- method GET 
     // SINTAXIS GET + (url completa)
         var options= { 
        host: 'www.uaq.mx',
        port: 80,
        path: '/'
        //path: '/informatica/img/lati.png'
        //path: '/leyes/ley-org.pdf'
    }
    var body="";
    var textChunk = "";
    if  (options.path!=null){ // Si no hay path, no se podrá    
        var tipoArchivo = options.path.slice(-4)
        http.get(options, function(res) {
           console.log('STATUS: ' + res.statusCode);
              console.log('HEADERS: ' + JSON.stringify(res.headers));
            console.log("Content-type:" + res.headers['content-type'])
            var content = res.headers['content-type']
            console.log(content)
             if ( content.includes("html")){ // si es html o http
                var decoder = new StringDecoder('utf8');
                res.on('data', function (chunk) {
                      textChunk+= decoder.write(chunk);
              });
                 res.on('end', function(){
                    console.log(textChunk)
                });
             }else {
              var file = fs.createWriteStream("downloads/file" + tipoArchivo);
                var request = http.get(options, function(response) {
                  response.pipe(file);
                });
                console.log("Archivo descargado con éxito en la carpeta downloads")
            }
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    }
    else{
        console.log("Falta el path") 
  }

    //3.- method POST 
  //   var options = {
  //     hostname: 'www.ptsv2.com',
  //     port: 443,
  //     path: '/t/tj6hv-1522023185/post',
  //     method: 'POST',
  //     headers: {
  //          'Content-Type': 'application/x-www-form-urlencoded',
  //        }
  //   };

  //   var req = https.request(options, function(res) {
  //        res.on('data', function (body) {
  //       console.log('Body: ' + body);
  //       });
  //   });

  //   req.on('error', function(e) {
  //        console.log('Problema con la petción: ' + e.message);
  //   });

  //  req.write( "Hello, World", 2, "hola kike"); //Con parámetros
  //   req.end();
  // 