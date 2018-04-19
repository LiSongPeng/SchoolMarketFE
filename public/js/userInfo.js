// var currUser = window.sessionStorage.getItem(CURRENT_USER);
var currUser = {
    name: "hello",
    id: "234234324234",
    location: "heeee",
    email: "143432@qq.com",
    phone: "15510841744",
    password: "12345566666",
};
if (!currUser) {
    window.location.href = "login.html";
}
var userInfo = angular.module("userInfo", []);
userInfo.controller("userInfoController", ["$scope", "$http", function ($scope, $http) {
    $scope.reset = function () {
        $scope.location = currUser.location;
        $scope.email = currUser.email;
        $scope.phone = currUser.phone;
        $scope.password = currUser.password;
        $scope.confirmPassword = currUser.password;
    };
    $scope.confirmUpdate = function () {
        var phoneReg = /^1[34578]\d{9}$/;
        var emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        var passwordReg = /^([A-Z]|[a-z]|[0-9]){8,20}$/;
        if (!phoneReg.test($scope.phone)) {
            swal("手机号格式错误！");
            return;
        }
        if (!emailReg.test($scope.email)) {
            swal("邮箱格式错误！");
            return;
        }
        if (!passwordReg.test($scope.password)) {
            swal("密码必须由大于8位小于20位的字母或数字组成！");
            return;
        }
        if ($scope.password != $scope.confirmPassword) {
            swal("密码前后输入不一致！");
            return;
        }
        $http({
            method: "GET",
            url: BASE_URL + "/user/update.do?id=" + currUser.id + "&email=" + $scope.email
            + "&phone=" + $scope.phone + "&location=" + $scope.location + "&password=" + $scope.password,
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                swal("用户信息修改成功！")
            } else {
                swal("用户信息修改失败！")
            }
        }, function errorCallback(response) {
            swal("网络错误,请稍后重试!");
        });
    };
    $scope.reset();
}]);
