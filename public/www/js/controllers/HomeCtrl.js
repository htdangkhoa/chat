app.controller("HomeCtrl", function(Restangular, $scope, $state, $socket, $timeout, $stateParams, $filter, $q, $location, $notify) {
  	// $scope.listUser = [];
    // $scope.listMessage = [];
    // $scope.email = "";
    var standing = null;

    angular.element(document).ready(function() {
      checkPassport();

      $notify.register();

      Restangular
      .one("/v1/info?id=" + $stateParams.id)
      .get()
      .then(function(response) {
        $scope.myID = response.message._id;

        for (var i = 0; i < response.message.directs.length; i++) {
          if (!response.message.directs[i].visible) {
            response.message.directs.splice(i, 1);
          }
        }

        $scope.directs = response.message.directs;

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

      Restangular
      .one("/v1/get_user")
      .get()
      .then(function(response) {
        $scope.users = response.message;
        // console.log("Result: ", response.message);
        // console.table(response.message)
      })
      .catch(function(exeption) {
        console.log("Error: ", exeption)
      })

      $socket.on("messages", function(data) {
        console.log(data);
        $notify.push({
          title: data.email,
          body: data.content
        });
      })
    });

    // $socket.on("chat", function(data) {
    //   console.log(data)
    //   $scope.listMessage = data;
    // })

  	// $socket.on("disconnect", function(data) {
  	// 	$scope.listUser = data;
  	// });

	$scope.send = function(event, message) {
		if (event.keyCode === 13 && !event.shiftKey && message !== "" && message !== undefined && message !== null){
			// console.log(id, message);

			// $socket.emit("chat", {
			// 	email: $scope.email,
			// 	message: message
			// });

			// $timeout(function(){
			// 	$("textarea").val("");
			// }, 0);

      console.log(standing)
      $socket.emit("messages", {
        room: standing,
        email: $scope.email,
        text: message
      })
      $timeout(function(){
				// $("textarea").val("");
        $scope.message = null;
			}, 0);
		}		
	}

  $scope.createRoom = function(type_room) {
    switch (type_room) {
      case "channel": {
        break;
      }
      case "direct": {
        
        break;
      }
    }
  }

  var call = 1;
  $scope.search = function(q) {
    // $scope.search = $scope.users;
    // $scope.search = $filter("filter")($scope.search, {email: q.toLowerCase()});

    let canceler = $q.defer();
    canceler.resolve();
    $timeout(function(){
      Restangular
        .one("/get_user")
        .get()
        .then(function(response) {
          $scope.users = response.message;
          console.log("Result: ", response.message);
          console.table(response.message)
        })
        .catch(function(exeption) {
          console.log("Error: ", exeption)
        })
    }, 3000)
  }

  $scope.createDirectMessage = function(email) {
    console.log(email)
    var requestToServer = function() {
      Restangular
      .all("/v1/direct/create")
      .post({
        myEmail: $scope.email,
        otherEmail: email
      })
      .then(function(response) {
        for (var i = 0; i < response.message.length; i++) {
          if ($scope.myID === response.message[i]._id) {
            $scope.directs = response.message[i].directs;
          }
        }
        // console.log(response.message)
      })
      .catch(function(error) {
        console.log(error);
      });
    }

    if ($scope.directs.length == 0) {
      requestToServer();
    }else {
      $scope.check = false;

      for (var i = 0; i < $scope.directs.length; i++) {
        if ($scope.directs[i].arrEmail[1] == email && $scope.directs[i].visible) {
          $scope.check = true;
        }

        if (i === $scope.directs.length - 1) {
          if (!$scope.check) {
            requestToServer();
          }
        }
      }
    }
  }

  $scope.deleteDirectMessage = function(id) {
    console.log(id);
    Restangular
    .all("/v1/direct/remove")
    .post({
      myEmail: $scope.email,
      directID: id
    })
    .then(function(response) {
      $scope.directs = response.message.directs;
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    })

  }

  $scope.test = function(id, type) {
    console.log(id)
    // Restangular
    // .all("/test")
    // .post({
    //   directID: id,
    //   type: type
    // })
    // .then(function(response) {
    //   console.log(response);
    // })
    // .catch(function(error) {
    //   console.log(error);
    // })
    $socket.emit("listen", id);
    standing = id;
  }
});
