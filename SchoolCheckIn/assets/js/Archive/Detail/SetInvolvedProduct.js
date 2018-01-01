/**
 * 项目版本涉及物品及硬件版本范围设置
 */

define(['app', 'util', 'filters', 'directives', 'ztree'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;
    var apiUrl = OP_CONFIG.apiUrl;

    app.controller('SetInvolvedProduct', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        function ($scope, $http, $templateCache, $compile, $state) {
            // 已选择产品列表
            $scope.proList = [];

            // 初始化
            $scope.init = function () {                
                $scope.getProList();
            };

            // 获取已有产品
            $scope.getProList = function () {
                $http.get(rootUrl + 'Product/GetProducts', {
                    params: {
                        id: $scope.ArchiveId,
                        isSubmited: false,
                        isReviewed:false
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.proList = res.Data;
                });
            };
        }
    ]);
});