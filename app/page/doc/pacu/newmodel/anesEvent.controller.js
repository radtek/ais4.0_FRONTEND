anesEvent.$inject = ['$scope', 'IHttp', '$uibModalInstance', '$q', '$timeout', 'items', '$filter', 'toastr', 'auth', 'anesRecordInter'];

module.exports = anesEvent;

function anesEvent($scope, IHttp, $uibModalInstance, $q, $timeout, items, $filter, toastr, auth, anesRecordInter) {
    var promise,
        returnParams = {},
        url,
        param,
        primaryId = '';
    $scope.loginUser = auth.loginUser();
    // $scope.eventList =items.list;
    initParam();
    $scope.saved = true;
    $scope.btnActive = false;
    $scope.getAnaesEventList = function(query) {
        var deferred = $q.defer();
        queryAnaesEventList(query, function(list) {
            $timeout(function() {
                deferred.resolve(list);
            }, 500);
        });
        return deferred.promise;
    }

    function queryAnaesEventList(query, callback) {
        IHttp.post("basedata/selectALlAnaesEvent", { filters: [{ field: "pinyin", value: query }, { field: "enable", value: "1" }], docType: 2 }).then(function(rs) {
            if (rs.data.resultCode !== '1') return;
            rs.data.resultList = $filter('filter')(rs.data.resultList, function(item) {
                return item.name != '入PACU时间'&&item.name != '入室' &&item.name != '麻醉结束时间' && item.name != '麻醉开始' && item.name != '手术开始' && item.name != '手术结束' && item.name != '出室时间' && item.name != '麻醉结束'

            });
            callback(rs.data.resultList);
        });
    }

    function initParam() {
        $scope.param = {
            anaEventId: '',
            docType: 2,
            docId: items.docId,
            code: '',
            occurTime_: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm')
        }
        primaryId = '';
        $scope.anaesEvent = {
            id: '',
            eventValue: '',
            name: '',
            pinyin: '',
            enable: '',
            beid: ''
        }
    }
    anesRecordInter.searchAllEventListPlus("", { docId: items.docId, medEventNum: 0, infusionNum: 0, egressNum: 0, docType: 2 }).then(function(rs) {
        $scope.eventList = rs.data.eventList;
    })
    url = 'basedata/selectALlAnaesEvent';
    param = { filters: [{ field: "enable", value: "1" }], docType: 2 }

    IHttp.post(url, param).then(function(rs) {//点击编辑用
        if (rs.data.resultCode != '1') return;
        $scope.evList = rs.data.resultList;
    });

    $scope.save = function() {
        
        $scope.saved = false;
        $scope.btnActive = true;
        var addOutTime = false,
            inRoomTime = 0,
            outRoomTime = 0,
            inputTime = new Date($filter('date')(new Date($scope.param.occurTime_), 'yyyy-MM-dd HH:mm')).getTime(),
            startOper = false,
            zgD = false; //置管    
        $scope.param.anaEventId = primaryId;
        $scope.param.code = $scope.anaesEvent.eventValue;
        if ($scope.param.code == 9) { //处室
        } else {
            $scope.param.occurTime = new Date($scope.param.occurTime_).getTime();
            var nowTime = new Date().getTime();
            if (promise) {
                $timeout.cancel(promise);
            }
            promise = $timeout(function() {
                IHttp.post('operation/saveAnaeseventPacu', $scope.param).then(function(rs) {
                    $scope.btnActive = false;
                    $scope.saved = true;
                    if (rs.data.resultCode != '1') return;
                     $scope.eventList = rs.data.resultList;
                     var temp=[];
                    for (var item of rs.data.resultList) {
                        if (item.codeName != '入室' &&item.codeName != '麻醉结束时间' && item.codeName != '麻醉开始' && item.codeName != '手术开始' && item.codeName != '手术结束' && item.codeName != '出室时间' && item.codeName != '麻醉结束') {
                            temp.push(item);
                        }
                    }
                    returnParams.list=temp;
                    initParam();
                    $scope.cancel = function() {
                        $uibModalInstance.close(returnParams);
                    }
                });
            }, 500);
        }
    }

    $scope.edit = function(row) {
        for (var item of $scope.evList) {
            if (item.eventValue == row.code) {
                $scope.anaesEvent = item;
            }
        }
        primaryId = row.anaEventId;
        $scope.saved = true;
        row.code = row.code + '';
        row.occurTime_ = $filter('date')(row.occurTime, 'yyyy-MM-dd HH:mm');
        $scope.param = angular.copy(row);
    }

    $scope.add = initParam;

    $scope.delete = function(row) {
        if (row.codeName=='入PACU时间') {
            toastr.error((row.codeName=='入PACU时间' ? '入PACU时间' : '出室') + '事件不能删除');
        } else {
            IHttp.post('operation/deleteByCodeAndDocId', { anaEventId: row.anaEventId, code: row.code, docId: items.docId ,docType:2}).then(function(rs) {
                if (rs.data.resultCode != '1') return;
                     $scope.eventList = rs.data.resultList;
                     var temp=[];
                    for (var item of rs.data.resultList) {
                        if (item.codeName != '入室' &&item.codeName != '麻醉结束时间' && item.codeName != '麻醉开始' && item.codeName != '手术开始' && item.codeName != '手术结束' && item.codeName != '出室时间' && item.codeName != '麻醉结束') {
                            temp.push(item);
                        }
                    }
                    returnParams.list=temp;
                initParam();
                $scope.cancel = function() {
                    $uibModalInstance.close(returnParams);
                }
            });
        }
    }

    $scope.cancel = function() {
        $uibModalInstance.dismiss();
    }
}