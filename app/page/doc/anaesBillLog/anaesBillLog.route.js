module.exports = angular.module('anaesBillLog', [])
    .config(route)
    .directive('anaesBillLog', anaesBillLog)
    .name;

route.$inject = ['$stateProvider'];

var opt = {
    parent: 'doc',
    template: require('./anaesBillLog.html'),
    less: require('./anaesBillLog.less'),
    controller: require('./anaesBillLog.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('midAnaesBill', angular.merge({}, opt, {
        url: '/midAnaesBill/:regOptId'
    })).state('postAnaesBill', angular.merge({}, opt, {
        url: '/postAnaesBill/:regOptId'
    })).state('pacuAnaesBill', angular.merge({}, opt, {
        url: '/pacuAnaesBill/:regOptId'
    })).state('kyglAnaesBill', angular.merge({}, opt, {
        url: '/kyglAnaesBill/:regOptId',
        data: { readonly: true }
    })).state('xxcxAnaesBill', angular.merge({}, opt, {
        url: '/xxcxAnaesBill/:regOptId',
        data: { readonly: true }
    }))
}

function anaesBillLog() {
    return {
        template: require('./anaesBillLog.html'),
        less: require('./anaesBillLog.less'),
        controller: require('./anaesBillLog.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}
