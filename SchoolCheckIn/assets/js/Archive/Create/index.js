/**
 * 归档页
 */

require([
    'app',
    'filters',
    'directives',
    'Archive/router',
    'Archive/Create/StartArchive',
    'Archive/Create/SetInvolvedProduct',
    'Archive/Create/ReviewInvolvedProduct',
    'Archive/Create/SetProductProperty',
    'Archive/Create/ReviewProductProperty',
    'Archive/Create/SetProductHistory',
    'Archive/Create/SetProductHistoryDetail',
    'Archive/Create/ReviewProductHistory',
    'Archive/Create/ReviewProductHistoryDetail',
    'Archive/Create/SetProductApplication',
    'Archive/Create/ReviewProductApplication',
    'Archive/Create/SetArchiveLiableUser',
    'Archive/Create/SetArchiveUserAndReviewUser',
    'Archive/Create/Archive',
    'Archive/Create/ManageFile',
    'Archive/Create/ArchiveByFileCategory',
    'Archive/Create/ArchiveByProduct',
    'Archive/Create/CompareFile',
    'Archive/Create/ReviewByFileCategory',
    'Archive/Create/ReviewByFileCategoryDetail',
    'Archive/Create/ReviewByProduct',
    'Archive/Create/ReviewByProductDetail',
    'Archive/Create/ReviewIntegrity',
    'Archive/Create/SecurityReview'
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