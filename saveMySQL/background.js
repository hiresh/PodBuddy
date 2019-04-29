
var urlPrefix = "http://localhost:8080/podbuddy/"
chrome.contextMenus.create({
	title: "Add SQL to Repository fresh",
	contexts: ["selection"],
	onclick: saveQueryToServer
})
var userName = "";
var count = 0;

chrome.storage.local.get(['userName'], function (result) {
	if (result.userName && result.userName != '') {
		userName = result.userName;
	}
});

function saveQueryToServer(text) {
	

	// Prompt section - Get query name and description
	var queryName = ""
	var queryDescription = ""
	var firstRun = true
	var msg = ""
	var dialogPrompt = "Query Details "
	// Keep asking for query details till valid details are entered or user cancels
	while (queryName == "" || queryDescription == "") {
		if (!firstRun) {
			msg = "Enter both query name and description in format : Name | Description"
			dialogPrompt = ""
		}
		firstRun = false

		var queryDetails = prompt(dialogPrompt + msg, "Format: Query Name | Description")
		if (queryDetails != null) { // add this check to prevent error in case of cancel (operation on null)
			var separatorPosition = queryDetails.indexOf("|")
			queryName = queryDetails.substring(0, separatorPosition).trim()
			queryDescription = queryDetails.substring(separatorPosition + 1, queryDetails.length).trim()
		}
		else { // add this to prevent prompt in case of cancel
			queryName = null;
			queryDescription = null;
		}
	} // Prompt section ends
	
	//alert ("calling fn with "+queryName+"|"+queryDescription+"|"+text)
	chrome.storage.local.get(['userName'], function (result) {
		if (result.userName && result.userName != '') {
			userName = result.userName;
		}
		saveQueryViaContextMenu(queryName, queryDescription, text,userName);
	});
	
}

function saveQueryViaContextMenu(queryName, queryDescription, text,userName) {

	var query = {
		"queryText": text.selectionText,
		"queryName": queryName,
		"description": queryDescription,
		"author": userName,
		"lastUpdated": new Date()
	}

	var xhr = new XMLHttpRequest();
	xhr.open("POST", urlPrefix + "/query", true);
	xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			console.log("query added");
		}
		if (this.readyState == 4 && this.status == 500) {
			var errorResponse = JSON.parse(this.responseText)
			alert(errorResponse.message)
		}
	};
	xhr.send(JSON.stringify(query));
}

