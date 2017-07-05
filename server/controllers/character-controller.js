var Character = require('../models/character-model');

exports.getByCampaignId = function(req, res, next) {
  Character.findOne({campaign_id: req.params.id}, function(err, result) {
    if(err) { return next(err); }

    res.send(JSON.stringify(result));
  });
};

exports.create = function(req, res, next) {
  let newCharacter = new Character({
    name            : req.body.name,
    provisions      : req.body.provisions,
    gold            : req.body.gold,
    items           : req.body.items,
    campaign_id     : req.body.campaign_id,
    skill           : req.body.skill,
    maxSkill        : req.body.maxSkill,
    swordsmanship   : req.body.swordsmanship,
    maxSwordsmanship: req.body.maxSwordsmanship,
    luck            : req.body.luck,
    maxLuck         : req.body.maxLuck,
    stamina         : req.body.stamina,
    maxStamina      : req.body.maxStamina
  });

  newCharacter.save(function (err) {
    if (err) { return next(err); }
    res.sendStatus(200);
  });
};

exports.updateByCampaignId = function(req, res, next) {
  Character.findOne({campaign_id: req.params.id}, function(err, result) {
    if(err) { return next(err); }

    if(result) {
      result.provisions = req.body.provisons || result.provisions;
      result.gold = req.body.gold || result.gold;
      result.items = req.body.items || result.items;
      result.skill = req.body.skill || result.skill;
      result.maxSkill = req.body.maxSkill || result.maxSkill;
      result.swordsmanship = req.body.swordsmanship || result.swordsmanship;
      result.maxSwordsmanship = req.body.maxSwordsmanship || result.maxSwordsmanship;
      result.luck = req.body.luck || result.luck;
      result.maxLuck = req.body.maxLuck || result.maxLuck;
      result.stamina = req.body.stamina || result.stamina;
      result.maxStamina = req.body.maxStamina || result.maxStamina;

      result.save(function (err) {
        if (err) { return next(err); }
        res.sendStatus(200);
      });
    }
    else { res.sendStatus(404); }
  });
};
