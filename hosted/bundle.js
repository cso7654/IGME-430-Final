"use strict";

var _this = void 0;

//Create a character
var handleCreate = function handleCreate(e) {
  e.preventDefault();
  var stats = getStats();
  var data = {
    name: $("#charName").val(),
    level: $("#charLevel").val(),
    "class": $("#charClass").val(),
    system: $("#charSystem").val(),
    stats: JSON.stringify(stats),
    _csrf: $("#csrfToken").val()
  };
  sendAjax("POST", $("#charForm").attr("action"), data, function () {
    loadCharsFromServer($("#csrfToken").val());
  });
  return false;
}; //Search for a character


var handleSearch = function handleSearch(e) {
  e.preventDefault();

  if ($("#searchName").val() == "") {
    handleError("Name required to search!");
    return false;
  }

  loadCharsByNameFromServer($("#csrfToken").val(), $("#searchName").val());
  return false;
}; //Delete a character


var handleDelete = function handleDelete(e) {
  e.preventDefault();
  var target = e.target;
  sendAjax("POST", $(target).attr("action"), $(target).serialize(), function () {
    loadCharsFromServer($("#csrfToken").val());
  });
  return false;
}; //Used for going into the maker screen (separated because it looks better)


var goToMaker = function goToMaker(e) {
  ReactDOM.render( /*#__PURE__*/React.createElement(MakeChar, {
    csrf: document.querySelector("#csrfToken").value
  }), document.querySelector("#content"));
}; //Change user's password


var handleChangePassword = function handleChangePassword(e) {
  e.preventDefault();
  var target = e.target;
  sendAjax("POST", $(target).attr("action"), $(target).serialize(), function () {
    loadCharsFromServer($("#csrfToken").val());
  });
  return false;
}; //Make the stats section into a JSON object


var getStats = function getStats() {
  return {
    str: $("#charStr").val(),
    dex: $("#charDex").val(),
    con: $("#charCon").val(),
    "int": $("#charInt").val(),
    wis: $("#charWis").val(),
    cha: $("#charCha").val()
  };
}; //View a specific character


var viewChar = function viewChar(e) {
  e.preventDefault();
  var target = e.target;
  var params = $(target).serializeArray();
  sendAjax("POST", "/getChar", {
    id: params[0].value,
    _csrf: params[1].value
  }, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(CharView, {
      "char": data["char"],
      csrf: params[1].value
    }), document.querySelector("#content"));
  });
  return false;
}; //Go to the character list


var toCharList = function toCharList(e) {
  e.preventDefault();
  loadCharsFromServer($("#csrfToken").val());
  return false;
};

var handleSelectChange = function handleSelectChange(e) {
  _this.setState({
    value: e.target.value
  });
}; //The form for creating a character


var MakeChar = function MakeChar(props) {
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("form", {
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
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "system"
  }, "Game System: "), /*#__PURE__*/React.createElement("select", {
    id: "charSystem",
    name: "system",
    onChange: handleSelectChange,
    defaultValue: "5e"
  }, /*#__PURE__*/React.createElement("option", {
    value: "5e"
  }, "D&D 5th Edition (incomplete)")), /*#__PURE__*/React.createElement("h3", null, "Stats:"), /*#__PURE__*/React.createElement("label", {
    htmlFor: "strength"
  }, "Strength:"), /*#__PURE__*/React.createElement("input", {
    id: "charStr",
    name: "strength",
    type: "number",
    defaultValue: "0"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "dexterity"
  }, "Dexterity:"), /*#__PURE__*/React.createElement("input", {
    id: "charDex",
    name: "dexterity",
    type: "number",
    defaultValue: "0"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "constitution"
  }, "Constitution:"), /*#__PURE__*/React.createElement("input", {
    id: "charCon",
    name: "constitution",
    type: "number",
    defaultValue: "0"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "intelligence"
  }, "Intelligence:"), /*#__PURE__*/React.createElement("input", {
    id: "charInt",
    name: "intelligence",
    type: "number",
    defaultValue: "0"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "wisdom"
  }, "Wisdom:"), /*#__PURE__*/React.createElement("input", {
    id: "charWis",
    name: "wisdom",
    type: "number",
    defaultValue: "0"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "charisma"
  }, "Charisma:"), /*#__PURE__*/React.createElement("input", {
    id: "charCha",
    name: "charisma",
    type: "number",
    defaultValue: "0"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeCharSubmit",
    type: "submit",
    value: "Make Character"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    id: "cancelCreate",
    onClick: toCharList
  }, "Cancel")));
}; //Display a user's characters in a list. Also includes search and button to go to maker


