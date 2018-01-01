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
        'tlayer',
        function ($scope, $http, $templateCache, $compile, $state, tlayer) {
            // 产品列表
            $scope.proList = [];
            // 筛选条件
            $scope.filter = '3';
                        
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

            // 全选/取消全选
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
                        $http.post(rootUrl + 'Product/ProductApplicableReview', {
                            id: $scope.ArchiveId,
                            productIds: idList.join(','),
                            reviewState: state,
                            reviewRemark: $scope.desc
                        })
                        .success(function (res) {
                            $.tlayer('close');
                            if (!res.State) {
                                $.tips('操作失败：' + res.Msg, 1);
                                return;
                            }
                            else {
                                $.tips('操作成功', 3);
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