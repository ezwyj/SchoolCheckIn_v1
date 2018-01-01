/**
 * 归档详情
 */

require([
    'app',
    'filters',
    'directives',
    'Archive/router',
    'Archive/Detail/StartArchive',
    'Archive/Detail/SetInvolvedProduct',
    'Archive/Detail/ReviewInvolvedProduct',
    'Archive/Detail/SetProductProperty',
    'Archive/Detail/ReviewProductProperty',
    'Archive/Detail/SetProductHistory',
    'Archive/Detail/SetProductHistoryDetail',
    'Archive/Detail/ReviewProductHistory',
    'Archive/Detail/ReviewProductHistoryDetail',
    'Archive/Detail/SetProductApplication',
    'Archive/Detail/ReviewProductApplication',
    'Archive/Detail/SetArchiveLiableUser',
    'Archive/Detail/SetArchiveUserAndReviewUser',
    'Archive/Detail/Archive',
    'Archive/Detail/Review',
    'Archive/Detail/ReviewIntegrity',
    'Archive/Detail/SecurityReview'
], function (angular) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    // 主控制器
    app.controller('pageCtrl', [
        '$scope',
        '$http',
        '$state',
        function ($scope, $http, $state) {
        }
    ]);

    // 控制器最后启动模块
    angular.bootstrap(document, ['app']);
});