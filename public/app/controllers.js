angular.module('MealsCtrls', ['MealsServices', 'ngMap', 'ui.bootstrap']).controller('MealCtrl', ['$scope', 'NgMap', 'Meal', function($scope, NgMap, Meal) {
    // *********************************************************
    // meal controller for meals list page and all functionality
    // *********************************************************
    // function to be used as callback - filters meals into meal arrays
    var mealType = function(arr) {
        arr.forEach(function(meal) {
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
    };
    // initializing map with NgMap
    NgMap.getMap().then(function(map) {});
    // setting up the meal controller - manages sorting and searching on the list page
    $scope.resultMeals = [];
    $scope.breakfast = [];
    $scope.lunch = [];
    $scope.dinner = [];
    $scope.otherMeals = [];
    Meal.query(function success(data) {
        $scope.resultMeals = data;
        // sorting the meals into separate display arrays depending on type of meal
        mealType($scope.resultMeals);
    }, function error(data) {
        console.log(data);
    });
    // show all meals filter
    $scope.showAll = function() {
        $scope.breakfast = [];
        $scope.lunch = [];
        $scope.dinner = [];
        $scope.otherMeals = [];
        mealType($scope.resultMeals);
    };
    // show meals open to all
    $scope.openMealFilter = function() {
        var filteredMeals = [];
        $scope.breakfast = [];
        $scope.lunch = [];
        $scope.dinner = [];
        $scope.otherMeals = [];
        $scope.resultMeals.forEach(function(meal) {
            if (meal.people_served.toLowerCase() == "open to all" || meal.people_served == "OPEN TO ALL /            Must be sober" || meal.people_served.toLowerCase() == "open to all ") {
                filteredMeals.push(meal)
            }
        })
        mealType(filteredMeals);
    };
    // show meals open to certain demographics
    $scope.restrictedMealFilter = function() {
        var filteredMeals = [];
        $scope.breakfast = [];
        $scope.lunch = [];
        $scope.dinner = [];
        $scope.otherMeals = [];
        $scope.resultMeals.forEach(function(meal) {
            if (meal.people_served.toLowerCase() != "open to all" && meal.people_served.toLowerCase() != "open to all ") {
                filteredMeals.push(meal)
            }
        })
        mealType(filteredMeals);
    };
}]).controller('NavCtrl', ['$scope', "Auth", function($scope, Auth) {
    // ***********************************************************************
    // manages functions on the navigation bar, including the log out function
    // *********************************************************************** 
    $scope.logout = function() {
        Auth.removeToken();
        location.reload("/");
    };
}]).controller("LoginCtrl", ["$scope", "$http", "$location", "Auth",
    // *************************************************************
    // controller handling when an existing user logs in to the site
    // *************************************************************
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
    // *********************************************************
    // controller handling when a new user signs up for the site
    // *********************************************************
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