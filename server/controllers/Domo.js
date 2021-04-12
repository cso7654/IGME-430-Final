const models = require('../models');

const { Domo } = models;

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ domos: docs });
  });
};

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { domos: docs, csrfToken: req.csrfToken() });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.hobby) {
    return res.status(400).json({ error: 'RAWR! All fields are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    hobby: req.body.hobby,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save()
    .then(() => res.json({ redirect: '/maker' }))
    .catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Domo already exists' });
      }
      return res.status(400).json({ error: 'An error occured' });
    });

  return domoPromise;
};

const deleteDomo = (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({ error: 'No ID provided for deletion' });
  }

  const domoPromise = Domo.DomoModel.deleteOne({ _id: req.body.id })
    .then(() => res.json({ redirect: '/maker' }))
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ error: 'RAWR! Could not delete domo!' });
    });

  return domoPromise;
};

module.exports.makerPage = makerPage;
module.exports.makeDomo = makeDomo;
module.exports.getDomos = getDomos;
module.exports.deleteDomo = deleteDomo;
