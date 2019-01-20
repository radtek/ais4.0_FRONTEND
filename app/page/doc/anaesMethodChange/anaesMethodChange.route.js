module.exports = angular.module('anaesMethodChange', [])
    .config(route)
    .directive('anaesMethodChange', anaesMethodChange)
    .name;

route.$inject = ['$stateProvider'];

var opt = {
    parent: 'doc',
    template: require('./anaesMethodChange.html'),
    less: require('./anaesMethodChange.less'),
    controller: require('./anaesMethodChange.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('preAnaesMethodChange', angular.merge({}, opt, {
        url: '/preAnaesMethodChange/:regOptId'
    })).state('postAnaesMethodChange', angular.merge({}, opt, {
        url: '/postAnaesMethodChange/:regOptId'
    })).state('xxcxAnaesMethodChange', angular.merge({}, opt, {
        url: '/xxcxAnaesMethodChange/:regOptId',
        data: { readonly: true }
    })).state('kyglAnaesMethodChange', angular.merge({}, opt, {
        url: '/kyglAnaesMethodChange/:regOptId',
        data: { readonly: true }
    }))
}

var dev = {
    template: require('./anaesMethodChange.html'),
    less: require('./anaesMethodChange.less'),
    controller: require('./anaesMethodChange.controller'),
    controllerAs: 'vm',
    restrict: 'E',
    replact: true,
    scope: {}
}

function anaesMethodChange() {
    return dev;
}