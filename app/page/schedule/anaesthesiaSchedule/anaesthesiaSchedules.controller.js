AnaesthesiaScheduleCtrl.$inject = ['$rootScope', '$scope','$q', 'IHttp', 'uiGridConstants', '$timeout', 'toastr', 'select', 'auth', '$uibModal', '$filter', 'confirm'];

module.exports = AnaesthesiaScheduleCtrl;

function AnaesthesiaScheduleCtrl($rootScope, $scope,$q, IHttp, uiGridConstants, $timeout, toastr, select, auth, $uibModal, $filter, confirm) {
    var page = $rootScope.$state.current.name;
    var operBtn = "";
    $scope.back = false;
    $scope.dispatch = {};
    var user = auth.loginUser();
    let tomorrow = new Date($filter('date')(new Date(), 'yyyy-MM-dd')).getTime() + 86400000;
    $scope.operDate = $filter('date')(tomorrow, 'yyyy-MM-dd');
    var params = { "sort": "", "orderBy": "", "filters": [], "name": "", "operDate": $scope.operDate, "hid": "", "dispStep": 2 };

    $scope.btnsMenu.forEach(function(item) {
        operBtn += '<a  ng-if="row.entity.state != \'08\'" ng-click="grid.appScope.query(row.entity, \'' + item.url + '\')">' + item.name + '</a><span ng-if="row.entity.state != \'08\'">&nbsp;|&nbsp;</span>';
    });
    operBtn += '<a ng-click="grid.appScope.cancel(row.entity)" ng-if="row.entity.state != \'08\'">取消</a><a ng-click="grid.appScope.activOper(row.entity)" ng-if="row.entity.state == \'08\'">撤回</a>';
    tempHtml = '<div class="ui-grid-cell-contents">' + operBtn + '</div>';

    var promise;

    select.dept().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.dept = rs.data.resultList;
    });

    select.operroom().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.operroomAll = rs.data.resultList||[];
         one.resolve("one is done");
    })

    select.getNurses().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.nurseList = rs.data.userItem;
    });

    select.getAnaesthetists().then((rs) => {
        if (rs.data.resultCode != 1)
            return;
        $scope.anaesthetistList = rs.data.userItem;
    });

    $scope.getAnaesthetistList = function(query) {
        var array = [];
        if ($scope.dispatch.anesthetist)
            array.push($scope.dispatch.anesthetist);
        if ($scope.dispatch.circuAnesthetist)
            array.push($scope.dispatch.circuAnesthetist);
        return select.getAnaesthetists(query, array);
    };

    var one = $q.defer();
    var two = $q.defer();
    var all = $q.all([one.promise, two.promise]);
    all.then(getGridOperRooms);
    $scope.focus = function(row, col) {
        let doctorFields = [//需要排重的下拉选项字段
            'anesthetistId',
            'circuAnesthetistId'
        ];
        let selectedList = [];
        let doctor;
        let result;
        for (var i = 0; i < doctorFields.length; i++) {
            doctor = doctorFields[i];
            if (doctor !== col.field && row[doctor]) {
                selectedList.push(row[doctor]);
            }
        }

        result = $scope.anaesthetistList.filter((doctor) => {
            let i;
            for (i = 0; i < selectedList.length; i++) {
                if (doctor.userName === selectedList[i]) {
                    break;
                }
            }
            return i === selectedList.length;
        });
        return result;
    }
    $scope.changeOperRoomId = function() {
        $scope.gridApi.selection.clearSelectedRows();
        var len = $scope.gridOptions.data.length;
        for (var i = 0; i < len; i++) {
            if ($scope.gridOptions.data[i].operRoomId == $scope.dispatch.operRoomId) {
                if ($scope.gridApi.selection.selectRow) {
                    $scope.gridApi.selection.selectRow($scope.gridOptions.data[i]);
                }
            }
        }
    }

    $scope.changeanesthetistId = function(type) {
        var selectedRows = $scope.gridApi.selection.getSelectedRows();
        if (selectedRows.length < 1) {
            toastr.warning('批量排班请先勾选患者！');
            return;
        }
        //var selectedGridRows = $scope.gridApi.selection.getSelectedGridRows();             
        for (var i = 0; i < selectedRows.length; i++) {
            if (!!$scope.dispatch.anesthetist) {
                selectedRows[i].showanesthetistIddiv = true;
                selectedRows[i].anesthetistId = $scope.dispatch.anesthetist.userName;
            }
            if (!!$scope.dispatch.circuAnesthetist) {
                selectedRows[i].showcircuAnesthetistIddiv = true;
                selectedRows[i].circuAnesthetistId = $scope.dispatch.circuAnesthetist.userName;
            }
        }
    }

    $scope.updateDay = function(code) {
        var curDate = $scope.operDate;
        var operDate = '';
        if (curDate) {
            if (code === 'add')
                operDate = new Date($filter('date')(new Date(curDate), 'yyyy-MM-dd')).getTime() + 86400000;
            else if (code === 'sub')
                operDate = new Date($filter('date')(new Date(curDate), 'yyyy-MM-dd')).getTime() - 86400000;
            else
                operDate = new Date($filter('date')(new Date(curDate), 'yyyy-MM-dd')).getTime();
            $scope.operDate = $filter('date')(operDate, 'yyyy-MM-dd');
            params.operDate = $scope.operDate;
            getPage();
        }
    }

    $scope.gridOptions = {
        enableFiltering: true, // 过滤栏显示
        enableGridMenu: true, // 配置按钮显示
        enableColumnMenus: false, //表头列的菜单按钮，默认false
        useExternalFiltering: true, // 禁止内部过滤，启用外部滤波器监听事件
        useExternalSorting: true,
        showGridFooter: false, // 显示页脚
        enableFooterTotalSelected: false,
        useExternalPagination: false, // 分页
        paginationPageSizes: [15],
        rowHeight: 45,
        paginationPageSize: params.pageSize,
        // enableCellEdit: false,
        enableCellEditOnFocus: true,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    params.orderBy = '';
                } else {
                    params.orderBy = sortColumns[0].sort.direction;
                    params.sort = sortColumns[0].colDef.field;
                }
                getPage();
            });
            // gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
            //     $scope.queryObj.pageNo = newPage;
            //     $scope.queryObj.pageSize = pageSize;
            //     getPage();
            // });
            gridApi.core.on.filterChanged($scope, function() {
                $scope.grid = this.grid;
                if (promise) {
                    $timeout.cancel(promise);
                }
                promise = $timeout(function() {
                    var filterArr = [];
                    angular.forEach($scope.grid.columns, function(column) {
                        var fieldName = column.field;
                        var value = column.filters[0].term;
                        if (value === null) {
                            value = "";
                        }
                        if (value !== undefined) {
                            filterArr.push({
                                field: fieldName,
                                value: value
                            });
                        }
                    });
                    params.filters = filterArr;
                    getPage();
                }, 1000)
            });
        },
        columnDefs: [{
            field: 'operRoomName',
            name: '手术室',
            width: 85
        }, {
            field: 'pcs',
            name: '台次',
            width: 52
        }, {
            field: 'operaDate',
            name: '手术日期',
            width: 90,
        }, {
            field: 'startTime',
            name: '时间',
            width: 55
        }, {
            field: user.originRequire ? 'origin' : 'emergencyName',
            name: '类型',
            width: 52,
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (!user.originRequire && grid.getCellValue(row, col) == '急诊') {
                    return 'md-red';
                }
                if (user.originRequire && (grid.getCellValue(row, col) == '急诊' || grid.getCellValue(row, col) == '住院急诊')) {
                    return 'md-red';
                }
            }
        }, {
            field: 'deptName',
            name: '科室',
            cellTooltip: function(row, col) {
                return row.entity.deptName;
            },
            width: 75
        }, {
            field: 'bed',
            name: '床号',
            width: 52
        }, {
            field: 'sex',
            name: '性别',
            width: 52
        }, {
            field: 'age',
            name: '年龄',
            width: 52
        }, {
            field: 'name',
            name: '姓名',
            width: 78
        }, {
            field: 'designedOptName',
            name: '拟施手术',
            cellTooltip: function(row, col) {
                return row.entity.designedOptName;
            }
        }, {
            field: 'operatorName',
            name: '手术医生',
            width: 80
        }, {
            field: 'designedAnaesMethodName',
            name: '麻醉方法',
            cellTooltip: function(row, col) {
                return row.entity.designedAnaesMethodName;
            },
            width: 90
        }, {
            field: 'anesthetistId',
            name: '麻醉医生',
            cellClass: 'anaesthetist-anesthetistId',
            cellTemplate: '<div class="dtdiv div-bg-100" ng-mouseover="row.entity.showanesthetistIddiv=true" ng-if="!row.entity.showanesthetistIddiv">{{row.entity.anesthetistId}}</div><oi-select ng-class="{true: \'inversion\'}[row.entity.subscript % 15 >= 10]" style="width:100px" ng-if="row.entity.showanesthetistIddiv" oi-options="item.userName as item.name for item in grid.appScope.focus(row.entity,col) track by item.userName  | limitTo: 100" ng-model="row.entity.anesthetistId" oi-select-options="{cleanModel: true}"></oi-select>',
            width: 100
        }, {
            field: 'circuAnesthetistId',
            name: '副麻医生',
            cellClass: 'anaesthetist-circuanesthetistId',
            cellTemplate: '<div class="dtdiv div-bg-100" ng-mouseover="row.entity.showcircuAnesthetistIddiv=true" ng-if="!row.entity.showcircuAnesthetistIddiv">{{row.entity.circuAnesthetistId}}</div><oi-select ng-class="{true: \'inversion\'}[row.entity.subscript % 15 >= 10]" style="width:100px" ng-if="row.entity.showcircuAnesthetistIddiv" oi-options="item.userName as item.name for item in grid.appScope.focus(row.entity,col) track by item.userName  | limitTo: 100" ng-model="row.entity.circuAnesthetistId" oi-select-options="{cleanModel: true}"></oi-select>',
            width: 100
        }, {
            name: '操作',
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: tempHtml,
            visible: false,
            width: 90
        }],
        rowTemplate: '<div ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell ng-dblclick="grid.appScope.detail(row.entity);"></div>'
    };

    getPage(true);

    function getPage(type) {
        var url = 'basedata/searchNoEndDispatch';
        IHttp.post(url, params).then(function(rs) {
            if (rs.data.resultCode != '1')
                return;
            if (type == 'refresh')
                toastr.success('数据已刷新');
            $scope.gridOptions.data = rs.data.resultList;
            $scope.gridOptions.totalItems = rs.data.total;
            showAnesthetist($scope.gridOptions.data);
            if(type){//第一次  手术室列表 患者列表都加载调用
             two.resolve("two is done");
            }else{//获取患者 更新手术室 手术室列表已经有了
                getGridOperRooms(rs.data.resultList);
            }
        });
    }

    function showAnesthetist(data) {
        for (var i = 0; i < data.length; i++) {
            data[i].showanesthetistIddiv = true;
            data[i].showcircuAnesthetistIddiv = true;
            data[i].subscript = i; //绑定下标给[inversion]样式用
        }
    }

    $scope.query = function(row, url) {
        if ($scope.isArch)
            params.pageNo = 1;
        sessionStorage.setItem('hasAnaesPacuRec', row.pacuId === '' ? false : true);
        sessionStorage.setItem('showPlacentaAgree', row.sex === '男' ? false : true);
        sessionStorage.setItem('showRiskAsseLog', row.isLocalAnaes == '1' ? false : true);
        sessionStorage.setItem('pageOption', JSON.stringify(params));

        $rootScope.$state.go(url, {
            regOptId: row.regOptId
        });
    }

    function getGridOperRooms(data) {
        var operRoomstr = ',';
        for (var i = 0; i < data.length; i++) {
            if (operRoomstr.indexOf(',' + data[i].operRoomId + ',') === -1) {
                operRoomstr += data[i].operRoomId + ','
            }
        }
        var operRoomArray = [];
        for (var i = 0; i < $scope.operroomAll.length; i++) {
            if (operRoomstr.indexOf(',' + $scope.operroomAll[i].operRoomId + ',') > -1) {
                operRoomArray.push($scope.operroomAll[i])
            }
        }
        operRoomArray.sort(function(a,b){
            return a.operRoomId-b.operRoomId;
        })
        $scope.operRoomList = operRoomArray;
    }

    $scope.detail = function(entity) {
        var scope = $rootScope.$new();
        scope.data = entity;
        scope.tabIndex = 1;
        $uibModal.open({
            animation: true,
            size: 'lg',
            template: require('../modal/rowDetail/rowDetail.html'),
            controller: require('../modal/rowDetail/rowDetail.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((rs) => {
            if (rs == 'success') {
                getPage();
            }
        });
    }

    $scope.clean = function() {
        var rowArr = $scope.gridApi.selection.getSelectedRows();
        $scope.dispatch.anesthetist = '';
        $scope.dispatch.circuAnesthetist = '';
        if (rowArr.length === 0) {
            toastr.info('请选择需要清除的记录！');
            return;
        }
        for (var i = 0; i < rowArr.length; i++) {
            rowArr[i].anesthetistId = '';
            rowArr[i].circuAnesthetistId = '';
        }
    }


    $scope.query = function(event, params) {
        params.type = 1;
        params.dispStep = 2;
        IHttp.post('basedata/searchNoEndListSchedule', params).then((rs) => {
            if (rs.data.resultCode != 1)
                return;
            $scope.gridOptions.data = rs.data.resultList;
        });
    }

    $scope.save = function() {
        var dispatchList = [];
        for (var a = 0; a < $scope.gridOptions.data.length; a++) {
            var item = $scope.gridOptions.data[a - 0];
            item.isHold = '0';
            if (!item.pcs)
                item.pcs = undefined;
            if (item.anesthetistId)
                dispatchList.push(item);
        }

        if (dispatchList.length <= 0) {
            toastr.warning('患者未安排麻醉医生');
            return;
        }

        IHttp.post('basedata/dispatchOperation', {
            dispatchList: dispatchList,
            roleType: auth.loginUser().roleType
        }).then((rs) => {
            getPage();
            if (rs.data.resultCode != 1)
                return
            toastr.info(rs.data.resultMessage);
            $scope.dispatch = {};

        });
    }

    $scope.print = function() {
        if ($scope.gridOptions.data.length <= 0) {
            toastr.info('没有可打印的数据');
            return;
        }
        $scope.$emit('doc-print');
    }

    // 取消手术
    $scope.cancelItem = function(item, type) {
        var scope = $rootScope.$new();
        scope.data = {
            items: item
        };
        $uibModal.open({
            animation: true,
            template: require('../../oper/modal/modal.html'),
            controller: require('../../oper/modal/modal.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then((rs) => {
            if (rs === 'success') {
                getPage();
            }
        });
    }

    // 撤回手术
    $scope.revokeItem = function(item, type) {
        confirm.show('选择 "确定" 将数据撤回到手术室安排，否则取消撤回').then(function(rs) {
            IHttp.post('basedata/cancelOperroomDispatch', { regOptId: item.regOptId }).then(function(rs) {
                if (rs.data.resultCode != 1) {
                    toastr.error(rs.data.resultMessage);
                    return;
                }
                toastr.success(rs.data.resultMessage);
                $scope.$emit('childInited');
            });
        });
    }

    $scope.refresh = function() {
        params = { "sort": "", "orderBy": "", "filters": [], "name": "", "operDate": '', "hid": "", "dispStep": 2 };
        $scope.operDate = "";
        getPage();
    }
}