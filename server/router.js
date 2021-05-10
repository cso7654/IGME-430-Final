const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/user', mid.requiresLogin, controllers.Character.makerPage);
  app.post('/user', mid.requiresLogin, controllers.Character.makeCharacter);

  app.post('/changePass', mid.requiresLogin, controllers.Account.changePassword);

  app.post('/delete', mid.requiresLogin, controllers.Character.deleteCharacter);

  app.get('/getChars', mid.requiresLogin, controllers.Character.getCharacters);
  app.post('/getChar', mid.requiresLogin, controllers.Character.getCharacter);

  app.post('/findChars', mid.requiresLogin, controllers.Character.getCharactersByName);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
