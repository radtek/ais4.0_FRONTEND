module.exports = angular.module('schedule', [])
    .config(route)
    .name;

route.$inject = ['$stateProvider'];

function route($stateProvider) {
    $stateProvider.state('schedule', {
        parent: 'tabs',
        template: require('./schedule.html'),
        less: require('./schedule.less'),
        controller: require('./schedule.controller')
    }).state('schedulePrint', {
        parent: 'schedule',
        url: '/schedulePrint',
        template: require('./scheduleView.html'),
        controller: require('./schedulePrint/schedulePrint.controller.js')
    })
    .state('operRoomSchedule', {
        parent: 'schedule',
        url: '/operRoomSchedule',
        template: require('./scheduleView.html'),
        controller: require('./operRoomSchedule/operRoomSchedule.controller.js')
    })
    .state('anaesthesiaSchedule', {//麻醉安排
        parent: 'schedule',
        url: '/anaesthesiaSchedule',
        template: require('./scheduleView.html'),
        controller: require('./anaesthesiaSchedule/anaesthesiaSchedule.controller.js'),//有过滤的
        data: { pageName: '麻醉安排' }
    })
    .state('nursingSchedule', {// 带过滤 护士安排
        parent: 'schedule',
        url: '/nursingSchedule',
        template: require('./scheduleView.html'),
        less: require('./schedule.less'),
        controller: require('./nursingSchedule/nursingSchedule_sybx.controller.js'),
        data: { pageName: '护理安排' }
    })
    .state('operRoomSchedules', {
        parent: 'tabs',
        url: '/operRoomSchedules',
        template: require('./operRoomSchedule/operRoomSchedules.html'),
        less: require('./schedule.less'),
        controller: require('./operRoomSchedule/operRoomSchedules.controller.js')
    }).state('nursingSchedules', {
        parent: 'tabs',
        url: '/nursingSchedules',
        template: require('./nursingSchedule/nursingSchedules.html'),
        less: require('./schedule.less'),
        controller: require('./nursingSchedule/nursingSchedules.controller.js')
    })
    
    .state('anaesthesiaSchedules', {
        parent: 'tabs',
        url: '/anaesthesiaSchedules',
        template: require('./anaesthesiaSchedule/anaesthesiaSchedules.html'),
        less: require('./schedule.less'),
        controller: require('./anaesthesiaSchedule/anaesthesiaSchedules.controller.js')
    }).state('schedulePrints', {
        parent: 'tabs',
        url: '/schedulePrints',
        template: require('./schedulePrint/schedulePrints.html'),
        less: require('./schedule.less'),
        controller: require('./schedulePrint/schedulePrints.controller.js')
    })
}