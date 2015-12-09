var TOKEN_STORAGE = "secretrecipes-token";

angular.module('MealsServices', ['ngResource']).factory('Meal', ['$resource', function($resource) {
    return $resource('https://data.seattle.gov/resource/47rs-c243.json');
}])
// .factory("User", ["$resource", function($resource) {
// 	return $resource('https://localhost3000/api/users/:id');
// }])
.factory("Auth", ["$window", function($window) {
	return {
		saveToken: function(token) {
			$window.localStorage[TOKEN_STORAGE] = token;
		}, getToken: function() {
			return $window.localStorage[TOKEN_STORAGE];
		}, removeToken: function() {
			$window.localStorage.removeItem(TOKEN_STORAGE);
		},
		isLoggedIn: function() {
			var token = this.getToken();
			return token ? true : false;
		}
	}
}])
.factory("AuthInterceptor", ["Auth", function(Auth){
	return {
		request: function(config) {
			var token = Auth.getToken();
			if (token) {
				config.headers.Authorization = "Bearer " + token;
			}
			return config;
		}
	};
}]);