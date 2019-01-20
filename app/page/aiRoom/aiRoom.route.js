module.exports = angular.module('airoom', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('airoom', {
        parent: 'frame',
        url: '/airoom',
        template: require('./airoom.html'),
        less: require('./airoom.less'),
        controller: require('./airoom.controller.js')
    })
}
