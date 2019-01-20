module.exports = angular.module('asseVisitForm', [])
    .config(route)
    .directive('asseVisitFormLog', asseVisitFormLog)
    .directive('asseVisitFormListLog', asseVisitFormListLog)
    .name;

route.$inject = ['$stateProvider'];

var opt = {
    parent: 'doc',
    template: require('./asseVisitForm.html'),
    controller: require('./asseVisitForm.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('asseVisitForm', angular.merge({}, opt, {
        url: '/asseVisitForm/:regOptId'
    })).state('surgicalVisitList', angular.merge({}, opt, {
        url: '/surgicalVisitList/:regOptId',
        template: require('./surgicalVisitList.html')
    }))
}

var dev = {
    template: require('./surgicalVisitList.html'),
    controller: require('./asseVisitForm.controller'),
    controllerAs: 'vm',
    restrict: 'E',
    replact: true,
    scope: {}
}

function asseVisitFormLog() {
    return angular.merge({}, opt, {
        template: require('./asseVisitForm.html')
    });
}

function asseVisitFormListLog() {
    return dev;
}