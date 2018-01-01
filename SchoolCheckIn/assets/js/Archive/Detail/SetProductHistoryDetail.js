/**
 * 物品历史硬件版本处理方式清理
 */

define(['app', 'util', 'filters', 'directives'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('SetProductHistoryDetail', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        '$q',
        'tlayer',
        function ($scope, $http, $templateCache, $compile, $state, $q, tlayer) {
            // 历史版本列表
            $scope.historyList = [];

            // 初始化
            $scope.init = function () {
                $scope.getHistoryList();
            };

            // 获取物品硬件版本处理方式历史列表
            $scope.getHistoryList = function () {
                $http.get(rootUrl + 'Product/GetProductHistory', {
                    params: {
                        id: $scope.ArchiveId,
                        itemNumber: $state.params.ItemNumber
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.historyList = res.Data;
                });
            };
        }
    ]);
});