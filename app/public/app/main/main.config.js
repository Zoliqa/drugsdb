define([], function () {

	mainConfig.$inject = ["$routeProvider"];

	function mainConfig($routeProvider) {
		$routeProvider
			.when("/search", {
				templateUrl: "/public/app/main/search.html",
				controller: "SearchController",
				controllerAs: "vm",
				resolve: {
					auth: function ($q, UNAUTHORIZED, userService) {
						return userService.current.get().$promise.then(function (user) {
							if (user._id)
								return true;

							return $q.reject(UNAUTHORIZED);
						});
					}
				},
				reloadOnSearch: false
			})
			.when("/history", {
				templateUrl: "/public/app/main/history.html",
				controller: "HistoryController",
				controllerAs: "vm",
				resolve: {
					auth: function ($q, UNAUTHORIZED, userService) {
						return userService.current.get().$promise.then(function (user) {
							if (user._id)
								return true;

							return $q.reject(UNAUTHORIZED);
						});
					}
				}
			})
			.otherwise({
				redirectTo: "/user/login"
			});
	}

	return mainConfig;
});
