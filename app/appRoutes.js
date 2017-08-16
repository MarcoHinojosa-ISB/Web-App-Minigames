var pages_dir = "app/pages";

var app = angular.module('inventory', ['ngRoute'])
            .config(function($locationProvider, $routeProvider){
                $locationProvider.hashPrefix('');

                $routeProvider
                .when('/',{templateUrl: pages_dir+'/home/homeView.html', controller: 'homeCtrl'})
                .when('/storage',{templateUrl: pages_dir+'/storage/storageView.html', controller: 'storageCtrl'})
                .otherwise({redirectTo:'/'});
            });