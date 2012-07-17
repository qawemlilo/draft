
var Player, Waiting = [], clone, Players = {}, uid, nextID, addPawnCollection, getPawnCollection, deleteGame, addPlayer, getOpponent, Counter = 0;


/* 
    Private methods and functions
*/

Player = function (o) {
    var o = o || {};
    this.name = o.name || '';
    this.id = o.id || 0;
    this.color = o.color || 'white';
    this.opponent = o.opponent  || '';
    this.socket = o.socket || 0;
    this.waiting = o.waiting;
};


uid = function () {
    var idx = [], itoh = '0123456789ABCDEF'.split(''), i;


    for (i = 0; i < 36; i++) { 
        idx[i] = 0xf & Math.random() * 0x10; 
    }

    idx[14] = 4; 
    idx[19] = (idx[19] & 0x3) | 0x8;

    for (i = 0; i < 36; i++) { 
        idx[i] = itoh[idx[i]]; 
    }

    idx[8] = idx[13] = idx[18] = idx[23] = '-';

    return idx.join('');
};


nextID = function () {
   Counter = Counter + 1;
   return Counter;
};




/* 
    Public Methods
*/

exports.createPlayer = function (socketid, fn) {
    var id = uid(), userCounter, name, obj = {}, err;
    
    if (!Players.hasOwnProperty(id)) {
        obj.name = 'user_' + nextID();
        obj.id = id;
        obj.socket = socketid; 
        obj.waiting = true; 
        
        Players[id] = new Player(obj); 
        
        Waiting.push(id);
    }
    
    err = !!(Players[id].id);
    
    fn(!err, Players[id]);
};


exports.getFromQueue = function (id, fn) {
    var result = false;
    for (key in Players) {
        if (Players[key].id !== id && Players[key].waiting === true) {
            Players[key].waiting = false;
            fn(false, Players[key]);
            return;
        }
    }
    
    fn(true, {});
};


exports.getOpponentBySocket = function (socket, fn) {
    for (key in Players) {
        if (Players[key].socket === socket) {
            var opponent = Players[key].opponent;
            
            if (opponent) {
                Players[opponent].opponent = key;
                
                fn(false, Players[opponent]);
                return;
            }
        }
    }

    fn(true, {});   
};


exports.addToQueue = function (id, fn) {
    Players[id].waiting = true; 
    
    if (fn) {
        fn();
    }
};


exports.getPlayer = function (id, fn) {
    fn(false, Players[id]);        
};

exports.updateOpponent = function (id, opp, fn) { 
    Players[id].opponent = opp; 
    
    if (opp) {
        Players[id].waiting = false;
    }
    else {
        Players[id].waiting = true;
    }
    
    if (fn) {
        fn();
    }    
};

exports.destroy = function (id, fn) {
    delete Players[id]; 

    if (fn) {
        fn();
    }    
};


