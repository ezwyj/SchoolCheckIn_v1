/**
 * 项目版本涉及物品适用范围复核
 */

define(['app', 'util', 'filters', 'directives', 'ztree'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;
    var apiUrl = OP_CONFIG.apiUrl;

    app.controller('ReviewProductApplication', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        function ($scope, $http, $templateCache, $compile, $state) {
            // 产品列表
            $scope.proList = [];
            // 筛选条件
            $scope.filter = '0';
                        
            // 初始化
            $scope.init = function () {
                $scope.getProList();
            };

            // 获取产品列表
            $scope.getProList = function () {
                $http.get(rootUrl + 'Product/GetProductListWithApplicable', {
                    params: {
                        id: $scope.ArchiveId,
                        filter: $scope.filter
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