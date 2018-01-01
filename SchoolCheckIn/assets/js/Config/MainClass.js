/**
 * 大类设置
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
            // 数据分页配置
            $scope.pagerOpt = {
                url: rootUrl + 'Config/GetMainClassList'
            };

            // 增加
            $scope.add = function () {
                $scope.upsertModel = {
                    Sort: '',
                    MainClassName: '',
                    IsEnabled: true,
                    Description: ''
                };
                save('增加');
            };

            // 编辑
            $scope.edit = function (data) {
                $scope.upsertModel = {
                    Id: data.Id,
                    Sort: data.Sort,
                    MainClassName: data.MainClassName,
                    IsEnabled: data.IsEnabled,
                    Description: data.Description
                };
                save('编辑');                
            };

            function save(type) {
                tlayer.content({
                    header: type + '大类',
                    html: $templateCache.get('layer-upsert.html'),
                    scope: $scope,
                    submit: function (ins) {
                        if (!util.isInteger(String($scope.upsertModel.Sort), true) || +$scope.upsertModel.Sort <= 0) {
                            alert('大类序号为必填项且必须为正整数');
                            return false;
                        }
                        if (!$scope.upsertModel.MainClassName) {
                            alert('请输入大类名称');
                            return false;
                        }
                        tlayer.disableBtn(ins);
                        var url = rootUrl + 'Config/' + (type === '增加' ? 'AddMainClass' : 'EditMainClass');
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
                    $http.post(rootUrl + 'Config/DeleteMainClass', {
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