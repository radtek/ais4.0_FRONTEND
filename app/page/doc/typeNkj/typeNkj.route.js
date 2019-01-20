module.exports = angular.module('typeNkj', [])
    .config(route)
    .directive('typeNkj', typeNkj)
    .name;

route.$inject = ['$stateProvider'];

var opt = {
    parent: 'doc',
    template: require('./typeNkj.html'),
    controller: require('./typeNkj.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('preTypeNkj', angular.merge({}, opt, {
        url: '/preTypeNkj/:regOptId'
    })).state('midTypeNkj', angular.merge({}, opt, {
        url: '/midTypeNkj/:regOptId',
        data: { readonly: true }
    })).state('postTypeNkj', angular.merge({}, opt, {
        url: '/postTypeNkj/:regOptId'
    })).state('xxcxTypeNkj', angular.merge({}, opt, {
        url: '/xxcxTypeNkj/:regOptId',
        data: { readonly: true }
    })).state('kyglTypeNkj', angular.merge({}, opt, {
        url: '/kyglTypeNkj/:regOptId',
        data: { readonly: true }
    }))
}

function typeNkj() {
    return {
        template: require('./typeNkj.html'),
        controller: require('./typeNkj.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}