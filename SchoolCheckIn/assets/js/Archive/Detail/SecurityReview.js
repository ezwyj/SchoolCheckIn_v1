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
        function ($scope, $http, $templateCache, $compile, $state, tlayer) {
            // 审批记录列表
            $scope.approveList = [];

            // 初始化
            $scope.init = function () {
                $scope.getApproveList();
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
        }
    ]);
});