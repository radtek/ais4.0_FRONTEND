recycleAutoBlood.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', 'auth', '$timeout', 'select', '$window', 'confirm'];

module.exports = recycleAutoBlood;

function recycleAutoBlood($rootScope, $scope, IHttp, toastr, auth, $timeout, select, $window, confirm) {
    var vm = this,
        promise;
    var regOptId = $rootScope.$state.params.regOptId;
    $scope.accede = {};
    $scope.setting = $rootScope.$state.current.data;
    $scope.$emit('readonly', $scope.setting);
    $scope.docInfo = auth.loginUser();
    $scope.saveActive = auth.getDocAuth();

    select.getAnaesthetists().then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        $scope.anesthetistList = rs.data.userItem;
    });
    
    $timeout(function (){
        $scope.$watch('accedeItem.anaestheitistId', function(n, o) {
            $scope.eSignatureAnaestheitist = [];
            angular.forEach($scope.anesthetistList, function(item) {
                if (item.userName == n) {
                    $scope.eSignatureAnaestheitist.push(item.picPath + '?t=' + new Date().getTime());
                }
            })
        }, true)
    }, 1000);

    function init() {
        IHttp.post('document/searchAccedeByRegOptId', { 'regOptId': regOptId }).then(function(rs) {
            if (rs.data.resultCode != 1)
                return;
            vm.regOptItem = rs.data.regOptItem;
            vm.accedeItem = rs.data.accedeItem;
            $scope.processState = vm.accedeItem.processState;
            $scope.$emit('processState', $scope.processState);
        });
    }

    init();

    $scope.$on('print', () => {
        $scope.$emit('doc-print');
    });
    $scope.$emit('printDone', {flag:'recycleAutoBlood'});//此发射此文书下载成功了的信号
}
