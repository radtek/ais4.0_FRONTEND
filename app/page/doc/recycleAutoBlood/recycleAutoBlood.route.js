module.exports = angular.module('recycleAutoBlood', [])
    .config(route)
    .directive('recycleAutoBlood', recycleAutoBlood)
    .name;

route.$inject = ['$stateProvider'];

var opt = {
    parent: 'doc',
    template: require('./recycleAutoBlood.html'),
    less: require('./recycleAutoBlood.less'),
    controller: require('./recycleAutoBlood.controller'),
    controllerAs: 'vm'
}
function route($stateProvider) {
    $stateProvider.state('preRecycleAutoBlood', angular.merge({}, opt, {
        url: '/preRecycleAutoBlood/:regOptId'
    })).state('postRecycleAutoBlood', angular.merge({}, opt, {
        url: '/postRecycleAutoBlood/:regOptId'
    })).state('xxcxRecycleAutoBlood', angular.merge({}, opt, {
        url: '/xxcxRecycleAutoBlood/:regOptId',
        data: { readonly: true }
    })).state('kyglRecycleAutoBlood', angular.merge({}, opt, {
        url: '/kyglRecycleAutoBlood/:regOptId',
        data: { readonly: true }
    }))
}

function recycleAutoBlood() {
    return {
        template: require('./recycleAutoBlood.html'),
        less: require('./recycleAutoBlood.less'),
        controller: require('./recycleAutoBlood.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}