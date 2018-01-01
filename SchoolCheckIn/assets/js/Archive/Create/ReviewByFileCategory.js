/**
 * 项目版本分文件类别复核
 */

define(['app', 'util', 'filters', 'directives'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('ReviewByFileCategory', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        function ($scope, $http, $templateCache, $compile, $state) {
            // 文件列表
            $scope.fileList = [];
            // 显示过滤
            $scope.filter = '0';

            // 初始化
            $scope.init = function () {
                $scope.getFileList();
            };

            // 获取文件列表
            $scope.getFileList = function () {
                $.loading('加载中...');
                $http.get(rootUrl + 'Archive/InitArchiveReview', {
                    params: {
                        id: $scope.ArchiveId,
                        filter: $scope.filter
                    }
                })
                .success(function (res) {
                    $.tlayer('close');
                    if (!res.State) {
                        $.tips('获取文件失败');
                        return;
                    }
                    $scope.fileList = res.Data;
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