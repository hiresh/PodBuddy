
var urlPrefix = "http://localhost:8080/podbuddy"
chrome.contextMenus.create({
	title: "Add SQL to Repository",
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
	chrome.storage.local.get(['userName'], function (result) {
		if (result.userName && result.userName != '') {
			userName = result.userName;
		}
	});

	// Prompt section - Get query name and description
	var queryName = ""
	var queryDescription = ""
	var firstRun = true
	// Keep asking for query details till valid details are entered or user cancels
	while (queryName == "" || queryDescription == "") {
		var msg = ""
		if (!firstRun) {
			msg = "Enter both query name and description in format : Name | Description"
		}
		firstRun = false

		var dialogPrompt = "Query Details "
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

	saveQueryViaContextMenu(queryName, queryDescription, text);
	//TODO: set a counter in local storage and append it to QueryName everytime and then increase it
	// chrome.storage.local.get(['contextMenuCounter'], function (result) {
	// 	if (result) {
	// 		count = result.contextMenuCounter;
	// 		count++;
	// 		chrome.storage.local.set({ "contextMenuCounter": count }, function () {
	// 			saveQueryViaContextMenu(text);
	// 		});
	// 	}
	// });
}

function saveQueryViaContextMenu(queryName, queryDescription, text) {
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
			//alert(this.responseText);
			console.log("query added");
		}
	};

	xhr.send(JSON.stringify(query));
}

