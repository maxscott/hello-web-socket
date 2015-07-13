var express = require('express');
var app = express();
var server = require('http').createServer(app);
var WebSocketServer = require('websocket').server;
var log = require('./lib/log');

app.use(express.static(__dirname + '/public'));
app.use('/javascripts', express.static(__dirname + '/javascripts'));

server.listen(6969, function() {
  log.blue('Server is listening on port 6969');
});

var wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

wsServer.on('request', function(request) {
  if (request.origin === 'weird') {
    request.reject();
    log.red("Whoever's at " + request.origin + " isn't allowed to connect");
    return;
  }

  var connection = request.accept('echo-protocol', request.origin);
  log.blue('Connection at ' + connection.remoteAddress + ' accepted');
  log.blue('origin = ' + request.origin);

  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      log.green('message recieved: ' + message.utf8Data);
      connection.sendUTF(message.utf8Data);
    }
    else if (message.type === 'binary') {
      log.green('binary recieved: ' + message.binaryData.length + ' bytes');
      connection.sendBytes(message.binaryData);
    }
  });

  connection.on('close', function(reasonCode, description) {
    log.blue('Peer ' + connection.remoteAddress + ' disconnected');
  });
});

