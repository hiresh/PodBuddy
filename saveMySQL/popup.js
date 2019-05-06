var username = ""
chrome.storage.local.get(['userName'], function (result) {
	if (result.userName && result.userName != '') {
		username = result.userName
	}
})

var root = null;
var outerList = null;
var innerList = null;

var urlPrefix = "http://192.168.43.114:8080/podbuddy"
 // var urlPrefix = "http://slc12fzm.us.oracle.com:8080/podbuddy/"
var userQueries = ""
$(document).ready(function () {
	root = document.getElementById("root");
	outerList = document.createElement("div");
	innerList = document.createElement("div");
	searchInput = document.createElement("input");
	offlineMarkerDiv= document.createElement("div");
	sendURLMessage();
});

function sendURLMessage(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		//debugger;
    var activeTab = tabs[0];
	
    chrome.tabs.sendMessage(activeTab.id, {"message": activeTab.url });
	});
}

function copyOnClick(queryId) {
	// document.getElementById(queryId).select();
	var temp = document.createElement("input")
	document.body.appendChild(temp)
	temp.setAttribute("value", document.getElementById(queryId).value)
	temp.select()
	document.execCommand('copy');
	document.body.removeChild(temp)
}

function deleteOnClick(userName, queryId,jqDeleteBtn) {
	
	debugger;
	jqDeleteBtn.parent().parent().parent().hide();
	
	var xhr = new XMLHttpRequest();
	xhr.open("DELETE", urlPrefix + "/user/" + userName + "/query/" + document.getElementById(queryId).value)
	xhr.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			//location.reload()
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
	searchInput.setAttribute("class","form-control form-control mb-2 mu-2");
	searchInput.setAttribute("placeholder", "Search for Query Name")
	searchInput.addEventListener('keyup', function() { searchFunction(); });
	offlineMarkerDiv.setAttribute("id","offlineMarker");
	offlineMarkerDiv.setAttribute("class","alert alert-danger small mb-2 p-0");
	
	// root.appendChild(searchInput)
	chrome.storage.local.get(['userQueriesData'],function(result){
						if(result.userQueriesData){
							paintUserQueries(result.userQueriesData);
						}
					});
			debugger;
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
					console.log("error");
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
	//alert(qText);
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		//debugger;
    var activeTab = tabs[0];
	
    chrome.tabs.sendMessage(activeTab.id, {"message": qText });
	});
}

function ifNotConnectedHideDeleteIcon(hideDelIcons,showDelIcons){
	
	//using callbacks so that we dont need the async feature which kills perf
	$.ajax({url: urlPrefix, success: function(result){
		if(result){
			showDelIcons();
		}
		else{
			hideDelIcons();
		}
		
  },error:function(error){
	  console.log("error in ifNotConnectedHideDeleteIcon");
	  hideDelIcons();
	  
  } 	});
	
	
}

