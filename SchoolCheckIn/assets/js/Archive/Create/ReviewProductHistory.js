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
            // 过滤器
            $scope.filter = '3';

            // 初始化
            $scope.init = function () {
                $scope.getProList();
            };

            // 全选/取消全选
            $scope.checkAll = function (checked) {
                angular.forEach($scope.proList, function (item) {
                    item.IsChecked = checked;
                });
            };

            // 获取产品列表
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
            
            // 复核
            $scope.review = function (state) {
                var itemNumberList = [];
                $scope.desc = '';

                angular.forEach($scope.proList, function (item) {
                    if (item.IsChecked) {
                        itemNumberList.push(item.ItemNumber);
                    }
                });
                if (!itemNumberList.length) {
                    alert('请勾选产品');
                    return;
                }
                tlayer.content({
                    header: '复核说明',
                    html: $templateCache.get('layer-desc.html'),
                    scope: $scope,
                    submit: function (ins) {
                        $.loading('操作中...');
                        $http.post(rootUrl + 'Product/ProductHisotryReview', {
                            id: $scope.ArchiveId,
                            itemNumbers: itemNumberList.join(','),
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