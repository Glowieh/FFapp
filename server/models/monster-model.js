var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Monster = new Schema({
    name          : {type: String, required: true},
    combatSkill   : {type: Number, required: true},
    stamina       : {type: Number, required: true},
    maxStamina    : {type: Number, required: true},
});

module.exports = mongoose.model('Monster', Monster );
