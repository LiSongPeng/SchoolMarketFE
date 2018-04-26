var currUser = JSON.parse(window.sessionStorage.getItem(CURRENT_USER));
if (!currUser) {
    window.location.href = "login.html";
}
var publishProduct = angular.module("publishProduct", []);
publishProduct.controller("publishProductController", ["$scope", "$http", "$sce", function ($scope, $http, $sce) {
    $scope.action = $sce.trustAsResourceUrl(BASE_URL + "/product/addProduct.do");
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
    $scope.userId = currUser.id;
}]);
