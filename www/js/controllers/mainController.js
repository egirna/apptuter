define(function () {
    return function ($scope, $ionicPopup, $ionicBackdrop, $ionicLoading, $ionicTabsDelegate) {
        $scope.animationLoading = true;
        $scope.baseUrl = "https://graph.facebook.com/";
        $scope.accessToken = '561797127192762|Qul8ztWbmhVP5-WUmPFh1Cs0m8s';
        $scope.fSettings = JSON.parse(localStorage["fSettings"]);
        
        $scope.backdropRetain = function () {
            $ionicBackdrop.retain();
        }
        $scope.backdropRelease = function () {
            $ionicBackdrop.release();
        }
        $scope.showLoading = function () {
            $ionicLoading.show({
                template: '<i class="icon ion-loading-a"></i> Loading...'
            });
        }
        $scope.hideLoading = function () {
            $ionicLoading.hide();
        }
        $scope.showHomePan = function () {
            debugger
            $ionicTabsDelegate.select(0);
        }
        $scope.openUrl = function (url) {
            NativeBridge.openUrl(url, '_system', undefined);
        }
        $scope.lng = function (message) {
            var arabicRegex = /[\u0600-\u06FF]/;
            return arabicRegex.test(message)
        }
        $scope.openVideo = function (url, name) {
            if (url.indexOf(".swf") > 0)
                var myPopup = $ionicPopup.show({
                    template: '<embed width="100%" src="' + url + '" />',
                    title: name,
                    scope: $scope,
                    buttons: [
                      {
                          text: '<b>Close</b>',
                          type: 'button-assertive button-block',
                          onTap: function (e) {
                              myPopup.close();
                          }
                      }
                    ]
                });
            else if (url.indexOf("youtube") > 0)
                $scope.openUrl(url);
            else
            var myPopup = $ionicPopup.show({
                template: '<video style="width:100%"  controls><source src="'+url+'" type="video/mp4">Your browser does not support HTML5 video.</video>',
                title: name,
                scope: $scope,
                buttons: [
                  {
                      text: '<b>Close</b>',
                      type: 'button-assertive button-block',
                      onTap: function (e) {
                          myPopup.close();
                      }
                  }
                ]
            });
        }
        $scope.showLoading();
        //Retrieving Page Thumbnail
        var options = {};
        options.status = api.SYNC;
        options.request = {};
        options.request.url = $scope.baseUrl + $scope.fSettings.pageName + "?fields=picture&type=normal&access_token=" + $scope.accessToken;
        options.request.type = "GET";
        options.request.dataType = "json";
        options.method = "get_pageThumb"
        options.localData = function (response) {
            if (!isEmpty(response)) {
                $scope.pageThumb = response.picture.data.url;
                $scope.$apply();
            }
        }
        options.validData = function (response) {
            if (!isEmpty(response)) {
                $scope.pageThumb = response.picture.data.url;
                $scope.$apply();
            }
        }
        api.process(options);
    };
})