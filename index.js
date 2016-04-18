'use strict';

const express        = require('express');
const app            = express();
const path           = require('path');
const credentials    = require('./credentials.js');

app.use('/client', express.static(path.join(__dirname, '/client')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/corpus', function(req, res){
  res.json(require('./corpus.js'));
});

const server = require('http').Server(app);

const io = require('socket.io')(server);

io.on('connection', function(socket){
  const search = require('./search.js')(function(jobs){
    socket.emit('results', jobs);
  });

  socket.on('search', function(query){
    console.log('query from frontend:', query);
    if(credentials && credentials.publisher){
      search(query);
    } else {
      socket.emit('missing-indeed-key');
    }
  });

  socket.on('disconnect', function(){});
});

server.listen(3000, function(){
  console.log('listening on *:3000');
});
