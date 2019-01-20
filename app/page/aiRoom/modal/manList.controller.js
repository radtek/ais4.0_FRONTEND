ManListCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', '$uibModalInstance', 'auth','$filter'];

module.exports = ManListCtrl;

function ManListCtrl($rootScope, $scope, IHttp, toastr, $uibModalInstance, auth,$filter) {
    $scope.params = {
        state: '0',
        startTime: '',
        endTime: '',
        hid: ''
    };

    var user = auth.loginUser(),
        airoomUrl;
    airoomUrl = getUrl(user.enterAiroomUrl)[0].url;
    function getUrl(str) {
        var arr = $filter('filter')($scope.btnsMenu, function(item) {
            return item.url == str;
        })
        if (arr.length > 0)
            return arr;
        else
            return [{}];
    }
    var params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: [{
            field: 'induceState', value: ''
        }, {
            field: 'startTime', value: ''
        }, {
            field: 'endTime', value: ''
        }, {
            field: 'hid', value: ''
        }],
        loginName: auth.loginUser().userName
    };

    init();

    $scope.query = init;

    $scope.close = function(row) {
        $uibModalInstance.close(row);
    }

    $scope.gridOptions1 = {
        enableFiltering: false,
        enableGridMenu: false,
        paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,
        paginationPageSize: params.pageSize,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: false,
        useExternalPagination: true,
        useExternalSorting: false,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                params.pageNo = newPage;
                params.pageSize = pageSize;
                init()
            });
        },
        columnDefs: [{
            field: 'operaDate',
            displayName: '手术日期',
            cellTooltip: function(row, col) {
                return row.entity.operaDate;
            },
            width: 88
        }, {
            field: 'name',
            displayName: '姓名',
            cellTooltip: function(row, col) {
                return row.entity.name;
            },
            width: 90
        }, {
            field: 'sex',
            displayName: '性别',
            cellTooltip: function(row, col) {
                return row.entity.sex;
            }
        }, {
            field: 'age',
            displayName: '年龄',
            cellTooltip: function(row, col) {
                return row.entity.age;
            }
        }, {
            field: 'hid',
            displayName: '住院号',
            cellTooltip: function(row, col) {
                return row.entity.hid;
            }
        }, {
            field: 'regionName',
            displayName: '病区',
            cellTooltip: function(row, col) {
                return row.entity.regionName;
            }
        }, {
            field: 'bed',
            displayName: '床号',
            cellTooltip: function(row, col) {
                return row.entity.bed;
            }
        }, {
            field: 'roomName',
            displayName: '手术室',
            cellTooltip: function(row, col) {
                return row.entity.roomName;
            }
        }, {
            field: 'optRealOper',
            displayName: '手术名称',
            width: 210,
            cellTooltip: function(row, col) {
                return row.entity.optRealOper;
            }
        }, {
            field: 'optLatterDiag',
            displayName: '诊断名称',
            width: 210,
            cellTooltip: function(row, col) {
                return row.entity.optLatterDiag;
            }
        }, {
            field: 'anaesMethod',
            displayName: '麻醉方法',
            width: 100,
            cellTooltip: function(row, col) {
                return row.entity.anaesMethod;
            }
        }, {
            field: 'regOptId',
            displayName: '操作',
            enableSorting: false,
            enableFiltering: false,
            cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.recovery(row.entity)">诱导</a></div>'
        }]
    };

    $scope.recovery = function(row) {
        if ($scope.btnsMenu.length == 0) {
            toastr.warning("请检查诱导权限是否配置完整");
            return;
        }
        IHttp.post('document/saveAnaesInduceRec', {
            id: row.id,
            state: '1',
            bedId: $scope.opt.bedId,
            regOptId: row.regOptId,
            roomId: row.roomId
        }).then((rs) => {
            if (rs.data.resultCode != '1')
                return;
            $uibModalInstance.close(row);
            $rootScope.$state.go($scope.opt.url, { regOptId: row.regOptId, pacuId: row.id });
        });
    }

    $scope.view = function(row) {
        $uibModalInstance.close(row);
        $rootScope.$state.go(airoomUrl, { regOptId: row.regOptId, pacuId: row.id });
    }

    function init() {
        if($scope.params.startTime && $scope.params.endTime && new Date($scope.params.startTime).getTime() > new Date($scope.params.endTime).getTime()) {
            toastr.warning('开始时间不能大于结束时间！');
            return;
        }
        params.filters[0].value = $scope.params.state;
        params.filters[1].value = $scope.params.startTime;
        params.filters[2].value = $scope.params.endTime;
        params.filters[3].value = $scope.params.hid;
        IHttp.post("document/searchAnaesInduceRecList", params).then((rs) => {
            if (rs.data.resultCode != 1)
                return;
            $scope.gridOptions1.totalItems = rs.data.total;
            $scope.gridOptions1.data = rs.data.resultList;
        });
        changeState();
    }

    function changeState() {
        if ($scope.params.state == 2) {
            $scope.gridOptions1.columnDefs.pop();
            $scope.gridOptions1.columnDefs.push({
                field: 'regOptId',
                displayName: '操作',
                enableSorting: false,
                enableFiltering: false,
                cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.view(row.entity)">查看</a></div>',
            });
        }else if($scope.params.state == 0 && $scope.gridOptions1) {
            $scope.gridOptions1.columnDefs.pop();
            $scope.gridOptions1.columnDefs.push({
                field: 'regOptId',
                displayName: '操作',
                enableSorting: false,
                enableFiltering: false,
                cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.recovery(row.entity)">诱导</a></div>',
            });
        }
    }
}
