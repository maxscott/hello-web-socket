var express = require('express');
var app = express();
var server = require('http').createServer(app);
var WebSocketServer = require('websocket').server;

var chalk = require('chalk');
var chalkLog = function(s, chalkColor) {
  console.log((new Date()) + ": " + chalkColor(s));
}
var logBlue = function(s) { return chalkLog(s, chalk.blue); }
var logRed = function(s) { return chalkLog(s, chalk.red); }
var logGreen = function(s) { return chalkLog(s, chalk.green); }

app.use(express.static(__dirname + '/public'));
app.use('/javascripts', express.static(__dirname + '/javascripts'));

server.listen(6969, function() {
  logBlue('Server is listening on port 6969');
});

var wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

wsServer.on('request', function(request) {
  if (request.origin === 'weird') {
    request.reject();
    logRed("Whoever's at " + request.origin + " isn't allowed to connect");
    return;
  }

  var connection = request.accept('echo-protocol', request.origin);
  logBlue('Connection at ' + connection.remoteAddress + ' accepted');
  logBlue('origin = ' + request.origin);

  connection.on('message', function(message) {
    console.log(message.type);
    if (message.type === 'utf8') {
      logGreen('message recieved: ' + message.utf8Data);
      connection.sendUTF(message.utf8Data);
    }
    else if (message.type === 'binary') {
      logGreen('binary recieved: ' + message.binaryData.length + ' bytes');
      connection.sendBytes(message.binaryData);
    }
  });

  connection.on('close', function(reasonCode, description) {
    logBlue('Peer ' + connection.remoteAddress + ' disconnected');
  });
});

