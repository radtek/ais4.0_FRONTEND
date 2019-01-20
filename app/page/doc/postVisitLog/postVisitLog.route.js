module.exports = angular.module('postVisitLog', [])
    .config(route)
    .directive('postVisitLog', postVisitLog)
    .directive('postVisitLogHtyy', postVisitLogHtyy)
    .directive('postVisitLogLyrm', postVisitLogLyrm)
    .name;

route.$inject = ['$stateProvider'];

var opt = {
    parent: 'doc',
    template: require('./postVisitLog.html'),
    less: require('./postVisitLog.less'),
    controller: require('./postVisitLog.controller'),
    controllerAs: 'vm'
}
var htyy={
    template: require('./htyy_postVisitLog.html'),
    controller: require('./htyy_postVisitLog.controller'),
}
var lyrm = {    
    template: require('./lyrm_postVisitLog.html'),
    controller: require('./lyrm_postVisitLog.controller'),
}

function route($stateProvider) {
    $stateProvider.state('postVisitLog', angular.merge({}, opt, {//nhfe
        url: '/postVisitLog/:regOptId'
    })).state('xxcxPostVisitLog', angular.merge({}, opt, {//nhfe
        url: '/xxcxPostVisitLog/:regOptId',
        data: { readonly: true }
    })).state('kyglPostVisitLog', angular.merge({}, opt, {//nhfe
        url: '/kyglPostVisitLog/:regOptId',
        data: { readonly: true }
    })).state('htyy_postVisitLog', angular.merge({}, opt,htyy, {//htyy 麻醉后访视记录单
        url: '/htyy_postVisitLog/:regOptId'
    })).state('kygl_htyy_postVisitLog', angular.merge({}, opt,htyy, {
        url: '/kygl_htyy_postVisitLog/:regOptId',
        data: { readonly: true }
    })).state('lyrm_postVisitLog', angular.merge({}, opt,lyrm, {//lyrm 麻醉后访视记录单
        url: '/lyrm_postVisitLog/:regOptId'
    })).state('kygl_lyrm_postVisitLog', angular.merge({}, opt, lyrm, {
        url: '/kygl_lyrm_postVisitLog/:regOptId',
        data: { readonly: true }
    }))
}

var dev = {
    template: require('./postVisitLog.html'),
    less: require('./postVisitLog.less'),
    controller: require('./postVisitLog.controller'),
    controllerAs: 'vm',
    restrict: 'E',
    replact: true,
    scope: {}
}

function postVisitLog(){
    return dev
}
function postVisitLogHtyy(){
   return angular.merge({},dev,htyy)
}
function postVisitLogLyrm(){
   return angular.merge({},dev,lyrm)
}