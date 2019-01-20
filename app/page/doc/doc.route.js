module.exports = angular.module('doc', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('doc', {
            parent: 'tabs',
            template: require('./doc.html'),
            controller: require('./doc.controller.js')
        })
        // 一键打印
        .state('docPrint', {//南华一键打印
            url: '/docPrint/:regOptId&:docStr',
            template: require('../oper/print/print.html'),
            controller: require('../oper/print/print.controller'),
            controllerAs: 'vm'
        })
         .state('anesRecordPrint', {//nhfe 麻醉记录单 》打印
            // parent: undefined,
            url: '/anesRecordPrint/:regOptId&:docStr',
            template: require('../oper/print/anesRecordPrint_nhfe.html'),
            controller: require('../oper/print/anesRecordPrint_nhfe.controller'),
            controllerAs: 'vm'
         })
         .state('docPrintHtyy', {//航天
            url: '/docPrintHtyy/:regOptId&:docStr',
            template: require('../oper/print/htyy.print.html'),
            controller: require('../oper/print/htyy.print.controller'),
            controllerAs: 'vm'
        })
}