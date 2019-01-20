module.exports = angular.module('infoCons', [])
    .config(route)
    .directive('infoCons', infoCons)
    .directive('infoConsHtyy', infoConsHtyy)
    .directive('infoConsLyrm', infoConsLyrm)
    .name;

route.$inject = ['$stateProvider'];

var opt = {
    parent: 'doc',
    template: require('./infoCons.html'),
    less: require('./infoCons.less'),
    controller: require('./infoCons.controller'),
    controllerAs: 'vm'
}
var htyy = {
    parent: 'doc',
    template: require('./htyy.infoCons.html'),
    less: require('./infoCons.less'),
    controller: require('./htyy.infoCons.controller'),
    controllerAs: 'vm'
}

function route($stateProvider) { //麻醉知情同意书
    $stateProvider.state('preInfoCons', angular.merge({}, opt, {
        url: '/preInfoCons/:regOptId'
    })).state('postInfoCons', angular.merge({}, opt, {
        url: '/postInfoCons/:regOptId'
    })).state('xxcxInfoCons', angular.merge({}, opt, {
        url: '/xxcxInfoCons/:regOptId',
        data: { readonly: true }
    })).state('kyglInfoCons', angular.merge({}, opt, {
        url: '/kyglInfoCons/:regOptId',
        data: { readonly: true }
    })).state('htyy_InfoCons', angular.merge({}, htyy, {
        url: '/htyy_InfoCons/:regOptId'
    })).state('kygl_htyy_InfoCons', angular.merge({}, htyy, {
        url: '/kygl_htyy_InfoCons/:regOptId',
        data: { readonly: true }
    })).state('lyrm_infoCons', angular.merge({}, htyy, {//耒阳 麻醉同意书
        template: require('./infoCons_lyrm.html'),
        url: '/lyrm_infoCons/:regOptId'
    }))
}

var dev = {
    template: require('./infoCons.html'),
    less: require('./infoCons.less'),
    controller: require('./infoCons.controller'),
    controllerAs: 'vm',
    restrict: 'E',
    replact: true,
    scope: {}
}

function infoCons() {
    return dev;
}

function infoConsHtyy() {
    return angular.merge({}, htyy, {
        template: require('./htyy.infoCons.html'),
        controller: require('./htyy.infoCons.controller')
    })
}

function infoConsLyrm() {
    return angular.merge({}, htyy, {
        template: require('./infoCons_lyrm.html'),
        controller: require('./htyy.infoCons.controller')
    })
}