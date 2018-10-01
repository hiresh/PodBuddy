
var urlPrefix = "http://localhost:8080/podbuddy"
chrome.contextMenus.create ({
    title: "Add SQL to Repository",
    contexts: ["selection"],
    onclick: saveQueryToServer
})
var userName="";

chrome.storage.local.get(['userName'],function(result){
	if(result.userName && result.userName!=''){
		userName=result.userName;
	}
	
		
});

function saveQueryToServer(text) {
	var query={
				queryText:text.selectionText,
				queryName:"Query",
				description:"added from contextMenu",
				author:userName,
				lastUpdated:new Date()
			  }
	var xhr = new XMLHttpRequest();
	xhr.open("POST",urlPrefix+"/query",true);
	xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
				 //alert(this.responseText);
				 console.log("query added");
				 
					
		}
	};
		
	xhr.send(JSON.stringify(query));
}

