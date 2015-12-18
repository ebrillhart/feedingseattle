angular.module('MealsCtrls', ['MealsServices', 'ngMap', 'ui.bootstrap']).controller('MealCtrl', ['$scope', 'NgMap', 'Meal', 'User', 'Favorites', "$http", 'Auth', function($scope, NgMap, Meal, User, Favorites, $http, Auth) {
    // ***********************************************************
    // meal controller for meals list page and user favorites page
    // ***********************************************************
    // declaring auth and user
    $scope.auth = Auth;
    $scope.user = $scope.auth.currentUser();
    // initializing map with NgMap
    NgMap.getMap().then(function(map) {
        setTimeout(google.maps.event.trigger, 500, map, 'resize');
    });
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
        });
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
        });
        mealType(filteredMeals);
    };
    // user get for favorites functions and favorites page
    if ($scope.auth.currentUser()) {
        User.get({
            id: $scope.auth.currentUser().id
        }, function success(data) {
            $scope.user = data;
            console.log("This user is " + $scope.user);
            // favorite add function
            $scope.addToFavorites = function(index, whichMeal) {
                var meal = $scope[whichMeal][index];
                var favoritesObj = {
                    program: meal.name_of_program,
                    location: meal.location,
                    time: meal.day_time,
                    meal: meal.meal_served,
                    served: meal.people_served
                };
                console.log(favoritesObj);
                Favorites.saveFavorites({
                    id: $scope.user.id
                }, favoritesObj, function success(data) {
                    console.log(data);
                    $scope.user.favorites.push(favoritesObj);
                }, function error(data) {
                    console.log(data);
                });
                console.log($scope.user);
            };
            // favorite delete function
            $scope.removeFromFavorites = function(index) {
                var indexA = index;
                Favorites.removeFavorites({
                    idx: indexA,
                    id: $scope.user.id
                }, indexA, function success(data) {
                    console.log(data);
                    $scope.user.favorites.splice(indexA, 1);
                }, function error(data) {
                    console.log(data);
                });
            };
        }, function error(data) {
            console.log(data);
        });
    }
    // checks to see if a meal has been favorited for show/hide functions
    $scope.isAFavorite = function(index, whichMeal) {
        if ($scope.user) {
            var meal = $scope[whichMeal][index];
            for (var i = 0; i < $scope.user.favorites.length; i++) {
                if ($scope.user.favorites[i].program == meal.name_of_program && $scope.user.favorites[i].time == meal.day_time) {
                    return true;
                }
            }
            return false;
        } else {
            return false;
        }
    };
}]).controller('NavCtrl', ['$scope', "Auth", "$location", function($scope, Auth, $location) {
    // ***********************************************************************
    // manages functions on the navigation bar, including the log out function
    // *********************************************************************** 
    $scope.auth = Auth;
    $scope.logout = function() {
        Auth.removeToken();
        $scope.user = {};
        $location.path("/");
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