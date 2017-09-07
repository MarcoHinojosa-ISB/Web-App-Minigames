//var pages_dir = ;

app = angular.module('inventory', ['ngRoute'])
      .config(function($locationProvider, $routeProvider){

      $routeProvider
      .when('/',{templateUrl: 'app/pages/home/homeView.html', controller: 'homeCtrl'})
      .when('/bullet-hell',{templateUrl: 'app/pages/bulletHell/bulletHellView.html', controller: 'bulletHellCtrl'})
      .otherwise({redirectTo:'/'});

      $locationProvider.html5Mode(true);
    });
