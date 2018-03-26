var option = document.createElement("option");
var selectPuertos = document.getElementById('puertosDisponibles');
var host = 'localhost';
var estatus = document.getElementById('estado');
var terminal = document.getElementById('terminal');
var service = '';

// Scroll de la consola
var textarea = document.getElementById('center');
var mensaje = document.getElementById('mensaje');
// mensaje.addEventListener('keyup',function(e){
//     if (e.keyCode === 13) {
//     textarea.scrollTop = textarea.scrollHeight;
//   }
// });

function ajustarPantalla(){
    textarea.scrollTop = textarea.scrollHeight;
    console.log(textarea.scrollTop);
}

document.getElementById("mensaje").addEventListener('keypress',(e)=>{
    if (e.keyCode == 13){
        document.getElementById("terminal").innerHTML += "<br>"+e.target.value;
        ajustarPantalla();
        switch (parseInt(service)) {
            case 3306:
                mysqlConnect(e.target.value);
                break;
            case 80:
                httpConnect(e.target.value);
                break;
            default:
                alert("Conectese a un puerto");
                break;
        }
        document.getElementById("mensaje").value = '';
    }
});

document.getElementById('btnConectar').addEventListener('click', () => {
    var puerto = selectPuertos.value;
    switch (parseInt(puerto)) {
        case 3306:
            estatus.innerHTML = 'Esperando Comando...';
            service = 3306;
            break;
        case 21:
            estatus.innerHTML = 'Esperando Comando...';
            alert("ftp");
            break;
        case 80:
            estatus.innerHTML = 'Esperando Comando...';
            service = 80;
            break;
        case -21:
            estatus.innerHTML = 'Esperando Comando...';
            alert("Realice un escaneo ");
            break;
        case -20:
            estatus.innerHTML = 'Esperando Comando...';
            alert("Seleccione un puerto");
            break;
        default:
            alert("Por el momento el servicio no es soportado: Puerto ", puerto);
            break;
    }
});


document.getElementById("escanear").addEventListener('click', ()=>{
    var btn = document.getElementById('escanear');
    var portinit = document.getElementById("portinit").value;
    var portfin = document.getElementById("portfin").value;
    host = document.getElementById("host").value;
    
    if (host == '' || portinit == '' || portfin == ''){
        alert('No puede haber campos vacios');
        return null;
    }

    if(parseInt(portinit) > parseInt(portfin)){
        alert('el puerto inicial no puede ser mayor al puerto final');
        return null;
    }
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Escaneando...'
    btn.disabled = true;
    selectPuertos.innerHTML = '';
    option.text = 'Escaneando...';
    estatus.innerHTML = 'Escaneando...';
    selectPuertos.add(option);
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/escaner",
        data: { 'portinit': portinit, "portfin": portfin, 'host': host},
    }).done(function (msg) {
        if(msg.length > 0){
            generarOptionsPorts(msg);
            btn.disabled = false;
            btn.innerHTML = 'Escanear';
            estatus.innerHTML = 'Seleccione un puerto';
        }
    }).fail((msg)=>{
        option.text = 'Escanee primero';
        btn.disabled = false;
        btn.innerHTML = 'Escanear';
        estatus.innerHTML = 'Escaneo fallido';
    });
});

var generarOptionsPorts = (ports)=> {
    selectPuertos.innerHTML = '';
    for (let index = 0; index < ports.length; index++) {
        var option = document.createElement("option");
        option.text = ports[index];
        option.value = ports[index];
        selectPuertos.add(option);
    }
}

