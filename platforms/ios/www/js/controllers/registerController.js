define(function () {
    return function ($scope) {
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
                if ($scope.fSettings.pageName.indexOf("k.com/")>0)
                $scope.fSettings.pageName = $scope.fSettings.pageName.substring($scope.fSettings.pageName.indexOf("k.com/") + 6, $scope.fSettings.pageName.length)
                localStorage["fSettings"] = JSON.stringify($scope.fSettings);
                var loc = $('html').injector().get('$location');
                loc.path("/main");
            }
            else
                NativeBridge.alert("Invalid Search Settings, Please try again.", null, "Warning", "Ok");
           
        }
    };
})