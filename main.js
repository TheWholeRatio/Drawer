var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var port = 4200;

app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname));

app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/main.html');
});
server.listen(port, function() {
  console.log('Example app listening on port %d!', port);
});

var mousePoints = [];
var session = {
  actions: [],

}
//Socket input output
io.on('connection', function(client) {
    console.log('Client connected...');

    client.on('playerJoined', function(data) {
			//initialize a new player to the game
			//client.emit('updateBlobs', blobs); sends back to client
      console.log("player joined")
      client.emit('clientJoined', client.id);
      io.emit('updateActions', session.actions);//sends to everyone
    });

    client.on('addClientLine', function(data){
      line = data;
      session.actions.push(line);
      console.log("new mouse down");

      session.actions.forEach((item)=>{
        console.log(item.mousePoints);
        console.log();
      })
    })
    client.on('updateClientLine', function(data) {
      for(var i = session.actions.length-1; i >= 0; i--){
        if(session.actions[i].clientId == client.id){
          session.actions[i].mousePoints.push(data);
        }
      }
			//client.broadcast.emit('updateActions', session.actions);
      io.emit('updateActions', session.actions);//sends to everyone
    });


    client.on('updatePlayerMovement', function(data) {

      io.emit('circleUpdated', players);

    });
});
