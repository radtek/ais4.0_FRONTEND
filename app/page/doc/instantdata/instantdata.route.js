module.exports = angular.module('instantdata', [])
    .config(route)   
    .name;

route.$inject = ['$stateProvider'];

var opt = {
    parent: 'doc',
    template: require('./instantdata.html'),
    controller: require('./instantdata.controller'),
    less: require('./instantdata.less'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('instantdata', angular.merge({}, opt, {
        url: '/instantdata/:regOptId'
    }))
}

