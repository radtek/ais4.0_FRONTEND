module.exports = angular.module('anaesCheckOut', [])
    .config(route)
    .directive('anaesCheckOut', anaesCheckOut)
    .name;

route.$inject = ['$stateProvider'];

var opt = {
    parent: 'doc',
    template: require('./anaesCheckOut.html'),
    less: require('./anaesCheckOut.less'),
    controller: require('./anaesCheckOut.controller'),
    controllerAs: 'vm'
}
function route($stateProvider) {
    $stateProvider.state('midSurgeryCheckout', angular.merge({}, opt, {
        url: '/midSurgeryCheckout/:regOptId'
    })).state('postSurgeryCheckout', angular.merge({}, opt, {
        url: '/postSurgeryCheckout/:regOptId'
    })).state('surgeryCheckout_htyy', angular.merge({}, opt, {
        url: '/surgeryCheckout_htyy/:regOptId'
    })).state('xxcxSurgeryCheckout', angular.merge({}, opt, {
        url: '/xxcxSurgeryCheckout/:regOptId',
        data: { readonly: true }
    })).state('kyglSurgeryCheckout', angular.merge({}, opt, {
        url: '/kyglSurgeryCheckout/:regOptId',
        data: { readonly: true }
    }))
}

function anaesCheckOut() {
    return {
        template: require('./anaesCheckOut.html'),
        less: require('./anaesCheckOut.less'),
        controller: require('./anaesCheckOut.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}
