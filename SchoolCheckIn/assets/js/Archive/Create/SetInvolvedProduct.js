/**
 * 项目版本涉及物品及硬件版本范围设置
 */

define(['app', 'util', 'filters', 'directives', 'ztree'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;
    var apiUrl = OP_CONFIG.apiUrl;

    app.controller('SetInvolvedProduct', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        'tlayer',
        'tool',
        function ($scope, $http, $templateCache, $compile, $state, tlayer, tool) {
            // 已选择产品列表
            $scope.proList = [];
            // 产品自动补全配置
            $scope.acProOpt = {
                async: {
                    url: rootUrl + 'Product/GetCpWithRevisionList',
                    data: function () {
                        return {
                            onlySoftware: $scope.onlySoftware,
                            onlyChengpin: $scope.onlyChengpin
                        };
                    },
                    dataType: 'jsonp',
                    dataField: null,
                    searchField: 'name',
                    minKeywordLength: 1
                },
                width: 500,
                template: '<td width="80">#{ItemNumber}</td><td>#{Model}</td><td width="60">#{Attributes.Revision}</td><td>#{Attributes.Cpxl}</td>'
            };
            $scope.usHardwareRevOpt = {
                template: '<td width="50">#{}</td>',
                multi: true
            };
            // 只显示含软件
            $scope.onlySoftware = true;
            // 只显示成品、OEM、ODM
            $scope.onlyChengpin = true;
            var mainInfo;

            // 初始化
            $scope.init = function () {
                var treeObj;
                // 产品树设置
                var setting = {
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: 'ID',
                            pIdKey: 'ParentID'
                        },
                        key: {
                            name: 'Name'
                        }
                    },
                    check: {
                        enable: true,
                        chkboxType: { 'Y': '', 'N': '' }
                    },
                    callback: {
                        onExpand: function (event, treeId, treeNode) {
                            if (treeNode.Type != 'Cpxl' && treeNode.children) {
                                return;
                            }
                            if (treeNode.Type === 'Cpxl' && treeNode.childrenDataList) {
                                dataList = filterCpData(treeNode.childrenDataList);
                                treeObj.removeChildNodes(treeNode);
                                treeObj.addNodes(treeNode, dataList);
                                return;
                            }
                            treeNode.icon = rootUrl + 'assets/img/layer-loading.gif';
                            treeObj.updateNode(treeNode);
                            var url;

                            if (treeNode.Type == 'Cpx') {
                                url = apiUrl + 'Selector/Product/GetCpxlList?cpxid=' + treeNode.ID;
                            } else if (treeNode.Type == 'Cpxl') {
                                url = rootUrl + 'Product/GetCpList?cpxlid=' + treeNode.ID + '&onlySoftware=' + $scope.onlySoftware + '&onlyChengpin=' + $scope.onlyChengpin;
                            } else if (treeNode.Type == 'Cp') {
                                url = apiUrl + 'Selector/Product/GetRevision?itemNumber=' + treeNode.ID;
                            }

                            $.ajax({
                                url: url,
                                dataType: 'jsonp',
                                success: function (dataList) {
                                    dataList = dataList || [];
                                    for (var i = 0, l = dataList.length; i < l; i++) {
                                        var data = dataList[i];

                                        // 硬件版本层
                                        if (!data.Type) {
                                            data = {
                                                ID: data,
                                                Name: data,
                                                ParentID: treeNode.ID,
                                                Type: 'Revision'
                                            }
                                            dataList[i] = data;
                                        }
                                        if (data.Type == 'Revision') {
                                            data.isParent = false;
                                            data.isLeaf = true;
                                            data.icon = rootUrl + 'assets/img/pro.png';
                                        } else {
                                            data.isParent = true;
                                            data.nocheck = true;
                                            data.icon = rootUrl + 'assets/img/file.png';
                                        }
                                    }
                                    if (treeNode.Type === 'Cpxl') {
                                        treeNode.childrenDataList = dataList;
                                        dataList = filterCpData(dataList);
                                    }
                                    treeObj.addNodes(treeNode, dataList);
                                    treeNode.icon = rootUrl + 'assets/img/file.png';
                                    treeObj.updateNode(treeNode);
                                }
                            });
                        },
                        onCheck: function (event, treeId, treeNode) {
                            if (treeNode.checked) {
                                var pro = angular.copy(treeNode.getParentNode().OriginData);
                                pro.Attributes.Revision = treeNode.Name;
                                $scope.selectPro(pro);
                                $scope.$apply();
                            }
                        }
                    }
                };
                // 产品树初始化
                $http.jsonp(apiUrl + 'Selector/Product/GetCpxList', {
                    params: {
                        callback: 'JSON_CALLBACK'
                    }
                })
                .success(function (dataList) {
                    if (dataList && dataList.length) {
                        for (var i = 0, l = dataList.length; i < l; i++) {
                            var data = dataList[i];

                            data.isParent = true;
                            data.nocheck = true;
                            data.icon = rootUrl + 'assets/img/file.png';
                        }

                        treeObj = $.fn.zTree.init($("#product-tree"), setting, dataList);
                    }
                });
                // 获取已有产品列表
                $scope.getProList();
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

                function filterCpData(dataList) {
                    var resultList = [];

                    for (var i = 0, l = dataList.length; i < l; i++) {
                        var data = dataList[i];

                        if ($scope.onlySoftware && data.OriginData.Attributes && data.OriginData.Attributes.SoftwareFlag === 'N') continue;
                        if ($scope.onlyChengpin && data.OriginData.Attributes && data.OriginData.Attributes.ChengpinFlag === 'N') continue;
                        resultList.push(data);
                    }
                    return resultList;
                }
            };

            // 获取已有产品
            $scope.getProList = function () {
                $http.get(rootUrl + 'Product/GetProducts', {
                    params: {
                        id: $scope.ArchiveId,
                        isSubmited: false,
                        isReviewed: false
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.proList = res.Data;
                });
            };

            // 选中产品
            $scope.selectPro = function (data) {
                var index = -1;
                var item;

                for (var i in $scope.proList) {
                    item = $scope.proList[i];
                    if (item.ItemNumber === data.ItemNumber && item.HardwareRev === data.Attributes.Revision) {
                        index = i;
                        break;
                    }
                }
                if (index === -1) {
                    $scope.proList.push({
                        ItemNumber: data.ItemNumber,
                        Model: data.Model,
                        Cpxl: data.Attributes.Cpxl,
                        Cpx: data.Attributes.Cpx,
                        SaleVersion: data.SaleVersion,
                        State: data.State,
                        SaleState: data.SaleState,
                        SelfDevFlag: data.SelfDevFlag,
                        Cplx: data.Attributes.Cplx,
                        HardwareRev: data.Attributes.Revision
                    });
                }
            };

            // 删除产品，分前台删除和后台删除，如果有需要后台删除的产品，则需等待后台删除成功之后才能前台删除
            $scope.delPro = function () {
                var backDelProList = []; // 待后台删除产品
                var proList = []; // 所有待删除产品

                // 最终删除
                function finalDelPro(proList) {
                    var lastList = [];
                    var idx;

                    angular.forEach($scope.proList, function (item) {
                        idx = -1;
                        for (var i in proList) {
                            if (proList[i].ItemNumber === item.ItemNumber && proList[i].HardwareRev === item.HardwareRev) {
                                idx = i;
                            }
                        }
                        if (idx === -1) {
                            lastList.push(item);
                        }
                    });
                    $scope.proList = lastList;
                }

                // 遍历产品，通过是否有Id值区分前台删除和后台删除
                angular.forEach($scope.proList, function (item) {
                    if (item.IsChecked) {
                        if (item.Id) {
                            backDelProList.push(item.Id);
                        }
                        proList.push(item);
                    }
                });
                if (backDelProList.length) {
                    $.loading('操作中...');
                    $http.post(rootUrl + 'Product/DeleteProducts', {
                        id: $scope.ArchiveId,
                        json: JSON.stringify(backDelProList)
                    })
                    .success(function (res) {
                        $.tlayer('close');
                        if (!res.State) {
                            $.tips('操作失败：' + res.Msg, 1);
                            return;
                        }
                        finalDelPro(proList);
                    });
                } else {
                    finalDelPro(proList);
                }
            };

            // 导入来源版本物品清单
            $scope.importPro = function () {
                $scope.selectParam = {
                    projectCode: mainInfo.SourceProjectCode
                };
                $scope.getProjectList();
                $.content({
                    header: '导入来源版本物品清单',
                    content: {
                        width: 800,
                        html: $templateCache.get('layer-selectProject.html')
                    },
                    onInit: function () {
                        $compile(this)($scope);
                        $scope.$apply();
                    }
                });
            };

            // 搜索项目列表
            $scope.getProjectList = function () {
                if (!$scope.selectParam.projectCode) return;
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
                $http.get(rootUrl + 'Product/GetProducts', {
                    params: {
                        id: data.Id,
                        isSubmited: true,
                        isReviewed: true
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    angular.forEach(res.Data, function (item) {
                        addPro(item);
                    });
                });

                function addPro(data) {
                    var index = -1;
                    var item;

                    for (var i in $scope.proList) {
                        item = $scope.proList[i];
                        if (item.ItemNumber === data.ItemNumber && item.HardwareRev === data.HardwareRev) {
                            index = i;
                            break;
                        }
                    }
                    if (index === -1) {
                        $scope.proList.push({
                            ItemNumber: data.ItemNumber,
                            Model: data.Model,
                            SaleVersion: data.SaleVersion,
                            State: data.State,
                            SaleState: data.SaleState,
                            SelfDevFlag: data.SelfDevFlag,
                            Cplx: data.Cplx,
                            HardwareRev: data.HardwareRev
                        });
                    }
                }
            };

            // 全选/取消全选
            $scope.checkAll = function (checked) {
                angular.forEach($scope.proList, function (item) {
                    if (!item.ReviewTime) {
                        item.IsChecked = checked;
                    }
                });
            };
            
            // 保存
            $scope.save = function () {
                if (!$scope.proList.length) {
                    alert('请至少选择一个产品');
                    return;
                }
                $.loading('操作中...');
                $http.post(rootUrl + 'Product/SaveProducts', {
                    id: $scope.ArchiveId,
                    json: JSON.stringify($scope.proList)
                })
                .success(function (res) {
                    $.tlayer('close');
                    if (!res.State) {
                        $.tips('操作失败：' + res.Msg, 1);
                        return;
                    }
                    $.tips('操作成功', 3);
                    $scope.getProList();
                });
            };

            // 提交
            $scope.submit = function () {
                var isPass = false;
                var item;

                for (var i in $scope.proList) {
                    item = $scope.proList[i];
                    if (!item.SubmitTime) {
                        isPass = true;
                        break;
                    }
                }
                if (!isPass) {
                    alert('无需执行提交操作');
                    return;
                }
                tlayer.confirm('确定要提交？', function () {
                    $.loading('操作中...');
                    $http.post(rootUrl + 'Product/SubmitProducts', {
                        id: $scope.ArchiveId,
                        json: JSON.stringify($scope.proList)
                    })
                    .success(function (res) {
                        $.tlayer('close');
                        if (!res.State) {
                            $.tips('操作失败：' + res.Msg, 1);
                            return;
                        }
                        $.tips('操作成功', 3);
                        $scope.getProList();
                    });
                });
            };
        }
    ]);
});