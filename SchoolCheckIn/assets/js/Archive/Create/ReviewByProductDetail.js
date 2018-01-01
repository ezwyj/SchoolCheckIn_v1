/**
 * 分产品复核详情
 */

define(['app', 'util', 'filters', 'directives', 'services'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('ReviewByProductDetail', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        'tlayer',
        'tool',
        function ($scope, $http, $templateCache, $compile, $state, tlayer, tool) {
            // 物品信息
            $scope.pro = null;
            // 配套文件列表
            $scope.fileList = [];
            // 过滤器
            $scope.fileFilter = '6';

            // 初始化
            $scope.init = function () {
                $http.get(rootUrl + 'Archive/GetSingleProductInfo', {
                    params: {
                        id: $scope.ArchiveId,
                        productId: $state.params.ProductId
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.pro = res.Data;
                });
                $scope.getFileList();
            };

            // 获取配套文件列表
            $scope.getFileList = function () {
                $.loading('加载中...');
                $http.get(rootUrl + 'Archive/GetFileInfoByProductIdList', {
                    params: {
                        id: $scope.ArchiveId,
                        productId: $state.params.ProductId,
                        filter: $scope.fileFilter
                    }
                })
                .success(function (res) {
                    $.tlayer('close');
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.fileList = res.Data;
                });
            };
            
            // 全选/取消全选产品
            $scope.checkAll = function (checked) {
                angular.forEach($scope.fileList, function (item) {
                    item.IsChecked = checked;
                });
            };

            // 复核通过
            $scope.review = function (state) {
                var idList = [];
                $scope.desc = '';

                angular.forEach($scope.fileList, function (item) {
                    if (item.IsChecked) {
                        idList.push(item.Id);
                    }
                });
                if (!idList.length) {
                    alert('请勾选文件');
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
                            $scope.getFileList();
                        });
                    }
                });
            };
        }
    ]);
});