var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Character = new Schema({
    name            : {type: String, required: true},
    provisions      : {type: Number, required: true},
    gold            : {type: Number, required: true},
    items           : {type: [String]},

    skill           : {type: Number, required: true},
    maxSkill        : {type: Number, required: true},
    swordsmanship   : {type: Number, required: true},
    maxSwordsmanship: {type: Number, required: true},
    luck            : {type: Number, required: true},
    maxLuck         : {type: Number, required: true},
    stamina         : {type: Number, required: true},
    maxStamina      : {type: Number, required: true},
});

module.exports = mongoose.model('Character', Character );
