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
        function ($scope, $http, $templateCache, $compile, $state) {
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
                    if (res.State) {
                        $scope.archiveAssignList = res.Data;
                    }
                });
            };
        }
    ]);
});