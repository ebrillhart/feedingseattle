var app = angular.module("FeedingSeattle", ['MealsServices', 'MealsCtrls', 'ngRoute']);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    //define routes
    $routeProvider.when('/', {
        templateUrl: "app/views/splash.html",
    }).when('/about', {
        templateUrl: "app/views/about.html"
    }).when("/map", {
        templateUrl: "app/views/map.html",
        controller: 'MapCtrl'
    }).when("/list", {
        templateUrl: "app/views/map.html",
        controller: 'ListCtrl'
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
}]).config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
}]).run(["$rootScope", "Auth", function($rootScope, Auth) {
    $rootScope.isLoggedIn = function() {
        return Auth.isLoggedIn.apply(Auth);
    }
}]);