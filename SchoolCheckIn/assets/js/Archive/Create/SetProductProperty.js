/**
 * 项目版本涉及物品版本属性设置
 */

define(['app', 'util', 'filters', 'directives'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('SetProductProperty', [
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
            // 筛选条件
            $scope.filter = '1';

            // 初始化
            $scope.init = function () {
                $scope.getProList();
            };

            // 获取产品列表
            $scope.getProList = function () {
                $http.get(rootUrl + 'Product/GetProductListWithAttrib', {
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
                    if (!item.Attribute.ReviewTime) {
                        item.IsChecked = checked;
                    }
                });
            };

            // 设置物品版本属性
            $scope.setProductProperty = function (item) {
                var proIdList = [];
                $scope.model = {
                    IsTransferring: false,
                    PublishTypeKey: '',
                    VersionType: '',
                    VersionStatus: ''
                };

                if (item) {
                    proIdList.push(item.Id);
                    $scope.model.IsTransferring = item.Attribute.IsTransferring;
                    $scope.model.PublishTypeKey = item.Attribute.PublishTypeKey;
                    $scope.model.VersionType = item.Attribute.VersionType;
                    $scope.model.VersionStatus = item.Attribute.VersionStatus;
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
                    header: '设置物品版本属性',
                    width: 800,
                    html: $templateCache.get('layer-setProductProperty.html'),
                    scope: $scope,
                    submit: function (ins) {
                        if (!$scope.model.PublishTypeKey) {
                            alert('请选择发布类型');
                            return false;
                        }
                        if (!$scope.model.VersionType) {
                            alert('请选择版本类型');
                            return false;
                        }
                        if (!$scope.model.VersionStatus) {
                            alert('请选择版本状态');
                            return false;
                        }
                        $.loading('操作中...');
                        $http.post(rootUrl + 'Product/ProductAttributeSave', {
                            id: $scope.ArchiveId,
                            productIds: proIdList.join(','),
                            attribJson: JSON.stringify($scope.model)
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
                            $scope.getProList();
                            $.tlayer('close', ins);
                        });
                        return false;
                    }
                });
            };
                        
            // 提交
            $scope.submit = function () {
                var isPass = false;
                var item;

                for (var i in $scope.proList) {
                    item = $scope.proList[i].Attribute;
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
                    $http.post(rootUrl + 'Product/ProductAttributeSubmit', {
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