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
  const password = `${req.body.password}`;

  if (!username || !password || username === undefined || password === undefined) {
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

const changePassword = (request, response) => {
  const req = request;
  const res = response;

  const pass = `${req.body.newPass}`;
  const pass2 = `${req.body.confirmNewPass}`;

  if (pass === '' || pass2 === '' || pass === undefined || pass2 === undefined) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (pass !== pass2) {
    return res.status(400).json({ error: 'Both passwords must match' });
  }

  // Find user
  return Account.AccountModel.findByUsername(`${req.session.account.username}`, (err, docs) => {
    if (err || !docs) {
      return res.status(400).json({ error: `Error: ${err}` });
    }
    // Hash the new password with the existing salt
    return Account.AccountModel.hashPassword(pass, docs[0].salt.buffer, (salt, hash) => {
      // This was the only way I could update it consistently
      Account.AccountModel.findOneAndUpdate({ _id: req.session.account._id }, { password: hash },
        { upsert: true }, (err2) => {
          if (err2) {
            return res.status(400).json({ error: `An error occured: ${err2}` });
          }
          // Password updated, go back to user page
          return res.json({ redirect: '/user' });
        });
      // return res.status(400).json({ error: 'An error occured' });
    });
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

  return Account.AccountModel.generateHash(req.body.password, (salt, hash) => {
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
module.exports.changePassword = changePassword;
