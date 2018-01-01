/**
 * 分文件复核
 */

define(['app', 'util', 'filters', 'directives', 'services'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('ReviewByFileCategoryDetail', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        'tlayer',
        'tool',
        function ($scope, $http, $templateCache, $compile, $state, tlayer, tool) {
            // 文件信息
            $scope.file = null;
            // 文件适用产品范围列表
            $scope.proList = [];
            // 过滤器
            $scope.proFilter = '6';

            // 初始化
            $scope.init = function () {
                $http.get(rootUrl + 'Archive/GetFileInfoById', {
                    params: {
                        id: $scope.ArchiveId,
                        fileId: $state.params.FileId
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.file = res.Data;
                });
                $scope.getProList();
            };

            // 获取文件适用产品范围列表
            $scope.getProList = function () {
                $.loading('加载中...');
                $http.get(rootUrl + 'Archive/GetProductAssignReview', {
                    params: {
                        id: $scope.ArchiveId,
                        fileId: $state.params.FileId,
                        filter: $scope.proFilter
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
            
            // 全选/取消全选产品
            $scope.checkAll = function (checked) {
                angular.forEach($scope.proList, function (item) {
                    item.IsChecked = checked;
                });
            };

            // 复核
            $scope.review = function (state) {
                var idList = [];
                $scope.desc = '';

                angular.forEach($scope.proList, function (item) {
                    if (item.IsChecked) {
                        idList.push(item.Id);
                    }
                });
                if (!idList.length) {
                    alert('请勾选产品');
                    return;
                }
                tlayer.content({
                    header: '复核说明',
                    html: $templateCache.get('layer-desc.html'),
                    scope: $scope,
                    submit: function (ins) {
                        $.loading('操作中...');
                        $http.post(rootUrl + 'Archive/ReviewArchive' + state, {
                            id: $scope.ArchiveId,
                            assignIds: idList.join(','),
                            reviewDesc: $scope.desc
                        })
                        .success(function (res) {
                            $.tlayer('close');
                            if (!res.State) {
                                $.tips('操作失败：' + res.Msg, 1);
                                return;
                            }
                            $scope.IsCheckedAll = false;
                            $scope.getProList();
                        });
                    }
                });
            };
        }
    ]);
});