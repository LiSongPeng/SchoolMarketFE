var currUser = JSON.parse(window.sessionStorage.getItem(CURRENT_USER));
if (!currUser) {
    window.location.href = "login.html";
}
var product = angular.module("product", []);
product.controller("topBarController", ["$rootScope", "$scope", "$http", function ($rootScope, $scope, $http) {
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
product.controller("sideBarController", ["$scope", "$http", function ($scope, $http) {
}]);

product.controller("productController", ["$scope", "$http", function ($scope, $http) {
    $scope.updateProduct = function (product) {
        $scope.productPrice = product.price;
        $scope.productNumber = product.number;
        $scope.productId = product.id;
    };
    $scope.confirmUpdate = function () {
        if ($scope.productPrice <= 0) {
            swal("价格格式不正确！");
            return;
        }
        if ($scope.productNumber <= 0) {
            swal("库存格式不正确！");
            return;
        }
        $http({
            method: "GET",
            url: BASE_URL + "/product/updateProduct.do?productId=" + $scope.productId
            + "&number=" + $scope.productNumber + "&price=" + $scope.productPrice,
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                swal("商品信息更新成功！");
                $("#myModal").modal("hide");
                queryProduct(currUser.id, 10, $scope.pageInfo.pageNum, $scope.queryStatus);
            }
        }, function errorCallback(response) {
            swal("商品信息更新失败,请稍后重试!");
        });
    };
    $scope.shutdownComment = function (id) {
        $http({
            method: "GET",
            url: BASE_URL + "/product/shutdownComment.do?productId=" + id,
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                swal("评论功能关闭成功！");
                queryProduct(currUser.id, 10, $scope.pageInfo.pageNum, $scope.queryStatus);
            }
        }, function errorCallback(response) {
            swal("评论功能关闭失败,请稍后重试!");
        });
    };
    $scope.turnOnComment = function (id) {
        $http({
            method: "GET",
            url: BASE_URL + "/product/turnOnComment.do?productId=" + id,
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                swal("评论功能开启成功！");
                queryProduct(currUser.id, 10, $scope.pageInfo.pageNum, $scope.queryStatus);
            }
        }, function errorCallback(response) {
            swal("评论功能开启失败,请稍后重试!");
        });
    };
    $scope.soldOutProduct = function (id) {
        $http({
            method: "GET",
            url: BASE_URL + "/product/soldOutProduct.do?productId=" + id,
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                swal("下架成功！");
                queryProduct(currUser.id, 10, $scope.pageInfo.pageNum, $scope.queryStatus);
            }
        }, function errorCallback(response) {
            swal("下架失败,请稍后重试!");
        });
    };
    var queryProduct = function (userId, pageSize, pageNumber, status) {
        var url = BASE_URL + "/product/getByUserId.do";
        if (status && status < 4) {
            url = BASE_URL + "/product/getByUserIdAndStatus.do";
        }
        $http({
            method: "GET",
            url: url + "?userId=" + userId + "&pageSize=" + pageSize + "&pageNumber=" + pageNumber + "&status=" + status,
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                $scope.pageInfo = response.data;
                $scope.products = $scope.pageInfo.list;
                for (var i = 0; i < $scope.products.length; i++) {
                    var date = new Date($scope.products[i].releaseTime);
                    $scope.products[i].releaseTime = date.toLocaleDateString() + date.toLocaleTimeString();
                }
            }
        }, function errorCallback(response) {
            swal("商品信息获取失败!");
        });
    };
    $scope.next = function () {
        if ($scope.pageInfo.hasNextPage) {
            if ($scope.queryStatus != 4) {
                queryProduct(currUser.id, 10, $scope.pageInfo.pageNum + 1, $scope.queryStatus);
            } else {
                queryProduct(currUser.id, 10, $scope.pageInfo.pageNum + 1);
            }
        } else {
            swal("已经是最后一页！");
        }
    };
    $scope.previous = function () {
        if ($scope.pageInfo.hasPreviousPage) {
            if ($scope.queryStatus != 4) {
                queryProduct(currUser.id, 10, $scope.pageInfo.pageNum - 1, $scope.queryStatus);
            } else {
                queryProduct(currUser.id, 10, $scope.pageInfo.pageNum - 1);
            }
        } else {
            swal("已经是第一页！");
        }
    };
    $scope.queryByStatus = function () {
        queryProduct(currUser.id, 10, 1, $scope.queryStatus);
    };
    queryProduct(currUser.id, 10, 1);
    $scope.productDetail = function (productId) {
        window.sessionStorage.setItem(PRODUCT_DETAIL, productId);
        window.location.href = "productDetail.html";
    };
}]);

