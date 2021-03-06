"use strict";

var LoginWindow = function LoginWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "loginForm",
    name: "loginForm",
    onSubmit: handleLogin,
    action: "/login",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    name: "username",
    type: "text",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "password"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    name: "password",
    type: "password",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign In"
  }));
};

var SignupWindow = function SignupWindow(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "signupForm",
    name: "signupForm",
    onSubmit: handleSignup,
    action: "/signup",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    name: "username",
    type: "text",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "password"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    name: "password",
    type: "password",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "password2"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    name: "password2",
    type: "password",
    placeholder: "retype password"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Create Account"
  }));
}; //Make window a login window


var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
}; //Make window a signup window


var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
}; //Setup the login/signup page


var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");
  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  createLoginWindow(csrf);
}; //Generate CSRF


var getToken = function getToken() {
  sendAjax("GET", "/getToken", null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  //   $("#errorMessage").text(message);
  window.alert(message); //   $("#errorMessage").animate({width:"toggle"}, 350);
};

var redirect = function redirect(response) {
  //   $("#errorMessage").animate({width:"hide"}, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

var handleLogin = function handleLogin(e) {
  e.preventDefault(); //   $("#errorMessage").animate({width:"hide"}, 350);

  if ($("#user").val() == "" || $("#pass").val() == "") {
    handleError("Username or password is empty!");
    return false;
  }

  console.log($("input[name=_csrf").val());
  sendAjax("POST", $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();

  if ($("#user").val() == "" || $("#pass").val() == "" || $("#pass2").val() == "") {
    handleError("All fields are required!");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match!");
    return false;
  }

  sendAjax("POST", $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
};
