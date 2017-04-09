var app = angular.module("starter", ["ui.router", "ismobile"]);
app.config(function($stateProvider, $urlRouterProvider, isMobileProvider) {

  // Resize logo on mobile.
  if (isMobileProvider.phone) {
    $(".logo").css("font-size", "7px");
  }

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
    // Go to home page.
    $urlRouterProvider.otherwise("/home");
  }else {
    // Go to sign in page.
    $urlRouterProvider.otherwise("/sign_in");
  }

});
