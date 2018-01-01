/**
 * 分文件类别归档
 */

define(['app', 'util', 'filters', 'directives', 'services'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('ArchiveByFileCategory', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        'tlayer',
        function ($scope, $http, $templateCache, $compile, $state, tlayer) {
            // 文件列表
            $scope.fileList = [];
            // 产品列表
            $scope.proList = [];
            // 文件列表筛选
            $scope.fileFilter = '0';
            // 当前查看文件Id
            var viewFileId = null;

            // 初始化
            $scope.init = function () {
                $scope.getFileList();
            };

            // 获取文件列表
            $scope.getFileList = function () {
                $http.get(rootUrl + 'Archive/InitArchiveByFile', {
                    params: {
                        id: $scope.ArchiveId,
                        filter: $scope.fileFilter
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.fileList = res.Data;
                });
            };

            // 获取产品列表
            $scope.getProList = function () {
                var fileIdList = [];

                angular.forEach($scope.fileList, function (item) {
                    if (item.IsChecked) {
                        fileIdList.push(item.FileId);
                    }
                });
                if (!fileIdList.length) {
                    $scope.proList = [];
                    return;
                }
                $.loading('加载中...');
                $http.get(rootUrl + 'Archive/InitCheckApplicableProductAssign', {
                    params: {
                        id: $scope.ArchiveId,
                        fileIds: fileIdList.join(',')
                    }
                })
                .success(function (res) {
                    $.tlayer('close');
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.proList = res.Data;
                });
            };
            
            // 全选/取消全选文件
            $scope.checkAllFile = function (checked) {
                angular.forEach($scope.fileList, function (item) {
                    item.IsChecked = checked;
                });
                $scope.getProList();
            };

            // 全选/取消全选产品
            $scope.checkAllPro = function (checked) {
                angular.forEach($scope.proList, function (item) {
                    item.IsChecked = checked;
                });
            };

            // 保存/提交归档
            $scope.saveAssign = function (type) {
                var json = {
                    FileIdList: [],
                    ProductIdList: [],
                    ArchiveDesc: ''
                };

                angular.forEach($scope.fileList, function (item) {
                    if (item.IsChecked) {
                        json.FileIdList.push(item.FileId);
                    }
                });
                angular.forEach($scope.proList, function (item) {
                    if (item.IsChecked) {
                        json.ProductIdList.push(item.ProductId);
                    }
                });
                if (type === '保存' && !json.FileIdList.length) {
                    alert('请勾选文件');
                    return false;
                }
                if (type === '保存' && !json.ProductIdList.length) {
                    alert('请勾选产品');
                    return false;
                }
                if (json.ProductIdList.length) {
                    $scope.desc = '';
                    tlayer.content({
                        header: type + '归档',
                        html: $templateCache.get('layer-desc.html'),
                        scope: $scope,
                        submit: function (ins) {
                            json.ArchiveDesc = $scope.desc;
                            if (type === '保存') {
                                action(ins);
                            } else {
                                tlayer.confirm('执行整体提交，系统将截止当前已分配适用产品范围但尚未提交的归档事务统一执行提交操作，请确认', function () {
                                    action(ins);
                                });
                            }
                            return false;
                        }
                    });
                } else {
                    tlayer.confirm('执行整体提交，系统将截止当前已分配适用产品范围但尚未提交的归档事务统一执行提交操作，请确认', function () {
                        action();
                    });
                }

                function action(ins) {
                    var url = rootUrl + 'Archive/' + (type === '保存' ? 'SaveApplicableProductAssignInfo' : 'SubmitApplicableProductAssignInfo');
                    $.loading('操作中...');
                    $http.post(url, {
                        id: $scope.ArchiveId,
                        json: JSON.stringify(json),
                        type: 'ByFile'
                    })
                    .success(function (res) {
                        $.tlayer('close');
                        if (!res.State) {
                            $.tips('操作失败：' + res.Msg, 1);
                            return;
                        }
                        if (ins) {
                            $.tlayer('close', ins);
                        }
                        $scope.getFileList();
                        $scope.proList = [];
                        $scope.isCheckedAllFile = false;
                        $scope.isCheckedAllPro = false;
                    });
                }
            };

            // 获取产品的适用省份范围
            $scope.getSuitableProvince = function (pro) {
                if (pro.ProvinceList) {
                    return;
                }
                setTimeout(function () {
                    pro.ProvinceList = [{
                        Code: '123',
                        Name: '四川省'
                    }, {
                        Code: '123',
                        Name: '贵州省'
                    }, {
                        Code: '123',
                        Name: '云南省'
                    }];
                    $scope.$apply();
                }, 500);
            };

            // 查看文件适用产品
            $scope.viewAssignProList = function (file) {
                $scope.assignFilter = '0';
                viewFileId = file.FileId;
                $.content({
                    header: '适用产品',
                    content: {
                        width: 1100,
                        html: $templateCache.get('layer-viewAssignProList.html')
                    },
                    onInit: function () {
                        $compile(this)($scope);
                        $scope.$apply();
                    }
                });
                $scope.getAssignProList();
            };

            // 获取分配产品列表
            $scope.getAssignProList = function () {
                $scope.assignProList = [];
                $.loading('加载中...');
                $http.get(rootUrl + 'Archive/ArchiveApplicableProductAssignInfoFilter', {
                    params: {
                        id: $scope.ArchiveId,
                        fileId: viewFileId,
                        filter: $scope.assignFilter
                    }
                })
                .success(function (res) {
                    $.tlayer('close');
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.assignProList = res.Data;                    
                });
            };
            
            // 全选/取消全选产品
            $scope.checkAllAssign = function (checked) {
                angular.forEach($scope.assignProList, function (item) {
                    if (!item.SubmitTime) {
                        item.IsChecked = checked;
                    }
                });
            };

            // 提交分配产品复核
            $scope.submitAssign = function () {
                var assignIdList = [];

                angular.forEach($scope.assignProList, function (item) {
                    if (item.IsChecked) {
                        assignIdList.push(item.Id);
                    }
                });
                if (!assignIdList.length) {
                    alert('请勾选产品');
                    return;
                }
                $.loading('操作中...');
                $http.post(rootUrl + 'Archive/SubmitApplicableProductAssignInfoSingle', {
                    id: $scope.ArchiveId,
                    assignIds: assignIdList.join(',')
                })
                .success(function (res) {
                    $.tlayer('close');
                    if (!res.State) {
                        $.tips('操作失败：' + res.Msg, 1);
                        return;
                    }
                    $scope.getAssignProList();
                    $scope.getFileList();
                });
            };

            // 删除分配产品
            $scope.delAssign = function (assign) {
                $http.post(rootUrl + 'Archive/DeleteProductAssignInfoById', {
                    assignId: assign.Id
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('删除失败：' + res.Msg, 1);
                        return;
                    }
                    $scope.getAssignProList();
                    $scope.getFileList();
                });
            };

            // 通知复核
            $scope.noticeReview = function () {
                $http.post(rootUrl + 'Archive/ReviewNoticeByFile', {
                    id: $scope.ArchiveId
                })
                .success(function (res) {
                    if (res.State) {
                        $.tips('操作成功', 3);
                    } else {
                        $.tips('操作失败：' + res.Msg, 1);
                    }
                });
            };
        }
    ]);
});