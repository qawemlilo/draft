
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , io = require('socket.io')
  , draft = require('./draft');

var app = module.exports = express.createServer(),
    io = io.listen(app), intervalID;

// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(express.session({secret: 'secret', key: 'express.sid'}));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function (req, res) {
    routes.index(req, res);
})

io.sockets.on('connection', function (socket) {
       
    function cleanUp () {
    
        var counter = 0;
        
        clearInterval(intervalID);

        intervalID = setInterval(function () {
            var online, id, players = draft.players();

            console.log('counter: ' + counter);
            for (id in players) {
                if (!io.sockets.sockets[id]) {
                    console.log('Killing socket: ' + id);
                    draft.destroy(id);
                
                    online = draft.playersOnline();
                    io.sockets.emit('online', online);
                }
            }
            
            if (counter > 9) {
                clearInterval(intervalID);               
            }            
        }, 5000);         
    }
    
    
    socket.on('new user', function () {

        draft.createPlayer(socket.id, function (err, player) {
            if (!err) {
                var online = draft.playersOnline();
                
                socket.emit('user created', JSON.stringify(player));
                io.sockets.emit('online', online);
            }
        });
        
        cleanUp();
    });
    

    socket.on('challenge', function (obj) {
        var data = JSON.parse(obj), opponentSocket;
        
        draft.getPlayer(data.id, function (err, player) {
            draft.getFromQueue(data.id, function (err, opponent) {
                if (!err) {
                    if (!io.sockets.sockets.hasOwnProperty(opponent.socket)) {
                        socket.emit('not found');
                    }
                    else {
                        draft.updateOpponent(opponent.id, player.id);
                        opponentSocket = io.sockets.sockets[opponent.socket];
                        opponentSocket.emit('challenge', JSON.stringify(player));
                    }
                }
                else {
                    socket.emit('not found');
                }
            });
        });  
    });
    

    socket.on('decline', function (response) {
        var player = JSON.parse(response), opponentSocket;
        
        draft.getPlayer(player.opponent, function (err, opponent) {
            if (!err) {
                opponentSocket = io.sockets.sockets[opponent.socket];
                
                draft.updateOpponent(player.id, '');
                draft.updateOpponent(opponent.id, '');
                
                opponentSocket.emit('declined');
            }
        });
    }); 
    
    
    socket.on('accept', function (response) {
        var data = JSON.parse(response), opponentSocket;
        
        draft.getPlayer(data.id, function (err, player) {
            if (!err) {
                draft.getPlayer(data.opponent, function (err2, opponent) {
                    if (!err2) {
                        opponentSocket = io.sockets.sockets[opponent.socket];
                
                        draft.updateOpponent(player.id, opponent.id);
                        
                        opponentSocket.emit('start game', JSON.stringify(player));
                    }
                });
            }
        });
    }); 
    
    
    socket.on('move', function (response) {
        var data = JSON.parse(response), opponentSocket, playerSocket, relay_data = {};
        
        relay_data.action = 'move';
        relay_data.from = data.from;
        relay_data.to = data.to;
        relay_data.remove = data.remove;

        draft.getPlayer(data.oppId, function (err, opponent) {
            if (!err) {
                opponentSocket = io.sockets.sockets[opponent.socket];
                opponentSocket.emit('move', JSON.stringify(relay_data));
            }
            else {
                socket.emit('opponent quit'); 
                draft.updateOpponent(data.id, '');                
            }
        });
    });
    
    
    socket.on('disconnect', function () { 
        var destroyed = draft.destroy(socket.id);
        
        if (destroyed && typeof destroyed !== 'boolean') {
            var opponentSocket = io.sockets.sockets[destroyed.id];
            opponentSocket.emit('opponent quit');
        }
        
        delete io.sockets.sockets[socket.id];
        
        var online = draft.playersOnline();
        io.sockets.emit('online', online);
    });
});

app.listen(3000);

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
