userDefinedDoc.$inject = ['$rootScope', '$scope', 'IHttp', 'uiGridConstants', '$timeout', '$uibModal'];

module.exports = userDefinedDoc;

function userDefinedDoc($rootScope, $scope, IHttp, uiGridConstants, $timeout, $uibModal) {

	$scope.docThemeId= $rootScope.$stateParams.docThemeId;

		   
	
}