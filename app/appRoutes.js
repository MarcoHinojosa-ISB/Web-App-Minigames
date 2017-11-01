var app = angular.module('inventory', ['ngRoute']);

app.config(function($locationProvider, $routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'app/pages/home/homeView.html',
      controller: 'homeCtrl'
    })
    .when('/bullet-hell', {
      templateUrl: 'app/pages/bulletHell/bulletHellView.html',
      controller: 'bulletHellCtrl'
    })
    .when('/connect-4', {
      templateUrl: 'app/pages/connect4/connect4View.html',
      controller: 'connect4Ctrl'
    })
    .otherwise({
      redirectTo: '/'
    });
    
  $locationProvider.html5Mode(true);
});
