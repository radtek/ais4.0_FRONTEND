RiskAsseLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'select', 'toastr', 'confirm', '$window', 'utils', 'auth', '$timeout'];

module.exports = RiskAsseLogCtrl;

function RiskAsseLogCtrl($rootScope, $scope, IHttp, select, toastr, confirm, $window, utils, auth, $timeout) {
    let vm = this;
    $scope.setting = $rootScope.$state.current.data;
    let regOptId = $rootScope.$stateParams.regOptId;
    $scope.$emit('readonly', $scope.setting);
    $scope.docInfo = auth.loginUser();
    $scope.docUrl = auth.loginUser().titlePath;
    let beCode = $scope.docInfo.beCode;
    $scope.saveActive = auth.getDocAuth();

    vm.dangerous = [
        {codeName: '中度危险', codeValue: '1'},
        {codeName: '高度危险', codeValue: '2'},
        {codeName: '极度危险', codeValue: '3'}
    ];

    let moreOptions = [
        {code: 'pressurePart', total: 8},  //受压部位多选
        {code: 'prePrecaution', total: 6},  //术前预防措施多选
        {code: 'gelAppliance', total: 7},  //受压皮肤凝胶用具的使用多选
        {code: 'midPrecaution', total: 11},  //术中预防措施多选
        {code: 'specialCase', total: 3}  //特殊情况备注多选
    ];
    select.getNurses().then((rs) => {
        if (rs.data.resultCode != 1) return;
        $scope.nurseList = rs.data.userItem;
    });

    function initPage() {
        IHttp.post('document/searchBradenEvaluateByRegOptId', { regOptId: regOptId }).then((rs) => {
            vm.regOpt = rs.data.regOptItem;
            vm.bradenEvaluate = rs.data.bradenEvaluate;
            vm.bradenDetailList = rs.data.bradenDetailList;
            utils.moreOptData($scope, moreOptions, vm.bradenEvaluate);
            vm.computeTotal(rs.data.circunurse);
            $scope.processState = vm.bradenEvaluate.processState;
            $scope.$emit('processState', vm.bradenEvaluate.processState);
        });
    }

    initPage();

    vm.computeTotal = function (circunurse) {
        let total = [0, 1, 2];
        let items = ['ageSco', 'bmiSco', 'skinSco', 'optBodySco', 'exforceSco', 'operTimeSco', 'operFactorSco'];
        if (vm.bradenDetailList.length == 0) return;
        for(var i of total) {
            vm.bradenDetailList[i].totalSco = 0;
            for(var item of items) {
                let score = angular.copy(vm.bradenDetailList[i][item]);
                if (!score) score = 0;
                vm.bradenDetailList[i].totalSco += parseInt(score);
            }
            if (vm.bradenDetailList[i].totalSco > 0 && vm.bradenDetailList[i].totalSco <= 10) {
                vm.bradenDetailList[i].dangerLevel = '1';
            } else if (vm.bradenDetailList[i].totalSco == 11) {
                vm.bradenDetailList[i].dangerLevel = '2';
            } else if (vm.bradenDetailList[i].totalSco >= 12) {
                vm.bradenDetailList[i].dangerLevel = '3';
            } else {
                vm.bradenDetailList[i].dangerLevel = '';
            }
        }
    }

    // 提交
    function submit(procState, type) {
        vm.bradenEvaluate.processState = procState;
        utils.moreOptParams($scope, moreOptions, vm.bradenEvaluate);
        let params = {
            bradenEvaluate: vm.bradenEvaluate,
            bradenDetailList: vm.bradenDetailList
        }
        IHttp.post('document/saveBradenEvaluate', params).then(function(res) {
            if (res.data.resultCode === '1') {
                toastr.success(res.data.resultMessage);
                $scope.processState = vm.bradenEvaluate.processState;
                if (type === 'print') {
                    $scope.$emit('end-print');
                } else {
                    $scope.$emit('processState', vm.bradenEvaluate.processState);
                }
            } else {
                toastr.error(res.data.resultMessage);
            }
        });
    }

    function save(processState, type) {
        $scope.verify = processState == 'END';
        if (processState === 'END') {
            // if (!vm.bradenEvaluate.inOperRoomTime) {
            //     toastr.warning('请输入必填项信息');
            //     return;
            // }
            if (type == 'print') {
                if (vm.bradenEvaluate.processState === 'END')
                    $scope.$emit('doc-print');
                else
                    confirm.show('打印的文书将归档，且不可编辑，是否继续打印？').then(function(data) { submit(processState, type); });
            } else {
                if (vm.bradenEvaluate.processState === 'END')
                    submit(processState);
                else
                    confirm.show('提交的文书将归档，并且不可编辑，是否继续提交？').then(function(data) { submit(processState, type); });
            }
        } else
            submit(processState);
    }

    $scope.$watch('processState', function(n) {
        if (n == undefined) return;
        $scope.$emit('processState', n);
    }, true);

    $scope.$on('save', function() {
        if ($scope.saveActive && $scope.processState == 'END')
            save('END');
        else
            save('NO_END');
    });

    $scope.$on('submit', function() {
        save('END');
    });

    $scope.$on('print', function() {
        save('END', 'print');
    });
    $scope.$emit('printDone', {flag:'riskAsseLog'});
}