
var urlPrefix = "http://localhost:8080/podbuddy"
chrome.contextMenus.create ({
    title: "Add SQL to Repository",
    contexts: ["selection"],
    onclick: saveQueryToServer
})
var userName="";
var count=0;

chrome.storage.local.get(['userName'],function(result){
	if(result.userName && result.userName!=''){
		userName=result.userName;
	}
	
		
});

function saveQueryToServer(text) {
	chrome.storage.local.get(['userName'],function(result){
		if(result.userName && result.userName!=''){
			userName=result.userName;
		}
	});
	//TODO: set a counter in local storage and append it to QueryName everytime and then increase it
	chrome.storage.local.get(['contextMenuCounter'],function(result){
		if(result){
			count=result.contextMenuCounter;
			count++;
			chrome.storage.local.set({"contextMenuCounter":count},function(){
				saveQueryViaContextMenu(text);
			});
		}
	});
	
	
}

function saveQueryViaContextMenu(text){
	var query={
				queryText:text.selectionText,
				queryName:"Query "+count,
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

