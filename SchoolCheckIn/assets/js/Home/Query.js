/**
 * 项目版本综合查询
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
            // 查询参数
            $scope.param = {
                ProjectCode: '',
                ProjectName: '',
                ProjectCodeAbbr: '',
                CPX: '',
                ProjectManager: '',
                SourceProjectCode: '',
                NoticeNo: '',
                ArchiveStatus: '-1',
                ArchiveStartTime: '',
                ArchiveEndTime: ''
            };
            // 分页配置
            $scope.pagerOpt = {
                url: rootUrl + 'Archive/GetProjectInfoList',
                data: function () {
                    return {
                        json: JSON.stringify($scope.param)
                    };
                },
                beforeSend: function () {
                    $.loading('加载中...');
                },
                complete: function () {
                    $.tlayer('close');
                }
            };
            // 归档状态列表
            $scope.archiveStatusList = [
                {
                    key: '-1',
                    value: '全部'
                },
                {
                    key: '-0',
                    value: '归档发起中'
                },
                {
                    key: '1',
                    value: '文件归档中'
                },
                {
                    key: '2',
                    value: '完整性审核中'
                },
                {
                    key: '5',
                    value: '成果处审核中'
                },
                {
                    key: '3',
                    value: '已完结'
                },
                {
                    key: '4',
                    value: '已删除'
                }
            ];

            // 查询
            $scope.query = function (pageIndex) {
                var sDate = new Date($scope.param.ArchiveStartTime);
                var eDate = new Date($scope.param.ArchiveEndTime);

                if (+sDate && +eDate && sDate > eDate) {
                    alert('发布开始时间不能大于结束时间');
                    return;
                }
                $scope.requestData(pageIndex);
            };

            // 导出
            $scope.exportExcel = function () {
                var sDate = new Date($scope.param.ArchiveStartTime);
                var eDate = new Date($scope.param.ArchiveEndTime);

                if (+sDate && +eDate && sDate > eDate) {
                    alert('归档开始时间不能大于结束时间');
                    return;
                }

                return {
                    json: JSON.stringify($scope.param)
                };
            };
        }
    ]);

    // 控制器最后启动模块
    angular.bootstrap(document, ['app']);
});