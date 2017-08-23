var debug = require('debug')('ffapp:socket-controller');
var async = require('async');

var Campaign = require('../models/campaign-model');
var Monster = require('../models/monster-model');
var Character = require('../models/character-model');

var campaignController = require('../controllers/campaign-controller');
var monsterController = require('../controllers/monster-controller');
var characterController = require('../controllers/character-controller');


exports.init = function(io) {
  io.on('connection', (socket) => {
    var id = socket.handshake.query.id;
    debug('A user connected to id: ' + id);

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
        campaignController.saveLogMessage(io, id, packet.message, 'ic', true);
        campaignController.setLastPlayed(io, id, packet.role);
      });

      socket.on('ooc-message', (packet) => {
        packet.message.posted = new Date();
        campaignController.saveLogMessage(io, id, packet.message, 'ooc', true);
        campaignController.setLastPlayed(io, id, packet.role);
      });

      socket.on('update-character', (packet) => {
        packet.message.posted = new Date();
        characterController.updateByCampaignId(io, id, packet.character, packet.message);
        campaignController.setLastPlayed(io, id, packet.role);
      });

      socket.on('toggle-ended', (packet) => {
        campaignController.toggleEnded(io, id);
        campaignController.setLastPlayed(io, id, packet.role);
      });

      socket.on('toggle-battle', (packet) => {
        campaignController.toggleBattleMode(io, id, packet.monsters);
        campaignController.setLastPlayed(io, id, packet.role);
      });
    }); //end of async.parallel
  }); //end of io.on('connection' ...)
}
