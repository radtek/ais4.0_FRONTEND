OutRoomTimeCtrl.$inject = ['$scope', 'IHttp', '$uibModalInstance','argu', '$filter'];

module.exports = OutRoomTimeCtrl;

function OutRoomTimeCtrl($scope, IHttp, $uibModalInstance,argu, $filter) {
    $scope.params = {
        outRoomTime:argu.outTime?argu.outTime:$filter('date')(new Date(), 'yyyy-MM-dd HH:mm')
    };
    $scope.save = function() {
        $uibModalInstance.close($scope.params);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };

}
