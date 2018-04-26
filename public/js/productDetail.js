// var currUser = window.sessionStorage.getItem(CURRENT_USER);
var currUser = {
    headImg: "/upload/head.png",
    name: "hello",
    id: "c07455bc-d21a-490f-88f3-0401d1899998",
};
if (!currUser) {
    window.location.href = "login.html";
}

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
var productDetail = angular.module("productDetail", []);
productDetail.controller("productDetailController", ["$scope", "$http", "$sce", function ($scope, $http, $sce) {

    function jumpToIndex(info) {
        toastr.error(info);
        var timerId = window.setTimeout(function () {
            window.clearTimeout(timerId);
            window.location.href = "index.html";
        }, 1000);
    }

    var productId = window.sessionStorage.getItem(PRODUCT_DETAIL);
    if (!productId) {
        jumpToIndex("商品详细获取失败，跳转到首页！");
    }

    function initNormal(product) {
        $scope.showNormal = true;
        product.imga = BASE_URL + product.imga;
        product.imgb = BASE_URL + product.imgb;
        product.imgc = BASE_URL + product.imgc;
        product.imgd = BASE_URL + product.imgd;
        var date = new Date(product.releaseTime);
        product.releaseTime = date.toLocaleDateString() + date.toLocaleTimeString();
        $scope.product = product;
        var queryComment = function (pageSize, pageNumber) {
            var url = BASE_URL + "/product/queryComment.do";
            $http({
                method: "GET",
                url: url + "?pageSize=" + pageSize + "&pageNumber=" + pageNumber + "&productId=" + $scope.product.id,
            }).then(function successCallback(response) {
                response = response.data;
                if (response.flag == FLAG_SUCCESS) {
                    $scope.pageInfo = response.data;
                    for (var i = 0; i < response.data.list.length; i++) {
                        response.data.list[i].user.headImg = BASE_URL + response.data.list[i].user.headImg;
                    }
                    $scope.comments = response.data.list;
                }
            }, function errorCallback(response) {
                toastr.error("评论获取失败!");
            });
        };
        if ($scope.product.comment) {
            queryComment(6, 1);
        }
        $scope.next = function () {
            if ($scope.pageInfo.hasNextPage) {
                queryComment(6, $scope.pageInfo.pageNum + 1);
            } else {
                toastr.error("已经是最后一页!");
            }
        };
        $scope.previous = function () {
            if ($scope.pageInfo.hasPreviousPage) {
                queryComment(6, $scope.pageInfo.pageNum - 1);
            } else {
                toastr.error("已经是第一页!");
            }
        };
        $scope.showUserInfo = function (userId) {
            var url = BASE_URL + "/user/getById.do";
            $http({
                method: "GET",
                url: url + "?id=" + userId,
            }).then(function successCallback(response) {
                response = response.data;
                if (response.flag == FLAG_SUCCESS) {
                    var user = response.data;
                    user.headImg = BASE_URL + user.headImg;
                    $scope.user = user;
                    $('#myModal').modal('show');
                }
            }, function errorCallback(response) {
                toastr.error("获取用户信息失败!");
            });
        };
        $scope.addToCart = function () {
            $http({
                method: "GET",
                url: BASE_URL + "/shoppingCart/addShoppingCart.do?userId=" + currUser.id
                + "&productId=" + $scope.product.id + "&number=1",
            }).then(function successCallback(response) {
                response = response.data;
                if (response.flag == FLAG_SUCCESS) {
                    toastr.success("加入购物车成功!");
                }
            }, function errorCallback(response) {
                toastr.error("加入购物车失败!");
            });
        };
        $scope.comment = function () {
            var commentValue = $("#commentValue").val();
            if (!commentValue) {
                toastr.error("评论内容不能为空！");
                return;
            }
            var url = BASE_URL + "/product/comment.do";
            $http({
                method: "GET",
                url: url + "?userId=" + currUser.id + "&productId=" + $scope.product.id + "&content=" + commentValue,
            }).then(function successCallback(response) {
                response = response.data;
                if (response.flag == FLAG_SUCCESS) {
                    toastr.success("评论成功!");
                }
            }, function errorCallback(response) {
                toastr.error("评论失败!");
            });
        };
        $scope.trustDangerousSnippet = function (html) {
            return $sce.trustAsHtml(html);
        };
    }

    function initAuction() {
        $scope.showAuction = true;
    }

    $http({
        method: "GET",
        url: BASE_URL + "/product/getById.do?id=" + productId,
    }).then(function successCallback(response) {
        response = response.data;
        if (response.flag == FLAG_SUCCESS) {
            var product = response.data;
            if (product.status == 0) {//禁止销售
                jumpToIndex("商品已禁止销售，跳转到首页！");
            } else if (product.status == 2) {//审核中
                jumpToIndex("商品审核中，跳转到首页！");
            } else if (product.status == 3) {//已下架
                jumpToIndex("商品已下架，跳转到首页！");
            }
            if (product.type == 3) {//拍卖品
                initAuction(product);
            } else {
                initNormal(product);
            }
        } else {
            toastr.error("商品详细获取失败!");
        }
    }, function errorCallback(response) {
        toastr.error("商品详细获取失败!");
    });
}]).filter(
    'to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        }
    }]
);
