module.exports = angular.module('anaesPerAppraisal', [])
    .config(route)
    .directive('anaesPerAppraisalLog', anaesPerAppraisalLog)
    .name;

route.$inject = ['$stateProvider'];

var opt = {
    parent: 'doc',
    template: require('./anaesPerAppraisal.html'),
    less: require('./anaesPerAppraisal.less'),
    controller: require('./anaesPerAppraisal.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('anaesPerAppraisal', angular.merge({}, opt, {
        url: '/anaesPerAppraisal/:regOptId'
    }))
}

var dev = {
    template: require('./anaesPerAppraisal.html'),
    controller: require('./anaesPerAppraisal.controller'),
    controllerAs: 'vm',
    restrict: 'E',
    replact: true,
    scope: {}
}

function anaesPerAppraisalLog() {
    return dev;
}