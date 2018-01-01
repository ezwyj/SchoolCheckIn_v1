/**
 * 项目版本文件成果处审批
 */

define(['app', 'util', 'filters', 'directives'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('SecurityReview', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        'tlayer',
        'tool',
        function ($scope, $http, $templateCache, $compile, $state, tlayer, tool) {
            // 审批记录列表
            $scope.approveList = [];
            // 默认收信人
            $scope.defaultReceiverList = [];
            // 成果处审批人列表
            $scope.securityUserList = [];

            // 初始化
            $scope.init = function () {
                $scope.getApproveList();
                $scope.getUserList();
            };

            // 获取默认收信人
            $scope.getUserList = function () {
                $http.get(rootUrl + 'Archive/GetUsersByProjectVersionInfoId', {
                    params: {
                        id: $scope.ArchiveId
                    }
                })
                .success(function (res) {
                    if (res.State) {
                        $scope.defaultReceiverList = res.Data;
                    }
                });
            };

            // 获取审批记录列表
            $scope.getApproveList = function () {
                $http.get(rootUrl + 'Archive/GetAchievementApproveLogList', {
                    params: {
                        id: $scope.ArchiveId
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.approveList = res.Data;
                });
            };

            // 选择收信人
            $scope.selectReceiver = function (userList) {
                var receiver = [];

                angular.forEach(userList, function (item) {
                    receiver.push(item.Name);
                });
                $scope.model.Receiver = receiver.join(',');
            };

            // 复核通过
            $scope.review = function (type) {
                $scope.model = {
                    ProjectVersionInfoId: $scope.ArchiveId,
                    Type: type,
                    Receiver: '',
                    Remark: ''
                };
                $scope.selectReceiver($scope.defaultReceiverList);
                tlayer.content({
                    header: type,
                    html: $templateCache.get('layer-securityReview.html'),
                    scope: $scope,
                    submit: function (ins) {
                        if (!$scope.model.Receiver) {
                            alert('请至少选择一个收信人');
                            return false;
                        }
                        $.loading('操作中...');
                        $http.post(rootUrl + 'Archive/SaveAchievementApproveLog', {
                            json: JSON.stringify($scope.model)
                        })
                        .success(function (res) {
                            $.tlayer('close');
                            if (res.State) {
                                $.tlayer('close', ins);
                                $.tips('操作成功', 3, tool.closeWindow);
                            } else {
                                $.tips('操作失败：' + res.Msg, 1);
                            }
                        });
                        return false;
                    }
                });
            };
        }
    ]);
});