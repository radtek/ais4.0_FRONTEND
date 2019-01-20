module.exports = { //beCode
    cshtyy: {//航天医院
        "NurseEnterOperRoomUrl": "midCheckRecordLog_htyy",//护士开始手术url
        "docPrint": "docPrintHtyy",//一键打印路由
        "enterPacuUrl": "operRecovery_htyy",//入PACU路由地址  pacuRecovery_base
        "eventCurrentTime2hours": true,//添加事件默认不能超过当前事件 
        "hideMarkLine": true,//隐藏ECHARTS的横线
        "optLevelListStyle": true,//麻醉记录单 手术分类default['一级', '二级', '三级', '四级']else['1', '2', '3', '4'];
        "optLevelRequire": false, //黔南州中医院基本信息才必填手术等级
        "originRequire": true,
        "outOperConfirm": true,//麻醉记录单 出室确认
        "setSubType": true,//加载模板传subtype
        "designedOptCodes":true,//急诊拟施手术必填
        "Ttube":true,//护理记录单 引流管加T型管
    },
    nhyy: {//南华医院
        "NurseEnterOperRoomUrl": "midCheckRecordLog_nhyy",//护士开始手术url
        "enterPacuUrl": "operRecovery_nhfe",//入PACU路由地址  pacuRecovery_base
        "eventCurrentTime2hours": true,//添加事件默认不能超过当前事件 
        "optLevelListStyle": true,//麻醉记录单 手术分类default['一级', '二级', '三级', '四级']else['1', '2', '3', '4'];
        "optLevelRequire": false, //黔南州中医院基本信息才必填手术等级
        "outOperConfirm": true,//麻醉记录单 出室确认
        "setSubType": true,//加载模板传subtype
        "hideMarkLine": true//隐藏ECHARTS的横线
    },
    base: {//基线版本
        "NurseEnterOperRoomUrl": "midNursRecordLog_syzxyy",//护士开始手术url
        "enterPacuUrl": "operRecovery_base",//入PACU路由地址  pacuRecovery_base
        "eventCurrentTime2hours": true,//添加事件默认不能超过当前事件 
        "optLevelListStyle": true,//麻醉记录单 手术分类default['一级', '二级', '三级', '四级']else['1', '2', '3', '4'];
        "optLevelRequire": false, //黔南州中医院基本信息才必填手术等级
        "outOperConfirm": true,//麻醉记录单 出室确认
        "setSubType": true,//加载模板传subtype
        // showImgTitle:true,//文书显示图片而非标题 邵阳
        // hideRegion:true,  //黔南州中院 外部会诊 隐藏病区
        // syncMidMed:true,//黔南州中院  手术核算单 同步术中药品
        // syncMidMed:true,//黔南州中院  手术核算单 同步术中药品
        // anesthesiaSummaryInspect:true,//麻醉总结/麻醉记录单二    验证必填项
        enterAiroomUrl:'base_aiRoomRec',//诱导室卡片设置的路由 
    }
}