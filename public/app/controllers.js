angular.module('MealsCtrls', ['MealsServices']).controller('MealCtrl', ['$scope', 'Meal', function($scope, Meal) {
    $scope.meals = [];
    Meal.query(function success(data) {
        $scope.meals = data;
        $scope.resultMeals = data;
    }, function error(data) {
        console.log(data);
    });
    $scope.mealSearch = function(search) {
        var filteredMeals = [];
        $scope.meals.forEach(function(meal) {
            if (meal.manufacturer.toLowerCase().indexOf(search) > -1) {
                filteredMeals.push(meal)
            }
        })
        $scope.resultMeals = filteredMeals;
    }
}]).controller("MealShowCtrl", ["$scope", "$routeParams", "Meal", function($scope, $routeParams, Meal) {
    Meal.get({
        id: $routeParams.id
    }, function success(data) {
        $scope.meal = data;
    }, function error(data) {
        console.log(data);
    });
}]).controller('NavCtrl', ['$scope', "Auth", function($scope, Auth) {
    $scope.logout = function() {
        Auth.removeToken();
        location.reload("/");
    };
}]).controller("LoginCtrl", ["$scope", "$http", "$location", "Auth",
    function($scope, $http, $location, Auth) {
        $scope.user = {
            email: "",
            password: "",
        };
        $scope.actionName = "Login";
        $scope.userAction = function() {
            $http.post("/api/auth", $scope.user).then(function(res) {
                Auth.saveToken(res.data.token);
                $location.path("/");
            }, function(res) {
                console.log(res.data);
            });
        };
    }
]).controller("SignupCtrl", ["$scope", "$http", "$location", "Auth",
    function($scope, $http, $location, Auth) {
        $scope.user = {
            email: "",
            password: "",
        };
        $scope.actionName = "Signup";
        $scope.userAction = function() {
            $http.post("/api/users", $scope.user).then(function(res) {
                $http.post("/api/auth", $scope.user).then(function(res) {
                    Auth.saveToken(res.data.token);
                    $location.path("/");
                }, function(res) {
                    console.log(res.data);
                });
            }, function(res) {
                console.log(res.data);
            });
        }
    }
]);