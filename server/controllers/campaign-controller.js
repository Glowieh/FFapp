var Campaign = require('../models/campaign-model');

exports.getAllBasic = function(req, res, next) {
  Campaign.find({}, 'name description ended private lastPlayBy lastPlayTime creationTime', function(err, result) {
    if(err) { return next(err); }

    res.send(JSON.stringify(result));
  });
};

exports.getById = function(req, res, next) {
  Campaign.findById(req.params.id, function(err, result) {
    if(err) { return next(err); }

    res.send(JSON.stringify(result));
  });
};

exports.addNew = function(req, res, next) {
  let newCampaign = new Campaign({
/*    name          : {type: String, required: true},
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
  });*/
};
