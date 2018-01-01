/**
 * 项目版本涉及物品适用客户范围设置
 */

define(['app', 'util', 'filters', 'directives', 'ztree'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;
    var apiUrl = OP_CONFIG.apiUrl;

    app.controller('SetProductApplication', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        '$timeout',
        'tlayer',
        function ($scope, $http, $templateCache, $compile, $state, $timeout, tlayer) {
            // 产品列表
            $scope.proList = [];
            // 筛选条件
            $scope.filter = '1';
            
            // 初始化
            $scope.init = function () {
                $scope.getProList();
            };
            
            // 获取产品列表
            $scope.getProList = function () {
                $http.get(rootUrl + 'Product/GetProductListWithApplicable', {
                    params: {
                        id: $scope.ArchiveId,
                        filter: $scope.filter,
                        isSubmited:false
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
                    if (!item.ProductApplicable.ReviewTime) {
                        item.IsChecked = checked;
                    }
                });
            };

            // 设置适用范围
            $scope.setApplicable = function (type, item) {
                // 搜索关键字
                $scope.searchKeyword = '';
                // 搜索结果
                $scope.searchResultList = [];
                // 选择结果
                $scope.selectedResultList = [];
                // 设置类型
                $scope.setType = type;
                var proIdList = [];

                if (item) {
                    proIdList.push(item.Id);
                    $scope.selectedResultList = item.ProductApplicable[type] || [];
                } else {
                    angular.forEach($scope.proList, function (item) {
                        if (item.IsChecked) {
                            proIdList.push(item.Id);
                        }
                    });
                    if (!proIdList.length) {
                        alert('请勾选产品');
                        return;
                    }
                }
                tlayer.content({
                    header: '设置适用' + (type === 'Province' ? '省份' : type === 'Industry' ? '行业' : type === 'Customer' ? '客户' : ''),
                    html: $templateCache.get('layer-setApplicable.html'),
                    scope: $scope,
                    submit: function (ins) {
                        $.loading('操作中...');
                        $http.post(rootUrl + 'Product/SetProduct' + type, {
                            id: $scope.ArchiveId,
                            productIds: proIdList.join(','),
                            json: JSON.stringify($scope.selectedResultList)
                        })
                        .success(function (res) {
                            $.tlayer('close');
                            if (!res.State) {
                                $.tips('操作失败：' + res.Msg, 1);
                                return;
                            }
                            $.tlayer('close', ins);
                            $.tips('操作成功', 3);
                            $scope.getProList();
                        });
                        return false;
                    }
                });
            };

            // 搜索
            var timer;
            $scope.search = function () {
                $timeout.cancel(timer);
                timer = $timeout(function () {
                    $scope.searchResultList = [];
                    $http.get(rootUrl + 'Product/GetProduct' + $scope.setType, {
                        params: {
                            keyword: $scope.searchKeyword
                        }
                    })
                    .success(function (res) {
                        if (res.State) {
                            $scope.searchResultList = res.Data;
                        }
                    });
                }, 200);
            };

            // 选择搜索结果
            $scope.selectResult = function (data) {
                if (util.indexOf($scope.selectedResultList, data.Value) === -1) {
                    $scope.selectedResultList.push(data.Value);
                }
            };

            // 删除结果
            $scope.delResult = function (index) {
                $scope.selectedResultList.splice(index, 1);
            };

            // 提交
            $scope.submit = function () {
                var isPass = false;
                var item;

                for (var i in $scope.proList) {
                    item = $scope.proList[i].ProductApplicable;
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
                    $http.post(rootUrl + 'Product/ProductApplicableSubmit', {
                        id: $scope.ArchiveId
                    })
                    .success(function (res) {
                        $.tlayer('close');
                        if (!res.State) {
                            $.tips('操作失败：' + res.Msg, 1);
                            return;
                        }
                        $.tips('操作成功', 3);
                        $scope.getProList();
                    });
                });
            };
        }
    ]);
});