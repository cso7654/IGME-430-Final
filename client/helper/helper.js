const handleError = (message) => {
//   $("#errorMessage").text(message);
  window.alert(message);
//   $("#errorMessage").animate({width:"toggle"}, 350);
};

const redirect = (response) => {
//   $("#errorMessage").animate({width:"hide"}, 350);
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function(xhr, status, error) {
      let messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  })
};

const handleLogin = (e) => {
  e.preventDefault();

//   $("#errorMessage").animate({width:"hide"}, 350);

  if ($("#user").val() == "" || $("#pass").val() == ""){
    handleError("Username or password is empty!");
	return false;
  }

  console.log($("input[name=_csrf").val());

  sendAjax("POST", $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

const handleSignup = (e) => {
  e.preventDefault();

  if ($("#user").val() == "" || $("#pass").val() == "" || $("#pass2").val() == ""){
    handleError("All fields are required!");
	return false;
  }

  if ($("#pass").val() !== $("#pass2").val()){
    handleError("Passwords do not match!");
	return false;
  }

  sendAjax("POST", $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

  return false;
}