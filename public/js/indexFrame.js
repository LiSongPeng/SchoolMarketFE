var currUser = JSON.parse(window.sessionStorage.getItem(CURRENT_USER));
var indexFrame = angular.module("indexFrame", []);
toastr.options = {
    closeButton: false,
    debug: false,
    positionClass: "toast-bottom-right",
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "2000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
};
indexFrame.controller("productController", ["$scope", "$http", function ($scope, $http) {
    $http({
        method: "GET",
        url: BASE_URL + "/product/getProductCategory.do",
    }).then(function successCallback(response) {
        response = response.data;
        if (response.flag == FLAG_SUCCESS) {
            $scope.categorys = response.data;
        }
    }, function errorCallback(response) {
        toastr.error("商品类别获取失败!");
    });
    $scope.addToCart = function (product) {
        $http({
            method: "GET",
            url: BASE_URL + "/shoppingCart/addShoppingCart.do?userId=" + currUser.id
            + "&productId=" + product.id + "&number=1",
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                toastr.success("加入购物车成功!");
            }
        }, function errorCallback(response) {
            toastr.error("加入购物车失败!");
        });
    };
    var queryProduct = function (pageSize, pageNumber, category) {
        var url = BASE_URL + "/product/getAllProduct.do";
        if (category && category != 0) {
            url = BASE_URL + "/product/getByCategory.do";
        }
        $http({
            method: "GET",
            url: url + "?pageSize=" + pageSize + "&pageNumber=" + pageNumber + "&category=" + category,
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                $scope.pageInfo = response.data;
                $scope.products = response.data.list;
                for (var i = 0; i < $scope.products.length; i++) {
                    $scope.products[i].imga = BASE_URL + $scope.products[i].imga;
                }
            }
        }, function errorCallback(response) {
            toastr.error("商品获取失败!");
        });
    };
    $scope.next = function () {
        if ($scope.pageInfo.hasNextPage) {
            if ($scope.productCategory != 0) {
                queryProduct(8, $scope.pageInfo.pageNum + 1, $scope.productCategory);
            } else {
                queryProduct(8, $scope.pageInfo.pageNum + 1);
            }
        } else {
            toastr.error("已经是最后一页!");
        }
    };
    $scope.previous = function () {
        if ($scope.pageInfo.hasPreviousPage) {
            if ($scope.productCategory != 0) {
                queryProduct(8, $scope.pageInfo.pageNum - 1, $scope.productCategory);
            } else {
                queryProduct(8, $scope.pageInfo.pageNum - 1);
            }
        } else {
            toastr.error("已经是第一页!");
        }
    };
    $scope.queryByCategory = function () {
        queryProduct(8, 1, $scope.productCategory);
    };
    queryProduct(8, 1);
    $scope.productDetail = function (productId) {
        window.sessionStorage.setItem(PRODUCT_DETAIL, productId);
        window.parent.location.href = "productDetail.html";
    };
}]);
