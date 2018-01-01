/**
 * 文件适用项目及产品查询
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
            // 物品编码/型号自动补全选项
            $scope.fileNameAcOpt = {
                async: {
                    url: rootUrl + 'Archive/GetFileInfoByFileName',
                    dataField: 'Data',
                    searchField: 'fileName',
                    minKeywordLength: 1
                },
                width: 600,
                template: '<td>#{FileName}</td><td width="100">#{MainClassName}</td><td width="150">#{SubClassName}</td>'
            };
            // 查询条件
            $scope.param = null;
            // 文件信息
            $scope.file = null;
            // 项目列表，项目下包含产品列表
            $scope.projectList = {};

            // 从下拉列表选择文件
            $scope.selectFile = function (file) {
                $scope.param = file;
            };

            // 文件名称变化时清空已选文件
            $scope.onFileChange = function () {
                if ($scope.param) {
                    $scope.param.FileId = 0;
                    $scope.param.MainClassName = '';
                    $scope.param.SubClassName = '';
                };
            };

            // 查询
            $scope.query = function () {
                if (!$scope.param || !$scope.param.FileId) {
                    alert('请输入文件名称并从下拉列表中选择文件');
                    return;
                }
                $.loading('加载中...');
                $http.get(rootUrl + 'Archive/GetFileApplyToProjectAndProductModelList', {
                    params: {
                        fileId: $scope.param.FileId
                    }
                })
                .success(function (res) {
                    $.tlayer('close');
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    var projectList = {};
                    var project;
                    angular.forEach(res.Data, function (item) {
                        project = projectList[item.ProjectVersionInfoId] || (projectList[item.ProjectVersionInfoId] = {
                            ProjectCode: item.ProjectCode,
                            ProjectName: item.ProjectName,
                            ProjectCodeAbbr: item.ProjectCodeAbbr,
                            NoticeNo: item.NoticeNo,
                            ArchiveVersionCode: item.ArchiveVersionCode,
                            ProductList: []
                        });
                        project.ProductList.push(item);
                    });
                    $scope.projectList = projectList;
                    $scope.file = $.extend($scope.param);
                });
            };
        }
    ]);

    // 控制器最后启动模块
    angular.bootstrap(document, ['app']);
});