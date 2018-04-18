var currUser = window.sessionStorage.getItem(CURRENT_USER);
/*if (!currUser) {
    window.location.href = "login.html";
}*/
var index = angular.module("index", []);
index.controller("topBarController", ["$scope", "$http", function ($scope, $http) {
    $scope.searchProduct = function () {
        window.location.href = "search.html?keyWord=" + $scope.searchKeyWord;
    };
}]);
index.controller("sideBarController", ["$scope", "$http", function ($scope, $http) {
}]);
index.controller("notificationController", ["$scope", "$http", function ($scope, $http) {
    $scope.refresh = function () {
        $http({
            method: "GET",
            url: BASE_URL + "/user/login.do",
        }).then(function successCallback(response) {
            console.log(response.data);
            if (response.flag == FLAG_SUCCESS) {
                var currentUser = JSON.stringify(response.data);
                sessionStorage.setItem(CURRENT_USER, currentUser);
                if ($scope.isRemember) {
                    Cookie.set(COOKIE_USERNAME, $scope.phoneOrEmail + ":" + $scope.password);
                }
                location.href = "index.html";
            } else if (response.flag = FLAG_FAIL) {
                swal(response.message);
            }

        }, function errorCallback(response) {
            swal("登录失败，系统出现错误，请稍后重试！")
        });
    };
    $scope.removeAll = function () {

    };
    $scope.removeItem = function () {

    };
    $scope.refresh();
}]);
