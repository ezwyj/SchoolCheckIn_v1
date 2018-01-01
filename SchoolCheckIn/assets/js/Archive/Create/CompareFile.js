/**
 * 文件清单维护
 */

define(['app', 'util', 'filters', 'directives'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('CompareFile', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        'tlayer',
        function ($scope, $http, $templateCache, $compile, $state, tlayer) {
            // 当前物品
            $scope.currPro = null;
            // 参照物品
            $scope.refPro = null;
            // 对比文件列表
            $scope.compareFileList = [];

            // 初始化
            $scope.init = function () {
                $http.get(rootUrl + 'Archive/GetProductInfoByProductId', {
                    params: {
                        productId: $state.params.ProductId
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.currPro = res.Data;
                });
            };

            // 获取参照物品列表
            $scope.getRefProList = function (param) {
                $http.get(rootUrl + 'Archive/GetProductInfoByFilter', {
                    params: param
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    if (!res.Data.length) {
                        $.tips('没有数据', 1);
                    }
                    $scope.refProList = res.Data;
                });
            };

            // 选择物品
            $scope.selectPro = function () {
                $.content({
                    header: '选择产品',
                    content: {
                        width: 1000,
                        html: $templateCache.get('layer-selectProduct.html')
                    },
                    onInit: function () {
                        $compile(this)($scope);
                        $scope.$apply();
                    }
                });
            };

            // 确定选择物品
            $scope.submitPro = function (pro) {
                $.tlayer('close');
                $scope.refPro = pro;
                $http.post(rootUrl + 'Archive/GetCompareFileInfo', {
                    json: JSON.stringify({
                        Current: $scope.currPro,
                        Reference: $scope.refPro
                    })
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.compareFileList = res.Data;
                    angular.forEach($scope.compareFileList, function (item) {
                        item.IsDiff = item.CurFileName !== item.RefFileName || item.CurIsApply !== item.RefIsApply;
                    });
                });
            }
        }
    ]);
    app.directive('diffColor', [
        function () {
            return function (scope, ele, attrs) {
                ele.find('> td').css({
                    'background-color': scope.$eval(attrs.diffColor),
                    'border': '1px solid #ddd'
                });
            };
        }
    ]);
});