var currUser = JSON.parse(window.sessionStorage.getItem(CURRENT_USER));
if (!currUser) {
    window.location.href = "login.html";
}
var search = angular.module("search", []);
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
search.controller("searchController", ["$scope", "$http", function ($scope, $http) {
    // alert(sessionStorage.getItem(KEY_WORD));
    $scope.showProduct = false;
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
    var queryProduct = function (pageSize, pageNumber, keyWord, category) {
        if (keyWord == "") {
            toastr.error("关键字不能为空！");
            return;
        }
        var url = BASE_URL + "/product/getByKeyWord.do";
        if (category && category != 0) {
            url = BASE_URL + "/product/getByKeyWordAndCategory.do";
        }
        $http({
            method: "GET",
            url: url + "?pageSize=" + pageSize + "&pageNumber=" + pageNumber + "&keyWord=" + keyWord + "&category=" + category,
        }).then(function successCallback(response) {
            response = response.data;
            if (response.flag == FLAG_SUCCESS) {
                $scope.pageInfo = response.data;
                $scope.products = response.data.list;
                for (var i = 0; i < $scope.products.length; i++) {
                    $scope.products[i].imga = BASE_URL + $scope.products[i].imga;
                }
                $scope.showProduct = true;
            }
        }, function errorCallback(response) {
            toastr.error("商品获取失败!");
        });
    };
    $scope.next = function () {
        if ($scope.pageInfo.hasNextPage) {
            queryProduct(8, $scope.pageInfo.pageNum + 1, $scope.keyWord, $scope.productCategory);
        } else {
            toastr.error("已经是最后一页!");
        }
    };
    $scope.previous = function () {
        if ($scope.pageInfo.hasPreviousPage) {
            queryProduct(8, $scope.pageInfo.pageNum - 1, $scope.keyWord, $scope.productCategory);
        } else {
            toastr.error("已经是第一页!");
        }
    };
    $scope.search = function () {
        queryProduct(8, 1, $scope.keyWord, $scope.productCategory);
    };
    $scope.productDetail = function (productId) {
        window.sessionStorage.setItem(PRODUCT_DETAIL, productId);
        window.parent.location.href = "productDetail.html";
    };
    if (sessionStorage.getItem(KEY_WORD) != null && sessionStorage.getItem(KEY_WORD) != "") {
        $scope.keyWord = sessionStorage.getItem(KEY_WORD);
        $scope.search();
    } else {
        $scope.keyWord = "";
    }
}]);

