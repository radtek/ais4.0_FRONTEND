TabsCtrl.$inject = ['$rootScope', '$scope', 'IHttp', '$state'];

module.exports = TabsCtrl;

function TabsCtrl($rootScope, $scope, IHttp, $state) {
    $rootScope.timer_point = null;
    var hasAnaesPacuRec = sessionStorage.getItem('hasAnaesPacuRec'),
    showPlacentaAgree = sessionStorage.getItem('showPlacentaAgree'),
    showRiskAsseLog = sessionStorage.getItem('showRiskAsseLog');
    $scope.common_tabs_style={'font-size':'15px'};
    $scope.$watch('$state.current.name',function(n, o) {     
         if ($rootScope.tabsMenu.length > 0 && $rootScope.tabsMenu[0].name !== '基本信息' && $rootScope.tabsMenu[0].name !== '麻醉记录单'&& $rootScope.tabsMenu[0].name !== '麻醉记录单一'&& $rootScope.tabsMenu[0].name !== '麻醉记录单（一）') { //列表切换更新 ，文书不更新
            $scope.tabsMenu = $rootScope.tabsMenu;
        }   
        if ((hasAnaesPacuRec || showPlacentaAgree || showRiskAsseLog)) {
            let tabs = $scope.tabsMenu;
            $scope.tabsMenu = [];
            angular.forEach(tabs, function(tab, index) {
                if (tab.name !== '手术风险评估表' && tab.name !== 'PACU观察记录单' && tab.name !== '胎盘处置知情同意书'&& tab.name !== '分娩镇痛同意书')
                $scope.tabsMenu.push(tab);
                if (hasAnaesPacuRec == 'true' && tab.name == 'PACU观察记录单') {
                    $scope.tabsMenu.push(tab);
                }else if ((tab.name == '胎盘处置知情同意书' || tab.name == '分娩镇痛同意书') && showPlacentaAgree == 'true') {
                    $scope.tabsMenu.push(tab);
                }else if (tab.name == '手术风险评估表' && showRiskAsseLog == 'true') {
                    $scope.tabsMenu.push(tab);
                }
            });
            hasAnaesPacuRec = undefined;
            showPlacentaAgree = undefined;
            showRiskAsseLog = undefined;
        }else {
            if ($rootScope.tabsMenu.length > 0 && $rootScope.tabsMenu[0].name !== '基本信息')
                $scope.tabsMenu = $rootScope.tabsMenu;
        }

        angular.forEach($scope.tabsMenu, function(m) {
            if (m.url.indexOf(n) >= 0)
                m.activeTab = true;
            else
                m.activeTab = false;
            if (m.url.indexOf('(') !== -1) {
                m.url = m.url.substr(0,m.url.indexOf('('));
            }
            if(m.url==$state.current.name && !!m.required){
                $rootScope.currentRequired=m.required;
                setDomRequired(m.required);                               
            }
            if (Object.keys($rootScope.$stateParams).length > 0) {
                m.url += '(' + JSON.stringify($rootScope.$stateParams) + ')';
            }
        });
    })
    $scope.checkTab = function(item) {
        var hid = '';
        IHttp.post('operation/searchApplication', { regOptId: $rootScope.$stateParams.regOptId }).then(function(rs) {
            if (rs.data.resultCode != '1')
                return;
            hid = rs.data.resultRegOpt.hid;
        });
        setTimeout(function(){
            // if (item.name === '检验报告') {
            //     window.open('http://172.20.13.41/ZhiFang.ReportFormQueryPrint/ui/ReportPrint/?patno=' + hid);
            // } else if (item.name === '影像报告') {
            //     window.open('http://172.20.13.50/techreportweb/frame/patreportlist.aspx?blh=' + hid);
            // }
        },300)
    }
    //必填项前面标红*
    function setDomRequired(requireds){
        var requiredArray = requireds.split(',');        
        for (var i = 0; i < requiredArray.length; i++) {
            var requiredDoc = jQuery("[ng-model='"+requiredArray[i]+"']:first");
            requiredDoc.parent().addClass("requiredParentDom");
            requiredDoc.parent().prepend("<em>*</em>")
        }       
    }
}
