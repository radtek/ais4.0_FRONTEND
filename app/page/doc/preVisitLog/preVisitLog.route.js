module.exports = angular.module('preVisitLog', [])
    .config(route)
    .directive('preVisitLog', preVisitLog)
    .directive('preVisitLogHtyy', preVisitLogHtyy)
    .name;

route.$inject = ['$stateProvider'];

var opt = {
    parent: 'doc',
    template: require('./preVisitLog.html'),
    less: require('./preVisitLog.less'),
    controller: require('./preVisitLog.controller'),
    controllerAs: 'vm'
}
var htyy = {
    parent: 'doc',
    template: require('./htyy_preVisitLog.html'),
    less: require('./htyy_preVisitLog.less'),
    controller: require('./htyy_preVisitLog.controller'),
    controllerAs: 'vm'
}
var lyrm = {
    parent: 'doc',
    template: require('./lyrm_preVisitLog.html'),
    less: require('./lyrm_preVisitLog.less'),
    controller: require('./lyrm_preVisitLog.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) { //麻醉前访视记录单
    $stateProvider.state('prePreVisitLog', angular.merge({}, opt, {
            url: '/prePreVisitLog/:regOptId'
        })).state('midPreVisitLog', angular.merge({}, htyy, {
            url: '/midPreVisitLog/:regOptId'
        })).state('xxcxVisitLog', angular.merge({}, opt, {
            url: '/xxcxVisitLog/:regOptId',
            data: { readonly: true }
        })).state('kyglPreVisitLog', angular.merge({}, opt, {
            url: '/kyglPreVisitLog/:regOptId',
            data: { readonly: true }
        })).state('htyy_preVisitLog', angular.merge({}, htyy, { //航天
            url: '/htyy_preVisitLog/:regOptId'
        })).state('kygl_htyy_preVisitLog', angular.merge({}, htyy, {
            url: '/kygl_htyy_preVisitLog/:regOptId',
            data: { readonly: true }
        })).state('lyrm_preVisitLog', angular.merge({}, lyrm, { //耒阳
            url: '/lyrm_preVisitLog/:regOptId'
        })).state('kygl_lyrm_preVisitLog', angular.merge({}, lyrm, {
            url: '/kygl_lyrm_preVisitLog/:regOptId',
            data: { readonly: true }
        }))
}

var dev = {
    template: require('./preVisitLog.html'),
    less: require('./preVisitLog.less'),
    controller: require('./preVisitLog.controller'),
    controllerAs: 'vm',
    restrict: 'E',
    replact: true,
    scope: {}
}

function preVisitLog() {
    return dev;
}

function preVisitLogHtyy() {
    return angular.merge({}, dev, {
        template: require('./htyy_preVisitLog.html'),
        less: require('./htyy_preVisitLog.less'),
        controller: require('./htyy_preVisitLog.controller')
    })
}