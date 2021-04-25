const models = require('../models');

const { Account } = models;

// Login to the site
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// Logout of the site
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required!' });
  }
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/user' });
  });
};

// Signup and create a new user
const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Both passwords must match!' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAcc = new Account.AccountModel(accData);
    newAcc.save()
      .then(() => {
        req.session.account = Account.AccountModel.toAPI(newAcc);
        res.json({ redirect: '/user' });
      })
      .catch((err) => {
        console.log(err);

        if (err.code === 11000) {
          return res.status(400).json({ error: 'Username already in use' });
        }

        return res.status(400).json({ error: 'An error occured' });
      });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = { csrfToken: req.csrfToken() };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.logout = logout;
module.exports.login = login;
module.exports.getToken = getToken;
module.exports.signup = signup;
