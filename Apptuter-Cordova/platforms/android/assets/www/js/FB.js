var Main = function () {
    this.pageName = 'PAGE_ID'; //Here you will need to insert your page Id.
    this.src = null;
    this.name = null;
    this.category = null;
    this.description = null;
    this.likes = 0;
    this.photoArray = null;
    this.photoCount = 0;
    this.postArray = null;
    this.infoArray = [];
    this.postCount = 0;
    this.accessToken = 'ACCESS_TOKEN'; //Here will be your Facebook Access_Token
    this.pictureUrl = null;
    this.width;
    this.height;
    this.coverHeight;
    this.postStatus = 0; 
    this.paging ='https://graph.facebook.com/'+this.pageName+'/posts?limit=20&access_token='+this.accessToken;
    this.pagingNext = 'https://graph.facebook.com/'+this.pageName+'/posts?limit=20&access_token='+this.accessToken;
    this.pagingNext2 = null;
    this.counter = 0;
    this.homeFlag = true;
}
var postHTMLContent = '';
var postCounter = 0;


Main.prototype.handleInfoShow = function () {
    var _THIS_ = this;
    this.infoArray=[];
    
  //Loading Widget
	$.mobile.loading( 'show');
	
    //Getting Page Header
    infoXHR=$.ajax({
        url: "https://graph.facebook.com/" + _THIS_.pageName,
        success: function (data) {
            var oInfo = {};
            if(data.cover){
            	oInfo.src = data.cover.source;
            }
            if(data.description){
            	oInfo.message = data.description;
            }
            if(data.about){
            	oInfo.message=data.about;
            }
            if(data.name){
            	oInfo.name = data.name;
            }
            if(data.location){
            	oInfo.location=data.location;
            }
            if(data.website){
            	oInfo.website = data.website;
                if (!oInfo.website.match('http'))
                    oInfo.website = 'http://' + oInfo.website;
            }
            
            _THIS_.infoArray.push(oInfo);
            
            //displaying PageInfo
            _THIS_.showPageInfo();

        }
    });
    //}
}
Main.prototype.handleShow = function (graphUrl) {

	
	//Changing theme according to radio button choice
	themeChange();
	
    var _THIS_ = this;
    //Getting Page Posts

    postsXHR=$.ajax({
        url: graphUrl,
        success: function (content) {

            _THIS_.postArray = [];
            _THIS_.pagingNext = content.paging;
            if (_THIS_.pagingNext)
                _THIS_.pagingNext2 = _THIS_.pagingNext.next;


            $.each(content.data, function (i, item) {
                var opost = {};
                if(item.id){
                	opost.id=item.id;
                }
                if (item.type) {
                    opost.type = item.type; //photo,video,link,status
                }
                if (item.message) { // Null Check
                    opost.message = item.message;
                }
                else {
                    opost.message = '';
                }
                if (item.picture) {
                    opost.pic = item.picture;
                }
                if (item.caption) {
                    opost.caption = item.caption;
                }
                if (item.place) { //Null Check For Place Item.
                    var oplace = {};
                    oplace.name = item.place.name;
                    oplace.latitude = item.place.location.latitude;
                    oplace.longitude = item.place.location.longitude;
                    opost.place = oplace;
                }
                if (item.link) { //Null Check for link Item
                    opost.link = item.link;
                }

                if (item.source) { //in case video is posted in facebook servers.
                    opost.link = item.source;                    
                }
                if(item.name){
                	opost.name = item.name;
                }
                if (item.caption) {
                    opost.caption = item.caption;
                }
                if(item.created_time){
                	opost.time=new Date(item.created_time).toLocaleString();
                	opost.time=moment(opost.time).format('MMMM Do YYYY, h:mm ');
                }

                _THIS_.postArray.push(opost);

            });

            tempArray = _THIS_.postArray;

            _THIS_.showContent();
        },


        error: function () {
            //alert("Network error occurred, Please check your Internet Connection ");
            $('#container').css('display', 'none');
            $('#page').css('display', 'block');
            
            if(localStorage.getItem('cachingflag')=='true'){
            	
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccessReadPosts, fail);
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccessReadInfo, fail);
            setTimeout(function () { _THIS_.postArray = storedArray; _THIS_.showPagePosts(); _THIS_.infoArray = infoArray; _THIS_.showPageInfo(); }, 600);
            }
            else{
            	navigator.notification.alert(
                        'Caching feature is disabled',  // message
                        function () {
                        	navigator.app.exitApp();
                        	
                        },         // callback
                        'Application Cache',            // title
                        'OK'                  // buttonName
                    );
            	setTimeout(function(){navigator.app.exitApp();},900);
            }
        }
    });
}
//End of HandleShow


