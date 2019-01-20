const encrypt = require('./encrypt.factory');
const IHttp = require('./IHttp.factory');
const auth = require('./auth.factory');
const menu = require('./menu.factory');
const confirm = require('./confirm.factory');
const select = require('./select.factory');
const uiGridServe = require('./uiGridServe.factory');
const anaesCheckOutServe = require('../page/doc/anaesCheckOut/anaesCheckOut.serve');
const baseConfig = require('./baseConfig.factory')
const anesRecordInter = require('./anesRecordLog.factory');
const anesRecordServe = require('./anesRecordLog.service');
const eCharts = require('./eCharts.service');

const dropdownAddRow = require('./dropdownAddRow.filter');
const dropdownMedRow = require('./dropdownMedRow.filter');
const nameString = require('./nameString.filter');
const utils = require('./utils.factory');

module.exports = angular.module('serve', [])
    .factory('encrypt', encrypt)
    .factory('IHttp', IHttp)
    .factory('auth', auth)
    .factory('menu', menu)
    .factory('confirm', confirm)
    .factory('select', select)
    .factory('uiGridServe', uiGridServe)
    .factory('anaesCheckOutServe', anaesCheckOutServe)
    .factory('baseConfig', baseConfig)
    .factory('anesRecordInter', anesRecordInter)
    .service('anesRecordServe', anesRecordServe)
    .service('eCharts', eCharts)
    .filter('dropdownAddRow', dropdownAddRow)
    .filter('dropdownMedRow', dropdownMedRow)
    .filter('nameString', nameString)
    .factory('utils', utils)
    .name;