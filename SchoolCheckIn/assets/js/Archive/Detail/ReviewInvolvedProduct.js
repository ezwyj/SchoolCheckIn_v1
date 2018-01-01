/**
 * 项目版本涉及物品及硬件版本范围复核
 */

define(['app', 'util', 'filters', 'directives'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;
    
    app.controller('ReviewInvolvedProduct', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        function ($scope, $http, $templateCache, $compile, $state) {
            // 产品列表
            $scope.proList = [];            

            // 初始化
            $scope.init = function () {
                $scope.getProList();
            };

            // 获取产品列表
            $scope.getProList = function () {
                $http.get(rootUrl + 'Product/GetProductsReview', {
                    params: {
                        id: $scope.ArchiveId
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('获取产品失败：' + res.Msg, 1);
                        return;
                    }
                    $scope.proList = res.Data;
                });
            };
        }
    ]);
});