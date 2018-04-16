var register = angular.module("register", []);
register.controller("registerController", ["$scope", "$http", function ($scope, $http) {
    var schoolList = null;
    $scope.gender = "1";
    $http({
        method: "GET",
        url: BASE_URL + "/user/schoolList.do",
    }).then(function successCallback(response) {
        if (response.flag == FLAG_SUCCESS) {
            console.log(schoolList);
            schoolList = response.data;
        } else {
            swal("学校列表获取失败！")
        }
    }, function errorCallback(response) {
        swal("学校列表获取失败！")
    });
    if (schoolList != null) {
        $('#search').typeahead({source: schoolList});
    }
    $scope.register = function () {
        if (!$scope.realName || !$scope.gender || !$scope.identify || !$scope.studentId) {
            swal("输入信息不能为空！");
            return;
        }
        if (!$scope.school || !$scope.location || !$scope.email || !$scope.phone) {
            swal("输入信息不能为空！");
            return;
        }
        if (!$scope.password || !$scope.confirmPassword) {
            swal("输入信息不能为空！");
            return;
        }
        if ($scope.password.length < 8 || $scope.confirmPassword.length < 8) {
            swal("密码不能小于八位！");
        }
        if ($scope.password != $scope.confirmPassword) {
            swal("输入密码不一致！");
            return;
        }
        $http({
            method: "GET",
            url: BASE_URL + "/user/register.do?realName=" + $scope.realName + "&gender=" + $scope.gender + "&identify="
            + $scope.identify + "&studentId=" + $scope.stduentId + "&school=" + $scope.school
            + "&location=" + $scope.location + "&email=" + $scope.email + "&phone=" + $scope.phone
            + "&password=" + $scope.password,
        }).then(function successCallback(response) {
            console.log(response.data);
            if (response.flag == FLAG_SUCCESS) {
                swal("注册成功！")
            } else if (response.flag = FLAG_FAIL) {
                swal("注册失败，输入信息有误！")
            }

        }, function errorCallback(response) {
            swal("注册失败，系统出现错误，请稍后重试！")
        });
    };
}]);
