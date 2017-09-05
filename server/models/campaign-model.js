var mongoose = require('mongoose');
var sanitizerPlugin = require('mongoose-sanitizer');
var debug = require('debug')('ffapp:campaign-model');

var Monster = require('../models/monster-model');
var Character = require('../models/character-model');

var Schema = mongoose.Schema;

var ChatMessage = new Schema({
  posted:     {type: Date, required: true},
  senderName: {type: String, required: true, minlength: 1, maxlength: 16},
  message:    {type: String, required: true}
});

var Campaign = new Schema({
  name          : {type: String, required: true, minlength: 3, maxlength: 32},
  description   : {type: String, required: true, minlength: 1, maxlength: 512},

  initialProvisions : {type: Number, default: 0, min: [0, 'No negative provisions allowed.']},
  initialGold       : {type: Number, default: 0, min: [0, 'No negative gold allowed.']},
  initialItems      : {type: [String], default: []},

  hasEnded      : {type: Boolean, default: false},
  private       : {type: Boolean, default: false},
  playerPassword: {type: String}, //hashed and salted
  gmPassword    : {type: String}, //hashed and salted
  battleMode    : {type: Boolean, default: false},

  creationTime  : {type: Date, default: Date.now, required: true},
  lastPlayBy    : {type: String, enum: ['GM', 'Player', 'None'], required: true},
  lastPlayTime  : {type: Date, default: Date.now, required: true},

  inCharacterLog: {type: [ChatMessage], default: []},
  outOfCharacterLog: {type: [ChatMessage], default: []}
});

Campaign.pre('remove', function(next) {
  Monster.remove({campaignId: this._id}, function(err) {
    if(err) { debug(err); }
    else { debug("Removed monsters of a deleted campaign"); }
  });

  Character.remove({campaignId: this._id}, function(err) {
    if(err) { debug(err); }
    else { debug("Removed the character of a deleted campaign"); }
  });
  next();
});

Campaign.plugin(sanitizerPlugin);

module.exports = mongoose.model('Campaign', Campaign );
