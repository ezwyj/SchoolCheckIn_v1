﻿/**
 * 重大测试版本专用设置
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
                projectCode: '',
                noticeNo: '',
                archiveVersionCode: '',
                projectManager: '',
                projectName: '',
                expire: '',
                surplusDay: ''
            };
            // 数据分页配置
            $scope.pagerOpt = {
                url: rootUrl + 'Config/GetMainInfoList',
                data: function () {
                    return $scope.queryModel;
                },
                beforeSend: function () {
                    $.loading('加载中...');
                },
                complete: function () {
                    $.tlayer('close');
                }
            };
            $scope.currBadge = OP_CONFIG.badge;

            // 设置管控结束时间
            $scope.editEndControlTime = function (data) {
                $scope.endControlTime = util.formatMSDate(data.EndControlTime, 'YYYY-MM-DD');
                tlayer.content({
                    header: '设置管控结束时间',
                    html: $templateCache.get('layer-editEndControlTime.html'),
                    scope: $scope,
                    submit: function (ins) {
                        if (!$scope.endControlTime) {
                            alert('请设置管控结束时间');
                            return false;
                        }
                        tlayer.disableBtn(this);
                        $http.post(rootUrl + 'Config/UpdateEndControlTime', {
                            id: data.Id,
                            endControlTime: $scope.endControlTime
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
            };

            // 查看权限用户列表
            $scope.viewUserList = function (data) {
                $scope.viewData = data;
                $scope.getUserList();
                $.content({
                    header: '权限用户',
                    content: {
                        width: 1200,
                        html: $templateCache.get('layer-viewUserList.html')
                    },
                    onInit: function () {
                        $compile(this)($scope);
                        $scope.$apply();
                    }
                });
            };

            // 获取权限用户列表
            $scope.getUserList = function () {
                // 权限用户列表
                $scope.userList = [];
                $http.get(rootUrl + 'Config/GetUserRights', {
                    params: {
                        id: $scope.viewData.Id
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.userList = res.Data;
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

            // 增加权限用户
            $scope.addUser = function () {
                $scope.model = {
                    ProjectVersionInfoId: $scope.viewData.Id,
                    Badge: '',
                    Name: '',
                    DeptName: '',
                    IsEnabled: true,
                    IsManager: false,
                    IsDownload: true,
                    IsEnabled: true,
                    Desc: ''
                };
                save('增加');
            };

            // 编辑权限用户
            $scope.editUser = function (data) {
                $scope.model = {
                    Id: data.Id,
                    ProjectVersionInfoId: data.ProjectVersionInfoId,
                    Badge: data.Badge,
                    Name: data.Name,
                    DeptName: data.DeptName,
                    IsManager: data.IsManager,
                    IsDownload: data.IsDownload,
                    IsEnabled: data.IsEnabled,
                    Desc: data.Desc
                };
                save('编辑');
            };

            function save(type) {
                tlayer.content({
                    header: type + '权限用户',
                    width: 800,
                    html: $templateCache.get('layer-upsertUser.html'),
                    scope: $scope,
                    submit: function (ins) {
                        var model = $scope.model;

                        if (!model.Badge) {
                            alert('请选择员工');
                            return false;
                        }
                        tlayer.disableBtn(this);
                        $http.post(rootUrl + 'Config/SubUserRight', {
                            json: JSON.stringify(model)
                        })
                        .success(function (res) {
                            if (res.State) {
                                $.tlayer('close', ins);
                                $.tips('操作成功', 3);
                                $scope.getUserList();
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