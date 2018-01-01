/**
 * 项目版本归档
 */

define(['app', 'util', 'filters', 'directives'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('Archive', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        'tlayer',
        'tool',
        function ($scope, $http, $templateCache, $compile, $state, tlayer, tool) {
            // 视图类型
            $scope.viewType = 'FileCategory';
            // 分文件类别归档列表
            $scope.assignByFileCategoryList = [];
            // 分产品归档列表
            $scope.assignByProductList = [];

            // 初始化
            $scope.init = function () {
                $scope.getArchiveAssignList();
            };

            // 获取归档列表
            $scope.getArchiveAssignList = function () {
                if ($scope.viewType === 'FileCategory') {
                    $http.get(rootUrl + 'Archive/InitArchiveAssignByFileDetail', {
                        params: {
                            id: $scope.ArchiveId
                        }
                    })
                    .success(function (res) {
                        if (!res.State) {
                            $.tips('出错了：' + res.Msg, 1);
                            return;
                        }
                        $scope.assignByFileCategoryList = res.Data;
                    });
                } else {
                    $http.get(rootUrl + 'Archive/InitArchiveAssignByProductDetail', {
                        params: {
                            id: $scope.ArchiveId
                        }
                    })
                    .success(function (res) {
                        if (!res.State) {
                            $.tips('出错了：' + res.Msg, 1);
                            return;
                        }
                        $scope.assignByProductList = res.Data;
                    });
                }
            };

            // 设置视图类型
            $scope.setViewType = function (type) {
                $scope.viewType = type;
                $scope.editUrl = $scope.createUrl + '#ArchiveBy' + type;
                $scope.getArchiveAssignList();
            };

            // 查看文件适用产品
            $scope.viewAssignProList = function (proList) {
                $scope.assignProList = proList;
                $.content({
                    header: '适用产品',
                    content: {
                        width: 1000,
                        html: $templateCache.get('layer-viewAssignProList.html')
                    },
                    onInit: function () {
                        $compile(this)($scope);
                        $scope.$apply();
                    }
                });
            };

            // 查看产品配套文件
            $scope.viewAssignFileList = function (fileList) {
                $scope.assignFileList = fileList;
                $.content({
                    header: '配套文件',
                    content: {
                        width: 1200,
                        html: $templateCache.get('layer-viewAssignFileList.html')
                    },
                    onInit: function () {
                        $compile(this)($scope);
                        $scope.$apply();
                    }
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