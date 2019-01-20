module.exports = angular.module('shutTranLog', [])
    .config(route)
    .directive('shutTranLog', shutTranLog)
    .directive('shutTranNhyyLog', shutTranNhyyLog)
    .directive('shutTranHtyyLog', shutTranHtyyLog)
    .name;

route.$inject = ['$stateProvider'];

var opt = {
    parent: 'doc',
    template: require('./shutTranLog.html'),
    less: require('./shutTranLog.less'),
    controller: require('./shutTranLog.controller'),
    controllerAs: 'vm'
}

var opt_nhyy = {
    parent: 'doc',
    template: require('./shutTranLog_nhyy.html'),
    less: require('./shutTranLog.less'),
    controller: require('./shutTranLog_nhyy.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('preShutTranLog', angular.merge({}, opt, {
        url: '/preShutTranLog/:regOptId'
    })).state('shutTranLog_nhyy', angular.merge({}, opt_nhyy, {
        url: '/preShutTranLog_nhyy/:regOptId'
    })).state('midShutTranLog_nhyy', angular.merge({}, opt_nhyy, {
        url: '/midShutTranLog_nhyy/:regOptId'
    })).state('postShutTranLog', angular.merge({}, opt, {
        url: '/postShutTranLog/:regOptId'
    })).state('xxcxShutTranLog', angular.merge({}, opt, {
        url: '/xxcxShutTranLog/:regOptId',
        data: { readonly: true }
    })).state('kyglShutTranLog', angular.merge({}, opt, {
        url: '/kyglShutTranLog/:regOptId',
        data: { readonly: true }
    }))
}

var dev = {
    template: require('./shutTranLog.html'),
    less: require('./shutTranLog.less'),
    controller: require('./shutTranLog.controller'),
    controllerAs: 'vm',
    restrict: 'E',
    replact: true,
    scope: {}
}

function shutTranLog() {
    return dev;
}

function shutTranNhyyLog() {
    return angular.merge({}, dev, {
        template: require('./shutTranLog_nhyy.html'),
        controller: require('./shutTranLog_nhyy.controller')
    })
}

function shutTranHtyyLog() {
    return dev;
}