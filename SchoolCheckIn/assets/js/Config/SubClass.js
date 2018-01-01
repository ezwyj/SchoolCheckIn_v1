/**
 * 小类设置
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
            // 大类列表
            $scope.mainClassList = [];
            // 查询参数
            $scope.queryModel = {
                mainClassId: '',
                isLinkVersionBranch: '',
                isSyncExtranet: '',
                isEnabled: ''
            };
            // 分页配置
            $scope.pagerOpt = {
                url: rootUrl + 'Config/GetSubClassList',
                data: function () {
                    return $scope.queryModel;
                }
            };

            // 初始化
            $scope.init = function () {
                $http.get(rootUrl + 'Config/GetMainClassList', {
                    params: {
                        pageSize: 0,
                        pageIndex: 1
                    }
                })
                .success(function (res) {
                    if (res.State) {
                        $scope.mainClassList = res.Data || [];
                    }
                });
            };

            // 增加
            $scope.add = function () {
                $scope.upsertModel = {
                    MainClass: {
                        Id: ''
                    },
                    Sort: '',
                    SubClassName: '',
                    SyncOldPlatformType: '无',
                    IsSetProductApplicability: true,
                    IsCheckUnique: false,
                    IsLinkVersionBranch: false,
                    IsSyncExtranet: false,
                    IsEnabled: true,
                    Description: ''
                };
                save('增加');
            };

            // 编辑
            $scope.edit = function (data) {
                $scope.upsertModel = {
                    Id: data.Id,
                    MainClass: {
                        Id: data.MainClass.Id
                    },
                    Sort: data.Sort,
                    SubClassName: data.SubClassName,
                    SyncOldPlatformType: data.SyncOldPlatformType,
                    IsSetProductApplicability: data.IsSetProductApplicability,
                    IsCheckUnique: data.IsCheckUnique,
                    IsLinkVersionBranch: data.IsLinkVersionBranch,
                    IsSyncExtranet: data.IsSyncExtranet,
                    IsEnabled: data.IsEnabled,
                    Description: data.Description
                };
                save('编辑');
            };

            function save(type) {
                tlayer.content({
                    header: type + '小类',
                    html: $templateCache.get('layer-upsert.html'),
                    scope: $scope,
                    submit: function (ins) {
                        if (!$scope.upsertModel.MainClass.Id) {
                            alert('请选择大类');
                            return false;
                        }
                        if (!util.isInteger(String($scope.upsertModel.Sort), true) || +$scope.upsertModel.Sort <= 0) {
                            alert('小类序号为必填项且必须为正整数');
                            return false;
                        }
                        if (!$scope.upsertModel.SubClassName) {
                            alert('请输入小类名称');
                            return false;
                        }
                        tlayer.disableBtn(this);
                        var url = rootUrl + 'Config/' + (type === '增加' ? 'AddSubClass' : 'EditSubClass');
                        $http.post(url, {
                            json: JSON.stringify($scope.upsertModel)
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
                    $http.post(rootUrl + 'Config/DeleteSubClass', {
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