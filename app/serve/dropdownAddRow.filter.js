/*
 * 下拉选择项在渲染时，结构重构
 */
module.exports = dropdownAddRowFilter;

dropdownAddRowFilter.$inject = ['$sce'];

function dropdownAddRowFilter($sce) {
    return function(label, query, item, options, element) {
    	if(item && item.item && (item.item.spec || item.item.firm)){
    		item=item.item;
    	}       
        var html = '<div>' + label + '</div><small style="margin-left: 15px; margin-right: 15px;">'+ item.spec +'</small><small>'+ item.firm +'</small>';
        return $sce.trustAsHtml(html);
    };
}
