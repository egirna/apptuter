
function ready(){

	//if there's pagename so redirect to the app directly
	 if(localStorage.getItem('pageid')!=null)
		 window.open('../index.html','_self');
	 
	 document.addEventListener('backbutton',function(e){
			navigator.app.exitApp();
		});
        		//Setting Save button action
        		$("#saveSettings").click(function(evt)
        		        {
        					
        					if(checkConnection()){
        						$.mobile.loading( 'show');
        		              //Theme Change radio buttons
        		            switch($('input:radio:checked').val()){
        		            		  case "blue":
        		            			  localStorage.setItem('cssfile','blue');
        		            			  break;
        		            		  case "red":
        		            			  localStorage.setItem('cssfile','red');
        		            			  break;
        		            		  case "green":
        		            			  localStorage.setItem('cssfile','green');
        		            			  break;
        		            		  }
        		            
        		            	//change page name
        		            		 var pageName=$("#txt_pagename").val();

        		     		    	//Creating AJAX Call to assure that page exist.
        		     		            $.ajax({
        		     		        url: "https://graph.facebook.com/" + pageName,
        		     		        dataType: 'jsonp',
        		     		       success: function(content) {
        		     		    	   			if(content.id){
        		     		    	   				localStorage.setItem('pageid',content.id);
        		     		    	   				
        		     		    	   				setTimeout(function(){var ref=window.open("../index.html","_self");
        		     		    	   									  $.mobile.loading( 'hide');},300);
        		     		    	   			}
        		     		    	   		else{
        		     			               alert("Please enter a valid Facebook page");
        		     			               $.mobile.loading( 'hide');
        		     		    	   		}
        		     		       								}
        		     		            });
        		     		            
        					}
        		        });
        		
        		$('#footer').find('a').click(function(e){e.preventDefault(); window.open($(this).attr('href'), '_system', 'location=yes') })

}
//handling saving records of entered pages
 function getDateTime() {
	    var now     = new Date(); 
	    var year    = now.getFullYear();
	    var month   = now.getMonth()+1; 
	    var day     = now.getDate();
	    var hour    = now.getHours();
	    var minute  = now.getMinutes();
	    var second  = now.getSeconds(); 
	    if(month.toString().length == 1) {
	        var month = '0'+month;
	    }
	    if(day.toString().length == 1) {
	        var day = '0'+day;
	    }   
	    if(hour.toString().length == 1) {
	        var hour = '0'+hour;
	    }
	    if(minute.toString().length == 1) {
	        var minute = '0'+minute;
	    }
	    if(second.toString().length == 1) {
	        var second = '0'+second;
	    }   
	    var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
	    return encodeURIComponent(dateTime);  //escaping slash char then decoding it in php
	}

	//checking connection before checking if the page exist or not
checkConnection = function () {
		   
	    var networkState = navigator.connection.type;
	    var states = {};
	    states[Connection.UNKNOWN] = 'Unknown connection';
	    states[Connection.ETHERNET] = 'Ethernet connection';
	    states[Connection.WIFI] = 'WiFi connection';
	    states[Connection.CELL_2G] = 'Cell 2G connection';
	    states[Connection.CELL_3G] = 'Cell 3G connection';
	    states[Connection.CELL_4G] = 'Cell 4G connection';
	    states[Connection.CELL] = 'Cell generic connection';
	    states[Connection.NONE] = 'No network connection';

	    if ((states[networkState] == 'No network connection') || (states[networkState] == 'Unknown connection')) {
	        ConnectionFlag = false;   
	        
	    	navigator.notification.alert(
	                'Network error occurred, Please check your Internet Connection',  // message
	                function () {
	                	navigator.app.exitApp();
	                },         // callback
	                'Network Connection',            // title
	                'OK'                  // buttonName
	            );
	    	return false
	    }
	    else{
	    	return true;
	    }
	    }