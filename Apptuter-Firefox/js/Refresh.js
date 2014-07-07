Main.prototype.refresh = function () {
    //Show loading widget
    $('progress:not([value])').css('display', 'inline-block');
    $('#posts').html('');
    _THIS.homeFlag = true;
    _THIS.paging = 'https://graph.facebook.com/' + _THIS.pageName + '/posts?limit=20&access_token='+_THIS.accessToken;
    //Retrieving Page Info & page posts
    _THIS.RequestInfo();
    _THIS.RequestPagePosts(_THIS.paging);
}