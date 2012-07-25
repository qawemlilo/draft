
var Player, 
    Players = Object.create(Object.prototype), 
    nextID,  
    Counter = 0,
    addToQueue;


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


addToQueue = function (id) {
    if (Players.hasOwnProperty(id)) {
        Players[id].opponent = '';
        Players[id].waiting = true;
        
        return Players[id];
    }
    else {
        return false;
    }
};


nextID = function () {
   Counter += 1;
   return Counter;
};


/* 
    Public Methods
*/

exports.players = function () {
    return Players;
};

exports.createPlayer = function (socketid, fn) {
    var obj = {}, err = false;
    
    if (!Players.hasOwnProperty(socketid)) {
        obj.name = 'Player ' + nextID();
        obj.id = socketid;
        obj.socket = socketid; 
        obj.waiting = true; 
        
        Players[socketid] = new Player(obj); 
    }
    
    if (!Players.hasOwnProperty(socketid)) {
        err = true;
    }
    
    fn(err, Players[socketid]);
};


exports.getFromQueue = function (id, fn) {
    for (var playerId in Players) {
        if (Players[playerId].id !== id && Players[playerId].waiting) {
            Players[playerId].waiting = false;
            fn(false, Players[playerId]);
            return;
        }
    }
    
    fn(true, {});
};


exports.playersOnline = function () {
    var allplayers = [];
    
    for (var playerId in Players) {
        allplayers.push(Players[playerId]);   
    }

    allplayers = JSON.stringify(allplayers);
    
    return allplayers;
};

exports.getPlayer = function (id, fn) {
    var err = false;
    
    if (!Players.hasOwnProperty(id)) {
        err = true;
    }
    
    fn(err, Players[id]);
};

exports.updateOpponent = function (id, opp) { 
    if (Players.hasOwnProperty(id) && Players.hasOwnProperty(opp)) {
        Players[id].opponent = opp;
        Players[opp].opponent = id;
        
        return true;
    }
    else if (Players.hasOwnProperty(id) && !opp) {
        Players[id].opponent = opp;
        return true;
    }
    else {
       return false;
    }
};


exports.destroy = function (id) {
    if (Players.hasOwnProperty(id)) {
        var opponent = Players[id].opponent;
        
        if (Players.hasOwnProperty(opponent)) {
            addToQueue(opponent);
        }

        delete Players[id];
        
        return !(Players.hasOwnProperty(id));
    }
    else {
        return false;
    }
    
};
