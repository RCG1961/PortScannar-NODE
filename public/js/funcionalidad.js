

document.getElementById("mensaje").addEventListener('keypress',(e)=>{
    if (e.keyCode == 13){
        document.getElementById("terminal").innerHTML += "<br>"+e.target.value;
        document.getElementById("mensaje").value = '';
    }
});


document.getElementById("escanear").addEventListener('click', ()=>{
    var portinit = document.getElementById("portinit").value;
    var portfin = document.getElementById("portfin").value;
    var host = document.getElementById("host").value;
    
    $.ajax({
        method: "POST",
        url: "http://localhost:3000/escaner",
        data: { 'portinit': portinit, "portfin": portfin, 'host': host},
    }).done(function (msg) {
        console.log(msg);
    })
});