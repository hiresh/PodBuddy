//alert("hello!")

//content js loads on url hit

/*
*
*  verify if for all the pods the id for text area is 'text_area',
 and use the same to populate current_schema query on page load instead of extension click
*
*/

debugger;


 chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		 debugger;
		 var txtArea=$("textarea").eq(0);
		  //alert('in content script '+request.message);
		  if(request.message.startsWith("https://cloudem")){
			  
			  if(txtArea.val()==''){
				  txtArea.val("alter session set current_schema=FUSION;");
				  document.getElementById('selectOnlyMode').checked = false;
				document.getElementById('executeBtn').click();
			  }
		  }
        else if( request.message &&  !request.message.startsWith("https://cloudem")) {
			//alert(request.message);
			if(txtArea.val()=="alter session set current_schema=FUSION;"){
				  txtArea.val(txtArea.val() + "\n\n");
			  }
         txtArea.val(txtArea.val()+"\n\n"+request.message);
             }
      }
    );