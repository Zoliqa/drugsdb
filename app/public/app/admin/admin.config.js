define([], function () {

	adminConfig.$inject = ["$routeProvider"];

	function adminConfig($routeProvider) {
		$routeProvider
			.when("/admin/import", {
				templateUrl: "/public/app/admin/import.html",
				controller: "ImportController",
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

	return adminConfig;
});
