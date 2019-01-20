NursRecordLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'select', '$q', 'toastr', 'confirm', '$window', '$timeout', '$uibModal', 'utils', '$filter', 'auth'];

module.exports = NursRecordLogCtrl;

function NursRecordLogCtrl($rootScope, $scope, IHttp, select, $q, toastr, confirm, $window, $timeout, $uibModal, utils, $filter, auth) {
    let vm = this;
    let regOptId = $rootScope.$stateParams.regOptId;
    $scope.setting = $rootScope.$state.current.data;
    $scope.docInfo = auth.loginUser();
    $scope.$emit('readonly', $scope.setting);
    $scope.saveActive = auth.getDocAuth();

    let moreOptions = [
        {code: 'bodyAbnormalDetail', total: 9},  //体格发育多选
        {code: 'visionDefectDetail', total: 2},  //视力障碍多选
        {code: 'sleepQualityBadReason', total: 2},  //睡眠质量差原因多选
        {code: 'allergicDetail', total: 3},  //过敏史多选
        {code: 'infectionDetail', total: 7},  //感染情况多选
        {code: 'medicalHisDetail', total: 5},  //既往病史多选
        {code: 'implantHisDetail', total: 4},  //植入史多选
        {code: 'preCheck', total: 5},  //术前检查多选
        {code: 'signedAgreeDoc', total: 4},  //已签知情同意书多选
        {code: 'patMission', total: 4},  //患者宣教多选
        {code: 'guideTrain', total: 4},  //指导训练多选
        {code: 'prePrecautions', total: 7},  //术前注意事项多选
        {code: 'postDiscomfort', total: 5}  //术后不适多选
    ];
    initData();

    select.getNurses().then((rs) => {
        if (rs.data.resultCode != 1) return;
        $scope.nurseList = rs.data.userItem;
    });

    function initData() {
        IHttp.post('document/searchVisitEvaluateByRegOptId', { regOptId: regOptId }).then((rs) => {
            vm.regOpt = rs.data.regOptItem;
            vm.docVisitEvaluate = rs.data.docVisitEvaluate;
            vm.designedInstrnurse = rs.data.designedInstrnurse;
            vm.designedCircunurses = rs.data.designedCircunurses;
            utils.moreOptData($scope, moreOptions, vm.docVisitEvaluate);
            $scope.processState = vm.docVisitEvaluate.processState;
            $scope.$emit('processState', $scope.processState);
        });
    }

    function submit(processState, type) {
        utils.moreOptParams($scope, moreOptions, vm.docVisitEvaluate);
        let params = angular.copy(vm.docVisitEvaluate);
        params.processState = processState;
        IHttp.post('document/saveVisitEvaluate', params).then((rs) => {
            if (rs.data.resultCode != 1) return;
            toastr.success(rs.data.resultMessage);
            vm.docVisitEvaluate.processState = processState;
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
            // if (!vm.docVisitEvaluate.inOperRoomTime) {
            //     toastr.warning('请输入必填项信息');
            //     return;
            // }
            if (type == 'print') {
                if (vm.docVisitEvaluate.processState === 'END')
                    $scope.$emit('doc-print');
                else
                    confirm.show('打印的文书将归档，且不可编辑，是否继续打印？').then(function(data) { submit(processState, type); });
            } else {
                if (vm.docVisitEvaluate.processState === 'END')
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

    $scope.$on('print', () => {
        save('END', 'print');
    });

    $scope.$on('submit', () => {
        save('END');
    })
    $scope.$emit('printDone', {flag:'nursRecordLog'});//此发射此文书下载成功了的信号
}