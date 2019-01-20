     airoomCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModal', 'toastr', '$timeout', '$filter', 'confirm', 'auth'];

module.exports = airoomCtrl;

function airoomCtrl($rootScope, $scope, IHttp, $uibModal, toastr, $timeout, $filter, confirm, auth) {
    let timeId, startAnes = false,
        regOptId = '',
        promise,
        params = {
            "pageNo": "",
            "pageSize": "",
            "sort": "",
            "orderBy": "",
            "state": "03,09",//术前 取消手术（回病房）
            "filters": [{ "field": "hid", "value": "" }, { "field": "name", "value": "" }, { "field": "induceState", "value": "" }, { "field": "startTime", "value": "" }]
        },
        airoomUrl;
    $scope.operRoomName = '';
    $scope.query = {
        hid: "",
        name: "",
        state: ""
    }

    $scope.$on('$stateChangeStart', function() {
        $timeout.cancel(timeId);
    });

    //开始复苏
    $scope.stratRehealth = function(item) {
        airoomUrl = getUrl(auth.loginUser().enterAiroomUrl)[0].url;
        sessionStorage.setItem('roomId', item.bedId);
        if ($scope.btnsMenu.length == 0) {
            toastr.warning("请检查诱导室权限是否配置完整");
            return;
        }
        $rootScope.$state.go(airoomUrl, {
            regOptId: item.regOptId,
            pacuId: item.id
        });
    }

    // 选择患者
    $scope.selectMen = function(bedId) {
        airoomUrl = getUrl(auth.loginUser().enterAiroomUrl)[0].url;
        var scope = $scope.$new();
        scope.opt = {
            bedId: bedId,
            url: airoomUrl
        };
        $uibModal.open({
            animation: true,
            size: '1200',
            template: require('./modal/manList.html'),
            controller: require('./modal/manList.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        })
    }

    $scope.setting = function(item) {
        var scope = $scope.$new();
        scope.item = item;
        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('./modal/collectSet.html'),
            controller: require('./modal/collectSet.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        })
    }

    $scope.stateChange = function() {
        params.filters[0].value = $scope.query.hid;
        params.filters[1].value = $scope.query.name;
        params.filters[2].value = $scope.query.state;
        params.filters[3].value = $filter('date')(new Date().getTime() - 24 * 60 * 60 * 1000, 'yyyy-MM-dd');

        // 复苏列表
        if (promise) {
            $timeout.cancel(promise);
        }
        promise = $timeout(function() {
            IHttp.post('document/searchAnaesInduceRecList', params).then(function(rs) {
                if (rs.data.resultCode === '1') {
                    $scope.gridOptions.data = rs.data.resultList;
                    $scope.gridOptions.data.forEach(item => {
                        if (item.operEndTime)
                            item.operEndTime = $filter('date')(item.operEndTime, 'yyyy-MM-dd HH:mm');
                    })
                }
            });
        }, 500)
    }

    $scope.gridOptions = {
        showGridFooter: true, // 显示页脚
        rowHeight: 40,
        columnDefs: [{
            field: 'operaDate',
            name: '日期'
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
            field: 'deptName',
            name: '科室'
        }, {
            field: 'bed',
            name: '床号'
        }, {
            field: 'optRealOper',
            name: '手术名称',
            cellTooltip: function(row, col) {
                return row.entity.optRealOper;
            }
        }, {
            field: 'anaesMethod',
            name: '麻醉方法',
            cellTooltip: function(row, col) {
                return row.entity.anaesMethod;
            }
        }, {
            field: 'operRoomName',
            name: '诱导室',
            cellTooltip: function(row, col) {
                return row.entity.operRoomName;
            }
        }, {
            field: 'operEndTime',
            name: '出诱导室时间'
        }, {
            fieId: 'bedId',
            name: '选择床位',
            width: 100,
            visible: $rootScope.permission.indexOf('CHANGEBED') > -1,
            cellTemplate: '<select ng-disabled="row.entity.processState == \'END\'" style="width: 100%; line-height: 40px; padding-left: 10px; background-color: transparent; border: none;" ng-model="row.entity.bedId" ng-change="grid.appScope.changeBed(row.entity)"><option value="item.bedId" ng-value="item.bedId" ng-class="{true: \'md-red\'}[grid.appScope.beds.indexOf(item.bedId) > -1]" ng-repeat="item in grid.appScope.cardItems track by $index">{{item.bedName}}</option></select>'
        }, {
            fieId: 'regOptId',
            name: '操作',
            width: 80,
            visible: $rootScope.permission.indexOf('INOPER') > -1,
            cellTemplate: '<a style="line-height: 40px;" ng-click="grid.appScope.toOperRoom(row.entity)">转入手术室</a>'
        }]
    };

    init();

    function init() {
        $scope.beds = "";
        IHttp.post('document/getAnaesInduceRecCard', {}).then(function(rs) {
            if (rs.status === 200 && rs.data.resultCode === '1') {
                $scope.cardItems = rs.data.resultList;
                $scope.cardItems.forEach(item => {
                    if (item.id) {
                        $scope.beds += item.bedId + '、';
                    }
                })
                $scope.operRoomName = "诱导室";
                $scope.roomId = 0;

                timeId = $timeout(function() {
                    init();
                }, 180000);
            }
        });
        $scope.stateChange();
    }

    $scope.changeBed = function(item) {
        var arr = $filter('filter')($scope.cardItems, function(i) {
            return i.regOptId == item.regOptId;
        })
        if (arr.length <= 0) {
            IHttp.post('document/saveAnaesInduceRec', {
                id: item.id,
                state: '1',
                bedId: item.bedId,
                regOptId: item.regOptId,
                roomId: item.roomId
            }).then(rs => {
                if (rs.data.resultCode != '1')
                    toastr.error(rs.data.resultMessage);
                init();
            });
        } else if ($scope.beds.indexOf(item.bedId) > -1) {
            confirm.show('该床位已有患者，您是否要继续进行换床!').then(res => {
                IHttp.post('document/changeBedByPacuRec', {
                    sourceBed: arr[0].bedId,
                    sourceRegOptId: arr[0].regOptId,
                    targetBed: item.bedId
                }).then(rs => {
                    if (rs.data.resultCode != '1')
                        toastr.error(rs.data.resultMessage);
                    init();
                }, rs => {
                    init();
                });
            });
        } else {
            IHttp.post('document/changeBedByPacuRec', {
                sourceBed: arr[0].bedId,
                sourceRegOptId: arr[0].regOptId,
                targetBed: item.bedId
            }).then(rs => {
                if (rs.data.resultCode != '1')
                    toastr.error(rs.data.resultMessage);
                init();
            }, rs => {
                init();
            });
        }
    }

    $scope.toOperRoom = function(item) {
        var scope = $rootScope.$new();
        scope.item = item;
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'sm',
            controllerAs: 'vm',
            scope: scope,
            template: require('../doc/pacu/modal/againStartOper.html'),
            controller: require('../doc/pacu/modal/againStartOper.controller.js'),
        }).result.then(function(rs) {
            toastr.info("已转入到手术室！")
            $scope.stateChange();
        });
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