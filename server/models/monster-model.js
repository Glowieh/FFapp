var mongoose = require('mongoose');
var sanitizerPlugin = require('mongoose-sanitizer');

var Schema = mongoose.Schema;

var Monster = new Schema({
    name          : {type: String, required: true},
    campaign_id   : {type: Schema.Types.ObjectId, ref: 'Campaign'},
    combatSkill   : {type: Number, required: true, min: [1, 'Combat skill too low']},
    stamina       : {type: Number, required: true},
    maxStamina    : {type: Number, required: true, min: [1, 'Max stamina too low']},
});

Monster.plugin(sanitizerPlugin);

module.exports = mongoose.model('Monster', Monster );
