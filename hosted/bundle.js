"use strict";

//Create a character
var handleCreate = function handleCreate(e) {
  e.preventDefault();
  $("#errorMessage").animate({
    width: "hide"
  }, 350);

  if ($("#charName").val() == "" || $("#charClass").val() == "" || $("#charLevel").val() == "") {
    handleError("All fields are required!");
    return false;
  }

  sendAjax("POST", $("#charForm").attr("action"), $("#charForm").serialize(), function () {
    loadCharsFromServer($("#csrfToken").val());
  });
  return false;
}; //Search for a character


var handleSearch = function handleSearch(e) {
  e.preventDefault();

  if ($("#searchName").val() == "") {
    handleError("Name required to search!");
    return false;
  } // sendAjax("POST", $("#searchForm").attr("action"), $("#searchForm").serialize(), function(){
  // 	loadCharsByNameFromServer($("#csrfToken").val(), $("#searchName").val());
  // });


  loadCharsByNameFromServer($("#csrfToken").val(), $("#searchName").val());
  return false;
}; //Clear search results


var clearSearch = function clearSearch(e) {
  e.preventDefault();
  loadCharsFromServer($("#csrfToken").val());
  return false;
}; //Delete a character


var handleDelete = function handleDelete(e) {
  e.preventDefault();
  var target = e.target;
  sendAjax("POST", $(target).attr("action"), $(target).serialize(), function () {
    loadCharsFromServer($("#csrfToken").val());
  });
  return false;
}; //The form for creating a character


var CharForm = function CharForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "charForm",
    onSubmit: handleCreate,
    name: "charForm",
    action: "/user",
    method: "POST",
    className: "charForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "charName",
    name: "name",
    type: "text",
    placeholder: "Character Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "class"
  }, "Class: "), /*#__PURE__*/React.createElement("input", {
    id: "charClass",
    name: "class",
    type: "text",
    placeholder: "Character Class"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "level"
  }, "Level: "), /*#__PURE__*/React.createElement("input", {
    id: "charLevel",
    name: "level",
    type: "text",
    placeholder: "Character Level"
  }), /*#__PURE__*/React.createElement("input", {
    id: "csrfToken",
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeCharSubmit",
    type: "submit",
    value: "Make Character"
  }));
}; //Form for searching for a character


var CharSearch = function CharSearch(props) {
  return /*#__PURE__*/React.createElement("div", {
    id: "search"
  }, /*#__PURE__*/React.createElement("form", {
    id: "searchForm",
    onSubmit: handleSearch,
    name: "searchForm",
    action: "/findChars",
    method: "POST",
    className: "charForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "searchName",
    name: "name",
    type: "text",
    placeholder: "Character Name"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "findCharSubmit",
    type: "submit",
    value: "Find Character"
  })), /*#__PURE__*/React.createElement("form", {
    id: "searchClear",
    onSubmit: clearSearch
  }, /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: "Clear Search"
  })));
}; //Display a user's characters in a list


var CharList = function CharList(props) {
  if (props.chars.length == 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "charList"
    }, /*#__PURE__*/React.createElement("h3", null, "No Characters"));
  }

  var nodes = props.chars.map(function (_char) {
    return /*#__PURE__*/React.createElement("div", {
      key: _char._id,
      className: "char"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "charName"
    }, " Name: ", _char.name, " "), /*#__PURE__*/React.createElement("h3", {
      className: "charClass"
    }, " Class: ", _char["class"], " "), /*#__PURE__*/React.createElement("h3", {
      className: "charLevel"
    }, " Level: ", _char.level, " "), /*#__PURE__*/React.createElement("form", {
      action: "/delete",
      onSubmit: handleDelete,
      method: "POST"
    }, /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "id",
      value: _char._id
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      type: "submit",
      value: "Delete Character",
      className: "deleteButton"
    })));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "charList"
  }, /*#__PURE__*/React.createElement("h2", null, "Your Characters"), nodes);
}; //Load all of a user's characters from the server


var loadCharsFromServer = function loadCharsFromServer(csrf) {
  sendAjax("GET", "/getChars", null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(CharList, {
      chars: data.chars,
      csrf: csrf
    }), document.querySelector("#characters"));
  });
}; //Search for chars from the server by name


var loadCharsByNameFromServer = function loadCharsByNameFromServer(csrf, name) {
  // document.querySelector
  sendAjax("POST", "/findChars", {
    name: name,
    _csrf: csrf
  }, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(CharList, {
      chars: data.chars,
      csrf: csrf
    }), document.querySelector("#characters"));
  });
}; //Setup the page


var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(CharForm, {
    csrf: csrf
  }), document.querySelector("#makeChar"));
  ReactDOM.render( /*#__PURE__*/React.createElement(CharSearch, {
    csrf: csrf
  }), document.querySelector("#searchChar"));
  loadCharsFromServer(csrf);
}; //Generate a CSRF token


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
