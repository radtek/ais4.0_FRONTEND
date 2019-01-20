module.exports = angular.module('anesRecordLog', [])
    .config(route)
    .directive('baseAnesRecordLog', baseAnesRecordLog)
    .directive('nhfeAnesRecordLog', nhfeAnesRecordLog)
    .directive('htyyAnesRecordLog', htyyAnesRecordLog)
    .name;

route.$inject = ['$stateProvider'];
var opt_base = {
    parent: 'doc',
    template: require('./base.anesRecordLog.html'),
    less: require('./anesRecordLog.less'),
    controller: require('./base.anesRecordLog.controller'),
    controllerAs: 'vm'
}
var opt_htyy = {
    parent: 'doc',
    template: require('./htyy.anesRecordLog.html'),
    less: require('./htyy.anesRecordLog.less'),
    controller: require('./htyy.anesRecordLog.controller'),
    controllerAs: 'vm'
}
// var opt_nhfe = {
//     parent: 'doc',
//     template: require('./nhfe.anesRecordLog.html'),
//     less: require('./nhfe.anesRecordLog.less'),
//     controller: require('./nhfe.anesRecordLog.controller'),
//     controllerAs: 'vm'
// }
var opt_nhfe = {
    parent: 'doc',
    template: require('./_nhfe.anesRecordLog.html'),
    less: require('./_nhfe.anesRecordLog.less'),
    controller: require('./_nhfe.anesRecordLog.controller'),
    controllerAs: 'vm'
}
/* 
 * data.pageState: 0(手术室) || 1(术中巡视) || 2(术后的麻醉记录单) || 3(复苏室) || 4(术后复苏室)
 * data.readonly: true(术中巡视、信息查询、科研查询)
 */
function route($stateProvider) {
    $stateProvider
        // 航天湘雅版本 > 手术室 > 麻醉记录单
        .state('anesRecordLog_htyy', angular.merge({}, opt_htyy, {//
            url: '/anesRecordLog_htyy/:regOptId',
            data: { pageState: 2 }
        }))
        // 航天湘雅版本 > 手术管理 > 麻醉记录单
        .state('operAnaesthesia_htyy', angular.merge({}, opt_htyy, {//
            url: '/operAnaesthesia_htyy/:regOptId',
            data: { pageState: 0 }
        }))
        .state('anesRecordLog_kygl_htyy', angular.merge({}, opt_htyy, {
            url: '/anesRecordLog_kygl_htyy/:regOptId',
            data: { pageState: 2, readonly: true }
        }))
        // 基线版本 > 手术室 > 麻醉记录单
        .state('anesRecordLog_base', angular.merge({}, opt_base, {//
            url: '/anesRecordLog_base/:regOptId',
            data: { pageState: 0 }/////////
        }))
        // 基线版本 > 手术管理 > 麻醉记录单
        .state('operAnaesthesia_base', angular.merge({}, opt_base, {//
            url: '/operAnaesthesia_base/:regOptId',
            data: { pageState: 2 }/////
        }))
        // nhfe > 手术管理 > 麻醉记录单
        .state('anesRecordLog_nhfe', angular.merge({}, opt_nhfe, {
            url: '/anesRecordLog_nhfe/:regOptId',
            data: { pageState: 2 }
        }))
        // nhfe > 手术室 > 麻醉记录单
        .state('operAnaesthesia_nhfe', angular.merge({}, opt_nhfe, {
            url: '/operAnaesthesia_nhfe/:regOptId',
            data: { pageState: 0 }
        }))
        // nhfe > 科研管理 > 麻醉记录单
        .state('anesRecordLog_kygl', angular.merge({}, opt_nhfe, {
            url: '/anesRecordLog_kygl/:regOptId',
            data: { pageState: 2, readonly: true }
        }))
    // 基线版本 > 手术管理 > 麻醉记录单 》打印 
    .state('base_anesRecordPrint', angular.merge({}, opt_base, {
        parent: undefined,
        url: '/base_anesRecordPrint/:regOptId',
        template: require('./base.anesRecordLogPrint.html'),
        less: require('./nhfe.anesRecordLog.less'),
        controller: require('./base.anesRecordLogPrint.controller')
    }))
    // 基线版本 > 手术管理 > 麻醉记录单 》打印 
    .state('htyy_anesRecordPrint', angular.merge({}, opt_base, {
        parent: undefined,
        url: '/htyy_anesRecordPrint/:regOptId',
        template: require('./htyy.anesRecordLogPrint.html'),
        less: require('./htyy.anesRecordLog.less'),
        controller: require('./htyy.anesRecordLogPrint.controller')
    }))
}

// nhfe
function nhfeAnesRecordLog() {
    return {
        // template: require('./nhfe.anesRecordLogPrint.html'),
        // less: require('./anesRecordLog.less'),
        // controller: require('./nhfe.anesRecordLogPrint.controller'),
        template: require('./_nhfe.anesRecordLogPrint.html'),
        less: require('./_nhfe.anesRecordLog.less'),
        controller: require('./_nhfe.anesRecordLogPrint.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}
// htyy
function htyyAnesRecordLog() {
    return {
        template: require('./htyy.anesRecordLogPrint.html'),
        less: require('./htyy.anesRecordLog.less'),
        controller: require('./htyy.anesRecordLogPrint.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}
// base
function baseAnesRecordLog() {
    return {
        template: require('./base.anesRecordLogPrint.html'),
        less: require('./anesRecordLog.less'),
        controller: require('./base.anesRecordLogPrint.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}