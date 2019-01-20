dictionaryEditCtrl.$inject = ['$rootScope', '$scope', 'IHttp', 'toastr', '$uibModalInstance', 'select', '$filter', 'auth'];

module.exports = dictionaryEditCtrl;

function dictionaryEditCtrl($rootScope, $scope, IHttp, toastr, $uibModalInstance, select, $filter, auth) {
    vm = this;
    vm.title="取药"; 
    $scope.medicalParams={};   

    if ($scope.data.row) {
    	vm.title="取药";
    	 $scope.medicalParams = angular.copy($scope.data.row.entity);    	
    }
    $scope.medicalParams.operator= auth.loginUser().name;
    	
    

    vm.close = function() {
        $uibModalInstance.close('cancel');
    }
    

    $scope.save = function(type) {
        $scope.verify = verify();
        if (!$scope.verify) {
            return;
        }
        $rootScope.btnActive = false;
        $scope.medicalParams.outType = type;
       // $scope.medicalParams.effectiveTime=$scope.medicalParams.effectiveTime;
        $scope.medicalParams.storageId=$scope.medicalParams.id;
        $scope.medicalParams.id=undefined;
        

        IHttp.post('basedata/addMedicineOutRecord', $scope.medicalParams)
            .then((rs) => {
                $rootScope.btnActive = true;
            	if (rs.status === 200 && rs.data.resultCode === '1') {
                     toastr.info("取药成功");
            		$uibModalInstance.close('success');
            	} else {
            		$uibModalInstance.dismiss('faild');
            	}
            },(err) => {
            	$uibModalInstance.dismiss(err);                
            });    
    }

    select.getAllUser().then((rs) => {
        $scope.operaList = rs.data.userItem;
    });
    
    // 验证
    function verify() {
        return $scope.BaseInfoForm.$valid && !!($scope.medicalParams.outNumber && $scope.medicalParams.receiveName)
    }
}
