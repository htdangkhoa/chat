app.controller("HomeCtrl", function($scope, $state) {
  console.log("HomeCtrl is working...");

  // if (!signed_in) {
  //   $state.go("sign_in");
  // }

  $scope.go = function() {
    $state.go("sign_in");
  }
});
