TypeBCtrl.$inject = ['$rootScope', '$scope', '$window', 'IHttp', 'select', '$filter', 'anesRecordServe', 'auth', 'toastr'];

module.exports = TypeBCtrl;

function TypeBCtrl($rootScope, $scope, $window, IHttp, select, $filter, anesRecordServe, auth, toastr) {
    var vm = this;
    vm.regOpt = {};
    var regOptId = $rootScope.$stateParams.regOptId;
    $scope.docInfo = auth.loginUser();

    var currRouteName = $rootScope.$state.current.name;
    $scope.$on('$stateChangeStart', function() {
        anesRecordServe.stopTimerRt();
    });

    var params = {
        pageNo: 1,
        pageSize: 1000,
        sort: '',
        orderBy: '',
        filters: [{field: 'regOptId', value: regOptId}]
    }

    select.getRegOptInfo(regOptId).then(function (rs){
        vm.regOpt = rs.data.resultRegOpt;
    });

    //术中启动定时监测
    if (currRouteName == 'midTypeB_qnz') {
    	anesRecordServe.startTimerRt(regOptId);
    }
    // select.getRegOptInfo(regOptId).then(function (rs){
    //     vm.regOpt = rs.data.resultRegOpt;
    //     var url = 'http://197.70.8.8:81/UisReport/list/reportlist.aspx?ConType=1&inhosptId=' + vm.regOpt.hid;
    //     $window.typeB.location.href = url;
    // });
    

    // his导入
    $scope.import = function(event) {
        IHttp.post("interfacedata/synChecksDataList", { regOptId: regOptId }).then(function(rs) {
            if (rs.data.resultCode != '1')
                return;
            toastr.success(rs.data.resultMessage);
            initData();
        });
    }

    initData();

    function initData() {
        IHttp.post("document/getPatCheckRecordList", params).then(function(rs) {
            if (rs.data.resultCode != '1')
                return;
            rs.data.checkRecordList.forEach(function(i) {
                i.checkTime = $filter('date')(i.checkTime, 'yyyy-MM-dd');
                i.reportDate = $filter('date')(i.reportDate, 'yyyy-MM-dd');
                i.state = i.state == '1' ? '未出报告' : (i.state == '2' ? '未审核' : '已审核');
            });
            $scope.griddata = rs.data.checkRecordList;
            $scope.gridtotal = rs.data.total;
        });
    }
}
