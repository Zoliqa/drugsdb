
define([], 
	function () { 

		function mainRoutes($routeProvider, $q, userService) {
			$routeProvider
				.when("/home", {
					templateUrl: "/public/app/main/home.html",
					controller: "HomeController",
					controllerAs: "vm",
					resolve: {
						auth: function ($q, userService) {
							return userService.current.get().$promise.then(function (user) { 
								if (user._id)
									return true;
						
								return $q.reject("UNAUTHORIZED");
							});
						}
					}
				})
				.when("/newworkout", {
					templateUrl: "/public/app/main/new-workout.html",
					controller: "NewWorkoutController",
					controllerAs: "vm",
					resolve: {
						auth: function ($q, userService) {
							return userService.current.get().$promise.then(function (user) {
								if (user._id)
									return true;
						
								return $q.reject("UNAUTHORIZED");
							});
						}
					}
				})
				.when("/editworkout", {
					templateUrl: "/public/app/main/edit-workout.html",
					controller: "EditWorkoutController",
					controllerAs: "vm",
					resolve: {
						auth: function ($q, userService) {
							return userService.current.get().$promise.then(function (user) {
								if (user._id)
									return true;
						
								return $q.reject("UNAUTHORIZED");
							});
						}
					}
				})
				.otherwise({
					redirectTo: "/user/login"
				});
		}

		return mainRoutes;		
	}
);