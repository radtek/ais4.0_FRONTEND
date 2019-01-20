myStockCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$filter', '$timeout', 'auth', 'toastr', '$uibModal', 'uiGridServe'];

module.exports = myStockCtrl;

function myStockCtrl($rootScope, $scope, IHttp, $filter, $timeout, auth, toastr, $uibModal, uiGridServe) {
    $scope.startTime = $filter('date')(new Date(), 'yyyy-MM-01 00:00');
    $scope.endTime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm');

    var promise,
        params = uiGridServe.params();

    $scope.gridOptions = uiGridServe.option({
        columnDefs: [{
            field: 'receiveName',
            displayName: '名称',
            cellTooltip: function(row, col) {
                return row.entity.receiveName;
            },
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }, {
            field: 'instrumentName',
            displayName: '耗材名称',
            cellTooltip: function(row, col) {
                return row.entity.instrumentName;
            },
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }, {
            field: 'allOutNumber',
            displayName: '总取耗材',
            cellTooltip: function(row, col) {
                return row.entity.allOutNumber;
            },
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }, {
            field: 'allRetreatNumber',
            displayName: '总退耗材',
            cellTooltip: function(row, col) {
                return row.entity.allRetreatNumber;
            },
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }, {
            field: 'allLoseNumber',
            displayName: '总报损',
            cellTooltip: function(row, col) {
                return row.entity.allLoseNumber;
            },
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }, {
            field: 'chargeAmount',
            displayName: '计费数量',
            cellTooltip: function(row, col) {
                return row.entity.chargeAmount;
            },
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }, {
            field: 'allActualNumber',
            displayName: '本月总使用',
            cellTooltip: function(row, col) {
                return row.entity.allActualNumber;
            },
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }, {
            field: 'allActualNumber',
            displayName: '实际使用',
            visible:false,
            cellTooltip: function(row, col) {
                return row.entity.allActualNumber;
            },
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }, {
            field: 'outTime',
            displayName: '时间',
            visible: false,
            enableFiltering: false,
            cellTooltip: function(row, col) {
                return row.entity.outTime;
            },
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)}
        }, {
            field: 'id',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellClass: function(grid, row, col, rowRenderIndex, colRenderIndex) {return setColor(row)},
            cellTemplate: '<div class="ui-grid-cell-contents" ><a href="" ng-click=grid.appScope.showIn(row)>查看明细</a></div>'
        }]
    },getPage);

    getPage();

    function setColor(row) {
        if (!row.entity.chargeAmount) {
            return '';
        }else if (row.entity.allActualNumber != row.entity.chargeAmount) {
            return 'my-stock-red';
        }else if (row.entity.chargeAmount == 0 && row.entity.allActualNumber != 0) {
            return 'my-stock-red';
        }else {
            return '';
        }
    }

    function getPage(self) {
        var startTime = $scope.startTime;
        var endTime = $scope.endTime;
        if(self){//对话框有GRID，从服务里给回调函数把页码传出来更新页码
            params.pageNo=self.params.pageNo;
            params.pageSize=self.params.pageSize;
        }
        params.filters = [{ "field": "startTime", "value": startTime }, { "field": "endTime", "value": endTime }];
        IHttp.post('basedata/queryConsumablesByPersonal', params).then(function(rs) {
            if (rs.data.resultCode != 1) {
                toastr.error(rs.data.resultMessage);
                return;
            }
            $scope.gridOptions.totalItems = rs.data.total;
            var data = rs.data.resultList;
            for (var i = 0; i < data.length; i++) {
                if (data[i].outTime) {
                    data[i].outTime = $filter('date')(data[i].outTime, 'yyyy-MM-dd HH:mm');
                }
            }
            $scope.gridOptions.data = data;
        });
    }

    $scope.export = function(type) {
        pagesize = $scope.gridOptions.totalItems;
        params.pageNo = 1;
        params.pageSize = pagesize;
        getPage();
        setTimeout(function() {
            uiGridServe.exports('个人物资使用情况');
            pagesize = 15;
        }, 1000);
    }

    $scope.showIn = function(row) {
        var scope = $rootScope.$new();
        scope.data = {
            tag: '0',
            row: row,
            startTime: $scope.startTime,
            endTime: $scope.endTime
        };

        var modalInstance=$uibModal.open({
            animation: true,
            size: 'lg',
            template: require('../myStock/myStockInfo.html'),
            controller: require('../myStock/myStockInfo.controller'),
            less: require('../myStock/myStockInfo.less'),
            controllerAs: 'vm',
            backdrop: 'static',
            scope: scope
        });
        // modalInstance.result.then((data) => {
        //     if (data === 'success') {
        //         getPage();
        //     }
        // });
        modalInstance.result.then((data) => {
            if (data === 'success') {
                getPage();
            }
        });

    }

    $scope.query = function() {
        getPage();
    }
}