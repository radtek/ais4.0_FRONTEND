FrameCtrl.$inject = ['$rootScope', '$scope', 'auth', 'menu', '$timeout', 'select'];

module.exports = FrameCtrl;

function FrameCtrl($rootScope, $scope, auth, menu, $timeout, select) {
    var pageState = $rootScope.$state.current,
        menus = auth.userPermission(),
        vm = this;
    $scope.curPage = pageState.name;
    $scope.user = auth.loginUser();
    switch($scope.user.module){
        case 'oprm':
        $scope.preUrl='operroom';
        break;
        case 'pacu':
        $scope.preUrl='pacuroom';
        break;
        case 'airoom':
        $scope.preUrl='airoom';
        break;
        default:
    }
    $scope.menu = menu.group(menus, $rootScope.crumbs);
    vm.operRoomId = auth.getRoomId() + '';
    $scope.common_frame_style={'font-size':"17px"};
    if (pageState.name === 'operroom')
        vm.banSelectRoom = true;
    if ($scope.user.userType == 'ANAES_DOCTOR') {
        for (let group of $scope.menu) {
            if (group.name === 'features') {
                for (let item of group.arr) {
                    if (item.name === '手术排班') {
                        item.url = 'anaesthesiaSchedules';
                        break;
                    }
                }
                break;
            }
        }
    }

    select.operroom().then((rs) => {
        $scope.operRoomList = rs.data.resultList;
        $scope.operRoomList.unshift({
            operRoomId: '0',
            name: '请选择手术室'
        })
    });

    $scope.backCard = function() {
        clearTimeout($rootScope.timer_point);
        vm.banSelectRoom = true;
    }

    $scope.logout = function() {
        clearTimeout($rootScope.timer_point);
        if ($scope.user.module == 'ctrlcent')
            $rootScope.$state.go('login');
        else if ($scope.user.module == 'pacu')
            $rootScope.$state.go('pacu');
        else if ($scope.user.module == 'airoom')
            $rootScope.$state.go('login');
        else if ($scope.user.module == 'oprm')
            $rootScope.$state.go('login');
    }

    $scope.toggle = function(item) {
        $scope.menu = menu.target(item, $scope.menu);
    }

    $scope.changeRoomId = function() {
        $scope.$broadcast('operRoomId', vm.operRoomId)
    }

    $scope.$on('banSelectRoom', function(ev, data) {
        vm.banSelectRoom = data;
    })

    $scope.eq = function(a, b) {
        return angular.equals(a, b);
    }
}