anesRecordLogPrint.$inject = ['$rootScope', '$scope', 'IHttp', 'anesRecordInter', 'eCharts', 'anesRecordServe', 'select', 'auth', '$timeout', '$window'];

module.exports = anesRecordLogPrint;

function anesRecordLogPrint($rootScope, $scope, IHttp, anesRecordInter, eCharts, anesRecordServe, select, auth, $timeout, $window) {
    $('html').width(0).height('initial').css('min-width', '0px');
    $('body').width(0).height('initial').css('min-width', '0px');

    var vm = this,
        regOptId = $rootScope.$stateParams.regOptId,
        docId,
        inTime,
        ev_list = [],
        PAGES = [],
        eChartCol = 8,
        historyData = [],
        analgesicMedEvtName = '';

    // 获取文书的标题
    vm.docInfo = auth.loginUser();
    vm.regOptId = regOptId;

    vm.monOpt = {
        mmhg: ['mmHg', '220', '', '200', '', '180', '', '160', '', '140', '', '120', '', '100', '', '80', '', '60', '', '40', '', '20', '', '0'],
        c: ['', '℃', '', '38', '', '36', '', '34', '', '32', '', '30', '', '28', '', '26', '', '24', '', '22', '', '20'],
        kpa: ['', 'KPa', '28', '', '', '24', '', '', '20', '', '', '16', '', '', '12', '', '', '8', '', '', '4']
    };

    vm.view = {
        pageCur: 1, // 当前页数
        pageCount: 1, // 总页数
        pageSize: 49, // 默认一页大小 49
        pageDone: true, // 控制上一页、下一页可不可用
        viewShow: false // 控制数据视图是否显示
    };

    if (vm.pageState == 2)
        vm.view.pageCur = 1;
    select.sysCodeBy('awarenessPacu').then((rs) => { //意识PACU
        vm.awarenessList = rs.data.resultList;
    })
    select.sysCodeBy('ecg').then((rs) => { //ecg
        $scope.ecg = rs.data.resultList;
        $scope.ecg.forEach(function(v, k) {
            v.codeValue = parseInt(v.codeValue)
        })
    })
    anesRecordInter.pacuLeaveTo().then(function(result) { // 复苏室出室去向下拉选项值
        vm.pacuLeaveTo = result.data.resultList;
    });
    vm.medECfg = eCharts.config_pacu(vm.pageState, 'x', {}, { BeSmall: true });
    // vm.medECfg = eCharts.configPacu(vm.pageState, 'x', {}, { BeSmall: true });
    vm.medEOpt1 = eCharts.medOpt1(eChartCol, vm);
    // vm.cavH = {
    //     height: vm.medECfg.sum * 15 + 3
    // }
    vm.monECfg = eCharts.config1(vm.pageState, 'y', {});
    vm.monEOpt1 = eCharts.monOpt1(eChartCol, [{ min: 0, max: 240, interval: 10 }, { min: 18, max: 42, interval: 1 }, { min: 0, max: 32 }]);

    // 事件标记
    vm.markECfg = eCharts.config(1);
    // vm.markEOpt = eCharts.markOpt(eChartCol, 1);
    vm.markEOpt1 = eCharts.markOpt1(eChartCol, 1); //delete

    anesRecordInter.startOper(regOptId, '', { docType: 2 }).then(function(rs) {
        // var vm = angular.copy(vm)
        if (rs.data.resultCode !== '1') return;
        vm.docType = 2;
        vm.medECfg.dataLoaded = false;
        vm.monECfg.dataLoaded = false;
        vm.markECfg.dataLoaded = false;
        docId = rs.data.anaesRecord.anaRecordId;
        vm.startOper = anesRecordServe.initData(rs.data);

        vm.startOper.anaesPacuRec.anaesTypeShow = select.translateStringToArr(vm.startOper.anaesPacuRec.anaesType, 3);
        vm.startOper.anaesPacuRec.frontOperSpecialCaseShow = select.translateStringToArr(vm.startOper.anaesPacuRec.frontOperSpecialCase, 7);
        vm.startOper.anaesPacuRec.airwayPatencyShow = select.translateStringToArr(vm.startOper.anaesPacuRec.airwayPatency, 3);
        vm.startOper.anaesPacuRec.airwayConditionShow = select.translateStringToArr(vm.startOper.anaesPacuRec.airwayCondition, 3);
        if (!vm.startOper.regOpt.height) {
            vm.startOper.regOpt.height = '/';
        }
        if (!vm.startOper.regOpt.weight) {
            vm.startOper.regOpt.weight = '/';
        }
        $timeout(function() {
            vm.hasSig = false;
            vm.eSignatureAnaestheitist = [];
            angular.forEach(vm.anesthetistList, function(item) {
                for (var sign of vm.startOper.anesDocList) {
                    if (item.userName == sign.id) {
                        if (!vm.hasSig)
                            vm.hasSig = item.picPath ? true : false;
                        vm.eSignatureAnaestheitist.push({ hasPath: item.picPath ? true : false, path: item.picPath + '?t=' + new Date().getTime() });
                    }
                }
            })
        }, 1000);

        anesRecordServe.getobsDataPrint(vm, regOptId, docId, ev_list, { docType: 2 });
    });
    // $scope.$watch('vm.PAGES2', function(n) {
    //     if(!n)return;
    //     $scope.$emit('printDone', { flag: 'anes' });
    // }, true);
    vm.pageFinish = function() {
        var name = $rootScope.$state.current.name;
        if (name == 'docPrint' || name == 'anesRecordPrint' || name == auth.loginUser().docPrint) { //多文书打印   指令打印 
            $scope.$emit('printDone', { flag: 'anes' });
            return;
        };
        $timeout(function() { //自身打印
            $window.print();
            $window.close();
        }, 1000);
    }
    vm.eq = function(a, b) {
        return angular.equals(a, b);
    }
}