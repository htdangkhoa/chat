app.controller("ResetPasswordCtrl", function($scope, $state, $window, $stateParams, $timeout) {
	console.log($stateParams.id)

	// $scope.id = $stateParams.id;

	angular.element(document).ready(function() {
		$timeout(function() {
			$("form").attr("action", "/password/reset?id=" + $stateParams.id);
		}, 0);
	})
});
