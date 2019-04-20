//alert("hello!")

//content js loads on url hit

/*
*
*  verify if for all the pods the id for text area is 'text_area',
 and use the same to populate current_schema query on page load instead of extension click
*
*/

debugger;

var alterQueryPasted=false;
 chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		 debugger;
 
		  //alert('in content script '+request.message);
		  if(!alterQueryPasted&&request.message.startsWith("https://cloudem")){
			  var txtArea=$("textarea");
			  if(txtArea.html()=='')
			txtArea.html("alter session set current_schema=FUSION;\n\n");
			
			alterQueryPasted=true;
		  }
        else if( request.message &&  !request.message.startsWith("https://cloudem")) {
			//alert(request.message);
         $("textarea").html($("textarea").html()+"\n\n"+request.message);
             }
      }
    );