var debug = require('debug')('ffapp:campaign-controller');

var Campaign = require('../models/campaign-model');

exports.getAllBasic = function(req, res, next) {
  Campaign.find({}, 'name description hasEnded private lastPlayBy lastPlayTime creationTime character', function(err, result) {
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
  let newCampaign = new Campaign({
    name          : req.body.name,
    description   : req.body.description,
    initialProvisions : req.body.initialProvisions,
    initialGold       : req.body.initialGold,
    initialItems      : req.body.initialItems,
    private     : req.body.private,
    password    : req.body.password,
    lastPlayBy  : 'gm'
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

exports.delete = function(req, res, next) {
  Campaign.findOne({_id: req.params.id}, function(err, result) {
    if (err) { return next(err); }
      //fires the hook to remove related monsters and the player character
    if(result) {
      result.remove(function(err) {
        if (err) { return next(err); }

        res.sendStatus(200);
      });
    }
    else { res.sendStatus(404); }
  });
}
