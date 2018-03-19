var express = require('express');
var app = express();
var engines = require('consolidate');

app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.get('/', function (req, res) {
    //res.sendfile(__dirname + '/index.html');
    res.render('index.html');
});

app.listen(3000, function () {
    console.log('Listo Para Escanear');