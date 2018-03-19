/*function fibo(n) {
    return n+1;
}

function cb(err, data) {
    process.stdout.write(" [" + this.id + "]" + data);
    this.eval('fibo(1)', cb);
}

var tagg = require('threads_a_gogo');

tagg.create().eval(fibo).eval('fibo(1)', cb);
tagg.create().eval(fibo).eval('fibo(1)', cb);

var hola = function(cb) {
    console.log("Hola");
    cb("Adios");
}

var adios = function(msg) {
    console.log(msg);
}

hola(adios);

function miFuncion(funt) {
    funt('Mundo Sr');
}

miFuncion(function (str) {
    console.log("Hola " + str);
});*/

var isMomHappy = false;

// Promise
var willIGetNewPhone = new Promise(
    function (resolve, reject) {
        if (isMomHappy) {
            var phone = {
                brand: 'Samsung',
                color: 'black'
            };
            resolve(phone); // fulfilled
        } else {
            var reason = new Error('mom is not happy');
            reject(reason); // reject
        }

    }
);

willIGetNewPhone.then((successMessage) => {
    // succesMessage es lo que sea que pasamos en la función resolve(...) de arriba.
    // No tiene por qué ser un string, pero si solo es un mensaje de éxito, probablemente lo sea.
    console.log(successMessage);
}).catch((successMessage) => {
    // succesMessage es lo que sea que pasamos en la función resolve(...) de arriba.
    // No tiene por qué ser un string, pero si solo es un mensaje de éxito, probablemente lo sea.
    console.log(successMessage);
});


