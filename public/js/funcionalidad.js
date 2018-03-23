var option = document.createElement("option");
var selectPuertos = document.getElementById('puertosDisponibles');

document.getElementById("mensaje").addEventListener('keypress',(e)=>{
    if (e.keyCode == 13){
        document.getElementById("terminal").innerHTML += "<br>"+e.target.value;
        document.getElementById("mensaje").value = '';
    }
});


document.getElementById("escanear").addEventListener('click', ()=>{
    var btn = document.getElementById('escanear');
    var portinit = document.getElementById("portinit").value;
    var portfin = document.getElementById("portfin").value;
    var host = document.getElementById("host").value;
    
    if (host == '' || portinit == '' || portfin == ''){
        alert('No puede haber campos vacios');
        return null;
    }
    if(portinit > portfin){
        alert('el puerto inicial no puede ser mayor al puerto final');
        return null;
    }
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Escaneando...'
    btn.disabled = true;
    selectPuertos.innerHTML = '';
    option.text = 'Escaneando...';
    selectPuertos.add(option);
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/escaner",
        data: { 'portinit': portinit, "portfin": portfin, 'host': host},
    }).done(function (msg) {
        console.log(msg);
        if(msg.length > 0){
            generarOptionsPorts(msg);
            btn.disabled = false;
            btn.innerHTML = 'Escanear';
        }
    })
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