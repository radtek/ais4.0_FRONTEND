module.exports = angular.module('nursRecordLog', [])
    .config(route)
    .directive('nursRecordLog', nursRecordLog)
    .directive('nursRecordNhyyLog', nursRecordNhyyLog)
    .directive('nursRecordHtyyLog', nursRecordHtyyLog)
    .directive('nursRecordLyrmLog', nursRecordLyrmLog)
    .name;

route.$inject = ['$stateProvider'];

var opt = {
    parent: 'doc',
    template: require('./nursRecordLog.html'),
    less: require('./nursRecordLog.less'),
    controller: require('./nursRecordLog.controller'),
    controllerAs: 'vm'
}

var opt_nhyy = {
    parent: 'doc',
    template: require('./nursRecordLog_nhyy.html'),
    less: require('./nursRecordLog.less'),
    controller: require('./nursRecordLog_nhyy.controller'),
    controllerAs: 'vm'
}

var opt_lyrm = {
    parent: 'doc',
    template: require('./nursRecordLog_lyrm.html'),
    less: require('./nursRecordLog.less'),
    controller: require('./nursRecordLog_lyrm.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('midNursRecordLog', angular.merge({}, opt, {
        url: '/midNursRecordLog/:regOptId'
    })).state('postNursRecordLog', angular.merge({}, opt, {
        url: '/postNursRecordLog/:regOptId'
    })).state('kyglNursRecordLog', angular.merge({}, opt, {
        url: '/kyglNursRecordLog/:regOptId',
        data: { readonly: true }
    })).state('preNursRecordLog_nhyy', angular.merge({}, opt_nhyy, {
        url: '/preNursRecordLog_nhyy/:regOptId'
    })).state('midNursRecordLog_nhyy', angular.merge({}, opt_nhyy, {
        url: '/midNursRecordLog_nhyy/:regOptId'
    })).state('nursRecordLog_htyy', angular.merge({}, opt, {  // 湖南航天医院
        url: '/nursRecordLog_htyy/:regOptId',
        template: require('./nursRecordLog_htyy.html'),
        controller: require('./nursRecordLog_htyy.controller')
    })).state('nursRecordLog_htyy_kygl', angular.merge({}, opt, {
        url: '/nursRecordLog_htyy_kygl/:regOptId',
        template: require('./nursRecordLog_htyy.html'),
        controller: require('./nursRecordLog_htyy.controller'),
        data: { readonly: true }
    })).state('nursRecordLog_lyrm', angular.merge({}, opt_lyrm, {
        url: '/nursRecordLog_lyrm/:regOptId'
    })).state('nursRecordLog_lyrm_kygl', angular.merge({}, opt_lyrm, {
        url: '/nursRecordLog_lyrm_kygl/:regOptId'
    }))
}

var dev = {
    template: require('./nursRecordLog.html'),
    less: require('./nursRecordLog.less'),
    controller: require('./nursRecordLog.controller'),
    controllerAs: 'vm',
    restrict: 'E',
    replact: true,
    scope: {}
}

function nursRecordLog() {
    return dev;
}

function nursRecordNhyyLog() {
    return angular.merge({}, dev, {
        template: require('./nursRecordLog_nhyy.html'),
        controller: require('./nursRecordLog_nhyy.controller')
    })
}

function nursRecordHtyyLog() {
    return angular.merge({}, dev, {  // 湖南航天医院
        template: require('./nursRecordLog_htyy.html'),
        controller: require('./nursRecordLog_htyy.controller')
    })
}

function nursRecordLyrmLog() {
    return angular.merge({}, dev, {  //耒阳人民医院
        template: require('./nursRecordLog_lyrm.html'),
        controller: require('./nursRecordLog_lyrm.controller')
    })
}