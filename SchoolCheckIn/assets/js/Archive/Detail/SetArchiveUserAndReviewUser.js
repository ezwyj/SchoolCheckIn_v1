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

            // 初始化
            $scope.init = function () {
                // 获取文件类别列表
                $http.get(rootUrl + 'Archive/InitArchiveLiableUserAssign', {
                    params: {
                        id: $scope.ArchiveId
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.archiveAssignList = res.Data;
                });
            };
        }
    ]);
});