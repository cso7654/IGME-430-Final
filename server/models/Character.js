const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let CharacterModel = {};

const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const CharacterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  class: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  system: {
    type: String,
    required: true,
  },
  stats: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

// Convert to JSON
CharacterSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  class: doc.class,
  level: doc.level,
  system: doc.system,
  stats: doc.stats,
  owner: doc.owner,
});

// Find characters based on their owner
CharacterSchema.statics.findByOwner = (ownerID, callback) => {
  const search = {
    owner: convertID(ownerID),
  };
  return CharacterModel.find(search).select('name class level system stats').lean().exec(callback);
};

// Find characters based on their name
CharacterSchema.statics.findByName = (name, callback) => {
  const search = {
    name,
  };
  return CharacterModel.find(search).select('name class level system stats').lean().exec(callback);
};

// Find characters based on their ID
CharacterSchema.statics.findByID = (id, callback) => {
  const search = {
    _id: id,
  };
  return CharacterModel.find(search).select('name class level system stats').lean().exec(callback);
};

CharacterModel = mongoose.model('Character', CharacterSchema);

module.exports.CharacterModel = CharacterModel;
module.exports.CharacterSchema = CharacterSchema;