Main.prototype.showContent = function () {

    var _THIS_ = this;
    if (this.homeFlag) {
        $('#container').css('display', 'none');
        $('#page').css('display', 'block');
        this.homeFlag = false;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccessWritePosts, fail);
        this.showPagePosts();

    }
}

Main.prototype.showPageInfo = function () {

    $('.pageTitle').html(this.infoArray[0].name);
	
    $('.coverPhoto img').attr('src', this.infoArray[0].src);
    
    $('.coverPhoto img').load(function(){
    	setTimeout(function(){
    	$('.coverPhoto img').css('width','100%');
    	$('.coverPhoto').css('height',$('.coverPhoto img').css('height')).css('max-height',($(window).height())*0.3);
    	},100);
    });
    
	if(this.infoArray[0].location)
	$('.location').find('img').attr('src', "http://maps.googleapis.com/maps/api/staticmap?center=" + this.infoArray[0].location.latitude + "," + this.infoArray[0].location.longitude + "&zoom=11&sensor=false&size="+ (this.width - 10)  +  "x"+this.height*0.2);
    
	var arabicRegex = /[\u0600-\u06FF]/;
	
	if(this.infoArray[0].message){
    $('#description').find('.postText p').html(this.infoArray[0].message);
    if (arabicRegex.test(this.infoArray[0].message)) 
        $('#description').find('.postText p').addClass('rtl');
	}
	
	if(this.infoArray[0].website)
    $('#description').find('.postLink').show().html("<p>"+this.infoArray[0].name+"</p>").attr('href', this.infoArray[0].website);
    
    if (arabicRegex.test(this.infoArray[0].name)) {
        $('#description').find('.postLink').addClass('rtl');
    }
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccessWriteInfo, fail);
}

