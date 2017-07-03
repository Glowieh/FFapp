var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Campaign = new Schema({
    name          : String,
    description   : String,

    initialProvisions : Number,
    initialGold       : Number,
    initialItems      : [String],

    hasEnded    : Boolean,
    private     : Boolean,
    password    : String,
    battleMode  : Boolean,

    creationTime  : Date,
    lastPlayBy    : String, // "player" | "gm"
    lastPlayTime  : Date,

    character   : {type: Schema.Types.ObjectId, ref: 'Character'},
    monsters    : [{type: Schema.Types.ObjectId, ref: 'Monster'}],

    inCharacterLog: [{
          posted: Date,
          senderName: String,
          message: String
        }],
    outOfCharacterLog: [{
          posted: Date,
          senderName: String,
          message: String
        }]
});

module.exports = mongoose.model('Campaign', Campaign );
