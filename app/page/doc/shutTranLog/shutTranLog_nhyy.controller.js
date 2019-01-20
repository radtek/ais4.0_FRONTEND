ShutTranLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$window', '$q', '$timeout', '$filter', 'toastr', 'select', 'confirm', 'utils', 'dateFilter', 'auth'];

module.exports = ShutTranLogCtrl;

function ShutTranLogCtrl($rootScope, $scope, IHttp, $window, $q, $timeout, $filter, toastr, select, confirm, utils, dateFilter, auth) {
    $scope.setting = $rootScope.$state.current.data;

    var promise;
    var vm = this,
        regOptId = $rootScope.$stateParams.regOptId;
    $scope.docInfo = auth.loginUser();
    $scope.docUrl = auth.loginUser().titlePath;
    $scope.saveActive = auth.getDocAuth();

    select.getNurses().then((rs) => {
        if (rs.data.resultCode != 1) return;
        $scope.nurseList = rs.data.userItem;
    });

    let moreOptions = [
        {code: 'supportMaterial', total: 9},  //体位支持用物多选
        {code: 'indwellPipeDetail1', total: 7},  //PACU/ICU留置导管详情多选
        {code: 'indwellPipeDetail2', total: 7},  //病房留置导管详情多选
        {code: 'negativePosition', total: 5},  //负极板位置多选
        {code: 'optbodys', total: 6}  //体位多选
    ];

    IHttp.post('document/searchOptCareRecordByRegOptId', { regOptId: regOptId, inOperRoomTime: new Date().getTime() }).then(function(rs) {
        vm.regOptItem = rs.data.searchRegOptByIdFormBean;
        vm.optCareRecord = rs.data.optCareRecord;
        //初始化时发送文书状态
        $scope.processState = vm.optCareRecord.processState;
        utils.moreOptData($scope, moreOptions, vm.optCareRecord);
        $scope.$emit('processState', vm.optCareRecord.processState);
    });

    function submit(processState, type) {
        utils.moreOptParams($scope, moreOptions, vm.optCareRecord);
        let params = angular.copy(vm.optCareRecord);
        params.anaesMethodList = [];
        params.shiftChangeNurseList = [];
        params.shiftChangedNurseList = [];
        params.instrnurseList = [];
        params.processState = processState;
        IHttp.post('document/updateOptCareRecord', params).then((rs) => {
            if (rs.data.resultCode != 1) return;
            toastr.success(rs.data.resultMessage);
            vm.optCareRecord.processState = processState;
            $scope.processState = processState;
            if (type === 'print') {
                $scope.$emit('end-print');
            } else {
                $scope.$emit('processState', processState);
            }
        });
    }

    function save(processState, type) {
        $scope.verify = processState == 'END';
        if (processState === 'END') {
            // if (!vm.optCareRecord.inOperRoomTime) {
            //     toastr.warning('请输入必填项信息');
            //     return;
            // }
            if (type == 'print') {
                if (vm.optCareRecord.processState === 'END')
                    $scope.$emit('doc-print');
                else
                    confirm.show('打印的文书将归档，且不可编辑，是否继续打印？').then(function(data) { submit(processState, type); });
            } else {
                if (vm.optCareRecord.processState === 'END')
                    submit(processState);
                else
                    confirm.show('提交的文书将归档，并且不可编辑，是否继续提交？').then(function(data) { submit(processState, type); });
            }
        } else
            submit(processState);
    }

    $scope.$on('save', () => {
        if ($scope.saveActive && $scope.processState == 'END')
            save('END');
        else
            save('NO_END');
    });

    $scope.$on('submit', () => {
        save('END');
    })

    $scope.$on('print', () => {
        save('END', 'print');
    });
    $scope.$emit('printDone', {flag:'shutTranLog'});//此发射此文书下载成功了的信号
}