//Create a character
const handleCreate = (e) => {
    e.preventDefault();

	let stats = getStats();

	let data = {name: $("#charName").val(),
				level: $("#charLevel").val(),
				class: $("#charClass").val(),
				system: $("#charSystem").val(),
				stats: JSON.stringify(stats),
				_csrf: $("#csrfToken").val()};

    sendAjax("POST", $("#charForm").attr("action"), data, function(){
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

	loadCharsByNameFromServer($("#csrfToken").val(), $("#searchName").val());

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

//Used for going into the maker screen (separated because it looks better)
const goToMaker = (e) => {
	ReactDOM.render(
        <MakeChar csrf={document.querySelector("#csrfToken").value}></MakeChar>,
        document.querySelector("#content")
    );
}

//Change user's password
const handleChangePassword = (e) => {
	e.preventDefault();

	const target = e.target;

    sendAjax("POST", $(target).attr("action"), $(target).serialize(), function(){
        loadCharsFromServer($("#csrfToken").val());
    });

    return false;
}

//Make the stats section into a JSON object
const getStats = () => {
	return {str: $("#charStr").val(),
			dex: $("#charDex").val(),
			con: $("#charCon").val(),
			int: $("#charInt").val(),
			wis: $("#charWis").val(),
			cha: $("#charCha").val()};
}

//View a specific character
const viewChar = (e) => {
	e.preventDefault();
	const target = e.target;

	const params = $(target).serializeArray();

	sendAjax("POST", "/getChar", {id: params[0].value, _csrf: params[1].value}, (data) => {
        ReactDOM.render(
            <CharView char={data.char} csrf={params[1].value}></CharView>,
            document.querySelector("#content")
        );
    });

	return false;
}

//Go to the character list
const toCharList = (e) => {
	e.preventDefault();

	loadCharsFromServer($("#csrfToken").val());

	return false;
}

const handleSelectChange = (e) => {
	this.setState({value: e.target.value});
}

//The form for creating a character
const MakeChar = (props) => {
	return(
		<section>
			<form id="charForm" onSubmit={handleCreate} name="charForm" action="/user" method="POST" className="charForm">
				<label htmlFor="name">Name: </label>
				<input id="charName" name="name" type="text" placeholder="Character Name"></input>
				<label htmlFor="class">Class: </label>
				<input id="charClass" name="class" type="text" placeholder="Character Class"></input>
				<label htmlFor="level">Level: </label>
				<input id="charLevel" name="level" type="text" placeholder="Character Level"></input>

				<label htmlFor="system">Game System: </label>
				<select id="charSystem" name="system" onChange={handleSelectChange} defaultValue="5e">
					<option value="5e">D&D 5th Edition (incomplete)</option>
				</select>

				<h3>Stats:</h3>

				<label htmlFor="strength">Strength:</label>
				<input id="charStr" name="strength" type="number" defaultValue="0"></input>
				<label htmlFor="dexterity">Dexterity:</label>
				<input id="charDex" name="dexterity" type="number" defaultValue="0"></input>
				<label htmlFor="constitution">Constitution:</label>
				<input id="charCon" name="constitution" type="number" defaultValue="0"></input>
				<label htmlFor="intelligence">Intelligence:</label>
				<input id="charInt" name="intelligence" type="number" defaultValue="0"></input>
				<label htmlFor="wisdom">Wisdom:</label>
				<input id="charWis" name="wisdom" type="number" defaultValue="0"></input>
				<label htmlFor="charisma">Charisma:</label>
				<input id="charCha" name="charisma" type="number" defaultValue="0"></input>

				<input type="hidden" name="_csrf" value={props.csrf}></input>
				<input className="makeCharSubmit" type="submit" value="Make Character"></input>
			</form>
			<div>
				<button id="cancelCreate" onClick={toCharList}>Cancel</button>
			</div>
		</section>
	);
}

//Display a user's characters in a list. Also includes search and button to go to maker
const CharList = function(props){
    if (props.chars.length == 0){
        return(
            <div className="charList">
							<div id="search">
				<form id="searchForm" onSubmit={handleSearch} name="searchForm" action="/findChars" method="POST" className="charForm">
					<label htmlFor="name">Name: </label>
					<input id="searchName" name="name" type="text" placeholder="Character Name"></input>
					<input type="hidden" name="_csrf" value={props.csrf}></input>
					<input className="findCharSubmit" type="submit" value="Find Character"></input>
				</form>
				<form id="searchClear" onSubmit={toCharList}>
					<input type="hidden" name="_csrf" value={props.csrf}></input>
					<input type="submit" value="Clear Search"></input>
				</form>
			</div>
                <h3>No Characters</h3>
				<button onClick={goToMaker}>Make New Character</button>
            </div>
        );
    }

    const nodes = props.chars.map(function(char) {
        return (
			<div key={char._id} className="char">
				<h3 className="charName"> Name: {char.name} </h3>
				<h3 className="charClass"> Class: {char.class} </h3>
				<h3 className="charLevel"> Level: {char.level} </h3>
				<h3 className="charLevel"> System: {char.system} </h3>
				<form action="/getChar" onSubmit={viewChar} method="POST">
					<input type="hidden" name="id" value={char._id}></input>
					<input type="hidden" name="_csrf" value={props.csrf}></input>
					<input type="submit" value="View Character" className="deleteButton"></input>
				</form>
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
			<div id="search">
				<form id="searchForm" onSubmit={handleSearch} name="searchForm" action="/findChars" method="POST" className="charForm">
					<label htmlFor="name">Name: </label>
					<input id="searchName" name="name" type="text" placeholder="Character Name"></input>
					<input type="hidden" name="_csrf" value={props.csrf}></input>
					<input className="findCharSubmit" type="submit" value="Find Character"></input>
				</form>
				<form id="searchClear" onSubmit={toCharList}>
					<input type="hidden" name="_csrf" value={props.csrf}></input>
					<input type="submit" value="Clear Search"></input>
				</form>
			</div>
			<h2>Your Characters</h2>

			<button onClick={goToMaker}>Make New Character</button>

            {nodes}
        </div>
    );
};

//Get a view of a specific character
const CharView = function(props) {
	const char = props.char;
	let stats = JSON.parse(char.stats);
	return(
		<section id="charView">
			<h3 className="charName"> Name: {char.name} </h3>
			<h3 className="charClass"> Class: {char.class} </h3>
			<h3 className="charLevel"> Level: {char.level} </h3>
			<h3 className="charLevel"> System: {char.system} </h3>
			<h3>Stats:</h3>
			<ul>
				<li>Strength: {stats.str}</li>
				<li>Dexterity: {stats.dex}</li>
				<li>Constitution: {stats.con}</li>
				<li>Intelligence: {stats.int}</li>
				<li>Wisdom: {stats.wis}</li>
				<li>Charisma: {stats.cha}</li>
			</ul>
			{/* <h4 className="charStr">Strength: {char.stats.str}</h4> */}
			<form action="/delete" onSubmit={handleDelete} method="POST">
				<input type="hidden" name="id" value={char._id}></input>
				<input type="hidden" name="_csrf" value={props.csrf}></input>
				<input type="submit" value="Delete Character" className="deleteButton"></input>
			</form>
			<button onClick={toCharList}>Back</button>
		</section>
	);
}

const AccountManagement = function(props){
	return (
		<section>
			<h3>Change Password:</h3>
			<form id="passChangeForm" name="passChangeForm"  onSubmit={handleChangePassword} action="/changePass" method="POST">
				<label htmlFor="newPass">New Password:</label>
				<input type="password" id="newPass" name="newPass"></input>
				<label htmlFor="confirmNewPass">Confirm Password:</label>
				<input type="password" id="confirmNewPass" name="confirmNewPass"></input>
				<input type="hidden" name="_csrf" value={props.csrf}></input>
				<input type="submit" value="Change Password"></input>
			</form>
			<button onClick={toCharList}>Back</button>
		</section>
	);
}

//Load all of a user's characters from the server
const loadCharsFromServer = (csrf) => {
    sendAjax("GET", "/getChars", null, (data) => {
        ReactDOM.render(
            <CharList chars={data.chars} csrf={csrf}></CharList>,
            document.querySelector("#content")
        );
    });
}
//Search for chars from the server by name
const loadCharsByNameFromServer = (csrf, name) => {
	// document.querySelector
    sendAjax("POST", "/findChars", {name: name, _csrf: csrf}, (data) => {
        ReactDOM.render(
            <CharList chars={data.chars} csrf={csrf}></CharList>,
            document.querySelector("#content")
        );
    });
}
//Get a specific char from the server by their ID
const getCharFromServer = (csrf, id) => {
	// document.querySelector
    sendAjax("POST", "/getChar", {id: id, _csrf: csrf}, (data) => {
        ReactDOM.render(
            <CharView char={data.char} csrf={csrf}></CharView>,
            document.querySelector("#content")
        );
    });
}

//Setup the page
const setup = (csrf) => {
	document.querySelector("#accountLink").addEventListener("click", function(e) {
		ReactDOM.render(
            <AccountManagement csrf={csrf}></AccountManagement>,
            document.querySelector("#content")
        );
	});

	document.querySelector("#csrfToken").value = csrf;
    loadCharsFromServer(csrf);
}

//Generate a CSRF token
const getToken = () => {
    sendAjax("GET", "/getToken", null, (result) => {
        setup(result.csrfToken);
    });
}

$(document).ready(function(){getToken();});