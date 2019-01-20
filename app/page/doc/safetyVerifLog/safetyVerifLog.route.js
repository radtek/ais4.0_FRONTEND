module.exports = angular.module('safetyVerifLog', [])
    .config(route)
    .directive('safetyVerifLog', safetyVerifLog)
    .directive('safetyVerifNhyyLog', safetyVerifNhyyLog)
    // .directive('safetyVerifHtyyLog', safetyVerifHtyyLog)
    .name;

route.$inject = ['$stateProvider'];

var opt={
    parent: 'doc',
    template: require('./safetyVerifLog.html'),
    less: require('./safetyVerifLog.less'),
    controller: require('./safetyVerifLog.controller'),
    controllerAs: 'vm'
}

var opt_nhyy={
    parent: 'doc',
    template: require('./safetyVerifLog_nhyy.html'),
    less: require('./safetyVerifLog.less'),
    controller: require('./safetyVerifLog.controller'),
    controllerAs: 'vm'
}
// var opt_htyy={
//     parent: 'doc',
//     template: require('./htyy.safetyVerifLog.html'),
//     less: require('./safetyVerifLog.less'),
//     controller: require('./htyy.safetyVerifLog.controller'),
//     controllerAs: 'vm'
// }
function route($stateProvider) {
    $stateProvider.state('preSafetyVerifLog', angular.merge({}, opt, {
        url: '/preSafetyVerifLog/:regOptId',
    })).state('midSafetyVerifLog', angular.merge({}, opt, {
        url: '/midSafetyVerifLog/:regOptId',
    })).state('postSafetyVerifLog', angular.merge({}, opt, {
        url: '/postSafetyVerifLog/:regOptId',
    })).state('xxcxSafetyVerifLog', angular.merge({}, opt, {
        url: '/xxcxSafetyVerifLog/:regOptId',
        data: { readonly: true }
    })).state('kyglSafetyVerifLog', angular.merge({}, opt, {
        url: '/kyglSafetyVerifLog/:regOptId',
        data: { readonly: true }
    })).state('safetyVerifLog_nhyy', angular.merge({}, opt_nhyy, {
        url: '/safetyVerifLog_nhyy/:regOptId',
    })).state('midSafetyVerifLog_nhyy', angular.merge({}, opt_nhyy, {
        url: '/midSafetyVerifLog_nhyy/:regOptId',
    })).state('htyy_SafetyVerifLog', angular.merge({}, opt, {
        url: '/htyy_SafetyVerifLog/:regOptId',
    })).state('lyrm_SafetyVerifLog', angular.merge({}, opt, {
        url: '/lyrm_SafetyVerifLog/:regOptId',
        template: require('./lyrm.safetyVerifLog.html')
    }))
}

var dev = {
    template: require('./safetyVerifLog.html'),
    less: require('./safetyVerifLog.less'),
    controller: require('./safetyVerifLog.controller'),
    restrict: 'E',
    replact: true,
    scope: {}
}

function safetyVerifLog() {
    return dev;
}

function safetyVerifNhyyLog() {
    return angular.merge({}, dev, {
        template: require('./safetyVerifLog_nhyy.html')
    })
}

// function safetyVerifHtyyLog() {
//     return dev;
// }