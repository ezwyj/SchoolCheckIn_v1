/**
 * AngularJS 指令集
 */

define(['app', 'util', 'selector', 'datetimepicker', 'plugins', 'filters'], function (angular, util, selector) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;

    selector.baseUrl = rootUrl + 'assets/plugins/selector/';
    selector.apiUrl = OP_CONFIG.apiUrl + 'Selector/';

    // 选项卡切换
    app.directive('tab', [
        function () {
            return {
                restrict: 'A',
                link: function (scope, ele, attrs) {
                    var navs = ele.find('.nav > li');
                    var contents = ele.find('.tab-content > .tab-pane');

                    navs.on('click', ' > a', function () {
                        var index = $(this).parent().index();

                        navs.removeClass('active').eq(index).addClass('active');
                        contents.removeClass('active').eq(index).addClass('active');
                    });
                }
            };
        }
    ]);
    // 侧边栏切换
    app.directive('sidebarToggle', [
        function () {
            return {
                restrict: 'A',
                link: function (scope, ele, attrs) {
                    ele.on('mouseenter', '.toggle-btn', function () {
                        ele.addClass('show');
                    });
                    ele.on('mouseleave', function () {
                        ele.removeClass('show');
                    });
                }
            };
        }
    ]);
    // 文本过长截断
    app.directive('textTruncation', [
        function () {
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    textTruncation: '='
                },
                template: '<div class="text-ellipsis" title="{{textTruncation}}">{{textTruncation}}</div>'
            };
        }
    ]);
    // 自动补全指令
    app.directive('autoComplete', [
        function () {
            return {
                restrict: 'A',
                scope: {
                    autoComplete: '=',
                    callback: '&'
                },
                link: function (scope, ele, attrs) {
                    var opt = $.extend(true, {}, scope.autoComplete, {
                        callback: function (data) {
                            scope.callback({ data: data });
                            scope.$apply();
                        }
                    });
                    ele.autoComplete(opt);
                }
            };
        }
    ]);
    // 日期选择指令
    app.directive('datetimepicker', [
        function () {
            return {
                restrict: 'EA',
                replace: true,
                scope: {
                    format: '@',
                    minView: '@',
                    endDate: '@',
                },
                require: 'ngModel',
                template: 
                    '<div class="input-group input-group-sm">\
                        <span class="input-group-addon">\
                            <span class="fa fa-calendar"></span>\
                        </span>\
                        <input class="form-control bg-white" readonly />\
                        <span class="input-group-addon clear">\
                            <span class="fa fa-remove"></span>\
                        </span>\
                    </div>',
                link: function (scope, ele, attrs, ctrl) {
                    var $input = ele.find('input');

                    // 显示日期选择器
                    $input.on('click focus', function (e) {
                        e.preventDefault();
                        if ($input.data('datetimepicker')) {
                            $input.datetimepicker('show');
                            return;
                        }
                        var option = {
                            format: scope.format || 'yyyy-mm-dd',
                            autoclose: true,
                            todayHighlight: true,
                            forceParse: true,
                            clearBtn: true,
                            language: 'zh-CN',
                            minView: scope.minView || 2
                        }
                        $input.datetimepicker(option);
                        // 设置结束时间
                        if (scope.endDate !== undefined) {
                            if (option.endDate === 'true') {
                                $input.datetimepicker('setEndDate', new Date());
                            } else {
                                $input.datetimepicker('setEndDate', new Date(option.endDate));
                            }
                        }
                    });
                    // 手动赋值给ngModel
                    $input.on('change', function () {
                        if (!ctrl) {
                            return;
                        }
                        ctrl.$setViewValue(this.value);
                    });
                    ele.on('click', '.show-picker', function () {
                        if ($input.data('datetimepicker')) {
                            $input.datetimepicker('show');
                            return;
                        }
                    });
                    ele.on('click', '.clear', function () {
                        $input.val('').trigger('change');
                    });
                    // 手动触发使控件初始化
                    $input.trigger('click');

                    // 监视ngModel值变化
                    var watcher = scope.$watch(function () {
                        return ctrl.$viewValue;
                    }, function (value) {
                        $input.val(value || '');
                    });
                    // 删除监视器
                    ele.on('$destroy', function () {
                        watcher();
                    });
                }
            };
        }
    ]);
    // 日期选择指令
    app.directive('dtPicker', [
        function () {
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    format: '@',
                    minView: '@',
                    endDate: '@',
                },
                require: 'ngModel',
                link: function (scope, ele, attrs, ctrl) {
                    // 显示日期选择器
                    ele.on('click focus', function (e) {
                        e.preventDefault();
                        if (ele.data('datetimepicker')) {
                            ele.datetimepicker('show');
                            return;
                        }
                        var option = {
                            format: scope.format || 'yyyy-mm-dd',
                            autoclose: true,
                            todayHighlight: true,
                            forceParse: true,
                            clearBtn: true,
                            language: 'zh-CN',
                            minView: scope.minView || 2
                        }
                        ele.datetimepicker(option);
                        // 设置结束时间
                        if (scope.endDate !== undefined) {
                            if (option.endDate === 'true') {
                                ele.datetimepicker('setEndDate', new Date());
                            } else {
                                ele.datetimepicker('setEndDate', new Date(option.endDate));
                            }
                        }
                    });
                    // 手动赋值给ngModel
                    ele.on('change', function () {
                        if (!ctrl) {
                            return;
                        }
                        ctrl.$setViewValue(this.value);
                    });
                    // 手动触发使控件初始化
                    ele.trigger('click');

                    // 监视ngModel值变化
                    var watcher = scope.$watch(function () {
                        return ctrl.$viewValue;
                    }, function (value) {
                        ele.val(value || '');
                    });
                    ele.on('$destroy', function () {
                        watcher();
                    });
                }
            };
        }
    ]);
    // 选择器指令
    app.directive('selector', [
        function () {
            return {
                restrict: 'A',
                scope: {
                    selector: '@',
                    opt: '=?',
                    callback: '&'
                },
                link: function ($scope, $ele) {
                    var opt = angular.merge({}, $scope.opt, {
                        callback: function (data) {
                            $.tlayer('close');
                            opt.oldData = data;
                            $scope.callback({ data: data });
                            $scope.$apply();
                        }
                    });
                    var oldDataWatcher = $scope.$watch('opt.oldData', function (value) {
                        if (!value) return;
                        opt.oldData = value;
                        oldDataWatcher();
                    });
                    $ele.on('click', 'input', function (e) {
                        selector[$scope.selector](opt);
                    });
                    $ele.on('click', '.clear', function () {
                        opt.oldData = null;
                        $scope.callback({ data: null });
                        $scope.$apply();
                    });
                }
            };
        }
    ]);
    // 下拉框指令
    app.directive('uiSelect', [
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                scope: {
                    uiSelect: '=?',
                    srcData: '=?',
                    output: '=?',
                    callback: '&'
                },
                link: function (scope, ele, attrs) {
                    var srcDataWatcher = scope.$watch('srcData', function (value) {
                        if (!value) {
                            return;
                        }
                        var opt = $.extend(true, {}, scope.uiSelect, { dataList: angular.copy(value) });

                        ele.uiSelect(opt);
                        ele.on('change.ui.select', function (evt, data) {
                            $timeout(function () {
                                scope.output = ele.uiSelect('getValue');
                            });
                        });
                        if (scope.output) {
                            ele.uiSelect('setValue', scope.output);
                        }
                    }, true);
                    var outputWatcher = scope.$watch('output', function (value) {
                        // 设置初始选中值，排除掉value为NaN的可能
                        if (value === value && ele.data('ui.select')) {
                            ele.uiSelect('setValue', value);
                            scope.callback({ data: ele.uiSelect('getSelectedData') });
                        }
                    });
                    ele.on('$destroy', function () {
                        srcDataWatcher();
                        outputWatcher();
                    });
                }
            };
        }
    ]);
    // 导出excel指令
    app.directive('exportExcel', [
        function () {
            return {
                restrict: 'A',
                scope: {
                    callback: '&'
                },
                link: function (scope, ele, attrs) {
                    ele.on('click', function () {
                        var ret = scope.callback();

                        if (ret && ret.then) {
                            ret.then(function () {
                                setTimeout(function () {
                                    doExport();
                                }, 100);
                            });
                        } else {
                            doExport();
                        }
                    });

                    function doExport() {
                        var form = $(
                            '<form action="' + rootUrl + 'Home/ExportExcel" method="POST">\
                                <input type="hidden" name="tableHtml">\
                            </form>'
                        ).appendTo('body');
                        form.find('input').val($('#' + attrs.exportExcel).html());
                        form.submit();
                        form.remove();
                    }
                }
            };
        }
    ]);
    // 表单enter键回调
    app.directive('enterHandler', [
        function () {
            return {
                restrict: 'A',
                scope: {
                    enterHandler: '&'
                },
                link: function (scope, ele) {
                    ele.on('keyup', function (evt) {
                        if (evt.which == 13) {
                            evt.stopPropagation();
                            evt.preventDefault();
                            scope.enterHandler();
                        }
                    });
                }
            };
        }
    ]);
    // 模拟表单提交
    app.directive('formSubmit', [
        function () {
            return {
                restrict: 'A',
                scope: {
                    url: '@',
                    param: '&'
                },
                link: function (scope, ele) {
                    ele.on('click', function () {
                        var param = scope.param();

                        if (param && param.then) {
                            param.then(function (data) {
                                doSubmit(data);
                            });
                        } else {
                            doSubmit(param);
                        }
                    });

                    function doSubmit(param) {
                        var form = $('<form action="' + scope.url + '" method="POST"></form>').appendTo('body');

                        for (var i in param) {
                            $('<input type="hidden" name="' + i + '" />').val(param[i]).appendTo(form);
                        }
                        form.submit();
                        form.remove();
                    }
                }
            };
        }
    ]);
    // 为input[type="text"]设置最大长度
    app.directive('input', [
        function () {
            return function (scope, ele, attrs) {
                if (attrs.type === 'text' && !attrs.maxlength) {
                    ele.attr('maxlength', 50);
                }
            }
        }
    ]);
    // 为textarea设置最大长度
    app.directive('textarea', [
        function () {
            return function (scope, ele, attrs) {
                if (!attrs.maxlength) {
                    ele.attr('maxlength', 200);
                }
            }
        }
    ]);
    // 分页
    app.directive('pager', [
        function () {
            return {
                restrict: 'A',
                scope: {
                    pager: '=',
                    request: '=?',
                    output: '='
                },
                link: function ($scope, $ele) {
                    var watcher = $scope.$watch('pager', function () {
                        if (!$scope.pager) return;
                        var opt = $.extend(true, {
                            dataField: 'Data',
                            totalField: 'Total',
                            pageInfo: true,
                            pageSizeArray: [10, 20, 40, 80],
                            success: function (dataList) {
                                $scope.output = dataList;
                                $scope.$apply();
                            }
                        }, $scope.pager);
                        $ele.pager(opt);
                        watcher();
                    });

                    $scope.request = function (pageIndex) {
                        $ele.pager('reload', pageIndex);
                    };
                }
            };
        }
    ]);
});