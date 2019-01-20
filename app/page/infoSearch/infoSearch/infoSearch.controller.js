InfoSearchCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$filter', 'i18nService', '$state', 'uiGridConstants', '$timeout', 'toastr', 'auth'];

module.exports = InfoSearchCtrl;

function InfoSearchCtrl($rootScope, $scope, IHttp, $filter, i18nService, $state, uiGridConstants, $timeout, toastr, auth) {
    var page = $rootScope.$state.current.name,
        toUrl = $scope.btnsMenu[0].url,
        params = {
            pageNo: 1,
            pageSize: 15,
            sort: '',
            orderBy: '',
            filters: [],
            optType: ["1", "2"],
            loginName: auth.loginUser().userName,
            state: '06,07'
        },
        pageOption = JSON.parse(sessionStorage.getItem('pageOption'));

    if (pageOption) {
        params = pageOption;
        sessionStorage.setItem('pageOption', null);
    }

    $scope.gridOptions = {
        enableFiltering: true, //  表格过滤栏
        enableGridMenu: true, //表格配置按钮
        paginationPageSizes: [15, 30, 50],
        rowHeight: 40,
        paginationCurrentPage: params.pageNo,
        paginationPageSize: params.pageSize,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true, // 过滤的搜索
        useExternalPagination: true, // 分页
        useExternalSorting: true,

        onRegisterApi: function(gridApi) {
            gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    params.orderBy = '';
                } else {
                    params.orderBy = sortColumns[0].sort.direction;
                    params.sort = sortColumns[0].colDef.field;
                }
                getPage();
            });
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                params.pageNo = newPage;
                params.pageSize = pageSize;
                getPage();
            });
            gridApi.core.on.filterChanged($scope, function() {
                $scope.grid = this.grid;
                var filterArr = [];
                $timeout(function() {
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
                }, 1000);
            });
        },
        columnDefs: [{
            field: 'operaDate',
            displayName: '手术开始时间',
            cellTooltip: function(row, col) {
                return row.entity.operaDate;
            }
        }, {
            field: 'operRoomName',
            displayName: '手术室',
            cellTooltip: function(row, col) {
                return row.entity.operRoomName;
            }
        }, {
            field: 'name',
            displayName: '姓名',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'sex',
            displayName: '性别',
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: '男',
                    label: '男'
                }, {
                    value: '女',
                    label: '女'
                }]
            },
            cellTooltip: function(row, col) {
                return row.entity.sex;
            },
            width: 70
        }, {
            field: 'age',
            displayName: '年龄',
            cellTooltip: function(row, col) {
                return row.entity.age;
            },
            width: 70
        }, {
            field: 'hid',
            displayName: '住院号',
            cellTooltip: function(row, col) {
                return row.entity.hid;
            },
            width: 90
        }, {
            field: 'bed',
            displayName: '床号',
            cellTooltip: function(row, col) {
                return row.entity.bed;
            },
            width: 80
        }, {
            field: 'designedOptName',
            displayName: '手术名称',
            cellTooltip: function(row, col) {
                return row.entity.designedOptName;
            },
            minWidth: 200
        }, {
            field: 'diagnosisName',
            displayName: '术前诊断',
            cellTooltip: function(row, col) {
                return row.entity.diagnosisName;
            },
            minWidth: 200
        }, {
            field: 'designedAnaesMethodName',
            displayName: '麻醉方法',
            cellTooltip: function(row, col) {
                return row.entity.designedAnaesMethodName;
            },
            minWidth: 150
        }, {
            field: 'anesthetistName',
            displayName: '麻醉医师',
            cellTooltip: function(row, col) {
                return row.entity.anesthetistName;
            }
        }, {
            field: 'circunurseName1',
            displayName: '巡回护士',
            cellTooltip: function(row, col) {
                return row.entity.circunurseName1;
            }
        }, {
            field: 'instrnurseName1',
            displayName: '器械护士',
            cellTooltip: function(row, col) {
                return row.entity.instrnurseName1;
            }
        }, {
            field: 'documentState',
            displayName: '文书情况',
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.documentState;
            },
            width: 90
        }, {
            field: 'regOptId',
            displayName: '操作',
            enableSorting: false,
            enableFiltering: false,
            width: 70,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.query(row.entity)>查看</a></div>',
        }]
    };

    $scope.refresh = function() {
        getPage(true);
    }

    function getPage(isRefresh) {
        IHttp.post('operation/getRegOptByState', params).then((rs) => {
            if (rs.status === 200 && rs.data.resultCode === '1') {
                $scope.gridOptions.totalItems = rs.data.total;
                $scope.gridOptions.data = rs.data.resultList;
                if (isRefresh) {
                    toastr.success('刷新成功！');
                }
            } else {
                toastr.error(rs.data.resultMessage);
            }
        });
    }

    getPage();

    $scope.query = function(row) {
        sessionStorage.setItem('hasAnaesPacuRec', row.pacuId === '' ? false : true);
        sessionStorage.setItem('showPlacentaAgree', row.sex === '男' ? false : true);
        sessionStorage.setItem('showRiskAsseLog', row.isLocalAnaes == '1' ? false : true);
        sessionStorage.setItem('pageOption', JSON.stringify(params));

        $rootScope.$state.go(toUrl, {
            regOptId: row.regOptId
        });
    }
}