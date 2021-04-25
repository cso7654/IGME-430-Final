const models = require('../models');

const { Character } = models;

// Returns all characters for a user
const getCharacters = (request, response) => {
  const req = request;
  const res = response;

  return Character.CharacterModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ chars: docs });
  });
};

// Gets all characters with the requested name
const getCharactersByName = (request, response) => {
  const req = request;
  const res = response;

  return Character.CharacterModel.findByName(req.body.name, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ chars: docs });
  });
};

// Go to the user's page (lists all characters)
const userPage = (req, res) => {
  Character.CharacterModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { chars: docs, csrfToken: req.csrfToken() });
  });
};

// Create a new character
const makeCharacter = (req, res) => {
  if (!req.body.name || !req.body.class || !req.body.level) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const CharacterData = {
    name: req.body.name,
    class: req.body.class,
    level: req.body.level,
    owner: req.session.account._id,
  };

  const newCharacter = new Character.CharacterModel(CharacterData);

  const CharacterPromise = newCharacter.save()
    .then(() => res.json({ redirect: '/user' }))
    .catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Character already exists' });
      }
      return res.status(400).json({ error: 'An error occured' });
    });

  return CharacterPromise;
};

// Delete an existing character
const deleteCharacter = (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({ error: 'No ID provided for deletion' });
  }

  const CharacterPromise = Character.CharacterModel.deleteOne({ _id: req.body.id })
    .then(() => res.json({ redirect: '/user' }))
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ error: 'Could not delete character!' });
    });

  return CharacterPromise;
};

module.exports.makerPage = userPage;
module.exports.makeCharacter = makeCharacter;
module.exports.getCharacters = getCharacters;
module.exports.deleteCharacter = deleteCharacter;
module.exports.getCharactersByName = getCharactersByName;
