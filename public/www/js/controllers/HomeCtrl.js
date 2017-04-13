app.controller("HomeCtrl", function(Restangular, $scope, $state, $socket, $timeout) {
  	$scope.listUser = [];

    checkPassport();

    // if (checkPassport()) {
    //   Restangular
    //   .one("/info")
    //   .get()
    //   .then(function(response) {
    //   console.log(response);
    //   }, function(error) {

    //   });
    // }

    // Restangular
    // .one("/info")
    // .get()
    // .then(function(response) {

    // }, function(error) {

    // })

  	$socket.on("get id", function(data) {
  		$scope.myID = data;
  		console.log($scope.myID);
  	})

  	$socket.on("get list", function(data) {
  		$scope.listUser = data;
  	});
  	$socket.on("disconnect", function(data) {
  		$scope.listUser = data;
  	});
  	$socket.on("chat", function(data) {
  		console.log(data);
  		$scope.listMessage = data;
  	});

	$scope.go = function() {
		$state.go("sign_in");
	};

	$scope.send = function(event, id, message) {
		if (event.keyCode === 13 && !event.shiftKey && message !== "" && message !== undefined){
			// console.log(id, message);

			$socket.emit("chat", {
				id: id,
				message: message
			});

			$timeout(function(){
				$("textarea").val("");
			}, 0);
		}		
	}
});
