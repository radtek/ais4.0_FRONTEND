instantdataCtrl.$inject = ['$rootScope', '$scope', '$window','$location', 'IHttp', '$interval', 'auth','$timeout', 'toastr','$filter'];

module.exports = instantdataCtrl;

function instantdataCtrl($rootScope, $scope, $window,$location, IHttp,$interval, auth,$timeout, toastr,$filter) {
    var vm = this;
    vm.regOpt = {};
    var regOptId = $rootScope.$stateParams.regOptId;
    $scope.docInfo = auth.loginUser();

    vm.monECfg = {
        dataLoaded: true,       
        //selPoint: true,
        //isAdd: true
    };

    var kongs2560=getNullByCount(2560);
    var kongs1280=getNullByCount(1280);
    var kongs1000=getNullByCount(1000);
 

        var ECGIseries=[];
        var ECGIxAxis =[];
        var SpO2series =[];
        var SpO2xAxis =[];
        var CO2series =[];
        var CO2xAxis =[];

        var ART_DIAseries =[];
        var ART_SYSseries =[];
        var ARTxAxis =[];
       
        var RESPseries =[];
        var RESPxAxis =[];
        var HRseries =[];
        var HRxAxis =[];
        var PRseries =[];
        var PRxAxis =[];

        //var 

        vm.monEOpt1 =  {         
            title:{
                show:false
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(params) {
                  // console.log(params);
                    var time = $filter('date')(params[0].name, 'yyyy-MM-dd HH:mm:ss');
                    if(params.length==2)
                        return time+"："+params[0].value+"/"+params[1].value;
                    else
                        return time+"："+params[0].value;
                }
            },            
            xAxis: [
                {
                    data: kongs2560,     
                    inverse :true,               
                    boundaryGap: false,                
                    axisTick:{show:false,},
                    axisLabel :{show:false}
                }, {
                    data: kongs2560, 
                    gridIndex: 1,
                    inverse :true,    
                    boundaryGap: false, 
                    axisTick:{show:false},
                    axisLabel :{show:false}
                }, {
                    data: kongs1000, 
                    gridIndex: 2,
                    inverse :true,    
                    boundaryGap: false, 
                    axisTick:{show:false},
                    axisLabel :{show:false}
                }, {
                    data: kongs1280, 
                    gridIndex: 3,
                    inverse :true,    
                    boundaryGap: false, 
                    axisTick:{show:false},
                    axisLabel :{show:false}
                }, {
                    data: kongs2560, 
                    gridIndex: 4,
                    inverse :true,    
                    boundaryGap: false, 
                    axisTick:{show:false},
                    axisLabel :{show:false}
                }
              
            ],
            yAxis: [
                {
                    //splitLine: {show: false},
                    //show:false,
                   
                    offset:0,
                    
                }, {
                    //splitLine: {show: false},
                    gridIndex: 1,
                   // show:false,
                }, {
                   // splitLine: {show: false},
                    gridIndex: 2,
                   // show:false,
                }, {
                    //splitLine: {show: false},
                    gridIndex: 3,
                    offset:0,
                    //show:false,
                }, {
                    //splitLine: {show: false},
                    gridIndex: 4,
                    offset:0,
                    //show:false,
                }
               
            ],
            grid: [
                {   
                    top: 0,
                    left: -1,
                    right: 0,          
                    bottom: '80%'
                }, {
                    top: '20%',
                    left: -1,
                    right: 0,  
                    bottom: '60%'
                }, {
                    top: '40%',
                    left: -1,
                    right: 0,  
                    bottom: '40%'
                }, {
                    top: '60%',
                    left: -1,
                    right: 0,  
                    bottom: '20%'
                }, {
                    top: '80%',
                    left: -1,
                    right: 0,  
                    bottom: -1
                }
              
            ],
            series: [
                {
                    type: 'line',
                    showSymbol: false,
                    data: kongs2560
                }, {
                    type: 'line',
                    showSymbol: false,
                    data: kongs2560,
                    xAxisIndex: 1,
                    yAxisIndex: 1
                }, {
                    type: 'line',
                    showSymbol: false,
                    data: kongs1000,
                    xAxisIndex: 2,
                    yAxisIndex: 2
                }, {
                    type: 'line',//有创血压
                    showSymbol: false,
                    data: kongs1280,
                    xAxisIndex: 3,
                    yAxisIndex: 3
                }, {
                    type: 'line',
                    showSymbol: false,
                    data: kongs2560,
                    xAxisIndex: 4,
                    yAxisIndex: 4
                }
               
            ]
        };
        //console.log(JSON.stringify(vm.monEOpt1 ) );


        vm.monECfg.dataLoaded = false;

   

    function randomData(inday) {
        now = new Date(new Date().getTime()+40*inday);          
        value = Math.random()*10;
        return [now.getTime(), Math.round(value)];
    }
    function randomData2(inday) {
        now = new Date(new Date().getTime()+40*inday);          
        value = Math.random()*8;
        return [now.getTime(), Math.round(value)];
    }
   // var optcount=0;
    //得到数据
    function getEChartData(){
        sessionStorage.setItem("getinstantdata1time",new Date().getTime());
        IHttp.post('operCtl/getobsWave', {"regOptId": regOptId
, "docType": 1}).then(function(rs) {
            if (rs.data.resultCode != '1')
                return;
            
            var data = rs.data.series;
            //console.log(data);            
            for (var i = 0; i < data.length; i++) {
                if(data[i].observeId ==='33001'){//配好了
                    ECGIseries = data[i];
                    ECGIseries.lineStyle={normal:{color:ECGIseries.color}};
                    ECGIseries.itemStyle={normal:{color:ECGIseries.color}};
                    //ECGIseries.yAxisIndex= 
                    ECGIseries.showSymbol = false;  
                    ECGIseries.type = 'line';                 
                    ECGIxAxis =[];
                    for (var j = 0; j < ECGIseries.data.length; j++) {
                        ECGIxAxis.push(ECGIseries.data[j].time);
                    }
                    if(data[i].secondData)
                        vm.ecg = data[i].secondData;
                 }else if(data[i].observeId ==='33014'){//配好了
                    SpO2series = data[i];
                    SpO2series.lineStyle={normal:{color:SpO2series.color}};
                    SpO2series.itemStyle={normal:{color:SpO2series.color}};
                    SpO2series.yAxisIndex = 1;
                    SpO2series.xAxisIndex = 1; 
                    SpO2series.showSymbol = false;  
                    SpO2series.type = 'line'; 
                    if(data[i].secondData) 
                    vm.spo2 = parseInt(data[i].secondData);
                    if(SpO2series.length==0) 
                        vm.spo2 ="";
                    SpO2xAxis =[];
                    for (var j = 0; j < SpO2series.data.length; j++) {
                        SpO2xAxis.push(SpO2series.data[j].time);
                    }
                }else if(data[i].observeId ==='33017'){
                    CO2series = data[i];
                    CO2series.lineStyle={normal:{color:CO2series.color}};
                    CO2series.itemStyle={normal:{color:CO2series.color}};
                    CO2series.yAxisIndex= 2 ;  
                    RESPseries.hoverAnimation = false;
                    CO2series.xAxisIndex = 2; 
                    CO2series.showSymbol = false;  
                    CO2series.type = 'line'; 
                    if(data[i].secondData){
                        
                        if(data[i].secondData.split('/').length>1){
                            vm.co2 = parseInt(data[i].secondData.split('/')[0]);
                            vm.co22 = parseInt(data[i].secondData.split('/')[1]);
                        }
                        
                    }
                               
                    CO2xAxis =[];
                    for (var j = 0; j < CO2series.data.length; j++) {
                        CO2xAxis.push(CO2series.data[j].time);
                    }
                }else if(data[i].observeId ==='33015'){//ART_DIA 舒张压 配好了
                    ART_DIAseries = data[i];
                    ART_DIAseries.lineStyle={normal:{color:ART_DIAseries.color}};
                    ART_DIAseries.itemStyle={normal:{color:ART_DIAseries.color}};
                    ART_DIAseries.yAxisIndex= 3;
                    ART_DIAseries.xAxisIndex = 3; 
                    ART_DIAseries.showSymbol = false;  
                    ART_DIAseries.type = 'line';                
                    ARTxAxis =[];
                    if(data[i].secondData){
                        if(data[i].secondData.split('/').length>1){
                            vm.art = parseInt(data[i].secondData.split('/')[0]);
                            vm.art2 = parseInt(data[i].secondData.split('/')[1]);
                        }
                    }
                    
                    for (var j = 0; j < ART_DIAseries.data.length; j++) {
                        ARTxAxis.push(ART_DIAseries.data[j].time);
                    }
                }else if(data[i].observeId ==='33013'){//配好了
                    RESPseries = data[i];
                    RESPseries.lineStyle={normal:{color:RESPseries.color}};
                    RESPseries.itemStyle={normal:{color:RESPseries.color}};
                    RESPseries.yAxisIndex=4; 
                    RESPseries.xAxisIndex = 4; 
                    // RESPseries.smooth = true;
                    // RESPseries.hoverAnimation = false;
                    // RESPseries.animation = false;
                    // RESPseries.showSymbol = false;  
                    RESPseries.type = 'line';                 
                    RESPxAxis =[];
                    if(data[i].secondData)
                    vm.resp =  parseInt(data[i].secondData);
                    for (var j = 0; j < RESPseries.data.length; j++) {
                        RESPxAxis.push(RESPseries.data[j].time);
                    }
                }else if(data[i].observeId ==='30010'){
                    // HRseries = data[i];
                    // HRseries.lineStyle={normal:{color:HRseries.color}};
                    // HRseries.itemStyle={normal:{color:HRseries.color}};
                    // HRseries.yAxisIndex= 5; 
                    // HRseries.xAxisIndex = 5; 
                    // HRseries.showSymbol = false;  
                    // HRseries.type = 'line';                
                   // HRxAxis =[];
                    if(data[i].secondData)
                    vm.hr = parseInt(data[i].secondData);
                    // for (var j = 0; j < HRseries.data.length; j++) {
                    //     HRxAxis.push(HRseries.data[j].time);
                    // }
                }else if(data[i].observeId ==='30011'){
                    // PRseries = data[i];
                    // PRseries.lineStyle={normal:{color:PRseries.color}};
                    // PRseries.itemStyle={normal:{color:PRseries.color}};
                    // PRseries.yAxisIndex= 6;  
                    // PRseries.xAxisIndex = 6; 
                    // PRseries.showSymbol = false;  
                    // PRseries.type = 'line';               
                    //PRxAxis =[];
                    if(data[i].secondData)
                    vm.pr = parseInt(data[i].secondData);
                    // for (var j = 0; j < PRseries.data.length; j++) {
                    //     PRxAxis.push(PRseries.data[j].time);
                    // }
                }
            }

                vm.monEOpt1.xAxis[0].data=getLastxAxis(vm.monEOpt1.xAxis[0].data,ECGIxAxis,2560);//ECGIxAxis;//;            
                vm.monEOpt1.series[0]=getLastSeries(vm.monEOpt1.series[0],ECGIseries,2560);//ECGIseries; //;
                
                vm.monEOpt1.xAxis[1].data = getLastxAxis(vm.monEOpt1.xAxis[1].data,SpO2xAxis,2560);//SpO2xAxis;//1280
                vm.monEOpt1.series[1] = getLastSeries(vm.monEOpt1.series[1],SpO2series,2560);//SpO2series;//;         
               
                vm.monEOpt1.xAxis[2].data = getLastxAxis(vm.monEOpt1.xAxis[2].data ,CO2xAxis,1000);
                vm.monEOpt1.series[2] = getLastSeries(vm.monEOpt1.series[2],CO2series,1000);
               
                vm.monEOpt1.xAxis[3].data=getLastxAxis(vm.monEOpt1.xAxis[3].data,ARTxAxis,1280);//ARTxAxis;//640
                vm.monEOpt1.series[3]=getLastSeries(vm.monEOpt1.series[3],ART_DIAseries,1280);//ART_DIAseries;//
               
                vm.monEOpt1.xAxis[4].data=getLastxAxis(vm.monEOpt1.xAxis[4].data,RESPxAxis,2560);//640 RESPxAxis;//
                vm.monEOpt1.series[4]=getLastSeries(vm.monEOpt1.series[4],RESPseries,2560);//RESPseries;//
        
        });
    }

    function getNullByCount(count){
        var kongS=[];  
        for (var i = 0; i < count; i++) {
            kongS.push("");
        }
        return kongS;
    }
    
    //拼接数据  count 5秒的正常数据总条数
    function getLastSeries(oldSeries,newSeries,count){
        var seriesData = [];
        var oldSeriesData = angular.copy(oldSeries.data);
        var newSeriesData = angular.copy(newSeries.data);

        var oldSLen = oldSeriesData.length;
        var newSLen = newSeriesData.length;
        if(newSLen==0){
            return oldSeries;
        }

     
            seriesData = oldSeriesData;
            seriesData.splice(0,newSLen);
           
            seriesData = seriesData.concat(newSeriesData);
      
        oldSeries.data = seriesData;
        return oldSeries;
    }

    //拼接数据  count 5秒的正常数据总条数
    function getLastxAxis(oldxAxis,newxAxis,count){
        var xAxisData = [];
         
        var oldXLen = oldxAxis.length;
        var newXLen = newxAxis.length;
        if(newXLen==0){
            return oldxAxis;
        }        
       
            xAxisData = angular.copy(oldxAxis);
         
            xAxisData.splice(0,newXLen);
           
            xAxisData = xAxisData.concat(newxAxis);
       
        
        return xAxisData;
    }

    function init(){
       //getData();
       getEChartData(); 
       //var timer = $interval(getData, 1000);

       // 定时刷新数据，病人生命体征定时获取
       if(!!interVits){
           clearInterval(interVits);
       }       
       var interVits= $interval(function() {
           if ($location.path().indexOf('/instantdata/') < 0) { 
                clearInterval(interVits);            
                return;
           }
           var getinstantdata1time=sessionStorage.getItem("getinstantdata1time");           
           if(!getinstantdata1time){
               sessionStorage.setItem("getinstantdata1time",new Date().getTime());
               getinstantdata1time=0;
           }         
           var nowTime=new Date().getTime();        
           if(nowTime-getinstantdata1time>=800){   
               // console.log(nowTime+'-'+getinstantdata1time+'='+(nowTime-getinstantdata1time));             
                //getData(); 
                getEChartData(); 
           }
       },1000);
    }

    init();

}
