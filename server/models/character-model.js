var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Character = new Schema({
    name            : String,
    provisions      : Number,
    gold            : Number,
    items           : [String],

    skill           : Number,
    maxSkill        : Number,
    swordsmanship   : Number,
    maxSwordsmanship: Number,
    luck            : Number,
    maxLuck         : Number,
    stamina         : Number,
    maxStamina      : Number,
});

module.exports = mongoose.model('Character', Character );
