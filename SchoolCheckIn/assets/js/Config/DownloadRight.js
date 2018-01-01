/**
 * 文件下载权限设置
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
            // 大类列表，查询
            $scope.mainClassList = [];
            // 小类列表，查询
            $scope.subClassList = [];
            // 查询参数
            $scope.queryModel = {
                mainClassId: '',
                subClassId: '',
                dept: '',
                job: '',
                name: '',
                ipStart: '',
                ipEnd: '',
                cpuId: ''
            };
            // 数据分页配置
            $scope.pagerOpt = {
                url: rootUrl + 'Config/GetDownloadList',
                data: function () {
                    return $scope.queryModel;
                }
            };
            // 子类列表，增加/编辑
            $scope.subClassListUpsert = [];
            // 是否可保存
            $scope.isHaveSaveRight = false;
            // 是否为复核者
            $scope.isHaveReviewRight = false;
            var ipReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

            // 初始化
            $scope.init = function () {
                $scope.getMainClassList('mainClassList');
                // 获取保存权限
                $http.get(rootUrl + 'Right/IsHaveRight', {
                    params: {
                        objectName: '系统设置.文件下载权限设置',
                        optionCode: 'Save'
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了', 1);
                        return;
                    }
                    $scope.isHaveSaveRight = res.Data;
                });
                // 获取复核权限
                $http.get(rootUrl + 'Right/IsHaveRight', {
                    params: {
                        objectName: '系统设置.文件下载权限设置',
                        optionCode: 'Review'
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了', 1);
                        return;
                    }
                    $scope.isHaveReviewRight = res.Data;
                });
            };

            // 全选/取消全选
            $scope.checkAll = function (isChecked) {
                angular.forEach($scope.dataList, function (item) {
                    item.IsChecked = isChecked;
                });
            };

            // 获取大类列表
            $scope.getMainClassList = function (expression) {
                $http.get(rootUrl + 'Config/GetMainClassList', {
                    params: {
                        pageSize: 0,
                        pageIndex: 1
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $parse(expression).assign($scope, res.Data);
                });
            };

            // 获取子类列表
            $scope.getSubClassList = function (mainClassId, expression) {
                $http.get(rootUrl + 'Config/GetSubClassList', {
                    params: {
                        pageSize: 0,
                        pageIndex: 1,
                        mainClassId: mainClassId
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $parse(expression).assign($scope, res.Data);
                });
            };

            // 查询下载权限列表
            $scope.query = function (pageIndex) {
                var model = $scope.queryModel;

                if (!model.ipStart && model.ipEnd || model.ipStart && !model.ipEnd) {
                    alert('起始IP和结束IP要么都为空，要么都不为空');
                    return;
                }
                if (model.ipStart && !ipReg.test(model.ipStart)) {
                    alert('请输入合法的起始IP');
                    return;
                }
                if (model.ipEnd && !ipReg.test(model.ipEnd)) {
                    alert('请输入合法的结束IP');
                    return;
                }
                if (model.ipStart && model.ipEnd && +model.ipStart.replace(/\./g, '') >= +model.ipEnd.replace(/\./g, '')) {
                    alert('起始IP不能大于等于结束IP');
                    return;
                }                
                $scope.requestData(pageIndex);
            };

            // 选择部门
            $scope.selectDep = function (data) {
                if (data) {
                    $scope.model.Department = data.DepName;
                    $scope.model.DepartmentId = data.DepID;
                    $scope.model.Job = '';
                    $scope.model.JobId = '';
                    $scope.model.Person.Name = '';
                    $scope.model.Person.Badge = '';
                } else {
                    $scope.model.Department = '';
                    $scope.model.DepartmentId = '';
                    $scope.model.Job = '';
                    $scope.model.JobId = '';
                    $scope.model.Person.Name = '';
                    $scope.model.Person.Badge = '';
                }                
            };

            // 选择职位
            $scope.selectJob = function (data) {
                if (data) {
                    $scope.model.Department = data.DepName;
                    $scope.model.DepartmentId = data.DepID;
                    $scope.model.Job = data.JobName;
                    $scope.model.JobId = data.JobID;
                    $scope.model.Person.Name = '';
                    $scope.model.Person.Badge = '';
                } else {
                    $scope.model.Job = '';
                    $scope.model.JobId = '';
                }
            };

            // 选择员工
            $scope.selectUser = function (data) {
                if (data) {
                    $scope.model.Department = data.DepName;
                    $scope.model.DepartmentId = data.DepID;
                    $scope.model.Job = '';
                    $scope.model.JobId = '';
                    $scope.model.Person.Name = data.Name;
                    $scope.model.Person.Badge = data.Badge;
                } else {
                    $scope.model.Person.Name = '';
                    $scope.model.Person.Badge = '';
                }
            };

            // 增加
            $scope.add = function () {
                $scope.model = {
                    SubClass: {
                        Id: '',
                        MainClass: {
                            Id: ''
                        }
                    },
                    Department: '',
                    DepartmentId: '',
                    Job: '',
                    JobId: '',
                    Person: {
                        Badge: '',
                        Name: ''
                    },
                    IpStart: '',
                    IpEnd: '',
                    CPUID: '',
                    IsEnabled: true,
                    Description: ''
                };
                save('增加');
            };

            // 编辑
            $scope.edit = function (item) {
                $scope.model = {
                    Id: item.Id,
                    SubClass: {
                        Id: item.SubClass.Id,
                        MainClass: {
                            Id: item.SubClass.MainClass.Id
                        }
                    },
                    Department: item.Department,
                    DepartmentId: item.DepartmentId,
                    Job: item.Job,
                    JobId: item.JobId,
                    Person: {
                        Badge: item.Person.Badge,
                        Name: item.Person.Name
                    },
                    IpStart: item.IpStart,
                    IpEnd: item.IpEnd,
                    CPUID: item.CPUID,
                    IsEnabled: item.IsEnabled,
                    Description: item.Description
                };
                $scope.getSubClassList(item.SubClass.MainClass.Id, 'subClassListUpsert');
                save('编辑');
            };

            function save(type) {
                tlayer.content({
                    header: type + '文件下载权限',
                    width: 800,
                    html: $templateCache.get('layer-upsert.html'),
                    scope: $scope,
                    submit: function (ins) {
                        var model = $scope.model;

                        if (!model.SubClass.Id) {
                            alert('请选择文件类别');
                            return false;
                        }
                        if (!model.DepartmentId && !model.CPUID && !model.IpStart && !model.IpEnd) {
                            alert('请至少输入一个下载权限');
                            return false;
                        }
                        if (!model.IpStart && model.IpEnd || model.IpStart && !model.IpEnd) {
                            alert('起始IP和结束IP要么都为空，要么都不为空');
                            return false;
                        }
                        if (model.IpStart && !ipReg.test(model.IpStart)) {
                            alert('请输入合法的起始IP');
                            return false;
                        }
                        if (model.IpEnd && !ipReg.test(model.IpEnd)) {
                            alert('请输入合法的结束IP');
                            return false;
                        }
                        if (model.IpStart && model.IpEnd && +model.IpStart.replace(/\./g, '') >= +model.IpEnd.replace(/\./g, '')) {
                            alert('起始IP不能大于等于结束IP');
                            return false;
                        }
                        tlayer.disableBtn(this);
                        var url = rootUrl + 'Config/' + (type === '增加' ? 'AddDownloadRight' : 'EditDownloadRight');
                        $http.post(url, {
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
                    $http.post(rootUrl + 'Config/DeleteDownloadRight', {
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

            // 复核
            $scope.review = function (isPass) {
                var idList = [];

                angular.forEach($scope.dataList, function (item) {
                    if (item.IsChecked) {
                        idList.push(item.Id);
                    }
                });
                if (!idList.length) {
                    alert('请勾选数据');
                    return;
                }
                $scope.model = {
                    ids: idList.join(','),
                    remark: '',
                    isPass: isPass
                };
                tlayer.content({
                    header: '复核下载权限',
                    html: $templateCache.get('layer-review.html'),
                    scope: $scope,
                    submit: function (ins) {
                        if (!isPass && !$scope.model.remark) {
                            alert('请输入复核说明');
                            return false;
                        }
                        $http.post(rootUrl + 'Config/ReviewDownloadRight', $scope.model)
                        .success(function (res) {
                            if (res.State) {
                                $.tips('操作成功', 3);
                                $scope.query();
                            } else {
                                $.tips('操作失败：' + res.Msg, 1);
                            }
                        });
                    }
                });
            };
        }
    ]);

    // 控制器最后启动模块
    angular.bootstrap(document, ['app']);
});