var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Monster = new Schema({
    name          : String,
    combatSkill   : Number,
    stamina       : Number,
    maxStamina    : Number,
});

module.exports = mongoose.model('Monster', Monster );
