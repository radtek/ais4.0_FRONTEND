module.exports = angular.module('easePainAgree', [])
    .config(route)
    .directive('easePainAgree', easePainAgree)
    .name;

route.$inject = ['$stateProvider'];


var opt_lyrm= {
    parent: 'doc',    
    template: require('./easePainAgree_lyrm.html'),
    controller: require('./easePainAgree_lyrm.controller'),
    less: require('./easePainAgree.less'),
    controllerAs: 'vm'
}

function route($stateProvider) {
    $stateProvider.state('easePainAgree', angular.merge({}, opt_lyrm, {  // 耒阳
        url: '/easePainAgree/:regOptId'
    })).state('kygl_lyrm_easePainAgree', angular.merge({}, opt_lyrm, {
            url: '/kygl_lyrm_easePainAgree/:regOptId',
            data: { readonly: true }
     }))
}


function easePainAgree() {
    return {
        template: require('./easePainAgree_lyrm.html'),
        controller: require('./easePainAgree_lyrm.controller'),
        less: require('./easePainAgree.less'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}

