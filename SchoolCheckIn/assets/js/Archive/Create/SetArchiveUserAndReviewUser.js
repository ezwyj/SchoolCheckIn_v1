/**
 * 项目版本文件归档人和复核人分配
 */

define(['app', 'util', 'filters', 'directives'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('SetArchiveUserAndReviewUser', [
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
            // 待提交数据列表
            var submitList = [];

            // 初始化
            $scope.init = function () {
                // 获取文件类别列表
                $http.get(rootUrl + 'Archive/InitArchiveLiableUserAssign', {
                    params: {
                        id: $scope.ArchiveId
                    }
                })
                .success(function (res) {
                    if (res.State) {
                        angular.forEach(res.Data, function (item) {
                            item.IsOperator = item.ArchiveLiableUserId === OP_CONFIG.badge;
                            if (item.IsOperator) {
                                submitList.push(item);
                            }
                        });
                        $scope.archiveAssignList = res.Data;
                    }
                });
            };

            // 分配归档人和复核人
            $scope.setArchiveUserAndReviewUser = function () {
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
                    ArchiveUserId: '',
                    ArchiveUserName: '',
                    ArchiveUserDept: '',
                    ReviewerId: '',
                    Reviewer: '',
                    ReviewerDept: ''
                };

                tlayer.content({
                    header: '分配归档人和复核人',
                    width: 800,
                    html: $templateCache.get('layer-setArchiveUserAndReviewUser.html'),
                    scope: $scope,
                    submit: function (ins) {
                        if (!$scope.model.ArchiveUserId) {
                            alert('归档人为必填项');
                            return false;
                        }
                        if (!$scope.model.ReviewerId) {
                            alert('复核人为必填项');
                            return false;
                        }
                        if ($scope.model.ArchiveUserId == $scope.model.ReviewerId) {
                            alert('归档人和复核人不能相同');
                            return false;
                        }
                        angular.forEach($scope.archiveAssignList, function (item) {
                            if (item.IsOperator && item.IsChecked) {
                                item.ArchiveUserId = $scope.model.ArchiveUserId;
                                item.ArchiveUserName = $scope.model.ArchiveUserName;
                                item.ArchiveUserDept = $scope.model.ArchiveUserDept;
                                item.ReviewerId = $scope.model.ReviewerId;
                                item.Reviewer = $scope.model.Reviewer;
                                item.ReviewerDept = $scope.model.ReviewerDept;
                                // 设置完成取消勾选方便后续动作
                                item.IsChecked = false;
                            }
                        });
                        $scope.isCheckedAll = false;
                    }
                });
            };

            // 选择归档人
            $scope.selectArchiveUser = function (data) {
                $scope.model.ArchiveUserId = data.Badge;
                $scope.model.ArchiveUserName = data.Name;
                $scope.model.ArchiveUserDept = data.DepName;
            };

            // 选择复核人
            $scope.selectReviewer = function (data) {
                $scope.model.ReviewerId = data.Badge;
                $scope.model.Reviewer = data.Name;
                $scope.model.ReviewerDept = data.DepName;
            };

            // 全选/取消全选
            $scope.checkAll = function (checked) {
                angular.forEach($scope.archiveAssignList, function (item) {
                    if (item.IsOperator) {
                        item.IsChecked = checked;
                    }
                });
            };

            // 提交
            $scope.submit = function () {
                if (!isValid()) {
                    return;
                }
                tlayer.confirm('确定要提交？', function () {
                    $.loading('操作中...');
                    $http.post(rootUrl + 'Archive/SaveArchiveAssignData', {
                        json: JSON.stringify(submitList)
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

            // 校验数据
            function isValid() {
                var msg = [];

                angular.forEach(submitList, function (item) {
                    if (!item.ArchiveUserId || !item.ReviewerId) {
                        msg.push(item.MainClassName + ' - ' + item.SubClassName + ' 没有分配归档人或复核人');
                    } else {
                        if (item.ArchiveUserId == item.ReviewerId) {
                            msg.push(item.MainClassName + ' - ' + item.SubClassName + ' 归档人和复核人不能相同');
                        }
                    }
                });

                if (msg.length) {
                    $.alert('<div class="alert alert-danger">' + msg.join('<br>') + '</div>');
                    return false;
                }
                return true;
            }
        }
    ]);
});