var CharList = function CharList(props) {
  if (props.chars.length == 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "charList"
    }, /*#__PURE__*/React.createElement("div", {
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
      onSubmit: toCharList
    }, /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      type: "submit",
      value: "Clear Search"
    }))), /*#__PURE__*/React.createElement("h3", null, "No Characters"), /*#__PURE__*/React.createElement("button", {
      onClick: goToMaker
    }, "Make New Character"));
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
    }, " Level: ", _char.level, " "), /*#__PURE__*/React.createElement("h3", {
      className: "charLevel"
    }, " System: ", _char.system, " "), /*#__PURE__*/React.createElement("form", {
      action: "/getChar",
      onSubmit: viewChar,
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
      value: "View Character",
      className: "deleteButton"
    })), /*#__PURE__*/React.createElement("form", {
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
  }, /*#__PURE__*/React.createElement("div", {
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
    onSubmit: toCharList
  }, /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: "Clear Search"
  }))), /*#__PURE__*/React.createElement("h2", null, "Your Characters"), /*#__PURE__*/React.createElement("button", {
    onClick: goToMaker
  }, "Make New Character"), nodes);
}; //Get a view of a specific character


var CharView = function CharView(props) {
  var _char2 = props["char"];
  var stats = JSON.parse(_char2.stats);
  return /*#__PURE__*/React.createElement("section", {
    id: "charView"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "charName"
  }, " Name: ", _char2.name, " "), /*#__PURE__*/React.createElement("h3", {
    className: "charClass"
  }, " Class: ", _char2["class"], " "), /*#__PURE__*/React.createElement("h3", {
    className: "charLevel"
  }, " Level: ", _char2.level, " "), /*#__PURE__*/React.createElement("h3", {
    className: "charLevel"
  }, " System: ", _char2.system, " "), /*#__PURE__*/React.createElement("h3", null, "Stats:"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "Strength: ", stats.str), /*#__PURE__*/React.createElement("li", null, "Dexterity: ", stats.dex), /*#__PURE__*/React.createElement("li", null, "Constitution: ", stats.con), /*#__PURE__*/React.createElement("li", null, "Intelligence: ", stats["int"]), /*#__PURE__*/React.createElement("li", null, "Wisdom: ", stats.wis), /*#__PURE__*/React.createElement("li", null, "Charisma: ", stats.cha)), /*#__PURE__*/React.createElement("form", {
    action: "/delete",
    onSubmit: handleDelete,
    method: "POST"
  }, /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "id",
    value: _char2._id
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: "Delete Character",
    className: "deleteButton"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: toCharList
  }, "Back"));
};

var AccountManagement = function AccountManagement(props) {
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("h3", null, "Change Password:"), /*#__PURE__*/React.createElement("form", {
    id: "passChangeForm",
    name: "passChangeForm",
    onSubmit: handleChangePassword,
    action: "/changePass",
    method: "POST"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "newPass"
  }, "New Password:"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    id: "newPass",
    name: "newPass"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "confirmNewPass"
  }, "Confirm Password:"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    id: "confirmNewPass",
    name: "confirmNewPass"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: "Change Password"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: toCharList
  }, "Back"));
}; //Load all of a user's characters from the server


var loadCharsFromServer = function loadCharsFromServer(csrf) {
  sendAjax("GET", "/getChars", null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(CharList, {
      chars: data.chars,
      csrf: csrf
    }), document.querySelector("#content"));
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
    }), document.querySelector("#content"));
  });
}; //Get a specific char from the server by their ID


var getCharFromServer = function getCharFromServer(csrf, id) {
  // document.querySelector
  sendAjax("POST", "/getChar", {
    id: id,
    _csrf: csrf
  }, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(CharView, {
      "char": data["char"],
      csrf: csrf
    }), document.querySelector("#content"));
  });
}; //Setup the page


var setup = function setup(csrf) {
  document.querySelector("#accountLink").addEventListener("click", function (e) {
    ReactDOM.render( /*#__PURE__*/React.createElement(AccountManagement, {
      csrf: csrf
    }), document.querySelector("#content"));
  });
  document.querySelector("#csrfToken").value = csrf;
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
