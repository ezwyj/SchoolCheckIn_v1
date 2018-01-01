/**
 * 值集设置
 */

require(['app', 'util', 'plugins', 'directives', 'services'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('pageCtrl', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        'tlayer',
        function ($scope, $http, $templateCache, $compile, tlayer) {
            // 集列表
            $scope.setList = [];
            // 值列表
            $scope.valueList = [];
            // 当前选中集Id
            $scope.activeSet = null;

            // 初始化
            $scope.init = function () {
                $scope.getSetList();
            };

            // 获取集列表
            $scope.getSetList = function () {
                $http.get(rootUrl + 'ValueSet/GetValueSetList')
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.setList = res.Data;
                    if ($scope.setList.length) {
                        $scope.getValueList($scope.setList[0]);
                    }
                });
            };

            // 获取值列表
            $scope.getValueList = function (set) {
                if (set) {
                    $scope.activeSet = set;
                }
                $http.get(rootUrl + 'ValueSet/GetValueItemList', {
                    params: {
                        valueSetId: $scope.activeSet.Id
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.valueList = res.Data;
                });
            }

            // 增加集
            $scope.addSet = function () {
                $scope.upsertSetModel = {
                    Text: '',
                    Sort: '',
                    IsEnabled: true,
                    Description: ''
                };
                saveSet('增加');
            };

            // 编辑集
            $scope.editSet = function (set) {
                $scope.upsertSetModel = {
                    Id: set.Id,
                    Text: set.Text,
                    Sort: set.Sort,
                    IsEnabled: set.IsEnabled,
                    Description: set.Description
                };
                saveSet('编辑');
            };

            function saveSet(type) {
                tlayer.content({
                    header: type + '集',
                    html: $templateCache.get('layer-upsertSet.html'),
                    scope: $scope,
                    submit: function (ins) {
                        if (!$scope.upsertSetModel.Text) {
                            alert('名称为必填项');
                            return false;
                        }
                        if ($scope.upsertSetModel.Sort && (!util.isInteger($scope.upsertSetModel.Sort, true) || +$scope.upsertSetModel.Sort <= 0)) {
                            alert('排序为必须为正整数');
                            return false;
                        }
                        tlayer.disableBtn(this);
                        $http.post(rootUrl + 'ValueSet/SaveValueSet', {
                            json: JSON.stringify($scope.upsertSetModel)
                        })
                        .success(function (res) {
                            if (res.State) {
                                $.tips('操作成功', 3);
                                $.tlayer('close', ins);
                                $scope.getSetList();
                            } else {
                                $.tips('操作失败：' + res.Msg, 1);
                                tlayer.enableBtn(ins);
                            }
                        });
                    }
                });
            }

            // 删除集
            $scope.delSet = function (set) {
                tlayer.confirm('确定要删除吗？', function () {
                    $http.post(rootUrl + 'ValueSet/DeleteValueSet', {
                        id: set.Id
                    })
                    .success(function (res) {
                        if (res.State) {
                            $.tips('操作成功', 3);
                            $scope.getSetList();
                        } else {
                            $.tips('操作失败：' + res.Msg, 1);
                        }
                    });
                });
            };

            // 增加值
            $scope.addValue = function () {
                $scope.upsertValueModel = {
                    SetId: $scope.activeSet.Id,
                    Value: '',
                    Text: '',
                    Sort: '',
                    IsEnabled: true
                };
                saveValue('增加');
            };

            // 编辑值
            $scope.editValue = function (value) {
                $scope.upsertValueModel = {
                    Id: value.Id,
                    SetId: value.SetId,
                    Value: value.Value,
                    Text: value.Text,
                    Sort: value.Sort,
                    IsEnabled: value.IsEnabled
                };
                saveValue('编辑');
            };

            function saveValue(type) {
                tlayer.content({
                    header: type + '值',
                    html: $templateCache.get('layer-upsertValue.html'),
                    scope: $scope,
                    submit: function (ins) {
                        if (!$scope.upsertValueModel.Value) {
                            alert('值为必填项');
                            return false;
                        }
                        if ($scope.upsertValueModel.Sort && (!util.isInteger($scope.upsertValueModel.Sort, true) || +$scope.upsertValueModel.Sort <= 0)) {
                            alert('排序为必须为正整数');
                            return false;
                        }
                        tlayer.disableBtn(ins);
                        $http.post(rootUrl + 'ValueSet/SaveValueItem', {
                            json: JSON.stringify($scope.upsertValueModel)
                        })
                        .success(function (res) {
                            if (res.State) {
                                $.tips('操作成功', 3);
                                $.tlayer('close', ins);
                                $scope.getValueList();
                            } else {
                                $.tips('操作失败：' + res.Msg, 1);
                                tlayer.enableBtn(ins);
                            }
                        });
                        return false;
                    }
                });
            }

            // 删除值
            $scope.delValue = function (value) {
                tlayer.confirm('确定要删除吗？', function () {
                    $http.post(rootUrl + 'ValueSet/DeleteValueItem', {
                        id: value.Id
                    })
                    .success(function (res) {
                        if (res.State) {
                            $.tips('操作成功', 3);
                            $scope.getValueList();
                        } else {
                            $.tips('操作失败：' + res.Msg, 1);
                        }
                    });
                });
            };
        }
    ]);

    // 控制器最后启动模块
    angular.bootstrap(document, ['app']);
});