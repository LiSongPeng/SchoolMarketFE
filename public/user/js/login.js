var login = angular.module("login", []);
login.controller("loginController", ["$scope", "$http", function ($scope, $http) {
    var cookieString = Cookie.get(COOKIE_USERNAME);
    if (cookieString) {
        $scope.phoneOrEmail = cookieString.split(":")[0];
        $scope.password = cookieString.split(":")[1];
        $scope.isRemember = true;
    }
    $scope.login = function () {
        console.log($scope.phoneOrEmail + "L" + $scope.password);
        if (!$scope.phoneOrEmail || !$scope.password) {
            swal("输入信息不能为空！");
            return;
        }
        $http({
            method: "GET",
            url: BASE_URL + "/user/login.do?phoneOrEmail=" + $scope.phoneOrEmail + "&password=" + $scope.password,
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
                swal("登录失败，输入信息有误！")
            }

        }, function errorCallback(response) {
            swal("登录失败，系统出现错误，请稍后重试！")
        });
    };
}]);