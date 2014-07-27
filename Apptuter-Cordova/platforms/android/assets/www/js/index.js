/*
 Name : index.js
 Author : Moataz Hammous
 Company : Softuter
 */
 var ConnectionFlag=false;// become true if there is Internet Connection.
var backFlag=false;
var _THIS=null;
var tempArray=null; //this array will store the first 20 posts to be saved in filesystem.
var storedArray=null; //this array will retrieve data from filesystem in case no connection.
var infoArray=null;
var scroll;
var pageID;  //variable to get get page ID from localStorage.
var postsXHR;
var infoXHR;
 var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'

    onDeviceReady: function() {
    	
    	//Setting Caching localstorage to true
    	localStorage.setItem('cachingflag','true');

    	
    		    // init the FB JS SDK
    		    FB.init({
    		      appId      : 'App_Id',                        // App ID from the app dashboard
    		      status     : true,                                 // Check Facebook Login status
    		      xfbml      : true                                  // Look for social plugins on the page
    		    });
    		    
    		   document.addEventListener('backbutton',function(e){
    			infoXHR.abort();
    			postsXHR.abort();
    			
    				setTimeout(function(){
    					navigator.app.exitApp();	
    				},400);
    				
    			});
        		    
        		$.mobile.allowCrossDomainPages = true;
        		$.mobile.page.prototype.options.domCache = true;
        		var Main2=new Main();
        		_THIS=Main2;
        		$('#morediv').on('click',Main2.showMore);
        		$('.infoIcon').on('click',Main2.showInfo);
        		Main2.width=$(window).width();
        		Main2.height=$(window).height();
        		
        		$('.coverPhoto').css('height',($(window).height())*0.3); //Setting CoverPhoto to 30% of Device Height.

        		$('.wrapper').css('min-height',$(window).height());
        		$('#morediv').addClass('fit-width');
        		
        		//Handling Header click event
        		$('.headerIcon').click(function () {
                    $('.headerIcon').removeClass('selected');
                    $(this).addClass('selected');
                    $('.tabContainer').hide();
                    
                    if($(this).index()==0){
                    	$.mobile.loading( 'show');
                    	Main2.homeFlag=true;
                    	Main2.paging='https://graph.facebook.com/'+_THIS.pageName+'/posts?limit=20&access_token='+Main2.accessToken;
                    	$('#posts').html('');
                    	Main2.handleShow(Main2.paging);
                    }
                    
                    $($('.tabContainer')[$(this).index()]).show();
                    
                    if($(this).index()==2){
                    	$("#txt_pagename").val('');
                    }	
                   
                });
        		
        		//Setting Save button action
        		$("#saveSettings").click(function(evt)
        		        {
        		            //Toggle Caching Button
        		                if($('#caching').val()=='on')
        		                    localStorage.setItem('chachingflag','true');
        		                else
        		                    localStorage.setItem('chachingflag','false');
        		            //End
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
        		            		 themeChange();
        		        });
        		
        		$('#footer').find('a').click(function(e){e.preventDefault(); window.open($(this).attr('href'), '_system', 'location=yes') })

        		$('.aboutContent').find('a').click(function(e){e.preventDefault(); window.open($(this).attr('href'), '_system', 'location=yes') })
        		
        		
        		Main2.checkConnection();
        		Main2.handleInfoShow();
        }
    };

     themeChange=function(){
    	//Setting page theme
    	 //firstly removing the old style link
    	 if(!document.getElementsByClassName("theme")){
    	 var element = document.getElementsByTagName("link");
    	 element.parentNode.removeChild(element);
    	 }

    	 //creating new link style element
     	var fileref=document.createElement("link");
     	  fileref.setAttribute("rel", "stylesheet");
     	  fileref.setAttribute("type", "text/css");
     	 fileref.setAttribute("class","theme");
     	  fileref.setAttribute("href", "css/"+localStorage.getItem('cssfile')+".css");
     	document.getElementsByTagName("head")[0].appendChild(fileref);

     }
     scrollInitialize=function(){
    	    setTimeout(function(){
    		    scroll=new iScroll('postsWrapper',{onBeforeScrollStart:function (e) {e.stopImmediatePropagation(); },tap:true,bounce:false});
    	    },0); 
     }
     onFileSystemSuccessWritePosts =function(filesystem){
    	 //alert(filesystem.root.fullPath);
    	 filesystem.root.getFile(_THIS.pageName+'_fb.txt',{create:true},gotFileEntryWritePosts,fail);
     }
     onFileSystemSuccessWriteInfo =function(filesystem){
    	 //alert(filesystem.root.fullPath);
    	 filesystem.root.getFile(_THIS.pageName+'_info.txt',{create:true},gotFileEntryWriteInfo,fail);
     }
     function gotFileEntryWritePosts(fileEntry){
    	
    	 fileEntry.createWriter(function(writer){
    		 								writer.write(tempArray);
    		 								writer.onwrite =function(e){
    		 									console.log("writed posts");
    		 								}
    	 },fail); //Creating Writer Instance.
     }
     function gotFileEntryWriteInfo(fileEntry){
    		
    	 fileEntry.createWriter(function(writer){
    		 								writer.write(_THIS.infoArray);
    		 								writer.onwrite =function(e){
    		 									console.log("writed Info");
    		 								}
    	 },fail); //Creating Writer Instance.
     }
     
     onFileSystemSuccessReadPosts =function(filesystem){
    		// alert(filesystem.root.fullPath);
    		 filesystem.root.getFile(_THIS.pageName+'_fb.txt',null,gotFileEntryReadPosts,fail);
    	 }
     onFileSystemSuccessReadInfo =function(filesystem){
    		// alert(filesystem.root.fullPath);
    		 filesystem.root.getFile(_THIS.pageName+'_info.txt',null,gotFileEntryReadInfo,fail);
    	 }
     function gotFileEntryReadPosts(fileEntry){	
    	fileEntry.file(function(file){
    		{
    			 var reader=new FileReader();
    			 reader.onloadend=function(e){
    				 storedArray=$.parseJSON(e.target.result);
    			 }
    			 reader.readAsText(file);
    		 }
    	},fail); //to get file required to be readed.
     }
     function gotFileEntryReadInfo(fileEntry){	
    		fileEntry.file(function(file){
    			{
    				 var reader=new FileReader();
    				 reader.onloadend=function(e){
    					 infoArray=$.parseJSON(e.target.result);
    				 }
    				 reader.readAsText(file);
    			 }
    		},fail); //to get file required to be readed.
    	 }
     fail =function(error){
    	 noCache()
     }