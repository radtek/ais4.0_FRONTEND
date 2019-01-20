AnesDocPrintCtrl.$inject = ['$rootScope', '$scope', '$window', '$timeout', 'IHttp'];

module.exports = AnesDocPrintCtrl;

function AnesDocPrintCtrl($rootScope, $scope, $window, $timeout, IHttp) {
    let docArr = [1,2];
    let checkArr = [];
    $scope.$on('printDone', function(ev, param) { 
        ev.stopPropagation();
        checkArr.push(param)
        if (checkArr.length == docArr.length) {
            $timeout(function() {
                $scope.done = true;
                $window.print();
                $window.close();
            }, 1);
        }
    });
}