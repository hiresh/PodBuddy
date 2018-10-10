var username = ""
chrome.storage.local.get(['userName'], function (result) {
	if (result.userName && result.userName != '') {
		username = result.userName
	}
})

var root = null;
var outerList = null;
var innerList = null;
var urlPrefix = "http://localhost:8080/podbuddy"
var userQueries = ""
$(document).ready(function () {
	root = document.getElementById("root");
	outerList = document.createElement("div");
	innerList = document.createElement("div");
	searchInput = document.createElement("input")
});

function copyOnClick(queryId) {
	// document.getElementById(queryId).select();
	var temp = document.createElement("input")
	document.body.appendChild(temp)
	temp.setAttribute("value", document.getElementById(queryId).value)
	temp.select()
	document.execCommand('copy');
	document.body.removeChild(temp)
}

function deleteOnClick(userName, queryId) {
	var xhr = new XMLHttpRequest()
	xhr.open("DELETE", urlPrefix + "/user/" + userName + "/query/" + document.getElementById(queryId).value)
	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			location.reload()
		}
	}
	xhr.send(null)
}


function displayRegisterForm() {

	$("#regForm").show();

	//bind event
	$('#userNameButton').on('click', function () {
		debugger;
		var userId = $('#userName').val();
		//call api to add the user
		var xhr = new XMLHttpRequest();
		xhr.open("POST", urlPrefix + "/user", true);
		xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
		var userData = {
			"registeredName": userId,
			"lastRequest": null

		}
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				//alert(this.responseText);
				if (this.responseText && this.responseText != 'false') {
					chrome.storage.local.set({ "userName": userId }, function () {
						displayUserQueries(userId);
					});

				}
				else {
					$("#regError").html("<h3> User name already exists</h3>");
				}
			}
		};
		xhr.send(JSON.stringify(userData));

		//store the userName if uniqueID

	});


}
function displayUserQueries(userNameForQ) {
	$("#regForm").hide();

	// add search text input to root.
	searchInput.setAttribute("id", "querySearch")
	searchInput.setAttribute("type", "text")
	searchInput.setAttribute("placeholder", "Search for query name, text or description")
	root.appendChild(searchInput)
	

			var xhr = new XMLHttpRequest();
			xhr.open("GET", urlPrefix + "/userQueries/"+userNameForQ+"/")
			xhr.addEventListener("load", function (e) {
				if(xhr.responseText){
				userQueries = JSON.parse(xhr.responseText)
				}
				
				if(userQueries){
					chrome.storage.local.set({ "userQueriesData": userQueries }, function () {});
					paintUserQueries(userQueries);
				}
				else{
					//set userqueries from the local storage and modularize the painting
					chrome.storage.local.get(['userQueriesData'],function(result){
						if(result.userQueriesData){
							paintUserQueries(result.userQueriesData);
						}
					});
				}
			});
			xhr.addEventListener("error",function(error){
				if(this.status==0){
					chrome.storage.local.get(['userQueriesData'],function(result){
						if(result.userQueriesData){
							paintUserQueries(result.userQueriesData);
						}
					});
				}
			});
			xhr.send();
		
	
	root.appendChild(outerList);
	//iterating outerList here and adding a listener seems naive, need to find out a way that binds listener
	//in paintUserQueries function (adding inline script is not allowed)
}

function sendMsgToPasteQuery(qText){
	chrome.runtime.sendMessage({qTextKey:qText},function(){});
}

function paintUserQueries(userQueries){
	var counter = 0
	
	userQueries.forEach(userQuery => {
				// get user
				if (userQuery && userQuery.user && userQuery.user.registeredName) {
					var user = userQuery.user.registeredName
					outerList.innerHTML += "<div class='user'>" + user + "</div>"
					// get queries

					var queryString = ""
					userQuery.queries.forEach(query => {
						queryString += ""
							+ "<div class='titleArea'><div class='title'><span class='caret-link' >&#x2b9c;</span>" + query.queryName + "</div>"
							+ "<div class='buttonArea'>"
							+ (username == user ? "<div class='deleteButton' id='delete_" + counter + "'>&times;</div>" : "")
							+ "<button class='copyButton btn-small' id='button_" + counter + "'>copy</button></div></div>"
							+ "<div class='subtitle'>" + query.description + "</div>"
							+ "<input type='hidden' class='qText' id='query_" + counter + "' value='" + query.queryText + "' />"
							+ "<input type='hidden' id='queryName_" + counter + "' value='" + query.queryName + "' />"
						counter++
					})

					outerList.innerHTML += queryString + "<br/>"
					var buttons = document.querySelectorAll("button")
					buttons.forEach(button => {
						button.addEventListener("click", function () {
							copyOnClick(this.id.replace("button", "query"))
						})
					})

					var delButtons = document.querySelectorAll(".deleteButton")
					delButtons.forEach(delButton => {
						delButton.addEventListener("click", function () {
							deleteOnClick(username, this.id.replace("delete", "queryName"))
						})
					})
					
					//get all the spans with caret class and bind a listner
					
					/*$(".caret-link").each(function(){
						$(this).on('click',function(){
							
							sendMsgToPasteQuery($(this).parent().parent().next().next().val());
							
						});
						
					});
					*/
					
				}
			});
}
//if the storage has the key call displayUserQueries or let him register himself/herself
chrome.storage.local.get(['userName'], function (result) {


	console.log("result is " + result.userName);
	if (result.userName && result.userName != '') {
		$("#regForm").hide();
		displayUserQueries(result.userName);
	}
	else {

		displayRegisterForm();
	}

});
