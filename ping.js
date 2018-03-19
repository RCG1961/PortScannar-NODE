var ping = require('ping');

var hosts = ['148.220.52.120', '148.220.52.120:80', '148.220.52.120:3306', '148.220.52.120:3307'];
hosts.forEach(function (host) {
    ping.sys.probe(host, function (isAlive) {
        var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
        console.log(msg);
    });
});