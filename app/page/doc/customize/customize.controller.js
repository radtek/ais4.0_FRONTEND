customizeCtrl.$inject = ['$rootScope','$scope','IHttp','toastr','$filter','select','auth','$q','$timeout','confirm'];

module.exports = customizeCtrl;

function customizeCtrl($rootScope, $scope, IHttp, toastr, $filter, select, auth, $q, $timeout, confirm) {
    var vm = this;
    let regOptId = $rootScope.$stateParams.regOptId;
    $scope.setting = $rootScope.$state.current.data;
    var currentMenuId = $rootScope.currMenuId;
    $scope.docInfo = auth.loginUser();
    $scope.saveActive = auth.getDocAuth();
    var beid = $scope.docInfo.beid;
    vm.docTheme={};
    $scope.$emit('readonly', $scope.setting);
       
    
    IHttp.post("document/selectDocThemeByMenuId",{'menuId' :currentMenuId,'regOptId':regOptId}).then(function(rs) {
            if (rs.data.resultCode === '1') {
                vm.docTheme = rs.data.docTheme;
                vm.columns = vm.docTheme.record.columns;           
                var parseHtml = rs.data.docTheme.parseHtml;
                $("#dochtml").html(parseHtml);
                if(vm.docTheme.docTitleFormbean.length>0){
                    vm.tableName = vm.docTheme.docTitleFormbean[0].tableName;  
                    $scope.processState = vm.columns.processState; 
                    if(!!vm.columns.id){
                        //赋值
                        $timeout(function() {
                            setValue();
                        }, 100);
                    }
                }
            }
    }); 

    function setValue(){
        var cols = vm.docTheme.docTitleFormbean;
        var value;
        for (var i = 0; i < cols.length; i++) {
            value = vm.columns[cols[i].fieldName]
            if(cols[i].plugins=="radios"){                
                setRadioValue(cols[i].fieldName,value);
            }else if(cols[i].plugins=="checkboxs"){
                document.getElementsByName(cols[i].fieldName)[0].checked = (value==="1"?true:false);
            }else{
                document.getElementsByName(cols[i].fieldName)[0].value = value;
            }
        }
    }

    function getValue(){
        var cols = vm.docTheme.docTitleFormbean;
        for (var i = 0; i < cols.length; i++) {
            if(cols[i].plugins=="radios"){
                vm.columns[cols[i].fieldName] = getRadioValue(cols[i].fieldName);
            }else if(cols[i].plugins=="checkboxs"){
                vm.columns[cols[i].fieldName] = document.getElementsByName(cols[i].fieldName)[0].checked?"1":"0";
            }else{
                vm.columns[cols[i].fieldName] = document.getElementsByName(cols[i].fieldName)[0].value;
            }
        }
    }

    function submit(processState, state) {
        getValue();
        vm.columns.processState = processState;
        vm.columns.regOptId=regOptId;
        vm.columns.beid=beid;
        vm.columns.total=undefined;
        if(!vm.columns.id)
            vm.columns.id=undefined;

        var params = {tableName:vm.tableName,columns:vm.columns};
        
        IHttp.post('document/saveZdyTable', params).then(function(rs) {
            if (rs.data.resultCode != 1) {
                toastr.error(rs.data.resultMessage);
                return;
            }
            toastr.success(rs.data.resultMessage);            
            $scope.processState = processState;
            if(state == 'print')
                $scope.$emit('end-print');
            else
                $scope.$emit('processState', processState);
        });
    }

    function save(type, state) {
        //验证字符长度和最大最小值
        var verify =  verifyMaxMinLen();
        if(!!verify){
            toastr.warning(verify);
            return;
        }
        if (type == 'END') {
            //验证必填项
            verify = verifyIsMast();
            if (!!verify) {
                toastr.warning(verify);
                return;
            }
            if(state == 'print') {
                if($scope.processState == 'END')
                    $scope.$emit('doc-print');
                else
                    confirm.show('打印的文书将归档，且不可编辑。是否继续打印？').then(function(data) { submit(type, state); });
            } else {
                if($scope.processState == 'END')
                    submit(type);
                else
                    confirm.show('提交的文书将归档，并且不可编辑。是否继续提交？').then(function(data) { submit(type); });
            }
        } else{
            submit(type);       
        }
    }

    function verifyIsMast(){
        var verify="",val;
        var titleList=vm.docTheme.docTitleFormbean;
        for (var i = 0; i < titleList.length; i++) {
            if(!!titleList[i].ismast){
                val = document.getElementsByName(titleList[i].fieldName)[0].value;
                if(!val){
                    verify=titleList[i].title+"不能为空！";
                    break;
                }
            } 
        }
        return verify;
    }

    function verifyMaxMinLen(){
        var verify="",val;
        var titleList=vm.docTheme.docTitleFormbean;
        for (var i = 0; i < titleList.length; i++) {
            if(titleList[i].plugins==="text"){
                if(titleList[i].fieldType==='varchar' && !!titleList[i].maxlength){
                    val = document.getElementsByName(titleList[i].fieldName)[0].value;
                    if(val && val.length>titleList[i].maxlength){
                        verify=titleList[i].title+"的长度过长！";
                        break;
                    }
                } 
                if(titleList[i].fieldType==='int'){
                    if(!!titleList[i].maxdoc){
                        val = document.getElementsByName(titleList[i].fieldName)[0].value;
                        if(val){
                            val = parseInt(val);
                            if(val && val>titleList[i].maxdoc){
                                verify=titleList[i].title+"的值太大！";
                                break;
                            }
                        }
                    }
                    if(!!titleList[i].mindoc){
                        val = document.getElementsByName(titleList[i].fieldName)[0].value;
                        if(val){
                            val = parseInt(val);
                            if(val<titleList[i].mindoc){
                                verify=titleList[i].title+"的值太小!";
                                break;
                            }
                        }
                    }
                }
            }
        }
        return verify;
    }

    function getRadioValue(name){
        var radio=document.getElementsByName(name);
        var selectvalue=null;   //  selectvalue为radio中选中的值
        for(var i=0;i<radio.length;i++){
            if(radio[i].checked==true) {
                selectvalue=radio[i].value;
                break;
            }
        }
        return selectvalue;
    }

    function setRadioValue(name,value){
        var rs = document.getElementsByName(name);
        for(var i =0;i<rs.length;i++){
            var r =rs[i];
            if(r.value==value){
                r.checked=true;
                break;
            }
        }
    }

  

    $scope.$on('save', () => {
        if ($scope.saveActive && $scope.processState == 'END')
            save('END');
        else
            save('NO_END');
    });

    $scope.$on('print', () => {
        save('END', 'print');
    });

    $scope.$on('submit', () => {
        save('END');
    })
     $scope.$emit('printDone', {flag:'customize'});//此发射此文书下载成功了的信号
}