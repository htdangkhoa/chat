var host = "127.0.0.1:8080";
var hostUrl = "http://" + host;
var audio = new Audio("../res/sound.mp3");

var app = angular.module("starter", ["restangular", "ui.router", "ismobile"]);
app
.config(function(RestangularProvider, $stateProvider, $urlRouterProvider, isMobileProvider) {

  // Resize logo on mobile.
  if (isMobileProvider.phone) {
    $(".logo").css("font-size", "7px");
  }

  $stateProvider
  .state('home', {
    url: "/home/:id",
    templateUrl: "../views/home.html",
    controller: "HomeCtrl"
  })
  .state('sign_in', {
    url: "/sign_in",
    templateUrl: "../views/sign_in.html",
    controller: "SignCtrl"
  })
  .state('sign_up', {
    url: "/sign_up",
    templateUrl: "../views/sign_up.html",
    controller: "SignCtrl"
  })
  .state('forgot_password', {
    url: "/forgot_password",
    templateUrl: "../views/forgot_password.html"
  })
  .state('reset', {
    url: "/password/reset/:id",
    templateUrl: "../views/reset_password.html",
    controller: "ResetPasswordCtrl"
  })

  $urlRouterProvider.otherwise("/sign_in");

  RestangularProvider.setBaseUrl(hostUrl);
  RestangularProvider.setDefaultHeaders({
    "Access-Control-Allow-Origin": host,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Accept, X-Requested-With",
    "Access-Control-Allow-Credentials": "true"
  });

})
.factory("$isOnline", function($window, $rootScope) {
  var statusConnection = {};

  statusConnection.status = $window.navigator.onLine;

  statusConnection.check = function() {
    return statusConnection.status;
  }

  $window.addEventListener("offline", function() {
    statusConnection.status = false;
    $rootScope.$digest();
  }, true);
  $window.addEventListener("online", function() {
    statusConnection.status = true;
    $rootScope.$digest();
  }, true);

  return statusConnection;
})
.factory("$socket", function($rootScope) {
  var socket = io.connect(hostUrl);

  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
})
.factory("$notify", function($rootScope) {
  return {
    register: function() {
      Notification.requestPermission();
    },
    push: function(data) {
      Notification.requestPermission(function(permission) {
        if (permission === "granted") {
          var noti = new Notification(data.title, {
            body: data.body
          });
          setTimeout(function() {
            noti.close();
          }, 5000)
          audio.play();
        }
      })
    }
  }
});
