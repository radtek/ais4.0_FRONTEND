DocModalCtrl.$inject = ['$rootScope', '$scope', '$uibModalInstance', 'IHttp', 'toastr', 'auth'];

module.exports = DocModalCtrl;

function DocModalCtrl($rootScope, $scope, $uibModalInstance, IHttp, toastr, auth) {
    var row = $scope.row,
        user = $scope.user;
    
    $scope.docInfo = auth.loginUser();

    IHttp.post('operation/getAnesDucumentStateByRegOptId', { loginName: user.userName, regOptId: row.regOptId }).then(function(rs) {
        if (rs.data.resultCode != 1)
            return;
        $scope.list = rs.data.resultList;
        let printDoc = [];
        for (var a = 0; a < $scope.list.length; a++) {
            if ($scope.list[a].name !== '手术核算单' && $scope.list[a].name !== '麻醉费用结账单') {
                printDoc.push($scope.list[a]);
            }
        }
        $scope.list = [];
        $scope.list = printDoc;
    });

    $scope.ok = function(list) {
        var url = auth.loginUser().docPrint||"docPrint";
        var temp = [];
        for (var a = 0; a < list.length; a++) {
            if (list[a].checked)
                temp.push(list[a].tabName);
        }
        if (temp.length <= 0) {
            toastr.info('请选择一项文书打印');
            return;
        }
        window.open($rootScope.$state.href(url, { regOptId: row.regOptId, docStr: temp }));
        $uibModalInstance.close(temp);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
