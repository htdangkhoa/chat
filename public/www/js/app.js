var app = angular.module("starter", ["ui.router"]);
app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('home', {
    url: "/home",
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

  if (signed_in) {
    //go to home
    $urlRouterProvider.otherwise("/home");
  }else {
    //sign in
    $urlRouterProvider.otherwise("/sign_in");
  }

});
