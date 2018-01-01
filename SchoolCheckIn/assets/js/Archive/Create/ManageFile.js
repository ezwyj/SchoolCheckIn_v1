/**
 * 文件清单维护
 */

define(['app', 'util', 'filters', 'directives', 'services'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('ManageFile', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        'tlayer',
        'tool',
        function ($scope, $http, $templateCache, $compile, $state, tlayer, tool, $sce) {
            // 类别信息
            $scope.category = null;
            // 文件列表
            $scope.fileList = [];
            // 版本分支选项
            $scope.versionBranchOpt = {
                multi: true,
                valueField: 'Value',
                textField: 'Text',
                template: '<td>#{Text}</td>',
                separator: ';'
            };
            // 版本分支列表
            $scope.versionBranchList = [];

            // 初始化
            $scope.init = function () {
                // 获取类别信息
                $http.get(rootUrl + 'Config/GetSubClass', {
                    params: {
                        id: $state.params.SubClassId
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        return;
                    }
                    $scope.category = res.Data;
                });
                // 获取版本分支列表
                $http.get(rootUrl + 'ValueSet/GetValueItemListForUse', {
                    params: {
                        valueSetId: 37
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        return;
                    }
                    $scope.versionBranchList = res.Data;
                });
                $scope.getFileList();
            };

            // 获取文件列表
            $scope.getFileList = function () {
                $http.get(rootUrl + 'Archive/GetFileInfoList', {
                    params: {
                        id: $scope.ArchiveId,
                        subClassId: $state.params.SubClassId
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        return;
                    }
                    $scope.fileList = res.Data;
                });
            };

            // 根据文件路径获取文件信息
            $scope.getFileInfoByPath = function (path) {
                $scope.model.FileName = '';
                $scope.model.FileVersion = '';
                $scope.model.FileType = '';
                $http.get(rootUrl + 'Archive/GetFileInfoByFilePath', {
                    params: {
                        path: path
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('获取文件信息失败：' + res.Msg, 1);
                        return;
                    }
                    $scope.model.FileName = res.Data.FileName;
                    $scope.model.FileVersion = res.Data.FileVersion;
                    $scope.model.FileType = res.Data.FileType;
                })
            };

            // 增加文件
            $scope.addFile = function () {
                $scope.model = {
                    ProjectVersionInfoId: $scope.ArchiveId,
                    SubClassId: $state.params.SubClassId,
                    FilePath: '',
                    FileName: '',
                    FileVersion: '',
                    FileType: '',
                    VersionBranch: '',
                    ArchiveDesc: ''
                };
                tlayer.content({
                    header: '增加文件',
                    html: $templateCache.get('layer-upsertFile.html'),
                    scope: $scope,
                    submit: function (ins) {
                        if (!$scope.model.FileName) {
                            alert('请输入有效的文件路径');
                            return false;
                        }
                        $.loading('操作中...')
                        $http.post(rootUrl + 'Archive/SaveArchiveByFile', {
                            json: JSON.stringify($scope.model)
                        })
                        .success(function (res) {
                            $.tlayer('close');
                            if (!res.State) {
                                $.tips('操作失败：' + res.Msg, 1);
                                return;
                            }
                            $scope.getFileList();
                            $.tlayer('close', ins);
                        });
                        return false;
                    }
                });
            };

            // 编辑文件
            $scope.editFile = function (file) {
                $scope.model = {
                    Id: file.Id,
                    ProjectVersionInfoId: file.ProjectVersionInfoId,
                    SubClassId: file.SubClassId,
                    FilePath: file.FilePath,
                    FileName: file.FileName,
                    FileVersion: file.FileVersion,
                    FileType: file.FileType,
                    VersionBranch: file.VersionBranch,
                    ArchiveDesc: file.ArchiveDesc
                };
                tlayer.content({
                    header: '编辑文件',
                    html: $templateCache.get('layer-upsertFile.html'),
                    scope: $scope,
                    submit: function (ins) {
                        if (!$scope.model.FileName) {
                            alert('请输入有效的文件路径');
                            return false;
                        }
                        $.loading('操作中...')
                        $http.post(rootUrl + 'Archive/SaveArchiveByFile', {
                            json: JSON.stringify($scope.model)
                        })
                        .success(function (res) {
                            $.tlayer('close');
                            if (!res.State) {
                                $.tips('操作失败：' + res.Msg, 1);
                                return;
                            }
                            $scope.getFileList();
                            $.tlayer('close', ins);
                        });
                        return false;
                    }
                });
            };

            // 删除文件
            $scope.delFile = function (file) {
                tlayer.confirm('确定要删除吗？', function () {
                    $http.post(rootUrl + 'Archive/DeleteFileInfoById', {
                        id: $scope.ArchiveId,
                        subClassId: +$state.params.SubClassId,
                        fileId: file.Id
                    })
                    .success(function (res) {
                        if (!res.State) {
                            $.tips('操作失败：' + res.Msg, 1);
                            return;
                        }
                        $scope.getFileList();
                    });
                });
            };
        }
    ]);
});