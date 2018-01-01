/**
 * 分产品归档
 */

define(['app', 'util', 'filters', 'directives'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('ArchiveByProduct', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        'tlayer',
        function ($scope, $http, $templateCache, $compile, $state, tlayer) {
            // 产品列表
            $scope.proList = [];
            // 文件列表
            $scope.fileList = [];
            // 物品列表筛选
            $scope.proFilter = '0';
            // 物品编码/型号自动补全选项
            $scope.autoCompleteOpt = {
                async: {
                    url: rootUrl + 'Archive/GetProductInfoByFilter',
                    dataField: 'Data',
                    minKeywordLength: 2
                },
                width: 400,
                template: '<td width="80">#{ItemNumber}</td><td>#{Model}</td><td width="150">#{ProjectCode}</td>'
            };
            $scope.itemNumberOpt = $.extend(true, {}, $scope.autoCompleteOpt, {
                async: {
                    searchField: 'itemNumber'
                }
            });
            $scope.modelOpt = $.extend(true, {}, $scope.autoCompleteOpt, {
                async: {
                    searchField: 'model'
                }
            });
            // 来源物品
            $scope.sourcePro = null;
            // 来源物品文件列表
            $scope.sourceFileList = [];
            // 当前查看产品Id
            var viewProId = null;
            var importProductIdList = [];

            // 初始化
            $scope.init = function () {
                $scope.getProList();
            };

            // 获取产品列表
            $scope.getProList = function () {
                $.loading('加载中...');
                $http.get(rootUrl + 'Archive/InitProductInfoAssign', {
                    params: {
                        id: $scope.ArchiveId,
                        filter: $scope.proFilter
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
            
            // 获取文件列表
            $scope.getFileList = function () {
                var proIdList = [];

                angular.forEach($scope.proList, function (item) {
                    if (item.IsChecked) {
                        proIdList.push(item.ProductId);
                    }
                });
                if (!proIdList.length) {
                    $scope.fileList = [];
                    return;
                }
                $.loading('加载中...')
                $http.get(rootUrl + 'Archive/InitArchiveByProduct', {
                    params: {
                        id: $scope.ArchiveId,
                        productIds: proIdList.join(',')
                    }
                })
                .success(function (res) {
                    $.tlayer('close');
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.fileList = res.Data;
                });
            };

            // 全选/取消全选产品
            $scope.checkAllPro = function (checked) {
                angular.forEach($scope.proList, function (item) {
                    item.IsChecked = checked;
                });
                $scope.getFileList();
            };

            // 全选/取消全选文件
            $scope.checkAllFile = function (checked) {
                angular.forEach($scope.fileList, function (item) {
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
                if (type === '保存' && !json.ProductIdList.length) {
                    alert('请勾选产品');
                    return false;
                }
                if (type === '保存' && !json.FileIdList.length) {
                    alert('请勾选文件');
                    return false;
                }
                if (json.FileIdList.length) {
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
                                tlayer.confirm('执行整体提交，系统将截止当前已分配文件列表但尚未提交的归档事务统一执行提交操作，请确认', function () {
                                    action(ins);
                                });
                            }
                            return false;
                        }
                    });
                } else {
                    tlayer.confirm('执行整体提交，系统将截止当前已分配文件列表但尚未提交的归档事务统一执行提交操作，请确认', function () {
                        action();
                    });
                }                

                function action(ins) {
                    var url = rootUrl + 'Archive/' + (type === '保存' ? 'SaveApplicableProductAssignInfo' : 'SubmitApplicableProductAssignInfo');
                    $.loading('操作中...');
                    $http.post(url, {
                        id: $scope.ArchiveId,
                        json: JSON.stringify(json),
                        type: 'ByProduct'
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
                        $scope.getProList();
                        $scope.fileList = [];
                        $scope.IsCheckedAllFile = false;
                        $scope.IsCheckedAllPro = false;
                    });
                }
            };

            // 查看产品配套文件
            $scope.viewAssignFileList = function (pro) {
                $scope.assignFilter = '0';
                viewProId = pro.ProductId;
                $.content({
                    header: '配套文件',
                    content: {
                        width: 1300,
                        html: $templateCache.get('layer-viewAssignFileList.html')
                    },
                    onInit: function () {
                        $compile(this)($scope);
                        $scope.$apply();
                    }
                });
                $scope.getAssignFileList();
            };

            // 获取配套文件列表
            $scope.getAssignFileList = function () {
                $scope.assignFileList = [];
                $.loading('加载中...');
                $http.get(rootUrl + 'Archive/GetAssignInfoBySingleProductFilter', {
                    params: {
                        id: $scope.ArchiveId,
                        productId: viewProId,
                        filter: $scope.assignFilter
                    }
                })
                .success(function (res) {
                    $.tlayer('close');
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.assignFileList = res.Data;
                });
            };

            // 全选/取消全选产品
            $scope.checkAllAssign = function (checked) {
                angular.forEach($scope.assignFileList, function (item) {
                    if (!item.SubmitTime) {
                        item.IsChecked = checked;
                    }
                });
            };

            // 提交配套文件复核
            $scope.submitAssign = function () {
                var assignIdList = [];

                angular.forEach($scope.assignFileList, function (item) {
                    if (item.IsChecked) {
                        assignIdList.push(item.Id);
                    }
                });
                if (!assignIdList.length) {
                    alert('请勾选文件');
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
                    $scope.getAssignFileList();
                    $scope.getProList();
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
                    $scope.getAssignFileList();
                });
            };
            
            // 导入来源物品文件清单
            $scope.importFile = function () {
                importProductIdList = [];
                angular.forEach($scope.proList, function (item) {
                    if (item.IsChecked) {
                        importProductIdList.push(item.ProductId);
                    }
                });
                if (!importProductIdList.length) {
                    alert('请勾选产品');
                    return;
                }
                tlayer.content({
                    width: 1000,
                    header: '导入来源物品清单',
                    html: $templateCache.get('layer-importFile.html'),
                    scope: $scope,
                    submit: function (ins) {
                        return submitImportFile(ins);
                    }
                });

                // 导入
                function submitImportFile(ins) {
                    $scope.importModel = {
                        FileIdList: [],
                        ProductIdList: importProductIdList,
                        ArchiveDesc: ''
                    };
                    angular.forEach($scope.sourceFileList, function (item) {
                        if (item.IsChecked) {
                            $scope.importModel.FileIdList.push(item.FileId);
                        }
                    });
                    if (!$scope.importModel.FileIdList.length) {
                        alert('请勾选文件');
                        return false;
                    }
                    tlayer.content({
                        header: '导入说明',
                        html: $templateCache.get('layer-importFileDesc.html'),
                        scope: $scope,
                        submit: function (ins2) {
                            $.loading('操作中...');
                            $http.post(rootUrl + 'Archive/CopyProductAndFileRelation', {
                                id: $scope.ArchiveId,
                                json: JSON.stringify($scope.importModel)
                            })
                            .success(function (res) {
                                $.tlayer('close');
                                if (res.State) {
                                    $.tlayer('close', ins);
                                    if (res.Msg) {
                                        $.tips('操作成功：' + res.Msg, 3);
                                    } else {
                                        $.tips('操作成功', 3);
                                    }
                                    $scope.getProList();
                                } else {
                                    $.tips('操作失败：' + res.Msg, 1);
                                }
                            });
                        }
                    });
                    return false;
                };
            };

            // 下拉列表选择物品
            $scope.selectSourcePro = function (pro) {
                $scope.sourcePro = pro;
            };

            // 物品变化时清除已选择的物品
            $scope.clearSourcePro = function () {
                if ($scope.sourcePro) {
                    $scope.sourcePro.ProductId = null;
                    $scope.sourcePro.ProjectCode = null;
                    $scope.sourcePro.ProjectName = null;
                    $scope.sourcePro.NoticeNo = null;
                    $scope.sourcePro.ArchiveVersionCode = null;
                }
            };

            // 查询
            $scope.query = function () {
                if (!$scope.sourcePro || !$scope.sourcePro.ProductId) {
                    alert('查询参数不完整，请输入物品编码或物品型号并下拉列表中选择物品');
                    return;
                }
                $http.get(rootUrl + 'Archive/QueryFileInfoList', {
                    params: {
                        productId: $scope.sourcePro.ProductId,
                        id: $scope.ArchiveId
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.sourceFileList = res.Data;
                });
            };

            // 来源物品配套文件全选/取消全选
            $scope.checkAllSourceFile = function (checked) {
                angular.forEach($scope.sourceFileList, function (item) {
                    if (item.FileName) {
                        item.IsChecked = checked;
                    }
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