"use strict";

var handleDomo = function handleDomo(e) {
  e.preventDefault();
  $("#domoMessage").animate({
    width: "hide"
  }, 350);

  if ($("#domoName").val() == "" || $("#domoAge").val() == "" || $("#domoHobby").val() == "") {
    handleError("RAWR! All fields are required!");
    return false;
  }

  sendAjax("POST", $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer($("#csrfToken").val());
  });
  return false;
};

var handleDelete = function handleDelete(e) {
  e.preventDefault();
  var target = e.target;
  sendAjax("POST", $(target).attr("action"), $(target).serialize(), function () {
    loadDomosFromServer($("#csrfToken").val());
  });
  return false;
};

var DomoForm = function DomoForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "domoForm",
    onSubmit: handleDomo,
    name: "domoForm",
    action: "/maker",
    method: "POST",
    className: "domoForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "domoName",
    name: "name",
    type: "text",
    placeholder: "Domo Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "age"
  }, "Age: "), /*#__PURE__*/React.createElement("input", {
    id: "domoAge",
    name: "age",
    type: "text",
    placeholder: "Domo Age"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "hobby"
  }, "Hobby: "), /*#__PURE__*/React.createElement("input", {
    id: "domoHobby",
    name: "hobby",
    type: "text",
    placeholder: "Domo Hobby"
  }), /*#__PURE__*/React.createElement("input", {
    id: "csrfToken",
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeDomoSubmit",
    type: "submit",
    value: "Make Domo"
  }));
};

var DomoList = function DomoList(props) {
  if (props.domos.length == 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "domoList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyDomo"
    }, "No Domos Yet"));
  }

  var domoNodes = props.domos.map(function (domo) {
    return /*#__PURE__*/React.createElement("div", {
      key: domo._id,
      className: "domo"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/domoface.jpeg",
      alt: "domo face",
      className: "domoFace"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "domoName"
    }, " Name: ", domo.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "domoAge"
    }, " Age: ", domo.age, " "), /*#__PURE__*/React.createElement("h3", {
      className: "domoHobby"
    }, " Hobby: ", domo.hobby, " "), /*#__PURE__*/React.createElement("form", {
      action: "/delete",
      onSubmit: handleDelete,
      method: "POST"
    }, /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "id",
      value: domo._id
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      type: "submit",
      value: "Delete Domo",
      className: "deleteButton"
    })));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "domoList"
  }, domoNodes);
};

var loadDomosFromServer = function loadDomosFromServer(csrf) {
  sendAjax("GET", "/getDomos", null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
      domos: data.domos,
      csrf: csrf
    }), document.querySelector("#domos"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoForm, {
    csrf: csrf
  }), document.querySelector("#makeDomo"));
  ReactDOM.render( /*#__PURE__*/React.createElement(DomoList, {
    domos: [],
    csrf: csrf
  }), document.querySelector("#domos"));
  loadDomosFromServer(csrf);
};

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
  $("#errorMessage").text(message);
  $("#domoMessage").animate({
    width: "toggle"
  }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({
    width: "hide"
  }, 350);
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
  e.preventDefault();
  $("#domoMessage").animate({
    width: "hide"
  }, 350);

  if ($("#user").val() == "" || $("#pass").val() == "") {
    handleError("RAWR! Username or password is empty!");
    return false;
  }

  console.log($("input[name=_csrf").val());
  sendAjax("POST", $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();

  if ($("#user").val() == "" || $("#pass").val() == "" || $("#pass2").val() == "") {
    handleError("RAWR! All fields are required!");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("RAWR! Passwords do not match!");
    return false;
  }

  sendAjax("POST", $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
};
