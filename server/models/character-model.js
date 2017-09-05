var mongoose = require('mongoose');
var sanitizerPlugin = require('mongoose-sanitizer');

var Schema = mongoose.Schema;

var Character = new Schema({
    name            : {type: String, required: false, minglength: 3, maxlength: 16},
    provisions      : {type: Number, required: true, min: [0, 'Provisions too low']},
    gold            : {type: Number, required: true, min: [0, 'Gold too low']},
    items           : {type: [String]},
    campaignId      : {type: Schema.Types.ObjectId, ref: 'Campaign'},

    skill           : {type: Number, required: false, min: [1, 'Skill too low']},
    maxSkill        : {type: Number, required: false, min: [1, 'Max skill too low']},
    swordsmanship   : {type: Number, required: false, min: [1, 'Swordsmanship too low']},
    maxSwordsmanship: {type: Number, required: false, min: [1, 'Max swordsmanship too low']},
    luck            : {type: Number, required: false},
    maxLuck         : {type: Number, required: false, min: [1, 'Max luck too low']},
    stamina         : {type: Number, required: false},
    maxStamina      : {type: Number, required: false, min: [1, 'Max stamina too low']},
});

Character.plugin(sanitizerPlugin);

module.exports = mongoose.model('Character', Character );
