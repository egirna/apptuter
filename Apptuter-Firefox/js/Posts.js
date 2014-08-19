Main.prototype.RequestPagePosts = function (graphUrl) {


    ////Changing theme according to radio button choice
    //themeChange();

    var _THIS_ = this;

    //Getting Page Post
    postsXHR = $.ajax({
        url: graphUrl,
        success: function (content) {

            _THIS_.postArray = [];
            _THIS_.pagingNext = content.paging;
            if (_THIS_.pagingNext)
                _THIS_.pagingNext2 = _THIS_.pagingNext.next;


            $.each(content.data, function (i, item) {
                var opost = {};
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
                if (item.object_id) {
                    opost.objectId = item.object_id;
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
                if (item.name) {
                    opost.name = item.name;
                }
                if (item.caption) {
                    opost.caption = item.caption;
                }
                if (item.created_time) {
                    opost.time = new Date(item.created_time).toLocaleString();
                    opost.time = moment(opost.time).format('MMMM Do YYYY, h:mm ');
                }

                _THIS_.postArray.push(opost);

            });

            tempArray = _THIS_.postArray;

            if (_THIS_.homeFlag) { //in case of first request
                _THIS_.showPagePosts();
                _THIS_.homeFlag = false;
            }
        },


        error: function () {
            $('progress:not([value])').css('display', 'none');
            $('section[role="status"]').find('p').text("Network error occurred, Please check your Internet Connection & try again later");
            $('section[role="status"]').css('display', 'block');
            $('section[role="status"]').find('button').click(function () { window.close() });

            $('.homeContent').hide();

            $("#btn-refresh").unbind("click");
            $("#btn-showInfo").unbind("click");

            $('#btn-refresh').click(function (evt) { evt.preventDefault(); });
            $('#btn-showInfo').click(function (evt) { evt.preventDefault(); });
            $('.toggleMenuBtn').click(function (evt) { evt.preventDefault(); });

            //$('#container').css('display', 'none');
            //$('#page').css('display', 'block');

            //if (localStorage.getItem('cachingflag') == 'true') {

            //    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccessReadPosts, fail);
            //    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccessReadInfo, fail);
            //    setTimeout(function () { _THIS_.postArray = storedArray; _THIS_.showPagePosts(); _THIS_.infoArray = infoArray; _THIS_.showPageInfo(); }, 600);
            //}
            //else {
            //    navigator.notification.alert(
            //            'Caching feature is disabled',  // message
            //            function () {
            //                navigator.app.exitApp();

            //            },         // callback
            //            'Application Cache',            // title
            //            'OK'                  // buttonName
            //        );
            //    setTimeout(function () { navigator.app.exitApp(); }, 900);
            //}
        }
    });
}
//End of HandleShow


Main.prototype.showPagePosts = function () {  // This Function handle Showing Page Posts

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
                    </div>'

        var postArrayMessage = this.postArray[i].message;

        //If the post has caption so append to original message.
        if (this.postArray[i].caption) {
            //Append caption to post message.
            if (!this.postArray[i].caption.match('.com') && this.postArray[i].caption != ' ' && this.postArray[i].caption != 'bit.ly')
                postArrayMessage += '<br>' + this.postArray[i].caption;
        }
        //endCaption

        var postArrayModified = postArrayMessage;

        //if type is swf then this is video post
        if (this.postArray[i].type == 'swf')
            this.postArray[i].type = 'video';

        //checking if the post message contains links.
        //if there link in post message differ than retrieved link object so set link object with this link.
        if (postArrayMessage.match(urlRegex) && this.postArray[i].type != 'video') {
            this.postArray[i].subLinks = postArrayMessage.match(urlRegex);


            //removing link to avoid duplication with retrieved link object
            postArrayModified = postArrayMessage.replace(urlRegex, '');
        }

        else { //if there's no links in post message we check if this post of type photo we set link to null as the link refer to link of photo in facebook which is unnecessary
            if (this.postArray[i].type == 'photo')
                this.postArray[i].link = null;
        }
        //endChecking

        //Replacing Mail text with maito Anchor tag
        postArrayModified = postArrayModified.replace(email, '<a href="mailto:$1">$1</a>');

        //setting collapsed message to 350 char.
        var expandedHtml = postArrayModified;
        postArrayModified = postArrayModified.slice(0, 350);
        var collapsedHtml = postArrayModified + '....';

        //append this post to post container
        $('#posts').append(postHTMLContent);

        //setting post time section
        if (this.postArray[i].time) {
            $('#postcontainer' + this.counter + '-' + i).find('.postTime').show().html(this.postArray[i].time);
        }
        //endSetting

        //Setting text direction to default direction every post lte
        $('#postcontainer' + this.counter + '-' + i).find('.postText p').removeClass('rtl').addClass('ltr');
        $('#postcontainer' + this.counter + '-' + i).find('.postLink').removeClass('rtl').addClass('ltr');


        //If the Post Type Link or Video
        if (this.postArray[i].type == 'link' || this.postArray[i].type == 'video') {
            if (this.postArray[i].pic) { //In case the post has a picture
                if (!this.postArray[i].pic.match(/_blank/g)) { //in case the picture is not blank pic.
                    if (this.postArray[i].pic.match(/url=/g)) {
                        var url = this.postArray[i].pic.substring(this.postArray[i].pic.indexOf('url=') + 4);
                        var url_dec = decodeURIComponent(url);
                    }
                    else {
                        url_dec = this.postArray[i].pic;
                    }

                    //Detecting Youtube Links
                    var link = new String(this.postArray[i].link);
                    link = link.substring(0, link.indexOf('?'));
                    if (link.match(/youtube/)) {
                        this.postArray[i].link = link.replace("/v/", "/watch?v=");

                    }

                    //Setting type of icon ---> link or video
                    $('#postcontainer' + this.counter + '-' + i).find('.postAsset').addClass(this.postArray[i].type).show().find('img').attr('src', url_dec).attr('max-height', $('.postcontainer').width());
                    $('#postcontainer' + this.counter + '-' + i).find('.postAsset img').load(function () {
                        $(this).parent().css('height', $(this).height()).css('max-height', $(this).parent().width());
                    });
                    //endSetting Icon

                    //Adding click event handler to post pic
                    $('#postcontainer' + this.counter + '-' + i).find('.assetBG').attr('name', this.postArray[i].link).on('click', function (e) { e.preventDefault(); window.open($(this).attr('name'), '_self', 'location=yes') });
                }
            }//End picture case

            //Setting Link name & link if exist
            if (this.postArray[i].name) {
                var link = this.postArray[i].link;
                if (arabicRegex.test(this.postArray[i].name)) {
                    $('#postcontainer' + this.counter + '-' + i).find('.postLink').removeClass('ltr').addClass('rtl');
                }
               
                $('#postcontainer' + this.counter + '-' + i).find('.postLink').show().attr('name', this.postArray[i].link).html("<p>" + this.postArray[i].name + "</p>").on('click', function (e) { e.preventDefault(); window.open($(this).attr('name'), '_system', 'location=yes') });

                if (this.postArray[i].subLinks)
                    //for rest links if post message contains more than one link
                    for (var j = 1; j < this.postArray[i].subLinks.length; j++) { //listing the rest of links
                        $('#postcontainer' + this.counter + '-' + i).append('<a target="_blank" class="postLink"></a>').find('.postLink:last').show().removeClass("rtl").addClass("ltr").css('margin', '2%').attr('name', this.postArray[i].subLinks[j]).html("<p>" + this.postArray[i].subLinks[j] + "</p>").on('click', function (e) { e.preventDefault(); window.open($(this).attr('name'), '_system', 'location=yes') });
                    }
            }
            //setting the collapsed & expanded post text version
            if (postArrayModified != '') {
                if (postArrayMessage.length > 350)
                    $('#postcontainer' + this.counter + '-' + i).find('.postText p').html(collapsedHtml).on("click", function (e) { expand(e.target) }).data('content', { 'expandedHtml': expandedHtml, 'collapsedHtml': collapsedHtml });
                else
                    $('#postcontainer' + this.counter + '-' + i).find('.postText p').html(postArrayModified).data('content', { 'expandedHtml': expandedHtml, 'collapsedHtml': expandedHtml });;
            }
                //endSetting Collapsed & expanded Version

            else //in case there's no message
                $('#postcontainer' + this.counter + '-' + i).find('.postText').hide();
        }
            //if the post type is photo
        else if (this.postArray[i].type == 'photo') {
            var nPic = "https://graph.facebook.com/" + this.postArray[i].objectId + "/picture";

            $('#postcontainer' + this.counter + '-' + i).find('.postAsset').addClass('image').show().find('img').attr('src', nPic + '?x=123');

            //setting image height & width
            $('#postcontainer' + this.counter + '-' + i).find('.postAsset img').load(function () {
                $(this).parent().css('height', $(this).height()).css('max-height', $(this).parent().width());
            });
            //endSetting height & width


            $('#postcontainer' + this.counter + '-' + i).find('.assetBG').on('click', function (evt) {

                var pic = $(this).next().attr('src');
                window.open('post.html?pic=' + pic, '_system', 'location=yes');
            });

            if (this.postArray[i].link) {
                if (arabicRegex.test(this.postArray[i].name)) {
                    $('#postcontainer' + this.counter + '-' + i).find('.postLink').removeClass('ltr').addClass('rtl');
                }

                if (!this.postArray[i].subLinks) {
                    $('#postcontainer' + this.counter + '-' + i).find('.postLink').show().attr('name', this.postArray[i].link).html("<p>" + this.postArray[i].link[0] + "</p>").on('click', function (e) { e.preventDefault(); window.open($(this).attr('name'), '_system', 'location=yes') });
                }
                else
                    //for rest links if post message contains more than one link
                    for (var j = 0; j < this.postArray[i].subLinks.length; j++) { //listing the rest of links
                        $('#postcontainer' + this.counter + '-' + i).append('<a target="_blank" class="postLink"></a>').find('.postLink:last').show().removeClass("rtl").addClass("ltr").css('margin', '2%').attr('name', this.postArray[i].subLinks[j]).html("<p>" + this.postArray[i].subLinks[j] + "</p>").on('click', function (e) { e.preventDefault(); window.open($(this).attr('name'), '_system', 'location=yes') });
                    }
            }
            if (postArrayModified != '') {
                if (postArrayMessage.length > 350)
                    $('#postcontainer' + this.counter + '-' + i).find('.postText p').html(collapsedHtml).on("click", function (e) { expand(e.target) }).data('content', { 'expandedHtml': expandedHtml, 'collapsedHtml': collapsedHtml });
                else
                    $('#postcontainer' + this.counter + '-' + i).find('.postText p').html(postArrayModified).data('content', { 'expandedHtml': expandedHtml, 'collapsedHtml': expandedHtml });;
            }
            else
                $('#postcontainer' + this.counter + '-' + i).find('.postText').hide();

        }


        else {

            if (postArrayModified.length != '') {
                if (postArrayMessage.length > 350)
                    $('#postcontainer' + this.counter + '-' + i).find('.postText p').html(collapsedHtml).on("click", function (e) { expand(e.target) }).data('content', { 'expandedHtml': expandedHtml, 'collapsedHtml': collapsedHtml });
                else
                    $('#postcontainer' + this.counter + '-' + i).find('.postText p').html(postArrayModified).data('content', { 'expandedHtml': expandedHtml, 'collapsedHtml': expandedHtml });;

                if (arabicRegex.test(postArrayMessage)) {
                    $('#postcontainer' + this.counter + '-' + i).find('.postText p').addClass('rtl');
                }
            }
            else
                $('#postcontainer' + this.counter + '-' + i).hide();

            if (this.postArray[i].link) { // in case there's link in the message text

                if (arabicRegex.test(this.postArray[i].name)) {
                    $('#postcontainer' + this.counter + '-' + i).find('.postLink').removeClass('ltr').addClass('rtl');
                }
                if (!this.postArray[i].subLinks)
                    $('#postcontainer' + this.counter + '-' + i).find('.postLink').show().attr('name', this.postArray[i].link).html("<p>" + this.postArray[i].link + "</p>").on('click', function (e) { e.preventDefault(); window.open($(this).attr('name'), '_system', 'location=yes') });
                else
                    //for rest links if post message contains more than one link

                    for (var j = 1; j < this.postArray[i].subLinks.length; j++) { //listing the rest of links
                        $('#postcontainer' + this.counter + '-' + i).find('.postLink:last').append('<a target="_blank" class="postLink"></a>').find('.postLink:last').show().removeClass("rtl").addClass("ltr").css('margin', '2%').attr('name', this.postArray[i].subLinks[j]).html("<p>" + this.postArray[i].subLinks[j] + "</p>").on('click', function (e) { e.preventDefault(); window.open($(this).attr('name'), '_system', 'location=yes') });
                    }
            }
        }

        //checking rtl language
        if (arabicRegex.test(postArrayMessage)) {
            $('#postcontainer' + this.counter + '-' + i).find('.postText p').removeClass('ltr').addClass('rtl');
        }
    }
    $('#posts img').load(function () {
        //hide loading widget
        $('progress:not([value])').css('display', 'none');
    });
    //


    if (this.pagingNext) {
        this.pagingNext = this.pagingNext2;
        this.RequestPagePosts(this.pagingNext);
        $('#morediv .bgLayer').html("<img src='img/showMoreIcon.gif' class='showMoreIcon' /><a id='moreposts'></a>");
    }
    else
        $('#morediv .bgLayer').html("<img src='img/warningIcon.png' class='warningIcon' />");

}
//this function called when you click over collapsed post
expand = function (caller) {
    $(caller).on('click', function (e) { collapse(e.target) });
    $(caller).html($(caller).data('content').expandedHtml);
}
//this function called when you click over expanded post
collapse = function (caller) {

    $(caller).on('click', function (e) { expand(e.target) });
    $(caller).html($(caller).data('content').collapsedHtml);
}