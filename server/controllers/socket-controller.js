var debug = require('debug')('ffapp:socket-controller');
var async = require('async');
var jwt = require('jsonwebtoken');
var config = require('../config');

var Campaign = require('../models/campaign-model');
var Monster = require('../models/monster-model');
var Character = require('../models/character-model');

var campaignController = require('../controllers/campaign-controller');
var monsterController = require('../controllers/monster-controller');
var characterController = require('../controllers/character-controller');


exports.init = function(io) {
  io.on('connection', (socket) => {
    var id = socket.handshake.query.id;
    var decoded = null;
    debug('A user connected to id: ' + id);

    try {
      decoded = jwt.verify(socket.handshake.query.token, config.secretKeyJWT);
    } catch(err) {
      debug('JWT verification failure');
      socket.disconnect(true);
      return;
    }

    if(decoded.campaignId != id || decoded.role != socket.handshake.query.role) {
      debug('Wrong campaign or role JWT');
      socket.disconnect(true);
      return;
    }

    socket.on('disconnect', () => {
      debug('A user disconnected from id: ' + id);
    });

    socket.join(id);

    async.parallel({
      character: (cb) => {
        Character.find({campaignId: id}).exec(cb);
      },
      campaign: (cb) => {
        Campaign.findById(id).exec(cb);
      },
      monsters: (cb) => {
        Monster.find({campaignId: id}).exec(cb);
      },
    }, (err, results) => {
      if(err) {
        console.log(err);
        socket.disconnect(true);
        return;
      }

      socket.emit('packet', {type: 'init', character: results.character[0], campaign: results.campaign, monsters: results.monsters});

      //Initialization done. Message handlers next

      socket.on('ic-message', (packet) => {
        packet.message.posted = new Date();
        campaignController.saveLogMessage(io, id, [packet.message], 'ic', true, packet.role);
      });

      socket.on('ooc-message', (packet) => {
        packet.message.posted = new Date();
        campaignController.saveLogMessage(io, id, [packet.message], 'ooc', true, packet.role);
      });

      socket.on('update-character', (packet) => {
        packet.message.posted = new Date();
        characterController.updateByCampaignId(io, id, packet.character, packet.message, true, packet.role);
      });

      socket.on('eat-provision', (packet) => {
        characterController.eatProvision(io, id);
      });

      socket.on('test-attribute', (packet) => {
        characterController.testAttribute(io, id, packet.stat, packet.difficulty);
      });

      socket.on('toggle-ended', (packet) => {
        campaignController.toggleEnded(io, id, true);
      });

      socket.on('toggle-battle', (packet) => {
        campaignController.toggleBattleMode(io, id, packet.monsters, true, packet.role);
      });

      socket.on('battle-round', (packet) => {
        monsterController.battleRound(io, id, packet.hitTarget);
      });

      socket.on('update-monster', (packet) => {
        packet.message.posted = new Date();
        monsterController.update(io, id, packet.monster, packet.message, packet.role);
      });

      socket.on('delete-monster', (packet) => {
        packet.message.posted = new Date();
        monsterController.delete(io, id, packet.monsterId, packet.message, packet.role);
      });
    }); //end of async.parallel
  }); //end of io.on('connection' ...)
}
