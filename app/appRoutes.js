var pages_dir = "app/pages";

app = angular.module('inventory', ['ngRoute'])
            .config(function($locationProvider, $routeProvider){
                $locationProvider.hashPrefix('');

                $routeProvider
                .when('/',{templateUrl: pages_dir+'/home/homeView.html', controller: 'homeCtrl'})
                .when('/bullet-hell',{templateUrl: pages_dir+'/bulletHell/bulletHellView.html', controller: 'bulletHellCtrl'})
                .otherwise({redirectTo:'/'});
            });
