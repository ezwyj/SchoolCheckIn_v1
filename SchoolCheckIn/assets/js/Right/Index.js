/**
 * 权限设置
 */

require(['app', 'util', 'selector', 'plugins', 'directives', 'services'], function (angular, util, selector) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('pageCtrl', [
        '$scope',
        '$timeout',
        function ($scope, $timeout) {
            // 激活tab
            $scope.activeTab = '';

            // 初始化
            $scope.init = function () {
                $scope.changeTab('rightObject');
            };

            // tab切换
            $scope.changeTab = function (tabName) {
                $scope.activeTab = tabName;
                $timeout(function () {
                    $scope.$broadcast('changeTab', tabName);
                }, 100);
            };
        }
    ]);

    // 模块信息控制器
    app.controller('rightObjectCtrl', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        'tlayer',
        function ($scope, $http, $templateCache, $compile, tlayer) {
            // 对象类型列表
            $scope.objectTypeList = [];
            // 对象列表
            $scope.objectList = [];

            // 监听是否切换到当前tab
            $scope.$on('changeTab', function (evt, tabName) {
                if (tabName === 'rightObject') {
                    $scope.getObjectList();
                }
                $http.get(rootUrl + 'Right/GetRightObjectTypeList')
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.objectTypeList = res.Data;
                });
            });

            // 获取对象列表
            $scope.getObjectList = function () {
                $http.get(rootUrl + 'Right/GetRightObjects')
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.objectList = res.Data;
                });
            };

            // 增加对象
            $scope.addObject = function () {
                $scope.objectModel = {
                    Name: '',
                    ObjectType: '',
                    Remark: ''
                };
                save('增加');
            };

            // 编辑对象
            $scope.editObject = function (data) {
                $scope.objectModel = {
                    ObjectId: data.ObjectId,
                    Name: data.Name,
                    ObjectType: data.ObjectType,
                    Remark: data.Remark
                };
                save('编辑');
            };

            function save(type) {
                tlayer.content({
                    header: type + '对象',
                    html: $templateCache.get('layer-upsertObject.html'),
                    scope: $scope,
                    submit: function (ins) {
                        if (!$scope.objectModel.Name) {
                            alert('请输入对象名称');
                            return false;
                        }
                        if (!$scope.objectModel.ObjectType) {
                            alert('请选择对象类型');
                            return false;
                        }
                        tlayer.disableBtn(ins);
                        $http.post(rootUrl + 'Right/SaveRightObject', {
                            json: JSON.stringify($scope.objectModel)
                        })
                        .success(function (res) {
                            if (res.State) {
                                $.tlayer('close', ins);
                                $.tips('操作成功', 3);
                                $scope.getObjectList();
                            } else {
                                $.tips('增加失败：' + res.Msg, 1);
                                tlayer.enableBtn(ins);
                            }
                        });
                        return false;
                    }
                });
            }

            // 删除对象
            $scope.delObject = function (data) {
                tlayer.confirm('确定要删除吗？', function () {
                    $http.post(rootUrl + 'Right/DeleteRightObject', {
                        id: data.ObjectId
                    })
                    .success(function (res) {
                        if (res.State) {
                            $.tips('操作成功', 3);
                            $scope.getObjectList();
                        } else {
                            $.tips('操作失败：' + res.Msg, 1);
                        }
                    });
                });
            };
        }
    ]);

    // 角色信息控制器
    app.controller('rightRoleCtrl', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        'tlayer',
        function ($scope, $http, $templateCache, $compile, tlayer) {
            // 角色列表
            $scope.roleList = [];
            // 角色用户列表
            $scope.userList = [];
            // 当前选择角色
            $scope.activeRole = null;

            // 监听是否切换到当前tab
            $scope.$on('changeTab', function (evt, tabName) {
                if (tabName === 'rightRole') {
                    $scope.getRoleList();
                }
            });

            // 获取角色列表
            $scope.getRoleList = function () {
                $http.get(rootUrl + 'Right/GetRoles')
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.roleList = res.Data;
                    $scope.activeRole = $scope.roleList[0];
                    $scope.getUserList();
                });
            };

            // 获取角色用户列表
            $scope.getUserList = function () {
                if (!$scope.activeRole) {
                    $scope.userList = [];
                    return;
                }
                $http.get(rootUrl + 'Right/GetUserByRole', {
                    params: {
                        roleId: $scope.activeRole.RoleId,
                        pageIndex: 1,
                        pageSize: 100
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

            // 增加角色
            $scope.addRole = function () {
                $scope.roleModel = {
                    Name: '',
                    Sort: ''
                };
                saveRole('增加');
            };

            // 编辑角色
            $scope.editRole = function (data, evt) {
                evt.stopPropagation();
                $scope.roleModel = {
                    RoleId: data.RoleId,
                    Name: data.Name,
                    Sort: data.Sort
                };
                saveRole('编辑');
            };

            function saveRole(type) {
                tlayer.content({
                    header: type + '角色',
                    html: $templateCache.get('layer-upsertRole.html'),
                    scope: $scope,
                    submit: function (ins) {
                        if (!$scope.roleModel.Name) {
                            alert('请输入角色名称');
                            return false;
                        }
                        if (!$scope.roleModel.Sort && (!util.isInteger(+$scope.roleModel.Sort) || +$scope.roleModel.Sort <= 0)) {
                            alert('排序必须为正整数');
                            return false;
                        }
                        tlayer.disableBtn(ins);
                        $http.post(rootUrl + 'Right/SaveRole', {
                            json: JSON.stringify($scope.roleModel)
                        })
                        .success(function (res) {
                            if (res.State) {
                                $.tlayer('close', ins);
                                $.tips('操作成功', 3);
                                $scope.getRoleList();
                            } else {
                                $.tips('操作失败：' + res.Msg, 1);
                                tlayer.enableBtn(ins);
                            }
                        });
                        return false;
                    }
                });
            }

            // 删除角色
            $scope.delRole = function (role, e) {
                tlayer.confirm('确定要删除吗？', function () {
                    $http.post(rootUrl + 'Right/DeleteRole', {
                        id: role.RoleId
                    })
                    .success(function (res) {
                        if (!res.State) {
                            $.tips('操作失败：' + res.Msg, 1);
                            return;
                        }
                        $scope.getRoleList();
                    });
                });

                e.stopPropagation();
            };

            // 查看角色用户
            $scope.viewUser = function (role) {
                $scope.activeRole = role;
                $scope.getUserList();
            };

            // 增加角色成员
            $scope.addUser = function () {
                selector.singlePeople({
                    callback: function (data) {
                        $.tlayer('close');
                        $http.post(rootUrl + 'Right/AddUserInRole', {
                            roleId: $scope.activeRole.RoleId,
                            name: data.Name,
                            badge: data.Badge,
                            department: data.DepName
                        })
                        .success(function (res) {
                            if (res.State) {
                                $.tips('操作成功', 3);
                                $scope.getUserList();
                            } else {
                                $.tips('操作失败：' + res.Msg, 1);
                            }
                        });
                    }
                });
            };

            // 删除成员
            $scope.delUser = function (data) {
                tlayer.confirm('确定要删除吗？', function () {
                    $http.post(rootUrl + 'Right/DeleteUserInRole', {
                        roleId:$scope.activeRole.RoleId, 
                        userId: data.UserId
                    })
                    .success(function (res) {
                        if (res.State) {
                            $.tips('操作成功', 3);
                            $scope.getUserList();
                        } else {
                            $.tips('操作失败：' + res.Msg, 1);
                        }
                    });
                });
            };
        }
    ]);

    // 权限操作信息控制器
    app.controller('rightOptionCtrl', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        'tlayer',
        function ($scope, $http, $templateCache, $compile, tlayer) {
            // 权限操作列表
            $scope.optionList = [];

            // 监听是否切换到当前tab
            $scope.$on('changeTab', function (evt, tabName) {
                if (tabName === 'rightOption') {
                    $scope.getOptionList();
                }
            });

            // 获取权限操作列表
            $scope.getOptionList = function () {
                $http.get(rootUrl + 'Right/GetOperations')
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.optionList = res.Data;
                });
            };

            // 增加权限操作
            $scope.addOption = function () {
                $scope.optionModel = {
                    OperationCode: '',
                    Description: ''
                };
                save('增加');
            };

            // 编辑权限操作
            $scope.editOption = function (data) {
                $scope.optionModel = {
                    OperationId: data.OperationId,
                    OperationCode: data.OperationCode,
                    Description: data.Description
                };
                save('编辑');
            };

            function save(type) {
                tlayer.content({
                    header: type + '权限',
                    html: $templateCache.get('layer-upsertOption.html'),
                    scope: $scope,
                    submit: function (ins) {
                        if (!$scope.optionModel.OperationCode) {
                            alert('请输入操作代码');
                            return false;
                        }
                        tlayer.disableBtn(ins);
                        $http.post(rootUrl + 'Right/SaveOperation', {
                            json: JSON.stringify($scope.optionModel)
                        })
                        .success(function (res) {
                            if (res.State) {
                                $.tlayer('close');
                                $.tips('操作成功', 3);
                                $scope.getOptionList();
                            } else {
                                tlayer.enableBtn(ins);
                                $.tips('操作失败：' + res.Msg, 1);
                            }
                        });
                        return false;
                    }
                });
            }

            // 删除权限操作
            $scope.delOption = function (data) {
                tlayer.confirm('确定要删除吗？', function () {
                    $http.post(rootUrl + 'Right/DeleteOperation', {
                        id: data.OperationId
                    })
                    .success(function (res) {
                        if (res.State) {
                            $.tips('操作成功', 3);
                            $scope.getOptionList();
                        } else {
                            $.tips('操作失败：' + res.Msg, 1);
                        }
                    });
                });
            };
        }
    ]);

    // 权限分配控制器
    app.controller('rightAssignCtrl', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        function ($scope, $http, $templateCache, $compile) {
            // 权限角色列表
            $scope.roleList = [];
            // 权限对象列表
            $scope.objectList = [];
            // 权限操作列表
            $scope.optionList = [];
            // 查询参数
            $scope.queryModel = {
                roleId: ''
            };

            // 监听是否切换到当前tab
            $scope.$on('changeTab', function (evt, tabName) {
                if (tabName === 'rightAssign') {
                    $scope.getRoleList();
                    $scope.getObjectList();
                    $scope.getOptionList();
                }
            });

            // 获取权限角色列表
            $scope.getRoleList = function () {
                $http.get(rootUrl + 'Right/GetRoles')
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.roleList = res.Data;
                });
            };

            // 获取权限对象列表
            $scope.getObjectList = function () {
                $http.get(rootUrl + 'Right/GetRightObjects')
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.objectList = res.Data;
                });
            };

            // 获取权限操作列表
            $scope.getOptionList = function () {
                $http.get(rootUrl + 'Right/GetOperations')
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.optionList = res.Data;
                });
            };

            // 获取角色权限
            $scope.getPermission = function () {
                // 角色权限
                $scope.permissionObj = {};
                if (!$scope.queryModel.roleId) {
                    return;
                }
                $http.get(rootUrl + 'Right/GetPermissionByRole', {
                    params: $scope.queryModel
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.permissionModel = res.Data;
                    // 构造权限表格显示需要的数据结构：{ ObjectID: { OptionId: true/false } }
                    angular.forEach($scope.permissionModel, function (item) {
                        var rightObj = $scope.permissionObj[item.Resource.ObjectId] || ($scope.permissionObj[item.Resource.ObjectId] = {});
                        angular.forEach(item.Operations, function (option) {
                            rightObj[option.OperationId] = option.IsHaveRight;
                        });
                    });
                });
            };

            // 保存角色权限
            $scope.savePermission = function () {
                if (!$scope.queryModel.roleId) {
                    return;
                }

                angular.forEach($scope.permissionModel, function (item) {
                    angular.forEach(item.Operations, function (option) {
                        option.IsHaveRight = $scope.permissionObj[item.Resource.ObjectId][option.OperationId];
                    });
                });
                $http.post(rootUrl + 'Right/SavePermission', {
                    roleId: $scope.queryModel.roleId,
                    json: JSON.stringify($scope.permissionModel)
                })
                .success(function (res) {
                    if (res.State) {
                        $.tips('操作成功', 3);
                    } else {
                        $.tips('操作失败：' + res.Msg, 1);
                    }
                });
            };
        }
    ]);

    // 控制器最后启动模块
    angular.bootstrap(document, ['app']);
});