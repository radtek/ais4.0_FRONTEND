AnesRecordLogCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'baseConfig', 'anesRecordInter', 'anesRecordServe', 'eCharts', 'auth', '$filter', '$q', '$timeout', 'toastr', '$uibModal', 'select', 'confirm'];

module.exports = AnesRecordLogCtrl;

function AnesRecordLogCtrl($rootScope, $scope, IHttp, baseConfig, anesRecordInter, anesRecordServe, eCharts, auth, $filter, $q, $timeout, toastr, $uibModal, select, confirm) {
    let vm = this,
        regOptId = $rootScope.$stateParams.regOptId,
        docId,
        inTime, // 入室时间
        index, // 记录瞄点索引
        ev_list = [], // 用药、输液、输血数据保存
        freq, // 采集频率
        eChartCol = 8,
        historyData = [],
        toas, // 控制只显示一个toast
        oldValue;
    let mergeobj = { docType: 2 };
    // 获取文书的标题
    vm.docInfo = auth.loginUser();
    vm.setting = angular.copy($rootScope.$state.current.data);
    vm.regOptId = regOptId;
    let bConfig = baseConfig.getOther(); //其它配置
    vm.mongArrs = anesRecordServe.getArray(bConfig.mongRows);
    vm.mongRows = bConfig.mongRows;
    vm.medSet = baseConfig.getMed();
    vm.monOpt = {
        mmhg: ['mmHg', '220', '', '200', '', '180', '', '160', '', '140', '', '120', '', '100', '', '80', '', '60', '', '40', '', '20', '', '0'],
        c: ['', '℃', '', '38', '', '36', '', '34', '', '32', '', '30', '', '28', '', '26', '', '24', '', '22', '', '20'],
        kpa: ['', 'KPa', '28', '', '', '24', '', '', '20', '', '', '16', '', '', '12', '', '', '8', '', '', '4']
    };
    vm.view = {
        pageCur: 0, // 当前页数
        pageCount: 1, // 总页数
        pageSize: 49, // 默认一页大小 49
        pageDone: true, // 控制上一页、下一页可不可用
        viewShow: false // 控制数据视图是否显示
    };

    vm.pageState = vm.setting.pageState;

    if (vm.pageState == 4)
        vm.view.pageCur = 1;


    vm.monDataList = [];

    if (vm.docInfo.optLevelListStyle) {
        vm.optLevelList = ['1', '2', '3', '4'];
    } else {
        vm.optLevelList = ['一级', '二级', '三级', '四级'];
    }
    $scope.$on('$stateChangeStart', function() { // 监听路由跳转，关闭定时器
        anesRecordServe.stopTimerRt();
    });
    anesRecordInter.pacuLeaveTo().then(function(result) { // 复苏室出室去向下拉选项值
        vm.pacuLeaveTo = result.data.resultList;
    });
    anesRecordInter.getSysCode('anaes_level').then(function(result) { // 出室去向下拉选项值
        vm.anaesLevel = result.data.resultList;
    });
    anesRecordInter.optBody().then(function(result) { // 手术体位下拉选项值
        vm.optBody = result.data.resultList;
    });
    anesRecordInter.asaLevel().then(function(result) { // asa下拉选项值
        vm.asaLevel = result.data.resultList;
    });
    select.sysCodeBy('awarenessPacu').then((rs) => { //意识PACU
        $scope.awarenessList = rs.data.resultList;
    })
    select.sysCodeBy('chill').then((rs) => { //寒颤
        vm.chillList = rs.data.resultList;
    })
    select.sysCodeBy('ecg').then((rs) => { //ecg
        $scope.ecg = rs.data.resultList;
        $scope.ecg.forEach(function(v, k) {
            v.codeValue = parseInt(v.codeValue)
        })
    })

    // 用药
    vm.medECfg = eCharts.config_pacu(vm.pageState, 'x', {
        zrdblclick: function(params, scope) { //双击加浓度流速
            if (params.target) { //阻值点的双击事件
                return;
            }
            //没有触发series点击无效  scope.targetseriesIndex就是第几个series  !params.target && params.topTarget
            params.positionValue = scope.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [params.offsetX, params.offsetY]);
            params.seriesIndex = scope.targetseriesIndex;
            var offsetX = parseInt(params.positionValue[0]);
            var offsetY = parseInt(params.positionValue[1]);
            if ((offsetY - 1) % 3 == 0) { //Y轴高过1   
            } else if ((offsetY + 1 - 1) % 3 == 0) {
                offsetY += 1;
            } else if ((offsetY - 1 - 1) % 3 == 0) {
                offsetY -= 1;
            } else {
                return;
            }
            var check, checkName;
            for (var i = 0; i < vm.medEOpt1.series.length; i++) { //检查是否X在持续用药中
                if (vm.medEOpt1.series[i].id == offsetY) {
                    check = true;
                    // name=
                    for (var j = 0; j < vm.medEOpt1.series[i].data.length; j++) {
                        if (vm.medEOpt1.series[i].data[j].ev_list && vm.medEOpt1.series[i].data[j].ev_list.name) {
                            var checkEv_list = vm.medEOpt1.series[i].data[j].ev_list;
                            checkName = vm.medEOpt1.series[i].data[j].ev_list.name;
                            break;
                        }
                    }
                    break;
                }
            }
            if (!check) {
                return;
            }
            var offsetXtimestamp = eCharts.translateTimeValue(params.positionValue[0], vm.timeArr49[vm.view.pageCur]) * 1000;
            var box = {};

            if (checkEv_list.type == "zl") {
                for (var k = 0; k < vm.startOper.treatMedEvtList.length; k++) {
                    for (var l = 0; l < vm.startOper.treatMedEvtList[k].medicalEventList.length; l++) {
                        if (vm.startOper.treatMedEvtList[k].medicalEventList[l].name == checkName && vm.startOper.treatMedEvtList[k].medicalEventList[l].startTime < offsetXtimestamp && vm.startOper.treatMedEvtList[k].medicalEventList[l].endTime > offsetXtimestamp) {
                            checkEv_list = angular.merge(checkEv_list, vm.startOper.treatMedEvtList[k].medicalEventList[l])
                            box.flag = true;
                            box.k = k;
                            box.l = l;
                            box.offsetXtimestamp = offsetXtimestamp;
                            break;

                        }
                    }
                    if (box.flag) {
                        break;
                    }
                }
            }
            if (checkEv_list.type == "mz") {
                for (var k = 0; k < vm.startOper.anaesMedEvtList.length; k++) {
                    for (var l = 0; l < vm.startOper.anaesMedEvtList[k].medicalEventList.length; l++) {
                        if (vm.startOper.anaesMedEvtList[k].medicalEventList[l].name == checkName && vm.startOper.anaesMedEvtList[k].medicalEventList[l].startTime < offsetXtimestamp && vm.startOper.anaesMedEvtList[k].medicalEventList[l].endTime > offsetXtimestamp) {
                            checkEv_list = angular.merge(checkEv_list, vm.startOper.anaesMedEvtList[k].medicalEventList[l])
                            box.flag = true;
                            box.k = k;
                            box.l = l;
                            box.offsetXtimestamp = offsetXtimestamp;
                            break;

                        }
                    }
                    if (box.flag) {
                        break;
                    }
                }
            }

            if (box.flag) {
                var scope = $rootScope.$new();
                scope.parm = { isAdd: true, ev_list: checkEv_list, offsetXtimestamp: box.offsetXtimestamp, mergeobj: mergeobj };
                $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    template: require('./newmodel/fastAddEventPlus.html'),
                    controller: require('./newmodel/fastAddEventPlus.controller.js'),
                    scope: scope
                }).result.then(function(rs) {
                    anesRecordServe.showRemark(vm, docId, false, mergeobj);
                    // if (!rs.param.dataArr) {
                    //     searchEventList(rs);
                    // } else {
                    //     eCharts.refChart(vm, rs.param.dataArr)
                    // }
                });
            }

        },
        dragEndFn: function(dataIndex, transdata, entitydata, obj, config) { //拖动后
            anesRecordServe.upEOption1(vm, dataIndex, transdata, entitydata, obj, config, regOptId, docId, ev_list, vm.view.pageSize, mergeobj);
        },
        itemdblclickFn: function(dataIndex, transdata, entitydata, obj, config) { //双击点事件
            var scope = $rootScope.$new();
            //最后一个点终止
            if (transdata[dataIndex].ev_list.dosage != undefined && transdata[dataIndex].ev_list.showFlow == undefined && transdata[dataIndex].ev_list.showThick == undefined) {
                return;
            }
            if (transdata[dataIndex].ev_list.type == "zl" || transdata[dataIndex].ev_list.type == "mz") {

            } else {
                return;
            }
            scope.parm = { dataIndex: dataIndex, transdata: transdata, entitydata: entitydata, obj: obj };
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                template: require('./newmodel/fastAddEventPlus.html'),
                controller: require('./newmodel/fastAddEventPlus.controller.js'),
                scope: scope
            }).result.then(function(rs) {
                anesRecordServe.showRemark(vm, docId, false, mergeobj);
            });
        }
    });
    vm.medEOpt1 = eCharts.medOpt1(eChartCol, vm);
    // 监测项
    vm.monECfg = eCharts.config1(vm.pageState, 'y', {
        zrClickFn: function(params, scope) { //点击加点
            if (!isNaN(scope.targetseriesIndex) && scope.config.isAdd) {
                var transdata = scope.option.series[scope.targetseriesIndex].data;
                var entitydata = { series: scope.option.series[scope.targetseriesIndex] };
                var pointInPixel = [params.offsetX, params.offsetY];
                var pointInGrid = scope.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: entitydata.series.yAxisIndex ? entitydata.series.yAxisIndex : 0 }, pointInPixel); //chart
                if (!transdata[Math.round(pointInGrid[0])]) {
                    return;
                }
                transdata[Math.round(pointInGrid[0])].value = pointInGrid[1];
                transdata[Math.round(pointInGrid[0])].symbol = entitydata.series.symbol;
                anesRecordServe.addPoint(vm, angular.merge(transdata[Math.round(pointInGrid[0])]));
            }
        },
        dragEndFn: function(dataIndex, transdata, entitydata, obj, config) { //拖动后
            anesRecordServe.upEOption1(vm, dataIndex, transdata, entitydata, obj, config, regOptId, docId, ev_list, vm.view.pageSize, angular.merge({}, mergeobj, { onlyGetObsdata: true }));
        },
        itemdblclickFn: function(dataIndex, transdata, entitydata, obj, config) {
            var data = angular.merge({ seriesName: entitydata.series.name }, transdata[dataIndex]);
            anesRecordServe.deletePoint1(vm, data, angular.merge({}, mergeobj, { onlyGetObsdata: true })); // 删除点
        },
        zrMoveFn: function(ev, scope) { //划过加点
            return;
            if (!isNaN(scope.targetseriesIndex) && scope.config.isAdd) {

                var transdata = scope.option.series[scope.targetseriesIndex].data;
                var entitydata = { series: scope.option.series[scope.targetseriesIndex] };
                var pointInPixel = [ev.offsetX, ev.offsetY];
                var pointInGrid = scope.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: entitydata.series.yAxisIndex ? entitydata.series.yAxisIndex : 0 }, pointInPixel); //chart
                if (!transdata[Math.round(pointInGrid[0])]) {
                    // toastr.error('此处暂时不能添加点');
                    return;
                }
                if (transdata[Math.round(pointInGrid[0])].value[1] != '') { //如果有值 终止
                    return
                }
                transdata[Math.round(pointInGrid[0])].value = pointInGrid[1];
                transdata[Math.round(pointInGrid[0])].symbol = entitydata.series.symbol;
                anesRecordServe.addPoint(vm, angular.merge(transdata[Math.round(pointInGrid[0])]));
            }
        },
        batchFn: function(movedata, bindfn) { //批量加点
            anesRecordInter.batchHandleObsDat(movedata, function() {
                anesRecordServe.getobsData(vm, regOptId, docId, ev_list, mergeobj);
                bindfn();
                movedata = [];
            });
        },
        batchDataFn: function(ev, scope) { //组织数据
            if (!isNaN(scope.targetseriesIndex) && scope.config.isAdd) {
                var transdata = scope.option.series[scope.targetseriesIndex].data;
                var entitydata = { series: scope.option.series[scope.targetseriesIndex] };
                var pointInPixel = [ev.offsetX, ev.offsetY];
                var pointInGrid = scope.chart.convertFromPixel({ xAxisIndex: 0, yAxisIndex: entitydata.series.yAxisIndex ? entitydata.series.yAxisIndex : 0 }, pointInPixel); //chart
                if (!transdata[Math.round(pointInGrid[0])]) {
                    // toastr.error('此处暂时不能添加点');
                    return;
                }
                if (transdata[Math.round(pointInGrid[0])].value[1] != '') { //如果有值 终止
                    return
                }
                transdata[Math.round(pointInGrid[0])].value = pointInGrid[1];
                transdata[Math.round(pointInGrid[0])].symbol = entitydata.series.symbol;
                // anesRecordServe.addPoint(vm, angular.merge(transdata[Math.round(pointInGrid[0])]));

                if (angular.merge(transdata[Math.round(pointInGrid[0])])) {
                    return angular.merge(transdata[Math.round(pointInGrid[0])]);
                }

            }
        }
    });
    vm.monEOpt1 = eCharts.monOpt1(eChartCol, [{ min: 0, max: 240, interval: 10 }, { min: 18, max: 42, interval: 1 }, { min: 0, max: 32 }]);
    // 事件标记
    vm.markECfg = eCharts.config(1);
    // vm.markEOpt = eCharts.markOpt(eChartCol, 1);
    vm.markEOpt1 = eCharts.markOpt1(eChartCol, 1); //delete
    // 开始手术
    startOper();
    setTimeout(function() { $scope.$broadcast('refresh', {}); }, 1000);

    function startOper() {
        anesRecordInter.startOper(regOptId, vm.pageState, mergeobj).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            vm.docType = 2;
            docId = rs.data.anaesRecord.anaRecordId;
            vm.operState = rs.data.regOpt.state;
            vm.startOper = anesRecordServe.initData(rs.data);
            vm.startOper.anaesPacuRec.anaesTypeShow = select.translateStringToArr(vm.startOper.anaesPacuRec.anaesType, 3);
            vm.startOper.anaesPacuRec.frontOperSpecialCaseShow = select.translateStringToArr(vm.startOper.anaesPacuRec.frontOperSpecialCase, 7);
            vm.startOper.anaesPacuRec.airwayConditionShow = select.translateStringToArr(vm.startOper.anaesPacuRec.airwayCondition, 3);
            if ((vm.operState == '03' || vm.operState == '04' || vm.operState == '05') && vm.pageState != 0 && vm.pageState != 3 || vm.docInfo.roleType != 'ANAES_DIRECTOR')
                vm.setting.readonly = true;
            var flag;
            for (var item of vm.startOper.eventList) {
                if (item.codeName == '入PACU时间') {
                    flag = true;
                    anesRecordServe.getobsData(vm, regOptId, docId, ev_list, mergeobj);
                    break;
                }
            }
            if (!flag) {
                if (vm.setting.readonly) return;
                anesRecordInter.firstSpot(new Date().getTime(), regOptId, docId, mergeobj).then(function(result) {
                    if (result.data.resultCode !== '1') return;
                    vm.startOper.eventList = anesRecordServe.dateFormat(result.data.eventList);
                    if (vm.startOper.eventList.length > 0) {
                        if (rs.data.regOpt.emergency == 1) {
                            vm.startOper.anaesRecord.asaLevelE = true;
                            anesRecordInter.changeRadio(vm.startOper);
                        }
                        inTime = getInTime(vm.startOper.eventList);
                        anesRecordServe.getobsData(vm, regOptId, docId, ev_list, mergeobj);
                    } else {
                        toastr.error('手术开始失败');
                    }
                });
            }
            if (!inTime)
                inTime = getInTime(vm.startOper.eventList);
            $scope.inTime = new Date($filter('date')($scope.inTime, 'yyyy-MM-dd HH:SS'));
            // anaesOperTime(docId); // 查询麻醉时长与手术时长
            totleIoEvent(docId); // 查询出入量总量
            // oiSelectChange(docId); // 监听数据进行保存操作
        });
    }


    function getMedTakeWayName(medicalEventList) {
        var medTakeWayName = '';
        for (var detail of medicalEventList) {
            if (medTakeWayName == '') {
                medTakeWayName = detail.medTakeWayName;
            } else {
                if (medTakeWayName.indexOf(detail.medTakeWayName) < 0)
                    medTakeWayName += ',' + detail.medTakeWayName;
            }
        }
        return medTakeWayName;
    }
    vm.getItem = function(query, url) { // oi-select查询
        if (!query) return;
        var deferred = $q.defer();
        anesRecordInter.queryItem(query, url, function(list) {
            $timeout(function() {
                deferred.resolve(list);
            }, 500);
        });
        return deferred.promise;
    }
    vm.getDiagnosedefList = function(query, arr) {
        return select.getDiagnosedefList(query, arr);
    };
    vm.getOperdefList = function(query, arr) {
        return select.getOperdefList(query, arr);
    };
    vm.getAnesList = function(query, arr) {
        return select.getAnaesthetists(query, arr);
    };
    vm.getOperaList = function(query, arr) {
        return select.getOperators(query, arr);
    };
    vm.getNurseList = function(query, arr) {
        return select.getNurses(query, arr);
    };
    vm.editInfo = function() { // 保存病人信息
        if (isNaN(vm.startOper.regOpt.weight)) vm.startOper.regOpt.weight = vm.startOper.regOpt.weight.replace(/[^\d\.]/g, ''); //替换所有非点和数字的字符
        if (isNaN(vm.startOper.regOpt.height)) vm.startOper.regOpt.height = vm.startOper.regOpt.height.replace(/[^\d\.]/g, '');
        anesRecordInter.editInfo(regOptId, vm.startOper.regOpt.height, vm.startOper.regOpt.weight, vm.startOper.regOpt.awake);
    }
    vm.saveAnaesPacuRec = function() {
        if (!vm.startOper) return;
        var anesDocList = [];
        for (var item of vm.startOper.anaesPacuRec.anesDocList) {
            anesDocList.push({ name: item.name, id: item.id ? item.id : item.userName });
        }
        var nurseList = [];
        for (var item of vm.startOper.anaesPacuRec.nurseList) {
            nurseList.push({ name: item.name, id: item.id ? item.id : item.userName });
        }
        vm.startOper.anaesPacuRec.anaesType = vm.startOper.anaesPacuRec.anaesTypeShow.join();
        vm.startOper.anaesPacuRec.frontOperSpecialCase = vm.startOper.anaesPacuRec.frontOperSpecialCaseShow.join();
        vm.startOper.anaesPacuRec.airwayCondition = vm.startOper.anaesPacuRec.airwayConditionShow.join();
        vm.startOper.anaesPacuRec.anesDocList = anesDocList;
        vm.startOper.anaesPacuRec.nurseList = nurseList;
        vm.startOper.anaesPacuRec.stewardScore = parseInt(vm.startOper.anaesPacuRec.awake ? vm.startOper.anaesPacuRec.awake : 0) + parseInt(vm.startOper.anaesPacuRec.airwayPatency ? vm.startOper.anaesPacuRec.airwayPatency : 0) + parseInt(vm.startOper.anaesPacuRec.physicalActivity ? vm.startOper.anaesPacuRec.physicalActivity : 0);

        anesRecordInter.saveAnaesPacuRec(regOptId, vm.startOper.anaesPacuRec);
    }
    vm.changeRadio = function() { // 保存手术信息
        if (vm.startOper.anaesRecord.patAnalgesia_.check == 0) {
            vm.startOper.anaesRecord.patAnalgesia_.value = 0;
        }
        anesRecordInter.changeRadio(vm.startOper);
    }

    vm.chageLeaveTo = function(o) {
        vm.startOper.anaesPacuRec.leaveTo = o.codeValue;
        // anesRecordInter.changeRadio(vm.startOper);
        vm.saveAnaesPacuRec();
    }

    vm.handleKey = function($event, code, i) {
        console.log($event)
        // if($event.which != 13)
        //     return;
        // vm.time_watch(code, i)
        $event.preventDefault();
    }

    vm.time_watch = function(code, i) { // 处理麻醉事件 vm.event为html页面ng-init赋值的
        // if (vm.operState != '04') return;
        var nowTime = new Date().getTime();
        if (i && typeof i.occurTime == "number") {
            nowTime = new Date($filter('date')(i.occurTime, 'yyyy-MM-dd') + ' ' + i.strTime).getTime();
        } else if (i && typeof i == "string") {
            nowTime = new Date(i).getTime();
        }
        switch (code) {
            case 1:
                if (vm.event.mzks && vm.event.mzks.occurTime < nowTime) {
                    toastr.warning('入室时间不能大于麻醉开始时间');
                } else {
                    updateEnterRoomTime(new Date($filter('date')(i.occurTime, 'yyyy-MM-dd') + ' ' + i.strTime).getTime(), vm.event.rs ? vm.event.rs.anaEventId : '', code, function() {
                        inTime = nowTime; //更新inTime变量 不然getnewmon在修改入室时间后传的时间不对
                    });
                }
                break;
            case 1001:
                updateEnterRoomTime(new Date(vm.startOper.anaesPacuRec.enterTime).getTime(), $filter('filter')(vm.startOper.eventList, function(item) {
                    return item.codeName == '入PACU时间'
                })[0].anaEventId, code, function() {
                    inTime = nowTime; //更新inTime变量 不然getnewmon在修改入室时间后传的时间不对
                });
                break;
            case 1002:
                var arr = $filter('filter')(vm.startOper.eventList, function(item) {
                    return item.codeName == '出PACU时间'
                })[0];
                if (arr) {
                    var params = {
                        regOptId: regOptId,
                        docType: 2,
                        anaesevent: angular.merge(arr, { docId: docId, state: vm.startOper.regOpt.state, occurTime: new Date(vm.startOper.anaesPacuRec.outTime).getTime() })
                    }
                    IHttp.post("operCtl/updateOuterTime", params).then(function(rs) {
                        if (rs.data.resultCode == '1') {
                            // $scope.eventList = [];
                            // for (var item of rs.data.resultList) {
                            //     if (item.codeName != '入室' && item.codeName != '麻醉开始' && item.codeName != '手术开始' && item.codeName != '手术结束' && item.codeName != '出室时间' && item.codeName != '麻醉结束') {
                            //         returnParams.list = $scope.eventList.push(item);
                            //     }
                            // }
                        }

                    });
                } else {
                    outOper(vm.startOper.anaesPacuRec.outTime);
                }

                break;
        }
    }

    vm.toPrevPage = function(param) { // 上一页
        if (vm.view.pageDone && vm.view.pageCur > 1) {
            vm.view.pageCur--;
            anesRecordServe.getobsData(vm, regOptId, docId, ev_list, mergeobj);
        }
    }

    vm.toNextPage = function() { // 下一页
        if (vm.view.pageDone && vm.view.pageCur != vm.view.pageCount) {
            vm.view.pageCur++;
            if (vm.view.pageCur > vm.view.pageCount) {
                vm.view.pageCur = 1;
            }
            anesRecordServe.getobsData(vm, regOptId, docId, ev_list, mergeobj);
        }
    }

    vm.saveMon = function(param, item) { // 保存术中记录数据
        anesRecordInter.updobsdat(param, regOptId).then(function(rs) {
            anesRecordServe.getNewMon(vm, regOptId, inTime, mergeobj);
        });
    }

    vm.saveMonitorPupil = function(param, code) { // 保存瞳孔数据
        if (code == "left" && param.id == "" && param.left == "") return;
        if (code == "right" && param.id == "" && param.right == "") return;
        if (code == "reflect" && param.id == "" && param.lightReaction == "") return;
        anesRecordInter.saveMonitorPupil(param);
    }
    vm.toOperRoom = function() {
        var scope = $rootScope.$new();
        scope.regOptId = regOptId;
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'sm',
            controllerAs: 'vm',
            scope: scope,
            template: require('./modal/againStartOper.html'),
            controller: require('./modal/againStartOper.controller.js'),
        }).result.then(function(rs) {
            toastr.info("已转入到手术室！")
        });
    }

    vm.changeBed = function() {
        var scope = $rootScope.$new();
        scope.regOptId = regOptId;
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'sm',
            controllerAs: 'vm',
            scope: scope,
            template: require('./modal/changeBed.html'),
            controller: require('./modal/changeBed.controller.js'),
        }).result.then(function(rs) {
            toastr.info("成功切换床位")
        });
    }

    vm.outOper = function() { // 出室
        // if (vm.docInfo.outOperConfirm) {
        //     confirm.tips().show('请记得对该手术进行费用确认').then((rs) => {
        //         outOper();
        //     });
        // } else {
        outOper();
        // }
    }

    function outOper(outTime) {
        anesRecordInter.verifyDrugOverTime(docId).then((rs) => {
            if (rs.data.resultCode != 1) {
                toastr.error(rs.data.resultMessage);
                return;
            }
            if (rs.data.name) {
                toastr.warning('【' + rs.data.name + '】还没有结束时间');
                return
            }
            var text = anesRecordServe.checkInputpacu(vm.event, vm.startOper, mergeobj); // 出室需要校验字段
            if (text) {
                toastr.warning(text);
                anesRecordServe.getobsData(vm, regOptId, docId, ev_list, mergeobj);
            } else {
                // 检查持续用药是否有未填写结束时间的记录;
                var treatMedEvtList = vm.startOper.treatMedEvtList;
                var drugName = "";
                $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    size: 'ua',
                    resolve: {
                        argu: {
                            outTime: outTime ? outTime : ''
                        }
                    },
                    template: require('./newmodel/outRoomTime.html'),
                    controller: require('./newmodel/outRoomTime.controller.js')
                }).result.then(function(data) {
                    $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        size: 'ua',
                        template: require('../../tpl/userModal/userModal.html'),
                        controller: require('../../tpl/userModal/userModal.controller.js')
                    }).result.then(function() {
                        var date = new Date($filter('date')(new Date(data.outRoomTime), 'yyyy-MM-dd HH:mm')).getTime();
                        anesRecordInter.endOperation(regOptId, docId, vm.operState, date, vm.startOper.anaesRecord.leaveTo, 1002, '', 2).then(function(result) {
                            if (result.data.resultCode != '1') return;
                            // anaesOperTime(docId);
                            vm.operState = 'END';
                            toastr.info('出室成功');
                            vm.startOper.eventList = anesRecordServe.dateFormat(result.data.eventList);
                            //回显出PACU时间
                            let outTime = vm.startOper.eventList.filter(function(item) {
                                return item.codeName == '出PACU时间';
                            })[0].occurTime;
                            vm.startOper.anaesPacuRec.outTime = $filter('date')(outTime, 'yyyy-MM-dd HH:mm')
                            anesRecordServe.stopTimerPt()
                            anesRecordServe.stopTimerRt();
                            vm.view.pageCur = 0;
                            anesRecordServe.getobsData(vm, regOptId, docId, ev_list, mergeobj);
                            $timeout(function() {
                                vm.operEditView(1);
                            }, 1000);
                            $scope.$emit('processState', vm.operState);
                        });
                    });
                });
            }
        })
    }


    vm.ev_pharmacy = function(flag) {
        var scope = $rootScope.$new();
        scope.docId = docId;
        scope.types = '1, I, O, 4';
        scope.flag = flag; //序号
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: '1200',
            template: require('./newmodel/pharmacy.html'),
            controller: require('./newmodel/pharmacy.controller.js'),
            controllerAs: 'vm',
            resolve: {
                items: {
                    callback: function(eventList) {
                        vm.startOper.eventList = anesRecordServe.dateFormat(eventList);
                    }
                }
            },
            scope: scope
        }).result.then(function(res) {
            if (res == undefined) {
                anesRecordServe.showRemark(vm, docId, false, mergeobj);
                return;
            }
            if (res.state == 'saveTpl') {
                scope.data = res.data;
                $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    template: require('./newmodel/saveTpl.html'),
                    controller: require('./newmodel/saveTpl.controller.js'),
                    controllerAs: 'vm',
                    scope: scope
                }).result.then(function(res) {
                    console.log(res)
                });
            }
        });
    }

    vm.anesEvent = function() { // 麻醉事件
        console.log(vm)
        IHttp.post('operation/searchApplication', { regOptId: regOptId }).then(function(rs) {
            var fds = vm;

            if (rs.data.resultCode != '1')
                return;
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                template: require('./newmodel/anesEvent.html'),
                controller: require('./newmodel/anesEvent.controller.js'),
                resolve: {
                    items: {
                        list: angular.copy(vm.startOper.eventList), // 考虑到删除和添加事件时无法同步界面，手动回显数据
                        docId: docId,
                        regOptId: regOptId,
                        state: rs.data.resultRegOpt.state,
                        callback: function(inTime, anaEventId, model) {
                            updateEnterRoomTime(inTime, anaEventId, 1001, function(list) {
                                model(list); // 把事件回调到模态框里面进行更新
                            });
                        }
                    }
                }
            }).result.then(function(data) {
                vm.startOper.eventList = anesRecordServe.dateFormat(data.list); // 更新麻醉事件
                if (data.outTime)
                    vm.view.pageCur = 0;
                anesRecordServe.getobsData(vm, regOptId, docId, ev_list, mergeobj);
                if (data.inTime || data.outTime) {
                    $timeout(function() {
                        vm.operEditView(1);
                    }, 1000);
                }
                showRemark(docId); // 更新备注
                eCharts.initSign(vm.markEOpt1, vm.startOper, vm.view.pageSize, false, vm); // 更新标记
            });
        });
    }

    vm.selectDN = function() { // 修改手术人员
        var scope = $rootScope.$new();
        scope.anesDocList = angular.copy(vm.startOper.anesDocList);
        scope.operatDocList = angular.copy(vm.startOper.operatDocList);
        scope.nurseList = angular.copy(vm.startOper.nurseList);
        scope.instruNurseList = angular.copy(vm.startOper.instruNurseList);
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./newmodel/selectDN.html'),
            controller: require('./newmodel/selectDN.controller.js'),
            scope: scope,
            resolve: { items: { docId: docId } }
        }).result.then(function(rs) {
            vm.startOper.anesDocList = rs.anesDocList;
            vm.startOper.operatDocList = rs.operatDocList;
            vm.startOper.nurseList = rs.nurseList;
            vm.startOper.instruNurseList = rs.instruNurseList;
        });
    }

    vm.monitorConfig = function() { // 术中监测
        if (vm.operState !== '04' && vm.operState !== '05') return;
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./newmodel/monitorConfig.html'),
            controller: require('./newmodel/monitorConfig.controller.js'),
            resolve: { items: { regOptId: regOptId, number: bConfig.mongRows } }
        }).result.then(function(list) {
            vm.startOper.leftShowList = list;
            anesRecordServe.getNewMon(vm, regOptId, inTime, mergeobj); // 更新检测数据
        });
    }

    var tempSzjcKey = 666;
    vm.selPoint = function(key, opt, ev) {
        ev = window.event || ev;
        if (ev.stopPropagation) {
            ev.stopPropagation(); //阻止事件 冒泡传播
        }

        if (!opt || tempSzjcKey == key) {
            vm.szjcKey = 666;
            tempSzjcKey = 666;
            opt = null;
        } else {
            tempSzjcKey = key;
            vm.szjcKey = key;
        }
        if (opt) {
            opt.isAdd = true;
            vm.monECfg.isAdd = true;
        } else {
            vm.monECfg.isAdd = false;
        }
        $scope.$broadcast('selPoint', opt);

    }

    vm.modelIntrMong = function() { // 麻醉监测标记点设置
        if (vm.operState !== '05') return;
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./newmodel/modelIntrMong.html'),
            controller: require('./newmodel/modelIntrMong.controller.js'),
            resolve: { items: { regOptId: regOptId, number: 4 } }
        }).result.then(function(list) {
            vm.startOper.showList = list;
            anesRecordServe.getobsData(vm, regOptId, docId, ev_list, mergeobj);
        });
    }

    vm.operEditView = function(code) { // 打开数据视图
        if (code === 1) {
            vm.view.viewShow = false;
        } else {
            vm.view.viewShow = true;
        }
        vm.seriesView = angular.copy(vm.monEOpt1.series); // 打开前冻结数据，不让它变化了
        if (vm.seriesView.length > 0 && vm.seriesView[vm.seriesView.length - 1].name == "blood") {
            vm.seriesView.pop();
        }
        vm.saveSeriesView = []; // 用来保存数据的，ng-blur就会push进去
    }

    vm.saveEditView = function() { // 批量保存修改瞄点值
        anesRecordInter.batchHandleObsDat(vm.saveSeriesView, function() {
            anesRecordServe.getobsData(vm, regOptId, docId, ev_list, mergeobj);
            vm.view.viewShow = false;
        });
    }

    vm.setValue = function(value) {
        oldValue = value;
    }

    vm.checkSeriesView = function(series, obj) {
        if (!obj.value) return;
        if (obj.value > series.max || obj.value < series.min) {
            obj.value = oldValue
            toastr.warning("修改的值超过最大值" + series.max + "最小值" + series.min + "范围");
        }
    }


    vm.modelERespire = function() { // 呼吸事件
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./newmodel/modelERespire.html'),
            controller: require('./newmodel/modelERespire.controller.js'),
            resolve: { items: { docId: docId } }
        }).result.then(function(rs) {
            if (rs.refresh) {
                showRemark(docId);
                anesRecordServe.getobsData(vm, regOptId, docId, ev_list, mergeobj);
            }
        });
    }

    vm.modelEInspect = function() { // 检验事件
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./newmodel/inspectionEvent.html'),
            controller: require('./newmodel/inspectionEvent.controller.js'),
            resolve: { items: { docId: docId } }
        }).result.then(function() {
            anesRecordServe.getobsData(vm, regOptId, docId, ev_list, mergeobj);
        });
    }

    vm.modelRemark = function() { // 其他事件
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./newmodel/remarkInfo.html'),
            controller: require('./newmodel/remarkInfo.controller.js'),
            resolve: { items: { docId: docId } }
        }).result.then(function() {
            showRemark(docId);
        });
    }

    vm.modelPersRep = function() { // 交接班
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./newmodel/persTranInfo.html'),
            controller: require('./newmodel/persTranInfo.controller.js'),
            resolve: { items: { docId: docId, regOptId: regOptId } }
        }).result.then(function() {
            showRemark(docId);
            searchOperPerson(docId);
        });
    }

    vm.saveAsTemp = function() { // 另存为模板，保存用药、输液、输血数据
        if (vm.startOper.anaesMedEvtList.length === 0 && vm.startOper.treatMedEvtList.length === 0 && vm.startOper.inIoeventList.length === 0 && vm.startOper.outIoeventList.length === 0) {
            toastr.warning('请先添加数据');
            return;
        }
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            template: require('./newmodel/saveAsTemp.html'),
            controller: require('./newmodel/saveAsTemp.controller.js'),
            resolve: { items: { zl: vm.startOper.treatMedEvtList, sy: vm.startOper.inIoeventList, mz: vm.startOper.anaesMedEvtList } }
        });
    }

    vm.loadTemp = function() { // 加载模板
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            size: 'lg',
            template: require('./newmodel/loadTempPacu.html'),
            controller: require('./newmodel/loadTemp.controller.js'),
            controllerAs: 'vm',
            resolve: { items: { regOptId: regOptId, docId: docId } }
        }).result.then(function(rs) {
            // rs.forEach(function(item) {
            //     if (item.canve !== 'sx')
            //         searchAllEventListPlus();
            // });
            showRemark(docId)
        });
    }


    vm.onPrint = function() { // 打印
        var url = 'pacuRecordPrint_nhfe';
        if (vm.operState === '08') {
            toastr.warning('手术还未结束，无法打印');
            return;
        }
        window.open($rootScope.$state.href(url, { regOptId: regOptId }));
    }


    function anaesOperTime(docId) { // 查询麻醉时长与手术时长
        anesRecordInter.anaesOperTime(docId).then(function(result) {
            if (result.data.resultCode !== '1') return;
            if (result.data.anaesTime) vm.view.anaesTime = parseInt(result.data.anaesTime / 60) + 'H' + result.data.anaesTime % 60 + 'M';
            if (result.data.operTime) vm.view.operTime = parseInt(result.data.operTime / 60) + 'H' + result.data.operTime % 60 + 'M';
        });
    }

    function totleIoEvent(id) { // 查询出入量总量
        anesRecordInter.totleIoEvent(id).then(function(result) {
            if (result.data.resultCode !== '1') return;
            if (result.data.blood) vm.view.blood = result.data.blood + 'ml';
            if (result.data.egress) vm.view.egress = result.data.egress + 'ml';
            if (result.data.emiction) vm.view.emiction = result.data.emiction + 'ml';
            if (result.data.ioevent) vm.view.ioevent = result.data.ioevent + 'ml';
        });
    }

    function showRemark(docId) { // 备注栏
        anesRecordServe.showRemark(vm, docId, false, mergeobj);
    }

    function searchOperPerson(docId) { // 麻醉医生
        anesRecordInter.searchOperPerson(docId, 'A').then(function(list) {
            var anesDocList = [];
            if (list.data.resultList.length > 0) {
                for (item of list.data.resultList) {
                    anesDocList.push({ id: item.userLoginName, name: item.name });
                }
            }
            vm.startOper.anesDocList = anesDocList;
        });
    }

    function oiSelectChange(docId) { // 监听数据进行保存操作
    }

    function updateEnterRoomTime(inTime, anaEventId, code, callback) { // 更新入室时间
        anesRecordInter.updateEnterRoomTime(regOptId, inTime, docId, anaEventId, code, mergeobj).then(function(result) {
            if (result.data.resultCode !== '1') return;
            if (callback) callback(result.data.eventList); // 此回调是麻醉事件弹框里面修改了入室时间后进行的回调
            vm.startOper.eventList = anesRecordServe.dateFormat(result.data.eventList);
            inTime = $filter('filter')(vm.startOper.eventList, function(item) {
                return vm.pageState == 3 || vm.pageState == 4 ? item.codeName === '入PACU时间' : item.code === 1;
            })[0].occurTime;
            vm.view.pageCur = 1; // 只要跟新了入室时间，就跳转到第一页
            anesRecordServe.getobsData(vm, regOptId, docId, ev_list, mergeobj);
        });
    }

    function saveTime(nowTime, anaEventId, code) { // 保存麻醉事件
        anesRecordInter.saveAnaesevent(anaEventId, docId, code, vm.operState, nowTime).then(function(result) {
            if (result.data.resultCode !== '1') return;
            vm.startOper.eventList = anesRecordServe.dateFormat(result.data.resultList);
            eCharts.initSign(vm.markEOpt1, vm.startOper, vm.view.pageSize, false, vm);
            showRemark(docId);
        });
    }

    function searchEventList(opt) { // 用药、输液、输血处理方法

        if (opt.canve && opt.canve !== 'zl')
            totleIoEvent(docId);
        anesRecordInter.searchEventList(opt).then(function(result) {
            if (result.data.resultCode !== '1') return;
            vm.startOper[opt.key] = result.data.resultList;
            if (opt.canve) {
                eCharts.option(opt.canve, result.data.resultList, ev_list);
                eCharts.initEvConfig(ev_list, vm, false);
                showRemark(docId);
            }
        });
    }

    function getInTime(EventList) {
        var inRoomTime,
            arry = $filter('filter')(EventList, function(item) {
                return vm.pageState == 3 || vm.pageState == 4 ? item.codeName === '入PACU时间' : item.code === 1;
            });
        if (arry.length > 0)
            inRoomTime = arry[0].occurTime;
        return inRoomTime;
    }

    //监听左右键控制上一页|下一页
    $(document).keyup(function(event) {
        if (event.keyCode == 37) {
            vm.toPrevPage();
        } else if (event.keyCode == 39) {
            vm.toNextPage();
        } else if (event.keyCode == 33) { //第一页
            vm.view.pageCur = 1;
            anesRecordServe.getobsData(vm, regOptId, docId, ev_list, mergeobj);
        } else if (event.keyCode == 34) { //最后一页
            vm.view.pageCur = 0;
            anesRecordServe.getobsData(vm, regOptId, docId, ev_list, mergeobj);
        }
    });

    vm.eq = function(a, b) {
        return angular.equals(a, b);
    }
}