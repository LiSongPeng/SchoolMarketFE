// var currUser = window.sessionStorage.getItem(CURRENT_USER);
var currUser = {
    headImg: "/upload/head.png",
    name: "hello",
    id: "22222222222",
};
if (!currUser) {
    window.location.href = "login.html";
}
var index = angular.module("index", []);
index.controller("topBarController", ["$rootScope", "$scope", "$http", function ($rootScope, $scope, $http) {
    $rootScope.notifyNumber = 0;
    // $rootScope.currUser = JSON.parse(currUser);
    $rootScope.currUser = currUser;
    $rootScope.headImg = BASE_URL + $rootScope.currUser.headImg;
    $scope.searchProduct = function () {
        if (!$scope.searchKeyWord) {
            swal("搜索内容不能为空！")
            return;
        }
        window.sessionStorage.setItem(KEY_WORD, $scope.searchKeyWord);
        window.location.href = "search.html";
    };
    $http({
        method: "GET",
        url: BASE_URL + "/product/getProductCategory.do",
    }).then(function successCallback(response) {
        response = response.data;
        if (response.flag == FLAG_SUCCESS) {
            $scope.produtCategory = response.data;
        }
    }, function errorCallback(response) {
        swal("商品类别获取失败!");
    });
    $scope.changeCategory = function (id) {
        console.log("changeCategory to" + id);
    };
    $scope.getAllProduct = function () {
        console.log("get all ");
    };
    $scope.logOut = function () {
        $rootScope.currUser = null;
        window.sessionStorage.setItem(CURRENT_USER, null);
        window.location.href = "login.html";
    }
}]);
index.controller("sideBarController", ["$scope", "$http", function ($scope, $http) {
}]);
index.controller("notificationController", ["$rootScope", "$scope", "$http", function ($rootScope, $scope, $http) {
    $scope.refresh = function () {
        $http({
            method: "GET",
            url: BASE_URL + "/notify/getAll.do?userId=" + $rootScope.currUser.id,
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                $scope.hasNotification = true;
                $scope.notifications = response.data;
                $rootScope.notifyNumber = $scope.notifications.length;
            } else if (response.flag = FLAG_FAIL) {
                $scope.hasNotification = false;
                $rootScope.notifyNumber = 0;
            }

        }, function errorCallback(response) {
            swal("通知内容更新失败!");
            $scope.hasNotification = false;
            $rootScope.notifyNumber = 0;
        });
    };
    $scope.removeAll = function () {
        if ($rootScope.notifyNumber == 0) {
            return;
        }
        $http({
            method: "GET",
            url: BASE_URL + "/notify/deleteAll.do?userId=" + currUser.id,
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                $scope.notifications = [];
                $scope.hasNotification = false;
                $rootScope.notifyNumber = 0;
            } else if (response.flag = FLAG_FAIL) {
                swal("删除失败，请稍后重试！");
            }

        }, function errorCallback(response) {
            swal("网络异常，请稍后重试！");
            $rootScope.notifyNumber = 0;
        });
    };
    $scope.removeItem = function (id) {
        $http({
            method: "GET",
            url: BASE_URL + "/notify/delete.do?id=" + id,
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                var removeIndex = -1;
                for (var i = 0; i < $scope.notifications.length; i++) {
                    if ($scope.notifications[i].id == id) {
                        removeIndex = i;
                        break;
                    }
                }
                if (removeIndex != -1) {
                    $rootScope.notifyNumber = $scope.notifications.length - 1;
                    $scope.notifications = $scope.notifications.filter(function (value, index) {
                        return index != removeIndex;
                    });
                }
            } else if (response.flag = FLAG_FAIL) {
                swal("删除失败，请稍后重试！");
            }

        }, function errorCallback(response) {
            swal("网络异常，请稍后重试！");
        });
    };
    $scope.refresh();
}]);
