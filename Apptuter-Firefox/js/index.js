//This will responsible to instaniate FB Object
var pageID; //To store page Id for ajax calls
var _THIS = null;
var infoXHR;
var photosXHR;
var profilePic;
var networkCondition;

$(function () {

    //Show loading widget
    $('progress:not([value])').css('display', 'inline-block');

    //getting pageId from localstorage
    //pageID = localStorage.getItem('pageid');
    
    //Creating Main Object
    var Main2 = new Main();
    _THIS = Main2;

    //Getting Screen Width & Height
    Main2.width = $(window).width();
    Main2.height = $(window).height();

    //Registering More posts event handler
    $('#morediv').on('click', Main2.showMore);
    //Registering Refresh event handler
    $('#btn-refresh').on('click',Main2.refresh);


        //Retrieving Page Info & page posts
        Main2.RequestInfo();
        Main2.RequestPagePosts(Main2.paging);


});

Main.prototype.showMore = function () {
        _THIS.counter++;
        _THIS.showPagePosts();
    

}