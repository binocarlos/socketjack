/*

	(The MIT License)

	Copyright (C) 2005-2013 Kai Davenport

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

/*
  Module dependencies.
*/

var express = require('express');
var http = require('http');
var socketio = require('socket.io');

var document_root = __dirname + '/www'
var port = 80;

var app = express();
var server = http.createServer(app);

var io = socketio.listen(server);

if(process.env.NODE_ENV=='production'){
  io.enable('browser client minification');
  io.enable('browser client etag');
  io.enable('browser client gzip');
}

io.set('log level', 1);
io.set('transports', [
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
])

app.use(express.static(document_root));

var counter = 0;

io.sockets.on('connection', function(socket){

  socket.on('move:request', function(packet){

    console.log('-------------------------------------------');
    console.log('move gotten');
    console.dir(packet);

    socket.emit('move:response', {
      id:packet.id,
      title:packet.title,
      counter:counter++
    })

  })
})

server.listen(port, function(){
  console.log('-------------------------------------------');
  console.log('document_root: ' + document_root);
  console.log('port: ' + port);
})