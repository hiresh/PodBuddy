var root = document.getElementById("root")
var outerList = document.createElement("div")
var innerList = document.createElement("div")
var urlPrefix = "http://localhost:8080/podbuddy"
var userQueries = ""

function copyOnClick(queryId) {
    // document.getElementById(queryId).select();
    var temp = document.createElement("input")
    document.body.appendChild(temp)
    temp.setAttribute("value", document.getElementById(queryId).value)
    temp.select()
    document.execCommand('copy');
    document.body.removeChild(temp)
}


function displayRegisterForm(){
	
	$("#regForm").show();
	
	//bind event
	$('#userNameButton').on('click',function(){
	debugger;
	var userId=$('#userName').val();
	//call api to add the user
	var xhr = new XMLHttpRequest();
	xhr.open("POST",urlPrefix+"/user",true);
	xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
	var userData={
					"registeredName":userId,
					"lastRequest":null 	
		
				 }
	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
				 alert(this.responseText);
				 if(this.responseText && this.responseText!=''){
					chrome.storage.local.set({"userName":userId},function(){
								displayUserQueries();
							});
					 
					}
					else{
						$("#regError").html("<h3> User name already exists</h3>");
					}
		}
	};			 
	xhr.send(JSON.stringify(userData));
	
	//store the userName if uniqueID
	
});
	
}

function displayUserQueries(){
	$("#regForm").hide();
var xhr = new XMLHttpRequest();
xhr.open("GET", urlPrefix + "/userQueries")
xhr.addEventListener("load", function (e) {
    userQueries = JSON.parse(xhr.responseText)
    var counter = 0
    userQueries.forEach(userQuery => {
        // get user
        var user = userQuery.user.registeredName
        outerList.innerHTML += "<div class='user'>" + user + "</div>"
        // get queries

        var queryString = ""
        userQuery.queries.forEach(query => {
            queryString += ""
                + "<div class='titleArea'><div class='title'><span class='caret-link'>&#x2b9c;</span>" + query.queryName + "</div>"
                + "<div class='buttonArea'><button class='copyButton' id='button_" + counter
                + "'>copy</button></div></div>"
                + "<div class='subtitle'>" + query.description + "</div>"
                + "<input type='hidden' id='query_" + counter + "' value='" + query.queryText + "' />"
            counter++
        })

        outerList.innerHTML += queryString + "<br/>"
        var buttons = document.querySelectorAll("button")
        buttons.forEach(button => {
            button.addEventListener("click", function() {
                copyOnClick(this.id.replace("button", "query"))
            })
        })
        
    });
})
xhr.send()
root.appendChild(outerList)
}


//if the storage has the key call displayUserQueries or let him register himself/herself
chrome.storage.local.get(['userName'],function(result){
	debugger;
	
	console.log("result is "+result.userName);
	if(result.userName && result.userName!=''){
		$("#regForm").hide();
		displayUserQueries();
	}
	else{
		
		displayRegisterForm();
	}
		
});
