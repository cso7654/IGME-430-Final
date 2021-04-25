const LoginWindow = (props) => {
  return (
    <form id="loginForm" name="loginForm" onSubmit={handleLogin} action="/login" method="POST" className="mainForm">
      <label htmlFor="username">Username: </label>
	  <input id="user" name="username" type="text" placeholder="username"></input>
	  <label htmlFor="password">Password: </label>
	  <input id="pass" name="password" type="password" placeholder="password"></input>
	  <input type="hidden" name="_csrf" value={props.csrf}></input>
	  <input className="formSubmit" type="submit" value="Sign In"></input>
	</form>
  );
}

const SignupWindow = (props) => {
  return (
    <form id="signupForm" name="signupForm" onSubmit={handleSignup} action="/signup" method="POST" className="mainForm">
      <label htmlFor="username">Username: </label>
	  <input id="user" name="username" type="text" placeholder="username"></input>
	  <label htmlFor="password">Password: </label>
	  <input id="pass" name="password" type="password" placeholder="password"></input>
	  <label htmlFor="password2">Password: </label>
	  <input id="pass2" name="password2" type="password" placeholder="retype password"></input>
	  <input type="hidden" name="_csrf" value={props.csrf}></input>
	  <input className="formSubmit" type="submit" value="Create Account"></input>
	</form>
  );
}

//Make window a login window
const createLoginWindow = (csrf) => {
	ReactDOM.render(
	  <LoginWindow csrf={csrf}></LoginWindow>,
	  document.querySelector("#content")
	);
}

//Make window a signup window
const createSignupWindow = (csrf) => {
	ReactDOM.render(
		<SignupWindow csrf={csrf}></SignupWindow>,
		document.querySelector("#content")
	)
}

//Setup the login/signup page
const setup = (csrf) => {
	const loginButton = document.querySelector("#loginButton");
	const signupButton = document.querySelector("#signupButton");

	signupButton.addEventListener("click", (e) => {
		e.preventDefault();
		createSignupWindow(csrf);
		return false;
	});
	loginButton.addEventListener("click", (e) => {
		e.preventDefault();
		createLoginWindow(csrf);
		return false;
	});
	createLoginWindow(csrf);
}

//Generate CSRF
const getToken = () => {
	sendAjax("GET", "/getToken", null, (result) => {
		setup(result.csrfToken);
	});
}

$(document).ready(function(){getToken();});