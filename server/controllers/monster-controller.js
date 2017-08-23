var sanitizerPlugin = require('mongoose-sanitizer');
var async = require('async');

var Monster = require('../models/monster-model');

var characterController = require('./character-controller');
var campaignController = require('./campaign-controller');

///////Socket functions

exports.setMonsters = function(id, monsters) {
  var promise = Monster.remove({campaignId: id}).exec();

  return promise.then(() => Monster.insertMany(monsters));
}

exports.battleRound = function(io, id, character, monsters, messages) {
  var saveFunctions = [];
  var toDelete = -1;

  monsters.forEach((monster, index) => {
    if(monster.stamina > 0) {
      saveFunctions.push((cb) => Monster.updateOne({"_id": monster._id}, {$set: {"stamina": monster.stamina}}).exec(cb));
    }
    else {
      saveFunctions.push((cb) => Monster.remove({"_id": monster._id}).exec(cb));
      toDelete = index;
    }
  });

  if(toDelete != -1) {
    monsters.splice(toDelete, 1);
  }

  async.parallel(saveFunctions, () => {
    characterController.updateByCampaignId(io, id, character, '', false)
    .then(() => campaignController.saveLogMessage(io, id, messages, 'ic', false))
    .then(() => {
      if(character.stamina <= 0) {
        campaignController.toggleEnded(io, id, false);
      }
      if(monsters.length == 0) {
        return campaignController.toggleBattleMode(io, id, false);
      }

      return null;
    })
    .then((endBattleMsg) => {
      if(endBattleMsg) {
        messages.push(endBattleMsg);
      }
      io.in(id).emit('packet', {type: 'battle-round', character: character, monsters: monsters, messages: messages})
    })
    .catch(err => debug('battleRound error: ', err));
  });
}

exports.update = function(io, id, monster, message) {
  var promise = Monster.findOne({"_id": monster._id}).exec();

  return promise.then((result) => {
    if(result) {
      result.combatSkill = monster.combatSkill;
      result.stamina = monster.stamina;

      return result.save();
    }
  })
  .then(() => campaignController.saveLogMessage(io, id, [message], 'ic', false))
  .then(() => io.in(id).emit('packet', {type: 'update-monster', monster: monster, message: message}))
  .catch(err => debug('update (Monster) error: ', err));
}

exports.delete = function(io, id, monsterId, message) {
  var promise = Monster.remove({"_id": monsterId}).exec();

  return promise.then(() => campaignController.saveLogMessage(io, id, [message], 'ic', false))
  .then(() => io.in(id).emit('packet', {type: 'delete-monster', monsterId: monsterId, message: message}))
  .catch(err => debug('delete (Monster) error: ', err));
}
