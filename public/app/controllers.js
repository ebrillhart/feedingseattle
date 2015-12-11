angular.module('MealsCtrls', ['MealsServices', 'ngMap']).controller('MealCtrl', ['$scope', 'Meal', function($scope, Meal) {
    // setting up the meal controller - manages sorting and searching on the list page
    $scope.meals = [];
    $scope.resultMeals = [];
    $scope.breakfast = [];
    $scope.lunch = [];
    $scope.dinner = [];
    $scope.otherMeals = [];
    Meal.query(function success(data) {
        $scope.meals = data;
        $scope.resultMeals = data;
        // sorting the meals into separate display arrays depending on type of meal
        $scope.meals.forEach(function(meal) {
            if (meal.meal_served == "Breakfast" || meal.name_of_program == "Chief Seattle Club") {
                $scope.breakfast.push(meal);
            } else if (meal.meal_served == "Lunch") {
                $scope.lunch.push(meal);
            } else if (meal.meal_served == "Dinner") {
                $scope.dinner.push(meal);
            } else {
                $scope.otherMeals.push(meal);
            }
        });
    }, function error(data) {
        console.log(data);
    });
    // allowing users to filter meals based on a number of criteria
    $scope.mealSearch = function(search) {
        var filteredMeals = [];
        $scope.meals.forEach(function(meal) {
            if (meal.manufacturer.toLowerCase().indexOf(search) > -1) {
                filteredMeals.push(meal)
            }
        })
        $scope.resultMeals = filteredMeals;
    }
}]).controller("MapCtrl", ["$scope", "$routeParams", 'NgMap', "Meal", function($scope, $routeParams, NgMap, Meal) {
    NgMap.getMap().then(function(map) {
        // manages displaying locations and searching on the map page
        $scope.meals = [];
        $scope.resultMeals = [];
        Meal.query(function success(data) {
            $scope.meals = data;
            $scope.resultMeals = data;
        }, function error(data) {
            console.log(data);
        });
    });
}]).controller("MealShowCtrl", ["$scope", "$routeParams", "Meal", function($scope, $routeParams, Meal) {
    Meal.get({
        id: $routeParams.id
    }, function success(data) {
        $scope.meal = data;
    }, function error(data) {
        console.log(data);
    });
}]).controller('NavCtrl', ['$scope', "Auth", function($scope, Auth) {
    // manages functions on the navigation bar, including the log out function 
    $scope.logout = function() {
        Auth.removeToken();
        location.reload("/");
    };
}]).controller("LoginCtrl", ["$scope", "$http", "$location", "Auth",
    // controller handling when an existing user logs in to the site
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
    // controller handling when a new user signs up for the site
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