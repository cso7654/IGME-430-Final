//Create a character
const handleCreate = (e) => {
    e.preventDefault();

    $("#errorMessage").animate({width:"hide"}, 350);

    if ($("#charName").val() == "" || $("#charClass").val() == "" || $("#charLevel").val() == ""){
        handleError("All fields are required!");
        return false;
    }

    sendAjax("POST", $("#charForm").attr("action"), $("#charForm").serialize(), function(){
        loadCharsFromServer($("#csrfToken").val());
    });

    return false;
};

//Search for a character
const handleSearch = (e) => {
	e.preventDefault();

    if ($("#searchName").val() == ""){
        handleError("Name required to search!");
        return false;
    }

    // sendAjax("POST", $("#searchForm").attr("action"), $("#searchForm").serialize(), function(){
	// 	loadCharsByNameFromServer($("#csrfToken").val(), $("#searchName").val());
    // });
	loadCharsByNameFromServer($("#csrfToken").val(), $("#searchName").val());


    return false;
}

//Clear search results
const clearSearch = (e) => {
	e.preventDefault();

	loadCharsFromServer($("#csrfToken").val());

	return false;
}

//Delete a character
const handleDelete = (e) => {
    e.preventDefault();
    const target = e.target;

    sendAjax("POST", $(target).attr("action"), $(target).serialize(), function(){
        loadCharsFromServer($("#csrfToken").val());
    });

    return false;
};

//The form for creating a character
const CharForm = (props) => {
    return(
        <form id="charForm" onSubmit={handleCreate} name="charForm" action="/user" method="POST" className="charForm">
            <label htmlFor="name">Name: </label>
            <input id="charName" name="name" type="text" placeholder="Character Name"></input>
            <label htmlFor="class">Class: </label>
            <input id="charClass" name="class" type="text" placeholder="Character Class"></input>
            <label htmlFor="level">Level: </label>
            <input id="charLevel" name="level" type="text" placeholder="Character Level"></input>
            <input id="csrfToken" type="hidden" name="_csrf" value={props.csrf}></input>
            <input className="makeCharSubmit" type="submit" value="Make Character"></input>
        </form>
    );
};

//Form for searching for a character
const CharSearch = (props) => {
	return(
		<div id="search">
			<form id="searchForm" onSubmit={handleSearch} name="searchForm" action="/findChars" method="POST" className="charForm">
				<label htmlFor="name">Name: </label>
				<input id="searchName" name="name" type="text" placeholder="Character Name"></input>
				<input type="hidden" name="_csrf" value={props.csrf}></input>
				<input className="findCharSubmit" type="submit" value="Find Character"></input>
			</form>
			<form id="searchClear" onSubmit={clearSearch}>
				<input type="submit" value="Clear Search"></input>
			</form>
		</div>
    );
}

//Display a user's characters in a list
const CharList = function(props){
    if (props.chars.length == 0){
        return(
            <div className="charList">
                <h3>No Characters</h3>
            </div>
        );
    }

    const nodes = props.chars.map(function(char) {
        return (
            <div key={char._id} className="char">
                {/* <img src="/assets/img/domoface.jpeg" alt="char icon" className="charIcon"></img> */}
                <h3 className="charName"> Name: {char.name} </h3>
                <h3 className="charClass"> Class: {char.class} </h3>
                <h3 className="charLevel"> Level: {char.level} </h3>
                <form action="/delete" onSubmit={handleDelete} method="POST">
                    <input type="hidden" name="id" value={char._id}></input>
                    <input type="hidden" name="_csrf" value={props.csrf}></input>
                    <input type="submit" value="Delete Character" className="deleteButton"></input>
                </form>
            </div>
        );
    });

    return(
        <div className="charList">
			<h2>Your Characters</h2>
            {nodes}
        </div>
    );
};

//Load all of a user's characters from the server
const loadCharsFromServer = (csrf) => {
    sendAjax("GET", "/getChars", null, (data) => {
        ReactDOM.render(
            <CharList chars={data.chars} csrf={csrf}></CharList>,
            document.querySelector("#characters")
        );
    });
}
//Search for chars from the server by name
const loadCharsByNameFromServer = (csrf, name) => {
	// document.querySelector
    sendAjax("POST", "/findChars", {name: name, _csrf: csrf}, (data) => {
        ReactDOM.render(
            <CharList chars={data.chars} csrf={csrf}></CharList>,
            document.querySelector("#characters")
        );
    });
}

//Setup the page
const setup = (csrf) => {
    ReactDOM.render(
        <CharForm csrf={csrf}></CharForm>,
        document.querySelector("#makeChar")
    );
    ReactDOM.render(
        <CharSearch csrf={csrf}></CharSearch>,
        document.querySelector("#searchChar")
    );
    loadCharsFromServer(csrf);
}

//Generate a CSRF token
const getToken = () => {
    sendAjax("GET", "/getToken", null, (result) => {
        setup(result.csrfToken);
    });
}

$(document).ready(function(){getToken();});