define(function () {
    return function ($scope,$rootScope) {
        //Getting static FB token from Server
        
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
                $scope.searchUrl = 'https://graph.facebook.com/search?access_token=' + response.FBToken + '&limit=4&type=page&fields=name,category,username,picture&q=';
                $scope.$apply();
            }
        }
        options.validData = function (response) {
            if (!isEmpty(response)) {
                $rootScope.FBToken = response.FBToken;
                $scope.searchUrl = 'https://graph.facebook.com/search?access_token=' + response.FBToken + '&limit=4&type=page&fields=name,category,username,picture&q=';
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
        $scope.change = function (_this) {
            if ($scope.fSettings.pageName.indexOf("Facebook.com") < 0)
            $scope.fSettings.pageName = "Facebook.com/" + $scope.fSettings.pageName;
        }

        $scope.search = function (myForm) {
            
            if (myForm.$valid) {
                if ($rootScope.pageId){
                $scope.fSettings.pageName = $rootScope.pageId
                localStorage["fSettings"] = JSON.stringify($scope.fSettings);
                var loc = $('html').injector().get('$location');
                loc.path("/main");

                }
                else
                    NativeBridge.alert("Please enter valid page name", null, "Warning", "Ok");
            }
          
            else
                NativeBridge.alert("Invalid Search Settings, Please try again.", null, "Warning", "Ok");
           
        }
    };
})