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
}

document.getElementById("mensaje").addEventListener('keypress',(e)=>{
    if (e.keyCode == 13){
        document.getElementById("terminal").innerHTML += "<br>"+e.target.value;
        switch (parseInt(service)) {
            case 3306:
                mysqlConnect(e.target.value);
                break;
            case 80:
                console.log("hola kike");
            default:
                break;
        }
        document.getElementById("mensaje").value = '';
    }
});

document.getElementById('btnConectar').addEventListener('click', () => {
    var puerto = selectPuertos.value;
    estatus.innerHTML = 'Esperando Comando...';
    switch (parseInt(puerto)) {
        case 3306:
            service = 3306;
            break;
        case 21:
            alert("ftp");
            break;
        case 80:
            alert("http");
            service=80;
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
var mysqlConnect = (stament)=>{
    if (localStorage.getItem("usuarioterm") != '') {
        var user = prompt("usuario");
        var termp = prompt("contraseña");
        localStorage.setItem("usuarioterm", user);
        localStorage.setItem("termp", termp);
    }
    estatus.innerHTML = 'Conectando con el servicio de MySQL..';
    var data = { stament: stament};
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
        alert("fallo");
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