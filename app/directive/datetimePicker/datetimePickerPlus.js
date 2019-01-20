function datetimePickerP() {
    return {
            restrict: "EA",
            require: "ngModel",
            scope: {
                model: '=ngModel',
                hChange: '&'
            },
            controller: ['$scope', '$filter', function($scope, $filter) {
                $scope.timeStr = function(type) {
                    return $filter('date')($scope.model, type == "date" ? 'yyyy-MM-dd' : (type == "time" ? 'HH:mm' : 'yyyy-MM-dd HH:mm'));
                }
                $scope.getDate = function() {
                    return $filter('date')(new Date(), 'yyyy-MM-dd');
                }
            }],
            link: function(scope, element, attrs, ctrl, $filter) {
                $.datetimepicker.setLocale('ch');
                ctrl.$render = function() {
                    if (typeof scope.model !== undefined) {
                        var type = attrs.hType;
                        if(!type){
                           if(attrs.timepicker == "false"){
                            type="date";
                           }else if(attrs.datepicker == "false"){
                            type="time";
                           }
                        }
                        $(element).val(scope.timeStr(type));
                    }
                };
                var defaultVal = !!scope.model ? scope.timeStr(attrs.hType) : "";
                var d = new Date(), index = 0;
                var backVal = $(element).val().trim().replace(/\-/g, '/');
                var maxday = (d.getFullYear() + 100) + "/" + (d.getMonth() + 1) + "/" + d.getDate();
                var minday = (d.getFullYear() - 100) + "/1/1";
                var step = 1;
                $(element).datetimepicker({
                    format: attrs.hType == "date" ? 'Y-m-d' : (attrs.hType == "time" ? 'H:i' :(attrs.format || 'Y-m-d H:i')),
                    timepicker: attrs.hType == "date" ? false : (attrs.timepicker == "false" ? false : true),
                    datepicker: attrs.hType == "time" ? false : (attrs.datepicker == "false" ? false : true),
                    defaultDate: attrs.hType != "time" ? defaultVal : '',
                    defaultTime: attrs.hType != "date" ? defaultVal : '',
                    minDate: !!attrs.min ? attrs.min.replace(/\-/g, '/') : minday,
                    maxDate: !!attrs.max ? attrs.max.replace(/\-/g, '/') : maxday,
                    step: !!attrs.step ? parseInt(attrs.step) : step,
                    lang: 'ch',
                    allowBlank: true,
                    lazyInit: true,
                    scrollMonth:false,
                    scrollTime:false,
                    scrollInput:false,
                    onClose: function() {
                        scope.$parent.$apply(function() {
                            index++;
                            var val = $(element).val().trim();//.replace(/\-/g, '/');
                            if (val) {
                                if(attrs.datepicker == "false"){
                                    ctrl.$setViewValue(val);
                                }else{
                                    ctrl.$setViewValue(attrs.hType == "time" ? (scope.getDate() + ' ' + val) : val);
                                }
                            } else {
                                ctrl.$setViewValue(null);
                                setTimeout(function() {$(element).val('')});
                            }
                            if (index === 1 && backVal !== val && attrs.hChange) {
                                scope.hChange(); 
                            }
                        });
                    }
                });
            }
        }
}

module.exports = datetimePickerP;