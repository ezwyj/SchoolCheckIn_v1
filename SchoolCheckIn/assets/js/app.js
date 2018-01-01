/**
 * 通用js
 */

define(['angular', 'angular-ui-router', 'ui-bootstrap', 'tlayer'], function (angular) {
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    // 设置弹出框全局参数
    $.tlayer('global', { imgPath: rootUrl + 'assets/img/', top: 100 });
    // 禁用jquery ajax缓存
    $.ajaxSetup({ cache: false });

    var deps = ['ui.bootstrap'];
    if (location.href.indexOf('/Archive/') > -1) {
        deps.push('ui.router');
    }
    // 创建模块并进行通用配置
    angular.module('app', deps)
    .config(['$httpProvider', function ($httpProvider) {
        // 如果get对象不存在则创建
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        // 禁用其他浏览器缓存
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        // 禁用IE浏览器缓存
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    }])
    .run(['$rootScope', function ($rootScope) {
        // 根路径
        $rootScope.rootUrl = rootUrl;
        // 路径映射
        $rootScope.pathMap = OP_CONFIG.pathMap;
        // 页面路径
        $rootScope.path = location.pathname.substring(rootUrl.length);
        // 布尔值列表，供select使用
        $rootScope.booleanList = [{ value: true, text: '是' }, { value: false, text: '否' }];

        // 返回上一页
        $rootScope.back = function () {
            history.go(-1);
        };

        // 登出
        $rootScope.logout = function () {
            location.href = rootUrl + 'Account/Logout?returnUrl=' + encodeURIComponent(location.href);
        };

        // 布尔值转文本
        $rootScope.boolToText = function (val) {
            if (typeof val !== 'boolean') {
                return val || '';
            }
            return val ? '是' : '否';
        };
    }]);

    return angular;
});