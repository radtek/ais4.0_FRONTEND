SelfPayDictionaryCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'auth', 'toastr', 'uiGridConstants', 'confirm', '$uibModal', '$timeout'];

module.exports = SelfPayDictionaryCtrl;

function SelfPayDictionaryCtrl($rootScope, $scope, IHttp, auth, toastr, uiGridConstants, confirm, $uibModal, $timeout) {
    $scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    var promise;

    $scope.gridOptions = {
        enableFiltering: true,
        enableGridMenu: true,
        paginationPageSizes: [ 15, 30, 50],
        rowHeight: 40,
        paginationPageSize: $scope.params.pageSize,
        enableColumnMenus:false,//表头列的菜单按钮，默认false
        useExternalFiltering: true,
        useExternalPagination: true,
        useExternalSorting: true,
        onRegisterApi: function(gridApi) {
            //排序
            gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                if (sortColumns.length === 0) {
                    $scope.params.orderBy = '';
                } else {
                    $scope.params.orderBy = sortColumns[0].sort.direction;
                    $scope.params.sort = sortColumns[0].colDef.field;
                }
                getSelfPay();
            });
            //分页
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
                getSelfPay();
            });
            //过滤
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
                        if (value) {
                            filterArr.push({
                                field: fieldName,
                                value: value
                            });
                        }
                    });
                    $scope.params.filters = filterArr;
                    getSelfPay();
                }, 2000);
            });
        },
        columnDefs: [{
            field: 'name',
            displayName: '名称',
            cellTooltip: function(row, col) {
                return row.entity.name;
            }
        }, {
            field: 'price',
            displayName: '自负(%)',//'单价'
            cellTooltip: function(row, col) {
                return row.entity.price;
            }
        }, {
            field: 'type',
            displayName: '类型',
            cellTooltip: function(row, col) {
                return row.entity.type;
            }
        }, {
            field: 'enable',
            displayName: '状态',
            cellTooltip: function(row, col) {
                return row.entity.enable;
            },
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: "1",
                    label: '启用'
                }, {
                    value: "0",
                    label: '禁用'
                }]
            }
        }, {
            field: 'regionId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.editSelfPay(row)>编辑</a> | <a href="" ng-click=grid.appScope.delSelfPay(row)>删除</a></div>'
        }]
    };

    $scope.refresh = function() {
        getSelfPay();
    }

    var getSelfPay = function() {
        IHttp.post("basedata/querySelfPayInstrumentList", $scope.params).then(function(data) {
            data = data.data;
            $scope.gridOptions.totalItems = data.total;
            for (var i = 0; i < data.resultList.length; i++) {
                if (data.resultList[i].enable == '1') {
                    data.resultList[i].enable = '启用';
                } else {
                    data.resultList[i].enable = '禁用';
                }
                if (true) {
                    if (data.resultList[i].type == '1') {
                        data.resultList[i].type = '医保病人自负项目-材料';
                    } else if (data.resultList[i].type == '2') {
                        data.resultList[i].type = '医保病人自负项目-药品';
                    } else {
                        data.resultList[i].type = '农合病人自负项目';
                    }
                }else {
                    // if (data.resultList[i].type == '1') {
                    //     data.resultList[i].type = '自费';
                    // } else {
                    //     data.resultList[i].type = '高价';
                    // }
                }
            }
            $scope.gridOptions.data = data.resultList;
        });
    }
    getSelfPay();

    $scope.editSelfPay = function(row) {
        var scope = $rootScope.$new();
        if (row === undefined) {
            scope.selfPayId = 0;
        } else {
            scope.selfPayId = row.entity.id;
        }
        $uibModal.open({
            animation: true,
            template: require('./editSelfPayDictionary.html'),
            controller: require('./editSelfPayDictionary.controller'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        }).result.then(function() {
            getSelfPay();
        });
    }

    $scope.delSelfPay = function(row) {
        var selfPayId = 0;
        if (row) {
            selfPayId = row.entity.id;
        }
        confirm.show('你是否要删除该自负费用？').then(function(data) {
            IHttp.post("basedata/deleteSelfPayInstrument", { 'id': selfPayId }).then(function(rs) {
                if (rs.data.resultCode == '1') {
                    getSelfPay();
                    toastr.success("操作成功");
                }
            });
        });
    }
}
