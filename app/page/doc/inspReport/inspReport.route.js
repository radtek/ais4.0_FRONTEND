module.exports = angular.module('inspReport', [])
    .config(route)
    .directive('inspReport', inspReport)
    .name;

route.$inject = ['$stateProvider'];

var opt = {
    parent: 'doc',
    template: require('./inspReport.html'),
    less: require('./inspReport.less'),
    controller: require('./inspReport.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('preInspReport', angular.merge({}, opt, {
        url: '/preInspReport/:regOptId'
    })).state('midInspReport', angular.merge({}, opt, {
        url: '/midInspReport/:regOptId',
        data: { readonly: true }
    })).state('postInspReport', angular.merge({}, opt, {
        url: '/postInspReport/:regOptId'
    })).state('xxcxInspReport', angular.merge({}, opt, {
        url: '/xxcxInspReport/:regOptId',
        data: { readonly: true }
    })).state('kyglInspReport', angular.merge({}, opt, {
        url: '/kyglInspReport/:regOptId',
        data: { readonly: true }
    }))
}

function inspReport() {
    return {
        template: require('./inspReport.html'),
        less: require('./inspReport.less'),
        controller: require('./inspReport.controller'),
        restrict: 'E',
        replact: true,
        scope: {}
    }
}