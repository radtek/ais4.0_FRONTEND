module.exports = angular.module('selfPayInstrument', [])
    .config(route)
    .directive('selfPayInstrument', selfPayInstrument)
    .name;

route.$inject = ['$stateProvider'];

var opt = {
    parent: 'doc',
    template: require('./selfPayInstrument.html'),
    less: require('./selfPayInstrument.less'),
    controller: require('./selfPayInstrument.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) {  //手术麻醉使用自费及高价耗材知情同意书
    $stateProvider.state('preSelfPayInstrument', angular.merge({}, opt, {
        url: '/preSelfPayInstrument/:regOptId'
    })).state('postSelfPayInstrument', angular.merge({}, opt, {
        url: '/postSelfPayInstrument/:regOptId'
    })).state('xxcxSelfPayInstrument', angular.merge({}, opt, {
        url: '/xxcxSelfPayInstrument/:regOptId',
        data: { readonly: true }
    })).state('kyglSelfPayInstrument', angular.merge({}, opt, {
        url: '/kyglSelfPayInstrument/:regOptId',
        data: { readonly: true }
    }))
}

function selfPayInstrument() {
    return {
        template: require('./selfPayInstrument.html'),
        less: require('./selfPayInstrument.less'),
        controller: require('./selfPayInstrument.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}