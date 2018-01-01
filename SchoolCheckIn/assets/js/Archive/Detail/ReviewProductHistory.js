/**
 * 项目版本涉及物品版本属性复核
 */

define(['app', 'util', 'filters', 'directives'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('ReviewProductHistory', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        'tlayer',
        'tool',
        function ($scope, $http, $templateCache, $compile, $state, tlayer, tool) {
            // 产品列表
            $scope.proList = [];
            // 筛选条件
            $scope.filter = '0';

            // 初始化
            $scope.init = function () {
                $scope.getProList();
            };

            // 已选择产品列表
            $scope.getProList = function () {
                $http.get(rootUrl + 'Product/GetProductListWithHistory', {
                    params: {
                        id: $scope.ArchiveId,
                        filter: $scope.filter,
                        isSubmited: true
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