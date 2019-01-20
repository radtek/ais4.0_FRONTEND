module.exports = angular.module('riskAsseLog', [])
    .config(route)
     .directive('riskAsseNhyyLog', riskAsseNhyyLog)
    .name;

route.$inject = ['$stateProvider'];

var opt_nhyy = {
    parent: 'doc',
    template: require('./riskAsseLog_nhyy.html'),
    less: require('./riskAsseLog.less'),
    controller: require('./riskAsseLog_nhyy.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('riskAsseLog_nhyy', angular.merge({}, opt_nhyy, { //手术室压疮风险评估(南华大学附属南华医院)
        url: '/riskAsseLog_nhyy/:regOptId'
    })).state('midRiskAsseLog_nhyy', angular.merge({}, opt_nhyy, {
        url: '/midRiskAsseLog_nhyy/:regOptId'
    }))
}

var dev = {
    template: require('./riskAsseLog_nhyy.html'),
    less: require('./riskAsseLog.less'),
    controller: require('./riskAsseLog_nhyy.controller'),
    controllerAs: 'vm',
    restrict: 'E',
    replact: true,
    scope: {}
}

function riskAsseNhyyLog() {
    return dev;
}