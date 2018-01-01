/**
 * 物品历史硬件版本处理方式清理复核
 */

define(['app', 'util', 'filters', 'directives'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('ReviewProductHistoryDetail', [
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

            // 复核
            $scope.review = function (state) {
                $scope.desc = '';
                tlayer.content({
                    header: '复核说明',
                    html: $templateCache.get('layer-desc.html'),
                    scope: $scope,
                    submit: function (ins) {
                        if (state !== 0 && !$scope.desc) {
                            alert('请填写复核说明');
                            return false;
                        }
                        $.loading('操作中...');
                        $http.post(rootUrl + 'Product/ProductHisotryReview', {
                            id: $scope.ArchiveId,
                            itemNumbers: $state.params.ItemNumber,
                            reviewState: state,
                            reviewRemark: $scope.desc
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