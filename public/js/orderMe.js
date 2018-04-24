// var currUser = window.sessionStorage.getItem(CURRENT_USER);
var currUser = {
    headImg: "/upload/head.png",
    name: "hello",
    id: "234234324234",
};
if (!currUser) {
    window.location.href = "login.html";
}
var order = angular.module("order", []);
order.controller("topBarController", ["$rootScope", "$scope", "$http", function ($rootScope, $scope, $http) {
    $rootScope.notifyNumber = 0;
    // $rootScope.currUser = JSON.parse(currUser);
    $rootScope.currUser = currUser;
    $rootScope.headImg = BASE_URL + $rootScope.currUser.headImg;
    $scope.searchProduct = function () {
        if (!$scope.searchKeyWord) {
            swal("搜索内容不能为空！");
            return;
        }
        window.sessionStorage.setItem(KEY_WORD, $scope.searchKeyWord);
        window.location.href = "search.html";
    };
    jQuery('#searchbox').typeahead({
        source: function (keyWord, process) {
            $.ajax({
                type: "GET",
                url: BASE_URL + "/product/getNamesByKeyWord.do",
                data: {"keyWord": keyWord},
                dataType: "json",
                success: function (response) {
                    process(response.data);
                }
            });
        },
        updater: function (item) {
            return item.replace(/<a(.+?)<\/a>/, ""); //这里一定要return，否则选中不显示
        },
        items: 6, //显示6条
        delay: 500 //延迟时间
    });
    $scope.logOut = function () {
        $rootScope.currUser = null;
        window.sessionStorage.setItem(CURRENT_USER, null);
        window.location.href = "login.html";
    }
}]);
order.controller("sideBarController", ["$scope", "$http", function ($scope, $http) {
}]);

order.controller("orderController", ["$scope", "$http", function ($scope, $http) {
    $scope.confirmSend = function (id) {
        $http({
            method: "GET",
            url: BASE_URL + "/order/confirmDispatching.do?orderId=" + id,
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                swal("确认派送完成！");
                queryOrder(currUser.id, 10, $scope.pageInfo.pageNum, $scope.queryStatus);
            }
        }, function errorCallback(response) {
            swal("确认派送失败,请稍后重试!");
        });
    };
    var queryOrder = function (targetId, pageSize, pageNumber, status) {
        var url = BASE_URL + "/order/queryByTargetId.do";
        if (status && status > 0) {
            url = BASE_URL + "/order/queryByTargetIdAndStatus.do";
        }
        $http({
            method: "GET",
            url: url + "?targetId=" + targetId + "&pageSize=" + pageSize + "&pageNumber=" + pageNumber + "&status=" + status,
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                $scope.pageInfo = response.data;
                $scope.orders = $scope.pageInfo.list;
                for (var i = 0; i < $scope.orders.length; i++) {
                    var date = new Date($scope.orders[i].orderTime);
                    $scope.orders[i].orderTime = date.toLocaleDateString() + date.toLocaleTimeString();
                    date = new Date($scope.orders[i].finishTime);
                    if ($scope.orders[i].finishTime != null) {
                        $scope.orders[i].finishTime = date.toLocaleDateString() + date.toLocaleTimeString();
                    } else {
                        $scope.orders[i].finishTime = "未完成";
                    }
                }
            }
        }, function errorCallback(response) {
            swal("订单获取失败!");
        });
    };
    $scope.next = function () {
        if ($scope.pageInfo.hasNextPage) {
            if ($scope.queryStatus != 0) {
                queryOrder(currUser.id, 10, $scope.pageInfo.pageNum + 1, $scope.queryStatus);
            } else {
                queryOrder(currUser.id, 10, $scope.pageInfo.pageNum + 1);
            }
        } else {
            swal("已经是最后一页！");
        }
    };
    $scope.previous = function () {
        if ($scope.pageInfo.hasPreviousPage) {
            if ($scope.queryStatus != 0) {
                queryOrder(currUser.id, 10, $scope.pageInfo.pageNum - 1, $scope.queryStatus);
            } else {
                queryOrder(currUser.id, 10, $scope.pageInfo.pageNum - 1);
            }
        } else {
            swal("已经是第一页！");
        }
    };
    $scope.queryByStatus = function () {
        queryOrder(currUser.id, 10, 1, $scope.queryStatus);
    };
    queryOrder(currUser.id, 10, 1);
    $scope.productDetail = function (productId) {
        window.sessionStorage.setItem(PRODUCT_DETAIL, productId);
        window.location.href = "productDetail.html";
    };
}]);

