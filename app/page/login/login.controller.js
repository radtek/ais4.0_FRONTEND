LoginCtrl.$inject = ['$rootScope', '$scope', 'auth', 'baseConfig'];

module.exports = LoginCtrl;

function LoginCtrl($rootScope, $scope, auth, baseConfig) {
    $scope.userInfo = { username: '', password: '', logionBeid: '', module: module == 'oprm' ? 'oprm' : 'ctrlcent' };
    $scope.beList = [{ id: "103", name: "3.1界面升级版本" }, { id: "201", name: "南华大学附属南华医院" }, { id: "202", name: "湖南航天医院" }, { id: "203", name: "耒阳市人民医院" }];
    $scope.fieldList = [{ fieldname: "控制中心", name: "ctrlcent" }, { fieldname: "复苏室", name: "pacu" }, { fieldname: "手术室", name: "oprm" }, { fieldname: "诱导室", name: "airoom" }];
    if (!!notPacu) {
        $scope.fieldList = $scope.fieldList.filter(i => i.fieldname != "复苏室");
    }
    if (!!notaiRoom) {
        $scope.fieldList = $scope.fieldList.filter(i => i.fieldname != "诱导室");
    }

    if (localStorage.getItem("module")) {
        $scope.userInfo.module = localStorage.getItem("module");
    } else {
        $scope.userInfo.module = "ctrlcent";
    }
    $scope.changeModuleFn = function() {
        localStorage.setItem("module", $scope.userInfo.module);
    }
    $scope.changeModuleFn();
    $scope.auth = function(userInfo) {
        if (!userInfo.username) {
            $scope.errName = '用户名不能为空';
            return;
        } else if (!userInfo.password) {
            $scope.errPwd = '用户密码不能为空';
            return;
        }
        auth.login(userInfo).then(function(user) {
            auth.curModule(userInfo.module);
            if (user.data.resultCode == 1) {
                baseConfig.init().then(function(rs) {
                    let result = JSON.parse(sessionStorage.getItem('user'));
                    let config;
                    try {
                        config = JSON.parse(JSON.parse(rs.data.resultList[5].configureValue).baseBusConfig);
                    } catch (e) {
                        config = {};
                    }
                    let merge = angular.merge(result, config);
                    //其他配置  用户信息和基本配置的其他配置合并  对user重新赋值
                    sessionStorage.setItem('user', JSON.stringify(merge))
                })
                if (userInfo.module == 'ctrlcent') {
                    if (user.data.user.beid == '101')
                        $rootScope.$state.go('hospital');
                    else if (true)
                        $rootScope.$state.go('index');
                    else {
                        $rootScope.$state.go('home');
                    }
                } else if (userInfo.module == 'oprm') {
                    $rootScope.$state.go('operroom');
                } else if (userInfo.module == 'pacu')
                    $rootScope.$state.go('pacuroom');
                else if (userInfo.module == 'airoom')
                    $rootScope.$state.go('airoom');
            } else if (user.data.resultCode == 20000001)
                $scope.errName = user.data.resultMessage;
            else if (user.data.resultCode == 20000002)
                $scope.errPwd = user.data.resultMessage;
        });
    }

    var watch = $scope.$watch('userInfo', function(c) {
        if (c.name)
            $scope.errName = '';
        if (c.pwd)
            $scope.errPwd = '';
    }, true);
}