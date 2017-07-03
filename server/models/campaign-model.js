var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Campaign = new Schema({
    name          : {type: String, required: true},
    description   : {type: String, required: true},

    initialProvisions : {type: Number, default: 0},
    initialGold       : {type: Number, default: 0},
    initialItems      : {type: [String], default: []},

    hasEnded    : {type: Boolean, default: false},
    private     : {type: Boolean, default: false},
    password    : {type: String}, //hashed and salted
    battleMode  : {type: Boolean, default: false},

    creationTime  : {type: Date, default: Date.now, required: true},
    lastPlayBy    : {type: String, enum: ['gm', 'player'], required: true},
    lastPlayTime  : {type: Date, default: Date.now, required: true},

    character   : {type: Schema.Types.ObjectId, ref: 'Character'},
    monsters    : {type: [{type: Schema.Types.ObjectId, ref: 'Monster'}]},

    inCharacterLog: {type: [{
          posted:     {type: Date, required: true},
          senderName: {type: String, required: true},
          message:    {type: String, required: true}
    }], default: []},
    outOfCharacterLog: {type: [{
          posted:     {type: Date, required: true},
          senderName: {type: String, required: true},
          message:    {type: String, required: true}
    }], default: []}
});

module.exports = mongoose.model('Campaign', Campaign );
