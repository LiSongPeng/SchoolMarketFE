var login = angular.module("login", []);
toastr.options = {
    closeButton: false,
    debug: false,
    positionClass: "toast-top-center",
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "2000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
};
login.controller("loginController", ["$scope", "$http", function ($scope, $http) {
    var cookieString = Cookie.get(COOKIE_USERNAME);
    if (cookieString) {
        $scope.phoneOrEmail = cookieString.split(":")[0];
        $scope.password = cookieString.split(":")[1];
        $scope.isRemember = true;
    } else {
        $scope.isRemember = false;
    }
    $scope.login = function () {
        if (!$scope.phoneOrEmail || !$scope.password) {
            toastr.error("输入信息不能为空！");
            return;
        }
        $http({
            method: "GET",
            url: BASE_URL + "/user/login.do?phoneOrEmail=" + $scope.phoneOrEmail + "&password=" + $scope.password,
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                var currentUser = response.data;
                sessionStorage.setItem(CURRENT_USER, currentUser);
                if ($scope.isRemember) {
                    Cookie.set(COOKIE_USERNAME, $scope.phoneOrEmail + ":" + $scope.password);
                } else {
                    Cookie.remove(COOKIE_USERNAME);
                }
                toastr.success("登录成功，正在跳转至首页！");
                var timerId = window.setTimeout(function () {
                    window.clearTimeout(timerId);
                    window.location.href = "index.html";
                }, 1000);
            } else if (response.flag = FLAG_FAIL) {
                toastr.error(response.message);
            }

        }, function errorCallback(response) {
            toastr.error("登录失败，系统出现错误，请稍后重试！")
        });
    };
}]);