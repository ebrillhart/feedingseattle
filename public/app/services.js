var TOKEN_STORAGE = "secretrecipes-token";

angular.module('MealsServices', ['ngResource', 'ngMap']).factory('Meal', ['$resource', function($resource) {
    return $resource('https://data.seattle.gov/resource/47rs-c243.json');
}])
.factory('Favorites', ['$resource', "$routeParams", 
	function($resource, $routeParams) {
	    return $resource('/api/users/:id/favorites/:idx', {}, {
	    	saveFavorites: {method: 'POST'},
	    	removeFavorites: {method: 'DELETE'}
    });
}])
.factory("User", ["$resource", "Auth", function($resource, Auth) {
	var token = Auth.getToken();
	return $resource('/api/users/:id', {}, {
		headers: {'Authorization' : 'Bearer ' + token}
	});
}])
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
		},
		currentUser: function() {
	      if (this.isLoggedIn()) {
	        var token = this.getToken();
	        try {
	          var payload = JSON.parse($window.atob(token.split('.')[1]));
	          console.log(payload);
	          	return payload;
	        } catch(err) {
	          	return false;
	        }
	      }
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