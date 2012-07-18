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
        var socket = io.connect('http://draft.rflab.co.za/'), sendChallenge, notFound;
        
        DRAFT.init('game', {});
        App.shout('Connecting, please wait.....');
        
        console.log('starting');
        
        socket.on('connect', function () {
            socket.emit('new user');
            
            console.log('connected');
            
            socket.on('user created', function (response) {
                data = JSON.parse(response);
                
                App.user = new User(data);
                DRAFT.init('game', data, socket);
                console.log('user created');
                if (!App.opponent.hasOwnProperty('id') || !App.opponent.id) {
                    console.log('searching for opponent');
                    App.shout('Searching for available players.....');
                    socket.emit('challenge', JSON.stringify(App.user));  
                }
            });
            
            
            socket.on('not found', function () {
                App.shout('No players available at the moment. Invite a friend by sending them a link to this page.');  
            });
            
            socket.on('opponent quit', function () {
                App.shout('Like a chicken, your opponent has quit.', 'notice', 5);
                App.user.opponent = '';
                DRAFT.opponent = App.opponent = {};
                DRAFT.init('game', {});
            });
           
  
            socket.on('challenge', function (response) {
                var accept, data = JSON.parse(response);   
                
                App.user.opponent = data.id;
                accept = confirm("A player has sent you a challenge. Do you accept?");
                
                if (accept) {
                    App.user.color = 'red';
                    DRAFT.opponent = App.opponent = new User(data);
                    DRAFT.init('game', App.user, socket);
                    
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
                    DRAFT.onMove(data.from, data.to, App.opponent.color, data.remove);
                    
                    $('.'+DRAFT.me.color).draggable('enable');
                    App.shout('Your turn to move.');
                }
            });
            
            
            socket.on('start game', function (response) {
                var data = JSON.parse(response); 
                
                App.user.opponent = data.id;               
                App.opponent = new User(data);
                App.opponent.color = 'red';
                DRAFT.opponent = App.opponent;
                
                DRAFT.init('game', App.user, socket);
                
                $('.'+DRAFT.me.color).draggable('enable');

                App.shout('A new game has started, make your first move.');                   
            });
        
        }); 
    },    
    
    user: {},
    
    opponent: {},
    
    shout: function (msg, msgType, sec) {
        DRAFT.shout.call(App, msg, msgType, sec);
    }
};

App.init();