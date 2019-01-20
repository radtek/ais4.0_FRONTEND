DocCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$uibModal', 'select', 'baseConfig', '$timeout', 'auth','toastr'];

module.exports = DocCtrl;

function DocCtrl($rootScope, $scope, IHttp, $uibModal, select, baseConfig, $timeout, auth,toastr) {
    var regOptId = $rootScope.$stateParams.regOptId;
    $scope.btnHide = false;
    $scope.isDelBat = false;
    $scope.page = $rootScope.$state.current.name;
    $scope.docRequired="";    
    $scope.common_doc_style={'font-size':"15px"};
    $scope.saveActive = auth.getDocAuth();
    $scope.$on('readonly', function(event, data) {
        if (data&&data.readonly==true){
           $scope.btnHide = data.readonly; 
        } else{
            $scope.btnHide = false;  
        }
    });

    $scope.$on('isLocalAnaes', function(event, data) {
        if (data) {
            if (data !== '0')
                $rootScope.$root.permission = $rootScope.$root.permission.replace(',REF', '');
        }
    });

    $scope.$on('changeBtnText', function(event, data) {
        $timeout(function (){
            $('#' + data.id).text(data.text);
        }, 100)
    });

    $scope.$on('isDelBat', function(event, data) {
        $scope.isDelBat = data;
    });

    // 打印
    $scope.print = function() {
        $scope.$broadcast('print');
    }

    // 打印指示卡
    $scope.printCard = function() {
        $scope.$broadcast('printCard');
    }

    // 新增
    $scope.add = function() {
        $scope.$broadcast('add');
    }

    // 保存
    $scope.save = function() {
        $scope.$broadcast('save');
    }

    // 提交
    $scope.submit = function() {
        $scope.$broadcast('submit');
    }    

    // 添加器械[包]
    $scope.addInst = function(type) {
        $scope.$broadcast('addInst', type);
    }

    // 添加敷料[包]
    $scope.addInsf = function(type) {
        $scope.$broadcast('addInsf', type);
    }

    $scope.addInsOpr = function(type) {
        $scope.$broadcast('addInsOpr', type);
    }

    $scope.appTemplat = function() {
        $scope.$broadcast('appTemplat');
    }

    $scope.searchMed = function() {
        $scope.$broadcast('searchMed');
    }

    $scope.sameMed = function() {
        $scope.$broadcast('sameMed');
    }

    $scope.delBatch = function() {
        $scope.$broadcast('delBatch');
    }

    $scope.saveAs = function() {
        $scope.$broadcast('saveAs');
    }

    $scope.hisFin = function() {
        $scope.$broadcast('hisFin');
    }
    
    $scope.syncHis = function() {
        $scope.$broadcast('syncHis');
    }

    //数据同步
    $scope.refresh = function() {
        $scope.$broadcast('refresh');
    }

    //设置必填项
    $scope.set = function() {
        $scope.$broadcast('set');
    }
    //清空
    $scope.clear = function() {
        $scope.$broadcast('clear');
    }
    // 返回上级
    $scope.back = function() {
        window.history.back();
        window.location.reload();
    }

    // 监听打印的文书
    $scope.$on('doc-print', () => {
        window.print();
        // window.open($rootScope.$state.href('print'));
    })

    $scope.$on('end-print', (event, state) => {
        $scope.processState = event.targetScope.processState;
        let tabs = $scope.tabsMenu;
        let currentName = $scope.$state.current.name;
        for (let tab of tabs) {
            if (tab.url.substr(0, tab.url.indexOf('(')) === currentName) {
                if (event.targetScope.processState === 'END' && tab.name != '基本信息') {
                    tab.state = true;
                    break;
                }
            }
        }
        window.print();
        // window.open($rootScope.$state.href('print'));
    })

    // 文书完成状态
    $scope.$on('processState', function(data) {
        $scope.processState = data.targetScope.processState;
        let tabs = $scope.tabsMenu;
        let tab;
        let currentName = $scope.$state.current.name;
        for (var i = 0; i < tabs.length; i++) {
            tab = tabs[i];
            if (tab.url.substr(0, tab.url.indexOf('(')) === currentName) {
                if (data.targetScope.processState == 'END' && tab.name != '基本信息') {
                    tab.state = true;
                    break;
                }
            }
        }
    });

    if ($scope.tabsMenu.length > 1) {
        $scope.$on('$stateChangeSuccess', (event, toState, toParams, fromState) => {
            if(!regOptId) return;
            select.getDocState(regOptId).then(function(rs) {
                if (rs.data.resultCode != 1)
                    return;
                var list = rs.data.resultList,
                    tabs = $scope.tabsMenu;                   
                for (var a = 0; a < tabs.length; a++) {
                    for (var b = 0; b < list.length; b++) {                     
                        if (tabs[a].name == list[b].name) {

                            tabs[a].state = list[b].state;
                            tabs[a].required = list[b].required;
                            break;
                        }
                    }
                }                
            })
        })
    }
}
