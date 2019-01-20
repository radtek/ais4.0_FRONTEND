module.exports = angular.module('pacuRecordLog', [])
    .config(route)
    .directive('docAnaesPacuRec', docAnaesPacuRec)
    .directive('docAnaesPacuRecNhfe', docAnaesPacuRec_nhfe)
    .directive('docAnaesPacuRecHtyy', docAnaesPacuRec_htyy)
    .name;

route.$inject = ['$stateProvider'];


var pacu_base = {
    parent: 'doc',
    template: require('./base.pacuRecordLog.html'),
    less: require('./base.pacuRecordLog.less'),
    controller: require('./base.pacuRecordLog.controller'),
    controllerAs: 'vm'
}
var pacu_nhfe = {
    parent: 'doc',
    template: require('./nhfe.pacuRecordLog.html'),
    less: require('./base.pacuRecordLog.less'),
    controller: require('./nhfe.pacuRecordLog.controller'),
    controllerAs: 'vm'
}
var pacu_htyy = {
    parent: 'doc',
    template: require('./htyy.pacuRecordLog.html'),
    less: require('./base.pacuRecordLog.less'),
    controller: require('./htyy.pacuRecordLog.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider
         // 基线版本 > 手术管理 > Pacu复苏单
        .state('pacuRecovery_base', angular.merge({}, pacu_base, {
            url: '/pacuRecovery_base/:regOptId',
            data: { pageState: 4 }
        }))
        // 基线版本 > 复苏室 > Pacu复苏单
        .state('operRecovery_base', angular.merge({}, pacu_base, {
            url: '/operRecovery_base/:regOptId',
            data: { pageState: 3 }
        }))
        // nhfe > 手术管理 > Pacu复苏单
        .state('pacuRecovery_nhfe', angular.merge({}, pacu_nhfe, {
            url: '/pacuRecovery_nhfe/:regOptId',
            data: { pageState: 4 }
        }))
         // nhfe > 复苏室 > Pacu复苏单
        .state('operRecovery_nhfe', angular.merge({}, pacu_nhfe, {
            url: '/operRecovery_nhfe/:regOptId',
            data: { pageState: 3 }
        }))

         // htyy > 手术管理 > Pacu复苏单
        .state('pacuRecovery_htyy', angular.merge({}, pacu_htyy, {
            url: '/pacuRecovery_htyy/:regOptId',
            data: { pageState: 4 }
        }))
         // htyy > 复苏室 > Pacu复苏单
        .state('operRecovery_htyy', angular.merge({}, pacu_htyy, {
            url: '/operRecovery_htyy/:regOptId',
            data: { pageState: 3 }
        }))

        // nhfe > 科研管理 > Pacu复苏单
        .state('pacuRecovery_nhfe_kygl', angular.merge({}, pacu_nhfe, {
            url: '/pacuRecovery_nhfe_kygl/:regOptId',
            data: { pageState: 4,readonly:true}
        }))
        .state('pacuRecordPrint_nhfe', angular.merge({}, pacu_base, {//当前打印
            parent: undefined,
            url: '/pacuRecordPrint_nhfe/:regOptId',
            template: require('./nhfe.pacuRecordLogPrint.html'),
            controller: require('./nhfe.pacuRecordLogPrint.controller')
        }))
        .state('pacuRecordPrint_htyy', angular.merge({}, pacu_base, {//当前打印
            parent: undefined,
            url: '/pacuRecordPrint_htyy/:regOptId',
            template: require('./htyy.pacuRecordLogPrint.html'),
            controller: require('./htyy.pacuRecordLogPrint.controller')
        }))
        .state('pacuRecordPrint', angular.merge({}, pacu_base, {
            parent: undefined,
            url: '/pacuRecordPrint/:regOptId',
            template: require('./base.pacuRecordLogPrint.html'),
            controller: require('./base.pacuRecordLogPrint.controller')
        }))
}

function docAnaesPacuRec() {
    return {
        template: require('./base.pacuRecordLogPrint.html'),
        less: require('./base.pacuRecordLog.less'),
        controller: require('./base.pacuRecordLogPrint.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}

function docAnaesPacuRec_nhfe() {
    return {
        template: require('./nhfe.pacuRecordLogPrint.html'),
        less: require('./base.pacuRecordLog.less'),
        controller: require('./nhfe.pacuRecordLogPrint.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}
function docAnaesPacuRec_htyy() {
    return {
        template: require('./htyy.pacuRecordLogPrint.html'),
        less: require('./base.pacuRecordLog.less'),
        controller: require('./htyy.pacuRecordLogPrint.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}
