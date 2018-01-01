/**
 * 发起归档
 */

define(['app', 'util', 'filters', 'directives'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    // 发起归档
    app.controller('StartArchive', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        function ($scope, $http, $templateCache, $compile, $state) {
            // 手册同步时间候选列表（单位月）
            $scope.manualSyncTimeMap = {
                0: '立即',
                1: '一个月',
                2: '两个月',
                3: '三个月',
                4: '四个月',
                5: '五个月',
                6: '六个月'
            };
            // 归档数据model
            $scope.mainInfoModel = null;
            // 主体权限分配列表
            $scope.rightAssignList = [];
            // 主体权限分配日志记录
            $scope.rightAssignLogList = [];
            // 主体权限分配日志记录分页配置
            $scope.rightAssignLogPagerOpt = {
                url: rootUrl + 'Archive/GetAssignLog',
                data: {
                    id: $scope.ArchiveId
                },
                localPage: true
            };
            
            // 初始化
            $scope.init = function () {
                $http.get(rootUrl + 'Archive/GetStartArchiveModel', {
                    params: {
                        id: $scope.ArchiveId
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.mainInfoModel = res.Data.PvmMainInfoModel;
                    $scope.rightAssignList = res.Data.RightAssignList;
                });
            };

            // 查看日志记录
            $scope.viewRightAssignLog = function () {
                $.content({
                    header: '主体权限分配日志记录',
                    content: {
                        html: $templateCache.get('layer-rightAssignLog.html')
                    },
                    onInit: function () {
                        $compile(this)($scope);
                        $scope.$apply();
                    }
                });
            };
        }
    ]);
});