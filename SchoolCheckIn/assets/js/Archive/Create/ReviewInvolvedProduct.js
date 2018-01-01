/**
 * 项目版本涉及物品及硬件版本范围复核
 */

define(['app', 'util', 'filters', 'directives'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;
    
    app.controller('ReviewInvolvedProduct', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        'tlayer',
        'tool',
        function ($scope, $http, $templateCache, $compile, $state, tlayer, tool) {
            var proList = [];
            // 产品列表
            $scope.proList = [];
            // 仅显示未复核
            $scope.isOnlyShowUnReviewed = true;

            // 初始化
            $scope.init = function () {
                $scope.getProList();
            };

            // 获取产品列表
            $scope.getProList = function () {
                $http.get(rootUrl + 'Product/GetProducts', {
                    params: {
                        id: $scope.ArchiveId,
                        isSubmited: true,
                        isReviewed: false
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('获取产品失败：' + res.Msg, 1);
                        return;
                    }
                    proList = res.Data;
                    $scope.filterPro();
                });
            };

            // 筛选产品
            $scope.filterPro = function () {
                $scope.proList = [];
                $scope.isAllChecked = false;
                angular.forEach(proList, function (item) {
                    item.IsChecked = false;
                    if ($scope.isOnlyShowUnReviewed) {
                        if (!item.ReviewTime) {
                            $scope.proList.push(item);
                        }
                    } else {
                        $scope.proList.push(item);
                    }
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
                var instructions = ['复核通过', '复核拒绝', '取消复核'];
                var idList = [];

                angular.forEach($scope.proList, function (item) {
                    if (item.IsChecked) {
                        idList.push(item.Id);
                    }
                });
                if (!idList.length) {
                    alert('请勾选产品');
                    return;
                }
                tlayer.confirm('确定要' + instructions[state] + '复核吗？', function () {
                    $.loading('操作中...');
                    $http.post(rootUrl + 'Product/ReviewProducts', {
                        id: $scope.ArchiveId,
                        products: idList.join(','),
                        reviewState: state
                    })
                    .success(function (res) {
                        $.tlayer('close');
                        if (res.State) {
                            $.tips('操作成功', 3);
                            $scope.getProList();
                            $scope.isAllChecked = false;
                        } else {
                            $.tips('操作失败：' + res.Msg, 1);
                        }
                    });
                });                
            };
        }
    ]);
});