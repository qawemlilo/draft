
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


nextID = function () {
   Counter = Counter + 1;
   return Counter;
};


/* 
    Public Methods
*/

exports.createPlayer = function (socketid, fn) {
    var id = socketid + '', userCounter, name, obj = {}, err = false;
    
    if (!Players.hasOwnProperty(id)) {
        obj.name = 'Player ' + nextID();
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


exports.playersOnline = function () {
    var allplayers = [];
    
    for (key in Players) {
        allplayers.push(Players[key]);   
    }

    allplayers = JSON.stringify(allplayers);
    
    return allplayers;
};


exports.addToQueue = function (id) {
    if (Players.hasOwnProperty(id)) {
        Players[id].waiting = true;
    }    
};


exports.getPlayer = function (id, fn) {
    var err = false;
    
    if (!Players.hasOwnProperty(id)) {
        err = true;
    }
    
    fn(err, Players[id]);
};


exports.updateOpponent = function (id, opp) { 
    if (Players.hasOwnProperty(id)) {
        Players[id].opponent = opp;
    
        if (opp) {
            Players[id].waiting = false;    
        }
        else {
             Players[id].waiting = true;
        }
    }
};


exports.destroy = function (id) {
    if (Players.hasOwnProperty(id)) {
        delete Players[id];
    }        
};
