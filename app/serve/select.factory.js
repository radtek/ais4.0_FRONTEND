/*
 * 接口集
 */
module.exports = select;

select.$inject = ['IHttp', '$q', '$timeout', 'auth', 'menu', 'utils'];

function select(IHttp, $q, $timeout, auth, menu, utils) {
    return {
        // 获取手术室列表
        operroom: function() {
            return IHttp.post('basedata/getOperroomList', {
                'roomType': "01",
                'enable': 1
            });
        },
        /*
         * 获取台次：pacType
         * 麻醉事件：anaesEventType
         */
        sysCodeBy: function(type) {
            return IHttp.post('basedata/searchSysCodeByGroupId', { groupId: type });
        },
        //获取科室列表
        dept: function() {
            return IHttp.post('basedata/getDeptList', {});
        },
        /* 获取人员
         * 系统管理员：ADMIN 
         * 医生：DOCTOR,
         * 护士：NURSE,
         * 护士长：HEAD_NURSE,
         * 主任医生：ARCHIATER,
         * 麻醉医师：ANAES_DOCTOR
         * 手术医生：OPER
         * tableType
         * 用户表：bas_user
         * 手术人员表：bas_operation_people
         */
        getRole: function(type, query, ids) {
            var deferred = $q.defer(),
                table = type == 'OPER' ? 'bas_operation_people' : 'bas_user',
                param = {
                    tableType: table,
                    filters: [{
                        field: "userType",
                        value: type
                    }, {
                        field: "name",
                        value: query ? query : ''
                    }]
                };
            IHttp.post('sys/getAllUser', param).then((rs) => {
                if (rs.data.userItem.length > 0)
                    deferred.resolve(utils.signFilter(rs.data.userItem, ids));
                else
                    deferred.resolve(rs.data.userItem);
            })
            return deferred.promise;
        },
        //获取麻醉医生列表
        getAnaesthetists: function(query, ids) {
            if (!query && query != '') {
                return IHttp.post('sys/getAllUser', {
                    filters: [{
                        field: "userType",
                        value: 'ANAES_DOCTOR'
                    }]
                });
            } else {
                var deferred = $q.defer(),
                    param = {
                        name: angular.equals({}, query) ? '' : query,
                        filters: [{
                            field: "userType",
                            value: 'ANAES_DOCTOR'
                        }]
                    };
                IHttp.post('sys/getAllUser', param).then((rs) => {
                    if (rs.data.userItem.length > 0)
                        deferred.resolve(utils.signFilter(rs.data.userItem, ids));
                    else
                        deferred.resolve(rs.data.userItem);
                })
                return deferred.promise;
            }
        },
        //获取所有人
        getAllUser: function() {
            return IHttp.post('sys/getAllUser', {
                filters: []
            });
        },
        //获取护士列表
        getNurses: function(query, ids) {
            if (!query && query != '') {
                return IHttp.post('sys/getAllUser', {
                    filters: [{
                        field: "userType",
                        value: 'NURSE'
                    }]
                });
            } else {
                var deferred = $q.defer(),
                    param = {
                        name: angular.equals({}, query) ? '' : query,
                        filters: [{
                            field: "userType",
                            value: 'NURSE'
                        }]
                    };
                IHttp.post('sys/getAllUser', param).then((rs) => {
                    if (rs.data.userItem.length > 0)
                        deferred.resolve(utils.signFilter(rs.data.userItem, ids));
                    else
                        deferred.resolve(rs.data.userItem);
                })
                return deferred.promise;
            }

        },

        //获取手术医生列表
        getOperators: function(query, ids) {
            var deferred = $q.defer(),
                param = { name: angular.equals({}, query) ? '' : query };
            IHttp.post('basedata/getOperationPeopleList', param).then((rs) => {
                if (rs.data.resultList.length > 0) {
                    var index = 0;
                    for (a = 0; ids && a < ids.length; a++) {
                        while (index < rs.data.resultList.length) {
                            if (ids[a] == rs.data.resultList[index].operatorId) {
                                rs.data.resultList.splice(index, 1);
                                break;
                            }
                            index++;
                        }
                    }
                    deferred.resolve(rs.data.resultList);
                } else
                    deferred.resolve(rs.data.resultList);
            })
            return deferred.promise;
        },

        // 获取用户职称列表
        getProfessionalTitle: function() {
            return IHttp.post('basedata/searchSysCodeByGroupId', { groupId: 'professionalTitle' });
        },

        // 获取行政级别列表
        getExecutiveLevel: function() {
            return IHttp.post('basedata/searchSysCodeByGroupId', { groupId: 'executiveLevel' });
        },

        // 获取用户类型列表
        getUserType: function() {
            return IHttp.post('basedata/searchSysCodeByGroupId', { groupId: 'userType' });
        },

        // 获取用户组列表
        getRoleGroup: function() {
            return IHttp.post('sys/getAllRoleByDelFlag', {});
        },
        // 麻醉方法
        getAnaesMethodList: function() {
            return IHttp.post('basedata/getAnaesMethodList', {});
        },
        // 病区列表
        getRegionList: function() {
            return IHttp.post('basedata/getRegionList', {});
        },
        // 获取诊断名称
        getDiagnosedefList: function(query) {
            var deferred = $q.defer(),
                param = { name: angular.equals({}, query) ? '' : query };
            IHttp.post('basedata/getDiagnosedefList', param).then((rs) => {
                if (rs.data.resultList.length > 0)
                    deferred.resolve(rs.data.resultList);
                else
                    deferred.resolve(rs.data.resultList);
            })
            return deferred.promise;
        },
        // 拟施手术名称
        getOperdefList: function(query) {
            var deferred = $q.defer(),
                param = { name: angular.equals({}, query) ? '' : query };
            IHttp.post('basedata/getOperdefList', param).then((rs) => {
                if (rs.data.resultList.length > 0)
                    deferred.resolve(rs.data.resultList);
                else
                    deferred.resolve(rs.data.resultList);
            })
            return deferred.promise;
        },
        // 其他事件
        getOtherEventList: function(query) {
            var deferred = $q.defer(),
                param = { filters: [{ field: 'enable', value: '1' }] };
            IHttp.post('basedata/selectALlOtherEvent', param).then((rs) => {
                if (rs.data.resultList.length > 0)
                    deferred.resolve(rs.data.resultList);
                else
                    deferred.resolve(rs.data.resultList);
            })
            return deferred.promise;
        },
        //获取收费项目名称
        getChargeItemList: function() {
            return IHttp.post('basedata/searchChargeItem', { pinyin: '' });
        },

        // 获取文书状态
        getDocState: function(regOptId) {
            return IHttp.post('operation/getDocumentStatuByRegOptId', { regOptId: regOptId });
        },

        // 获取手术体位
        getOptBody: function() {
            return IHttp.post('basedata/searchSysCodeByGroupId', { groupId: "optBody" });
        },
        // 查询床旁设备配置
        getDeviceConfigList: function(param) {
            return IHttp.post('basedata/getDeviceConfigList', angular.merge({}, param));
        },
        // 根据设备id查询床旁设备配置
        getDeviceMonitorConfigList: function(deviceId) { //getDeviceMonitorConfigList 已废除
            return IHttp.post('basedata/getDeviceMonitorConfigList', { deviceId: deviceId });
        },
        // 获取药品
        getMedicineList: function(query) {
            return IHttp.post("basedata/getMedicineList", { pinyin: query, pageNo: 1, pageSize: 200 });
        },
        // 获取手术基本信息
        getRegOptInfo: function(regOptId) {
            return IHttp.post("operation/searchApplication", { regOptId: regOptId });
        },
        getAnaesPacuRec: function(regOptId) {
            return IHttp.post("document/hasAnaesPacuRec", { regOptId: regOptId });
        },
        // 根据type查询相关的数据。
        // 1：麻醉药，2：治疗药，3：镇痛药，4：麻醉事件，i：输液，o：出量
        searchEventListByType: function(type, query) {
            var deferred = $q.defer(),
                param = { pinyin: query || '', type: type, pageSize: 200, pageNo: 1 };
            IHttp.post('operation/searchEventListByType', param).then((rs) => {
                deferred.resolve(rs.data.resultList);
            })
            return deferred.promise;
        },
        searchCommonUseEventListByType: function(type, mergeObj) {
            var deferred = $q.defer();
            IHttp.post("operation/searchCommonUseEventListByType", angular.merge({ type: type }, mergeObj)).then((rs) => {
                deferred.resolve(rs.data.resultList);
            })
            return deferred.promise;
        },
        // 查询麻醉记录单已添加的事件
        searchSelectedEventByType: function(type, docId, mergeObj) {
            var deferred = $q.defer();
            IHttp.post("operation/searchSelectedEventByType", angular.merge({ docId: docId, type: type }, mergeObj)).then((rs) => {
                if (type == "4" || type == "") {
                    deferred.resolve(rs.data)
                } else {
                    deferred.resolve(rs.data.resultList);
                };
            })
            return deferred.promise;
        },
        // 查询给药途径
        getMedicalTakeWayList: function() {
            return IHttp.post("basedata/getMedicalTakeWayList", {});
        },
        //根据字典值ID数组["12","1234"]返回字典值对象[{sf:123},{df:1234}]
        getDictObjList: function(idArr, list) {
            let result = [];
            for (var i = 0; i < list.length; i++) {
                if (idArr.indexOf(list[i].codeName) >= 0 || idArr.indexOf(list[i].anaMedId) >= 0 || idArr.indexOf(list[i].codeValue) >= 0) {
                    result.push(list[i])
                }
            }
            return result;
        },
        //字符串生成数组
        translateStringToArr: function(string, num) {
            if (!!string && string.length) { //有值转换
                return string.split(",");
            } else if (num > 0) { //初始化
                let result = new Array(num);
                for (let i = 0; i < result.length; i++) {
                    result[i] = 0;
                }
                return result;
            }
        },
        getRouteConfigByRouteUrl: function(url) { //根据路由地址获取配置
            var menuArr = auth.userPermission();
            var opt = menu.opt(url, menuArr);
            return opt;
        }
    }
}