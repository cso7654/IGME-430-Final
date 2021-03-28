const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
res.render('login');
};

const signupPage = (req, res) => {
res.render('signup');
};

const logout = (req, res) => {
res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password){
    return res.status(400).json({error: "Username and password required!"});
  }
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account){
    return res.status(401).json({error: "Wrong username or password"});
  }
  return res.json({redirect: '/maker'});
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2){
    return res.status(400).json({error: "All fields are required!"});
  }
  if (req.body.pass !== req.body.pass2){
    return res.status(400).json({error: "Both passwords must match!"});
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accData = {
      username: req.body.username,
    salt,
    password: hash
  };

  const newAcc = new Account.AccountModel(accData);
  const savePromise = newAcc.save();

  savePromise.then(() => {
      res.json({redirect: '/maker'});
  });

  savePromise.catch((err) => {
      console.log(err);

    if (err.code === 11000){
      return res.status(400).json({error: 'Username already in use'});
    }

    return res.status(400).json({error: 'An error occured'});
  });
  });
};

module.exports.loginPage = loginPage;
module.exports.signupPage = signupPage;
module.exports.logout = logout;
module.exports.login = login;
module.exports.signup = signup;