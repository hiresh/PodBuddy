// var urlPrefix = "http://localhost:8080/podbuddy"
 var urlPrefix = "http://slc12fzm.us.oracle.com:8080/podbuddy/"
chrome.contextMenus.create({
	title: "Add SQL to Repository fresh",
	contexts: ["selection"],
	onclick: saveQueryToServer
})
var userName = "";
var count = 0;

chrome.commands.onCommand.addListener(function(command) {

	
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		//debugger;
    var activeTab = tabs[0];
	
    chrome.tabs.sendMessage(activeTab.id, {"message": "clickExecuteBtn" });
	});
	
	
	
});

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
		if(queryName!=null && queryDescription!=null)
			saveQueryViaContextMenu(queryName, queryDescription, text,userName);
	});
	
}

//convert this in jquery ajax call and handle errors
function saveQueryViaContextMenu(queryName, queryDescription, text,userName) {
debugger;
	var query = {
		"queryText": text.selectionText.replace(/"/g, "'"),
		"queryName": queryName,
		"description": queryDescription,
		"author": userName,
		"lastUpdated": new Date()
	}

	var xhr = new XMLHttpRequest();
	xhr.open("POST", urlPrefix + "/query", true);
	xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
	xhr.onreadystatechange = function () {
		//debugger;
		//console.log('bg js');
		if (this.readyState == 4 && this.status == 200) {
			console.log("query added");
			
			notifObject={
							type:'basic',
							iconUrl:'dbicon.png',
							title:'Query saved',
							message:queryName+' published'
						}
			//chrome.notifications.clear(id, function ncb(){})
			sendDesktopNotif(queryName+''+Math.random(),notifObject,function(id){})
		}
		else if (this.readyState == 4 ) {
			
			var errorResponse =null;
			if(this.responseText)
			errorResponse= JSON.parse(this.responseText)
			//alert(errorResponse.message)
			console.log('entered errored state');
			errObject={
					type:'basic',
							iconUrl:'errorIcon.png',
							title:'Unable to save Query',
							message:'Please check if you are connected to VPN'
			}
			sendDesktopNotif(queryName+''+Math.random(),errObject,function(id){});
		}
	};
	xhr.send(JSON.stringify(query));
}

function sendDesktopNotif(notifName,notifObject,notifCallBack){
	/*
	*
	*{
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Don\'t forget!',
        message: 'You have  things to do. Wake up, dude!'
	 }
	* callback has notifId as argument
	*
	*
	*/
	console.log('sending notif');
	chrome.notifications.create(notifName, notifObject, notifCallBack);
	

}