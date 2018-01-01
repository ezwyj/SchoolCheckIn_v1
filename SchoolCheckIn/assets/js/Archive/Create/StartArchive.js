/**
 * 发起归档
 */

define(['app', 'util', 'filters', 'directives', 'services'], function (angular, util) {
    var app = angular.module('app');
    var $ = angular.element;
    var rootUrl = OP_CONFIG.rootUrl;
    
    app.controller('StartArchive', [
        '$rootScope',
        '$scope',
        '$http',
        '$templateCache',
        '$compile',
        '$state',
        'tlayer',
        'tool',
        function ($rootScope, $scope, $http, $templateCache, $compile, $state, tlayer, tool) {
            // 版本号自动补全配置
            $scope.projectCodeAcOpt = {
                async: {
                    url: rootUrl + 'Archive/GetProjectInfo',
                    dataField: 'Data',
                    searchField: 'code',
                    minKeywordLength: 1
                },
                width: 400,
                template: '<td width="150">#{ProjectCode}</td><td>#{ProjectName}</td>'
            };
            // 手册同步时间候选列表（单位月）
            $scope.manualSyncTimeMap = {
                0: '立即',
                1: '一个月',
                2: '两个月',
                3: '三个月',
                4: '四个月',
                5: '五个月',
                6: '六个月'
            };
            // 归档数据model
            $scope.mainInfoModel = {
                ProjectCode: '',
                ProjectName: '',
                ProjectCodeAbbr: '',
                CPX: '',
                ProjectManager: '',
                ProjectManagerId: '',
                SourceProjectCode: '',
                NoticeNo: '',
                IsInvolveHardware: false,
                ProjectVersionSource: '',
                ArchiveDeadline: '',
                ManualSyncTime: '',
                ArchiveDesc: '',
                IsSpecialVersion: false
            };
            // 主体权限分配列表
            $scope.rightAssignList = [];
            // 主体权限分配日志记录
            $scope.rightAssignLogList = [];
            // 主体权限分配日志记录分页配置
            $scope.rightAssignLogPagerOpt = {
                url: rootUrl + 'Archive/GetAssignLog',
                data: {
                    id: $scope.ArchiveId
                },
                localPage: true
            };

            // 初始化
            $scope.init = function () {
                if ($scope.ArchiveId) {
                    $http.get(rootUrl + 'Archive/GetStartArchiveModel', {
                        params: {
                            id: $scope.ArchiveId
                        }
                    })
                    .success(function (res) {
                        if (!res.State) {
                            $.tips('出错了：' + res.Msg, 1);
                            return;
                        }
                        $scope.mainInfoModel = res.Data.PvmMainInfoModel;
                        $scope.rightAssignList = res.Data.RightAssignList;
                        $scope.mainInfoModel.ArchiveDeadline = util.formatMSDate($scope.mainInfoModel.ArchiveDeadline, 'YYYY-MM-DD');
                        $scope.mainInfoModel.ManualSyncTime = $scope.mainInfoModel.ManualSyncTime + '';
                    });
                } else {
                    $http.get(rootUrl + 'Archive/GetRightAssignModel')
                    .success(function (res) {
                        if (!res.State) {
                            $.tips('出错了：' + res.Msg, 1);
                            return;
                        }
                        $scope.rightAssignList = res.Data;
                    });
                }
            };

            // 从项目下拉列表中选择结果
            $scope.selectProject = function (data) {
                $scope.mainInfoModel.ProjectCode = data.ProjectCode;
                $scope.mainInfoModel.ProjectName = data.ProjectName;
                $scope.mainInfoModel.ProjectCodeAbbr = data.ProjectCodeAbbr;
                $scope.mainInfoModel.CPX = data.CPX;
                $scope.mainInfoModel.ProjectManager = data.ProjectManager;
                $scope.mainInfoModel.ProjectManagerId = data.ProjectManagerId;
                $scope.mainInfoModel.SourceProjectCode = data.SourceProjectCode;
            };

            // 清空项目信息
            $scope.clearProject = function () {
                $scope.mainInfoModel.ProjectName = '';
                $scope.mainInfoModel.ProjectCodeAbbr = '';
                $scope.mainInfoModel.CPX = '';
                $scope.mainInfoModel.ProjectManager = '';
                $scope.mainInfoModel.ProjectManagerId = '';
                $scope.mainInfoModel.SourceProjectCode = '';
            };

            // 选择版本经理
            $scope.selectProjectManager = function (data) {
                $scope.mainInfoModel.ProjectManager = data.Name;
                $scope.mainInfoModel.ProjectManagerId = data.Badge;
            };

            // 选择设置人
            $scope.selectSettingUser = function (data) {
                if (data) {
                    $scope.rightAssignModel.SettingUserName = data.Name;
                    $scope.rightAssignModel.SettingUserId = data.Badge;
                    $scope.rightAssignModel.SettingUserDept = data.DepName;
                } else {
                    $scope.rightAssignModel.SettingUserName = '';
                    $scope.rightAssignModel.SettingUserId = '';
                    $scope.rightAssignModel.SettingUserDept = '';
                }
            };

            // 选择复核人
            $scope.selectReviewer = function (data) {
                if (data) {
                    $scope.rightAssignModel.Reviewer = data.Name;
                    $scope.rightAssignModel.ReviewerId = data.Badge;
                    $scope.rightAssignModel.ReviewerDept = data.DepName;
                } else {
                    $scope.rightAssignModel.Reviewer = '';
                    $scope.rightAssignModel.ReviewerId = '';
                    $scope.rightAssignModel.ReviewerDept = '';
                }
            };

            // 分配权限
            $scope.assignRight = function (rightAssign) {
                $scope.rightAssignModel = angular.copy(rightAssign);
                tlayer.content({
                    header: '主体权限分配',
                    width: 800,
                    html: $templateCache.get('layer-assignRight.html'),
                    scope: $scope,
                    submit: function (ins) {
                        angular.extend(rightAssign, $scope.rightAssignModel);
                    }
                });
            };

            // 保存
            $scope.save = function () {
                var json = {
                    PvmMainInfoModel: $scope.mainInfoModel,
                    RightAssignList: $scope.rightAssignList
                };

                if (!isValid(json, '保存')) {
                    return;
                }
                tlayer.confirm('确定要保存吗？', function () {
                    $.loading('操作中...');
                    $http.post(rootUrl + 'Archive/SaveArchiveMainInfo', {
                        json: JSON.stringify({
                            PvmMainInfoModel: $scope.mainInfoModel,
                            RightAssignList: $scope.rightAssignList
                        })
                    })
                    .success(function (res) {
                        $.tlayer('close');
                        if (res.State) {
                            $.tips('操作成功', 3, function () {
                                location.href = rootUrl + 'Archive/Create/' + res.Data;
                            });                            
                        } else {
                            $.tips('操作失败：' + res.Msg, 1);
                        }
                    });
                });
            };

            // 发起归档
            $scope.submit = function () {
                var json = {
                    PvmMainInfoModel: $scope.mainInfoModel,
                    RightAssignList: $scope.rightAssignList
                };

                if (!isValid(json, '发起归档')) {
                    return;
                }
                tlayer.confirm('确定要发起归档？', function () {
                    $.loading('操作中...');
                    $http.post(rootUrl + 'Archive/StartArchive', {
                        json: JSON.stringify({
                            PvmMainInfoModel: $scope.mainInfoModel,
                            RightAssignList: $scope.rightAssignList
                        })
                    })
                    .success(function (res) {
                        $.tlayer('close');
                        if (res.State) {
                            $.tips('操作成功', 3, tool.closeWindow);
                        } else {
                            $.tips('操作失败：' + res.Msg, 1);
                        }
                    });
                });
            };

            // 发起归档校验
            function isValid(json, type) {
                var msg = [];

                if (!json.PvmMainInfoModel.ProjectCode && !json.PvmMainInfoModel.NoticeNo) {
                    msg.push('请输入项目版本号或通知编号');
                }
                if (json.PvmMainInfoModel.ProjectCode && !json.PvmMainInfoModel.ProjectName) {
                    msg.push('请从项目版本号下拉列表中选择项目信息');
                }
                if (!json.PvmMainInfoModel.CPX) {
                    msg.push('请选择产品线');
                }
                if (!json.PvmMainInfoModel.ProjectManagerId) {
                    msg.push('请选择版本经理');
                }
                if (!json.PvmMainInfoModel.ProjectVersionSource) {
                    msg.push('请选择版本来源');
                }
                if (!json.PvmMainInfoModel.ArchiveDeadline) {
                    msg.push('请选择归档截止时间');
                }
                if (!json.PvmMainInfoModel.ManualSyncTime) {
                    msg.push('请选择手册同步时间');
                }
                
                if (type === '发起归档') {
                    for (var i in json.RightAssignList) {
                        var item = json.RightAssignList[i];
                        if (item.WorkItem === 1 && (!item.SettingUserId || !item.ReviewerId) || item.WorkItem === 3 && (!item.SettingUserId || !item.ReviewerId) || item.WorkItem === 9 && !item.SettingUserId) {
                            msg.push('除【涉及物品历史版本处理方式清理】和【涉及物品适用客户范围设置】外均需要设置相关的主体权限分配');
                            break;
                        }
                    }
                }
                if (msg.length) {
                    $.alert('<div class="alert alert-danger">' + msg.join('<br>') + '</div>');
                    return false;
                }
                return true;
            }

            // 删除归档
            $scope.delArchive = function () {
                $scope.model = {
                    id: $scope.ArchiveId,
                    receivers: '',
                    receiverNames: '',
                    remark: ''
                };
                tlayer.content({
                    header: '删除归档',
                    html: $templateCache.get('layer-delArchive.html'),
                    scope: $scope,
                    submit: function (ins) {
                        if (!$scope.model.receivers) {
                            alert('请至少选择一个收信人');
                            return false;
                        }
                        if (!$scope.model.remark) {
                            alert('请填写删除归档说明');
                            return false;
                        }
                        $.loading('loading...');
                        $http.post(rootUrl + 'Archive/DeleteArchive', $scope.model)
                        .success(function (res) {
                            $.tlayer('close');
                            if (res.State) {
                                $.tips('删除成功', 3, tool.closeWindow);
                            } else {
                                $.tips('删除失败：' + res.Msg, 1);
                            }
                        });
                        return false;
                    }
                });
            };

            // 选择收信人
            $scope.selectReceiver = function (userList) {
                var receiver = [];
                var names = [];

                angular.forEach(userList, function (item) {
                    receiver.push(item.Badge);
                    names.push(item.Name);
                });
                $scope.model.receivers = receiver.join(',');
                $scope.model.receiverNames = names.join(',');
            };

            // 查看日志记录
            $scope.viewRightAssignLog = function () {
                $.content({
                    header: '主体权限分配日志记录',
                    content: {
                        html: $templateCache.get('layer-rightAssignLog.html')
                    },
                    onInit: function () {
                        $compile(this)($scope);
                        $scope.$apply();
                    }
                });
            };
        }
    ]);
});