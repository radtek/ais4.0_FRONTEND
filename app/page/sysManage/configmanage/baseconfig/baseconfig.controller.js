baseconfig.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', 'uiGridConstants', '$timeout', '$uibModal', 'baseConfig'];

module.exports = baseconfig;

function baseconfig($rootScope, $scope, IHttp, toastr, uiGridConstants, $timeout, $uibModal, baseConfig) {
    $scope.markPosition = baseConfig.position;
    $scope.field = '';
    let tabsList = [{title: '全部', type: ''}, {title: '麻醉药', type: '2'}, {title: '治疗药', type: '1'}, {title: '输液', type: 'I'}, {title: '出量', type: 'O'}, {title: '麻醉事件', type: '4'}];
    let params = {};
    // 初始化数据
    baseConfig.init().then(function(rs) {
        var rsList = rs.data.resultList;
        for (var a = 0; a < rsList.length; a++) {
            if (rsList[a].configureValue)
                rsList[a].configureValue = JSON.parse(rsList[a].configureValue);
            else
                rsList[a].configureValue = {};
            // 手术流程
            if (rsList[a].modularType == 1)
                $scope.surgProc = rsList[a];
            // 手术排程
            else if (rsList[a].modularType == 2)
                $scope.surgSchedule = rsList[a];
            // 数据同步
            else if (rsList[a].modularType == 3)
                $scope.DS = rsList[a];
            // 用药配置
            else if (rsList[a].modularType == 4)
                $scope.med = rsList[a];
            // 入量配置
            else if (rsList[a].modularType == 5)
                $scope.i = rsList[a];
            // 其它配置
            else if (rsList[a].modularType == 6)
                $scope.other = rsList[a];
            // 复苏单-用药配置
            else if (rsList[a].modularType == 7)
                $scope.med_pacu = rsList[a];
            // 复苏单-出入量配置
            else if (rsList[a].modularType == 8)
                $scope.i_pacu = rsList[a];
            // 麻醉记录单-用药、输液、出量页签配置
            else if (rsList[a].modularType == 9)
                params = rsList[a];
        }
    });

    // 手术流程
    $scope.$watch('surgProc', function(n, o) {
        if (angular.equals(n, o) || o == undefined)
            return;
        baseConfig.save(angular.copy(n));
        $timeout(function() {
            baseConfig.init();
        }, 1000);
    }, true);

    // 手术排程
    $scope.$watch('surgSchedule', function(n, o) {
        if (angular.equals(n, o) || o == undefined)
            return;
        baseConfig.save(angular.copy(n)); 
        $timeout(function() {
            baseConfig.init();
        }, 1000);       
    }, true);

    // 数据同步
    $scope.$watch('DS', function(n, o) {
        if (angular.equals(n, o) || o == undefined)
            return;
        baseConfig.save(angular.copy(n));
        $timeout(function() {
            baseConfig.init();
        }, 1000);
    }, true);

    // 用药配置
    $scope.$watch('med', function(n, o) {
        if (angular.equals(n, o) || o == undefined)
            return;
        baseConfig.save(angular.copy(n));
        assemblyJson();
    }, true);

    // 入量配置
    $scope.$watch('i', function(n, o) {
        if (angular.equals(n, o) || o == undefined)
            return;
        baseConfig.save(angular.copy(n));
        assemblyJson();
    }, true);
      // 用药配置PACU
    $scope.$watch('med_pacu', function(n, o) {
        if (angular.equals(n, o) || o == undefined)
            return;
        baseConfig.save(angular.copy(n));
    }, true);

    // 入量配置 PACU
    $scope.$watch('i_pacu', function(n, o) {
        if (angular.equals(n, o) || o == undefined)
            return;
        baseConfig.save(angular.copy(n));
    }, true);
    // 其它配置
    $scope.$watch('other', function(n, o) {
        if (angular.equals(n, o) || o == undefined)
            return;
        if ($scope.field === 'oRows' && n.configureValue.oRows == undefined)
            return;
        if ($scope.field === 'mongRows' && n.configureValue.mongRows == undefined)
            return;
        baseConfig.save(angular.copy(n));
        assemblyJson();
    }, true);

    function assemblyJson() {
        let jsonList = [];
        for(var item of tabsList) {
            if ($scope.med.configureValue.zlyRows && $scope.med.configureValue.zlyRows > 0 && item.type == '1') {
                item.title = $scope.med.configureValue.zlyName;
                jsonList.push(item);
            } else if ($scope.med.configureValue.mzyRows && $scope.med.configureValue.mzyRows > 0 && item.type == '2') {
                item.title = $scope.med.configureValue.mzyName;
                jsonList.push(item);
            } else if ($scope.i.configureValue.syRows && $scope.i.configureValue.syRows > 0 && item.type == 'I') {
                item.title = $scope.i.configureValue.syName;
                jsonList.push(item);
            } else if ($scope.other.configureValue.oRows && $scope.other.configureValue.oRows > 0 && item.type == 'O') {
                item.title = $scope.other.configureValue.oName;
                jsonList.push(item);
            } else if (item.type == '4' || item.type == '') {
                jsonList.push(item);
            }
        }
        params.configureValue = JSON.stringify(jsonList).replace('\\', '');
        IHttp.post('basedata/saveBasCustomConfigure', params).then(function(rs) {
            if (rs.data.resultCode != 1) return;
        });
    }
}