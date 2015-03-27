define(function () {
    return function ($scope) {
        $scope.isDescriptionShown=false;
        $scope.toggleDescription = function () {
            $scope.isDescriptionShown = !$scope.isDescriptionShown;
        }
        $scope.fSettings = JSON.parse(localStorage["fSettings"]);
            var options = {};
            options.status = api.SYNC;
            options.request = {};
            options.request.url = $scope.baseUrl + $scope.fSettings.pageName;
            options.request.type = "GET";
            options.request.dataType = "json";
            options.method = "get_pageInfo"
            options.localData = function (data) {
                if (!isEmpty(data)) {
                    $scope.pageInfo = data;
                    $scope.$apply();
                }
            }
            options.validData = function (data) {
                if (!isEmpty(data)) {
                    $scope.pageInfo = data;
                    $scope.$apply();
                }
            }
            api.process(options);

    };
})