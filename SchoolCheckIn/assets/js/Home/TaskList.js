/**
 * 任务列表
 */

require(['app', 'util', 'plugins', 'directives'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('pageCtrl', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        function ($scope, $http, $templateCache, $compile) {
            $scope.pendPagerOpt = {
                url: rootUrl + 'WorkItem/GetPendWorkItemList'
            };
            $scope.finishPagerOpt = {
                url: rootUrl + 'WorkItem/GetFinishWorkItemList'
            };
            $scope.handlePagerOpt = {
                url: rootUrl + 'WorkItem/GetMyHandleWorkItem'
            };

            // 催办
            $scope.notice = function (data, type) {
                $.loading('操作中...');
                $http.post(rootUrl + 'WorkItem/Notice', {
                    id: data.ProjectVersionInfoId,
                    userId: data.Operator,
                    operation: data.WorkItem,
                    type: type
                })
                .success(function (res) {
                    $.tlayer('close');
                    if (res.State) {
                        $.tips('操作成功', 3);
                    } else {
                        $.tips('操作失败：' + res.Msg, 1);
                    }
                });
            };
        }
    ]);

    // 控制器最后启动模块
    angular.bootstrap(document, ['app']);
});