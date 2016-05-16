define(function () {
    return function ($scope, $rootScope) {
        $scope.baseUrl = "https://graph.facebook.com/";
        $scope.openUrl = function () {
            NativeBridge.openUrl("http://www.egirna.com/", '_system', undefined);
        }
        $rootScope.pageId = null;
        $scope.save = function (myForm) {
            if (myForm.$valid) {
                $scope.showLoading();
                if ($rootScope.pageId) {
                    $scope.fSettings.pageName = $rootScope.pageId
                    $scope.hideLoading();
                    $rootScope.saveSubscription().done(function () {
                        localStorage["fSettings"] = JSON.stringify($scope.fSettings);
                        NativeBridge.toastshort("Your Settings have saved successfully")
                        $scope.$apply();
                    });
                }
                else {
                    $scope.fSettings.pageName = $('#pages_value').val();
                    $.ajax({
                        url: 'https://graph.facebook.com/' + $scope.fSettings.pageName,
                        method: "GET"
                    }).done(function (data) {
                        $scope.hideLoading();
                        if (data.id) {
                            $scope.saveSubscription().done(function () {
                                localStorage["fSettings"] = JSON.stringify($scope.fSettings);
                                NativeBridge.toastshort("Your Settings have saved successfully")
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