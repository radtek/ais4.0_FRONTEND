userDefinedDoc.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$timeout', '$uibModal','$filter','toastr'];

module.exports = userDefinedDoc;

function userDefinedDoc($rootScope, $scope, IHttp, uiGridConstants, $timeout, $uibModal,$filter,toastr) {

	var promise;

	$scope.params = {
        pageNo: 1,
        pageSize: 15,
        sort: '',
        orderBy: '',
        filters: []
    };
    
    $scope.gridDoc = {
        enableFiltering: false,
        enableGridMenu: true,
        enableSorting : false,
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
                getDocList();
            });
            //分页
            gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                $scope.params.pageNo = newPage;
                $scope.params.pageSize = pageSize;
                getDocList();
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
                    getDocList();
                }, 1000)
            });
        },
        columnDefs: [{
            field: 'docThemeName',
            displayName: '自定义文书名称',
            enableSorting: false ,
            cellTooltip: function(row, col) {
                return row.entity.docThemeName;
            }
        }, {
            field: 'createTime_',
            displayName: '创建时间',  
            width:135,          
            cellTooltip: function(row, col) {
                return row.entity.createTime_;
            }
        }, {
            field: 'menuParterNames',
            displayName: '应用模块',            
            cellTooltip: function(row, col) {
                return row.entity.menuParterNames;
            }
        }, {
            field: 'roleNames',
            displayName: '操作角色',            
            cellTooltip: function(row, col) {
                return row.entity.roleNames;
            }
        }, {
            field: 'themeState_',//审核设置1.未提交2.待审核，3.审核通过4.审核不通过
            displayName: '审核状态', 
            width:90,                      
            cellTooltip: function(row, col) {
                return row.entity.themeState_;
            }
        }, {
            field: 'docThemeId',
            displayName: '操作',
            enableFiltering: false,
            enableSorting: false,
            cellTemplate: '<div class="ui-grid-cell-contents" ><a ng-click=grid.appScope.setDoc(row)>设置　</a><a  ng-if="row.entity.themeState != 3" ng-click=grid.appScope.editDoc(row)>|　编辑文书　</a><a ng-if="row.entity.themeState != 3 && row.entity.themeState != 1" ng-click=grid.appScope.checkDoc(row)>|　审核　</a><a ng-if="row.entity.themeState != 3" ng-really-message="确定删除该文书?" confirm=grid.appScope.delDoc(row)>|　删除</a></div>',
        }],
        data: []
    };

    $scope.refresh = function() {
        getDocList();
    }

    var getDocList = function() {
        IHttp.post("document/searchDocTheme", $scope.params).then(function(data) {
            data = data.data;
            $scope.gridDoc.totalItems = data.total;
            for (var i = 0; i < data.docThemeList.length; i++) {
                data.docThemeList[i].createTime_ = $filter('date')(new Date(data.docThemeList[i].createTime), 'yyyy-MM-dd HH:mm');
                //审核设置1.未提交2.待审核，3.审核通过4.审核不通过
                if (data.docThemeList[i].themeState == '1') {
                    data.docThemeList[i].themeState_ = '未提交';
                } else if(data.docThemeList[i].themeState == '2') {
                    data.docThemeList[i].themeState_ = '待审核';
                } else if(data.docThemeList[i].themeState == '3') {
                    data.docThemeList[i].themeState_ = '审核通过';
                } else if(data.docThemeList[i].themeState == '4') {
                    data.docThemeList[i].themeState_ = '审核不通过';
                }                 
            }
            $scope.gridDoc.data = data.docThemeList;
        });
    }
    getDocList();	

	//编辑文书
	$scope.editDoc = function(row) {
        $rootScope.$state.go('editDoc', { docThemeId:row.entity.docThemeId });
    }

	$scope.setDoc=function(row){
		
		var scope = $rootScope.$new();
        if (row === undefined) {
            scope.state = 0;
        } else {
            scope.item = row.entity;         
        }
        $uibModal.open({
            animation: true,            
            template: require('./docConfig.html'),
            controller: require('./docConfig.controller'),
            controllerAs: 'vm',
            size: 'lg',
            backdrop:'static',
            scope: scope
        }).result.then(function() {
            getDocList();
        });
	}

    $scope.checkDoc = function(row){
        var scope = $rootScope.$new();
        if (row === undefined) {
            scope.state = 0;
        } else {
            scope.item = row.entity;         
        }
        $uibModal.open({
            animation: true,            
            template: require('./docCheck.html'),
            controller: require('./docCheck.controller'),
            controllerAs: 'vm',
            size: 'lg',
            backdrop:'static',
            scope: scope
        }).result.then(function() {
            getDocList();
        });
    }

    $scope.delDoc = function(row){
            
            if($rootScope.permission.indexOf('DEL')===-1){
                toastr.error("对不起，您没有权限。");
                return;
            }
            
            promise = $timeout(function() {
            
                IHttp.post('document/delDocTheme',{
                      "docThemeId":row.entity.docThemeId
                  }).then(function(rs) {                    
                        var data=rs.data;    
                        if (data.resultCode === '1') {
                            toastr.info('删除成功！');//alert('重置成功');
                            getDocList();
                        }else{
                            toastr.error(data.resultMessage);
                        } 
                });
        
            },200);
           

           
    }
}