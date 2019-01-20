TypeNkjCtrl.$inject = ['$rootScope', '$scope', '$window', 'IHttp', 'anesRecordServe', 'select', 'auth', 'toastr'];

module.exports = TypeNkjCtrl;

function TypeNkjCtrl($rootScope, $scope, $window, IHttp, anesRecordServe, select, auth, toastr) {
    var vm = this;
    vm.regOpt = {};
    var regOptId = $rootScope.$stateParams.regOptId;
    $scope.docInfo = auth.loginUser();

    var currRouteName = $rootScope.$state.current.name;
    $scope.$on('$stateChangeStart', function() {
        anesRecordServe.stopTimerRt();
    });

    //术中启动定时监测
    if (currRouteName == 'midTypeNkj_qnz') {
        anesRecordServe.startTimerRt(regOptId);
    }
    select.getRegOptInfo(regOptId).then(function (rs){
        vm.regOpt = rs.data.resultRegOpt;
        var url = 'http://197.70.8.8:81/UisReport/list/reportlist.aspx?ConType=3&inhosptId=' + vm.regOpt.hid;
        $window.typeNkj.location.href = url;
    });
     $scope.$emit('printDone', {flag:'typeNkj'});//此发射此文书下载成功了的信号
}
