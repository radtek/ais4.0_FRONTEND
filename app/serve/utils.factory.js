module.exports = utils;

utils.$inject = ['$rootScope'];

function utils($rootScope) {
    return {
        // 判断数组内是否包含指定的元素
        contains: function(array, value, element) {
            var i = array.length;
            while (i--) {
                if (element) {// 根据对象数组的元素判断
                    if (array[i][element] === value) {
                        return true;
                    }
                } else {// 根据字符串数组判断
                    if (array[i] === value)
                        return true;
                }
            }
            return false;
        },
        // 根据数组内的元素去重
        arrayUnique: function(array, type) {
            var hash = {};
            return array.reduce(function (item, next) {
                hash[next[type]] ? '' : hash[next[type]] = true && item.push(next);
                return item;
            }, []);
        },
        // 签名过滤重复值(如巡回护士选了张三,洗手护士就不能再选张三)
        signFilter: function(resultList, existing) {
            var idsValue = '', userNameValue = '';
            var newItem = [];
            if (existing && existing.length > 0) {
                if (typeof(existing[0]) == 'string') { // 如['zhangs', 'lis']
                    for(var i=0; i<existing.length; i++) {
                        idsValue += existing[i] + ';';
                    }
                    for (var a=0; a<resultList.length; a++) {
                        if (idsValue && idsValue.indexOf(resultList[a].userName) < 0) {
                            newItem.push(resultList[a]);
                        }
                    }
                } else if (typeof(existing[0]) == 'object') { // 如[{id: 'zhangs', name: '张三'}, {id: 'lis', name: '李四'}]
                    for(var i=0; i<existing.length; i++) {
                        if (existing[i].id) idsValue += existing[i].id + ';';
                        if (existing[i].userName) userNameValue += existing[i].userName + ';';
                    }
                    idsValue = idsValue + userNameValue;
                    for (var a=0; a<resultList.length; a++) {
                        if (idsValue && idsValue.indexOf(resultList[a].userName) < 0) {
                            newItem.push(resultList[a]);
                        }
                    }
                }
            } else {
                newItem = resultList;
            }
            return newItem;
        },
        // 保存时组织复选框参数,格式为"0,1,1,0,1"
        moreOptParams: function(scope, moreOptions, entity) {
            for(var option of moreOptions) {
                for(var i=0; i<scope[option.code].length; i++) {
                    if (!scope[option.code][i])
                        scope[option.code][i] = 0;
                }
                entity[option.code] = scope[option.code].join();
            }
        },
        // 回显时给复选框赋值,格式为["0", "1", "1", "0", "1"]
        moreOptData: function(scope, moreOptions, entity) {
            for(var option of moreOptions) {
                scope[option.code] = entity[option.code].split(',');
            }
        }
    }
}