var sanitizerPlugin = require('mongoose-sanitizer');
var async = require('async');
var roll = require('../misc/roller');

var Monster = require('../models/monster-model');

var characterController = require('./character-controller');
var campaignController = require('./campaign-controller');

///////Socket functions

exports.setMonsters = function(id, monsters) {
  var promise = Monster.remove({campaignId: id}).exec();

  return promise.then(() => Monster.insertMany(monsters));
}

exports.battleRound = function(io, id, hitTarget) {
  var character, monsters;

  return characterController.getCharacterByCampaignId(id)
  .then((char) => {
    character = char;
    return getMonstersByCampaignId(id);
  })
  .then((mons) => {
    monsters = mons;

    var messages = conductBattleRound(hitTarget, monsters, character);
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
      characterController.updateByCampaignId(io, id, character, '', false, "Player")
      .then(() => campaignController.saveLogMessage(io, id, messages, 'ic', false, "Player")) //save battle action messages
      .then(() => {
        if(character.stamina <= 0) {
          campaignController.toggleEnded(io, id, false);
        }
        if(monsters.length == 0) {
          return campaignController.toggleBattleMode(io, id, null, false, "Player"); //save battle ended message
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
  })
  .catch(err => debug('battleRound error: ', err));
}

exports.update = function(io, id, monster, message, playedBy) {
  var promise = Monster.findOne({"_id": monster._id}).exec();

  return promise.then((result) => {
    if(result) {
      result.combatSkill = monster.combatSkill;
      result.stamina = monster.stamina;

      return result.save();
    }
  })
  .then(() => campaignController.saveLogMessage(io, id, [message], 'ic', false, playedBy))
  .then(() => io.in(id).emit('packet', {type: 'update-monster', monster: monster, message: message}))
  .catch(err => debug('update (Monster) error: ', err));
}

exports.delete = function(io, id, monsterId, message, playedBy) {
  var promise = Monster.remove({"_id": monsterId}).exec();

  return promise.then(() => campaignController.saveLogMessage(io, id, [message], 'ic', false, playedBy))
  .then(() => io.in(id).emit('packet', {type: 'delete-monster', monsterId: monsterId, message: message}))
  .catch(err => debug('delete (Monster) error: ', err));
}

function getMonstersByCampaignId(id) {
  var promise = Monster.find({campaignId: id}).exec();

  return promise.then(result => result);
};

function conductBattleRound(i, monsters, character) {
  let messages = [];

  messages.push(hit(monsters[i], true, character));

  monsters.forEach((monster, index) => {
    if(index != i && character.stamina > 0) {
      messages.push(hit(monster, false, character));
    }
  });

  return messages;
}

function hit(monster, characterHits, character) {
  let charRoll, monsterRoll;
  let msg = {senderName: "", message: "", posted: new Date()};

  charRoll = roll(1, 20)+character.swordsmanship;
  monsterRoll = roll(1, 20)+monster.combatSkill;

  if(charRoll > monsterRoll) {
    msg.senderName = "RollSuccess";
    if(!characterHits) {
      msg.message = "The " + monster.name + " tries to hit you, but you dodge it ";
    }
    else {
      msg.message = "You hit the " + monster.name + " ";

      monster.stamina -= 2;

      if(monster.stamina <= 0) {
        msg.message += "and kill it ";
      }
    }
  }
  else if(charRoll < monsterRoll) {
    msg.senderName = "RollFailure";
    if(!characterHits) {
      msg.message = "The " + monster.name + " hits you ";
    }
    else {
      msg.message = "You try to hit the " + monster.name + ", but it hits you ";
    }

    character.stamina -= 2;

    if(character.stamina <= 0) {
      msg.message += "and kills you ";
    }
  }
  else {
    if(!characterHits) {
      msg.senderName = "RollSuccess";
      msg.message = "The " + monster.name + " tries to hit you, but you dodge it ";
    }
    else {
      msg.senderName = "RollFailure";
      msg.message = "You try to hit the " + monster.name + ", but it dodges ";
    }
  }

  msg.message += "(" + charRoll + " vs " + monsterRoll +").";

  return msg;
}
