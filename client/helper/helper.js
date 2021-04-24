const handleError = (message) => {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({width:"toggle"}, 350);
};

const redirect = (response) => {
  $("#domoMessage").animate({width:"hide"}, 350);
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

  $("#domoMessage").animate({width:"hide"}, 350);

  if ($("#user").val() == "" || $("#pass").val() == ""){
    handleError("RAWR! Username or password is empty!");
	return false;
  }

  console.log($("input[name=_csrf").val());

  sendAjax("POST", $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

const handleSignup = (e) => {
  e.preventDefault();

  if ($("#user").val() == "" || $("#pass").val() == "" || $("#pass2").val() == ""){
    handleError("RAWR! All fields are required!");
	return false;
  }

  if ($("#pass").val() !== $("#pass2").val()){
    handleError("RAWR! Passwords do not match!");
	return false;
  }

  sendAjax("POST", $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

  return false;
}