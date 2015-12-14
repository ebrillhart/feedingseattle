var app = angular.module("FeedingSeattle", ['MealsServices', 'MealsCtrls', 'ngRoute', 'ui.bootstrap']);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    //define routes
    $routeProvider.when('/', {
        templateUrl: "app/views/splash.html",
    }).when('/about', {
        templateUrl: "app/views/about.html"
    }).when("/list", {
        templateUrl: "app/views/list.html",
        controller: 'MealCtrl'
    }).when("/user/favorites", {
        templateUrl: "app/views/favorites.html",
        controller: 'UserCtrl'
    }).when('/login', {
        templateUrl: 'app/views/userLogin.html',
        controller: 'LoginCtrl'
    }).when('/signup', {
        templateUrl: 'app/views/userLogin.html',
        controller: 'SignupCtrl'
    }).otherwise({
        templateUrl: "app/views/404.html"
    });
    $locationProvider.html5Mode(true);
}]).run(["$rootScope", "Auth", function($rootScope, Auth) {
    $rootScope.isLoggedIn = function() {
        return Auth.isLoggedIn.apply(Auth);
    }
    $rootScope.$on('mapInitialized', function(evt,map) {
        $rootScope.mymap = map;
        $rootScope.$apply();
  });
}]);