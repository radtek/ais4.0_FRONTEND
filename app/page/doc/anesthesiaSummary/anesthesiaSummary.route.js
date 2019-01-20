module.exports = angular.module('anesthesiaSummary', [])
    .config(route)
    .directive('anesthesiaSummary', anesthesiaSummary)
    .directive('anesthesiaSummaryHtyy', anesthesiaSummaryHtyy)
    .directive('anesthesiaSummaryLyrm', anesthesiaSummaryLyrm)
    .name;

route.$inject = ['$stateProvider'];

var opt = {
    parent: 'doc',
    template: require('./anesthesiaSummary.html'),
    less: require('./anesthesiaSummary.less'),
    controller: require('./anesthesiaSummary.controller'),
    controllerAs: 'vm'
}
var htyy = {
    parent: 'doc',
    template: require('./htyy.anesthesiaSummary.html'),
    less: require('./anesthesiaSummary.less'),
    controller: require('./htyy.anesthesiaSummary.controller'),
    controllerAs: 'vm'
}
var lyrm = {
    parent: 'doc',
    template: require('./lyrm.anesthesiaSummary.html'),
    less: require('./anesthesiaSummary.less'),
    controller: require('./htyy.anesthesiaSummary.controller'),
    controllerAs: 'vm'
}


function route($stateProvider) { //麻醉总结
    $stateProvider.state('postAnesthesiaSummary', angular.merge({}, opt, {
        url: '/postAnesthesiaSummary/:regOptId',
        template: require('./anesthesiaSummary.html')
    })).state('midAnesthesiaSummary', angular.merge({}, opt, {
        url: '/midAnesthesiaSummary/:regOptId',
        template: require('./anesthesiaSummary.html')
    })).state('xxcxAnesthesiaSummary', angular.merge({}, opt, {
        url: '/xxcxAnesthesiaSummary/:regOptId',
        template: require('./anesthesiaSummary.html'),
        data: { readonly: true }
    })).state('kyglAnesthesiaSummary', angular.merge({}, opt, {
        url: '/kyglAnesthesiaSummary/:regOptId',
        template: require('./anesthesiaSummary.html'),
        data: { readonly: true }
    })).state('htyy_AnesthesiaSummary', angular.merge({}, htyy, {
        url: '/htyy_AnesthesiaSummary/:regOptId'
    })).state('lyrm_AnesthesiaSummary', angular.merge({}, htyy, {
        template: require('./lyrm.anesthesiaSummary.html'),
        url: '/lyrm_AnesthesiaSummary/:regOptId'
    }))
}

var dev = {
    template: require('./anesthesiaSummary.html'),
    less: require('./anesthesiaSummary.less'),
    controller: require('./anesthesiaSummary.controller'),
    controllerAs: 'vm',
    restrict: 'E',
    replact: true,
    scope: {}
}

function anesthesiaSummary() {
    return dev
}
function anesthesiaSummaryHtyy() {
    return angular.merge({},dev,htyy)
}
function anesthesiaSummaryLyrm() {
    return angular.merge({},dev,lyrm)
}