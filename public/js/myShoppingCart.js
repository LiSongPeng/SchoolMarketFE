var currUser = JSON.parse(window.sessionStorage.getItem(CURRENT_USER));
if (!currUser) {
    window.location.href = "login.html";
}
var shoppingCart = angular.module("shoppingCart", []);
shoppingCart.controller("topBarController", ["$rootScope", "$scope", "$http", function ($rootScope, $scope, $http) {
    $rootScope.notifyNumber = 0;
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
shoppingCart.controller("sideBarController", ["$scope", "$http", function ($scope, $http) {
}]);

shoppingCart.controller("shoppingCartController", ["$scope", "$http", function ($scope, $http) {
    $scope.removeItem = function (id) {
        $http({
            method: "GET",
            url: BASE_URL + "/shoppingCart/removeShoppingCart.do?id=" + id,
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                var removeIndex = -1;
                for (var i = 0; i < $scope.shoppingCart.length; i++) {
                    if ($scope.shoppingCart[i].id == id) {
                        removeIndex = i;
                    }
                }
                if (removeIndex != -1) {
                    $scope.shoppingCart = $scope.shoppingCart.filter(function (value, index) {
                        return index != removeIndex;
                    });
                }
                swal("移除成功！");
            }
        }, function errorCallback(response) {
            swal("移除失败,请稍后重试!");
        });
    };
    var queryShoppingCart = function (userId, pageSize, pageNumber) {
        var url = BASE_URL + "/shoppingCart/queryShoppingCartByUserId.do";
        $http({
            method: "GET",
            url: url + "?userId=" + userId + "&pageSize=" + pageSize + "&pageNumber=" + pageNumber,
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                $scope.pageInfo = response.data;
                $scope.shoppingCart = $scope.pageInfo.list;
                for (var i = 0; i < $scope.shoppingCart.length; i++) {
                    var date = new Date($scope.shoppingCart[i].addTime);
                    $scope.shoppingCart[i].addTime = date.toLocaleDateString() + date.toLocaleTimeString();
                    $scope.shoppingCart[i].product.imga = BASE_URL + $scope.shoppingCart[i].product.imga;
                }
            }
        }, function errorCallback(response) {
            swal("购物车列表获取失败!");
        });
    };
    $scope.next = function () {
        if ($scope.pageInfo.hasNextPage) {
            queryShoppingCart(currUser.id, 5, $scope.pageInfo.pageNum + 1);
        } else {
            swal("已经是最后一页！");
        }
    };
    $scope.previous = function () {
        if ($scope.pageInfo.hasPreviousPage) {
            queryShoppingCart(currUser.id, 5, $scope.pageInfo.pageNum - 1);
        } else {
            swal("已经是第一页！");
        }
    };

    function updateNum(id, number) {
        $http({
            method: "GET",
            url: BASE_URL + "/shoppingCart/updateNumber.do?id=" + id + "&number=" + number,
        }).then(function successCallback(response) {
        }, function errorCallback(response) {
        });
    }

    $scope.minus = function (item) {
        if (item.number == 1) {
            swal("格式不正确！");
            return;
        }
        updateNum(item.id, item.number - 1);
        item.number = item.number - 1;
    };
    $scope.plus = function (item) {
        updateNum(item.id, item.number + 1);
        item.number = item.number + 1;
    };
    queryShoppingCart(currUser.id, 5, 1);
    $scope.productDetail = function (productId) {
        window.sessionStorage.setItem(PRODUCT_DETAIL, productId);
        window.location.href = "productDetail.html";
    };
    $scope.balance = function (item) {
        $scope.balanceItem = item;
        $http({
            method: "GET",
            url: BASE_URL + "/product/getById.do?id=" + item.product.id,
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                var product = response.data;
                var publisher = product.publisher;
                publisher.headImg = BASE_URL + publisher.headImg;
                publisher.alipay = BASE_URL + publisher.alipay;
                $scope.seller = publisher;
                $scope.totalPrice = product.price * item.number;
            } else {
                swal("卖家信息获取失败,请稍后重试!");
            }
        }, function errorCallback(response) {
            swal("卖家信息获取失败,请稍后重试!");
        });
    };
    $scope.confirmPay = function () {
        $http({
            method: "GET",
            url: BASE_URL + "/order/order.do?number=" + $scope.balanceItem.number
            + "&userId=" + currUser.id + "&productId=" + $scope.balanceItem.product.id + "&targetId=" + $scope.seller.id,
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                $http({
                    method: "GET",
                    url: BASE_URL + "/shoppingCart/removeShoppingCart.do?id=" + $scope.balanceItem.id,
                }).then(function successCallback(response) {
                    $scope.pageInfo.pageNum = 0;
                }, function errorCallback(response) {
                });
                var removeIndex = -1;
                for (var i = 0; i < $scope.shoppingCart.length; i++) {
                    if ($scope.shoppingCart[i].id == $scope.balanceItem.id) {
                        removeIndex = i;
                    }
                }
                if (removeIndex != -1) {
                    $scope.shoppingCart = $scope.shoppingCart.filter(function (value, index) {
                        return index != removeIndex;
                    });
                }
                swal("结算成功！");
            } else {
                swal("结算失败,请稍后重试!");
            }
        }, function errorCallback(response) {
            swal("结算失败,请稍后重试!");
        });
    };
}]);
