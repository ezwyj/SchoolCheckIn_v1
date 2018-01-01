/**
 * 项目版本文件归档责任人分配
 */

define(['app', 'util', 'filters', 'directives', 'services'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('SetArchiveLiableUser', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        'tlayer',
        'tool',
        function ($scope, $http, $templateCache, $compile, $state, tlayer, tool) {
            // 文件类别列表
            $scope.archiveAssignList = [];
            
            // 初始化
            $scope.init = function () {
                // 获取文件类别列表
                $http.get(rootUrl + 'Archive/InitArchiveAssign', {
                    params: {
                        id: $scope.ArchiveId
                    }
                })
                .success(function (res) {
                    if (res.State) {
                        $scope.archiveAssignList = res.Data;
                    }
                });
            };

            // 分配归档责任人
            $scope.setArchiveLiableUser = function () {
                var canClick = false;

                angular.forEach($scope.archiveAssignList, function (item) {
                    if (item.IsChecked) {
                        canClick = true;
                    }
                });
                if (!canClick) {
                    alert('请勾选数据再点击');
                    return;
                }
                $scope.model = {
                    ArchiveLiableUserId: '',
                    ArchiveLiableUserName: '',
                    ArchiveLiableUserDept: '',
                    Remark: ''
                };

                tlayer.content({
                    header: '分配归档责任人',
                    width: 800,
                    html: $templateCache.get('layer-setArchiveLiableUser.html'),
                    scope: $scope,
                    submit: function (ins) {
                        if (!$scope.model.ArchiveLiableUserId) {
                            alert('归档责任人为必填项');
                            return false;
                        }
                        angular.forEach($scope.archiveAssignList, function (item) {
                            if (item.IsEnabled && item.IsChecked) {
                                item.ArchiveLiableUserId = $scope.model.ArchiveLiableUserId;
                                item.ArchiveLiableUserName = $scope.model.ArchiveLiableUserName;
                                item.ArchiveLiableUserDept = $scope.model.ArchiveLiableUserDept;
                                item.Remark = $scope.model.Remark;
                                // 设置完成取消勾选方便后续动作
                                item.IsChecked = false;
                            }
                        });
                        $scope.isCheckedAll = false;
                    }
                });
            };

            // 选择归档责任人
            $scope.selectLiableUser = function (data) {
                $scope.model.ArchiveLiableUserId = data.Badge;
                $scope.model.ArchiveLiableUserName = data.Name;
                $scope.model.ArchiveLiableUserDept = data.DepName;
            };

            // 全选/取消全选
            $scope.checkAll = function (checked) {
                angular.forEach($scope.archiveAssignList, function (item) {
                    if (item.IsEnabled) {
                        item.IsChecked = checked;
                    }
                });
            };

            // 提交
            $scope.submit = function () {
                var json = [];
                for (var i in $scope.archiveAssignList) {
                    var item = $scope.archiveAssignList[i];
                    if (item.IsEnabled) {
                        if (!item.ArchiveLiableUserId) {
                            alert('请为所有启用的文件类别分配归档责任人');
                            return;
                        }
                        json.push(item);
                    }
                }
                tlayer.confirm('确定要提交？', function () {
                    $.loading('操作中...');
                    $http.post(rootUrl + 'Archive/SaveArchiveAssignInfo', {
                        json: JSON.stringify(json)
                    })
                    .success(function (res) {
                        $.tlayer('close');
                        if (res.State) {
                            $.tips('操作成功', 3, function () {
                                location.reload();
                            });
                        } else {
                            $.tips('操作失败：' + res.Msg, 1);
                        }
                    });
                });
            };
        }
    ]);
});