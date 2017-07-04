var sanitizerPlugin = require('mongoose-sanitizer');
var Monster = require('../models/monster-model');

exports.getByCampaignId = function(req, res, next) {
  Monster.find({campaign_id: req.params.id}, function(err, result) {
    if(err) { return next(err); }

    res.send(JSON.stringify(result));
  });
};

exports.create = function(req, res, next) {
  let newMonster = new Monster({
    name            : req.body.name,
    campaign_id     : req.body.campaign_id,
    combatSkill     : req.body.combatSkill,
    stamina         : req.body.stamina,
    maxStamina      : req.body.maxStamina
  });

  newMonster.save(function (err) {
    if (err) { return next(err); }
    res.sendStatus(200)
  });
};

exports.update = function(req, res, next) {
  Monster.findById(req.params.id, function(err, result) {
    if(err) { return next(err); }

    result.stamina = req.body.stamina || result.stamina;

    result.save(function (err) {
      if (err) { return next(err); }
      res.sendStatus(200)
    });
  });
};

exports.delete = function(req, res, next) {
  Monster.remove({_id: req.params.id}, function(err, result) {
    if (err) { return next(err); }
    res.sendStatus(200)
  });
}
