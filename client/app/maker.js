const handleDomo = (e) => {
	e.preventDefault();

	$("#domoMessage").animate({width:"hide"}, 350);

	if ($("#domoName").val() == "" || $("#domoAge").val() == ""){
		handleError("RAWR! All fields are required!");
		return false;
	}

	sendAjax("POST", $("#domoForm").attr("action"), $("#domoForm").serialize(), function(){
		loadDomosFromServer();
	});

	return false;
};

const DomoForm = (props) => {
	return(
		<form id="domoForm" onSubmit={handleDomo} name="domoForm" action="/maker" method="POST" className="domoForm">
			<label htmlFor="name">Name: </label>
			<input id="domoName" name="name" type="text" placeholder="Domo Name"></input>
			<label htmlFor="age">Age: </label>
			<input id="domoAge" name="age" type="text" placeholder="Domo Age"></input>
			<input type="hidden" name="_csrf" value={props.csrf}></input>
			<input className="makeDomoSubmit" type="submit" value="Make Domo"></input>
		</form>
	);
};

const DomoList = function(props){
	if (props.domos.length == 0){
		return(
			<div className="domoList">
				<h3 className="emptyDomo">No Domos Yet</h3>
			</div>
		);
	}

	const domoNodes = props.domos.map(function(domo) {
		return (
			<div key={domo._id} className="domo">
				<img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"></img>
				<h3 className="domoName"> Name: {domo.name} </h3>
				<h3 className="domoAge"> Age: {domo.age} </h3>
			</div>
		);
	});

	return(
		<div className="domoList">
			{domoNodes}
		</div>
	);
};

const loadDomosFromServer = () => {
	sendAjax("GET", "/getDomos", null, (data) => {
		ReactDOM.render(
			<DomoList domos={data.domos}></DomoList>,
			document.querySelector("#domos")
		);
	});
}

const setup = (csrf) => {
	ReactDOM.render(
		<DomoForm csrf={csrf}></DomoForm>,
		document.querySelector("#makeDomo")
	);

	ReactDOM.render(
		<DomoList domos={[]}></DomoList>,
		document.querySelector("#domos")
	)

	loadDomosFromServer();
}

const getToken = () => {
	sendAjax("GET", "/getToken", null, (result) => {
		setup(result.csrfToken);
	});
}

$(document).ready(function(){getToken();});