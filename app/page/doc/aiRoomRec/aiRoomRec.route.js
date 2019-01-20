module.exports = angular.module('aiRoomRec', [])
    .config(route)
    .directive('aiRoomRec', aiRoomRec)
    .name;

route.$inject = ['$stateProvider'];
var opt= {
    parent: 'doc',
    template: require('./aiRoomRec.html'),
    less: require('./aiRoomRec.less'),
    controller: require('./aiRoomRec.controller'),
    controllerAs: 'vm'
}
/* 
 * data.pageState: 0(手术室) || 1(术中巡视) || 2(术后的麻醉记录单) || 3(复苏室) || 4(术后复苏室)
 * data.readonly: true(术中巡视、信息查询、科研查询)
 */
function route($stateProvider) {
    $stateProvider
        // .state('anesRecordLog_kygl_htyy', angular.merge({}, opt_htyy, {
        //     url: '/anesRecordLog_kygl_htyy/:regOptId',
        //     data: { pageState: 2, readonly: true }
        // }))
        // nhfe > 手术管理 > 麻醉记录单
        .state('base_mana_aiRoomRec', angular.merge({}, opt ,{
            url: '/base_mana_aiRoomRec/:regOptId',
            data: { pageState: 2 }
        }))
        // nhfe > 手术室 > 麻醉记录单
        .state('base_aiRoomRec', angular.merge({}, opt ,{
            url: '/base_aiRoomRec/:regOptId',
            data: { pageState: 0 }
        }))
}

// nhfe
function aiRoomRec() {
    return {
        template: require('./aiRoomRecPrint.html'),
        less: require('./aiRoomRec.less'),
        controller: require('./aiRoomRecPrint.controller'),
        controllerAs: 'vm',
        restrict: 'E',
        replact: true,
        scope: {}
    }
}
