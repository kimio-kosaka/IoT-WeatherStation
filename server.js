/*
* Setup
*/

// Parameters
var server = 'localhost';   //server hostnem or IP-adder
var port = 5030;            //Web access port
var ioport = 5040;          //socket.ip port

/*
* include modules
*/
var express = require('express');
var app = express();
var io = require('socket.io').listen(ioport);

/*
* express server setup
*/
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.get('/', function (req, res) {
  res.render('controller', {host:server, port:ioport});
});

app.use(express.static(__dirname + '/public'));
app.listen(port);

/*
* socket.io setup
*/
io.on('connection', function (socket) {

  // measuring data from client.js 
  socket.on('multi', function(data) {
    socket.broadcast.emit('multi', data);
  });
  
  // init request from controller.html
  socket.on('init',function(){
     socket.broadcast.emit('init');
  });
  // init respons from client.js
  socket.on('init_res',function(data){
     socket.broadcast.emit('init_res',data);
  });
 
  // broadcast message when socket is disconnected
  socket.on('disconnect', function() {
    socket.broadcast.emit('disconnected');
  });

});
