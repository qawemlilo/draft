
var Player, Players = {}, uid, nextID, addPawnCollection, getPawnCollection, deleteGame, addPlayer, getOpponent, Counter = 0;


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
    var id = uid(), userCounter, name, obj = {}, err = false;
    
    if (!Players.hasOwnProperty(id)) {
        obj.name = 'user_' + nextID();
        obj.id = id;
        obj.socket = socketid; 
        obj.waiting = true; 
        
        Players[id] = new Player(obj); 
    }
    
    if (!Players.hasOwnProperty(id)) {
        err = true;
    }
    
    fn(err, Players[id]);
};


exports.getFromQueue = function (id, fn) {
    for (key in Players) {
        if (Players[key].id !== id && Players[key].waiting) {
            Players[key].waiting = false;
            fn(false, Players[key]);
            return;
        }
    }
    
    fn(true, {});
};


exports.getPlayerBySocket = function (socket, fn) {
    for (key in Players) {
        if (Players[key].socket === socket) {
            fn(false, Players[key]);
            return;
        }
    }

    fn(true, {});   
};


exports.addToQueue = function (id) {
    Players[id].waiting = true; 
};


exports.getPlayer = function (id, fn) {
    fn(false, Players[id]);        
};


exports.updateOpponent = function (id, opp) { 
    Players[id].opponent = opp; 
};


exports.destroy = function (id) {
    delete Players[id];    
};