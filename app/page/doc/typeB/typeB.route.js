module.exports = angular.module('typeB', [])
    .config(route)
    .directive('typeB', typeB)
    .name;

route.$inject = ['$stateProvider'];

var opt = {
    parent: 'doc',
    template: require('./typeB.html'),
    controller: require('./typeB.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('preTypeB', angular.merge({}, opt, {
        url: '/preTypeB/:regOptId'
    })).state('midTypeB', angular.merge({}, opt, {
        url: '/midTypeB/:regOptId',
        data: { readonly: true }
    })).state('postTypeB', angular.merge({}, opt, {
        url: '/postTypeB/:regOptId'
    })).state('xxcxTypeB', angular.merge({}, opt, {
        url: '/xxcxTypeB/:regOptId',
        data: { readonly: true }
    })).state('kyglTypeB', angular.merge({}, opt, {
        url: '/kyglTypeB/:regOptId',
        data: { readonly: true }
    }))
}

function typeB() {
    return {
        template: require('./typeB.html'),
        controller: require('./typeB.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}