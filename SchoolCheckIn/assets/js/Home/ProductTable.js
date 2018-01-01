/**
 * 产品分表查询
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
                cpuId: '',
                itemNumber: '',
                model: '',
                hardwareRev: '',
                projectCode: '',
                noticeNo: '',
                archiveVersionCode: ''
            };
            // 物品编码/型号自动补全选项
            $scope.autoCompleteOpt = {
                async: {
                    url: rootUrl + 'Archive/GetProductModelByFilter',
                    dataField: 'Data',
                    minKeywordLength: 2
                },
                template: '<td width="80">#{ItemNumber}</td><td>#{Model}</td>'
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
            // 硬件版本列表
            $scope.hardwareRevList = [];
            // 项目版本号列表
            $scope.projectCodeList = [];
            // 通知编号列表
            $scope.noticeNoList = [];
            // 归档版本号列表
            $scope.archiveVersionCodeList = [];
            // 过滤器
            $scope.filter = '0';

            // 初始化
            $scope.init = function () {
                // 获取用户CPUID
                $http.jsonp('http://localhost:18002/calculatorservice/GetComputerInfo', {
                    params: {
                        jsoncallback: 'JSON_CALLBACK'
                    }
                })
                .success(function (res) {
                    $scope.param.cpuId = res.CpuID;
                });
            };
            
            // 下拉列表选择物品
            $scope.selectPro = function (pro) {
                $scope.param.itemNumber = pro.ItemNumber;
                $scope.param.model = pro.Model;
                $scope.hardwareRevList = pro.HardwareRevList;
                if ($scope.hardwareRevList.length) {
                    $scope.param.hardwareRev = $scope.hardwareRevList[0];
                    $scope.onRevChange();
                }
            };

            // 产品联动
            $scope.onProChange = function () {
                $scope.param.hardwareRev = '';
                $scope.param.projectCode = '';
                $scope.param.noticeNo = '';
                $scope.param.archiveVersionCode = '';
                $scope.hardwareRevList = [];
                $scope.projectCodeList = [];
                $scope.noticeNoList = [];
                $scope.archiveVersionCodeList = [];
            };

            // 硬件版本联动
            $scope.onRevChange = function () {
                // 清空后续联动
                $scope.param.projectCode = '';
                $scope.param.noticeNo = '';
                $scope.param.archiveVersionCode = '';
                $scope.projectCodeList = [];
                $scope.noticeNoList = [];
                $scope.archiveVersionCodeList = [];
                if (!$scope.param.hardwareRev) {
                    return;
                }
                $http.get(rootUrl + 'Archive/GetProjectAndNotice', {
                    params: {
                        itemNumber: $scope.param.itemNumber,
                        hardwareRev: $scope.param.hardwareRev
                    }
                })
                .success(function (res) {
                    if (res.State) {
                        $scope.projectCodeList = res.Data.ProjectCodeList;
                        $scope.noticeNoList = res.Data.NoticeNoList;
                        if ($scope.projectCodeList.length) {
                            $scope.param.projectCode = $scope.projectCodeList[0];
                            $scope.onProjectCodeChange();
                        }
                        if ($scope.noticeNoList.length) {
                            $scope.param.noticeNo = $scope.noticeNoList[0];
                            $scope.onNoticeNoChange();
                        }
                    }
                });
            };

            // 版本号联动
            $scope.onProjectCodeChange = function () {
                // 清空后续联动
                $scope.param.noticeNo = '';
                $scope.param.archiveVersionCode = '';
                $scope.archiveVersionCodeList = [];
                if (!$scope.param.projectCode) {
                    return;
                }
                $http.get(rootUrl + 'Archive/GetArchiveVersionCode', {
                    params: {
                        projectCode: $scope.param.projectCode,
                        isFinish: true
                    }
                })
                .success(function (res) {
                    if (res.State) {
                        $scope.archiveVersionCodeList = res.Data;
                        if ($scope.archiveVersionCodeList.length) {
                            $scope.param.archiveVersionCode = $scope.archiveVersionCodeList[0];
                        }
                    }
                });
            };

            // 通知编号号联动
            $scope.onNoticeNoChange = function () {
                // 清空后续联动
                $scope.param.projectCode = '';
                $scope.param.archiveVersionCode = '';
                $scope.archiveVersionCodeList = [];
                if (!$scope.param.noticeNo) {
                    return;
                }
                $http.get(rootUrl + 'Archive/GetArchiveVersionCode', {
                    params: {
                        noticeNo: $scope.param.noticeNo,
                        isFinish: true
                    }
                })
                .success(function (res) {
                    if (res.State) {
                        $scope.archiveVersionCodeList = res.Data;
                        if ($scope.archiveVersionCodeList.length) {
                            $scope.param.archiveVersionCode = $scope.archiveVersionCodeList[0];
                        }
                    }
                });
            };

            // 查询
            $scope.query = function () {
                if (!$scope.param.archiveVersionCode) {
                    alert('查询参数不完整');
                    return;
                }
                $.loading('加载中...');
                $http.get(rootUrl + 'Archive/QueryProductAndProjectInfo', {
                    params: $scope.param
                })
                .success(function (res) {
                    $.tlayer('close');
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    $scope.mainInfo = res.Data.MainInfo;
                    $scope.pro = res.Data.PartProductInfoModel;
                    $scope.originFileList = res.Data.DetailList;
                    $scope.filter = '0';
                    $scope.filterFileList();
                });
            };

            // 过滤文件列表
            $scope.filterFileList = function () {
                $scope.fileList = [];
                angular.forEach($scope.originFileList, function (item) {
                    if ($scope.filter === '0'
                        || ($scope.filter === '1' && item.IsApply && item.IsDownload)
                        || ($scope.filter === '2' && item.IsApply && !item.IsDownload)
                        || ($scope.filter === '3' && !item.IsApply)) {
                        $scope.fileList.push(item);
                    }
                });
            };

            // 全选/取消全选
            $scope.checkAll = function (checked) {
                angular.forEach($scope.fileList, function (item) {
                    if (item.IsApply && item.IsDownload) {
                        item.IsChecked = checked;
                    }
                });
            };

            // 下载
            $scope.download = function (data, evt) {
                evt.stopPropagation();
                window.open(rootUrl + 'Security/Download?fileId=' + data.FileId + '&cpuId=' + $scope.param.cpuId + '&id=' + $scope.mainInfo.Id);
            };

            // 批量下载文件
            $scope.batchDownload = function () {
                var fileIdList = [];
                angular.forEach($scope.fileList, function (item) {
                    if (item.IsChecked) {
                        fileIdList.push(item.FileId);
                    }
                });
                if (!fileIdList.length) {
                    alert('请勾选要下载的文件');
                    return false;
                }
                window.open(rootUrl + 'Security/BatchDownload?fileIds=' + fileIdList.join(',') + '&cpuId=' + $scope.param.cpuId + '&id=' + $scope.mainInfo.Id);
            };
        }
    ]);

    // 控制器最后启动模块
    angular.bootstrap(document, ['app']);
});