/**
 * 项目版本涉及物品历史版本处理方式清理
 */

define(['app', 'util', 'filters', 'directives'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('SetProductHistory', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        'tlayer',
        'tool',
        function ($scope, $http, $templateCache, $compile, $state,tlayer,tool) {
            // 产品列表
            $scope.proList = [];
            // 过滤器
            $scope.filter = '1';
            
            // 初始化
            $scope.init = function () {
                $scope.getProList();
            };

            // 获取产品列表
            $scope.getProList = function () {
                $http.get(rootUrl + 'Product/GetProductListWithHistory', {
                    params: {
                        id: $scope.ArchiveId,
                        filter: $scope.filter,
                        isSubmited: false
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

            // 提交
            $scope.submit = function () {
                var isPass = false;
                var item;

                for (var i in $scope.proList) {
                    item = $scope.proList[i];
                    if (item.CreateTime && !item.SubmitTime) {
                        isPass = true;
                        break;
                    }
                }
                if (!isPass) {
                    alert('无需执行提交操作');
                    return;
                }
                tlayer.confirm('确定要提交？', function () {
                    $.loading('操作中...');
                    $http.post(rootUrl + 'Product/ProductHistorySubmit', {
                        id: $scope.ArchiveId
                    })
                    .success(function (res) {
                        $.tlayer('close');
                        if (res.State) {
                            $.tips('操作成功', 3);
                            $scope.getProList();
                        } else {
                            $.tips('操作失败：' + res.Msg, 1);
                        }
                    });
                });
            };
        }
    ]);
});