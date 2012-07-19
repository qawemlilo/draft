
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , io = require('socket.io')
  , draft = require('./draft');

var app = module.exports = express.createServer(),
    io = io.listen(app);

// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);

app.listen(3000);


io.sockets.on('connection', function (socket) {
    
    socket.on('new user', function () {
        draft.createPlayer(socket.id, function (err, player) {
            if(!err){
                socket.emit('user created', JSON.stringify(player));   
            }
        }); 
    });
    

    socket.on('challenge', function (obj) {
        var data = JSON.parse(obj), opponentSocket;
        
        draft.getPlayer(data.id, function (err, player) {
            draft.getFromQueue(data.id, function (err, opponent) {
                if (!err) {
                    if (!io.sockets.sockets[opponent.socket]) {
                        socket.emit('not found');
                    }
                    else {
                        draft.updateOpponent(opponent.id, player.id);
                        draft.updateOpponent(player.id, opponent.id);
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
        var me = JSON.parse(response), opponentSocket;
        
        draft.getPlayer(me.opponent, function (err, opponent) {
            if (!err) {
                opponentSocket = io.sockets.sockets[opponent.socket];
                
                draft.updateOpponent(me.id, '');
                draft.updateOpponent(opponent.id, '');
                
                opponentSocket.emit('declined');
            }
        });
    }); 
    
    
    socket.on('accept', function (response) {
        var data = JSON.parse(response), opponentSocket, me;
        
        draft.getPlayer(data.id, function (err, me) {
            if (!err) {
                draft.getPlayer(data.opponent, function (err2, opponent) {
                    if (!err2) {
                        opponentSocket = io.sockets.sockets[opponent.socket];
                
                        draft.updateOpponent(me.id, opponent.id);
                        draft.updateOpponent(opponent.id, me.id);
                        
                        opponentSocket.emit('start game', JSON.stringify(me));
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
        draft.getPlayer(socket.id + '', function(err, player) {
            if (!err && player.opponent) {
                draft.getPlayer(player.opponent, function (err, opponent) {
                    if (!err) {
                        var opponentSocket = io.sockets.sockets[opponent.socket];
                        opponentSocket.emit('opponent quit');
                
                        draft.destroy(player.id);
                        delete io.sockets.sockets[player.socket];
                        
                        draft.addToQueue(opponent.id);
                    }
                });
            }
        });
    });
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
