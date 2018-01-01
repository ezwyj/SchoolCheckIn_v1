/**
 * 项目版本文件完整性复核
 */

define(['app', 'util', 'filters', 'directives'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('ReviewIntegrity', [
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
            //主信息
            $scope.mainInfoModel = null;
            // 默认收信人
            $scope.defaultReceiverList = [];
            // 成果处审批人列表
            $scope.securityUserList = [];

            // 初始化
            $scope.init = function () {
                $scope.getApproveList();
                $scope.getMainInfoModel();
                $scope.getUserList();
            };

            // 获取主信息
            $scope.getMainInfoModel = function () {
                $http.get(rootUrl + 'Archive/GetPvmModelById', {
                    params: {
                        id: $scope.ArchiveId
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.mainInfoModel = res.Data;
                });
            };

            // 获取默认收信人和成果处审批人
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

                $http.get(rootUrl + 'Archive/GetUserByDeptName', {
                    params: {
                        depName: '成果组'
                    }
                })
                .success(function (res) {
                    if (res.State) {
                        $scope.securityUserList = res.Data;
                    }
                });
            };

            // 获取审批记录列表
            $scope.getApproveList = function () {
                $http.get(rootUrl + 'Archive/GetIntegrityApproveLogList', {
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
            $scope.reviewPass = function () {
                $scope.model = {
                    ProjectVersionInfoId: $scope.ArchiveId,
                    Type: '复核通过',
                    ReleaseTime: '',
                    Receiver: '',
                    Approver: '',
                    ApproverId: '',
                    Remark: ''
                };
                $scope.selectReceiver($scope.defaultReceiverList);
                tlayer.content({
                    header: '完整性复核通过',
                    html: $templateCache.get('layer-reviewIntegrityPass.html'),
                    scope: $scope,
                    submit: function (ins) {
                        if (!$scope.model.ReleaseTime) {
                            alert('请选择发布时间');
                            return false;
                        }
                        if (!$scope.model.Receiver) {
                            alert('请至少选择一个收信人');
                            return false;
                        }
                        if (!$scope.model.ApproverId) {
                            alert('请选择成果处审批人');
                            return false;
                        } else {
                            angular.forEach($scope.securityUserList, function (item) {
                                if (item.Badge === $scope.model.ApproverId) {
                                    $scope.model.Approver = item.Name;
                                }
                            });
                        }
                        saveIntegrityApproveLog($.extend(true, {}, $scope.model), ins);
                        return false;
                    }
                });
            };

            // 取消复核
            $scope.reviewCancel = function () {
                $scope.model = {
                    ProjectVersionInfoId: $scope.ArchiveId,
                    Type: '取消复核',
                    Receiver: '',
                    Remark: ''
                };
                $scope.selectReceiver($scope.defaultReceiverList);
                tlayer.content({
                    header: '取消完整性复核',
                    html: $templateCache.get('layer-reviewIntegrityCancel.html'),
                    scope: $scope,
                    submit: function (ins) {
                        if (!$scope.model.Receiver) {
                            alert('请至少选择一个收信人');
                            return false;
                        }
                        if (!$scope.model.Remark) {
                            alert('请输入审核说明');
                            return false;
                        }
                        saveIntegrityApproveLog($.extend(true, {}, $scope.model), ins);
                        return false;
                    }
                });
            };
            
            // 事物通知
            $scope.notice = function () {
                $scope.model = {
                    ProjectVersionInfoId: $scope.ArchiveId,
                    Type: '事务通知',
                    Receiver: '',
                    Remark: ''
                };
                tlayer.content({
                    header: '事务通知',
                    html: $templateCache.get('layer-noticeEvent.html'),
                    scope: $scope,
                    submit: function (ins) {
                        if (!$scope.model.Receiver) {
                            alert('请至少选择一个收信人');
                            return false;
                        }
                        if (!$scope.model.Remark) {
                            alert('请输入事务通知内容');
                            return false;
                        }
                        saveIntegrityApproveLog($.extend(true, {}, $scope.model), ins);
                        return false;
                    }
                });
            };

            function saveIntegrityApproveLog(json, ins) {
                $.loading('操作中...');
                $http.post(rootUrl + 'Archive/SaveIntegrityApproveLog', {
                    json: JSON.stringify(json)
                })
                .success(function (res) {
                    $.tlayer('close');
                    if (res.State) {
                        $.tlayer('close', ins);
                        if (json.Type === '事物通知') {
                            $.tips('操作成功', 3);
                            $scope.getApproveList();
                        } else {
                            $.tips('操作成功', 3, tool.closeWindow);
                        }
                    } else {
                        $.tips('操作失败：' + res.Msg, 1);
                    }
                });
            }
        }
    ]);
});