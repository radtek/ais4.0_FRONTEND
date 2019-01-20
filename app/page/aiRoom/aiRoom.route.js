module.exports = angular.module('airoom', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('airoom', {
        parent: 'frame',
        url: '/airoom',
        template: require('./aiRoom.html'),
        less: require('./aiRoom.less'),
        controller: require('./aiRoom.controller.js')
    })
}
