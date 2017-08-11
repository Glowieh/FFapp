var debug = require('debug')('ffapp:socket-controller');
var async = require('async');

var Campaign = require('../models/campaign-model');
var Monster = require('../models/monster-model');
var Character = require('../models/character-model');

exports.init = function(io) {
  io.on('connection', (socket) => {
    var id = socket.handshake.query.id;
    debug('A user connected to id: ' + id);

    socket.on('disconnect', () => {
      debug('A user disconnected from id: ' + id);
    });

      //laita ryhmään

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

      socket.on('ic-message', (message) => {
        message.posted = new Date();

        //EI JÄRKEVÄÄ, TEE ERI TIEDOSTOON TIETOKANNAN KÄPISTELY
        Campaign.findById(id, function(err, result) {
          if(err) { debug("ic-message campaign find error"); }
          else {
            if(result) {
              result.inCharacterLog.push(message);
              result.save(function (err) {
                if (err) { debug("ic-message campaign save error"); }
                else {
                  socket.emit('packet', {type: 'ic-message', message: message});
                }
              });
            }
          }
        });
      });

      socket.on('ooc-message', (message) => {
        message.posted = new Date();
        socket.emit('packet', {type: 'ooc-message', message: message});
      });

      //end of async.parallel
    });
  });
}
