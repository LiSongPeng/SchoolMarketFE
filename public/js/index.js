var index = angular.module("index", []);
index.controller("topBarController", ["$scope", "$http", function ($scope, $http) {
    $scope.searchProduct = function () {
        alert("开始搜索:" + $scope.searchKeyWord);
    };
}]);
index.controller("sideBarController", ["$scope", "$http", function ($scope, $http) {
}]);
index.controller("notificationController", ["$scope", "$http", function ($scope, $http) {
}]);
