//alert("hello!")

//content js loads on url hit

/*
*
*  verify if for all the pods the id for text area is 'text_area',
*	and use the same to populate current_schema query on page load instead of extension click
*
*/

debugger;
$(document).ready(function(){
$("#executeBtn").parent().parent().append("<td><button type='button' class='btn-warning' style='background:cyan' id='gpay_clearBtn'><b>Clear textarea</b></button></td>");

var clrBtn = $("#gpay_clearBtn");

clrBtn.on('click',function(){
	
	$("textarea").eq(0).val('');
});
	
	
})


 chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		 debugger;
		 var txtArea=$("textarea").eq(0);
		  //alert('in content script '+request.message);
		  if(request.message=="clickExecuteBtn"){
			debugger;
			$("#executeBtn").click();
		}
		 else if(request.message.startsWith("https://cloudem")){
			  
			  if(txtArea.val()==''){
				  txtArea.val("alter session set current_schema=FUSION;");
				  document.getElementById('selectOnlyMode').checked = false;
				document.getElementById('executeBtn').click();
			  }
		  }
        else if( request.message &&  !request.message.startsWith("https://cloudem") ) {
			//alert(request.message);
			if(txtArea.val()=="alter session set current_schema=FUSION;"){
				  txtArea.val(txtArea.val() + "\n\n");
			  }
         txtArea.val(txtArea.val()+"\n\n"+request.message);
             }
		
      }
    );