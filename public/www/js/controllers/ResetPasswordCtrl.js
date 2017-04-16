app.controller("ResetPasswordCtrl", function($scope, $state, $window, $stateParams, $timeout) {
	console.log($stateParams.id)
	angular.element(document).ready(function() {
		$timeout(function() {
			$("form").attr("action", "http://localhost:8080/password/reset?id=" + $stateParams.id);
		}, 0);
	})
});
