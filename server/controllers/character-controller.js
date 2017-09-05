var debug = require('debug')('ffapp:character-controller');
var Character = require('../models/character-model');
var roll = require('../misc/roller');

var campaignController = require('./campaign-controller');

///////API functions

exports.create = function(req, res, next) {
  let newCharacter = initNewChar(req);

  newCharacter.save(function (err) {
    if (err) { return next(err); }
    res.sendStatus(200);
  });
};

function initNewChar(req) {
  return new Character({
    name            : req.body.character.name,
    provisions      : req.body.character.provisions,
    gold            : req.body.character.gold,
    items           : req.body.character.items,
    campaignId      : req.body.character.campaignId,
    skill           : req.body.character.skill,
    maxSkill        : req.body.character.maxSkill,
    swordsmanship   : req.body.character.swordsmanship,
    maxSwordsmanship: req.body.character.maxSwordsmanship,
    luck            : req.body.character.luck,
    maxLuck         : req.body.character.maxLuck,
    stamina         : req.body.character.stamina,
    maxStamina      : req.body.character.maxStamina
  });
}

exports.getByCampaignId = function(req, res, next) {
  Character.findOne({campaignId: req.params.id}, function(err, result) {
    if(err) { return next(err); }

    res.send(JSON.stringify(result));
  });
};

exports.getCharacterByCampaignId = function(id) {
  var promise = Character.findOne({campaignId: id}).exec();
  return promise.then(result => result);
};

exports.update = function(req, res, next) {
  Character.findOne({campaignId: req.body.campaignId}, function(err, result) {
    if(err) { return next(err); }

    if(result) {
      result.name = req.body.name;

      result.save(function (err) {
        if (err) { return next(err); }
        res.sendStatus(200);
      });
    }
    else { res.sendStatus(404); }
  });
};

exports.addStat = function(req, res, next) {
  Character.findOne({campaignId: req.body.character.campaignId}, function(err, result) {
    if(err) { return next(err); }

    if(result) { //update existing character
      if(!result[req.body.stat]) {
        let rollResult = rollStat(req.body.stat)
        let maxStat = 'max' + req.body.stat[0].toUpperCase() + req.body.stat.slice(1);
        Object.assign(result, {[req.body.stat]: rollResult, [maxStat]: rollResult, 'name': req.body.character.name});

        result.save(function (err) {
          if (err) { return next(err); }
          res.send(JSON.stringify(result));
        });
      }
      else {
        res.send(JSON.stringify(result));
      }
    }
    else { //create new character
      let newCharacter = initNewChar(req);
      let rollResult = rollStat(req.body.stat)
      let maxStat = 'max' + req.body.stat[0].toUpperCase() + req.body.stat.slice(1);
      Object.assign(newCharacter, {[req.body.stat]: rollResult, [maxStat]: rollResult});

      newCharacter.save(function (err) {
        if (err) { return next(err); }
        res.send(JSON.stringify(newCharacter));
      });
    }
  });
};

function rollStat(stat) {
  switch(stat) {
    case 'swordsmanship': {
      return roll(2, 6)+6;
    }
    case 'skill': {
      return roll(2, 6)+6;
    }
    case 'luck': {
      return roll(2, 6)+6;
    }
    case 'stamina': {
      return roll(2, 6)+12;
    }
  }

  return 0;
}

///////Socket functions

exports.updateByCampaignId = function(io, id, character, message, emit) {
  var promise = Character.findOne({campaignId: id}).exec();

  return promise.then(result => {
    if(result) {
      result.swordsmanship = character.swordsmanship;
      result.skill = character.skill;
      result.luck = character.luck;
      result.stamina = character.stamina;
      result.gold = character.gold;
      result.provisions = character.provisions
      result.items = character.items;

      return result.save();
    }
  })
  .then(() => {
    if(emit) {
      campaignController.saveLogMessage(io, id, [message], 'ic', false);
    }
  })
  .then(() => {
    if(emit) {
      io.in(id).emit('packet', {type: 'update-character', character: character, message: message});
    }
  })
  .catch(err => debug('updateByCampaignId error: ', err));
};

exports.eatProvision = function(io, id) {
  var promise = Character.findOne({campaignId: id}).exec();
  var character, message;

  return promise.then(result => {
    if(result && result.provisions > 0) {
      result.provisions--;
      result.stamina += 4;
      if(result.stamina > result.maxStamina) {
        result.stamina = result.maxStamina;
      }
      character = result;

      return result.save();
    }
  })
  .then(() => {
    message = {senderName: "None", message: "The character ate a provision.", posted: new Date()};
    return campaignController.saveLogMessage(io, id, [message], 'ic', false);
  })
  .then(() => {
    io.in(id).emit('packet', {type: 'update-character', character: character, message: message});
  })
  .catch(err => debug('eatProvision error: ', err));
};

exports.testAttribute = function(io, id, stat, difficulty) {
  var promise = Character.findOne({campaignId: id}).exec();
  var character, message;

  return promise.then(result => {
    if(result) {
      if(stat == 'luck') {
        let rollResult = roll(1, 20);
        let resultText;
        let senderName;
        let target = 20;

        if(rollResult+result.luck >= target) {
          resultText = "Luck test succeeded (" + (rollResult+result.luck) + " vs " + target + ").";
          senderName = "RollSuccess";
        }
        else {
          resultText = "Luck test failed (" + (rollResult+result.luck) + " vs " + target + ").";
          senderName = "RollFailure";
        }

        message = {senderName: senderName, message: resultText, posted: new Date()};
        result.luck--;
        character = result;

        return result.save();
      }
      else if(stat == 'skill') {
        let rollResult = roll(1, 20);
        let target;
        let resultText;
        let senderName;

        switch(difficulty){
          case 'easy': target=15;break;
          case 'normal': target=20;break;
          case 'hard': target=25;break;
          case 'extreme': target=30;break;
        }

        if(rollResult+result.skill >= target) {
          resultText = "Skill test (" + difficulty + ") succeeded (" + (rollResult+result.skill) + " vs " + target + ").";
          senderName = "RollSuccess";
        }
        else {
          resultText = "Skill test (" + difficulty + ") failed (" + (rollResult+result.skill) + " vs " + target + ").";
          senderName = "RollFailure";
        }

        message = {senderName: senderName, message: resultText, posted: new Date()};
        character = result;
      }
    }
  })
  .then(() => {
    return campaignController.saveLogMessage(io, id, [message], 'ic', false);
  })
  .then(() => {
    io.in(id).emit('packet', {type: 'update-character', character: character, message: message});
  })
  .catch(err => debug('testAttribute error: ', err));
};
