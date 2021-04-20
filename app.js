//const Gpio = require('onoff').Gpio; 
const fs = require('fs');
const { Gpio } = require('onoff');
let http = require('http').createServer(function handler(req, res) {
        fs.readFile(__dirname + '/index.html', function (err, data) {
          if (err) {
            res.writeHead(500);
            return res.end('Can\'t find index.html');
          }      
          res.writeHead(200);
          res.end(data);
        });
      });
const io = require('socket.io')(http);
http.listen(80);

const pcs = {
        'pc75': [new Gpio(20, 'in'), new Gpio(21, 'out')],
        'pc76': [new Gpio(23, 'in'), new Gpio(24, 'out')],
}

io.sockets.on('connection', (socket) => {
        socket.on('press', (data) => {
                press(data);   
        });
        socket.on('hold', (data) => {
                hold(data);
        });
})

function connectPins(pin1, pin2) {
        pin2.write(pin1.readSync());
}

function disconnectPins(pin2) {
        pin2.write(1);
}

function press(pc) {
        let pin1 = pcs[pc][0];
        let pin2 = pcs[pc][1];
        connectPins(pin1, pin2);
        setTimeout(function() {
                disconnectPins(pin2);
        }, 1000);
}

function hold(pc) {
        let pin1 = pcs[pc][0];
        let pin2 = pcs[pc][1];
        connectPins(pin1, pin2);
        setTimeout(function() {
                disconnectPins(pin2);
        }, 3000);
}