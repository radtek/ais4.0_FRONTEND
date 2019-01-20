module.exports = angular.module('checkRecordLog', [])
    .config(route)
    .directive('checkRecordLog', checkRecordLog)
    .directive('checkRecordNhyyLog', checkRecordNhyyLog)
    .directive('checkRecordHtyyLog', checkRecordHtyyLog)
    .directive('checkRecordLyrmLog',checkRecordLyrmLog)
    .name;

route.$inject = ['$stateProvider'];

var opt = {
    parent: 'doc',
    template: require('./checkRecordLog.html'),
    less: require('./checkRecordLog.less'),
    controller: require('./checkRecordLog.controller'),
    controllerAs: 'vm'
}

var opt_nhyy = {
    parent: 'doc',
    template: require('./checkRecordLog_nhyy.html'),
    less: require('./checkRecordLog.less'),
    controller: require('./checkRecordLog_nhyy.controller'),
    controllerAs: 'vm'
}

var opt_htyy = {
    parent: 'doc',
    template: require('./checkRecordLog_htyy.html'),
    less: require('./checkRecordLog.less'),
    controller: require('./checkRecordLog_htyy.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('midCheckRecordLog', angular.merge({}, opt, {
        url: '/midCheckRecordLog/:regOptId'
    })).state('postCheckRecordLog', angular.merge({}, opt, {
        url: '/postCheckRecordLog/:regOptId'
    })).state('checkRecordLog_nhyy', angular.merge({}, opt_nhyy, {
        url: '/checkRecordLog_nhyy/:regOptId'
    })).state('midCheckRecordLog_nhyy', angular.merge({}, opt_nhyy, {
        url: '/midCheckRecordLog_nhyy/:regOptId'
    })).state('xxcxCheckRecordLog', angular.merge({}, opt_nhyy, {
        url: '/xxcxCheckRecordLog/:regOptId',
        data: { readonly: true }
    })).state('kyglCheckRecordLog', angular.merge({}, opt_nhyy, {
        url: '/kyglCheckRecordLog/:regOptId',
        data: { readonly: true }
    })).state('checkRecordLog_htyy', angular.merge({}, opt_htyy, {
        url: '/checkRecordLog_htyy/:regOptId'
    })).state('midCheckRecordLog_htyy', angular.merge({}, opt_htyy, {
        url: '/midCheckRecordLog_htyy/:regOptId'
    })).state('checkRecordLog_htyy_kygl', angular.merge({}, opt_htyy, {
        url: '/checkRecordLog_htyy_kygl/:regOptId',
        data: { readonly: true }
    })).state('checkRecordLog_lyrm', angular.merge({}, opt_htyy, {
        url: '/checkRecordLog_lyrm/:regOptId',
        template: require('./checkRecordLog_lyrm.html')
    })).state('midCheckRecordLog_lyrm', angular.merge({}, opt_htyy, {
        url: '/midCheckRecordLog_lyrm/:regOptId',
        template: require('./checkRecordLog_lyrm.html')
    })).state('checkRecordLog_lyrm_kygl', angular.merge({}, opt_htyy, {
        url: '/checkRecordLog_lyrm_kygl/:regOptId',
        template: require('./checkRecordLog_lyrm.html'),
        data: { readonly: true }
    }))
}

var dev = {
    template: require('./checkRecordLog.html'),
    less: require('./checkRecordLog.less'),
    controller: require('./checkRecordLog.controller'),
    controllerAs: 'vm',
    restrict: 'E',
    scope: {}
}

function checkRecordLog() {
    return dev;
}

function checkRecordNhyyLog() {
    return angular.merge({}, dev, {
        template: require('./checkRecordLog_nhyy.html'),
        controller: require('./checkRecordLog_nhyy.controller')
    });
}

function checkRecordHtyyLog() {
    return angular.merge({}, dev, {
        template: require('./checkRecordLog_htyy.html'),
        controller: require('./checkRecordLog_htyy.controller')
    });
}

function checkRecordLyrmLog() {
    return angular.merge({}, dev, {
        template: require('./checkRecordLog_lyrm.html'),
        controller: require('./checkRecordLog_htyy.controller')
    });
}