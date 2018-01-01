require.config({
    baseUrl: OP_CONFIG.rootUrl + 'assets/js',
    paths: {
        'jquery': 'lib/jquery-1.11.3.min',
        'uploadify': window.FormData ? 'lib/jquery.uploadify.origin' : 'lib/jquery.uploadify',
        'tlayer': 'lib/jquery.tlayer',
        'plugins': 'lib/jquery.plugins',
        'lodash': 'lib/lodash',
        'util': 'lib/util',
        'datetimepicker': '../plugins/datetimepicker/bootstrap-datetimepicker.min',
        'selector': '../plugins/selector/selector',
        'angular': '../plugins/angular/angular.min',
        'angular-ui-router': '../plugins/angular-ui-router/angular-ui-router.min',
        'ztree': '../plugins/ztree/jquery.ztree.all-3.5.min',
        'ui-bootstrap': '../plugins/ui-bootstrap/ui-bootstrap-tpls-2.4.0.min'
    },
    shim: {
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angular-ui-router': {
            deps: ['angular']
        },
        'ui-bootstrap': {
            deps: ['angular']
        },
        'ztree': {
            deps: ['jquery']
        }
    },
    urlArgs: 'v=' + OP_CONFIG.staticVersion
});
// 参数配置
OP_CONFIG.apiUrl = 'http://10.0.3.5:4000/'; // 公用api接口地址
OP_CONFIG.pathMap =  {  // workItem映射
    StartArchive: 0,
    SetInvolvedProduct: 1,
    ReviewInvolvedProduct: 2,
    SetProductProperty: 3,
    ReviewProductProperty: 4,
    SetProductHistory: 5,
    SetProductHistoryDetail: 5,
    ReviewProductHistory: 6,
    ReviewProductHistoryDetail: 6,
    SetProductApplication: 7,
    ReviewProductApplication: 8,
    SetArchiveLiableUser: 9,
    SetArchiveUserAndReviewUser: 10,
    Archive: 11,
    ArchiveByProduct: 11,
    ArchiveByFileCategory: 11,
    CompareFile: 11,
    Review: 12,
    ReviewByFileCategory: 12,
    ReviewByFileCategoryDetail: 12,
    ReviewByProduct: 12,
    ReviewByProductDetail: 12,
    ReviewIntegrity: 13,
    SecurityReview: 14,

    getName: function (id) {
        var name;

        for (var i in this) {
            if (this[i] === id) {
                name = i;
                break;
            }
        }
        return name;
    }
};