/**
 * AngularJS 服务集
 */

define(['app', 'util'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    // 弹出窗服务
    app.factory('tlayer', [
        '$q',
        '$compile',
        function ($q, $compile) {
            // 内容弹出窗
            function content(opt) {
                return $.content({
                    header: opt.header,
                    content: {
                        width: opt.width,
                        height: opt.height,
                        html: opt.html
                    },
                    footer: [{
                        text: '确定',
                        style: 'success',
                        callback: function () {
                            var ret = opt.submit && opt.submit(this);
                            opt.scope.$apply();
                            return ret;
                        }
                    }, {
                        text: '取消',
                        callback: function () {
                            opt.cancel && opt.cancel();
                            opt.scope.$apply();
                        }
                    }],
                    onInit: function () {
                        $compile(this)(opt.scope);
                        opt.scope.$apply();
                    }
                });
            }

            // 确认框
            function confirm(msg, callback) {
                return $.confirm(msg, function (result) {
                    if (result) {
                        callback();
                    }
                });
            }
            
            // 禁用按钮
            function disableBtn(ins) {
                $('.layer-box-footer .btn', ins).prop('disabled', true);
            }

            // 启用按钮
            function enableBtn(ins) {
                $('.layer-box-footer .btn', ins).prop('disabled', false);
            }

            return {
                content: content,
                confirm: confirm,
                disableBtn: disableBtn,
                enableBtn: enableBtn
            };
        }
    ]);
    // util服务
    app.factory('tool', [
        function () {
            // 关闭窗口
            function closeWindow() {
                try {
                    if (window.opener) {
                        window.opener.location.reload();
                    }
                    window.open('', '_self');
                    window.close();
                } catch (e) {
                    window.location.href = rootUrl;
                }
            }

            return {
                closeWindow: closeWindow
            };
        }
    ]);
    // 身份认证相关服务
    app.factory('auth', [
        '$q',
        '$http',
        '$rootScope',
        function ($q, $http, $rootScope) {
            function isOperator() {
                var deferred = $q.defer();
                
                // 开始发起归档页面不需要判断
                if (!$rootScope.ArchiveId) {
                    if ($rootScope.workItem === OP_CONFIG.pathMap.StartArchive) {
                        deferred.resolve();
                    } else {
                        location.href = $rootScope.createUrl;
                    }
                } else {
                    $http.get(rootUrl + 'Archive/ButtonRightControl', {
                        params: {
                            id: $rootScope.ArchiveId,
                            workItemEnum: $rootScope.workItem
                        }
                    })
                    .success(function (res) {
                        if (!res.State) {
                            $.tips('出错了：' + res.Msg, 1);
                            return;
                        }
                        $rootScope.isOperator = res.Data;
                        // 访问归档页时，如果不是归档人则跳转到详情页
                        if (location.pathname.indexOf($rootScope.createUrl) > -1 && !res.Data) {
                            location.href = $rootScope.viewUrl;
                            return;
                        }
                        deferred.resolve();
                    });
                }

                return deferred.promise;
            }

            function isArchiveUser(subClassId) {
                var deferred = $q.defer();

                $http.get(rootUrl + 'Archive/IsArchiveUser', {
                    params: {
                        id: $rootScope.ArchiveId,
                        subClassId: subClassId
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        deferred.reject();
                        return;
                    }
                    if (!res.Data) {
                        $.tips('您不能访问该页面', 1);
                        deferred.reject();
                        return;
                    }
                    deferred.resolve();
                });

                return deferred.promise;
            }
            
            function isReviewUser(fileId) {
                var deferred = $q.defer();

                $http.get(rootUrl + 'Archive/IsReviewUser', {
                    params: {
                        id: $rootScope.ArchiveId,
                        fileId: fileId
                    }
                })
                .success(function (res) {
                    if (!res.State) {
                        $.tips('出错了：' + res.Msg, 1);
                        deferred.reject();
                        return;
                    }
                    if (!res.Data) {
                        $.tips('您不能访问该页面', 1);
                        deferred.reject();
                        return;
                    }
                    deferred.resolve();
                });

                return deferred.promise;
            }

            return {
                isOperator: isOperator,
                isArchiveUser: isArchiveUser,
                isReviewUser: isReviewUser
            };
        }
    ]);
});