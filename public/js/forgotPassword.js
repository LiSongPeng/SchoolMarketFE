var forgotPassword = angular.module("forgotPassword", []);
forgotPassword.controller("forgotPasswordController", ["$scope", "$http", function ($scope, $http) {
    $scope.findPassword = function () {
        if (!$scope.phoneOrEmail || !$scope.identify) {
            swal("输入信息不能为空！");
            return;
        }
        $http({
            method: "GET",
            url: BASE_URL + "/user/forgot.do?phoneOrEmail=" + $scope.phoneOrEmail + "&identify=" + $scope.identify,
        }).then(function successCallback(response) {
            if (response.flag == FLAG_SUCCESS) {
                swal("您的密码是：" + response.data);
            } else if (response.flag = FLAG_FAIL) {
                swal("找回失败，输入信息有误！")
            }

        }, function errorCallback(response) {
            swal("找回失败，系统出现错误，请稍后重试！")
        });
    };
}]);