Main.prototype.showPagePosts = function () {

	

    // This Function handle Showing Page Posts
    var _THIS_ = this;

    // URL Regural Expression
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    var wwwRegex = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    var email = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    var videoRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11,})(?:\S+)?$/;
    var arabicRegex = /[\u0600-\u06FF]/;
    var anchorRegex = /[^<]*(<a href="([^"]+)">([^<]+)<\/a>)/g;
    
    //Looping over 20 post
    for (var i = 0; i < this.postArray.length; i++) {

        postHTMLContent = '<div id="postcontainer' + this.counter + '-' + i + '" class="postcontainer">\
                        <div class="specialPost">\
        				<div class="postTime"></div>\
                            <div class="highlighted">Post is highlighted</div>\
                            <div class="pinned">Post is pinned</div>\
                        </div>\
                        <div class="postAsset">\
                            <a rel="external" target="_system" class="assetBG"></a>\
                            <img src="" alt="" />\
                        </div>\
                        <div class="postText">\
                            <p></p>\
                        </div>\
                         <a target="_blank" class="postLink">\
                        </a>\
        				<div class="fb"></div>\
                    </div>'

        var postArrayMessage = this.postArray[i].message;

        if (this.postArray[i].caption) {
            //Append caption to post message.
            if (!this.postArray[i].caption.match('.com') && this.postArray[i].caption != ' ' && this.postArray[i].caption != 'bit.ly')
                postArrayMessage += '<br>' + this.postArray[i].caption;
        }
        
        var  postArrayModified = postArrayMessage;
        
      //if type is swf then this is video post
        if(this.postArray[i].type=='swf')
        	this.postArray[i].type='video';
        
        //if there link in post message differ than retrieved link object so set link object with this link.
        if(postArrayMessage.match(urlRegex)&&this.postArray[i].type!='video'){
        	this.postArray[i].link= postArrayMessage.match(urlRegex);

            //removing link to avoid duplication with retrieved link object
              postArrayModified = postArrayMessage.replace(urlRegex, ''); 
        }
        else{ //if there's no links in post message we check if this post of type photo we set link to null as the link refer to link of photo in facebook which is unnecessary
        	if(this.postArray[i].type=='photo')
        		this.postArray[i].link=null;
        }
        

        //Replacing Mail text with maito Anchor tag
        postArrayModified = postArrayModified.replace(email, '<a href="mailto:$1">$1</a>');

        var expandedHtml = postArrayModified;
        postArrayModified = postArrayModified.slice(0, 350);
        var collapsedHtml = postArrayModified + '....';



        if (postArrayMessage.match(/#Apptuter_hide/g)) {
            postCounter--;
            this.postStatus = 1;
            $('#postcontainer' + this.counter + '-' + i).hide();
        }
        else if (postArrayMessage.match(/#Apptuter_push/g)) {
            this.postStatus = 2;
          
        }
        else if (postArrayMessage.match(/#Apptuter_pin/g)) {
            this.postStatus = 3;
            $('#postcontainer' + this.counter + '-' + i).find('.pinned').show();
            $('#posts').prepend(postHTMLContent);
        }
        else if (postArrayMessage.match(/#Apptuter_highlight/g)) {
            this.postStatus = 3;
            $('#postcontainer' + this.counter + '-' + i).find('.highlighted').show();
            $('#posts').prepend(postHTMLContent);
        }
        else{
            $('#posts').append(postHTMLContent);
        }
        if(this.postArray[i].time){
        	 $('#postcontainer' + this.counter + '-' + i).find('.postTime').show().html(this.postArray[i].time);
        }
        
        //Setting text direction to default direction every post lte
        $('#postcontainer' + this.counter + '-' + i).find('.postText p').removeClass('rtl').addClass('ltr');
        $('#postcontainer' + this.counter + '-' + i).find('.postLink').removeClass('rtl').addClass('ltr');

        
        
        if (this.postArray[i].type == 'link' || this.postArray[i].type == 'video') {
            if (this.postArray[i].pic) { //In case the post has a picture
            	if(!this.postArray[i].pic.match(/_blank/g)){ //in case the picture is not blank pic.
            	if(this.postArray[i].pic.match(/url=/g)){
                var url = this.postArray[i].pic.substring(this.postArray[i].pic.indexOf('url=') + 4);
                var url_dec = decodeURIComponent(url);
            	}
            	else{
            		url_dec=this.postArray[i].pic;
            	}
            	
            	//Setting type of icon ---> link or video
                $('#postcontainer' + this.counter + '-' + i).find('.postAsset').addClass(this.postArray[i].type).show().find('img').attr('src', url_dec).attr('max-height', $('.postcontainer').width());
                $('#postcontainer' + this.counter + '-' + i).find('.postAsset img').load(function () {
                    $(this).parent().css('height', $(this).height()).css('max-height', $(this).parent().width());
                   
                });

                $('#postcontainer' + this.counter + '-' + i).find('.assetBG').attr('name', this.postArray[i].link).on('tap',function (e) {e.preventDefault();window.open($(this).attr('name'), '_system', 'location=yes') });
            	}
            	}//End picture case
            	
            if(this.postArray[i].name){
                var link = this.postArray[i].link;
                $('#postcontainer' + this.counter + '-' + i).find('.postLink').show().attr('name', this.postArray[i].link).html("<p>"+this.postArray[i].name+"</p>").on('tap',function (e) { e.preventDefault(); window.open($(this).attr('name'), '_system', 'location=yes') });
            	}
            
                if (postArrayModified != '') {
                	if (postArrayMessage.length > 350)
                        $('#postcontainer' + this.counter + '-' + i).find('.postText p').html(collapsedHtml).on("tap",function(e){expand(e.target)}).data('content', { 'expandedHtml': expandedHtml, 'collapsedHtml': collapsedHtml });
                    else
                        $('#postcontainer' + this.counter + '-' + i).find('.postText p').html(postArrayModified).data('content', { 'expandedHtml': expandedHtml, 'collapsedHtml': expandedHtml });;
                }
                else
                    $('#postcontainer' + this.counter + '-' + i).find('.postText').hide();

            
        }

        else if (this.postArray[i].type == 'photo') {
            var nPic;
        	if(this.postArray[i].pic.match(/=/g)){  //for unregular photo images
        	
        		nPic=this.postArray[i].pic;
        		$('#postcontainer' + this.counter + '-' + i).find('.postAsset').addClass('image').show().find('img').attr('src', nPic);
        	}
        	else{
        		nPic = this.postArray[i].pic.replace('_s', '_n');
        		$('#postcontainer' + this.counter + '-' + i).find('.postAsset').addClass('image').show().find('img').attr('src', nPic+'?x=123');
        	}
            
            $('#postcontainer' + this.counter + '-' + i).find('.postAsset img').load(function () {
                $(this).parent().css('height', $(this).height()).css('max-height', $(this).parent().width());
            });


            $('#postcontainer' + this.counter + '-' + i).find('.assetBG').on('tap',function (evt) {

                var pic = $(this).next().attr('src');
               
                if ($(this).parent().next().find('p').html() != '')
                    var Message = $(this).parent().next().find('p').data('content').expandedHtml;
                else
                    var Message = '';
             
                var ref = window.open('post.html', '_blank', 'location=no');
                ref.addEventListener('loadstop', function () {
                    //Execute this script after post.html has been loaded        
                    ref.executeScript({
                        code: "$('#postContainer').find('img').attr('src','" + pic + "').attr('width',$('.postcontainer').width());"+
                        		"new iScroll('postContainer',{zoom:true,bounce:false,vScroll:false});"
                    })
                });
            });

            if(this.postArray[i].link){
                $('#postcontainer' + this.counter + '-' + i).find('.postLink').show().attr('name', this.postArray[i].link[0]).html("<p>"+this.postArray[i].link[0]+"</p>").on('tap',function (e) { e.preventDefault(); window.open($(this).attr('name'), '_system', 'location=yes') });
            	//alert(this.postArray[i].link.length);
                for(var j=1;j<this.postArray[i].link.length;j++){ //listing the rest of links
            		//alert(this.postArray[i].link[j]);
            		$('#postcontainer' + this.counter + '-' + i).append('<a target="_blank" class="postLink"></a>').find('.postLink:last').show().css('margin','2%').attr('name', this.postArray[i].link[j]).html("<p>"+this.postArray[i].link[j]+"</p>").on('tap',function (e) { e.preventDefault(); window.open($(this).attr('name'), '_system', 'location=yes') });
            	}
            }
            if (postArrayModified != '') {
                if (postArrayMessage.length > 350)
                    $('#postcontainer' + this.counter + '-' + i).find('.postText p').html(collapsedHtml).on("tap",function(e){expand(e.target)}).data('content', { 'expandedHtml': expandedHtml, 'collapsedHtml': collapsedHtml });
                else
                    $('#postcontainer' + this.counter + '-' + i).find('.postText p').html(postArrayModified).data('content', { 'expandedHtml': expandedHtml, 'collapsedHtml': expandedHtml });;
            }
            else
                $('#postcontainer' + this.counter + '-' + i).find('.postText').hide();
            

        }

        
        else{
        	
        	if (postArrayModified.length !=''){
        		 if (postArrayMessage.length > 350)
                     $('#postcontainer' + this.counter + '-' + i).find('.postText p').html(collapsedHtml).on("tap",function(e){expand(e.target)}).data('content', { 'expandedHtml': expandedHtml, 'collapsedHtml': collapsedHtml });
                 else
                     $('#postcontainer' + this.counter + '-' + i).find('.postText p').html(postArrayModified).data('content', { 'expandedHtml': expandedHtml, 'collapsedHtml': expandedHtml });;
                 
                 if (arabicRegex.test(postArrayMessage)) {
                         $('#postcontainer' + this.counter + '-' + i).find('.postText p').addClass('rtl');
                     }
        	}
        	else
                $('#postcontainer' + this.counter + '-' + i).hide();
        	
        	 if(this.postArray[i].link){ // in case there's link in the message text
                 $('#postcontainer' + this.counter + '-' + i).find('.postLink').show().attr('name', this.postArray[i].link).html("<p>"+this.postArray[i].link+"</p>").on('tap',function (e) { e.preventDefault(); window.open($(this).attr('name'), '_system', 'location=yes') });
             	}
        }
        
        //Linking With Facebook App if available & if not linking with the mobile version
        $('#postcontainer' + this.counter + '-' + i).find('.fb').html("<a  name='fb://post/"+this.postArray[i].id+"'><img name='fb://post/"+this.postArray[i].id+"' src='img/Facebook_Logo.png' /></a>").on('tap',function (e) { e.preventDefault(); 

        appAvailability.check('com.facebook.katana', function(availability) {
            // availability is either true or false
            if(availability) { 
            	$.mobile.loading( 'show');
            	 window.plugins.webintent.startActivity({
                     action: window.plugins.webintent.ACTION_VIEW,
                     url: e.target.name},
                     function() {$.mobile.loading( 'hide');},
                     function() {alert('Failed to open try again later')}
                 );
            }
            else{
            	var postId=e.target.name.substring(e.target.name.indexOf('_') + 1);
            	var url="https://m.facebook.com/"+_THIS_.pageName+"/posts/"+postId;
            	window.open(url,"_system","location=yes");
            }
            	
        });
       
        });
        
        //checking rtl language
        if (arabicRegex.test(postArrayMessage)) {
            $('#postcontainer' + this.counter + '-' + i).find('.postText p').removeClass('ltr').addClass('rtl');}
        if(arabicRegex.test(this.postArray[i].name)){
            $('#postcontainer' + this.counter + '-' + i).find('.postLink').removeClass('ltr').addClass('rtl');
        }
    }
    $('#posts img').load(function(){
    	$.mobile.loading( 'hide');
    });
	//
    
    
    if (this.pagingNext) {
        this.pagingNext = this.pagingNext2;
        this.handleShow(this.pagingNext);
        $('#morediv .bgLayer').html("<img src='img/showMoreIcon.gif' class='showMoreIcon' /><a id='moreposts'></a>");
    }
    else
        $('#morediv .bgLayer').html("<img src='img/warningIcon.png' class='warningIcon' />");
    
}

popimg = function (id, e) {
    e.stopPropagation();
    $('#' + id).popup();
    $('#' + id).popup('open');
}

expand = function (caller) {
    $(caller).on('tap', function(e){collapse(e.target)});
    $(caller).html($(caller).data('content').expandedHtml);
}
collapse = function (caller) {

    $(caller).on('tap', function(e){expand(e.target)});
    $(caller).html($(caller).data('content').collapsedHtml);
}
Main.prototype.checkConnection = function () {
    var _THIS_ = this;
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
        //alert(localStorage.getItem('cachingflag'));
        if(localStorage.getItem('cachingflag')=='true'){
        	//In case Caaching Feature is Activated
        	navigator.notification.alert(
                            'Network error occurred, Please check your Internet Connection',  // message
                            function () {
                            	
                                $('#container').css('display', 'none');
                                $('#page').css('display', 'block');
                                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccessReadPosts, fail);
                                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccessReadInfo, fail);
                                setTimeout(function () { 
                                _THIS_.postArray = storedArray; 
                                _THIS_.showPagePosts();
                                _THIS_.infoArray = infoArray;
                                _THIS_.showPageInfo();
                               
                                }, 600);
                            	},         // callback
                            'Network Connection',            // title
                            'OK'                  // buttonName
                        );}

   	 else{
        	navigator.notification.alert(
                    'Caching feature is disabled',  // message
                    function () {
                    	navigator.app.exitApp();
                    },         // callback
                    'Application Cache',            // title
                    'OK'                  // buttonName
                );}
    }
    else {
        ConnectionFlag = true;
        this.handleShow(this.pagingNext);
    }

}

Main.prototype.checkConnection2 = function () {
	var _THIS_ = this;
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
                'Network Connection',            // title
                'OK'                  // buttonName
        			);
        return false;
    }
    return true;
}
Main.prototype.showMore = function () {
	
	if(_THIS.checkConnection2()){
    _THIS.counter++;
    _THIS.showPagePosts();
	}
	else
	$('#morediv .bgLayer').html("<img src='img/warningIcon.png' class='warningIcon' />");
    
}

noCache=function(){
	navigator.notification.alert(
            'No Chached Stream',  // message
            function () {
            	navigator.app.exitApp();
            },         // callback
            'Application Cache',            // title
            'OK'                  // buttonName
        );
	
}

Main.prototype.showInfo = function () {
    //Manipulating Page Description
    $('#info').popup();
    $('#info').popup('open');
}
showLoadingWidget = function () {
    $.mobile.loading('show');
}
hideLoadingWidget = function () {
    $.mobile.loading('hide');
}