function paintUserQueries(userQueries){
	var counter = 0;
	var userCounter = 0;
	outerList.innerHTML="";
	outerList.appendChild(searchInput);
	outerList.appendChild(offlineMarkerDiv);
	outerList.setAttribute("id","accordion");
	outerList.setAttribute("class","accordion md-accordion accordion-5 col-sm-12 col-md-12");
	$(offlineMarkerDiv).hide();
	// $(offlineMarkerDiv).html("<div style='background: antiquewhite;'><img alt='offline' src='offline.png' style=' width: 25px;padding-left: 4px;padding-bottom: 4px;'/><b><h8 style='font-size:smaller;'>offline, add/delete features not supported</h8><b></div>");
	$(offlineMarkerDiv).html("<img alt='offline' src='offline.png' style=' width: 25px;padding-left: 4px;padding-bottom: 4px;'/> <strong> Offline! </strong> add/delete features not supported");
	
	

	userQueries.sort(function(a,b){
			var x = a.user.registeredName.toLowerCase();
			var y = b.user.registeredName.toLowerCase();			
			
			return x < y ? -1 : x > y ? 1 : 0;			

	});

	userQueries.sort(function(a,b){
			if(a.user.registeredName.toLowerCase() == username.toLowerCase() ) {return -1;}
			return 0;
	});

	userQueries.forEach(userQuery => {
				userCounter++;
				// get user
				if (userQuery && userQuery.user && userQuery.user.registeredName) {

					var divCard = null;
					var divCardHeader = null;
					var divCardInner = null;
					var divCardBody = null;

					divCard = document.createElement("div");
					divCardHeader = document.createElement("div");
					divCardInner = document.createElement("div");
					divCardBody = document.createElement("div");


					divCard.innerHTML="";
					divCard.setAttribute("class","card mb-2");

					divCardHeader.innerHTML="";
					divCardHeader.setAttribute("class","card-header z-depth-1 text-uppercase");

					var user = userQuery.user.registeredName					
					divCardHeader.innerHTML += "<i class=\"fa fa-user fa-fw \" aria-hidden=\"true\"></i>&nbsp; <a data-toggle=\"collapse\" class=\"text-dark\" href=\"#collapse"+userCounter+"\">" + user + "</a> <span class=\"badge badge-pill badge-dark\">"+userQuery.queries.length+"</span>"
					divCard.appendChild(divCardHeader);
					// get queries
					
					debugger;

					divCardInner.innerHTML = "";
					divCardInner.setAttribute("id","collapse"+userCounter);
					divCardInner.setAttribute("class","collapse"+ ((userCounter==1)?" show":""));
					divCardInner.setAttribute("data-parent","#accordion");
					var queryString = "";
					userQuery.queries.forEach(query => {
						console.log(query);
						queryString += ""
							+ "<div class=\"queryInfo\"><div class=\"titleArea\"><div class=\"title\"><i class=\"caret-link fa fa-arrow-circle-left\" >&nbsp</i>" + query.queryName + "</div>"
							+ "<div class=\"buttonArea\">"
							+ (username == user ? "<div class=\"deleteButton\" id=\"delete_" + counter + "\"><i class=\"fa fa-trash\"></i></div>" : "")
							+ "<button class=\"copyButton btn btn-outline-dark btn-sm\" id=\"button_" + counter + "\"><i class=\"fa fa-copy\"></i></button></div></div>"
							+ "<div class=\"blockquote-footer\">" + query.description + "</div>"
							+ "<input type=\"hidden\" class=\"qText\" id=\"query_" + counter + "\" value=\"" + query.queryText + "\"/>"
							+ "<input type=\"hidden\" id=\"queryName_" + counter + "\" value=\"" + query._id + "\" /></div>"
							
						counter++;
						// console.log(queryString);
					})

					divCardBody.innerHTML="";
					divCardBody.setAttribute("class","card-body");

					divCardBody.innerHTML += queryString;

					divCardInner.appendChild(divCardBody);
					divCard.appendChild(divCardInner);
					outerList.appendChild(divCard);
					
					var hideDelete=function(){
						
						//show offlineMarkerDiv
						$(offlineMarkerDiv).show();
						//disable delete icons
						$(".deleteButton").hide();
					}
					var showDelete=function(){
						$(offlineMarkerDiv).hide();
						$(".deleteButton").show();
					}
					ifNotConnectedHideDeleteIcon(hideDelete,showDelete);
					
					
					
					var buttons = document.querySelectorAll("button")
					buttons.forEach(button => {
						button.addEventListener("click", function () {
							copyOnClick(this.id.replace("button", "query"))
						})
					})

					var delButtons = document.querySelectorAll(".deleteButton")
					delButtons.forEach(delButton => {
						$(delButton).off('click').on("click", function () {
							deleteOnClick(username, this.id.replace("delete", "queryName"),$(this));
							
						})
					})
					
					//get all the spans with caret class and bind a listner
					var caretObjects =$(".caret-link");
					debugger;
					$(".caret-link").each(function(){
						debugger;
						console.log("called binder");
						$(this).off('click').on('click',function(){
							console.log("clicked caret");
							sendMsgToPasteQuery($(this).parent().parent().next().next().val());
							
						});
						
					});
					
					
					
				}
			});
}


function searchFunction() {
    var input, filter,a, i,j, txtValue,varTitle,varCardInfo;
    input = document.getElementById("querySearch");
    filter = input.value.toUpperCase();

	varCardInfo = document.getElementsByClassName("card");

	for (i = 0; i < varCardInfo.length; i++) {
		var varQueryInfo;		
		var intQueryCount = 0;
		varQueryInfo = varCardInfo[i].getElementsByClassName("queryInfo");

		for (j = 0; j < varQueryInfo.length; j++) {
			varTitle = varQueryInfo[j].getElementsByClassName("title");
			txtValue = varTitle[0].textContent || varTitle[0].innerText;
			if (txtValue.toUpperCase().indexOf(filter) > -1) {
	            varQueryInfo[j].style.display = "";
	            intQueryCount++;
			} else {
	            varQueryInfo[j].style.display = "none";
			}
		}

		if(intQueryCount==0){
			varCardInfo[i].style.display = "none";
		}
		if (intQueryCount > 0 || filter==="" || filter === null) {
			varCardInfo[i].style.display = "";
			varCardInfo[i].getElementsByClassName("badge")[0].innerHTML = intQueryCount;
		}
	}
}


//if the storage has the key call displayUserQueries or let him register himself/herself
chrome.storage.local.get(['userName'], function (result) {


	// console.log("result is " + result.userName);
	if (result.userName && result.userName != '') {
		$("#regForm").hide();
		displayUserQueries(result.userName);
	}
	else {

		displayRegisterForm();
	}

});
