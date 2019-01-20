InOperCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModal', 'uiGridConstants', 'auth', 'toastr', 'confirm', 'baseConfig', '$timeout', '$filter'];

module.exports = InOperCtrl;

function InOperCtrl($rootScope, $scope, IHttp, $uibModal, uiGridConstants, auth, toastr, confirm, baseConfig, $timeout, $filter) {
    $rootScope.docInfo = auth.loginUser();
    $scope.query = {
        hid: "",
        name: "",
        state: ""
    }
    var promise,
        htmlStr,
        params = {
            "pageNo": "",
            "pageSize": "",
            "sort": "",
            "orderBy": "",
            "filters": [{ "field": "hid", "value": "" }, { "field": "name", "value": "" }, { "field": "state", "value": "" }]
        };
    var emergencyOption = [{ value: '0', label: '择期' }, { value: '1', label: '急诊' }];
    if ($rootScope.docInfo.originRequire) {
        emergencyOption = [{ value: '0', label: '择期' }, { value: '1', label: '非择期' }, { value: '2', label: '住院急诊' }, { value: '3', label: '急诊' }];
    }
    init();

    for (var i = 0; i < $rootScope.btnsMenu.length; i++) {
        if ($rootScope.btnsMenu[i].name === '编辑患者') {
            $rootScope.btnsMenu.splice(i, 1);
        }
    }

    $scope.isInOper = $rootScope.permission.indexOf('INOPER') > -1;

    $scope.operUrl = getUrl('anesRecordLog_base')[0].url;

    // $scope.operUrl = getUrl('anesRecordPage_syzxyy')[0].url;

    // $scope.operUrl = getUrl('anesRecordPage_qnz')[0].url;

    // $scope.operUrl = getUrl('anesRecordPage_yxrm')[0].url;


    // 开始手术
    $scope.ok = function(item, url) {
        IHttp.post('operCtl/queryRoomOper', { regOptId: item.regOptId }).then(function(rs) {
            if (rs.data.resultCode === '1') {
                if (item.emergency == 1) {
                    inRoom(item, url);
                } else {

                    IHttp.post('operCtl/searchDocIsFinished', { regOptId: item.regOptId }).then(function(res) {
                        if (res.data.resultCode === '1') {
                            inRoom(item, url);
                        }
                    });

                }
            } else {
                confirm.show(rs.data.resultMessage + ' 是否强制结束？').then(function() {
                    $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        size: 'ua',
                        template: require('../tpl/userModal/userModal.html'),
                        controller: require('../tpl/userModal/userModal.controller.js')
                    }).result.then(function() {
                        IHttp.post('operCtl/forceEndOper', { msgType: "forceEnd", regOptId: rs.data.id }).then(function(result) {
                            if (result.data.resultCode === '1') {
                                toastr.info('强制结束手术成功');
                                init();
                            }
                        });
                    });
                });
            }
        });
    }

    // 术中配置
    $scope.inOperSet = function() {
        $uibModal.open({
            size: 'lg',
            animation: true,
            backdrop: 'static',
            template: require('./modal/set.html'),
            controller: require('./modal/set.controller.js')
        });
    }

    // 取消手术
    $scope.cancel = function(item) {
        var url = 'modal/',
            size = 'ua';
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'ua',
            template: require('../tpl/userModal/userModal.html'),
            controller: require('../tpl/userModal/userModal.controller.js')
        }).result.then(function() {
            var scope = $rootScope.$new();
            scope.regOptId = item.regOptId;
            scope.tit = '取消';
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                size: size,
                template: require('../oper/' + url + 'modal.html'),
                controller: require('../oper/' + url + 'modal.controller.js'),
                scope: scope
            }).result.then(function() {
                toastr.info('取消手术成功');
                init();
            });
        });
    }

    $scope.gridOptions = {
        showGridFooter: true, // 显示页脚
        rowHeight: 40,
        columnDefs: [{
            field: $rootScope.docInfo.originRequire ? 'origin' : 'emergency',
            name: '类型',
            width: 80,
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: emergencyOption
            },
            cellFilter: $rootScope.docInfo.originRequire ? 'origin' : 'emergency',
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (!$rootScope.docInfo.originRequire && grid.getCellValue(row, col) == 1) {
                    return 'md-red';
                }
                if ($rootScope.docInfo.originRequire && grid.getCellValue(row, col) >= 2) {
                    return 'md-red';
                }
            }
        }, {
            field: 'operaDate',
            name: '日期'
        }, {
            field: 'stateName',
            visible: false,
            name: '状态'
        }, {
            field: 'name',
            name: '姓名'
        }, {
            field: 'sex',
            name: '性别'
        }, {
            field: 'age',
            name: '年龄'
        }, {
            field: 'hid',
            name: '住院号'
        }, {
            field: 'operRoomName',
            name: '手术室名称',
            cellTooltip: function(row, col) {
                return row.entity.operRoomName;
            }
        }, {
            field: 'designedOptName',
            name: '手术名称',
            cellTooltip: function(row, col) {
                return row.entity.designedOptName;
            }
        }, {
            field: 'designedAnaesMethodName',
            name: '麻醉方法',
            cellTooltip: function(row, col) {
                return row.entity.designedAnaesMethodName;
            }
        }, {
            field: 'anesthetistName',
            name: '麻醉医生',
            cellTooltip: function(row, col) {
                return row.entity.anesthetistName;
            }
        }, {
            field: 'circunurseName1',
            name: '巡回护士',
            cellTooltip: function(row, col) {
                return row.entity.circunurseName1;
            }
        }, {
            name: '操作',
            enableSorting: false,
            enableFiltering: false,
            width: 120,
            cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.editOperation(row.entity)">编辑</a><span ng-if="!!grid.appScope.isInOper && row.entity.isLocalAnaes == 0 && row.entity.state == \'06\'">&nbsp;|&nbsp;<a ng-click="grid.appScope.againStartOper(row.entity)">再次手术</a></span></div>'
        }]
    };

    $scope.stateChange = function() {
        params.filters[0].value = $scope.query.hid;
        params.filters[1].value = $scope.query.name;
        params.filters[2].value = $scope.query.state;

        // 今日手术
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            IHttp.post('operCtl/getDayOper', params).then(function(rs) {
                if (rs.data.resultCode === '1') {
                    $scope.gridOptions.data = rs.data.resultList;
                }
            });
        })
    }

    $scope.editOperation = function(row) {
        $rootScope.$state.go('preOperDateil', {
            regOptId: row.regOptId
        });
    }

    $scope.againStartOper = function(row) {
        var scope = $rootScope.$new();
        scope.item = row;
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'sm',
            controllerAs: 'vm',
            scope: scope,
            template: require('../doc/pacu/modal/againStartOper.html'),
            controller: require('../doc/pacu/modal/againStartOper.controller.js'),
        }).result.then(function(rs) {
            $rootScope.$state.go($scope.operUrl, {
                regOptId: row.regOptId
            })
        });
    }

    $scope.$on('operRoomId', function(ev, data) {
        sessionStorage.setItem('roomId', data);
        init();
    })

    function init() {
        // 术中卡片数据
        IHttp.post('operCtl/getCurUserOper', { userId: auth.loginUser().userName }).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            if (!rs.data.roomId)
                toastr.info('请选择手术室');
            $scope.dataList = rs.data.resultList;
            $rootScope.operRoomName = rs.data.operRoomName;
        });
        // 今日手术
        IHttp.post('operCtl/getDayOper', params).then(function(rs) {
            if (rs.data.resultCode === '1') {
                $scope.gridOptions.data = rs.data.resultList;
            }
        });
    }

    function inRoom(item, url) {
        if (auth.loginUser().userType === 'NURSE') {
            for (let btn of $scope.btnsMenu) {
                if (btn.name === '开始手术') {
                    btn.url = auth.loginUser().NurseEnterOperRoomUrl;
                    url = btn.url;
                    break;
                }
            };
        }
        var roleType = auth.loginUser().roleType;
        if (roleType === 'ANAES_DOCTOR' || roleType === 'ANAES_DIRECTOR') {
            // IHttp.post('operCtl/initOper', { msgType: "init", regOptId: item.regOptId }).then(function(rs) {
            // if (rs.data.resultCode !== '1') return;
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                template: require('./modal/startOper.html'),
                controller: require('./modal/startOper.controller.js')
            }).result.then(function() {
                $rootScope.$state.go(url, { regOptId: item.regOptId });
            });
            // });
        } else {
            var surgProc = baseConfig.getSurgProc();
            // 护士进入手术室
            if (item.isLocalAnaes == 1 && item.state == '03' && surgProc.isNeedDoct == 1) {
                confirm.show('是否需要麻醉医生?').then(function() {
                    IHttp.post('/operCtl/isNeedAnaesDoctor', { regOptId: item.regOptId, isNeed: 1 }).then(function(rs) {
                        if (rs.data.resultCode != 1) {
                            return;
                        }
                        $rootScope.$state.go(url, { regOptId: item.regOptId });
                    })
                }, function() {
                    $rootScope.$state.go(url, { regOptId: item.regOptId });
                });
            } else
                $rootScope.$state.go(url, { regOptId: item.regOptId });
        }
    }



    function getUrl(str) {
        var arr = $filter('filter')($scope.btnsMenu, function(item) {
            return item.url == str;
        })
        if (arr.length > 0)
            return arr;
        else
            return [{}];
    }
}