var contadorId = 0;
var databaseSelected = false;
var database = '';
var connectedMysql = false;
var mysqlConnect = (stament)=>{

    if (!connectedMysql) {
        var user = prompt("usuario");
        var termp = prompt("contraseña");
        localStorage.setItem("usuarioterm", user);
        localStorage.setItem("termp", termp);
        connectedMysql = true;
    }

    if(stament == 'exit'){
        alert("salio");
        desconectar();
        return null;
    }

    if (stament.includes("use") && !databaseSelected){
        database = stament.split("use")[1].trim();
        // database = database.trim();
        terminal.innerHTML += "<br>Base de datos seleccionada "+database;
        console.log(database);
        databaseSelected = true;
    }

    estatus.innerHTML = 'Conectando con el servicio de MySQL..';
    var data = { 
        host: host, 
        stament: stament, 
        database: database, 
        pass : localStorage.getItem("termp"), 
        user: localStorage.getItem("usuarioterm")
    };

    $.ajax({
        method: "POST",
        url: "http://localhost:3000/mysql",
        data: data,
    }).done(function (msg) {
        estatus.innerHTML = 'Conectado';
        terminal.innerHTML += "<br>";
        if (msg.error) {
            terminal.innerHTML += msg.error.sqlMessage;
        } else {
            contadorId++;
            console.log(msg);
            generarTablaConsulta(contadorId, msg);
        }
    }).fail((msg) => {
        alert("se ha perdido la conexión");
        desconectar();
    });
}


var generarTablaConsulta = (contadorId, data)=>{
    var tabla = document.createElement("table")
    tabla.setAttribute("id", contadorId)
    tabla.setAttribute("border", 1)
    tabla.style = 'border-style: dashed;';
    terminal.appendChild(tabla);

    var headers = [];
    if (data.length > 1) {
        headers = Object.keys(data[0]);
    } else {
        headers = Object.keys(data);
    }
    var tabla = document.getElementById(contadorId);
    var tblBody = document.createElement("tbody");
    var hilera = document.createElement("tr");
    for (var j = 0; j < headers.length; j++) {
        var celda = document.createElement("th");
        var textoCelda = document.createTextNode(headers[j]);
        celda.appendChild(textoCelda);
        hilera.appendChild(celda);
    }
    tblBody.appendChild(hilera);
    tabla.appendChild(tblBody);

    for (const key in data) {
        var hilera = document.createElement("tr");
        for (const head in headers) {
            var celda = document.createElement("td");
            var textoCelda = document.createTextNode(data[key][headers[head]]);
            celda.appendChild(textoCelda);
            hilera.appendChild(celda);
        }
        tblBody.appendChild(hilera);
    }
    tabla.appendChild(tblBody);
}


var connectedHttp = false;
var  path = "/";
var comando = "";
var httpConnect = (stament)=>{
    terminal.innerHTML+= "<br>"
    var boolComandos  = false; 

    
    if (stament.includes(" ")){ //Si el comando está completo
        if (!connectedHttp) {
            // var user = prompt("usuario");
            // var termp = prompt("contraseña");
            // localStorage.setItem("usuarioterm", user);
            // localStorage.setItem("termp", termp);
            connectedHttp = true;
        }

        if(stament == 'exit'){
            alert("salió");
            desconectar();
            return null;
        }

        if (stament.substring(0,4).toLowerCase() == "head"){
            path  = stament.split(" ")[1].trim();
            comando = "header"
            boolComandos = true;
        }

        if  (stament.substring(0,3).toLowerCase() == "get"){
            path  = stament.split(" ")[1].trim();
            comando = "get"
            boolComandos = true;
        }
    }

    estatus.innerHTML = 'Conectando con el servicio de HTTP..';

    var data= { 
        host: host,
        port: 80,
        path: path,
        comando : comando
    }
    console.log(data)
    if (boolComandos){
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/http",
            data: data,
        }).done(function (msg) {
            estatus.innerHTML = 'Conectado';
                if(data.comando == "get"){
                    terminal.textContent += msg;
                    terminal.innerHTML += "<br>"
                }
                else {
                    terminal.innerHTML+= msg;
                    terminal.innerHTML+= "<br>"
                }
                terminal.innerHTML += "<br>"
        }).fail((msg) => {
            alert("se ha perdido la conexión");
            desconectar();
        });
    }
    else{
        terminal.innerHTML += "<br>"
        terminal.innerHTML += "Debes de ingresar un comando válido"
    }
}


var desconectar = ()=>{
    service = -20;
    connectedMysql = false;
}