app.controller("HomeCtrl", function($scope, $state) {
  console.log("HomeCtrl is working...");

  $scope.go = function() {
    $state.go("sign_in");
  }
});
