var assert = require("assert"), 
    should = require("should"),
    draft = require('../draft.js');
 
describe('draft', function () { 

    describe('#createPlayer()', function(){
        it('should save without error', function (done) {
            draft.createPlayer('3453534534345', function (err, user) {
                err.should.be.false;
                should.exist(user);
                user.should.be.a('object').and.have.property('id', '3453534534345');
                user.should.be.a('object').and.have.property('socket', '3453534534345');
                user.should.be.a('object').and.have.property('color', 'white');
                
                done();
            });
        });
    });


    describe('#createPlayer()', function(){
        it('should save without error', function (done) {
            draft.createPlayer('5767575757575', function (err, user) {
                err.should.be.false;
                should.exist(user);
                user.should.be.a('object').and.have.property('id', '5767575757575');
                user.should.be.a('object').and.have.property('socket', '5767575757575');
                user.should.be.a('object').and.have.property('color', 'white');
                
                done();
            });
        });
    });

    
    describe('#players()', function () {
        it('should bring back an object of players without error', function () {
            var players = draft.players();
            players.should.be.a('object').and.have.property('3453534534345');
        });
    });

    
    describe('#getFromQueue()', function(){
        it('should get player from queue without error', function (done) {
            draft.getFromQueue('3453534534345', function (err, user) {
                err.should.be.false;
                user.should.be.a('object');
                
                done();
            });
        });
    });

    
    describe('#playersOnline()', function(){
        it('Bring back an array of objects', function () {
            var online = draft.playersOnline();
            online = JSON.parse(online);
            should.exist(online);
            online.should.have.length(2); 
            online[0].should.be.a('object');
            online[1].should.be.a('object');
        });
    });

    
    describe('#getPlayer()', function(){
        it('should get player without error', function (done) {
            draft.getPlayer('3453534534345', function (err, player) {
                err.should.be.false;
                player.should.be.a('object').and.have.property('id', '3453534534345');
                
                done();
            });
        });
    });

    
    describe('#updateOpponent()', function(){
        it('should update oppnent and return true', function () {
            var update = draft.updateOpponent('3453534534345', '5767575757575');
            
            update.should.be.true; 
        });
    });

    
    describe('#destroy()', function(){
        it('should destroy player and return true or an object', function () {
            var update = draft.destroy('5767575757575');
            update.should.be.true; 
            update.should.be.a('object').and.have.property('opponent', '');
            update.should.be.a('object').and.have.property('waiting', true);
        });
    });

    
    describe('#getPlayer()', function(){
        it('should get player without error', function (done) {
            draft.getPlayer('3453534534345', function (err, player) {
                err.should.be.false;
                player.should.be.a('object').and.have.property('opponent', '');
                player.should.be.a('object').and.have.property('waiting', true);
                
                done();
            });
        });
    });
});