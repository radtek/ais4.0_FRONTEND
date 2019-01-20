PostPipeWinCtrl.$inject = ['$rootScope', '$scope', 'toastr', '$uibModalInstance', 'IHttp', 'param','auth'];

module.exports = PostPipeWinCtrl;

function PostPipeWinCtrl($rootScope, $scope, toastr, $uibModalInstance, IHttp, param,auth) {
    $scope.docInfo = auth.loginUser();
    $scope.postPipes = $scope.docInfo.Ttube?new Array(20):new Array(17);
    param.postPipe=param.postPipe.split(";");
    let postPipesStr = param.postPipe[0];
    $scope.other=param.postPipe[1];
    if (postPipesStr) {
        if (postPipesStr.indexOf('导尿管') !== -1) {
            $scope.postPipes[0] = '导尿管'
        }
        if (postPipesStr.indexOf('胃管') !== -1) {
            $scope.postPipes[1] = '胃管'
        }
        if (postPipesStr.indexOf('鼻肠管') !== -1) {
            $scope.postPipes[2] = '鼻肠管'
        }
        if (postPipesStr.indexOf('鼻胆管') !== -1) {
            $scope.postPipes[3] = '鼻胆管'
        }
        if (postPipesStr.indexOf('伤口引流管') !== -1) {
            $scope.postPipes[4] = '伤口引流管'
        }
        if (postPipesStr.indexOf('腹腔引流管') !== -1) {
            $scope.postPipes[5] = '腹腔引流管'
        }
        if (postPipesStr.indexOf('腹膜后引流管') !== -1) {
            $scope.postPipes[6] = '腹膜后引流管'
        }
        if (postPipesStr.indexOf('盆腔引流管') !== -1) {
            $scope.postPipes[7] = '盆腔引流管'
        }
        if (postPipesStr.indexOf('T管引流管') !== -1) {
            $scope.postPipes[8] = 'T管引流管'
        }
        if (postPipesStr.indexOf('肝周引流管') !== -1) {
            $scope.postPipes[9] = '肝周引流管'
        }
        if (postPipesStr.indexOf('文氏孔引流管') !== -1) {
            $scope.postPipes[10] = '文氏孔引流管'
        }
        if (postPipesStr.indexOf('肾造瘘管') !== -1) {
            $scope.postPipes[11] = '肾造瘘管'
        }
        if (postPipesStr.indexOf('膀胱造瘘管') !== -1) {
            $scope.postPipes[12] = '膀胱造瘘管'
        }
        if (postPipesStr.indexOf('胃造瘘管') !== -1) {
            $scope.postPipes[13] = '胃造瘘管'
        }
        if (postPipesStr.indexOf('腹膜透析管') !== -1) {
            $scope.postPipes[14] = '腹膜透析管'
        }
        if (postPipesStr.indexOf('VSD引流管') !== -1) {
            $scope.postPipes[15] = 'VSD引流管'
        }
        if (postPipesStr.indexOf('脑室引流管') !== -1) {
            $scope.postPipes[16] = '脑室引流管'
        }
        if (postPipesStr.indexOf('T型管') !== -1) {
            $scope.postPipes[17] = 'T型管'
        }
        if (postPipesStr.indexOf('镇痛泵') !== -1) {
            $scope.postPipes[18] = '镇痛泵'
        }
        if (postPipesStr.indexOf('橡皮膜') !== -1) {
            $scope.postPipes[19] = '橡皮膜'
        }
    }

    $scope.save = function() {
        var postPipeStr = '';
        $scope.postPipes.forEach(function(item, index) {
            if (item) {
                postPipeStr += item + '、';
            }
        })
        postPipeStr = postPipeStr.substr(0, postPipeStr.length-1);
        postPipeStr+=";"+($scope.other||'');

        $uibModalInstance.close(postPipeStr);
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    };
}
