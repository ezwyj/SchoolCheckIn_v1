/**
 * 物品历史硬件版本处理方式清理
 */

define(['app', 'util', 'filters', 'directives'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    app.controller('SetProductHistoryDetail', [
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        '$q',
        'tlayer',
        function ($scope, $http, $templateCache, $compile, $state, $q, tlayer) {
            // 历史版本列表
            $scope.historyList = [];
            // 当前版本
            $scope.curr;
            // 归档版本号列表
            $scope.archiveVersionList = [];
            // 硬件版本列表
            $scope.hardwareRevList = [];

            // 初始化
            $scope.init = function () {
                $scope.getHistoryList();
                $scope.getArchiveVersionList();
            };

            // 获取物品硬件版本处理方式历史列表
            $scope.getHistoryList = function () {
                // 硬件版本列表
                $scope.hardwareRevList = [];
                $http.get(rootUrl + 'Product/GetProductHistory', {
                    params: {
                        id: $scope.ArchiveId,
                        itemNumber: $state.params.ItemNumber
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        return;
                    }
                    angular.forEach(res.Data, function (item) {
                        if (item.MainInfo.Id === $scope.ArchiveId) {
                            $scope.curr = item;
                            angular.forEach(item.Product, function (pro) {
                                $scope.hardwareRevList.push(pro.HardwareRev);
                            });
                        } else {
                            $scope.historyList.push(item);
                        }
                    });
                });
            };

            // 获取归档版本号列表
            $scope.getArchiveVersionList = function () {
                $http.get(rootUrl + 'Archive/GetPvmModelById', {
                    params: {
                        id: $scope.ArchiveId
                    }
                })
                .then(function (res) {
                    if (!res.data.State) {
                        return $q.reject(res);
                    }
                    return $http.get(rootUrl + 'Archive/GetArchiveVersionCode', {
                        params: {
                            projectCode: res.data.Data.ProjectCode,
                            noticeNo: res.data.Data.NoticeNo,
                            isFinish: false
                        }
                    });
                })
                .then(function (res) {
                    if (!res.data.State) {
                        return $q.reject(res);
                    }
                    $scope.archiveVersionList = res.data.Data;
                })
                .catch(function (res) {
                    if (!res.data.State) {
                        $.tips('出错了：' + res.Msg, 1);
                    }
                });
            };

            // 保存
            $scope.save = function () {
                if (!isValid($scope.curr)) return;
                $scope.desc = '';
                tlayer.content({
                    header: '说明',
                    html: $templateCache.get('layer-desc.html'),
                    scope: $scope,
                    submit: function (ins) {
                        $.loading('操作中...');
                        $http.post(rootUrl + 'Product/SaveProductHistory', {
                            json: JSON.stringify($scope.curr),
                            desc: $scope.desc
                        })
                        .success(function (res) {
                            $.tlayer('close');
                            if (res.State) {
                                $.tips('操作成功', 3);
                                $scope.getHistoryList();
                            } else {
                                $.tips('操作失败：' + res.Msg, 1);
                            }
                        });
                    }
                });                
            };

            function isValid(json) {
                var msg = [];

                angular.forEach(json.Product, function (item) {
                    // if (item.IsApplicable)
                });

                if (msg.length) {
                    $.alert('<div class="alert alert-danger">' + msg.join('<br>') + '</div>');
                    return false;
                }
                return true;
            }
        }
    ]);
});