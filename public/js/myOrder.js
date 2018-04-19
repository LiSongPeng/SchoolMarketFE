// var currUser = window.sessionStorage.getItem(CURRENT_USER);
var currUser = {
    headImg: "/upload/head.png",
    name: "hello",
    id: "22222222222",
};
if (!currUser) {
    window.location.href = "login.html";
}
var index = angular.module("order", []);
index.controller("orderController", ["$scope", "$http", function ($scope, $http) {
    $scope.confirmReceive = function (id) {
        $http({
            method: "GET",
            url: BASE_URL + "/order/confirmFinished.do?orderId=" + id,
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                swal("确认收货完成！");
                queryOrder(currUser.id, 10, $scope.pageInfo.pageNum, $scope.queryStatus);
            }
        }, function errorCallback(response) {
            swal("确认收货失败,请稍后重试!");
        });
    };
    var queryOrder = function (userId, pageSize, pageNumber, status) {
        var url = BASE_URL + "/order/queryByUserId.do";
        if (status && status > 0) {
            url = BASE_URL + "/order/queryByUserIdAndStatus.do";
        }
        $http({
            method: "GET",
            url: url + "?userId=" + userId + "&pageSize=" + pageSize + "&pageNumber=" + pageNumber + "&status=" + status,
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                $scope.pageInfo = response.data;
                $scope.orders = $scope.pageInfo.list;
                for (var i = 0; i < $scope.orders.length; i++) {
                    var date = new Date($scope.orders[i].orderTime);
                    $scope.orders[i].orderTime = date.toLocaleDateString() + date.toLocaleTimeString();
                    date = new Date($scope.orders[i].finishTime);
                    $scope.orders[i].finishTime = date.toLocaleDateString() + date.toLocaleTimeString();
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
