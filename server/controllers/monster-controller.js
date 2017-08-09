var sanitizerPlugin = require('mongoose-sanitizer');
var Monster = require('../models/monster-model');

exports.getByCampaignId = function(req, res, next) {
  Monster.find({campaignId: req.params.id}, function(err, result) {
    if(err) { return next(err); }

    res.send(JSON.stringify(result));
  });
};

exports.create = function(req, res, next) {
  let newMonster = new Monster({
    name            : req.body.name,
    campaignId     : req.body.campaignId,
    combatSkill     : req.body.combatSkill,
    stamina         : req.body.stamina,
    maxStamina      : req.body.maxStamina
  });

  newMonster.save(function (err) {
    if (err) { return next(err); }
    res.sendStatus(200);
  });
};

exports.update = function(req, res, next) {
  Monster.findById(req.params.id, function(err, result) {
    if(err) { return next(err); }

    if(result) {
      result.stamina = req.body.stamina || result.stamina;

      result.save(function (err) {
        if (err) { return next(err); }
        res.sendStatus(200);
      });
    }
    else { res.sendStatus(404); }
  });
};

exports.delete = function(req, res, next) {
  Monster.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) { return next(err); }
    res.sendStatus(200);
  });
}
