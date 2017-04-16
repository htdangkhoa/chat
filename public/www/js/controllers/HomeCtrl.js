app.controller("HomeCtrl", function(Restangular, $scope, $state, $socket, $timeout, $stateParams) {
  	// $scope.listUser = [];
    // $scope.listMessage = [];
    // $scope.email = "";

    angular.element(document).ready(function() {
      checkPassport();

      Restangular
      .one("/info?id=" + $stateParams.id)
      .get()
      .then(function(response) {
        $scope.email = response.message.email;

        $socket.emit("Connected", $scope.email);

        $socket.on("ListEmail", function(data) {
          var temp = data;

          var uniqueUsers = [];
          $.each(data, function(i, el){
              if($.inArray(el, uniqueUsers) === -1) uniqueUsers.push(el);
          });

          console.log(uniqueUsers)

          $scope.listEmail = uniqueUsers;
        });
      })
      .then(function(error) {
        console.log(error);
      });
    });

    $socket.on("chat", function(data) {
      console.log(data)
      $scope.listMessage = data;
    })

  	// $socket.on("disconnect", function(data) {
  	// 	$scope.listUser = data;
  	// });
  	

	$scope.go = function() {
		$state.go("sign_in");
	};

	$scope.send = function(event, message) {
		if (event.keyCode === 13 && !event.shiftKey && message !== "" && message !== undefined){
			// console.log(id, message);

			$socket.emit("chat", {
				email: $scope.email,
				message: message
			});

			$timeout(function(){
				$("textarea").val("");
			}, 0);
		}		
	}

  // $scope.logout = function() {
  //   Restangular
  //   .one("/authentication/signout")
  //   .post()
  //   .then(function(response) {
  //     $state.go("sign_in")
  //   }, function(error) {

  //   })
  // }
});
