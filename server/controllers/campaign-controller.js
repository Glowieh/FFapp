var debug = require('debug')('ffapp:campaign-controller');
var passwordHash = require('password-hash');

var Campaign = require('../models/campaign-model');

var monsterController = require('./monster-controller');

///////API functions

exports.authenticateCampaign = function(req, res, next) {
  Campaign.findById(req.params.id, function(err, result) {
    if(err) { return next(err); }

    if(!result.private || passwordHash.verify(req.body.password, result.password)) {
      debug("Correct password");
      res.send(JSON.stringify(true));
    }
    else {
      debug("Wrong password");
      res.send(JSON.stringify(false));
    }
  });
};

exports.getAllBasic = function(req, res, next) {
  Campaign.find({}, 'name description hasEnded private lastPlayBy lastPlayTime creationTime', function(err, result) {
    if(err) { return next(err); }

    res.send(JSON.stringify(result));
  });
};

exports.getById = function(req, res, next) {
  Campaign.findById(req.params.id, function(err, result) {
    if(err) { return next(err); }

    res.send(JSON.stringify(result));
  });
};

exports.create = function(req, res, next) {
  let hashedPassword = null;

  if(req.body.password) {
    hashedPassword = passwordHash.generate(req.body.password);
  }

  let newCampaign = new Campaign({
    name          : req.body.name,
    description   : req.body.description,
    initialProvisions : req.body.initialProvisions,
    initialGold       : req.body.initialGold,
    initialItems      : req.body.initialItems,
    private     : req.body.private,
    password    : hashedPassword,
    lastPlayBy  : 'None'
  });

  newCampaign.save(function (err) {
    if (err) { return next(err); }
    res.sendStatus(200);
  });
};

exports.update = function(req, res, next) {
  Campaign.findById(req.params.id, function(err, result) {
    if(err) { return next(err); }

    if(result) {
      result.hasEnded = req.body.hasEnded || result.hasEnded;
      result.battleMode = req.body.battleMode || result.battleMode;
      result.lastPlayBy = req.body.lastPlayBy || result.lastPlayBy;
      result.lastPlayTime = req.body.lastPlayTime || result.lastPlayTime;

      if(req.body.messageIC) {
        result.inCharacterLog.push(req.body.messageIC);
      }

      if(req.body.messageOOC) {
          result.outOfCharacterLog.push(req.body.messageOOC);
      }

      result.save(function (err) {
        if (err) { return next(err); }
        res.sendStatus(200);
      });
    }
    else { res.sendStatus(404); }
  });
};

///////Socket functions

exports.saveLogMessage = function(io, id, messages, type, emit) {
  var promise = Campaign.findById(id).exec();

  return promise.then(result => {
    if(result) {
      if(type == 'ic') {
        messages.forEach((msg) => result.inCharacterLog.push(msg));
      }
      else {
        messages.forEach((msg) => result.outOfCharacterLog.push(msg));
      }

      return result.save();
    }
  })
  .then(() => {
    if(emit) {
      if(type == 'ic') {
        io.in(id).emit('packet', {type: 'ic-message', message: messages[0]})  //when emit = true, there's only one message in the array
      }
      else {
        io.in(id).emit('packet', {type: 'ooc-message', message: messages[0]})
      }
    }
  })
  .catch(err => debug('saveLogMessage error: ', err));
}

exports.setLastPlayed = function(io, id, playedBy) {
  var promise = Campaign.findById(id).exec();

  return promise.then(result => {
    if(result) {
      result.lastPlayBy = playedBy;
      result.lastPlayTime = new Date();

      return result.save();
    }
  })
  .catch(err => debug('setLastPlayed error: ', err));
}

exports.toggleEnded = function(io, id, emit) {
  var promise = Campaign.findById(id).exec();
  var endState;
  var msg = {senderName: "None", message: "", posted: new Date()};

  return promise.then(result => {
    if(result) {
      endState = result.hasEnded = !result.hasEnded;

      if(endState) {
        msg.message = "The campaign has ended!";
      }
      else {
        msg.message = "The campaign has been restarted!";
      }

      return result.save();
    }
  })
  .then(() => {
    if(emit) {
      exports.saveLogMessage(io, id, [msg], 'ic', false);
    }
  })
  .then(() => {
    if(emit) {
      io.in(id).emit('packet', {type: 'toggle-ended', endState: endState, message: msg});
    }
  })
  .catch(err => debug('toggleEnded error: ', err));
}

exports.toggleBattleMode = function(io, id, monsters, emit) {
  var promise = Campaign.findById(id).exec();
  var battleState;
  var msg = {senderName: "None", message: "", posted: new Date()};

  return promise.then(result => {
    if(result) {
      battleState = result.battleMode = !result.battleMode;

      if(battleState) {
        msg.message = "Entering battle mode.";
      }
      else {
        msg.message = "Exiting battle mode.";
      }

      return result.save();
    }
  })
  .then(() => {
    exports.saveLogMessage(io, id, [msg], 'ic', false)
  })
  .then(() => {
    if(!battleState) {
      return battleState;
    }
    else {
      return monsterController.setMonsters(id, monsters);
    }
  })
  .then((result) => {
    if(battleState) {
      monsters.forEach((monster, i) => monster._id = result[i]._id);
    }
    if(emit) {
      io.in(id).emit('packet', {type: 'toggle-battle', battleState: battleState, monsters: monsters, message: msg});
    }
    else {
      return msg;
    }
  })
  .catch(err => debug('toggleBattleMode error: ', err));
}
