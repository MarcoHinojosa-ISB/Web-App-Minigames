angular.module('inventory', ['ngRoute'])
            .config(['$routeProvider', function($routeProvider){
                $routeProvider
                .when('/',{templateUrl: '/views/pages/dashboard.html', controller: 'dashCtrl'})
                .when('/storage',{templateUrl: '/views/pages/storage.html', controller: 'storageCtrl'})
                .otherwise({redirectTo:'/'});
            }]);