var Main = function () {
    this.pageName = "PAGE_ID";
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
    this.accessToken = 'ACCESS_TOKEN';
    this.pictureUrl = null;
    this.width;
    this.height;
    this.coverHeight;
    this.postStatus = 0;
    this.paging = 'https://graph.facebook.com/' + this.pageName + '/posts?limit=20&access_token='+this.accessToken;
    this.pagingNext = 'https://graph.facebook.com/' + this.pageName + '/posts?limit=20&access_token='+this.accessToken;
    this.pagingNext2 = null;
    this.counter = 0;
    this.homeFlag = true;
}

//Requsting Page Info
Main.prototype.RequestInfo= function () {
    var _THIS_ = this;


    //Getting Page Header
    infoXHR = $.ajax({
        url: "https://graph.facebook.com/" + _THIS_.pageName,
        success: function (data) {
            var oInfo = {};
            if (data.cover) {
                oInfo.src = data.cover.source;
            }
            if (data.description) {
                oInfo.message = data.description;
            }
            if (data.about) {
                oInfo.message = data.about;
            }
            if (data.name) {
                oInfo.name = data.name;
               
            }
            if (data.location) {
                oInfo.location = data.location;
            }
            if (data.website) {
                oInfo.website = data.website;
                if (!oInfo.website.match('http'))
                    oInfo.website = 'http://' + oInfo.website;
            }

            _THIS_.infoArray.push(oInfo);
            _THIS_.handlePicShow();
            

        }
    });


}
//Requesting Profile Picture
Main.prototype.handlePicShow = function () {
    var _THIS_ = this;
    //Retrieving Page profile picture
    photosXHR = $.ajax({
        url: "https://graph.facebook.com/" + _THIS_.pageName + "/photos",
        success: function (content) {

            if (content.data[0].source)
                profilePic = content.data[0].source;

            //displaying PageInfo
            _THIS_.showPageInfo();
        }
    });
}
//Showing Page Info in InfoWrapper

Main.prototype.showPageInfo = function () {

    //Setting Page name
    var name = this.infoArray[0].name;

    if(name.length<10)
        $('#pageName').html(this.infoArray[0].name);
    else
        $('#pageName').html("<marquee>"+this.infoArray[0].name+"</marquee>");

    //Setting page profile image
    $('.imgCont').find('.imgSrc').attr("src", profilePic);

    //Setting Page Location
    if (this.infoArray[0].location)
        $('.location').find('img').attr('src', "http://maps.googleapis.com/maps/api/staticmap?center=" + this.infoArray[0].location.latitude + "," + this.infoArray[0].location.longitude + "&zoom=11&sensor=false&size=" + (this.width - 10) + "x" + this.height * 0.2);

    //Arabic Regular Expression
    var arabicRegex = /[\u0600-\u06FF]/;

    if (this.infoArray[0].message) {
        $('.content.infoText').find('#description').html(this.infoArray[0].message);
        if (arabicRegex.test(this.infoArray[0].message))
            $('.content.infoText').find('p').addClass('rtl');
    }
    //Setting Page Link
    if (this.infoArray[0].website)
        $('.pageLink').attr('href', this.infoArray[0].website).on('click', function (e) { e.preventDefault(); window.open($(this).attr('href'), '_system', 'location=yes')}).find('p').html(this.infoArray[0].name);

    if (arabicRegex.test(this.infoArray[0].name)) {
        //$('.pageLink').find('p').addClass('rtl');
    }

}