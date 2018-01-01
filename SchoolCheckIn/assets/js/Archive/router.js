/**
 * 归档页路由
 */

define(['app', 'services'], function (angular) {
    var app = angular.module('app');
    var rootUrl = OP_CONFIG.rootUrl;

    // 通用配置和路由配置
    app.config([
        '$stateProvider',
	    '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            // 路由配置
            $stateProvider
                .state('StartArchive', {
                    url: '/StartArchive',
                    templateUrl: 'StartArchive.html',
                    resolve: {
                        isOperator: function (auth) {
                            return auth.isOperator();
                        }
                    }
                })
        		.state('SetInvolvedProduct', {
        		    url: '/SetInvolvedProduct',
        		    templateUrl: 'SetInvolvedProduct.html',
        		    resolve: {
        		        isOperator: function (auth) {
        		            return auth.isOperator();
        		        }
        		    }
        		})
                .state('ReviewInvolvedProduct', {
                    url: '/ReviewInvolvedProduct',
                    templateUrl: 'ReviewInvolvedProduct.html',
                    resolve: {
                        isOperator: function (auth) {
                            return auth.isOperator();
                        }
                    }
                })
        		.state('SetProductProperty', {
        		    url: '/SetProductProperty',
        		    templateUrl: 'SetProductProperty.html',
        		    resolve: {
        		        isOperator: function (auth) {
        		            return auth.isOperator();
        		        }
        		    }
        		})
                .state('ReviewProductProperty', {
                    url: '/ReviewProductProperty',
                    templateUrl: 'ReviewProductProperty.html',
                    resolve: {
                        isOperator: function (auth) {
                            return auth.isOperator();
                        }
                    }
                })
        		.state('SetProductApplication', {
        		    url: '/SetProductApplication',
        		    templateUrl: 'SetProductApplication.html',
        		    resolve: {
        		        isOperator: function (auth) {
        		            return auth.isOperator();
        		        }
        		    }
        		})
                .state('ReviewProductApplication', {
                    url: '/ReviewProductApplication',
                    templateUrl: 'ReviewProductApplication.html',
                    resolve: {
                        isOperator: function (auth) {
                            return auth.isOperator();
                        }
                    }
                })
        		.state('SetProductHistory', {
        		    url: '/SetProductHistory',
        		    templateUrl: 'SetProductHistory.html',
        		    resolve: {
        		        isOperator: function (auth) {
        		            return auth.isOperator();
        		        }
        		    }
        		})
                .state('SetProductHistoryDetail', {
                    url: '/SetProductHistoryDetail/:ItemNumber',
                    templateUrl: 'SetProductHistoryDetail.html',
                    resolve: {
                        isOperator: function (auth) {
                            return auth.isOperator();
                        }
                    }
                })
                .state('ReviewProductHistory', {
                    url: '/ReviewProductHistory',
                    templateUrl: 'ReviewProductHistory.html',
                    resolve: {
                        isOperator: function (auth) {
                            return auth.isOperator();
                        }
                    }
                })
                .state('ReviewProductHistoryDetail', {
                    url: '/ReviewProductHistoryDetail/:ItemNumber',
                    templateUrl: 'ReviewProductHistoryDetail.html',
                    resolve: {
                        isOperator: function (auth) {
                            return auth.isOperator();
                        }
                    }
                })
                .state('SetArchiveLiableUser', {
                    url: '/SetArchiveLiableUser',
                    templateUrl: 'SetArchiveLiableUser.html',
                    resolve: {
                        isOperator: function (auth) {
                            return auth.isOperator();
                        }
                    }
                })
                .state('SetArchiveUserAndReviewUser', {
                    url: '/SetArchiveUserAndReviewUser',
                    templateUrl: 'SetArchiveUserAndReviewUser.html',
                    resolve: {
                        isOperator: function (auth) {
                            return auth.isOperator();
                        }
                    }
                })
                .state('Archive', {
                    url: '/Archive',
                    templateUrl: 'Archive.html',
                    resolve: {
                        isOperator: function (auth) {
                            return auth.isOperator();
                        }
                    }
                })
                .state('ManageFile', {
                    url: '/ManageFile/:SubClassId',
                    templateUrl: 'ManageFile.html',
                    resolve: {
                        isOperator: function (auth, $stateParams) {
                            return auth.isArchiveUser($stateParams.SubClassId);
                        }
                    }
                })
                .state('ArchiveByFileCategory', {
                    url: '/ArchiveByFileCategory',
                    templateUrl: 'ArchiveByFileCategory.html',
                    resolve: {
                        isOperator: function (auth) {
                            return auth.isOperator();
                        }
                    }
                })
                .state('ArchiveByProduct', {
                    url: '/ArchiveByProduct',
                    templateUrl: 'ArchiveByProduct.html',
                    resolve: {
                        isOperator: function (auth) {
                            return auth.isOperator();
                        }
                    }
                })
                .state('ImportFile', {
                    url: '/ImportFile/:ProductIds',
                    templateUrl: 'ImportFile.html',
                    resolve: {
                        isOperator: function (auth) {
                            return auth.isOperator();
                        }
                    }
                })
                .state('CompareFile', {
                    url: '/CompareFile/:ProductId',
                    templateUrl: 'CompareFile.html'
                })
                .state('Review', {
                    url: '/Review',
                    templateUrl: 'Review.html',
                    resolve: {
                        isOperator: function (auth) {
                            return auth.isOperator();
                        }
                    }
                })
                .state('ReviewByFileCategory', {
                    url: '/ReviewByFileCategory',
                    templateUrl: 'ReviewByFileCategory.html',
                    resolve: {
                        isOperator: function (auth) {
                            return auth.isOperator();
                        }
                    }
                })
                .state('ReviewByFileCategoryDetail', {
                    url: '/ReviewByFileCategoryDetail/:FileId',
                    templateUrl: 'ReviewByFileCategoryDetail.html',
                    resolve: {
                        isOperator: function (auth, $stateParams) {
                            return auth.isReviewUser($stateParams.FileId);
                        }
                    }
                })
                .state('ReviewByProduct', {
                    url: '/ReviewByProduct',
                    templateUrl: 'ReviewByProduct.html',
                    resolve: {
                        isOperator: function (auth) {
                            return auth.isOperator();
                        }
                    }
                })
                .state('ReviewByProductDetail', {
                    url: '/ReviewByProductDetail/:ProductId',
                    templateUrl: 'ReviewByProductDetail.html',
                    resolve: {
                        isOperator: function (auth) {
                            return auth.isOperator();
                        }
                    }
                })
                .state('ReviewIntegrity', {
                    url: '/ReviewIntegrity',
                    templateUrl: 'ReviewIntegrity.html',
                    resolve: {
                        isOperator: function (auth) {
                            return auth.isOperator();
                        }
                    }
                })
                .state('SecurityReview', {
                    url: '/SecurityReview',
                    templateUrl: 'SecurityReview.html',
                    resolve: {
                        isOperator: function (auth) {
                            return auth.isOperator();
                        }
                    }
                });

            $urlRouterProvider.otherwise('/StartArchive');
        }
    ]);

    app.run([
		'$rootScope',
        '$state',
		function ($rootScope, $state) {
		    // 归档主信息唯一标识符
		    $rootScope.ArchiveId = OP_CONFIG.ArchiveId || '';
		    $rootScope.createUrl = rootUrl + 'Archive/Create/' + $rootScope.ArchiveId;
		    $rootScope.detailUrl = rootUrl + 'Archive/Detail/' + $rootScope.ArchiveId;

		    $rootScope.$on('$stateChangeStart', function (evt, toState, toParams) {
                // workItem Id
		        $rootScope.workItem = OP_CONFIG.pathMap[toState.name];
                // workItem名称
		        $rootScope.workItemExp = toState.name;
                // 编辑页面地址
		        $rootScope.editUrl = $rootScope.createUrl + '#/' + $rootScope.workItemExp;

                // 编辑页面，Review路由需要自动跳转到ReviewByFileCategory
		        if (location.pathname.indexOf($rootScope.createUrl) > -1 && $rootScope.workItemExp === 'Review') {
		            $state.go('ReviewByFileCategory', null, { reload: true });
		            evt.preventDefault();
		            return;
		        }
		        // 详情页面地址，复核页面特殊处理
		        if ($rootScope.workItem === OP_CONFIG.pathMap.Review) {
		            $rootScope.viewUrl = $rootScope.detailUrl + '#/Review';
		        } else {
		            $rootScope.viewUrl = $rootScope.detailUrl + '#/' + $rootScope.workItemExp;
		        }
		    });
		}
    ]);
});