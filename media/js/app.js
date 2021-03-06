var User = function (o) {
    var o = o || {};
    
    this.name = o.name || '';
    this.id = o.id || '';
    this.color = o.color || '';
    this.socket = o.socket || '';
    this.opponent = o.opponent  || {};
    this.waiting = o.waiting;
},


App = {

    init: function() {
        var socket = io.connect('http://localhost:3000'), sendChallenge, notFound;
        
        socket.on('connect', function () {
            socket.emit('new user');
            
            socket.on('user created', function (response) {
                data = JSON.parse(response);
                
                App.user = new User(data);
                DRAFT.init('game', data, socket);
                
                if (!App.opponent.hasOwnProperty('id') || !App.opponent.id) {
                    App.shout('Please wait while we search for an opponent....');
                    socket.emit('challenge', JSON.stringify(App.user));  
                }
            });
            
            
            socket.on('not found', function () {
                App.shout('No opponents available at the moment.', 'notice', 5);  
            });
            
            socket.on('opponent quit', function () {
                App.shout('Like a chicken, your opponent has quit.', 'notice', 5);
            });
           
  
            socket.on('challenge', function (response) {
                var accept, data = JSON.parse(response);   
                
                App.user.opponent = data.id;
                accept = confirm("A player has sent you a challenge. Do you accept?");
                
                if (accept) {
                    App.user.color = 'red';
                    DRAFT.init('game', App.user, socket);
                    DRAFT.opponent = App.opponent = new User(data);
                    socket.emit('accept', JSON.stringify(App.user));
                }
                else {
                    socket.emit('decline', JSON.stringify(App.user));                   
                }
            });
            
            
            socket.on('declined', function () {
                App.user.opponent = '';
                DRAFT.opponent = App.opponent = {};
                
                App.shout('No opponents available at the moment.', 'notice', 5);  
            });
            
 
            socket.on('move', function (response) {
                var data = JSON.parse(response);
                
                if (data.action === 'move') {
                    DRAFT.onMove(data.from, data.to, data.color, data.remove).makeDraggable();
                    
                    App.shout('Your turn to move.', 'notice', 5);
                }
            });
            
            
            socket.on('start game', function (response) {
                var data = JSON.parse(response);   
                
                App.user.opponent = App.opponent = new User(data);
                
                DRAFT.makeDraggable()
                  .makeWhiteboxUndroppable()
                   .makeBlackboxDroppable(); 

                App.shout('A new game has started, make your first move.', 'notice', 5);                   
            });
        
        }); 
    },    
    
    user: {},
    
    opponent: {},
    
    shout: function (msg, msgType, sec) {
        DRAFT.shout.call(this, msg, msgType, sec);
    }
};

App.init();