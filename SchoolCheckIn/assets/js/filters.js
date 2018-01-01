/**
 * AngularJS 过滤器集
 */

define(['app', 'util'], function (angular, util) {
    var app = angular.module('app');

    // 格式化 /Date(xxx)/ 形式的时间
    app.filter('formatMSDate', [
        function () {
            return function (input, format) {
                return util.formatMSDate(input, format);
            }
        }
    ]);
    // 将html转换为可信任的字符串输出到页面
    app.filter('toTrustHtml', [
		'$sce',
		function ($sce) {
		    return function (input) {
		        input = util.htmlEncode(input);

		        return $sce.trustAsHtml(typeof input === 'string' ? input.replace(/\n/g, '<br>') : '');
		    };
		}
    ]);
    // 自定义过滤器
    app.filter('customFilter', [
        function () {
            return function (dataList, condition, isFilter) {
                // isFilter为false表示不需要过滤
                if (!isFilter) {
                    return dataList;
                }
                var outputDataList = [];
                var isMatch;
                angular.forEach(dataList, function (item) {
                    isMatch = true;
                    for (var i in condition) {
                        if (typeof condition[i] === 'boolean') {
                            if (condition[i] && !item[i] || !condition[i] && item[i]) {
                                isMatch = false;
                                break;
                            }
                        } else {
                            if (condition[i] !== !item[i]) {
                                isMatch = false;
                                break;
                            }
                        }
                    }
                    if (isMatch) {
                        outputDataList.push(item);
                    }
                });
                return outputDataList;
            };
        }
    ]);
});