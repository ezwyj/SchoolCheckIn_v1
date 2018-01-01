/**
 * 项目版本归档
 */

define(['app', 'util', 'filters', 'directives'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('Archive', [
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
            // 过滤器
            $scope.filter = '0';
            // 主信息
            var mainInfo;

            // 初始化
            $scope.init = function () {
                // 获取主信息
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
                    mainInfo = res.Data;
                });
                $scope.getArchiveAssignList();
            };

            // 获取文件类别列表
            $scope.getArchiveAssignList = function () {
                $.loading('加载中...');
                $http.get(rootUrl + 'Archive/InitArchiveLiableUserAssign', {
                    params: {
                        id: $scope.ArchiveId,
                        filter: $scope.filter
                    }
                })
                .success(function (res) {
                    $.tlayer('close');
                    if (res.State) {
                        angular.forEach(res.Data, function (item) {
                            item.IsOperator = item.ArchiveUserId === OP_CONFIG.badge;
                        });
                        $scope.archiveAssignList = res.Data;
                    } else {
                        $.tips('出错了：' + res.Msg, 1);
                    }
                });
            };

            // 全选/取消全选
            $scope.checkAll = function (checked) {
                angular.forEach($scope.archiveAssignList, function (item) {
                    if (item.IsOperator) {
                        item.IsChecked = checked;
                    }
                });
            };

            // 设置是否适用
            $scope.setIsApply = function (isApply) {
                var idList = [];

                angular.forEach($scope.archiveAssignList, function (item) {
                    if (item.IsOperator && item.IsChecked) {
                        idList.push(item.Id);
                    }
                });
                if (!idList.length) {
                    alert('请勾选文件小类');
                    return;
                }
                $.loading('操作中...');
                $http.post(rootUrl + 'Archive/SetIsApply', {
                    assignIds: idList.join(','),
                    isApply: isApply
                })
                .success(function (res) {
                    $.tlayer('close');
                    if (!res.State) {
                        $.tips('操作失败：' + res.Msg, 1);
                        return;
                    }
                    $scope.getArchiveAssignList();
                    $scope.IsCheckedAll = false;
                });
            };
            
            // 提交
            $scope.submit = function () {
                tlayer.confirm('确定要提交吗？', function () {
                    $.tlayer('close');
                    $.loading('操作中...');
                    $http.post(rootUrl + 'Archive/SubmitArchiveByFile', {
                        id: $scope.ArchiveId
                    })
                    .success(function (res) {
                        $.tlayer('close');
                        if (res.State) {
                            $.tips('操作成功', 3, function () {
                                tool.closeWindow();
                            });
                        } else {
                            $.tips('操作失败：' + res.Msg, 1);
                        }
                    });
                });
            };

            // 导入来源版本文件
            $scope.importFile = function () {
                $scope.selectParam = {
                    projectCode: mainInfo.SourceProjectCode
                };
                if ($scope.selectParam.projectCode) {
                    $scope.getProjectList();
                }
                $.content({
                    header: '导入来源版本文件',
                    content: {
                        width: 800,
                        html: $templateCache.get('layer-selectProject.html')
                    },
                    footer: [{
                        text: '关闭'
                    }],
                    onInit: function () {
                        $compile(this)($scope);
                        $scope.$apply();
                    }
                });
            };
            
            // 搜索项目列表
            $scope.getProjectList = function () {
                if (!$scope.selectParam.projectCode) {
                    alert('请输入来源版本号');
                    return;
                }
                $http.get(rootUrl + 'Archive/GetMainInfoModels', {
                    params: $scope.selectParam
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.projectList = res.Data;
                    if (!res.Data.length) {
                        $.tips('该来源版本号暂无归档记录', 1);
                    }
                });
            };

            // 选定项目确定导入
            $scope.selectProject = function (data) {
                $.tlayer('close');
                $.loading('操作中...');
                $http.post(rootUrl + 'Archive/CopyFileAndProductAssign', {
                    sourceId: data.Id,
                    curId: $scope.ArchiveId
                })
                .success(function (res) {
                    $.tlayer('close');
                    if (res.State) {
                        $.tips('操作成功', 3);
                        $scope.getArchiveAssignList();
                    } else {
                        $.tips('操作失败：' + res.Msg, 1);
                    }
                });
            };
            
            // 获取导出内容
            $scope.getExportContent = function () {
                return $http.get(rootUrl + 'Archive/ExportFileScope', {
                    params: {
                        id: $scope.ArchiveId
                    }
                })
                .success(function (res) {
                    if (res.State) {
                        $scope.exportModel = res.Data;
                    }
                });
            };
        }
    ]);
});