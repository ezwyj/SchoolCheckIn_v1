/**
 * 重大测试版本公用设置
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
        '$parse',
        'tlayer',
        function ($scope, $http, $templateCache, $compile, $parse, tlayer) {
            // 查询参数
            $scope.queryModel = {
                user: '',
                deptName: ''
            };
            // 数据分页配置
            $scope.pagerOpt = {
                url: rootUrl + 'Config/GetGloableInfos',
                data: function () {
                    return $scope.queryModel;
                },
                localPage: true
            };
            // 产品线列表
            $scope.productLineList = [];

            // 初始化
            $scope.init = function () {
                $http.get(rootUrl + 'Archive/GetProductLineList')
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.productLineList = res.Data;
                });
            };

            // 选择员工
            $scope.selectUser = function (data) {
                $scope.model.Name = data.Name;
                $scope.model.Badge = data.Badge;
                $scope.model.DeptName = data.DepName;
                //$http.get(rootUrl + 'Config/GetGloableRight', {
                //    params: {
                //        badge: data.Badge
                //    }
                //})
                //.success(function (res) {
                //    if (!res.State) {
                //        $.tips('出错了：' + res.Msg, 1);
                //        return;
                //    }
                //    if (res.Data) {
                //        $scope.model = {
                //            Id: res.Data.Id,
                //            Badge: res.Data.Badge,
                //            Name: res.Data.Name,
                //            DeptName: res.Data.DeptName,
                //            Cpx: res.Data.Cpx,
                //            IsManager: res.Data.IsManager,
                //            IsDownload: res.Data.IsDownload,
                //            IsEnabled: res.Data.IsEnabled,
                //            Desc: res.Data.Desc
                //        };
                //    }
                //});
            };

            // 增加
            $scope.add = function () {
                $scope.model = {
                    Badge: '',
                    Name: '',
                    DeptName: '',
                    Cpx: '',
                    IsManager: false,
                    IsDownload: true,
                    IsEnabled: true,
                    Desc: ''
                };
                save('增加');
            };

            // 编辑
            $scope.edit = function (data) {
                $scope.model = {
                    Id: data.Id,
                    Badge: data.Badge,
                    Name: data.Name,
                    DeptName: data.DeptName,
                    Cpx: data.Cpx,
                    IsManager: data.IsManager,
                    IsDownload: data.IsDownload,
                    IsEnabled: data.IsEnabled,
                    Desc: data.Desc
                };
                save('编辑');
            };

            function save(type) {
                tlayer.content({
                    header: type + '重大测试版本通用权限',
                    width: 800,
                    html: $templateCache.get('layer-upsert.html'),
                    scope: $scope,
                    submit: function (ins) {
                        var model = $scope.model;

                        if (!model.Badge) {
                            alert('请选择员工');
                            return false;
                        }
                        if (!model.Cpx) {
                            alert('请选择产品线');
                            return false;
                        }
                        tlayer.disableBtn(this);
                        $http.post(rootUrl + 'Config/SaveGloableInfo', {
                            json: JSON.stringify(model)
                        })
                        .success(function (res) {
                            if (res.State) {
                                $.tlayer('close', ins);
                                $.tips('操作成功', 3);
                                $scope.query();
                            } else {
                                $.tips('操作失败：' + res.Msg, 1);
                                tlayer.enableBtn(ins);
                            }
                        });
                        return false;
                    }
                });
            }

            // 删除
            $scope.del = function (id) {
                tlayer.confirm('确定要删除吗？', function () {
                    $http.post(rootUrl + 'Config/DeleteGloableInfo', {
                        id: id
                    })
                    .success(function (res) {
                        if (res.State) {
                            $.tips('操作成功', 3);
                            $scope.query();
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