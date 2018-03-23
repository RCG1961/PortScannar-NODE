var option = document.createElement("option");
var selectPuertos = document.getElementById('puertosDisponibles');
var host = 'localhost';
var estatus = document.getElementById('estado');

document.getElementById("mensaje").addEventListener('keypress',(e)=>{
    if (e.keyCode == 13){
        document.getElementById("terminal").innerHTML += "<br>"+e.target.value;
        document.getElementById("mensaje").value = '';
    }
});

document.getElementById('btnConectar').addEventListener('click', () => {
    var puerto = selectPuertos.value;
    console.log(puerto);
    switch (parseInt(puerto)) {
        case 3306:
            mysqlConnect();
            break;
        case 21:
            alert("ftp");
            break;
        case 80:
            alert("http");
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

var mysqlConnect = ()=>{
    if (localStorage.getItem("usuarioterm") != '') {
        var user = prompt("usuario");
        var termp = prompt("contraseña");
        localStorage.setItem("usuarioterm", user);
        localStorage.setItem("termp", termp);
    }
    estatus.innerHTML = 'Conectando con el servicio de MySQL..';
    alert("mysql");
    var data = {};
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/mysql",
        data: data,
    }).done(function (msg) {
        console.log(msg);
    }).fail((msg) => {
        alert("fallo");
    });
}