var Character = require('../models/character-model');
var debug = require('debug')('ffapp:character-controller');

///////API functions

exports.create = function(req, res, next) {
  let newCharacter = new Character({
    name            : req.body.name,
    provisions      : req.body.provisions,
    gold            : req.body.gold,
    items           : req.body.items,
    campaignId      : req.body.campaignId,
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

///////Socket functions

exports.updateByCampaignId = function(io, id, character) {
  var promise = Character.findOne({campaignId: id}).exec();

  promise.then(result => {
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
  .then(() => io.in(id).emit('packet', {type: 'update-character', character: character}))
  .catch(err => debug('updateByCampaignId error: ', err));
};
