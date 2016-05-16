define(function () {
    return function ($scope, $rootScope, $ionicLoading, $location) {
        //Getting static FB token from Server
        
        $scope.showLoading = function () {
            $ionicLoading.show({
                template: '<i class="icon ion-loading-a"></i> Loading...'
            });
        }
        $scope.hideLoading = function () {
            $ionicLoading.hide();
        }
        var options = {};
        options.status = api.SYNC;
        options.request = {};
        options.request.url = 'http://apptuter.com/services/get_tokens.php?id=1';
        options.request.type = "GET";
        options.request.dataType = "json";
        options.method = "get_tokens";
        options.localData = function (response) {
            if (!isEmpty(response)) {
                $rootScope.FBToken = response.FBToken
                $rootScope.searchUrl = 'https://graph.facebook.com/search?access_token=' + response.FBToken + '&limit=4&type=page&fields=name,category,username,picture&q=';
                $scope.$apply();
            }
        }
        options.validData = function (response) {
            if (!isEmpty(response)) {
                $rootScope.FBToken = response.FBToken;
                $rootScope.searchUrl = 'https://graph.facebook.com/search?access_token=' + response.FBToken + '&limit=4&type=page&fields=name,category,username,picture&q=';
                $scope.$apply();
            }
        }
        api.process(options);

        $scope.fSettings = {};
        $scope.fSettings.colors = ["Blue","Green","Red"] ;
        $scope.selectedTheme = $scope.fSettings.colors[0];
        $scope.$apply()

        
        $scope.openUrl = function (url) {
            NativeBridge.openUrl(url, '_system', undefined);
        }

        $rootScope.saveSubscription = function () {
            var deferred = $.Deferred();
            var options = {};
            $scope.deviceInfo = NativeBridge.deviceInfo();
            options.status = api.REMOTE;
            options.request = {};
            options.request.url = 'http://apptuter.com/services/save_subscription.php';
            options.request.type = "POST";
            options.request.dataType = "json";
            options.request.data = {};
            options.request.data.pagename = $('#pages_value').val()+' '+$scope.fSettings.pageName;
            options.request.data.username = $scope.fSettings.username;
            options.request.data.email = $scope.fSettings.email;
            if ($scope.fSettings.push)
            options.request.data.pushnotification = 1;
            options.request.data.deviceid = $scope.deviceInfo.uuid;
            options.request.data.devicemodel = $scope.deviceInfo.model;
            options.request.data.deviceplatform = $scope.deviceInfo.platform;
            options.request.data.deviceversion = $scope.deviceInfo.version;

            options.method = "save_subscription";
            options.validData = function (response) {
                if (!isEmpty(response)) {
                    debugger
                    deferred.resolve();
                }
            }
            api.process(options);
            return deferred.promise();
        }
        $scope.search = function (myForm) {
            if (myForm.$valid) {
                $scope.showLoading();
                if ($rootScope.pageId){
                    $scope.fSettings.pageName = $rootScope.pageId
                    $scope.hideLoading();
                    $scope.saveSubscription().done(function () {
                        localStorage["fSettings"] = JSON.stringify($scope.fSettings);
                        $location.path('/main');
                        $scope.$apply();
                    });
                }
                else {
                    $scope.fSettings.pageName = $('#pages_value').val();
                    $.ajax({
                        url: 'https://graph.facebook.com/' + $scope.fSettings.pageName,
                        method:"GET"
                    }).done(function (data) {
                        $scope.hideLoading();
                     if (data.id) {
                         $scope.saveSubscription().done(function () {
                             localStorage["fSettings"] = JSON.stringify($scope.fSettings);
                             $location.path('/main');
                             $scope.$apply();
                         });
                        }
                    }).fail(function (data) {
                        $scope.hideLoading();
                        if (data.status && data.status == 404)
                            NativeBridge.alert("Please enter valid page name", null, "Warning", "Ok");
                        else
                        NativeBridge.alert("Please check network connectivity & try again later", null, "Warning", "Ok");
                    })
                }
            }
          
            else
                NativeBridge.alert("Invalid Search Settings, Please try again.", null, "Warning", "Ok");
           
        }
    };
})