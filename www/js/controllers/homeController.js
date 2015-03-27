define(function () {
    return function ($scope) {
        $scope.graphUrl = $scope.baseUrl + $scope.fSettings.pageName + "/posts?limit=20&access_token=" + $scope.accessToken;

        $scope.shouldShowDelete = false;
        $scope.listCanSwipe = true;

        $scope.postType = function (type) {
            switch (type) {
                case "link":
                    return "ion-link";
                case "photo":
                    return "ion-image";
                case "video":
                    return "ion-social-youtube"
            }
        };
        $scope.toggleLinkDescShown = function (post) {
            if (post.linkDescShown == undefined)
                post.linkDescShown = true;
            else
                post.linkDescShown = !post.linkDescShown;
        }
        $scope.decodeImageUrl = function (post) {
            if (post.picture) {
                var url = post.picture;

                var url_dec = '';
                if (post.object_id && post.type != "video") {
                    $.ajax({
                        type: "GET",
                        url: $scope.baseUrl + post.object_id,
                    }).done(function (response) {
                        url_dec = response.source;
                        var imgObj = $("[img-obj='" + response.id + "']");
                        //Storing decoded Url in localStorage in case of offline browsing
                        localStorage[post.object_id] = url_dec;
                        //ToDO Using Image Caching Lib to Cache Images Up to 40 Images
                        NativeBridge.useCachedFile(url_dec, response.id);
                        // $(imgObj).find('img').attr('src', url_dec);
                    }).error(function () {
                        NativeBridge.useCachedFile(localStorage[post.object_id], post.object_id);
                    })
                }
                else {
                    var imgObj = $("[img-src='" + url + "']")
                    if (url.indexOf('url=') > 0)
                        url_dec = decodeURIComponent(url.substring(url.indexOf('url=') + 4));
                    else
                        url_dec = url.replace('_s', '_n');
                    //Storing decoded Url in localStorage in case of offline browsing
                    localStorage[url] = url_dec;
                    NativeBridge.useCachedFile(localStorage[url], null, url);

                    //$(imgObj).find('img').attr('src', url_dec);
                }
            }

        }
        //Load More
        $scope.loadMore = function () {
            $scope.showLoading();
            $scope.nextGraphUrl = $scope.paging.next;
            var options = {};
            options.status = api.REMOTE;
            options.request = {};
            options.request.url = $scope.nextGraphUrl;
            options.request.type = "GET";
            options.request.dataType = "json";
            options.method = "get_morePosts";
            options.storeInLocalStorage = false;
            options.validData = function (response) {
                if (!isEmpty(response)) {
                    $scope.morePosts = response.data;
                    $scope.paging = response.paging;
                    debugger
                    $scope.posts = _.union($scope.posts, $scope.morePosts);
                    debugger
                    $scope.$apply();
                    $scope.hideLoading();
                }
            };
            api.process(options);

        }
        //Pull to Refresh
        $scope.reload = function () {
            if ($('.tabs a:first i').hasClass('ion-ios7-home-outline'))
                $scope.showHomePan();
            else {
                $scope.showLoading();

                var options = {};
                options.status = api.REMOTE;
                options.request = {};
                options.request.url = $scope.graphUrl;
                options.request.type = "GET";
                options.request.dataType = "json";
                options.method = "get_newPosts";
                options.storeInLocalStorage = false;
                options.validData = function (response) {
                    if (!isEmpty(response)) {
                        $scope.newPosts = response.data;

                        //Get Difference between the oldest posts & newest one.
                        //$scope.differencePosts = _.difference($scope.newPosts, $scope.posts);
                        _.filter($scope.newPosts, function (post, idx) {
                            if (post.id == $scope.posts[0].id) {
                                $scope.splitId = idx;
                                return true;
                            }
                        });
                        $scope.differencePosts = [];
                        for (var i = 0; i < $scope.splitId; i++) {
                            $scope.differencePosts.push($scope.newPosts[i]);
                        }
                        debugger
                        for (var i = $scope.differencePosts.length - 1; i >= 0 ; i--) {
                            $scope.posts.unshift($scope.differencePosts[i]);
                        }

                        $scope.$apply();
                        $scope.hideLoading();

                        debugger
                        //Updating localStorage with new Posts
                        var storeObj = {};
                        storeObj.data = $scope.posts;
                        storeObj.paging = $scope.paging;
                        localStorage["get_posts"] = JSON.stringify(storeObj);
                    }
                };
                api.process(options);
            }
        }
        //Main Request

        var options = {};
        options.status = api.SYNC;
        options.request = {};
        options.request.url = $scope.graphUrl;
        options.request.type = "GET";
        options.request.dataType = "json";
        options.method = "get_posts"
        options.localData = function (response) {
            if (!isEmpty(response)) {
                $scope.posts = response.data;
                $scope.paging = response.paging;
                $scope.$apply();
                $scope.hideLoading();
                $('.linky').on("click", function (e) {
                    e.preventDefault();
                    debugger;
                    $scope.openUrl($(this).attr("href"), "_system");
                })
            }
        }
        options.validData = function (response) {
            if (!isEmpty(response)) {
                $scope.posts = response.data;
                $scope.paging = response.paging;
                $scope.hideLoading();
                $('.linky').on("click", function (e) {
                    e.preventDefault();
                    debugger;
                    $scope.openUrl($(this).attr("href"), "_system");
                })
            }
        }
        api.process(options);
    };
})