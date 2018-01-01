/**
 * 项目版本分产品复核
 */

define(['app', 'util', 'filters', 'directives'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('ReviewByProduct', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        function ($scope, $http, $templateCache, $compile, $state) {
            // 物品列表
            $scope.proList = [];
            // 显示过滤
            $scope.filter = '0';

            // 初始化
            $scope.init = function () {
                $scope.getProList();
            };

            // 获取物品列表
            $scope.getProList = function () {
                $.loading('加载中...');
                $http.get(rootUrl + 'Archive/InitProductInfoReview', {
                    params: {
                        id: $scope.ArchiveId,
                        filter: $scope.filter
                    }
                })
                .success(function (res) {
                    $.tlayer('close');
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.proList = res.Data;
                });
            };
            
            // 获取导出内容
            $scope.getExportContent = function () {
                return $http.get(rootUrl + 'Archive/ExportFileScope', {
                    params: {
                        id: $scope.ArchiveId
                    }
                })
                .success(function (res) {
                    if (res.State) {
                        $scope.exportModel = res.Data;
                    }
                });
            };
        }
    ]);
});